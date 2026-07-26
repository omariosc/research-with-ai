# Agentic science systems: checked reading notes

Checked: 2026-07-26

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
