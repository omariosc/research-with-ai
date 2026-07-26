"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  StoredWorkshopProgress,
  Workshop,
  WorkshopStep,
} from "@/lib/types";
import {
  TUTORIAL_HOMEPAGE,
  TUTORIAL_VERSION_LABEL,
  WORKSHOP_RELEASES,
  workshopRelease,
} from "@/lib/version";
import {
  PROGRESS_SCHEMA_VERSION,
  clearProgress,
  copyText,
  downloadText,
  readProgress,
  writeProgress,
} from "@/lib/storage";
import {
  AnnotationDemo,
  AnnotationSpecBuilder,
  AgenticPlanBuilder,
  PaperSiteBuilder,
} from "./Builders";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Refresh,
} from "./Icons";
import { PrivacyNote } from "./PrivacyNote";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./HomeClient";

function toggleItem(items: string[], id: string) {
  return items.includes(id)
    ? items.filter((item) => item !== id)
    : [...items, id];
}

export function WorkshopClient({ workshop }: { workshop: Workshop }) {
  const firstStep = workshop.steps[0].id;
  const [progress, setProgress] = useState<StoredWorkshopProgress>({
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completed: [],
    approved: [],
    activeStep: firstStep,
    evidenceNotes: {},
    decisions: {},
    assessmentAnswers: {},
    updatedAt: new Date(0).toISOString(),
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readProgress(workshop.slug, firstStep);
    queueMicrotask(() => {
      setProgress(stored);
      setHydrated(true);
    });
  }, [firstStep, workshop.slug]);

  const save = useCallback(
    (next: StoredWorkshopProgress) => {
      const dated = { ...next, updatedAt: new Date().toISOString() };
      setProgress(dated);
      writeProgress(workshop.slug, dated);
    },
    [workshop.slug],
  );

  const activeIndex = Math.max(
    0,
    workshop.steps.findIndex((step) => step.id === progress.activeStep),
  );
  const active = workshop.steps[activeIndex];
  const percent = Math.round(
    (progress.completed.length / workshop.steps.length) * 100,
  );
  const release = workshopRelease(workshop.slug);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: workshop.title,
    description: workshop.description,
    url: release.canonicalUrl,
    version: TUTORIAL_VERSION_LABEL,
    datePublished: "2026-07-26",
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    author: {
      "@type": "Person",
      name: "Omar Choudhry",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "University of Leeds",
      },
    },
    audience: {
      "@type": "Audience",
      audienceType: workshop.audience,
    },
    teaches: workshop.outcomes,
    learningResourceType: "Interactive tutorial",
    citation: workshop.sourceLibrary.map((source) => source.url),
  }).replaceAll("<", "\\u003c");

  function selectStep(step: WorkshopStep) {
    save({ ...progress, activeStep: step.id });
    window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#lesson-heading");
      heading?.focus({ preventScroll: true });
      document.querySelector(".lesson-panel")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  function reset() {
    if (!window.confirm("Clear this workshop's saved progress?")) return;
    clearProgress(workshop.slug);
    setProgress({
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      completed: [],
      approved: [],
      activeStep: firstStep,
      evidenceNotes: {},
      decisions: {},
      assessmentAnswers: {},
      updatedAt: new Date(0).toISOString(),
    });
  }

  function exportNotes() {
    const release = workshopRelease(workshop.slug);
    const text = `# ${workshop.title}: working record

Generated: ${new Date().toISOString()}
Tutorial version: ${TUTORIAL_VERSION_LABEL}
Canonical tutorial: ${release.canonicalUrl}

${workshop.steps
  .map(
    (step, index) => `## ${index + 1}. ${step.title}

- [${progress.completed.includes(step.id) ? "x" : " "}] Stage complete
- [${progress.approved.includes(step.id) ? "x" : " "}] Human checkpoint completed
- **Artefact:** \`${step.output}\`
- **Action:** ${step.action}
- **Checkpoint:** ${step.checkpoint}
- **Decision:** ${progress.decisions[step.id] ?? "not recorded"}

### Evidence note

${progress.evidenceNotes[step.id] || "No evidence note recorded."}

### Example prompt

\`\`\`text
${step.prompt}
\`\`\`

### Sources

${step.sources.map((source) => `- [${source.title}](${source.url})`).join("\n")}
`,
  )
  .join("\n")}

## Applied check

${workshop.assessment
  .map((item, index) => {
    const answer = progress.assessmentAnswers[item.id];
    const option = item.options.find((entry) => entry.id === answer);
    return `${index + 1}. ${item.question}
   - Answer: ${option?.label ?? "not answered"}
   - Result: ${option ? (option.correct ? "correct" : "revise") : "not attempted"}`;
  })
  .join("\n")}

## Reminder

This export records a teaching checklist, not proof that the scientific checks were done. Keep the actual sources, test outputs, approvals, and decision records with the project.
`;
    downloadText(`${workshop.slug}-working-record.md`, text);
  }

  return (
    <div className={`site-frame workshop-theme accent-${workshop.accent}`}>
      <script
        dangerouslySetInnerHTML={{ __html: structuredData }}
        type="application/ld+json"
      />
      <SiteNav active={workshop.slug} />
      <main className="workshop-main" id="main-content">
        <header className="workshop-topbar">
          <div>
            <a href={TUTORIAL_HOMEPAGE}>Overview</a>
            <span>/</span>
            <strong>{workshop.navTitle}</strong>
          </div>
          <div>
            <button onClick={exportNotes} type="button">
              <Download size={16} />
              Export record
            </button>
            <button onClick={reset} type="button">
              <Refresh size={16} />
              Reset
            </button>
          </div>
        </header>

        <section className="workshop-hero">
          <div className="workshop-number">{workshop.number}</div>
          <div className="workshop-hero-copy">
            <h1>{workshop.title}</h1>
            <p>{workshop.description}</p>
          </div>
          <aside>
            <span>You will leave with</span>
            <p>{workshop.promise}</p>
            <small>{workshop.duration}</small>
          </aside>
        </section>

        <WorkshopPrimer onSelect={selectStep} workshop={workshop} />
        <CaseStudy workshop={workshop} />

        <section className="workbench" aria-label={`${workshop.title} checklist`}>
          <div className="workbench-progress">
            <div>
              <span>Workshop progress</span>
              <strong>
                {progress.completed.length} / {workshop.steps.length}
              </strong>
            </div>
            <div
              aria-label={`${percent} percent complete`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={percent}
              className="progress-track"
              role="progressbar"
            >
              <span style={{ width: hydrated ? `${percent}%` : "0%" }} />
            </div>
          </div>

          <div className="workbench-body">
            <nav className="step-rail" aria-label="Workshop stages">
              <ol>
                {workshop.steps.map((step, index) => {
                  const complete = progress.completed.includes(step.id);
                  const selected = active.id === step.id;
                  return (
                    <li key={step.id}>
                      <button
                        aria-current={selected ? "step" : undefined}
                        className={selected ? "is-active" : ""}
                        onClick={() => selectStep(step)}
                        type="button"
                      >
                        <span className={complete ? "is-complete" : ""}>
                          {complete ? <Check size={15} /> : index + 1}
                        </span>
                        <div>
                          <strong>{step.title}</strong>
                          <small>{step.output}</small>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <a className="rail-builder-link" href="#builder">
                Build your own plan
                <ArrowRight size={16} />
              </a>
            </nav>
            <LessonPanel
              active={active}
              activeIndex={activeIndex}
              approved={progress.approved.includes(active.id)}
              complete={progress.completed.includes(active.id)}
              count={workshop.steps.length}
              decision={progress.decisions[active.id] ?? ""}
              evidenceNote={progress.evidenceNotes[active.id] ?? ""}
              next={workshop.steps[activeIndex + 1]}
              onApprove={() =>
                save(
                  progress.approved.includes(active.id)
                    ? {
                        ...progress,
                        approved: progress.approved.filter(
                          (id) => id !== active.id,
                        ),
                        completed: progress.completed.filter(
                          (id) => id !== active.id,
                        ),
                      }
                    : {
                        ...progress,
                        approved: [...progress.approved, active.id],
                      },
                )
              }
              onComplete={() =>
                save({
                  ...progress,
                  completed: toggleItem(progress.completed, active.id),
                })
              }
              onDecision={(decision) =>
                save({
                  ...progress,
                  approved: progress.approved.filter(
                    (id) => id !== active.id,
                  ),
                  completed: progress.completed.filter(
                    (id) => id !== active.id,
                  ),
                  decisions: {
                    ...progress.decisions,
                    [active.id]: decision,
                  },
                })
              }
              onEvidenceNote={(evidenceNote) =>
                save({
                  ...progress,
                  approved: progress.approved.filter(
                    (id) => id !== active.id,
                  ),
                  completed: progress.completed.filter(
                    (id) => id !== active.id,
                  ),
                  evidenceNotes: {
                    ...progress.evidenceNotes,
                    [active.id]: evidenceNote,
                  },
                })
              }
              onSelect={selectStep}
              previous={workshop.steps[activeIndex - 1]}
            />
          </div>
        </section>

        {workshop.slug === "agentic-research" ? <AgenticPlanBuilder /> : null}
        {workshop.slug === "interactive-paper" ? <PaperSiteBuilder /> : null}
        {workshop.slug === "annotation-tools" ? (
          <>
            <AnnotationDemo />
            <AnnotationSpecBuilder />
          </>
        ) : null}

        <WorkshopAssessment
          answers={progress.assessmentAnswers}
          onAnswer={(itemId, optionId) =>
            save({
              ...progress,
              assessmentAnswers: {
                ...progress.assessmentAnswers,
                [itemId]: optionId,
              },
            })
          }
          workshop={workshop}
        />
        <WorkshopGlossary workshop={workshop} />
        <SourceLibrary workshop={workshop} />
        <NextWorkshop current={workshop.slug} />
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}

function WorkshopPrimer({
  onSelect,
  workshop,
}: {
  onSelect: (step: WorkshopStep) => void;
  workshop: Workshop;
}) {
  const quickSteps = workshop.quickRoute
    .map((id) => workshop.steps.find((step) => step.id === id))
    .filter((step): step is WorkshopStep => Boolean(step));
  const quickMinutes = quickSteps.reduce(
    (total, step) => total + (Number.parseInt(step.duration ?? "0", 10) || 0),
    0,
  );

  return (
    <section className="workshop-primer" aria-labelledby="primer-title">
      <div className="primer-heading">
        <p>Before you begin</p>
        <h2 id="primer-title">Know the route and the standard</h2>
        <span>
          This is for {workshop.audience} Guided workshop: {workshop.duration}.
          Real project: {workshop.projectTime}
        </span>
      </div>
      <div className="primer-grid">
        <article>
          <h3>Prerequisites</h3>
          <ul>
            {workshop.prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>By the end, you can</h3>
          <ol>
            {workshop.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>
        <article className="quick-route">
          <h3>{quickMinutes}-minute orientation route</h3>
          <p>
            Use this route for orientation. Return to all ten stages before
            treating the exported record as a project plan.
          </p>
          <div>
            {quickSteps.map((step, index) => (
              <button key={step.id} onClick={() => onSelect(step)} type="button">
                <span>{index + 1}</span>
                {step.title}
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function CaseStudy({ workshop }: { workshop: Workshop }) {
  const study = workshop.caseStudy;
  return (
    <section className="case-study" aria-labelledby="case-study-title">
      <div className="case-study-heading">
        <p>{study.eyebrow}</p>
        <h2 id="case-study-title">{study.title}</h2>
        <span>{study.context}</span>
      </div>
      <div className="case-study-grid">
        <article>
          <span>What I expected</span>
          <p>{study.expected}</p>
        </article>
        <article>
          <span>What I found</span>
          <ul>
            {study.observed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>What follows from the evidence</span>
          <ul>
            {study.changes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="case-study-boundary">
        <strong>Claim boundary</strong>
        <p>{study.boundary}</p>
        <div>
          {study.sources.map((source) => (
            <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
              {source.title}
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LessonPanel({
  active,
  activeIndex,
  approved,
  complete,
  count,
  decision,
  evidenceNote,
  next,
  onApprove,
  onComplete,
  onDecision,
  onEvidenceNote,
  onSelect,
  previous,
}: {
  active: WorkshopStep;
  activeIndex: number;
  approved: boolean;
  complete: boolean;
  count: number;
  decision: "" | "ready" | "revise" | "stop";
  evidenceNote: string;
  next?: WorkshopStep;
  onApprove: () => void;
  onComplete: () => void;
  onDecision: (decision: "ready" | "revise" | "stop") => void;
  onEvidenceNote: (evidenceNote: string) => void;
  onSelect: (step: WorkshopStep) => void;
  previous?: WorkshopStep;
}) {
  const [copied, setCopied] = useState(false);
  const evidenceReady = evidenceNote.trim().length >= 20 && decision !== "";

  return (
    <article className="lesson-panel">
      <header className="lesson-header">
        <div>
          <span>
            Stage {activeIndex + 1} of {count}
            {active.duration ? ` · ${active.duration}` : ""}
          </span>
          <h2 id="lesson-heading" tabIndex={-1}>
            {active.title}
          </h2>
          <p>{active.summary}</p>
        </div>
        <div className="lesson-output">
          <span>Keep</span>
          <code>{active.output}</code>
        </div>
      </header>

      <div className="lesson-content-grid">
        <section className="lesson-action">
          <p className="lesson-label">Your move</p>
          <p>{active.action}</p>
          <div className="prompt-block">
            <div>
              <span>Example prompt</span>
              <button
                onClick={async () => {
                  await copyText(active.prompt);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
                type="button"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>{active.prompt}</pre>
          </div>
          <div className="watch-note">
            <span>Watch for</span>
            <p>{active.watchFor}</p>
          </div>
        </section>

        <aside className="checkpoint-panel">
          <p className="lesson-label">Human checkpoint</p>
          <span className="checkpoint-intent">
            {active.checkpointLabel ?? "Review the evidence"}
          </span>
          <p>{active.checkpoint}</p>
          <label className="evidence-field">
            <span>
              Record agent retrieval separately from checks a person performed
            </span>
            <textarea
              onChange={(event) => onEvidenceNote(event.target.value)}
              placeholder={"agent_retrieved: artefact or locator\nhuman_opened: source or output\nclaim_checked: result and remaining issue\n\nAn agent must leave the human fields blank."}
              rows={5}
              value={evidenceNote}
            />
          </label>
          <fieldset className="decision-field">
            <legend>Decision</legend>
            {(["ready", "revise", "stop"] as const).map((value) => (
              <label key={value}>
                <input
                  checked={decision === value}
                  name={`decision-${active.id}`}
                  onChange={() => onDecision(value)}
                  type="radio"
                  value={value}
                />
                <span>{value[0].toUpperCase() + value.slice(1)}</span>
              </label>
            ))}
          </fieldset>
          <button
            aria-pressed={approved}
            className={`approval-check ${approved ? "is-approved" : ""}`}
            disabled={!approved && !evidenceReady}
            onClick={onApprove}
            type="button"
          >
            <span>{approved ? <Check size={17} /> : null}</span>
            {approved
              ? "Checkpoint review recorded"
              : "Record checkpoint review"}
          </button>
          <button
            className="complete-button"
            disabled={!approved || decision !== "ready"}
            onClick={onComplete}
            type="button"
          >
            {complete ? "Reopen this stage" : "Complete this stage"}
          </button>
          {!approved ? (
            <small>
              Record a short evidence note and choose Ready, Revise, or Stop
              before recording this checkpoint review.
            </small>
          ) : decision !== "ready" ? (
            <small>
              The evidence decision is {decision}. Keep the stage open until
              the issue is resolved and the decision changes to Ready.
            </small>
          ) : null}

          <div className="lesson-sources">
            <span>Read the sources</span>
            <ul>
              {active.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} rel="noreferrer" target="_blank">
                    {source.title}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <details className="video-cue">
            <summary>Instructor cue</summary>
            <p>{active.videoCue}</p>
          </details>
        </aside>
      </div>

      <footer className="lesson-navigation">
        {previous ? (
          <button onClick={() => onSelect(previous)} type="button">
            <ArrowLeft size={18} />
            <span>
              Previous
              <strong>{previous.title}</strong>
            </span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button onClick={() => onSelect(next)} type="button">
            <span>
              Next
              <strong>{next.title}</strong>
            </span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <a href="#builder">
            <span>
              Next
              <strong>Build your plan</strong>
            </span>
            <ArrowRight size={18} />
          </a>
        )}
      </footer>
    </article>
  );
}

function WorkshopAssessment({
  answers,
  onAnswer,
  workshop,
}: {
  answers: Record<string, string>;
  onAnswer: (itemId: string, optionId: string) => void;
  workshop: Workshop;
}) {
  const attempted = workshop.assessment.filter((item) => answers[item.id]);
  const score = attempted.filter((item) =>
    item.options.find((option) => option.id === answers[item.id] && option.correct),
  ).length;

  return (
    <section className="workshop-assessment" id="applied-check">
      <div className="section-heading section-heading-wide">
        <p>Applied check</p>
        <h2>Choose what you would do next</h2>
        <span>
          These are decisions, not recall questions. Feedback appears after
          each answer and remains in your local export.
        </span>
      </div>
      <div className="assessment-list">
        {workshop.assessment.map((item, index) => {
          const selectedId = answers[item.id];
          const selected = item.options.find(
            (option) => option.id === selectedId,
          );
          return (
            <fieldset key={item.id}>
              <legend>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
              </legend>
              <div>
                {item.options.map((option) => (
                  <label
                    className={
                      selectedId === option.id
                        ? option.correct
                          ? "is-correct"
                          : "is-revise"
                        : ""
                    }
                    key={option.id}
                  >
                    <input
                      checked={selectedId === option.id}
                      name={`assessment-${item.id}`}
                      onChange={() => onAnswer(item.id, option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {selected ? (
                <p
                  className={selected.correct ? "feedback-correct" : "feedback-revise"}
                  role="status"
                >
                  <strong>{selected.correct ? "Ready." : "Revise."}</strong>{" "}
                  {selected.feedback}
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </div>
      <p className="assessment-score" aria-live="polite">
        {attempted.length === 0
          ? "No scenarios answered yet."
          : `${score} of ${attempted.length} attempted scenarios are ready.`}
      </p>
    </section>
  );
}

function WorkshopGlossary({ workshop }: { workshop: Workshop }) {
  return (
    <section className="workshop-glossary" id="glossary">
      <div className="section-heading section-heading-wide">
        <p>New to this?</p>
        <h2>Plain-language glossary</h2>
        <span>
          Open any term without leaving the tutorial. Definitions are scoped to
          how the term is used here.
        </span>
      </div>
      <div className="glossary-grid">
        {workshop.glossary.map((item) => (
          <details key={item.term}>
            <summary>{item.term}</summary>
            <p>{item.definition}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SourceLibrary({ workshop }: { workshop: Workshop }) {
  const sources = useMemo(() => {
    const all = [
      ...workshop.steps.flatMap((step) => step.sources),
      ...workshop.sourceLibrary,
    ];
    return Array.from(new Map(all.map((source) => [source.url, source])).values());
  }, [workshop]);

  return (
    <section className="source-library" id="sources">
      <div className="section-heading section-heading-wide">
        <p>Source library</p>
        <h2>Follow the evidence yourself</h2>
        <span>
          Source links reviewed 26 July 2026. Product capabilities and policies
          change, so open the source and check its current version before
          relying on it.
        </span>
      </div>
      <ol>
        {sources.map((source, index) => (
          <li key={source.url}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <a href={source.url} rel="noreferrer" target="_blank">
                {source.title}
                <ExternalLink size={14} />
              </a>
              {source.note ? <p>{source.note}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function NextWorkshop({ current }: { current: Workshop["slug"] }) {
  const routes = [
    {
      slug: "agentic-research",
      title: "Agentic AI in Research",
    },
    {
      slug: "interactive-paper",
      title: "Building a Website for Your Research",
    },
    {
      slug: "annotation-tools",
      title: "Developing Custom Annotation Tools",
    },
  ] as const;
  const index = routes.findIndex((route) => route.slug === current);
  const next = routes[(index + 1) % routes.length];

  return (
    <a
      className="next-workshop"
      href={WORKSHOP_RELEASES[next.slug].canonicalUrl}
    >
      <span>Continue to the next workshop</span>
      <strong>{next.title}</strong>
      <ArrowRight size={28} />
    </a>
  );
}
