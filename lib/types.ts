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
  checkpointLabel?: string;
  duration?: string;
};

export type WorkshopCaseStudy = {
  eyebrow: string;
  title: string;
  context: string;
  expected: string;
  observed: string[];
  changes: string[];
  boundary: string;
  sources: Source[];
};

export type AssessmentOption = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export type AssessmentItem = {
  id: string;
  question: string;
  options: AssessmentOption[];
};

export type GlossaryItem = {
  term: string;
  definition: string;
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
  audience: string;
  prerequisites: string[];
  outcomes: string[];
  projectTime: string;
  quickRoute: string[];
  caseStudy: WorkshopCaseStudy;
  assessment: AssessmentItem[];
  glossary: GlossaryItem[];
  steps: WorkshopStep[];
  sourceLibrary: Source[];
};

export type StoredWorkshopProgress = {
  schemaVersion: 2;
  completed: string[];
  approved: string[];
  activeStep: string;
  evidenceNotes: Record<string, string>;
  decisions: Record<string, "ready" | "revise" | "stop">;
  assessmentAnswers: Record<string, string>;
  updatedAt: string;
};
