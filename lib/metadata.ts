import type { Metadata } from "next";
import type { Workshop } from "@/lib/types";
import { TUTORIAL_HOMEPAGE, workshopRelease } from "@/lib/version";

const SOCIAL_IMAGE = `${TUTORIAL_HOMEPAGE}/research-with-ai-social.png`;

export function workshopMetadata(workshop: Workshop): Metadata {
  const canonicalUrl = workshopRelease(workshop.slug).canonicalUrl;

  return {
    title: workshop.title,
    description: workshop.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: "Research with AI",
      title: workshop.title,
      description: workshop.description,
      url: canonicalUrl,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: `${workshop.title}, an interactive Research with AI workshop`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.description,
      images: [SOCIAL_IMAGE],
    },
  };
}
