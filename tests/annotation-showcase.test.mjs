import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import {
  FRAME_CLASSES,
  FRAME_SAMPLES,
  FRAME_STARTER_CLIPS,
  SURGICAL_PHASES,
  SURGICAL_SAMPLES,
  SURGICAL_TOOLS,
  cloneValue,
  completedSurgicalComponents,
  frameClipsToCsv,
  geometryPresent,
  labelledFrameCount,
  pointWithinFrame,
  surgicalToolDefinition,
} from "../lib/annotation-showcase.ts";

const manifestUrl = new URL(
  "../public/worked-examples/annotation-showcase/manifest.json",
  import.meta.url,
);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

const expectedFrameFiles = Array.from(
  { length: 10 },
  (_, index) => `frame_${String(index).padStart(4, "0")}.png`,
);
const expectedFrameIds = Array.from(
  { length: 10 },
  (_, index) => `frame-${String(index).padStart(4, "0")}`,
);
const expectedSurgicalFrames = [200, 1000, 1800];
const expectedSurgicalIds = [
  "trial46-frame-0200",
  "trial46-frame-1000",
  "trial46-frame-1800",
];
const visibilityKeys = [
  "mask",
  "lines",
  "joint",
  "ee_tip",
  "ee_left",
  "ee_right",
];
const pointKeys = ["joint", "ee_tip", "ee_left", "ee_right"];
const nativeSurgicalKeys = [
  "broken",
  "exclude",
  "frame_idx",
  "last_modified",
  "pegboard",
  "pegs",
  "phase",
  "skipped",
  "tool1_ee_left",
  "tool1_ee_right",
  "tool1_ee_tip",
  "tool1_joint",
  "tool1_lines",
  "tool1_mask",
  "tool1_visibility",
  "tool2_ee_left",
  "tool2_ee_right",
  "tool2_ee_tip",
  "tool2_joint",
  "tool2_lines",
  "tool2_mask",
  "tool2_visibility",
];

function tool(id) {
  const match = manifest.tools.find((entry) => entry.id === id);
  assert.ok(match, `manifest must define ${id}`);
  return match;
}

function publicUrl(path) {
  assert.match(path, /^\/worked-examples\/annotation-showcase\//);
  assert.equal(path.includes(".."), false);
  return new URL(`../public${path}`, import.meta.url);
}

async function sha256(path) {
  return createHash("sha256")
    .update(await readFile(publicUrl(path)))
    .digest("hex");
}

function publicArtifactUrl(path) {
  assert.match(path, /^\/(?:annotation-demos|worked-examples)\//);
  assert.equal(path.includes(".."), false);
  return new URL(`../public${path}`, import.meta.url);
}

async function artifactSha256(path) {
  return createHash("sha256")
    .update(await readFile(publicArtifactUrl(path)))
    .digest("hex");
}

function assertPoint(point, width, height, label) {
  assert.ok(Array.isArray(point), `${label} must be an array`);
  assert.equal(point.length, 2, `${label} must contain x and y`);
  assert.equal(
    pointWithinFrame(point, width, height),
    true,
    `${label} must stay within the native image`,
  );
}

test("showcase manifest publishes exactly the two intended tools", () => {
  assert.equal(manifest.schema_version, "1.1.0");
  assert.deepEqual(manifest.sample_limits, {
    frame_annotator: 10,
    surgical_annotator: 3,
  });
  assert.deepEqual(
    manifest.tools.map((entry) => entry.id),
    ["frame-annotator", "surgical-annotator"],
  );
  assert.match(
    manifest.selection_policy.frame_annotator,
    /first ten sequential frames/,
  );
  assert.match(
    manifest.selection_policy.frame_annotator,
    /not the missing raw data\/color_images frames/,
  );
  assert.match(manifest.selection_policy.surgical_annotator, /LASK v1\.0/);

  for (const entry of manifest.tools) {
    assert.equal(
      entry.source_repository,
      "https://github.com/omariosc/frame-annotator",
    );
    assert.equal(
      entry.source_commit,
      "0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a",
    );
    assert.ok(entry.samples.length > 0);
    const limitKey = entry.id.replaceAll("-", "_");
    assert.ok(entry.samples.length <= manifest.sample_limits[limitKey]);
  }
});

test("frame showcase enforces the authorised first-ten allowlist", async () => {
  const frameTool = tool("frame-annotator");
  assert.equal(frameTool.samples.length, 10);
  assert.deepEqual(
    frameTool.samples.map((sample) => sample.id),
    expectedFrameIds,
  );
  assert.deepEqual(
    frameTool.samples.map((sample) => sample.filename),
    expectedFrameFiles,
  );
  assert.deepEqual(
    frameTool.samples.map((sample) => sample.canonical_position),
    Array.from({ length: 10 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    frameTool.samples.map((sample) => sample.image_path),
    expectedFrameFiles.map(
      (filename) =>
        `/worked-examples/annotation-showcase/frame-annotator/${filename}`,
    ),
  );
  assert.deepEqual(
    frameTool.samples.map(({ width, height }) => [width, height]),
    Array.from({ length: 10 }, () => [640, 480]),
  );
  assert.deepEqual(
    FRAME_SAMPLES.map(({ id, filename, imagePath }) => ({
      id,
      filename,
      image_path: imagePath,
    })),
    frameTool.samples.map(({ id, filename, image_path }) => ({
      id,
      filename,
      image_path,
    })),
  );

  const directory = new URL(
    "../public/worked-examples/annotation-showcase/frame-annotator/",
    import.meta.url,
  );
  assert.deepEqual(
    (await readdir(directory)).sort(),
    [...expectedFrameFiles, "starter-annotations.json"].sort(),
    "the public frame directory must contain only the ten authorised images",
  );

  for (const sample of frameTool.samples) {
    assert.match(sample.sha256, /^[a-f0-9]{64}$/);
    assert.equal(await sha256(sample.image_path), sample.sha256, sample.filename);
  }
});

test("frame starter annotation retains the native inclusive clip shape", async () => {
  const frameTool = tool("frame-annotator");
  assert.equal(
    await sha256(frameTool.annotation_path),
    frameTool.annotation_sha256,
  );
  const starter = JSON.parse(
    await readFile(publicUrl(frameTool.annotation_path), "utf8"),
  );
  assert.deepEqual(starter, { clips: FRAME_STARTER_CLIPS });
  assert.match(
    frameTool.annotation_status,
    /tutorial starter record reconstructed from the visible Controller Collision selection/,
  );

  const allowedClasses = new Set(FRAME_CLASSES.map((entry) => entry.id));
  const occupiedFrames = new Set();
  for (const clip of starter.clips) {
    assert.deepEqual(Object.keys(clip).sort(), ["class", "end", "start"]);
    assert.ok(Number.isInteger(clip.start));
    assert.ok(Number.isInteger(clip.end));
    assert.ok(clip.start >= 0);
    assert.ok(clip.end >= clip.start);
    assert.ok(clip.end < frameTool.samples.length);
    assert.ok(allowedClasses.has(clip.class));
    for (let frame = clip.start; frame <= clip.end; frame += 1) {
      assert.equal(
        occupiedFrames.has(frame),
        false,
        `frame ${frame} must not belong to two starter clips`,
      );
      occupiedFrames.add(frame);
    }
  }
});

test("surgical showcase pins three native records and their paired images", async () => {
  const surgicalTool = tool("surgical-annotator");
  assert.equal(surgicalTool.samples.length, 3);
  assert.deepEqual(
    surgicalTool.samples.map((sample) => sample.id),
    expectedSurgicalIds,
  );
  assert.deepEqual(
    surgicalTool.samples.map((sample) => sample.frame_index),
    expectedSurgicalFrames,
  );
  assert.deepEqual(
    surgicalTool.samples.map(({ width, height }) => [width, height]),
    [
      [1280, 720],
      [1280, 720],
      [1280, 720],
    ],
  );
  assert.deepEqual(
    SURGICAL_SAMPLES.map(
      ({ id, frameIndex, imagePath, annotationPath }) => ({
      id,
      frame_index: frameIndex,
      image_path: imagePath,
      annotation_path: annotationPath,
    }),
    ),
    surgicalTool.samples.map(
      ({ id, frame_index, image_path, annotation_path }) => ({
      id,
      frame_index,
      image_path,
      annotation_path,
    }),
    ),
  );
  assert.equal(surgicalTool.dataset_licence, "CC BY 4.0");
  assert.equal(
    surgicalTool.dataset_doi,
    "https://doi.org/10.5281/zenodo.20752651",
  );
  assert.match(surgicalTool.native_annotation_status, /original surgical-annotator JSON/);

  const directory = new URL(
    "../public/worked-examples/annotation-showcase/surgical-annotator/",
    import.meta.url,
  );
  const expectedFiles = surgicalTool.samples.flatMap((sample) => [
    sample.image_path.split("/").at(-1),
    sample.annotation_path.split("/").at(-1),
  ]);
  assert.deepEqual((await readdir(directory)).sort(), expectedFiles.sort());

  for (const sample of surgicalTool.samples) {
    assert.match(sample.image_sha256, /^[a-f0-9]{64}$/);
    assert.match(sample.annotation_sha256, /^[a-f0-9]{64}$/);
    assert.equal(
      await sha256(sample.image_path),
      sample.image_sha256,
      sample.image_path,
    );
    assert.equal(
      await sha256(sample.annotation_path),
      sample.annotation_sha256,
      sample.annotation_path,
    );
  }
});

test("surgical sample annotations preserve the native schema and frame geometry", async () => {
  const surgicalTool = tool("surgical-annotator");
  const allowedPhases = new Set(SURGICAL_PHASES.map((phase) => phase.id));

  for (const sample of surgicalTool.samples) {
    const annotation = JSON.parse(
      await readFile(publicUrl(sample.annotation_path), "utf8"),
    );
    assert.deepEqual(Object.keys(annotation).sort(), nativeSurgicalKeys);
    assert.equal(annotation.frame_idx, sample.frame_index);
    assert.equal(typeof annotation.skipped, "boolean");
    assert.equal(typeof annotation.broken, "boolean");
    assert.equal(typeof annotation.exclude, "boolean");
    assert.ok(Array.isArray(annotation.pegs));
    assert.equal(
      annotation.pegboard !== null &&
        typeof annotation.pegboard === "object" &&
        !Array.isArray(annotation.pegboard),
      true,
    );
    assert.ok(Number.isFinite(Date.parse(annotation.last_modified)));

    for (const toolNumber of [1, 2]) {
      const prefix = `tool${toolNumber}`;
      const visibility = annotation[`${prefix}_visibility`];
      assert.deepEqual(Object.keys(visibility).sort(), [...visibilityKeys].sort());

      for (const key of visibilityKeys) {
        assert.ok(
          [-1, 0, 1].includes(visibility[key]),
          `${prefix}.${key} has an invalid visibility`,
        );
      }

      const mask = annotation[`${prefix}_mask`];
      assert.ok(mask.length >= 3, `${prefix} mask must be a polygon`);
      mask.forEach((point, index) =>
        assertPoint(point, sample.width, sample.height, `${prefix} mask ${index}`),
      );

      const lines = annotation[`${prefix}_lines`];
      assert.deepEqual(Object.keys(lines).sort(), ["bottom", "top"]);
      for (const edge of ["top", "bottom"]) {
        assert.equal(lines[edge].length, 2, `${prefix} ${edge} must be a line`);
        lines[edge].forEach((point, index) =>
          assertPoint(
            point,
            sample.width,
            sample.height,
            `${prefix} ${edge} ${index}`,
          ),
        );
      }

      for (const key of pointKeys) {
        const point = annotation[`${prefix}_${key}`];
        if (visibility[key] === 1) {
          assertPoint(point, sample.width, sample.height, `${prefix} ${key}`);
        } else {
          assert.ok(
            point.length === 0 || point.length === 2,
            `${prefix} ${key} must be absent or a reviewed occluded point`,
          );
          if (point.length === 2) {
            assertPoint(point, sample.width, sample.height, `${prefix} ${key}`);
          }
        }
      }
    }

    assert.deepEqual(Object.keys(annotation.phase).sort(), [
      "active_tool",
      "coarse",
      "cycle_index",
      "events",
      "fine",
      "tool1",
      "tool2",
    ]);
    for (const key of ["tool1", "tool2", "coarse"]) {
      assert.ok(allowedPhases.has(annotation.phase[key]));
    }
    assert.equal(typeof annotation.phase.fine, "string");
    assert.ok(Number.isInteger(annotation.phase.cycle_index));
    assert.ok(annotation.phase.cycle_index >= 0);
    assert.ok(Number.isInteger(annotation.phase.active_tool));
    assert.ok(Array.isArray(annotation.phase.events));
  }
});

test("sample provenance names every published example and its claim boundary", async () => {
  const provenance = await readFile(
    new URL(`../public${manifest.provenance_record}`, import.meta.url),
    "utf8",
  );
  assert.match(provenance, /lossy presentation recovery/);
  assert.match(provenance, /not a raw-frame recovery/);
  assert.match(provenance, /explicitly approved publication/);
  assert.match(provenance, /ten-frame teaching reconstruction/);
  assert.match(provenance, /CC BY 4\.0/);
  assert.match(provenance, /LASK visual labels are\s+manual/);
  assert.match(
    provenance,
    /0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a/,
  );
  assert.match(provenance, /https:\/\/doi\.org\/10\.5281\/zenodo\.20752651/);

  for (const entry of manifest.tools) {
    if (entry.annotation_path) {
      assert.ok(
        provenance.includes(entry.annotation_path.split("/").at(-1)),
        entry.annotation_path,
      );
    }
    for (const sample of entry.samples) {
      const paths = [sample.image_path, sample.annotation_path].filter(Boolean);
      const hashes = [sample.sha256, sample.image_sha256, sample.annotation_sha256]
        .filter(Boolean);
      for (const path of paths) {
        assert.ok(provenance.includes(path.split("/").at(-1)), path);
      }
      for (const hash of hashes) {
        assert.ok(provenance.includes(hash), hash);
      }
    }
  }
});

test("static demos keep every API interaction in the visitor browser", async () => {
  const frameTool = tool("frame-annotator");
  const surgicalTool = tool("surgical-annotator");
  const frameRoot = new URL(
    "../public/annotation-demos/frame-annotator/",
    import.meta.url,
  );
  const surgicalRoot = new URL(
    "../public/annotation-demos/surgical-annotator/",
    import.meta.url,
  );
  const [frameHtml, frameAdapter, surgicalHtml, surgicalAdapter, surgicalMain] =
    await Promise.all([
      readFile(new URL("index.html", frameRoot), "utf8"),
      readFile(new URL("demo-adapter.js", frameRoot), "utf8"),
      readFile(new URL("index.html", surgicalRoot), "utf8"),
      readFile(new URL("demo-adapter.js", surgicalRoot), "utf8"),
      readFile(new URL("static/js/main.js", surgicalRoot), "utf8"),
    ]);

  assert.ok(
    frameHtml.indexOf("./demo-adapter.js") <
      frameHtml.indexOf("const CONFIG"),
    "the frame adapter must load before the original application script",
  );
  assert.ok(
    surgicalHtml.indexOf("./demo-adapter.js") <
      surgicalHtml.indexOf("./static/js/main.js"),
    "the surgical adapter must load before the original application script",
  );

  for (const adapter of [frameAdapter, surgicalAdapter]) {
    assert.match(adapter, /window\.fetch = async function demoFetch/);
    assert.match(adapter, /window\.localStorage/);
    assert.match(adapter, /url\.pathname\.startsWith\("\/api\/"\)|url\.pathname === "\/api\/frames"/);
    assert.doesNotMatch(adapter, /https?:\/\//);
    assert.doesNotMatch(adapter, /navigator\.sendBeacon|XMLHttpRequest|WebSocket/);
  }

  assert.match(surgicalAdapter, /window\.EventSource = DemoEventSource/);
  assert.match(surgicalMain, /__annotationDemoFrameUrl/);
  assert.match(frameHtml, /Reset/);
  assert.match(surgicalHtml, /Reset demo/);

  for (const entry of [frameTool, surgicalTool]) {
    assert.match(entry.preview_sha256, /^[a-f0-9]{64}$/);
    assert.equal(
      await artifactSha256(entry.preview_path),
      entry.preview_sha256,
      entry.preview_path,
    );
  }
});

test("pure helpers keep local drafts isolated and resettable", async () => {
  const originals = [
    JSON.parse(
      await readFile(
        publicUrl(tool("surgical-annotator").samples[0].annotation_path),
        "utf8",
      ),
    ),
    JSON.parse(
      await readFile(
        publicUrl(tool("surgical-annotator").samples[1].annotation_path),
        "utf8",
      ),
    ),
  ];
  const drafts = cloneValue(originals);
  drafts[0].phase.coarse = "dropped";
  drafts[0].tool1_joint = [0, 0];

  assert.notDeepEqual(drafts[0], originals[0]);
  assert.deepEqual(drafts[1], originals[1]);
  assert.notEqual(drafts[0], originals[0]);
  assert.notEqual(drafts[0].phase, originals[0].phase);

  drafts[0] = cloneValue(originals[0]);
  assert.deepEqual(drafts[0], originals[0]);
  assert.equal(pointWithinFrame([0, 0]), true);
  assert.equal(pointWithinFrame([1280, 720]), true);
  assert.equal(pointWithinFrame([-1, 100]), false);
  assert.equal(pointWithinFrame([640, 721]), false);
});

test("frame export helpers preserve inclusive ranges and unique frame counts", () => {
  const clips = [
    { start: 0, end: 1, class: "positive" },
    { start: 2, end: 2, class: "negative" },
  ];
  assert.equal(labelledFrameCount(clips), 3);
  assert.equal(
    frameClipsToCsv(clips),
    [
      "frame,filename,clip_id,class",
      "0,frame_0000.png,0,positive",
      "1,frame_0001.png,0,positive",
      "2,frame_0002.png,1,negative",
    ].join("\n"),
  );
  assert.equal(
    labelledFrameCount([
      { start: 0, end: 1, class: "positive" },
      { start: 1, end: 2, class: "negative" },
    ]),
    3,
    "the helper must not double-count an overlapping frame",
  );
});

test("surgical geometry helpers agree with the pinned native record", async () => {
  const surgicalTool = tool("surgical-annotator");
  const annotation = JSON.parse(
    await readFile(publicUrl(surgicalTool.samples[1].annotation_path), "utf8"),
  );
  assert.equal(completedSurgicalComponents(annotation), 12);
  const unresolvedButSkipped = cloneValue(annotation);
  unresolvedButSkipped.tool1_mask = [];
  unresolvedButSkipped.skipped = true;
  assert.equal(
    completedSurgicalComponents(unresolvedButSkipped),
    12,
    "a deliberately skipped frame is resolved even with an absent component",
  );
  for (const toolDefinition of SURGICAL_TOOLS) {
    assert.equal(
      geometryPresent(annotation, toolDefinition),
      true,
      `${toolDefinition.id} should have native geometry in the middle sample`,
    );
    assert.equal(
      surgicalToolDefinition(toolDefinition.id),
      toolDefinition,
    );
  }
});
