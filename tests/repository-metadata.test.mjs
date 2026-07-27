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
    file("public/citations/research-with-ai-v1.3.0.bib", "utf8"),
  ]);
  const cff = YAML.parse(cffText);

  assert.equal(cff["cff-version"], "1.2.0");
  assert.equal(cff.version, "1.3.0");
  assert.equal(cff["date-released"], "2026-07-26");
  assert.equal(cff.url, "https://researchwithai.omarchoudhry.co.uk");
  assert.equal(
    cff["repository-code"],
    "https://github.com/omariosc/research-with-ai",
  );
  assert.equal(bib, publicBib);
  assert.equal(bib.match(/^@misc\{/gm)?.length, 4);

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
  ];
  for (const [title, url] of records) {
    assert.ok(bib.includes(title), title);
    assert.ok(bib.includes(url), url);
  }
});

test("repository screenshots remain pinned to the reviewed interface", async () => {
  const screenshots = {
    "docs/images/ai-healthcare-conference-case-study-development.jpg":
      "9d22de54c0f4ef237d203b789bcd2d632df4b1d7e5e8b66d039f8146a09b0b9b",
    "docs/images/agentic-research-systems.jpg":
      "4a10d2fdd128046a7df9dca4201d1d8577d9d5b50ca29fc705d72f092450ee7b",
    "docs/images/agentic-research-workspace.jpg":
      "0298a20d4edadee628e5d356f991778c9ded12a2f143ee287564bb23bc4056bd",
    "docs/images/annotation-tools-frame-annotator.jpg":
      "591fca1dd49a1eeb998da0d844db62417f73bf5ff4c12b011f3b1ee6b9f433c7",
    "docs/images/annotation-tools-lask-story.jpg":
      "228fca4589465bf9dadb5c4d55a6dd6f3733188b4792a31efcddd360840c7d97",
    "docs/images/annotation-tools-surgical-annotator.jpg":
      "2c6ed0d048ab286d08e88149f4963deed9d7d61dd65891e4a6a4b8beed6ee06d",
    "docs/images/interactive-paper-container-lab.jpg":
      "a59fa87da27f4890ddba71dbb06348b238dd688dd73451731bad7cd8ed5f5b82",
    "docs/images/mobile-overview.jpg":
      "fa6be3061e302aaa965b38eee2e24a3c2b012cbdb20570e5b447ecf5d2284f30",
    "docs/images/research-with-ai-overview.jpg":
      "9490b9be11bdfe1fc74efdefe413b7d2e978ca6dacb7b915e0590226b9252cc2",
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
    "docs/images/research-with-ai-overview.jpg",
    "docs/images/ai-healthcare-conference-case-study-development.jpg",
    "docs/images/agentic-research-systems.jpg",
    "docs/images/interactive-paper-container-lab.jpg",
    "docs/images/annotation-tools-frame-annotator.jpg",
    "docs/images/annotation-tools-surgical-annotator.jpg",
    "public/reading-notes/agentic-science-systems-2026-07-26.md",
    "public/audits/annotation-tool-origin-story-2026-07-26.md",
    "public/citations/annotation-showcase-media-2026-07-27.md",
    "public/citations/ai-healthcare-conference-operations-and-evaluation-2026-07-26.md",
    "public/worked-examples/model-container-service/README.md",
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
