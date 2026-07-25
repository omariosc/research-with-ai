import type { Metadata } from "next";
import { WorkshopClient } from "@/app/components/WorkshopClient";
import { agenticResearch } from "@/lib/content/agentic";

export const metadata: Metadata = {
  title: "Agentic AI in Research",
  description:
    "A complete, human-led workflow for using research and coding agents from literature mapping to reproducible release.",
  alternates: {
    canonical: "https://agenticresearch.omarchoudhry.co.uk",
  },
};

export default function AgenticResearchPage() {
  return <WorkshopClient workshop={agenticResearch} />;
}
