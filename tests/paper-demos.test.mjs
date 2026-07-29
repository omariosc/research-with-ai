import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const interactivePaperOrigin =
  "https://interactivepaper.omarchoudhry.co.uk";

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

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "paper-demo-test",
    `${process.pid}-${Date.now()}-${path}`,
  );
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

const paperCases = [
  {
    slug: "real-time-tool-detection",
    title:
      "Real-Time Tool Detection in Laparoscopic Datasets for Surgical Training in Low-Resource Settings",
    shortTitle: "Real-time tool detection",
    hero: "/paper-demos/htl/figure-2-experimental-pipeline.webp",
    primaryLink: "https://doi.org/10.1049/htl2.70045",
    abstract:
      "In low-resource settings, there is a critical need for skilled surgeons. Alternative training processes that include computer-assisted surgical skill evaluation are essential to address this gap. Using tool detection, surgical videos can be leveraged to derive insights into surgical skill assessment. However, state-of-the-art laparoscopic tool detection methods usually have more complex architectures tailored for in vivo data, which suffer from challenges such as smoke, occlusion, bleeding, etc., which are absent from in vitro training contexts. Thus, this paper tests multiple anchor-based and anchor-free, convolution- and transformer-based, traditional (non-surgical domain-specific) computer vision deep learning state-of-the-art models. With various hardware configurations on a newly curated in-house laparoscopic box-trainer dataset, we emphasise real-time performance on low-cost embedded devices. Overall, the anchor-free YOLOv8-X model was the most accurate, achieving mAP50 of 99.5% and mAP50:95 of 96.6% with an inference time of 23.5 ms/≈42.6 FPS on an NVIDIA Jetson Orin Nano 8GB (comparable low-cost hardware which could be expected to run real-time skill assessment methods for surgical training boot camps in a resource-constrained environment). The most efficient model was YOLOv11-N, providing 3.1 ms/≈322.6 FPS with a performance difference of +0% mAP50 and -2.1% mAP50:95. The results highlight the models' potential for effective real-time detection of surgical tools and are suitable for further downstream assessment of surgical skills, even in resource-constrained environments.",
    figures: [
      "/paper-demos/htl/figure-1-dataset-samples.webp",
      "/paper-demos/htl/figure-2-experimental-pipeline.webp",
      "/paper-demos/htl/figure-3-detection-results.webp",
    ],
    tables: [
      "/paper-demos/htl/table-3-systematic-benchmark.webp",
      "/paper-demos/htl/table-4-generalisation.webp",
      "/paper-demos/htl/table-5-jetson-compilation.webp",
    ],
    markers: [
      "The abstract and Table 5 disagree on the fastest model",
      "Main test benchmark",
      "Jetson FP16",
      "Captions and source details remain attached",
      "Complete tables with their provenance stated below",
    ],
  },
  {
    slug: "lask-7dof",
    title:
      "7-DoF Laparoscopic Peg Transfer Dataset for Surgical Skill Assessment",
    shortTitle: "LASK 7-DoF dataset",
    hero: "/paper-demos/lask/figure-1-setup.webp",
    primaryLink: "https://eprints.whiterose.ac.uk/id/eprint/230457/",
    abstract:
      "This work introduces LASK (LAparoscopic Skill & Kinematics), a peg-transfer surgical dataset featuring synchronised HD video and 7-DoF (seven-degree-of-freedom) ground-truth kinematics for two surgical graspers. The dataset comprises 114 trials (~3 hours total) from 38 low-, 41 medium- and 35 high-skill expert surgeons, providing 324,101 frames with time-aligned kinematics for both tool and tooltips; 3,725 frames are annotated with bounding boxes, including a complete 2,680-frame validation sequence. LASK distinctively captures two instruments throughout with wider fields of view than typical in-vivo data, includes surgeon-specific metadata (handedness & experience), and reflects typical box-trainer imaging conditions. These features support robust benchmarking of multi-class detection, tracking, pose estimation, skill assessment and classification algorithms. Once publicly released, LASK aims to improve laparoscopic training by fostering data-driven training tools.",
    figures: [
      "/paper-demos/lask/figure-1-setup.webp",
      "/paper-demos/lask/figure-1-annotation-detail.webp",
    ],
    tables: [],
    markers: [
      "MIUA manuscript cohort",
      "Later analysis inventory",
      "Zenodo v1.0 release",
      "114",
      "115",
      "37",
      "Choose the snapshot that matches the claim",
    ],
  },
  {
    slug: "btpn",
    title:
      "Bayesian Temporal Pose Networks for Uncertainty-Calibrated Laparoscopic Tool Pose Tracking",
    shortTitle: "Bayesian Temporal Pose Networks",
    hero: "/paper-demos/btpn/figure-2-architecture.webp",
    primaryLink: "https://github.com/omariosc/BTPN",
    abstract:
      "Laparoscopic instrument pose tracking from monocular endoscopic video in surgical training tasks is essential for computer-assisted surgery and objective skill assessment. However, current methods require geometric priors unavailable in non-robotic settings and lack temporal reasoning across multimodal cues and uncertainty quantification. We introduce Bayesian Temporal Pose Network (BTPN), a framework that fuses visual and kinematic features through hierarchical multi-scale temporal attention operating at clinically motivated resolutions, with calibrated Bayesian uncertainty. A fine-tuned segmentation backbone achieves 99.1% mAP50 and keypoint detection reaches 98.3% mAP50. End-to-end visual pose tracking attains 7.0 mm position and 11.7° rotation RMSE with 0.028 uncertainty error. Our code is available at https://github.com/omariosc/BTPN.",
    figures: [
      "/paper-demos/btpn/figure-1-datasets.webp",
      "/paper-demos/btpn/figure-2-architecture.webp",
      "/paper-demos/btpn/figure-3-trajectories.webp",
      "/paper-demos/btpn/figure-4-uncertainty.webp",
    ],
    tables: [
      "/paper-demos/btpn/table-1-datasets.webp",
      "/paper-demos/btpn/table-2-quantitative-results.webp",
    ],
    markers: [
      "Accepted paper reports",
      "The final publisher link is not available yet",
      "Paper link coming soon",
      "Official MICCAI proceedings URL pending",
      "BTPN method subsystem",
      "BTPN metric group",
    ],
  },
];

test("server-renders all three source-bounded paper companions", async () => {
  for (const paper of paperCases) {
    const path = `/paper-demos/${paper.slug}`;
    const canonical = `${interactivePaperOrigin}${path}`;
    const response = await render(path);

    assert.equal(response.status, 200, path);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/html\b/i,
      path,
    );

    const html = await response.text();
    assert.ok(
      html.includes(
        `<title>${paper.shortTitle} interactive paper companion | Research with AI</title>`,
      ),
      `${path}: title`,
    );
    assert.equal(canonicalHref(html), canonical, `${path}: canonical`);
    assert.equal(
      metaContent(html, "property", "og:url"),
      canonical,
      `${path}: Open Graph URL`,
    );
    assert.equal(
      metaContent(html, "property", "og:image"),
      `${interactivePaperOrigin}${paper.hero}`,
      `${path}: Open Graph image`,
    );
    const decodedHtml = decodeHtml(html);
    assert.ok(html.includes(paper.title), `${path}: paper title`);
    assert.ok(
      html.includes(`href="${paper.primaryLink}"`),
      `${path}: primary source link`,
    );
    assert.ok(
      html.includes(`src="${paper.hero}"`),
      `${path}: hero source figure`,
    );
    assert.ok(
      html.includes(`href="${paper.hero}"`),
      `${path}: full-size hero source`,
    );
    assert.ok(
      decodedHtml.includes(paper.abstract),
      `${path}: exact source abstract`,
    );
    assert.match(html, /id="paper-record"/);
    assert.match(html, /Start with what the authors actually published/);
    assert.match(html, /Abstract<\/span><strong>From the paper/);
    assert.match(html, /Paper structure/);
    assert.match(html, /Figures from the paper/);
    for (const figure of paper.figures) {
      assert.ok(html.includes(`src="${figure}"`), `${path}: ${figure}`);
      assert.ok(html.includes(`href="${figure}"`), `${path}: ${figure} link`);
    }
    for (const table of paper.tables) {
      assert.ok(html.includes(`src="${table}"`), `${path}: ${table}`);
      assert.ok(html.includes(`href="${table}"`), `${path}: ${table} link`);
    }
    if (paper.tables.length > 0) {
      assert.match(html, /Tables from the paper/);
    } else {
      assert.doesNotMatch(html, /Tables from the paper/);
    }
    assert.match(html, /Claim boundaries/);
    assert.match(html, /What the evidence says, and what this page does/);
    assert.match(html, /Interactive layer<\/dt><dd>Rearranges reported evidence only/);
    assert.match(html, /What this companion does not prove/);
    assert.match(html, /AI-assisted conversion, human-reviewed evidence/);
    assert.match(html, /type="application\/ld\+json"/);
    assert.ok(
      html.includes(`"url":"${canonical}"`),
      `${path}: structured-data URL`,
    );
    assert.ok(
      html.includes(
        `href="${interactivePaperOrigin}/#live-paper-demos"`,
      ),
      `${path}: workshop return link`,
    );

    for (const marker of paper.markers) {
      assert.ok(html.includes(marker), `${path}: ${marker}`);
    }
    assert.doesNotMatch(
      html,
      /\/paper-demos\/(?:htl-pipeline|lask-setup|btpn-architecture)\.webp/,
      `${path}: legacy paper asset`,
    );
  }
});

test("BTPN uses a non-link pending state and exposes no private paper artefact", async () => {
  const response = await render("/paper-demos/btpn");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Paper link coming soon/);
  assert.match(html, /Official MICCAI proceedings URL pending/);
  assert.match(html, /private submission PDF, reviews, or response material/);
  assert.doesNotMatch(html, /href="#"/);
  assert.doesNotMatch(
    html,
    /href="[^"]*(?:\.pdf|submission|submitted|review|response)[^"]*"/i,
  );
  assert.doesNotMatch(html, /(?:\/Users\/|OneDrive|CloudStorage|file:\/\/)/i);
  assert.doesNotMatch(
    html,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );

  const publicBtpnFiles = await readdir(
    new URL("public/paper-demos/btpn/", root),
  );
  assert.deepEqual(publicBtpnFiles.sort(), [
    "figure-1-datasets.webp",
    "figure-2-architecture.webp",
    "figure-3-trajectories.webp",
    "figure-4-uncertainty.webp",
    "table-1-datasets.webp",
    "table-2-quantitative-results.webp",
  ]);
});

test("interactive-paper gallery links every live companion and expected landing capture", async () => {
  const response = await render("/interactive-paper");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /id="live-paper-demos"/);
  assert.match(html, /Three real outputs from this workflow/);
  assert.match(html, /Live websites made from real papers/);

  for (const paper of paperCases) {
    const path = `/paper-demos/${paper.slug}`;
    const screenshot = `/paper-demos/screenshots/${paper.slug}-landing.webp`;
    assert.ok(
      html.includes(`href="${path}"`),
      `gallery link for ${paper.slug}`,
    );
    assert.ok(
      html.includes(`src="${screenshot}"`),
      `gallery screenshot path for ${paper.slug}`,
    );
    const screenshotBytes = await readFile(
      new URL(`public${screenshot}`, root),
    );
    assert.equal(
      screenshotBytes.subarray(0, 4).toString("ascii"),
      "RIFF",
      screenshot,
    );
    assert.equal(
      screenshotBytes.subarray(8, 12).toString("ascii"),
      "WEBP",
      screenshot,
    );
    assert.ok(html.includes(paper.title), `gallery title for ${paper.slug}`);
  }

  assert.match(html, /Official paper link coming soon/);
  assert.match(
    html,
    /The official proceedings link is marked coming soon\. The page exposes no private submission, review, response, or source bundle\./,
  );
  assert.match(
    html,
    /href="\/citations\/paper-demo-assets-2026-07-29\.md"/,
  );
  assert.doesNotMatch(html, /href="#"/);
});

test("paper-native figures and table crops match the public provenance manifest", async () => {
  const [manifestText, markdown] = await Promise.all([
    readFile(
      new URL(
        "public/citations/paper-demo-assets-2026-07-29.json",
        root,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "public/citations/paper-demo-assets-2026-07-29.md",
        root,
      ),
      "utf8",
    ),
  ]);
  const manifest = JSON.parse(manifestText);

  assert.equal(manifest.checked, "2026-07-29");
  assert.match(
    manifest.privacy_boundary,
    /No workstation paths, complete unpublished manuscript file, reviews, responses, or participant-level records/,
  );
  assert.equal(manifest.source_documents.length, 3);
  assert.equal(manifest.assets.length, 14);
  assert.equal(manifest.gallery_captures.length, 3);
  assert.match(manifest.claim_boundary, /do not run inference/);

  const expectedAssets = new Map([
    [
      "/paper-demos/htl/figure-1-dataset-samples.webp",
      "3e41ed1fc04cbb290e2f322a5c5c86f2b98cc510ac11f77138290d5d8890a2d7",
    ],
    [
      "/paper-demos/htl/figure-2-experimental-pipeline.webp",
      "477c4453ce07cadf1ddfca4fd51950ac2075d6bb93774011630dfc66e95c6ced",
    ],
    [
      "/paper-demos/htl/figure-3-detection-results.webp",
      "30ca1f315470137d52449d0f1d2f44e82aa75b33a6675143d178ffbe864a2f9c",
    ],
    [
      "/paper-demos/htl/table-3-systematic-benchmark.webp",
      "149fab018a7992e4df32de7dcb5685048aff5c289e09b8c8347569d1c3f13336",
    ],
    [
      "/paper-demos/htl/table-4-generalisation.webp",
      "3fa5d1d4d8b10570fdcaf22c1cf9bee287b21a041f450f3e445befef4abededf",
    ],
    [
      "/paper-demos/htl/table-5-jetson-compilation.webp",
      "56b785f969539b04dba0b0e55c49ac5657eaf7423413ef5576a94ad40b53f020",
    ],
    [
      "/paper-demos/lask/figure-1-setup.webp",
      "e4c51a8d0e7b7529022a856f7d7e3e7f0613a7b6a6b1c6fe9103f9bf590e9ffb",
    ],
    [
      "/paper-demos/lask/figure-1-annotation-detail.webp",
      "66cbf3506bb3afc7f36b5bb7ff6ea1cef139c5eb84f316914d3679539661d868",
    ],
    [
      "/paper-demos/btpn/figure-1-datasets.webp",
      "9a4973531ee187ade106b63a5447537c63f412902d462aab209c16fd261f8b49",
    ],
    [
      "/paper-demos/btpn/figure-2-architecture.webp",
      "132933cda789ff3a1746cea7d931ca444be9a2ee8c3492fdd8d4a320fdbfbd42",
    ],
    [
      "/paper-demos/btpn/figure-3-trajectories.webp",
      "ad269f22df39e1b3d605d82935911799808bbb031a7df48077a28e4464581ab3",
    ],
    [
      "/paper-demos/btpn/figure-4-uncertainty.webp",
      "e25c7e3646ea65b1472ac6442acfbd6a6945906a0da031871b8f57d9a4f6efd6",
    ],
    [
      "/paper-demos/btpn/table-1-datasets.webp",
      "b668c756264533c48072d3b649d0938fbda1c9f84bf92be61c48ac57fa6ddf7d",
    ],
    [
      "/paper-demos/btpn/table-2-quantitative-results.webp",
      "8f80389c52336fa606b1dffbf019283914ac373fc78b26646d952e3cfed9c01b",
    ],
  ]);

  for (const asset of manifest.assets) {
    const expectedHash = expectedAssets.get(asset.path);
    assert.ok(expectedHash, `unexpected manifest asset: ${asset.path}`);
    assert.equal(asset.sha256, expectedHash, asset.path);
    assert.match(asset.rights, /CC BY 4\.0|author/i, asset.path);
    assert.match(asset.transformation, /WebP/i, asset.path);

    const publicPath = new URL(`public${asset.path}`, root);
    await access(publicPath);
    const bytes = await readFile(publicPath);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", asset.path);
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", asset.path);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expectedHash,
      asset.path,
    );
    assert.ok(markdown.includes(asset.path.split("/").at(-1)), asset.path);
    assert.ok(markdown.includes(expectedHash), asset.path);
  }

  assert.deepEqual(
    new Set(manifest.assets.map((asset) => asset.path)),
    new Set(expectedAssets.keys()),
  );

  const expectedCaptures = new Map([
    [
      "/paper-demos/screenshots/real-time-tool-detection-landing.webp",
      "7543e1f40cc5f3cddb1c47c40b80218549d287337ab850f6b7ff2f8ac934306c",
    ],
    [
      "/paper-demos/screenshots/lask-7dof-landing.webp",
      "7f10021fb9ea915b0ccaa5da4144f1b3ebb8f728fbd60dc0d9d336b2ff20f042",
    ],
    [
      "/paper-demos/screenshots/btpn-landing.webp",
      "c079249f57e3ee1817ab457bafa38997f6d46cd73159cbd510efe8491be837f7",
    ],
  ]);
  for (const capture of manifest.gallery_captures) {
    const expectedHash = expectedCaptures.get(capture.path);
    assert.ok(expectedHash, `unexpected gallery capture: ${capture.path}`);
    assert.equal(capture.sha256, expectedHash, capture.path);
    const bytes = await readFile(new URL(`public${capture.path}`, root));
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", capture.path);
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", capture.path);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expectedHash,
      capture.path,
    );
    assert.ok(markdown.includes(expectedHash), capture.path);
  }
  assert.deepEqual(
    new Set(manifest.gallery_captures.map((capture) => capture.path)),
    new Set(expectedCaptures.keys()),
  );

  const btpnSource = manifest.source_documents.find((source) =>
    source.source_title.startsWith("Bayesian Temporal Pose Networks"),
  );
  assert.equal(btpnSource.source_url, null);
  assert.equal(
    btpnSource.accepted_camera_ready_pdf_sha256,
    "69dc0c01b6b240eff5e887647ff51bdbdb03c8c5e094562514fa3fac2b23c719",
  );
  assert.equal(
    btpnSource.public_project_record,
    "https://github.com/omariosc/BTPN",
  );
  assert.match(
    btpnSource.distribution_boundary,
    /public BTPN repository already publishes the title, abstract, method overview, aggregate results, tables, figures, and reproduction guidance/,
  );
  assert.match(
    btpnSource.distribution_boundary,
    /complete manuscript PDF, reviews, responses, affiliations, emails, and workstation paths are not distributed/,
  );
  assert.doesNotMatch(
    manifestText,
    /\/paper-demos\/(?:htl-pipeline|lask-setup|btpn-architecture)\.webp/,
  );
  assert.doesNotMatch(manifestText, /(?:\/Users\/|OneDrive|CloudStorage|file:\/\/)/i);
  assert.doesNotMatch(markdown, /(?:\/Users\/|OneDrive|CloudStorage|file:\/\/)/i);
  assert.doesNotMatch(
    manifestText,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );
  assert.doesNotMatch(
    markdown,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );
});
