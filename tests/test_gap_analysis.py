"""
tests/test_gap_analysis.py
===========================
Tests for src/gap_analysis.py — AIS gap detection and classification.
"""

from __future__ import annotations

from pathlib import Path

from typing import cast
import pandas as pd
import pytest

from gap_analysis import GapAnalyzer
from trajectory import TrajectoryReconstructor
from models import CleaningConfig, GapClass


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_analyzer(**kwargs) -> GapAnalyzer:
    config = CleaningConfig(**kwargs)
    return GapAnalyzer(config)


def reconstruct(df: pd.DataFrame, normal_gap_max_minutes: float = 15.0) -> pd.DataFrame:
    config = CleaningConfig(normal_gap_max_minutes=normal_gap_max_minutes)
    rec = TrajectoryReconstructor(config)
    return rec.reconstruct(df.sort_values(["MMSI", "BaseDateTime"]).reset_index(drop=True))


# ---------------------------------------------------------------------------
# 1. Gap detection
# ---------------------------------------------------------------------------

class TestGapDetection:
    def test_no_gaps_detected_when_none_present(self, minimal_df):
        """VESSEL_A (10-min gaps) with threshold=15 → 0 gaps for VESSEL_A."""
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        # Only VESSEL_A (no gap); VESSEL_B has 90-min gap
        vessel_a_traj = cast(pd.DataFrame, traj[traj["MMSI"] == "123456789"]).copy()
        # Build a standalone trajectory_df with only VESSEL_A
        gap_df = analyzer.detect_gaps(vessel_a_traj)
        assert len(gap_df) == 0

    def test_gap_detected_for_large_interval(self, minimal_df):
        """VESSEL_B has 90-min gap → 1 gap detected."""
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        vessel_b_traj = cast(pd.DataFrame, traj[traj["MMSI"] == "987654321"]).copy()
        gap_df = analyzer.detect_gaps(vessel_b_traj)
        assert len(gap_df) == 1

    def test_gap_duration_correct(self, minimal_df):
        """VESSEL_B: 10:00 to 11:30 = 90 minutes."""
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        b_gaps = gap_df[gap_df["mmsi"] == "987654321"]
        assert len(b_gaps) == 1
        assert abs(b_gaps.iloc[0]["gap_duration_minutes"] - 90.0) < 0.1

    def test_gap_fields_populated(self, large_gap_df):
        """Gap record must have last_lat, last_lon, next_lat, next_lon populated."""
        traj = reconstruct(large_gap_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        assert len(gap_df) == 1
        row = gap_df.iloc[0]
        assert row["last_lat"] is not None
        assert row["last_lon"] is not None
        assert row["next_lat"] is not None
        assert row["next_lon"] is not None
        assert row["last_sog"] is not None
        assert row["last_cog"] is not None

    def test_empty_dataframe_returns_empty(self):
        analyzer = make_analyzer()
        result = analyzer.detect_gaps(pd.DataFrame())
        assert result.empty


# ---------------------------------------------------------------------------
# 2. Gap duration in gap record
# ---------------------------------------------------------------------------

class TestGapDuration:
    def test_gap_duration_hours_consistent(self, large_gap_df):
        """gap_duration_hours = gap_duration_minutes / 60."""
        traj = reconstruct(large_gap_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        row = gap_df.iloc[0]
        expected_hours = row["gap_duration_minutes"] / 60.0
        assert abs(row["gap_duration_hours"] - expected_hours) < 0.001


# ---------------------------------------------------------------------------
# 3. Gap classification
# ---------------------------------------------------------------------------

class TestGapClassification:
    def test_normal_gap(self):
        analyzer = make_analyzer(normal_gap_max_minutes=15.0)
        assert analyzer.classify_gap(10.0) == GapClass.NORMAL

    def test_exactly_at_normal_boundary(self):
        analyzer = make_analyzer(normal_gap_max_minutes=15.0)
        assert analyzer.classify_gap(15.0) == GapClass.NORMAL

    def test_short_gap(self):
        analyzer = make_analyzer(
            normal_gap_max_minutes=15.0,
            short_gap_max_minutes=60.0,
        )
        assert analyzer.classify_gap(30.0) == GapClass.SHORT_GAP

    def test_exactly_at_short_boundary(self):
        analyzer = make_analyzer(
            normal_gap_max_minutes=15.0,
            short_gap_max_minutes=60.0,
        )
        assert analyzer.classify_gap(60.0) == GapClass.SHORT_GAP

    def test_significant_gap(self):
        analyzer = make_analyzer(
            normal_gap_max_minutes=15.0,
            short_gap_max_minutes=60.0,
            significant_gap_max_minutes=360.0,
        )
        assert analyzer.classify_gap(180.0) == GapClass.SIGNIFICANT_GAP

    def test_exactly_at_significant_boundary(self):
        analyzer = make_analyzer(
            normal_gap_max_minutes=15.0,
            short_gap_max_minutes=60.0,
            significant_gap_max_minutes=360.0,
        )
        assert analyzer.classify_gap(360.0) == GapClass.SIGNIFICANT_GAP

    def test_long_gap(self):
        analyzer = make_analyzer(significant_gap_max_minutes=360.0)
        assert analyzer.classify_gap(1440.0) == GapClass.LONG_GAP  # 24 hours

    def test_classification_uses_config(self):
        """Custom config: normal up to 30 min."""
        analyzer = make_analyzer(
            normal_gap_max_minutes=30.0,
            short_gap_max_minutes=120.0,
            significant_gap_max_minutes=720.0,
        )
        assert analyzer.classify_gap(25.0) == GapClass.NORMAL
        assert analyzer.classify_gap(90.0) == GapClass.SHORT_GAP
        assert analyzer.classify_gap(500.0) == GapClass.SIGNIFICANT_GAP
        assert analyzer.classify_gap(800.0) == GapClass.LONG_GAP

    def test_vessel_b_90min_classified_as_significant_gap(self, minimal_df):
        """VESSEL_B 90-min gap: > 15 min, > 60 min, <= 360 min → SIGNIFICANT_GAP."""
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        b_gaps = gap_df[gap_df["mmsi"] == "987654321"]
        assert b_gaps.iloc[0]["gap_class"] == GapClass.SIGNIFICANT_GAP.value

    def test_large_gap_classified_significant(self, large_gap_df):
        """large_gap_df vessel has 120-min gap → SIGNIFICANT_GAP."""
        traj = reconstruct(large_gap_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        assert gap_df.iloc[0]["gap_class"] == GapClass.SIGNIFICANT_GAP.value


# ---------------------------------------------------------------------------
# 4. Gap summary
# ---------------------------------------------------------------------------

class TestGapSummary:
    def test_summary_keys(self, minimal_df):
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        summary = analyzer.gap_summary(gap_df)
        for key in ["total_gaps", "gap_class_counts", "vessels_with_gaps",
                    "max_gap_minutes", "mean_gap_minutes", "median_gap_minutes"]:
            assert key in summary, f"Missing summary key: {key}"

    def test_summary_total_matches_gap_df_length(self, minimal_df):
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        summary = analyzer.gap_summary(gap_df)
        assert summary["total_gaps"] == len(gap_df)

    def test_empty_gap_df_summary(self):
        analyzer = make_analyzer()
        summary = analyzer.gap_summary(pd.DataFrame())
        assert summary["total_gaps"] == 0
        for cls in GapClass:
            assert cls.value in summary["gap_class_counts"]

    def test_gap_class_counts_all_classes_present(self, minimal_df):
        traj = reconstruct(minimal_df, normal_gap_max_minutes=15.0)
        analyzer = make_analyzer()
        gap_df = analyzer.detect_gaps(traj)
        summary = analyzer.gap_summary(gap_df)
        for cls in GapClass:
            assert cls.value in summary["gap_class_counts"]
