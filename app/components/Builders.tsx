"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { copyText, downloadText, STORAGE_PREFIX } from "@/lib/storage";
import { Check, Copy, Download, Refresh } from "./Icons";

type CopyState = "idle" | "copied";

function BuilderActions({
  copyState,
  filename,
  output,
  onCopy,
}: {
  copyState: CopyState;
  filename: string;
  output: string;
  onCopy: () => void;
}) {
  return (
    <div className="builder-actions">
      <button className="button button-secondary" onClick={onCopy} type="button">
        {copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}
        {copyState === "copied" ? "Copied" : "Copy plan"}
      </button>
      <button
        className="button button-primary"
        onClick={() => downloadText(filename, output)}
        type="button"
      >
        <Download size={17} />
        Download Markdown
      </button>
    </div>
  );
}

function usePersistentForm<T>(key: string, defaults: T) {
  const [value, setValue] = useState(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:builder:${key}`);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<T>;
        queueMicrotask(() => setValue({ ...defaults, ...stored }));
      }
    } catch {
      // The form remains usable if browser storage is unavailable.
    }
    queueMicrotask(() => setLoaded(true));
  }, [defaults, key]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(
      `${STORAGE_PREFIX}:builder:${key}`,
      JSON.stringify(value),
    );
  }, [key, loaded, value]);

  return [value, setValue] as const;
}

const agenticDefaults = {
  project: "Reproduce one surgical video baseline",
  question:
    "Can the reported phase-recognition result be reproduced on the stated split?",
  owner: "Lead researcher",
  data: "public",
  compute: "hpc",
  target:
    "Paper, repository commit, target table, dataset version, metric, and tolerance",
  approval:
    "External upload, package install, HPC submission, Git push, and public release",
};

export function AgenticPlanBuilder() {
  const [form, setForm] = usePersistentForm("agentic", agenticDefaults);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const output = useMemo(
    () => `# Research contract: ${form.project}

## Scientific target

- **Question:** ${form.question}
- **Accountable researcher:** ${form.owner}
- **Reproduction target:** ${form.target}
- **Data classification:** ${form.data}
- **Compute path:** ${form.compute}

## Agent roles

- Research agent: map sources and return a claim-evidence table.
- Paper assistant: answer only from supplied papers and expose uncertainty.
- Coding agent: inspect first, propose diffs, run the smallest verified test.
- Compute agent: prepare and monitor bounded jobs after explicit approval.
- Writing assistant: expand verified human notes and flag unsupported claims.

## Approval-required actions

${form.approval
  .split(",")
  .map((item) => `- [ ] ${item.trim()}`)
  .join("\n")}

## Evidence gates

- [ ] Central references opened and checked against primary sources
- [ ] Paper claim linked to a section, figure or table, split, and metric
- [ ] Repository pinned to a commit and licence reviewed
- [ ] Clean-environment smoke test passes
- [ ] Scheduled job limits and paths approved
- [ ] Hypothesis and primary analysis recorded before held-out testing
- [ ] Metric recalculated independently
- [ ] Figure regenerated from raw outputs
- [ ] Citations, privacy, licence, and AI-use statement reviewed

## Stop conditions

Stop if required data rights are unclear, the requested action exceeds the approved scope, a secret or identifiable record is exposed, the test split has influenced selection, or the result cannot be traced to an input and command.

## AI-use record

Record the tool, dated version, task, data shared, files or commands affected, human checks, and known limitations. Never record credentials or patient identifiers.`,
    [form],
  );

  async function handleCopy() {
    await copyText(output);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <BuilderFrame
      description="Turn a broad idea into a bounded research contract. This generator runs in your browser and sends nothing to a server."
      eyebrow="Plan builder"
      title="Write the contract before the first prompt"
    >
      <div className="builder-grid">
        <form className="builder-form" onSubmit={(event) => event.preventDefault()}>
          <Field
            label="Project"
            onChange={(value) => setForm({ ...form, project: value })}
            value={form.project}
          />
          <TextArea
            label="Research question"
            onChange={(value) => setForm({ ...form, question: value })}
            value={form.question}
          />
          <Field
            label="Accountable researcher"
            onChange={(value) => setForm({ ...form, owner: value })}
            value={form.owner}
          />
          <div className="field-row">
            <Select
              label="Data"
              onChange={(value) => setForm({ ...form, data: value })}
              options={[
                ["public", "Public"],
                ["approved de-identified", "Approved de-identified"],
                ["identifiable or confidential", "Identifiable or confidential"],
                ["unknown", "Unknown"],
              ]}
              value={form.data}
            />
            <Select
              label="Compute"
              onChange={(value) => setForm({ ...form, compute: value })}
              options={[
                ["laptop", "Laptop"],
                ["workstation", "Workstation"],
                ["hpc", "HPC"],
                ["cloud", "Cloud"],
              ]}
              value={form.compute}
            />
          </div>
          <TextArea
            label="Exact reproduction target"
            onChange={(value) => setForm({ ...form, target: value })}
            value={form.target}
          />
          <TextArea
            label="Actions that need approval"
            onChange={(value) => setForm({ ...form, approval: value })}
            value={form.approval}
          />
        </form>
        <div className="builder-output">
          <div className="output-header">
            <span>research_contract.md</span>
            <span>local draft</span>
          </div>
          <pre>{output}</pre>
          <BuilderActions
            copyState={copyState}
            filename="research_contract.md"
            onCopy={handleCopy}
            output={output}
          />
        </div>
      </div>
    </BuilderFrame>
  );
}

const paperDefaults = {
  paper: "A clear title for the research paper",
  paperUrl: "https://doi.org/...",
  repoUrl: "https://github.com/owner/repository",
  audience: "A new Masters or PhD student in the field",
  goal: "Explain one result and let readers verify how it was produced",
  rights: "Open licence confirmed for the paper and reused media",
  demo: "Run a small, deterministic example from the pinned repository",
};

export function PaperSiteBuilder() {
  const [form, setForm] = usePersistentForm("paper", paperDefaults);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const output = useMemo(
    () => `# Research website brief

## Project

- **Paper:** ${form.paper}
- **Paper source:** ${form.paperUrl}
- **Repository:** ${form.repoUrl}
- **Audience:** ${form.audience}
- **Reader outcome:** ${form.goal}

## Rights and provenance

- ${form.rights}
- [ ] Record the paper licence and repository licence separately
- [ ] Preserve every reused figure and table caption
- [ ] Link each media item to its original page, figure, or table
- [ ] Label generated explanations and redrawn diagrams

## Content map

1. Plain-language question and contribution
2. Method walkthrough tied to the paper
3. Original figures and tables with intact captions
4. Claim-evidence links to paper, code, data, and executed result
5. Reproducible demo: ${form.demo}
6. Limitations, failure cases, and unresolved questions
7. Citation, licence, accessibility, and AI-use information

## Build contract

- [ ] Pin paper version and repository commit
- [ ] Create a source manifest before generating copy
- [ ] Keep headings, controls, equations, and captions as semantic HTML
- [ ] Add useful alt text without inventing evidence
- [ ] Run the documented example in a clean environment
- [ ] Test keyboard navigation, mobile layout, colour contrast, and links
- [ ] Use privacy-preserving analytics or no analytics
- [ ] Preview locally before deployment
- [ ] Review every claim and citation before publishing

## Video shot list

1. Start with the paper and repository
2. Build the source manifest
3. Generate the first structured page
4. Trace one claim to a figure, code line, and run
5. Catch one extraction or citation error
6. Test locally and on mobile
7. Deploy the reviewed version`,
    [form],
  );

  async function handleCopy() {
    await copyText(output);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <BuilderFrame
      description="Describe the paper, repository, audience, and rights. The browser turns those decisions into a build brief and recording plan."
      eyebrow="Website brief"
      title="Give the agent a source map, not just a PDF"
    >
      <div className="builder-grid">
        <form className="builder-form" onSubmit={(event) => event.preventDefault()}>
          <Field
            label="Paper title"
            onChange={(value) => setForm({ ...form, paper: value })}
            value={form.paper}
          />
          <div className="field-row">
            <Field
              label="Paper URL or DOI"
              onChange={(value) => setForm({ ...form, paperUrl: value })}
              value={form.paperUrl}
            />
            <Field
              label="Repository URL"
              onChange={(value) => setForm({ ...form, repoUrl: value })}
              value={form.repoUrl}
            />
          </div>
          <TextArea
            label="Reader"
            onChange={(value) => setForm({ ...form, audience: value })}
            value={form.audience}
          />
          <TextArea
            label="What should the reader be able to do?"
            onChange={(value) => setForm({ ...form, goal: value })}
            value={form.goal}
          />
          <TextArea
            label="Rights status"
            onChange={(value) => setForm({ ...form, rights: value })}
            value={form.rights}
          />
          <TextArea
            label="Small reproducible demo"
            onChange={(value) => setForm({ ...form, demo: value })}
            value={form.demo}
          />
        </form>
        <div className="paper-builder-side">
          <PaperPreview form={form} />
          <div className="builder-output builder-output-compact">
            <div className="output-header">
              <span>website_brief.md</span>
              <span>local draft</span>
            </div>
            <pre>{output}</pre>
            <BuilderActions
              copyState={copyState}
              filename="website_brief.md"
              onCopy={handleCopy}
              output={output}
            />
          </div>
        </div>
      </div>
    </BuilderFrame>
  );
}

function PaperPreview({ form }: { form: typeof paperDefaults }) {
  return (
    <article className="paper-preview" aria-label="Research website preview">
      <div className="paper-preview-browser">
        <span />
        <span />
        <span />
        <strong>your-project.org</strong>
      </div>
      <div className="paper-preview-body">
        <p className="paper-preview-label">Research companion</p>
        <h3>{form.paper}</h3>
        <p>{form.goal}</p>
        <div className="paper-claim">
          <span className="paper-figure" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>Claim 01</strong>
            <p>Connected to the paper, code, data, and reproduced result.</p>
          </div>
        </div>
        <div className="paper-preview-links">
          <span>Paper</span>
          <span>Code</span>
          <span>Run log</span>
        </div>
      </div>
    </article>
  );
}

const annotationDefaults = {
  project: "Surgical instrument and phase annotation",
  dataType: "video",
  labels: "instrument mask, shaft line, keypoints, phase, visibility",
  annotators: "2",
  review: "Independent annotation followed by disagreement review",
  deployment: "both",
  assist:
    "Model suggestions are optional and every accepted, edited, or rejected suggestion is logged",
};

export function AnnotationSpecBuilder() {
  const [form, setForm] = usePersistentForm("annotation", annotationDefaults);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const output = useMemo(
    () => `# Annotation project: ${form.project}

schema_version: 1.0.0
data:
  type: ${form.dataType}
  source_manifest: data_manifest.csv
  raw_data_immutable: true
  deidentification_reviewed: false
labels:
${form.labels
  .split(",")
  .map((item) => `  - ${item.trim().replaceAll(" ", "_")}`)
  .join("\n")}
workflow:
  annotators_per_item: ${form.annotators}
  review: ${form.review}
  deployment: ${form.deployment}
  autosave: atomic_per_item
ai_assistance:
  policy: ${form.assist}
  record_model: true
  record_checkpoint: true
  record_prompt: true
  record_accept_edit_reject: true
provenance:
  annotator_id: required
  protocol_version: required
  source_hash: required
  created_at: required
  updated_at: required
  review_state: required
exports:
  - canonical_json
  - review_csv
  - dataset_manifest
  - task_specific_training_format

## Verification checklist

- [ ] Protocol includes positive, negative, ambiguous, and excluded examples
- [ ] Ontology is versioned outside application code
- [ ] Raw data remain read-only
- [ ] Saving is atomic and recoverable
- [ ] Keyboard-only path works
- [ ] Two annotators can be compared without seeing each other's labels
- [ ] Agreement metric matches the label type
- [ ] AI suggestions preserve model and correction provenance
- [ ] Server mode has authentication, TLS, backups, and access logs
- [ ] Export round-trip and schema migration are tested`,
    [form],
  );

  async function handleCopy() {
    await copyText(output);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  return (
    <BuilderFrame
      description="Choose the task and workflow first. The result is a plain, reviewable specification you can hand to a coding agent or a collaborator."
      eyebrow="Specification builder"
      title="Turn an annotation protocol into software requirements"
    >
      <div className="builder-grid">
        <form className="builder-form" onSubmit={(event) => event.preventDefault()}>
          <Field
            label="Project"
            onChange={(value) => setForm({ ...form, project: value })}
            value={form.project}
          />
          <div className="field-row">
            <Select
              label="Data type"
              onChange={(value) => setForm({ ...form, dataType: value })}
              options={[
                ["image", "Image"],
                ["video", "Video"],
                ["volume", "3D volume"],
                ["multimodal", "Multimodal"],
              ]}
              value={form.dataType}
            />
            <Field
              label="Annotators per item"
              onChange={(value) => setForm({ ...form, annotators: value })}
              value={form.annotators}
            />
          </div>
          <TextArea
            label="Label types"
            onChange={(value) => setForm({ ...form, labels: value })}
            value={form.labels}
          />
          <TextArea
            label="Review and adjudication"
            onChange={(value) => setForm({ ...form, review: value })}
            value={form.review}
          />
          <Select
            label="Where it should run"
            onChange={(value) => setForm({ ...form, deployment: value })}
            options={[
              ["local", "Local and offline"],
              ["private_server", "Private server"],
              ["both", "Both"],
            ]}
            value={form.deployment}
          />
          <TextArea
            label="AI-assistance policy"
            onChange={(value) => setForm({ ...form, assist: value })}
            value={form.assist}
          />
        </form>
        <div className="builder-output">
          <div className="output-header">
            <span>annotation_spec.yaml</span>
            <span>local draft</span>
          </div>
          <pre>{output}</pre>
          <BuilderActions
            copyState={copyState}
            filename="annotation_spec.md"
            onCopy={handleCopy}
            output={output}
          />
        </div>
      </div>
    </BuilderFrame>
  );
}

function BuilderFrame({
  children,
  description,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="builder-section" id="builder">
      <div className="section-heading section-heading-wide">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        value={value}
      />
    </label>
  );
}

function Select({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[][];
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map(([optionValue, name]) => (
          <option key={optionValue} value={optionValue}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

type DemoPoint = { id: number; x: number; y: number };

export function AnnotationDemo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<"box" | "keypoint">("box");
  const [box, setBox] = useState({ x: 52, y: 36, width: 25, height: 36 });
  const [points, setPoints] = useState<DemoPoint[]>([
    { id: 1, x: 66, y: 48 },
    { id: 2, x: 74, y: 64 },
  ]);
  const [phase, setPhase] = useState("Transfer");
  const [visibility, setVisibility] = useState("Visible");

  function addAt(x: number, y: number) {
    if (tool === "box") {
      setBox({
        x: Math.max(2, Math.min(73, x - 12.5)),
        y: Math.max(2, Math.min(62, y - 18)),
        width: 25,
        height: 36,
      });
      return;
    }
    setPoints((current) => [
      ...current.slice(-3),
      { id: Date.now(), x, y },
    ]);
  }

  function handleFrameClick(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    addAt(
      ((event.clientX - bounds.left) / bounds.width) * 100,
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
  }

  const json = JSON.stringify(
    {
      frame_id: "demo_frame_0040",
      protocol_version: "1.0.0",
      phase,
      instrument_1: {
        visibility: visibility.toLowerCase().replaceAll(" ", "_"),
        box: [box.x, box.y, box.width, box.height].map((value) =>
          Number(value.toFixed(1)),
        ),
        keypoints: points.map(({ x, y }) => [
          Number(x.toFixed(1)),
          Number(y.toFixed(1)),
        ]),
      },
      provenance: {
        source: "frame-annotator teaching demo",
        suggestion_status: "human_edited",
      },
    },
    null,
    2,
  );

  return (
    <section className="annotation-demo" id="demo">
      <div className="section-heading section-heading-wide">
        <p>Try the interaction</p>
        <h2>A tiny annotation loop</h2>
        <span>
          Choose a tool, click the frame, change the phase or visibility, and
          inspect the plain JSON record. This is a teaching mock built from the
          frame-annotator interface, not a clinical labelling system.
        </span>
      </div>
      <div className="demo-workbench">
        <div className="demo-main">
          <div className="demo-toolbar" role="toolbar" aria-label="Annotation tools">
            <button
              aria-pressed={tool === "box"}
              className={tool === "box" ? "is-active" : ""}
              onClick={() => setTool("box")}
              type="button"
            >
              Bounding box
            </button>
            <button
              aria-pressed={tool === "keypoint"}
              className={tool === "keypoint" ? "is-active" : ""}
              onClick={() => setTool("keypoint")}
              type="button"
            >
              Keypoint
            </button>
            <button
              onClick={() => {
                setBox({ x: 52, y: 36, width: 25, height: 36 });
                setPoints([
                  { id: 1, x: 66, y: 48 },
                  { id: 2, x: 74, y: 64 },
                ]);
              }}
              type="button"
            >
              <Refresh size={15} />
              Reset
            </button>
          </div>
          <div
            aria-label={`Annotation frame. Active tool: ${tool}. Click to move or add an annotation.`}
            className={`demo-frame tool-${tool}`}
            onClick={handleFrameClick}
            ref={frameRef}
            role="img"
          >
            <Image
              alt="Peg-transfer training scene in the frame-annotator interface"
              fill
              priority={false}
              sizes="(max-width: 900px) 100vw, 70vw"
              src="/frame-annotator-interface.jpg"
              unoptimized
            />
            <span
              className="demo-box"
              style={{
                height: `${box.height}%`,
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.width}%`,
              }}
            >
              <small>instrument 1</small>
            </span>
            {points.map((point, index) => (
              <span
                className="demo-point"
                key={point.id}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <div className="demo-hint">
            Click the image to {tool === "box" ? "place the box" : "add a keypoint"}.
            Keyboard users can use the sample controls in the panel.
          </div>
        </div>
        <aside className="demo-inspector" aria-label="Annotation inspector">
          <h3>Frame record</h3>
          <Select
            label="Phase"
            onChange={setPhase}
            options={[
              ["Approach", "Approach"],
              ["Grasp", "Grasp"],
              ["Transfer", "Transfer"],
              ["Release", "Release"],
            ]}
            value={phase}
          />
          <Select
            label="Visibility"
            onChange={setVisibility}
            options={[
              ["Visible", "Visible"],
              ["Partly visible", "Partly visible"],
              ["Out of frame", "Out of frame"],
              ["Occluded", "Occluded"],
            ]}
            value={visibility}
          />
          <div className="sample-control-row">
            <button onClick={() => addAt(58, 42)} type="button">
              Place sample box
            </button>
            <button onClick={() => setPoints((items) => [...items, { id: Date.now(), x: 62, y: 55 }])} type="button">
              Add sample point
            </button>
          </div>
          <pre>{json}</pre>
          <p className="demo-provenance">
            The useful part is not the rectangle. It is the protocol version,
            review state, source identity, and record of AI assistance around it.
          </p>
        </aside>
      </div>
    </section>
  );
}
