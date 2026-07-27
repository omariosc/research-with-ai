# Third-party notices

The project links to many external papers, standards, repositories, datasets,
and product pages. Those links do not change the rights in the source material.
The items below are the third-party materials copied into this repository or
retrieved by a bundled worked example.

## MedMNIST v2 Figure 1

- Local file:
  `public/worked-examples/medmnist-breast/medmnist-figure-1.jpg`
- Source: Jiancheng Yang et al., "MedMNIST v2 - A large-scale lightweight
  benchmark for 2D and 3D biomedical image classification", Figure 1,
  <https://doi.org/10.1038/s41597-022-01721-8>
- Retrieved image:
  <https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3ac8/9852451/45d10a61d7e2/41597_2022_1721_Fig1_HTML.jpg>
- Licence: Creative Commons Attribution 4.0 International
- Change: the same-sized PMC JPEG is reused without further visual editing;
  the website adds responsive presentation, concise alt text, attribution, and
  a separately authored long description
- SHA-256:
  `490bafbc9a24fec64a825b4e18cfc0544e3b897140097116175cefa482edca65`

The source figure title is "An overview of MedMNIST v2." The recorded hash is
for the local JPEG. The website does not copy the publisher's performance table
as an image.

## MedMNIST data and released predictions

The worked verifier temporarily retrieves:

- `breastmnist.npz` from
  <https://doi.org/10.5281/zenodo.5208230>, version 2.0, CC BY 4.0; and
- three members of `predictions.zip` from
  <https://doi.org/10.5281/zenodo.7782114>, CC BY 4.0.

Those source files are not redistributed in this repository. Their versions,
checksums, use, and claim boundary are recorded in
`public/worked-examples/medmnist-breast/source-manifest.json`.
The manifest also traces BreastMNIST to the original BUSI dataset paper rather
than treating the derivative benchmark as the start of the provenance chain.

## Historical frame-annotator interface image

The immutable v1.1.0 and v1.2.0 source snapshots contain
`public/frame-annotator-safety-interface.png`, taken from the author's public
`omariosc/frame-annotator` repository at commit
`3e94ed03c1487331b8c041ca755421686b41d031`. It remains subject to the source
repository's rights. The v1.3.0 annotation demo replaced it with the original
vector fixture `public/worked-examples/annotation-synthetic-frame.svg`, which
contains no patient or clinical image.

## Annotation showcase media

### Frame-annotator sample images

The current showcase includes byte-for-byte copies of only the first three
sample images from `omariosc/frame-annotator` at commit
`3e94ed03c1487331b8c041ca755421686b41d031`:

- `public/worked-examples/annotation-showcase/frame-annotator/frame_0000.png`
- `public/worked-examples/annotation-showcase/frame-annotator/frame_0001.png`
- `public/worked-examples/annotation-showcase/frame-annotator/frame_0002.png`

The source repository identifies Omar Choudhry as copyright holder and is
licensed under MIT. The files are unchanged. Only the first three images were
approved because the author is not clearly identifiable in them. No later
sample frame is included or covered by this notice.

The accompanying `starter-annotations.json`, SHA-256
`1ef19d0e7eb12a2d65bf7304e362ea5a88038fe170c4909e5fd0841cd5341983`,
is a new teaching record. It is not an original research annotation or source
ground truth.

### LASK v1.0 Trial46 stills and annotations

The showcase also contains three non-in-vivo stills from Trial46 in:

> Choudhry, O., and Jones, D. (2026). *LASK: A Dataset for Laparoscopic Skill
> and 7-DoF Kinematics* (Version 1.0) [Dataset]. Zenodo.
> https://doi.org/10.5281/zenodo.20752651

The version DOI is `10.5281/zenodo.20752651`, and the all-versions DOI is
`10.5281/zenodo.20752650`. LASK v1.0 is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The source is
`DatasetA_7DOF_train.zip` at archive MD5
`59ec32280bfe2874209ce5c5603a7de1`, specifically
`DatasetA_7DOF_train/videos/Trial46.mp4` and the released
`DatasetA_7DOF_train/annotations/Trial46.npz`. Zero-based frames 200, 1000, and
1800 were decoded to JPEG without cropping, resizing, retouching, or adding an
overlay. This decoding and JPEG encoding is the only visual transformation.

Each paired JSON file is an unchanged copy of Omar Choudhry's original native
`surgical-annotator` record. It was not reconstructed from the NPZ. The mask
and keypoint geometry was cross-checked against the public NPZ within float32
rounding. Native-only fields such as shaft lines and phase labels are not
members of the Zenodo archive.

The images and records demonstrate an annotation workflow. They do not
establish annotation accuracy, inter-rater reliability, model or clinical
performance, and they are not fresh AI predictions. Full paths, hashes,
transformations, attribution, and the browser-local editing boundary are
recorded in
`public/citations/annotation-showcase-media-2026-07-27.md`.

## Generated social preview

`public/research-with-ai-social.png` was generated for this project with an
OpenAI image model. Its AI origin is disclosed in `AI_USE.md`.

## AI in Healthcare Conference media

### LinkedIn photographs

The in-development conference tutorial contains eight distinct event
photographs retrieved from two posts by Mohammad Tasfiq Jawaad:

- [Conference recap post](https://www.linkedin.com/posts/mohammad-tasfiq-jawaad_leedsaiweek-ai-healthcare-ugcPost-7428858664037396480-NJEn/)
- [Opening keynote post](https://www.linkedin.com/posts/mohammad-tasfiq-jawaad_leedsaiweek-healthcare-ai-activity-7428762183339180032-_Vyb)

The local files are:

- `public/images/ai-healthcare-conference/audience-questions.jpg`
- `public/images/ai-healthcare-conference/audience-wide.jpg`
- `public/images/ai-healthcare-conference/closing-mohammad-jawaad.jpg`
- `public/images/ai-healthcare-conference/conference-session-wide.jpg`
- `public/images/ai-healthcare-conference/healthcare-it-landscape.jpg`
- `public/images/ai-healthcare-conference/nhs-data-ai-healthcare.jpg`
- `public/images/ai-healthcare-conference/opening-mohammad-jawaad.jpg`
- `public/images/ai-healthcare-conference/sharib-ali-surgical-vision.jpg`

Omar Choudhry recorded on 26 July 2026 that Mohammad Tasfiq Jawaad gave
permission for the photographs in both posts to be downloaded and used in this
tutorial. That permission supports this project use. It does not establish
photograph ownership, transfer copyright, or create a general licence for
redistribution or reuse elsewhere. These files are therefore excluded from the
CC BY 4.0 licence applied to original tutorial content.

The photographs include identifiable speakers and attendees. They document
parts of the event and its setting but do not establish an exact attendance
count, participant characteristics, consent choices, or event impact. Source,
permission, duplicate handling, accessibility text, hashes, and unresolved
questions are recorded in
`public/citations/ai-healthcare-conference-media-2026-07-26.md`.

### Excluded organiser-supplied review material

A schedule image, a larger event-photo collection, selected committee,
poster-discussion and lunch photographs, and a personalised certificate were
reviewed while developing the tutorial. They are not copied, linked or rendered
in the public repository because a review link alone does not establish reuse
rights, subject consent, or that visible badges, QR codes and names are intended
for republication.

The non-personal timetable information is transcribed into the dated operations
record. The public interface explains the committee, catering, poster session
and certificate lessons in text. Any future media addition requires a recorded
rightsholder, permission scope, subject review, caption, alt text and file hash
before it enters `public/`.
