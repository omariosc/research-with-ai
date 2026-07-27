import type { WorkshopSlug } from "@/lib/types";

export const TUTORIAL_VERSION = "1.3.0";
export const TUTORIAL_VERSION_LABEL = `v${TUTORIAL_VERSION}`;
export const TUTORIAL_RELEASE_DATE = "2026-07-26";
export const TUTORIAL_HOMEPAGE =
  "https://researchwithai.omarchoudhry.co.uk";

type WorkshopReleaseBase = {
  slug: WorkshopSlug;
  title: string;
  canonicalHostname: string;
  canonicalUrl: string;
};

export type WorkshopRelease = WorkshopReleaseBase &
  (
    | {
        version: string;
        status: "released";
      }
    | {
        version: null;
        status: "in-development";
      }
  );

export const WORKSHOP_RELEASES: Record<WorkshopSlug, WorkshopRelease> = {
  "agentic-research": {
    slug: "agentic-research",
    title: "Agentic AI in Research",
    version: TUTORIAL_VERSION,
    status: "released",
    canonicalHostname: "agenticresearch.omarchoudhry.co.uk",
    canonicalUrl: "https://agenticresearch.omarchoudhry.co.uk",
  },
  "interactive-paper": {
    slug: "interactive-paper",
    title: "Building a Website for Your Research Using AI",
    version: TUTORIAL_VERSION,
    status: "released",
    canonicalHostname: "interactivepaper.omarchoudhry.co.uk",
    canonicalUrl: "https://interactivepaper.omarchoudhry.co.uk",
  },
  "annotation-tools": {
    slug: "annotation-tools",
    title: "Developing Custom Annotation Tools Using AI",
    version: TUTORIAL_VERSION,
    status: "released",
    canonicalHostname: "annotate.omarchoudhry.co.uk",
    canonicalUrl: "https://annotate.omarchoudhry.co.uk",
  },
  "ai-healthcare-conference": {
    slug: "ai-healthcare-conference",
    title: "Run an AI in Healthcare Conference",
    version: null,
    status: "in-development",
    canonicalHostname: "conferencewithai.omarchoudhry.co.uk",
    canonicalUrl: "https://conferencewithai.omarchoudhry.co.uk",
  },
};

export function workshopRelease(slug: WorkshopSlug) {
  return WORKSHOP_RELEASES[slug];
}
