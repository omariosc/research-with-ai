import type { Metadata } from "next";
import { WorkshopClient } from "@/app/components/WorkshopClient";
import { annotationTools } from "@/lib/content/annotation";

export const metadata: Metadata = {
  title: "Developing Custom Annotation Tools Using AI",
  description:
    "Build a study-specific annotation tool from a protocol, then test the software and the data it produces.",
  alternates: {
    canonical: "https://annotate.omarchoudhry.co.uk",
  },
};

export default function AnnotationToolsPage() {
  return <WorkshopClient workshop={annotationTools} />;
}
