import { WorkshopClient } from "@/app/components/WorkshopClient";
import { interactivePaper } from "@/lib/content/paper";
import { workshopMetadata } from "@/lib/metadata";

export const metadata = workshopMetadata(interactivePaper);

export default function InteractivePaperPage() {
  return <WorkshopClient workshop={interactivePaper} />;
}
