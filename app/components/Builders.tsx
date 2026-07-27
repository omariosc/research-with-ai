"use client";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BUILDER_SCHEMA_VERSION,
  DEFAULT_PROJECT_ID,
  STORAGE_PREFIX,
  builderKey,
  copyText,
  downloadText,
  legacyBuilderKey,
} from "@/lib/storage";
import { publicUrlIssue, redactSensitiveUrl } from "@/lib/url-safety";
import {
  TUTORIAL_VERSION,
  TUTORIAL_VERSION_LABEL,
  WORKSHOP_RELEASES,
} from "@/lib/version";
import { Check, Copy, Download } from "./Icons";

type CopyState = "idle" | "copied";

function BuilderActions({
  copyState,
  disabled = false,
  filename,
  output,
  onCopy,
}: {
  copyState: CopyState;
  disabled?: boolean;
  filename: string;
  output: string;
  onCopy: () => void;
}) {
  const format = filename.endsWith(".yaml")
    ? "YAML"
    : filename.endsWith(".json")
      ? "JSON"
      : "Markdown";
  return (
    <div className="builder-actions">
      <button
        className="button button-secondary"
        disabled={disabled}
        onClick={onCopy}
        type="button"
      >
        {copyState === "copied" ? <Check size={17} /> : <Copy size={17} />}
        {copyState === "copied" ? "Copied" : "Copy plan"}
      </button>
      <button
        className="button button-primary"
        disabled={disabled}
        onClick={() =>
          downloadText(
            filename,
            output,
            filename.endsWith(".yaml")
              ? "application/yaml;charset=utf-8"
              : filename.endsWith(".json")
                ? "application/json;charset=utf-8"
                : "text/markdown;charset=utf-8",
          )
        }
        type="button"
      >
        <Download size={17} />
        Download {format}
      </button>
    </div>
  );
}

function preserveStorageValue<T>(value: T) {
  return value;
}

function restoreStringForm<T extends Record<string, string>>(
  stored: unknown,
  defaults: T,
  expectedVersion: number = BUILDER_SCHEMA_VERSION,
) {
  if (
    !stored ||
    typeof stored !== "object" ||
    !("schemaVersion" in stored) ||
    stored.schemaVersion !== expectedVersion ||
    !("value" in stored) ||
    !stored.value ||
    typeof stored.value !== "object"
  ) {
    return null;
  }

  const candidate = stored.value as Record<string, unknown>;
  const restored = { ...defaults };
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const value = candidate[String(key)];
    if (value === undefined) continue;
    if (typeof value !== "string") return null;
    restored[key] = value as T[keyof T];
  }
  return restored;
}

function migrateLegacyStringForm<T extends Record<string, string>>(
  stored: unknown,
  defaults: T,
  fields: ReadonlyArray<keyof T>,
) {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return null;

  const candidate = stored as Record<string, unknown>;
  const migrated = { ...defaults };
  let restoredField = false;
  for (const key of fields) {
    const value = candidate[String(key)];
    if (typeof value !== "string") continue;
    migrated[key] = value as T[keyof T];
    restoredField = true;
  }
  return restoredField ? migrated : null;
}

function usePersistentForm<T extends Record<string, string>>(
  key: string,
  projectId: string,
  defaults: T,
  legacyFields: ReadonlyArray<keyof T>,
  prepareForStorage: (value: T) => T = preserveStorageValue,
) {
  const [value, setValue] = useState(defaults);
  const [loaded, setLoaded] = useState(false);
  const storageKey = builderKey(key, projectId);
  const versionTwoStorageKey = legacyBuilderKey(key);
  const legacyStorageKey = `${STORAGE_PREFIX}:builder:${key}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const restored = restoreStringForm(JSON.parse(raw), defaults);
        if (restored) {
          queueMicrotask(() => setValue(prepareForStorage(restored)));
          queueMicrotask(() => setLoaded(true));
          return;
        }
      }
      if (projectId === DEFAULT_PROJECT_ID) {
        const versionTwoRaw =
          window.localStorage.getItem(versionTwoStorageKey);
        if (versionTwoRaw) {
          const restored = restoreStringForm(
            JSON.parse(versionTwoRaw),
            defaults,
            2,
          );
          if (restored) {
            queueMicrotask(() => setValue(prepareForStorage(restored)));
            queueMicrotask(() => setLoaded(true));
            return;
          }
        }
        const legacyRaw = window.localStorage.getItem(legacyStorageKey);
        if (legacyRaw) {
          const migrated = migrateLegacyStringForm(
            JSON.parse(legacyRaw),
            defaults,
            legacyFields,
          );
          if (migrated) {
            queueMicrotask(() => setValue(prepareForStorage(migrated)));
          }
        }
      }
    } catch {
      // The form remains usable if browser storage is unavailable.
    }
    queueMicrotask(() => setLoaded(true));
  }, [
    defaults,
    legacyFields,
    legacyStorageKey,
    prepareForStorage,
    projectId,
    storageKey,
    versionTwoStorageKey,
  ]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          schemaVersion: BUILDER_SCHEMA_VERSION,
          value: prepareForStorage(value),
        }),
      );
    } catch {
      // The form remains usable when local storage is unavailable or full.
    }
  }, [loaded, prepareForStorage, storageKey, value]);

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
const agenticLegacyFields: ReadonlyArray<keyof typeof agenticDefaults> = [
  "project",
  "question",
  "owner",
  "data",
  "compute",
  "target",
  "approval",
];

export function AgenticPlanBuilder({ projectId }: { projectId: string }) {
  const [form, setForm] = usePersistentForm(
    "agentic",
    projectId,
    agenticDefaults,
    agenticLegacyFields,
  );
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const governanceStop =
    form.data === "identifiable or confidential" || form.data === "unknown";
  const approvalItems = form.approval
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const planErrors = [
    ...(!form.project.trim() ? ["Give the project a name."] : []),
    ...(!form.question.trim() ? ["State the research question."] : []),
    ...(!form.owner.trim() ? ["Name the accountable researcher."] : []),
    ...(!form.target.trim()
      ? ["Define an exact reproduction or study target."]
      : []),
    ...(approvalItems.length === 0
      ? ["Name at least one action that requires human approval."]
      : []),
  ];

  const output = useMemo(
    () => `# Research contract: ${form.project}

> Tutorial release: ${TUTORIAL_VERSION_LABEL}
> Canonical tutorial: ${WORKSHOP_RELEASES["agentic-research"].canonicalUrl}

## Status

${governanceStop ? "STOP. Do not upload, inspect, or process the data with an AI tool until the named institutional data owner confirms the classification, approved environment, permitted providers, and retention rules." : "Planning may continue within the approved data boundary. Every external upload or execution action still requires the controls below."}

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
- Reviewer zero: run focused critique passes and return a traceable issue ledger; the authors decide every change.

## Approval-required actions

${approvalItems
  .map((item) => `- [ ] ${item.trim()}`)
  .join("\n")}

## Evidence gates

- [ ] Central references opened and checked against primary sources
- [ ] Paper claim linked to a section, figure or table, split, and metric
- [ ] Repository pinned to a commit and licence reviewed
- [ ] Clean-environment smoke test passes
- [ ] Study design reviewed before held-out results are viewed
- [ ] Scheduled job limits and paths approved
- [ ] Hypothesis and primary analysis recorded before held-out testing
- [ ] Metric recalculated independently
- [ ] Figure regenerated from raw outputs
- [ ] First complete draft reviewed against the venue rubric and reporting checklist
- [ ] Every decision-critical and major concern resolved or recorded with evidence
- [ ] Pre-submission review rerun after material changes
- [ ] Citations, privacy, licence, and AI-use statement reviewed

## Stop conditions

Stop if required data rights are unclear, the requested action exceeds the approved scope, a secret or identifiable record is exposed, the test split has influenced selection, or the result cannot be traced to an input and command.

## AI-use record

Record the tool, dated version, task, data shared, files or commands affected, human checks, and known limitations. Never record credentials or patient identifiers.`,
    [approvalItems, form, governanceStop],
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
          {governanceStop ? (
            <div className="builder-stop" role="alert">
              <strong>Governance stop</strong>
              <p>
                Do not paste or upload this data. Ask the named institutional
                owner to classify it and approve the processing environment
                before an agent receives any record, path, frame, or metadata.
              </p>
            </div>
          ) : null}
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
          {planErrors.length > 0 ? (
            <div className="builder-stop" role="alert">
              <strong>Contract needs attention</strong>
              <ul>
                {planErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="builder-valid" role="status">
              Required planning fields are present. The accountable researcher
              must still review the scientific and governance choices.
            </div>
          )}
        </form>
        <div className="builder-output">
          <div className="output-header">
            <span>research_contract.md</span>
            <span>local draft</span>
          </div>
          <pre>{output}</pre>
          <BuilderActions
            copyState={copyState}
            disabled={planErrors.length > 0}
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
  paper: "",
  paperUrl: "",
  repoStatus: "public",
  repoUrl: "",
  audience: "A new Masters or PhD student in the field",
  goal: "Explain one result and let readers verify how it was produced",
  rights: "",
  demo:
    "Run a small, repeatable example from the public research artefacts, or explain why none is possible",
};
const paperLegacyFields: ReadonlyArray<keyof typeof paperDefaults> = [
  "paper",
  "paperUrl",
  "repoUrl",
  "audience",
  "goal",
  "demo",
];
function preparePaperForStorage(form: typeof paperDefaults) {
  return {
    ...form,
    paperUrl: redactSensitiveUrl(form.paperUrl),
    repoUrl: redactSensitiveUrl(form.repoUrl),
  };
}

export function PaperSiteBuilder({ projectId }: { projectId: string }) {
  const [form, setForm] = usePersistentForm(
    "paper",
    projectId,
    paperDefaults,
    paperLegacyFields,
    preparePaperForStorage,
  );
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const paperUrlError = publicUrlIssue(form.paperUrl, "paper");
  const repoUrlError =
    form.repoStatus === "public"
      ? publicUrlIssue(form.repoUrl, "repository")
      : null;
  const repositorySummary =
    form.repoStatus === "public"
      ? form.repoUrl
      : "No public repository is available; record this absence in the source manifest.";
  const briefErrors = [
    ...(!form.paper.trim() ? ["Enter the paper title."] : []),
    ...(paperUrlError ? [paperUrlError] : []),
    ...(repoUrlError ? [repoUrlError] : []),
    ...(!form.audience.trim() ? ["Describe the intended reader."] : []),
    ...(!form.goal.trim() ? ["State a testable reader outcome."] : []),
    ...(!form.rights.trim()
      ? ["Record the current rights status. Use unknown if it is unresolved."]
      : []),
    ...(!form.demo.trim()
      ? ["Define a small example, or state why no runnable demo is possible."]
      : []),
  ];
  const output = useMemo(
    () => `# Research website brief

> Tutorial release: ${TUTORIAL_VERSION_LABEL}
> Canonical tutorial: ${WORKSHOP_RELEASES["interactive-paper"].canonicalUrl}

## Project

- **Paper:** ${form.paper}
- **Paper source:** ${form.paperUrl}
- **Repository:** ${repositorySummary}
- **Audience:** ${form.audience}
- **Reader outcome:** ${form.goal}

## Rights and provenance

- ${form.rights}
- [ ] Record the paper licence and the repository licence when one is available
- [ ] Preserve every reused figure and table caption
- [ ] Link each media item to its original page, figure, or table
- [ ] Label generated explanations and redrawn diagrams

## Content map

1. Plain-language question and contribution
2. Method walkthrough tied to the paper
3. Original figures and tables with intact captions
4. ${form.repoStatus === "public" ? "Claim-evidence links to paper, code, data, and executed result" : "Claim-evidence links to the paper, accessible data or method description, and an explicit no-code boundary"}
5. Reproducible demo: ${form.demo}
6. Limitations, failure cases, and unresolved questions
7. Citation, licence, accessibility, and AI-use information

## Build contract

- [ ] Pin the paper version${form.repoStatus === "public" ? " and repository commit" : ""}
- [ ] Create a source manifest before generating copy
- [ ] Keep headings, controls, equations, and captions as semantic HTML
- [ ] Add useful alt text without inventing evidence
- [ ] Run the documented example in a clean environment, or record why none is possible
- [ ] Test keyboard navigation, mobile layout, colour contrast, and links
- [ ] Use privacy-preserving analytics or no analytics
- [ ] Preview locally before deployment
- [ ] Review every claim and citation before publishing

## Video shot list

1. Start with the paper${form.repoStatus === "public" ? " and repository" : " and record that no public repository is available"}
2. Build the source manifest
3. Generate the first structured page
4. ${form.repoStatus === "public" ? "Trace one claim to a figure, code line, and run" : "Trace one claim to its paper location, source evidence, and no-code boundary"}
5. Catch one extraction or citation error
6. Test locally and on mobile
7. Deploy the reviewed version`,
    [form, repositorySummary],
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
            label="Paper title (required)"
            onChange={(value) => setForm({ ...form, paper: value })}
            value={form.paper}
          />
          <div className="field-row">
            <Field
              label="Paper URL (required)"
              onChange={(value) => setForm({ ...form, paperUrl: value })}
              value={form.paperUrl}
            />
            <Select
              label="Repository availability"
              onChange={(value) =>
                setForm({
                  ...form,
                  repoStatus: value,
                  repoUrl: value === "public" ? form.repoUrl : "",
                })
              }
              options={[
                ["public", "Public repository"],
                ["none", "No public repository"],
              ]}
              value={form.repoStatus}
            />
          </div>
          <div className="field-row field-row-single">
            <Field
              disabled={form.repoStatus !== "public"}
              label={
                form.repoStatus === "public"
                  ? "Repository URL (required)"
                  : "Repository URL (not applicable)"
              }
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
          {briefErrors.length > 0 ? (
            <div className="builder-stop" role="alert">
              <strong>Brief needs attention</strong>
              <ul>
                {briefErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="builder-valid" role="status">
              Required fields are present. Check the source versions, licences,
              and evidence map before treating the brief as reviewed.
            </div>
          )}
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
              disabled={briefErrors.length > 0}
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
        <h3>{form.paper.trim() || "Paper title"}</h3>
        <p>{form.goal.trim() || "Reader outcome will appear here."}</p>
        <div className="paper-claim">
          <span className="paper-figure" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>Claim 01</strong>
            <p>
              {form.repoStatus === "public"
                ? "Connected to the paper, code, data, and an evidence-labelled result."
                : "Connected to the paper, available evidence, and an explicit no-code boundary."}
            </p>
          </div>
        </div>
        <div className="paper-preview-links">
          <span>Paper</span>
          {form.repoStatus === "public" ? <span>Code</span> : null}
          <span>
            {form.repoStatus === "public" ? "Run log" : "Evidence record"}
          </span>
        </div>
      </div>
    </article>
  );
}

const annotationDefaults = {
  project: "Surgical instrument and phase annotation",
  dataType: "video",
  deidentificationStatus: "not_reviewed",
  deidentificationReviewer: "",
  deidentificationReference: "",
  labels:
    "instrument box, instrument mask, shaft line, keypoints, phase, visibility",
  tasks: `instrument_box | bounding_box | instrument_box | zero_or_one_per_instrument | percent_of_native_frame_top_left_xywh | | not_visible,not_applicable | not_applicable
instrument_mask | polygon_mask | instrument_mask | zero_or_one_per_instrument | percent_of_native_frame_top_left_xy | | not_visible,not_applicable | not_applicable
shaft_axis | polyline | shaft_line | zero_or_one_per_instrument | percent_of_native_frame_top_left_xy | | not_visible,not_applicable | not_applicable
landmarks | keypoints | keypoints | fixed_named_points_per_visible_instrument | percent_of_native_frame_top_left_xy | joint,ee_tip,ee_left,ee_right | occluded,out_of_frame,not_applicable | not_applicable
phase_timeline | temporal_interval | phase | exactly_one_phase_per_frame | frame_index_zero_based | approach,grasp,transfer,release | unknown,not_applicable | inclusive_start_exclusive_end
visibility_state | classification | visibility | exactly_one_per_instrument | categorical | visible,partly_visible,out_of_frame,occluded | unknown,not_applicable | not_applicable`,
  annotators: "2",
  review: "Independent annotation followed by disagreement review",
  deployment: "both",
  assist:
    "Model suggestions are optional and every accepted, edited, or rejected suggestion is logged",
};
const annotationLegacyFields: ReadonlyArray<keyof typeof annotationDefaults> = [
  "project",
  "dataType",
  "labels",
  "annotators",
  "review",
  "deployment",
  "assist",
];

function yamlQuote(value: string) {
  return JSON.stringify(value.trim());
}

function labelId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normaliseList(value: string) {
  const raw = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const normalised = raw.map(labelId);
  return {
    invalid: raw.filter((_, index) => !normalised[index]),
    values: normalised.filter(Boolean),
  };
}

const annotationTaskTypes = new Set([
  "bounding_box",
  "classification",
  "keypoints",
  "polygon_mask",
  "polyline",
  "scalar",
  "temporal_interval",
]);

export function AnnotationSpecBuilder({
  projectId,
}: {
  projectId: string;
}) {
  const [form, setForm] = usePersistentForm(
    "annotation",
    projectId,
    annotationDefaults,
    annotationLegacyFields,
  );
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const rawLabels = form.labels
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const labelEntries = rawLabels.map((name) => ({ id: labelId(name), name }));
  const validLabelEntries = labelEntries.filter((item) => item.id);
  const uniqueLabels = Array.from(
    new Map(validLabelEntries.map((item) => [item.id, item])).values(),
  );
  const labelIds = new Set(uniqueLabels.map((item) => item.id));
  const taskLines = form.tasks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const taskEntries = taskLines.map((line, index) => {
    const parts = line.split("|").map((item) => item.trim());
    const [
      rawId = "",
      type = "",
      rawTargets = "",
      cardinality = "",
      geometryAndUnits = "",
      rawAllowedValues = "",
      rawMissingValues = "",
      intervalBoundaries = "",
    ] = parts;
    const targets = normaliseList(rawTargets);
    const allowedValues = normaliseList(rawAllowedValues);
    const missingValues = normaliseList(rawMissingValues);
    return {
      id: labelId(rawId),
      type,
      targets: targets.values,
      invalidTargets: targets.invalid,
      cardinality,
      geometryAndUnits,
      allowedValues: allowedValues.values,
      invalidAllowedValues: allowedValues.invalid,
      missingValues: missingValues.values,
      invalidMissingValues: missingValues.invalid,
      intervalBoundaries,
      line: index + 1,
      fieldCount: parts.length,
    };
  });
  const uniqueTasks = Array.from(
    new Map(taskEntries.map((item) => [item.id, item])).values(),
  ).filter((item) => item.id);
  const annotatorCount = Number(form.annotators);
  const deidentificationNeedsRecord =
    form.deidentificationStatus !== "not_reviewed";
  const governanceStop = ["not_reviewed", "failed"].includes(
    form.deidentificationStatus,
  );
  const specErrors = [
    ...(!form.project.trim() ? ["Give the project a name."] : []),
    ...(rawLabels.length === 0 ? ["Add at least one label."] : []),
    ...(labelEntries.some((item) => !item.id)
      ? ["Every label must contain at least one letter or number."]
      : []),
    ...(uniqueLabels.length !== validLabelEntries.length
      ? ["Label IDs must be unique after normalisation."]
      : []),
    ...(taskLines.length === 0 ? ["Add at least one task definition."] : []),
    ...taskEntries.flatMap((task) => {
      const errors: string[] = [];
      if (task.fieldCount !== 8) {
        errors.push(
          `Task line ${task.line} must contain eight fields separated by |.`,
        );
      }
      if (!task.id) errors.push(`Task line ${task.line} needs a stable ID.`);
      if (!annotationTaskTypes.has(task.type)) {
        errors.push(`Task line ${task.line} has an unsupported task type.`);
      }
      if (task.targets.length === 0) {
        errors.push(`Task line ${task.line} needs a target label ID.`);
      }
      if (task.invalidTargets.length > 0) {
        errors.push(
          `Task line ${task.line} has target tokens with no letters or numbers.`,
        );
      }
      if (new Set(task.targets).size !== task.targets.length) {
        errors.push(`Task line ${task.line} repeats a target label ID.`);
      }
      const unknownTargets = task.targets.filter((id) => !labelIds.has(id));
      if (unknownTargets.length > 0) {
        errors.push(
          `Task line ${task.line} references unknown label IDs: ${unknownTargets.join(", ")}.`,
        );
      }
      if (!task.cardinality) {
        errors.push(`Task line ${task.line} needs a cardinality rule.`);
      }
      if (!task.geometryAndUnits) {
        errors.push(`Task line ${task.line} needs geometry or units.`);
      }
      if (
        ["classification", "keypoints", "temporal_interval"].includes(
          task.type,
        ) &&
        task.allowedValues.length === 0
      ) {
        errors.push(
          `Task line ${task.line} needs allowed values for its categorical output.`,
        );
      }
      if (task.invalidAllowedValues.length > 0) {
        errors.push(
          `Task line ${task.line} has allowed-value tokens with no letters or numbers.`,
        );
      }
      if (new Set(task.allowedValues).size !== task.allowedValues.length) {
        errors.push(`Task line ${task.line} repeats an allowed value.`);
      }
      if (task.missingValues.length === 0) {
        errors.push(`Task line ${task.line} needs a missing-value vocabulary.`);
      }
      if (task.invalidMissingValues.length > 0) {
        errors.push(
          `Task line ${task.line} has missing-value tokens with no letters or numbers.`,
        );
      }
      if (new Set(task.missingValues).size !== task.missingValues.length) {
        errors.push(`Task line ${task.line} repeats a missing value.`);
      }
      const overlappingValues = task.allowedValues.filter((value) =>
        task.missingValues.includes(value),
      );
      if (overlappingValues.length > 0) {
        errors.push(
          `Task line ${task.line} uses values as both allowed and missing: ${overlappingValues.join(", ")}.`,
        );
      }
      if (!task.intervalBoundaries) {
        errors.push(`Task line ${task.line} needs an interval-boundary rule.`);
      }
      if (
        task.type === "temporal_interval" &&
        ![
          "inclusive_start_exclusive_end",
          "inclusive_both",
          "exclusive_both",
        ].includes(task.intervalBoundaries)
      ) {
        errors.push(
          `Task line ${task.line} needs an explicit temporal boundary convention.`,
        );
      }
      return errors;
    }),
    ...(uniqueTasks.length !== taskEntries.length
      ? ["Task IDs must be unique after normalisation."]
      : []),
    ...(!form.review.trim()
      ? ["Describe review and adjudication before exporting."]
      : []),
    ...(!form.assist.trim()
      ? ["State an AI-assistance policy, even if assistance is disabled."]
      : []),
    ...(deidentificationNeedsRecord &&
    !form.deidentificationReviewer.trim()
      ? ["Name the person who made the de-identification decision."]
      : []),
    ...(deidentificationNeedsRecord &&
    !form.deidentificationReference.trim()
      ? ["Add the approval, waiver, or failed-review reference."]
      : []),
    ...(!Number.isInteger(annotatorCount) ||
    annotatorCount < 1 ||
    annotatorCount > 20
      ? ["Annotators per item must be a whole number from 1 to 20."]
      : []),
  ];
  const output = useMemo(
    () => `tutorial_version: ${yamlQuote(TUTORIAL_VERSION)}
tutorial_canonical_url: ${yamlQuote(WORKSHOP_RELEASES["annotation-tools"].canonicalUrl)}
schema_version: "1.4.0"
project:
  name: ${yamlQuote(form.project)}
data:
  type: ${yamlQuote(form.dataType)}
  source_manifest: "source-manifest.csv"
  raw_data_immutable: true
  deidentification:
    status: ${yamlQuote(form.deidentificationStatus)}
    reviewer: ${
      form.deidentificationReviewer.trim()
        ? yamlQuote(form.deidentificationReviewer)
        : "null"
    }
    decision_reference: ${
      form.deidentificationReference.trim()
        ? yamlQuote(form.deidentificationReference)
        : "null"
    }
labels:
${uniqueLabels
  .map((item) => `  ${yamlQuote(item.id)}:
    name: ${yamlQuote(item.name)}`)
  .join("\n")}
tasks:
${uniqueTasks
  .map(
    (task) => `  ${yamlQuote(task.id)}:
    type: ${yamlQuote(task.type)}
    target_label_ids:${
      task.targets.length
        ? `\n${task.targets.map((id) => `      - ${yamlQuote(id)}`).join("\n")}`
        : " []"
    }
    cardinality: ${yamlQuote(task.cardinality)}
    geometry_and_units: ${yamlQuote(task.geometryAndUnits)}
    allowed_values:${
      task.allowedValues.length
        ? `\n${task.allowedValues
            .map((value) => `      - ${yamlQuote(value)}`)
            .join("\n")}`
        : " []"
    }
    missing_values:${
      task.missingValues.length
        ? `\n${task.missingValues
            .map((value) => `      - ${yamlQuote(value)}`)
            .join("\n")}`
        : " []"
    }
    interval_boundaries: ${yamlQuote(task.intervalBoundaries)}`,
  )
  .join("\n")}
workflow:
  annotators_per_item: ${Number.isInteger(annotatorCount) ? annotatorCount : 0}
  review: ${yamlQuote(form.review)}
  deployment: ${yamlQuote(form.deployment)}
  autosave: "atomic_per_item"
ai_assistance:
  policy: ${yamlQuote(form.assist)}
  default_origin: "manual"
  record_model: true
  record_checkpoint_hash: true
  record_suggestion_id_when_exposed: true
  record_accept_edit_reject: true
provenance:
  annotation_id: required
  revision_id: required
  annotator_id: required
  protocol_version: required
  source_hash: required
  frame_index_or_time: required
  coordinate_convention_and_units: required
  created_at: required
  updated_at: required
  review_state: required
exports:
  - "canonical_json"
  - "review_csv"
  - "dataset_manifest"
  - "task_specific_training_format"
validation:
  json_schema: "annotation-spec-1.4.0.schema.json"
  round_trip_required: true
  protocol_locked_before_reliability_sample: true`,
    [annotatorCount, form, uniqueLabels, uniqueTasks],
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
          <Select
            label="De-identification review status"
            onChange={(value) =>
              setForm({
                ...form,
                deidentificationStatus: value,
                deidentificationReviewer: "",
                deidentificationReference: "",
              })
            }
            options={[
              ["not_reviewed", "Not reviewed"],
              ["approved", "Approved"],
              ["not_applicable", "Not applicable"],
              ["failed", "Reviewed and failed"],
            ]}
            value={form.deidentificationStatus}
          />
          <div className="field-row">
            <Field
              disabled={!deidentificationNeedsRecord}
              label="Named reviewer or data owner"
              onChange={(value) =>
                setForm({ ...form, deidentificationReviewer: value })
              }
              value={form.deidentificationReviewer}
            />
            <Field
              disabled={!deidentificationNeedsRecord}
              label="Decision or approval reference"
              onChange={(value) =>
                setForm({ ...form, deidentificationReference: value })
              }
              value={form.deidentificationReference}
            />
          </div>
          {governanceStop ? (
            <div className="builder-stop" role="alert">
              <strong>Data-use stop</strong>
              <p>
                This specification may be planned, but do not load, upload, or
                annotate sensitive source data until the named data owner records
                an approved decision and processing environment.
              </p>
            </div>
          ) : null}
          <TextArea
            label="Label types"
            onChange={(value) => setForm({ ...form, labels: value })}
            value={form.labels}
          />
          <details className="task-format-guide">
            <summary>
              <span>Task definitions</span>
              <strong>Open the advanced row format</strong>
            </summary>
            <div>
              <p>
                Use one row per annotation task. Each row contains eight fields
                separated by a vertical bar: ID, type, target label IDs,
                cardinality, geometry or units, allowed values, missing values,
                and interval boundaries.
              </p>
              <code>
                instrument_box | bounding_box | instrument_box |
                zero_or_one_per_instrument | percent_top_left_xywh | |
                not_visible,not_applicable | not_applicable
              </code>
              <TextArea
                label="Task rows"
                onChange={(value) => setForm({ ...form, tasks: value })}
                rows={8}
                value={form.tasks}
              />
            </div>
          </details>
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
          {specErrors.length > 0 ? (
            <div className="builder-stop" role="alert">
              <strong>Specification needs attention</strong>
              <ul>
                {specErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="builder-valid" role="status">
              Required fields are structurally valid. Expert definitions,
              governance, and the external JSON Schema still need review.
            </div>
          )}
        </form>
        <div className="builder-output">
          <div className="output-header">
            <span>annotation-spec.yaml</span>
            <span>local draft</span>
          </div>
          <pre>{output}</pre>
          <BuilderActions
            copyState={copyState}
            disabled={specErrors.length > 0}
            filename="annotation-spec.yaml"
            onCopy={handleCopy}
            output={output}
          />
          <div className="output-checklist">
            <strong>Keep beside the YAML</strong>
            <ul>
              <li>Signed protocol with include, exclude, and uncertain cases</li>
              <li>JSON Schema and synthetic validation fixtures</li>
              <li>Independent calibration and reliability plan</li>
              <li>Native export, review, and conversion-loss schemas</li>
            </ul>
            <a
              download
              href="/schemas/annotation-spec-1.4.0.schema.json"
            >
              Download the v1.4 JSON Schema
            </a>
          </div>
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
  disabled = false,
  label,
  onChange,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function TextArea({
  label,
  onChange,
  rows = 3,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function Select({
  disabled = false,
  label,
  onChange,
  options,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: string[][];
  value: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, name]) => (
          <option key={optionValue} value={optionValue}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
