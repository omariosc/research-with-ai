import { WorkshopClient } from "@/app/components/WorkshopClient";
import { annotationTools } from "@/lib/content/annotation";
import { workshopMetadata } from "@/lib/metadata";

export const metadata = workshopMetadata(annotationTools);

export default function AnnotationToolsPage() {
  return <WorkshopClient workshop={annotationTools} />;
}
