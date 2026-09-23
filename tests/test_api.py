"""
test_api.py
===========
Deterministic API tests for M5 AIS Intelligence FastAPI integration layer.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# 1. Health & Funnel endpoints
# ---------------------------------------------------------------------------

def test_get_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "M5 AIS Intelligence API"


def test_get_funnel():
    response = client.get("/funnel")
    assert response.status_code == 200
    data = response.json()
    assert "final_candidate_vessels" in data
    assert "total_input_records" in data
    assert "gap_overlap_candidates" in data


# ---------------------------------------------------------------------------
# 2. Candidates endpoints
# ---------------------------------------------------------------------------

def test_list_candidates():
    response = client.get("/candidates")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        cand = data[0]
        assert "mmsi" in cand
        assert "highest_match_level" in cand
        assert "is_gap_overlap_candidate" in cand


def test_get_candidate_detail_valid():
    # Use real candidate MMSI from fixture integration (e.g. 367611250)
    response = client.get("/candidates/367611250")
    assert response.status_code == 200
    data = response.json()
    assert data["mmsi"] == "367611250"
    assert data["highest_match_level"] == "MATCH_50_PERCENT"
    assert "segment_ids" in data


def test_get_candidate_detail_not_found():
    response = client.get("/candidates/999999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


# ---------------------------------------------------------------------------
# 3. Candidate Features endpoints
# ---------------------------------------------------------------------------

def test_get_candidate_features_valid():
    response = client.get("/candidates/367611250/features")
    assert response.status_code == 200
    data = response.json()
    assert data["mmsi"] == "367611250"
    assert "observation_count" in data
    assert "min_distance_to_origin" in data
    assert "stationary_fraction" in data


def test_get_candidate_features_not_found():
    response = client.get("/candidates/999999999/features")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# 4. Gap Evidence endpoints
# ---------------------------------------------------------------------------

def test_get_candidate_gap_evidence_valid():
    # Candidate MMSI 367606390 has gap overlap evidence
    response = client.get("/candidates/367606390/gap-evidence")
    assert response.status_code == 200
    data = response.json()
    assert data["mmsi"] == "367606390"
    assert "disclaimer" in data
    assert "NOT proof of wrongdoing" in data["disclaimer"]
    assert "gaps" in data
    if len(data["gaps"]) > 0:
        gap = data["gaps"][0]
        assert "evidence_note" in gap
        assert "NOT proof of wrongdoing" in gap["evidence_note"]


def test_get_candidate_gap_evidence_not_found():
    response = client.get("/candidates/999999999/gap-evidence")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# 5. GeoJSON Trajectory endpoints
# ---------------------------------------------------------------------------

def test_get_trajectory_geojson_valid():
    response = client.get("/trajectories/367611250/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data
    assert len(data["features"]) > 0


def test_get_trajectory_geojson_not_found():
    response = client.get("/trajectories/999999999/geojson")
    assert response.status_code == 404
