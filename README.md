# Research with AI

Three practical, evidence-led workshops for researchers who want to use AI
without giving up scientific control.

The project is one responsive application with three focused entry points:

- [Shared workshop index](https://researchwithai.omarchoudhry.co.uk)
- [Agentic AI in Research](https://agenticresearch.omarchoudhry.co.uk)
- [Building a Website for Your Research Using AI](https://interactivepaper.omarchoudhry.co.uk)
- [Developing Custom Annotation Tools Using AI](https://annotate.omarchoudhry.co.uk)

Each route contains a ten-stage checklist, copyable prompts, a human approval
gate, primary sources, an editable planning tool, and a Markdown export. The
annotation route also includes a small interactive labelling demo based on
[frame-annotator](https://github.com/omariosc/frame-annotator).

The current content release is **v1.0.0**, released on 2026-07-26. The
[version history](https://researchwithai.omarchoudhry.co.uk/versions) records
the stable canonical address for each independently submitted tutorial.

## What this project contributes

This is not a catalogue of AI products. It teaches three complete workflows:

1. Move from field mapping and paper questions to a bounded reproduction,
   validated experiments, HPC jobs, figures, writing, and release.
2. Turn a paper and repository into an accessible research website while
   preserving provenance, captions, rights, and reproducibility.
3. Turn an annotation protocol into a tested local tool, then harden it for
   remote use, assisted labelling, quality control, and traceable export.

The recurring pattern is simple: let an agent inspect and propose, then require
a researcher to approve the evidence, action, and claim.

## Run locally

Prerequisites:

- Node.js 22.13 or newer
- npm

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The production build and checks are:

```bash
npm run lint
npm test
npm audit --omit=dev
```

## Privacy and persistence

Workshop progress and builder drafts are stored in browser `localStorage`. The
application has no database, user account, analytics, tracking cookie, or
server-side submission form. Clearing site data clears the saved work.

The light and dark theme control follows the operating-system preference until
the reader makes an explicit choice. That choice is stored locally in the
browser and is never sent to a server.

Do not paste credentials, patient identifiers, confidential records, or
restricted data into the examples. The exported files are plans and teaching
records, not proof that a scientific or governance check was completed.

## Project map

```text
app/
  agentic-research/       Agentic research workshop
  interactive-paper/     Paper-to-website workshop
  annotation-tools/      Annotation-tool workshop
  versions/              Content release history and canonical links
  components/            Shared workshop UI and interactive builders
lib/
  content/                Stages, prompts, checkpoints, and sources
  storage.ts              Local persistence and browser exports
public/
  frame-annotator-*.jpg   Worked-example screenshots
  research-with-ai-social.png
docs/
  MICCAI_SUBMISSION.md    Submission packaging checklist
  VIDEO_RECORDING.md      Recording plans for all three tutorials
edge-proxy/               Four Cloudflare Custom Domain entry points
```

The server selects the matching workshop when a dedicated public hostname
requests `/`, so an individual submission keeps a clean root URL and receives
the correct HTML and metadata before JavaScript runs. Client-side hostname
routing remains as a fallback. `researchwithai.omarchoudhry.co.uk` and the
hosting origin show the shared index.

Every downloaded Markdown or YAML template includes the tutorial release and
canonical workshop URL. Use those markers when reporting, teaching from, or
archiving material derived from this site.

## Evidence and reuse

The website workshop builds on ideas demonstrated by
[Paper2All](https://github.com/YuhangChen1/Paper2All), then adds explicit checks
for media rights, caption fidelity, claim tracing, accessibility, and clean
reproduction. The annotation workshop uses the author's
[frame-annotator](https://github.com/omariosc/frame-annotator) as a first-hand
case study rather than presenting generated code as a finished clinical tool.

Sources appear next to the stage they support and again in each workshop's
source library. Prefer the linked primary paper, standard, repository, or
official documentation when verifying a recommendation.

## Attribution and licensing

Software in this repository is licensed under the [MIT License](LICENSE).
Original tutorial text and diagrams are licensed under
[CC BY 4.0](CONTENT-LICENSE.md). Third-party papers, screenshots, trademarks,
and linked resources retain their own licences.

See [AI_USE.md](AI_USE.md) for the development disclosure and
[CITATION.cff](CITATION.cff) for citation metadata.
