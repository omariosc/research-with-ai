import type { Metadata } from "next";
import { headers } from "next/headers";
import { HomeClient } from "./components/HomeClient";
import { WorkshopClient } from "./components/WorkshopClient";
import { agenticResearch } from "@/lib/content/agentic";
import { interactivePaper } from "@/lib/content/paper";
import { annotationTools } from "@/lib/content/annotation";
import { aiHealthcareConference } from "@/lib/content/conference";
import { workshopMetadata } from "@/lib/metadata";
import type { Workshop } from "@/lib/types";
import { TUTORIAL_HOMEPAGE } from "@/lib/version";

const workshopByHost: Record<string, Workshop> = {
  "agenticresearch.omarchoudhry.co.uk": agenticResearch,
  "interactivepaper.omarchoudhry.co.uk": interactivePaper,
  "annotate.omarchoudhry.co.uk": annotationTools,
  "conferencewithai.omarchoudhry.co.uk": aiHealthcareConference,
};

const platformDescription =
  "Four practical workshops for agentic research, research project websites, custom annotation tools, and community-led AI in healthcare conferences.";

async function requestedHost() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-host");
  const raw = forwarded?.split(",")[0] ?? requestHeaders.get("host") ?? "";
  return raw.trim().toLowerCase().replace(/:\d+$/, "");
}

export async function generateMetadata(): Promise<Metadata> {
  const workshop = workshopByHost[await requestedHost()];
  if (!workshop) {
    return {
      title: { absolute: "Research with AI" },
      description: platformDescription,
      alternates: {
        canonical: TUTORIAL_HOMEPAGE,
      },
      openGraph: {
        type: "website",
        siteName: "Research with AI",
        title: "Research with AI",
        description: platformDescription,
        url: TUTORIAL_HOMEPAGE,
        images: [
          {
            url: `${TUTORIAL_HOMEPAGE}/research-with-ai-social.png`,
            width: 1200,
            height: 630,
            alt: "Research with AI interactive workshop interface",
          },
        ],
      },
    };
  }

  return workshopMetadata(workshop);
}

export default async function Home() {
  const workshop = workshopByHost[await requestedHost()];
  if (workshop) {
    return <WorkshopClient workshop={workshop} />;
  }

  return (
    <HomeClient
      workshops={[
        agenticResearch,
        interactivePaper,
        annotationTools,
        aiHealthcareConference,
      ]}
    />
  );
}
