import pytest
from datetime import datetime, timezone
from backend.services.scoring_service import ScoringService
from backend.models.candidate import CandidateVessel
from backend.models.drift_run import DriftRun


def test_scoring_weights_validation():
    valid_weights = {
        "spatial_proximity": 0.25,
        "temporal_overlap": 0.20,
        "drift_compatibility": 0.25,
        "trajectory": 0.15,
        "behaviour_anomaly": 0.10,
        "ais_gap_evidence": 0.05,
    }
    svc = ScoringService(weights=valid_weights)
    assert svc.weights == valid_weights

    invalid_weights = {"spatial_proximity": 0.5}
    with pytest.raises(ValueError):
        ScoringService(weights=invalid_weights)


def test_candidate_scoring_high_confidence():
    svc = ScoringService()
    
    cand = CandidateVessel(
        id="cnd_test_1",
        incident_id="inc_test",
        vessel_name="SUSPECT TANKER",
        mmsi="123456789",
        vessel_type="Oil Tanker",
        has_ais_gap=True,
        ais_gap_duration_minutes=140,
        min_distance_to_drift_center_km=1.5,
        speed_knots_avg=4.2,
        speed_anomaly_detected=True,
        trajectory_geojson={"type": "LineString", "coordinates": []}
    )

    drift = DriftRun(
        id="drf_test",
        incident_id="inc_test",
        simulation_hours=24,
        release_window_start=datetime.now(timezone.utc),
        release_window_end=datetime.now(timezone.utc),
        origin_center_lat=4.0,
        origin_center_lon=6.0,
        contours_geojson={"type": "FeatureCollection", "features": []}
    )

    score, factors, confidence, findings = svc.score_candidate(cand, drift)
    assert 0.0 <= score <= 1.0
    assert confidence == "HIGH"
    assert len(findings) > 0
    assert factors["spatial_proximity"] > 0.9
    assert factors["ais_gap_evidence"] == 1.0


def test_candidate_scoring_low_confidence():
    svc = ScoringService()
    
    cand = CandidateVessel(
        id="cnd_test_2",
        incident_id="inc_test",
        vessel_name="DISTANT CARGO",
        mmsi="987654321",
        vessel_type="Container Ship",
        has_ais_gap=False,
        ais_gap_duration_minutes=0,
        min_distance_to_drift_center_km=45.0,
        speed_knots_avg=18.0,
        speed_anomaly_detected=False,
        trajectory_geojson={"type": "LineString", "coordinates": []}
    )

    drift = DriftRun(
        id="drf_test",
        incident_id="inc_test",
        simulation_hours=24,
        release_window_start=datetime.now(timezone.utc),
        release_window_end=datetime.now(timezone.utc),
        origin_center_lat=4.0,
        origin_center_lon=6.0,
        contours_geojson={"type": "FeatureCollection", "features": []}
    )

    score, factors, confidence, findings = svc.score_candidate(cand, drift)
    assert 0.0 <= score <= 1.0
    assert confidence == "LOW"
