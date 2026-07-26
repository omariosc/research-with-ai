# From paper model to portable inference service

This teaching pack wraps a real, transparent calculation in a small API, locks
its Python dependencies, verifies the model bytes, and runs it inside a
least-privilege container. It is designed to work as a CPU reference on
`linux/amd64` and `linux/arm64`.

The model is synthetic. Passing this lab says that the service mechanics work.
It says nothing about research accuracy, clinical validity, fairness,
availability, or security against every threat.

## What you will keep

- A typed inference contract
- A model card and SHA-256 checksum
- A hash-locked dependency file
- Positive and negative API tests
- A non-root Docker image
- A localhost-only Compose profile
- A multi-platform build plan
- A target-hardware acceptance record
- A remote-access decision and rollback route

Allow 45 to 60 minutes for the core route. Native Raspberry Pi and Jetson tests
take longer.

## File map

```text
model-container-service/
|-- app/
|   |-- __init__.py
|   `-- main.py
|-- model/
|   |-- model-card.md
|   |-- model.json
|   `-- model.sha256
|-- tests/
|   `-- test_api.py
|-- Dockerfile
|-- compose.yaml
|-- deployment-record.md
|-- requirements.in
|-- requirements.lock
|-- requirements-test.in
`-- requirements-test.lock
```

Do not replace `model.json` with a pickle or joblib file from an untrusted
source. Python deserialisation can execute code. A real service should use a
reviewed format and still verify numerical equivalence with the research
implementation.

## 1. Read the contract

The service accepts exactly three finite numbers, each from -10 to 10:

```json
{
  "features": [0.25, -0.5, 0.75]
}
```

It returns the model ID and checksum with every prediction. `/healthz` reports
that the process responds. `/readyz` is available only after startup has
verified and loaded the model. `/v1/metadata` exposes the public contract
without exposing weights or secrets.

## 2. Run the tests without Docker

Use Python 3.12 and install the committed test lock:

```bash
uv venv --python 3.12
uv pip sync requirements-test.lock
PYTHONDONTWRITEBYTECODE=1 uv run --no-project \
  python -m pytest -q -p no:cacheprovider
```

The tests cover the golden prediction, metadata, missing authentication,
wrong-length input, extra fields, and checksum failure.

To regenerate the locks after a reviewed dependency change:

```bash
uv pip compile \
  --python-version 3.12 \
  --universal \
  --generate-hashes \
  requirements.in \
  --output-file requirements.lock

uv pip compile \
  --python-version 3.12 \
  --universal \
  --generate-hashes \
  requirements-test.in \
  --output-file requirements-test.lock
```

Review the resolved versions and licence changes before committing them.

## 3. Build and run locally

Create a local secret file that Git and the Docker build context both ignore:

```bash
mkdir -p .secrets
openssl rand -base64 -out .secrets/api_token 32
chmod 600 .secrets/api_token
export MODEL_API_TOKEN_FILE="$PWD/.secrets/api_token"
export MODEL_API_TOKEN="$(tr -d '\n' < "$MODEL_API_TOKEN_FILE")"

docker compose config --quiet
docker compose up --build --detach --wait --wait-timeout 60
docker compose ps
```

Compose mounts this file at `/run/secrets/api_token`. It is not copied into the
image or recorded in `compose.yaml`. Use a managed secret store in a maintained
deployment rather than keeping a long-lived token in the project folder. Some
Compose runtimes do not preserve custom UID, GID, or mode fields for file-backed
secrets, so this portable example does not claim that they do. It instead uses
a host file restricted to its owner and a single non-root service process.

The host mapping is `127.0.0.1:8080:8080`. Keeping the host address explicit
matters. A mapping such as `8080:8080` normally publishes on every interface.

Check readiness and metadata:

```bash
curl --fail http://127.0.0.1:8080/readyz
curl --fail http://127.0.0.1:8080/v1/metadata
```

Run the golden request:

```bash
curl --fail-with-body \
  --header "Authorization: Bearer ${MODEL_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{"features":[0.25,-0.5,0.75]}' \
  http://127.0.0.1:8080/v1/predict
```

The expected probability is `0.619517`, which maps to class 1.

## 4. Prove that bad requests fail

Missing token, expect HTTP 401:

```bash
curl --silent --output /dev/null --write-out "%{http_code}\n" \
  --header "Content-Type: application/json" \
  --data '{"features":[0.25,-0.5,0.75]}' \
  http://127.0.0.1:8080/v1/predict
```

Wrong input length, expect HTTP 422:

```bash
curl --silent --output /dev/null --write-out "%{http_code}\n" \
  --header "Authorization: Bearer ${MODEL_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{"features":[1,2]}' \
  http://127.0.0.1:8080/v1/predict
```

Check the runtime boundary:

```bash
docker compose exec api id
docker compose exec api sh -c 'touch /app/should-fail'
docker compose ps
docker compose logs api
```

The UID should be non-zero, the write should fail, health should be green, and
the logs should contain neither the token nor request features.

Stop the service:

```bash
docker compose down
unset MODEL_API_TOKEN
unset MODEL_API_TOKEN_FILE
rm .secrets/api_token
```

## 5. Build for x86-64 and ARM64

```bash
docker buildx create \
  --name portable-model-builder \
  --driver docker-container \
  --bootstrap \
  --use

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag ghcr.io/YOUR-NAME/portable-model-api:v0.1.0 \
  --provenance=mode=max \
  --sbom=true \
  --push \
  .
```

Replace the registry name and obtain approval before pushing. Record the
immutable manifest digest, base-image digest, SBOM, and provenance attestation.
A successful emulated build is not a native acceptance test.

## 6. Choose the target path

### Personal PC or server

Use the architecture that matches the host. Keep localhost binding for a
single-user service. If other people need access, add a maintained private or
public ingress layer and complete `deployment-record.md`.

### Raspberry Pi

Raspberry Pi 3, 4, and 5 support 64-bit Raspberry Pi OS. Use the `linux/arm64`
image, then test wheel availability, RAM, sustained temperature, throttling,
latency, and restart on the actual board. Very small or older 32-bit systems
need a different image and may not support the resolved packages.

### NVIDIA Jetson

Start with the ARM64 CPU reference if it meets the need. GPU use is a separate
release path. Record the exact board, JetPack, Jetson Linux, CUDA, TensorRT, and
NVIDIA Container Toolkit versions. Select a matching NVIDIA L4T or JetPack base
and compare every output with the CPU reference on a frozen golden set. An
arbitrary x86 CUDA image is not a valid Jetson base.

Publish CPU and Jetson GPU images as separate artefacts unless equivalence has
been demonstrated for the exact release.

## 7. Choose remote access deliberately

Use this order:

1. Localhost only for development and single-user work.
2. An authenticated private network such as Tailscale for a research team.
3. An access-controlled outbound tunnel such as Cloudflare Tunnel plus Access
   for a named HTTPS service.
4. Self-managed public ingress only when the team can maintain authentication,
   TLS, request and rate limits, patches, monitoring, incident response, and
   rollback.

Raw router port forwarding is not the default lab route. A router rule adds
reachability, not identity or encryption. Never publish the Docker daemon.
Never embed a shared bearer token in browser JavaScript.

For an interactive research website, keep service credentials server-side:

```text
visitor browser
      |
research website backend or edge function
      |
authenticated private ingress
      |
model container on localhost
```

No patient or confidential research input belongs in this teaching service.

## 8. Finish with evidence

Complete `deployment-record.md` with:

- source commit and model checksum
- model and code licences
- image and base-image digests
- dependency-lock checksum
- SBOM and build provenance
- native hardware and software versions
- direct-to-container prediction comparison
- 401 and 422 failures
- non-root and read-only checks
- latency, memory, and thermal results
- authentication and ingress path
- known limitations
- previous known-good digest and rollback result
- named human reviewer

A container is a delivery artefact. The scientific claim still depends on the
paper, data, preprocessing, evaluation, and independent human review.

## Primary references

- [Docker multi-platform builds](https://docs.docker.com/build/building/multi-platform/)
- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker Engine security](https://docs.docker.com/engine/security/)
- [Docker port publishing](https://docs.docker.com/engine/network/port-publishing/)
- [FastAPI containers](https://fastapi.tiangolo.com/deployment/docker/)
- [Raspberry Pi OS architecture](https://www.raspberrypi.com/documentation/computers/os.html)
- [NVIDIA Jetson container validation](https://docs.nvidia.com/jetson/archives/r36.3/DeveloperGuide/SD/TestPlanValidation.html)
- [Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve)
- [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/)
- [Python pickle warning](https://docs.python.org/3/library/pickle.html)

Code is MIT licensed. The synthetic `model.json` data are CC0-1.0.
