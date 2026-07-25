import type { Workshop } from "@/lib/types";

export const annotationTools: Workshop = {
  slug: "annotation-tools",
  number: "03",
  shortTitle: "Custom annotation tools",
  title: "Developing Custom Annotation Tools Using AI",
  navTitle: "Annotation tools",
  description:
    "Turn an expert annotation protocol into a tested local tool and a traceable dataset. The worked example builds on frame-annotator without treating generated code or model suggestions as ground truth.",
  promise:
    "Finish with a versioned annotation specification, an offline application plan, a review workflow, provenance-aware exports, and an evaluation protocol.",
  duration: "10 stages · about 75 minutes",
  accent: "green",
  startLabel: "Inventory the raw data",
  steps: [
    {
      id: "govern-data",
      title: "Inventory and govern the raw data",
      summary:
        "Establish what the media contains, where it may be processed, and whether it can leave the approved environment before designing the tool.",
      action:
        "Create a manifest with pseudonymous IDs, format, dimensions, frame rate, site, checksum, approval reference, retention, and permitted processing locations.",
      output: "source-manifest.csv",
      prompt: `Act as a research data steward. Using only the metadata below, draft a data inventory and list unresolved governance decisions. Do not request, inspect, or upload raw media. Separate anonymisation from pseudonymisation and flag where approval, consent, a DPIA, retention, or cloud-processing rules still need a human decision.

Metadata:
[Paste non-identifying metadata here]`,
      checkpoint:
        "Every source item has a stable pseudonymous ID and SHA-256 checksum. A named owner confirms processing locations, cloud use, retention, and deletion.",
      watchFor:
        "Pseudonymised data is still personal data. Never paste identifiable frames, filenames, credentials, or linkage keys into an unapproved service.",
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
      summary:
        "A convenient sample hides the cases most likely to break the ontology or interface. Pilot ordinary, difficult, negative, and corrupted inputs.",
      action:
        "Select a deterministic sample across sites, procedures, acquisition settings, durations, quality, rare labels, transitions, occlusion, and scene exit.",
      output: "pilot-manifest.csv",
      prompt: `Using this de-identified manifest, propose a deterministic pilot sample covering sites, procedures, durations, image quality, rare labels, phase boundaries, partial visibility, complete occlusion, out-of-view objects, negatives, and broken media. Use only pseudonymous IDs. Show which strata remain underrepresented.`,
      checkpoint:
        "The coverage table includes every task and planned edge case. A smaller reference subset is independently annotated and protocol changes are versioned.",
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
      title: "Generate the local offline core",
      summary:
        "Begin with deterministic manual annotation. Preserve frame-annotator's keyboard-first workflow and atomic files while moving study assumptions into configuration.",
      action:
        "Add manifest discovery, optional video extraction, schema validation, atomic writes, backups, undo, and safe recovery. Bind only to the local machine.",
      output: "src/annotation_app/",
      prompt: `Inspect omariosc/frame-annotator and implement a configuration-driven local app from annotation-spec.yaml. Preserve its keyboard-first interface, phase timeline, masks, keypoints, visibility states, and per-frame atomic JSON. Remove fixed dataset paths, tool counts, and peg-transfer assumptions. Bind to 127.0.0.1, disable debug mode, and keep the complete manual workflow usable with network access blocked. Use synthetic fixtures in tests.`,
      checkpoint:
        "A clean machine loads the pilot and completes every manual task offline. Annotations survive refresh and forced termination without silent loss.",
      watchFor:
        "A local browser interface is not automatically private if it binds to the network, enables a debugger, loads remote assets, or logs raw frames.",
      videoCue:
        "Open the same synthetic case before and after moving labels from source code into annotation-spec.yaml.",
      sources: [
        {
          title: "frame-annotator",
          url: "https://github.com/omariosc/frame-annotator",
        },
        {
          title: "Python packaging guide",
          url: "https://packaging.python.org/en/latest/guides/writing-pyproject-toml/",
        },
        {
          title: "Flask server configuration",
          url: "https://flask.palletsprojects.com/en/stable/api/",
        },
      ],
    },
    {
      id: "model-assist",
      title: "Add optional model assistance",
      summary:
        "Treat every model output as a proposal. Keep the manual workflow available and record what generated, changed, accepted, or rejected each suggestion.",
      action:
        "Place local segmentation or tracking behind an adapter with explicit accept, edit, and reject actions and complete per-suggestion provenance.",
      output: "src/model_adapters/",
      prompt: `Add an optional local SAM2 video suggestion adapter. Never save a prediction as accepted ground truth without a human action. Record model repository, code commit, version, checkpoint SHA-256, prompt type and coordinates, inference parameters, timestamp, accept or edit or reject decision, and whether the geometry was corrected. The manual workflow must remain complete when the model is unavailable.`,
      checkpoint:
        "Predictions are visually distinct, disabling the model removes no manual feature, rejected suggestions create no accepted geometry, and retained suggestions have full provenance.",
      watchFor:
        "Faster inference is not faster annotation if corrections take longer. Never measure model latency alone.",
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
      title: "Test and package the offline release",
      summary:
        "Running from a source checkout is not a release test. Build the package, install it into an empty environment, and exercise the installed UI.",
      action:
        "Add unit, API, schema, browser, interruption, export, and accessibility tests. Verify HTML, CSS, JavaScript, and templates are packaged.",
      output: "tests/test_release_install.py",
      prompt: `Build a release verification suite. Install the wheel into a new empty environment rather than editable mode. Fail if an HTML template, JavaScript file, stylesheet, or package asset is missing. Add Playwright tests for draw, edit, undo, autosave, reload, phase boundary, visibility, review, and export. Test malformed input and interrupted writes. Report accessibility checks that still require a person.`,
      checkpoint:
        "CI passes, the wheel launches from a clean environment, export round-trips without loss, and keyboard operation works without unexplained high-severity accessibility failures.",
      watchFor:
        "Editable installs can hide missing package assets. Tests that run only from the repository can pass while the installed application is broken.",
      videoCue:
        "Install the built wheel in an empty environment and launch it. Show a packaging test catching a deliberately absent template.",
      sources: [
        {
          title: "PyPA build and publish guidance",
          url: "https://packaging.python.org/en/latest/guides/section-build-and-publish/",
        },
        {
          title: "Playwright accessibility testing",
          url: "https://playwright.dev/docs/accessibility-testing",
        },
        {
          title: "WCAG 2.2",
          url: "https://www.w3.org/TR/WCAG22/",
        },
      ],
    },
    {
      id: "hosting",
      title: "Choose local or private hosting",
      summary:
        "Local offline use is the safe default. A shared server adds authentication, authorisation, TLS, audit logs, backups, and an operational owner.",
      action:
        "Document separate local and private-server profiles. Threat-model the server before placing research media on it.",
      output: "deployment-profiles.yaml",
      prompt: `Threat-model an optional private deployment using OWASP ASVS. Assume special-category research data. Produce controls for authentication, annotator and reviewer and administrator roles, session security, upload limits, allowed formats, TLS, audit events, backup encryption, restoration, and incident response. Use a production WSGI server and reverse proxy. Do not expose the Flask development server.`,
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
      summary:
        "Quality is a workflow. Preserve both original annotations, queue task-specific disagreements, and record every adjudication and protocol change.",
      action:
        "Double-annotate a predeclared stratified fraction with pseudonymous annotator IDs, then run blinded review where practical.",
      output: "review-plan.yaml",
      prompt: `Compare these two schema-valid annotation exports without deciding who is correct. Create a disagreement queue for boxes, keypoints, phase boundaries, and visibility states using the predeclared thresholds. Include exact item, annotation, and revision IDs. Preserve both originals and leave the final decision to the named adjudicator.`,
      checkpoint:
        "Each adjudication has a reviewer, decision, reason, note, and revision link. Agreement is reported by task and relevant subgroup rather than as one score.",
      watchFor:
        "A reviewer should not silently overwrite an original. A changed definition requires a new protocol version and a list of affected records.",
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
      summary:
        "Preserve a lossless native record before derived formats. Test whether the custom tool improves accepted annotation time or quality against a declared baseline.",
      action:
        "Export records, revisions, reviews, label maps, splits, checksums, environment, and protocol references. Reimport them and run the preregistered evaluation.",
      output: "evaluation-report.md",
      prompt: `Create a deterministic native export and evaluation report from the frozen records. Preserve originals, revisions, suggestions, and adjudications. Generate label maps, split manifests, SHA-256 checksums, and an RO-Crate metadata stub. Compare the custom tool with [baseline] using preregistered annotation time, correction time, box IoU, keypoint error, phase-boundary error, visibility agreement, and data-loss metrics. Report uncertainty, strata, missing measurements, and failures.`,
      checkpoint:
        "The native export validates and reimports identically, derived records trace to native IDs, checksums verify, and a second machine reproduces the evaluation.",
      watchFor:
        "Do not claim success from a polished interface, model latency, or descriptive differences alone. Report correction burden and uncertainty.",
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
      title: "frame-annotator",
      url: "https://github.com/omariosc/frame-annotator",
      note: "The worked example for local clip, phase, mask, keypoint, visibility, and plain-file annotation.",
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
