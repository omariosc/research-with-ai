# Video recording plan

Record three focused tutorials from the same visual system. Each should begin
with a real research problem, show one useful failure or correction, and end
with a file the viewer can keep.

## Shared recording setup

- Use a public paper, public repository, and synthetic or openly licensed data.
- Hide notifications, credentials, hostnames that reveal private systems, and
  identifiable records.
- Increase browser and terminal text to a readable size before recording.
- Keep the checklist open beside the live tool so each action has context.
- Show the prompt, the agent's action, the evidence inspected, and the human
  decision as four distinct moments.
- Record a clean run only after rehearsing the full workflow once.
- Add captions and a transcript. Describe important visual changes aloud.

## Video 1: Agentic AI in Research

Target length: 12 to 18 minutes.

1. Open a paper and state the narrow reproduction question.
2. Complete the research contract builder and export `research_contract.md`.
3. Use deep research to create a claim-evidence map, then open two primary
   sources to check it.
4. Ask questions against the paper and distinguish quoted evidence from
   interpretation.
5. Let a coding agent inspect the repository before proposing any change.
6. Run the smallest clean-environment smoke test.
7. Show a bounded HPC job file, approval point, status check, and output path.
8. Compare one regenerated metric or figure with the reported result.
9. Turn verified bullets into a paper section and reject one unsupported claim.
10. Export the workshop record and show the AI-use disclosure.

## Video 2: Build a Research Website with AI

Target length: 10 to 15 minutes.

1. Start with the paper, repository, intended reader, and reuse rights.
2. Complete the website brief and export `website_brief.md`.
3. Build a source manifest for sections, figures, tables, captions, and code.
4. Show how Paper2All motivates the conversion step.
5. Generate a first structured page from the manifest.
6. Trace one claim from page text to paper location, repository commit, and
   executed result.
7. Catch one extraction, caption, or citation error and correct it.
8. Test keyboard navigation, mobile layout, links, and image alternatives.
9. Preview locally, then deploy the reviewed commit.

## Video 3: Build a Custom Annotation Tool with AI

Target length: 12 to 18 minutes.

1. Show the original frames and write the annotation protocol before coding.
2. Complete the specification builder and export `annotation_spec.yaml`.
3. Ask an agent to inspect `frame-annotator` and identify reusable pieces and
   fixed assumptions.
4. Generate a minimal keyboard-first local workflow using synthetic fixtures.
5. Use the embedded demo to label phase, box, and point data.
6. Demonstrate atomic save, resume, undo, validation, and export.
7. Run locally with network access disabled.
8. Explain the extra controls needed for secure remote hosting.
9. Add assisted suggestions only after the manual path works, and show that the
   annotator must accept or reject each suggestion.
10. Review agreement, missingness, provenance, and dataset versioning.

## One-minute finalist cut

Use one sentence and one visual for each workshop:

- Research agents can search, inspect, execute, and draft, but the researcher
  keeps control of evidence and release.
- A paper website should make claims easier to verify, not merely easier to
  read.
- A custom annotation tool can fit the study, but only if the protocol, quality
  controls, and data handling are designed first.

End on the shared homepage and the three public URLs.
