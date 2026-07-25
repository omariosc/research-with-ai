import type {
  StoredWorkshopProgress,
  WorkshopSlug,
} from "@/lib/types";

export const STORAGE_PREFIX = "research-with-ai:v1";

export function progressKey(slug: WorkshopSlug) {
  return `${STORAGE_PREFIX}:progress:${slug}`;
}

export function readProgress(
  slug: WorkshopSlug,
  firstStep: string,
): StoredWorkshopProgress {
  const fallback: StoredWorkshopProgress = {
    completed: [],
    approved: [],
    activeStep: firstStep,
    updatedAt: new Date(0).toISOString(),
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StoredWorkshopProgress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      approved: Array.isArray(parsed.approved) ? parsed.approved : [],
      activeStep:
        typeof parsed.activeStep === "string" ? parsed.activeStep : firstStep,
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
  window.localStorage.setItem(progressKey(slug), JSON.stringify(progress));
  window.dispatchEvent(
    new CustomEvent("research-with-ai-progress", { detail: { slug } }),
  );
}

export function clearProgress(slug: WorkshopSlug) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(progressKey(slug));
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
