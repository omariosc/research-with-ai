import assert from "node:assert/strict";
import test from "node:test";
import { agenticResearch } from "../lib/content/agentic.ts";
import { annotationTools } from "../lib/content/annotation.ts";
import { aiHealthcareConference } from "../lib/content/conference.ts";
import { interactivePaper } from "../lib/content/paper.ts";
import { agenticGuidance } from "../lib/content/guidance/agentic.ts";
import { annotationGuidance } from "../lib/content/guidance/annotation.ts";
import { conferenceGuidance } from "../lib/content/guidance/conference.ts";
import { paperGuidance } from "../lib/content/guidance/paper.ts";
import { routeNeighbours } from "../lib/workshop-navigation.ts";

const workshops = [
  { workshop: agenticResearch, guidance: agenticGuidance },
  { workshop: interactivePaper, guidance: paperGuidance },
  { workshop: annotationTools, guidance: annotationGuidance },
  { workshop: aiHealthcareConference, guidance: conferenceGuidance },
];

const urlSafeId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const pathModes = ["hosted", "managed", "local"];
const pathTextFields = [
  "title",
  "bestFor",
  "approach",
  "tradeoff",
  "dataBoundary",
  "network",
  "cost",
  "hardware",
  "evidence",
];

function assertNonblank(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.notEqual(value.trim(), "", `${label} must not be blank`);
}

function assertUnique(values, label) {
  assert.equal(
    new Set(values).size,
    values.length,
    `${label} must not contain duplicates`,
  );
}

function validateGuidance(workshop, guidance) {
  const label = workshop.slug;
  const stepIds = workshop.steps.map((step) => step.id);
  const stepOrder = new Map(stepIds.map((id, index) => [id, index]));
  const guideIds = Object.keys(guidance.steps);

  assert.equal(stepIds.length, 10, `${label} must have ten workshop steps`);
  assertUnique(stepIds, `${label} workshop step IDs`);
  assert.deepEqual(
    [...guideIds].sort(),
    [...stepIds].sort(),
    `${label} guidance keys must exactly match its workshop steps`,
  );

  assert.match(
    guidance.lastVerified,
    /^\d{4}-\d{2}-\d{2}$/,
    `${label} lastVerified must be an ISO date`,
  );

  assert.equal(guidance.phases.length, 5, `${label} must have five phases`);
  const phaseIds = guidance.phases.map((phase) => phase.id);
  assertUnique(phaseIds, `${label} phase IDs`);
  const phasedSteps = guidance.phases.flatMap((phase, phaseIndex) => {
    assertNonblank(phase.id, `${label} phase ${phaseIndex} ID`);
    assert.match(phase.id, urlSafeId, `${label} phase IDs must be URL-safe`);
    assertNonblank(phase.title, `${label} phase ${phase.id} title`);
    assertNonblank(phase.summary, `${label} phase ${phase.id} summary`);
    assert.ok(
      phase.stepIds.length > 0,
      `${label} phase ${phase.id} must contain a step`,
    );
    for (const stepId of phase.stepIds) {
      assert.ok(
        stepOrder.has(stepId),
        `${label} phase ${phase.id} references unknown step ${stepId}`,
      );
    }
    return phase.stepIds;
  });
  assertUnique(phasedSteps, `${label} phased step IDs`);
  assert.deepEqual(
    [...phasedSteps].sort(),
    [...stepIds].sort(),
    `${label} phases must cover every step exactly once`,
  );

  assert.equal(guidance.routes.length, 4, `${label} must have four routes`);
  const routeIds = guidance.routes.map((route) => route.id);
  assertUnique(routeIds, `${label} route IDs`);
  for (const route of guidance.routes) {
    assert.match(route.id, urlSafeId, `${label} route IDs must be URL-safe`);
    assertNonblank(route.title, `${label} route ${route.id} title`);
    assertNonblank(route.description, `${label} route ${route.id} description`);
    assertNonblank(route.bestFor, `${label} route ${route.id} bestFor`);
    assert.ok(
      route.stepIds.length > 0,
      `${label} route ${route.id} must contain a step`,
    );
    assertUnique(route.stepIds, `${label} route ${route.id} step IDs`);

    const indices = route.stepIds.map((stepId) => {
      assert.ok(
        stepOrder.has(stepId),
        `${label} route ${route.id} references unknown step ${stepId}`,
      );
      return stepOrder.get(stepId);
    });
    for (let index = 1; index < indices.length; index += 1) {
      assert.ok(
        indices[index] > indices[index - 1],
        `${label} route ${route.id} steps must follow workshop order`,
      );
    }
  }

  const pathIds = [];
  for (const stepId of stepIds) {
    const guide = guidance.steps[stepId];
    assertNonblank(guide.why, `${label} guide ${stepId} why`);

    assert.equal(
      guide.terms.length,
      2,
      `${label} guide ${stepId} must have exactly two terms`,
    );
    const termLabels = guide.terms.map((term, index) => {
      assertNonblank(
        term.label,
        `${label} guide ${stepId} term ${index} label`,
      );
      assertNonblank(
        term.definition,
        `${label} guide ${stepId} term ${index} definition`,
      );
      return term.label.trim().toLocaleLowerCase("en-GB");
    });
    assertUnique(termLabels, `${label} guide ${stepId} term labels`);

    assert.equal(
      guide.tips.length,
      2,
      `${label} guide ${stepId} must have exactly two tips`,
    );
    for (const [index, tip] of guide.tips.entries()) {
      assertNonblank(tip.title, `${label} guide ${stepId} tip ${index} title`);
      assertNonblank(tip.body, `${label} guide ${stepId} tip ${index} body`);
    }

    assert.equal(
      guide.paths.length,
      3,
      `${label} guide ${stepId} must have exactly three paths`,
    );
    assert.deepEqual(
      guide.paths.map((path) => path.mode),
      pathModes,
      `${label} guide ${stepId} paths must be hosted, managed, local`,
    );
    for (const path of guide.paths) {
      assertNonblank(path.id, `${label} guide ${stepId} path ID`);
      assert.match(
        path.id,
        urlSafeId,
        `${label} guide ${stepId} path IDs must be URL-safe`,
      );
      pathIds.push(path.id);
      for (const field of pathTextFields) {
        assertNonblank(
          path[field],
          `${label} guide ${stepId} path ${path.id} ${field}`,
        );
      }

      assert.ok(
        Array.isArray(path.sources),
        `${label} guide ${stepId} path ${path.id} sources must be an array`,
      );
      assert.ok(
        path.sources.length <= 2,
        `${label} guide ${stepId} path ${path.id} may have at most two sources`,
      );
      for (const [index, source] of path.sources.entries()) {
        assertNonblank(
          source.title,
          `${label} guide ${stepId} path ${path.id} source ${index} title`,
        );
        assert.doesNotThrow(
          () => new URL(source.url),
          `${label} guide ${stepId} path ${path.id} source URL must parse`,
        );
        assert.equal(
          new URL(source.url).protocol,
          "https:",
          `${label} guide ${stepId} path ${path.id} sources must use HTTPS`,
        );
      }
    }

    assertNonblank(guide.tryNow.intro, `${label} guide ${stepId} try-now intro`);
    assert.equal(
      guide.tryNow.items.length,
      3,
      `${label} guide ${stepId} must have exactly three try-now items`,
    );
    const practiceLabels = [];
    const practiceIds = guide.tryNow.items.map((item, index) => {
      assertNonblank(
        item.id,
        `${label} guide ${stepId} try-now item ${index} ID`,
      );
      assert.match(
        item.id,
        urlSafeId,
        `${label} guide ${stepId} try-now IDs must be URL-safe`,
      );
      assertNonblank(
        item.label,
        `${label} guide ${stepId} try-now item ${index} label`,
      );
      practiceLabels.push(item.label.trim().toLocaleLowerCase("en-GB"));
      return item.id;
    });
    assertUnique(practiceIds, `${label} guide ${stepId} try-now IDs`);
    assertUnique(practiceLabels, `${label} guide ${stepId} try-now labels`);
    assertNonblank(
      guide.tryNow.evidence,
      `${label} guide ${stepId} try-now evidence`,
    );
  }
  assertUnique(pathIds, `${label} path IDs`);
}

function initialPathRenderedCharacters(guide) {
  const path = guide.paths[0];
  return [
    guide.why,
    ...guide.terms.flatMap((term) => [term.label, term.definition]),
    ...guide.tips.flatMap((tip) => [tip.title, tip.body]),
    path.title,
    path.bestFor,
    path.approach,
    path.tradeoff,
    path.dataBoundary,
    path.network,
    path.cost,
    path.hardware,
    path.evidence,
    ...path.sources.map((source) => source.title),
    guide.tryNow.intro,
    ...guide.tryNow.items.map((item) => item.label),
    guide.tryNow.evidence,
  ].join(" ").length;
}

for (const { workshop, guidance } of workshops) {
  test(`${workshop.slug} guidance is complete and internally consistent`, () => {
    validateGuidance(workshop, guidance);
  });

  test(`${workshop.slug} initial route stays within a broad rendered budget`, () => {
    const initialRoute = guidance.routes[0];
    const characters = initialRoute.stepIds.reduce(
      (total, stepId) =>
        total + initialPathRenderedCharacters(guidance.steps[stepId]),
      0,
    );

    assert.ok(
      characters >= initialRoute.stepIds.length * 300,
      `${workshop.slug} initial route appears too sparse`,
    );
    assert.ok(
      characters <= initialRoute.stepIds.length * 2_600,
      `${workshop.slug} initial route is likely too dense to scan`,
    );
  });
}

test("guidance prose avoids em and en dash characters", () => {
  for (const { workshop, guidance } of workshops) {
    assert.doesNotMatch(
      JSON.stringify(guidance),
      /[\u2013\u2014]/,
      `${workshop.slug} guidance contains an em or en dash`,
    );
  }
});

test("selected-route navigation follows the chosen sequence", () => {
  const orientation = agenticGuidance.routes.find(
    (route) => route.id === "orientation",
  );
  assert.ok(orientation);

  const fromPaper = routeNeighbours(
    agenticResearch,
    orientation,
    "paper",
  );
  assert.equal(fromPaper.previous?.id, "evidence");
  assert.equal(fromPaper.next?.id, "communicate");

  const fromCommunicate = routeNeighbours(
    agenticResearch,
    orientation,
    "communicate",
  );
  assert.equal(fromCommunicate.previous?.id, "paper");
  assert.equal(fromCommunicate.next?.id, "release");

  const offRoute = routeNeighbours(
    agenticResearch,
    orientation,
    "repo-data",
  );
  assert.equal(offRoute.previous?.id, "paper");
  assert.equal(offRoute.next?.id, "baseline");
});

test("agentic research keeps paper review recurring and human-owned", () => {
  const reviewStage = agenticResearch.steps.find(
    (stage) => stage.id === "communicate",
  );
  const reviewGuide = agenticGuidance.steps.communicate;

  assert.ok(reviewStage);
  assert.ok(reviewGuide);
  assert.match(
    reviewStage.summary,
    /design, initial results, first complete draft, co-author review, pre-submission, and material revision/,
  );
  assert.match(
    reviewStage.action,
    /accepted, rejected, deferred, or left unresolved/,
  );
  assert.match(reviewStage.prompt, /high reasoning-effort mode/);
  assert.match(reviewStage.prompt, /What this review may have misunderstood/);
  assert.match(reviewStage.checkpoint, /human-owned disposition/);
  assert.match(reviewStage.watchFor, /Never upload an unpublished or confidential draft/);
  assert.match(reviewGuide.why, /Repeated, focused review/);
  assert.ok(reviewGuide.terms.some((term) => term.label === "Issue ledger"));
  assert.ok(
    reviewGuide.tryNow.items.some((item) =>
      /Record the human decision and rerun after revision/.test(item.label),
    ),
  );

  for (const route of agenticGuidance.routes) {
    const paperIndex = route.stepIds.indexOf("paper");
    const reviewIndex = route.stepIds.indexOf("communicate");
    const releaseIndex = route.stepIds.indexOf("release");
    if (paperIndex >= 0) {
      assert.ok(
        reviewIndex > paperIndex,
        `${route.id} must review after reading the paper`,
      );
    }
    assert.ok(
      reviewIndex >= 0 && releaseIndex > reviewIndex,
      `${route.id} must review before release`,
    );
  }
});

test("annotation routes retain review and release testing controls", () => {
  const local = annotationGuidance.routes.find(
    (route) => route.id === "local-offline",
  );
  const assisted = annotationGuidance.routes.find(
    (route) => route.id === "assisted-labelling",
  );
  assert.ok(local);
  assert.ok(assisted);
  assert.ok(local.stepIds.includes("review"));
  assert.ok(assisted.stepIds.includes("test-package"));
});
