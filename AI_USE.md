# AI use disclosure

This project was made with substantial AI assistance. ChatGPT and Codex helped
with source discovery, tutorial structure, drafting, code implementation,
repository inspection, test execution, rendered-page checks, and an attempted
Chrome-profile pass. An OpenAI
image-generation model produced the social preview image. The tutorials also
describe Claude and Claude Science from linked first-party material. That
coverage is not an endorsement and does not imply that every named product was
used to build the site.

## What was checked

| AI-assisted task | Record kept | Human or independent check |
| --- | --- | --- |
| Source discovery | Linked source library and access review | Primary sources opened; 107-link automated audit with blocked pages retained for manual review; claims remain open to reader verification |
| Tutorial drafting | Version-controlled content diff | Scope, wording, examples, and claim boundaries reviewed against the challenge call |
| Repository audit | Pinned commit, commands, and observed outputs | Clean environment test run and direct source inspection |
| Biomedical worked example | Paper, dataset, prediction archive, source manifest, hashes, command, and reviewed JSON output | Independent implementation of the official binary metric contract; negative tests for changed bytes and row identifiers; paper precision and code history checked directly |
| Interface implementation | Git diff and build artefacts | Lint, production build, rendered HTML and schema tests, edge tests, and comparison with the approved visual direction |
| Visual generation | Generated social image and dated disclosure | Human selection and interface comparison |

AI output was treated as a proposal, not as scientific evidence. The site does
not claim hidden reasoning traces. It preserves visible prompts, sources,
commands, diffs, outputs, and approval decisions where these are relevant.
Final scientific, ethical, legal, and editorial responsibility remains with
Omar Choudhry.

No patient data, private research records, credentials, or identifiable study
material were intentionally supplied during development. The annotation demo
uses an image from the author's public `frame-annotator` repository and is
labelled as a teaching example rather than a clinical system.
The MedMNIST case uses public CC BY 4.0 benchmark data and author-released
predictions. Its claim is limited to prediction-artifact metric
re-evaluation.

## Review status

The v1.1.0 source, interface, links, accessibility behaviours, and examples
received machine-assisted and manual implementation checks on 2026-07-26.
The final interaction pass in the user's Chrome profile remains pending because
the browser extension connection was unavailable during this release check.
Final author sign-off for the three MICCAI submissions, video recordings,
transcripts, and any later claim changes remains a named human task. Every
published revision should update this status rather than relying on this
statement indefinitely.
