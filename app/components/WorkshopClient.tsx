"use client";

import Link from "next/link";
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
  TUTORIAL_VERSION_LABEL,
  workshopRelease,
} from "@/lib/version";
import {
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
    completed: [],
    approved: [],
    activeStep: firstStep,
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

  function selectStep(step: WorkshopStep) {
    save({ ...progress, activeStep: step.id });
    document
      .querySelector(".lesson-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    if (!window.confirm("Clear this workshop's saved progress?")) return;
    clearProgress(workshop.slug);
    setProgress({
      completed: [],
      approved: [],
      activeStep: firstStep,
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

### Example prompt

\`\`\`text
${step.prompt}
\`\`\`

### Sources

${step.sources.map((source) => `- [${source.title}](${source.url})`).join("\n")}
`,
  )
  .join("\n")}

## Reminder

This export records a teaching checklist, not proof that the scientific checks were done. Keep the actual sources, test outputs, approvals, and decision records with the project.
`;
    downloadText(`${workshop.slug}-working-record.md`, text);
  }

  return (
    <div className={`site-frame workshop-theme accent-${workshop.accent}`}>
      <SiteNav active={workshop.slug} />
      <main className="workshop-main">
        <header className="workshop-topbar">
          <div>
            <Link href="/">Overview</Link>
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
              next={workshop.steps[activeIndex + 1]}
              onApprove={() =>
                save({
                  ...progress,
                  approved: toggleItem(progress.approved, active.id),
                })
              }
              onComplete={() =>
                save({
                  ...progress,
                  completed: toggleItem(progress.completed, active.id),
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

        <SourceLibrary workshop={workshop} />
        <NextWorkshop current={workshop.slug} />
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}

function LessonPanel({
  active,
  activeIndex,
  approved,
  complete,
  count,
  next,
  onApprove,
  onComplete,
  onSelect,
  previous,
}: {
  active: WorkshopStep;
  activeIndex: number;
  approved: boolean;
  complete: boolean;
  count: number;
  next?: WorkshopStep;
  onApprove: () => void;
  onComplete: () => void;
  onSelect: (step: WorkshopStep) => void;
  previous?: WorkshopStep;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <article className="lesson-panel">
      <header className="lesson-header">
        <div>
          <span>
            Stage {activeIndex + 1} of {count}
          </span>
          <h2>{active.title}</h2>
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
          <p>{active.checkpoint}</p>
          <button
            aria-pressed={approved}
            className={`approval-check ${approved ? "is-approved" : ""}`}
            onClick={onApprove}
            type="button"
          >
            <span>{approved ? <Check size={17} /> : null}</span>
            {approved ? "Evidence checked" : "Mark evidence checked"}
          </button>
          <button
            className="complete-button"
            disabled={!approved}
            onClick={onComplete}
            type="button"
          >
            {complete ? "Reopen this stage" : "Complete this stage"}
          </button>
          {!approved ? (
            <small>Complete the human check before closing the stage.</small>
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

          <div className="video-cue">
            <span>For your recording</span>
            <p>{active.videoCue}</p>
          </div>
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
          Product capabilities and policies change. Open the sources, note the
          date, and check the current version before relying on them.
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
    <Link className="next-workshop" href={`/${next.slug}`}>
      <span>Continue to the next workshop</span>
      <strong>{next.title}</strong>
      <ArrowRight size={28} />
    </Link>
  );
}
