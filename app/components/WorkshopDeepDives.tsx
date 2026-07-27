"use client";

import { useState } from "react";
import type { WorkshopSlug } from "@/lib/types";
import { copyText } from "@/lib/storage";
import { Check, Copy, Download, ExternalLink, FileText } from "./Icons";
import {
  CONFERENCE_CHECK_ITEMS,
  ConferenceCaseStudy,
} from "./ConferenceCaseStudy";

export const DEEP_DIVE_CHECK_ITEMS: Record<
  WorkshopSlug,
  ReadonlyArray<{ id: string; label: string }>
> = {
  "agentic-research": [
    {
      id: "open-primary-paper",
      label: "Open the primary paper behind the system you cite.",
    },
    {
      id: "mark-human-input",
      label: "Record the human starting material and selection steps.",
    },
    {
      id: "separate-evaluators",
      label: "Separate self, model, expert, wet-lab, and peer-review evidence.",
    },
    {
      id: "record-claim-boundary",
      label: "Write one sentence saying what the result does not show.",
    },
    {
      id: "resolve-paper-review-ledger",
      label:
        "Resolve, reject, or defer every paper-review issue with a recorded reason.",
    },
  ],
  "interactive-paper": [
    {
      id: "define-inference-contract",
      label: "Freeze inputs, outputs, model identity, and failure rules.",
    },
    {
      id: "run-container-locally",
      label: "Build and run with a synthetic fixture on localhost.",
    },
    {
      id: "verify-health-and-prediction",
      label: "Check health, metadata, prediction parity, and bad inputs.",
    },
    {
      id: "record-image-provenance",
      label: "Record image digest, base image, packages, and model hash.",
    },
    {
      id: "test-target-hardware",
      label: "Measure the native target, including memory and temperature.",
    },
    {
      id: "protect-remote-access",
      label: "Add identity, TLS, limits, logs, updates, and an owner.",
    },
  ],
  "annotation-tools": [
    {
      id: "observe-manual-gesture",
      label: "Observe the real manual workflow before asking AI to build.",
    },
    {
      id: "map-shortcuts",
      label: "Map frequent expert actions to memorable, documented controls.",
    },
    {
      id: "test-save-and-recovery",
      label: "Interrupt save, reload, undo, and export with synthetic data.",
    },
    {
      id: "version-tool-and-protocol",
      label: "Version the tool, protocol, labels, and dataset separately.",
    },
  ],
  "ai-healthcare-conference": CONFERENCE_CHECK_ITEMS,
};

export const DEEP_DIVE_CHECK_IDS: Record<
  WorkshopSlug,
  readonly string[]
> = {
  "agentic-research": DEEP_DIVE_CHECK_ITEMS["agentic-research"].map(
    (item) => item.id,
  ),
  "interactive-paper": DEEP_DIVE_CHECK_ITEMS["interactive-paper"].map(
    (item) => item.id,
  ),
  "annotation-tools": DEEP_DIVE_CHECK_ITEMS["annotation-tools"].map(
    (item) => item.id,
  ),
  "ai-healthcare-conference": DEEP_DIVE_CHECK_ITEMS[
    "ai-healthcare-conference"
  ].map((item) => item.id),
};

function DeepDiveChecklist({
  checked,
  items,
  onToggle,
}: {
  checked: string[];
  items: ReadonlyArray<{ id: string; label: string }>;
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="deep-dive-checklist">
      <legend>Make this useful for your project</legend>
      {items.map((item) => (
        <label key={item.id}>
          <input
            checked={checked.includes(item.id)}
            onChange={() => onToggle(item.id)}
            type="checkbox"
          />
          <span>
            <i>{checked.includes(item.id) ? <Check size={15} /> : null}</i>
            {item.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function SourceLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
      <ExternalLink size={14} />
    </a>
  );
}

const paperReviewLifecycle = [
  {
    title: "Question and contribution",
    body:
      "Challenge the problem, contribution, novelty, and audience before one story takes hold.",
  },
  {
    title: "Study design",
    body:
      "Review comparators, endpoints, confounders, sample size, and the cheapest falsifier.",
  },
  {
    title: "Analysis lock",
    body:
      "Check splits, exclusions, missing data, metrics, uncertainty, and stopping rules before held-out outcomes.",
  },
  {
    title: "Results and interpretation",
    body:
      "Look for leakage, denominator errors, alternative explanations, and claims that exceed the evidence.",
  },
  {
    title: "Complete manuscript",
    body:
      "Review the claim-to-evidence chain across text, figures, tables, supplement, and reproducibility material.",
  },
  {
    title: "Submission rehearsal",
    body:
      "Use the venue rubric, reporting checklist, and AI policy. Resolve the ledger.",
  },
] as const;

const criticalPaperReviewPrompt = `Act as a demanding but constructive scientific reviewer for [target venue or journal].

Use the strongest permitted model and reasoning effort. Review [revision], [supplement], [venue criteria], [checklist], and [approved evidence]. List what you inspected. Return NOT FOUND for absent evidence.

Do not rewrite or score it. Review:
1. design, data, comparators, statistics, leakage, and uncertainty;
2. claim-to-evidence consistency;
3. novelty, related work, alternatives, and overclaiming;
4. reproducibility, ethics, reporting, limitations, and clarity.

For each concern return ID, location, category, severity, confidence, manuscript evidence, consequence, smallest resolving check, and closure evidence. Verify literature by DOI or stable URL. Label post-hoc work exploratory.

End with the three priorities, questions for a domain or statistical expert, and "What this review may have misunderstood". Audit each concern as supported, ambiguous, or probably false. Do not invent evidence or treat model agreement as independent validation.`;

function AgenticLandscape({
  checked,
  onToggle,
}: {
  checked: string[];
  onToggle: (id: string) => void;
}) {
  const [reviewPromptCopied, setReviewPromptCopied] = useState(false);
  const systems = [
    {
      name: "Google Co-Scientist",
      start: "A scientist supplies a goal, constraints, and optional ideas.",
      loop: "Generate, reflect, debate, rank, cluster, and evolve hypotheses.",
      executes:
        "Search and scientific reasoning. Experts perform and prioritise the reported wet-lab validation.",
      human:
        "Refines the goal, reviews candidates, and chooses what should be tested.",
      evidence:
        "Small expert studies, system-generated Elo signals, and targeted biomedical validation.",
      boundary:
        "It is not an autonomous wet lab, and the complete source code is not public.",
      href: "https://doi.org/10.1038/s41586-026-10644-y",
    },
    {
      name: "The AI Scientist v1",
      start:
        "A human supplies a topic-specific code template and a computational setting.",
      loop:
        "Generate an idea, edit code, run experiments, plot, write, and run an automated review.",
      executes: "Small machine-learning experiments inside the supplied scaffold.",
      human:
        "Creates the starting template, defines the domain, and controls any release.",
      evidence:
        "The 2024 acceptance-threshold claims came from an automated reviewer, not human peer review.",
      boundary:
        "The result does not establish reliable autonomous research outside its constrained settings.",
      href: "https://arxiv.org/abs/2408.06292",
    },
    {
      name: "The AI Scientist v2 and Nature study",
      start:
        "A broad computational topic replaces the human-authored experiment template.",
      loop:
        "An experiment manager branches through code, tuning, replications, ablations, figures, and writing.",
      executes:
        "Computational machine-learning research, including code and manuscript production.",
      human:
        "Selects the portfolio, audits outputs, controls submission, and sets the withdrawal protocol.",
      evidence:
        "One of three papers crossed a workshop review threshold. It was withdrawn before meta-review under the agreed protocol.",
      boundary:
        "The authors judged that none met the main ICLR conference standard.",
      href: "https://doi.org/10.1038/s41586-026-10265-5",
    },
    {
      name: "Medical AI Scientist",
      start:
        "A task and dataset, with target papers in reproduction or innovation modes.",
      loop:
        "Medical and technical retrieval, proposal, Docker execution, analysis, ethics-reporting checks, and writing.",
      executes:
        "Computational medical-AI experiments on predefined data and tasks.",
      human:
        "Supplies data and tasks and evaluates outputs. Continuous clinician approval is not documented for every run.",
      evidence:
        "A 171-case benchmark and expert manuscript ratings. Execution success is not scientific or clinical validity.",
      boundary:
        "It does not conduct clinical care or prospective trials, and public reproduction code is not yet available.",
      href: "https://arxiv.org/abs/2603.28589",
    },
  ];

  return (
    <section
      aria-labelledby="agentic-landscape-title"
      className="deep-dive deep-dive-agentic"
    >
      <div className="deep-dive-heading">
        <p>Evidence landscape</p>
        <h2 id="agentic-landscape-title">What makes the workflow agentic?</h2>
        <span>
          It is not simply a longer chat. An agent works through a bounded loop:
          it plans, retrieves evidence, uses tools, observes results, and revises.
          A research workflow adds human gates wherever a choice could change the
          scientific claim, data boundary, spend, or public record.
        </span>
      </div>

      <ol aria-label="Human-controlled agentic research loop" className="agent-loop">
        <li>
          <span>01</span>
          <strong>Contract</strong>
          <small>Human sets the question and permissions</small>
        </li>
        <li>
          <span>02</span>
          <strong>Retrieve</strong>
          <small>Agent maps sources and unknowns</small>
        </li>
        <li>
          <span>03</span>
          <strong>Propose</strong>
          <small>Agent creates competing explanations</small>
        </li>
        <li>
          <span>04</span>
          <strong>Execute</strong>
          <small>Tools run inside a reviewed boundary</small>
        </li>
        <li>
          <span>05</span>
          <strong>Verify</strong>
          <small>People inspect sources, code, and statistics</small>
        </li>
        <li>
          <span>06</span>
          <strong>Decide</strong>
          <small>Human chooses revise, stop, or release</small>
        </li>
      </ol>

      <section
        aria-labelledby="paper-review-lifecycle-title"
        className="paper-review-lifecycle"
      >
        <header className="paper-review-heading">
          <div>
            <p>AI review throughout the paper lifecycle</p>
            <h3 id="paper-review-lifecycle-title">
              Find weak decisions while they can still be changed
            </h3>
          </div>
          <p>
            Review after major decisions, while a weak question, missing
            comparator, or overclaim can still change. The researcher checks
            every concern and owns every decision.
          </p>
        </header>

        <ol
          aria-label="Six paper-review checkpoints across the research lifecycle"
          className="paper-review-checkpoints"
        >
          {paperReviewLifecycle.map((checkpoint, index) => (
            <li key={checkpoint.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4>{checkpoint.title}</h4>
                <p>{checkpoint.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="paper-review-route-heading">
          <h4>Choose a review route your material permits</h4>
          <p>
            Both can miss issues. Keep each prompt, response, and human decision.
          </p>
        </div>

        <div className="paper-review-routes">
          <article>
            <span>Dedicated service</span>
            <h4>
              <SourceLink href="https://paperreview.ai/">
                Stanford Agentic Reviewer at PaperReview.ai
              </SourceLink>
            </h4>
            <p>
              Yixing Jiang and Andrew Ng&apos;s reviewer uses related arXiv work.
              It reviews the first 15 pages of an English PDF up to 10 MB,
              favours arXiv-rich fields, and may be wrong.
            </p>
            <SourceLink href="https://paperreview.ai/tech-overview">
              Read how the reviewer works
            </SourceLink>
          </article>
          <article>
            <span>Configurable alternative</span>
            <h4>A powerful permitted model with high reasoning effort</h4>
            <p>
              Supply the paper, supplement, rubric, checklist, and permitted
              evidence. Use the strongest suitable model and reasoning effort,
              then rerun after revision.
            </p>
            <small>
              Record provider, model, dated version, reasoning setting, prompt,
              inputs, and manuscript revision.
            </small>
          </article>
        </div>

        <aside className="paper-review-caution">
          <strong>Permission comes before upload</strong>
          <p>
            Check confidentiality, approvals, service terms, and venue policy.
            Never upload another researcher&apos;s confidential submission. Use
            a public draft or an approved managed or local environment.
          </p>
        </aside>

        <div className="paper-review-ledger">
          <div>
            <p>Durable review record</p>
            <h4>Resolve the issue ledger, not just the prose</h4>
            <span>
              Authors verify, accept, reject, defer, or leave each AI concern
              unresolved with a reason.
            </span>
          </div>
          <ul aria-label="Fields to keep for every paper-review issue">
            <li>Issue ID, round, date, model, and manuscript revision</li>
            <li>Page, section, figure, table, equation, or appendix</li>
            <li>Category, severity, confidence, and decision deadline</li>
            <li>Concern, evidence, and what could change the judgement</li>
            <li>Required check, analysis, experiment, clarification, or edit</li>
            <li>Owner, author decision, reason, status, and closure evidence</li>
          </ul>
        </div>

        <div className="container-prompt paper-review-prompt">
          <div>
            <span>Prompt for a critical paper review</span>
            <button
              onClick={async () => {
                await copyText(criticalPaperReviewPrompt);
                setReviewPromptCopied(true);
                window.setTimeout(() => setReviewPromptCopied(false), 1600);
              }}
              type="button"
            >
              {reviewPromptCopied ? <Check size={15} /> : <Copy size={15} />}
              {reviewPromptCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>{criticalPaperReviewPrompt}</pre>
        </div>
      </section>

      <div className="source-correction">
        <strong>A useful source correction</strong>
        <p>
          arXiv:2408.06292 is the template-based AI Scientist v1 paper. It is
          not the direct longer preprint of the 2026 Nature article. The
          consolidated Nature preprint is{" "}
          <SourceLink href="https://arxiv.org/abs/2606.15497">
            arXiv:2606.15497
          </SourceLink>
          , while{" "}
          <SourceLink href="https://arxiv.org/abs/2504.08066">
            arXiv:2504.08066
          </SourceLink>{" "}
          describes v2.
        </p>
      </div>

      <div className="system-comparison" role="region" tabIndex={0}>
        <table>
          <caption>
            The systems share a loop, but automate different parts of research.
            Scroll horizontally to read all six columns.
          </caption>
          <thead>
            <tr>
              <th scope="col">System</th>
              <th scope="col">Starting contract</th>
              <th scope="col">Agent loop</th>
              <th scope="col">What runs</th>
              <th scope="col">Human anchor</th>
              <th scope="col">Evidence and boundary</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system) => (
              <tr key={system.name}>
                <th scope="row">
                  <SourceLink href={system.href}>{system.name}</SourceLink>
                </th>
                <td>{system.start}</td>
                <td>{system.loop}</td>
                <td>{system.executes}</td>
                <td>{system.human}</td>
                <td>
                  <strong>{system.evidence}</strong>
                  <span>{system.boundary}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="deep-dive-split">
        <article>
          <h3>What this tutorial borrows</h3>
          <ul>
            <li>Separate generation, criticism, ranking, and execution roles.</li>
            <li>Use an experiment journal as memory rather than relying on chat.</li>
            <li>Preserve competing hypotheses and negative results.</li>
            <li>Scale only after a small run and an explicit stopping rule.</li>
          </ul>
        </article>
        <article>
          <h3>What this tutorial deliberately changes</h3>
          <ul>
            <li>Self-critique is not treated as independent verification.</li>
            <li>More search produces more candidates, not more truth.</li>
            <li>Clinical governance and physical validation stay outside the agent.</li>
            <li>The researcher signs every claim-changing decision and release.</li>
          </ul>
        </article>
      </div>

      <div className="deep-dive-footer">
        <DeepDiveChecklist
          checked={checked}
          items={DEEP_DIVE_CHECK_ITEMS["agentic-research"]}
          onToggle={onToggle}
        />
        <div className="deep-dive-download">
          <FileText size={22} />
          <div>
            <strong>Original reading-note appendix</strong>
            <p>
              Source versions, human roles, evidence ledgers, limitations, code
              status, and media rights for all four systems.
            </p>
            <a
              download
              href="/reading-notes/agentic-science-systems-2026-07-26.md"
            >
              <Download size={15} />
              Download Markdown notes
            </a>
          </div>
        </div>
      </div>
      <p className="media-boundary">
        The workflow and comparison above are original teaching graphics. They
        link to the papers rather than copying their figures. The appendix
        records which papers permit figure reuse and where permission is still
        required.
      </p>
    </section>
  );
}

function AnnotationOriginStory({
  checked,
  onToggle,
}: {
  checked: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section
      aria-labelledby="annotation-origin-title"
      className="deep-dive deep-dive-annotation"
    >
      <div className="deep-dive-heading">
        <p>First-hand build story</p>
        <h2 id="annotation-origin-title">From a fast beta to the LASK workflow</h2>
        <span>
          This section separates the public record from Omar&apos;s first-hand
          account. That distinction lets the personal lesson remain useful
          without turning memory into independently verified evidence.
        </span>
      </div>

      <div className="origin-story-grid">
        <article>
          <span>Omar&apos;s build note</span>
          <h3>The Hamlyn question</h3>
          <p>
            At the Hamlyn Symposium, I set myself a practical question: could I
            build an interface that let me label long stretches of surgical
            video at the speed of keyboard muscle memory? The beta was
            deliberately small. I marked ranges on a timeline, assigned labels
            with memorable keys, and exported clip-level and frame-level
            records. It was quick enough to make a much larger project feel
            realistic.
          </p>
          <small>
            Author account. The public repository does not independently record
            the Hamlyn origin or a measured annotation speed.
          </small>
        </article>
        <article>
          <span>Public software record</span>
          <h3>The tool grew around repeated actions</h3>
          <p>
            The first public commit on 5 March 2026 records a configurable Flask
            tool with range labelling, a timeline, keyboard shortcuts, and
            JSON/CSV export. The later surgical-annotator added masks, keypoints,
            shaft lines, copy-prior, auto-advance, batch triage, and a fuller
            shortcut map while remaining locally usable.
          </p>
          <SourceLink href="https://github.com/omariosc/frame-annotator/commit/deb7d43a2b6ff93ac1ac5a33c2f00028d7833823">
            Open the beta commit
          </SourceLink>
          <SourceLink href="https://github.com/omariosc/frame-annotator/commit/461615a71beabeaa0ed67120a883cf4ce900d7b1">
            Open the larger-tool integration
          </SourceLink>
        </article>
        <article>
          <span>Public dataset record</span>
          <h3>LASK makes the scale concrete</h3>
          <p>
            LASK v1.0 contains 37 trials. Kinematics are dense across about
            91,000 frames. The visual ground truth is different: manual
            keyframes, roughly every 100th frame and at least three per trial,
            contain two-tool masks, keypoints, and visibility labels. A good
            annotation tool reduces friction, but it does not remove the need
            for a protocol and human review.
          </p>
          <SourceLink href="https://doi.org/10.5281/zenodo.20752651">
            Open LASK v1.0 on Zenodo
          </SourceLink>
          <small>Dataset record and files: CC BY 4.0.</small>
        </article>
      </div>

      <div className="ai-role-ledger">
        <div>
          <p>What AI helped with</p>
          <ul>
            <li>Turning interaction requirements into reviewable code.</li>
            <li>Iterating shortcuts, batch actions, exports, tests, and packaging.</li>
            <li>Finding edge cases and drafting documentation for human review.</li>
          </ul>
        </div>
        <div>
          <p>What remained human-owned</p>
          <ul>
            <li>The label protocol, uncertainty rules, and meaningful errors.</li>
            <li>The commands that matched Omar&apos;s hands and working rhythm.</li>
            <li>Quality checks, corrections, and the released manual labels.</li>
          </ul>
        </div>
        <p>
          Public commit trailers record AI coding assistance. The deposited LASK
          record describes its visual annotations as manual, so this tutorial
          does not claim that AI generated the released ground truth.
        </p>
      </div>

      <div className="deep-dive-footer">
        <DeepDiveChecklist
          checked={checked}
          items={DEEP_DIVE_CHECK_ITEMS["annotation-tools"]}
          onToggle={onToggle}
        />
        <div className="deep-dive-download">
          <FileText size={22} />
          <div>
            <strong>Origin and evidence note</strong>
            <p>
              A citable record of the public commits, LASK facts, author account,
              AI contribution boundary, and screenshot rights decision.
            </p>
            <a
              download
              href="/audits/annotation-tool-origin-story-2026-07-26.md"
            >
              <Download size={15} />
              Download the Markdown record
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const containerPrompt = `Inspect the pinned model repository and model card in read-only mode. Do not run code yet.

Create a minimal inference-service plan with:
1. a typed request and response contract;
2. /healthz, /metadata, and /predict endpoints;
3. model version, source, licence, input units, class map, and file checksum;
4. deterministic CPU tests using a synthetic fixture;
5. a Dockerfile that runs as a non-root user;
6. a Compose service bound to 127.0.0.1 with a read-only filesystem, dropped capabilities, resource limits, and a health check;
7. separate linux/amd64 and linux/arm64 build verification;
8. a Jetson-specific plan only if the exact JetPack, L4T, CUDA, and TensorRT compatibility is known;
9. an authenticated TLS reverse proxy, private VPN, or access-controlled outbound tunnel before any remote use;
10. a rollback record and an explicit list of tests that still require a person.

Do not expose the Docker daemon, add credentials to the image, use patient data, open a router port, or claim the container validates the model. Show each file as a reviewable diff and stop before building or publishing.`;

function ContainerLab({
  checked,
  onToggle,
}: {
  checked: string[];
  onToggle: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <section
      aria-labelledby="container-lab-title"
      className="deep-dive deep-dive-container"
    >
      <div className="deep-dive-heading">
        <p>Bonus lab</p>
        <h2 id="container-lab-title">Turn a model into a portable service</h2>
        <span>
          A container packages code and dependencies. It does not validate the
          model, make an API private, or guarantee that an x86 image will run on
          ARM hardware. This lab keeps those concerns separate.
        </span>
      </div>

      <ol className="container-lab-steps">
        <li>
          <span>01</span>
          <div>
            <h3>Freeze the inference contract</h3>
            <p>
              Define shapes, units, missing values, preprocessing, class
              meanings, model hash, licence, and failure responses before
              writing the server.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <h3>Wrap one deterministic prediction</h3>
            <p>
              Keep the API thin. The supplied example uses a tiny transparent
              linear model and synthetic inputs so the service mechanics can be
              tested without implying research performance.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <h3>Build a least-privilege image</h3>
            <p>
              Run as a non-root user, add a health check, keep secrets outside
              the image, and use a read-only runtime with resource and process
              limits.
            </p>
          </div>
        </li>
        <li>
          <span>04</span>
          <div>
            <h3>Test locally before publishing</h3>
            <p>
              Bind the host port to 127.0.0.1, call health, metadata, valid,
              malformed, and oversized requests, then compare predictions with
              the non-container baseline.
            </p>
          </div>
        </li>
        <li>
          <span>05</span>
          <div>
            <h3>Build for the actual processor</h3>
            <p>
              Publish separate linux/amd64 and linux/arm64 variants. Test each
              one natively where possible. Emulation proves a build path, not
              target speed or hardware compatibility.
            </p>
          </div>
        </li>
        <li>
          <span>06</span>
          <div>
            <h3>Add remote access as a separate layer</h3>
            <p>
              Keep the service private until authentication, TLS, request
              limits, logging, updates, and an owner are in place. Prefer a VPN
              or access-controlled outbound tunnel to raw router port
              forwarding.
            </p>
          </div>
        </li>
      </ol>

      <div className="deployment-matrix" role="region" tabIndex={0}>
        <table>
          <caption>What changes across common hosts</caption>
          <thead>
            <tr>
              <th scope="col">Target</th>
              <th scope="col">Image path</th>
              <th scope="col">Good fit</th>
              <th scope="col">Check before claiming support</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Personal PC or server</th>
              <td>linux/amd64 or linux/arm64</td>
              <td>CPU baseline, private demo, or modest local model</td>
              <td>
                Native prediction parity, memory, restart, updates, TLS, and
                authenticated access
              </td>
            </tr>
            <tr>
              <th scope="row">Raspberry Pi 3, 4, or 5</th>
              <td>64-bit Raspberry Pi OS plus linux/arm64</td>
              <td>Small CPU or accelerator-backed models</td>
              <td>
                Wheel availability, RAM, swap, temperature, latency, and power
              </td>
            </tr>
            <tr>
              <th scope="row">NVIDIA Jetson</th>
              <td>JetPack and L4T-compatible ARM64 image plus NVIDIA runtime</td>
              <td>CUDA or TensorRT inference at the edge</td>
              <td>
                Exact JetPack, driver, CUDA, TensorRT, base image, and device
                runtime compatibility
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="container-files">
        <div>
          <h3>Runnable teaching pack</h3>
          <p>
            The sample is deliberately small, inspectable, and synthetic. Adapt
            the contract and model loader only after the real model card,
            licence, and test fixture are pinned.
          </p>
          <ul>
            <li>
              <a href="/worked-examples/model-container-service/README.md">
                README and test route
              </a>
            </li>
            <li>
              <a href="/worked-examples/model-container-service/app/main.py">
                FastAPI service
              </a>
            </li>
            <li>
              <a href="/worked-examples/model-container-service/Dockerfile">
                Dockerfile
              </a>
            </li>
            <li>
              <a href="/worked-examples/model-container-service/compose.yaml">
                Hardened local Compose profile
              </a>
            </li>
            <li>
              <a
                download
                href="/worked-examples/model-container-service.zip"
              >
                Download the complete ZIP
              </a>
            </li>
            <li>
              <a href="/worked-examples/model-container-service.zip.sha256">
                Verify the ZIP checksum
              </a>
            </li>
          </ul>
        </div>
        <div className="container-prompt">
          <div>
            <span>Prompt for a coding agent</span>
            <button
              onClick={async () => {
                await copyText(containerPrompt);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }}
              type="button"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre>{containerPrompt}</pre>
        </div>
      </div>

      <div className="remote-warning">
        <strong>Port forwarding is not the deployment plan</strong>
        <p>
          A router rule only makes a port reachable. It does not add identity,
          TLS, rate limits, safe logs, or patching. Never expose the Docker
          daemon. For a private personal service, use an authenticated VPN or
          access-controlled tunnel. For a public API, place a maintained
          gateway in front and threat-model misuse, model extraction, input
          abuse, and sensitive logs.
        </p>
        <div>
          <SourceLink href="https://docs.docker.com/engine/security/">
            Docker Engine security
          </SourceLink>
          <SourceLink href="https://developers.cloudflare.com/tunnel/">
            Cloudflare Tunnel
          </SourceLink>
          <SourceLink href="https://tailscale.com/docs/reference/tailscale-cli/serve">
            Tailscale Serve
          </SourceLink>
        </div>
      </div>

      <div className="deep-dive-footer">
        <DeepDiveChecklist
          checked={checked}
          items={DEEP_DIVE_CHECK_ITEMS["interactive-paper"]}
          onToggle={onToggle}
        />
        <div className="deep-dive-download">
          <FileText size={22} />
          <div>
            <strong>Deployment decision record</strong>
            <p>
              Use the included template to record the target, image, access
              boundary, tests, model limitations, reviewer, and rollback.
            </p>
            <a
              download
              href="/worked-examples/model-container-service/deployment-record.md"
            >
              <Download size={15} />
              Download the template
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkshopDeepDive({
  checked,
  onToggle,
  slug,
}: {
  checked: string[];
  onToggle: (id: string) => void;
  slug: WorkshopSlug;
}) {
  if (slug === "agentic-research") {
    return <AgenticLandscape checked={checked} onToggle={onToggle} />;
  }
  if (slug === "annotation-tools") {
    return <AnnotationOriginStory checked={checked} onToggle={onToggle} />;
  }
  if (slug === "ai-healthcare-conference") {
    return <ConferenceCaseStudy checked={checked} onToggle={onToggle} />;
  }
  return <ContainerLab checked={checked} onToggle={onToggle} />;
}
