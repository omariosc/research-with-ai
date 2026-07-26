import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL(
  "../public/worked-examples/medmnist-breast/",
  import.meta.url,
);

test("pins the MedMNIST inputs and preserves the narrow claim boundary", async () => {
  const [manifestText, reportText, verifier] = await Promise.all([
    readFile(new URL("source-manifest.json", root), "utf8"),
    readFile(new URL("reproduction-report.json", root), "utf8"),
    readFile(new URL("verify.py", root), "utf8"),
  ]);
  const manifest = JSON.parse(manifestText);
  const report = JSON.parse(reportText);
  const verification = report.verification;

  assert.equal(verification.verification_type, "prediction-artifact metric re-evaluation");
  assert.deepEqual(verification.metric_contract, {
    auc: "Average-rank AUC from the label-1 probability",
    acc: "Accuracy from label-1 probability greater than 0.5",
  });
  assert.equal(verification.test_examples, 156);
  assert.deepEqual(verification.test_label_counts, { 0: 42, 1: 114 });
  assert.equal(verification.runs.length, 3);
  assert.equal(verification.mean.auc, 0.901489835700362);
  assert.equal(verification.mean.acc, 0.8632478632478633);
  assert.equal(Number(verification.mean.auc.toFixed(3)), 0.901);
  assert.equal(Number(verification.mean.acc.toFixed(3)), 0.863);
  assert.deepEqual(verification.rounded_match, { auc: true, acc: true });
  assert.match(report.claim_boundary, /did not retrain/i);
  assert.match(report.claim_boundary, /clinical/i);
  assert.deepEqual(report.paper_claim.semantic_class_mapping, {
    negative: "malignant",
    positive: "normal or benign",
  });
  assert.deepEqual(report.dataset_label_mapping, {
    source: "Pinned MedMNIST API info.py",
    0: "malignant",
    1: "normal or benign",
  });
  assert.match(report.repository_finding.unresolved, /cannot establish/i);
  assert.equal(
    report.repository_finding.inspected_revision,
    "12e9f40ad214f6f076b1672cf29fab9d2e7216cc",
  );

  const dataset = manifest.sources.find((source) => source.id === "dataset");
  const predictions = manifest.sources.find(
    (source) => source.id === "predictions",
  );
  const busiPaper = manifest.sources.find(
    (source) => source.id === "busi-source-paper",
  );
  const paperEraEvaluator = manifest.sources.find(
    (source) => source.id === "medmnist-paper-era-evaluator",
  );
  assert.equal(
    dataset.title,
    "MedMNIST v2: A Large-Scale Lightweight Benchmark for 2D and 3D Biomedical Image Classification",
  );
  assert.equal(dataset.version, "2.0");
  assert.equal(dataset.sha256, "3a22d2a4625e7dd8903f0f59030e81a3d0c222bece2e5e10927456cb50efdec1");
  assert.equal(dataset.rights, "CC BY 4.0");
  assert.equal(predictions.version, "v1");
  assert.match(predictions.use, /does not download and hash the complete archive/i);
  assert.equal(busiPaper.type, "paper");
  assert.match(busiPaper.rights, /original BUSI file rights not independently audited/i);
  assert.equal(
    paperEraEvaluator.commit,
    "16e3ead23ceb3e1c5f7b9b04032c30cea7a4b1d8",
  );
  assert.match(paperEraEvaluator.use, /score greater than 0\.5/i);
  assert.equal(manifest.sensitivity.includes("patient-identifiable"), true);
  assert.match(verifier, /def rank_auc/);
  assert.match(verifier, /require_checksum/);
  assert.match(verifier, /positive_scores = probabilities\[:, 1\]/);
  assert.match(verifier, /positive_scores > 0\.5/);
  assert.doesNotMatch(verifier, /NamedTemporaryFile/);
  assert.doesNotMatch(verifier, /import medmnist|import sklearn/);
});

test("pins the exact CC BY figure used on the worked page", async () => {
  const figure = await readFile(new URL("medmnist-figure-1.jpg", root));
  assert.equal(
    createHash("sha256").update(figure).digest("hex"),
    "490bafbc9a24fec64a825b4e18cfc0544e3b897140097116175cefa482edca65",
  );
});
