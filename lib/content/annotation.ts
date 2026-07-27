import type { Workshop } from "@/lib/types";

export const annotationTools: Workshop = {
  slug: "annotation-tools",
  number: "03",
  shortTitle: "Custom annotation tools",
  title: "Developing Custom Annotation Tools Using AI",
  navTitle: "Annotation tools",
  description:
    "Turn an expert annotation protocol into a tested local tool and a traceable dataset. The first-hand case audits frame-annotator for clip and timeline classification and surgical-annotator for masks, keypoints, and multi-task geometry.",
  promise:
    "Finish with a versioned annotation specification, an offline application plan, a review workflow, provenance-aware exports, and an evaluation protocol.",
  duration: "10 stages · about 80 guided minutes",
  audience:
    "Masters and PhD researchers building study-specific annotation workflows with a domain expert or research software reviewer.",
  prerequisites: [
    "One public, synthetic, or approved de-identified sample with a named data owner",
    "A domain expert to define labels, boundaries, uncertainty, and meaningful errors",
    "Basic Git, Python environment, file, and command-line testing knowledge",
    "Permission to use the chosen AI tools in the working environment",
  ],
  outcomes: [
    "Audit an annotation repository without mistaking passing tests for study validity",
    "Translate expert rules into stable IDs, explicit geometry, uncertainty states, and schemas",
    "Test a complete manual workflow that remains usable locally and offline",
    "Add model suggestions only after manual calibration, recording accept, edit, reject, and provenance",
    "Design review and evaluation that respect clustered frames, repeated annotators, and a declared manual baseline",
  ],
  projectTime:
    "Adapting, testing, calibrating, governing, and evaluating a real study tool usually takes several days to several weeks.",
  quickRoute: ["govern-data", "specification", "export-evaluate"],
  caseStudy: {
    eyebrow: "First-hand code audit",
    title: "Two useful prototypes, not one validated annotation system",
    context:
      "At commit 3e94ed03c1487331b8c041ca755421686b41d031, the repository contains frame-annotator for clip selection and timeline classification, plus surgical-annotator for masks, keypoints, visibility, and multi-task geometry. The tutorial begins from what the code and tests actually show.",
    expected:
      "I expected one portable annotation application whose passing tests covered the complete surgical workflow.",
    observed: [
      "Thirteen core tests pass, but they do not exercise surgical-annotator, so the multi-task geometry workflow remains uncovered.",
      "The application defaults to 0.0.0.0 with debug mode enabled rather than a safe local-only profile.",
      "The exporter contains hard-coded Windows paths, which prevents a clean portable release.",
      "The two applications share useful ideas but make different task assumptions and should be audited separately before refactoring.",
      "A separate two-record synthetic fixture now exports to review CSV and reimports without field loss, including the out-of-frame null-geometry rule.",
      "Its visible box also round-trips through a YOLO line exactly, while phase, named keypoints, visibility meaning, and provenance are declared losses.",
    ],
    changes: [
      "Treat clip and timeline classification separately from masks, keypoints, and multi-task geometry.",
      "Make 127.0.0.1 with debug disabled the default, and require an explicit reviewed profile for private hosting.",
      "Move dataset and export paths into a manifest, then add clean-environment coverage for both applications.",
      "Freeze a manual baseline and calibration set before measuring or enabling model assistance.",
    ],
    boundary:
      "This audit covers teaching prototypes and one synthetic serialization check. The review CSV preserves that fixture, while YOLO preserves only its box. Public commits establish code history, not dates, speed, dataset use, or annotation quality. The labelled first-hand account is separate. Nothing here establishes usability, patient safety, or deployment readiness.",
    sources: [
      {
        title: "frame-annotator repository at the audited commit",
        url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
      },
      {
        title: "Recorded audit procedure and outputs",
        url: "/audits/frame-annotator-2026-07-26.md",
      },
      {
        title: "Annotation export round-trip record",
        url: "/audits/annotation-round-trip-2026-07-26.md",
      },
      {
        title: "Download the synthetic round-trip fixture",
        url: "/worked-examples/annotation-round-trip-fixture.json",
      },
      {
        title: "Flask security considerations",
        url: "https://flask.palletsprojects.com/en/stable/web-security/",
      },
    ],
  },
  assessment: [
    {
      id: "deidentification-boundary",
      question:
        "A team replaces patient names in filenames with study IDs. They now want to upload surgical frames to a public AI service. What should happen next?",
      options: [
        {
          id: "upload-pseudonymous",
          label: "Proceed because the filenames are pseudonymous",
          correct: false,
          feedback:
            "Pseudonymisation does not make the media anonymous. Frames, overlays, audio, metadata, and linkage risk still need review.",
        },
        {
          id: "governance-review",
          label:
            "Stop and confirm de-identification, approval, processing location, provider terms, and residual re-identification risk",
          correct: true,
          feedback:
            "Correct. A named data owner must confirm that the media and the proposed processing are permitted before upload.",
        },
        {
          id: "blur-after-upload",
          label: "Upload first and ask the AI service to blur identifiers",
          correct: false,
          feedback:
            "The disclosure has already occurred before any returned blur is reviewed. De-identification must happen in an approved environment first.",
        },
      ],
    },
    {
      id: "assistance-calibration",
      question:
        "A segmentation model appears accurate on five easy frames. The team wants to enable suggestions for every annotator immediately. What is the defensible next step?",
      options: [
        {
          id: "enable-all",
          label: "Enable it and compare model inference time with manual time",
          correct: false,
          feedback:
            "Inference time omits review and correction burden, and five convenient frames do not establish a baseline.",
        },
        {
          id: "manual-baseline",
          label:
            "Freeze the protocol, calibrate annotators manually, record a representative manual baseline, then pilot assistance with full provenance",
          correct: true,
          feedback:
            "Correct. Assistance can only be evaluated against a stable manual workflow, including correction time and accepted quality.",
        },
        {
          id: "accept-high-confidence",
          label: "Automatically accept suggestions above a confidence threshold",
          correct: false,
          feedback:
            "Model confidence is not an annotation decision and may be poorly calibrated. Every accepted suggestion still needs an accountable human action.",
        },
      ],
    },
    {
      id: "clustered-agreement",
      question:
        "Two annotators label 2,000 adjacent frames drawn from four videos. How should agreement be reported?",
      options: [
        {
          id: "all-independent",
          label: "Treat all 2,000 frames as independent observations",
          correct: false,
          feedback:
            "Adjacent frames from the same video are correlated. Treating them as independent produces misleading precision.",
        },
        {
          id: "single-score",
          label: "Report one overall percentage agreement score",
          correct: false,
          feedback:
            "One score hides task differences, prevalence, source-video clustering, and repeated measurements from each annotator.",
        },
        {
          id: "cluster-aware",
          label:
            "Use task-appropriate metrics, preserve both originals, and estimate uncertainty at the source-video level while accounting for repeated annotators",
          correct: true,
          feedback:
            "Correct. The sampling unit, clustering, repeated annotators, thresholds, and adjudication process should all be declared.",
        },
      ],
    },
  ],
  glossary: [
    {
      term: "Annotation unit",
      definition:
        "The item receiving one decision, such as a frame, clip, phase interval, object, or case.",
    },
    {
      term: "Ontology",
      definition:
        "The named labels and the rules that define their relationships and permitted use.",
    },
    {
      term: "Pseudonymisation",
      definition:
        "Replacing direct identifiers with a code while keeping information that can reconnect the record to a person.",
    },
    {
      term: "De-identification",
      definition:
        "A documented process for removing or reducing identifying information across pixels, audio, metadata, filenames, and linked records.",
    },
    {
      term: "Calibration",
      definition:
        "A supervised practice round used to align annotators with the protocol before measured annotation begins.",
    },
    {
      term: "Manual baseline",
      definition:
        "Predeclared annotation time and quality measured with the complete manual workflow and no model suggestions.",
    },
    {
      term: "Provenance",
      definition:
        "The trace of who or what created, edited, accepted, rejected, reviewed, and exported an annotation.",
    },
    {
      term: "Adjudication",
      definition:
        "A recorded decision by a named reviewer that resolves a disagreement while preserving the original annotations.",
    },
    {
      term: "Clustered data",
      definition:
        "Related observations, such as adjacent frames from one video, that should not be analysed as independent samples.",
    },
    {
      term: "Atomic write",
      definition:
        "Saving through a temporary file and replacement step so interruption does not leave a partially written annotation.",
    },
  ],
  accent: "green",
  startLabel: "Inventory the raw data",
  steps: [
    {
      id: "govern-data",
      title: "Inventory and govern the raw data",
      duration: "8 minutes guided",
      checkpointLabel: "Governance boundary recorded",
      summary:
        "Establish what the media contains, how de-identification was checked, where it may be processed, and whether it can leave the approved environment before designing the tool.",
      action:
        "Create a manifest with pseudonymous IDs, format, dimensions, frame rate, site, checksum, approval reference, de-identification status, retention, and permitted processing locations.",
      output: "source-manifest.csv",
      prompt: `Act as a research data steward. Using only the metadata below, draft a data inventory and list unresolved governance decisions. Do not request, inspect, or upload raw media. Separate anonymisation from pseudonymisation. Require an approved check for identifiers in pixels, overlays, audio, headers, filenames, metadata, and linkage files. Flag where approval, consent, a DPIA, retention, deletion, or cloud-processing rules still need a human decision.

Metadata:
[Paste non-identifying metadata here]`,
      checkpoint:
        "Every source item has a stable pseudonymous ID and SHA-256 checksum. A named owner confirms the de-identification check, residual risk, processing locations, cloud use, retention, and deletion.",
      watchFor:
        "Pseudonymised data is still personal data. Removing names from filenames does not remove burned-in text, faces, voices, metadata, or linkage risk.",
      videoCue:
        "Start with a metadata-only manifest. Show the agent identifying a missing cloud-processing decision without seeing a single frame.",
      sources: [
        {
          title: "ICO anonymisation guidance",
          url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/about-this-guidance/",
        },
        {
          title: "ICO safeguards for research",
          url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/the-research-provisions/what-are-the-appropriate-safeguards/",
        },
        {
          title: "DICOM confidentiality profiles",
          url: "https://dicom.nema.org/medical/dicom/current/output/html/part15.html",
        },
      ],
    },
    {
      id: "protocol",
      title: "Write the protocol before the interface",
      duration: "10 minutes guided",
      checkpointLabel: "Protocol applied independently",
      summary:
        "Buttons cannot resolve an undefined clinical concept. Define every label, boundary, exception, and uncertainty state before writing application code.",
      action:
        "Ask domain experts to define the annotation unit, ontology, geometry, phase boundaries, visibility states, negative cases, and edge cases.",
      output: "ANNOTATION_PROTOCOL.md",
      prompt: `Turn the expert notes below into a draft annotation protocol. For every label, give a stable ID, definition, include rule, exclude rule, start and end conditions where relevant, ambiguity rule, positive examples, and counterexamples. Do not invent missing clinical decisions. Put unresolved questions in a separate table for expert sign-off.

Expert notes:
[Paste notes here]`,
      checkpoint:
        "Two experts can apply the written rules to a common sample without verbal coaching. Each disagreement becomes a protocol revision or an explicit uncertain state.",
      watchFor:
        "A polished ontology can still hide undefined transitions, clipped objects, absent anatomy, or disagreements about what counts as visible.",
      videoCue:
        "Take one vague label such as grasp and turn it into a definition, start marker, end marker, exception, and counterexample.",
      sources: [
        {
          title: "SAGES annotation framework",
          url: "https://discovery.ucl.ac.uk/id/eprint/10153663/",
        },
        {
          title: "CholecTriplet annotation protocol",
          url: "https://cholectriplet2022.grand-challenge.org/annotation-protocol/",
        },
        {
          title: "Challenges in surgical video annotation",
          url: "https://www.tandfonline.com/doi/full/10.1080/24699322.2021.1937320",
        },
      ],
    },
    {
      id: "specification",
      title: "Freeze a machine-readable specification",
      duration: "8 minutes guided",
      checkpointLabel: "Specification validates",
      summary:
        "Convert the approved protocol into exact IDs, types, valid values, coordinate conventions, phase rules, review settings, and export mappings.",
      action:
        "Complete the annotation-spec wizard and version its YAML, protocol Markdown, label map, and JSON Schemas together.",
      output: "annotation-spec.yaml",
      prompt: `Convert the approved protocol into the supplied annotation-spec YAML structure. Preserve stable IDs exactly. Validate task targets, keypoints, visibility states, phase transitions, frame indexing, coordinates, and export mappings. Do not invent defaults for unresolved fields. Return blocking inconsistencies separately.`,
      checkpoint:
        "The YAML validates, IDs are unique, every task target exists, and overlap, gaps, missing values, coordinates, timestamps, and interval boundaries are explicit.",
      watchFor:
        "Changing a label ID or phase rule after annotation starts is a schema migration, not a harmless wording edit.",
      videoCue:
        "Use the wizard to define box, tip keypoint, phase, and visibility tasks. Deliberately leave one boundary undefined and show the blocker.",
      sources: [
        {
          title: "JSON Schema",
          url: "https://json-schema.org/learn/getting-started-step-by-step",
        },
        {
          title: "Label Studio interface configuration",
          url: "https://labelstud.io/guide/setup.html",
        },
        {
          title: "CVAT annotation overview",
          url: "https://docs.cvat.ai/docs/getting_started/overview/",
        },
      ],
    },
    {
      id: "pilot",
      title: "Build a representative pilot",
      duration: "7 minutes guided",
      checkpointLabel: "Manual pilot approved",
      summary:
        "A convenient sample hides the cases most likely to break the ontology or interface. Pilot ordinary, difficult, negative, and corrupted inputs before showing annotators any model suggestion.",
      action:
        "Select a deterministic sample across sites, procedures, acquisition settings, durations, quality, rare labels, transitions, occlusion, and scene exit, then calibrate the manual workflow.",
      output: "pilot-manifest.csv",
      prompt: `Using this approved de-identified manifest, propose a deterministic pilot sample covering sites, procedures, durations, image quality, rare labels, phase boundaries, partial visibility, complete occlusion, out-of-view objects, negatives, and broken media. Use only pseudonymous IDs. Show which strata remain underrepresented. Reserve a representative subset for manual annotator calibration and baseline measurement before any model suggestion is visible.`,
      checkpoint:
        "The coverage table includes every task and planned edge case. Annotators complete a manual-only calibration subset, and resulting protocol changes are versioned before baseline measurement.",
      watchFor:
        "Do not tune the protocol only on clean examples from one site, operator, device, or procedure stage.",
      videoCue:
        "Compare a convenient first-ten-frames sample with a stratified pilot and show the missing occlusion or transition case.",
      sources: [
        {
          title: "CholecTriplet annotation protocol",
          url: "https://cholectriplet2022.grand-challenge.org/annotation-protocol/",
        },
        {
          title: "Systematic review of surgical video annotation",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10282964/",
        },
      ],
    },
    {
      id: "local-app",
      title: "Choose and implement the annotation core",
      duration: "10 minutes guided",
      checkpointLabel: "Manual workflow tested",
      summary:
        "Begin with deterministic manual annotation. Configure a hosted tool, adapt a managed platform, or build offline only after the data boundary and task specification make the choice defensible.",
      action:
        "Compare configure, adapt, and build options against the approved data flow and required interactions. Implement the smallest option that completes every manual task, saves atomically, recovers safely, and exports portably.",
      output: "implementation-record.md",
      prompt: `Use annotation-spec.yaml and the approved data-flow record to compare three routes: configure a hosted annotation service, adapt an institution-managed platform, or build an offline application. For each route, identify unsupported tasks, data transfers, network dependence, export format, recovery behaviour, operating owner, and exit plan. Recommend nothing until those gaps are visible. For a custom route, inspect omariosc/frame-annotator at commit 3e94ed03c1487331b8c041ca755421686b41d031, keep frame-annotator and surgical-annotator as separate application boundaries, replace hard-coded paths and study assumptions, bind to 127.0.0.1, disable debug mode, and package all assets locally. Use only synthetic fixtures and show configuration or code changes as reviewable diffs.`,
      checkpoint:
        "The selected implementation completes every declared manual task with synthetic fixtures, preserves work across refresh or interruption, and produces a portable export. The record names the exact service version, managed release, or source commit plus its operating owner.",
      watchFor:
        "A familiar tool is not automatically the right one. Hosted convenience may breach the data boundary, while custom code creates a maintenance duty. Passing frame-annotator's 13 core tests does not validate surgical-annotator.",
      videoCue:
        "Score the same synthetic case against hosted, managed, and offline routes, then show why one route passes the study's data and interaction requirements.",
      sources: [
        {
          title: "frame-annotator at the audited commit",
          url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
        },
        {
          title: "Label Studio labelling configuration",
          url: "https://labelstud.io/guide/setup.html",
        },
        {
          title: "CVAT overview",
          url: "https://docs.cvat.ai/docs/getting_started/overview/",
        },
      ],
    },
    {
      id: "model-assist",
      title: "Add optional model assistance",
      duration: "7 minutes guided",
      checkpointLabel: "Assistance pilot justified",
      summary:
        "Treat every model output as a proposal introduced after manual calibration. Keep the manual workflow available and record what generated, changed, accepted, or rejected each suggestion.",
      action:
        "Freeze the manual baseline first, then place local segmentation or tracking behind an adapter with explicit accept, edit, and reject actions and complete per-suggestion provenance.",
      output: "src/model_adapters/",
      prompt: `After the protocol, calibration set, and manual baseline are frozen, add an optional local SAM2 video suggestion adapter. Never save a prediction as accepted ground truth without a human action. Record model repository, code commit, version, checkpoint SHA-256, prompt type and coordinates, inference parameters, timestamp, accept or edit or reject decision, correction time, and corrected geometry. The manual workflow must remain complete when the model is unavailable.`,
      checkpoint:
        "Predictions are visually distinct, disabling the model removes no manual feature, rejected suggestions create no accepted geometry, and assisted quality and total review time can be compared with the frozen manual baseline.",
      watchFor:
        "Faster inference is not faster annotation if review and correction take longer. Do not tune the protocol, thresholds, or baseline after seeing assisted results.",
      videoCue:
        "Accept one good suggestion, edit one partial mask, reject one failure, and inspect the three different provenance records.",
      sources: [
        {
          title: "SAM 2",
          url: "https://github.com/facebookresearch/sam2",
        },
        {
          title: "CVAT SAM2 tracker",
          url: "https://docs.cvat.ai/docs/enterprise/segment-anything-2-tracker/",
        },
        {
          title: "NIST AI RMF Core",
          url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/",
        },
      ],
    },
    {
      id: "test-package",
      title: "Test and package the chosen release",
      duration: "8 minutes guided",
      checkpointLabel: "Installed release tested",
      summary:
        "A source checkout, staging project, and managed deployment can each hide failures. Test the exact release form that annotators will receive.",
      action:
        "Test the selected hosted, managed, or offline release with synthetic fixtures, every declared task, interruption, recovery, export, roles where relevant, and the oldest supported client.",
      output: "release-verification.md",
      prompt: `Create an acceptance suite for the chosen annotation release. Cover clip selection, timeline classification, boxes, masks, keypoints, multi-task geometry, draw, edit, undo, autosave, reload, visibility, review, and portable export wherever the specification requires them. Test malformed input, interrupted writes, limited bandwidth where relevant, and the oldest supported operating system and browser. For a hosted service, pin the service version and test staging, roles, export, and account closure. For a managed deployment, restore a synthetic backup and test promotion. For custom code, build the wheel, install it into a new empty environment rather than editable mode, and fail if any template, script, stylesheet, or asset is missing. Report accessibility checks that still require a person.`,
      checkpoint:
        "The exact selected release passes the declared task, interruption, recovery, and export checks in a clean target environment. Keyboard operation has no unexplained high-severity accessibility failure, and a named person accepts the remaining manual checks.",
      watchFor:
        "Test evidence from a different delivery path is not transferable. A provider status page does not replace study acceptance, and a source-checkout test does not prove that the installed package works.",
      videoCue:
        "Run one release-specific failure: interrupt hosted autosave, restore managed staging, or install a custom wheel with a deliberately missing template.",
      sources: [
        {
          title: "Label Studio labelling guide",
          url: "https://labelstud.io/guide/labeling/",
        },
        {
          title: "CVAT testing guide",
          url: "https://docs.cvat.ai/docs/contributing/running-tests/",
        },
        {
          title: "Python build and publish guidance",
          url: "https://packaging.python.org/en/latest/guides/section-build-and-publish/",
        },
      ],
    },
    {
      id: "hosting",
      title: "Choose local or private hosting",
      duration: "7 minutes guided",
      checkpointLabel: "Deployment boundary approved",
      summary:
        "Local offline use is the safe default. A shared server adds authentication, authorisation, TLS, audit logs, backups, and an operational owner.",
      action:
        "Replace the current 0.0.0.0 and debug defaults with a 127.0.0.1 offline profile. Threat-model a separate private-server profile before placing research media on it.",
      output: "deployment-profiles.yaml",
      prompt: `Create two explicit deployment profiles. Local mode must bind to 127.0.0.1, disable debug mode, load no remote asset, and remain usable offline. Threat-model an optional private deployment using OWASP ASVS and assume special-category research data. Include authentication, annotator and reviewer and administrator roles, session security, upload limits, allowed formats, TLS, audit events, backup encryption, restoration, and incident response. Use a production WSGI server and reverse proxy. Do not expose the Flask development server.`,
      checkpoint:
        "Local mode stays on 127.0.0.1. Private mode has no anonymous route, debugger, or default secret; roles are tested and the team completes a backup restore drill.",
      watchFor:
        "Do not turn a single-user prototype into a shared clinical service by changing only the bind address.",
      videoCue:
        "Place the two deployment profiles side by side and show the controls that appear when private hosting is selected.",
      sources: [
        {
          title: "Flask production deployment",
          url: "https://flask.palletsprojects.com/en/latest/tutorial/deploy/",
        },
        {
          title: "Flask security considerations",
          url: "https://flask.palletsprojects.com/en/stable/web-security/",
        },
        {
          title: "OWASP ASVS",
          url: "https://owasp.org/www-project-application-security-verification-standard/",
        },
      ],
    },
    {
      id: "review",
      title: "Review and adjudicate",
      duration: "7 minutes guided",
      checkpointLabel: "Cluster-aware review planned",
      summary:
        "Quality is a workflow. Preserve both original annotations, queue task-specific disagreements, and record every adjudication and protocol change.",
      action:
        "Double-annotate a predeclared stratified fraction sampled at case or video level with pseudonymous annotator IDs, then run blinded review where practical.",
      output: "review-plan.yaml",
      prompt: `Compare these two schema-valid annotation exports without deciding who is correct. Create a disagreement queue for boxes, keypoints, phase boundaries, and visibility states using predeclared task-specific thresholds. Include exact case, video, frame, annotation, annotator, and revision IDs. Preserve both originals and leave the final decision to the named adjudicator. State the sampling unit and do not treat adjacent frames from one video or repeated decisions from one annotator as independent.`,
      checkpoint:
        "Each adjudication has a reviewer, decision, reason, note, and revision link. Agreement and uncertainty are reported by task with clustering at source-video or case level and repeated annotators accounted for.",
      watchFor:
        "A reviewer should not silently overwrite an original. Thousands of adjacent frames do not provide thousands of independent observations.",
      videoCue:
        "Compare two plausible tip locations, queue the disagreement, adjudicate it, and show that both originals remain recoverable.",
      sources: [
        {
          title: "Challenges in surgical video annotation",
          url: "https://www.tandfonline.com/doi/full/10.1080/24699322.2021.1937320",
        },
        {
          title: "CholecTriplet mediation workflow",
          url: "https://cholectriplet2022.grand-challenge.org/annotation-protocol/",
        },
        {
          title: "Label Studio quality workflows",
          url: "https://labelstud.io/guide/enterprise_features",
        },
      ],
    },
    {
      id: "export-evaluate",
      title: "Export, trace, and evaluate",
      duration: "8 minutes guided",
      checkpointLabel: "Traceable evaluation reproduced",
      summary:
        "Preserve a lossless native record before derived formats. Test whether the custom tool improves accepted annotation time or quality against a declared baseline.",
      action:
        "Export records, revisions, reviews, label maps, splits, checksums, environment, and protocol references. Reimport them and compare assistance with the frozen manual baseline.",
      output: "evaluation-report.md",
      prompt: `Create a deterministic native export and evaluation report from the frozen records. Preserve originals, revisions, suggestions, accept or edit or reject actions, and adjudications. Generate label maps, split manifests, SHA-256 checksums, and an RO-Crate metadata stub. Compare assisted annotation with the preregistered manual baseline using total accepted annotation time, correction time, box IoU, keypoint error, phase-boundary error, visibility agreement, and data-loss metrics. Declare the unit of analysis, account for clustering by case or video and repeated annotators, and report order effects, uncertainty, strata, missing measurements, and failures.`,
      checkpoint:
        "The native export validates and reimports identically, derived records trace to native IDs, checksums verify, and a second machine reproduces the cluster-aware comparison with the manual baseline.",
      watchFor:
        "Do not claim success from a polished interface, model latency, or frame-level precision that ignores clustering. Report correction burden, missing data, and uncertainty.",
      videoCue:
        "Export one reviewed case, trace a derived YOLO label back to its native record, and reproduce one metric from a fresh directory.",
      sources: [
        {
          title: "W3C PROV-O",
          url: "https://www.w3.org/TR/prov-o/",
        },
        {
          title: "RO-Crate specification",
          url: "https://www.researchobject.org/ro-crate/specification.html",
        },
        {
          title: "Datasheets for Datasets",
          url: "https://arxiv.org/abs/1803.09010",
        },
      ],
    },
  ],
  sourceLibrary: [
    {
      title: "LASK dataset, version 1.0",
      url: "https://doi.org/10.5281/zenodo.20752651",
      note: "The versioned Zenodo record for 37 trials with dense time-aligned kinematics and sparse manual visual annotations. The record is evidence for the released data, not for the private history of the annotation tool.",
    },
    {
      title: "frame-annotator initial public commit",
      url: "https://github.com/omariosc/frame-annotator/commit/deb7d43a2b6ff93ac1ac5a33c2f00028d7833823",
      note: "The first public repository checkpoint, documenting configurable clip and range labelling, keyboard shortcuts, and clip-level and frame-level export.",
    },
    {
      title: "surgical-annotator integration commit",
      url: "https://github.com/omariosc/frame-annotator/commit/461615a71beabeaa0ed67120a883cf4ce900d7b1",
      note: "The later public checkpoint that brought masks, shaft lines, keypoints, phase labels, and batch annotation into the same repository.",
    },
    {
      title: "frame-annotator and surgical-annotator at the audited commit",
      url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
      note: "The first-hand code-audit case: frame-annotator covers clip and timeline classification, while surgical-annotator covers masks, keypoints, visibility, and multi-task geometry.",
    },
    {
      title: "SAGES annotation framework",
      url: "https://doi.org/10.1007/s00464-021-08578-9",
      note: "Consensus foundations for surgical video annotation.",
    },
    {
      title: "CVAT",
      url: "https://docs.cvat.ai/",
      note: "A mature reference for image, video, quality-control, export, and model-assisted annotation.",
    },
    {
      title: "Label Studio",
      url: "https://labelstud.io/guide/get_started",
      note: "A configurable open-source labelling platform and useful build-versus-configure comparison.",
    },
    {
      title: "MONAI Label",
      url: "https://github.com/Project-MONAI/MONAILabel",
      note: "A medical-imaging reference for local AI-assisted annotation and active learning.",
    },
    {
      title: "INDEXITY",
      url: "https://arxiv.org/abs/2306.14780",
      note: "A collaborative surgical video annotation platform and comparison point for multi-user workflows.",
    },
  ],
};
