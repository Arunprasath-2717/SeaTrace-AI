from fastapi.testclient import TestClient


def test_create_and_get_incident(client: TestClient, auth_headers: dict):
    payload = {
        "name": "Bight of Biafra Spill",
        "description": "Satellite SAR detection",
        "latitude": 4.5,
        "longitude": 7.2,
        "source_type": "SAR_SENTINEL_1",
    }
    # Create incident
    res = client.post("/api/v1/incidents", json=payload, headers=auth_headers)
    assert res.status_code == 201
    created = res.json()
    inc_id = created["id"]
    assert created["name"] == payload["name"]
    assert created["status"] == "CREATED"

    # Get incident
    res_get = client.get(f"/api/v1/incidents/{inc_id}", headers=auth_headers)
    assert res_get.status_code == 200
    assert res_get.json()["id"] == inc_id

    # List incidents
    res_list = client.get("/api/v1/incidents", headers=auth_headers)
    assert res_list.status_code == 200
    list_body = res_list.json()
    assert list_body["total"] >= 1
    assert any(item["id"] == inc_id for item in list_body["items"])
