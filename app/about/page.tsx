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
          <h1>What this platform does, stores, and still needs checked.</h1>
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
            <h2>Claims have boundaries</h2>
          </div>
          <div>
            <p>
              Sources sit beside the stage they support and are repeated in a
              source library. Product documentation describes current product
              behaviour, not independent scientific evidence. Every first-hand
              case states what was inspected, what changed, and what it does
              not prove.
            </p>
            <p>
              The frame-annotator findings are pinned to commit{" "}
              <code>3e94ed03c1487331b8c041ca755421686b41d031</code>. The
              clean core test run passed 13 tests, but it did not cover the
              complete surgical-annotator application. This is a code audit,
              not clinical validation.
            </p>
            <p>
              The BreastMNIST case pins the paper, dataset, three released
              prediction files, metric implementation, and historical
              repository finding. It recovers two reported Table 3 cells at
              three decimals. It does not claim model retraining,
              whole-paper reproduction, or clinical validity.
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
              Progress, evidence notes, assessment choices, and builder drafts
              use unencrypted browser local storage on the current web address
              with the prefix{" "}
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
              Known limitations: an independent screen-reader audit and target
              learner usability pilot are still required. Videos, captions, and
              transcripts are not present until the final recordings are
              published. The embedded annotation interaction is a teaching
              mock and not a validated medical interface.
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
              ChatGPT and Codex assisted with research, drafting, repository
              inspection, implementation, and testing. An OpenAI image model
              generated the social preview. AI output was treated as a
              proposal, then checked through sources, visible diffs, commands,
              tests, and human decisions.
            </p>
            <p>
              Omar Choudhry remains responsible for the scientific, ethical,
              legal, and editorial decisions. Final submission sign-off,
              recordings, transcripts, and later claim changes remain named
              human tasks.
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
