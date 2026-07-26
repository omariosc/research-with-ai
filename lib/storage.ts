import type {
  StoredWorkshopProgress,
  WorkshopSlug,
} from "@/lib/types";

export const STORAGE_PREFIX = "research-with-ai:v1";
export const PROGRESS_SCHEMA_VERSION = 2 as const;

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

export function readProgress(
  slug: WorkshopSlug,
  firstStep: string,
): StoredWorkshopProgress {
  const fallback: StoredWorkshopProgress = {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completed: [],
    approved: [],
    activeStep: firstStep,
    evidenceNotes: {},
    decisions: {},
    assessmentAnswers: {},
    updatedAt: new Date(0).toISOString(),
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StoredWorkshopProgress>;
    const evidenceNotes = stringRecord(parsed.evidenceNotes);
    const decisions = decisionRecord(parsed.decisions);
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
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      completed,
      approved,
      activeStep:
        typeof parsed.activeStep === "string" ? parsed.activeStep : firstStep,
      evidenceNotes,
      decisions,
      assessmentAnswers: stringRecord(parsed.assessmentAnswers),
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
