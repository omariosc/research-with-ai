import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";

function decodeHtml(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function metaContent(html, attribute, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => candidate.includes(`${attribute}="${name}"`));
  const content = tag?.match(/\bcontent="([^"]*)"/i)?.[1];
  return content ? decodeHtml(content) : undefined;
}

function canonicalHref(html) {
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((candidate) => candidate.includes('rel="canonical"'));
  return tag?.match(/\bhref="([^"]*)"/i)?.[1];
}

async function render(path = "/", headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", ...headers },
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
  assert.match(html, /href="https:\/\/researchwithai\.omarchoudhry\.co\.uk\/worked-examples\/medmnist-breast"/);
  assert.match(html, /Local, not encrypted/);
  assert.match(html, /aria-label="Switch to dark mode"/);
  assert.match(html, /v1\.1\.0/);
  assert.match(html, /Skip to main content/);
  assert.match(html, /research-with-ai:theme/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("renders the ten-stage agentic research workshop", async () => {
  const response = await render("/agentic-research");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Agentic AI in Research \| Research with AI<\/title>/i);
  assert.match(html, /Set the research contract/);
  assert.match(html, /Scale safely to HPC/);
  assert.match(html, /Verify the result independently/);
  assert.match(html, /Package, disclose, and release/);
  assert.match(html, /research_contract\.md/);
  assert.match(html, /Human checkpoint/);
  assert.match(html, /Tutorial release: v1\.1\.0/);
  assert.match(html, /Know the route and the standard/);
  assert.match(
    html,
    /One table row, traced from paper to released predictions/,
  );
  assert.match(html, /0\.9014898357003620/);
  assert.match(html, /We re-evaluated three released test prediction files/);
  assert.match(html, /Choose what you would do next/);
  assert.match(html, /Plain-language glossary/);
  assert.match(html, /agent_retrieved: artefact or locator/);
  assert.match(html, /Record checkpoint review/);
  assert.ok(
    html.indexOf("Prespecify the reproduction or new study") <
      html.indexOf("Scale safely to HPC"),
  );
  assert.equal(
    metaContent(html, "property", "og:image"),
    "https://researchwithai.omarchoudhry.co.uk/research-with-ai-social.png",
  );
  assert.equal(
    metaContent(html, "name", "twitter:image"),
    "https://researchwithai.omarchoudhry.co.uk/research-with-ai-social.png",
  );
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
  assert.match(paper, /Publishing the same evidence without changing its claim/);
  assert.match(paper, /website_brief\.md/);
  assert.match(annotation, /Developing Custom Annotation Tools Using AI/);
  assert.match(annotation, /A tiny annotation loop/);
  assert.match(annotation, /annotation-spec\.yaml/);
  assert.match(annotation, /surgical-annotator workflow/);
  assert.match(annotation, /tutorial_version: &quot;1\.1\.0&quot;/);
  assert.match(annotation, /origin: &quot;manual&quot;/);
  assert.match(
    annotation,
    /href="\/schemas\/annotation-spec-1\.1\.0\.schema\.json"/,
  );
  assert.match(annotation, /frame_dimensions_px/);
  assert.match(annotation, /480/);
  assert.match(annotation, /percent_of_annotation_frame/);
  assert.match(annotation, /YOLO line exactly/);
  assert.match(annotation, /source_hash/);
  assert.doesNotMatch(annotation, /suggestion_status: human_edited/);
  assert.doesNotMatch(
    paper,
    /Connected to the paper, code, data, and reproduced result/,
  );
});

test("renders the MedMNIST evidence page and its three claim states", async () => {
  const response = await render("/worked-examples/medmnist-breast");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /BreastMNIST worked evidence pack \| Research with AI/);
  assert.match(html, /Paper reports/);
  assert.match(html, /We recalculated/);
  assert.match(html, /Not reproduced/);
  assert.match(html, /Three files, two metrics, one declared comparison/);
  assert.match(html, /Display precision/);
  assert.match(html, /medmnist-figure-1\.jpg/);
  assert.match(html, /Read the long description/);
  assert.match(html, /source-manifest\.json/);
  assert.match(html, /reproduction-report\.json/);
  assert.match(html, /verify\.py/);
  assert.match(html, /The released predictions do not identify their generating commit/);
  assert.equal(canonicalHref(html), "https://researchwithai.omarchoudhry.co.uk/worked-examples/medmnist-breast");
});

test("renders the version history and canonical workshop links", async () => {
  const response = await render("/versions");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Version history \| Research with AI/);
  assert.match(html, /Current tutorials, clearly versioned\./);
  assert.match(html, /Current content release/);
  assert.match(html, /v1\.1\.0/);
  assert.match(html, /v1\.0\.0/);
  assert.match(html, /agenticresearch\.omarchoudhry\.co\.uk/);
  assert.match(html, /interactivepaper\.omarchoudhry\.co\.uk/);
  assert.match(html, /annotate\.omarchoudhry\.co\.uk/);
  assert.match(html, /research-with-ai-v1\.1\.0-source\.zip/);
  assert.match(html, /bd3c4a2/);
});

test("publishes the reviewed source snapshot with its checksum", async () => {
  const archiveUrl = new URL(
    "../public/releases/research-with-ai-v1.1.0-source.zip",
    import.meta.url,
  );
  const checksumUrl = new URL(
    "../public/releases/research-with-ai-v1.1.0-source.sha256",
    import.meta.url,
  );
  const [archive, checksumRecord] = await Promise.all([
    readFile(archiveUrl),
    readFile(checksumUrl, "utf8"),
  ]);
  const digest = createHash("sha256").update(archive).digest("hex");

  assert.equal(digest, "d7a95965a7421c2fad8f7ffc166115d8e10694cbc39b6fd3958d3fb18cf17636");
  assert.match(checksumRecord, new RegExp(`^${digest}  research-with-ai-v1\\.1\\.0-source\\.zip\\n$`));
  assert.deepEqual([...archive.subarray(0, 2)], [0x50, 0x4b]);
});

test("server-renders complete workshop metadata at every custom-domain root", async () => {
  const cases = [
    {
      host: "agenticresearch.omarchoudhry.co.uk",
      title: "Agentic AI in Research",
      description:
        "Take one research question from field mapping to an independently checked, reproducible workflow. Use agents for the work they are good at, and keep scientific decisions with the researcher.",
      marker: "Write the research contract",
    },
    {
      host: "interactivepaper.omarchoudhry.co.uk",
      title: "Building a Website for Your Research Using AI",
      description:
        "Turn a paper and repository into a clear, accessible project website. Let AI organise and draft, then verify every claim, asset, demo, and release.",
      marker: "Give the agent a source map, not just a PDF",
    },
    {
      host: "annotate.omarchoudhry.co.uk",
      title: "Developing Custom Annotation Tools Using AI",
      description:
        "Turn an expert annotation protocol into a tested local tool and a traceable dataset. The first-hand case audits frame-annotator for clip and timeline classification and surgical-annotator for masks, keypoints, and multi-task geometry.",
      marker: "Turn an annotation protocol into software requirements",
    },
  ];

  for (const entry of cases) {
    const response = await render("/", {
      host: "researchwithai.omarchoudhry.co.uk",
      "x-forwarded-host": entry.host,
    });
    assert.equal(response.status, 200);
    const html = await response.text();
    const canonical = `https://${entry.host}`;

    assert.match(html, new RegExp(`${entry.title} \\| Research with AI`));
    assert.match(html, new RegExp(entry.marker));
    assert.equal(canonicalHref(html), canonical);
    assert.equal(metaContent(html, "property", "og:title"), entry.title);
    assert.equal(
      metaContent(html, "property", "og:description"),
      entry.description,
    );
    assert.equal(metaContent(html, "property", "og:url"), canonical);
    assert.equal(
      metaContent(html, "property", "og:image"),
      "https://researchwithai.omarchoudhry.co.uk/research-with-ai-social.png",
    );
    assert.equal(metaContent(html, "name", "twitter:title"), entry.title);
    assert.equal(
      metaContent(html, "name", "twitter:description"),
      entry.description,
    );
    assert.equal(
      metaContent(html, "name", "twitter:image"),
      "https://researchwithai.omarchoudhry.co.uk/research-with-ai-social.png",
    );
    assert.doesNotMatch(
      html,
      /Research with AI, without giving up scientific control\./,
    );
  }
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

test("ships a versioned annotation specification schema", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../public/schemas/annotation-spec-1.1.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, "1.1.0");
  assert.equal(schema.properties.data.properties.raw_data_immutable.const, true);
  assert.deepEqual(
    schema.properties.data.properties.deidentification.properties.status.enum,
    ["not_reviewed", "approved", "not_applicable", "failed"],
  );
  assert.equal(
    schema.properties.validation.properties.round_trip_required.const,
    true,
  );
  assert.deepEqual(
    schema.properties.provenance.required,
    [
      "annotation_id",
      "revision_id",
      "annotator_id",
      "protocol_version",
      "source_hash",
      "frame_index_or_time",
      "coordinate_convention_and_units",
      "created_at",
      "updated_at",
      "review_state",
    ],
  );
  assert.equal(schema.properties.labels.type, "object");
  assert.equal(schema.properties.tasks.type, "object");
});

test("pins the exact source asset used by the annotation demo", async () => {
  const asset = await readFile(
    new URL("../public/frame-annotator-safety-interface.png", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(asset).digest("hex"),
    "87c105e2c0fed14477179052dc08d953441cc7cb483fa5680ec490b23a8cc97c",
  );
});

test("generated annotation YAML parses and validates against its schema", async () => {
  const [response, schemaText] = await Promise.all([
    render("/annotation-tools"),
    readFile(
      new URL(
        "../public/schemas/annotation-spec-1.1.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  const html = await response.text();
  const match = html.match(
    /<span>annotation-spec\.yaml<\/span><span>local draft<\/span><\/div><pre>([\s\S]*?)<\/pre>/,
  );
  assert.ok(match, "default annotation YAML should be rendered");
  const spec = parseYaml(decodeHtml(match[1]));
  const schema = JSON.parse(schemaText);
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert.equal(validate(spec), true, JSON.stringify(validate.errors, null, 2));
  assert.equal(spec.data.deidentification.status, "not_reviewed");
  assert.equal(spec.data.deidentification.reviewer, null);

  for (const task of Object.values(spec.tasks)) {
    for (const labelId of task.target_label_ids) {
      assert.ok(
        Object.hasOwn(spec.labels, labelId),
        `task references unknown label ${labelId}`,
      );
    }
  }

  const duplicateTarget = structuredClone(spec);
  const firstTask = Object.values(duplicateTarget.tasks)[0];
  firstTask.target_label_ids.push(firstTask.target_label_ids[0]);
  assert.equal(validate(duplicateTarget), false);

  const missingProvenance = structuredClone(spec);
  delete missingProvenance.provenance.review_state;
  assert.equal(validate(missingProvenance), false);

  const unsupportedApproval = structuredClone(spec);
  unsupportedApproval.data.deidentification.status = "approved";
  assert.equal(validate(unsupportedApproval), false);
});

test("publishes methods, privacy, accessibility, and AI-use boundaries", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Methods, privacy, and accessibility/);
  assert.match(html, /Local does not mean secret/);
  assert.match(html, /WCAG 2\.2 AA is the target/);
  assert.match(html, /Assistance was substantial and disclosed/);
  assert.match(html, /The BreastMNIST case pins the paper/);
  assert.match(html, /source and rights manifest/);
  assert.match(html, /Clear tutorial data on this address/);
});
