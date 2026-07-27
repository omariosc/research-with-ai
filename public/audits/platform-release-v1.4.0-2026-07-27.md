# Research with AI v1.4.0 release evidence record

Record date: 27 July 2026

Content release: `v1.4.0`

Author and accountable reviewer: Omar Choudhry

Reviewed feature commit: `d72814ddb89dcd77a7c99704e965f68119880d51`

Source archive SHA-256: `e2fdb25733e5bf9c74dfa272bbbf1e464d0298ac275ea838637b5a42d7b697d7`

## Purpose

This record describes what was added, tested, attributed, and left for human
review in v1.4.0. It supports the tutorial platform's own release process. It
does not establish the scientific validity, clinical safety, accessibility, or
event quality of an arbitrary AI workflow, website, annotation tool, model, or
conference.

## Release additions

- Released the fourth tutorial, **Run an AI in Healthcare Conference**, at its
  dedicated canonical hostname.
- Added a first-hand Leeds AI Week case, an advertised-versus-delivered
  programme comparison, committee responsibility map, aggregate denominator
  ledger, complete-scale feedback charts, media boundaries, and a local
  conference planner.
- Rebuilt the annotation demonstration around the public frame-annotator and
  surgical-annotator workflows. The public showcase is restricted to the first
  three privacy-approved frame samples and three disclosed LASK image and
  annotation pairs.
- Connected the annotation-tool story to the Hamlyn Winter School group
  project, MIUA bounding-box work, LASK v1.0, and BTPN while separating public
  evidence from first-hand software links.
- Added an original Paper2Web prevalence visual using the published numerator,
  denominator, and method boundary.
- Strengthened AI paper review as a recurring human-owned activity across
  design, analysis, drafting, submission, and material revision.
- Refreshed screenshots, citations, version metadata, the annotation schema,
  and source-release records for all four tutorials.

## Source and rights decisions

| Item | Use in this release | Rights decision |
| --- | --- | --- |
| MICCAI Educational Challenge call | Submission scope and packaging checklist | Linked and paraphrased |
| Leeds AI Week conference pages | Public event context | Linked and paraphrased |
| Conference feedback and attendance workbooks | Aggregate evaluation record | Identifiable workbooks excluded from the repository and site |
| Eight conference photographs | First-hand event context | Used under recorded project-specific permission; excluded from the tutorial's CC BY 4.0 licence |
| Rights-unresolved organiser images and certificate example | None | Excluded from the repository, site, screenshots, and recording plan |
| `omariosc/frame-annotator` | Public software history and first-hand case | Repository and commits linked; the tutorial publishes only the approved sample boundary |
| LASK v1.0, DOI `10.5281/zenodo.20752651` | Public dataset facts and three disclosed showcase records | Attributed and linked under the dataset record; no claim that all frames were manually labelled |
| Paper2Web accepted paper | Homepage prevalence counts and measurement boundary | Linked and paraphrased; original HTML and CSS chart used instead of copying a paper figure |
| MedMNIST v2 Figure 1 | Existing biomedical evidence example | Reused under CC BY 4.0 with attribution, hash, alt text, and long description |
| Tutorial prose, diagrams, charts, and interface | Educational material | Original content under CC BY 4.0; application source under MIT |

External papers, datasets, repositories, product names, photographs, and
trademarks retain their own rights. Historical release snapshots remain
immutable and retain their original notices.

## Evidence boundaries

| Public statement | Evidence in v1.4.0 | Boundary |
| --- | --- | --- |
| All four tutorials are released | Version metadata, individual citations, rendered-route tests, and dedicated canonical hostnames | DNS and live routing still require a post-deployment check |
| The conference tutorial is grounded in a delivered event | First-hand organiser account, public event listings, aggregate records, and project-permitted photographs | The tutorial is not an independent evaluation and does not infer attendance or impact from photographs |
| Conference feedback is reported honestly | Thirty-response distributions and means shown with their denominator | Voluntary respondents may not represent every attendee and no response rate is calculated without a reconciled attendance denominator |
| The frame demonstration respects the privacy boundary | Exact allowlist and automated test for `frame_0000`, `frame_0001`, and `frame_0002` | No other frame-annotator image is approved for this public tutorial |
| The surgical demonstration uses three public LASK examples | Three pinned image and native-annotation pairs with hashes and attribution | These examples do not establish annotation accuracy, model performance, or clinical validity |
| The Paper2Web chart reports a measured opportunity | 10,716 verified homepages among 96,559 papers in the published corpus | The selected conference corpus and link-detection method do not represent every research field or prove that a website causes impact |
| AI assisted implementation and review | Version history, AI-use record, prompts, tests, and human disposition guidance | AI output is not scientific evidence and humans retain release responsibility |

## Recorded automated checks

The release gate runs:

```text
npm run lint
npm run typecheck
npm test
npm run check:links
npm run check:annotation-roundtrip
npm run check:medmnist
npm audit --audit-level=high
npx wrangler deploy --dry-run --config edge-proxy/wrangler.jsonc
```

The final command results, test count, link totals, reading budgets, browser
viewports, and deployment checks are recorded before the release tag is
published.

### Automated results

- The production build, lint, and type-check completed successfully.
- The Node suite passed 79 tests with no failures.
- The public-asset gate inspected 77 files totalling 12,551,210 bytes and found
  no generated environments, bytecode, private files, symlinks, or oversized
  assets.
- The exact first-three frame allowlist and three-pair LASK boundary passed.
- Two annotation records completed the review-CSV round trip without field
  loss. The deliberately lossy YOLO export declared every omitted field.
- Four MedMNIST verification tests passed and the three released prediction
  files recovered the reported AUC and accuracy cells at three decimals.
- The locked model-service Python suite passed three tests. A live Docker run
  returned HTTP 200 for health, readiness, and an authorised golden
  prediction, HTTP 401 without the token, probability `0.619517`, UID 10001,
  a healthy container, and a failed write attempt against the read-only
  application filesystem.
- `npm audit --audit-level=high` reported no known vulnerabilities.
- The edge Worker dry run completed successfully.

### Reading budget

| Tutorial | Tutorial words excluding references | Total visible words |
| --- | ---: | ---: |
| Agentic AI in Research | 3,946 | 4,621 |
| Building a Website for Your Research Using AI | 3,588 | 3,960 |
| Developing Custom Annotation Tools Using AI | 3,966 | 4,441 |
| Run an AI in Healthcare Conference | 3,971 | 4,157 |

Every tutorial remains below the challenge's 4,000-word limit when the repeated
source library is excluded.

### Browser and link review

Chrome checks covered the homepage, all four tutorials, the version history,
and the methods page at 390 by 844, 768 by 1,024, 1,024 by 1,366, and 1,440 by
900 pixels. Every route had zero horizontal overflow. The phone navigation
exposed all four tutorial links, and both the light and dark themes rendered
with the expected background and responsive width.

The pre-publication link run found 210 unique external links: 193 reachable,
16 publisher or vendor responses retained for manual review, and one expected
404 for the not-yet-published v1.4.0 GitHub release URL. That self-referential
release link must be rerun after publication and is not counted as evidence
that the public release already exists.

## Human release gates

- Complete a screen-reader review and a keyboard-only review with assistive
  technology beyond the automated semantic checks.
- Run the learner-pilot protocol with target researchers and report negative
  findings as well as improvements.
- Record the four videos, captions, transcripts, and final MICCAI submission
  text.
- Keep approximate conference competition totals labelled as approximate until
  reconciled against judging or submission records.
- Reconcile attendance definitions before publishing a registration-to-
  attendance or feedback response rate.
- Recheck photograph and quotation permissions for any use beyond this
  tutorial.
- Do not treat this record, an exported plan, or a completed checklist as proof
  that governance, scientific, accessibility, or event-safety review occurred.

## Source snapshot

`research-with-ai-v1.4.0-source.zip` is generated with `git archive` from the
reviewed feature commit named above. `public/releases/**` is excluded to prevent
archives nesting older release files. The adjacent `.sha256` file records the
archive digest. The release-snapshot commit and tag add the archive without
changing the reviewed feature tree.
