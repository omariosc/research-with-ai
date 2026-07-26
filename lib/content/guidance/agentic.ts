import type { Source, WorkshopGuidance } from "@/lib/types";

const official: Record<string, Source> = {
  openaiDeepResearch: {
    title: "Deep research in ChatGPT",
    url: "https://help.openai.com/en/articles/10500283-deep-research",
  },
  geminiDeepResearch: {
    title: "Use Deep Research in Gemini Apps",
    url: "https://support.google.com/gemini/answer/15719111?hl=en",
  },
  ncbiApis: {
    title: "NCBI public APIs",
    url: "https://www.ncbi.nlm.nih.gov/home/develop/api/",
  },
  openAlex: {
    title: "OpenAlex developer documentation",
    url: "https://developers.openalex.org/",
  },
  zoteroData: {
    title: "The Zotero data directory",
    url: "https://www.zotero.org/support/zotero_data",
  },
  notebookSources: {
    title: "Gemini Notebook source types and limitations",
    url: "https://support.google.com/notebooklm/answer/16215270?hl=en",
  },
  ollama: {
    title: "Ollama documentation",
    url: "https://docs.ollama.com/",
  },
  llamaCpp: {
    title: "llama.cpp",
    url: "https://github.com/ggml-org/llama.cpp",
  },
  aiderOllama: {
    title: "Aider with Ollama",
    url: "https://aider.chat/docs/llms/ollama.html",
  },
  githubAgentRisks: {
    title: "Risks and mitigations for GitHub Copilot cloud agent",
    url: "https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/cloud-agent/risks-and-mitigations",
  },
  githubFirewall: {
    title: "Customising the GitHub Copilot firewall",
    url: "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall",
  },
  pytorchReproducibility: {
    title: "PyTorch reproducibility",
    url: "https://docs.pytorch.org/docs/stable/notes/randomness",
  },
  apptainerSecurity: {
    title: "Security in Apptainer",
    url: "https://apptainer.org/docs/user/latest/security.html",
  },
  slurmSbatch: {
    title: "Slurm sbatch",
    url: "https://slurm.schedmd.com/sbatch.html",
  },
  slurmSacct: {
    title: "Slurm sacct",
    url: "https://slurm.schedmd.com/sacct.html",
  },
  snakemakeExecutors: {
    title: "Snakemake executor plugins",
    url: "https://snakemake.readthedocs.io/en/latest/executing/executors.html",
  },
  quartoManuscripts: {
    title: "Authoring manuscripts with Quarto",
    url: "https://quarto.org/docs/manuscripts/authoring/jupyterlab.html",
  },
  quartoWebsites: {
    title: "Creating a website with Quarto",
    url: "https://quarto.org/docs/websites/",
  },
  wcag: {
    title: "WCAG 2 overview",
    url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
  },
  zenodoGithub: {
    title: "Enable a GitHub repository in Zenodo",
    url: "https://help.zenodo.org/docs/github/enable-repository/",
  },
  citationCff: {
    title: "Citation File Format",
    url: "https://citation-file-format.github.io/",
  },
  roCrate: {
    title: "RO-Crate specification",
    url: "https://www.researchobject.org/ro-crate/specification/1.3/introduction.html",
  },
};

export const agenticGuidance: WorkshopGuidance = {
  lastVerified: "2026-07-26",
  phases: [
    {
      id: "bound",
      title: "Bound the work",
      summary: "Set authority first, then create a traceable view of the field.",
      stepIds: ["contract", "evidence"],
    },
    {
      id: "understand",
      title: "Understand the target",
      summary: "Trace one claim through its paper, code, data, and metric.",
      stepIds: ["paper", "repo-data"],
    },
    {
      id: "design",
      title: "Design the test",
      summary: "Prove the setup works, then prespecify what the result can mean.",
      stepIds: ["baseline", "hypothesis"],
    },
    {
      id: "execute",
      title: "Run and verify",
      summary: "Scale a checked command and evaluate its outputs independently.",
      stepIds: ["hpc", "validation"],
    },
    {
      id: "publish",
      title: "Communicate and release",
      summary: "Connect every public claim to evidence and an archived release.",
      stepIds: ["communicate", "release"],
    },
  ],
  routes: [
    {
      id: "orientation",
      title: "Research orientation",
      description: "Learn the control points without running a full experiment.",
      bestFor: "A first lab session or a new project discussion.",
      stepIds: ["contract", "evidence", "paper", "release"],
    },
    {
      id: "reproduction",
      title: "Paper reproduction",
      description: "Follow one reported result from source to independent check.",
      bestFor: "Researchers reproducing a paper or onboarding to a repository.",
      stepIds: [
        "contract",
        "evidence",
        "paper",
        "repo-data",
        "baseline",
        "hypothesis",
        "hpc",
        "validation",
        "communicate",
        "release",
      ],
    },
    {
      id: "hypothesis",
      title: "Hypothesis development",
      description: "Move from checked evidence to one falsifiable, prespecified test.",
      bestFor: "Researchers planning an extension rather than copying a result.",
      stepIds: [
        "contract",
        "evidence",
        "paper",
        "repo-data",
        "baseline",
        "hypothesis",
        "validation",
        "communicate",
        "release",
      ],
    },
    {
      id: "hpc",
      title: "HPC execution",
      description: "Turn a verified local command into a bounded scheduled run.",
      bestFor: "Teams with an existing experiment and approved cluster access.",
      stepIds: [
        "contract",
        "repo-data",
        "baseline",
        "hypothesis",
        "hpc",
        "validation",
        "release",
      ],
    },
  ],
  steps: {
    contract: {
      why:
        "A written boundary makes scientific ownership, data use, spending, and agent authority reviewable before tools are connected.",
      terms: [
        {
          label: "Approval gate",
          definition: "A point where an authorised person must decide.",
        },
        {
          label: "Data boundary",
          definition: "The information a tool is permitted to receive.",
        },
      ],
      tips: [
        {
          title: "Name the decision owner",
          body: "Record who may approve data access, spending, submission, and release.",
        },
        {
          title: "Enforce the prose",
          body: "Match contract limits with real permissions, quotas, and network rules.",
        },
      ],
      paths: [
        {
          id: "contract-hosted",
          mode: "hosted",
          title: "Hosted planning assistant",
          bestFor: "Public or non-sensitive project planning.",
          approach:
            "Share only the minimum context and ask the service to expose missing decisions.",
          tradeoff: "Fast collaboration, but prompts leave your device.",
          dataBoundary: "Research question and public metadata only.",
          network: "Internet required throughout.",
          cost: "Subscription or usage allowance.",
          hardware: "A current browser is sufficient.",
          evidence: "Exported contract, service settings, and human approval.",
          sources: [official.openaiDeepResearch],
        },
        {
          id: "contract-managed",
          mode: "managed",
          title: "Institution-approved workspace",
          bestFor: "Confidential plans allowed within an approved tenant.",
          approach:
            "Use institutional identity, retention controls, and named approval roles.",
          tradeoff: "Better governance, with administrator and policy dependency.",
          dataBoundary: "Only material covered by institutional approval.",
          network: "Institutional or approved cloud connection.",
          cost: "Licence and governance overhead.",
          hardware: "Browser or managed workstation.",
          evidence: "Contract, tenant record, retention setting, and approver.",
          sources: [],
        },
        {
          id: "contract-local",
          mode: "local",
          title: "Offline contract workshop",
          bestFor: "Sensitive projects before any service is authorised.",
          approach:
            "Complete the template locally, with an optional local model for questions.",
          tradeoff: "Maximum control, but no automatic team sharing.",
          dataBoundary: "Nothing leaves the workstation.",
          network: "None after optional model download.",
          cost: "Local time, storage, and electricity.",
          hardware: "Text editor; more RAM if using a local model.",
          evidence: "Timestamped contract, checksum, and signed approval note.",
          sources: [official.ollama],
        },
      ],
      tryNow: {
        intro: "Write the boundary before asking for research help.",
        items: [
          { id: "contract-try-1", label: "Name the accountable researcher" },
          { id: "contract-try-2", label: "List prohibited data and actions" },
          { id: "contract-try-3", label: "Set compute and spending limits" },
        ],
        evidence: "Save the approved one-page contract and its checksum.",
      },
    },
    evidence: {
      why:
        "A searchable evidence map accelerates orientation only when queries, sources, dates, and human checks remain visible.",
      terms: [
        {
          label: "Search log",
          definition: "The exact query, database, date, and returned records.",
        },
        {
          label: "Primary source",
          definition: "The original paper, dataset, standard, or documentation.",
        },
      ],
      tips: [
        {
          title: "Separate retrieval from checking",
          body: "Keep distinct fields for agent-found, human-opened, and claim-checked.",
        },
        {
          title: "Archive stable identifiers",
          body: "Save DOI, PMID, query text, search date, and exclusion reason.",
        },
      ],
      paths: [
        {
          id: "evidence-hosted",
          mode: "hosted",
          title: "Web research agent",
          bestFor: "Rapid mapping of public literature.",
          approach:
            "Constrain domains, review the research plan, then export citations and activity.",
          tradeoff: "Broad and quick, but incomplete access can look comprehensive.",
          dataBoundary: "Search question and any uploaded public files.",
          network: "Continuous web access.",
          cost: "Plan limits or per-task usage.",
          hardware: "Browser only.",
          evidence: "Research plan, report, source list, and activity history.",
          sources: [official.openaiDeepResearch, official.geminiDeepResearch],
        },
        {
          id: "evidence-managed",
          mode: "managed",
          title: "Logged scholarly API search",
          bestFor: "Repeatable database searches in a shared notebook.",
          approach:
            "Query NCBI and OpenAlex through versioned code with fixed parameters.",
          tradeoff: "Reproducible results, but database coverage still differs.",
          dataBoundary: "Queries and public bibliographic metadata.",
          network: "Outbound access to named scholarly APIs.",
          cost: "Usually free within published quotas.",
          hardware: "Laptop or small managed runner.",
          evidence: "Query file, raw response, identifiers, timestamp, and exclusions.",
          sources: [official.ncbiApis, official.openAlex],
        },
        {
          id: "evidence-local",
          mode: "local",
          title: "Offline evidence collection",
          bestFor: "Restricted networks or a frozen review snapshot.",
          approach:
            "Search downloaded exports or snapshots and manage papers in local Zotero.",
          tradeoff: "Private and repeatable, but not current until refreshed.",
          dataBoundary: "Bibliography and attachments remain local.",
          network: "None during analysis.",
          cost: "Disk space and refresh time.",
          hardware: "Storage sized for snapshots and attachments.",
          evidence: "Snapshot version, checksums, local query, and Zotero backup.",
          sources: [official.openAlex, official.zoteroData],
        },
      ],
      tryNow: {
        intro: "Make one important claim traceable from search to source.",
        items: [
          { id: "evidence-try-1", label: "Save the exact search query" },
          { id: "evidence-try-2", label: "Open the central primary source" },
          { id: "evidence-try-3", label: "Record one limitation or exclusion" },
        ],
        evidence: "Produce a source table with separate human-check fields.",
      },
    },
    paper: {
      why:
        "Source-grounded questions help locate details, but the researcher must still resolve claims against pages, figures, and supplements.",
      terms: [
        {
          label: "Claim map",
          definition: "A link from a claim to its supporting evidence.",
        },
        {
          label: "Unresolved assumption",
          definition: "A required detail that the supplied sources do not state.",
        },
      ],
      tips: [
        {
          title: "Ask for NOT FOUND",
          body: "Do not let the assistant fill missing methods with common practice.",
        },
        {
          title: "Inspect visual evidence",
          body: "Check figures, tables, equations, and supplements outside extracted text.",
        },
      ],
      paths: [
        {
          id: "paper-hosted",
          mode: "hosted",
          title: "Hosted source notebook",
          bestFor: "Public papers and quick cited Q&A.",
          approach:
            "Upload paper and supplement, select sources, and demand page-level citations.",
          tradeoff: "Convenient grounding, but document extraction can omit key content.",
          dataBoundary: "Uploaded documents are copied to the service.",
          network: "Internet required.",
          cost: "Free tier or subscription limits.",
          hardware: "Browser only.",
          evidence: "Question log, cited passages, source versions, and corrections.",
          sources: [official.notebookSources],
        },
        {
          id: "paper-managed",
          mode: "managed",
          title: "Institutional document retrieval",
          bestFor: "Licensed or confidential papers within an approved system.",
          approach:
            "Index approved files internally and retain the retrieved passages for review.",
          tradeoff: "Controlled access, with maintenance and retrieval tuning.",
          dataBoundary: "Documents remain inside the managed environment.",
          network: "Institutional network only.",
          cost: "Storage, indexing, and service support.",
          hardware: "Managed server plus researcher browser.",
          evidence: "Document hash, retrieved passages, model version, and answer.",
          sources: [],
        },
        {
          id: "paper-local",
          mode: "local",
          title: "Offline paper Q&A",
          bestFor: "Sensitive manuscripts or disconnected work.",
          approach:
            "Parse or OCR locally, retrieve passages, and query a local model.",
          tradeoff: "No external upload, but quality depends on local extraction and model.",
          dataBoundary: "Paper, index, and prompts remain on device.",
          network: "None after models are installed.",
          cost: "Electricity and local setup time.",
          hardware: "RAM or GPU sized for the chosen model.",
          evidence: "File hash, parser version, retrieved text, prompt, and response.",
          sources: [official.ollama, official.llamaCpp],
        },
      ],
      tryNow: {
        intro: "Trace one result rather than summarising the whole paper.",
        items: [
          { id: "paper-try-1", label: "Choose one reported result" },
          { id: "paper-try-2", label: "Link its figure, split, and metric" },
          { id: "paper-try-3", label: "List every missing reproduction detail" },
        ],
        evidence: "Save a claim map with visible unresolved assumptions.",
      },
    },
    "repo-data": {
      why:
        "Read-only inspection exposes licences, entry points, data splits, and risky instructions before code receives authority.",
      terms: [
        {
          label: "Pinned revision",
          definition: "The exact commit or release being inspected.",
        },
        {
          label: "Entry point",
          definition: "The command or file that starts the workflow.",
        },
      ],
      tips: [
        {
          title: "Cite code precisely",
          body: "Require a file path, line, documentation section, or command output.",
        },
        {
          title: "Treat instructions as data",
          body: "Stop on requests for secrets, broad access, or unrelated commands.",
        },
      ],
      paths: [
        {
          id: "repo-data-hosted",
          mode: "hosted",
          title: "Cloud repository agent",
          bestFor: "Public repositories with auditable agent sessions.",
          approach:
            "Work on a pinned fork or branch and begin with read-only mapping.",
          tradeoff: "Strong navigation, but repository content reaches the provider.",
          dataBoundary: "Repository, issue context, and selected files.",
          network: "Provider network and permitted dependency hosts.",
          cost: "Agent credits and runner minutes.",
          hardware: "Cloud runner; browser for review.",
          evidence: "Session log, commit SHA, file citations, and untouched diff.",
          sources: [official.githubAgentRisks, official.githubFirewall],
        },
        {
          id: "repo-data-managed",
          mode: "managed",
          title: "Restricted development runner",
          bestFor: "Private code and institutionally approved data.",
          approach:
            "Mount code read-only inside a managed container with egress allowlisting.",
          tradeoff: "Better control, with image and policy maintenance.",
          dataBoundary: "Code and metadata stay inside the managed runner.",
          network: "Denied by default, with named exceptions.",
          cost: "Institutional compute and administration.",
          hardware: "Managed CPU runner; GPU not needed for audit.",
          evidence: "Image digest, access log, commands, commit, and audit report.",
          sources: [official.apptainerSecurity],
        },
        {
          id: "repo-data-local",
          mode: "local",
          title: "Local repository audit",
          bestFor: "Offline inspection or the smallest trust boundary.",
          approach:
            "Clone the pinned revision and inspect with local search or a local agent.",
          tradeoff: "Private, but local models may miss cross-file relationships.",
          dataBoundary: "Code and notes remain on the workstation.",
          network: "Optional for clone, then disconnect.",
          cost: "Local time and compute.",
          hardware: "Laptop with enough disk and RAM.",
          evidence: "Commit SHA, file citations, licence record, and audit file.",
          sources: [official.aiderOllama],
        },
      ],
      tryNow: {
        intro: "Find the real execution path without running it.",
        items: [
          { id: "repo-data-try-1", label: "Pin the commit and dataset version" },
          { id: "repo-data-try-2", label: "Locate entry point and metric code" },
          { id: "repo-data-try-3", label: "Check licences and external actions" },
        ],
        evidence: "Save a read-only audit with code and documentation citations.",
      },
    },
    baseline: {
      why:
        "A tiny controlled run catches broken environments and unsafe fixes before expensive experiments create misleading outputs.",
      terms: [
        {
          label: "Smoke test",
          definition: "A small run that checks the main workflow.",
        },
        {
          label: "Checksum",
          definition: "A fingerprint used to detect changed input bytes.",
        },
      ],
      tips: [
        {
          title: "Keep the target fixed",
          body: "Reject fixes that weaken assertions, swap data, or change the metric.",
        },
        {
          title: "Prove the test can fail",
          body: "Corrupt one reviewed input or assertion and observe a failure.",
        },
      ],
      paths: [
        {
          id: "baseline-hosted",
          mode: "hosted",
          title: "Ephemeral hosted runner",
          bestFor: "Public code and a tiny public fixture.",
          approach:
            "Build a pinned environment, disable excess access, and run one test.",
          tradeoff: "Clean setup, but logs and fixtures reach the provider.",
          dataBoundary: "Public fixture, source, and generated logs only.",
          network: "Dependencies first, then restrict egress.",
          cost: "Runner minutes and artifact storage.",
          hardware: "Fixed hosted CPU or small GPU.",
          evidence: "Build log, image digest, checksums, test output, and diff.",
          sources: [official.githubFirewall],
        },
        {
          id: "baseline-managed",
          mode: "managed",
          title: "Managed reproducibility container",
          bestFor: "Approved data and shared laboratory infrastructure.",
          approach:
            "Run the fixture in an immutable image under explicit resource limits.",
          tradeoff: "Portable execution, but a container is not full isolation.",
          dataBoundary: "Approved fixture stays on managed storage.",
          network: "Blocked or limited to approved registries.",
          cost: "Institutional allocation and image storage.",
          hardware: "CPU first; GPU only if the test requires it.",
          evidence: "Definition file, image digest, resource limits, and test log.",
          sources: [official.apptainerSecurity],
        },
        {
          id: "baseline-local",
          mode: "local",
          title: "Local clean-environment test",
          bestFor: "Fast iteration before shared compute.",
          approach:
            "Use a fresh environment, cached dependencies, and the smallest fixture.",
          tradeoff: "Easy to inspect, but workstation hardware may differ.",
          dataBoundary: "Inputs and outputs remain local.",
          network: "None after dependencies are cached.",
          cost: "Local electricity and researcher time.",
          hardware: "Laptop or workstation matching minimum requirements.",
          evidence: "Lockfile, command, seed record, checksums, and failure demonstration.",
          sources: [official.pytorchReproducibility],
        },
      ],
      tryNow: {
        intro: "Make the smallest run both pass and fail correctly.",
        items: [
          { id: "baseline-try-1", label: "Checksum the tiny fixture" },
          { id: "baseline-try-2", label: "Run from a clean environment" },
          { id: "baseline-try-3", label: "Trigger one deliberate failure" },
        ],
        evidence: "Keep the environment record and both test logs.",
      },
    },
    hypothesis: {
      why:
        "Prespecification separates a human scientific decision from fluent suggestions and from patterns discovered after seeing results.",
      terms: [
        {
          label: "Falsifier",
          definition: "An observation that would count against the hypothesis.",
        },
        {
          label: "Counter-hypothesis",
          definition: "A credible alternative explanation for the same observation.",
        },
      ],
      tips: [
        {
          title: "Choose before held-out results",
          body: "Timestamp the metric, comparison, exclusions, and falsifier first.",
        },
        {
          title: "Keep rejected options",
          body: "Record why alternatives were weaker, costlier, or less discriminating.",
        },
      ],
      paths: [
        {
          id: "hypothesis-hosted",
          mode: "hosted",
          title: "Hosted hypothesis workshop",
          bestFor: "Brainstorming from public checked evidence.",
          approach:
            "Request competing hypotheses, confounders, falsifiers, and cheap tests.",
          tradeoff: "Fast breadth, but plausible wording can obscure weak evidence.",
          dataBoundary: "Checked evidence map, without held-out results.",
          network: "Internet required.",
          cost: "Subscription or model usage.",
          hardware: "Browser only.",
          evidence: "Prompt, candidates, rejected options, and human selection rationale.",
          sources: [official.openaiDeepResearch],
        },
        {
          id: "hypothesis-managed",
          mode: "managed",
          title: "Managed evidence-room review",
          bestFor: "Confidential evidence under team governance.",
          approach:
            "Use an approved model, then review candidates with a domain expert.",
          tradeoff: "Shared control, with scheduling and governance overhead.",
          dataBoundary: "Evidence remains inside the approved environment.",
          network: "Internal services only.",
          cost: "Managed model and expert review time.",
          hardware: "Institutional inference server or approved endpoint.",
          evidence: "Model version, evidence set, review notes, and timestamp.",
          sources: [],
        },
        {
          id: "hypothesis-local",
          mode: "local",
          title: "Offline hypothesis table",
          bestFor: "Sensitive studies or manual scientific workshops.",
          approach:
            "Compare mechanisms, counter-hypotheses, and tests in a local table.",
          tradeoff: "Private and deliberate, but narrower without live search.",
          dataBoundary: "Evidence and ideas remain local.",
          network: "None after optional model installation.",
          cost: "Researcher time and local inference.",
          hardware: "Text editor; RAM or GPU for a local model.",
          evidence: "Timestamped table, prespecification, and reviewer signature.",
          sources: [official.ollama],
        },
      ],
      tryNow: {
        intro: "Turn one checked gap into a test that can fail.",
        items: [
          { id: "hypothesis-try-1", label: "Write three competing hypotheses" },
          { id: "hypothesis-try-2", label: "Give each a clear falsifier" },
          { id: "hypothesis-try-3", label: "Timestamp the selected analysis rule" },
        ],
        evidence: "Save the prespecification and the rejected alternatives.",
      },
    },
    hpc: {
      why:
        "Scaling should preserve a verified command while making resources, concurrency, cost, logs, and submission authority explicit.",
      terms: [
        {
          label: "Job array",
          definition: "Many similar scheduled tasks indexed by one job.",
        },
        {
          label: "Wall time",
          definition: "The maximum elapsed time granted to a job.",
        },
      ],
      tips: [
        {
          title: "Pilot before the array",
          body: "Measure one short job before approving concurrency and retries.",
        },
        {
          title: "Check completion separately",
          body: "A submission ID is not proof that the experiment succeeded.",
        },
      ],
      paths: [
        {
          id: "hpc-hosted",
          mode: "hosted",
          title: "Hosted batch compute",
          bestFor: "Approved public data and temporary accelerator demand.",
          approach:
            "Upload a pinned image and manifest, then apply quotas and budget alerts.",
          tradeoff: "Elastic hardware, with data transfer and spending risk.",
          dataBoundary: "Container, approved data, configuration, logs, and results.",
          network: "Required for transfer and control plane.",
          cost: "Compute, storage, and egress charges.",
          hardware: "Select the smallest measured CPU or GPU class.",
          evidence: "Job specification, image digest, job ID, logs, and final cost.",
          sources: [],
        },
        {
          id: "hpc-managed",
          mode: "managed",
          title: "Institutional Slurm workflow",
          bestFor: "Shared research clusters and governed datasets.",
          approach:
            "Use bounded Slurm resources, an array manifest, and a signed container.",
          tradeoff: "Data stays institutional, but queues and local policy apply.",
          dataBoundary: "Data and outputs remain on cluster storage.",
          network: "Scoped SSH and cluster network.",
          cost: "Allocation, quota, or internal charging.",
          hardware: "Scheduler-selected nodes matching the measured pilot.",
          evidence: "Script, manifest, job ID, sacct record, logs, and image digest.",
          sources: [official.slurmSbatch, official.slurmSacct],
        },
        {
          id: "hpc-local",
          mode: "local",
          title: "Workstation dry run",
          bestFor: "Estimating resources before cluster submission.",
          approach:
            "Run one item locally and measure time, memory, disk, and outputs.",
          tradeoff: "Cheap feedback, but no evidence of cluster-scale behaviour.",
          dataBoundary: "Inputs and outputs remain on the workstation.",
          network: "None after dependencies are available.",
          cost: "Electricity and local occupancy.",
          hardware: "Available workstation CPU or GPU.",
          evidence: "Dry-run manifest, resource measurements, command, and output hashes.",
          sources: [official.snakemakeExecutors],
        },
      ],
      tryNow: {
        intro: "Convert the verified command without submitting it.",
        items: [
          { id: "hpc-try-1", label: "Set CPU, memory, GPU, and wall time" },
          { id: "hpc-try-2", label: "Bound array size and concurrency" },
          { id: "hpc-try-3", label: "Add unique logs and output paths" },
        ],
        evidence: "Save the dry run, manifest, script, and approval record.",
      },
    },
    validation: {
      why:
        "Independent evaluation catches wrong splits, denominators, metrics, leakage, and convenient explanations hidden by a plausible result.",
      terms: [
        {
          label: "Held-out set",
          definition: "Cases not used to choose the model or analysis.",
        },
        {
          label: "Independent evaluator",
          definition: "Separate code that recomputes the claimed result.",
        },
      ],
      tips: [
        {
          title: "Check the population first",
          body: "Confirm split, sample count, exclusions, and denominator before metrics.",
        },
        {
          title: "Separate uncertainty sources",
          body: "Do not mix variation across seeds with variation across patients.",
        },
      ],
      paths: [
        {
          id: "validation-hosted",
          mode: "hosted",
          title: "Separate hosted analysis",
          bestFor: "Public predictions and labels without training credentials.",
          approach:
            "Upload immutable outputs to a fresh workspace and recompute the metric.",
          tradeoff: "Clean separation, but evaluation data leaves the device.",
          dataBoundary: "Predictions, labels, split manifest, and metric definition.",
          network: "Required for upload and analysis.",
          cost: "Notebook or analysis service usage.",
          hardware: "Usually CPU and modest memory.",
          evidence: "Workspace export, input hashes, evaluator code, and report.",
          sources: [],
        },
        {
          id: "validation-managed",
          mode: "managed",
          title: "Institutional independent check",
          bestFor: "Restricted results needing separation of duties.",
          approach:
            "Give a second reviewer read-only outputs and a locked analysis plan.",
          tradeoff: "Stronger oversight, with reviewer and queue time.",
          dataBoundary: "Results remain in approved institutional storage.",
          network: "Internal network only.",
          cost: "Reviewer time and small compute allocation.",
          hardware: "Independent CPU runner unless the metric requires more.",
          evidence: "Access record, code revision, hashes, signed verification report.",
          sources: [],
        },
        {
          id: "validation-local",
          mode: "local",
          title: "Offline independent script",
          bestFor: "Small outputs or sensitive evaluation sets.",
          approach:
            "Use separate code and a fresh process to recompute the primary metric.",
          tradeoff: "Private and inspectable, but human separation may be weaker.",
          dataBoundary: "Labels, predictions, and report remain local.",
          network: "None.",
          cost: "Low local compute and review time.",
          hardware: "Laptop for most tabular predictions.",
          evidence: "Metric code hash, split checksums, discrepancy log, and report.",
          sources: [official.pytorchReproducibility],
        },
      ],
      tryNow: {
        intro: "Recompute one result without importing the training metric.",
        items: [
          { id: "validation-try-1", label: "Confirm split and sample count" },
          { id: "validation-try-2", label: "Recompute the primary metric" },
          { id: "validation-try-3", label: "Inspect the largest failures" },
        ],
        evidence: "Save the independent evaluator and discrepancy report.",
      },
    },
    communicate: {
      why:
        "Traceable figures and prose let readers follow each number back to data, code, exclusions, and uncertainty.",
      terms: [
        {
          label: "Provenance",
          definition: "The recorded origin and processing history of an output.",
        },
        {
          label: "Denominator",
          definition: "The cases or observations underlying a reported quantity.",
        },
      ],
      tips: [
        {
          title: "Plot from machine-readable results",
          body: "Keep raw values, figure code, command, and output checksum together.",
        },
        {
          title: "Link every number",
          body: "Map numerical sentences to a file, table, or verified calculation.",
        },
      ],
      paths: [
        {
          id: "communicate-hosted",
          mode: "hosted",
          title: "Hosted scientific publishing",
          bestFor: "Public results and rapid collaborative review.",
          approach:
            "Upload verified tables and source, then render a reviewable document.",
          tradeoff: "Easy sharing, but source and drafts leave the device.",
          dataBoundary: "Public manuscript source and approved result tables.",
          network: "Internet required.",
          cost: "Hosting, storage, or collaboration plan.",
          hardware: "Browser plus hosted build runner.",
          evidence: "Source revision, build log, rendered file, and output checksum.",
          sources: [official.quartoManuscripts],
        },
        {
          id: "communicate-managed",
          mode: "managed",
          title: "Institutional build pipeline",
          bestFor: "Collaborative drafts containing approved sensitive context.",
          approach:
            "Render Quarto or LaTeX through managed version control and review.",
          tradeoff: "Controlled collaboration, with pipeline maintenance.",
          dataBoundary: "Source and permitted outputs stay institutional.",
          network: "Internal repository and build services.",
          cost: "Institutional storage and runner time.",
          hardware: "Managed CPU runner.",
          evidence: "Commit, environment, build log, figure inputs, and checksum.",
          sources: [official.quartoManuscripts],
        },
        {
          id: "communicate-local",
          mode: "local",
          title: "Offline reproducible manuscript",
          bestFor: "Private drafting and direct inspection of every artefact.",
          approach:
            "Render locally from committed result files and figure scripts.",
          tradeoff: "Maximum inspection, but collaboration needs explicit exchange.",
          dataBoundary: "Draft, data, and build products remain local.",
          network: "None after tools and citations are installed.",
          cost: "Open-source tools and local electricity.",
          hardware: "Laptop with enough memory for the analysis.",
          evidence: "Command, source commit, input hashes, alt text, and final checksum.",
          sources: [official.quartoManuscripts, official.wcag],
        },
      ],
      tryNow: {
        intro: "Rebuild one figure and its numerical sentence.",
        items: [
          { id: "communicate-try-1", label: "Use a machine-readable result file" },
          { id: "communicate-try-2", label: "Check axes, units, and denominator" },
          { id: "communicate-try-3", label: "Add alt text and provenance" },
        ],
        evidence: "Keep the figure script, inputs, build command, and checksum.",
      },
    },
    release: {
      why:
        "A release should preserve the exact approved artefacts, rights, environment, citation, provenance, and AI-use record.",
      terms: [
        {
          label: "Immutable release",
          definition: "A fixed, identifiable snapshot that is not silently replaced.",
        },
        {
          label: "Citation metadata",
          definition: "Structured details telling others how to cite the work.",
        },
      ],
      tips: [
        {
          title: "Test the release candidate",
          body: "Run the smoke test from a fresh clone before archiving.",
        },
        {
          title: "Separate code from data rights",
          body: "State access, licence, and restrictions for every released component.",
        },
      ],
      paths: [
        {
          id: "release-hosted",
          mode: "hosted",
          title: "Public repository and DOI",
          bestFor: "Open code, documentation, and permitted research artefacts.",
          approach:
            "Create an approved tagged release, then archive it through a DOI service.",
          tradeoff: "Discoverable and durable, but publication is hard to retract.",
          dataBoundary: "Everything uploaded becomes public or repository-visible.",
          network: "Required for push, release, and archive.",
          cost: "Usually free within repository and archive quotas.",
          hardware: "Browser and local Git client.",
          evidence: "Tag, commit, DOI, archive receipt, licence, and checksums.",
          sources: [official.zenodoGithub, official.citationCff],
        },
        {
          id: "release-managed",
          mode: "managed",
          title: "Institutional research deposit",
          bestFor: "Restricted data, controlled access, or formal curation.",
          approach:
            "Deposit approved files with access controls and RO-Crate provenance.",
          tradeoff: "Stronger stewardship, with curation and access delays.",
          dataBoundary: "Repository access level follows the approved data plan.",
          network: "Institutional deposit service.",
          cost: "Curation, preservation, and storage allocation.",
          hardware: "Repository service plus standard workstation.",
          evidence: "Deposit receipt, access level, metadata, DOI, and checksums.",
          sources: [official.roCrate],
        },
        {
          id: "release-local",
          mode: "local",
          title: "Offline release candidate",
          bestFor: "Final privacy review before any external publication.",
          approach:
            "Build a self-contained bundle, validate it, and hold for approval.",
          tradeoff: "Fully reviewable, but not discoverable or independently preserved.",
          dataBoundary: "The candidate remains on approved local storage.",
          network: "None.",
          cost: "Local storage and review time.",
          hardware: "Disk space for source, environment, and outputs.",
          evidence: "Bundle checksum, fresh-clone test, CFF file, and approval record.",
          sources: [official.citationCff, official.roCrate],
        },
      ],
      tryNow: {
        intro: "Audit the exact bundle that another researcher will receive.",
        items: [
          { id: "release-try-1", label: "Test from a fresh clone" },
          { id: "release-try-2", label: "Check licences and data access" },
          { id: "release-try-3", label: "Add citation and AI-use records" },
        ],
        evidence: "Save the approved bundle checksum and archive receipt.",
      },
    },
  },
};
