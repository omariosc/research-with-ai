# Research with AI v1.5.0 release evidence record

Record date: 29 July 2026

Content release: `v1.5.0`

Author and accountable reviewer: Omar Choudhry

Reviewed feature commit: `d3f4008bcbf7c9b6f52d83df0dfb72a964ba46d8`

Source archive SHA-256: `323646e81668be40abdc7b2c6c6e897f34fca39ea524116cddc7403cc209b180`

## Purpose

This record describes what was added, checked, attributed, and deliberately
excluded in v1.5.0. It supports the tutorial platform's release process. It
does not establish the scientific validity, clinical safety, accessibility, or
educational effectiveness of an arbitrary AI workflow, website, annotation
tool, model, or conference.

## Release additions

- Added three paper-native companions for the published HTL tool-detection
  paper, the published LASK 7-DoF dataset paper, and the accepted BTPN paper.
- Preserved the paper titles, authors, exact source abstracts, section order,
  original figures, captions, and complete selected tables.
- Kept tutorial interpretation visibly separate from source material and
  exposed full-resolution figure and table links.
- Replaced the annotation teaching recreations with the authentic public
  `frame-annotator` and `surgical-annotator` frontends plus browser-local demo
  adapters.
- Expanded the approved frame demonstration to ten sequential Hamlyn
  presentation frames and retained exactly three disclosed LASK v1.0 image and
  native-annotation pairs.
- Added a floating workshop table of contents, destination-coloured
  continuation cards, and responsive fixes for narrow columns and overflow.
- Refreshed screenshots, citations, release metadata, and annotation schema
  version 1.5.0.

## Source and rights decisions

| Item | Use in this release | Rights and distribution decision |
| --- | --- | --- |
| HTL paper | Exact abstract, Figures 1 to 3, and Tables 3 to 5 | Open-access article assets retained under CC BY 4.0 with attribution and hashes |
| LASK MIUA paper | Exact published abstract, Figure 1, and a figure-detail crop | Author-created paper figure used with lead-author permission; published and accepted-manuscript wording is not silently merged |
| BTPN accepted paper and public repository | Exact abstract, section headings, Figures 1 to 4, and tightly bounded Tables 1 and 2 | Lead-author permission recorded; complete manuscript PDF, reviews, responses, affiliations, emails, and private paths excluded |
| `omariosc/frame-annotator` | Authentic static frontend and ten approved presentation frames | Public source retained with its licence and commit record; no additional frame is distributed |
| `omariosc/surgical-annotator` and LASK v1.0 | Authentic static frontend and three disclosed Trial46 examples | Public source and dataset attribution retained; browser edits are teaching state, not new research labels |
| Tutorial prose, diagrams, charts, and interface | Educational material | Original content under CC BY 4.0; application source under MIT |

The HTL paper figures include already-published, deidentified ART-Net and
EndoVis in-vivo panels. They contain no patient identifiers or embedded
metadata. The LASK and BTPN examples used here are non-in-vivo box-trainer
images.

## Evidence boundaries

| Public statement | Evidence in v1.5.0 | Boundary |
| --- | --- | --- |
| The paper companions use the actual papers | Exact abstracts, original figure assets, direct table crops, source hashes, and rendered-route tests | Interactive controls rearrange reported evidence; they do not run inference or reproduce a paper |
| The LASK companion represents the published paper | Published Frontiers extract hash and exact abstract | The accepted author manuscript has a longer opening and different Boot Camp ordinals; versions are not silently blended |
| BTPN material is safe to publish | Public repository already exposes technical material; selected paper assets have lead-author permission | The official proceedings URL is pending and the complete camera-ready PDF is not distributed |
| The frame demo respects the approved boundary | Exact allowlist for `frame_0000.png` through `frame_0009.png` in both public locations | The frames are lossy recoveries from an author-owned presentation video, not raw prototype files |
| The surgical demo uses public LASK examples | Three pinned image and native-annotation pairs with hashes | These examples do not establish annotation accuracy, model performance, or clinical validity |
| No private research or participant record is distributed | Public-asset scan, path and identifier checks, metadata review, and BTPN crop OCR | Published, deidentified paper figures remain part of the cited scientific record |

## Recorded automated checks

The release gate ran:

```text
npm run build
npm run typecheck
npm run lint
npm test
npm run check:links
npm run check:annotation-roundtrip
npm run check:medmnist
npm audit --audit-level=high
npm run check:public-assets
npx wrangler deploy --dry-run --config edge-proxy/wrangler.jsonc
git diff --check
```

### Automated results

- The production build, TypeScript check, lint, and edge Worker dry run
  completed successfully.
- The Node suite passed 89 tests with no failures.
- The public-asset gate inspected 136 files totalling 22,864,539 bytes and
  found no generated environments, bytecode, private files, symlinks, or
  oversized assets.
- The exact ten-frame Hamlyn allowlist and three-pair LASK boundary passed.
- Two annotation records completed the review-CSV round trip without field
  loss. The deliberately lossy YOLO export declared every omitted field.
- Four MedMNIST verification tests passed and the released prediction files
  recovered the reported AUC and accuracy cells at three decimals.
- `npm audit --audit-level=high` reported no known vulnerabilities.
- All 14 paper figure and table assets and three gallery captures matched their
  recorded SHA-256 hashes. WebP metadata inspection reported no embedded
  EXIF, XMP, ICC, or other feature blocks.

### Reading budget

| Tutorial | Tutorial words excluding references | Total visible words |
| --- | ---: | ---: |
| Agentic AI in Research | 3,995 | 4,670 |
| Building a Website for Your Research Using AI | 3,991 | 4,363 |
| Developing Custom Annotation Tools Using AI | 3,886 | 4,361 |
| Run an AI in Healthcare Conference | 3,995 | 4,181 |

Every tutorial remains below the challenge's 4,000-word limit when the repeated
source library is excluded.

### Browser and link review

Fresh Chrome checks covered all three paper companions at 1,440 by 900,
1,024 by 768, 768 by 1,024, and 390 by 844 pixels. All 12 combinations loaded
the source figures and captions prominently, had no page-level horizontal
overflow, and produced no console warnings or errors. In-page navigation
landed correctly after lazy images loaded. The authentic annotation demos were
also exercised while their final 1,440 by 900 README captures were produced.

The pre-publication link run found 214 unique external links: 191 reachable,
16 publisher or vendor responses retained for manual review, two expected
404s for the not-yet-published v1.5.0 GitHub release and its attached source
archive, and five transient Zenodo failures. A separate check confirmed that
the four Zenodo DOI endpoints returned valid 301 or 302 redirects and the
MedMNIST Zenodo data endpoint returned HTTP 200. The GitHub release links are
rerun after publication.

## Public-release safety review

- Exactly ten approved Hamlyn frames exist in each intended public location.
  Spot checks show the same obscured partial profile rather than a
  progressively clearer view.
- Exactly three LASK JPEG and native JSON pairs exist. They contain no
  patient-identifiable or participant-level information.
- The two BTPN table crops contain only captions, aggregate dataset counts,
  and reported results. OCR found no manuscript header, affiliation, email,
  review, response, private path, or participant record.
- Public-source scans found no submission identifier, workstation path,
  credential, secret, private manuscript, review, response, generated
  environment, or unexpected archive.

## Human release gates

- Complete a screen-reader review and keyboard-only review with assistive
  technology beyond automated semantic checks.
- Run the learner-pilot protocol with target researchers and report negative
  findings as well as improvements.
- Record the four videos, captions, transcripts, and final MICCAI submission
  text.
- Replace the BTPN coming-soon record only when the official proceedings URL
  and final citation are public.
- Do not treat this record, an exported plan, or a completed checklist as proof
  that governance, scientific, accessibility, or event-safety review occurred.

## Source snapshot

`research-with-ai-v1.5.0-source.zip` was generated with `git archive` from the
reviewed feature commit named above. `public/releases/**` is excluded to
prevent archives nesting older release files. The archive is attached to the
GitHub v1.5.0 release rather than duplicated in the production site bundle.
The public `.sha256` file records its digest. The release-snapshot commit and
tag add the audit and digest without changing the reviewed feature tree.
