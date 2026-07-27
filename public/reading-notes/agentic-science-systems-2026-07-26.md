# Agentic science systems: checked reading notes

Checked: 2026-07-27

Purpose: an original teaching comparison for the Agentic AI in Research
tutorial. These notes paraphrase the sources. They are not substitutes for the
papers, supplements, code, or independent reproduction.

## Source correction

The source list supplied for the journal club joined two different stages of
the AI Scientist lineage.

- [arXiv:2408.06292](https://arxiv.org/abs/2408.06292) is the original
  template-based AI Scientist v1 paper.
- [arXiv:2504.08066](https://arxiv.org/abs/2504.08066) describes the
  template-free AI Scientist v2.
- [arXiv:2606.15497](https://arxiv.org/abs/2606.15497) is the consolidated
  preprint associated with the 2026
  [Nature version of record](https://doi.org/10.1038/s41586-026-10265-5).

The Nature article is therefore not simply a longer copy of the 2024 v1
preprint.

## Common comparison

| System | Starting contract | Main search loop | What it executes | Human decision | Strongest reported evidence | Not demonstrated |
|---|---|---|---|---|---|---|
| Google Co-Scientist | Scientist goal, constraints, evidence, and optional ideas | Generate, reflect, debate, rank, cluster, and evolve | Literature search, scientific reasoning, hypothesis and protocol generation | Scientist redirects the goal, reviews candidates, and prioritises experiments | Expert assessment plus targeted biomedical wet-lab work | Autonomous wet-lab work, broad prospective validation, or fully public source code |
| AI Scientist v1 | Human-authored code template and constrained ML setting | Ideate, edit, execute, plot, write, and auto-review | Small computational ML experiments | Humans create the scaffold and control any release | Automated-reviewer scores in three ML settings | Human peer-review acceptance or general autonomous science |
| AI Scientist v2 and Nature study | Broad computational topic | Experiment-manager tree search, code, tuning, replications, ablations, figure review, and writing | Computational ML studies and manuscripts | Humans choose a portfolio, audit outputs, and control submission | One of three papers crossed a workshop review threshold | Reliable main-conference research, physical experiments, or success across every generated attempt |
| Medical AI Scientist | Task and dataset, plus papers in some modes | Medical and technical retrieval, proposal, Docker execution, analysis, reporting checks, and writing | Computational medical-AI studies | Humans supply tasks and data and evaluate outputs | A 171-case benchmark and expert manuscript ratings | Clinical care, prospective trials, state-of-the-art performance, or public independent reproduction at the checked date |

## Google Co-Scientist

- Version of record:
  [Accelerating scientific discovery with Co-Scientist](https://doi.org/10.1038/s41586-026-10644-y)
- Earlier title and arXiv record:
  [Towards an AI co-scientist](https://arxiv.org/abs/2502.18864)
- Official overview:
  [Google Research](https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/)
- Publication status: peer-reviewed Nature article
- Article licence: CC BY 4.0
- Code status: full source code is not public; the paper provides methods,
  prompts, and pseudocode

### One-sentence claim

Co-Scientist uses specialised agents and additional test-time computation to
search and refine scientific hypotheses under an expert-supplied goal.

### What the system actually does

1. A scientist supplies a goal, constraints, evidence, and optional ideas.
2. Generation agents search and propose hypotheses.
3. Reflection agents criticise plausibility, novelty, and correctness.
4. Ranking agents use pairwise debate and an Elo-style tournament.
5. Proximity agents cluster related ideas.
6. Evolution agents refine promising candidates.
7. Meta-review synthesises the ranked landscape.
8. The scientist reviews, redirects, and selects experiments.

### Human role

All three reported biomedical demonstrations included expert guidance.
Scientists prioritised the wet-lab experiments. The system proposed hypotheses
and plans; it did not autonomously perform the physical validation.

### Evidence ledger

| Claim | Measure and sample | Evaluator | Main caveat |
|---|---|---|---|
| More test-time computation improved the system ranking signal | 203 research goals over sequential compute buckets | Internal Elo-style evaluation | The signal is generated inside the system and is not objective truth |
| Experts preferred some Co-Scientist outputs | 11 of 15 challenging goals | Small blinded expert study | Subjective scores and a small sample |
| Several biomedical hypotheses survived initial reality checks | Targeted AML, liver-fibrosis, and antimicrobial-resistance studies | Domain experts and laboratory experiments | The studies are preliminary and are not clinical validation |
| The antimicrobial-resistance case matched an unknown result | System hypothesis compared with a co-timed experimental finding | Research team | This is a rediscovery-style test, not a prospective discovery |

### Main limitations

- Open-access retrieval can miss paywalled work and negative results.
- Search and language-model errors can propagate into proposals.
- Figures and non-text evidence may be underused.
- Evaluation beyond the tested topics remains limited.
- Early laboratory results do not establish treatment effectiveness.

### What this tutorial borrows

Separate generation, reflection, ranking, and synthesis. Keep the expert able
to redirect the goal.

### What this tutorial changes

Treat internal debate and self-ranking as useful search operations, not
independent verification. Require a separate source check and a named human
decision before testing or release.

## The AI Scientist v1

- Paper:
  [The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery](https://arxiv.org/abs/2408.06292)
- Official project article:
  [Sakana AI](https://sakana.ai/ai-scientist/)
- Repository:
  [SakanaAI/AI-Scientist](https://github.com/SakanaAI/AI-Scientist)
- Publication status: preprint
- Paper licence: CC BY 4.0

### One-sentence claim

Given a human-authored experiment template, v1 joins idea generation, code
editing, experiment execution, plotting, paper writing, and automated review
inside three small machine-learning settings.

### Evidence boundary

The 2024 paper compared generated manuscripts using an Automated Reviewer.
Those acceptance-threshold comparisons were not results from human conference
peer review. The widely repeated cost estimate covered small experiments and
model calls in this setup, not the full cost of arbitrary autonomous research.

### Failure modes worth teaching

- Weak ideas and shallow experimental plans
- Incorrect code and inadequate controls
- Hallucinated or inaccurate citations
- Processes that relaunch or fail to stop
- Large volumes of unwanted checkpoints

The repository warns users to sandbox execution. A generated repository is
untrusted code even when the research goal is benign.

## The AI Scientist v2 and Nature study

- v2 paper:
  [The AI Scientist-v2](https://arxiv.org/abs/2504.08066)
- Nature article:
  [Towards end-to-end automation of AI research](https://doi.org/10.1038/s41586-026-10265-5)
- Consolidated preprint:
  [arXiv:2606.15497](https://arxiv.org/abs/2606.15497)
- v2 repository:
  [SakanaAI/AI-Scientist-v2](https://github.com/SakanaAI/AI-Scientist-v2)
- Publication status: peer-reviewed Nature article
- Article and preprint licences: CC BY 4.0

### One-sentence claim

v2 removes the fixed human code template, uses an experiment manager and
agentic tree search, inspects plots with a vision-language model, and produces
complete computational papers.

### Human role

Humans supplied the broad workshop theme, selected three ideas from a larger
generated pool, selected complete runs, checked implementations, arranged the
peer-review experiment with consent, and enforced a pre-agreed withdrawal
protocol. No person edited the selected run's code, figures, results, or prose.

This is autonomous execution inside a human-selected portfolio. It is not a
measurement of unsupervised success across every proposed idea or failed run.

### Peer-review result

- Three generated papers entered an ICLR 2025 workshop experiment.
- One received scores of 6, 7, and 6, averaging 6.33.
- Two did not meet the workshop bar.
- The workshop acceptance rate was 70 percent.
- The strongest paper was withdrawn before meta-review under the agreed
  protocol. The organisers indicated that it would probably have been
  accepted.
- The authors' own audit concluded that none met the main ICLR conference
  standard.

The careful claim is therefore "crossed a workshop review threshold", not
"published an accepted paper".

### What this tutorial borrows

Use staged experimentation, replications, ablations, an experiment journal,
figure review, and explicit stopping criteria.

### What this tutorial changes

Require a human-approved hypothesis and test boundary before held-out results,
an independent statistical check, strict process and storage limits, and a
release decision that the agent cannot make.

## Medical AI Scientist

- Preprint:
  [Towards a Medical AI Scientist](https://arxiv.org/abs/2603.28589)
- Project page:
  [Medical AI Scientist](https://cuhk-aim-group.github.io/Med-AI-Scientist-Homepage/)
- Publication status: preprint
- Paper licence: arXiv non-exclusive distribution licence
- Code status on 2026-07-26: project links describe code as coming soon; public
  reproduction is not yet available

### One-sentence claim

Medical AI Scientist applies a multi-agent research loop to computational
medical-AI tasks using three modes: paper reproduction, literature-inspired
innovation, and task-driven exploration.

### What the system actually does

- An idea-proposal group analyses the task, retrieves medical and technical
  literature, prepares evidence, generates a method, and assesses it.
- An execution group plans, writes, runs, judges, and analyses experiments
  inside Docker.
- A manuscript group drafts text and figures, checks reporting and ethical
  constraints, repairs references, and compiles LaTeX.

The named clinical and engineering co-reasoning roles are AI agents. The paper
does not document a human clinician and engineer approving every autonomous
run.

### Evidence ledger

| Claim | Measure and sample | Evaluator | Main caveat |
|---|---|---|---|
| Ideas and execution exceeded commercial model baselines | 171 cases from 57 papers, 19 tasks, and 6 modalities | System measures and expert evaluation | Datasets were subsampled and are predefined |
| Many runs completed successfully | 57 execution instances | Runtime criteria | "Success" meant completion, decreasing loss, stable gradients, weights, and test output, not scientific correctness |
| Generated papers approached selected venue examples | Five generated diabetic-retinopathy papers compared with selected MICCAI, ISBI, and BIBM papers | Automated reviewer and ten experts | One task, selected comparators, and remaining coverage gaps |

### Main limitations

- Complex designs may be simplified during implementation.
- The study has limited cross-domain and out-of-distribution evidence.
- Generated methods did not reach state of the art.
- An internal ethics-reporting agent is not institutional approval.
- The system does not demonstrate clinical care or prospective patient research.
- Independent reproduction is blocked until the promised code and artefacts
  become public.

## AI review as a recurring author-side checkpoint

AI review is most useful before a weak decision becomes expensive. It should
not be left until the final language edit. The tutorial therefore treats
reviewer zero as a recurring author-side role: the model raises traceable
questions, the researchers check them against evidence, and named humans decide
whether the work changes.

### Evidence boundary

The evidence supports AI as an additional reader, not a substitute for
co-authors, statisticians, domain experts, editors, or formal peer review.

| Evidence | Reported result | What it supports | Main caveat |
|---|---|---|---|
| [Liang et al., NEJM AI](https://doi.org/10.1056/AIoa2400196) | GPT-4 feedback was compared with reviews for 3,096 Nature-family papers and 1,709 ICLR papers; 57.4% of 308 participating researchers rated their feedback helpful or very helpful | A rapid additional reader can surface useful concerns, especially early in preparation | Point overlap does not prove that the model has expert judgement or that every criticism is correct |
| [NeurIPS 2024 author checklist experiment](https://arxiv.org/abs/2411.03417) | More than 70% of surveyed authors found the assistant useful and more than 70% said they would revise, but inaccuracy and excessive strictness were the most frequent reported problems | AI can help authors check a paper against an explicit reporting or submission rubric | The assistant could be gamed and was not suitable as an automated approval gate |
| [Mind the Blind Spots, EMNLP 2025](https://aclanthology.org/2025.emnlp-main.1805/) | Across 676 reviews, off-the-shelf models concentrated more on technical validity and underweighted novelty | Use separate review passes and retain specialist novelty judgement | A confident methods critique is not a complete paper review |
| [Reviewing the reviews, 2026 preprint](https://arxiv.org/abs/2605.20668) | In a work-in-progress expert study, current reviewing agents produced some strong and distinct criticisms, but AI reviewers overlapped more with one another and showed recurring specialist-context weaknesses | Capable current models can complement human reviewers with another set of checks | The study is a preliminary preprint and explicitly does not support replacing human review |

These studies do not establish a universal year-by-year improvement rate or a
single human-level threshold. Review quality depends on the model, prompt,
field, paper type, supplied context, rubric, and evaluator.

### Review checkpoints

| Checkpoint | Reviewer-zero question | Record to keep | Human gate |
|---|---|---|---|
| Before protocol lock | Are the question, endpoints, comparators, exclusions, power assumptions, leakage controls, and ethics defensible? | Design-risk register and protocol revision | Lead researcher, domain expert, and statistician as needed |
| After initial analysis | Which alternative explanations, missing checks, unstable estimates, or figure-to-result discrepancies remain? | Claim-to-evidence table and analysis decisions | Analysis owner and relevant co-authors |
| First complete draft | Can a cold reader follow the argument, reproduce the methods, and connect every major claim to evidence? | Focused methods, novelty, reporting, and clarity reviews | Authors accept, reject, defer, or investigate each major concern |
| Before co-author sign-off | Which decision-critical issues remain unresolved, and did a revision introduce a contradiction elsewhere? | Deduplicated issue ledger tied to one paper revision | All accountable authors |
| Frozen submission candidate | Does the exact manuscript, supplement, code, figures, checklist, and disclosure satisfy the venue requirements? | Final ledger, checklist, source checks, and approval record | Corresponding author and institutional checks where required |
| After a material revision | Did the change close the original concern without weakening another claim? | Same review rerun against the new revision | Named author confirms closure or reopens the issue |

Review after changes that affect the design, evidence, claims, or release.
Running a new review after every sentence can create churn and encourage authors
to overfit the paper to a simulated reviewer.

### Review issue ledger

Each criticism remains unresolved until a person checks the evidence and records
a disposition.

| Issue ID | Paper location | Concern and evidence | Severity and confidence | Human disposition | Action and owner | Closure evidence |
|---|---|---|---|---|---|---|
| RZ-001 | Figure or section | What the reviewer challenged and the exact manuscript evidence | Decision-critical, major, minor, or question; high, medium, or low confidence | Accept, reject, defer, investigate, or unresolved, with a reason | Named change, check, analysis, or experiment | Revised location, result, source, or reason the concern was a false positive |

Agreement between models can help prioritise a concern, but it is not
independent verification. Models can share training data, prompts, preferences,
and blind spots.

### Stanford Agentic Reviewer

[Stanford Agentic Reviewer](https://paperreview.ai/) is the current product name
used by the experimental author-side reviewer from Yixing Jiang and Andrew Ng.
Its [technical overview](https://paperreview.ai/tech-overview) documents this
workflow:

1. Convert the uploaded paper PDF to Markdown.
2. Generate searches for related methods, benchmarks, and papers.
3. Retrieve and select relevant arXiv records.
4. Summarise selected full papers when needed.
5. Generate a structured review grounded in the submitted paper and retrieved
   related work.

At the checked date, the upload page accepts a PDF of no more than 10 MB and
analyses only the first 15 pages. The technical overview says the service
supports English-language papers and is expected to work better in arXiv-rich
fields such as AI than in fields with weaker arXiv coverage. A long methods
appendix, supplement, biomedical evidence base, or non-English paper can
therefore fall outside the reviewed context.

The developers report an ICLR 2025 score experiment in which AI-human Spearman
correlation was 0.42 and human-human correlation was 0.41 on the held-out set.
This is a narrow score-agreement result for one conference setting. It does not
show that the full review is equivalent to an expert review. The same overview
reports lower acceptance-prediction AUC for the AI score than for one human
score, 0.75 compared with 0.84, and warns that generated reviews may contain
errors.

Use the service only for public or explicitly upload-permitted manuscripts.
Before sending an unpublished draft to any external reviewer, check the
institution, venue, funder, collaborator, intellectual-property, retention,
deletion, and model-training rules. Do not upload patient information,
identifiable images, restricted data, confidential third-party manuscripts,
credentials, or commercially sensitive material. If the paper cannot leave the
approved environment, use an institution-approved or local reviewer and keep
the same human disposition and evidence checks.

### Practical review prompt design

A useful review prompt supplies the exact venue rubric, complete paper,
appendices, reporting checklist, verified result files, and figure provenance.
It asks separate questions about methods and statistics, claim-to-evidence
consistency, novelty, reproducibility, ethics, clinical interpretation, and
clarity. Every concern should include its exact location, challenged claim,
evidence, consequence, confidence, smallest resolving check, and closure
criterion. A second pass should label each criticism supported, ambiguous, or
probably a false positive and finish by stating what the review may have
misunderstood. The authors should resolve the resulting ledger before asking
the model to rewrite anything.

## Media and source-rights register

| Item | Licence at checked version | Tutorial decision |
|---|---|---|
| Co-Scientist Nature paper | CC BY 4.0 | Figures could be reused with attribution after checking third-party credit lines; this tutorial uses an original redraw |
| AI Scientist Nature paper | CC BY 4.0 | Figures could be reused with attribution; this tutorial uses an original redraw |
| arXiv:2502.18864, 2408.06292, and 2504.08066 | CC BY 4.0 | Short paraphrases and links used |
| Medical AI Scientist preprint | arXiv non-exclusive distribution licence | No figure copied; original comparison and link only |
| Google and Sakana web articles | Site terms, not automatically the paper licence | Linked, not copied |
| Current Sakana repositories | Restricted AI Scientist Source Code License at the checked revision | Link and inspect terms; do not describe current code as Apache 2.0 |

The Sakana repositories changed licence on 19 December 2025. Historical paper
statements about Apache 2.0 should not be used to describe the current
repository without checking the exact commit.

## Reusable reading-note template

```text
# Paper title

- Snapshot date:
- Version or DOI:
- Publication status:
- Licence:
- Code and data status:

## One-sentence claim
## What the system actually does
## What it does not do
## Input contract
## Agent and tool loop
## Where the human enters
## Evidence ledger
## Failure modes
## Reproduction status
## What this tutorial borrows
## What this tutorial deliberately changes
## Source and media rights
```

## Teaching conclusion

The papers support a common architecture: give specialised agents a bounded
goal, let them generate and criticise alternatives, preserve an execution
journal, and use tools to obtain observations. They do not remove the need for
human scientific judgement. The stronger the automation claim, the more
important it becomes to count failed runs, identify human selection, separate
evaluation types, and state what was never tested.
