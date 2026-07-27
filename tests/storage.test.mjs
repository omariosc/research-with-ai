import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PROJECT_ID,
  builderKey,
  clearBuilderDraft,
  progressKey,
  readProgress,
  readWorkspace,
  workspaceKey,
} from "../lib/storage.ts";

function withLocalStorage(entries, callback) {
  const previousWindow = globalThis.window;
  const previousCustomEvent = globalThis.CustomEvent;
  const store = new Map(entries);
  globalThis.window = {
    localStorage: {
      getItem(key) {
        return store.get(key) ?? null;
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
      removeItem(key) {
        store.delete(key);
      },
    },
    dispatchEvent() {},
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options) {
      this.type = type;
      this.detail = options?.detail;
    }
  };

  try {
    return callback(store);
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
    if (previousCustomEvent === undefined) {
      delete globalThis.CustomEvent;
    } else {
      globalThis.CustomEvent = previousCustomEvent;
    }
  }
}

function withStoredProgress(value, callback) {
  return withLocalStorage(
    [[progressKey("agentic-research"), JSON.stringify(value)]],
    callback,
  );
}

test("malformed browser progress is sanitised before the workshop reads it", () => {
  const progress = withStoredProgress(
    {
      approved: ["contract", 42],
      completed: ["contract", null],
      activeStep: "contract",
      evidenceNotes: {
        contract: { unsafe: true },
        evidence: "A checked source note that is safely long enough.",
      },
      decisions: {
        contract: "invented",
        evidence: "ready",
      },
      assessmentAnswers: {
        valid: "answer-a",
        invalid: { option: "answer-b" },
      },
      updatedAt: "not-a-date",
    },
    () => readProgress("agentic-research", "contract"),
  );

  assert.deepEqual(progress.approved, []);
  assert.deepEqual(progress.completed, []);
  assert.deepEqual(progress.evidenceNotes, {
    evidence: "A checked source note that is safely long enough.",
  });
  assert.deepEqual(progress.decisions, { evidence: "ready" });
  assert.deepEqual(progress.assessmentAnswers, { valid: "answer-a" });
});

test("valid evidence and decisions preserve an approved completed stage", () => {
  const progress = withStoredProgress(
    {
      approved: ["contract"],
      completed: ["contract"],
      activeStep: "contract",
      evidenceNotes: {
        contract: "Reviewed against the signed project contract.",
      },
      decisions: { contract: "ready" },
      assessmentAnswers: {},
      updatedAt: "2026-07-26T12:00:00.000Z",
    },
    () => readProgress("agentic-research", "contract"),
  );

  assert.deepEqual(progress.approved, ["contract"]);
  assert.deepEqual(progress.completed, ["contract"]);
  assert.equal(progress.schemaVersion, 4);
  assert.equal(progress.routeId, "");
  assert.deepEqual(progress.pathChoices, {});
  assert.deepEqual(progress.practiceChecks, {});
  assert.deepEqual(progress.bonusChecks, []);
});

test("version two progress migrates without losing reviewed work", () => {
  const progress = withStoredProgress(
    {
      schemaVersion: 2,
      approved: ["contract"],
      completed: ["contract"],
      activeStep: "contract",
      evidenceNotes: {
        contract: "Reviewed against the signed project contract.",
      },
      decisions: { contract: "ready" },
      assessmentAnswers: { scenario: "answer-a" },
      updatedAt: "2026-07-26T12:00:00.000Z",
    },
    () => readProgress("agentic-research", "contract"),
  );

  assert.equal(progress.schemaVersion, 4);
  assert.deepEqual(progress.approved, ["contract"]);
  assert.deepEqual(progress.completed, ["contract"]);
  assert.deepEqual(progress.assessmentAnswers, { scenario: "answer-a" });
  assert.deepEqual(progress.pathChoices, {});
  assert.deepEqual(progress.practiceChecks, {});
});

test("route, path, and practice choices are scoped to current content", () => {
  const scope = {
    stepIds: ["contract", "evidence"],
    routeIds: ["orientation"],
    pathIds: {
      contract: ["hosted-contract", "local-contract"],
      evidence: ["hosted-evidence"],
    },
    practiceIds: {
      contract: ["write-boundary", "name-approver"],
      evidence: ["open-source"],
    },
    bonusIds: ["open-primary-paper"],
    assessmentItemIds: ["safe-next-step"],
  };
  const progress = withStoredProgress(
    {
      activeStep: "removed-stage",
      routeId: "removed-route",
      evidenceNotes: {
        contract: "A valid note for the current contract stage.",
        removed: "A note for content that no longer exists.",
      },
      decisions: { contract: "revise", removed: "ready" },
      pathChoices: {
        contract: "local-contract",
        evidence: "removed-path",
        removed: "hosted-contract",
      },
      practiceChecks: {
        contract: [
          "write-boundary",
          "write-boundary",
          "removed-check",
          42,
        ],
        evidence: ["removed-check"],
        removed: ["write-boundary"],
      },
      assessmentAnswers: {
        "safe-next-step": "answer-a",
        removed: "answer-b",
      },
      bonusChecks: [
        "open-primary-paper",
        "open-primary-paper",
        "removed-check",
      ],
    },
    () => readProgress("agentic-research", "contract", scope),
  );

  assert.equal(progress.activeStep, "contract");
  assert.equal(progress.routeId, "");
  assert.deepEqual(progress.evidenceNotes, {
    contract: "A valid note for the current contract stage.",
  });
  assert.deepEqual(progress.decisions, { contract: "revise" });
  assert.deepEqual(progress.pathChoices, {
    contract: "local-contract",
  });
  assert.deepEqual(progress.practiceChecks, {
    contract: ["write-boundary"],
  });
  assert.deepEqual(progress.assessmentAnswers, {
    "safe-next-step": "answer-a",
  });
  assert.deepEqual(progress.bonusChecks, ["open-primary-paper"]);
});

test("each named project restores its own checklist state", () => {
  const first = {
    activeStep: "contract",
    routeId: "orientation",
    bonusChecks: ["open-primary-paper"],
  };
  const second = {
    activeStep: "evidence",
    routeId: "reproduction",
    bonusChecks: ["mark-human-input"],
  };
  withLocalStorage(
    [
      [
        progressKey("agentic-research", "project-one"),
        JSON.stringify(first),
      ],
      [
        progressKey("agentic-research", "project-two"),
        JSON.stringify(second),
      ],
    ],
    () => {
      const one = readProgress(
        "agentic-research",
        "contract",
        undefined,
        "project-one",
      );
      const two = readProgress(
        "agentic-research",
        "contract",
        undefined,
        "project-two",
      );
      assert.equal(one.activeStep, "contract");
      assert.equal(two.activeStep, "evidence");
      assert.deepEqual(one.bonusChecks, ["open-primary-paper"]);
      assert.deepEqual(two.bonusChecks, ["mark-human-input"]);
    },
  );
});

test("legacy progress is copied into the default project once", () => {
  const legacy = {
    activeStep: "contract",
    routeId: "orientation",
    bonusChecks: [],
  };
  withLocalStorage(
    [[progressKey("agentic-research"), JSON.stringify(legacy)]],
    (store) => {
      const restored = readProgress(
        "agentic-research",
        "contract",
        undefined,
        DEFAULT_PROJECT_ID,
      );
      assert.equal(restored.activeStep, "contract");
      assert.ok(
        store.has(
          progressKey("agentic-research", DEFAULT_PROJECT_ID),
        ),
      );
      assert.ok(store.has(progressKey("agentic-research")));
    },
  );
});

test("workspace restoration removes unsafe or duplicate projects", () => {
  withLocalStorage(
    [
      [
        workspaceKey("annotation-tools"),
        JSON.stringify({
          schemaVersion: 999,
          activeProjectId: "missing",
          projects: [
            {
              id: "safe-project",
              name: "  Surgical   phases  ",
              notes: "Review uncertain boundaries.",
              createdAt: "2026-07-26T12:00:00.000Z",
              updatedAt: "invalid",
            },
            {
              id: "safe-project",
              name: "Duplicate",
            },
            {
              id: "../unsafe",
              name: "Unsafe ID",
            },
          ],
        }),
      ],
    ],
    () => {
      const workspace = readWorkspace("annotation-tools");
      assert.equal(workspace.schemaVersion, 1);
      assert.equal(workspace.activeProjectId, "safe-project");
      assert.equal(workspace.projects.length, 1);
      assert.equal(workspace.projects[0].name, "Surgical phases");
      assert.equal(
        workspace.projects[0].updatedAt,
        "2026-07-26T12:00:00.000Z",
      );
    },
  );
});

test("reset removes only the builder for the current workshop", () => {
  const projectId = DEFAULT_PROJECT_ID;
  withLocalStorage(
    [
      [builderKey("agentic", projectId), "{\"question\":\"one\"}"],
      [builderKey("paper", projectId), "{\"title\":\"two\"}"],
      [builderKey("conference", projectId), "{\"title\":\"four\"}"],
    ],
    (store) => {
      clearBuilderDraft("agentic-research", projectId);
      assert.equal(store.has(builderKey("agentic", projectId)), false);
      assert.equal(store.has(builderKey("paper", projectId)), true);
      assert.equal(store.has(builderKey("conference", projectId)), true);
    },
  );
});

test("conference reset removes only its own builder draft", () => {
  const projectId = DEFAULT_PROJECT_ID;
  withLocalStorage(
    [
      [builderKey("annotation", projectId), "{\"labels\":[]}"],
      [builderKey("conference", projectId), "{\"title\":\"Leeds\"}"],
    ],
    (store) => {
      clearBuilderDraft("ai-healthcare-conference", projectId);
      assert.equal(store.has(builderKey("annotation", projectId)), true);
      assert.equal(store.has(builderKey("conference", projectId)), false);
    },
  );
});
