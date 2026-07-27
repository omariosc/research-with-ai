# Annotation tool origin and evidence record

Checked: 2026-07-27

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

## Research outcome chronology

The tutorial now places the tools inside the research programme they supported.
The records below remain separate because their cohorts, labels, and
publication status differ.

### MIUA 2025 and the earlier bounding-box workload

- Publication:
  [7-DoF Laparoscopic Peg Transfer Dataset for Surgical Skill Assessment](https://eprints.whiterose.ac.uk/id/eprint/230457/)
- Venue: 29th UK Conference on Medical Image Understanding and Analysis,
  Leeds, 15–17 July 2025
- Published: 14 August 2025 by Frontiers Media S.A.
- Reported scale: 114 trials, 324,101 video frames, and 3,725
  bounding-box-labelled frames
- Fully labelled validation sequence: 2,680 consecutive frames
- Licence: CC BY 4.0

This publication predates the public frame-annotator beta. It supports the
claim that annotation friction was a real research problem, but it does not
name which private software produced the boxes. The proceedings identifier
`10.3389/978-2-8325-5137-0` identifies the Frontiers volume rather than a
unique article DOI.

The same box-labelled laparoscopic dataset also supported
[Real-Time Tool Detection in Laparoscopic Datasets for Surgical Training in Low-Resource Settings](https://doi.org/10.1049/htl2.70045),
published in *Healthcare Technology Letters* in 2025. The tutorial cites this
as a downstream research outcome. It does not repeat the article's nano-model
latency headline because its abstract and Table 5 assign the 3.1 ms result to
different models.

### Hamlyn Winter School group project

- Official event:
  [Hamlyn Winter School on Surgical Imaging and Vision](https://www.imperial.ac.uk/a-z-research/hamlyn-centre/events-and-global-engagement/hamlyn-winter-school-on-surgical-imaging-and-vision/)
- Dates: 1–5 December 2025
- Official format: invited lectures, workshops, mini-projects, group-project
  sessions, and a final project evaluation
- Project title:
  *Know Your ABCs: Objective Robotic Surgical Skill Assessment Using 3D Human
  Body Pose Estimation*
- Author archive scale: 994 synchronised RGB-D frame pairs and 116 labelled
  clips

Imperial's public programme verifies the project setting, while Omar's public
portfolio records the presentation title and date. The aggregate frame and
clip counts come from the author-supplied project archive. The public
`surgical_safety.yaml` configuration records the A, B, and C labels as
improper posture, hyperextension, and controller collision. Omar's statement
that he built and used the fast workflow around this project remains a
first-hand account. No timing study is claimed.

### BTPN at MICCAI 2026

- Paper:
  *Bayesian Temporal Pose Networks for Uncertainty-Calibrated Laparoscopic Tool
  Pose Tracking*
- Public companion:
  [omariosc/BTPN](https://github.com/omariosc/BTPN)
- Status: accepted to MICCAI 2026, recorded in the author-maintained public
  repository and citation file
- Proceedings status at this check: forthcoming; no proceedings DOI is claimed

The BTPN visual pipeline uses segmentation masks and keypoints from the same
research programme. This supports the outcome claim that richer annotations
became inputs to an accepted paper. Until the official proceedings record is
public, the tutorial labels the acceptance status as author-reported rather
than implying independent conference indexing.

## Denominator boundary

Do not merge the 114-trial MIUA publication, the broader 115-recording analysis
history, and the 37-trial LASK v1.0 release. They answer different questions
and are not interchangeable denominators.

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

- The beta idea was explored through the group project at the 2025 Hamlyn
  Winter School on Surgical Imaging and Vision.
- The practical question was whether a small interface could make frame-level
  annotation very fast.
- The speed and feel of that prototype made a larger annotation project seem
  feasible.
- The later custom interface was used while building the LASK annotations.

The official Hamlyn record verifies the event and project format, and the
public configuration preserves the label taxonomy. No checked public source
independently records a measured annotation speed or explicitly states that
this repository produced the LASK labels. Those details remain first-person
unless the dataset, paper, or repository documentation is updated.

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

- The current interactive showcase uses exactly the first three
  frame-annotator repository samples in canonical filename order. This is the
  author's explicit privacy boundary because he is not clearly identifiable in
  those frames. No later sample is published.
- The surgical showcase uses three non-in-vivo Trial46 frames from LASK v1.0,
  paired with the author's original native surgical-annotator records.
- Image, annotation, transformation, licence, and SHA-256 details are recorded
  in
  [the annotation showcase media record](../citations/annotation-showcase-media-2026-07-27.md).
- Repository tests pin the six image files and four annotation records.
- `surgical_safety.png` contains a scene with unclear embedded-image
  provenance and should not be reused until rights are confirmed.
- Rights-unresolved abstract screenshots and later frame-annotator samples are
  not included.

## Claim used in the tutorial

AI coding tools can help a researcher build an annotation interface around
their own protocol, commands, and repeated motions. The speed gain must be
measured against a manual baseline, and the resulting dataset still needs
human-defined labels, review, provenance, and a clear claim boundary.
