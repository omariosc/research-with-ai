# Research with AI release evidence record

Record date: 26 July 2026

Content release: `v1.1.0`
Author and accountable reviewer: Omar Choudhry

## Purpose

This compact record supports the first-hand release case in the paper-to-site
tutorial. It identifies what was inspected, reused, tested, and left for human
sign-off. It is not a scientific reproduction record.

## Source and rights manifest

| Item | Use | Version or locator | Rights decision |
| --- | --- | --- | --- |
| MICCAI Educational Challenge call | Submission scope and evaluation criteria | <https://miccai-sb.github.io/challenge> | Linked and paraphrased, not republished |
| Paper2All | Prior paper-to-site example | <https://github.com/YuhangChen1/Paper2All> | Linked for attribution, no code or media copied |
| MedMNIST v2 paper | First-hand biomedical claim and Figure 1 | DOI `10.1038/s41597-022-01721-8` | Linked and paraphrased; Figure 1 reused unmodified under CC BY 4.0 with attribution, hash, alt text, and long description |
| BreastMNIST data and predictions | Prediction-artifact metric re-evaluation | Paper-cited Zenodo `10.5281/zenodo.5208230` version 2.0 and `10.5281/zenodo.7782114` v1 | Public CC BY 4.0 sources; selected files retrieved by the verifier and checked before parsing |
| frame-annotator | First-hand repository audit and annotation teaching image | Commit `3e94ed03c1487331b8c041ca755421686b41d031` | Author-owned public repository; one interface image reused with its origin and hash recorded |
| `frame-annotator-safety-interface.png` | Annotation demo source image | 1600 by 900 pixels; SHA-256 `87c105e2c0fed14477179052dc08d953441cc7cb483fa5680ec490b23a8cc97c` | Reused only as a labelled teaching example |
| `research-with-ai-social.png` | Social preview | Generated for this project with an OpenAI image model | AI origin disclosed; selected and reviewed by the author |
| Tutorial prose, diagrams, and interface | Original educational material | Release `v1.1.0` | CC BY 4.0 |
| Application source | Website implementation | Release `v1.1.0` | MIT |
| External papers, standards, and documentation | Evidence links | Exact URLs appear beside the relevant stages | Linked and paraphrased; external rights retained |

MedMNIST Figure 1 is the only copied publisher figure. It is reused under
CC BY 4.0 with attribution, source URL, local hash, alt text, and a separately
authored long description. No publisher performance table is copied. A future
worked paper site must create its own item-level rights ledger before reusing
media.

## Claim and implementation map

| Public claim | Evidence in this release | Boundary |
| --- | --- | --- |
| Each tutorial can be opened at a dedicated root domain | Host selection in `app/page.tsx`, canonical release data in `lib/version.ts`, and rendered host tests | Live DNS and routing must still be checked after every deployment |
| Progress and builders remain local | Browser storage implementation in `lib/storage.ts` and the client builders; no application database or submission endpoint | Browser storage is unencrypted and separate for each origin |
| Annotation YAML follows the supplied schema | Immutable JSON Schema plus valid and invalid fixture tests | Structural validity does not establish annotation validity |
| The annotation case reports an actual repository inspection | Pinned commands, environment, test output, source links, and limits in `/audits/frame-annotator-2026-07-26.md` | The surgical workflow has no passing test coverage in the audited suite |
| The BreastMNIST case recovers two reported Table 3 cells | Three selected prediction-member hashes, official test-label file hash, independent implementation of the official binary metric contract, locked environment, negative tests, and reviewed output | Prediction-artifact metric re-evaluation only; no training reproduction or clinical validation |
| The edge layer is deliberately bounded | Allowed-host and method lists, response-header policy, and edge regression tests | A configuration test is not a penetration test |

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

The test command builds the production application, renders the hub and all
three workshops, checks custom-domain roots and metadata, validates the
annotation YAML against its JSON Schema, checks the source-image hash, exercises
edge routing and headers, and records tutorial word counts.
The annotation check exports two synthetic canonical records to review CSV and
reimports them without field loss. It also proves that one YOLO box returns
exactly while declaring the phase, named keypoints, visibility meaning, and
provenance that the training format omits.
The MedMNIST check validates source hashes, runs four offline negative and metric
tests, reads three selected released prediction files, and independently
recalculates the reported AUC and accuracy.

The external-link audit checked 120 unique URLs on 26 July 2026. One hundred
and eleven were reachable, nine publisher or vendor pages returned HTTP 403
and were retained for manual review, and none returned an automated failure.

## Human release gates

- Review claims, source placement, rights language, and AI-use disclosure.
- Open all four final domains and confirm route identity, version, canonical
  metadata, security headers, and downloadable artefacts.
- Complete desktop and mobile checks in the author's Chrome profile.
- Complete a keyboard-only pass, 200 percent zoom check, colour and focus
  review, link check, and reduced-motion check.
- Record author sign-off, learner pilots, video captions, transcript, and the
  public repository snapshot before submission.

At the time this record was written, the Chrome-profile interaction pass,
learner pilots, videos, and public repository snapshot were still pending. They
remain named submission gates rather than completed claims.

## Claim boundary

This record shows the evidence chain used to prepare one teaching platform. It
does not prove that an arbitrary paper can be converted faithfully, that a
linked scientific result was reproduced, that the annotation interface is
clinically safe, or that the tutorials improve learner performance.
