import { WorkshopClient } from "@/app/components/WorkshopClient";
import { agenticResearch } from "@/lib/content/agentic";
import { workshopMetadata } from "@/lib/metadata";

export const metadata = workshopMetadata(agenticResearch);

export default function AgenticResearchPage() {
  return <WorkshopClient workshop={agenticResearch} />;
}
