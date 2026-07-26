from __future__ import annotations

import hashlib
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import app.main as service

TOKEN = "test-token-with-at-least-thirty-two-characters"


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    token_path = tmp_path / "api-token"
    token_path.write_text(TOKEN, encoding="utf-8")
    monkeypatch.setattr(service, "TOKEN_PATH", token_path)
    monkeypatch.setattr(
        service,
        "load_api_token",
        lambda token_path=token_path: TOKEN,
    )
    with TestClient(service.app) as test_client:
        yield test_client


def auth() -> dict[str, str]:
    return {"Authorization": f"Bearer {TOKEN}"}


def test_health_metadata_and_golden_prediction(client: TestClient):
    assert client.get("/healthz").json() == {"status": "ok"}
    assert client.get("/readyz").json() == {"status": "ready"}

    metadata = client.get("/v1/metadata")
    assert metadata.status_code == 200
    assert metadata.json()["model_id"] == "synthetic-linear-demo-v1"

    response = client.post(
        "/v1/predict",
        headers=auth(),
        json={"features": [0.25, -0.5, 0.75]},
    )
    assert response.status_code == 200
    assert response.json()["probability"] == pytest.approx(0.619517)
    assert response.json()["class_id"] == 1
    assert response.json()["class_name"] == "demo-positive"


def test_auth_and_schema_fail_closed(client: TestClient):
    no_token = client.post(
        "/v1/predict",
        json={"features": [0.25, -0.5, 0.75]},
    )
    assert no_token.status_code == 401

    wrong_length = client.post(
        "/v1/predict",
        headers=auth(),
        json={"features": [1, 2]},
    )
    assert wrong_length.status_code == 422

    extra_field = client.post(
        "/v1/predict",
        headers=auth(),
        json={"features": [1, 2, 3], "debug": True},
    )
    assert extra_field.status_code == 422


def test_checksum_failure_is_detected(tmp_path: Path):
    model_path = tmp_path / "model.json"
    checksum_path = tmp_path / "model.sha256"
    model_path.write_text('{"changed": true}', encoding="utf-8")
    checksum_path.write_text(f"{'0' * 64}  model.json\n", encoding="utf-8")

    with pytest.raises(RuntimeError, match="checksum"):
        service.load_model(model_path, checksum_path)

    actual = hashlib.sha256(model_path.read_bytes()).hexdigest()
    checksum_path.write_text(f"{actual}  model.json\n", encoding="utf-8")
    with pytest.raises(KeyError):
        service.load_model(model_path, checksum_path)
