# Research with AI domain proxy

This Cloudflare Worker is configured to give the shared platform five stable
public hostnames without duplicating the application:

- `researchwithai.omarchoudhry.co.uk`
- `agenticresearch.omarchoudhry.co.uk`
- `interactivepaper.omarchoudhry.co.uk`
- `annotate.omarchoudhry.co.uk`
- `conferencewithai.omarchoudhry.co.uk`

It forwards requests to the tested Sites release, maps each dedicated root to
its workshop route, and preserves the public hostname in `x-forwarded-host`.
This keeps the standalone submissions reliable even if the upstream cache does
not vary on the forwarded hostname.

Cloudflare Custom Domains create the required DNS records and certificates.
The Worker does not collect analytics, set cookies, or store request data.

Validate before deployment:

```bash
npx wrangler deploy --dry-run --config edge-proxy/wrangler.jsonc
```

Deploy:

```bash
npx wrangler deploy --config edge-proxy/wrangler.jsonc
```
