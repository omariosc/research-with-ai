import type { Metadata } from "next";
import Link from "next/link";
import { PrivacyNote } from "@/app/components/PrivacyNote";
import { SiteFooter } from "@/app/components/HomeClient";
import { ArrowRight } from "@/app/components/Icons";
import { SiteNav } from "@/app/components/SiteNav";
import {
  TUTORIAL_HOMEPAGE,
  TUTORIAL_RELEASE_DATE,
  TUTORIAL_VERSION_LABEL,
  WORKSHOP_RELEASES,
} from "@/lib/version";

export const metadata: Metadata = {
  title: "Version history",
  description:
    "Release history and stable canonical links for the Research with AI tutorials.",
  alternates: {
    canonical: `${TUTORIAL_HOMEPAGE}/versions`,
  },
};

const releases = Object.values(WORKSHOP_RELEASES);

export default function VersionsPage() {
  return (
    <div className="site-frame">
      <SiteNav active="versions" />
      <main className="versions-main">
        <header className="versions-hero">
          <div>
            <p>Release history</p>
            <h1>Stable tutorials, clearly versioned.</h1>
          </div>
          <aside>
            <span>Current content release</span>
            <strong>{TUTORIAL_VERSION_LABEL}</strong>
            <time dateTime={TUTORIAL_RELEASE_DATE}>
              {TUTORIAL_RELEASE_DATE}
            </time>
          </aside>
        </header>

        <section className="versions-intro">
          <h2>Three submissions, one shared method</h2>
          <p>
            Each workshop has its own canonical address and can be cited,
            reviewed, and submitted independently. The shared release number
            identifies the exact tutorial text, prompts, checkpoints, and
            exported templates.
          </p>
        </section>

        <section className="version-workshops" aria-labelledby="workshop-links">
          <div className="section-heading">
            <p>Canonical workshop links</p>
            <h2 id="workshop-links">Version {TUTORIAL_VERSION_LABEL}</h2>
          </div>
          <ol>
            {releases.map((release, index) => (
              <li key={release.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{release.title}</h3>
                  <code>{release.canonicalHostname}</code>
                </div>
                <div>
                  <small>{TUTORIAL_VERSION_LABEL}</small>
                  <a href={release.canonicalUrl}>
                    Open tutorial
                    <ArrowRight size={17} />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="release-notes">
          <div>
            <p>Current release</p>
            <h2>{TUTORIAL_VERSION_LABEL}</h2>
            <time dateTime={TUTORIAL_RELEASE_DATE}>
              Released {TUTORIAL_RELEASE_DATE}
            </time>
          </div>
          <div>
            <h3>Initial public tutorial release</h3>
            <ul>
              <li>Three complete ten-stage research workshops</li>
              <li>Human evidence gates and locally saved progress</li>
              <li>Copyable prompts and version-marked exports</li>
              <li>Interactive planning and annotation demonstrations</li>
              <li>Primary source libraries and independent canonical links</li>
            </ul>
            <p>
              The shared homepage remains available at{" "}
              <a href={TUTORIAL_HOMEPAGE}>
                researchwithai.omarchoudhry.co.uk
              </a>
              .
            </p>
          </div>
        </section>

        <Link className="versions-back" href="/">
          Return to all workshops
          <ArrowRight size={18} />
        </Link>
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}
