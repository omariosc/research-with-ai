import type { WorkshopGuidance } from "@/lib/types";

export const annotationGuidance: WorkshopGuidance = {
  lastVerified: "2026-07-27",
  phases: [
    {
      id: "govern",
      title: "Govern the study",
      summary:
        "Set the data boundary and agree what each annotation means before choosing software.",
      stepIds: ["govern-data", "protocol"],
    },
    {
      id: "design",
      title: "Design the work",
      summary:
        "Turn the protocol into testable rules and sample the difficult cases deliberately.",
      stepIds: ["specification", "pilot"],
    },
    {
      id: "build",
      title: "Build the workflow",
      summary:
        "Establish a complete manual tool before adding optional model suggestions.",
      stepIds: ["local-app", "model-assist"],
    },
    {
      id: "assure",
      title: "Assure and deploy",
      summary:
        "Test the installed release, then choose a deployment boundary that the team can operate.",
      stepIds: ["test-package", "hosting"],
    },
    {
      id: "release",
      title: "Review and release",
      summary:
        "Preserve independent judgements, resolve disagreements, and publish traceable exports.",
      stepIds: ["review", "export-evaluate"],
    },
  ],
  routes: [
    {
      id: "orientation",
      title: "Orientation",
      description:
        "Define the governance, clinical language, and machine-readable rules before committing to a tool.",
      bestFor:
        "A new study, a protocol meeting, or a team comparing configure, adapt, and build options.",
      stepIds: ["govern-data", "protocol", "specification"],
    },
    {
      id: "local-offline",
      title: "Local offline workflow",
      description:
        "Build and verify a manual workflow that keeps approved media on one controlled machine.",
      bestFor:
        "Sensitive video or imaging data, limited connectivity, and single-site annotation.",
      stepIds: [
        "govern-data",
        "protocol",
        "specification",
        "pilot",
        "local-app",
        "test-package",
        "review",
        "export-evaluate",
      ],
    },
    {
      id: "assisted-labelling",
      title: "Assisted labelling study",
      description:
        "Freeze the manual baseline, pilot model suggestions, and measure correction burden and quality.",
      bestFor:
        "Teams evaluating segmentation, tracking, keypoint, or phase suggestions without automating acceptance.",
      stepIds: [
        "govern-data",
        "protocol",
        "specification",
        "pilot",
        "local-app",
        "model-assist",
        "test-package",
        "review",
        "export-evaluate",
      ],
    },
    {
      id: "private-team-deployment",
      title: "Private team deployment",
      description:
        "Prepare a tested multi-user service with roles, review, recovery, and an accountable operator.",
      bestFor:
        "Approved teams annotating across sites or devices inside a controlled research environment.",
      stepIds: [
        "govern-data",
        "protocol",
        "specification",
        "pilot",
        "local-app",
        "test-package",
        "hosting",
        "review",
        "export-evaluate",
      ],
    },
  ],
  steps: {
    "govern-data": {
      why:
        "Medical images and video can identify people through pixels, audio, headers, filenames, or linked records. The processing boundary must be settled before any upload.",
      terms: [
        {
          label: "Data boundary",
          definition:
            "The approved people, places, systems, and transfers within which the study data may be handled.",
        },
        {
          label: "Residual risk",
          definition:
            "The chance that someone could still be identified after the planned de-identification checks.",
        },
      ],
      tips: [
        {
          title: "Trace every copy",
          body:
            "Add the source, destination, purpose, owner, retention date, and deletion method for each planned movement of frames, clips, DICOM files, and exports.",
        },
        {
          title: "Inspect more than filenames",
          body:
            "Have an approved reviewer check burned-in text, faces, voices, overlays, DICOM headers, sidecar files, and linkage tables on a representative sample.",
        },
      ],
      paths: [
        {
          id: "govern-data-hosted",
          mode: "hosted",
          title: "Approved hosted boundary",
          bestFor:
            "A study whose data owner has approved a named external processor and transfer route.",
          approach:
            "Send only the minimum approved, de-identified records to a contracted workspace and document region, retention, deletion, and subcontractors.",
          tradeoff:
            "Collaboration is quick, but the team accepts an external processing dependency and must verify contractual and technical controls.",
          dataBoundary:
            "Media leaves the institution only after documented pixel, audio, metadata, filename, and linkage checks.",
          network:
            "Requires an approved encrypted connection and a recorded upload and download route.",
          cost:
            "Allow for storage, transfer, user, and retention charges as well as governance review time.",
          hardware:
            "A standard browser workstation is sufficient unless server-side video decoding or model inference is purchased.",
          evidence:
            "Keep the approval reference, processor terms, region, transfer log, deletion test, and checksum manifest.",
          sources: [
            {
              title: "ICO anonymisation guidance",
              url: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/about-this-guidance/",
            },
          ],
        },
        {
          id: "govern-data-managed",
          mode: "managed",
          title: "Institution-managed safe environment",
          bestFor:
            "Multi-user work where the institution can operate storage, identity, audit, and backup controls.",
          approach:
            "Move approved records into a managed research environment, restrict roles, and keep the re-identification key in a separate system.",
          tradeoff:
            "The boundary is easier to govern centrally, but access setup and operational support can delay the pilot.",
          dataBoundary:
            "Media remains on institution-controlled storage with separately governed imports, exports, and linkage data.",
          network:
            "Usually needs a university or hospital network, VPN, or approved remote desktop session.",
          cost:
            "Budget for managed storage, backups, identity integration, and research computing support.",
          hardware:
            "A managed server needs enough storage throughput for video and any planned GPU work; annotators can use modest clients.",
          evidence:
            "Retain the data-flow diagram, role test, access log sample, backup restore record, and owner sign-off.",
          sources: [
            {
              title: "DICOM confidentiality profiles",
              url: "https://dicom.nema.org/medical/dicom/current/output/html/part15.html",
            },
          ],
        },
        {
          id: "govern-data-local",
          mode: "local",
          title: "Local controlled workstation",
          bestFor:
            "A single approved annotator, offline work, or data that cannot leave a controlled room or device.",
          approach:
            "Keep media and the re-identification boundary on encrypted local storage, disable unapproved synchronisation, and export only reviewed study records.",
          tradeoff:
            "Data movement is minimal, but collaboration, remote support, backup, and hardware failure need explicit procedures.",
          dataBoundary:
            "Raw media stays on one named workstation or attached approved drive; only checked exports cross the boundary.",
          network:
            "No network is required for annotation; updates and exports use a controlled transfer process.",
          cost:
            "Uses existing equipment where suitable, with costs for encrypted storage, replacement media, and staff time.",
          hardware:
            "Size local storage and decoding capacity against the largest case, video codec, and backup window.",
          evidence:
            "Record device ownership, encryption, blocked sync, checksum verification, backup test, and reviewed export history.",
          sources: [
            {
              title: "DICOM confidentiality profiles",
              url: "https://dicom.nema.org/medical/dicom/current/output/html/part15.html",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Draft the boundary using metadata only, before opening or uploading the clinical media.",
        items: [
          {
            id: "govern-data-map",
            label:
              "List every planned source, working copy, backup, model endpoint, and export destination.",
          },
          {
            id: "govern-data-identifiers",
            label:
              "Name who will check identifiers in pixels, audio, metadata, filenames, and linkage files.",
          },
          {
            id: "govern-data-owner",
            label:
              "Record the data owner's decision on permitted locations, retention, deletion, and cloud use.",
          },
        ],
        evidence:
          "A signed data-flow record linked to the manifest, approval reference, residual risks, and named owner.",
      },
    },
    protocol: {
      why:
        "A drawing tool cannot decide what a clipped instrument, uncertain phase boundary, or invisible landmark means. Experts must make those rules explicit.",
      terms: [
        {
          label: "Annotation unit",
          definition:
            "The exact thing receiving one decision, such as a frame, clip, interval, object, or case.",
        },
        {
          label: "Counterexample",
          definition:
            "A plausible-looking case that should not receive the label and helps expose a vague rule.",
        },
      ],
      tips: [
        {
          title: "Write geometry rules in pixels",
          body:
            "State whether boxes may leave the frame, how polygons close, what a missing keypoint stores, and whether coordinates use pixels or normalised values.",
        },
        {
          title: "Test boundaries aloud",
          body:
            "Ask two experts to mark the start and end of one difficult surgical phase independently, then turn their disagreement into a rule or uncertain state.",
        },
      ],
      paths: [
        {
          id: "protocol-hosted",
          mode: "hosted",
          title: "Hosted protocol workspace",
          bestFor:
            "Distributed expert drafting with approved, de-identified examples and frequent comments.",
          approach:
            "Draft label definitions and decision tables in a browser workspace, while keeping clinical examples to the approved minimum.",
          tradeoff:
            "Discussion is convenient, but raw examples may cross a boundary and document history depends on the provider.",
          dataBoundary:
            "Use synthetic or approved de-identified crops; store no re-identification key in the workspace.",
          network:
            "Continuous network access is required for editing, comments, and version history.",
          cost:
            "Possible seat and storage fees, plus expert time for structured review.",
          hardware:
            "Ordinary browser devices are adequate because the task is writing and reviewing rules.",
          evidence:
            "Export a dated protocol, comment resolution log, example decisions, and named expert approvals.",
          sources: [
            {
              title: "Label Studio interface configuration",
              url: "https://labelstud.io/guide/setup.html",
            },
          ],
        },
        {
          id: "protocol-managed",
          mode: "managed",
          title: "Managed platform configuration",
          bestFor:
            "Teams adapting a supported internal annotation platform to boxes, masks, keypoints, tracks, or phases.",
          approach:
            "Prototype the ontology in a managed test project, then write every platform setting back into the study protocol.",
          tradeoff:
            "Existing controls reduce build effort, but the platform's task model may pressure the protocol into an unsuitable shape.",
          dataBoundary:
            "Approved examples remain in the managed environment and exports follow its controlled route.",
          network:
            "Requires access to the institution's service, commonly through VPN or an internal network.",
          cost:
            "Includes platform operation, storage, updates, and administrator support.",
          hardware:
            "Server video decoding and large masks need suitable memory and storage; client hardware can remain modest.",
          evidence:
            "Keep the protocol version, exported configuration, example annotations, unresolved questions, and sign-off.",
          sources: [
            {
              title: "CVAT annotation overview",
              url: "https://docs.cvat.ai/docs/getting_started/overview/",
            },
          ],
        },
        {
          id: "protocol-local",
          mode: "local",
          title: "Local protocol and examples",
          bestFor:
            "An offline expert workshop or a study whose clinical examples cannot enter a collaborative service.",
          approach:
            "Version the protocol beside small approved fixtures and use a local viewer to test each rule.",
          tradeoff:
            "The record is portable and private, but comments, merges, and sign-off need a deliberate process.",
          dataBoundary:
            "Examples stay on the approved workstation and only the reviewed text and synthetic fixtures are shared.",
          network:
            "No network is needed during drafting or example review.",
          cost:
            "Low software cost, with most effort in expert meetings, revision, and document control.",
          hardware:
            "A workstation capable of viewing the study codec and image dimensions is sufficient.",
          evidence:
            "Commit the protocol, fixture IDs, independent decisions, disagreement log, and approval record.",
          sources: [],
        },
      ],
      tryNow: {
        intro:
          "Choose one difficult label and make its clinical and geometric meaning testable.",
        items: [
          {
            id: "protocol-unit",
            label:
              "State the annotation unit and the exact event, object, or interval receiving the label.",
          },
          {
            id: "protocol-rules",
            label:
              "Write one include rule, one exclude rule, one boundary rule, and one uncertainty rule.",
          },
          {
            id: "protocol-independent",
            label:
              "Have two experts apply the draft independently to the same approved example.",
          },
        ],
        evidence:
          "A versioned protocol section with both decisions, the disagreement, and the agreed revision or uncertain state.",
      },
    },
    specification: {
      why:
        "Stable identifiers, coordinate conventions, null states, and export mappings prevent the interface and dataset from silently interpreting the protocol differently.",
      terms: [
        {
          label: "Stable ID",
          definition:
            "A machine-facing name that keeps the same meaning across interface wording, files, and releases.",
        },
        {
          label: "Coordinate convention",
          definition:
            "The declared origin, units, axis direction, and bounds used to store geometry.",
        },
      ],
      tips: [
        {
          title: "Separate absent from invisible",
          body:
            "Give an out-of-frame landmark a distinct state and null geometry rather than storing a guessed point or zero coordinates.",
        },
        {
          title: "Round-trip one task of each kind",
          body:
            "Export and reimport a box, mask, keypoint, interval, and negative case before accepting the schema.",
        },
      ],
      paths: [
        {
          id: "specification-hosted",
          mode: "hosted",
          title: "Hosted interface schema",
          bestFor:
            "A standard task that fits a hosted platform's versioned configuration and export model.",
          approach:
            "Configure stable label IDs and geometry controls in a test project, then test native and derived exports with synthetic records.",
          tradeoff:
            "Configuration is fast, but unsupported null states, phase rules, or geometry may require a lossy workaround.",
          dataBoundary:
            "Develop with synthetic fixtures; upload study media only after the hosted boundary is approved.",
          network:
            "Requires network access to configure, preview, and export the project.",
          cost:
            "Allow for service seats, storage, and any paid review or automation features.",
          hardware:
            "Browser hardware is usually enough; long videos and dense masks depend on provider-side resources.",
          evidence:
            "Save the exported configuration, fixture, native export, reimport result, and documented losses.",
          sources: [
            {
              title: "Label Studio interface configuration",
              url: "https://labelstud.io/guide/setup.html",
            },
          ],
        },
        {
          id: "specification-managed",
          mode: "managed",
          title: "Managed annotation schema",
          bestFor:
            "A team needing standard image and video geometry with an institution-operated platform.",
          approach:
            "Map the protocol to managed task settings, reserve stable IDs outside display labels, and validate export formats against the native record.",
          tradeoff:
            "Central configuration supports consistency, but platform upgrades and format mappings need regression tests.",
          dataBoundary:
            "Fixtures and approved media remain within the managed service; derived exports leave only through review.",
          network:
            "Needs reliable internal access for task loading, autosave, and configuration changes.",
          cost:
            "Budget for service administration, storage, backup, and schema migration work.",
          hardware:
            "Server storage and CPU must sustain concurrent video seeking; optional inference may add GPU needs.",
          evidence:
            "Retain the schema version, role-tested project, format mapping, migration test, and round-trip report.",
          sources: [
            {
              title: "CVAT annotation formats",
              url: "https://docs.cvat.ai/docs/manual/advanced/formats/",
            },
          ],
        },
        {
          id: "specification-local",
          mode: "local",
          title: "Local open specification",
          bestFor:
            "Study-specific geometry, offline use, or a long-lived dataset that must not depend on one interface.",
          approach:
            "Store the ontology and validation rules in versioned YAML and JSON Schema, with a lossless native record and explicit derived mappings.",
          tradeoff:
            "The study controls every field, but must maintain validators, migrations, and user-facing error messages.",
          dataBoundary:
            "The specification and synthetic fixtures can travel; raw media remains on the approved local storage.",
          network:
            "Validation and round-trip tests run without network access.",
          cost:
            "No platform fee, but engineering and maintenance time are real study costs.",
          hardware:
            "Schema validation is lightweight; size geometry fixtures to expose large-mask and long-track limits.",
          evidence:
            "Commit the specification, validators, fixture hashes, passing round-trip tests, and declared lossy mappings.",
          sources: [
            {
              title: "frame-annotator audited source",
              url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Turn one approved protocol rule into a small record that another program can validate.",
        items: [
          {
            id: "specification-ids",
            label:
              "Assign stable IDs to the task, label, geometry, visibility states, and schema version.",
          },
          {
            id: "specification-coordinates",
            label:
              "Declare frame indexing, time units, coordinate origin, bounds, and null geometry.",
          },
          {
            id: "specification-roundtrip",
            label:
              "Export and reimport one positive, negative, occluded, and out-of-frame fixture.",
          },
        ],
        evidence:
          "A validating fixture and round-trip report that lists every preserved and deliberately lost field.",
      },
    },
    pilot: {
      why:
        "A convenient first sample hides rare phases, occlusion, poor image quality, device variation, and broken media that will later dominate corrections.",
      terms: [
        {
          label: "Stratum",
          definition:
            "A meaningful subgroup, such as site, procedure, device, phase, or image-quality level, sampled deliberately.",
        },
        {
          label: "Calibration set",
          definition:
            "A fixed practice sample used to align annotators before measured work begins.",
        },
      ],
      tips: [
        {
          title: "Sample at case level",
          body:
            "Select videos or cases first, then frames, so thousands of adjacent frames do not disguise a four-case pilot.",
        },
        {
          title: "Reserve failures on purpose",
          body:
            "Include corrupted video, severe blur, complete occlusion, scene exit, empty masks, and phase transitions in the pilot manifest.",
        },
      ],
      paths: [
        {
          id: "pilot-hosted",
          mode: "hosted",
          title: "Hosted distributed pilot",
          bestFor:
            "Approved multi-site calibration where experts need to annotate the same small sample remotely.",
          approach:
            "Upload a deterministic, minimum-size pilot after approval and assign the same blinded items to each annotator.",
          tradeoff:
            "Remote participation is simple, but upload approval, video transfer, latency, and provider availability affect the pilot.",
          dataBoundary:
            "Only approved pilot records move to the service; the full corpus and linkage key stay outside.",
          network:
            "Reliable upload and playback bandwidth are required, especially for surgical video.",
          cost:
            "Count seats, storage, egress, duplicate assignments, and expert calibration time.",
          hardware:
            "Annotators need browsers that decode the source codec smoothly; server resources handle storage and streaming.",
          evidence:
            "Keep the sampled-ID query, assignment log, playback failures, independent annotations, and protocol revisions.",
          sources: [
            {
              title: "CVAT task creation",
              url: "https://docs.cvat.ai/docs/manual/basics/create-annotation-task/",
            },
          ],
        },
        {
          id: "pilot-managed",
          mode: "managed",
          title: "Managed representative pilot",
          bestFor:
            "A team with an internal platform and enough corpus metadata to sample across sites, devices, and procedures.",
          approach:
            "Generate the pilot manifest inside the data boundary, assign calibration tasks centrally, and monitor decoding and autosave failures.",
          tradeoff:
            "Central control improves consistency, but a shared service can hide client, browser, and network differences.",
          dataBoundary:
            "Selection and annotation stay inside the managed environment; only aggregate coverage evidence leaves.",
          network:
            "Internal connectivity is required and should be tested from every annotator location.",
          cost:
            "Includes platform support, duplicate annotation, expert adjudication, and replacement of unusable records.",
          hardware:
            "Provision storage throughput and memory for concurrent seeking through long videos and dense geometry.",
          evidence:
            "Retain the sampling code, coverage table, task assignments, failure log, and calibration decisions.",
          sources: [],
        },
        {
          id: "pilot-local",
          mode: "local",
          title: "Local deterministic pilot",
          bestFor:
            "Offline studies, one-site calibration, or media too sensitive or large to transfer.",
          approach:
            "Select pseudonymous case IDs with a fixed script, copy the pilot to approved local storage, and complete manual calibration offline.",
          tradeoff:
            "Playback is predictable and private, but distributing identical fixtures and merging independent work takes care.",
          dataBoundary:
            "The pilot remains on named encrypted devices and returns through checksum-verified bundles.",
          network:
            "No network is required during annotation; controlled transfer is needed between annotators.",
          cost:
            "Low service cost, with time needed for secure copying, device preparation, and merge checks.",
          hardware:
            "Test the slowest intended workstation against the longest video, largest frame, and densest mask.",
          evidence:
            "Save the seed, script, manifest, checksums, machine profile, timing, and resulting protocol revision.",
          sources: [],
        },
      ],
      tryNow: {
        intro:
          "Build a small pilot that is deliberately less comfortable than the first convenient cases.",
        items: [
          {
            id: "pilot-strata",
            label:
              "List the sites, procedures, devices, phases, quality levels, and rare labels that need coverage.",
          },
          {
            id: "pilot-edge-cases",
            label:
              "Add occlusion, scene exit, negative cases, transitions, and one broken input.",
          },
          {
            id: "pilot-freeze",
            label:
              "Freeze the sampling query, pseudonymous IDs, and calibration subset before annotation.",
          },
        ],
        evidence:
          "A reproducible pilot manifest with a coverage table, source-case counts, missing strata, and fixture checksums.",
      },
    },
    "local-app": {
      why:
        "A complete manual core gives the study a usable fallback and exposes whether a custom interface really handles video seeking, geometry, saving, and recovery.",
      terms: [
        {
          label: "Atomic save",
          definition:
            "Writing a complete temporary file before replacing the old one so interruption cannot leave half a record.",
        },
        {
          label: "Recovery point",
          definition:
            "A known saved state to which work can return after a crash, refresh, or power loss.",
        },
      ],
      tips: [
        {
          title: "Test the awkward edit",
          body:
            "Move one keypoint outside the frame, split a phase interval, undo a polygon edit, and reload before judging the workflow complete.",
        },
        {
          title: "Block the network",
          body:
            "Run the manual workflow with network access disabled to expose remote fonts, scripts, telemetry, models, and authentication assumptions.",
        },
      ],
      paths: [
        {
          id: "local-app-hosted",
          mode: "hosted",
          title: "Configure a hosted tool",
          bestFor:
            "Standard image or video tasks where approved browser delivery matters more than bespoke interaction.",
          approach:
            "Configure native controls first, use synthetic fixtures to probe geometry and recovery, and build custom code only for a demonstrated gap.",
          tradeoff:
            "Setup can be quick, but network dependence, provider limits, and data transfer may make the workflow unsuitable.",
          dataBoundary:
            "Clinical media enters the provider boundary only with approval; synthetic fixtures support early development.",
          network:
            "Annotation, autosave, and media delivery depend on a stable connection.",
          cost:
            "Compare user, storage, transfer, support, and customisation fees with the cost of maintaining code.",
          hardware:
            "Clients need smooth video decoding; provider resources handle the application and storage.",
          evidence:
            "Record fixture results, missing task behaviour, save and recovery tests, data-flow approval, and an exit export.",
          sources: [
            {
              title: "Label Studio labelling configuration",
              url: "https://labelstud.io/guide/setup.html",
            },
          ],
        },
        {
          id: "local-app-managed",
          mode: "managed",
          title: "Adapt an institution-managed tool",
          bestFor:
            "Teams needing shared support and standard boxes, masks, keypoints, tracks, or review.",
          approach:
            "Extend a maintained internal platform through documented configuration or plugins and keep the native schema separate from study mappings.",
          tradeoff:
            "Operations and collaboration are shared, but upgrades and extension APIs constrain bespoke video or geometry behaviour.",
          dataBoundary:
            "Media and annotations stay in the managed environment; development fixtures may be synthetic.",
          network:
            "Internal network access is required unless the platform provides a tested disconnected client.",
          cost:
            "Include administrator effort, upgrades, plugin maintenance, storage, and support for annotators.",
          hardware:
            "The server must sustain concurrent video access; workstation requirements depend on rendering and codec support.",
          evidence:
            "Keep the gap analysis, configuration, extension tests, upgrade test, recovery result, and operator owner.",
          sources: [
            {
              title: "CVAT developer guide",
              url: "https://docs.cvat.ai/docs/contributing/development-environment/",
            },
          ],
        },
        {
          id: "local-app-local",
          mode: "local",
          title: "Build the offline manual core",
          bestFor:
            "Study-specific clip, timeline, mask, keypoint, visibility, or geometry workflows that must run without internet.",
          approach:
            "Adapt the audited prototypes behind a versioned specification, bind to loopback, package all assets, and add atomic save, backup, undo, and recovery.",
          tradeoff:
            "The study controls privacy and interaction, but owns testing, packaging, security updates, support, and migration.",
          dataBoundary:
            "Raw media and working annotations stay on the approved device; only reviewed exports move.",
          network:
            "The full manual workflow works with the network blocked and binds only to 127.0.0.1.",
          cost:
            "No seat fee, but engineering, domain review, maintenance, and user support must be budgeted.",
          hardware:
            "Use the lowest intended workstation to test codec decoding, timeline seeking, mask rendering, and disk writes.",
          evidence:
            "Retain the code commit, schema, installed-package test, blocked-network run, crash recovery log, and fixture hashes.",
          sources: [
            {
              title: "frame-annotator audited source",
              url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Prove one manual task from load to recovery before adding model code.",
        items: [
          {
            id: "local-app-fixture",
            label:
              "Load a synthetic case containing a box, keypoint, interval, visibility state, and negative frame.",
          },
          {
            id: "local-app-edit",
            label:
              "Draw, edit, undo, save, reload, and export each declared task type.",
          },
          {
            id: "local-app-recover",
            label:
              "Interrupt a save and restart with the network blocked, then inspect the recovered record.",
          },
        ],
        evidence:
          "A dated test run linked to the installed version, fixture checksum, screen recording, and recovered export.",
      },
    },
    "model-assist": {
      why:
        "Segmentation, tracking, keypoint, and phase suggestions can change both speed and judgement. They need a manual baseline, human actions, and complete provenance.",
      terms: [
        {
          label: "Suggestion",
          definition:
            "A model output shown for a person to accept, edit, or reject, not an annotation by itself.",
        },
        {
          label: "Correction burden",
          definition:
            "The time and effort needed to inspect and repair a suggestion until it meets the protocol.",
        },
      ],
      tips: [
        {
          title: "Time the whole decision",
          body:
            "Measure loading, prompting, inference, review, correction, and saving, then compare accepted quality with the frozen manual workflow.",
        },
        {
          title: "Keep failures visible",
          body:
            "Pilot blur, occlusion, blood, smoke, fast camera motion, tiny instruments, and scene exit rather than reporting only clean masks.",
        },
      ],
      paths: [
        {
          id: "model-assist-hosted",
          mode: "hosted",
          title: "Hosted inference service",
          bestFor:
            "Approved de-identified data and a short pilot where rapid access to capable hardware is valuable.",
          approach:
            "Send the minimum approved image or clip to a fixed model endpoint and return a visibly unaccepted suggestion with model metadata.",
          tradeoff:
            "Strong hardware is easy to access, but data disclosure, per-use cost, model change, latency, and service withdrawal remain risks.",
          dataBoundary:
            "Frames or clips leave the study environment only under explicit approval; prompts and returned geometry are also study data.",
          network:
            "Inference requires a reliable encrypted connection and a defined response to outage or timeout.",
          cost:
            "Track per-image, per-video, storage, and transfer charges alongside researcher review time.",
          hardware:
            "A modest client is sufficient because compute is remote; local decoding may still limit long-video use.",
          evidence:
            "Log endpoint, model version, request parameters, item checksum, latency, accept or edit or reject action, and correction time.",
          sources: [
            {
              title: "CVAT automatic annotation",
              url: "https://docs.cvat.ai/docs/api_sdk/sdk/auto-annotation/",
            },
          ],
        },
        {
          id: "model-assist-managed",
          mode: "managed",
          title: "Managed medical imaging service",
          bestFor:
            "Institutional imaging teams with approved GPU infrastructure and a maintained interactive inference service.",
          approach:
            "Run the model beside managed study storage, expose it through a reviewed adapter, and preserve a complete manual path.",
          tradeoff:
            "Data stays within the institution, but GPU scheduling, model operations, integration, and support create ongoing work.",
          dataBoundary:
            "Images, prompts, checkpoints, and suggestions remain in the managed research environment.",
          network:
            "Annotators need internal access to the service; the manual interface remains usable during inference outages.",
          cost:
            "Budget GPU time, storage, deployment support, monitoring, and model validation, not only inference seconds.",
          hardware:
            "Server GPU memory must match image size, video length, and model; client hardware handles visual review.",
          evidence:
            "Record checkpoint hash, code version, configuration, queue time, correction time, quality, failures, and operator.",
          sources: [
            {
              title: "MONAI Label",
              url: "https://github.com/Project-MONAI/MONAILabel",
            },
            {
              title: "3D Slicer documentation",
              url: "https://slicer.readthedocs.io/en/latest/",
            },
          ],
        },
        {
          id: "model-assist-local",
          mode: "local",
          title: "Local optional model adapter",
          bestFor:
            "Sensitive data, intermittent connectivity, or a reproducible study with a fixed local checkpoint.",
          approach:
            "Package a fixed adapter and checkpoint behind an on and off switch, with accept, edit, reject, and manual fallback.",
          tradeoff:
            "Privacy and version control are strong, but inference may be slower and local drivers, memory, and model files need support.",
          dataBoundary:
            "Media, prompts, checkpoints, suggestions, and decisions remain on the approved workstation.",
          network:
            "No network is needed after reviewed model files and dependencies are installed.",
          cost:
            "Count workstation or GPU purchase, energy, installation, maintenance, and correction time.",
          hardware:
            "Benchmark the lowest target CPU or GPU against representative 2D, 3D, and video workloads before committing.",
          evidence:
            "Keep environment lock, model and checkpoint hashes, hardware profile, timings, decisions, corrections, and manual comparison.",
          sources: [
            {
              title: "MONAI Label",
              url: "https://github.com/Project-MONAI/MONAILabel",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Evaluate one suggestion as a research intervention, not as a software demonstration.",
        items: [
          {
            id: "model-assist-baseline",
            label:
              "Freeze the protocol, calibration set, manual timing method, and accepted-quality measures.",
          },
          {
            id: "model-assist-actions",
            label:
              "Record one accepted, one edited, and one rejected geometry suggestion.",
          },
          {
            id: "model-assist-compare",
            label:
              "Compare total decision time and task-specific quality with the same manual cases.",
          },
        ],
        evidence:
          "A provenance table linking each suggestion to model, checkpoint, prompt, action, correction time, final geometry, and baseline.",
      },
    },
    "test-package": {
      why:
        "A tool that works only in its source checkout can lose templates, fail on another operating system, or corrupt annotations during interruption.",
      terms: [
        {
          label: "Clean install",
          definition:
            "Installing the built release into a new empty environment rather than running from the source folder.",
        },
        {
          label: "Regression fixture",
          definition:
            "A small fixed input and expected result used to catch behaviour that has changed unexpectedly.",
        },
      ],
      tips: [
        {
          title: "Exercise every geometry",
          body:
            "Test draw, edit, undo, save, reload, visibility, and export for boxes, masks, keypoints, tracks, and phase intervals.",
        },
        {
          title: "Test the release on modest hardware",
          body:
            "Use the slowest supported workstation and longest approved synthetic video, not only the developer's machine.",
        },
      ],
      paths: [
        {
          id: "test-package-hosted",
          mode: "hosted",
          title: "Hosted acceptance test",
          bestFor:
            "A browser service whose provider owns packaging but the study owns workflow acceptance.",
          approach:
            "Test a staging project with synthetic fixtures across supported browsers, roles, network conditions, export, and account closure.",
          tradeoff:
            "The provider handles release engineering, but platform changes can arrive outside the study's timetable.",
          dataBoundary:
            "Use synthetic fixtures in staging and approved de-identified media only for a separately authorised performance test.",
          network:
            "Test normal, slow, interrupted, and reconnected sessions, including partial video upload and autosave.",
          cost:
            "Allow for staging seats, duplicated storage, test automation, and repeated checks after provider updates.",
          hardware:
            "Cover the oldest supported client, browser, display size, and video-decoding capability.",
          evidence:
            "Archive the service version, browser matrix, role tests, network failures, export round-trip, and provider change record.",
          sources: [
            {
              title: "Label Studio labelling guide",
              url: "https://labelstud.io/guide/labeling/",
            },
          ],
        },
        {
          id: "test-package-managed",
          mode: "managed",
          title: "Managed staging release",
          bestFor:
            "An institution-operated service with separate staging and production environments.",
          approach:
            "Deploy the exact release candidate to staging, restore a synthetic backup, test all roles and task types, then promote the immutable build.",
          tradeoff:
            "Staging supports realistic assurance, but doubles some infrastructure and requires an accountable release process.",
          dataBoundary:
            "Synthetic or approved test records stay in staging; no production linkage key is copied there.",
          network:
            "Test internal routes, VPN access, session expiry, upload limits, and recovery after disconnection.",
          cost:
            "Budget staging capacity, operator time, browser automation, security checks, and restore drills.",
          hardware:
            "Staging should represent production CPU, memory, storage, and any GPU constraints closely enough to expose bottlenecks.",
          evidence:
            "Keep build digest, deployment record, test report, accessibility findings, restore result, and promotion approval.",
          sources: [
            {
              title: "CVAT testing guide",
              url: "https://docs.cvat.ai/docs/contributing/running-tests/",
            },
          ],
        },
        {
          id: "test-package-local",
          mode: "local",
          title: "Offline installed release",
          bestFor:
            "A local application distributed to controlled workstations without relying on a source checkout.",
          approach:
            "Build a signed or checksum-verified package, install it in an empty environment, block the network, and run recovery and round-trip fixtures.",
          tradeoff:
            "The release is reproducible and private, but installers, dependency support, and updates must cover each target system.",
          dataBoundary:
            "Only synthetic fixtures enter CI; approved clinical media remains on test devices under study controls.",
          network:
            "Core annotation, help, assets, save, and export work fully offline.",
          cost:
            "Include packaging, code signing where needed, platform testing, device support, and update distribution.",
          hardware:
            "Test each supported operating system and the minimum CPU, memory, storage, display, and codec profile.",
          evidence:
            "Retain package hash, dependency lock, clean-install log, blocked-network result, interruption test, and round-trip output.",
          sources: [
            {
              title: "frame-annotator audited source",
              url: "https://github.com/omariosc/frame-annotator/tree/3e94ed03c1487331b8c041ca755421686b41d031",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Test the artefact that an annotator will install or open, not the developer's working tree.",
        items: [
          {
            id: "test-package-clean",
            label:
              "Install or deploy the release candidate into a clean, production-like environment.",
          },
          {
            id: "test-package-workflow",
            label:
              "Run each manual task, role, autosave, reload, review, and export with synthetic fixtures.",
          },
          {
            id: "test-package-failure",
            label:
              "Interrupt the network or process, restore work, and reimport the resulting export elsewhere.",
          },
        ],
        evidence:
          "A release report tied to the build hash, environment, fixture hashes, failures, accessibility review, and retest status.",
      },
    },
    hosting: {
      why:
        "Changing a bind address does not create a safe team service. Shared annotation adds identity, roles, encrypted transport, audit, backup, and operational responsibility.",
      terms: [
        {
          label: "Loopback",
          definition:
            "A network address, such as 127.0.0.1, that makes a service available only on the same machine.",
        },
        {
          label: "Operational owner",
          definition:
            "The named person or team responsible for access, updates, backup, incidents, and shutdown.",
        },
      ],
      tips: [
        {
          title: "Test role boundaries",
          body:
            "Attempt annotation, review, user administration, raw-media download, and export as each role and save the denied as well as allowed results.",
        },
        {
          title: "Restore before inviting users",
          body:
            "Delete a synthetic project in staging and prove that annotations, revisions, identities, and audit events can be restored together.",
        },
      ],
      paths: [
        {
          id: "hosting-hosted",
          mode: "hosted",
          title: "Contracted hosted workspace",
          bestFor:
            "Approved distributed teams that can accept external processing and need rapid browser access.",
          approach:
            "Use a private tenant with federated identity where available, minimum roles, restricted export, declared region, and tested account closure.",
          tradeoff:
            "Operations are delegated, but control over change windows, logs, deletion proof, service continuity, and cost is reduced.",
          dataBoundary:
            "Approved media, annotations, user identities, and audit records sit within the contracted provider boundary.",
          network:
            "Every annotation session needs secure internet access; outage and provider exit procedures are required.",
          cost:
            "Count seats, storage, transfer, support tier, identity features, retention, and exit export.",
          hardware:
            "Users need suitable browsers and video decoding; the provider supplies application infrastructure.",
          evidence:
            "Retain contract controls, region, processor list, role matrix, access tests, deletion proof, incident route, and exit rehearsal.",
          sources: [
            {
              title: "Label Studio security guide",
              url: "https://labelstud.io/guide/security",
            },
          ],
        },
        {
          id: "hosting-managed",
          mode: "managed",
          title: "Institution-managed private service",
          bestFor:
            "A multi-user team whose institution can operate identity, TLS, storage, logging, backup, and patching.",
          approach:
            "Deploy an immutable release behind institutional authentication and a reverse proxy, with distinct annotator, reviewer, and administrator roles.",
          tradeoff:
            "Institutional control is strong, but the study needs capacity, security review, on-call ownership, upgrades, and recovery practice.",
          dataBoundary:
            "Media, annotations, identities, logs, and backups remain in named institution-managed systems.",
          network:
            "Restrict access to approved networks, VPN, or zero-trust routes and test session and upload limits.",
          cost:
            "Budget server, storage, backup, identity integration, monitoring, security review, and operator time.",
          hardware:
            "Size CPU, memory, storage throughput, and optional GPU against concurrent video seeking, masks, and review.",
          evidence:
            "Keep the threat model, build digest, role tests, TLS check, audit sample, monitoring alert, restore drill, and owner.",
          sources: [
            {
              title: "CVAT installation guide",
              url: "https://docs.cvat.ai/docs/administration/basics/installation/",
            },
          ],
        },
        {
          id: "hosting-local",
          mode: "local",
          title: "Local-only profile",
          bestFor:
            "One annotator, offline work, or the safest initial deployment while team controls remain unresolved.",
          approach:
            "Bind the production package to 127.0.0.1, disable debug mode, load no remote assets, and transfer reviewed exports through an approved route.",
          tradeoff:
            "The exposure surface is small, but concurrent review, central backup, remote access, and shared queues are unavailable.",
          dataBoundary:
            "Media, annotations, logs, and working backups remain on the named workstation.",
          network:
            "No network is needed; the service must not listen on external interfaces.",
          cost:
            "Uses a controlled workstation and local storage, with support and secure transfer handled by the study.",
          hardware:
            "The local device must sustain playback, geometry rendering, autosave, and backup without a server.",
          evidence:
            "Capture the listening address, debug setting, blocked-network run, remote-asset check, backup result, and device owner.",
          sources: [
            {
              title: "Flask deployment guidance",
              url: "https://flask.palletsprojects.com/en/stable/deploying/",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Choose the smallest deployment boundary that meets the approved collaboration need.",
        items: [
          {
            id: "hosting-boundary",
            label:
              "Draw where media, identities, annotations, logs, backups, and exports will reside.",
          },
          {
            id: "hosting-roles",
            label:
              "Test annotator, reviewer, and administrator permissions, including denied actions.",
          },
          {
            id: "hosting-restore",
            label:
              "Restore a deleted synthetic project and rehearse loss of network or provider access.",
          },
        ],
        evidence:
          "An approved deployment profile with data flow, role matrix, cost owner, threat model, restore record, and shutdown plan.",
      },
    },
    review: {
      why:
        "Independent annotations and source-level sampling reveal ambiguity and systematic error that a single overall agreement score can conceal.",
      terms: [
        {
          label: "Adjudication",
          definition:
            "A recorded reviewer decision that resolves a disagreement while preserving both original annotations.",
        },
        {
          label: "Cluster",
          definition:
            "Related observations, such as adjacent frames from one video, that should not be treated as independent.",
        },
      ],
      tips: [
        {
          title: "Queue task-specific differences",
          body:
            "Use declared thresholds for box overlap, keypoint distance, phase timing, mask overlap, and visibility rather than one generic disagreement flag.",
        },
        {
          title: "Blind before discussing",
          body:
            "Where practical, hide peer identity and model provenance during first review, then reveal them for documented adjudication.",
        },
      ],
      paths: [
        {
          id: "review-hosted",
          mode: "hosted",
          title: "Hosted review queue",
          bestFor:
            "Approved distributed review where browser assignment and rapid adjudication matter.",
          approach:
            "Assign a predeclared case-level sample to independent annotators, lock originals, and route thresholded differences to named reviewers.",
          tradeoff:
            "Remote review is efficient, but platform permissions, data transfer, and export fidelity must preserve independence and history.",
          dataBoundary:
            "The service holds source media, both originals, reviewer identities, decisions, notes, and audit history.",
          network:
            "Continuous access is needed for blinded assignment, comparison, and adjudication.",
          cost:
            "Count duplicate annotation, reviewer seats, storage, adjudication time, and full-history export.",
          hardware:
            "Reviewer devices need accurate displays and smooth synchronised video and geometry rendering.",
          evidence:
            "Export assignments, originals, thresholds, queued differences, decisions, reasons, revisions, and audit events.",
          sources: [
            {
              title: "Label Studio annotation quality",
              url: "https://labelstud.io/guide/quality",
            },
          ],
        },
        {
          id: "review-managed",
          mode: "managed",
          title: "Managed blinded review",
          bestFor:
            "A team requiring central roles, source-level sampling, and controlled access to identifiable media.",
          approach:
            "Generate the review sample inside the boundary, separate annotator and reviewer roles, and keep originals immutable.",
          tradeoff:
            "Central governance supports audit, but workflow configuration and reviewer capacity can become bottlenecks.",
          dataBoundary:
            "Media, independent records, identity mapping, disagreement queue, and adjudication remain in the managed service.",
          network:
            "Internal connectivity is required; offline reviewer work needs a controlled bundle and merge plan.",
          cost:
            "Budget duplicate labelling, adjudicator time, service operation, metric code, and protocol revision.",
          hardware:
            "Server and clients must compare dense masks, keypoints, and synchronised video without dropping detail.",
          evidence:
            "Keep the sampling unit, random seed, role tests, original revisions, decisions, protocol links, and cluster-aware analysis.",
          sources: [
            {
              title: "CVAT quality control",
              url: "https://docs.cvat.ai/docs/manual/advanced/analytics-and-monitoring/",
            },
          ],
        },
        {
          id: "review-local",
          mode: "local",
          title: "Local exchange and adjudication",
          bestFor:
            "Small offline teams that can exchange encrypted, checksum-verified annotation bundles.",
          approach:
            "Give each annotator an identical manifest, merge immutable originals by stable ID, and adjudicate in a separate local view.",
          tradeoff:
            "The method is private and portable, but assignment, version conflicts, identity separation, and merge checks are manual responsibilities.",
          dataBoundary:
            "Media stays on approved devices; only encrypted annotation bundles and approved reference crops move.",
          network:
            "No live network is needed, but controlled transfer and receipt confirmation are required.",
          cost:
            "Low platform cost, with staff time for bundle preparation, merge verification, and adjudication.",
          hardware:
            "Each reviewer workstation must render the native resolution and geometry consistently.",
          evidence:
            "Retain bundle hashes, assignment manifests, both originals, merge report, decisions, reasons, and reviewer identity.",
          sources: [],
        },
      ],
      tryNow: {
        intro:
          "Create one disagreement without overwriting either person's work.",
        items: [
          {
            id: "review-sample",
            label:
              "Select a predeclared case-level sample and assign it independently with pseudonymous annotator IDs.",
          },
          {
            id: "review-thresholds",
            label:
              "Apply separate thresholds for geometry, phase boundaries, visibility, and classification.",
          },
          {
            id: "review-adjudicate",
            label:
              "Record the reviewer, decision, reason, protocol link, and new revision while preserving both originals.",
          },
        ],
        evidence:
          "A disagreement record with source case, both original IDs, metric and threshold, adjudication, revision, and audit history.",
      },
    },
    "export-evaluate": {
      why:
        "A lossless native record protects provenance, while derived formats and evaluations answer different downstream questions and may discard information.",
      terms: [
        {
          label: "Native export",
          definition:
            "The study's complete record of annotations, revisions, suggestions, reviews, and provenance.",
        },
        {
          label: "Derived format",
          definition:
            "A task-specific output, such as YOLO or mask files, created from the native record and allowed to omit declared fields.",
        },
      ],
      tips: [
        {
          title: "Reimport before release",
          body:
            "Load the native export on a second machine and compare IDs, geometry, null states, revisions, reviews, and checksums field by field.",
        },
        {
          title: "Report the real sampling unit",
          body:
            "Estimate uncertainty at case or video level and account for repeated annotators instead of treating every adjacent frame as independent.",
        },
      ],
      paths: [
        {
          id: "export-evaluate-hosted",
          mode: "hosted",
          title: "Hosted export and exit",
          bestFor:
            "A hosted workflow that can provide complete records through a documented, tested exit route.",
          approach:
            "Export the provider-native history first, then create declared research formats in a controlled environment and test account closure.",
          tradeoff:
            "Exports are convenient, but provider formats, API limits, egress cost, and missing audit fields can weaken reproducibility.",
          dataBoundary:
            "Native records and media leave the provider through an approved destination; downloaded copies inherit study controls.",
          network:
            "Large video, mask, and history exports need reliable bandwidth, resumable transfer, and checksum verification.",
          cost:
            "Include egress, API, storage, retention, conversion, and staff validation costs.",
          hardware:
            "A local or managed machine needs enough storage and memory to validate and convert the full export.",
          evidence:
            "Keep export request, service version, file inventory, checksums, reimport result, omissions, cost, and deletion confirmation.",
          sources: [
            {
              title: "Label Studio export documentation",
              url: "https://labelstud.io/guide/export",
            },
          ],
        },
        {
          id: "export-evaluate-managed",
          mode: "managed",
          title: "Managed research release",
          bestFor:
            "Teams needing a governed central snapshot, cluster-aware analysis, and controlled downstream access.",
          approach:
            "Freeze an immutable native snapshot, generate task-specific derivatives by script, and publish a metadata and checksum package.",
          tradeoff:
            "Central release controls improve traceability, but storage, access decisions, and reproducible conversion pipelines need ownership.",
          dataBoundary:
            "The master snapshot remains managed; approved derivatives move to named analysis or repository locations.",
          network:
            "Internal transfer supports snapshot creation; external release uses an approved, checksum-verified route.",
          cost:
            "Budget archival storage, conversion compute, curation, access review, and long-term maintenance.",
          hardware:
            "Provide storage and CPU for masks and video-scale conversions; evaluation may need GPU only for declared model metrics.",
          evidence:
            "Archive native snapshot ID, conversion commit, environment, label map, split manifest, checksums, metrics, uncertainty, and access terms.",
          sources: [
            {
              title: "RO-Crate specification",
              url: "https://www.researchobject.org/ro-crate/specification.html",
            },
          ],
        },
        {
          id: "export-evaluate-local",
          mode: "local",
          title: "Local deterministic export",
          bestFor:
            "Offline projects that need portable, inspectable releases without a continuing platform dependency.",
          approach:
            "Run a versioned command that writes the complete native record, derivatives, label maps, splits, provenance, and checksums to a fresh directory.",
          tradeoff:
            "The release is transparent and portable, but the study owns storage, format maintenance, validation, and secure distribution.",
          dataBoundary:
            "Exports are created on the approved workstation and only reviewed packages cross the boundary.",
          network:
            "Creation and validation run offline; deposit or transfer happens as a separate approved step.",
          cost:
            "Low service cost, with researcher time for conversion, validation, documentation, and archive preparation.",
          hardware:
            "Local storage must hold the source snapshot, working conversion, final package, and verification copy.",
          evidence:
            "Retain the command, code commit, environment lock, manifest, checksums, reimport comparison, declared losses, and cluster-aware report.",
          sources: [
            {
              title: "W3C PROV-O",
              url: "https://www.w3.org/TR/prov-o/",
            },
            {
              title: "RO-Crate specification",
              url: "https://www.researchobject.org/ro-crate/specification.html",
            },
          ],
        },
      ],
      tryNow: {
        intro:
          "Release one reviewed case in a way that can be verified without the annotation interface.",
        items: [
          {
            id: "export-evaluate-native",
            label:
              "Create the lossless native snapshot with originals, revisions, suggestions, reviews, and provenance.",
          },
          {
            id: "export-evaluate-derived",
            label:
              "Generate one derived geometry format and list every field it cannot preserve.",
          },
          {
            id: "export-evaluate-reproduce",
            label:
              "Reimport on a second machine, verify checksums, and reproduce one case-level or video-level result.",
          },
        ],
        evidence:
          "A release manifest linking native and derived IDs, conversion version, checksums, reimport result, losses, metric, and uncertainty.",
      },
    },
  },
};
