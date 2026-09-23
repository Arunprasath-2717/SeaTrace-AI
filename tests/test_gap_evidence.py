"""
test_gap_evidence.py
====================
Deterministic unit tests for M5 Phase 3 — AIS Gap Evidence Extraction.
"""
from __future__ import annotations

import math
import pytest
import pandas as pd
from datetime import datetime, timezone
from typing import Any, Dict, List

from feature_models import Phase3Config
from gap_evidence import extract_gap_evidence, _haversine_m

_KNOTS_TO_MPS = 0.514444
DEFAULT_CFG = Phase3Config()

ORIGIN_START = datetime(2022, 2, 15, 12, 0, 0, tzinfo=timezone.utc)
ORIGIN_END = datetime(2022, 2, 15, 18, 0, 0, tzinfo=timezone.utc)


# ---------------------------------------------------------------------------
# Helper: build minimal gap record DataFrame
# ---------------------------------------------------------------------------

def _make_gap_df(rows: List[Dict[str, Any]]) -> pd.DataFrame:
    """Build a gap records DataFrame from a list of row dicts."""
    defaults = {
        "mmsi": "000000000",
        "prev_timestamp": "2022-02-15T10:00:00+00:00",
        "next_timestamp": "2022-02-15T12:00:00+00:00",
        "gap_duration_minutes": 120.0,
        "gap_duration_hours": 2.0,
        "last_lat": 28.970,
        "last_lon": -90.001,
        "last_sog": 5.0,
        "last_cog": 90.0,
        "last_heading": None,
        "next_lat": 28.975,
        "next_lon": -89.990,
        "next_sog": 5.5,
        "prev_segment_id": 0,
        "next_segment_id": 1,
        "gap_class": "LONG_GAP",
    }
    return pd.DataFrame([{**defaults, **r} for r in rows])


# ---------------------------------------------------------------------------
# 1. Basic round-trip: gap within origin window
# ---------------------------------------------------------------------------

class TestGapWithinOriginWindow:
    def test_overlaps_origin_window_is_true(self):
        """A gap spanning the origin window must be flagged as overlapping."""
        df = _make_gap_df([{
            "mmsi": "367606390",
            "prev_timestamp": "2022-02-15T09:32:26+00:00",
            "next_timestamp": "2022-02-15T19:25:27+00:00",
            "gap_class": "LONG_GAP",
        }])
        result = extract_gap_evidence(["367606390"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert len(result) == 1
        assert result.iloc[0]["overlaps_origin_window"] == True  # noqa: E712

    def test_gap_duration_seconds_correct(self):
        """Gap duration in seconds must equal (next - prev) in seconds."""
        dt_start = "2022-02-15T10:00:00+00:00"
        dt_end = "2022-02-15T12:00:00+00:00"
        df = _make_gap_df([{
            "mmsi": "111111111",
            "prev_timestamp": dt_start,
            "next_timestamp": dt_end,
            "gap_class": "SIGNIFICANT_GAP",
        }])
        result = extract_gap_evidence(["111111111"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["gap_duration_seconds"] == pytest.approx(7200.0)


# ---------------------------------------------------------------------------
# 2. Gap outside origin window
# ---------------------------------------------------------------------------

class TestGapOutsideOriginWindow:
    def test_non_overlapping_gap(self):
        """A gap entirely before the origin window must have overlaps=False."""
        df = _make_gap_df([{
            "mmsi": "222222222",
            "prev_timestamp": "2022-02-15T06:00:00+00:00",
            "next_timestamp": "2022-02-15T08:00:00+00:00",
            "gap_class": "LONG_GAP",
        }])
        result = extract_gap_evidence(["222222222"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["overlaps_origin_window"] == False  # noqa: E712

    def test_gap_after_window(self):
        df = _make_gap_df([{
            "mmsi": "333333333",
            "prev_timestamp": "2022-02-15T19:00:00+00:00",
            "next_timestamp": "2022-02-15T22:00:00+00:00",
            "gap_class": "LONG_GAP",
        }])
        result = extract_gap_evidence(["333333333"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["overlaps_origin_window"] == False  # noqa: E712


# ---------------------------------------------------------------------------
# 3. Observed vs expected displacement
# ---------------------------------------------------------------------------

class TestDisplacementCalculations:
    def test_observed_displacement_haversine(self):
        """observed_gap_displacement_m must match haversine between known positions."""
        l_lat, l_lon = 28.970, -90.001
        n_lat, n_lon = 28.975, -89.990
        expected_dist = _haversine_m(l_lat, l_lon, n_lat, n_lon, DEFAULT_CFG.earth_radius_m)
        df = _make_gap_df([{
            "mmsi": "444444444",
            "prev_timestamp": "2022-02-15T13:00:00+00:00",
            "next_timestamp": "2022-02-15T14:00:00+00:00",
            "last_lat": l_lat, "last_lon": l_lon,
            "next_lat": n_lat, "next_lon": n_lon,
            "last_sog": 3.0,
        }])
        result = extract_gap_evidence(["444444444"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["observed_gap_displacement_m"] == pytest.approx(expected_dist, rel=1e-5)

    def test_expected_displacement_kinematic(self):
        """expected_displacement_m = last_sog (m/s) * gap_duration_s."""
        sog_kn = 5.0
        prev = "2022-02-15T13:00:00+00:00"
        nxt = "2022-02-15T14:00:00+00:00"
        gap_s = 3600.0
        expected = sog_kn * _KNOTS_TO_MPS * gap_s
        df = _make_gap_df([{
            "mmsi": "555555555",
            "prev_timestamp": prev,
            "next_timestamp": nxt,
            "last_sog": sog_kn,
        }])
        result = extract_gap_evidence(["555555555"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["expected_displacement_m"] == pytest.approx(expected, rel=1e-5)

    def test_displacement_difference_sign(self):
        """When vessel reappears closer than expected, difference is negative."""
        sog_kn = 20.0   # fast ship: expected displacement > observed
        prev = "2022-02-15T13:00:00+00:00"
        nxt = "2022-02-15T14:00:00+00:00"
        gap_s = 3600.0
        expected_disp = sog_kn * _KNOTS_TO_MPS * gap_s  # ~37,200 m
        # positions only 100 m apart
        df = _make_gap_df([{
            "mmsi": "666666666",
            "prev_timestamp": prev,
            "next_timestamp": nxt,
            "last_lat": 28.970, "last_lon": -90.000,
            "next_lat": 28.970, "next_lon": -89.999,  # ~88 m apart
            "last_sog": sog_kn,
        }])
        result = extract_gap_evidence(["666666666"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        diff = result.iloc[0]["displacement_difference_m"]
        assert diff is not None and diff < 0.0


# ---------------------------------------------------------------------------
# 4. Quality flags
# ---------------------------------------------------------------------------

class TestQualityFlags:
    def test_full_quality_flag(self):
        """FULL quality when all positions and SOG are present."""
        df = _make_gap_df([{"mmsi": "QA001", "last_sog": 5.0}])
        result = extract_gap_evidence(["QA001"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["displacement_quality"] == "FULL"

    def test_partial_no_sog_flag(self):
        """PARTIAL_NO_SOG when positions present but SOG is null."""
        df = _make_gap_df([{"mmsi": "QA002", "last_sog": None}])
        result = extract_gap_evidence(["QA002"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["displacement_quality"] == "PARTIAL_NO_SOG"

    def test_partial_no_position_flag(self):
        """PARTIAL_NO_POSITION when one endpoint is missing."""
        df = _make_gap_df([{
            "mmsi": "QA003",
            "last_lat": None, "last_lon": None,
            "last_sog": 5.0,
        }])
        result = extract_gap_evidence(["QA003"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.iloc[0]["displacement_quality"] in ("PARTIAL_NO_POSITION", "INSUFFICIENT")


# ---------------------------------------------------------------------------
# 5. Candidate filtering: only candidate MMSIs extracted
# ---------------------------------------------------------------------------

class TestCandidateFiltering:
    def test_non_candidate_mmsis_excluded(self):
        """Only gaps for MMSIs in candidate_mmsis list must be returned."""
        df = _make_gap_df([
            {"mmsi": "100000001"},
            {"mmsi": "100000002"},
            {"mmsi": "999999999"},   # NOT a candidate
        ])
        result = extract_gap_evidence(["100000001", "100000002"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert "999999999" not in result["mmsi"].values
        assert len(result) == 2

    def test_empty_candidate_list_returns_empty(self):
        df = _make_gap_df([{"mmsi": "100000001"}])
        result = extract_gap_evidence([], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert result.empty


# ---------------------------------------------------------------------------
# 6. Multiple gaps per vessel
# ---------------------------------------------------------------------------

class TestMultipleGapsPerVessel:
    def test_all_gaps_included(self):
        """All gaps for a candidate MMSI must appear, not just window-overlap ones."""
        df = _make_gap_df([
            {
                "mmsi": "MULTI001",
                "prev_timestamp": "2022-02-15T06:00:00+00:00",
                "next_timestamp": "2022-02-15T08:00:00+00:00",
                "gap_class": "SIGNIFICANT_GAP",
            },
            {
                "mmsi": "MULTI001",
                "prev_timestamp": "2022-02-15T13:00:00+00:00",
                "next_timestamp": "2022-02-15T15:00:00+00:00",
                "gap_class": "LONG_GAP",
            },
            {
                "mmsi": "MULTI001",
                "prev_timestamp": "2022-02-15T20:00:00+00:00",
                "next_timestamp": "2022-02-15T22:00:00+00:00",
                "gap_class": "SHORT_GAP",
            },
        ])
        result = extract_gap_evidence(["MULTI001"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        assert len(result) == 3
        overlap_flags = result["overlaps_origin_window"].tolist()
        assert sum(overlap_flags) == 1  # only middle gap overlaps


# ---------------------------------------------------------------------------
# 7. Empty inputs
# ---------------------------------------------------------------------------

class TestEmptyInputs:
    def test_empty_gap_records_returns_empty(self):
        result = extract_gap_evidence(
            ["MMSI001"], pd.DataFrame(), ORIGIN_START, ORIGIN_END, DEFAULT_CFG
        )
        assert result.empty

    def test_gap_records_no_matching_mmsi(self):
        df = _make_gap_df([{"mmsi": "000000000"}])
        result = extract_gap_evidence(
            ["999999999"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG
        )
        assert result.empty


# ---------------------------------------------------------------------------
# 8. Haversine distance correctness
# ---------------------------------------------------------------------------

class TestHaversineDistance:
    def test_same_point_zero_distance(self):
        assert _haversine_m(28.97, -90.0, 28.97, -90.0) == pytest.approx(0.0)

    def test_known_distance(self):
        """1 degree of latitude ≈ 111 195 m at any longitude."""
        d = _haversine_m(0.0, 0.0, 1.0, 0.0)
        assert d == pytest.approx(111_195.0, rel=0.001)

    def test_symmetry(self):
        d1 = _haversine_m(28.970, -90.001, 28.975, -89.990)
        d2 = _haversine_m(28.975, -89.990, 28.970, -90.001)
        assert d1 == pytest.approx(d2)


# ---------------------------------------------------------------------------
# 9. Integration regression: real Phase 1 gap records
# ---------------------------------------------------------------------------

class TestIntegrationRealGapRecords:
    """Regression against real Phase 1 outputs if available."""

    def test_candidate_367606390_has_gap_evidence(self):
        try:
            df = pd.read_csv("outputs/ais_gap_records.csv")
        except FileNotFoundError:
            pytest.skip("Phase 1 gap records not available")
        result = extract_gap_evidence(
            ["367606390"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG
        )
        # MMSI 367606390 has 92 gap records in real data
        assert len(result) > 0

    def test_overlapping_gap_evidence_note_content(self):
        """Overlapping gaps must mention 'contextual evidence' in note."""
        df = _make_gap_df([{
            "mmsi": "EVNOTE001",
            "prev_timestamp": "2022-02-15T11:00:00+00:00",
            "next_timestamp": "2022-02-15T16:00:00+00:00",
        }])
        result = extract_gap_evidence(["EVNOTE001"], df, ORIGIN_START, ORIGIN_END, DEFAULT_CFG)
        note = result.iloc[0]["evidence_note"]
        assert "contextual evidence" in note.lower()
        assert "NOT proof of wrongdoing" in note
