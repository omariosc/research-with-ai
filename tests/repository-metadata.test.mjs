import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import YAML from "yaml";

const root = new URL("../", import.meta.url);

function file(path, encoding) {
  return readFile(new URL(path, root), encoding);
}

test("platform and tutorial citations agree on titles, version, and URLs", async () => {
  const [cffText, bib, publicBib] = await Promise.all([
    file("CITATION.cff", "utf8"),
    file("CITATIONS.bib", "utf8"),
    file("public/citations/research-with-ai-v1.4.0.bib", "utf8"),
  ]);
  const cff = YAML.parse(cffText);

  assert.equal(cff["cff-version"], "1.2.0");
  assert.equal(cff.version, "1.4.0");
  assert.equal(cff["date-released"], "2026-07-27");
  assert.equal(cff.url, "https://researchwithai.omarchoudhry.co.uk");
  assert.equal(
    cff["repository-code"],
    "https://github.com/omariosc/research-with-ai",
  );
  assert.equal(bib, publicBib);
  assert.equal(bib.match(/^@misc\{/gm)?.length, 5);

  const records = [
    [
      "Research with AI Tutorial Platform",
      "https://researchwithai.omarchoudhry.co.uk",
    ],
    ["Agentic AI in Research", "https://agenticresearch.omarchoudhry.co.uk"],
    [
      "Building a Website for Your Research Using AI",
      "https://interactivepaper.omarchoudhry.co.uk",
    ],
    [
      "Developing Custom Annotation Tools Using AI",
      "https://annotate.omarchoudhry.co.uk",
    ],
    [
      "Run an AI in Healthcare Conference",
      "https://conferencewithai.omarchoudhry.co.uk",
    ],
  ];
  for (const [title, url] of records) {
    assert.ok(bib.includes(title), title);
    assert.ok(bib.includes(url), url);
  }
});

test("keeps the immutable v1.3 citation snapshot separate", async () => {
  const legacyBib = await file(
    "public/citations/research-with-ai-v1.3.0.bib",
    "utf8",
  );

  assert.equal(legacyBib.match(/^@misc\{/gm)?.length, 4);
  assert.match(legacyBib, /Version 1\.3\.0, released 26 July 2026/);
  assert.doesNotMatch(
    legacyBib,
    /conferencewithai\.omarchoudhry\.co\.uk/,
  );
});

test("repository screenshots remain pinned to the reviewed interface", async () => {
  const screenshots = {
    "docs/images/ai-healthcare-conference-case-study.jpg":
      "910904476675348da81be843dbb44ce45f5b5fdcb7062753633c804984b38ba2",
    "docs/images/agentic-research-systems.jpg":
      "5c661920d5279b2f663c3f7ff6db3b36c2e580d014a7346838d6436fcc1e6114",
    "docs/images/agentic-research-workspace.jpg":
      "646a262854fc702dce13a43b46c7e2c0a416d449e26fd10592342dfe288dc4eb",
    "docs/images/annotation-tools-frame-annotator.jpg":
      "4fd4d5c10a2e4caaeb1b4a6ae60450144d2f4709f35f059033ed09758d2cea90",
    "docs/images/annotation-tools-lask-story.jpg":
      "fed7ca745641df754411b56e2db349a1bb76edec65ca87d47690f6e6d0c594f3",
    "docs/images/annotation-tools-surgical-annotator.jpg":
      "e384d81b6fd99b0f4acc9614cc28ae44f8380065e05d08aa2673350aa3ec8244",
    "docs/images/interactive-paper-container-lab.jpg":
      "8da6b7c2286cb8eef7ed169f5f145f0ea6a0983f14173fc2883a9500fcae5e4a",
    "docs/images/interactive-paper-homepage-evidence.jpg":
      "94c122362c21eda8215545fa2fe4c2a3ab0f590bebdaf2fe879daef2670d2009",
    "docs/images/mobile-overview.jpg":
      "49cb969c2512b92de02eb75914c2dd60279814dbbd978ba49689312e70fbd72f",
    "docs/images/research-with-ai-overview.jpg":
      "cf7ccc2713f6228050afa0520594514ce8f2e665c95edb669b97aae870dd7175",
  };

  for (const [path, expected] of Object.entries(screenshots)) {
    const image = await file(path);
    assert.deepEqual([...image.subarray(0, 2)], [0xff, 0xd8], path);
    assert.equal(createHash("sha256").update(image).digest("hex"), expected, path);
  }
});

test("conference media match the permission and provenance record", async () => {
  const mediaRecord = await file(
    "public/citations/ai-healthcare-conference-media-2026-07-26.md",
    "utf8",
  );
  const photographs = {
    "audience-questions.jpg":
      "784332d5e22783668093bdddd588d605b9f48e0f53bbaaf1a1d8fc5bdaf56cca",
    "audience-wide.jpg":
      "2637e3eb12b8604feed09c5d1b79fc2ab8f9f6a34f7c229385af47616704de7b",
    "closing-mohammad-jawaad.jpg":
      "2e28b55e7b6021585825f9d14e2811b9ca886cf48da4d6865d1cd88ce4f0b68b",
    "conference-session-wide.jpg":
      "dfbcac164e05f5297bef95e08891803d959fd6b222d542dd47b9193826c59938",
    "healthcare-it-landscape.jpg":
      "9291ab3e1b380d4fc92c7d2f073b9a1be5f77b59900b25cbbbfa7c955e7cbf87",
    "nhs-data-ai-healthcare.jpg":
      "0b38a0635501edcfdbbd5db5d8d1b4f2552994abdca4a57961fe94e8773253f6",
    "opening-mohammad-jawaad.jpg":
      "5c23598800ab700d96049048021a536b39e4d94dd038d097f5f56a2228e0844b",
    "sharib-ali-surgical-vision.jpg":
      "76d122f1ae0a601f8e8a06d522d1cdbd2186f7f2f0fe01abb1bf5c9e57c08395",
  };
  assert.match(mediaRecord, /gave permission/);
  assert.match(mediaRecord, /does not establish a general-purpose licence/);

  for (const [name, expected] of Object.entries(photographs)) {
    const image = await file(`public/images/ai-healthcare-conference/${name}`);
    assert.deepEqual([...image.subarray(0, 2)], [0xff, 0xd8], name);
    assert.equal(createHash("sha256").update(image).digest("hex"), expected, name);
    assert.ok(mediaRecord.includes(name), name);
    assert.ok(mediaRecord.includes(expected), expected);
  }

  for (const name of [
    "organising-committee.jpg",
    "poster-discussion.jpg",
    "pizza-lunch.jpg",
    "schedule-poster.png",
  ]) {
    await assert.rejects(
      access(
        new URL(`public/images/ai-healthcare-conference/${name}`, root),
      ),
      (error) => error?.code === "ENOENT",
      name,
    );
  }

  assert.doesNotMatch(mediaRecord, /drive\.google\.com/i);
});

test("conference operations record is aggregate-only and traceable", async () => {
  const [record, readme, citing] = await Promise.all([
    file(
      "public/citations/ai-healthcare-conference-operations-and-evaluation-2026-07-26.md",
      "utf8",
    ),
    file("README.md", "utf8"),
    file("CITING.md", "utf8"),
  ]);
  const recordPath =
    "public/citations/ai-healthcare-conference-operations-and-evaluation-2026-07-26.md";

  assert.match(
    record,
    /^# AI in Healthcare Conference operations and evaluation record/m,
  );
  assert.match(record, /## Denominator ledger/);
  assert.match(record, /## Feedback results/);
  assert.match(record, /### Respondent context/);
  assert.match(record, /Student or trainee \| 21 \| 30/);
  assert.match(record, /## Advertised and revised programme/);
  assert.match(record, /## Organising structure/);
  assert.match(record, /No response rate is calculated/);
  assert.match(
    record,
    /6460f1db5abc0efea1f7e96fe424876aaf764dfcf54630d0996f3cac72022133/,
  );
  assert.match(
    record,
    /d05c267274df3ea2f6b2424ea2e23122416ae97cb578382c97b1669c6195b3ea/,
  );
  assert.doesNotMatch(
    record,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );
  assert.ok(readme.includes(recordPath));
  assert.ok(citing.includes(recordPath));
});

test("README links the tutorials, evidence, screenshots, and citations", async () => {
  const readme = await file("README.md", "utf8");
  const required = [
    "https://agenticresearch.omarchoudhry.co.uk",
    "https://interactivepaper.omarchoudhry.co.uk",
    "https://annotate.omarchoudhry.co.uk",
    "https://conferencewithai.omarchoudhry.co.uk",
    "docs/images/research-with-ai-overview.jpg",
    "docs/images/ai-healthcare-conference-case-study.jpg",
    "docs/images/agentic-research-systems.jpg",
    "docs/images/interactive-paper-container-lab.jpg",
    "docs/images/interactive-paper-homepage-evidence.jpg",
    "docs/images/annotation-tools-frame-annotator.jpg",
    "docs/images/annotation-tools-surgical-annotator.jpg",
    "public/reading-notes/agentic-science-systems-2026-07-26.md",
    "public/audits/annotation-tool-origin-story-2026-07-26.md",
    "public/citations/annotation-showcase-media-2026-07-27.md",
    "public/citations/paper2web-project-homepage-evidence-2026-07-27.md",
    "public/citations/ai-healthcare-conference-operations-and-evaluation-2026-07-26.md",
    "public/worked-examples/model-container-service/README.md",
    "public/audits/platform-release-v1.4.0-2026-07-27.md",
    "public/releases/research-with-ai-v1.4.0-source.zip",
    "public/releases/research-with-ai-v1.4.0-source.sha256",
    "public/schemas/annotation-spec-1.4.0.schema.json",
    "CITATION.cff",
    "CITATIONS.bib",
    "CITING.md",
  ];
  for (const value of required) assert.ok(readme.includes(value), value);
});

test("repository documentation has no broken relative file links", async () => {
  const markdownFiles = [
    "README.md",
    "CITING.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "docs/images/README.md",
    "docs/releases/v1.3.0.md",
    "docs/releases/v1.4.0.md",
  ];

  for (const path of markdownFiles) {
    const markdown = await file(path, "utf8");
    const targets = [
      ...[...markdown.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]),
      ...[...markdown.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
        (match) => match[1],
      ),
    ];
    for (const target of targets) {
      if (/^(?:https?:|mailto:|#)/i.test(target)) continue;
      const localPath = target.split(/[?#]/, 1)[0];
      if (!localPath) continue;
      await access(new URL(localPath, new URL(path, root)));
    }
  }
});

test("public repository workflows pin third-party actions by commit", async () => {
  const workflowPaths = [
    ".github/workflows/ci.yml",
    ".github/workflows/external-verification.yml",
  ];
  for (const path of workflowPaths) {
    const workflow = await file(path, "utf8");
    const uses = [...workflow.matchAll(/^\s*uses:\s*(\S+)/gm)].map(
      (match) => match[1],
    );
    assert.ok(uses.length > 0, path);
    for (const action of uses) {
      assert.match(action, /@[0-9a-f]{40}$/, action);
    }
  }

  const communityFiles = [
    ".github/CODEOWNERS",
    ".github/ISSUE_TEMPLATE/bug-report.yml",
    ".github/ISSUE_TEMPLATE/content-or-citation-correction.yml",
    ".github/ISSUE_TEMPLATE/learner-feedback.yml",
    ".github/pull_request_template.md",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
  ];
  await Promise.all(
    communityFiles.map((path) => access(new URL(path, root))),
  );
});

test("GitHub workflows and forms are valid YAML documents", async () => {
  const yamlFiles = [
    ".github/dependabot.yml",
    ".github/release.yml",
    ".github/workflows/ci.yml",
    ".github/workflows/external-verification.yml",
    ".github/ISSUE_TEMPLATE/bug-report.yml",
    ".github/ISSUE_TEMPLATE/config.yml",
    ".github/ISSUE_TEMPLATE/content-or-citation-correction.yml",
    ".github/ISSUE_TEMPLATE/learner-feedback.yml",
  ];
  for (const path of yamlFiles) {
    const document = YAML.parse(await file(path, "utf8"));
    assert.equal(typeof document, "object", path);
    assert.notEqual(document, null, path);
  }
});
