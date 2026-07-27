import type {
  StoredWorkshopProgress,
  StoredWorkshopWorkspace,
  WorkshopProject,
  WorkshopSlug,
} from "@/lib/types";

export const STORAGE_PREFIX = "research-with-ai:v1";
export const PROGRESS_SCHEMA_VERSION = 4 as const;
export const WORKSPACE_SCHEMA_VERSION = 1 as const;
export const BUILDER_SCHEMA_VERSION = 3 as const;
export const DEFAULT_PROJECT_ID = "first-project";
export const DEFAULT_PROJECT_NAME = "My first project";

export type ProgressScope = {
  stepIds: readonly string[];
  routeIds: readonly string[];
  pathIds: Record<string, readonly string[]>;
  practiceIds: Record<string, readonly string[]>;
  bonusIds: readonly string[];
  assessmentItemIds: readonly string[];
};

export function progressKey(slug: WorkshopSlug, projectId?: string) {
  if (projectId) {
    return `${STORAGE_PREFIX}:progress:v${PROGRESS_SCHEMA_VERSION}:${slug}:${encodeURIComponent(projectId)}`;
  }
  return `${STORAGE_PREFIX}:progress:${slug}`;
}

export function workspaceKey(slug: WorkshopSlug) {
  return `${STORAGE_PREFIX}:workspace:${slug}`;
}

export function builderKey(key: string, projectId: string) {
  return `${STORAGE_PREFIX}:builder:v${BUILDER_SCHEMA_VERSION}:${encodeURIComponent(projectId)}:${key}`;
}

export function legacyBuilderKey(key: string) {
  return `${STORAGE_PREFIX}:builder:v2:${key}`;
}

export function blankProgress(firstStep: string): StoredWorkshopProgress {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completed: [],
    approved: [],
    activeStep: firstStep,
    routeId: "",
    evidenceNotes: {},
    decisions: {},
    pathChoices: {},
    practiceChecks: {},
    bonusChecks: [],
    assessmentAnswers: {},
    updatedAt: new Date(0).toISOString(),
  };
}

function normaliseProjectName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 80);
}

function normaliseProjectId(value: unknown) {
  if (typeof value !== "string") return "";
  return /^[a-zA-Z0-9_-]{1,80}$/.test(value) ? value : "";
}

function timestamp(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return Number.isNaN(Date.parse(value)) ? fallback : value;
}

export function createWorkshopProject(
  name = DEFAULT_PROJECT_NAME,
  id?: string,
): WorkshopProject {
  const now = new Date().toISOString();
  const generatedId =
    id ??
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `project-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  return {
    id: normaliseProjectId(generatedId) || DEFAULT_PROJECT_ID,
    name: normaliseProjectName(name) || "Untitled project",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function defaultWorkspace(): StoredWorkshopWorkspace {
  const project: WorkshopProject = {
    id: DEFAULT_PROJECT_ID,
    name: DEFAULT_PROJECT_NAME,
    notes: "",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    activeProjectId: project.id,
    projects: [project],
  };
}

function sanitiseWorkspace(value: unknown): StoredWorkshopWorkspace | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Partial<StoredWorkshopWorkspace>;
  if (!Array.isArray(candidate.projects)) return null;
  const seen = new Set<string>();
  const projects = candidate.projects.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const project = item as Partial<WorkshopProject>;
    const id = normaliseProjectId(project.id);
    const name = normaliseProjectName(project.name);
    if (!id || !name || seen.has(id)) return [];
    seen.add(id);
    const createdAt = timestamp(project.createdAt, new Date(0).toISOString());
    return [
      {
        id,
        name,
        notes:
          typeof project.notes === "string"
            ? project.notes.slice(0, 12000)
            : "",
        createdAt,
        updatedAt: timestamp(project.updatedAt, createdAt),
      },
    ];
  });
  if (!projects.length) return null;
  const activeProjectId =
    normaliseProjectId(candidate.activeProjectId) &&
    projects.some((project) => project.id === candidate.activeProjectId)
      ? (candidate.activeProjectId as string)
      : projects[0].id;
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    activeProjectId,
    projects,
  };
}

export function readWorkspace(slug: WorkshopSlug): StoredWorkshopWorkspace {
  const fallback = defaultWorkspace();
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(workspaceKey(slug));
    if (raw) {
      const restored = sanitiseWorkspace(JSON.parse(raw));
      if (restored) return restored;
    }
    const legacyProgress = window.localStorage.getItem(progressKey(slug));
    const migrated = {
      ...fallback,
      projects: fallback.projects.map((project) => ({
        ...project,
        createdAt: legacyProgress ? new Date().toISOString() : project.createdAt,
        updatedAt: legacyProgress ? new Date().toISOString() : project.updatedAt,
      })),
    };
    window.localStorage.setItem(workspaceKey(slug), JSON.stringify(migrated));
    return migrated;
  } catch {
    return fallback;
  }
}

export function writeWorkspace(
  slug: WorkshopSlug,
  workspace: StoredWorkshopWorkspace,
) {
  if (typeof window === "undefined") return;
  const sanitised = sanitiseWorkspace(workspace);
  if (!sanitised) return;
  try {
    window.localStorage.setItem(
      workspaceKey(slug),
      JSON.stringify(sanitised),
    );
  } catch {
    return;
  }
  window.dispatchEvent(
    new CustomEvent("research-with-ai-workspace", { detail: { slug } }),
  );
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
  projectId?: string,
): StoredWorkshopProgress {
  const fallback = blankProgress(firstStep);

  if (typeof window === "undefined") return fallback;

  try {
    const scopedKey = projectId ? progressKey(slug, projectId) : progressKey(slug);
    let raw = window.localStorage.getItem(scopedKey);
    if (!raw && projectId === DEFAULT_PROJECT_ID) {
      raw = window.localStorage.getItem(progressKey(slug));
    }
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
    const bonusChecks = [
      ...new Set(
        (Array.isArray(parsed.bonusChecks) ? parsed.bonusChecks : []).filter(
          (value): value is string =>
            typeof value === "string" &&
            (!scope || (scope.bonusIds?.includes(value) ?? false)),
        ),
      ),
    ];
    const restored: StoredWorkshopProgress = {
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
      bonusChecks,
      assessmentAnswers,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : fallback.updatedAt,
    };
    if (projectId && !window.localStorage.getItem(scopedKey)) {
      window.localStorage.setItem(scopedKey, JSON.stringify(restored));
    }
    return restored;
  } catch {
    return fallback;
  }
}

export function writeProgress(
  slug: WorkshopSlug,
  progress: StoredWorkshopProgress,
  projectId?: string,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      progressKey(slug, projectId),
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

export function clearProgress(slug: WorkshopSlug, projectId?: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(progressKey(slug, projectId));
  } catch {
    // The caller can still clear in-memory state when storage is blocked.
  }
  window.dispatchEvent(
    new CustomEvent("research-with-ai-progress", { detail: { slug } }),
  );
}

export function clearBuilderDraft(
  slug: WorkshopSlug,
  projectId: string,
) {
  if (typeof window === "undefined") return;
  const keyByWorkshop: Record<WorkshopSlug, string> = {
    "agentic-research": "agentic",
    "interactive-paper": "paper",
    "annotation-tools": "annotation",
    "ai-healthcare-conference": "conference",
  };
  try {
    window.localStorage.removeItem(
      builderKey(keyByWorkshop[slug], projectId),
    );
  } catch {
    // The active forms can still reset in memory after remounting.
  }
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
