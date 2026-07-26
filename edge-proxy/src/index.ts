interface Env {
  SITE_ORIGIN: string;
}

const PUBLIC_HOSTS = new Set([
  "researchwithai.omarchoudhry.co.uk",
  "agenticresearch.omarchoudhry.co.uk",
  "interactivepaper.omarchoudhry.co.uk",
  "annotate.omarchoudhry.co.uk",
]);

const WORKSHOP_ROOTS = new Map([
  ["agenticresearch.omarchoudhry.co.uk", "/agentic-research"],
  ["interactivepaper.omarchoudhry.co.uk", "/interactive-paper"],
  ["annotate.omarchoudhry.co.uk", "/annotation-tools"],
]);

const FORWARDED_REQUEST_HEADERS = new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "cache-control",
  "if-modified-since",
  "if-none-match",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-url",
  "purpose",
  "range",
  "rsc",
  "user-agent",
]);

export function buildUpstreamUrl(
  configuredOrigin: string,
  incoming: URL,
  upstreamPath: string,
) {
  const origin = new URL(configuredOrigin);
  const upstreamUrl = new URL(origin);
  upstreamUrl.pathname = upstreamPath;
  upstreamUrl.search = incoming.search;
  if (upstreamUrl.origin !== origin.origin) {
    throw new Error("Resolved upstream escaped the configured origin.");
  }
  return { origin, upstreamUrl };
}

function appendVary(headers: Headers, value: string) {
  const current = headers.get("vary");
  const values = new Set(
    (current ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  values.add(value);
  headers.set("vary", [...values].join(", "));
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const incoming = new URL(request.url);

    if (!PUBLIC_HOSTS.has(incoming.hostname)) {
      return new Response("Unknown Research with AI hostname.", {
        status: 421,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed.", {
        status: 405,
        headers: {
          allow: "GET, HEAD",
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    const upstreamPath =
      incoming.pathname === "/"
        ? (WORKSHOP_ROOTS.get(incoming.hostname) ?? "/")
        : incoming.pathname;
    const { origin, upstreamUrl } = buildUpstreamUrl(
      env.SITE_ORIGIN,
      incoming,
      upstreamPath,
    );
    const upstreamHeaders = new Headers();
    for (const [name, value] of request.headers) {
      if (FORWARDED_REQUEST_HEADERS.has(name.toLowerCase())) {
        upstreamHeaders.set(name, value);
      }
    }
    upstreamHeaders.set("x-forwarded-host", incoming.hostname);
    upstreamHeaders.set("x-forwarded-proto", "https");

    const upstreamRequest = new Request(upstreamUrl, {
      headers: upstreamHeaders,
      method: request.method,
      redirect: "manual",
    });
    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);
    appendVary(responseHeaders, "X-Forwarded-Host");
    responseHeaders.delete("set-cookie");
    responseHeaders.delete("nel");
    responseHeaders.delete("report-to");
    responseHeaders.delete("reporting-endpoints");
    responseHeaders.set(
      "content-security-policy",
      "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
    );
    responseHeaders.set(
      "permissions-policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    responseHeaders.set("referrer-policy", "no-referrer");
    responseHeaders.set(
      "strict-transport-security",
      "max-age=31536000; includeSubDomains",
    );
    responseHeaders.set("x-content-type-options", "nosniff");
    responseHeaders.set("x-frame-options", "DENY");

    const location = responseHeaders.get("location");
    if (location) {
      const redirect = new URL(location, origin);
      if (redirect.origin === origin.origin) {
        redirect.protocol = incoming.protocol;
        redirect.host = incoming.host;
        responseHeaders.set("location", redirect.toString());
      }
    }

    return new Response(upstreamResponse.body, {
      headers: responseHeaders,
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
    });
  },
};

export default worker;
