import type { Metadata } from "next";
import { PaperDemoPage } from "@/app/components/PaperDemoPage";
import {
  INTERACTIVE_PAPER_ORIGIN,
  paperDemos,
  paperDemoPath,
} from "@/lib/paper-demos";

const demo = paperDemos["real-time-tool-detection"];
const canonicalUrl = `${INTERACTIVE_PAPER_ORIGIN}${paperDemoPath(demo.slug)}`;

export const metadata: Metadata = {
  title: `${demo.shortTitle} interactive paper companion`,
  description: demo.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "article",
    siteName: "Research with AI",
    title: demo.title,
    description: demo.description,
    url: canonicalUrl,
    images: [
      {
        url: `${INTERACTIVE_PAPER_ORIGIN}${demo.figure.src}`,
        width: demo.figure.width,
        height: demo.figure.height,
        alt: demo.figure.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: demo.title,
    description: demo.description,
    images: [`${INTERACTIVE_PAPER_ORIGIN}${demo.figure.src}`],
  },
};

export default function RealTimeToolDetectionDemoPage() {
  return <PaperDemoPage demo={demo} />;
}
