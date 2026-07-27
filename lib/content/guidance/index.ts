import type { WorkshopGuidance, WorkshopSlug } from "@/lib/types";
import { agenticGuidance } from "./agentic";
import { annotationGuidance } from "./annotation";
import { conferenceGuidance } from "./conference";
import { paperGuidance } from "./paper";

export {
  agenticGuidance,
  annotationGuidance,
  conferenceGuidance,
  paperGuidance,
};

export const guidanceByWorkshop: Record<WorkshopSlug, WorkshopGuidance> = {
  "agentic-research": agenticGuidance,
  "interactive-paper": paperGuidance,
  "annotation-tools": annotationGuidance,
  "ai-healthcare-conference": conferenceGuidance,
};
