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

    const origin = new URL(env.SITE_ORIGIN);
    const upstreamPath =
      incoming.pathname === "/"
        ? (WORKSHOP_ROOTS.get(incoming.hostname) ?? "/")
        : incoming.pathname;
    const upstreamUrl = new URL(
      `${upstreamPath}${incoming.search}`,
      origin,
    );
    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.delete("host");
    upstreamHeaders.set("x-forwarded-host", incoming.hostname);
    upstreamHeaders.set("x-forwarded-proto", "https");

    const upstreamRequest = new Request(upstreamUrl, {
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      headers: upstreamHeaders,
      method: request.method,
      redirect: "manual",
    });
    const upstreamResponse = await fetch(upstreamRequest);
    const responseHeaders = new Headers(upstreamResponse.headers);
    appendVary(responseHeaders, "X-Forwarded-Host");

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
