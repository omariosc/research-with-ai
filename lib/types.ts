export type WorkshopSlug =
  | "agentic-research"
  | "interactive-paper"
  | "annotation-tools";

export type Source = {
  title: string;
  url: string;
  note?: string;
};

export type WorkshopStep = {
  id: string;
  title: string;
  summary: string;
  action: string;
  output: string;
  prompt: string;
  checkpoint: string;
  watchFor: string;
  videoCue: string;
  sources: Source[];
};

export type Workshop = {
  slug: WorkshopSlug;
  number: "01" | "02" | "03";
  shortTitle: string;
  title: string;
  navTitle: string;
  description: string;
  promise: string;
  duration: string;
  accent: "blue" | "ochre" | "green";
  startLabel: string;
  steps: WorkshopStep[];
  sourceLibrary: Source[];
};

export type StoredWorkshopProgress = {
  completed: string[];
  approved: string[];
  activeStep: string;
  updatedAt: string;
};
