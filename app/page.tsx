import type { Metadata } from "next";
import { HomeClient } from "./components/HomeClient";
import { agenticResearch } from "@/lib/content/agentic";
import { interactivePaper } from "@/lib/content/paper";
import { annotationTools } from "@/lib/content/annotation";

export const metadata: Metadata = {
  title: { absolute: "Research with AI" },
  description:
    "Three practical workshops for agentic research, research project websites, and custom annotation tools.",
};

export default function Home() {
  return (
    <HomeClient
      workshops={[agenticResearch, interactivePaper, annotationTools]}
    />
  );
}
