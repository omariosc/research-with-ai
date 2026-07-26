import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { TUTORIAL_HOMEPAGE } from "@/lib/version";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(TUTORIAL_HOMEPAGE),
  title: {
    default: "Research with AI",
    template: "%s | Research with AI",
  },
  description:
    "Practical, evidence-led workshops for researchers using agentic AI.",
  authors: [{ name: "Omar Choudhry", url: "https://omarchoudhry.co.uk" }],
  creator: "Omar Choudhry",
  alternates: {
    canonical: TUTORIAL_HOMEPAGE,
  },
  keywords: [
    "agentic AI",
    "research workflow",
    "medical imaging",
    "paper reproduction",
    "annotation tools",
    "MICCAI",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "Research with AI",
    description:
      "Three practical workshops for research workflows, project websites, and custom annotation tools.",
    images: [
      {
        url: "/research-with-ai-social.png",
        width: 1200,
        height: 630,
        alt: "Research with AI interactive workshop interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research with AI",
    description:
      "Three practical workshops for research workflows, project websites, and custom annotation tools.",
    images: ["/research-with-ai-social.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";try{var s=localStorage.getItem("research-with-ai:theme");if(s==="light"||s==="dark")t=s}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})();`,
          }}
        />
      </head>
      <body className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
