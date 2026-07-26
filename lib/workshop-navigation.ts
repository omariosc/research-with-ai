import type { Workshop, WorkshopRoute } from "@/lib/types";

export function routeNeighbours(
  workshop: Workshop,
  route: WorkshopRoute,
  activeStepId: string,
) {
  const routeIndex = route.stepIds.indexOf(activeStepId);
  const sequence =
    routeIndex >= 0 ? route.stepIds : workshop.steps.map((step) => step.id);
  const activeIndex =
    routeIndex >= 0
      ? routeIndex
      : sequence.findIndex((stepId) => stepId === activeStepId);
  const findStep = (stepId?: string) =>
    stepId
      ? workshop.steps.find((candidate) => candidate.id === stepId)
      : undefined;

  return {
    previous: findStep(sequence[activeIndex - 1]),
    next: findStep(sequence[activeIndex + 1]),
  };
}
