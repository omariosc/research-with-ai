from __future__ import annotations

import hashlib
import json
import math
import os
import secrets
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, Any

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field, FiniteFloat

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = Path(
    os.getenv("MODEL_PATH", str(PROJECT_ROOT / "model" / "model.json"))
)
MODEL_SHA_PATH = Path(
    os.getenv(
        "MODEL_SHA256_PATH",
        str(PROJECT_ROOT / "model" / "model.sha256"),
    )
)
TOKEN_PATH = Path(
    os.getenv("API_TOKEN_FILE", "/run/secrets/api_token")
)


def load_model(
    model_path: Path = MODEL_PATH,
    checksum_path: Path = MODEL_SHA_PATH,
) -> tuple[dict[str, Any], str]:
    raw = model_path.read_bytes()
    actual = hashlib.sha256(raw).hexdigest()
    expected = checksum_path.read_text(encoding="utf-8").split()[0]

    if not secrets.compare_digest(actual, expected):
        raise RuntimeError("Model checksum does not match model.sha256")

    model = json.loads(raw)
    if len(model["feature_order"]) != len(model["weights"]):
        raise RuntimeError("Feature and weight counts differ")
    if len(model["class_map"]) != 2:
        raise RuntimeError("This teaching service expects two classes")
    return model, actual


def load_api_token(token_path: Path = TOKEN_PATH) -> str:
    token = token_path.read_text(encoding="utf-8").strip()
    if len(token) < 32:
        raise RuntimeError("API token must contain at least 32 characters")
    return token


def score(features: list[float], model: dict[str, Any]) -> float:
    linear = float(model["bias"]) + sum(
        float(weight) * value
        for weight, value in zip(model["weights"], features, strict=True)
    )
    return 1.0 / (1.0 + math.exp(-linear))


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model, app.state.model_sha256 = load_model()
    app.state.api_token = load_api_token()
    yield


docs_enabled = os.getenv("ENABLE_DOCS", "0") == "1"
app = FastAPI(
    title="Portable model API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if docs_enabled else None,
    redoc_url=None,
    openapi_url="/openapi.json" if docs_enabled else None,
)

FeatureValue = Annotated[FiniteFloat, Field(ge=-10.0, le=10.0)]


class PredictRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    features: Annotated[
        list[FeatureValue],
        Field(min_length=3, max_length=3),
    ]


class PredictResponse(BaseModel):
    model_id: str
    model_sha256: str
    probability: float
    class_id: int
    class_name: str
    threshold: float


class MetadataResponse(BaseModel):
    model_id: str
    model_sha256: str
    schema_version: str
    feature_order: list[str]
    input_units: list[str]
    class_map: dict[str, str]
    intended_use: str
    limitations: list[str]


def require_bearer(
    authorization: Annotated[str | None, Header()] = None,
) -> None:
    scheme, _, supplied = (authorization or "").partition(" ")
    expected = app.state.api_token
    if (
        scheme.lower() != "bearer"
        or not supplied
        or not secrets.compare_digest(supplied, expected)
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/healthz", include_in_schema=False)
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/readyz", include_in_schema=False)
def ready() -> dict[str, str]:
    return {"status": "ready"}


@app.get("/v1/metadata", response_model=MetadataResponse)
def metadata() -> MetadataResponse:
    model = app.state.model
    return MetadataResponse(
        model_id=model["model_id"],
        model_sha256=app.state.model_sha256,
        schema_version=model["schema_version"],
        feature_order=model["feature_order"],
        input_units=model["input_units"],
        class_map=model["class_map"],
        intended_use=model["intended_use"],
        limitations=model["limitations"],
    )


@app.post(
    "/v1/predict",
    dependencies=[Depends(require_bearer)],
    response_model=PredictResponse,
)
def predict(payload: PredictRequest) -> PredictResponse:
    model = app.state.model
    probability = score(payload.features, model)
    threshold = float(model["threshold"])
    class_id = int(probability >= threshold)
    return PredictResponse(
        model_id=model["model_id"],
        model_sha256=app.state.model_sha256,
        probability=round(probability, 6),
        class_id=class_id,
        class_name=model["class_map"][str(class_id)],
        threshold=threshold,
    )
