export type PaperDemoSlug =
  | "real-time-tool-detection"
  | "lask-7dof"
  | "btpn";

export const INTERACTIVE_PAPER_ORIGIN =
  "https://interactivepaper.omarchoudhry.co.uk";

export type PaperLink = {
  label: string;
  href: string;
  note?: string;
};

export type ClaimState = {
  label: string;
  title: string;
  body: string;
  state: "reported" | "explorable" | "bounded";
};

export type PaperFigure = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
  licence: string;
  licenceHref?: string;
  longDescription: string;
};

export type PaperNativeTable = {
  label: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  sourceNote: string;
};

export type PaperNativeAssets = {
  abstractText?: string;
  sections?: Array<{
    number: string;
    title: string;
    summary: string;
  }>;
  figures?: PaperFigure[];
  tables?: PaperNativeTable[];
};

export type KeyNumber = {
  value: string;
  label: string;
  context: string;
};

export type HtlBenchmarkRow = {
  model: string;
  source: string;
  latencyMs: number;
  fps: number;
  map50: number;
  map5095: number;
  note: string;
};

export type HtlExplorer = {
  kind: "htl";
  rows: HtlBenchmarkRow[];
};

export type LaskSnapshot = {
  id: "manuscript" | "inventory" | "zenodo";
  label: string;
  date: string;
  trials: number;
  frames: string;
  annotations: string;
  access: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

export type LaskExplorer = {
  kind: "lask";
  snapshots: LaskSnapshot[];
};

export type BtpnMetricGroup = {
  id: "visual" | "pose" | "generalisation";
  label: string;
  scope: string;
  metrics: Array<{
    value: string;
    label: string;
    context: string;
  }>;
};

export type BtpnMethodPart = {
  id: "vision" | "temporal" | "uncertainty";
  label: string;
  title: string;
  body: string;
  evidence: string;
};

export type BtpnExplorer = {
  kind: "btpn";
  methods: BtpnMethodPart[];
  metricGroups: BtpnMetricGroup[];
};

export type PaperExplorer = HtlExplorer | LaskExplorer | BtpnExplorer;

export type PaperDemo = {
  slug: PaperDemoSlug;
  shortTitle: string;
  title: string;
  authors: string[];
  venue: string;
  status: string;
  description: string;
  plainLanguage: string;
  links: PaperLink[];
  paperLinkPending?: boolean;
  claimStates: ClaimState[];
  keyNumbers: KeyNumber[];
  figure: PaperFigure;
  nativeAssets?: PaperNativeAssets;
  explorerTitle: string;
  explorerIntro: string;
  explorer: PaperExplorer;
  takeaways: string[];
  limitations: string[];
  citation: string;
  sourceNotes: Array<{
    label: string;
    detail: string;
    href?: string;
  }>;
};

const htlBenchmarkRows: HtlBenchmarkRow[] = [
  {
    model: "YOLOv8-X",
    source: "Table 3, original test",
    latencyMs: 21.7,
    fps: 46,
    map50: 99.5,
    map5095: 96.6,
    note: "The most accurate row in the main in-house test benchmark.",
  },
  {
    model: "YOLOv11-N",
    source: "Table 3, original test",
    latencyMs: 1.7,
    fps: 588,
    map50: 99.5,
    map5095: 94.5,
    note: "The fastest row in the main in-house test benchmark.",
  },
  {
    model: "YOLOv8-X",
    source: "Table 5, Jetson FP16",
    latencyMs: 23.5,
    fps: 42.6,
    map50: 99.5,
    map5095: 96.4,
    note: "TensorRT FP16 result on the Jetson Orin Nano 8GB.",
  },
  {
    model: "YOLOv11-N",
    source: "Table 5, Jetson FP16",
    latencyMs: 3.2,
    fps: 312.5,
    map50: 99.5,
    map5095: 94.2,
    note: "The value printed in the YOLOv11-N row of Table 5.",
  },
  {
    model: "YOLOv8-N",
    source: "Table 5, Jetson FP16",
    latencyMs: 3.1,
    fps: 322.6,
    map50: 99.5,
    map5095: 94.8,
    note:
      "Table 5 assigns the abstract's 3.1 ms and 322.6 FPS values to YOLOv8-N, not YOLOv11-N.",
  },
];

export const paperDemos: Record<PaperDemoSlug, PaperDemo> = {
  "real-time-tool-detection": {
    slug: "real-time-tool-detection",
    shortTitle: "Real-time tool detection",
    title:
      "Real-Time Tool Detection in Laparoscopic Datasets for Surgical Training in Low-Resource Settings",
    authors: [
      "Omar Choudhry",
      "Sharib Ali",
      "Chandra Shekhar Biyani",
      "Dominic Jones",
    ],
    venue: "Healthcare Technology Letters, volume 12, e70045",
    status: "Published 2025, open access",
    description:
      "A compact companion to a systematic benchmark of general-purpose object detectors for laparoscopic tool detection, cross-dataset testing, and deployment on an NVIDIA Jetson Orin Nano 8GB.",
    plainLanguage:
      "The study asks a practical question: can established object detectors identify laparoscopic tools quickly and accurately enough on affordable edge hardware to support surgical training? It benchmarks rather than proposes a new detector.",
    links: [
      {
        label: "Read the published paper",
        href: "https://doi.org/10.1049/htl2.70045",
        note: "Publisher DOI",
      },
      {
        label: "Read the CC BY 4.0 licence",
        href: "https://creativecommons.org/licenses/by/4.0/",
        note: "Figure reuse terms",
      },
    ],
    claimStates: [
      {
        label: "Paper reports",
        title: "High in-house accuracy with real-time edge inference",
        body:
          "The abstract reports YOLOv8-X at 99.5% mAP50 and 96.6% mAP50-95, with 23.5 ms inference on the Jetson. Table 3 and Table 5 use different evaluation and deployment contexts, so this page keeps them separate.",
        state: "reported",
      },
      {
        label: "This page lets you inspect",
        title: "Accuracy and speed without merging unlike rows",
        body:
          "Choose the original test benchmark or Jetson FP16 compilation table, then compare the rows and metric scales. The controls rearrange reported numbers; they do not run a detector.",
        state: "explorable",
      },
      {
        label: "Needs reader caution",
        title: "The abstract and Table 5 disagree on the fastest model",
        body:
          "The abstract attributes 3.1 ms and about 322.6 FPS to YOLOv11-N. Table 5 prints 3.2 ms and 312.5 FPS for YOLOv11-N, while 3.1 ms and 322.6 FPS appear in the YOLOv8-N row. This companion flags the mismatch rather than choosing a value.",
        state: "bounded",
      },
    ],
    keyNumbers: [
      {
        value: "4",
        label: "datasets",
        context: "In-house, WMU Box-Trainer, ART-Net, and EndoVis 2015",
      },
      {
        value: "99.5%",
        label: "best reported mAP50",
        context: "Several models on the in-house test set",
      },
      {
        value: "23.5 ms",
        label: "YOLOv8-X Jetson FP16 latency",
        context: "Table 5, 42.6 FPS",
      },
      {
        value: "100",
        label: "Jetson calibration images",
        context: "A limited validation subset used for compilation",
      },
    ],
    figure: {
      src: "/paper-demos/htl/figure-2-experimental-pipeline.webp",
      width: 2000,
      height: 888,
      alt:
        "A pipeline diagram links detector training on in-vitro and in-vivo datasets to hold-out generalisability tests, TensorRT model optimisation, and Jetson inference and accuracy testing.",
      caption:
        "Figure 2. Pipeline for running experiments. We train all SOTA detectors on the in-house and ART-Net datasets for in vitro and in vivo contexts. We then perform a generalisability test on the hold-out sets without additional training on the WMU Box-Trainer and EndoVis 2015 datasets. We then perform model optimisation using TensorRT, including model compilation, weight pruning and floating-point quantisation. This is compiled on the NVIDIA Jetson Orin Nano Super Developer Kit 8GB (edge-computing device) for inference and accuracy testing as validation for real-world deployment.",
      credit:
        "Choudhry et al., Healthcare Technology Letters 12, e70045 (2025). This is the authors' Figure 2 source image corresponding to the published article; it was resized and stripped of metadata without changing its visual content.",
      licence: "CC BY 4.0",
      licenceHref: "https://creativecommons.org/licenses/by/4.0/",
      longDescription:
        "The diagram starts with a list of convolutional and transformer detector families. Training branches to two box-trainer image datasets above and two in-vivo surgical datasets below. A central arrow continues through hold-out generalisability, pruning and floating-point optimisation, then inference and accuracy testing on a Jetson Orin Nano 8GB. The figure describes the experimental sequence, not a single end-to-end clinical system.",
    },
    nativeAssets: {
      abstractText:
        "In low-resource settings, there is a critical need for skilled surgeons. Alternative training processes that include computer-assisted surgical skill evaluation are essential to address this gap. Using tool detection, surgical videos can be leveraged to derive insights into surgical skill assessment. However, state-of-the-art laparoscopic tool detection methods usually have more complex architectures tailored for in vivo data, which suffer from challenges such as smoke, occlusion, bleeding, etc., which are absent from in vitro training contexts. Thus, this paper tests multiple anchor-based and anchor-free, convolution- and transformer-based, traditional (non-surgical domain-specific) computer vision deep learning state-of-the-art models. With various hardware configurations on a newly curated in-house laparoscopic box-trainer dataset, we emphasise real-time performance on low-cost embedded devices. Overall, the anchor-free YOLOv8-X model was the most accurate, achieving mAP50 of 99.5% and mAP50:95 of 96.6% with an inference time of 23.5 ms/≈42.6 FPS on an NVIDIA Jetson Orin Nano 8GB (comparable low-cost hardware which could be expected to run real-time skill assessment methods for surgical training boot camps in a resource-constrained environment). The most efficient model was YOLOv11-N, providing 3.1 ms/≈322.6 FPS with a performance difference of +0% mAP50 and -2.1% mAP50:95. The results highlight the models' potential for effective real-time detection of surgical tools and are suitable for further downstream assessment of surgical skills, even in resource-constrained environments.",
      sections: [
        {
          number: "1",
          title: "Introduction",
          summary:
            "Motivates laparoscopic tool detection as a building block for computer-assisted surgical training in settings where both specialist time and computing hardware may be constrained.",
        },
        {
          number: "2",
          title: "Related Work",
          summary:
            "Reviews laparoscopic detector architectures, deep learning for surgical training, and the practical problem of deploying models on resource-constrained hardware.",
        },
        {
          number: "3",
          title: "Datasets",
          summary:
            "Defines the in-house and WMU box-trainer datasets for the in-vitro setting, plus ART-Net and EndoVis 2015 for the in-vivo setting. The in-house benchmark contains 3,725 labelled frames.",
        },
        {
          number: "4",
          title: "Methodology",
          summary:
            "Compares anchor-based and anchor-free detectors, tests hold-out generalisability, and compiles selected YOLO models with TensorRT on an NVIDIA Jetson Orin Nano 8GB.",
        },
        {
          number: "5",
          title: "Results and Discussion",
          summary:
            "Reports the held-out in-house benchmark, cross-domain results, Jetson compilation measurements, qualitative detections, limitations, and the authors' deployment recommendations.",
        },
      ],
      figures: [
        {
          src: "/paper-demos/htl/figure-1-dataset-samples.webp",
          width: 2000,
          height: 478,
          alt:
            "Four example frames show the in-house peg-transfer dataset, WMU Box-Trainer peg transfer, ART-Net laparoscopic hysterectomy, and EndoVis 2015 laparoscopic colorectal data.",
          caption:
            "Figure 1. Sample dataset images. For the in vitro training context we use the in-house and WMU Box-Trainer datasets (both of laparoscopic peg transfer). For the in vivo surgical context we use the ART-Net dataset for laparoscopic hysterectomy and the EndoVis 2015 dataset for laparoscopic colorectal. Images are cropped to fit and not to scale.",
          credit:
            "Choudhry et al., Healthcare Technology Letters 12, e70045 (2025), Figure 1. Source image from the authors' article bundle; published on PDF page 4 of 13.",
          licence: "CC BY 4.0",
          licenceHref: "https://creativecommons.org/licenses/by/4.0/",
          longDescription:
            "A horizontal sequence of four labelled examples contrasts two box-trainer scenes with two intraoperative laparoscopic scenes. The in-house and WMU frames show graspers operating around peg-transfer boards. ART-Net and EndoVis frames show tools within the operative field. The comparison makes the domain shift discussed in the paper visually explicit.",
        },
        {
          src: "/paper-demos/htl/figure-2-experimental-pipeline.webp",
          width: 2000,
          height: 888,
          alt:
            "The published experimental pipeline links detector families and in-vitro and in-vivo training data to hold-out generalisability, model optimisation, and Jetson inference and accuracy testing.",
          caption:
            "Figure 2. Pipeline for running experiments. We train all SOTA detectors on the in-house and ART-Net datasets for in vitro and in vivo contexts. We then perform a generalisability test on the hold-out sets without additional training on the WMU Box-Trainer and EndoVis 2015 datasets. We then perform model optimisation using TensorRT, including model compilation, weight pruning and floating-point quantisation. This is compiled on the NVIDIA Jetson Orin Nano Super Developer Kit 8GB (edge-computing device) for inference and accuracy testing as validation for real-world deployment.",
          credit:
            "Choudhry et al., Healthcare Technology Letters 12, e70045 (2025), Figure 2. Source image from the authors' article bundle; published on PDF page 5 of 13.",
          licence: "CC BY 4.0",
          licenceHref: "https://creativecommons.org/licenses/by/4.0/",
          longDescription:
            "A left-to-right workflow begins with a list of tested detector families. It branches to in-house and WMU box-trainer images above and ART-Net and EndoVis surgical images below, then passes through hold-out generalisability, model optimisation, and inference and accuracy testing on a Jetson device. Insets depict weight pruning, floating-point precision choices, and convolutional block fusion.",
        },
        {
          src: "/paper-demos/htl/figure-3-detection-results.webp",
          width: 1920,
          height: 1080,
          alt:
            "Six published example panels compare YOLOv8-X detections with labels for in-house, WMU, and EndoVis images.",
          caption:
            "Figure 3. Sample tool detection results using YOLOv8-X.",
          credit:
            "Choudhry et al., Healthcare Technology Letters 12, e70045 (2025), Figure 3. Source image from the authors' article bundle; published on PDF page 10 of 13.",
          licence: "CC BY 4.0",
          licenceHref: "https://creativecommons.org/licenses/by/4.0/",
          longDescription:
            "The top row shows blue model detections and confidence values for an in-house peg-transfer frame, a WMU box-trainer frame, and an EndoVis laparoscopic frame. The bottom row shows the corresponding green ground-truth labels. The examples include two-tool box-trainer scenes and a single tool in an operative scene.",
        },
      ],
      tables: [
        {
          label: "Table 3",
          caption:
            "A systematic benchmark of the quantitative laparoscopic tool detection results. The mAP scores are from evaluating the trained models on the held-out test set of the in-house dataset. The highlighted most accurate model is in yellow (based on mAP50:95), and the fastest is in pink (based on FPS). Overall, we notice the superior performance of the YOLO models, slightly worse performance of the transformer-based architectures and poorer performance of the EfficientDet and SIMO models. Inference speed correlates positively with model size: larger models have larger and slower inference speeds.",
          src: "/paper-demos/htl/table-3-systematic-benchmark.webp",
          width: 1660,
          height: 2090,
          alt:
            "Published Table 3 lists model size, mAP50, mAP50:95, inference speed, FPS, epochs, training time, and time per epoch for the complete detector benchmark.",
          sourceNote:
            "Direct crop from the published open-access article, PDF page 8 of 13. The image preserves the complete caption, column labels, rows, highlights, and footnotes.",
        },
        {
          label: "Table 4",
          caption:
            "Generalisation results. The models we trained on the in-house dataset were unable to generalise at all on the in vivo datasets. Thus, we trained the same models again on the ART-Net datasets with its training images, and report their performance on its held-out test set (in the first column of each mAP metric). In the second and third columns, we report the out-of-distribution results from those trained models, without additional fine-tuning on the EndoVis 2015 dataset (from the trained checkpoint on the ART-Net dataset, reported in the second column) and the WMU Box-Trainer dataset (from the trained checkpoint on the EndoVis 2015 dataset, reported in the third column). We include the performance difference in brackets. We do not include some of the worse-performing models (based on the mAP50:95 score), nor all YOLO variants (selecting only the ones we compiled in Table 5).",
          src: "/paper-demos/htl/table-4-generalisation.webp",
          width: 1660,
          height: 1610,
          alt:
            "Published Table 4 lists cross-domain mAP50 and mAP50:95 results for ART-Net, EndoVis, and WMU across the selected detector models.",
          sourceNote:
            "Direct crop from the published open-access article, PDF page 9 of 13. The image preserves the complete caption, column labels, values, colour coding, and footnotes.",
        },
        {
          label: "Table 5",
          caption:
            "Compilation results of the YOLO models on the NVIDIA Jetson Orin Nano Super Developer Kit (8GB). All values highlighted bold in the speed/FPS sections refer to real-time performance above 30 FPS, with those bolded and underlined above 60 FPS. The FP64 model refers to the original baseline model without any TensorRT model optimisation techniques, run using maximum power settings with all CPU and GPU cores on the NVIDIA Jetson, for evaluation on the in-house dataset. Accuracy results were obtained using a validation subset. Since model compilation requires extensive time to calibrate using validation images, only a smaller subset of 100 images was used.",
          src: "/paper-demos/htl/table-5-jetson-compilation.webp",
          width: 1660,
          height: 1070,
          alt:
            "Published Table 5 compares Jetson speed, FPS, mAP50, and mAP50:95 across FP64, FP32, and FP16 for selected YOLO variants.",
          sourceNote:
            "Direct crop from the published open-access article, PDF page 10 of 13. Table 5 prints 3.2 ms and 312.5 FPS for YOLOv11-N at FP16, while 3.1 ms and 322.6 FPS are in the YOLOv8-N row.",
        },
      ],
    },
    explorerTitle: "Inspect the speed and accuracy trade-off",
    explorerIntro:
      "The default view shows selected rows from the main test benchmark. Switch to the Jetson FP16 view to inspect the deployed measurements. Bars share a scale only within the chosen metric.",
    explorer: {
      kind: "htl",
      rows: htlBenchmarkRows,
    },
    takeaways: [
      "A familiar model family can be a defensible deployment choice when the research question is benchmarking and feasibility rather than architectural novelty.",
      "A latency claim needs its hardware, precision, evaluation subset, and table context beside it.",
      "Cross-dataset performance drops are part of the result, not a footnote. The paper reports large distribution-shift failures on WMU for several models.",
    ],
    limitations: [
      "The in-house benchmark is a controlled box-trainer task and does not establish clinical performance.",
      "Jetson accuracy used a subset of 100 calibration images, and only YOLO families were compiled.",
      "The public article says the full in-house dataset was still being prepared for release.",
      "This page does not run model inference or independently reproduce the reported numbers.",
    ],
    citation:
      "Choudhry, O., Ali, S., Biyani, C. S., and Jones, D. (2025). Real-Time Tool Detection in Laparoscopic Datasets for Surgical Training in Low-Resource Settings. Healthcare Technology Letters, 12, e70045. https://doi.org/10.1049/htl2.70045",
    sourceNotes: [
      {
        label: "Primary source",
        detail:
          "Published article, including Tables 3 to 5 and Figures 1 to 3.",
        href: "https://doi.org/10.1049/htl2.70045",
      },
      {
        label: "What this page covers",
        detail:
          "Numbers shown here are transcribed from the article. No inference, retraining, or clinical validation was performed for this website.",
      },
      {
        label: "Known source mismatch",
        detail:
          "The abstract and Table 5 assign the 3.1 ms and 322.6 FPS result to different Nano models. Both locations are reported above.",
      },
    ],
  },
  "lask-7dof": {
    slug: "lask-7dof",
    shortTitle: "LASK 7-DoF dataset",
    title: "7-DoF Laparoscopic Peg Transfer Dataset for Surgical Skill Assessment",
    authors: [
      "Omar Choudhry",
      "Sharib Ali",
      "Ramanan Rajasundaram",
      "Chandra Shekhar Biyani",
      "Dominic Jones",
    ],
    venue:
      "Medical Image Understanding and Analysis, MIUA 2025 proceedings, pages 166 to 172",
    status: "Published 2025, staged dataset release available",
    description:
      "A paper companion that keeps three valid but different LASK denominators apart: the 2025 manuscript cohort, the later analysis inventory, and the current public Zenodo release.",
    plainLanguage:
      "LASK connects laparoscopic box-trainer video with measured tool position, orientation, and jaw state. The paper describes the research cohort. The public Zenodo record is a smaller staged release, so the numbers should not be treated as interchangeable.",
    links: [
      {
        label: "Read the published paper",
        href: "https://eprints.whiterose.ac.uk/id/eprint/230457/",
        note: "White Rose Research Online",
      },
      {
        label: "Open the staged LASK release",
        href: "https://doi.org/10.5281/zenodo.20752651",
        note: "Zenodo version 1.0",
      },
      {
        label: "Open the LASK repository",
        href: "https://github.com/omariosc/LASK",
        note: "Code and project record",
      },
    ],
    claimStates: [
      {
        label: "Paper reports",
        title: "114 trials and 324,101 synchronised frames",
        body:
          "The MIUA paper describes 38 low-skill, 41 medium-skill, and 35 high-skill trials, plus 3,725 bounding-box annotated frames. These are manuscript cohort numbers.",
        state: "reported",
      },
      {
        label: "This page lets you inspect",
        title: "Which denominator belongs to which claim",
        body:
          "Select the manuscript, later analysis inventory, or public release. Each panel states what it counts and whether readers can download it.",
        state: "explorable",
      },
      {
        label: "Do not collapse",
        title: "114, 115, and 37 answer different questions",
        body:
          "The later analysis inventory contains 115 canonical peg-transfer trials. The current Zenodo release contains 37 trials. Neither number silently replaces the 114-trial cohort described in the 2025 manuscript.",
        state: "bounded",
      },
    ],
    keyNumbers: [
      {
        value: "114",
        label: "trials in the MIUA paper",
        context: "38 low, 41 medium, and 35 high skill",
      },
      {
        value: "324,101",
        label: "paper-reported frames",
        context: "Time-aligned HD video and kinematics",
      },
      {
        value: "3,725",
        label: "bounding-box frames",
        context: "Including one 2,680-frame dense sequence",
      },
      {
        value: "37",
        label: "trials in Zenodo v1.0",
        context: "A staged, public cross-cohort release",
      },
    ],
    figure: {
      src: "/paper-demos/lask/figure-1-setup.webp",
      width: 2000,
      height: 856,
      alt:
        "The LASK data collection setup combines a laparoscopic box trainer, camera, NDI Aurora electromagnetic tracking, jaw sensors, and a sample frame with tool and tooltip bounding boxes.",
      caption:
        "Fig. 1. Overview of the LASK data collection setup and sample annotated video frame.",
      credit:
        "Choudhry et al., MIUA 2025 proceedings. Extracted from the published proceedings page and resized without changing its content.",
      licence: "Author-created proceedings figure",
      longDescription:
        "A central photograph shows a box trainer, laparoscopic tools, monitor, camera, computer, and NDI Aurora electromagnetic tracking equipment. Insets explain 6D pose, jaw-angle sensors, a frame with green tool boxes and yellow tooltip boxes, and examples of visual artefacts removed during quality control. The paper discloses that ChatGPT 4o helped produce the 6D pose inset.",
    },
    nativeAssets: {
      abstractText:
        "This work introduces LASK (LAparoscopic Skill & Kinematics), a peg-transfer surgical dataset featuring synchronised HD video and 7-DoF (seven-degree-of-freedom) ground-truth kinematics for two surgical graspers. The dataset comprises 114 trials (~3 hours total) from 38 low-, 41 medium- and 35 high-skill expert surgeons, providing 324,101 frames with time-aligned kinematics for both tool and tooltips; 3,725 frames are annotated with bounding boxes, including a complete 2,680-frame validation sequence. LASK distinctively captures two instruments throughout with wider fields of view than typical in-vivo data, includes surgeon-specific metadata (handedness & experience), and reflects typical box-trainer imaging conditions. These features support robust benchmarking of multi-class detection, tracking, pose estimation, skill assessment and classification algorithms. Once publicly released, LASK aims to improve laparoscopic training by fostering data-driven training tools.",
      sections: [
        {
          number: "1",
          title: "Introduction",
          summary:
            "Motivates a public multimodal dataset for objective laparoscopic training research, especially where robotic systems and costly recording infrastructure are not representative.",
        },
        {
          number: "2",
          title: "Related Work and Motivation",
          summary:
            "Contrasts LASK with image-only in-vivo datasets, robot-derived kinematics, simulated training data, and sparsely annotated box-trainer collections.",
        },
        {
          number: "3",
          title: "The LASK Dataset",
          summary:
            "Describes peg transfer collected across two Urology Boot Camps and the BAPES 2024 congress, recorded with a standard box trainer and electromagnetic tracking.",
        },
        {
          number: "3.1",
          title: "Data acquisition and participants",
          summary:
            "Defines the 114-trial manuscript cohort, skill bands, experience metadata, handedness, HD video, and two-tool 7-DoF kinematics.",
        },
        {
          number: "3.2",
          title: "Dataset annotations and quality",
          summary:
            "Details 3,725 COCO-style bounding-box frames, one fully annotated 2,680-frame sequence, sparse frame selection, and documented camera and image-quality issues.",
        },
        {
          number: "4",
          title: "Dataset Utility and Potential Research",
          summary:
            "Outlines uses in multi-tool detection and tracking, monocular pose estimation, surgical skill assessment, and analyses of handedness and experience.",
        },
      ],
      figures: [
        {
          src: "/paper-demos/lask/figure-1-setup.webp",
          width: 2000,
          height: 856,
          alt:
            "The LASK collection setup shows the box trainer, camera, NDI Aurora tracking equipment, jaw sensors, 6D pose concept, bounding-box annotations, and examples of removed visual artefacts.",
          caption:
            "Fig. 1. Overview of the LASK data collection setup and sample annotated video frame.",
          credit:
            "Choudhry et al., MIUA 2025 proceedings, Figure 1. Extracted from the published proceedings paper and resized without changing its visual content.",
          licence: "Author-created figure used with the lead author's permission",
          longDescription:
            "The central photograph documents the physical acquisition setup. Insets connect the electromagnetic tracker to position and orientation, identify the jaw-angle sensor placement, show green tool and yellow tooltip boxes on a peg-transfer frame, and show examples removed during quality control. The manuscript discloses AI assistance for the 6D pose inset.",
        },
        {
          src: "/paper-demos/lask/figure-1-annotation-detail.webp",
          width: 760,
          height: 510,
          alt:
            "A crop from LASK Figure 1 shows two graspers over a peg-transfer board, each with a green tool bounding box and yellow tooltip bounding box.",
          caption:
            "Figure 1 detail. Sample bounding-box annotations for both graspers and tooltips.",
          credit:
            "Detail cropped from Choudhry et al., MIUA 2025 proceedings, Figure 1. No annotation or image content was added.",
          licence: "Author-created figure used with the lead author's permission",
          longDescription:
            "Two black laparoscopic graspers enter a white peg-transfer trainer from opposite sides. Green rectangles identify the visible tool shafts and yellow rectangles localise the tooltip regions. The crop illustrates the two-class box annotation described in the manuscript.",
        },
      ],
    },
    explorerTitle: "Choose the denominator before reading a claim",
    explorerIntro:
      "These snapshots belong to different stages of the project. The selector changes the evidence record, not the underlying dataset.",
    explorer: {
      kind: "lask",
      snapshots: [
        {
          id: "manuscript",
          label: "MIUA manuscript cohort",
          date: "2025 paper",
          trials: 114,
          frames: "324,101",
          annotations: "3,725 bounding-box frames",
          access: "Described in the proceedings paper",
          detail:
            "The manuscript denominator includes 38 low-skill, 41 medium-skill, and 35 high-skill trials. It is the correct denominator for claims made in that paper.",
          href: "https://doi.org/10.3389/978-2-8325-5137-0",
          hrefLabel: "Open the proceedings DOI",
        },
        {
          id: "inventory",
          label: "Later analysis inventory",
          date: "Current research inventory",
          trials: 115,
          frames: "Not asserted on this page",
          annotations: "Analysis-specific derived records",
          access: "Internal denominator, not a public release",
          detail:
            "The 115-trial count is the canonical peg-transfer inventory used by later analysis. It should be cited only for that analysis context and does not revise the 2025 paper retrospectively.",
        },
        {
          id: "zenodo",
          label: "Zenodo v1.0 release",
          date: "2026 staged release",
          trials: 37,
          frames: "Approx. 91,000",
          annotations:
            "Masks, keypoints, visibility flags, and kinematics for released trials",
          access: "Publicly downloadable",
          detail:
            "The release contains 19 training, 10 in-distribution validation, and 8 out-of-distribution test trials. It is explicitly a current subset, with further data planned for the same record.",
          href: "https://doi.org/10.5281/zenodo.20752651",
          hrefLabel: "Open Zenodo version 1.0",
        },
      ],
    },
    takeaways: [
      "Dataset totals are versioned evidence. Put the cohort, release version, and access state beside every number.",
      "Synchronised video and kinematics support questions that image-only or robot-only datasets cannot answer in the same way.",
      "Quality-control exclusions, calibration changes, and annotation density determine what a benchmark can support.",
    ],
    limitations: [
      "The MIUA paper describes a larger cohort than the current public Zenodo release.",
      "The manuscript reports 114 trials, while a later analysis inventory contains 115 canonical peg-transfer trials. This page preserves both scopes.",
      "The paper notes lighting variation, overexposure, frame cuts, camera overheating artefacts, and calibration changes.",
      "The original skill bands use case-volume thresholds and should not be treated as complete measures of expertise.",
    ],
    citation:
      "Choudhry, O., Ali, S., Rajasundaram, R., Biyani, C. S., and Jones, D. (2025). 7-DoF Laparoscopic Peg Transfer Dataset for Surgical Skill Assessment. In Medical Image Understanding and Analysis, MIUA 2025, pp. 166-172. Frontiers Media SA. https://doi.org/10.3389/978-2-8325-5137-0",
    sourceNotes: [
      {
        label: "Manuscript source",
        detail:
          "The published MIUA 2025 proceedings paper supplies the 114-trial, 324,101-frame, and 3,725-box counts.",
        href: "https://eprints.whiterose.ac.uk/id/eprint/230457/",
      },
      {
        label: "Source-version note",
        detail:
          "The published Frontiers extract and the accepted author manuscript use different ordinal numbers for the two Urology Boot Camps. This companion preserves the published abstract and avoids using those ordinals as evidence.",
      },
      {
        label: "Public release source",
        detail:
          "Zenodo version 1.0 supplies the 37-trial staged-release scope and split.",
        href: "https://doi.org/10.5281/zenodo.20752651",
      },
      {
        label: "Current inventory note",
        detail:
          "The 115-trial count comes from the project's later canonical peg-transfer inventory. No private participant records are copied into this site.",
      },
    ],
  },
  btpn: {
    slug: "btpn",
    shortTitle: "Bayesian Temporal Pose Networks",
    title:
      "Bayesian Temporal Pose Networks for Uncertainty-Calibrated Laparoscopic Tool Pose Tracking",
    authors: [
      "Omar Choudhry",
      "Sharib Ali",
      "Chandra Shekhar Biyani",
      "Dominic Jones",
    ],
    venue: "Medical Image Computing and Computer Assisted Intervention, MICCAI 2026",
    status: "Accepted paper, publisher page pending",
    description:
      "A companion to an accepted paper on vision-only probabilistic 7-DoF laparoscopic tool pose tracking with temporal reasoning and calibrated uncertainty.",
    plainLanguage:
      "BTPN uses video to estimate each tool's position, orientation, and jaw state. It combines visual evidence with a learned motion prior and predicts uncertainty alongside pose, so low-confidence estimates can be identified rather than hidden.",
    links: [
      {
        label: "Open the BTPN repository",
        href: "https://github.com/omariosc/BTPN",
        note: "Author code repository",
      },
      {
        label: "Open the LASK dataset release",
        href: "https://doi.org/10.5281/zenodo.20752651",
        note: "Public staged dataset",
      },
    ],
    paperLinkPending: true,
    claimStates: [
      {
        label: "Accepted paper reports",
        title: "7.0 mm position and 11.7 degree rotation RMSE",
        body:
          "On the Dataset A held-out split, the accepted manuscript reports 7.0 mm position RMSE, 11.7 degree geodesic rotation RMSE, 13.6% jaw-opening error, and position ECE of 0.028.",
        state: "reported",
      },
      {
        label: "This page lets you inspect",
        title: "How the method and metric groups fit together",
        body:
          "Explore the vision front end, temporal model, and probabilistic heads, then switch among visual, pose, and cross-dataset results. The page explains reported outputs; it does not execute the model.",
        state: "explorable",
      },
      {
        label: "Publication boundary",
        title: "The final publisher link is not available yet",
        body:
          "The paper has been accepted to MICCAI 2026, but its public proceedings page and final citation are pending. This page does not distribute the private submission PDF, reviews, or response material.",
        state: "bounded",
      },
    ],
    keyNumbers: [
      {
        value: "7.0 mm",
        label: "position RMSE",
        context: "Dataset A held-out split",
      },
      {
        value: "11.7°",
        label: "rotation RMSE",
        context: "Geodesic quaternion error",
      },
      {
        value: "0.028",
        label: "position ECE",
        context: "Reported uncertainty calibration error",
      },
      {
        value: "10 / 50 / 100",
        label: "temporal windows",
        context: "Frames at short, medium, and global scales",
      },
    ],
    figure: {
      src: "/paper-demos/btpn/figure-2-architecture.webp",
      width: 2000,
      height: 1401,
      alt:
        "The BTPN architecture combines segmentation, keypoints, monocular depth, temporal visual features, a kinematic foundation model, multi-scale attention, and separate position, rotation, and jaw probability heads.",
      caption:
        "Figure 2. BTPN architecture overview.",
      credit:
        "Author-created figure from the accepted MICCAI 2026 manuscript. Rendered from the figure-only source and resized for this public companion.",
      licence: "Copyright remains with the authors pending publication",
      longDescription:
        "Panel A starts with a laparoscopic frame. Segmentation, keypoint, and frozen depth features form visual embeddings, which are combined with temporal tokens and a kinematic prior. Attention produces a fused representation for separate position, rotation, and jaw heads. Panel B shows short, medium, and global temporal windows connected through cross-scale attention. Panel C maps position, quaternion orientation, and jaw state through a temporal model, bimanual cross-attention, and a memory bank to form kinematic temporal embeddings.",
    },
    nativeAssets: {
      abstractText:
        "Laparoscopic instrument pose tracking from monocular endoscopic video in surgical training tasks is essential for computer-assisted surgery and objective skill assessment. However, current methods require geometric priors unavailable in non-robotic settings and lack temporal reasoning across multimodal cues and uncertainty quantification. We introduce Bayesian Temporal Pose Network (BTPN), a framework that fuses visual and kinematic features through hierarchical multi-scale temporal attention operating at clinically motivated resolutions, with calibrated Bayesian uncertainty. A fine-tuned segmentation backbone achieves 99.1% mAP50 and keypoint detection reaches 98.3% mAP50. End-to-end visual pose tracking attains 7.0 mm position and 11.7° rotation RMSE with 0.028 uncertainty error. Our code is available at https://github.com/omariosc/BTPN.",
      sections: [
        {
          number: "1",
          title: "Introduction",
          summary:
            "Defines full monocular 7-DoF tracking without CAD or robotic kinematic priors, and motivates temporal reasoning and uncertainty as core requirements.",
        },
        {
          number: "2",
          title: "Methodology",
          summary:
            "Defines the three datasets, probabilistic 7-DoF task, visual front end, temporal architecture, objectives, and staged training procedure.",
        },
        {
          number: "2.1",
          title: "Datasets",
          summary:
            "Uses three LASK box-trainer datasets with 114 trials across training, held-out, in-distribution validation, and out-of-distribution test roles.",
        },
        {
          number: "2.2",
          title: "Problem Formulation",
          summary:
            "Models future tool position, quaternion orientation, and jaw angle as geometry-appropriate probability distributions conditioned on causal video context.",
        },
        {
          number: "2.3",
          title: "Network Architecture",
          summary:
            "Combines two-stage visual perception, monocular depth, a hierarchical temporal transformer, a kinematic foundation model, and bimanual cross-attention.",
        },
        {
          number: "2.4",
          title: "Loss Functions",
          summary:
            "Uses Beta-NLL for position and jaw, a Beta-weighted von Mises-Fisher objective for orientation, and a differentiable calibration loss.",
        },
        {
          number: "2.5",
          title: "Training Strategy",
          summary:
            "Pre-trains the kinematic temporal model, aligns visual and kinematic embeddings, then fine-tunes the complete model with dense sliding windows.",
        },
        {
          number: "3",
          title: "Results",
          summary:
            "Reports visual component quality, pose RMSE and ablations on Dataset A, and cross-dataset results on Datasets B and C.",
        },
        {
          number: "3.1",
          title: "Experimental Setup",
          summary:
            "Defines the implementation, optimisation, augmentation, training schedule, and held-out evaluation protocol used for the reported experiments.",
        },
        {
          number: "3.2",
          title: "Quantitative Results",
          summary:
            "Reports visual front-end scores, full-model pose errors, eleven baselines and ablations, and results across Datasets A, B, and C.",
        },
        {
          number: "3.3",
          title: "Qualitative Results and Uncertainty Analysis",
          summary:
            "Examines trajectory agreement, predicted intervals, calibration, sparsification, and the relationship between detector confidence and pose error.",
        },
        {
          number: "4",
          title: "Discussion",
          summary:
            "Examines uncertainty calibration, error drivers, selective prediction, current generalisation limits, and the implications of vision-only probabilistic tracking.",
        },
      ],
      figures: [
        {
          src: "/paper-demos/btpn/figure-1-datasets.webp",
          width: 2000,
          height: 379,
          alt:
            "Three laparoscopic peg-transfer frames from Datasets A, B, and C show differently configured trainer boards, tools, segmentation masks, shaft lines, and keypoints.",
          caption:
            "Figure 1. Representative annotated frames from each dataset.",
          credit:
            "Author-created Figure 1 from the accepted MICCAI 2026 paper. The three authorised source panels were joined horizontally and stripped of metadata without changing their content.",
          licence: "Copyright remains with the authors pending publication",
          longDescription:
            "Dataset A shows two annotated graspers crossing over a white peg board. Dataset B shows the tools meeting near a blue object in a differently arranged trainer. Dataset C uses another board and camera configuration. Blue and green overlays distinguish the two tools and show segmentation, shaft geometry, and keypoints.",
        },
        {
          src: "/paper-demos/btpn/figure-2-architecture.webp",
          width: 2000,
          height: 1401,
          alt:
            "The BTPN architecture combines segmentation, keypoints, monocular depth, temporal visual features, a kinematic foundation model, multi-scale attention, and separate position, rotation, and jaw probability heads.",
          caption: "Figure 2. BTPN architecture overview.",
          credit:
            "Author-created Figure 2 from the accepted MICCAI 2026 paper. Rendered from the authorised figure-only source and resized for this companion.",
          licence: "Copyright remains with the authors pending publication",
          longDescription:
            "Panel A maps a video frame through tool segmentation, per-tool keypoints, and frozen depth features before fusing visual and kinematic embeddings for three probabilistic pose heads. Panel B depicts short, medium, and global attention windows with cross-scale fusion. Panel C learns bimanual temporal pose embeddings from position, quaternion orientation, and jaw state using a hierarchical transformer and memory bank.",
        },
        {
          src: "/paper-demos/btpn/figure-3-trajectories.webp",
          width: 1282,
          height: 975,
          alt:
            "Seven plots compare ground-truth and predicted X, Y, and Z positions, Euler Z, X, and Y rotations, and jaw angle over about 37 seconds, with blue uncertainty bands.",
          caption:
            "Figure 3. 7-DoF predictions for a held-out trial sequence.",
          credit:
            "Author-created Figure 3 from the accepted MICCAI 2026 paper. Rendered from the authorised figure-only source and stripped of metadata.",
          licence: "Copyright remains with the authors pending publication",
          longDescription:
            "Black ground-truth traces and blue dashed predictions closely follow one another for three position axes, three Euler-angle views, and jaw opening over time. Pale blue bands show plus or minus two predicted standard deviations. Panel annotations report 2.4, 2.5, and 1.9 mm position errors, 4.8, 5.1, and 17.2 degree rotation errors, and 6.2 degrees for jaw angle in this sequence.",
        },
        {
          src: "/paper-demos/btpn/figure-4-uncertainty.webp",
          width: 1280,
          height: 1039,
          alt:
            "Four panels show a reliability diagram, position error increasing with predicted uncertainty, a sparsification curve, and position error grouped by high, medium, and low detection confidence.",
          caption:
            "Figure 4. Uncertainty quality assessment. (a) Reliability diagram at five confidence levels with per-DoF ECEs. (b) Mean position error confirms higher predicted aleatoric uncertainty corresponds to higher error. (c) Area Under the Sparsification curve shows the model's useful uncertainty ranking for selective prediction. (d) Position error stratified by detection confidence.",
          credit:
            "Author-created Figure 4 from the accepted MICCAI 2026 paper. Rendered from the authorised figure-only source and stripped of metadata.",
          licence: "Copyright remains with the authors pending publication",
          longDescription:
            "The reliability panel reports ECE 0.028 for position, 0.301 for rotation, and 0.079 for jaw angle. Mean position error rises across predicted uncertainty bins with correlation 0.60. The sparsification panel reports AUSE 0.95 mm. Detection-confidence box plots contain 20,258 high-confidence, 669 medium-confidence, and 121 low-confidence samples, with error increasing as confidence falls.",
        },
      ],
      tables: [
        {
          label: "Table 1",
          caption:
            "Dataset overview. Each trial corresponds to one unique participant (urology surgeons for A and C, paediatric surgeons for B).",
          src: "/paper-demos/btpn/table-1-datasets.webp",
          width: 1470,
          height: 330,
          alt:
            "Dataset A has 60 seven-DoF trials, Dataset B has 30 seven-DoF trials, and Dataset C has 24 six-DoF trials, with collection dates, frames, frame rates, jaw sensing, annotation counts, and evaluation roles.",
          sourceNote:
            "Direct, tightly bounded crop of final camera-ready Table 1. The public asset contains only the caption and table, with metadata removed; no manuscript page, author details, reviews, or private source material are included.",
        },
        {
          label: "Table 2",
          caption: "Quantitative results overview.",
          src: "/paper-demos/btpn/table-2-quantitative-results.webp",
          width: 1470,
          height: 1235,
          alt:
            "A three-panel results table reports visual precision and mAP, complete pose baseline and ablation errors, and cross-dataset position, rotation, jaw, and autoregressive errors.",
          sourceNote:
            "Direct, tightly bounded crop of the complete final camera-ready Table 2, including all three panels and every baseline and ablation row. The public asset contains no surrounding manuscript text, affiliations, emails, private comments, reviews, responses, or file paths.",
        },
      ],
    },
    explorerTitle: "Trace the method, then inspect the reported metrics",
    explorerIntro:
      "The method view explains one subsystem at a time. The metric view keeps visual component quality, held-out pose error, and cross-dataset performance in separate groups.",
    explorer: {
      kind: "btpn",
      methods: [
        {
          id: "vision",
          label: "Vision",
          title: "Localise each tool before estimating pose",
          body:
            "A two-stage front end uses YOLOv26 segmentation to separate the tools, crops each region of interest, then applies a YOLOv26m-pose model for eight keypoints. A frozen DepthAnything V2 encoder supplies monocular depth cues.",
          evidence:
            "The accepted manuscript reports 99.1% mAP50 for segmentation and 98.3% mAP50 for keypoints.",
        },
        {
          id: "temporal",
          label: "Temporal",
          title: "Attend at clinically motivated time scales",
          body:
            "Hierarchical attention covers 10, 50, and 100 frames, corresponding to about 0.8, 3.8, and 7.7 seconds at 13 FPS. A kinematic foundation model learns motion priors, while bimanual cross-attention represents coordination between tools.",
          evidence:
            "The full BTPN is compared with ablations that remove the kinematic prior, bimanual attention, and multi-scale attention.",
        },
        {
          id: "uncertainty",
          label: "Uncertainty",
          title: "Predict confidence in the geometry of each output",
          body:
            "Position uses a Gaussian covariance, orientation uses a von Mises-Fisher distribution on the quaternion sphere, and jaw angle uses a scalar Gaussian. A differentiable calibration loss aligns predicted intervals with observed error.",
          evidence:
            "The held-out position ECE is reported as 0.028. Rotation remains over-conservative, with a separate reported ECE of 0.30.",
        },
      ],
      metricGroups: [
        {
          id: "visual",
          label: "Visual front end",
          scope: "Dataset A held-out visual components",
          metrics: [
            {
              value: "99.1%",
              label: "segmentation mAP50",
              context: "91.1% mAP50-95",
            },
            {
              value: "98.3%",
              label: "keypoint mAP50",
              context: "94.6% mAP50-95",
            },
            {
              value: "98.3%",
              label: "segmentation recall",
              context: "98.1% precision",
            },
          ],
        },
        {
          id: "pose",
          label: "Held-out pose",
          scope: "Full BTPN on Dataset A held-out trials",
          metrics: [
            {
              value: "7.0 mm",
              label: "position RMSE",
              context: "Euclidean tool-tip error",
            },
            {
              value: "11.7°",
              label: "rotation RMSE",
              context: "Geodesic quaternion error",
            },
            {
              value: "13.6%",
              label: "jaw error",
              context: "Percentage of opening range",
            },
            {
              value: "0.028",
              label: "position ECE",
              context: "Expected calibration error",
            },
          ],
        },
        {
          id: "generalisation",
          label: "Cross-dataset",
          scope: "Full BTPN, position RMSE across three dataset roles",
          metrics: [
            {
              value: "7.0 mm",
              label: "Dataset A",
              context: "21 held-out trials",
            },
            {
              value: "8.6 mm",
              label: "Dataset B",
              context: "30 in-distribution validation trials",
            },
            {
              value: "11.0 mm",
              label: "Dataset C",
              context: "24 out-of-distribution test trials",
            },
          ],
        },
      ],
    },
    takeaways: [
      "A pose estimate and its confidence should be evaluated together when downstream users may act on unreliable frames.",
      "Temporal windows are tied to task durations rather than chosen as unexplained hyperparameters.",
      "Held-out, in-distribution, and out-of-distribution datasets remain visibly separate in the results.",
    ],
    limitations: [
      "The public proceedings page and final bibliographic record are not available yet.",
      "The paper reports a research benchmark on box-trainer data, not clinical deployment or patient benefit.",
      "No published method covers the exact full 7-DoF monocular task, which limits direct method-to-method comparison.",
      "Rotation uncertainty is reported as over-conservative, and the page does not run or independently reproduce BTPN.",
    ],
    citation:
      "Choudhry, O., Ali, S., Biyani, C. S., and Jones, D. Bayesian Temporal Pose Networks for Uncertainty-Calibrated Laparoscopic Tool Pose Tracking. Accepted to MICCAI 2026. Final proceedings citation and publisher URL forthcoming.",
    sourceNotes: [
      {
        label: "Paper and public project record",
        detail:
          "The title, abstract, architecture, aggregate results, figures, tables, and reproduction guidance are public in the BTPN repository and were checked against the accepted camera-ready paper. The manuscript PDF, reviews, and response files are not distributed.",
        href: "https://github.com/omariosc/BTPN",
      },
      {
        label: "Code",
        detail:
          "The author repository is linked as a project record. This website does not claim to have executed the full model.",
        href: "https://github.com/omariosc/BTPN",
      },
      {
        label: "Publication status",
        detail:
          "Accepted to MICCAI 2026. The paper button remains marked coming soon until an official proceedings URL exists.",
      },
    ],
  },
};

export const paperDemoList = [
  paperDemos["real-time-tool-detection"],
  paperDemos["lask-7dof"],
  paperDemos.btpn,
];

export function paperDemoPath(slug: PaperDemoSlug) {
  return `/paper-demos/${slug}`;
}
