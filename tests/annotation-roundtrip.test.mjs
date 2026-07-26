import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  fixtureToYoloBoxes,
  fixtureToReviewCsv,
  reviewCsvToFixture,
  runRoundTrip,
  verifyTrainingExport,
} from "../scripts/annotation-round-trip.mjs";

const fixtureUrl = new URL(
  "../public/worked-examples/annotation-round-trip-fixture.json",
  import.meta.url,
);

test("annotation fixture survives the review CSV round trip", async () => {
  const result = await runRoundTrip(fixtureUrl);
  assert.equal(result.records, 2);
  assert.ok(result.csvBytes > 500);
  assert.match(result.csvSha256, /^[a-f0-9]{64}$/);
  assert.equal(
    result.trainingExport.line,
    "0 0.645000 0.540000 0.250000 0.360000",
  );
  assert.equal(result.trainingExport.maximumAbsoluteBoxError, 0);
  assert.deepEqual(result.trainingExport.expectedLoss, [
    "phase",
    "named keypoints and visibility",
    "out-of-frame reason",
    "provenance and AI-assistance history",
  ]);
});

test("annotation review CSV rejects a changed column contract", () => {
  const fixture = {
    fixture_version: "1.0.0",
    records: [],
  };
  const csv = fixtureToReviewCsv(fixture).replace(
    "annotation_id",
    "annotation_identifier",
  );
  assert.throws(() => reviewCsvToFixture(csv), /columns changed/);
});

test("training export keeps the box but declares omitted records and fields", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const exported = fixtureToYoloBoxes(fixture);
  const result = verifyTrainingExport(fixture);

  for (const record of fixture.records) {
    const coordinates =
      record.provenance.coordinate_convention_and_units;
    assert.equal(coordinates.unit, "percent_of_annotation_frame");
    assert.deepEqual(coordinates.annotation_frame_dimensions_px, [480, 360]);
    assert.deepEqual(coordinates.source_asset_dimensions_px, [1600, 900]);
    assert.deepEqual(coordinates.source_viewport_xywh_px, [300, 40, 480, 360]);
  }
  assert.equal(exported.files.length, 1);
  assert.equal(exported.omitted.length, 1);
  assert.equal(exported.omitted[0].reason, "no visible box");
  assert.equal(result.exportedRecords, 1);
  assert.equal(result.omittedRecords, 1);
});
