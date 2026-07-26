import assert from "node:assert/strict";
import test from "node:test";
import worker, {
  buildUpstreamUrl,
} from "../edge-proxy/src/index.ts";

const SITE_ORIGIN =
  "https://research-with-ai-omar-2026.omarsc.chatgpt.site";

test("untrusted paths cannot escape the configured Sites origin", () => {
  for (const path of ["//example.com/collect", "/\\\\example.com/collect"]) {
    const incoming = new URL(
      `https://annotate.omarchoudhry.co.uk${path}?sample=1`,
    );
    const { upstreamUrl } = buildUpstreamUrl(SITE_ORIGIN, incoming, path);

    assert.equal(upstreamUrl.origin, new URL(SITE_ORIGIN).origin);
    assert.equal(upstreamUrl.search, "?sample=1");
  }
});

test("the edge proxy strips sensitive request and upstream response headers", async () => {
  const originalFetch = globalThis.fetch;
  let capturedRequest;
  globalThis.fetch = async (request) => {
    capturedRequest = request;
    return new Response("ok", {
      headers: {
        nel: "{}",
        "report-to": "{}",
        "set-cookie": "not-needed=true",
        "strict-transport-security": "max-age=0",
      },
    });
  };

  try {
    const response = await worker.fetch(
      new Request(
        "https://interactivepaper.omarchoudhry.co.uk//example.com/collect",
        {
          headers: {
            accept: "text/html",
            authorization: "Bearer secret",
            cookie: "private=true",
          },
        },
      ),
      { SITE_ORIGIN },
    );

    assert.equal(new URL(capturedRequest.url).origin, new URL(SITE_ORIGIN).origin);
    assert.equal(capturedRequest.headers.get("authorization"), null);
    assert.equal(capturedRequest.headers.get("cookie"), null);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(response.headers.get("nel"), null);
    assert.match(
      response.headers.get("strict-transport-security") ?? "",
      /max-age=31536000/,
    );
    assert.match(
      response.headers.get("content-security-policy") ?? "",
      /frame-ancestors 'none'/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("the edge proxy rejects methods the static tutorials do not use", async () => {
  const response = await worker.fetch(
    new Request("https://researchwithai.omarchoudhry.co.uk/", {
      method: "POST",
    }),
    { SITE_ORIGIN },
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("each public root maps only to its intended upstream route", async () => {
  const originalFetch = globalThis.fetch;
  const captured = [];
  globalThis.fetch = async (request) => {
    captured.push({
      url: request.url,
      forwardedHost: request.headers.get("x-forwarded-host"),
    });
    return new Response("ok");
  };

  try {
    const cases = [
      ["researchwithai.omarchoudhry.co.uk", "/"],
      ["agenticresearch.omarchoudhry.co.uk", "/agentic-research"],
      ["interactivepaper.omarchoudhry.co.uk", "/interactive-paper"],
      ["annotate.omarchoudhry.co.uk", "/annotation-tools"],
    ];

    for (const [hostname] of cases) {
      const response = await worker.fetch(
        new Request(`https://${hostname}/?release=1.1.0`),
        { SITE_ORIGIN },
      );
      assert.equal(response.status, 200);
    }

    assert.deepEqual(
      captured.map(({ url, forwardedHost }) => {
        const parsed = new URL(url);
        return [forwardedHost, parsed.pathname, parsed.search];
      }),
      cases.map(([hostname, path]) => [hostname, path, "?release=1.1.0"]),
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("worked pages and ranged downloads keep their exact path", async () => {
  const originalFetch = globalThis.fetch;
  let capturedRequest;
  globalThis.fetch = async (request) => {
    capturedRequest = request;
    return new Response("partial", { status: 206 });
  };

  try {
    const response = await worker.fetch(
      new Request(
        "https://interactivepaper.omarchoudhry.co.uk/worked-examples/medmnist-breast/medmnist-figure-1.jpg",
        { headers: { range: "bytes=0-99" } },
      ),
      { SITE_ORIGIN },
    );

    const upstream = new URL(capturedRequest.url);
    assert.equal(
      upstream.pathname,
      "/worked-examples/medmnist-breast/medmnist-figure-1.jpg",
    );
    assert.equal(capturedRequest.headers.get("range"), "bytes=0-99");
    assert.equal(
      capturedRequest.headers.get("x-forwarded-host"),
      "interactivepaper.omarchoudhry.co.uk",
    );
    assert.equal(response.status, 206);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("unknown hostnames are rejected before any upstream request", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/"),
    { SITE_ORIGIN },
  );

  assert.equal(response.status, 421);
  assert.match(await response.text(), /Unknown Research with AI hostname/);
});
