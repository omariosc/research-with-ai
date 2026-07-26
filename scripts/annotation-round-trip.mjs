import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const columns = [
  "fixture_version",
  "annotation_id",
  "revision_id",
  "frame_id",
  "frame_index",
  "phase",
  "instrument_id",
  "instrument_visibility",
  "box_xywh_percent_json",
  "keypoints_json",
  "annotator_id",
  "protocol_version",
  "source_hash",
  "frame_index_or_time_json",
  "coordinate_convention_and_units_json",
  "origin",
  "created_at",
  "updated_at",
  "review_state",
  "ai_assistance_json",
];

function csvCell(value) {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (quoted) {
      if (character === '"' && csv[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (quoted) throw new Error("CSV ended inside a quoted field.");
  if (cell || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

export function fixtureToReviewCsv(fixture) {
  const rows = fixture.records.map((record) => {
    const provenance = record.provenance;
    const values = {
      fixture_version: fixture.fixture_version,
      annotation_id: record.annotation_id,
      revision_id: record.revision_id,
      frame_id: record.frame_id,
      frame_index: record.frame_index,
      phase: record.phase,
      instrument_id: record.instrument.id,
      instrument_visibility: record.instrument.visibility,
      box_xywh_percent_json: JSON.stringify(
        record.instrument.box_xywh_percent,
      ),
      keypoints_json: JSON.stringify(record.instrument.keypoints),
      annotator_id: provenance.annotator_id,
      protocol_version: provenance.protocol_version,
      source_hash: provenance.source_hash,
      frame_index_or_time_json: JSON.stringify(
        provenance.frame_index_or_time,
      ),
      coordinate_convention_and_units_json: JSON.stringify(
        provenance.coordinate_convention_and_units,
      ),
      origin: provenance.origin,
      created_at: provenance.created_at,
      updated_at: provenance.updated_at,
      review_state: provenance.review_state,
      ai_assistance_json: JSON.stringify(provenance.ai_assistance),
    };
    return columns.map((column) => csvCell(values[column])).join(",");
  });
  return `${columns.join(",")}\n${rows.join("\n")}\n`;
}

export function reviewCsvToFixture(csv) {
  const [header, ...rows] = parseCsv(csv);
  assert.deepEqual(header, columns, "Review CSV columns changed.");
  const objects = rows.map((row) =>
    Object.fromEntries(columns.map((column, index) => [column, row[index]])),
  );
  const fixtureVersions = new Set(
    objects.map((record) => record.fixture_version),
  );
  assert.equal(fixtureVersions.size, 1, "Fixture versions were mixed.");

  return {
    fixture_version: objects[0]?.fixture_version,
    records: objects.map((record) => ({
      annotation_id: record.annotation_id,
      revision_id: record.revision_id,
      frame_id: record.frame_id,
      frame_index: Number(record.frame_index),
      phase: record.phase,
      instrument: {
        id: record.instrument_id,
        visibility: record.instrument_visibility,
        box_xywh_percent: JSON.parse(record.box_xywh_percent_json),
        keypoints: JSON.parse(record.keypoints_json),
      },
      provenance: {
        annotator_id: record.annotator_id,
        protocol_version: record.protocol_version,
        source_hash: record.source_hash,
        frame_index_or_time: JSON.parse(record.frame_index_or_time_json),
        coordinate_convention_and_units: JSON.parse(
          record.coordinate_convention_and_units_json,
        ),
        origin: record.origin,
        created_at: record.created_at,
        updated_at: record.updated_at,
        review_state: record.review_state,
        ai_assistance: JSON.parse(record.ai_assistance_json),
      },
    })),
  };
}

export function verifyMissingness(fixture) {
  for (const record of fixture.records) {
    if (record.instrument.visibility !== "out_of_frame") continue;
    assert.equal(record.instrument.box_xywh_percent, null);
    for (const point of record.instrument.keypoints) {
      assert.equal(point.visibility, "out_of_frame");
      assert.equal(point.xy_percent, null);
      assert.equal(point.estimated, false);
    }
  }
}

export function fixtureToYoloBoxes(fixture) {
  const files = [];
  const omitted = [];

  for (const record of fixture.records) {
    const box = record.instrument.box_xywh_percent;
    if (record.instrument.visibility === "out_of_frame" || box === null) {
      omitted.push({
        annotationId: record.annotation_id,
        frameId: record.frame_id,
        reason: "no visible box",
      });
      continue;
    }

    assert.equal(box.length, 4, "A training box must have four values.");
    const [x, y, width, height] = box;
    for (const value of box) {
      assert.ok(
        Number.isFinite(value) && value >= 0 && value <= 100,
        "Training-box percentages must be finite values from 0 to 100.",
      );
    }
    assert.ok(x + width <= 100, "Training box exceeds the frame width.");
    assert.ok(y + height <= 100, "Training box exceeds the frame height.");

    const centerX = (x + width / 2) / 100;
    const centerY = (y + height / 2) / 100;
    const line = [
      "0",
      centerX.toFixed(6),
      centerY.toFixed(6),
      (width / 100).toFixed(6),
      (height / 100).toFixed(6),
    ].join(" ");
    files.push({
      annotationId: record.annotation_id,
      frameId: record.frame_id,
      file: `${record.frame_id}.txt`,
      line,
    });
  }

  return { files, omitted };
}

export function yoloBoxToPercent(line) {
  const values = line.trim().split(/\s+/).map(Number);
  assert.equal(values.length, 5, "YOLO box must contain five numeric fields.");
  assert.ok(values.every(Number.isFinite), "YOLO box contains a non-finite value.");
  const [classId, centerX, centerY, width, height] = values;
  assert.equal(classId, 0, "The fixture has one declared instrument class.");
  for (const value of [centerX, centerY, width, height]) {
    assert.ok(value >= 0 && value <= 1, "YOLO coordinates must be from 0 to 1.");
  }
  return [
    (centerX - width / 2) * 100,
    (centerY - height / 2) * 100,
    width * 100,
    height * 100,
  ].map((value) => Number(value.toFixed(6)));
}

export function verifyTrainingExport(fixture) {
  const training = fixtureToYoloBoxes(fixture);
  assert.equal(training.files.length, 1);
  assert.equal(training.omitted.length, 1);
  const sourceRecord = fixture.records.find(
    (record) => record.annotation_id === training.files[0].annotationId,
  );
  assert.ok(sourceRecord);
  const sourceBox = sourceRecord.instrument.box_xywh_percent;
  assert.ok(sourceBox);
  const restoredBox = yoloBoxToPercent(training.files[0].line);
  const maximumAbsoluteBoxError = Math.max(
    ...sourceBox.map((value, index) => Math.abs(value - restoredBox[index])),
  );
  assert.equal(maximumAbsoluteBoxError, 0);

  return {
    exportedRecords: training.files.length,
    omittedRecords: training.omitted.length,
    line: training.files[0].line,
    maximumAbsoluteBoxError,
    expectedLoss: [
      "phase",
      "named keypoints and visibility",
      "out-of-frame reason",
      "provenance and AI-assistance history",
    ],
  };
}

export async function runRoundTrip(fixtureUrl) {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  verifyMissingness(fixture);
  const csv = fixtureToReviewCsv(fixture);
  const restored = reviewCsvToFixture(csv);
  assert.deepEqual(restored, fixture);
  return {
    records: fixture.records.length,
    csvBytes: Buffer.byteLength(csv),
    csvSha256: createHash("sha256").update(csv).digest("hex"),
    trainingExport: verifyTrainingExport(fixture),
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const fixtureUrl = new URL(
    "../public/worked-examples/annotation-round-trip-fixture.json",
    import.meta.url,
  );
  const result = await runRoundTrip(fixtureUrl);
  console.log(
    `${result.records} records round-tripped without field loss; CSV ${result.csvBytes} bytes; SHA-256 ${result.csvSha256}`,
  );
  console.log(`YOLO box: ${result.trainingExport.line}`);
  console.log(
    `YOLO box round-trip maximum absolute error: ${result.trainingExport.maximumAbsoluteBoxError}`,
  );
  for (const field of result.trainingExport.expectedLoss) {
    console.log(`EXPECTED LOSS: ${field}`);
  }
  console.log(
    "PASS: canonical JSON remains authoritative when a training export is lossy",
  );
}
