from fastapi.testclient import TestClient


def test_health_endpoints(client: TestClient):
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["status"] == "OPERATIONAL"

    res_health = client.get("/healthz")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_unauthenticated_access_denied(client: TestClient):
    res = client.get("/api/v1/incidents")
    assert res.status_code == 401


def test_not_found_incident(client: TestClient, auth_headers: dict):
    res = client.get("/api/v1/incidents/inc_nonexistent", headers=auth_headers)
    assert res.status_code == 404
