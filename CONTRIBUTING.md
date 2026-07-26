# Contributing

Research with AI accepts focused code improvements, accessibility fixes,
teaching feedback, and evidence corrections.

## Before opening a change

1. Search existing issues and pull requests.
2. Keep one scientific or implementation concern per change.
3. For a content correction, identify the tutorial, section, current wording,
   primary source, and proposed replacement.
4. Never include patient data, private research records, credentials, signed
   URLs, or confidential infrastructure details.

## Local setup

```bash
npm ci
npm run dev
```

Before a pull request:

```bash
npm run lint
npm run typecheck
npm test
```

Run `npm run check:links` when sources change. Run the relevant reproduction
or round-trip check when a worked example changes.

## Evidence standard

- Prefer primary papers, standards, official documentation, repositories, and
  versioned dataset records.
- Place a source near the claim it supports.
- Record the exact paper version, repository commit, dataset version, and
  access date when these affect the teaching point.
- Separate reported results, independently reproduced results, observed
  software behaviour, and proposals.
- Do not turn an author's recollection into independently verified evidence.
- Preserve explicit limits and negative results.

AI can help inspect, draft, or implement a contribution. The contributor still
owns source verification, scientific interpretation, tests, licensing, and the
final wording.

## Interface and accessibility

Follow the existing typography, spacing, colour, interaction, and responsive
system. New controls need visible labels, keyboard operation, focus treatment,
and meaningful error states. Do not use colour as the only carrier of meaning.

When updating repository screenshots:

- use the reviewed release and a clean local origin;
- use synthetic or public information only;
- omit browser chrome and private project notes;
- update `docs/images/README.md` with dimensions and SHA-256 hashes; and
- add concise, informative alt text wherever the screenshot is embedded.

## Licensing

By contributing application code, you agree that it may be distributed under
MIT. By contributing original tutorial prose or diagrams, you agree that they
may be distributed under CC BY 4.0. Identify any third-party material and its
licence before adding it.
