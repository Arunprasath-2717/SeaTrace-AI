"""
tests/test_trajectory.py
=========================
Tests for src/trajectory.py — vessel trajectory reconstruction.
"""

from __future__ import annotations

from pathlib import Path
from typing import cast
import pandas as pd
import pytest

from trajectory import TrajectoryReconstructor
from models import CleaningConfig


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_reconstructor(normal_gap_max_minutes: float = 15.0) -> TrajectoryReconstructor:
    config = CleaningConfig(normal_gap_max_minutes=normal_gap_max_minutes)
    return TrajectoryReconstructor(config)


def clean_minimal(minimal_df: pd.DataFrame) -> pd.DataFrame:
    """Return minimal_df already sorted, suitable for trajectory tests."""
    return minimal_df.sort_values(["MMSI", "BaseDateTime"]).reset_index(drop=True)


# ---------------------------------------------------------------------------
# 1. Sort order
# ---------------------------------------------------------------------------

class TestSortOrder:
    def test_records_sorted_within_mmsi(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        for mmsi, grp in traj.groupby("MMSI"):
            grp_df = cast(pd.DataFrame, grp)
            times = grp_df["BaseDateTime"].tolist()
            assert times == sorted(times), f"MMSI {mmsi} not in chronological order"


# ---------------------------------------------------------------------------
# 2. time_delta_seconds correctness
# ---------------------------------------------------------------------------

class TestTimeDelta:
    def test_first_record_of_vessel_is_nan(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        for mmsi, grp in traj.groupby("MMSI"):
            grp_df = cast(pd.DataFrame, grp).reset_index(drop=True)
            assert pd.isna(grp_df.loc[0, "time_delta_seconds"]), \
                f"First record of {mmsi} should have NaN time_delta"

    def test_delta_matches_expected_seconds(self, minimal_df):
        """VESSEL_A records are 10 minutes apart → 600 seconds."""
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_a = cast(pd.DataFrame, traj[traj["MMSI"] == "123456789"]).reset_index(drop=True)
        # pyrefly: ignore [unsupported-operation]
        assert abs(vessel_a.loc[1, "time_delta_seconds"] - 600.0) < 1.0

    def test_delta_does_not_bleed_across_vessels(self, minimal_df):
        """The first record of VESSEL_B must not inherit the last delta of VESSEL_A."""
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_b_first = cast(pd.DataFrame, traj[traj["MMSI"] == "987654321"]).iloc[0]
        assert pd.isna(vessel_b_first["time_delta_seconds"])


# ---------------------------------------------------------------------------
# 3. gap_flag trigger
# ---------------------------------------------------------------------------

class TestGapFlag:
    def test_small_gap_not_flagged(self, minimal_df):
        """VESSEL_A gaps are 10 min; threshold is 15 min → should not be flagged."""
        rec = make_reconstructor(normal_gap_max_minutes=15.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_a = cast(pd.DataFrame, traj[traj["MMSI"] == "123456789"])
        assert vessel_a["gap_flag"].sum() == 0

    def test_large_gap_flagged(self, minimal_df):
        """VESSEL_B has a 90-min gap; threshold 15 → should be flagged."""
        rec = make_reconstructor(normal_gap_max_minutes=15.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_b = cast(pd.DataFrame, traj[traj["MMSI"] == "987654321"])
        assert vessel_b["gap_flag"].sum() == 1

    def test_first_record_never_flagged(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        for mmsi, grp in traj.groupby("MMSI"):
            grp_df = cast(pd.DataFrame, grp)
            first = grp_df.sort_values("BaseDateTime").iloc[0]
            assert first["gap_flag"] is False or first["gap_flag"] == False

    def test_custom_threshold_respected(self, minimal_df):
        """With threshold=120 min, even VESSEL_B's 90-min gap should not be flagged."""
        rec = make_reconstructor(normal_gap_max_minutes=120.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        assert traj["gap_flag"].sum() == 0


# ---------------------------------------------------------------------------
# 4. segment_id
# ---------------------------------------------------------------------------

class TestSegmentId:
    def test_first_segment_is_zero(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        for mmsi, grp in traj.groupby("MMSI"):
            grp_df = cast(pd.DataFrame, grp)
            first_seg = grp_df.sort_values("BaseDateTime")["segment_id"].iloc[0]
            assert first_seg == 0

    def test_segment_increments_at_gap(self, minimal_df):
        """VESSEL_B has a gap → segment_id should be 0 then 1."""
        rec = make_reconstructor(normal_gap_max_minutes=15.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_b = cast(pd.DataFrame, traj[traj["MMSI"] == "987654321"]).sort_values("BaseDateTime")
        seg_ids = vessel_b["segment_id"].tolist()
        assert seg_ids == [0, 1], f"Expected [0, 1], got {seg_ids}"

    def test_no_gap_single_segment(self, minimal_df):
        """VESSEL_A has no gaps → all records in segment 0."""
        rec = make_reconstructor(normal_gap_max_minutes=15.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_a = cast(pd.DataFrame, traj[traj["MMSI"] == "123456789"])
        assert (vessel_a["segment_id"] == 0).all()

    def test_segment_id_isolated_per_mmsi(self, minimal_df):
        """segment_id for VESSEL_B must start at 0, not continue from VESSEL_A."""
        rec = make_reconstructor(normal_gap_max_minutes=15.0)
        traj = rec.reconstruct(clean_minimal(minimal_df))
        vessel_b_first_seg = cast(pd.DataFrame, traj[traj["MMSI"] == "987654321"])["segment_id"].min()
        assert vessel_b_first_seg == 0


# ---------------------------------------------------------------------------
# 5. GeoJSON export
# ---------------------------------------------------------------------------

class TestGeoJSONExport:
    def test_geojson_structure(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        geojson = rec.to_geojson(traj, "123456789")
        assert geojson["type"] == "FeatureCollection"
        assert isinstance(geojson["features"], list)
        assert len(geojson["features"]) > 0

    def test_geojson_unknown_mmsi_returns_empty(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        geojson = rec.to_geojson(traj, "000000000")
        assert geojson["features"] == []

    def test_geojson_linestring_geometry(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        geojson = rec.to_geojson(traj, "123456789")
        for feat in geojson["features"]:
            assert feat["geometry"]["type"] in ("LineString", "Point")


# ---------------------------------------------------------------------------
# 6. Multi-MMSI isolation
# ---------------------------------------------------------------------------

class TestMultiMMSI:
    def test_all_mmsi_present_in_output(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        assert set(traj["MMSI"].unique()) == {"123456789", "987654321"}

    def test_record_count_preserved(self, minimal_df):
        rec = make_reconstructor()
        traj = rec.reconstruct(clean_minimal(minimal_df))
        assert len(traj) == len(minimal_df)
