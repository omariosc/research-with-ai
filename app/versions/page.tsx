import type { Metadata } from "next";
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
    "Release history and current canonical links for the Research with AI tutorials.",
  alternates: {
    canonical: `${TUTORIAL_HOMEPAGE}/versions`,
  },
};

const releases = Object.values(WORKSHOP_RELEASES);

export default function VersionsPage() {
  return (
    <div className="site-frame">
      <SiteNav active="versions" />
      <main className="versions-main" id="main-content">
        <header className="versions-hero">
          <div>
            <p>Release history</p>
            <h1>Current tutorials, clearly versioned.</h1>
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
            identifies the current content release. Canonical pages can change
            in later releases, so keep the dated submission package when an
            exact snapshot is required.
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
            <h3>Guided workflow upgrade</h3>
            <ul>
              <li>
                Five-phase lifecycle maps and four goal-based routes for every
                workshop
              </li>
              <li>
                Thirty stage field guides with concise definitions and
                researcher tricks
              </li>
              <li>
                Hosted, institution-managed, and local or offline alternatives
                with data, network, cost, hardware, evidence, and tradeoff
                notes
              </li>
              <li>Ninety saved practice checks with observable evidence targets</li>
              <li>
                Context help and stage-specific next actions for Ready, Revise,
                and Stop decisions
              </li>
              <li>
                Progress schema migration plus laptop, mobile, light, and dark
                mode browser checks
              </li>
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

        <section className="release-notes release-notes-previous">
          <div>
            <p>Previous release</p>
            <h2>v1.1.0</h2>
            <time dateTime="2026-07-26">Released 2026-07-26</time>
          </div>
          <div>
            <h3>Evidence and learning upgrade</h3>
            <ul>
              <li>Audience, prerequisites, outcomes, and a timed orientation route</li>
              <li>
                A runnable BreastMNIST evidence pack with pinned inputs,
                independent metrics, rights, and claim states
              </li>
              <li>Pinned repository and annotation cases</li>
              <li>Evidence notes and Ready, Revise, or Stop decisions</li>
              <li>Applied scenarios with explanatory feedback</li>
            </ul>
            <p>
              Download the{" "}
              <a
                download
                href="/releases/research-with-ai-v1.1.0-source.zip"
              >
                reviewed v1.1.0 source snapshot
              </a>{" "}
              from commit <code>bd3c4a2</code>, with its{" "}
              <a href="/releases/research-with-ai-v1.1.0-source.sha256">
                SHA-256 record
              </a>
              .
            </p>
          </div>
        </section>

        <section className="release-notes release-notes-previous">
          <div>
            <p>Earlier release</p>
            <h2>v1.0.0</h2>
            <time dateTime="2026-07-26">Released 2026-07-26</time>
          </div>
          <div>
            <h3>Initial public tutorial release</h3>
            <p>
              Three ten-stage checklists, copyable prompts, local progress,
              interactive builders, primary source libraries, and independent
              canonical links.
            </p>
          </div>
        </section>

        <a className="versions-back" href={TUTORIAL_HOMEPAGE}>
          Return to all workshops
          <ArrowRight size={18} />
        </a>
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}
