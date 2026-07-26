# Research with AI v1.3.0 release evidence record

Record date: 26 July 2026

Content release: `v1.3.0`

Author and accountable reviewer: Omar Choudhry

Reviewed feature commit: `32b46f3b1f7f84c1ed56052768836c6517fe5d0f`

Source archive SHA-256:
`fa7b5e0bd466af1608b28580926f21c288f30d4ced081a066c220358168d3054`

## Purpose

This record describes what was added, tested, attributed, and left for human
sign-off in v1.3.0. It supports the tutorial's own first-hand release case. It
does not establish the scientific validity of an arbitrary AI workflow,
annotation tool, paper website, or model deployment.

## Release additions

- Named browser-local projects with separate notes, progress, assessments,
  deep-dive checks, and builder drafts.
- An original comparison of Google Co-Scientist, AI Scientist v1, AI Scientist
  v2 and the related Nature study, and Medical AI Scientist.
- A first-hand annotation-tool account linked to public frame-annotator commits
  and LASK v1.0, with public facts separated from the author's recollection.
- An original synthetic annotation scene in place of a repository screenshot.
- A complete synthetic FastAPI and Docker teaching pack with locked
  dependencies, model checksum, tests, localhost binding, least-privilege
  controls, hardware guidance, and a deployment record.
- Version 1.3.0 of the immutable annotation specification schema.

## Source and rights decisions

| Item | Use in this release | Rights decision |
| --- | --- | --- |
| MICCAI Educational Challenge call | Submission scope and packaging checklist | Linked and paraphrased |
| Google Co-Scientist and AI Scientist papers | Original system comparison and reading notes | Linked and paraphrased; no paper figures copied |
| Medical AI Scientist preprint | Original system comparison | Linked and paraphrased; no paper figures copied |
| `omariosc/frame-annotator` | Public software history and first-hand case | Repository and commits linked; current tutorial does not copy a repository screenshot |
| LASK v1.0, DOI `10.5281/zenodo.20752651` | Public dataset facts and citation | Linked, not redistributed; Zenodo record states CC BY 4.0 |
| `annotation-synthetic-frame.svg` | Interactive annotation teaching scene | Original project graphic, no patient or clinical image, released with the tutorial content under CC BY 4.0 |
| Synthetic linear model data | Container mechanics teaching fixture | `model.json` released under CC0-1.0 |
| Model-service implementation | Downloadable FastAPI and Docker pack | MIT licence included in the pack |
| MedMNIST v2 Figure 1 | Existing biomedical evidence example | Reused under CC BY 4.0 with attribution, hash, alt text, and long description |
| Tutorial prose, diagrams, and interface | Educational material | Original text and graphics under CC BY 4.0; application source under MIT |

External papers, datasets, repositories, product names, and trademarks retain
their own rights. Historical v1.1.0 and v1.2.0 source archives still contain the
older frame-annotator image and remain described in `THIRD_PARTY_NOTICES.md`.

## Evidence boundaries

| Public statement | Evidence in v1.3.0 | Boundary |
| --- | --- | --- |
| Project records remain separate | Versioned workspace schema, project-scoped keys, migration, sanitisation, isolation, reset, and export tests | Browser local storage is unencrypted and separate on each origin |
| The AI scientist comparison is source-led | Dated reading notes with versions, methods, reported evidence, code status, human roles, and limitations | The tutorial did not independently reproduce every system |
| The Hamlyn account is first-hand | Author-labelled account beside separately linked public commits | The public repository does not verify the event origin or a measured speed |
| LASK gives a concrete scale example | Versioned Zenodo record and deposited documentation | Dense kinematics across about 91,000 frames must not be confused with sparse manual visual keyframes |
| AI helped build the annotation software | Public commit trailers and author review | The released LASK visual ground truth remains described as manual |
| The model-service pack is runnable | Locked Python tests, live Docker checks, model hash, golden output, and negative requests | A working service does not validate a research model or make a public endpoint secure |
| The three tutorials remain independently citable | Dedicated canonical hostnames and custom-domain rendering tests | DNS and live routing must be checked after each deployment |

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
PYTHONDONTWRITEBYTECODE=1 uv run --no-project --python 3.12 \
  --with-requirements requirements-test.lock \
  python -m pytest -q -p no:cacheprovider
```

The production build and 53 Node tests passed. They cover rendered routes and
metadata, project storage and migration, builders, annotation schemas and round
trips, the synthetic scene hash, the model-service pack and ZIP checksum, edge
routing, navigation, accessibility semantics, every rendered local artefact,
the non-recursive source snapshot, and required tutorial content.

The external-link audit found 177 unique external links. It recorded 166 as
reachable, retained 11 publisher or vendor responses for manual review, and
reported no automated failures. Loopback URLs used only in runnable localhost
instructions and the project's own release URLs are intentionally excluded and
checked by separate local and post-deployment gates.

The dependency audit reported no known vulnerabilities. The edge Worker dry
run completed successfully.

## Reading budget

The submission checklist sets a limit below 4,000 words excluding references.
The release script removes the rendered source-library section before applying
that rule, while still reporting total visible text:

| Tutorial | Tutorial words excluding references | Total visible words |
| --- | ---: | ---: |
| Agentic AI in Research | 2,936 | 3,531 |
| Building a Website for Your Research Using AI | 3,041 | 3,404 |
| Developing Custom Annotation Tools Using AI | 3,635 | 3,960 |

The annotation route is longer because the generated specification, interactive
demo, code-audit case, and public-versus-first-hand origin record are visible
teaching material rather than hidden appendices.

## Model-service acceptance record

The locked Python suite passed three tests. A live Docker run then confirmed:

- readiness and metadata endpoints;
- the golden synthetic probability `0.619517`;
- HTTP 401 without the bearer token;
- HTTP 422 for a wrong-length input;
- execution as UID 10001;
- failure when attempting to write under the read-only `/app` filesystem;
- healthy container status; and
- logs without the token or request features.

The Compose example binds to `127.0.0.1`, reads the token from an ignored host
file, drops Linux capabilities, prevents privilege escalation, limits
resources, and uses a read-only filesystem. Remote access remains a separate
decision. The tutorial recommends an authenticated VPN or outbound tunnel over
raw router port forwarding and never recommends exposing the Docker daemon.

## Browser review

Chrome checks covered:

- all three tutorial routes;
- named project creation, switching, note isolation, and deep-dive isolation;
- light and dark modes;
- 1200 by 718 and 390 by 844 layouts;
- mobile horizontal scrolling for wide evidence tables;
- the synthetic annotation interaction;
- the container walkthrough and downloadable files; and
- clean route loads with no console errors or warnings.

Automated storage tests provide the release check for scoped reset and
migration. A separate screen-reader session and learner pilot remain human
gates.

## Human release gates

- Read every blocked publisher or vendor link manually before submission.
- Complete author review of claims, citations, rights, prompts, and exports.
- Run the learner-pilot protocol with target researchers and record revisions.
- Complete a screen-reader pass and final keyboard-only review.
- Record the three videos, captions, transcripts, and final submission text.
- After deployment, verify authoritative DNS, canonical metadata, security
  headers, downloads, and route identity on all four public hostnames.
- Do not treat this record, generated export files, or checklist ticks as proof
  that governance or scientific review occurred.

## Source snapshot

`research-with-ai-v1.3.0-source.zip` is generated with `git archive` from the
reviewed feature commit named above. Historical archives are excluded to avoid
recursively nesting release files. The adjacent `.sha256` file records the
archive digest. Later documentation-only commits do not change the archived
feature tree.
