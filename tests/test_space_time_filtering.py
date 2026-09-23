"""Unit tests for M5 Phase 2 — Space-Time Candidate Filtering."""

import os
import json
import pytest
import pandas as pd

from space_time_models import (
    M4Fixture,
    ObservationMatchStatus,
    SpatialMatchLevel,
)
from space_time_filter import (
    SpatialContourEvaluator,
    aggregate_candidate_vessels,
    compute_space_time_funnel,
    detect_gap_overlaps,
    filter_space_time,
    load_m4_fixture,
)
from pipeline_phase2 import run_phase2_pipeline


@pytest.fixture
def fixture_path(tmp_path):
    """Create temporary M4 fixture JSON for unit tests."""
    fix_data = {
        "incident_id": "TEST-INCIDENT-001",
        "metadata": {
            "source": "TEST_FIXTURE",
            "not_real_m4_output": True,
        },
        "origin_time_start_utc": "2022-02-15T13:30:00Z",
        "origin_time_end_utc": "2022-02-15T14:30:00Z",
        "oil_age_min_hours": 0.0,
        "oil_age_max_hours": 2.0,
        "origin_50_contour": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-90.003, 28.968],
                    [-89.997, 28.968],
                    [-89.997, 28.973],
                    [-90.003, 28.973],
                    [-90.003, 28.968],
                ]
            ],
        },
        "origin_90_contour": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-90.010, 28.965],
                    [-89.975, 28.965],
                    [-89.975, 28.985],
                    [-90.010, 28.985],
                    [-90.010, 28.965],
                ]
            ],
        },
        "forward_forecast_path": {
            "type": "LineString",
            "coordinates": [[-90.000, 28.970], [-89.980, 28.980]],
        },
    }
    file_p = tmp_path / "m4_origin_fixture.json"
    with open(file_p, "w", encoding="utf-8") as f:
        json.dump(fix_data, f)
    return str(file_p)


class TestM4FixtureLoader:
    """Test loading and parsing of M4 fixture JSON."""

    def test_load_m4_fixture(self, fixture_path):
        fix = load_m4_fixture(fixture_path)
        assert fix.incident_id == "TEST-INCIDENT-001"
        assert fix.source == "TEST_FIXTURE"
        assert fix.not_real_m4_output is True
        assert fix.origin_time_start_utc.isoformat() == "2022-02-15T13:30:00+00:00"
        assert fix.origin_time_end_utc.isoformat() == "2022-02-15T14:30:00+00:00"


class TestSpatialContourEvaluator:
    """Test point-in-polygon spatial evaluation."""

    def test_point_in_50_contour(self, fixture_path):
        fix = load_m4_fixture(fixture_path)
        evaluator = SpatialContourEvaluator(fix.origin_50_contour, fix.origin_90_contour)
        is_50, is_90 = evaluator.evaluate_points(
            lats=pd.Series([28.97010]).to_numpy(),
            lons=pd.Series([-90.00008]).to_numpy(),
        )
        assert is_50[0] is True or is_50[0] == 1
        assert is_90[0] is True or is_90[0] == 1

    def test_point_in_90_outside_50(self, fixture_path):
        fix = load_m4_fixture(fixture_path)
        evaluator = SpatialContourEvaluator(fix.origin_50_contour, fix.origin_90_contour)
        is_50, is_90 = evaluator.evaluate_points(
            lats=pd.Series([28.97972]).to_numpy(),
            lons=pd.Series([-89.98133]).to_numpy(),
        )
        assert is_50[0] is False or is_50[0] == 0
        assert is_90[0] is True or is_90[0] == 1

    def test_point_outside_all(self, fixture_path):
        fix = load_m4_fixture(fixture_path)
        evaluator = SpatialContourEvaluator(fix.origin_50_contour, fix.origin_90_contour)
        is_50, is_90 = evaluator.evaluate_points(
            lats=pd.Series([29.0500]).to_numpy(),
            lons=pd.Series([-89.9000]).to_numpy(),
        )
        assert is_50[0] is False or is_50[0] == 0
        assert is_90[0] is False or is_90[0] == 0


class TestPhase2ExpectedValidationCases:
    """Explicitly verify the 4 expected validation cases required by M5 Phase 2."""

    def test_case_1_mmsi_367611250_match_50_percent(self, fixture_path):
        """Case 1: MMSI 367611250 inside 50% contour and inside time window -> MATCH_50_PERCENT."""
        fix = load_m4_fixture(fixture_path)
        df_obs = pd.DataFrame(
            [
                {
                    "MMSI": "367611250",
                    "BaseDateTime": "2022-02-15T13:51:17Z",
                    "LAT": 28.97010,
                    "LON": -90.00008,
                    "SOG": 0.1,
                    "COG": 272.0,
                }
            ]
        )
        filtered = filter_space_time(df_obs, fix)
        assert filtered.loc[0, "match_status"] == ObservationMatchStatus.MATCH_50_PERCENT.value

    def test_case_2_mmsi_338173000_match_90_percent(self, fixture_path):
        """Case 2: MMSI 338173000 inside 90% contour (outside 50%) and inside time window -> MATCH_90_PERCENT."""
        fix = load_m4_fixture(fixture_path)
        df_obs = pd.DataFrame(
            [
                {
                    "MMSI": "338173000",
                    "BaseDateTime": "2022-02-15T13:53:25Z",
                    "LAT": 28.97972,
                    "LON": -89.98133,
                    "SOG": 12.4,
                    "COG": 70.5,
                }
            ]
        )
        filtered = filter_space_time(df_obs, fix)
        assert filtered.loc[0, "match_status"] == ObservationMatchStatus.MATCH_90_PERCENT.value

    def test_case_3_mmsi_367414780_temporal_out_of_bounds(self, fixture_path):
        """Case 3: MMSI 367414780 spatially relevant, timestamp outside origin time window -> TEMPORAL_OUT_OF_BOUNDS."""
        fix = load_m4_fixture(fixture_path)
        df_obs = pd.DataFrame(
            [
                {
                    "MMSI": "367414780",
                    "BaseDateTime": "2022-02-15T11:22:07Z",  # 2 hours before window
                    "LAT": 28.97654,
                    "LON": -89.98000,
                    "SOG": 10.7,
                    "COG": 289.3,
                }
            ]
        )
        filtered = filter_space_time(df_obs, fix)
        assert filtered.loc[0, "match_status"] == ObservationMatchStatus.TEMPORAL_OUT_OF_BOUNDS.value

    def test_case_4_mmsi_367606390_gap_overlap_candidate(self, fixture_path):
        """Case 4: MMSI 367606390 AIS LONG_GAP overlaps origin time window -> GAP_OVERLAP_CANDIDATE."""
        fix = load_m4_fixture(fixture_path)
        df_gaps = pd.DataFrame(
            [
                {
                    "mmsi": "367606390",
                    "prev_timestamp": "2022-02-15T09:32:26Z",
                    "next_timestamp": "2022-02-15T19:25:27Z",
                    "gap_duration_minutes": 593.0,
                    "gap_duration_hours": 9.88,
                    "gap_class": "LONG_GAP",
                    "last_lat": 28.96848,
                    "last_lon": -90.03466,
                    "next_lat": 29.02259,
                    "next_lon": -90.03908,
                }
            ]
        )
        gaps_detected = detect_gap_overlaps(df_gaps, fix)
        assert len(gaps_detected) == 1
        assert gaps_detected.iloc[0]["mmsi"] == "367606390"
        assert gaps_detected.iloc[0]["overlap_status"] == "GAP_OVERLAP_CANDIDATE"
        assert "evidence requiring further investigation" in gaps_detected.iloc[0]["evidence_note"]


class TestCandidateAggregationAndFunnel:
    """Test candidate aggregation logic and progression funnel metrics."""

    def test_candidate_aggregation(self):
        df_obs = pd.DataFrame(
            [
                {
                    "MMSI": "111",
                    "BaseDateTime": pd.Timestamp("2022-02-15T13:40:00Z"),
                    "match_status": ObservationMatchStatus.MATCH_50_PERCENT.value,
                    "segment_id": 0,
                },
                {
                    "MMSI": "111",
                    "BaseDateTime": pd.Timestamp("2022-02-15T14:10:00Z"),
                    "match_status": ObservationMatchStatus.MATCH_90_PERCENT.value,
                    "segment_id": 0,
                },
                {
                    "MMSI": "222",
                    "BaseDateTime": pd.Timestamp("2022-02-15T13:50:00Z"),
                    "match_status": ObservationMatchStatus.MATCH_90_PERCENT.value,
                    "segment_id": 1,
                },
            ]
        )
        cands = aggregate_candidate_vessels(df_obs)
        assert len(cands) == 2
        cand_111 = cands[cands["mmsi"] == "111"].iloc[0]
        assert cand_111["highest_match_level"] == SpatialMatchLevel.MATCH_50_PERCENT.value
        assert cand_111["total_candidate_observations"] == 2
        assert cand_111["obs_count_50_percent"] == 1
        assert cand_111["obs_count_90_percent"] == 1


class TestPhase2PipelineExecution:
    """Test full Phase 2 pipeline execution and output creation."""

    def test_run_phase2_pipeline(self, tmp_path, fixture_path):
        cleaned_p = tmp_path / "ais_cleaned.csv"
        gaps_p = tmp_path / "ais_gap_records.csv"
        out_dir = tmp_path / "phase2_out"

        df_cleaned = pd.DataFrame(
            [
                {
                    "MMSI": "367611250",
                    "BaseDateTime": "2022-02-15T13:51:17Z",
                    "LAT": 28.97010,
                    "LON": -90.00008,
                    "SOG": 0.1,
                    "COG": 272.0,
                },
                {
                    "MMSI": "338173000",
                    "BaseDateTime": "2022-02-15T13:53:25Z",
                    "LAT": 28.97972,
                    "LON": -89.98133,
                    "SOG": 12.4,
                    "COG": 70.5,
                },
            ]
        )
        df_cleaned.to_csv(cleaned_p, index=False)

        df_gaps = pd.DataFrame(
            [
                {
                    "mmsi": "367606390",
                    "prev_timestamp": "2022-02-15T09:32:26Z",
                    "next_timestamp": "2022-02-15T19:25:27Z",
                    "gap_duration_minutes": 593.0,
                    "gap_duration_hours": 9.88,
                    "gap_class": "LONG_GAP",
                    "last_lat": 28.96848,
                    "last_lon": -90.03466,
                    "next_lat": 29.02259,
                    "next_lon": -90.03908,
                }
            ]
        )
        df_gaps.to_csv(gaps_p, index=False)

        res = run_phase2_pipeline(
            fixture_path=fixture_path,
            cleaned_csv_path=str(cleaned_p),
            gaps_csv_path=str(gaps_p),
            output_dir=str(out_dir),
        )

        assert res["funnel_metrics"]["final_candidate_vessels"] == 2
        assert res["funnel_metrics"]["gap_overlap_candidates"] == 1
        assert os.path.exists(out_dir / "candidate_vessels.csv")
        assert os.path.exists(out_dir / "candidate_observations.csv")
        assert os.path.exists(out_dir / "gap_overlap_candidates.csv")
        assert os.path.exists(out_dir / "space_time_report.json")
        assert os.path.exists(out_dir / "space_time_report.md")
