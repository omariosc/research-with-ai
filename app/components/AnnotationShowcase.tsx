"use client";

import { useState } from "react";
import { ExternalLink } from "./Icons";

type ShowcaseMode = "frame" | "surgical";

const DEMOS = {
  frame: {
    number: "01",
    name: "frame-annotator",
    summary: "Classify frame ranges on the original timeline interface",
    heading: "Use the actual Hamlyn prototype workflow",
    description:
      "The static demo preserves the original frame-annotator HTML, styling, timeline, classification controls, and keyboard shortcuts. It opens with ten explicitly approved frames recovered from the author-owned Hamlyn presentation video.",
    preview: "/annotation-demos/frame-annotator/preview.png",
    href: "/annotation-demos/frame-annotator/",
    previewAlt:
      "Original frame-annotator interface showing a Hamlyn robotics frame, clip timeline, classification controls, and keyboard shortcuts",
    sample: "10 Hamlyn frames",
    rights: "Author approved",
    boundary: "Lossy presentation recovery with existing overlays",
  },
  surgical: {
    number: "02",
    name: "surgical-annotator",
    summary: "Draw masks, shaft lines, keypoints, and phases",
    heading: "Open the interface used to build LASK",
    description:
      "This is the original surgical-annotator frontend with its native canvas, tool panels, keybinds, visibility states, phase controls, and JSON view. The browser adapter exposes only three verified public LASK Trial46 examples.",
    preview: "/annotation-demos/surgical-annotator/preview.png",
    href: "/annotation-demos/surgical-annotator/",
    previewAlt:
      "Original surgical-annotator interface showing a public LASK frame with masks, shaft lines, keypoints, and the native side panels",
    sample: "3 LASK Trial46 frames",
    rights: "CC BY 4.0",
    boundary: "Public fixtures only, no private trials",
  },
} as const;

function ToolTab({
  mode,
  activeMode,
  onActivate,
}: {
  mode: ShowcaseMode;
  activeMode: ShowcaseMode;
  onActivate: (mode: ShowcaseMode) => void;
}) {
  const demo = DEMOS[mode];
  const otherMode = mode === "frame" ? "surgical" : "frame";

  return (
    <button
      aria-controls={`${mode}-annotator-panel`}
      aria-selected={activeMode === mode}
      id={`${mode}-annotator-tab`}
      onClick={() => onActivate(mode)}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        onActivate(otherMode);
        document.getElementById(`${otherMode}-annotator-tab`)?.focus();
      }}
      role="tab"
      tabIndex={activeMode === mode ? 0 : -1}
      type="button"
    >
      <span>{demo.number}</span>
      <div>
        <strong>{demo.name}</strong>
        <small>{demo.summary}</small>
      </div>
    </button>
  );
}

export function AnnotationShowcase() {
  const [mode, setMode] = useState<ShowcaseMode>("frame");
  const demo = DEMOS[mode];

  return (
    <section className="annotation-showcase" id="demo">
      <div className="section-heading section-heading-wide">
        <p>Try the tools as they were built</p>
        <h2>Two authentic interfaces, with safe public fixtures</h2>
        <span>
          Each screenshot opens a browser-only edition of Omar&apos;s original
          open-source frontend. The server layer is replaced with a local
          fixture adapter, so edits stay in your browser and Reset restores the
          disclosed examples.
        </span>
      </div>

      <ol className="annotation-showcase-steps">
        <li>
          <span>1</span>
          Choose the interface that matches your annotation unit
        </li>
        <li>
          <span>2</span>
          Open the full tool in a separate tab
        </li>
        <li>
          <span>3</span>
          Use the original controls, pointer actions, and shortcuts
        </li>
        <li>
          <span>4</span>
          Save a local draft or reset the fixtures
        </li>
      </ol>

      <div className="annotation-showcase-source-strip">
        <div>
          <span>Original frontend</span>
          <strong>omariosc/frame-annotator</strong>
          <small>Public HEAD 0dcfc9e · MIT</small>
        </div>
        <div>
          <span>Public fixture boundary</span>
          <strong>10 Hamlyn · 3 LASK</strong>
          <small>Explicit author approval · CC BY 4.0</small>
        </div>
        <div>
          <span>Browser behaviour</span>
          <strong>Local save and reset</strong>
          <small>No upload, account, model call, or write-back</small>
        </div>
      </div>

      <div
        aria-label="Choose annotation tool"
        className="annotation-showcase-tabs"
        role="tablist"
      >
        <ToolTab mode="frame" activeMode={mode} onActivate={setMode} />
        <ToolTab mode="surgical" activeMode={mode} onActivate={setMode} />
      </div>

      <div
        aria-labelledby={`${mode}-annotator-tab`}
        id={`${mode}-annotator-panel`}
        role="tabpanel"
      >
        <div className="annotation-showcase-panel-intro">
          <div>
            <p>Authentic static demo</p>
            <h3>{demo.heading}</h3>
          </div>
          <p>{demo.description}</p>
        </div>

        <a
          aria-label={`Open the full ${demo.name} demo`}
          href={demo.href}
          rel="noreferrer"
          style={{
            background: mode === "frame" ? "#f5f5f5" : "#1a1a2e",
            borderBottom: "1px solid var(--rule)",
            display: "block",
            overflow: "hidden",
            position: "relative",
          }}
          target="_blank"
        >
          {/* The preview is a browser capture of the static demo itself. */}
          <img
            alt={demo.previewAlt}
            height={827}
            src={demo.preview}
            style={{
              display: "block",
              height: "auto",
              maxHeight: "min(76vh, 900px)",
              objectFit: "contain",
              objectPosition: "top center",
              width: "100%",
            }}
            width={1512}
          />
        </a>

        <div className="annotation-showcase-source-strip">
          <div>
            <span>Included examples</span>
            <strong>{demo.sample}</strong>
            <small>{demo.rights}</small>
          </div>
          <div>
            <span>Publication boundary</span>
            <strong>{demo.boundary}</strong>
            <small>See the linked provenance record</small>
          </div>
          <div>
            <span>Open the complete interface</span>
            <strong>
              <a href={demo.href} rel="noreferrer" target="_blank">
                Launch {demo.name} <ExternalLink size={14} />
              </a>
            </strong>
            <small>Edits remain in this browser</small>
          </div>
        </div>
      </div>

      <footer className="annotation-showcase-footer">
        <a
          href="https://github.com/omariosc/frame-annotator/tree/0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a"
          rel="noreferrer"
          target="_blank"
        >
          Inspect the pinned source <ExternalLink size={14} />
        </a>
        <a
          href="https://doi.org/10.5281/zenodo.20752651"
          rel="noreferrer"
          target="_blank"
        >
          Open LASK v1.0 <ExternalLink size={14} />
        </a>
        <a href="/citations/annotation-showcase-media-2026-07-29.md">
          Read the fixture provenance
        </a>
      </footer>
    </section>
  );
}
