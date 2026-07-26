# Annotation export round-trip record

Check date: 26 July 2026

Fixture: `/worked-examples/annotation-round-trip-fixture.json`
Fixture version: `1.0.0`

## Question

Can the teaching fixture move from canonical JSON to a review-oriented CSV and
back without losing its geometry, missingness, named keypoints, or provenance?

## Fixture

The two synthetic records exercise two different states:

- a visible instrument with a box, four named keypoints, and one explicitly
  estimated occluded point;
- an out-of-frame instrument with a null box, null point coordinates, and no
  estimated geometry.

Both records use the public teaching image hash. They contain no patient or
study data.

## Recorded command

```sh
npm run check:annotation-roundtrip
```

The check reported:

```text
2 records round-tripped without field loss; CSV 2325 bytes; SHA-256 a3c3183b4bac58cd71cc46a580ab524b7f7ca72eb3d0b57edd89cc6f797abc3d
YOLO box: 0 0.645000 0.540000 0.250000 0.360000
YOLO box round-trip maximum absolute error: 0
EXPECTED LOSS: phase
EXPECTED LOSS: named keypoints and visibility
EXPECTED LOSS: out-of-frame reason
EXPECTED LOSS: provenance and AI-assistance history
PASS: canonical JSON remains authoritative when a training export is lossy
```

The converter rejects a changed CSV column contract. The automated test also
checks that every out-of-frame record has a null box, null point coordinates,
`out_of_frame` point states, and `estimated: false`.

## Coordinate reference and training export

Coordinates are percentages of the 480 by 360 annotation frame cropped from
the 1600 by 900 source asset at `[300, 40, 480, 360]`. The fixture records that
reference explicitly. It does not call the complete screenshot the native
annotation frame.

The visible `[52, 36, 25, 36]` top-left `xywh` box becomes the YOLO centre-box
line above and returns to the same four percentages. The out-of-frame record is
omitted because it has no box. A YOLO box file cannot carry the phase, named
keypoints and their visibility, omission reason, source hash, protocol
revision, reviewer state, or AI-assistance history. The canonical JSON remains
the authoritative record.

## Claim boundary

This deterministic fixture checks one lossless review-CSV path and one exact
bounding-box subset of a lossy training export. It does not establish
annotation accuracy, inter-rater agreement, usability, resilience to large or
malformed datasets, migration compatibility with another tool, or clinical
safety. A study release still needs protocol validation, calibration, double
annotation, adjudication, and task-appropriate reliability analysis.
