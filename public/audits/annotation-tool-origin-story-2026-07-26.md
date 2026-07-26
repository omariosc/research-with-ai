# Annotation tool origin and evidence record

Checked: 2026-07-26

This record supports the first-hand case in the Developing Custom Annotation
Tools Using AI tutorial. It deliberately separates public evidence from Omar
Choudhry's author account.

## Public dataset record

- Resource:
  [LASK: A Dataset for Laparoscopic Skill and 7-DoF Kinematics](https://zenodo.org/records/20752651)
- Version DOI: [10.5281/zenodo.20752651](https://doi.org/10.5281/zenodo.20752651)
- All-versions DOI:
  [10.5281/zenodo.20752650](https://doi.org/10.5281/zenodo.20752650)
- Version: 1.0
- Published: 18 June 2026
- Creators: Omar Choudhry and Dominic Jones
- Licence: CC BY 4.0
- Displayed deposit size: about 7.0 GB

Recommended citation:

Choudhry, O., and Jones, D. (2026). LASK: A Dataset for Laparoscopic Skill and
7-DoF Kinematics (Version 1.0) [Dataset]. Zenodo.
https://doi.org/10.5281/zenodo.20752651

## Scale and annotation boundary

The release contains 37 trials:

- 19 trials in the 7-DoF training cohort
- 10 trials in the 7-DoF in-distribution validation cohort
- 8 trials in the 6-DoF out-of-distribution test cohort

Dense, time-aligned kinematics cover about 91,000 frames. Visual labels are a
different record. The deposited README describes sparse manual keyframes,
roughly every 100th frame and at least three per trial. Those keyframes contain
two-instrument masks, tooltip and jaw keypoints, shaft-joint keypoints, and
per-component visibility flags.

Do not say that 91,000 images were manually annotated. Do not claim that AI
generated the deposited visual ground truth. The record describes the visual
annotations as manual.

## Public software history

Repository:
[omariosc/frame-annotator](https://github.com/omariosc/frame-annotator)

### Initial public beta

- Commit:
  [deb7d43a2b6ff93ac1ac5a33c2f00028d7833823](https://github.com/omariosc/frame-annotator/commit/deb7d43a2b6ff93ac1ac5a33c2f00028d7833823)
- Date: 5 March 2026
- Public description: config-driven Flask application, clip and range labels,
  interactive timeline, keyboard shortcuts, and JSON/CSV exports
- Commit trailer: records Claude Opus 4.6 as co-author

The public evidence supports "mark long runs once and export frame-level
records". It does not support an invented time-per-frame measurement.

### Larger surgical-annotator integration

- Commit:
  [461615a71beabeaa0ed67120a883cf4ce900d7b1](https://github.com/omariosc/frame-annotator/commit/461615a71beabeaa0ed67120a883cf4ce900d7b1)
- Date: 20 June 2026
- Public features: masks, shaft lines, keypoints, phase/event timelines,
  copy-prior, auto-advance, batch triage, and a larger one-key control map
- Repository licence: MIT at the checked revision

These features support the lesson that a custom tool can be shaped around
repeated expert actions and keyboard muscle memory.

## Omar's first-hand account

The following claims come from Omar and are labelled as an author account in
the tutorial:

- The beta idea was first explored at the Hamlyn Symposium.
- The practical question was whether a small interface could make frame-level
  annotation very fast.
- The speed and feel of that prototype made a larger annotation project seem
  feasible.
- The later custom interface was used while building the LASK annotations.

No checked public source independently records the Hamlyn origin, a measured
annotation speed, or an explicit statement that this repository produced the
LASK labels. These details should remain first-person unless the dataset,
paper, or repository documentation is updated.

## What AI did

The public commit trailers support the statement that AI coding tools helped
implement and iterate the software. A defensible contribution split is:

AI assistance:

- translated reviewed interaction requirements into code
- suggested refactors, tests, packaging, and documentation
- helped iterate shortcuts, batch actions, and exports

Human responsibility:

- defined the annotation protocol and task meanings
- chose commands and shortcuts that matched the annotator's working rhythm
- reviewed code and interaction behaviour
- performed quality checks and corrections
- remained accountable for released labels

Avoid "AI made the annotations", "AI wrote everything", or any wording that
turns implementation assistance into scientific authorship or ground truth.

## Screenshot decision

- The current tutorial uses an original synthetic peg-transfer SVG rather than
  a repository screenshot. It contains no patient or clinical image.
- The SVG is pinned by SHA-256 in the automated test suite.
- `surgical_safety.png` contains a scene with unclear embedded-image
  provenance and should not be reused until rights are confirmed.
- Three detailed surgical-annotator screenshots were taken from a SafeSurg
  abstract. Confirm that publication's media licence before reuse.
- A fresh screenshot made from the MIT tool using synthetic or rights-cleared
  LASK imagery should credit the software, dataset creator, DOI, CC BY 4.0
  licence, and any crop or annotation changes.

## Claim used in the tutorial

AI coding tools can help a researcher build an annotation interface around
their own protocol, commands, and repeated motions. The speed gain must be
measured against a manual baseline, and the resulting dataset still needs
human-defined labels, review, provenance, and a clear claim boundary.
