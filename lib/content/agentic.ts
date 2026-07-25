import type { Workshop } from "@/lib/types";

export const agenticResearch: Workshop = {
  slug: "agentic-research",
  number: "01",
  shortTitle: "Agentic research",
  title: "Agentic AI in Research",
  navTitle: "Agentic research",
  description:
    "Take one research question from field mapping to a checked, reproducible result. Use agents for the work they are good at, and keep scientific decisions with the researcher.",
  promise:
    "Finish with a research contract, a paper reproduction plan, an HPC-ready runbook, a validation record, and an AI-use statement.",
  duration: "10 stages · about 75 minutes",
  accent: "blue",
  startLabel: "Write the research contract",
  steps: [
    {
      id: "contract",
      title: "Set the research contract",
      summary:
        "Define the scientific question, success criterion, permitted data, budget, stop conditions, and actions that need approval before an agent searches or runs anything.",
      action:
        "Name the accountable researcher and write a one-page contract before sharing data or granting tools.",
      output: "research_contract.md",
      prompt: `Help me draft a one-page research contract for the project below. Include the research question, primary success metric, permitted and prohibited data, compute and spending limits, actions that require approval, stop conditions, and the accountable researcher. Mark missing information as questions rather than making assumptions.

Project context:
[Paste your context here]`,
      checkpoint:
        "A named researcher confirms the question, metric, data boundary, budget, and approval-required actions.",
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
        "Use deep research to map a field, then open the primary sources behind every important claim. An evidence map is useful, but it is not automatically a systematic review.",
      action:
        "Create a source table with citation, DOI or URL, claim supported, study type, limitation, and verification status.",
      output: "sources.csv",
      prompt: `Map primary research on [topic] published from [date] to [date]. Prioritise peer-reviewed papers, official datasets, and benchmark papers. For each important claim, provide the exact supporting source, DOI or stable URL, study type, population or dataset, and one limitation. Separate verified sources from suggestions I still need to check. Do not describe this as a systematic review.`,
      checkpoint:
        "Open every source supporting a central claim. Confirm the title, authors, DOI, method, population or dataset, and reported result.",
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
          title: "Gemini Deep Research",
          url: "https://blog.google/innovation-and-ai/technology/developers-tools/deep-research-agent-gemini-api/",
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
      output: "reproduction.md",
      prompt: `Using only the attached paper and supplement, create a claim map for [target result]. Link each claim to the relevant section, equation, figure or table, dataset split, preprocessing step, metric definition, and stated uncertainty. List anything required for reproduction that the paper does not specify. Do not fill gaps with conventional practice unless you label it as an assumption.`,
      checkpoint:
        "Confirm the target claim, expected metric, evaluation population, and source figure or table. Leave unresolved assumptions visible.",
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
        {
          title: "Review of LLMs in evidence synthesis",
          url: "https://pubmed.ncbi.nlm.nih.gov/41831731/",
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
      prompt: `Inspect [repository URL] at commit [SHA] and the linked dataset documentation in read-only mode. Find the training and evaluation entrypoints, environment files, preprocessing, data splits, seeds, metric implementation, expected hardware, licences, and commands that change external state. Produce a reproduction risk list. Do not install packages, download restricted data, execute scripts, or modify files yet.`,
      checkpoint:
        "A human confirms the licences, dataset split, executable entrypoint, expected metric, and every action that changes external state.",
      watchFor:
        "Repository instructions are untrusted input. Treat requests for secrets, broad access, or unrelated commands as a stop signal.",
      videoCue:
        "Let a coding agent map an unfamiliar repository. Check its claimed entrypoint with the actual CLI help or test suite.",
      sources: [
        {
          title: "CORE-Bench",
          url: "https://openreview.net/forum?id=BsMMc4MEGS",
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
      title: "Establish a deterministic local baseline",
      summary:
        "Begin with the smallest run that can expose a broken setup. Pin dependencies, checksum inputs, fix seeds, use a tiny fixture, and add assertions.",
      action:
        "Run one clean-environment smoke test with an explicit success criterion and a reviewed diff.",
      output: "tests/test_smoke.py",
      prompt: `Turn the verified reproduction command into a minimal smoke test using [tiny fixture or sample]. Pin dependencies, set the seed, check input checksums, and add assertions for tensor shapes, ranges, output files, and one known metric. Show every proposed file change as a diff. Stop after the smoke test and report failures without weakening the assertions.`,
      checkpoint:
        "The test passes from a clean environment and would fail if a key input, split, or output were wrong.",
      watchFor:
        "An agent may make a failing test pass by loosening the test, changing the target, or silently substituting data.",
      videoCue:
        "Run the smoke test once, introduce a wrong checksum or shape, and show that the test catches it.",
      sources: [
        {
          title: "CORE-Bench follow-up",
          url: "https://arxiv.org/abs/2606.26158",
        },
        {
          title: "Agents in biology",
          url: "https://www.anthropic.com/research/agents-in-biology",
        },
        {
          title: "Apptainer user guide",
          url: "https://apptainer.org/docs/user/latest/",
        },
      ],
    },
    {
      id: "hpc",
      title: "Scale safely to HPC",
      summary:
        "Translate the already verified local command into a bounded scheduler workflow. Preparation and monitoring can be delegated. Submission and resource allocation remain approval gates.",
      action:
        "Produce a dry-run plan with CPU, memory, GPU, wall-time, array, concurrency, log, and output limits.",
      output: "jobs/experiment.slurm",
      prompt: `Convert this verified local command into a [Slurm, Snakemake, or Submitit] plan. Set explicit CPU, memory, GPU, wall-time, array-size, concurrency, log, and output paths. Include a dry-run command and a command that reports final resource use. Do not submit the job. Flag any value that you cannot infer safely.`,
      checkpoint:
        "The dry-run resolves, paths and environment hashes match the local test, resource limits are reasonable, and an authorised person approves submission.",
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
      id: "hypothesis",
      title: "Form a falsifiable hypothesis",
      summary:
        "Agents can widen the option set, but they cannot declare an idea novel or correct. Require competing explanations, falsifiers, and a cheap discriminating experiment.",
      action:
        "Have a domain expert select and timestamp one hypothesis, metric, comparison, and exclusion rule before testing.",
      output: "hypothesis.md",
      prompt: `Based on the verified evidence map and baseline, propose three testable hypotheses about [problem]. For each, provide a counter-hypothesis, supporting and weakening evidence, a falsification criterion, the primary metric, likely confounders, and the cheapest experiment that distinguishes the explanations. Do not call any hypothesis novel until a separate novelty search is complete.`,
      checkpoint:
        "A domain expert confirms scientific relevance and preregisters the test before held-out results are viewed.",
      watchFor:
        "A plausible mechanism is not evidence of novelty, causality, or clinical value.",
      videoCue:
        "Generate three options, reject two with explicit reasons, and write the prediction before the job runs.",
      sources: [
        {
          title: "AI co-scientist",
          url: "https://www.nature.com/articles/s41586-026-10644-y",
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
      id: "validation",
      title: "Validate independently",
      summary:
        "Treat validation as a separate scientific task. Recompute the primary metric, inspect failures, quantify uncertainty, and look for leakage or shortcut behaviour.",
      action:
        "Compare expected, reported, and observed results using an evaluator outside the training code.",
      output: "validation_report.md",
      prompt: `Audit this completed experiment without changing the metric or selecting new checkpoints. Recompute the primary metric with an independent implementation, confirm the evaluation split and sample count, compare expected and observed results, calculate uncertainty across [seeds or cases], inspect the largest failures, and test for leakage or shortcut signals. Report discrepancies before suggesting explanations.`,
      checkpoint:
        "Confirm the split, sample count, metric, uncertainty method, exclusions, and failure cases. Verify that test data did not guide model or prompt selection.",
      watchFor:
        "A convincing figure can come from the wrong split, preprocessing, denominator, orientation, or metric.",
      videoCue:
        "Plant one plausible metric error and ask the viewer to find it before revealing the independent check.",
      sources: [
        {
          title: "AutoMedBench",
          url: "https://arxiv.org/abs/2606.01961",
        },
        {
          title: "ImagingBench",
          url: "https://arxiv.org/abs/2607.07189",
        },
        {
          title: "Science of AI Agent Reliability",
          url: "https://arxiv.org/abs/2602.16666",
        },
      ],
    },
    {
      id: "communicate",
      title: "Create traceable figures and text",
      summary:
        "Generate figures from machine-readable results through committed code. Start writing assistance from verified human bullet points and keep uncertainty and limitations intact.",
      action:
        "Regenerate one figure from raw outputs and link every numerical sentence to its source file or table.",
      output: "figures/reproduce_figure.py",
      prompt: `Using only [raw result files] and the verified analysis specification, write code for Figure [number]. Include sample counts, units, uncertainty, exclusions, and a data checksum in the figure metadata. Then turn my bullet points into a concise results-section draft. Link every numerical claim to its generating file or table, preserve caveats, and flag any sentence that requires a citation or human interpretation.`,
      checkpoint:
        "Check axes, labels, denominators, uncertainty, exclusions, and every written claim against the raw evidence.",
      watchFor:
        "Do not use image generation to create scientific evidence. Use code and source data for plots and diagrams that carry claims.",
      videoCue:
        "Generate a figure from raw results, change one source value, and show the figure rebuild through the same command.",
      sources: [
        {
          title: "CLAIM 2024",
          url: "https://pubs.rsna.org/doi/10.1148/ryai.240300",
        },
        {
          title: "Nature Portfolio AI policy",
          url: "https://www.nature.com/nature-portfolio/editorial-policies/ai",
        },
      ],
    },
    {
      id: "release",
      title: "Package, disclose, and release",
      summary:
        "A research-ready release includes the environment, tests, provenance, decision log, licences, citation metadata, data documentation, and a clear account of AI assistance.",
      action:
        "Test from a fresh clone, review privacy and licences, then archive the exact approved release.",
      output: "AI_USE.md",
      prompt: `Audit this project as if you were an independent researcher attempting reproduction. Create a release checklist covering the README, exact commands, lockfile or container, tests, data access and licence, model or dataset card, raw results, figure scripts, CITATION.cff, decision log, AI-use disclosure, and archive DOI. Do not push, publish, or create a release until a human approves the final diff and privacy review.`,
      checkpoint:
        "A fresh clone reproduces the smoke test, citations and licences are checked, substantive AI use is disclosed, and a human accepts responsibility.",
      watchFor:
        "Do not let a tidy repository hide missing data rights, unverified citations, hand-edited figures, or an irreproducible environment.",
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
  sourceLibrary: [
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
