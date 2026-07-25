import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the platform overview and all three routes", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Research with AI<\/title>/i);
  assert.match(
    html,
    /Research with AI, without giving up scientific control\./,
  );
  assert.match(html, /href="\/agentic-research"/);
  assert.match(html, /href="\/interactive-paper"/);
  assert.match(html, /href="\/annotation-tools"/);
  assert.match(html, /No analytics or tracking cookies/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("renders the ten-stage agentic research workshop", async () => {
  const response = await render("/agentic-research");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Agentic AI in Research \| Research with AI<\/title>/i);
  assert.match(html, /Set the research contract/);
  assert.match(html, /Scale safely to HPC/);
  assert.match(html, /Validate independently/);
  assert.match(html, /Package, disclose, and release/);
  assert.match(html, /research_contract\.md/);
  assert.match(html, /Human checkpoint/);
});

test("renders the website brief and annotation interactions", async () => {
  const [paperResponse, annotationResponse] = await Promise.all([
    render("/interactive-paper"),
    render("/annotation-tools"),
  ]);

  assert.equal(paperResponse.status, 200);
  assert.equal(annotationResponse.status, 200);

  const paper = await paperResponse.text();
  const annotation = await annotationResponse.text();
  assert.match(paper, /Building a Website for Your Research Using AI/);
  assert.match(paper, /Give the agent a source map, not just a PDF/);
  assert.match(paper, /website_brief\.md/);
  assert.match(annotation, /Developing Custom Annotation Tools Using AI/);
  assert.match(annotation, /A tiny annotation loop/);
  assert.match(annotation, /annotation_spec\.yaml/);
  assert.match(annotation, /frame-annotator teaching demo/);
});

test("removes starter preview code and dependency", async () => {
  const [packageJson, page, layout] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
