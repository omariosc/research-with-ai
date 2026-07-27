"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  StoredWorkshopProgress,
  StoredWorkshopWorkspace,
  Workshop,
  WorkshopGuidance,
  WorkshopRoute,
  WorkshopStep,
  WorkshopStepGuide,
} from "@/lib/types";
import { guidanceByWorkshop } from "@/lib/content/guidance";
import {
  TUTORIAL_HOMEPAGE,
  WORKSHOP_RELEASES,
  workshopRelease,
} from "@/lib/version";
import {
  blankProgress,
  clearBuilderDraft,
  clearProgress,
  copyText,
  createWorkshopProject,
  defaultWorkspace,
  downloadText,
  readProgress,
  readWorkspace,
  writeProgress,
  writeWorkspace,
} from "@/lib/storage";
import { routeNeighbours } from "@/lib/workshop-navigation";
import {
  AnnotationSpecBuilder,
  AgenticPlanBuilder,
  PaperSiteBuilder,
} from "./Builders";
import { AnnotationShowcase } from "./AnnotationShowcase";
import { ConferencePlanBuilder } from "./ConferencePlanBuilder";
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
import { ProjectWorkspace } from "./ProjectWorkspace";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./HomeClient";
import {
  DEEP_DIVE_CHECK_IDS,
  DEEP_DIVE_CHECK_ITEMS,
  WorkshopDeepDive,
} from "./WorkshopDeepDives";
import {
  ContextHelp,
  StageFieldGuide,
  WorkflowNavigator,
  routeProgress,
} from "./WorkshopGuidance";

function toggleItem(items: string[], id: string) {
  return items.includes(id)
    ? items.filter((item) => item !== id)
    : [...items, id];
}

export function WorkshopClient({ workshop }: { workshop: Workshop }) {
  const firstStep = workshop.steps[0].id;
  const guidance = guidanceByWorkshop[workshop.slug];
  const progressScope = useMemo(
    () => ({
      stepIds: workshop.steps.map((step) => step.id),
      routeIds: guidance.routes.map((route) => route.id),
      pathIds: Object.fromEntries(
        Object.entries(guidance.steps).map(([stepId, guide]) => [
          stepId,
          guide.paths.map((path) => path.id),
        ]),
      ),
      practiceIds: Object.fromEntries(
        Object.entries(guidance.steps).map(([stepId, guide]) => [
          stepId,
          guide.tryNow.items.map((item) => item.id),
        ]),
      ),
      bonusIds: DEEP_DIVE_CHECK_IDS[workshop.slug],
      assessmentItemIds: workshop.assessment.map((item) => item.id),
    }),
    [guidance, workshop],
  );
  const [progress, setProgress] = useState<StoredWorkshopProgress>(() =>
    blankProgress(firstStep),
  );
  const [workspace, setWorkspace] = useState<StoredWorkshopWorkspace>(
    defaultWorkspace,
  );
  const [builderRevision, setBuilderRevision] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedWorkspace = readWorkspace(workshop.slug);
    const stored = readProgress(
      workshop.slug,
      firstStep,
      progressScope,
      storedWorkspace.activeProjectId,
    );
    queueMicrotask(() => {
      setWorkspace(storedWorkspace);
      setProgress(stored);
      setHydrated(true);
    });
  }, [firstStep, progressScope, workshop.slug]);

  const save = useCallback(
    (next: StoredWorkshopProgress) => {
      const dated = { ...next, updatedAt: new Date().toISOString() };
      setProgress(dated);
      writeProgress(workshop.slug, dated, workspace.activeProjectId);
    },
    [workspace.activeProjectId, workshop.slug],
  );

  const activeProject =
    workspace.projects.find(
      (project) => project.id === workspace.activeProjectId,
    ) ?? workspace.projects[0];

  const activeIndex = Math.max(
    0,
    workshop.steps.findIndex((step) => step.id === progress.activeStep),
  );
  const active = workshop.steps[activeIndex];
  const currentRoute = routeProgress(workshop, guidance, progress);
  const activeTrackIndex = currentRoute.route.stepIds.indexOf(active.id);
  const { next: nextStep, previous: previousStep } = routeNeighbours(
    workshop,
    currentRoute.route,
    active.id,
  );
  const builderLabel = {
    "agentic-research": "Build research plan",
    "interactive-paper": "Build website brief",
    "annotation-tools": "Build annotation specification",
    "ai-healthcare-conference": "Build conference plan",
  }[workshop.slug];
  const release = workshopRelease(workshop.slug);
  const tutorialStatus =
    release.status === "released"
      ? `v${release.version}`
      : "in development, not part of v1.3.0";
  const structuredCitations = [
    ...workshop.sourceLibrary,
    ...workshop.steps.flatMap((step) => step.sources),
    ...Object.values(guidance.steps).flatMap((guide) =>
      guide.paths.flatMap((path) => path.sources),
    ),
  ].map((source) => source.url);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: workshop.title,
    description: workshop.description,
    url: release.canonicalUrl,
    ...(release.status === "released"
      ? {
          version: `v${release.version}`,
          datePublished: "2026-07-26",
        }
      : {
          creativeWorkStatus: "Draft",
        }),
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
    citation: [...new Set(structuredCitations)],
  }).replaceAll("<", "\\u003c");

  function focusLesson() {
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

  function focusWorkbench() {
    window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("#workbench-title");
      heading?.focus({ preventScroll: true });
      document.querySelector(".workbench")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  function revealStageInNavigator(stepId: string) {
    window.requestAnimationFrame(() => {
      const button = Array.from(
        document.querySelectorAll<HTMLButtonElement>("[data-stage-id]"),
      ).find((candidate) => candidate.dataset.stageId === stepId);
      const rail = button?.closest("ol");
      if (!button || !rail || rail.scrollWidth <= rail.clientWidth) return;
      rail.scrollTo({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        left: button.offsetLeft - (rail.clientWidth - button.clientWidth) / 2,
      });
    });
  }

  function selectStep(step: WorkshopStep) {
    save({ ...progress, activeStep: step.id });
    revealStageInNavigator(step.id);
    focusLesson();
  }

  function chooseRoute(route: WorkshopRoute) {
    save({ ...progress, routeId: route.id });
  }

  function startRoute(route: WorkshopRoute) {
    const step = workshop.steps.find(
      (candidate) => candidate.id === route.stepIds[0],
    );
    if (!step) return;
    save({ ...progress, routeId: route.id, activeStep: step.id });
    focusWorkbench();
  }

  function reset() {
    if (
      !window.confirm(
        `Reset the checklist, decisions, assessment, and builder drafts for "${activeProject.name}"? The project name and notes will be kept.`,
      )
    ) {
      return;
    }
    clearProgress(workshop.slug, activeProject.id);
    clearBuilderDraft(workshop.slug, activeProject.id);
    setProgress(blankProgress(firstStep));
    setBuilderRevision((value) => value + 1);
  }

  function persistWorkspace(next: StoredWorkshopWorkspace) {
    setWorkspace(next);
    writeWorkspace(workshop.slug, next);
  }

  function selectProject(projectId: string) {
    if (!workspace.projects.some((project) => project.id === projectId)) return;
    const next = { ...workspace, activeProjectId: projectId };
    persistWorkspace(next);
    setProgress(
      readProgress(workshop.slug, firstStep, progressScope, projectId),
    );
    setBuilderRevision(0);
  }

  function createProject(name: string) {
    const project = createWorkshopProject(name);
    const next = {
      ...workspace,
      activeProjectId: project.id,
      projects: [...workspace.projects, project],
    };
    persistWorkspace(next);
    setProgress(blankProgress(firstStep));
    setBuilderRevision(0);
  }

  function updateActiveProject(
    update: (project: typeof activeProject) => typeof activeProject,
  ) {
    const now = new Date().toISOString();
    persistWorkspace({
      ...workspace,
      projects: workspace.projects.map((project) =>
        project.id === activeProject.id
          ? { ...update(project), updatedAt: now }
          : project,
      ),
    });
  }

  function exportNotes() {
    const selectedRoute = guidance.routes.find(
      (route) => route.id === progress.routeId,
    );
    const text = `# ${workshop.title}: working record

Project: ${activeProject.name}
Project ID: ${activeProject.id}

Generated: ${new Date().toISOString()}
Tutorial status: ${tutorialStatus}
Canonical tutorial: ${release.canonicalUrl}
Selected route: ${selectedRoute?.title ?? "not selected"}

## Project notes

${activeProject.notes.trim() || "No project notes recorded."}

${workshop.steps
  .map(
    (step, index) => {
      const guide = guidance.steps[step.id];
      const selectedPath =
        guide.paths.find(
          (path) => path.id === progress.pathChoices[step.id],
        );
      const checked = progress.practiceChecks[step.id] ?? [];
      const sources = [
        ...step.sources,
        ...(selectedPath?.sources ?? []),
      ].filter(
        (source, sourceIndex, entries) =>
          entries.findIndex((entry) => entry.url === source.url) ===
          sourceIndex,
      );
      return `## ${index + 1}. ${step.title}

- [${progress.completed.includes(step.id) ? "x" : " "}] Stage complete
- [${progress.approved.includes(step.id) ? "x" : " "}] Human checkpoint completed
- **Artefact:** \`${step.output}\`
- **Action:** ${step.action}
- **Checkpoint:** ${step.checkpoint}
- **Decision:** ${progress.decisions[step.id] ?? "not recorded"}
- **Working path:** ${selectedPath?.title ?? "not selected"}
- **Path tradeoff:** ${selectedPath?.tradeoff ?? "Choose a path before recording its tradeoff."}
- **Evidence to keep:** ${selectedPath?.evidence ?? "Choose a path before recording its evidence target."}

### Short practice

${guide.tryNow.items
  .map(
    (item) =>
      `- [${checked.includes(item.id) ? "x" : " "}] ${item.label}`,
  )
  .join("\n")}

Done when: ${guide.tryNow.evidence}

### Researcher tricks

${guide.tips.map((tip) => `- **${tip.title}:** ${tip.body}`).join("\n")}

### Evidence note

${progress.evidenceNotes[step.id] || "No evidence note recorded."}

### Example prompt

\`\`\`text
${step.prompt}
\`\`\`

### Sources

${sources.map((source) => `- [${source.title}](${source.url})`).join("\n")}
`;
    },
  )
  .join("\n")}

## Deep-dive checklist

${DEEP_DIVE_CHECK_ITEMS[workshop.slug]
  .map(
    (item) =>
      `- [${progress.bonusChecks.includes(item.id) ? "x" : " "}] ${item.label}`,
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

This export records the workshop checklist, not proof that the scientific checks were done. It does not include the separate builder draft. Download that output from the builder. Keep the actual sources, test outputs, approvals, and decision records with the project.
`;
    const safeProjectName =
      activeProject.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50) || "project";
    downloadText(
      `${workshop.slug}-${safeProjectName}-working-record.md`,
      text,
    );
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
            <button
              aria-label="Export workshop record"
              onClick={exportNotes}
              title="Export workshop record"
              type="button"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              aria-label="Reset workshop progress"
              onClick={reset}
              title="Reset workshop progress"
              type="button"
            >
              <Refresh size={16} />
              <span>Reset</span>
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
            <span>Full lifecycle outcome</span>
            <p>{workshop.promise}</p>
            <small>Full workshop: {workshop.duration}</small>
          </aside>
        </section>

        <TutorialOrienter />

        <ProjectWorkspace
          activeProject={activeProject}
          onCreate={createProject}
          onRename={(name) =>
            updateActiveProject((project) => ({ ...project, name }))
          }
          onSelect={selectProject}
          onUpdateNotes={(notes) =>
            updateActiveProject((project) => ({ ...project, notes }))
          }
          workspace={workspace}
        />

        <WorkshopPrimer
          guidance={guidance}
          onChooseRoute={chooseRoute}
          onSelect={selectStep}
          onStartRoute={startRoute}
          routeId={progress.routeId}
          workshop={workshop}
        />

        <section
          aria-labelledby="workbench-title"
          className="workbench"
          id="workbench"
        >
          <div className="workbench-heading">
            <p>Core workshop</p>
            <h2 id="workbench-title" tabIndex={-1}>
              Work one stage at a time
            </h2>
            <span>
              Stages in your workshop track are marked in the navigator. Do the
              action, save the output, record the evidence, and let a person
              choose Ready, Revise, or Stop.
            </span>
          </div>
          <div className="workbench-progress">
            <div>
              <span>
                {currentRoute.selected
                  ? `Your track: ${currentRoute.route.title}`
                  : `Suggested track: ${currentRoute.route.title}`}
              </span>
              <strong>
                {currentRoute.completed} of {currentRoute.total}
              </strong>
              <small>
                Entire workshop, including optional extra stages:{" "}
                {progress.completed.length} of {currentRoute.workshopTotal}
              </small>
            </div>
            <div
              aria-label={`${currentRoute.percent} percent complete on ${currentRoute.route.title}`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={currentRoute.percent}
              className="progress-track"
              role="progressbar"
            >
              <span
                style={{
                  width: hydrated ? `${currentRoute.percent}%` : "0%",
                }}
              />
            </div>
            <span className="overall-progress">
              {currentRoute.percent}% of track
            </span>
          </div>

          <div className="workbench-body">
            <nav className="step-rail" aria-label="Workshop stages">
              <div className="step-rail-heading">
                <strong>Stage navigator</strong>
                <span>
                  Track stages are marked. Scroll sideways on smaller screens.
                </span>
              </div>
              <ol>
                {workshop.steps.map((step, index) => {
                  const complete = progress.completed.includes(step.id);
                  const selected = active.id === step.id;
                  const inRoute = currentRoute.steps.has(step.id);
                  return (
                    <li key={step.id}>
                      <button
                        aria-current={selected ? "step" : undefined}
                        className={[
                          selected ? "is-active" : "",
                          inRoute ? "is-route-step" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        data-stage-id={step.id}
                        onClick={() => selectStep(step)}
                        type="button"
                      >
                        <span className={complete ? "is-complete" : ""}>
                          {complete ? <Check size={15} /> : index + 1}
                        </span>
                        <div>
                          <strong>{step.title}</strong>
                          <small>{step.output}</small>
                          <em className={inRoute ? "is-track-stage" : ""}>
                            {inRoute ? "In your track" : "Extra stage"}
                          </em>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <a className="rail-builder-link" href="#builder">
                {builderLabel}
                <ArrowRight size={16} />
              </a>
            </nav>
            <LessonPanel
              active={active}
              activeIndex={activeIndex}
              activeTrackIndex={activeTrackIndex}
              approved={progress.approved.includes(active.id)}
              builderLabel={builderLabel}
              complete={progress.completed.includes(active.id)}
              count={workshop.steps.length}
              currentTrackTitle={currentRoute.route.title}
              decision={progress.decisions[active.id] ?? ""}
              evidenceNote={progress.evidenceNotes[active.id] ?? ""}
              guide={guidance.steps[active.id]}
              key={active.id}
              lastVerified={guidance.lastVerified}
              next={nextStep}
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
              onPathChoice={(pathId) =>
                save({
                  ...progress,
                  approved: progress.approved.filter(
                    (id) => id !== active.id,
                  ),
                  completed: progress.completed.filter(
                    (id) => id !== active.id,
                  ),
                  pathChoices: {
                    ...progress.pathChoices,
                    [active.id]: pathId,
                  },
                })
              }
              onPracticeToggle={(itemId) =>
                save({
                  ...progress,
                  practiceChecks: {
                    ...progress.practiceChecks,
                    [active.id]: toggleItem(
                      progress.practiceChecks[active.id] ?? [],
                      itemId,
                    ),
                  },
                })
              }
              onSelect={selectStep}
              practiceChecks={progress.practiceChecks[active.id] ?? []}
              previous={previousStep}
              selectedPathId={progress.pathChoices[active.id] ?? ""}
              trackCount={currentRoute.total}
            />
          </div>
        </section>

        {workshop.slug === "agentic-research" ? (
          <AgenticPlanBuilder
            key={`${activeProject.id}:${builderRevision}`}
            projectId={activeProject.id}
          />
        ) : null}
        {workshop.slug === "interactive-paper" ? (
          <PaperSiteBuilder
            key={`${activeProject.id}:${builderRevision}`}
            projectId={activeProject.id}
          />
        ) : null}
        {workshop.slug === "annotation-tools" ? (
          <div key={`${activeProject.id}:${builderRevision}`}>
            <AnnotationShowcase />
            <AnnotationSpecBuilder projectId={activeProject.id} />
          </div>
        ) : null}
        {workshop.slug === "ai-healthcare-conference" ? (
          <ConferencePlanBuilder
            key={`${activeProject.id}:${builderRevision}`}
            projectId={activeProject.id}
          />
        ) : null}

        <section
          aria-labelledby="extended-learning-title"
          className="extended-learning-heading"
        >
          <p>Optional, after the core stages</p>
          <h2 id="extended-learning-title">
            See the workflow in practice
          </h2>
          <span>
            The worked evidence and extended reading below add context. They do
            not block completion of your workshop track.
          </span>
        </section>
        {workshop.slug !== "ai-healthcare-conference" ? (
          <CaseStudy workshop={workshop} />
        ) : null}
        <WorkshopDeepDive
          checked={progress.bonusChecks}
          onToggle={(id) =>
            save({
              ...progress,
              bonusChecks: toggleItem(progress.bonusChecks, id),
            })
          }
          slug={workshop.slug}
        />

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
        <SourceLibrary guidance={guidance} workshop={workshop} />
        <NextWorkshop current={workshop.slug} />
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}

function TutorialOrienter() {
  const items = [
    {
      title: "Project",
      body: "Name the work and keep its notes separate from other projects.",
    },
    {
      title: "Workshop track",
      body: "Choose the subset of stages that matches today’s goal.",
    },
    {
      title: "Stage",
      body: "Do one action, save its output, and use optional help when needed.",
    },
    {
      title: "Human checkpoint",
      body: "Record evidence, decide Ready, Revise, or Stop, then export.",
    },
  ];

  return (
    <section
      aria-labelledby="tutorial-orienter-title"
      className="tutorial-orienter"
    >
      <div>
        <p>How this tutorial works</p>
        <h2 id="tutorial-orienter-title">
          One project, one track, one stage at a time
        </h2>
      </div>
      <ol>
        {items.map((item, index) => (
          <li key={item.title}>
            <span>{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="tutorial-orienter-note">
        Your workshop record and builder output are separate downloads. Both
        stay in this browser until you export them.
      </p>
    </section>
  );
}

function WorkshopPrimer({
  guidance,
  onChooseRoute,
  onSelect,
  onStartRoute,
  routeId,
  workshop,
}: {
  guidance: WorkshopGuidance;
  onChooseRoute: (route: WorkshopRoute) => void;
  onSelect: (step: WorkshopStep) => void;
  onStartRoute: (route: WorkshopRoute) => void;
  routeId: string;
  workshop: Workshop;
}) {
  return (
    <section className="workshop-primer" aria-labelledby="primer-title">
      <div className="primer-heading">
        <p>Choose a workshop track</p>
        <h2 id="primer-title">Start with today&apos;s goal</h2>
        <span>
          Designed for {workshop.audience} The full guided workshop takes{" "}
          {workshop.duration}. {workshop.projectTime}
        </span>
      </div>
      <WorkflowNavigator
        guidance={guidance}
        onChooseRoute={onChooseRoute}
        onSelect={onSelect}
        onStartRoute={onStartRoute}
        routeId={routeId}
        workshop={workshop}
      />
      <details className="primer-readiness">
        <summary>
          <span>Preparation and full outcomes</span>
          <strong>Check what you need before doing the whole lifecycle</strong>
        </summary>
        <div className="primer-grid primer-grid-basics">
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
        </div>
      </details>
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

function DecisionGuidance({
  active,
  decision,
  next,
}: {
  active: WorkshopStep;
  decision: "ready" | "revise" | "stop";
  next?: WorkshopStep;
}) {
  const copy = {
    ready: {
      when: `Use Ready only when the evidence note supports this checkpoint: ${active.checkpoint}`,
      next: next
        ? `Record the review, complete this stage, then continue to ${next.title}.`
        : "Record the review, complete this stage, then inspect the final export.",
    },
    revise: {
      when: "Use Revise when evidence exists but the checkpoint is not yet satisfied.",
      next: `Keep the stage open, correct ${active.output}, rerun the relevant check, and update the evidence note.`,
    },
    stop: {
      when: `Use Stop when the safety boundary applies or the evidence cannot be checked: ${active.watchFor}`,
      next: "Do not continue automatically. Preserve the record and ask the accountable researcher to resolve the boundary.",
    },
  }[decision];

  return (
    <div
      aria-live="polite"
      className={`decision-guidance decision-${decision}`}
    >
      <strong>{decision[0].toUpperCase() + decision.slice(1)}</strong>
      <p>
        <span>When this applies</span>
        {copy.when}
      </p>
      <p>
        <span>Next action</span>
        {copy.next}
      </p>
    </div>
  );
}

function LessonPanel({
  active,
  activeIndex,
  activeTrackIndex,
  approved,
  builderLabel,
  complete,
  count,
  currentTrackTitle,
  decision,
  evidenceNote,
  guide,
  lastVerified,
  next,
  onApprove,
  onComplete,
  onDecision,
  onEvidenceNote,
  onPathChoice,
  onPracticeToggle,
  onSelect,
  practiceChecks,
  previous,
  selectedPathId,
  trackCount,
}: {
  active: WorkshopStep;
  activeIndex: number;
  activeTrackIndex: number;
  approved: boolean;
  builderLabel: string;
  complete: boolean;
  count: number;
  currentTrackTitle: string;
  decision: "" | "ready" | "revise" | "stop";
  evidenceNote: string;
  guide: WorkshopStepGuide;
  lastVerified: string;
  next?: WorkshopStep;
  onApprove: () => void;
  onComplete: () => void;
  onDecision: (decision: "ready" | "revise" | "stop") => void;
  onEvidenceNote: (evidenceNote: string) => void;
  onPathChoice: (pathId: string) => void;
  onPracticeToggle: (itemId: string) => void;
  onSelect: (step: WorkshopStep) => void;
  practiceChecks: string[];
  previous?: WorkshopStep;
  selectedPathId: string;
  trackCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const evidenceReady = evidenceNote.trim().length >= 20 && decision !== "";

  return (
    <article className="lesson-panel">
      <header className="lesson-header">
        <div>
          <span>
            {activeTrackIndex >= 0
              ? `${currentTrackTitle}: track stage ${activeTrackIndex + 1} of ${trackCount} · full workshop stage ${activeIndex + 1} of ${count}`
              : `Extra stage outside ${currentTrackTitle} · full workshop stage ${activeIndex + 1} of ${count}`}
            {active.duration ? ` · ${active.duration}` : ""}
          </span>
          <h2 id="lesson-heading" tabIndex={-1}>
            {active.title}
          </h2>
          <p>{active.summary}</p>
        </div>
        <div className="lesson-output">
          <div className="label-with-help">
            <span>Output to save</span>
            <ContextHelp label="output to save">
              Save this named artefact with the project so another person can
              inspect the decision later.
            </ContextHelp>
          </div>
          <code>{active.output}</code>
        </div>
      </header>

      <div className="lesson-content-grid">
        <section className="lesson-action">
          <p className="lesson-label">1. Do the work</p>
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
          <StageFieldGuide
            checkedItems={practiceChecks}
            guide={guide}
            lastVerified={lastVerified}
            onPathChoice={onPathChoice}
            onPracticeToggle={onPracticeToggle}
            selectedPathId={selectedPathId}
          />
          <div className="watch-note">
            <span>Watch for</span>
            <p>{active.watchFor}</p>
          </div>
        </section>

        <aside className="checkpoint-panel">
          <div className="label-with-help checkpoint-label">
            <p className="lesson-label">2 to 5. Human checkpoint</p>
            <ContextHelp label="Human checkpoint">
              A named person reviews the evidence. The agent cannot approve its
              own work.
            </ContextHelp>
          </div>
          <span className="checkpoint-intent">
            {active.checkpointLabel ?? "Review the evidence"}
          </span>
          <p>{active.checkpoint}</p>
          <label className="evidence-field">
            <span>
              <strong>2. Evidence note</strong>
              Record what was retrieved and what a person checked
            </span>
            <textarea
              onChange={(event) => onEvidenceNote(event.target.value)}
              placeholder={"agent_retrieved: artefact or locator\nhuman_opened: source or output\nclaim_checked: result and remaining issue\n\nAn agent must leave the human fields blank."}
              rows={5}
              value={evidenceNote}
            />
          </label>
          <div className="checkpoint-help">
            <span>Evidence note help</span>
            <ContextHelp label="Evidence note">
              Name the source or output, the check performed, the result, and
              anything still unresolved.
            </ContextHelp>
          </div>
          <fieldset className="decision-field">
            <legend>3. Human decision</legend>
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
          <div className="checkpoint-help decision-help">
            <span>Decision help</span>
            <ContextHelp label="Decision">
              Ready can proceed. Revise needs another pass. Stop records a
              boundary that prevents safe continuation.
            </ContextHelp>
          </div>
          {decision ? (
            <DecisionGuidance active={active} decision={decision} next={next} />
          ) : null}
          <button
            aria-pressed={approved}
            className={`approval-check ${approved ? "is-approved" : ""}`}
            disabled={!approved && !evidenceReady}
            onClick={onApprove}
            type="button"
          >
            <span>{approved ? <Check size={17} /> : null}</span>
            {approved
              ? "4. Human review recorded"
              : "4. Record human review"}
          </button>
          <button
            className="complete-button"
            disabled={!approved || decision !== "ready"}
            onClick={onComplete}
            type="button"
          >
            {complete ? "5. Reopen this stage" : "5. Complete this stage"}
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
              {complete ? "Next stage" : "Continue, this stage stays open"}
              <strong>{next.title}</strong>
            </span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <a href="#builder">
            <span>
              Next
              <strong>{builderLabel}</strong>
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

function SourceLibrary({
  guidance,
  workshop,
}: {
  guidance: WorkshopGuidance;
  workshop: Workshop;
}) {
  const sources = useMemo(() => {
    const all = [
      ...workshop.steps.flatMap((step) => step.sources),
      ...workshop.sourceLibrary,
      ...Object.values(guidance.steps).flatMap((guide) =>
        guide.paths.flatMap((path) => path.sources),
      ),
    ];
    return Array.from(new Map(all.map((source) => [source.url, source])).values());
  }, [guidance, workshop]);

  return (
    <section className="source-library" id="sources">
      <div className="section-heading section-heading-wide">
        <p>Source library</p>
        <h2>Follow the evidence yourself</h2>
        <span>
          This includes the stage instructions and every cited alternative.
          Source links reviewed 26 July 2026. Product capabilities and policies
          change, so open the source and check its current version before relying
          on it.
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
    {
      slug: "ai-healthcare-conference",
      title: "Run an AI in Healthcare Conference",
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
