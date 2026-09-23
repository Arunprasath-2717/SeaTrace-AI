from fastapi.testclient import TestClient


def test_complete_golden_flow(client: TestClient, auth_headers: dict):
    # 1. Create Incident
    payload = {
        "name": "Gulf of Guinea Spill Alpha",
        "description": "Synthetic SAR detection in Bight of Bonny",
        "latitude": 4.125,
        "longitude": 6.842,
        "source_type": "SAR_SENTINEL_1",
    }
    create_res = client.post("/api/v1/incidents", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    incident = create_res.json()
    inc_id = incident["id"]
    assert incident["status"] == "CREATED"

    # 2. Check initial status
    status_res = client.get(f"/api/v1/incidents/{inc_id}/status", headers=auth_headers)
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["current_status"] == "CREATED"
    assert status_data["progress_percentage"] == 0

    # 3. Trigger Analysis Pipeline
    analyze_res = client.post(
        f"/api/v1/incidents/{inc_id}/analyze",
        json={"drift_hours": 24, "ais_search_radius_km": 50.0},
        headers=auth_headers
    )
    assert analyze_res.status_code == 202
    assert analyze_res.json()["status"] == "ACCEPTED"

    # 4. Check Pipeline Progress and Stage Logs
    status_after = client.get(f"/api/v1/incidents/{inc_id}/status", headers=auth_headers)
    assert status_after.status_code == 200
    after_data = status_after.json()
    assert after_data["current_status"] == "REPORT_READY"
    assert after_data["progress_percentage"] == 100
    assert len(after_data["stages"]) >= 5
    stage_names = [s["stage"] for s in after_data["stages"]]
    assert "DETECTION_M1" in stage_names
    assert "DRIFT_SIMULATION_M4" in stage_names
    assert "AIS_FILTERING_M5" in stage_names
    assert "ATTRIBUTION_SCORING_M2" in stage_names
    assert "REPORT_ASSEMBLY" in stage_names

    # 5. Fetch Spill Data (M1)
    spill_res = client.get(f"/api/v1/incidents/{inc_id}/spill", headers=auth_headers)
    assert spill_res.status_code == 200
    spill_data = spill_res.json()
    assert spill_data["confidence"] > 0.90
    assert spill_data["estimated_area_km2"] > 0
    assert spill_data["polygon_geojson"]["type"] == "Polygon"

    # 6. Fetch Drift Data (M4)
    drift_res = client.get(f"/api/v1/incidents/{inc_id}/drift", headers=auth_headers)
    assert drift_res.status_code == 200
    drift_data = drift_res.json()
    assert drift_data["simulation_hours"] == 24
    assert len(drift_data["contours_geojson"]["features"]) > 0

    # 7. Fetch Candidates (M5)
    cand_res = client.get(f"/api/v1/incidents/{inc_id}/candidates", headers=auth_headers)
    assert cand_res.status_code == 200
    cand_data = cand_res.json()
    assert cand_data["total_candidates"] == 3
    assert any(c["vessel_name"] == "MT PACIFIC VOYAGER" for c in cand_data["candidates"])

    # 8. Fetch Evidence & Factor Breakdown (M2)
    evi_res = client.get(f"/api/v1/incidents/{inc_id}/evidence", headers=auth_headers)
    assert evi_res.status_code == 200
    evi_data = evi_res.json()
    assert evi_data["scoring_version"] == "1.0"
    assert len(evi_data["attributions"]) == 3
    # Top ranked should be MT PACIFIC VOYAGER with HIGH confidence
    top_cand = evi_data["attributions"][0]
    assert top_cand["rank"] == 1
    assert top_cand["vessel_name"] == "MT PACIFIC VOYAGER"
    assert top_cand["confidence_level"] == "HIGH"
    assert top_cand["final_score"] > 0.70
    assert "spatial_proximity" in top_cand["factor_scores"]
    assert "ais_gap_evidence" in top_cand["factor_scores"]

    # 9. Fetch Final Summary Report
    rep_res = client.get(f"/api/v1/incidents/{inc_id}/report", headers=auth_headers)
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert rep_data["incident_summary"]["name"] == payload["name"]
    assert rep_data["primary_suspect"] is not None
    assert rep_data["primary_suspect"]["vessel_name"] == "MT PACIFIC VOYAGER"
    assert len(rep_data["primary_suspect"]["key_findings"]) > 0
    assert len(rep_data["candidate_ranking"]) == 3
