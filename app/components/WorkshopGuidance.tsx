import type {
  GuidePath,
  StoredWorkshopProgress,
  Workshop,
  WorkshopGuidance,
  WorkshopRoute,
  WorkshopStep,
  WorkshopStepGuide,
} from "@/lib/types";
import { ExternalLink } from "./Icons";

const pathModeLabels: Record<GuidePath["mode"], string> = {
  hosted: "Hosted service",
  managed: "Institution-managed",
  local: "Local or offline",
};

export function ContextHelp({
  children,
  label,
}: {
  children: string;
  label: string;
}) {
  return (
    <details className="context-help">
      <summary aria-label={`What does ${label} mean?`}>
        <span aria-hidden="true">?</span>
      </summary>
      <p>{children}</p>
    </details>
  );
}

function routeMinutes(route: WorkshopRoute, workshop: Workshop) {
  return route.stepIds.reduce((total, id) => {
    const step = workshop.steps.find((candidate) => candidate.id === id);
    return total + (Number.parseInt(step?.duration ?? "0", 10) || 0);
  }, 0);
}

export function WorkflowNavigator({
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
  const chosenRoute = guidance.routes.find((route) => route.id === routeId);
  const selectedRoute = chosenRoute ?? guidance.routes[0];

  return (
    <section
      aria-labelledby="workflow-guide-title"
      className="workflow-guide"
    >
      <div className="workflow-guide-heading">
        <p>Choose your route</p>
        <h3 id="workflow-guide-title">Follow the whole lifecycle or focus first</h3>
        <span>
          The routes change the order of attention, not the scientific
          standard. You can open any stage at any time.
        </span>
      </div>

      <ol className="phase-map" aria-label="Beginning-to-end workflow">
        {guidance.phases.map((phase, index) => (
          <li key={phase.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong>{phase.title}</strong>
              <p>{phase.summary}</p>
            </div>
            <small>
              {phase.stepIds
                .map(
                  (id) =>
                    workshop.steps.findIndex((step) => step.id === id) + 1,
                )
                .join(" · ")}
            </small>
          </li>
        ))}
      </ol>

      <fieldset className="route-chooser">
        <legend>Pick the route closest to today&apos;s goal</legend>
        <div className="route-options">
          {guidance.routes.map((route) => (
            <label
              className={route.id === routeId ? "is-selected" : ""}
              key={route.id}
            >
              <input
                aria-controls="route-summary"
                checked={route.id === routeId}
                name="workshop-route"
                onChange={() => onChooseRoute(route)}
                type="radio"
                value={route.id}
              />
              <span>{routeMinutes(route, workshop)} min</span>
              <strong>{route.title}</strong>
              <small>{route.bestFor}</small>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="selected-route">
        <div aria-live="polite" id="route-summary">
          <span>{chosenRoute ? "Selected route" : "Suggested starting route"}</span>
          <h4>{selectedRoute.title}</h4>
          <p>{selectedRoute.description}</p>
        </div>
        <ol>
          {selectedRoute.stepIds.map((id, index) => {
            const step = workshop.steps.find((candidate) => candidate.id === id);
            if (!step) return null;
            return (
              <li key={id}>
                <button onClick={() => onSelect(step)} type="button">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step.title}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          aria-describedby="route-summary"
          className="start-route"
          onClick={() => onStartRoute(selectedRoute)}
          type="button"
        >
          Start this route
        </button>
      </div>
    </section>
  );
}

export function StageFieldGuide({
  checkedItems,
  guide,
  lastVerified,
  onPathChoice,
  onPracticeToggle,
  selectedPathId,
}: {
  checkedItems: string[];
  guide: WorkshopStepGuide;
  lastVerified: string;
  onPathChoice: (pathId: string) => void;
  onPracticeToggle: (itemId: string) => void;
  selectedPathId: string;
}) {
  const selectedPath = guide.paths.find((path) => path.id === selectedPathId);

  return (
    <details className="stage-field-guide">
      <summary className="stage-field-guide-summary">
        <div>
          <p className="lesson-label">Stage field guide</p>
          <strong>Compare approaches, terms and shortcuts</strong>
        </div>
        <small>Guidance checked {lastVerified}</small>
      </summary>
      <section
        aria-label="Compare approaches, terms and shortcuts"
        className="stage-field-guide-body"
      >
        <p className="field-guide-why">{guide.why}</p>

        <div className="field-guide-disclosures">
          <section aria-labelledby="terms-title">
            <h4 id="terms-title">Terms in this stage</h4>
            <div className="term-help-list">
              {guide.terms.map((term) => (
                <details className="term-help" key={term.label}>
                  <summary>
                    {term.label}
                    <span aria-hidden="true">?</span>
                  </summary>
                  <p>{term.definition}</p>
                </details>
              ))}
            </div>
          </section>

          <details className="researcher-tricks">
            <summary>Researcher tricks · {guide.tips.length}</summary>
            <div>
              {guide.tips.map((tip) => (
                <article key={tip.title}>
                  <h4>{tip.title}</h4>
                  <p>{tip.body}</p>
                </article>
              ))}
            </div>
          </details>
        </div>

        <fieldset className="path-chooser">
          <legend>Alternatives and tradeoffs</legend>
          <div className="path-chooser-help">
            <ContextHelp label="alternatives and tradeoffs">
              Each path must leave auditable evidence for the same decision and
              human checkpoint. The exact files, services, and implementation
              can differ. Paths without a link are design patterns to evaluate,
              not claims about a particular product.
            </ContextHelp>
          </div>
          <div className="path-options">
            {guide.paths.map((path) => (
              <label
                className={path.id === selectedPathId ? "is-selected" : ""}
                key={path.id}
              >
                <input
                  aria-controls="path-selection-detail"
                  checked={path.id === selectedPathId}
                  name={`delivery-path-${guide.paths[0].id}`}
                  onChange={() => onPathChoice(path.id)}
                  type="radio"
                  value={path.id}
                />
                <span>{pathModeLabels[path.mode]}</span>
                <strong>{path.title}</strong>
                <small>{path.bestFor}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <p
          aria-live="polite"
          className="path-selection-status"
          id="path-selection-detail"
        >
          {selectedPath
            ? `Selected path: ${selectedPath.title}. Open its details below.`
            : "No path selected. Compare the three options, then choose the one that matches your data boundary."}
        </p>

        {selectedPath ? (
          <details
            className="path-detail"
            key={selectedPath.id}
          >
            <summary>
              <span>{pathModeLabels[selectedPath.mode]}</span>
              <strong>{selectedPath.title}</strong>
              <small>Open operational details</small>
            </summary>
            <div className="path-detail-body">
              <p>{selectedPath.approach}</p>
              <dl>
                <div>
                  <dt>Data boundary</dt>
                  <dd>{selectedPath.dataBoundary}</dd>
                </div>
                <div>
                  <dt>Network</dt>
                  <dd>{selectedPath.network}</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>{selectedPath.cost}</dd>
                </div>
                <div>
                  <dt>Hardware</dt>
                  <dd>{selectedPath.hardware}</dd>
                </div>
                <div>
                  <dt>Keep as evidence</dt>
                  <dd>{selectedPath.evidence}</dd>
                </div>
              </dl>
              <div className="path-tradeoff">
                <strong>Tradeoff</strong>
                <p>{selectedPath.tradeoff}</p>
              </div>
              {selectedPath.sources.length ? (
                <ul className="path-sources">
                  {selectedPath.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noreferrer" target="_blank">
                        {source.title}
                        <ExternalLink size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </details>
        ) : null}

        <details className="try-now">
          <summary>
            <span>Try it now</span>
            <strong>{guide.tryNow.items.length} small checks</strong>
          </summary>
          <div>
            <p>{guide.tryNow.intro}</p>
            <fieldset>
              <legend>Complete this short practice</legend>
              {guide.tryNow.items.map((item) => (
                <label key={item.id}>
                  <input
                    checked={checkedItems.includes(item.id)}
                    onChange={() => onPracticeToggle(item.id)}
                    type="checkbox"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>
            <p className="try-now-evidence">
              <strong>Done when</strong>
              {guide.tryNow.evidence}
            </p>
          </div>
        </details>
      </section>
    </details>
  );
}

export function routeProgress(
  workshop: Workshop,
  guidance: WorkshopGuidance,
  progress: StoredWorkshopProgress,
) {
  const route =
    guidance.routes.find((candidate) => candidate.id === progress.routeId) ??
    guidance.routes[0];
  const completed = route.stepIds.filter((id) =>
    progress.completed.includes(id),
  ).length;
  return {
    route,
    selected: route.id === progress.routeId,
    completed,
    percent: Math.round((completed / route.stepIds.length) * 100),
    steps: new Set(route.stepIds),
    total: route.stepIds.length,
    workshopTotal: workshop.steps.length,
  };
}
