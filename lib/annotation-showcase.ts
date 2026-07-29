export type FrameClip = {
  start: number;
  end: number;
  class: string;
};

export type FrameSample = {
  id: string;
  filename: string;
  imagePath: string;
};

export const FRAME_SAMPLES: readonly FrameSample[] = [
  {
    id: "frame-0000",
    filename: "frame_0000.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0000.png",
  },
  {
    id: "frame-0001",
    filename: "frame_0001.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0001.png",
  },
  {
    id: "frame-0002",
    filename: "frame_0002.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0002.png",
  },
  {
    id: "frame-0003",
    filename: "frame_0003.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0003.png",
  },
  {
    id: "frame-0004",
    filename: "frame_0004.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0004.png",
  },
  {
    id: "frame-0005",
    filename: "frame_0005.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0005.png",
  },
  {
    id: "frame-0006",
    filename: "frame_0006.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0006.png",
  },
  {
    id: "frame-0007",
    filename: "frame_0007.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0007.png",
  },
  {
    id: "frame-0008",
    filename: "frame_0008.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0008.png",
  },
  {
    id: "frame-0009",
    filename: "frame_0009.png",
    imagePath:
      "/worked-examples/annotation-showcase/frame-annotator/frame_0009.png",
  },
] as const;

export const FRAME_CLASSES = [
  {
    id: "0",
    name: "Safe",
    color: "#28a745",
    shortcut: "0",
    description: "No safety concerns",
  },
  {
    id: "1a",
    name: "Improper Posture",
    color: "#dc3545",
    shortcut: "a",
    description: "Unsafe: improper posture",
  },
  {
    id: "1b",
    name: "Hyperextension",
    color: "#dc3545",
    shortcut: "b",
    description: "Unsafe: hyperextension",
  },
  {
    id: "1c",
    name: "Controller Collision",
    color: "#dc3545",
    shortcut: "c",
    description: "Unsafe: controller collision",
  },
] as const;

export const FRAME_STARTER_CLIPS: readonly FrameClip[] = [
  { start: 0, end: 8, class: "1c" },
] as const;

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function frameClipsToCsv(
  clips: FrameClip[],
  samples: readonly FrameSample[] = FRAME_SAMPLES,
) {
  const rows = ["frame,filename,clip_id,class"];
  clips.forEach((clip, clipIndex) => {
    for (let frame = clip.start; frame <= clip.end; frame += 1) {
      rows.push(
        [
          frame,
          samples[frame]?.filename ?? "",
          clipIndex,
          clip.class,
        ].join(","),
      );
    }
  });
  return rows.join("\n");
}

export function labelledFrameCount(clips: FrameClip[]) {
  const frames = new Set<number>();
  clips.forEach((clip) => {
    for (let frame = clip.start; frame <= clip.end; frame += 1) {
      frames.add(frame);
    }
  });
  return frames.size;
}

export type Point = [number, number];
export type Visibility = -1 | 0 | 1;
export type VisibilityKey =
  | "mask"
  | "lines"
  | "joint"
  | "ee_tip"
  | "ee_left"
  | "ee_right";

export type VisibilityMap = Record<VisibilityKey, Visibility>;

export type SurgicalAnnotation = {
  frame_idx: number;
  tool1_mask: Point[];
  tool2_mask: Point[];
  tool1_lines: { top: Point[]; bottom: Point[]; middle?: Point[] };
  tool2_lines: { top: Point[]; bottom: Point[]; middle?: Point[] };
  tool1_joint: Point | [];
  tool1_ee_tip: Point | [];
  tool1_ee_left: Point | [];
  tool1_ee_right: Point | [];
  tool2_joint: Point | [];
  tool2_ee_tip: Point | [];
  tool2_ee_left: Point | [];
  tool2_ee_right: Point | [];
  tool1_visibility: VisibilityMap;
  tool2_visibility: VisibilityMap;
  skipped: boolean;
  broken: boolean;
  exclude: boolean;
  last_modified?: string;
  pegs?: unknown[];
  pegboard?: Record<string, unknown>;
  phase: {
    tool1: string;
    tool2: string;
    coarse: string;
    fine: string;
    cycle_index: number;
    active_tool: number;
    events: string[];
  };
};

export type SurgicalSample = {
  id: string;
  frameIndex: number;
  imagePath: string;
  annotationPath: string;
  label: string;
  summary: string;
};

export const SURGICAL_SAMPLES: readonly SurgicalSample[] = [
  {
    id: "trial46-frame-0200",
    frameIndex: 200,
    imagePath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_0200.jpg",
    annotationPath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_0200.json",
    label: "Grasp",
    summary: "Partial keypoint occlusion on both instruments",
  },
  {
    id: "trial46-frame-1000",
    frameIndex: 1000,
    imagePath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_1000.jpg",
    annotationPath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_1000.json",
    label: "Transfer",
    summary: "Two complete masks and the fullest keypoint example",
  },
  {
    id: "trial46-frame-1800",
    frameIndex: 1800,
    imagePath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_1800.jpg",
    annotationPath:
      "/worked-examples/annotation-showcase/surgical-annotator/trial46_frame_1800.json",
    label: "Try it yourself",
    summary: "The live demo opens this final example without annotations",
  },
] as const;

export type SurgicalToolId =
  | "tool1_mask"
  | "tool1_top"
  | "tool1_bottom"
  | "tool1_joint"
  | "tool1_ee_tip"
  | "tool1_ee_left"
  | "tool1_ee_right"
  | "tool2_mask"
  | "tool2_top"
  | "tool2_bottom"
  | "tool2_joint"
  | "tool2_ee_tip"
  | "tool2_ee_left"
  | "tool2_ee_right";

export type SurgicalToolDefinition = {
  id: SurgicalToolId;
  label: string;
  shortLabel: string;
  shortcut: string;
  toolNumber: 1 | 2;
  visibilityKey: VisibilityKey;
};

export const SURGICAL_TOOLS: readonly SurgicalToolDefinition[] = [
  {
    id: "tool1_mask",
    label: "Tool 1 Mask",
    shortLabel: "Mask",
    shortcut: "1",
    toolNumber: 1,
    visibilityKey: "mask",
  },
  {
    id: "tool1_top",
    label: "Tool 1 Top Line",
    shortLabel: "Top",
    shortcut: "2",
    toolNumber: 1,
    visibilityKey: "lines",
  },
  {
    id: "tool1_bottom",
    label: "Tool 1 Bottom Line",
    shortLabel: "Bottom",
    shortcut: "3",
    toolNumber: 1,
    visibilityKey: "lines",
  },
  {
    id: "tool1_joint",
    label: "Tool 1 Joint",
    shortLabel: "Joint",
    shortcut: "7",
    toolNumber: 1,
    visibilityKey: "joint",
  },
  {
    id: "tool1_ee_tip",
    label: "Tool 1 EE Tip",
    shortLabel: "EE Tip",
    shortcut: "8",
    toolNumber: 1,
    visibilityKey: "ee_tip",
  },
  {
    id: "tool1_ee_left",
    label: "Tool 1 EE Left",
    shortLabel: "EE Left",
    shortcut: "Q",
    toolNumber: 1,
    visibilityKey: "ee_left",
  },
  {
    id: "tool1_ee_right",
    label: "Tool 1 EE Right",
    shortLabel: "EE Right",
    shortcut: "W",
    toolNumber: 1,
    visibilityKey: "ee_right",
  },
  {
    id: "tool2_mask",
    label: "Tool 2 Mask",
    shortLabel: "Mask",
    shortcut: "4",
    toolNumber: 2,
    visibilityKey: "mask",
  },
  {
    id: "tool2_top",
    label: "Tool 2 Top Line",
    shortLabel: "Top",
    shortcut: "5",
    toolNumber: 2,
    visibilityKey: "lines",
  },
  {
    id: "tool2_bottom",
    label: "Tool 2 Bottom Line",
    shortLabel: "Bottom",
    shortcut: "6",
    toolNumber: 2,
    visibilityKey: "lines",
  },
  {
    id: "tool2_joint",
    label: "Tool 2 Joint",
    shortLabel: "Joint",
    shortcut: "9",
    toolNumber: 2,
    visibilityKey: "joint",
  },
  {
    id: "tool2_ee_tip",
    label: "Tool 2 EE Tip",
    shortLabel: "EE Tip",
    shortcut: "0",
    toolNumber: 2,
    visibilityKey: "ee_tip",
  },
  {
    id: "tool2_ee_left",
    label: "Tool 2 EE Left",
    shortLabel: "EE Left",
    shortcut: "O",
    toolNumber: 2,
    visibilityKey: "ee_left",
  },
  {
    id: "tool2_ee_right",
    label: "Tool 2 EE Right",
    shortLabel: "EE Right",
    shortcut: "I",
    toolNumber: 2,
    visibilityKey: "ee_right",
  },
] as const;

export const SURGICAL_PHASES = [
  { id: "idle", label: "Idle", shortcut: "Z", color: "#6b7280" },
  { id: "reach", label: "Reach", shortcut: "X", color: "#3b82f6" },
  { id: "nudge", label: "Nudge", shortcut: "C", color: "#f97316" },
  { id: "grasp", label: "Grasp", shortcut: "D", color: "#f59e0b" },
  { id: "transfer", label: "Transfer", shortcut: "R", color: "#8b5cf6" },
  { id: "place", label: "Place", shortcut: "T", color: "#10b981" },
  { id: "dropped", label: "Dropped", shortcut: "G", color: "#ef4444" },
] as const;

export function surgicalToolDefinition(id: SurgicalToolId) {
  return SURGICAL_TOOLS.find((tool) => tool.id === id) ?? SURGICAL_TOOLS[0];
}

export function geometryPresent(
  annotation: SurgicalAnnotation,
  tool: SurgicalToolDefinition,
) {
  const prefix = `tool${tool.toolNumber}` as "tool1" | "tool2";
  if (tool.visibilityKey === "mask") {
    return annotation[`${prefix}_mask`].length >= 3;
  }
  if (tool.visibilityKey === "lines") {
    const lineType = tool.id.endsWith("top") ? "top" : "bottom";
    return annotation[`${prefix}_lines`][lineType].length === 2;
  }
  return annotation[`${prefix}_${tool.visibilityKey}`].length === 2;
}

export function completedSurgicalComponents(annotation: SurgicalAnnotation) {
  if (annotation.skipped || annotation.broken) return 12;
  let completed = 0;
  for (const toolNumber of [1, 2] as const) {
    const prefix = `tool${toolNumber}` as const;
    for (const key of [
      "mask",
      "lines",
      "joint",
      "ee_tip",
      "ee_left",
      "ee_right",
    ] as const) {
      const visibility = annotation[`${prefix}_visibility`][key];
      if (visibility !== 1) {
        completed += 1;
      } else if (key === "mask") {
        completed += annotation[`${prefix}_mask`].length >= 3 ? 1 : 0;
      } else if (key === "lines") {
        const lines = annotation[`${prefix}_lines`];
        completed +=
          lines.top.length === 2 && lines.bottom.length === 2 ? 1 : 0;
      } else {
        completed += annotation[`${prefix}_${key}`].length === 2 ? 1 : 0;
      }
    }
  }
  return completed;
}

export function pointWithinFrame(point: Point, width = 1280, height = 720) {
  return (
    Number.isFinite(point[0]) &&
    Number.isFinite(point[1]) &&
    point[0] >= 0 &&
    point[0] <= width &&
    point[1] >= 0 &&
    point[1] <= height
  );
}
