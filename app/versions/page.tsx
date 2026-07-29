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
          <h2>Four tutorials, one shared method</h2>
          <p>
            Each workshop has its own canonical address and can be cited,
            reviewed, and submitted independently. All four workshops are in
            the reviewed v1.5.0 release.
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
                  <small>
                    {release.status === "released"
                      ? `v${release.version}`
                      : "In development"}
                  </small>
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
            <p>Current released version</p>
            <h2>{TUTORIAL_VERSION_LABEL}</h2>
            <time dateTime={TUTORIAL_RELEASE_DATE}>
              Released {TUTORIAL_RELEASE_DATE}
            </time>
          </div>
          <div>
            <h3>Live paper companions and authentic annotation tools</h3>
            <ul>
              <li>
                Added source-backed live companions for the HTL real-time tool
                detection paper, the 7-DoF LASK abstract, and the accepted BTPN
                paper
              </li>
              <li>
                Replaced teaching recreations with browser-local adaptations of
                the authentic frame-annotator and surgical-annotator interfaces
              </li>
              <li>
                Expanded the approved frame demonstration to ten sequential
                Hamlyn presentation frames while retaining exactly three public
                LASK surgical examples
              </li>
              <li>
                Added a collapsible workshop table of contents with progress
                context and destination-coloured continuation cards
              </li>
              <li>
                Corrected narrow columns, text overflow, and responsive layout
                behaviour across mobile, tablet, and desktop widths
              </li>
            </ul>
            <p>
              The shared homepage remains available at{" "}
              <a href={TUTORIAL_HOMEPAGE}>
                researchwithai.omarchoudhry.co.uk
              </a>
              .
            </p>
            <p>
              Open the{" "}
              <a
                href="https://github.com/omariosc/research-with-ai/releases/tag/v1.5.0"
              >
                v1.5.0 release record on GitHub
              </a>
              .
            </p>
          </div>
        </section>

        <section className="release-notes release-notes-previous">
          <div>
            <p>Previous release</p>
            <h2>v1.4.0</h2>
            <time dateTime="2026-07-27">Released 2026-07-27</time>
          </div>
          <div>
            <h3>Four complete tutorials and refreshed evidence</h3>
            <ul>
              <li>
                Released the case-study-led AI in healthcare conference
                tutorial and its dedicated canonical domain
              </li>
              <li>
                Added the first faithful frame and surgical annotation teaching
                demonstrations under the original public-image boundary
              </li>
              <li>
                Connected the annotation-tool story to the Hamlyn group
                project, MIUA bounding-box work, LASK v1.0, and BTPN
              </li>
              <li>
                Added the Paper2Web prevalence visual and recurring AI
                paper-review guidance
              </li>
            </ul>
            <p>
              Download the{" "}
              <a
                download
                href="/releases/research-with-ai-v1.4.0-source.zip"
              >
                reviewed v1.4.0 source snapshot
              </a>{" "}
              from feature commit <code>d72814d</code>, with its{" "}
              <a href="/releases/research-with-ai-v1.4.0-source.sha256">
                SHA-256 record
              </a>
              .
            </p>
          </div>
        </section>

        <section className="release-notes release-notes-previous">
          <div>
            <p>Previous release</p>
            <h2>v1.3.0</h2>
            <time dateTime="2026-07-26">Released 2026-07-26</time>
          </div>
          <div>
            <h3>Project workspaces and evidence deep dives</h3>
            <ul>
              <li>
                Named local projects with separate notes, progress, assessments,
                deep-dive checks, and builder drafts
              </li>
              <li>
                Source-led comparisons of AI scientist systems and the
                first-hand annotation-tool origin story
              </li>
              <li>
                A runnable synthetic FastAPI and Docker model-service teaching
                pack
              </li>
            </ul>
            <p>
              Download the{" "}
              <a
                download
                href="/releases/research-with-ai-v1.3.0-source.zip"
              >
                reviewed v1.3.0 source snapshot
              </a>{" "}
              from commit <code>32b46f3</code>, with its{" "}
              <a href="/releases/research-with-ai-v1.3.0-source.sha256">
                SHA-256 record
              </a>
              .
            </p>
          </div>
        </section>

        <section className="release-notes release-notes-previous">
          <div>
            <p>Previous release</p>
            <h2>v1.2.0</h2>
            <time dateTime="2026-07-26">Released 2026-07-26</time>
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
              Download the{" "}
              <a
                download
                href="/releases/research-with-ai-v1.2.0-source.zip"
              >
                reviewed v1.2.0 source snapshot
              </a>{" "}
              from commit <code>a304472</code>, with its{" "}
              <a href="/releases/research-with-ai-v1.2.0-source.sha256">
                SHA-256 record
              </a>
              .
            </p>
          </div>
        </section>

        <section className="release-notes release-notes-previous">
          <div>
            <p>Earlier release</p>
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
