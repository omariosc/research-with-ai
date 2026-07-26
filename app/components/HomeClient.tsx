"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { readProgress } from "@/lib/storage";
import type { Workshop, WorkshopSlug } from "@/lib/types";
import {
  TUTORIAL_HOMEPAGE,
  TUTORIAL_RELEASE_DATE,
  TUTORIAL_VERSION_LABEL,
} from "@/lib/version";
import { ArrowRight, Check } from "./Icons";
import { PrivacyNote } from "./PrivacyNote";
import { SiteNav } from "./SiteNav";

const hostRoutes: Record<string, string> = {
  "researchwithai.omarchoudhry.co.uk": "/",
  "agenticresearch.omarchoudhry.co.uk": "/agentic-research",
  "interactivepaper.omarchoudhry.co.uk": "/interactive-paper",
  "annotate.omarchoudhry.co.uk": "/annotation-tools",
};

export function HomeClient({ workshops }: { workshops: Workshop[] }) {
  const router = useRouter();
  const [progress, setProgress] = useState<Record<WorkshopSlug, number>>({
    "agentic-research": 0,
    "interactive-paper": 0,
    "annotation-tools": 0,
  });

  const refresh = useCallback(() => {
    setProgress(
      Object.fromEntries(
        workshops.map((workshop) => [
          workshop.slug,
          readProgress(workshop.slug, workshop.steps[0].id).completed.length,
        ]),
      ) as Record<WorkshopSlug, number>,
    );
  }, [workshops]);

  useEffect(() => {
    const route = hostRoutes[window.location.hostname];
    if (route && route !== window.location.pathname) {
      router.replace(route);
      return;
    }
    queueMicrotask(refresh);
    window.addEventListener("research-with-ai-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("research-with-ai-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh, router]);

  return (
    <div className="site-frame">
      <SiteNav active="home" />
      <main className="home-main" id="main-content">
        <section className="home-hero">
          <div className="home-hero-copy">
            <h1>
              Research with AI, without giving up scientific control.
            </h1>
            <p>
              Three practical workshops for research workflows, project
              websites, and custom annotation tools.
            </p>
            <a className="text-link" href="#workshops">
              Choose a workshop
              <ArrowRight />
            </a>
          </div>
          <aside className="field-note">
            <span>Working rule</span>
            <p>
              Let the agent search, inspect, execute, and draft. Keep scope,
              evidence, interpretation, and release with the researcher.
            </p>
          </aside>
        </section>

        <section className="home-workshops" id="workshops">
          <div className="section-heading">
            <p>Start where the work is</p>
            <h2>Three complete routes</h2>
            <span>
              Each workshop saves progress locally on this web address and
              ends with an editable plan you can export.
            </span>
          </div>
          <div className="workshop-index">
            {workshops.map((workshop) => {
              const completed = progress[workshop.slug];
              const percent = Math.round(
                (completed / workshop.steps.length) * 100,
              );
              return (
                <article
                  className={`workshop-index-row accent-${workshop.accent}`}
                  key={workshop.slug}
                >
                  <div className="workshop-index-number">{workshop.number}</div>
                  <div className="workshop-index-copy">
                    <h3>{workshop.title}</h3>
                    <p>{workshop.description}</p>
                    <span>{workshop.promise}</span>
                  </div>
                  <div className="workshop-index-action">
                    <div
                      aria-label={`${completed} of ${workshop.steps.length} stages complete`}
                      className="mini-progress"
                    >
                      <span>
                        {completed}/{workshop.steps.length}
                      </span>
                      <i>
                        <b style={{ width: `${percent}%` }} />
                      </i>
                    </div>
                    <Link href={`/${workshop.slug}`}>
                      {completed ? "Continue" : "Begin"}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-method">
          <div className="method-intro">
            <p>How to use the material</p>
            <h2>A checklist is only useful if it changes the work.</h2>
          </div>
          <ol className="method-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Adapt</h3>
                <p>
                  Replace the example context with your project. Keep missing
                  facts as questions.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Verify</h3>
                <p>
                  Complete the human checkpoint with the source, code, data, or
                  domain expert in front of you.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Keep</h3>
                <p>
                  Export the contract, brief, or specification. Version it with
                  the research it governs.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className="human-control">
          <div>
            <p className="hand-note">Trust, but verify.</p>
            <h2>What stays human</h2>
          </div>
          <ul>
            {[
              "The scientific question and evidence standard",
              "Consent, privacy, licences, and permitted data use",
              "Approval for execution, compute spend, deployment, and release",
              "Interpretation, clinical relevance, and authorship accountability",
              "The decision to claim, reproduce, publish, or stop",
            ].map((item) => (
              <li key={item}>
                <Check size={18} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="home-about">
          <div>
            <p>Built from real work</p>
            <h2>The examples are inspectable, not hypothetical</h2>
          </div>
          <div>
            <p>
              The research and website routes share a{" "}
              <a href={`${TUTORIAL_HOMEPAGE}/worked-examples/medmnist-breast`}>
                BreastMNIST evidence pack
              </a>{" "}
              that recalculates released predictions, records a real repository
              finding, and keeps the limits visible. The annotation route uses{" "}
              <a
                href="https://github.com/omariosc/frame-annotator"
                rel="noreferrer"
                target="_blank"
              >
                frame-annotator
              </a>{" "}
              as a second honest case, including what still needs hardening.
            </p>
            <p>
              AI helped research, structure, implement, and test this material.
              Every substantive recommendation is linked to a source, and Omar
              remains responsible for the tutorial and its examples.
            </p>
          </div>
        </section>
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Research with AI</strong>
        <span>
          Omar Choudhry · {TUTORIAL_VERSION_LABEL} · {TUTORIAL_RELEASE_DATE}
        </span>
      </div>
      <div>
        <a href={`${TUTORIAL_HOMEPAGE}/versions`}>Versions</a>
        <a href="https://omarchoudhry.co.uk">Portfolio</a>
        <a href="https://github.com/omariosc">GitHub</a>
        <a href="https://miccai-sb.github.io/challenge">MICCAI MEC</a>
      </div>
    </footer>
  );
}
