import type { Metadata } from "next";
import { ClearLocalDataButton } from "@/app/components/ClearLocalDataButton";
import { SiteFooter } from "@/app/components/HomeClient";
import { PrivacyNote } from "@/app/components/PrivacyNote";
import { SiteNav } from "@/app/components/SiteNav";
import {
  TUTORIAL_HOMEPAGE,
  TUTORIAL_RELEASE_DATE,
  TUTORIAL_VERSION_LABEL,
} from "@/lib/version";

export const metadata: Metadata = {
  title: "Methods, privacy, and accessibility",
  description:
    "How Research with AI was made, what the tutorials store, and the current accessibility and AI-use boundaries.",
  alternates: {
    canonical: `${TUTORIAL_HOMEPAGE}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="site-frame">
      <SiteNav active="about" />
      <main className="methods-main" id="main-content">
        <header className="methods-hero">
          <p>Methods and disclosure</p>
          <h1>How I built it, what stays local, and how to use it.</h1>
          <span>
            Tutorial {TUTORIAL_VERSION_LABEL}, released{" "}
            <time dateTime={TUTORIAL_RELEASE_DATE}>
              {TUTORIAL_RELEASE_DATE}
            </time>
          </span>
        </header>

        <section className="methods-section">
          <div>
            <p>Evidence</p>
            <h2>How the examples are checked</h2>
          </div>
          <div>
            <p>
              Sources sit beside the stage they support and are repeated in a
              source library. The first-hand cases explain what I built, what I
              learned, and where readers can inspect the supporting material.
            </p>
            <p>
              I built frame-annotator for quick clip and timeline labelling,
              then developed surgical-annotator for masks, keypoints, phases,
              visibility, and tool geometry. The frame workflow has 13 passing
              automated tests, while the richer surgical workflow is treated
              separately in the annotation tutorial. The exact source version
              is available in the{" "}
              <a href="/audits/frame-annotator-2026-07-26.md">
                technical review
              </a>
              , without interrupting the story on the main page.
            </p>
            <p>
              The BreastMNIST case pins the paper, dataset, three released
              prediction files, metric implementation, and historical
              repository finding. It recalculates two reported Table 3 cells at
              three decimals as a focused evidence check using the released
              predictions.
            </p>
            <p>
              The agentic-systems comparison links to the primary papers and
              keeps system-generated ranking, expert review, wet-lab evidence,
              and peer review separate. The annotation origin note separates
              my Hamlyn build story from the supporting project, software, and
              LASK dataset links.
            </p>
            <p>
              The model-container lab uses a transparent synthetic model. Its
              automated and live Docker checks cover service behaviour, input
              rejection, and local execution. Model accuracy and clinical
              validation would be assessed separately for the real model and
              intended use.
            </p>
          </div>
        </section>

        <section className="methods-section">
          <div>
            <p>Privacy</p>
            <h2>Local does not mean secret</h2>
          </div>
          <div>
            <p>
              Project names and notes, progress, evidence notes, assessment
              choices, and builder drafts use unencrypted browser local storage
              on the current web address with the prefix{" "}
              <code>research-with-ai:v1</code>. The theme choice uses{" "}
              <code>research-with-ai:theme</code>. Browser extensions, device
              users, backups, or browser-profile tools may be able to read
              these values.
            </p>
            <p>
              Browser storage is separated by origin. Progress recorded on the
              shared hub is not visible on a standalone tutorial address, and
              clearing data here does not clear the other addresses. Use the
              clear control once on each address you have used.
            </p>
            <p>
              The application has no account, database, advertising, analytics,
              or tracking cookie. Ordinary HTTPS request metadata may still be
              processed in operational logs by the hosting and domain
              providers. Do not enter patient data, credentials, confidential
              study details, or linkage keys.
            </p>
            <ClearLocalDataButton />
          </div>
        </section>

        <section className="methods-section">
          <div>
            <p>Accessibility</p>
            <h2>WCAG 2.2 AA is the target</h2>
          </div>
          <div>
            <p>
              The current release includes a skip link, semantic headings,
              visible focus, keyboard controls, reduced-motion support,
              responsive reflow, light and dark themes, text alternatives, and
              non-colour feedback.
            </p>
            <p>
              An independent screen-reader review and target learner pilot are
              planned next. Captions and transcripts will be added with the
              final recordings. The annotation demos preserve the original
              interfaces and run with public examples so readers can practise
              the workflow directly.
            </p>
          </div>
        </section>

        <section className="methods-section">
          <div>
            <p>AI use</p>
            <h2>Assistance was substantial and disclosed</h2>
          </div>
          <div>
            <p>
              I used ChatGPT and Codex for research, drafting, repository
              inspection, implementation, and testing. An OpenAI image model
              generated the social preview. I checked AI suggestions against
              the sources, reviewed every code change, and tested the finished
              workflows.
            </p>
            <p>
              I made the scientific, ethical, legal, and editorial decisions
              and will give the final submission sign-off. I will also review
              later changes and add the recordings and transcripts as they are
              completed.
            </p>
          </div>
        </section>

        <section className="methods-license">
          <p>
            Original tutorial content is licensed under{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/">
              CC BY 4.0
            </a>
            . Source code is MIT licensed. Third-party material retains its own
            terms. The MedMNIST worked case includes an item-level{" "}
            <a href="/worked-examples/medmnist-breast/source-manifest.json">
              source and rights manifest
            </a>
            . The version page provides a checksum-recorded source snapshot of
            the reviewed release.
          </p>
        </section>
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}
