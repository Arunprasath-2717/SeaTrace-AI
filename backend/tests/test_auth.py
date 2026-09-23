from fastapi.testclient import TestClient
from backend.core.security import hash_password, verify_password, create_access_token, decode_access_token


def test_password_hashing():
    pw = "SecretPassword!123"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    data = {"sub": "analyst@oceantrace.io", "role": "admin"}
    token = create_access_token(data)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "analyst@oceantrace.io"
    assert decoded["role"] == "admin"


def test_login_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "operator@oceantrace.io", "password": "SecurePassword123!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    assert body["user"]["username"] == "operator@oceantrace.io"


def test_login_invalid_credentials(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "operator@oceantrace.io", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
