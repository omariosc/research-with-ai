import { WorkshopClient } from "@/app/components/WorkshopClient";
import { aiHealthcareConference } from "@/lib/content/conference";
import { workshopMetadata } from "@/lib/metadata";

export const metadata = workshopMetadata(aiHealthcareConference);

export default function AiHealthcareConferencePage() {
  return <WorkshopClient workshop={aiHealthcareConference} />;
}
