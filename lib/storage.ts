import type {
  StoredWorkshopProgress,
  WorkshopSlug,
} from "@/lib/types";

export const STORAGE_PREFIX = "research-with-ai:v1";
export const PROGRESS_SCHEMA_VERSION = 3 as const;

export type ProgressScope = {
  stepIds: readonly string[];
  routeIds: readonly string[];
  pathIds: Record<string, readonly string[]>;
  practiceIds: Record<string, readonly string[]>;
  assessmentItemIds: readonly string[];
};

export function progressKey(slug: WorkshopSlug) {
  return `${STORAGE_PREFIX}:progress:${slug}`;
}

function stringRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] =>
      typeof entry[1] === "string",
    ),
  );
}

function decisionRecord(value: unknown): StoredWorkshopProgress["decisions"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (
        entry,
      ): entry is [
        string,
        StoredWorkshopProgress["decisions"][string],
      ] =>
        entry[1] === "ready" ||
        entry[1] === "revise" ||
        entry[1] === "stop",
    ),
  );
}

function stringArrayRecord(
  value: unknown,
): StoredWorkshopProgress["practiceChecks"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, candidate]) => {
      if (!Array.isArray(candidate)) return [];
      const items = [
        ...new Set(
          candidate.filter(
            (item): item is string => typeof item === "string",
          ),
        ),
      ];
      return items.length ? [[key, items]] : [];
    }),
  );
}

export function readProgress(
  slug: WorkshopSlug,
  firstStep: string,
  scope?: ProgressScope,
): StoredWorkshopProgress {
  const fallback: StoredWorkshopProgress = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completed: [],
    approved: [],
    activeStep: firstStep,
    routeId: "",
    evidenceNotes: {},
    decisions: {},
    pathChoices: {},
    practiceChecks: {},
    assessmentAnswers: {},
    updatedAt: new Date(0).toISOString(),
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StoredWorkshopProgress>;
    const stepIsValid = (id: string) =>
      !scope || scope.stepIds.includes(id);
    const evidenceNotes = Object.fromEntries(
      Object.entries(stringRecord(parsed.evidenceNotes)).filter(([id]) =>
        stepIsValid(id),
      ),
    );
    const decisions = Object.fromEntries(
      Object.entries(decisionRecord(parsed.decisions)).filter(([id]) =>
        stepIsValid(id),
      ),
    );
    const candidateApproved = Array.isArray(parsed.approved)
      ? parsed.approved.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
    const approved = candidateApproved.filter(
      (id) =>
        typeof evidenceNotes[id] === "string" &&
        evidenceNotes[id].trim().length >= 20 &&
        Boolean(decisions[id]),
    );
    const completed = (
      Array.isArray(parsed.completed)
        ? parsed.completed.filter(
            (value): value is string => typeof value === "string",
          )
        : []
    ).filter((id) => approved.includes(id) && decisions[id] === "ready");
    const pathChoices = Object.fromEntries(
      Object.entries(stringRecord(parsed.pathChoices)).filter(
        ([stepId, pathId]) =>
          stepIsValid(stepId) &&
          (!scope || scope.pathIds[stepId]?.includes(pathId)),
      ),
    );
    const practiceChecks = Object.fromEntries(
      Object.entries(stringArrayRecord(parsed.practiceChecks)).flatMap(
        ([stepId, itemIds]) => {
          if (!stepIsValid(stepId)) return [];
          const validIds = scope
            ? itemIds.filter((id) =>
                scope.practiceIds[stepId]?.includes(id),
              )
            : itemIds;
          return validIds.length ? [[stepId, validIds]] : [];
        },
      ),
    );
    const assessmentAnswers = Object.fromEntries(
      Object.entries(stringRecord(parsed.assessmentAnswers)).filter(
        ([itemId]) =>
          !scope || scope.assessmentItemIds.includes(itemId),
      ),
    );
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      completed,
      approved,
      activeStep:
        typeof parsed.activeStep === "string" &&
        stepIsValid(parsed.activeStep)
          ? parsed.activeStep
          : firstStep,
      routeId:
        typeof parsed.routeId === "string" &&
        (!scope || scope.routeIds.includes(parsed.routeId))
          ? parsed.routeId
          : "",
      evidenceNotes,
      decisions,
      pathChoices,
      practiceChecks,
      assessmentAnswers,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : fallback.updatedAt,
    };
  } catch {
    return fallback;
  }
}

export function writeProgress(
  slug: WorkshopSlug,
  progress: StoredWorkshopProgress,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      progressKey(slug),
      JSON.stringify({
        ...progress,
        schemaVersion: PROGRESS_SCHEMA_VERSION,
      }),
    );
  } catch {
    return;
  }
  window.dispatchEvent(
    new CustomEvent("research-with-ai-progress", { detail: { slug } }),
  );
}

export function clearProgress(slug: WorkshopSlug) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(progressKey(slug));
  } catch {
    // The caller can still clear in-memory state when storage is blocked.
  }
  window.dispatchEvent(
    new CustomEvent("research-with-ai-progress", { detail: { slug } }),
  );
}

export function downloadText(
  filename: string,
  text: string,
  mime = "text/markdown;charset=utf-8",
) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string) {
  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.opacity = "0";
  document.body.appendChild(fallback);
  fallback.select();
  const copied = document.execCommand("copy");
  fallback.remove();
  if (copied) return;

  if (navigator.clipboard?.writeText) {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise<never>((_, reject) =>
        window.setTimeout(
          () => reject(new Error("Clipboard access timed out.")),
          800,
        ),
      ),
    ]);
    return;
  }

  throw new Error("The browser did not allow clipboard access.");
}
