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
    "docs/images/agentic-research-systems.jpg":
      "4a10d2fdd128046a7df9dca4201d1d8577d9d5b50ca29fc705d72f092450ee7b",
    "docs/images/agentic-research-workspace.jpg":
      "0298a20d4edadee628e5d356f991778c9ded12a2f143ee287564bb23bc4056bd",
    "docs/images/annotation-tools-interactive-demo.jpg":
      "6c0662a29a99f2ab6b4e60e92f54b258205d990e5cf1f4cd651832d40cf0fd41",
    "docs/images/annotation-tools-lask-story.jpg":
      "228fca4589465bf9dadb5c4d55a6dd6f3733188b4792a31efcddd360840c7d97",
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

test("README links the tutorials, evidence, screenshots, and citations", async () => {
  const readme = await file("README.md", "utf8");
  const required = [
    "https://agenticresearch.omarchoudhry.co.uk",
    "https://interactivepaper.omarchoudhry.co.uk",
    "https://annotate.omarchoudhry.co.uk",
    "docs/images/research-with-ai-overview.jpg",
    "docs/images/agentic-research-systems.jpg",
    "docs/images/interactive-paper-container-lab.jpg",
    "docs/images/annotation-tools-interactive-demo.jpg",
    "public/reading-notes/agentic-science-systems-2026-07-26.md",
    "public/audits/annotation-tool-origin-story-2026-07-26.md",
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
