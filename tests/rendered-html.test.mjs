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

function assertAppearsInOrder(html, labels) {
  let previousIndex = -1;
  for (const label of labels) {
    const index = html.indexOf(label);
    assert.notEqual(index, -1, `Expected rendered HTML to include "${label}"`);
    assert.ok(
      index > previousIndex,
      `Expected "${label}" to appear after "${labels[labels.indexOf(label) - 1]}"`,
    );
    previousIndex = index;
  }
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

test("server-renders the platform overview and all four routes", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Research with AI<\/title>/i);
  assert.match(
    html,
    /Research with AI, without giving up scientific control\./,
  );
  assert.equal(canonicalHref(html), "https://researchwithai.omarchoudhry.co.uk");
  assert.equal(
    metaContent(html, "property", "og:url"),
    "https://researchwithai.omarchoudhry.co.uk",
  );
  assert.match(html, /href="\/agentic-research"/);
  assert.match(html, /href="\/interactive-paper"/);
  assert.match(html, /href="\/annotation-tools"/);
  assert.match(html, /href="\/ai-healthcare-conference"/);
  assert.match(
    html,
    /href="https:\/\/github\.com\/omariosc\/research-with-ai"/,
  );
  assert.doesNotMatch(html, /href="https:\/\/github\.com\/omariosc"/);
  assert.match(html, /href="https:\/\/researchwithai\.omarchoudhry\.co\.uk\/worked-examples\/medmnist-breast"/);
  assert.doesNotMatch(html, /Local, not encrypted/);
  assert.doesNotMatch(html, /Never enter patient data/);
  assert.match(html, /aria-label="Switch to dark mode"/);
  assert.match(html, /v1\.4\.0/);
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
  assert.match(html, /Draft, review, and revise traceably/);
  assert.match(html, /Package, disclose, and release/);
  assert.match(html, /research_contract\.md/);
  assert.match(html, /Human checkpoint/);
  assert.match(html, /Tutorial release: v1\.4\.0/);
  assert.match(html, /Active project/);
  assert.match(html, /My first project/);
  assert.match(html, /How this tutorial works/);
  assert.match(html, /One project, one track, one stage at a time/);
  assert.match(html, /What makes the workflow agentic\?/);
  assert.match(html, /Google Co-Scientist/);
  assert.match(html, /Medical AI Scientist/);
  assert.match(html, /arXiv:2606\.15497/);
  assert.match(html, /Original reading-note appendix/);
  assert.match(html, /Start with today/);
  assert.match(
    html,
    /One table row, traced from paper to released predictions/,
  );
  assert.match(html, /0\.9014898357003620/);
  assert.match(html, /We re-evaluated three released test prediction files/);
  assert.match(html, /Choose what you would do next/);
  assert.match(html, /Plain-language glossary/);
  assert.match(html, /agent_retrieved: artefact or locator/);
  assert.match(html, /4\. Record human review/);
  assert.match(html, /Follow the whole lifecycle or focus on what you need/);
  assert.match(html, /Research orientation/);
  assert.match(html, /Suggested workshop track/);
  assert.match(html, /name="workshop-route"/);
  assert.match(html, /Beginning-to-end lifecycle phases/);
  assert.match(html, /Optional stage guide/);
  assert.match(html, /Compare approaches, terms and researcher tips/);
  assert.match(html, /Optional terms for this stage/);
  assert.match(html, /Approval gate/);
  assert.match(html, /Optional researcher tips/);
  assert.match(html, /Choose an approach for this stage/);
  assert.match(html, /Hosted planning assistant/);
  assert.match(html, /Data boundary/);
  assert.match(html, /No approach selected/);
  assert.match(html, /Optional practice/);
  assert.match(html, /small checks/);
  assert.match(html, /Guidance checked/);
  assert.match(html, /2026-07-27/);
  assert.match(html, /AI review throughout the paper lifecycle/);
  assert.match(html, /Find weak decisions while they can still be changed/);
  assert.match(html, /Stanford Agentic Reviewer/);
  assert.match(html, /first 15 pages of an English PDF up to 10 MB/);
  assert.match(html, /A powerful permitted model with high reasoning effort/);
  assert.match(html, /Permission comes before upload/);
  assert.match(html, /Durable review record/);
  assert.match(html, /Prompt for a critical paper review/);
  assert.match(html, /Use only for upload-permitted English manuscripts/);
  assert.match(
    html,
    /Never upload an unpublished or confidential draft unless the service, venue, institution, and collaborators permit it/,
  );
  assert.match(html, /Review issue ledger/);
  assert.match(html, /critical but fair reviewer/);
  assert.match(html, /What this review may have misunderstood/);
  assert.match(html, /Example prompt/);
  assert.match(html, />Copy</);
  assert.match(html, /aria-label="What does output to save mean\?"/);
  assert.match(html, /OpenAlex developer documentation/);
  assert.doesNotMatch(html, /role="tooltip"/);
  assertAppearsInOrder(html, [
    "Read one paper against its evidence",
    "Draft, review, and revise traceably",
    "Package, disclose, and release",
  ]);
  assertAppearsInOrder(html, [
    "How this tutorial works",
    "Active project",
    "Choose a workshop track",
    "Work one stage at a time",
    "Write the contract before the first prompt",
    "Optional, after the core stages",
    "One table row, traced from paper to released predictions",
    "What makes the workflow agentic?",
    "Choose what you would do next",
  ]);
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
  assert.match(paper, /Fast public companion/);
  assert.match(paper, /Hosted structured interview/);
  assert.match(paper, /Reader task/);
  assert.match(
    paper,
    /Project websites are established, but still far from routine/,
  );
  assert.match(paper, /Homepage prevalence in the Paper2Web corpus/);
  assert.match(paper, /10,716/);
  assert.match(paper, /85,843/);
  assert.match(paper, /96,559/);
  assert.match(paper, /11\.1%/);
  assert.match(paper, /About one paper in nine/);
  assert.match(paper, /No homepage identified/);
  assert.match(
    paper,
    /Of 96,559 papers, 10,716 or 11\.1 percent had a verified project homepage/,
  );
  assert.match(
    paper,
    /href="\/citations\/paper2web-project-homepage-evidence-2026-07-27\.md"/,
  );
  assert.match(paper, /What does “not identified” mean\?/);
  assert.match(paper, /No paper figure or third-party website screenshot/);
  assert.match(paper, /Turn a model into a portable service/);
  assert.match(paper, /Raspberry Pi 3, 4, or 5/);
  assert.match(paper, /NVIDIA Jetson/);
  assert.match(paper, /model-container-service\.zip/);
  assert.match(paper, /Port forwarding is not the deployment plan/);
  assert.match(annotation, /Developing Custom Annotation Tools Using AI/);
  assert.match(annotation, /Two tools, two different annotation jobs/);
  assert.match(annotation, /aria-label="Choose annotation tool"/);
  assert.match(annotation, /id="frame-annotator-tab"/);
  assert.match(annotation, /aria-controls="frame-annotator-panel"/);
  assert.match(annotation, /id="surgical-annotator-tab"/);
  assert.match(annotation, /aria-controls="surgical-annotator-panel"/);
  assert.match(annotation, /Classify frame ranges on a timeline/);
  assert.match(annotation, /Draw masks, lines, keypoints, and phases/);
  assert.match(
    annotation,
    /These are exactly the first three permitted repository samples in canonical order/,
  );
  assert.match(annotation, /frame_0000\.png/);
  assert.match(annotation, /frame_0001\.png/);
  assert.match(annotation, /frame_0002\.png/);
  assert.match(annotation, /Reset starter/);
  assert.match(annotation, /Local draft only/);
  assert.match(annotation, /This is the real frame-annotator shape/);
  assert.match(
    annotation,
    /href="\/citations\/annotation-showcase-media-2026-07-27\.md"/,
  );
  assert.match(annotation, /From a fast beta to the LASK workflow/);
  assert.match(annotation, /Open LASK v1\.0 on Zenodo/);
  assert.match(annotation, /A project that needed a faster workflow/);
  assert.match(annotation, /2025 Hamlyn Winter School/);
  assert.match(annotation, /What the annotation work enabled/);
  assert.match(annotation, /324,101 frames/);
  assert.match(annotation, /3,725 bounding-box-labelled frames/);
  assert.match(annotation, /994 synchronised/);
  assert.match(annotation, /116 labelled clips/);
  assert.match(annotation, /Know Your ABCs/);
  assert.match(annotation, /The beta became inspectable and reusable/);
  assert.match(annotation, /BTPN carried the labels into an accepted paper/);
  assert.match(annotation, /accepted to MICCAI 2026/);
  assert.match(annotation, /No proceedings DOI is claimed yet/);
  assert.match(
    annotation,
    /href="https:\/\/eprints\.whiterose\.ac\.uk\/id\/eprint\/230457\/"/,
  );
  assert.match(
    annotation,
    /href="https:\/\/github\.com\/omariosc\/BTPN"/,
  );
  assert.match(annotation, /Author account/);
  assert.doesNotMatch(annotation, /annotation-synthetic-frame\.svg/);
  assert.doesNotMatch(annotation, /A tiny annotation loop/);
  assert.match(annotation, /annotation-spec\.yaml/);
  assert.match(annotation, /tutorial_version: &quot;1\.4\.0&quot;/);
  assert.match(annotation, /schema_version: &quot;1\.4\.0&quot;/);
  assert.match(annotation, /origin: &quot;manual&quot;/);
  assert.match(
    annotation,
    /href="\/schemas\/annotation-spec-1\.4\.0\.schema\.json"/,
  );
  assert.match(annotation, /YOLO line exactly/);
  assert.match(annotation, /source_hash/);
  assert.match(annotation, /Local offline workflow/);
  assert.match(annotation, /Approved hosted boundary/);
  assert.match(annotation, /Residual risk/);
  assert.match(annotation, /implementation-record\.md/);
  assert.match(annotation, /release-verification\.md/);
  assert.doesNotMatch(annotation, /suggestion_status: human_edited/);
  assert.doesNotMatch(
    paper,
    /Connected to the paper, code, data, and reproduced result/,
  );
  assertAppearsInOrder(paper, [
    "How this tutorial works",
    "Active project",
    "Choose a workshop track",
    "Work one stage at a time",
    "Give the agent a source map, not just a PDF",
    "Optional, after the core stages",
    "Publishing the same evidence without changing its claim",
    "Project websites are established, but still far from routine",
    "Turn a model into a portable service",
    "Choose what you would do next",
  ]);
  assertAppearsInOrder(annotation, [
    "How this tutorial works",
    "Active project",
    "Choose a workshop track",
    "Work one stage at a time",
    "Two tools, two different annotation jobs",
    "Turn an annotation protocol into software requirements",
    "Optional, after the core stages",
    "From a fast beta to the LASK workflow",
    "What the annotation work enabled",
    "Choose what you would do next",
  ]);
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

test("renders the ten-stage AI in healthcare conference workshop", async () => {
  const response = await render("/ai-healthcare-conference");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(
    html,
    /<title>Run an AI in Healthcare Conference \| Research with AI<\/title>/i,
  );
  assert.match(
    html,
    /A student-led conference built from local relationships/,
  );
  assert.match(html, /conferencewithai\.omarchoudhry\.co\.uk/);
  assert.match(html, /Active project/);
  assert.match(html, /How this tutorial works/);
  assert.match(html, /One project, one track, one stage at a time/);
  assert.match(html, /name="workshop-route"/);
  assert.match(html, /Tutorial release: v1\.4\.0/);
  assert.match(html, /Tutorial v1\.4\.0/);
  assert.match(html, /id="conference-committee-title"/);
  assert.match(html, /Conference co-chairs/);
  assert.match(html, /Financial officer/);
  assert.match(html, /AI Week chair and webmaster/);
  assert.match(html, /Speaker coordinators/);
  assert.match(html, /id="conference-programme-comparison-title"/);
  assert.match(html, /Advertised web agenda/);
  assert.match(html, /Workshop 2: TBA/);
  assert.match(html, /Did not run/);
  assert.match(html, /organiser joined the final panel/i);
  assert.match(html, /Swipe sideways to see the decision record/);
  assert.match(html, /id="conference-denominator-ledger-title"/);
  assert.match(html, /135 rows/);
  assert.match(html, /67 marked HERE/);
  assert.match(html, /about 74/);
  assert.match(html, /30 responses/);
  assert.match(
    html,
    /aria-label="Of 178 RSVP response rows, 78 were accepted, 6 declined and 94 had no response\."/,
  );
  assert.match(html, /No feedback response rate is reported/);
  assert.match(html, /id="conference-feedback-chart-title"/);
  assert.match(
    html,
    /Show the whole scale and the spread, not only a flattering mean/,
  );
  assert.match(
    html,
    /aria-label="Overall satisfaction: 4\.63 out of 5 from 30 responses"/,
  );
  assert.match(
    html,
    /aria-label="Value of the content: 4\.67 out of 5 from 30 responses"/,
  );
  assert.match(
    html,
    /aria-label="Organisation: 4\.73 out of 5 from 30 responses"/,
  );
  assert.match(html, /21 of 30 respondents as students or trainees/);
  assert.match(
    html,
    /href="\/citations\/ai-healthcare-conference-operations-and-evaluation-2026-07-26\.md"/,
  );
  assert.doesNotMatch(html, /Conference in development|in development, not part/);
  assertAppearsInOrder(html, [
    "How this tutorial works",
    "Active project",
    "Choose a workshop track",
    "Work one stage at a time",
    "Turn registrations into an honest operating range",
    "Optional, after the core stages",
    "A student-led conference built from local relationships",
    "Choose what you would do next",
  ]);
});

test("renders the version history and canonical workshop links", async () => {
  const response = await render("/versions");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Version history \| Research with AI/);
  assert.match(html, /Current tutorials, clearly versioned\./);
  assert.match(html, /Current content release/);
  assert.match(html, /v1\.4\.0/);
  assert.match(html, /All four workshops are in\s+the reviewed v1\.4\.0 release/i);
  assert.match(html, /v1\.2\.0/);
  assert.match(html, /v1\.1\.0/);
  assert.match(html, /v1\.0\.0/);
  assert.match(html, /agenticresearch\.omarchoudhry\.co\.uk/);
  assert.match(html, /interactivepaper\.omarchoudhry\.co\.uk/);
  assert.match(html, /annotate\.omarchoudhry\.co\.uk/);
  assert.match(html, /conferencewithai\.omarchoudhry\.co\.uk/);
  assert.match(html, /Four complete tutorials and refreshed evidence/);
  assert.doesNotMatch(html, /Workshop 04|In development/);
  assert.match(html, /research-with-ai-v1\.4\.0-source\.zip/);
  assert.match(html, /research-with-ai-v1\.3\.0-source\.zip/);
  assert.match(html, /32b46f3/);
  assert.match(html, /research-with-ai-v1\.2\.0-source\.zip/);
  assert.match(html, /a304472/);
  assert.match(html, /research-with-ai-v1\.1\.0-source\.zip/);
  assert.match(html, /bd3c4a2/);
});

test("keeps the reviewed v1.3 source snapshot pinned without nested archives", async () => {
  const archiveUrl = new URL(
    "../public/releases/research-with-ai-v1.3.0-source.zip",
    import.meta.url,
  );
  const checksumUrl = new URL(
    "../public/releases/research-with-ai-v1.3.0-source.sha256",
    import.meta.url,
  );
  const [archive, checksumRecord] = await Promise.all([
    readFile(archiveUrl),
    readFile(checksumUrl, "utf8"),
  ]);
  const digest = createHash("sha256").update(archive).digest("hex");

  assert.equal(
    digest,
    "fa7b5e0bd466af1608b28580926f21c288f30d4ced081a066c220358168d3054",
  );
  assert.equal(
    checksumRecord,
    `${digest}  research-with-ai-v1.3.0-source.zip\n`,
  );
  assert.deepEqual([...archive.subarray(0, 2)], [0x50, 0x4b]);
  const archiveIndex = archive.toString("latin1");
  assert.match(archiveIndex, /research-with-ai-v1\.3\.0\/package\.json/);
  assert.doesNotMatch(
    archiveIndex,
    /public\/releases\/research-with-ai-v1\.[12]\.0-source\.zip/,
  );
});

test("keeps the historical v1.2 source snapshot pinned", async () => {
  const archiveUrl = new URL(
    "../public/releases/research-with-ai-v1.2.0-source.zip",
    import.meta.url,
  );
  const checksumUrl = new URL(
    "../public/releases/research-with-ai-v1.2.0-source.sha256",
    import.meta.url,
  );
  const [archive, checksumRecord] = await Promise.all([
    readFile(archiveUrl),
    readFile(checksumUrl, "utf8"),
  ]);
  const digest = createHash("sha256").update(archive).digest("hex");

  assert.equal(
    digest,
    "73af076a357bd7800f8372dd4e9e4553a0e41d9d9901085651a78dd2ffd506ff",
  );
  assert.match(
    checksumRecord,
    new RegExp(`^${digest}  research-with-ai-v1\\.2\\.0-source\\.zip\\n$`),
  );
  assert.deepEqual([...archive.subarray(0, 2)], [0x50, 0x4b]);
});

test("every rendered local artefact reference resolves to a public file", async () => {
  const routes = [
    "/",
    "/about",
    "/agentic-research",
    "/ai-healthcare-conference",
    "/annotation-tools",
    "/interactive-paper",
    "/versions",
    "/worked-examples/medmnist-breast",
  ];
  const responses = await Promise.all(routes.map((route) => render(route)));
  const artefacts = new Set();

  for (const response of responses) {
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
      const value = decodeHtml(match[1]).split(/[?#]/, 1)[0];
      if (
        value.startsWith("/") &&
        /\.(?:csv|ico|jpg|json|lock|md|pdf|png|py|sha256|svg|toml|yaml|zip)$/i.test(
          value,
        )
      ) {
        artefacts.add(decodeURIComponent(value));
      }
    }
  }

  assert.ok(artefacts.size >= 20, "expected the tutorial artefact library");
  for (const path of artefacts) {
    await access(new URL(`../public${path}`, import.meta.url));
  }
});

test("keeps the historical v1.1 source snapshot pinned", async () => {
  const archive = await readFile(
    new URL(
      "../public/releases/research-with-ai-v1.1.0-source.zip",
      import.meta.url,
    ),
  );
  const digest = createHash("sha256").update(archive).digest("hex");

  assert.equal(
    digest,
    "d7a95965a7421c2fad8f7ffc166115d8e10694cbc39b6fd3958d3fb18cf17636",
  );
  assert.deepEqual([...archive.subarray(0, 2)], [0x50, 0x4b]);
});

test("server-renders complete workshop metadata at every custom-domain root", async () => {
  const cases = [
    {
      host: "agenticresearch.omarchoudhry.co.uk",
      title: "Agentic AI in Research",
      description:
        "Take one research question from field mapping to an independently checked, reproducible workflow. Use agents to search, build, test, and critique the work at meaningful decision points, while keeping scientific decisions with the researcher.",
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
    {
      host: "conferencewithai.omarchoudhry.co.uk",
      title: "Run an AI in Healthcare Conference",
      description:
        "Turn a local need into a safe, useful, and welcoming research event. Follow a first-hand Leeds AI Week case from purpose and partnerships through delivery, honest evaluation, and community follow-up.",
      marker: "A student-led conference built from local relationships",
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

test("ships the current versioned annotation specification schema", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../public/schemas/annotation-spec-1.4.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.tutorial_version.const, "1.4.0");
  assert.equal(schema.properties.schema_version.const, "1.4.0");
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

test("keeps the legacy v1.1.0 annotation schema pinned", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../public/schemas/annotation-spec-1.1.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  assert.equal(schema.properties.tutorial_version.const, "1.1.0");
  assert.equal(schema.properties.schema_version.const, "1.1.0");
});

test("keeps the legacy v1.2.0 annotation schema pinned", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../public/schemas/annotation-spec-1.2.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  assert.equal(schema.properties.tutorial_version.const, "1.2.0");
  assert.equal(schema.properties.schema_version.const, "1.2.0");
});

test("keeps the legacy v1.3.0 annotation schema pinned", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../public/schemas/annotation-spec-1.3.0.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  assert.equal(schema.properties.tutorial_version.const, "1.3.0");
  assert.equal(schema.properties.schema_version.const, "1.3.0");
});

test("pins the synthetic asset used only by the separate annotation round-trip fixture", async () => {
  const asset = await readFile(
    new URL(
      "../public/worked-examples/annotation-synthetic-frame.svg",
      import.meta.url,
    ),
  );
  assert.equal(
    createHash("sha256").update(asset).digest("hex"),
    "a13ab3684833e3bb14c87ff5eed4486c724ee794552dfaf55aa63a61caab7344",
  );
});

test("generated annotation YAML parses and validates against its schema", async () => {
  const [response, schemaText] = await Promise.all([
    render("/annotation-tools"),
    readFile(
      new URL(
        "../public/schemas/annotation-spec-1.4.0.schema.json",
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
  assert.equal(spec.tutorial_version, "1.4.0");
  assert.equal(spec.schema_version, "1.4.0");
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
