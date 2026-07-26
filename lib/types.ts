export type WorkshopSlug =
  | "agentic-research"
  | "interactive-paper"
  | "annotation-tools";

export type Source = {
  title: string;
  url: string;
  note?: string;
};

export type WorkflowPhase = {
  id: string;
  title: string;
  summary: string;
  stepIds: string[];
};

export type WorkshopRoute = {
  id: string;
  title: string;
  description: string;
  bestFor: string;
  stepIds: string[];
};

export type GuideTerm = {
  label: string;
  definition: string;
};

export type GuideTip = {
  title: string;
  body: string;
};

export type GuidePathMode = "hosted" | "managed" | "local";

export type GuidePath = {
  id: string;
  mode: GuidePathMode;
  title: string;
  bestFor: string;
  approach: string;
  tradeoff: string;
  dataBoundary: string;
  network: string;
  cost: string;
  hardware: string;
  evidence: string;
  sources: Source[];
};

export type GuidePracticeItem = {
  id: string;
  label: string;
};

export type WorkshopStepGuide = {
  why: string;
  terms: GuideTerm[];
  tips: GuideTip[];
  paths: GuidePath[];
  tryNow: {
    intro: string;
    items: GuidePracticeItem[];
    evidence: string;
  };
};

export type WorkshopGuidance = {
  lastVerified: string;
  phases: WorkflowPhase[];
  routes: WorkshopRoute[];
  steps: Record<string, WorkshopStepGuide>;
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
  schemaVersion: 4;
  completed: string[];
  approved: string[];
  activeStep: string;
  routeId: string;
  evidenceNotes: Record<string, string>;
  decisions: Record<string, "ready" | "revise" | "stop">;
  pathChoices: Record<string, string>;
  practiceChecks: Record<string, string[]>;
  bonusChecks: string[];
  assessmentAnswers: Record<string, string>;
  updatedAt: string;
};

export type WorkshopProject = {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredWorkshopWorkspace = {
  schemaVersion: 1;
  activeProjectId: string;
  projects: WorkshopProject[];
};
