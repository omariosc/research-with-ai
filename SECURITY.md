# Security policy

## Supported version

Security fixes are applied to the current repository release. Historical
source snapshots remain immutable records and are not updated in place.

| Version | Supported |
| --- | --- |
| 1.4.x | Yes |
| 1.3.x and earlier | No |

## Report a vulnerability privately

Use
[GitHub private vulnerability reporting](https://github.com/omariosc/research-with-ai/security/advisories/new).
Do not open a public issue for a credential exposure, path traversal,
authentication bypass, unsafe container behaviour, or another vulnerability
that could put users or infrastructure at risk.

Include:

- the affected route, file, or component;
- the tested version and environment;
- clear reproduction steps using synthetic data;
- the impact and any required preconditions; and
- a suggested mitigation if you have one.

Do not test against patient data, third-party systems, or infrastructure you do
not own or have permission to assess.

## Scope

The main application is an educational site with unencrypted browser-local
project storage. It intentionally has no user account, application database, or
server-side research-data submission. The repository also contains a bounded
edge proxy and a synthetic model-service teaching pack.

The demonstrations are not clinical systems. A deployment of an adapted model,
annotation tool, or research service needs its own threat model, governance,
maintenance owner, and security review.
