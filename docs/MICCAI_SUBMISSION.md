# MICCAI Educational Challenge submission checklist

Official call: <https://miccai-sb.github.io/challenge>

Check the official call and OpenReview entry again on the day of submission in
case dates or fields change.

## Four released submissions

Prepare one package for each canonical tutorial. Do not rely on the shared
homepage to supply required context. All four tutorials belong to the reviewed
v1.5.0 release:

1. **Agentic AI in Research:** a bounded, evidence-led route from question to
   checked computational release.
2. **Building a Website for Your Research Using AI:** a claim-traceable route
   from paper and repository to an accessible interactive companion.
3. **Developing Custom Annotation Tools Using AI:** a protocol-first route to a
   tested local tool and provenance-aware dataset.

4. **Run an AI in Healthcare Conference:** a community-led route from purpose,
   relationships, and programme design to safe delivery, denominator-aware
   evaluation, and follow-up. Route: `/ai-healthcare-conference`. Canonical
   hostname: `conferencewithai.omarchoudhry.co.uk`.

Use the v1.5.0 citation and release evidence for every package. The conference
tutorial is released, while its learner pilot, video, transcript, final
submission wrapper, and any unresolved attendance reconciliation remain named
submission tasks rather than completed claims.

**Keywords:** agentic AI, research workflow, reproducibility, research
communication, annotation tools, community engagement, healthcare conference,
human oversight

## Package for every submission

- [ ] Standalone canonical root URL with the correct title and social metadata
- [ ] Public repository snapshot with a signed version tag and citation record
- [ ] Short PDF wrapper containing title, author, abstract, URL, licence,
      intended audience, learning outcomes, and access instructions
- [ ] Tutorial recording no longer than 20 minutes, with captions and transcript
- [ ] One-minute overview video for finalist use
- [ ] Downloadable static tutorial and worked artefact pack
- [ ] CC BY 4.0 notice for original tutorial content
- [ ] Exact AI-use disclosure and named human sign-off
- [ ] Accessibility statement and known limitations
- [ ] Version, release notes, citation, and feedback route
- [ ] Public GitHub repository, release tag, source archive, and checksum
- [ ] Platform and individual-tutorial citations agree on title, version,
      release date, and canonical URL
- [ ] Real interface screenshots have alt text, capture provenance, rights, and
      recorded hashes
- [ ] Goal-based route, stage alternatives, and Try it now task demonstrated

## Evidence review

- [ ] Open every source and verify the statement it supports
- [ ] Prefer primary papers, standards, repositories, and official product
      documentation
- [ ] Check every paper version, repository commit, figure, table, and caption
- [ ] Separate demonstrated behaviour from proposed or future capability
- [ ] Label the annotation interface as a teaching example
- [ ] Remove credentials, personal data, private infrastructure details, and
      restricted research material
- [ ] Test every route in a clean desktop and mobile browser
- [ ] Confirm route, alternative, and practice state survives reload and resets
      only when requested
- [ ] Create two named projects and confirm notes, progress, assessments, and
      builder drafts remain separate
- [ ] Confirm resetting one project leaves its name and notes intact and does
      not change another project
- [ ] Confirm a suggested route is not recorded as the learner's choice and no
      delivery path is preselected
- [ ] Confirm every cited alternative appears in the full source library
- [ ] Download and inspect every generated Markdown or YAML file
- [ ] Confirm keyboard use, colour contrast, image alternatives, and captions
- [ ] Record a release-time word count below 4,000 words, excluding references
- [ ] Verify all publisher or vendor links that block automated checks manually
- [ ] Confirm the worked case states what was observed and what it does not prove
- [ ] Run the locked BreastMNIST verifier and preserve its reviewed JSON output
- [ ] Confirm the reused MedMNIST figure attribution, hash, alt text, and long
      description
- [ ] Run the annotation export round trip and state what the review CSV does
      not preserve
- [ ] Run the model-service Python tests and Docker acceptance route, then
      inspect the ZIP and checksum
- [ ] Confirm the annotation origin story distinguishes the author account,
      public commit history, and LASK dataset record
- [ ] Confirm no paper figure or repository screenshot is presented as an
      original teaching graphic
- [ ] Open all three live paper companions and verify each reported value,
      figure caption, rights statement, long description, and claim boundary
- [ ] Confirm the BTPN companion says the official paper link is coming soon
      and exposes no private manuscript, review, response, or source bundle
- [ ] Confirm the paper-companion landing screenshots were captured from the
      reviewed release rather than designed as mock-ups
- [ ] Open both static annotation demos and confirm every API request stays in
      the browser-local adapter
- [ ] Confirm the frame demo exposes only the ten authorised Hamlyn
      presentation frames and the surgical demo exposes exactly three public
      LASK examples
- [ ] Confirm the Hamlyn frames are described as a lossy presentation recovery,
      not as missing raw prototype frames
- [ ] Test the floating table of contents, progress context, Escape handling,
      destination colours, and horizontal overflow at mobile, tablet, and
      desktop widths

## Additional conference tutorial gates

- [ ] Keep the organiser's first-hand account separate from public listings,
      public posts, feedback records, and independent evaluation
- [ ] Verify the advertised and delivered programmes and explain every material
      difference without presenting adaptation as failure
- [ ] Show committee roles, primary responsibilities, backups, and the final
      decision route without inferring membership from the group photograph
- [ ] Reconcile unique registrations, accepted places, cancellations,
      check-ins, walk-ins, organisers, speakers, and feedback respondents before
      publishing attendance or response rates
- [ ] Present the registration, RSVP, on-day, first-hand estimate, and feedback
      records as a denominator ledger until a documented rule connects them
- [ ] Keep the 30-response feedback denominator beside every rating and state
      that voluntary respondents may not represent every attendee
- [ ] Plot feedback means on the complete 0 to 5 scale and retain the observed
      session-rating distributions rather than showing only headline means
- [ ] Verify the approximate essay and poster entry totals against judging or
      submission records before removing the word "about"
- [ ] Check the venue, safety, accessibility, privacy, food, AV, photography,
      and live escalation sections with the accountable people
- [ ] Confirm that no attendee records, dietary details, accessibility
      disclosures, private comments, or contact information enter a public
      repository or unapproved AI service
- [ ] Link the first-hand, operations and evaluation, and media records from the
      tutorial and repository documentation
- [ ] Verify each retained photograph against one of the two source posts,
      remove exact duplicates, and record an authored alt text and current hash
- [ ] State that Mohammad Tasfiq Jawaad's permission supports use in this
      tutorial but does not create a general reuse licence
- [ ] Keep rights-unresolved organiser material and any named certificate
      example outside the public repository and site until their individual
      rightsholder, subject, badge, QR, and personal-data checks are complete
- [ ] Do not infer attendance, demographics, consent, or impact from the
      photographs or LinkedIn engagement
- [ ] Complete a cold-read learner pilot and a separate operational review with
      someone who has delivered a comparable event

## Suggested wrapper structure

1. Motivation and intended learners
2. Learning outcomes
3. First-hand case and artefacts
4. Educational design, activity, and applied assessment
5. Evidence, accessibility, privacy, and licensing
6. Availability, repository, video, and citation
7. Limitations and planned evaluation

## Evaluation

Run at least one cold-read pilot per tutorial with a target learner. Use a
parallel pre-task and post-task case. Record critical errors detected, unsafe
actions avoided, rubric score, completion time, transfer to a new case, and
where the learner became stuck. Confidence and satisfaction are secondary
measures. Report negative feedback, missing observations, the exact tutorial
version, and what changed after the pilot. Use the reproducible task, stop
rules, scoring rubric, and session record in
[`LEARNER_PILOT.md`](./LEARNER_PILOT.md).
