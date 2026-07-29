import type { Workshop } from "@/lib/types";

export const agenticResearch: Workshop = {
  slug: "agentic-research",
  number: "01",
  shortTitle: "Agentic research",
  title: "Agentic AI in Research",
  navTitle: "Agentic research",
  description:
    "Take one research question from field mapping to an independently checked, reproducible workflow. Use agents to search, build, test, and critique, while researchers retain scientific decisions.",
  promise:
    "Finish with a research contract, a paper reproduction plan, an HPC-ready runbook, a verification record, a resolved paper-review ledger, and an AI-use statement.",
  duration: "10 stages · about 80 guided minutes",
  audience:
    "Masters students, PhD researchers, clinicians, and research software practitioners new to agentic workflows.",
  prerequisites: [
    "One research question, paper, or public repository to examine",
    "Basic familiarity with files, Git commits, and terminal commands",
    "Public, synthetic, or institutionally approved data only",
    "Optional access to a workstation or HPC system for the scaling stage",
  ],
  outcomes: [
    "Bound an agent's task with explicit evidence and approval gates",
    "Trace a paper claim through its sources, code, data, and metric",
    "Audit an unfamiliar repository before executing it",
    "Turn a checked local command into a bounded compute plan",
    "Verify results independently and disclose substantive AI assistance",
    "Use repeated AI reviewer passes without surrendering scientific judgement",
  ],
  projectTime:
    "A paper reproduction often takes days or weeks.",
  quickRoute: ["contract", "paper", "communicate", "release"],
  accent: "blue",
  startLabel: "Write the research contract",
  steps: [
    {
      id: "contract",
      title: "Set the research contract",
      summary:
        "Define the scientific question, success criterion, permitted data, budget, stop conditions, review checkpoints, and actions that need approval before an agent searches or runs anything.",
      action:
        "Name the accountable researcher and schedule review passes before the design, analysis, and manuscript become expensive to change.",
      output: "research_contract.md",
      duration: "7 minutes",
      prompt: `Help me draft a one-page research contract for the project below. Include the research question, primary success metric, permitted and prohibited data, compute and spending limits, actions that require approval, stop conditions, and the accountable researcher. Add review checkpoints before the protocol is locked, after the first analysis, after the first complete draft, before co-author sign-off, before submission, and after any material revision. For each checkpoint, name the human who decides whether feedback changes the work. Mark missing information as questions rather than making assumptions. Treat the contract as a planning record, not as access control, and list the technical permissions that must enforce its boundaries.

Project context:
[Paste your context here]`,
      checkpoint:
        "A named researcher confirms the question, metric, data boundary, budget, approval-required actions, and review cadence.",
      checkpointLabel: "Approve the research boundary",
      watchFor:
        "Do not paste patient-identifiable data, credentials, confidential manuscripts, or private material into an unapproved service.",
      videoCue:
        "Show the empty contract, ask the agent to find missing decisions, then make one human edit the agent could not make for you.",
      sources: [
        {
          title: "Running Codex safely",
          url: "https://openai.com/index/running-codex-safely/",
        },
        {
          title: "Building trustworthy agents",
          url: "https://www.anthropic.com/research/trustworthy-agents",
        },
        {
          title: "ICO guidance on AI and data protection",
          url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/about-this-guidance/",
        },
      ],
    },
    {
      id: "evidence",
      title: "Build a verifiable evidence map",
      summary:
        "Use deep research to map a field, then ask a sceptical reviewer what is missing and open the primary sources behind every important claim. An evidence map is useful, but it is not automatically a systematic review.",
      action:
        "Create a source table that separates agent retrieval, reviewer concerns, and checks completed by a person.",
      output: "sources.csv",
      duration: "10 minutes",
      prompt: `Map primary research on [topic] published from [date] to [date]. Record the databases or sites searched, exact queries, and search date. Prioritise peer-reviewed papers, official datasets, and benchmark papers. For each important claim, provide the exact supporting source, DOI or stable URL, study type, population or dataset, and one limitation. Then act as a sceptical reviewer: identify the closest competing work, evidence that could weaken the proposed gap, and important sources or perspectives the search may have missed. Use four fields: agent_retrieved, reviewer_concern, human_opened, and claim_checked. Populate only the first two. Leave human_opened and claim_checked blank for the researcher. Never infer that I opened a source or that the search proves novelty. Do not describe this as a systematic review.`,
      checkpoint:
        "Open every source supporting or challenging a central claim. Confirm its title, authors, DOI, method, population or dataset, result, and relevance to the claimed gap.",
      checkpointLabel: "Verify the central sources",
      watchFor:
        "A fluent synthesis can still cite the wrong paper, merge two studies, or turn a limitation into a conclusion.",
      videoCue:
        "Compare one broad deep-research answer with the primary paper it cites. Show the exact correction you make.",
      sources: [
        {
          title: "ChatGPT Deep Research",
          url: "https://openai.com/index/introducing-deep-research/",
        },
        {
          title: "Claude Research",
          url: "https://support.anthropic.com/en/articles/11088861-using-research-on-claude-ai",
        },
        {
          title: "Review of LLMs in evidence synthesis",
          url: "https://pubmed.ncbi.nlm.nih.gov/41831731/",
          note: "Research context for capabilities and limitations, not product documentation.",
        },
        {
          title: "PRISMA-S search reporting guidance",
          url: "https://doi.org/10.1186/s13643-020-01542-z",
          note: "Use its reporting principles without calling a rapid evidence map a systematic review.",
        },
      ],
    },
    {
      id: "paper",
      title: "Read one paper against its evidence",
      summary:
        "Ask source-grounded questions, then connect each chosen claim to its method, figure or table, supplement, dataset, metric, and code.",
      action:
        "Choose one exact result to reproduce and record every missing detail as an assumption or open question.",
      output: "reproduction_target.md",
      duration: "8 minutes",
      prompt: `Using only the attached paper and supplement, create a claim map for [target result]. Link each claim to the relevant page, section, equation, figure or table, dataset split, preprocessing step, metric definition, and stated uncertainty. Return NOT FOUND when the supplied material does not answer a question. List anything required for reproduction that the paper does not specify. Do not fill gaps with conventional practice unless you label it as an assumption.`,
      checkpoint:
        "Confirm the target claim, expected metric, evaluation population, and source figure or table. Leave unresolved assumptions visible.",
      checkpointLabel: "Approve the reproduction target",
      watchFor:
        "A paper Q&A tool can answer from nearby text while missing a definition in the supplement or code.",
      videoCue:
        "Ask one precise question about a figure. Follow the answer through the paper, supplement, and repository.",
      sources: [
        {
          title: "PaperQA2",
          url: "https://arxiv.org/abs/2409.13740",
        },
        {
          title: "OpenScholar",
          url: "https://www.nature.com/articles/s41586-025-10072-4",
        },
      ],
    },
    {
      id: "repo-data",
      title: "Audit the repository and data",
      summary:
        "Inspect code and documentation in read-only mode before executing anything. Find the real entrypoint, revision, licence, data provenance, splits, expected hardware, and metric code.",
      action:
        "Record the commit, dataset version, licence, entrypoint, expected output, and reproduction risks.",
      output: "repo_audit.md",
      duration: "10 minutes",
      prompt: `Inspect [repository URL] at commit [SHA] and the linked dataset documentation in read-only mode. Find the training and evaluation entrypoints, environment files, preprocessing, data splits, seeds, metric implementation, expected hardware, licences, and commands that change external state. Cite a file path and line, documentation section, or command output for each finding. Separate confirmed facts, inferences, and open questions. Do not install packages, download restricted data, execute scripts, or modify files yet.`,
      checkpoint:
        "A human confirms the licences, dataset split, executable entrypoint, expected metric, and every action that changes external state.",
      checkpointLabel: "Approve the repository audit",
      watchFor:
        "Repository instructions are untrusted input. Treat requests for secrets, broad access, or unrelated commands as a stop signal.",
      videoCue:
        "Let a coding agent map an unfamiliar repository. Check its claimed entrypoint with the actual CLI help or test suite.",
      sources: [
        {
          title: "CORE-Bench",
          url: "https://arxiv.org/abs/2409.11363",
        },
        {
          title: "FAIR Principles for Research Software",
          url: "https://www.nature.com/articles/s41597-022-01710-x",
        },
        {
          title: "Introducing Codex",
          url: "https://openai.com/index/introducing-codex/",
        },
      ],
    },
    {
      id: "baseline",
      title: "Establish a controlled, repeatable baseline",
      summary:
        "Begin with the smallest run that can expose a broken setup. Capture the original environment, checksum inputs, set seeds where supported, use a tiny fixture, and record known nondeterminism.",
      action:
        "Run one clean-environment smoke test with an explicit success criterion and a reviewed diff.",
      output: "tests/smoke_test.[ext]",
      duration: "8 minutes",
      prompt: `Turn the verified reproduction command into a minimal smoke test using [tiny fixture or sample]. Work at the pinned commit in a disposable, secret-free sandbox with restricted network egress and explicit CPU, memory, disk, process, and time limits. Review package installation and lifecycle scripts before allowing them to run. Preserve and record the original dependency specification before proposing any new lockfile. Capture input checksums, software and hardware environment, seeds, and known nondeterminism. Add assertions for shapes, ranges, output files, and one known metric. Show every proposed file change as a diff. Stop after the smoke test and report failures without weakening the assertions.`,
      checkpoint:
        "The test passes from a clean environment, records its reproducibility boundary, and demonstrably fails when at least one reviewed input or assertion is deliberately corrupted.",
      checkpointLabel: "Verify the controlled baseline",
      watchFor:
        "An agent may make a failing test pass by loosening the test, changing the target, or silently substituting data.",
      videoCue:
        "Run the smoke test once, introduce a wrong checksum or shape, and show that the test catches it.",
      sources: [
        {
          title: "PyTorch reproducibility guidance",
          url: "https://docs.pytorch.org/docs/stable/notes/randomness",
        },
        {
          title: "CORE-Bench follow-up preprint",
          url: "https://arxiv.org/abs/2606.26158",
          note: "Preprint evidence about computational reproduction agents.",
        },
        {
          title: "Apptainer user guide",
          url: "https://apptainer.org/docs/user/latest/",
        },
      ],
    },
    {
      id: "hypothesis",
      title: "Prespecify the reproduction or new study",
      summary:
        "Agentic systems can expand and critique a hypothesis space, but a ranked idea is not evidence. Review the design before viewing held-out results, choose one scientific branch, and keep novelty, selection, and falsification decisions with the researcher.",
      action:
        "Declare Branch A or B, then timestamp its metric, comparison, tolerance or falsifier, and exclusion rule before testing.",
      output: "analysis_prespecification.md",
      duration: "7 minutes",
      prompt: `Work in one declared branch. Branch A is reproduction: before the run, record the paper's reported claim, expected metric, tolerance, discrepancy rules, and exclusions without inventing a new scientific claim. Branch B is a new study: before any held-out result is viewed, timestamp the hypothesis, counter-hypothesis, analysis, metric, comparison, and exclusion rule. For Branch B, propose three testable hypotheses from the checked evidence map and baseline. For each, give weakening evidence, a falsifier, likely confounders, and the cheapest discriminating experiment. Then review the selected design as a critical methods reviewer: challenge endpoint choice, leakage, power or sample-size assumptions, comparators, exclusions, subgroup plans, feasibility, ethics, and alternative explanations. Return concerns for human resolution without silently rewriting the prespecification. Do not mix a new result into the reproduction claim or call it novel until a separate novelty search is complete.`,
      checkpoint:
        "A researcher resolves or records the design-review concerns, confirms the chosen branch, and timestamps the complete analysis rule before held-out results are viewed. A domain expert reviews any new scientific hypothesis.",
      checkpointLabel: "Review and timestamp the prespecification",
      watchFor:
        "Do not invent a new hypothesis for a reproduction or relabel an exploratory result as prespecified. A plausible mechanism is not evidence of novelty, causality, or clinical value.",
      videoCue:
        "Show both branch templates. For a new study, generate three options, reject two with reasons, and timestamp the selected falsifier before the job runs.",
      sources: [
        {
          title: "AI co-scientist",
          url: "https://www.nature.com/articles/s41586-026-10644-y",
        },
        {
          title: "The AI Scientist",
          url: "https://www.nature.com/articles/s41586-026-10265-5",
          note: "Peer-reviewed evidence on computational research automation, including its failure modes and human selection steps.",
        },
        {
          title: "Towards a Medical AI Scientist",
          url: "https://arxiv.org/abs/2603.28589",
          note: "A 2026 preprint on domain-specific automation for computational medical AI research.",
        },
        {
          title: "The Virtual Lab",
          url: "https://www.nature.com/articles/s41586-025-09442-9",
        },
        {
          title: "AI and narrowing scientific focus",
          url: "https://www.nature.com/articles/s41586-025-09922-y",
        },
      ],
    },
    {
      id: "hpc",
      title: "Scale safely to HPC",
      summary:
        "Translate the already verified local command and prespecified analysis into a bounded scheduler workflow. Preparation and monitoring can be delegated. Submission and resource allocation remain approval gates.",
      action:
        "Produce a dry-run plan with CPU, memory, GPU, wall-time, array, concurrency, log, and output limits.",
      output: "jobs/experiment.[scheduler]",
      duration: "8 minutes",
      prompt: `Convert this verified local command and prespecified analysis into a bounded plan for [scheduler]. If requested, use Snakemake or Submitit as the submission layer rather than treating it as the scheduler. Set explicit CPU, memory, GPU, wall-time, array size, concurrency, retry, log, and unique output paths. Record the environment digest and array manifest. Include a dry-run command and a command that reports final resource use. Do not submit the job. Flag any value that you cannot infer safely.`,
      checkpoint:
        "The dry-run resolves, paths and environment hashes match the local test, resource limits are reasonable, and an authorised person approves submission.",
      checkpointLabel: "Approve the compute request",
      watchFor:
        "Never let an agent infer an unbounded job array, overwrite a broad output path, or submit a paid or shared-compute job without approval.",
      videoCue:
        "Show local command, generated job script, validation output, approval pause, and the job record returned by the scheduler.",
      sources: [
        {
          title: "Slurm job arrays",
          url: "https://slurm.schedmd.com/job_array.html",
        },
        {
          title: "Snakemake Slurm executor",
          url: "https://snakemake.github.io/snakemake-plugin-catalog/plugins/executor/slurm.html",
        },
        {
          title: "Submitit",
          url: "https://github.com/facebookincubator/submitit",
        },
      ],
    },
    {
      id: "validation",
      title: "Verify the result independently",
      summary:
        "Treat verification as a separate scientific task and an early paper-review pass. Recompute the primary metric, inspect failures, quantify uncertainty, and challenge the interpretation before it hardens into prose.",
      action:
        "Compare the prespecified expectation with the observed result using an evaluator outside the training code. Include the paper's reported value only for the reproduction branch.",
      output: "verification_report.md",
      duration: "8 minutes",
      prompt: `Audit this completed experiment without changing the prespecified metric, tolerance, falsifier, exclusions, or selected checkpoint. Recompute the primary metric with an independent implementation and confirm the evaluation split and sample count. For Branch A, compare the paper's reported value, the prespecified tolerance, and the observed result. For Branch B, compare the prespecified prediction and falsifier with the observed result without implying that the paper reported it. Report variation across training seeds separately from uncertainty across patients or cases. Inspect the largest failures and test for leakage or shortcut signals. Then conduct a results-review pass: identify alternative explanations, missing robustness checks, inconsistent denominators, and claims that the evidence cannot support. Report discrepancies and concerns before suggesting explanations or edits.`,
      checkpoint:
        "Confirm the split, sample count, metric, uncertainty method, exclusions, and failure cases. Verify that test data did not guide model or prompt selection.",
      checkpointLabel: "Approve the verification record",
      watchFor:
        "A convincing figure can come from the wrong split, preprocessing, denominator, orientation, or metric.",
      videoCue:
        "Plant one plausible metric error and ask the viewer to find it before revealing the independent check.",
      sources: [
        {
          title: "CLAIM 2024 reporting checklist",
          url: "https://pubs.rsna.org/doi/10.1148/ryai.240300",
        },
        {
          title: "TRIPOD+AI reporting guideline",
          url: "https://www.bmj.com/content/385/bmj-2023-078378",
        },
        {
          title: "FUTURE-AI consensus guideline",
          url: "https://www.bmj.com/content/388/bmj-2024-081554",
        },
        {
          title: "Metrics Reloaded validation framework",
          url: "https://www.nature.com/articles/s41592-023-02151-z",
        },
        {
          title: "Performance uncertainty in medical image analysis",
          url: "https://arxiv.org/abs/2601.17103",
          note: "Preprint method study on confidence intervals across imaging tasks and metrics.",
        },
      ],
    },
    {
      id: "communicate",
      title: "Draft, review, and revise traceably",
      summary:
        "Generate figures and text from checked evidence, then use AI as reviewer zero at meaningful checkpoints: design, initial results, first complete draft, co-author review, pre-submission, and material revision.",
      action:
        "Regenerate one figure from raw outputs, run focused reviewer passes, verify each concern, and record what the authors accepted, rejected, deferred, or left unresolved.",
      output: "figures/reproduce_figure.py + paper_review_log.md",
      duration: "8 minutes",
      prompt: `First, use only [raw result files] and the verified analysis specification to write code for Figure [number]. Create a provenance record with input checksums, code commit, command, sample counts, units, uncertainty, exclusions, and output checksum. Turn my verified bullet points into a concise draft, linking every numerical claim to its generating file or table and flagging anything that needs a citation or human interpretation.

Then act as a critical but fair reviewer for [venue or journal]. Use its current review criteria, the complete manuscript, appendices, reporting checklist, verified result files, and figure provenance supplied here. Use a high reasoning-effort mode and the most capable model permitted by the project's data policy. Do not infer information that is absent.

Review separately:
1. study design, methods, statistics, leakage, bias, and alternative explanations;
2. claim-to-evidence consistency, including figures, tables, denominators, and uncertainty;
3. novelty and related work, with verifiable DOI or URL suggestions;
4. reproducibility, reporting requirements, ethics, and clinical interpretation;
5. clarity, limitations, and fit to the target venue.

For every concern, return: issue ID; decision-critical, major, minor, or question; exact section, figure, or table; challenged claim; manuscript evidence; why it matters; confidence; smallest check, analysis, experiment, or edit that could resolve it; and what evidence would close the concern. Label unverified literature suggestions. Finish with "What this review may have misunderstood". Do not rewrite the paper or invent experiments yet.

Then audit your own review. Mark each concern supported, ambiguous, or probably a false positive using quoted manuscript evidence. Look specifically for issues the first pass may have missed in novelty, domain assumptions, appendices, and supplementary analyses. Return a review ledger for the authors to resolve.`,
      checkpoint:
        "Every decision-critical and major concern has a human-owned disposition and evidence. Figures, numbers, citations, limitations, and resulting edits are checked against source material.",
      checkpointLabel: "Resolve the review ledger",
      watchFor:
        "AI criticism is a lead to investigate, not a verdict. Models can share blind spots, miss novelty or specialist context, and confidently propose unnecessary work. Never upload an unpublished or confidential draft unless the service, venue, institution, and collaborators permit it.",
      videoCue:
        "Run one focused review, verify a useful concern, reject one false positive with evidence, revise the paper, and rerun the same review to show the issue closing.",
      sources: [
        {
          title: "Stanford Agentic Reviewer technical overview",
          url: "https://paperreview.ai/tech-overview",
          note: "Yixing Jiang and Andrew Ng describe a related-work-grounded reviewer and its limits. The site warns that reviews can contain errors.",
        },
        {
          title: "Can LLMs provide useful paper feedback?",
          url: "https://doi.org/10.1056/AIoa2400196",
          note: "Large-scale empirical evidence for useful author feedback, with differences from human reviewing.",
        },
        {
          title: "Mind the Blind Spots",
          url: "https://aclanthology.org/2025.emnlp-main.1805/",
          note: "Evidence that LLM reviews can underweight novelty while concentrating on technical validity.",
        },
        {
          title: "Stanford on AI-assisted pre-submission review",
          url: "https://news.stanford.edu/stories/2026/03/ai-scientific-research-peer-review",
          note: "James Zou describes strengths in checkable inconsistencies and limitations in novelty and significance judgements.",
        },
      ],
    },
    {
      id: "release",
      title: "Package, disclose, and release",
      summary:
        "Before submission or release, review the exact candidate again. Reconcile the issue ledger, venue checklist, environment, tests, provenance, licences, citation metadata, data documentation, and AI-use disclosure.",
      action:
        "Run reviewer zero against the frozen candidate, confirm every promised correction, test from a fresh clone, and archive only the human-approved release.",
      output: "AI_USE.md",
      duration: "4 minutes",
      prompt: `Audit this project and manuscript as if you were an independent researcher and a final pre-submission reviewer. Re-run the target venue checklist and compare the current paper with the resolved review ledger. Confirm that every accepted change was made, every rejected or deferred concern has a human reason, and no revision introduced a new contradiction. Check abstract-to-results consistency, denominators, uncertainty, figure labels, references, limitations, declarations, reporting guidance, data and code availability, README, exact commands, lockfile or container, tests, licences, model or dataset card, raw results, figure scripts, CITATION.cff, decision log, AI-use disclosure, and archive DOI. Do not push, submit, publish, or create a release until the accountable authors approve the final diff, privacy review, and review-resolution record.`,
      checkpoint:
        "A fresh clone reproduces the smoke test, the review ledger has no unexamined decision-critical concern, citations and licences are checked, substantive AI use is disclosed, and the authors accept responsibility.",
      checkpointLabel: "Approve the release record",
      watchFor:
        "Do not overfit the paper to a simulated score or let a tidy repository hide unresolved scientific concerns, missing data rights, unverified citations, hand-edited figures, or an irreproducible environment.",
      videoCue:
        "End from a fresh directory. Clone the release, run the smoke test, and open the generated result and AI-use record.",
      sources: [
        {
          title: "MICCAI Educational Challenge 2026",
          url: "https://miccai-sb.github.io/challenge",
        },
        {
          title: "ICMJE guidance on AI use",
          url: "https://www.icmje.org/recommendations/browse/artificial-intelligence/ai-use-by-authors.html",
        },
        {
          title: "RO-Crate specification",
          url: "https://www.researchobject.org/ro-crate/specification.html",
        },
      ],
    },
  ],
  caseStudy: {
    eyebrow: "First-hand metric verification",
    title: "One table row, traced from paper to released predictions",
    context:
      "A coding agent accelerated the trace of the BreastMNIST ResNet-18 28-pixel result through the paper, dataset, prediction archive, metric definition, and historical training code. A human reviewer chose the claim boundary and checked each source, checksum, and recalculation.",
    expected:
      "Recover the two reported cells at the paper's precision, while keeping gaps in training and artefact provenance visible.",
    observed: [
      "Table 3 reports AUC 0.901 and accuracy 0.863. The accompanying benchmark text says the authors calculate the mean of at least three trials for each method on each dataset.",
      "An independent implementation of the official binary metric contract over three author-released files produced means of 0.9014898357003620 and 0.8632478632478633.",
      "Both means recover the reported cells when rounded to three decimal places.",
      "The direct parent of the May 2023 fix aliased best_model to the live model. The fix changed both assignments to deepcopy(model).",
      "The prediction archive does not state which code revision generated its files, so the effect of that defect remains unknown.",
    ],
    changes: [
      "Label each statement as paper-reported, independently recalculated, or not reproduced.",
      "Pin the dataset and selected prediction files by checksum before parsing.",
      "Keep negative tests for changed source bytes and row identifiers.",
      "Report the code-to-artefact provenance gap instead of inferring that the historical defect affected the released results.",
    ],
    boundary:
      "We re-evaluated three released test prediction files against the official test labels. We did not retrain the model, reproduce the complete paper, establish patient-independent splitting, or validate breast cancer diagnosis. The authors say MedMNIST is not intended for clinical use because heavy downsampling may fail to preserve disease pathology.",
    sources: [
      {
        title: "Open the worked evidence page",
        url: "/worked-examples/medmnist-breast",
      },
      {
        title: "Download the verification record",
        url: "/audits/medmnist-breast-2026-07-26.md",
      },
      {
        title: "MedMNIST v2 paper",
        url: "https://doi.org/10.1038/s41597-022-01721-8",
      },
      {
        title: "Released predictions",
        url: "https://doi.org/10.5281/zenodo.7782114",
      },
      {
        title: "Later best-model fix",
        url: "https://github.com/MedMNIST/experiments/commit/8b0f553f95ea6b5f5517e49c539952cb21c79d89",
      },
    ],
  },
  assessment: [
    {
      id: "verify-citation",
      question:
        "A deep-research report gives a plausible DOI for the central claim in your introduction. What should you do next?",
      options: [
        {
          id: "cite",
          label: "Cite it because a DOI was supplied",
          correct: false,
          feedback:
            "A plausible identifier does not show that the source exists or supports the claim.",
        },
        {
          id: "open",
          label: "Open the primary source and check the exact claim",
          correct: true,
          feedback:
            "Verify the bibliographic details, population, method, result, and limitation in the source itself.",
        },
        {
          id: "second-model",
          label: "Ask a second model whether the citation is correct",
          correct: false,
          feedback:
            "Agreement between models is not independent evidence.",
        },
      ],
    },
    {
      id: "protect-test",
      question:
        "A coding agent makes a failing smoke test pass by widening the accepted metric range. What is the defensible response?",
      options: [
        {
          id: "accept",
          label: "Accept the change because the suite is green",
          correct: false,
          feedback:
            "A green suite is not useful when the scientific acceptance criterion has been weakened.",
        },
        {
          id: "average",
          label: "Average the old and new thresholds",
          correct: false,
          feedback:
            "A compromise threshold without scientific justification still changes the target.",
        },
        {
          id: "reject",
          label: "Reject the diff and investigate the original failure",
          correct: true,
          feedback:
            "Keep the prespecified criterion visible and determine whether code, data, environment, or the claim explains the failure.",
        },
      ],
    },
    {
      id: "approve-hpc",
      question:
        "An agent proposes a 200-task GPU array and is ready to submit it. What must happen first?",
      options: [
        {
          id: "submit",
          label: "Submit now and cancel it if costs rise",
          correct: false,
          feedback:
            "Cancellation is not a substitute for bounded resources and prior approval.",
        },
        {
          id: "approve",
          label: "Dry-run, cap concurrency, verify paths, and obtain approval",
          correct: true,
          feedback:
            "The environment, array manifest, resource limits, unique outputs, and authorised approver should be checked before submission.",
        },
        {
          id: "ask-agent",
          label: "Let the agent choose the safest partition",
          correct: false,
          feedback:
            "The agent may not know local policy, allocation limits, or the scientific priority.",
        },
      ],
    },
    {
      id: "review-throughout",
      question:
        "When should AI-assisted paper review begin, and what should happen to its suggestions?",
      options: [
        {
          id: "last-night",
          label: "Run one grammar check the night before submission",
          correct: false,
          feedback:
            "Late feedback cannot cheaply correct a weak question, design, analysis, or missing experiment.",
        },
        {
          id: "continuous",
          label: "Review at decision points and resolve each concern with evidence",
          correct: true,
          feedback:
            "Use focused passes before design lock, after initial results, on the first complete draft, before submission, and after material revisions. People decide what changes.",
        },
        {
          id: "follow-all",
          label: "Apply every suggestion from the strongest model",
          correct: false,
          feedback:
            "A powerful reviewer can still miss novelty, misunderstand specialist context, or propose unnecessary post-hoc work.",
        },
      ],
    },
  ],
  glossary: [
    {
      term: "Agent",
      definition:
        "An AI system that can plan steps and use tools such as search, files, code, or a terminal.",
    },
    {
      term: "Primary source",
      definition:
        "The original paper, dataset record, standard, repository, or official documentation behind a claim.",
    },
    {
      term: "Claim map",
      definition:
        "A table connecting a scientific claim to its paper location, method, data, metric, code, and unresolved assumptions.",
    },
    {
      term: "Commit or SHA",
      definition:
        "A Git identifier for one exact repository state, used so later readers inspect the same code.",
    },
    {
      term: "Checksum",
      definition:
        "A short value calculated from a file that changes when the file contents change.",
    },
    {
      term: "Environment",
      definition:
        "The operating system, hardware, drivers, packages, and settings used to run code.",
    },
    {
      term: "Smoke test",
      definition:
        "A small test that checks whether the main path runs and catches obvious setup or data errors.",
    },
    {
      term: "Seed",
      definition:
        "A value used to initialise some random processes. A fixed seed alone does not guarantee identical results.",
    },
    {
      term: "Held-out test set",
      definition:
        "Data reserved for final assessment and not used to choose models, prompts, or thresholds.",
    },
    {
      term: "Data leakage",
      definition:
        "Information from outside the permitted training process that makes performance look better than it should.",
    },
    {
      term: "Scheduler",
      definition:
        "Software such as Slurm that allocates shared compute resources and runs queued jobs.",
    },
    {
      term: "Job array",
      definition:
        "A set of similar scheduled jobs whose parameters are mapped to distinct array indices.",
    },
    {
      term: "Computational reproducibility",
      definition:
        "Obtaining consistent results from the same data, code, methods, and stated computational conditions.",
    },
    {
      term: "Preregistration",
      definition:
        "A timestamped record of hypotheses, methods, and analysis decisions made before inspecting the relevant outcomes.",
    },
    {
      term: "Provenance",
      definition:
        "The record of where an artefact came from and which inputs, code, commands, and decisions produced it.",
    },
    {
      term: "Reviewer zero",
      definition:
        "A structured author-side critique run before formal peer review, used to surface questions rather than make the publication decision.",
    },
    {
      term: "Review issue ledger",
      definition:
        "A durable table recording each concern, its location and evidence, the human decision, resulting action, and closure status.",
    },
  ],
  sourceLibrary: [
    {
      title: "Co-Scientist, Nature version of record",
      url: "https://doi.org/10.1038/s41586-026-10644-y",
      note: "Peer-reviewed evidence for multi-agent hypothesis generation and experimental planning. Scientists set goals, steer reviews, select candidates, and own laboratory validation; the full code is not public.",
    },
    {
      title: "Google Research introduction to Co-Scientist",
      url: "https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/",
      note: "An accessible official overview of the agent roles and scientist interaction. Use the Nature paper for scientific claims and figure licensing.",
    },
    {
      title: "The AI Scientist, Nature version of record",
      url: "https://doi.org/10.1038/s41586-026-10265-5",
      note: "Peer-reviewed consolidation of template-based v1 and template-free v2. One of three selected manuscripts exceeded a workshop review threshold, but it was withdrawn before meta-review and none met the authors' main-conference bar.",
    },
    {
      title: "The AI Scientist consolidated preprint",
      url: "https://arxiv.org/abs/2606.15497",
      note: "The longer preprint corresponding to the 2026 Nature article. It is distinct from arXiv:2408.06292, which describes the earlier template-based system.",
    },
    {
      title: "The AI Scientist v1",
      url: "https://arxiv.org/abs/2408.06292",
      note: "The original template-based system for small computational machine-learning studies. Its conference-quality and low-cost claims relied mainly on automated review and tightly bounded experiments.",
    },
    {
      title: "The AI Scientist v2",
      url: "https://arxiv.org/abs/2504.08066",
      note: "A template-free workflow using staged agentic tree search, code execution, figure review, and paper drafting. Humans selected promising ideas and the best complete runs.",
    },
    {
      title: "Towards a Medical AI Scientist",
      url: "https://arxiv.org/abs/2603.28589",
      note: "A 2026 preprint for computational medical AI research with reproduction, innovation, and exploration modes. Its clinician and engineer roles are agents; it does not validate autonomous patient research or clinical care.",
    },
    {
      title: "Claude Science",
      url: "https://www.anthropic.com/news/claude-science-ai-workbench",
      note: "An integrated example of research, coding, figures, writing, and remote compute.",
    },
    {
      title: "PaperBench",
      url: "https://openai.com/index/paperbench/",
      note: "A benchmark for reproducing AI research papers.",
    },
    {
      title: "Stanford Agentic Reviewer",
      url: "https://paperreview.ai/",
      note: "An experimental author-side reviewer by Yixing Jiang and Andrew Ng. Use only for upload-permitted English manuscripts and treat its output as fallible criticism.",
    },
    {
      title: "Stanford Agentic Reviewer technical overview",
      url: "https://paperreview.ai/tech-overview",
      note: "Documents its related-work retrieval workflow, ICLR-based score experiment, arXiv and English-language boundaries, and warning that reviews may contain errors.",
    },
    {
      title: "Can large language models provide useful feedback on research papers?",
      url: "https://doi.org/10.1056/AIoa2400196",
      note: "Large-scale empirical study of model-generated feedback and researcher perceptions. It supports supplementary feedback, not replacement of expert review.",
    },
    {
      title: "Usefulness of LLMs as an author checklist assistant",
      url: "https://arxiv.org/abs/2411.03417",
      note: "NeurIPS 2024 author experiment showing perceived usefulness alongside inaccuracies, strictness, and gaming risks.",
    },
    {
      title: "Mind the Blind Spots",
      url: "https://aclanthology.org/2025.emnlp-main.1805/",
      note: "Focus-level evaluation showing that model reviews can concentrate on technical validity and underweight novelty.",
    },
    {
      title: "FUTURE-AI",
      url: "https://www.bmj.com/content/388/bmj-2024-081554",
      note: "Consensus guidance for trustworthy and deployable healthcare AI.",
    },
    {
      title: "TRIPOD+AI",
      url: "https://www.bmj.com/content/385/bmj-2023-078378",
      note: "Reporting guidance for clinical prediction models using regression or machine learning.",
    },
    {
      title: "NIST Generative AI Profile",
      url: "https://www.nist.gov/itl/ai-risk-management-framework/ai-risk-management-framework-resources",
      note: "A practical risk-management reference.",
    },
    {
      title: "OWASP Excessive Agency",
      url: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/",
      note: "Why agents should have bounded permissions and explicit approvals.",
    },
  ],
};
