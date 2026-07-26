import assert from "node:assert/strict";
import test from "node:test";
import { progressKey, readProgress } from "../lib/storage.ts";

function withStoredProgress(value, callback) {
  const previousWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem(key) {
        return key === progressKey("agentic-research")
          ? JSON.stringify(value)
          : null;
      },
    },
  };

  try {
    return callback();
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  }
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
  assert.equal(progress.schemaVersion, 3);
  assert.equal(progress.routeId, "");
  assert.deepEqual(progress.pathChoices, {});
  assert.deepEqual(progress.practiceChecks, {});
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

  assert.equal(progress.schemaVersion, 3);
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
});
