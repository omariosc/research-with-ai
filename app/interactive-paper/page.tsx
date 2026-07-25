import type { Metadata } from "next";
import { WorkshopClient } from "@/app/components/WorkshopClient";
import { interactivePaper } from "@/lib/content/paper";

export const metadata: Metadata = {
  title: "Building a Website for Your Research Using AI",
  description:
    "Turn a paper and repository into a truthful, accessible, reproducible research website.",
  alternates: {
    canonical: "https://interactivepaper.omarchoudhry.co.uk",
  },
};

export default function InteractivePaperPage() {
  return <WorkshopClient workshop={interactivePaper} />;
}
