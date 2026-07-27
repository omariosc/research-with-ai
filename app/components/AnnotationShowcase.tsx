"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  FRAME_CLASSES,
  FRAME_SAMPLES,
  FRAME_STARTER_CLIPS,
  SURGICAL_PHASES,
  SURGICAL_SAMPLES,
  SURGICAL_TOOLS,
  cloneValue,
  completedSurgicalComponents,
  frameClipsToCsv,
  labelledFrameCount,
  surgicalToolDefinition,
  type FrameClip,
  type Point,
  type SurgicalAnnotation,
  type SurgicalToolDefinition,
  type SurgicalToolId,
  type Visibility,
  type VisibilityKey,
} from "@/lib/annotation-showcase";
import { copyText, downloadText } from "@/lib/storage";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Refresh,
} from "./Icons";

type ShowcaseMode = "frame" | "surgical";
type ExportView = "json" | "csv";

const STATUS_COMPONENTS: readonly {
  key: VisibilityKey;
  label: string;
}[] = [
  { key: "mask", label: "Mask" },
  { key: "lines", label: "Lines" },
  { key: "joint", label: "Joint" },
  { key: "ee_tip", label: "EE Tip" },
  { key: "ee_left", label: "EE L" },
  { key: "ee_right", label: "EE R" },
] as const;

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLButtonElement
  );
}

function classForClip(clip: FrameClip | undefined) {
  return FRAME_CLASSES.find((item) => item.id === clip?.class);
}

function FrameAnnotatorDemo({ active }: { active: boolean }) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [clips, setClips] = useState<FrameClip[]>(() =>
    cloneValue([...FRAME_STARTER_CLIPS]),
  );
  const [savedClips, setSavedClips] = useState<FrameClip[]>(() =>
    cloneValue([...FRAME_STARTER_CLIPS]),
  );
  const [selectedClipIndex, setSelectedClipIndex] = useState<number | null>(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [exportView, setExportView] = useState<ExportView>("json");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(
    "Starter record loaded. Frame 2 is intentionally unlabelled so you can add a clip.",
  );

  const selectedClip =
    selectedClipIndex === null ? undefined : clips[selectedClipIndex];
  const json = JSON.stringify({ clips }, null, 2);
  const csv = frameClipsToCsv(clips);
  const output = exportView === "json" ? json : csv;
  const labelled = labelledFrameCount(clips);

  useEffect(() => {
    if (!active) {
      setPlaying(false);
      return;
    }
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrentFrame((value) => {
        const next = (value + 1) % FRAME_SAMPLES.length;
        const clipIndex = clips.findIndex(
          (clip) => next >= clip.start && next <= clip.end,
        );
        setSelectedClipIndex(clipIndex >= 0 ? clipIndex : null);
        setStatus(
          clipIndex >= 0
            ? `Playback: frame ${next} is in clip ${clipIndex}.`
            : `Playback: frame ${next} is unlabelled.`,
        );
        return next;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [active, clips, playing]);

  function selectFrame(index: number) {
    setCurrentFrame(index);
    const clipIndex = clips.findIndex(
      (clip) => index >= clip.start && index <= clip.end,
    );
    setSelectedClipIndex(clipIndex >= 0 ? clipIndex : null);
    setStatus(
      clipIndex >= 0
        ? `Frame ${index} is in clip ${clipIndex}.`
        : `Frame ${index} is unlabelled. Add a marker to create its clip.`,
    );
  }

  function addMarker() {
    const occupied = clips.findIndex(
      (clip) =>
        currentFrame >= clip.start && currentFrame <= clip.end,
    );
    if (occupied >= 0) {
      setSelectedClipIndex(occupied);
      setStatus(
        `Frame ${currentFrame} already belongs to clip ${occupied}. Select the unlabelled frame first.`,
      );
      return;
    }
    const next = [
      ...clips,
      { start: currentFrame, end: currentFrame, class: "positive" },
    ].sort((a, b) => a.start - b.start);
    setClips(next);
    setSelectedClipIndex(
      next.findIndex(
        (clip) => clip.start === currentFrame && clip.end === currentFrame,
      ),
    );
    setStatus(
      `Marker added at frame ${currentFrame}. A one-frame Positive clip is selected.`,
    );
  }

  function assignClass(classId: string) {
    if (selectedClipIndex === null) {
      setStatus("Select or create a clip before assigning a class.");
      return;
    }
    setClips((current) =>
      current.map((clip, index) =>
        index === selectedClipIndex ? { ...clip, class: classId } : clip,
      ),
    );
    setStatus(
      `Clip ${selectedClipIndex} changed to ${classId}. JSON and CSV updated.`,
    );
  }

  function deleteSelectedClip() {
    if (selectedClipIndex === null) {
      setStatus("Select a clip before deleting it.");
      return;
    }
    const removed = selectedClipIndex;
    setClips((current) =>
      current.filter((_, index) => index !== selectedClipIndex),
    );
    setSelectedClipIndex(null);
    setStatus(`Clip ${removed} deleted. Its frame is now unlabelled.`);
  }

  function selectAdjacentClip(direction: -1 | 1) {
    if (clips.length === 0) return;
    const current = selectedClipIndex ?? (direction > 0 ? -1 : 0);
    const next = (current + direction + clips.length) % clips.length;
    setSelectedClipIndex(next);
    setCurrentFrame(clips[next].start);
    setStatus(`Clip ${next} selected.`);
  }

  function firstUnlabelled() {
    const index = FRAME_SAMPLES.findIndex(
      (_, frame) =>
        !clips.some((clip) => frame >= clip.start && frame <= clip.end),
    );
    if (index < 0) {
      setStatus("All three frames are labelled.");
      return;
    }
    selectFrame(index);
  }

  function resetStarter() {
    const starter = cloneValue([...FRAME_STARTER_CLIPS]);
    setClips(starter);
    setSavedClips(starter);
    setCurrentFrame(0);
    setSelectedClipIndex(0);
    setPlaying(false);
    setZoom(1);
    setExportView("json");
    setStatus("Reset to the disclosed three-frame starter record.");
  }

  function handleShortcut(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (isTypingTarget(event.target)) return;
    const key = event.key.toLowerCase();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectFrame(
        (currentFrame - 1 + FRAME_SAMPLES.length) % FRAME_SAMPLES.length,
      );
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectFrame((currentFrame + 1) % FRAME_SAMPLES.length);
    } else if (event.key === " ") {
      event.preventDefault();
      setPlaying((value) => !value);
    } else if (key === "m") {
      event.preventDefault();
      addMarker();
    } else if (event.key === "Backspace") {
      event.preventDefault();
      deleteSelectedClip();
    } else if (event.key === "[") {
      event.preventDefault();
      selectAdjacentClip(-1);
    } else if (event.key === "]") {
      event.preventDefault();
      selectAdjacentClip(1);
    } else if (key === "h" && selectedClip) {
      event.preventDefault();
      selectFrame(selectedClip.start);
    } else if (key === "k" && selectedClip) {
      event.preventDefault();
      selectFrame(selectedClip.end);
    } else if (key === "j") {
      event.preventDefault();
      firstUnlabelled();
    } else if (event.key === "+") {
      event.preventDefault();
      setZoom((value) => Math.min(3, value + 0.5));
    } else if (event.key === "-") {
      event.preventDefault();
      setZoom((value) => Math.max(1, value - 0.5));
    } else if (key === "r") {
      event.preventDefault();
      setZoom(1);
      setStatus("Timeline zoom reset.");
    } else if (key === "s") {
      event.preventDefault();
      setSavedClips(cloneValue(clips));
      setStatus(
        "Draft saved inside this browser demo. The full Flask app also writes JSON, CSV, and timestamped backups.",
      );
    } else if (key === "l") {
      event.preventDefault();
      const loaded = cloneValue(savedClips);
      setClips(loaded);
      setSelectedClipIndex(savedClips.length ? 0 : null);
      setCurrentFrame(loaded.length ? loaded[0].start : 0);
      setStatus(
        loaded.length
          ? `Last demo save loaded at clip 0, frame ${loaded[0].start}.`
          : "Last demo save loaded with no clips.",
      );
    } else if (key === "1" || key === "2") {
      event.preventDefault();
      assignClass(key === "1" ? "positive" : "negative");
    }
  }

  return (
    <div
      className="frame-annotator-app"
      onKeyDown={handleShortcut}
      tabIndex={0}
    >
      <div className="annotator-demo-focus-note">
        Click this workspace once to use its original keyboard rhythm.
      </div>
      <div className="frame-annotator-layout">
        <main className="frame-annotator-viewer">
          <div className="frame-annotator-image">
            <img
              alt={`Permitted repository sample ${currentFrame + 1} of 3`}
              height={240}
              src={FRAME_SAMPLES[currentFrame].imagePath}
              width={320}
            />
          </div>

          <div className="frame-annotator-stats">
            <span>
              <strong>Frame:</strong> {currentFrame} / 2
            </span>
            <span>
              <strong>Labelled:</strong> {labelled} / 3
            </span>
            <span>
              <strong>Current clip:</strong>{" "}
              {selectedClipIndex === null
                ? "None"
                : `Clip ${selectedClipIndex} (${selectedClip?.class})`}
            </span>
          </div>

          <div className="frame-annotator-navigation">
            <button
              onClick={() =>
                selectFrame(
                  (currentFrame - 1 + FRAME_SAMPLES.length) %
                    FRAME_SAMPLES.length,
                )
              }
              type="button"
            >
              <ArrowLeft size={15} />
              Previous
              <kbd>&larr;</kbd>
            </button>
            <button
              className="is-primary"
              onClick={() => setPlaying((value) => !value)}
              type="button"
            >
              {playing ? "Pause" : "Play"} <kbd>Space</kbd>
            </button>
            <button
              onClick={() =>
                selectFrame((currentFrame + 1) % FRAME_SAMPLES.length)
              }
              type="button"
            >
              Next <kbd>&rarr;</kbd>
              <ArrowRight size={15} />
            </button>
            <input
              aria-label="Current frame"
              max={2}
              min={0}
              onChange={(event) => selectFrame(Number(event.target.value))}
              type="range"
              value={currentFrame}
            />
          </div>

          <div className="frame-annotator-samples" aria-label="Permitted samples">
            {FRAME_SAMPLES.map((sample, index) => (
              <button
                aria-current={currentFrame === index ? "true" : undefined}
                key={sample.id}
                onClick={() => selectFrame(index)}
                type="button"
              >
                <img alt="" height={54} src={sample.imagePath} width={72} />
                <span>
                  Example {index + 1}
                  <small>{sample.filename}</small>
                </span>
              </button>
            ))}
          </div>

          <section className="frame-annotator-timeline">
            <div className="frame-annotator-timeline-heading">
              <h4>Timeline</h4>
              <div>
                <button
                  aria-label="Zoom timeline out"
                  onClick={() =>
                    setZoom((value) => Math.max(1, value - 0.5))
                  }
                  type="button"
                >
                  &minus;
                </button>
                <span>{zoom.toFixed(1)}&times;</span>
                <button
                  aria-label="Zoom timeline in"
                  onClick={() =>
                    setZoom((value) => Math.min(3, value + 0.5))
                  }
                  type="button"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setStatus("Timeline zoom reset.");
                  }}
                  type="button"
                >
                  Reset <kbd>R</kbd>
                </button>
                <button className="is-primary" onClick={addMarker} type="button">
                  + Add marker <kbd>M</kbd>
                </button>
                <button
                  className="is-danger"
                  onClick={deleteSelectedClip}
                  type="button"
                >
                  Delete clip
                </button>
              </div>
            </div>
            <div className="frame-annotator-timeline-scroll">
              <div
                className="frame-annotator-timeline-track"
                style={{ width: `${zoom * 100}%` }}
              >
                {FRAME_SAMPLES.map((sample, frame) => {
                  const clipIndex = clips.findIndex(
                    (clip) => frame >= clip.start && frame <= clip.end,
                  );
                  const clip = clipIndex >= 0 ? clips[clipIndex] : undefined;
                  const classification = classForClip(clip);
                  return (
                    <button
                      aria-label={`${sample.filename}: ${
                        classification?.name ?? "unlabelled"
                      }`}
                      className={[
                        currentFrame === frame ? "is-current" : "",
                        selectedClipIndex === clipIndex && clipIndex >= 0
                          ? "is-selected"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={sample.id}
                      onClick={() => selectFrame(frame)}
                      style={{
                        backgroundColor: classification?.color ?? "transparent",
                      }}
                      type="button"
                    >
                      <span>{frame}</span>
                      <small>{classification?.name ?? "Unlabelled"}</small>
                    </button>
                  );
                })}
              </div>
            </div>
            <p>
              Click to seek. The complete app also supports dragging clip
              boundaries and panning a long zoomed timeline.
            </p>
          </section>
        </main>

        <aside className="frame-annotator-sidebar">
          <section>
            <h3>Classification</h3>
            <div className="frame-annotator-class-options">
              {FRAME_CLASSES.map((item) => (
                <button
                  aria-pressed={selectedClip?.class === item.id}
                  className={
                    selectedClip?.class === item.id ? "is-selected" : ""
                  }
                  key={item.id}
                  onClick={() => assignClass(item.id)}
                  style={{ borderColor: item.color }}
                  type="button"
                >
                  <strong>
                    {item.name} <kbd>{item.shortcut}</kbd>
                  </strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Clips</h3>
            <div className="frame-annotator-clip-list">
              {clips.length ? (
                clips.map((clip, index) => {
                  const classification = classForClip(clip);
                  return (
                    <button
                      aria-current={
                        selectedClipIndex === index ? "true" : undefined
                      }
                      key={`${clip.start}-${clip.end}-${index}`}
                      onClick={() => {
                        setSelectedClipIndex(index);
                        setCurrentFrame(clip.start);
                        setStatus(`Clip ${index} selected.`);
                      }}
                      type="button"
                    >
                      <span>
                        <strong>Clip {index}</strong>
                        <small
                          style={{
                            backgroundColor: classification?.color,
                          }}
                        >
                          {clip.class}
                        </small>
                      </span>
                      Frames {clip.start} to {clip.end} (
                      {clip.end - clip.start + 1} frame
                      {clip.end === clip.start ? "" : "s"})
                    </button>
                  );
                })
              ) : (
                <p>No clips yet. Choose a frame and add a marker.</p>
              )}
            </div>
          </section>

          <div className="frame-annotator-save-row">
            <button
              onClick={() => {
                const loaded = cloneValue(savedClips);
                setClips(loaded);
                setSelectedClipIndex(loaded.length ? 0 : null);
                setCurrentFrame(loaded.length ? loaded[0].start : 0);
                setStatus(
                  loaded.length
                    ? `Last demo save loaded at clip 0, frame ${loaded[0].start}.`
                    : "Last demo save loaded with no clips.",
                );
              }}
              type="button"
            >
              Load <kbd>L</kbd>
            </button>
            <button
              className="is-success"
              onClick={() => {
                setSavedClips(cloneValue(clips));
                setStatus(
                  "Draft saved in this tab. The complete tool also writes timestamped backups.",
                );
              }}
              type="button"
            >
              Save <kbd>S</kbd>
            </button>
          </div>

          <details className="annotator-shortcuts">
            <summary>Keyboard shortcuts from the real tool</summary>
            <dl>
              <div>
                <dt>&larr; / &rarr;</dt>
                <dd>Previous / next frame</dd>
              </div>
              <div>
                <dt>Space</dt>
                <dd>Play / pause</dd>
              </div>
              <div>
                <dt>M</dt>
                <dd>Add marker</dd>
              </div>
              <div>
                <dt>[ / ]</dt>
                <dd>Previous / next clip</dd>
              </div>
              <div>
                <dt>H / K</dt>
                <dd>Clip start / end</dd>
              </div>
              <div>
                <dt>J</dt>
                <dd>First unlabelled frame</dd>
              </div>
              <div>
                <dt>1 / 2</dt>
                <dd>Positive / negative</dd>
              </div>
              <div>
                <dt>S / L</dt>
                <dd>Save / load</dd>
              </div>
            </dl>
          </details>
        </aside>
      </div>

      <div className="annotator-export-panel">
        <div>
          <p>Native export</p>
          <h3>
            {exportView === "json"
              ? "Inclusive clip JSON"
              : "Expanded frame CSV"}
          </h3>
          <span>
            This is the real frame-annotator shape, not the tutorial&apos;s
            planning schema.
          </span>
        </div>
        <div className="annotator-export-tabs" role="tablist">
          <button
            aria-selected={exportView === "json"}
            onClick={() => setExportView("json")}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
              }
              event.preventDefault();
              setExportView("csv");
              (
                event.currentTarget.nextElementSibling as HTMLElement | null
              )?.focus();
            }}
            role="tab"
            tabIndex={exportView === "json" ? 0 : -1}
            type="button"
          >
            JSON
          </button>
          <button
            aria-selected={exportView === "csv"}
            onClick={() => setExportView("csv")}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
                return;
              }
              event.preventDefault();
              setExportView("json");
              (
                event.currentTarget.previousElementSibling as HTMLElement | null
              )?.focus();
            }}
            role="tab"
            tabIndex={exportView === "csv" ? 0 : -1}
            type="button"
          >
            CSV
          </button>
        </div>
        <pre>{output}</pre>
        <div className="annotator-export-actions">
          <button
            onClick={async () => {
              await copyText(output);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }}
            type="button"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy export"}
          </button>
          <button
            onClick={() =>
              downloadText(
                exportView === "json" ? "annotations.json" : "annotations.csv",
                output,
                exportView === "json"
                  ? "application/json;charset=utf-8"
                  : "text/csv;charset=utf-8",
              )
            }
            type="button"
          >
            <Download size={15} />
            Download {exportView.toUpperCase()}
          </button>
          <button onClick={resetStarter} type="button">
            <Refresh size={15} />
            Reset starter
          </button>
        </div>
      </div>
      <p className="annotator-live-status" aria-live="polite" role="status">
        {status}
      </p>
      <p className="annotator-source-note">
        Only the first three repository samples are bundled. The green clip is
        a disclosed teaching starter, not research ground truth.
      </p>
    </div>
  );
}

function lineMidpoint(
  first: Point[],
  second: Point[],
): Point[] {
  if (first.length !== 2 || second.length !== 2) return [];
  return [
    [
      (first[0][0] + second[0][0]) / 2,
      (first[0][1] + second[0][1]) / 2,
    ],
    [
      (first[1][0] + second[1][0]) / 2,
      (first[1][1] + second[1][1]) / 2,
    ],
  ];
}

function pointString(points: Point[]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function clearGeometry(
  annotation: SurgicalAnnotation,
  tool: SurgicalToolDefinition,
) {
  const record = annotation as unknown as Record<string, unknown>;
  const prefix = `tool${tool.toolNumber}`;
  if (tool.visibilityKey === "lines") {
    const lineType = tool.id.endsWith("top") ? "top" : "bottom";
    const lines = record[`${prefix}_lines`] as {
      top: Point[];
      bottom: Point[];
    };
    lines[lineType] = [];
  } else {
    record[tool.id] = [];
  }
}

function setGeometryPoint(
  annotation: SurgicalAnnotation,
  tool: SurgicalToolDefinition,
  point: Point,
) {
  const record = annotation as unknown as Record<string, unknown>;
  const prefix = `tool${tool.toolNumber}`;
  if (tool.visibilityKey === "lines") {
    const lineType = tool.id.endsWith("top") ? "top" : "bottom";
    const lines = record[`${prefix}_lines`] as {
      top: Point[];
      bottom: Point[];
    };
    lines[lineType] =
      lines[lineType].length === 1 ? [lines[lineType][0], point] : [point];
  } else {
    record[tool.id] = point;
  }
}

function markWholeToolOut(
  annotation: SurgicalAnnotation,
  toolNumber: 1 | 2,
) {
  const prefix = `tool${toolNumber}` as const;
  annotation[`${prefix}_visibility`] = {
    mask: -1,
    lines: -1,
    joint: -1,
    ee_tip: -1,
    ee_left: -1,
    ee_right: -1,
  };
}

function SurgicalOverlay({
  annotation,
  previewMask,
}: {
  annotation: SurgicalAnnotation;
  previewMask?: { points: Point[]; toolNumber: 1 | 2 };
}) {
  const tool1Middle = lineMidpoint(
    annotation.tool1_lines.top,
    annotation.tool1_lines.bottom,
  );
  const tool2Middle = lineMidpoint(
    annotation.tool2_lines.top,
    annotation.tool2_lines.bottom,
  );

  function renderConnections(toolNumber: 1 | 2, color: string) {
    const prefix = `tool${toolNumber}` as const;
    const joint = annotation[`${prefix}_joint`];
    if (
      joint.length !== 2 ||
      annotation[`${prefix}_visibility`].joint === -1
    ) {
      return null;
    }
    return (["ee_tip", "ee_left", "ee_right"] as const).map((key) => {
      const point = annotation[`${prefix}_${key}`];
      return (
        point.length === 2 &&
        annotation[`${prefix}_visibility`][key] !== -1
      ) ? (
        <line
          className="surgical-overlay-connection"
          key={`${prefix}-${key}`}
          stroke={color}
          x1={joint[0]}
          x2={point[0]}
          y1={joint[1]}
          y2={point[1]}
        />
      ) : null;
    });
  }

  function renderKeypoints(toolNumber: 1 | 2, color: string) {
    const prefix = `tool${toolNumber}` as const;
    return (
      [
        ["joint", "J"],
        ["ee_tip", "T"],
        ["ee_left", "L"],
        ["ee_right", "R"],
      ] as const
    ).map(([key, label]) => {
      const point = annotation[`${prefix}_${key}`];
      if (point.length !== 2) return null;
      const visibility = annotation[`${prefix}_visibility`][key];
      if (visibility === -1) return null;
      const markerColor = visibility === 0 ? "#ff9800" : color;
      return (
        <g key={`${prefix}-${key}`}>
          <circle
            className="surgical-overlay-keypoint"
            cx={point[0]}
            cy={point[1]}
            fill={markerColor}
            r={18}
            stroke="#ffffff"
          />
          <text
            className="surgical-overlay-keypoint-label"
            fill="#ffffff"
            x={point[0]}
            y={point[1] + 4}
          >
            {label}
          </text>
        </g>
      );
    });
  }

  return (
    <svg
      aria-hidden="true"
      className="surgical-annotator-overlay"
      viewBox="0 0 1280 720"
    >
      {annotation.tool1_visibility.mask !== -1 &&
      annotation.tool1_mask.length >= 3 ? (
        <polygon
          fill="rgba(74, 158, 255, 0.30)"
          points={pointString(annotation.tool1_mask)}
          stroke="#4a9eff"
        />
      ) : null}
      {annotation.tool2_visibility.mask !== -1 &&
      annotation.tool2_mask.length >= 3 ? (
        <polygon
          fill="rgba(74, 224, 102, 0.30)"
          points={pointString(annotation.tool2_mask)}
          stroke="#4ae066"
        />
      ) : null}
      {annotation.tool1_visibility.lines !== -1 &&
      annotation.tool1_lines.top.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-top"
          points={pointString(annotation.tool1_lines.top)}
          stroke="#4a9eff"
        />
      ) : null}
      {annotation.tool1_visibility.lines !== -1 &&
      annotation.tool1_lines.bottom.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-bottom"
          points={pointString(annotation.tool1_lines.bottom)}
          stroke="#4a9eff"
        />
      ) : null}
      {annotation.tool1_visibility.lines !== -1 &&
      tool1Middle.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-middle"
          points={pointString(tool1Middle)}
          stroke="#4a9eff"
        />
      ) : null}
      {annotation.tool2_visibility.lines !== -1 &&
      annotation.tool2_lines.top.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-top"
          points={pointString(annotation.tool2_lines.top)}
          stroke="#4ae066"
        />
      ) : null}
      {annotation.tool2_visibility.lines !== -1 &&
      annotation.tool2_lines.bottom.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-bottom"
          points={pointString(annotation.tool2_lines.bottom)}
          stroke="#4ae066"
        />
      ) : null}
      {annotation.tool2_visibility.lines !== -1 &&
      tool2Middle.length === 2 ? (
        <polyline
          className="surgical-overlay-line is-middle"
          points={pointString(tool2Middle)}
          stroke="#4ae066"
        />
      ) : null}
      {renderConnections(1, "#4a9eff")}
      {renderConnections(2, "#4ae066")}
      {renderKeypoints(1, "#4a9eff")}
      {renderKeypoints(2, "#4ae066")}
      {previewMask?.points.length ? (
        <g>
          <polyline
            className="surgical-overlay-mask-preview"
            fill="none"
            points={pointString(previewMask.points)}
            stroke={previewMask.toolNumber === 1 ? "#4a9eff" : "#4ae066"}
          />
          {previewMask.points.map(([x, y], index) => (
            <circle
              className="surgical-overlay-mask-vertex"
              cx={x}
              cy={y}
              fill="#ffffff"
              key={`${x}-${y}-${index}`}
              r={10}
              stroke={previewMask.toolNumber === 1 ? "#4a9eff" : "#4ae066"}
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

function SurgicalAnnotatorDemo() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [originals, setOriginals] = useState<SurgicalAnnotation[]>([]);
  const [drafts, setDrafts] = useState<SurgicalAnnotation[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loadRevision, setLoadRevision] = useState(0);
  const [activeToolId, setActiveToolId] =
    useState<SurgicalToolId>("tool1_mask");
  const [manualMaskMode, setManualMaskMode] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [maskDrawing, setMaskDrawing] = useState(false);
  const [maskDraft, setMaskDraft] = useState<Point[]>([]);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(false);
  const [coordinateX, setCoordinateX] = useState(640);
  const [coordinateY, setCoordinateY] = useState(360);
  const [copied, setCopied] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [status, setStatus] = useState(
    "Original manual annotation loaded. Select a component to inspect or edit.",
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoadError("");
    Promise.all(
      SURGICAL_SAMPLES.map(async (item) => {
        const response = await fetch(item.annotationPath, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(
            `Could not load ${item.annotationPath} (${response.status}).`,
          );
        }
        return (await response.json()) as SurgicalAnnotation;
      }),
    )
      .then((records) => {
        setOriginals(records);
        setDrafts(cloneValue(records));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "The native annotation records could not be loaded.",
        );
      });
    return () => controller.abort();
  }, [loadRevision]);

  const annotation = drafts[sampleIndex];
  const original = originals[sampleIndex];
  const sample = SURGICAL_SAMPLES[sampleIndex];
  const hasEdits = useMemo(
    () =>
      Boolean(
        annotation &&
          original &&
          JSON.stringify(annotation) !== JSON.stringify(original),
      ),
    [annotation, original],
  );

  if (!annotation || !original) {
    return (
      <div className="surgical-load-state" role="status">
        <strong>
          {loadError
            ? "The native annotation could not be opened."
            : "Loading the three native annotations…"}
        </strong>
        {loadError ? <p>{loadError}</p> : null}
        {loadError ? (
          <button
            onClick={() => setLoadRevision((value) => value + 1)}
            type="button"
          >
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  const activeTool = surgicalToolDefinition(activeToolId);
  const completed = completedSurgicalComponents(annotation);
  const json = JSON.stringify(annotation, null, 2);
  const visibility =
    annotation[`tool${activeTool.toolNumber}_visibility`][
      activeTool.visibilityKey
    ];

  function updateCurrent(
    update: (draft: SurgicalAnnotation) => void,
    nextStatus: string,
  ) {
    setDrafts((current) =>
      current.map((item, index) => {
        if (index !== sampleIndex) return item;
        const draft = cloneValue(item);
        update(draft);
        return draft;
      }),
    );
    setStatus(nextStatus);
  }

  function selectTool(id: SurgicalToolId) {
    setActiveToolId(id);
    setMaskDrawing(false);
    setMaskDraft([]);
    setStatus(
      `${surgicalToolDefinition(id).label} selected. ${
        id.endsWith("mask")
          ? "Choose Redraw mask before placing a new polygon."
          : "Click the image to place or replace its geometry."
      }`,
    );
  }

  function advanceTool() {
    const currentIndex = SURGICAL_TOOLS.findIndex(
      (tool) => tool.id === activeToolId,
    );
    for (
      let candidateIndex = currentIndex + 1;
      candidateIndex < SURGICAL_TOOLS.length;
      candidateIndex += 1
    ) {
      const candidate = SURGICAL_TOOLS[candidateIndex];
      const candidateVisibility =
        annotation[`tool${candidate.toolNumber}_visibility`][
          candidate.visibilityKey
        ];
      if (
        candidateVisibility !== -1 &&
        (manualMaskMode || candidate.visibilityKey !== "mask")
      ) {
        setActiveToolId(candidate.id);
        setMaskDrawing(false);
        setMaskDraft([]);
        setStatus(`Next: ${candidate.label}.`);
        return;
      }
    }
    setMaskDrawing(false);
    setMaskDraft([]);
    setStatus("This is the last available component in the three-frame demo.");
  }

  function setVisibility(value: Visibility, moveNext = false) {
    updateCurrent(
      (draft) => {
        draft[`tool${activeTool.toolNumber}_visibility`][
          activeTool.visibilityKey
        ] = value;
      },
      `${activeTool.label} marked ${
        value === 1 ? "visible" : value === 0 ? "occluded" : "out"
      }.`,
    );
    setMaskDrawing(false);
    setMaskDraft([]);
    if (moveNext) window.setTimeout(advanceTool, 0);
  }

  function resetOriginal() {
    setDrafts((current) =>
      current.map((item, index) =>
        index === sampleIndex ? cloneValue(original) : item,
      ),
    );
    setMaskDrawing(false);
    setMaskDraft([]);
    setStatus(
      `Frame ${sample.frameIndex} reset to Omar's original native annotation.`,
    );
  }

  function copyPrior() {
    if (sampleIndex === 0) {
      setStatus("There is no earlier example in this three-frame set.");
      return;
    }
    updateCurrent(
      (draft) => {
        const prior = drafts[sampleIndex - 1];
        for (const toolNumber of [1, 2] as const) {
          const prefix = `tool${toolNumber}` as const;
          draft[`${prefix}_mask`] = cloneValue(prior[`${prefix}_mask`]);
          draft[`${prefix}_lines`] = cloneValue(prior[`${prefix}_lines`]);
          draft[`${prefix}_joint`] = cloneValue(prior[`${prefix}_joint`]);
          draft[`${prefix}_ee_tip`] = cloneValue(prior[`${prefix}_ee_tip`]);
          draft[`${prefix}_ee_left`] = cloneValue(
            prior[`${prefix}_ee_left`],
          );
          draft[`${prefix}_ee_right`] = cloneValue(
            prior[`${prefix}_ee_right`],
          );
          draft[`${prefix}_visibility`] = cloneValue(
            prior[`${prefix}_visibility`],
          );
        }
      },
      `Tool geometry copied from example ${sampleIndex}. The frame index and phase stayed with this example.`,
    );
    setMaskDrawing(false);
    setMaskDraft([]);
  }

  function clearSelected() {
    updateCurrent(
      (draft) => clearGeometry(draft, activeTool),
      `${activeTool.label} geometry cleared.`,
    );
    setMaskDrawing(false);
    setMaskDraft([]);
  }

  function placePoint(point: Point) {
    if (visibility === -1) {
      setStatus(
        `${activeTool.label} is out. Change its visibility before placing geometry.`,
      );
      return;
    }

    if (activeTool.visibilityKey === "mask") {
      if (!manualMaskMode) {
        setStatus(
          "This static showcase has no SAM backend. Turn on Manual masks to draw.",
        );
        return;
      }
      if (!maskDrawing) {
        setStatus("Choose Redraw mask before placing polygon vertices.");
        return;
      }
      setMaskDraft((current) => [...current, point]);
      setStatus(
        `Mask vertex ${maskDraft.length + 1} added at ${point[0].toFixed(
          0,
        )}, ${point[1].toFixed(0)}. Finish after at least three points.`,
      );
      return;
    }

    const existingLinePointCount =
      activeTool.visibilityKey === "lines"
        ? annotation[`tool${activeTool.toolNumber}_lines`][
            activeTool.id.endsWith("top") ? "top" : "bottom"
          ].length
        : 0;

    updateCurrent(
      (draft) => setGeometryPoint(draft, activeTool, point),
      `${activeTool.label} updated at ${point[0].toFixed(
        0,
      )}, ${point[1].toFixed(0)} pixels.`,
    );

    const willFinishLine =
      activeTool.visibilityKey === "lines" && existingLinePointCount === 1;
    if (autoAdvance && activeTool.visibilityKey !== "lines") {
      window.setTimeout(advanceTool, 0);
    } else if (
      autoAdvance &&
      activeTool.visibilityKey === "lines" &&
      willFinishLine
    ) {
      window.setTimeout(advanceTool, 0);
    }
  }

  function handleCanvasClick(event: ReactMouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    placePoint([
      Math.max(
        0,
        Math.min(1280, ((event.clientX - bounds.left) / bounds.width) * 1280),
      ),
      Math.max(
        0,
        Math.min(720, ((event.clientY - bounds.top) / bounds.height) * 720),
      ),
    ]);
  }

  function setPhase(phase: string) {
    updateCurrent(
      (draft) => {
        draft.phase.coarse = phase;
        draft.phase[`tool${activeTool.toolNumber}`] = phase;
      },
      `Coarse phase and Tool ${activeTool.toolNumber} phase changed to ${phase}.`,
    );
  }

  function setSample(index: number) {
    setSampleIndex(index);
    setMaskDrawing(false);
    setMaskDraft([]);
    setStatus(
      `Example ${index + 1} loaded with its original or retained local draft.`,
    );
  }

  function handleShortcut(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && shortcutsEnabled) {
      event.preventDefault();
      setShortcutsEnabled(false);
      event.currentTarget.blur();
      setStatus("One-key shortcuts released. Normal Tab navigation restored.");
      return;
    }
    if (!shortcutsEnabled) return;
    if (isTypingTarget(event.target)) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (
      event.shiftKey &&
      (event.code === "Digit1" || event.code === "Digit2")
    ) {
      event.preventDefault();
      const toolNumber = event.code === "Digit1" ? 1 : 2;
      updateCurrent(
        (draft) => markWholeToolOut(draft, toolNumber),
        `Tool ${toolNumber} marked out.`,
      );
      return;
    }
    if (event.shiftKey && key === "a") {
      event.preventDefault();
      updateCurrent(
        (draft) => {
          markWholeToolOut(draft, 1);
          markWholeToolOut(draft, 2);
        },
        "Both tools marked out. This is a valid negative frame.",
      );
      return;
    }
    const shortcutTool = SURGICAL_TOOLS.find(
      (tool) => tool.shortcut.toLowerCase() === key,
    );
    if (shortcutTool) {
      event.preventDefault();
      selectTool(shortcutTool.id);
      return;
    }
    const phase = SURGICAL_PHASES.find(
      (item) => item.shortcut.toLowerCase() === key,
    );
    if (phase) {
      event.preventDefault();
      setPhase(phase.id);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSample(
        (sampleIndex - 1 + SURGICAL_SAMPLES.length) %
          SURGICAL_SAMPLES.length,
      );
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setSample((sampleIndex + 1) % SURGICAL_SAMPLES.length);
    } else if (key === "p") {
      event.preventDefault();
      copyPrior();
    } else if (key === "n") {
      event.preventDefault();
      setVisibility(0, true);
    } else if (event.key === "Tab") {
      event.preventDefault();
      setVisibility(0, false);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      clearSelected();
    } else if (key === "s") {
      event.preventDefault();
      updateCurrent(
        (draft) => {
          draft.skipped = !draft.skipped;
        },
        annotation.skipped ? "Frame unskipped." : "Frame skipped.",
      );
    }
  }

  function componentState(toolNumber: 1 | 2, key: VisibilityKey) {
    const prefix = `tool${toolNumber}` as const;
    const value = annotation[`${prefix}_visibility`][key];
    if (value === -1) return { label: "Out", className: "is-out" };
    if (value === 0) return { label: "Occluded", className: "is-occluded" };
    if (key === "mask") {
      return annotation[`${prefix}_mask`].length >= 3
        ? { label: "Done", className: "is-done" }
        : { label: "Missing", className: "is-missing" };
    }
    if (key === "lines") {
      const lines = annotation[`${prefix}_lines`];
      return lines.top.length === 2 && lines.bottom.length === 2
        ? { label: "Done", className: "is-done" }
        : { label: "Missing", className: "is-missing" };
    }
    return annotation[`${prefix}_${key}`].length === 2
      ? { label: "Done", className: "is-done" }
      : { label: "Missing", className: "is-missing" };
  }

  return (
    <div
      className="surgical-annotator-app"
      onKeyDown={handleShortcut}
      tabIndex={0}
    >
      <div className="annotator-demo-focus-note">
        <span>
          The original one-key rhythm is optional here so normal Tab navigation
          remains available.
        </span>
        <button
          aria-pressed={shortcutsEnabled}
          onClick={(event) => {
            const next = !shortcutsEnabled;
            setShortcutsEnabled(next);
            setStatus(
              next
                ? "One-key shortcuts enabled. Press Escape to release them."
                : "One-key shortcuts disabled. Normal Tab navigation restored.",
            );
            if (next) {
              (
                event.currentTarget.closest(
                  ".surgical-annotator-app",
                ) as HTMLElement | null
              )?.focus();
            }
          }}
          type="button"
        >
          {shortcutsEnabled ? "Shortcuts on · Esc to exit" : "Enable shortcuts"}
        </button>
      </div>
      <div className="surgical-annotator-layout">
        <aside className="surgical-annotator-sidebar is-left">
          <header>
            <span className="surgical-annotator-logo">SA</span>
            <div>
              <strong>Annotation Tool</strong>
              <small>Three-frame LASK showcase</small>
            </div>
          </header>

          <section>
            <h3>Dataset &amp; Trial</h3>
            <label>
              <span>Dataset</span>
              <select aria-label="Dataset" disabled value="LASK v1.0">
                <option>LASK v1.0</option>
              </select>
            </label>
            <label>
              <span>Trial</span>
              <select aria-label="Trial" disabled value="Trial46">
                <option>Trial46</option>
              </select>
            </label>
          </section>

          <section>
            <h3>Progress</h3>
            <div className="surgical-progress-bar">
              <span style={{ width: `${(completed / 12) * 100}%` }} />
            </div>
            <p>
              <strong>{completed} / 12</strong> components resolved
            </p>
            <small>
              {hasEdits ? "Local draft changed" : "Original annotation"}
            </small>
          </section>

          <section>
            <h3>Navigation</h3>
            <p>
              Frame <strong>{sample.frameIndex}</strong> ({sampleIndex + 1} / 3)
            </p>
            <div className="surgical-navigation-row">
              <button
                aria-label="Previous surgical example"
                onClick={() =>
                  setSample(
                    (sampleIndex - 1 + SURGICAL_SAMPLES.length) %
                      SURGICAL_SAMPLES.length,
                  )
                }
                type="button"
              >
                <ArrowLeft size={15} />
                Previous
              </button>
              <button
                aria-label="Next surgical example"
                onClick={() =>
                  setSample((sampleIndex + 1) % SURGICAL_SAMPLES.length)
                }
                type="button"
              >
                Next
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="surgical-sample-list">
              {SURGICAL_SAMPLES.map((item, index) => (
                <button
                  aria-current={sampleIndex === index ? "true" : undefined}
                  key={item.id}
                  onClick={() => setSample(index)}
                  type="button"
                >
                  <img alt="" height={54} src={item.imagePath} width={96} />
                  <span>
                    <strong>Example {index + 1}</strong>
                    <small>
                      Frame {item.frameIndex} · {item.label}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>Status checklist</h3>
            <div className="surgical-status-list">
              {[1, 2].map((toolNumber) =>
                STATUS_COMPONENTS.map((item) => {
                  const state = componentState(
                    toolNumber as 1 | 2,
                    item.key,
                  );
                  return (
                    <button
                      className={state.className}
                      key={`${toolNumber}-${item.key}`}
                      onClick={() => {
                        let tool = SURGICAL_TOOLS.find(
                          (candidate) =>
                            candidate.toolNumber === toolNumber &&
                            candidate.visibilityKey === item.key,
                        );
                        if (item.key === "lines") {
                          const lines =
                            annotation[
                              `tool${toolNumber as 1 | 2}_lines`
                            ];
                          const lineId =
                            lines.top.length === 2
                              ? `tool${toolNumber}_bottom`
                              : `tool${toolNumber}_top`;
                          tool = SURGICAL_TOOLS.find(
                            (candidate) => candidate.id === lineId,
                          );
                        }
                        if (tool) selectTool(tool.id);
                      }}
                      type="button"
                    >
                      <span>
                        T{toolNumber} {item.label}
                      </span>
                      <small>{state.label}</small>
                    </button>
                  );
                }),
              )}
            </div>
          </section>
        </aside>

        <main className="surgical-annotator-main">
          <div className="surgical-annotator-canvas-toolbar">
            <div>
              <span
                className={`surgical-tool-dot is-tool-${activeTool.toolNumber}`}
              />
              <strong>{activeTool.label}</strong>
            </div>
            <div>
              <button
                aria-pressed={manualMaskMode}
                onClick={() =>
                  setManualMaskMode((value) => {
                    const next = !value;
                    if (!next) {
                      setMaskDrawing(false);
                      setMaskDraft([]);
                    }
                    setStatus(
                      next
                        ? "Manual mask drawing enabled."
                        : "Manual mask drawing disabled. Any unfinished redraw was cancelled.",
                    );
                    return next;
                  })
                }
                type="button"
              >
                Manual masks {manualMaskMode ? "on" : "off"}
              </button>
              <button
                aria-pressed={autoAdvance}
                onClick={() => setAutoAdvance((value) => !value)}
                type="button"
              >
                Auto-advance {autoAdvance ? "on" : "off"}
              </button>
            </div>
          </div>

          <div
            aria-label={`${sample.label} surgical frame with editable masks, shaft lines, and keypoints`}
            aria-describedby="surgical-canvas-instruction"
            className="surgical-annotator-canvas"
            onClick={handleCanvasClick}
            role="group"
          >
            <img
              alt={`LASK Trial46 frame ${sample.frameIndex}, a non-in-vivo peg-transfer scene`}
              height={720}
              src={sample.imagePath}
              width={1280}
            />
            <SurgicalOverlay
              annotation={annotation}
              previewMask={
                maskDrawing
                  ? {
                      points: maskDraft,
                      toolNumber: activeTool.toolNumber,
                    }
                  : undefined
              }
            />
          </div>

          <div
            className="surgical-canvas-instruction"
            id="surgical-canvas-instruction"
          >
            <strong>{activeTool.label}</strong>
            <span>
              {visibility === -1
                ? "Marked out. Change visibility before drawing."
                : activeTool.visibilityKey === "mask"
                  ? maskDrawing
                    ? "Click polygon vertices, then finish the mask."
                    : "Choose Redraw mask to replace the stored polygon."
                  : activeTool.visibilityKey === "lines"
                    ? "Two clicks place the shaft edge in image pixels."
                    : "Click once to place or replace this named keypoint."}
            </span>
          </div>

          <div className="surgical-frame-caption">
            <div>
              <span>Original context</span>
              <strong>
                Trial46 · frame {sample.frameIndex} · {sample.label}
              </strong>
              <small>{sample.summary}</small>
            </div>
            <div>
              <span>Draft state</span>
              <strong>{hasEdits ? "Your local edits" : "Original annotation"}</strong>
              <small>Nothing is uploaded or written back</small>
            </div>
          </div>
        </main>

        <aside className="surgical-annotator-sidebar is-right">
          {[1, 2].map((toolNumber) => (
            <section
              className={`surgical-tool-panel is-tool-${toolNumber}`}
              key={toolNumber}
            >
              <h3>Tool {toolNumber}</h3>
              <div className="surgical-tool-grid">
                {SURGICAL_TOOLS.filter(
                  (tool) => tool.toolNumber === toolNumber,
                ).map((tool) => (
                  <button
                    aria-pressed={activeToolId === tool.id}
                    className={activeToolId === tool.id ? "is-active" : ""}
                    key={tool.id}
                    onClick={() => selectTool(tool.id)}
                    type="button"
                  >
                    <span>{tool.shortLabel}</span>
                    <kbd>{tool.shortcut}</kbd>
                  </button>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3>Selected component</h3>
            <label>
              <span>Visibility</span>
              <select
                onChange={(event) =>
                  setVisibility(Number(event.target.value) as Visibility)
                }
                value={visibility}
              >
                <option value={1}>Visible (1)</option>
                <option value={0}>Occluded (0)</option>
                <option value={-1}>Out (-1)</option>
              </select>
            </label>
            <div className="surgical-coordinate-grid">
              <label>
                <span>X px</span>
                <input
                  max={1280}
                  min={0}
                  onChange={(event) =>
                    setCoordinateX(
                      Math.max(0, Math.min(1280, Number(event.target.value))),
                    )
                  }
                  type="number"
                  value={coordinateX}
                />
              </label>
              <label>
                <span>Y px</span>
                <input
                  max={720}
                  min={0}
                  onChange={(event) =>
                    setCoordinateY(
                      Math.max(0, Math.min(720, Number(event.target.value))),
                    )
                  }
                  type="number"
                  value={coordinateY}
                />
              </label>
              <button
                onClick={() => placePoint([coordinateX, coordinateY])}
                type="button"
              >
                {activeTool.visibilityKey === "mask"
                  ? "Add mask vertex"
                  : activeTool.visibilityKey === "lines"
                    ? "Place line point"
                    : "Place keypoint"}
              </button>
            </div>
            <div className="surgical-action-grid">
              {activeTool.visibilityKey === "mask" ? (
                <>
                  <button
                    onClick={() => {
                      setMaskDrawing(true);
                      setMaskDraft([]);
                      setStatus(
                        `${activeTool.label} redraw started. The stored polygon stays unchanged until Finish mask.`,
                      );
                    }}
                    type="button"
                  >
                    Redraw mask
                  </button>
                  <button
                    disabled={!maskDrawing || maskDraft.length < 3}
                    onClick={() => {
                      const completedMask = cloneValue(maskDraft);
                      updateCurrent(
                        (draft) => {
                          const key =
                            `tool${activeTool.toolNumber}_mask` as const;
                          draft[key] = completedMask;
                        },
                        `${activeTool.label} polygon finished with ${completedMask.length} vertices.`,
                      );
                      setMaskDrawing(false);
                      setMaskDraft([]);
                      if (autoAdvance) advanceTool();
                    }}
                    type="button"
                  >
                    Finish mask
                  </button>
                  {maskDrawing ? (
                    <button
                      onClick={() => {
                        setMaskDrawing(false);
                        setMaskDraft([]);
                        setStatus(
                          `${activeTool.label} redraw cancelled. The stored polygon was not changed.`,
                        );
                      }}
                      type="button"
                    >
                      Cancel redraw
                    </button>
                  ) : null}
                </>
              ) : null}
              <button onClick={clearSelected} type="button">
                Clear selected
              </button>
              <button
                disabled={sampleIndex === 0}
                onClick={copyPrior}
                type="button"
              >
                Copy previous example <kbd>P</kbd>
              </button>
              <button onClick={resetOriginal} type="button">
                <Refresh size={14} />
                Reset original
              </button>
            </div>
          </section>

          <section>
            <h3>Phase &amp; cycle</h3>
            <div className="surgical-phase-grid">
              {SURGICAL_PHASES.map((phase) => (
                <button
                  aria-pressed={annotation.phase.coarse === phase.id}
                  className={
                    annotation.phase.coarse === phase.id ? "is-active" : ""
                  }
                  key={phase.id}
                  onClick={() => setPhase(phase.id)}
                  style={{ "--phase-color": phase.color } as React.CSSProperties}
                  type="button"
                >
                  <span>{phase.label}</span>
                  <kbd>{phase.shortcut}</kbd>
                </button>
              ))}
            </div>
            <label>
              <span>Cycle index</span>
              <input
                min={0}
                onChange={(event) =>
                  updateCurrent(
                    (draft) => {
                      draft.phase.cycle_index = Math.max(
                        0,
                        Number(event.target.value),
                      );
                    },
                    `Cycle changed to ${Math.max(
                      0,
                      Number(event.target.value),
                    )}.`,
                  )
                }
                type="number"
                value={annotation.phase.cycle_index}
              />
            </label>
          </section>

          <details
            className="surgical-json-panel"
            onToggle={(event) => setJsonOpen(event.currentTarget.open)}
          >
            <summary>
              <span>Live native JSON</span>
              <small>{hasEdits ? "local draft" : "original"}</small>
            </summary>
            {jsonOpen ? (
              <>
                <pre>{json}</pre>
                <div>
                  <button
                    onClick={async () => {
                      await copyText(json);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1600);
                    }}
                    type="button"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                  <button
                    onClick={() =>
                      downloadText(
                        `trial46_frame_${String(sample.frameIndex).padStart(
                          4,
                          "0",
                        )}.json`,
                        json,
                        "application/json;charset=utf-8",
                      )
                    }
                    type="button"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </>
            ) : null}
          </details>
        </aside>
      </div>

      <p className="annotator-live-status is-surgical" aria-live="polite">
        {status}
      </p>

      <details className="annotator-shortcuts is-surgical">
        <summary>One-key control map preserved from surgical-annotator</summary>
        <div className="surgical-shortcut-groups">
          <dl>
            <div>
              <dt>1 2 3</dt>
              <dd>Tool 1 mask, top, bottom</dd>
            </div>
            <div>
              <dt>7 8 Q W</dt>
              <dd>Tool 1 J, T, L, R</dd>
            </div>
            <div>
              <dt>4 5 6</dt>
              <dd>Tool 2 mask, top, bottom</dd>
            </div>
            <div>
              <dt>9 0 O I</dt>
              <dd>Tool 2 J, T, L, R</dd>
            </div>
          </dl>
          <dl>
            <div>
              <dt>N</dt>
              <dd>Occlude and advance</dd>
            </div>
            <div>
              <dt>Tab</dt>
              <dd>Occlude and stay</dd>
            </div>
            <div>
              <dt>Shift+1/2</dt>
              <dd>Mark one tool out</dd>
            </div>
            <div>
              <dt>Shift+A</dt>
              <dd>Mark both tools out</dd>
            </div>
          </dl>
          <dl>
            <div>
              <dt>Z X C D R T G</dt>
              <dd>Idle through dropped phases</dd>
            </div>
            <div>
              <dt>P</dt>
              <dd>Copy previous example geometry</dd>
            </div>
            <div>
              <dt>&larr; / &rarr;</dt>
              <dd>Previous / next frame</dd>
            </div>
            <div>
              <dt>Backspace</dt>
              <dd>Clear selected component</dd>
            </div>
          </dl>
        </div>
      </details>

      <div className="surgical-feature-boundary">
        <div>
          <span>Interactive here</span>
          <strong>
            Manual masks, shaft lines, keypoints, visibility, phases, copy
            previous example, native JSON
          </strong>
        </div>
        <div>
          <span>In the complete local app</span>
          <strong>
            SAM assistance, edit-all dragging, batch triage, video timelines,
            peg and board annotation
          </strong>
        </div>
      </div>
    </div>
  );
}

export function AnnotationShowcase() {
  const [mode, setMode] = useState<ShowcaseMode>("frame");
  const [visitedModes, setVisitedModes] = useState<ShowcaseMode[]>(["frame"]);

  function activateMode(nextMode: ShowcaseMode) {
    setMode(nextMode);
    setVisitedModes((current) =>
      current.includes(nextMode) ? current : [...current, nextMode],
    );
  }

  return (
    <section className="annotation-showcase" id="demo">
      <div className="section-heading section-heading-wide">
        <p>Try the real interaction models</p>
        <h2>Two tools, two different annotation jobs</h2>
        <span>
          This is a browser-sized adaptation of Omar&apos;s actual open-source
          tools. Start with fast timeline classification, then move into the
          native surgical geometry workflow on three manually annotated LASK
          frames.
        </span>
      </div>

      <ol className="annotation-showcase-steps">
        <li>
          <span>1</span>
          Choose the tool that matches the annotation unit
        </li>
        <li>
          <span>2</span>
          Load one of no more than three disclosed samples
        </li>
        <li>
          <span>3</span>
          Change the native annotation with pointer or shortcuts
        </li>
        <li>
          <span>4</span>
          Inspect, export, or reset the local draft
        </li>
      </ol>

      <div className="annotation-showcase-source-strip">
        <div>
          <span>Source code</span>
          <strong>omariosc/frame-annotator</strong>
          <small>Commit 3e94ed03 · MIT</small>
        </div>
        <div>
          <span>Surgical examples</span>
          <strong>LASK v1.0 · Trial46</strong>
          <small>Manual labels · CC BY 4.0</small>
        </div>
        <div>
          <span>Browser boundary</span>
          <strong>Local draft only</strong>
          <small>No upload, account, model call, or write-back</small>
        </div>
      </div>

      <div
        aria-label="Choose annotation tool"
        className="annotation-showcase-tabs"
        role="tablist"
      >
        <button
          aria-controls="frame-annotator-panel"
          aria-selected={mode === "frame"}
          id="frame-annotator-tab"
          onClick={() => activateMode("frame")}
          onKeyDown={(event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
              return;
            }
            event.preventDefault();
            activateMode("surgical");
            document.getElementById("surgical-annotator-tab")?.focus();
          }}
          role="tab"
          tabIndex={mode === "frame" ? 0 : -1}
          type="button"
        >
          <span>01</span>
          <div>
            <strong>frame-annotator</strong>
            <small>Classify frame ranges on a timeline</small>
          </div>
        </button>
        <button
          aria-controls="surgical-annotator-panel"
          aria-selected={mode === "surgical"}
          id="surgical-annotator-tab"
          onClick={() => activateMode("surgical")}
          onKeyDown={(event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
              return;
            }
            event.preventDefault();
            activateMode("frame");
            document.getElementById("frame-annotator-tab")?.focus();
          }}
          role="tab"
          tabIndex={mode === "surgical" ? 0 : -1}
          type="button"
        >
          <span>02</span>
          <div>
            <strong>surgical-annotator</strong>
            <small>Draw masks, lines, keypoints, and phases</small>
          </div>
        </button>
      </div>

      {visitedModes.includes("frame") ? (
        <div
          aria-labelledby="frame-annotator-tab"
          hidden={mode !== "frame"}
          id="frame-annotator-panel"
          role="tabpanel"
        >
          <div className="annotation-showcase-panel-intro">
            <div>
              <p>Clip classification</p>
              <h3>Mark a range once, then export every frame</h3>
            </div>
            <p>
              These are exactly the first three permitted repository samples in
              canonical order. The starter clip is disclosed as a lesson record
              because no historical annotation file exists beside them.
            </p>
          </div>
          <FrameAnnotatorDemo active={mode === "frame"} />
        </div>
      ) : null}

      {visitedModes.includes("surgical") ? (
        <div
          aria-labelledby="surgical-annotator-tab"
          hidden={mode !== "surgical"}
          id="surgical-annotator-panel"
          role="tabpanel"
        >
          <div className="annotation-showcase-panel-intro">
            <div>
              <p>Multi-task geometry</p>
              <h3>
                Work from the annotations that produced a released dataset
              </h3>
            </div>
            <p>
              Each sample opens with Omar&apos;s original native JSON. Masks and
              keypoints match the public LASK Trial46 record; the native files
              also retain shaft lines, visibility, phase, and cycle state.
            </p>
          </div>
          <SurgicalAnnotatorDemo />
        </div>
      ) : null}

      <footer className="annotation-showcase-footer">
        <a
          href="https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031"
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
        <a href="/citations/annotation-showcase-media-2026-07-27.md">
          Read the sample provenance
        </a>
      </footer>
    </section>
  );
}
