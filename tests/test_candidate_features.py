"""
test_candidate_features.py
===========================
Deterministic unit tests for M5 Phase 3 — Candidate Feature Extraction.
"""
from __future__ import annotations

import math
import pytest
import pandas as pd
import numpy as np
from typing import List, Optional, cast

from feature_models import Phase3Config
from candidate_features import (
    extract_candidate_features,
    _circular_diff,
    _contour_centroid,
    _haversine_m,
)

# ---------------------------------------------------------------------------
# Shared fixture: GeoJSON contours (same geometry as m4_origin_fixture.json)
# ---------------------------------------------------------------------------

CONTOUR_50 = {
    "type": "Polygon",
    "coordinates": [[
        [-90.003, 28.968], [-89.997, 28.968],
        [-89.997, 28.973], [-90.003, 28.973],
        [-90.003, 28.968]
    ]]
}

CONTOUR_90 = {
    "type": "Polygon",
    "coordinates": [[
        [-90.005, 28.965], [-89.995, 28.965],
        [-89.995, 28.975], [-90.005, 28.975],
        [-90.005, 28.965]
    ]]
}

DEFAULT_CFG = Phase3Config()

# ---------------------------------------------------------------------------
# Helper to build minimal observation DataFrames
# ---------------------------------------------------------------------------

def _make_obs(
    mmsi: str,
    timestamps: List[str],
    lats: List[float],
    lons: List[float],
    sogs: List[float],
    cogs: List[float],
    match_statuses: Optional[List[str]] = None,
    headings: Optional[List[Optional[float]]] = None,
    time_deltas: Optional[List[float]] = None,
    segment_ids: Optional[List[int]] = None,
) -> pd.DataFrame:
    n = len(timestamps)
    if match_statuses is None:
        match_statuses = ["MATCH_50_PERCENT"] * n
    if headings is None:
        headings = cast(List[Optional[float]], [None] * n)
    if time_deltas is None:
        time_deltas = [float("nan")] + [60.0] * (n - 1)
    if segment_ids is None:
        segment_ids = [0] * n

    return pd.DataFrame({
        "MMSI": [mmsi] * n,
        "BaseDateTime": timestamps,
        "LAT": lats,
        "LON": lons,
        "SOG": sogs,
        "COG": cogs,
        "Heading": headings,
        "match_status": match_statuses,
        "time_delta_seconds": time_deltas,
        "segment_id": segment_ids,
        "VesselType": [None] * n,
        "Status": [None] * n,
        "IMO": [None] * n,
        "Draft": [None] * n,
        "Cargo": [None] * n,
    })


# ---------------------------------------------------------------------------
# 1. Normal movement candidate
# ---------------------------------------------------------------------------

class TestNormalMovementCandidate:
    def test_basic_feature_extraction(self):
        obs = _make_obs(
            "111111111",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:35:00Z", "2022-02-15T13:40:00Z"],
            [28.970, 28.971, 28.972],
            [-90.001, -90.000, -89.999],
            [5.0, 5.5, 6.0],
            [45.0, 50.0, 55.0],
            time_deltas=[float("nan"), 300.0, 300.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert len(result) == 1
        row = result.iloc[0]
        assert row["mmsi"] == "111111111"
        assert row["observation_count"] == 3
        assert row["track_duration_seconds"] == pytest.approx(600.0)

    def test_distance_to_origin_non_negative(self):
        obs = _make_obs(
            "222222222",
            ["2022-02-15T13:30:00Z"],
            [28.970],
            [-90.000],
            [3.0],
            [90.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert result.iloc[0]["distance_to_origin_50m"] >= 0.0
        assert result.iloc[0]["distance_to_origin_90m"] >= 0.0

    def test_min_distance_is_minimum_of_both(self):
        obs = _make_obs(
            "333333333",
            ["2022-02-15T13:30:00Z"],
            [28.970],
            [-90.000],
            [3.0],
            [90.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        row = result.iloc[0]
        assert row["min_distance_to_origin"] == pytest.approx(
            min(row["distance_to_origin_50m"], row["distance_to_origin_90m"]), abs=1.0
        )


# ---------------------------------------------------------------------------
# 2. Stationary / dwell candidate
# ---------------------------------------------------------------------------

class TestStationaryDwellCandidate:
    def test_stationary_count_threshold(self):
        cfg = Phase3Config(stationary_speed_threshold_knots=1.0)
        obs = _make_obs(
            "444444444",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z", "2022-02-15T13:32:00Z"],
            [28.970, 28.970, 28.970],
            [-90.000, -90.000, -90.000],
            [0.2, 0.3, 2.0],   # 2 below threshold
            [0.0, 0.0, 0.0],
            time_deltas=[float("nan"), 60.0, 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        assert result.iloc[0]["stationary_observation_count"] == 2

    def test_stationary_fraction_correct(self):
        cfg = Phase3Config(stationary_speed_threshold_knots=1.0)
        obs = _make_obs(
            "555555555",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z"],
            [28.970, 28.970],
            [-90.000, -90.000],
            [0.5, 5.0],
            [0.0, 0.0],
            time_deltas=[float("nan"), 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        assert result.iloc[0]["stationary_fraction"] == pytest.approx(0.5)

    def test_dwell_duration_positive(self):
        obs = _make_obs(
            "666666666",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z"],
            [28.970, 28.970],
            [-90.000, -90.000],
            [0.2, 0.2],
            [0.0, 0.0],
            time_deltas=[float("nan"), 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert result.iloc[0]["dwell_duration_seconds"] == pytest.approx(60.0)


# ---------------------------------------------------------------------------
# 3. Speed changes
# ---------------------------------------------------------------------------

class TestSpeedChanges:
    def test_speed_change_count(self):
        cfg = Phase3Config(speed_change_threshold_knots=1.0)
        obs = _make_obs(
            "777777777",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z", "2022-02-15T13:32:00Z"],
            [28.970, 28.970, 28.970],
            [-90.000, -90.000, -90.000],
            [5.0, 7.5, 5.0],   # 2 changes of 2.5 kn
            [0.0, 0.0, 0.0],
            time_deltas=[float("nan"), 60.0, 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        assert result.iloc[0]["speed_change_count"] == 2

    def test_speed_change_rate_per_hour(self):
        cfg = Phase3Config(speed_change_threshold_knots=1.0)
        # 2 changes over 3600 s = 2.0 events/hour
        obs = _make_obs(
            "888888888",
            ["2022-02-15T13:00:00Z", "2022-02-15T13:30:00Z", "2022-02-15T14:00:00Z"],
            [28.970, 28.970, 28.970],
            [-90.000, -90.000, -90.000],
            [5.0, 8.0, 5.0],
            [0.0, 0.0, 0.0],
            time_deltas=[float("nan"), 1800.0, 1800.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        row = result.iloc[0]
        assert row["track_duration_seconds"] == pytest.approx(3600.0)
        assert row["speed_change_count"] == 2
        assert row["speed_change_rate"] == pytest.approx(2.0)


# ---------------------------------------------------------------------------
# 4. Heading wraparound
# ---------------------------------------------------------------------------

class TestHeadingWraparound:
    def test_circular_diff_no_wraparound(self):
        assert _circular_diff(10.0, 20.0) == pytest.approx(10.0)

    def test_circular_diff_wraparound_small(self):
        """359 -> 1 must be 2 degrees, NOT 358."""
        assert _circular_diff(359.0, 1.0) == pytest.approx(2.0)

    def test_circular_diff_wraparound_large(self):
        """1 -> 359 must be 2 degrees."""
        assert _circular_diff(1.0, 359.0) == pytest.approx(2.0)

    def test_heading_change_count_wraparound(self):
        cfg = Phase3Config(heading_change_threshold_degrees=5.0)
        # COG goes 350 -> 5: change = 15 degrees circular (should count)
        obs = _make_obs(
            "WRAP001",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z"],
            [28.970, 28.970],
            [-90.000, -90.000],
            [5.0, 5.0],
            [350.0, 5.0],   # 15 degree circular change
            time_deltas=[float("nan"), 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        assert result.iloc[0]["heading_change_count"] == 1
        assert result.iloc[0]["total_heading_change_degrees"] == pytest.approx(15.0)

    def test_max_heading_change_degrees(self):
        cfg = Phase3Config(heading_change_threshold_degrees=1.0)
        obs = _make_obs(
            "WRAP002",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z", "2022-02-15T13:32:00Z"],
            [28.970, 28.970, 28.970],
            [-90.000, -90.000, -90.000],
            [5.0, 5.0, 5.0],
            [0.0, 10.0, 5.0],  # 10 deg, then 5 deg
            time_deltas=[float("nan"), 60.0, 60.0],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, cfg)
        assert result.iloc[0]["max_heading_change_degrees"] == pytest.approx(10.0)


# ---------------------------------------------------------------------------
# 5. Missing COG
# ---------------------------------------------------------------------------

class TestMissingCOG:
    def test_cog_available_fraction_zero(self):
        obs = _make_obs(
            "NOCOG001",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z"],
            [28.970, 28.970],
            [-90.000, -90.000],
            [5.0, 5.0],
            [float("nan"), float("nan")],  # all null COG
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert result.iloc[0]["cog_available_fraction"] == 0.0

    def test_cog_available_fraction_partial(self):
        obs = _make_obs(
            "NOCOG002",
            ["2022-02-15T13:30:00Z", "2022-02-15T13:31:00Z"],
            [28.970, 28.970],
            [-90.000, -90.000],
            [5.0, 5.0],
            [90.0, float("nan")],  # half null
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert result.iloc[0]["cog_available_fraction"] == pytest.approx(0.5)


# ---------------------------------------------------------------------------
# 6. Missing Heading
# ---------------------------------------------------------------------------

class TestMissingHeading:
    def test_heading_fraction_all_null(self):
        obs = _make_obs(
            "NOHDG001",
            ["2022-02-15T13:30:00Z"],
            [28.970],
            [-90.000],
            [5.0],
            [90.0],
            headings=[None],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        assert result.iloc[0]["heading_available_fraction"] == 0.0


# ---------------------------------------------------------------------------
# 11. Mixed 50% / 90% candidates
# ---------------------------------------------------------------------------

class TestMixed50_90Candidate:
    def test_obs_counts_preserved(self):
        obs = _make_obs(
            "MIXED001",
            [
                "2022-02-15T13:30:00Z",
                "2022-02-15T13:31:00Z",
                "2022-02-15T13:32:00Z",
            ],
            [28.970, 28.972, 28.976],
            [-90.000, -90.000, -89.980],
            [5.0, 5.0, 12.0],
            [45.0, 45.0, 70.0],
            match_statuses=["MATCH_50_PERCENT", "MATCH_50_PERCENT", "MATCH_90_PERCENT"],
        )
        result = extract_candidate_features(obs, CONTOUR_50, CONTOUR_90, DEFAULT_CFG)
        row = result.iloc[0]
        assert row["observation_count_50_percent"] == 2
        assert row["observation_count_90_percent"] == 1
        assert row["observation_count"] == 3


# ---------------------------------------------------------------------------
# 12. Phase 2 candidate count regression
# ---------------------------------------------------------------------------

class TestPhase2CandidateCountRegression:
    """Verify Phase 2 candidate outputs are unchanged by Phase 3."""

    def test_candidate_obs_unchanged(self):
        """Phase 2 candidate_observations.csv must still have 71 rows."""
        try:
            df = pd.read_csv("outputs/phase2/candidate_observations.csv")
            assert len(df) == 71, f"Expected 71 rows, got {len(df)}"
        except FileNotFoundError:
            pytest.skip("Phase 2 outputs not available in this environment")

    def test_candidate_vessels_unchanged(self):
        """Phase 2 candidate_vessels.csv must still have 3 vessels."""
        try:
            df = pd.read_csv("outputs/phase2/candidate_vessels.csv")
            assert len(df) == 3, f"Expected 3 vessels, got {len(df)}"
        except FileNotFoundError:
            pytest.skip("Phase 2 outputs not available in this environment")
