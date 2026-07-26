# Model service deployment record

## Identity

- Project:
- Accountable researcher:
- Repository URL:
- Commit:
- Model ID:
- Model SHA-256:
- Model licence:
- Intended use:
- Prohibited use:

## Container release

- Image name and immutable digest:
- Base image and immutable digest:
- Supported architectures:
- Dependency-lock SHA-256:
- SBOM:
- Build-provenance attestation:
- Previous known-good image digest:

## Target

- Device and processor:
- Operating system:
- Docker and Compose versions:
- JetPack, Jetson Linux, CUDA, and TensorRT, if used:
- Available RAM and storage:
- Power mode and thermal conditions:

## Acceptance evidence

- [ ] Model checksum verified before load
- [ ] Direct and container predictions agree on the golden fixture
- [ ] Missing authentication returns 401
- [ ] Malformed and oversized input is rejected
- [ ] Container runs as the expected non-root UID
- [ ] Root filesystem is read-only
- [ ] Health and readiness checks pass
- [ ] No token or raw input appears in logs
- [ ] Native target latency, memory, and temperature were measured
- [ ] Restart and rollback were tested

Record the command, output location, reviewer, date, threshold, and result for
each checked item. A checked box without the evidence is not a completed test.

## Access boundary

- Local, private team, or public:
- Host bind address:
- Authentication:
- TLS termination:
- VPN, tunnel, or gateway:
- Request and rate limits:
- Logging and retention:
- Patch owner:
- Credential-revocation route:

## Claim boundary

What has this deployment test established?

What has it not established about scientific performance, clinical validity,
security, availability, or target populations?

## Approval

- Reviewer:
- Decision: ready, revise, or stop
- Evidence location:
- Date:
- Rollback owner:
