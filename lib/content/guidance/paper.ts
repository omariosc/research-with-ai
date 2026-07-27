import type { Source, WorkshopGuidance } from "@/lib/types";

const schemaSource: Source = {
  title: "Schema.org ScholarlyArticle",
  url: "https://schema.org/ScholarlyArticle",
};

const crossrefSource: Source = {
  title: "Crossref REST API",
  url: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/",
};

const dataCiteSource: Source = {
  title: "DataCite Metadata Schema",
  url: "https://schema.datacite.org/",
};

const creativeCommonsSource: Source = {
  title: "Creative Commons FAQ",
  url: "https://creativecommons.org/faq/",
};

const githubLicensingSource: Source = {
  title: "GitHub repository licensing guidance",
  url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository",
};

const paper2AllSource: Source = {
  title: "Paper2All repository",
  url: "https://github.com/YuhangChen1/Paper2All",
  note: "Use as a comparison for paper conversion, not as the only route or as authority for scientific and rights decisions.",
};

const paper2WebSource: Source = {
  title: "Paper2Web",
  url: "https://aclanthology.org/2026.acl-demo.57/",
  note: "Use the reported homepage counts as a scoped discoverability benchmark for selected major AI conferences, not as an estimate for all fields.",
};

const quartoSource: Source = {
  title: "Quarto website documentation",
  url: "https://quarto.org/docs/websites/",
};

const wcagSource: Source = {
  title: "Web Content Accessibility Guidelines 2.2",
  url: "https://www.w3.org/TR/WCAG22/",
};

const w3cImagesSource: Source = {
  title: "W3C Images Tutorial",
  url: "https://www.w3.org/WAI/tutorials/images/",
};

const w3cToolsSource: Source = {
  title: "W3C validators and tools",
  url: "https://www.w3.org/developers/tools/",
};

const owaspPromptSource: Source = {
  title: "OWASP prompt injection prevention",
  url: "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html",
};

const githubReleaseSource: Source = {
  title: "GitHub immutable releases",
  url: "https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases",
};

const cloudflarePagesSource: Source = {
  title: "Cloudflare Pages documentation",
  url: "https://developers.cloudflare.com/pages/",
};

const w3cTranscriptSource: Source = {
  title: "W3C transcript guidance",
  url: "https://www.w3.org/WAI/media/av/transcripts/",
};

const w3cMediaSource: Source = {
  title: "W3C audio and video guidance",
  url: "https://www.w3.org/WAI/media/av/",
};

export const paperGuidance: WorkshopGuidance = {
  lastVerified: "2026-07-27",
  phases: [
    {
      id: "scope",
      title: "Set the purpose and evidence boundary",
      summary:
        "Decide who the site serves, then freeze the exact research objects it may use.",
      stepIds: ["brief", "sources"],
    },
    {
      id: "clear",
      title: "Clear rights and claims",
      summary:
        "Separate permission from citation and distinguish reported, reproduced, and inferred claims.",
      stepIds: ["rights", "claims"],
    },
    {
      id: "shape",
      title: "Shape the reader experience",
      summary:
        "Turn approved evidence into a page sequence and accessible media plan.",
      stepIds: ["architecture", "media"],
    },
    {
      id: "prove",
      title: "Build and test",
      summary:
        "Implement only checked material, prove any demo, and test the whole reader journey.",
      stepIds: ["demo", "validate"],
    },
    {
      id: "publish",
      title: "Release and explain",
      summary:
        "Publish reviewed bytes, preserve rollback evidence, and record a faithful walkthrough.",
      stepIds: ["deploy", "video"],
    },
  ],
  routes: [
    {
      id: "orientation",
      title: "Orientation",
      description:
        "Learn the three decisions that control purpose, public wording, and release integrity.",
      bestFor: "A first pass before committing to a full build.",
      stepIds: ["brief", "claims", "deploy"],
    },
    {
      id: "fast-public-companion",
      title: "Fast public companion",
      description:
        "Publish a concise, evidence-linked page for a public paper without a runnable demo or reused figures.",
      bestFor: "A paper, abstract, or project update with clear public sources.",
      stepIds: [
        "brief",
        "sources",
        "rights",
        "claims",
        "architecture",
        "validate",
        "deploy",
        "video",
      ],
    },
    {
      id: "figure-rich-paper",
      title: "Figure-rich paper",
      description:
        "Add rights-cleared figures and semantic tables with captions, alternatives, and source links.",
      bestFor: "A visual method or results paper where media carries important evidence.",
      stepIds: [
        "brief",
        "sources",
        "rights",
        "claims",
        "architecture",
        "media",
        "validate",
        "deploy",
        "video",
      ],
    },
    {
      id: "reproducible-demo",
      title: "Reproducible demo",
      description:
        "Build the full companion, including a bounded demo whose inputs, command, output, failure state, and fallback are recorded.",
      bestFor: "A public repository and dataset with a small, safe example.",
      stepIds: [
        "brief",
        "sources",
        "rights",
        "claims",
        "architecture",
        "media",
        "demo",
        "validate",
        "deploy",
        "video",
      ],
    },
  ],
  steps: {
    brief: {
      why:
        "A polished site can still answer no useful question. The brief fixes the reader, their task, the scientific emphasis, and what remains out of scope.",
      terms: [
        {
          label: "Reader task",
          definition:
            "The specific thing the main visitor should be able to understand, verify, download, or reproduce.",
        },
        {
          label: "Non-goal",
          definition:
            "Something the website deliberately will not claim, explain, collect, or provide.",
        },
      ],
      tips: [
        {
          title: "Write the acceptance test first",
          body:
            "Ask a colleague who has not read the paper to identify the audience, takeaway, action, and boundary from the brief alone.",
        },
        {
          title: "Choose one primary reader",
          body:
            "If clinicians, engineers, and reviewers need different things, serve one first and give the others clear secondary routes.",
        },
      ],
      paths: [
        {
          id: "brief-hosted",
          mode: "hosted",
          title: "Hosted structured interview",
          bestFor: "A public paper and a quick first brief.",
          approach:
            "Share only public citation details and ask a hosted assistant to question you one decision at a time. Keep the final wording in your own file.",
          tradeoff:
            "Setup is quick, but the service may smooth over specialist priorities and its behaviour can change.",
          dataBoundary:
            "Only public metadata and text cleared for that service leave the device. Keep unpublished notes, identifiers, and credentials out.",
          network: "Continuous internet access is required.",
          cost:
            "Usually a subscription or usage charge. Set a limit on interview rounds.",
          hardware: "A current browser on an ordinary laptop is sufficient.",
          evidence:
            "Save the dated input list, final brief, unresolved questions, and named human approval.",
          sources: [schemaSource],
        },
        {
          id: "brief-managed",
          mode: "managed",
          title: "Approved team workspace",
          bestFor: "A group that needs review history and institutional controls.",
          approach:
            "Draft the brief in an approved document or assistant workspace, assign a reviewer, and resolve comments before design begins.",
          tradeoff:
            "Governance and collaboration are clearer, but access setup and team licensing take time.",
          dataBoundary:
            "Move only material permitted by the workspace agreement. Record tenant, retention, sharing, and export rules.",
          network: "Institutional network or approved cloud access is required.",
          cost:
            "Usually covered by a team or institutional licence. Confirm seat and storage costs.",
          hardware: "A browser or managed workstation; no specialist compute.",
          evidence:
            "Export the reviewed brief with version history, reviewer, open questions, and approval date.",
          sources: [],
        },
        {
          id: "brief-local",
          mode: "local",
          title: "Local Markdown brief",
          bestFor: "Restricted planning notes or offline work.",
          approach:
            "Answer the intake directly in a local Markdown file. A local model is optional and should not replace the reader test.",
          tradeoff:
            "Data control is strongest, but the researcher carries more of the questioning and editing work.",
          dataBoundary:
            "Project content stays on the machine. Remove private notes before any later publication.",
          network: "No network is needed after approved tools are installed.",
          cost: "No usage charge; budget researcher time and local storage.",
          hardware:
            "An ordinary laptop. More memory is needed only if a local model is chosen.",
          evidence:
            "Commit or hash `website_brief.md` and record the human reviewer.",
          sources: [],
        },
      ],
      tryNow: {
        intro: "Turn a broad website idea into a testable brief.",
        items: [
          {
            id: "brief-reader",
            label: "Name one primary reader and one task they must complete.",
          },
          {
            id: "brief-takeaway",
            label: "Write a 25-word takeaway using no unsupported claim.",
          },
          {
            id: "brief-boundary",
            label: "Add one primary action and two explicit non-goals.",
          },
        ],
        evidence:
          "Keep a one-page brief that a fresh reader can interpret without seeing the paper.",
      },
    },
    sources: {
      why:
        "A website assembled from moving links and unnamed files cannot support reliable claims. A source manifest fixes which bytes and versions were actually used.",
      terms: [
        {
          label: "Source manifest",
          definition:
            "A table linking each paper, repository, dataset, and asset to its exact version and handling rule.",
        },
        {
          label: "Checksum",
          definition:
            "A value calculated from file bytes, such as SHA-256, that reveals whether the file changed.",
        },
      ],
      tips: [
        {
          title: "Prefer immutable locators",
          body:
            "Record a DOI version, repository commit, release tag, or checksum rather than relying on a mutable landing page.",
        },
        {
          title: "Separate access from permission",
          body:
            "A file can be public to read while still being restricted for reuse or external processing.",
        },
      ],
      paths: [
        {
          id: "sources-hosted",
          mode: "hosted",
          title: "Public metadata extraction",
          bestFor: "Public papers, datasets, and repositories with stable identifiers.",
          approach:
            "Give a hosted assistant DOI and canonical URLs, ask for a draft manifest, then open every primary record and correct it yourself.",
          tradeoff:
            "Metadata collection is fast, but versions, supplements, and licence fields can be missed or merged.",
          dataBoundary:
            "Only public identifiers and approved public files leave the device. Do not send private folders or signed links.",
          network: "Internet access is required for retrieval and verification.",
          cost:
            "Low usage cost for text extraction, plus researcher time for primary checks.",
          hardware: "A browser and enough local storage for the selected files.",
          evidence:
            "Keep the manifest, retrieval date, opened source URLs, corrections, and available checksums.",
          sources: [crossrefSource, dataCiteSource],
        },
        {
          id: "sources-managed",
          mode: "managed",
          title: "Versioned project inventory",
          bestFor: "Teams with shared files, repositories, and review responsibilities.",
          approach:
            "Create the manifest in an approved project workspace, link each row to a controlled copy, and assign unresolved entries to named owners.",
          tradeoff:
            "Shared review is easier, but duplicate storage and workspace retention need active management.",
          dataBoundary:
            "Files move only into the approved project store. Mark each row public, internal, restricted, or blocked.",
          network: "Approved workspace access is required; retrieval may use public networks.",
          cost:
            "Institutional storage and workspace charges may apply, especially for large media.",
          hardware:
            "A managed workstation with storage sufficient for checked local copies.",
          evidence:
            "Export a dated manifest with file IDs, owners, versions, sensitivity, and resolution status.",
          sources: [dataCiteSource],
        },
        {
          id: "sources-local",
          mode: "local",
          title: "Local manifest and hashes",
          bestFor: "Offline work or sources that must stay on controlled storage.",
          approach:
            "Inventory files in CSV or Markdown, calculate checksums locally, and record DOI, commit, path, sensitivity, and reuse status.",
          tradeoff:
            "The process is transparent and portable, but metadata entry and duplicate detection are more manual.",
          dataBoundary:
            "Files remain on the approved machine or mounted store; only later approved outputs are published.",
          network:
            "Optional for DOI checks. Hashing and inventory work can run offline.",
          cost: "No service charge; allow time for storage and manual review.",
          hardware:
            "An ordinary computer, with additional disk space for large figures or supplements.",
          evidence:
            "Keep the manifest beside a checksum file and record which primary pages a person opened.",
          sources: [],
        },
      ],
      tryNow: {
        intro: "Freeze three representative research objects.",
        items: [
          {
            id: "sources-identify",
            label: "Select one paper version, one repository commit, and one asset.",
          },
          {
            id: "sources-record",
            label: "Record stable ID, locator, retrieval date, sensitivity, and access rule.",
          },
          {
            id: "sources-hash",
            label: "Calculate a SHA-256 checksum, or state why no local file exists.",
          },
        ],
        evidence:
          "Keep three complete manifest rows that another researcher can resolve to the same versions.",
      },
    },
    rights: {
      why:
        "Citation identifies a source but does not grant permission to republish it. Rights must be decided asset by asset before extraction or design.",
      terms: [
        {
          label: "Rights holder",
          definition:
            "The person or organisation entitled to grant or withhold permission for a work.",
        },
        {
          label: "Attribution",
          definition:
            "The credit, source link, licence notice, and change statement required when material is reused.",
        },
      ],
      tips: [
        {
          title: "Split the licence layers",
          body:
            "Check paper content, code, data, fonts, and generated media separately. One open licence does not cover the others.",
        },
        {
          title: "Make uncertainty a blocking state",
          body:
            "If permission cannot be evidenced, omit the asset, link to it, request permission, or create a clearly independent replacement.",
        },
      ],
      paths: [
        {
          id: "rights-hosted",
          mode: "hosted",
          title: "Hosted rights inventory",
          bestFor: "Public assets with visible licence pages.",
          approach:
            "Ask a hosted assistant to draft ledger rows from public licence text, then have a person open the licence and decide each proposed use.",
          tradeoff:
            "The first pass is quick, but licence summaries can miss jurisdiction, version, attribution, or modification conditions.",
          dataBoundary:
            "Send only public asset references and licence text. Do not upload restricted originals for a rights guess.",
          network: "Internet access is required to inspect current licence records.",
          cost:
            "Usually a small usage charge, with most effort spent on human rights review.",
          hardware: "A browser and a local copy of any asset under review.",
          evidence:
            "Save the exact licence URL, version, rights holder, intended use, attribution, and named decision maker.",
          sources: [creativeCommonsSource],
        },
        {
          id: "rights-managed",
          mode: "managed",
          title: "Managed approval register",
          bestFor: "Many assets or a team that needs formal approval.",
          approach:
            "Track each asset in an approved register with owner, licence, intended use, reviewer, status, and replacement path.",
          tradeoff:
            "The audit trail is strong, but legal or communications review can slow publication.",
          dataBoundary:
            "Store restricted evidence only in the authorised register and publish only cleared assets and required notices.",
          network: "Approved workspace access is required.",
          cost:
            "Workspace costs are usually fixed; specialist rights advice may add cost.",
          hardware: "A managed workstation; no specialist compute.",
          evidence:
            "Export the approved rights ledger and retain permission correspondence where applicable.",
          sources: [creativeCommonsSource, githubLicensingSource],
        },
        {
          id: "rights-local",
          mode: "local",
          title: "Local RIGHTS.md review",
          bestFor: "A small site with a few well-defined assets.",
          approach:
            "Open each primary licence, write one row in `RIGHTS.md`, and keep blocked items outside the public assets directory.",
          tradeoff:
            "The decision remains visible in the repository, but the researcher must maintain it when an asset changes.",
          dataBoundary:
            "Source files stay local. Only cleared derivatives and their attribution move into the site.",
          network:
            "Needed to confirm public licence pages, then the ledger can be maintained offline.",
          cost: "No tooling charge; budget time for careful human review.",
          hardware: "Any laptop capable of inspecting the original asset.",
          evidence:
            "Commit the ledger, licence locator, attribution text, and blocked or replacement decision.",
          sources: [creativeCommonsSource],
        },
      ],
      tryNow: {
        intro: "Make a real publication decision for one figure.",
        items: [
          {
            id: "rights-holder",
            label: "Identify the figure's rights holder and exact licence evidence.",
          },
          {
            id: "rights-use",
            label: "Check web republication, modification, and attribution requirements.",
          },
          {
            id: "rights-decide",
            label: "Write the approved attribution or mark the asset blocked and choose a replacement.",
          },
        ],
        evidence:
          "Keep one complete rights-ledger row with a named human decision and primary licence locator.",
      },
    },
    claims: {
      why:
        "Readers need to know whether a statement comes from the paper, a documented run, an author, or your interpretation. The verb and evidence must match.",
      terms: [
        {
          label: "Claim state",
          definition:
            "The declared origin of a statement, such as paper-reported, reproduced, author statement, or inference.",
        },
        {
          label: "Source locator",
          definition:
            "The exact page, section, table cell, figure, code line, or run record supporting a claim.",
        },
      ],
      tips: [
        {
          title: "Keep the reporting verb",
          body:
            "Use 'the paper reports' until a documented run supports 'we reproduced'. Do not let a summary remove the attribution.",
        },
        {
          title: "Carry the conditions",
          body:
            "Keep the dataset split, sample count, metric, units, uncertainty, comparison, and limitation beside every headline value.",
        },
      ],
      paths: [
        {
          id: "claims-hosted",
          mode: "hosted",
          title: "Hosted claim extraction",
          bestFor: "A public paper with searchable text and a modest claim set.",
          approach:
            "Ask for a draft table using only supplied public sources, require exact locators, and return NOT FOUND instead of filling gaps.",
          tradeoff:
            "Extraction is fast, but conditions can be dropped and separate results can be merged.",
          dataBoundary:
            "Only public, rights-cleared text moves to the service. Keep confidential reviews and unreleased results out.",
          network: "Continuous internet access is required.",
          cost:
            "Usage grows with document length and revisions. Set a bounded claim list.",
          hardware: "A browser; document conversion may also need local storage.",
          evidence:
            "Retain the draft, each human-opened primary locator, corrections, and final wording class.",
          sources: [],
        },
        {
          id: "claims-managed",
          mode: "managed",
          title: "Reviewed claim register",
          bestFor: "A team publishing several results or translations.",
          approach:
            "Maintain claim IDs in an approved table, link each to controlled sources, and require reviewer sign-off before the claim enters the site.",
          tradeoff:
            "Parallel review is easier, but status ownership and stale approvals must be managed.",
          dataBoundary:
            "Move only authorised sources into the workspace and keep unpublished claim rows access-controlled.",
          network: "Approved project access is required.",
          cost:
            "Usually an institutional licence plus researcher and reviewer time.",
          hardware: "A managed browser or workstation; no specialist compute.",
          evidence:
            "Export claim ID, wording, state, locator, conditions, reviewer, decision, and date.",
          sources: [],
        },
        {
          id: "claims-local",
          mode: "local",
          title: "Local claim-evidence table",
          bestFor: "A small claim set or restricted draft results.",
          approach:
            "Compare paper, code, and run records directly in a local table. Use scripts only for calculations that can be independently checked.",
          tradeoff:
            "Source control and privacy are strong, but manual linking takes longer.",
          dataBoundary:
            "All draft claims and restricted results remain local until approved rows are selected for publication.",
          network: "Optional for opening public sources; comparison can run offline.",
          cost: "No usage fee; budget careful reading and independent checking.",
          hardware:
            "An ordinary laptop, or the hardware already required for a genuine reproduction.",
          evidence:
            "Commit the reviewed claim table and link calculated claims to exact run outputs and code.",
          sources: [],
        },
      ],
      tryNow: {
        intro: "Classify three statements before writing website copy.",
        items: [
          {
            id: "claims-classify",
            label: "Choose one paper-reported result, one checked calculation, and one inference.",
          },
          {
            id: "claims-locate",
            label: "Attach an exact locator and full numeric conditions to each statement.",
          },
          {
            id: "claims-rewrite",
            label: "Rewrite or block any statement whose verb exceeds its evidence.",
          },
        ],
        evidence:
          "Keep three reviewed claim rows whose wording, state, conditions, and locator agree.",
      },
    },
    architecture: {
      why:
        "A paper is organised for scholarly reading, not necessarily for quick verification online. The site needs a route through the evidence rather than a page-by-page copy.",
      terms: [
        {
          label: "Information architecture",
          definition:
            "The planned order, labels, and relationships that help readers find and understand content.",
        },
        {
          label: "Progressive disclosure",
          definition:
            "Showing the essential explanation first while keeping detailed evidence available on demand.",
        },
      ],
      tips: [
        {
          title: "Start with reader questions",
          body:
            "Name the question each section answers before choosing a layout. Remove sections that serve no declared task.",
        },
        {
          title: "Budget every section",
          body:
            "Give each section approved claim IDs, assets, an interaction, a word budget, and an accessible fallback.",
        },
      ],
      paths: [
        {
          id: "architecture-hosted",
          mode: "hosted",
          title: "Hosted structure draft",
          bestFor: "A concise public companion with simple navigation.",
          approach:
            "Provide the approved brief and claim IDs, ask for a section plan, then reject any section or emphasis not supported by those records.",
          tradeoff:
            "A usable first sequence appears quickly, but generated layouts can favour generic marketing patterns.",
          dataBoundary:
            "Only approved public claims and asset descriptions leave the device. Keep blocked content out of the prompt.",
          network: "Internet access is required.",
          cost: "A small usage or subscription cost; design revisions add usage.",
          hardware: "A browser and an ordinary laptop.",
          evidence:
            "Save the proposed sequence, rejected additions, final reader questions, and mapped claim IDs.",
          sources: [schemaSource],
        },
        {
          id: "architecture-managed",
          mode: "managed",
          title: "Managed paper conversion comparison",
          bestFor: "A team comparing automatic conversion with a reviewed site map.",
          approach:
            "Compare a generated result such as Paper2All with your own source, rights, and claim manifests. Keep only sections that pass the human evidence gate.",
          tradeoff:
            "Comparison exposes useful patterns, but generated structure is not proof of rights, accuracy, or completeness.",
          dataBoundary:
            "Use public papers unless the managed service is explicitly approved for restricted documents.",
          network: "Network access is required for the conversion workspace.",
          cost:
            "Service or compute charges may apply, plus time to review every generated section.",
          hardware:
            "A browser for hosted conversion; larger local comparison runs may need a capable workstation.",
          evidence:
            "Keep the comparison output, accepted and rejected sections, source links, and final site map.",
          sources: [paper2AllSource, paper2WebSource],
        },
        {
          id: "architecture-local",
          mode: "local",
          title: "Local static site map",
          bestFor: "A transparent, portable companion built from Markdown and static files.",
          approach:
            "Draft the sequence in Markdown or Quarto, link each section to approved claim and asset IDs, and preview the navigation locally.",
          tradeoff:
            "Control and portability are high, but layout and content decisions remain manual.",
          dataBoundary:
            "Draft content stays local. Only approved pages and public assets enter the rendered output.",
          network:
            "Not required for authoring or preview after tooling is installed.",
          cost: "No usage charge; budget authoring and review time.",
          hardware: "An ordinary laptop can render a static research site.",
          evidence:
            "Commit the site map, source-to-section links, navigation preview, and removed sections.",
          sources: [quartoSource],
        },
      ],
      tryNow: {
        intro: "Turn approved evidence into a short reader route.",
        items: [
          {
            id: "architecture-questions",
            label: "Write one reader question for overview, result, limitation, and reproduction sections.",
          },
          {
            id: "architecture-map",
            label: "Map approved claim and asset IDs to each section.",
          },
          {
            id: "architecture-remove",
            label: "Remove one section that has no reader task or evidence.",
          },
        ],
        evidence:
          "Keep a page sequence in which every section has a question, evidence IDs, word budget, and fallback.",
      },
    },
    media: {
      why:
        "Figures and tables carry evidence that a caption alone may not convey. The website must preserve meaning, rights, source links, and alternatives for different readers.",
      terms: [
        {
          label: "Alt text",
          definition:
            "A concise alternative that communicates an image's purpose or essential information.",
        },
        {
          label: "Long description",
          definition:
            "A fuller explanation of a complex visual's structure, relationships, and relevant values.",
        },
      ],
      tips: [
        {
          title: "Give each text form one job",
          body:
            "The caption identifies and interprets, alt text gives the concise equivalent, and a long description handles complex visual detail.",
        },
        {
          title: "Keep tables semantic",
          body:
            "Publish data tables as HTML with headers and captions rather than as screenshots. Link them to the same checked values.",
        },
      ],
      paths: [
        {
          id: "media-hosted",
          mode: "hosted",
          title: "Hosted description draft",
          bestFor: "Rights-cleared public figures needing a first description.",
          approach:
            "Upload only a cleared figure, request caption, alt text, and long-description drafts separately, then verify every label and relationship manually.",
          tradeoff:
            "Drafting is quick, but vision systems can miss symbols, transpose labels, or invent relationships.",
          dataBoundary:
            "Only public, cleared assets leave the device. Never upload restricted patient imagery for convenience.",
          network: "Internet access is required for image processing.",
          cost:
            "Image processing may use more paid credits than text. Limit work to selected assets.",
          hardware: "A browser and enough local storage for source-quality assets.",
          evidence:
            "Keep the source checksum, rights row, generated draft, human corrections, and final accessible text.",
          sources: [w3cImagesSource, wcagSource],
        },
        {
          id: "media-managed",
          mode: "managed",
          title: "Reviewed media pipeline",
          bestFor: "Many figures, tables, or videos with several reviewers.",
          approach:
            "Move cleared assets through an approved workspace with source hashes, assigned description review, and explicit publish status.",
          tradeoff:
            "Review and consistency improve, but storage, conversion, and sign-off add workflow overhead.",
          dataBoundary:
            "Restricted media remains in its approved environment. Only cleared web derivatives enter the public build.",
          network: "Approved workspace and review access are required.",
          cost:
            "Storage, transcription, or media-processing charges may apply.",
          hardware:
            "A managed workstation; video and very large images benefit from more memory and storage.",
          evidence:
            "Export the asset manifest with source, checksum, rights, caption, alternatives, reviewer, and status.",
          sources: [wcagSource],
        },
        {
          id: "media-local",
          mode: "local",
          title: "Local semantic media preparation",
          bestFor: "Sensitive media or researchers who want direct control.",
          approach:
            "Write descriptions while viewing the source locally, build tables as semantic HTML, and render the static page for manual checking.",
          tradeoff:
            "No external processing is needed, but careful description and cross-checking take time.",
          dataBoundary:
            "Originals stay local. Publish only cleared derivatives, descriptions, and values approved for release.",
          network:
            "Not needed for preparation after source and tooling are available.",
          cost: "No service charge; budget specialist review and storage.",
          hardware:
            "An ordinary laptop for figures and tables; video may require more storage and encoding capacity.",
          evidence:
            "Commit the asset manifest, semantic table source, source checksum, and reviewer decision.",
          sources: [w3cImagesSource],
        },
      ],
      tryNow: {
        intro: "Prepare one figure without changing its scientific meaning.",
        items: [
          {
            id: "media-source",
            label: "Confirm the source, checksum, rights row, caption, and linked claim IDs.",
          },
          {
            id: "media-describe",
            label: "Write separate caption, concise alt text, and long description.",
          },
          {
            id: "media-check",
            label: "Check every label, value, relationship, and accessible fallback against the source.",
          },
        ],
        evidence:
          "Keep one approved asset-manifest row and a rendered figure whose alternatives were manually checked.",
      },
    },
    demo: {
      why:
        "A demo can make evidence tangible, but it can also hide untrusted code, moving dependencies, private data, or a staged result. Its claim and execution boundary must be explicit.",
      terms: [
        {
          label: "Sandbox",
          definition:
            "A restricted environment that limits what untrusted code can read, write, contact, and consume.",
        },
        {
          label: "Reproducibility record",
          definition:
            "The exact commit, environment, command, input, seed, hardware, output, checksum, and failure state for a run.",
        },
      ],
      tips: [
        {
          title: "Prove the smallest useful claim",
          body:
            "Use a public or synthetic fixture and the shortest command that demonstrates the reader task. Do not rebuild the whole paper by default.",
        },
        {
          title: "Design the failure first",
          body:
            "Show what readers see when compute, data, or network access is unavailable, and keep a static evidence-backed fallback.",
        },
      ],
      paths: [
        {
          id: "demo-hosted",
          mode: "hosted",
          title: "Hosted public demo",
          bestFor: "A small interaction using public or synthetic inputs.",
          approach:
            "Deploy a bounded demo with no secrets, strict input limits, fixed dependencies, restricted egress, quotas, and an accessible static fallback.",
          tradeoff:
            "Readers get immediate access, but compute cost, abuse controls, availability, and service changes become part of the research object.",
          dataBoundary:
            "Accept only declared public or synthetic inputs. Do not collect patient data, credentials, or unexpected files.",
          network:
            "Readers and the service need network access; minimise runtime dependencies on third parties.",
          cost:
            "Hosting and compute may scale with use. Set spending, concurrency, time, and storage limits.",
          hardware:
            "Server hardware must match the documented task; avoid requiring a GPU unless the evidence genuinely needs one.",
          evidence:
            "Keep deployment version, dependency lock, input limits, run log, output checksum, failure test, and fallback screenshot.",
          sources: [owaspPromptSource, githubReleaseSource],
        },
        {
          id: "demo-managed",
          mode: "managed",
          title: "Managed sandbox or recorded run",
          bestFor: "Code that needs controlled compute or institutional approval.",
          approach:
            "Run the pinned example in an approved sandbox or continuous integration job, then publish a reviewed result and recording instead of open execution when needed.",
          tradeoff:
            "Controls and logs are stronger, but access, queue time, and platform-specific configuration reduce immediacy.",
          dataBoundary:
            "Move only approved inputs into the sandbox and export only reviewed outputs. Keep credentials in the platform secret store.",
          network:
            "Approved network access is required for the workspace; execution egress should be restricted.",
          cost:
            "Managed compute, storage, and reviewer time may be charged by use.",
          hardware:
            "Choose the smallest declared CPU, memory, and GPU profile that reproduces the example.",
          evidence:
            "Export job configuration, environment digest, logs, resource use, output hash, review, and public fallback.",
          sources: [githubReleaseSource],
        },
        {
          id: "demo-local",
          mode: "local",
          title: "Local static or deterministic demo",
          bestFor: "Offline teaching, restricted code, or a low-cost companion.",
          approach:
            "Run a pinned script or static interaction locally with read-only inputs, then publish the reviewed output and exact reproduction instructions.",
          tradeoff:
            "Control and cost are favourable, but readers must reproduce locally or rely on the recorded result.",
          dataBoundary:
            "Inputs and execution stay on the approved machine. Publish only cleared outputs and a safe fixture.",
          network:
            "Not needed after dependencies and fixtures are present; record any unavoidable download.",
          cost: "No service usage charge; local compute and researcher time remain.",
          hardware:
            "Document the actual machine. Prefer a CPU example that works on ordinary hardware when scientifically valid.",
          evidence:
            "Commit the command, lockfile, fixture hash, machine record, output hash, failure case, and static fallback.",
          sources: [quartoSource],
        },
      ],
      tryNow: {
        intro: "Define the smallest honest demonstration.",
        items: [
          {
            id: "demo-label",
            label: "Label the result live, recorded, illustrative, or static.",
          },
          {
            id: "demo-pin",
            label: "Record commit, environment, command, input, hardware, output, and checksum.",
          },
          {
            id: "demo-fail",
            label: "Trigger one expected failure and confirm the accessible fallback works.",
          },
        ],
        evidence:
          "Keep a reproducibility record and failure test that support the exact label shown to readers.",
      },
    },
    validate: {
      why:
        "A successful build and an automated score do not establish accessibility, working evidence links, or scientific accuracy. The actual reader tasks need manual proof.",
      terms: [
        {
          label: "Keyboard journey",
          definition:
            "A complete reader task performed with keys alone, including visible focus and logical order.",
        },
        {
          label: "Reflow",
          definition:
            "Content adapting at narrow widths or high zoom without losing information or requiring two-dimensional scrolling.",
        },
      ],
      tips: [
        {
          title: "Test journeys, not screenshots",
          body:
            "Open the paper, trace a claim, operate the demo or fallback, and download the record using keyboard and mobile layouts.",
        },
        {
          title: "Separate automated and human evidence",
          body:
            "Keep scanner output beside keyboard, zoom, screen-reader, source, and content checks. Do not merge them into one score.",
        },
      ],
      paths: [
        {
          id: "validate-hosted",
          mode: "hosted",
          title: "Hosted browser checks",
          bestFor: "Public previews that need several browser and viewport combinations.",
          approach:
            "Send only the public preview URL to a browser-testing service, capture failures, then repeat critical journeys manually.",
          tradeoff:
            "Coverage is broad and quick, but remote automation cannot judge meaning, scientific wording, or all assistive technology behaviour.",
          dataBoundary:
            "The preview and captured page data leave the device. Never test restricted content on a public or third-party service.",
          network: "Reliable internet access is required.",
          cost:
            "Browser minutes, screenshots, and accessibility scans may incur usage charges.",
          hardware: "A local browser for manual retesting; remote hardware runs the matrix.",
          evidence:
            "Keep browser versions, viewport results, console logs, scanner output, manual checks, fixes, and retest status.",
          sources: [wcagSource, w3cToolsSource],
        },
        {
          id: "validate-managed",
          mode: "managed",
          title: "Managed continuous validation",
          bestFor: "Teams that need repeatable checks on every reviewed change.",
          approach:
            "Run build, link, accessibility, and browser tests in approved continuous integration, with named people completing the manual checklist.",
          tradeoff:
            "Regression evidence is consistent, but configuration and false positives need maintenance.",
          dataBoundary:
            "Use synthetic fixtures in automation. Keep restricted test data and private previews inside approved runners.",
          network:
            "The runner needs repository and dependency access; external link checks need controlled egress.",
          cost:
            "Runner minutes and device services may add cost, plus maintenance time.",
          hardware:
            "Managed runners cover automation; real phones and assistive technology are still needed for selected manual checks.",
          evidence:
            "Archive test reports, commit, environment, manual sign-off, issue owner, severity, and retest result.",
          sources: [wcagSource],
        },
        {
          id: "validate-local",
          mode: "local",
          title: "Local human validation",
          bestFor: "Static sites, private previews, or a small release.",
          approach:
            "Build from a clean clone, test 360, 768, and 1440 pixel widths, use keyboard and 200% zoom, and open every central source link.",
          tradeoff:
            "The checks are direct and inexpensive, but browser and device coverage is narrower.",
          dataBoundary:
            "The preview stays on the machine. Only public links are contacted during source checks.",
          network:
            "Not needed for local layout checks; required to confirm current external links.",
          cost: "No testing-service fee; budget focused human review time.",
          hardware:
            "A laptop, one representative mobile device if available, and any available screen reader.",
          evidence:
            "Keep the build command, browser and device list, findings, screenshots where useful, fixes, and retest status.",
          sources: [wcagSource, w3cToolsSource],
        },
      ],
      tryNow: {
        intro: "Prove one complete reader journey in the built site.",
        items: [
          {
            id: "validate-build",
            label: "Run the documented clean build and record the exact commit.",
          },
          {
            id: "validate-access",
            label: "Complete a central task by keyboard at 200% zoom and a narrow width.",
          },
          {
            id: "validate-evidence",
            label: "Open the supporting source and check the visible claim and asset again.",
          },
        ],
        evidence:
          "Keep a validation report separating automated output, manual findings, fixes, owners, and retests.",
      },
    },
    deploy: {
      why:
        "Publication should expose the exact reviewed release, not an untracked local build. The live URL, source snapshot, privacy behaviour, and rollback path belong to one record.",
      terms: [
        {
          label: "Immutable release",
          definition:
            "A named source and build snapshot that is not silently replaced after review.",
        },
        {
          label: "Canonical URL",
          definition:
            "The preferred public address used in metadata and citations when several URLs exist.",
        },
      ],
      tips: [
        {
          title: "Deploy reviewed bytes",
          body:
            "Build and package from the pushed commit, then verify the live page and downloadable source against that record.",
        },
        {
          title: "Practise rollback",
          body:
            "Know which prior version is safe and test the rollback path before the release is under pressure.",
        },
      ],
      paths: [
        {
          id: "deploy-hosted",
          mode: "hosted",
          title: "Public static hosting",
          bestFor: "A public companion with no private server-side data.",
          approach:
            "Publish a static build to a hosted service, attach the custom domain, and keep analytics off unless there is a justified and reviewed need.",
          tradeoff:
            "Deployment and global delivery are simple, but the public service controls part of the runtime and logs.",
          dataBoundary:
            "Only public HTML, scripts, media, and downloads enter the host. Secrets and restricted data must not enter source, build, or previews.",
          network: "Internet access is required for deployment and public use.",
          cost:
            "Static hosting may be free at modest use, with charges for bandwidth, builds, domains, or added services.",
          hardware:
            "A laptop can create the build; hosting infrastructure serves it.",
          evidence:
            "Keep commit, build command, archive hash, production URL, timestamp, privacy record, domain check, and rollback version.",
          sources: [cloudflarePagesSource],
        },
        {
          id: "deploy-managed",
          mode: "managed",
          title: "Approved preview and release pipeline",
          bestFor: "A team needing reviewer approval between preview and production.",
          approach:
            "Build the pushed commit in an approved pipeline, require preview sign-off, promote the saved artefact, and preserve the previous release.",
          tradeoff:
            "Release integrity is strong, but pipeline configuration, permissions, and queue time add overhead.",
          dataBoundary:
            "Use public content in previews unless the platform is approved for restricted material. Keep secrets in managed variables.",
          network:
            "Repository, build, and deployment services require approved network access.",
          cost:
            "Runner time, storage, domains, and team access may be charged.",
          hardware:
            "Managed runners build the site; a local browser is still needed for final checks.",
          evidence:
            "Archive source and tag, build log, artefact hash, approval, deployment record, live verification, and rollback test.",
          sources: [githubReleaseSource, cloudflarePagesSource],
        },
        {
          id: "deploy-local",
          mode: "local",
          title: "Locally built static release",
          bestFor: "Institutional web space, an intranet, or a minimal static site.",
          approach:
            "Render the static site locally with pinned tooling, inspect the output, then transfer the exact archive through the approved publishing channel.",
          tradeoff:
            "The build is transparent and portable, but transfer, TLS, domain, and rollback operations may be manual.",
          dataBoundary:
            "Only the inspected public archive leaves the machine. Keep source notes and restricted files outside the build directory.",
          network:
            "Not needed for the build; required for transfer and live verification.",
          cost:
            "No usage fee for the build. Institutional hosting, domains, and staff time may still cost money.",
          hardware: "An ordinary laptop can render and package a static site.",
          evidence:
            "Keep the static archive, checksum, tool version, transfer record, canonical URL, live comparison, and prior safe archive.",
          sources: [quartoSource],
        },
      ],
      tryNow: {
        intro: "Connect the live site to one reviewed source snapshot.",
        items: [
          {
            id: "deploy-record",
            label: "Record the commit, tag, build command, archive hash, canonical URL, and timestamp.",
          },
          {
            id: "deploy-compare",
            label: "Compare the live page and downloadable source with the approved release.",
          },
          {
            id: "deploy-rollback",
            label: "Identify and test the previous safe version or documented rollback action.",
          },
        ],
        evidence:
          "Keep a release record proving which source produced the live static site and how it can be reversed.",
      },
    },
    video: {
      why:
        "A walkthrough should explain the evidence and boundary, not merely advertise the interface. It also needs accurate captions, a transcript, and cleared media.",
      terms: [
        {
          label: "Transcript",
          definition:
            "A text record of speech and meaningful audio, presented in reading order.",
        },
        {
          label: "Visual description",
          definition:
            "Spoken or written information needed when important on-screen content is not conveyed by the narration.",
        },
      ],
      tips: [
        {
          title: "Script from the release",
          body:
            "Write against the approved live version and name one limitation. Do not record a changing development build.",
        },
        {
          title: "Keep the screen clean",
          body:
            "Use public or synthetic data, disable notifications, close private tabs, and rehearse every click before recording.",
        },
      ],
      paths: [
        {
          id: "video-hosted",
          mode: "hosted",
          title: "Hosted recording and captioning",
          bestFor: "A public site and a quick collaborative edit.",
          approach:
            "Record the public route, upload only cleared footage, generate a caption draft, then correct the transcript and visual information manually.",
          tradeoff:
            "Sharing and caption drafting are convenient, but footage, voice, and metadata move to a third party.",
          dataBoundary:
            "Record only public or synthetic material. Remove notifications, identities, private URLs, and unreleased results before upload.",
          network: "Reliable upload and editing access are required.",
          cost:
            "Recording, storage, transcription, or export quality may require a subscription.",
          hardware:
            "A current laptop, microphone, and enough local space for the source recording.",
          evidence:
            "Keep the approved script, source recording, corrected captions, transcript, rights list, reviewer, and final URL.",
          sources: [w3cTranscriptSource, w3cMediaSource],
        },
        {
          id: "video-managed",
          mode: "managed",
          title: "Institutional media workflow",
          bestFor: "A team requiring approved storage, review, and publication.",
          approach:
            "Record in a clean profile, move the file to the approved media workspace, assign caption and scientific review, then publish the approved version.",
          tradeoff:
            "Governance and accessibility review are clearer, but scheduling and platform processing add time.",
          dataBoundary:
            "Footage remains in the approved tenant until a reviewer clears the public export.",
          network:
            "Institutional upload, review, and publication access are required.",
          cost:
            "Often covered institutionally, with possible storage, captioning, or production costs.",
          hardware:
            "A managed laptop, microphone, and adequate storage; specialist editing hardware is optional.",
          evidence:
            "Export the script, review comments, corrected captions, transcript, approval, release link, and retained master policy.",
          sources: [w3cTranscriptSource],
        },
        {
          id: "video-local",
          mode: "local",
          title: "Local recording and edit",
          bestFor: "Offline preparation or complete control of the source footage.",
          approach:
            "Record and edit locally, write captions and transcript from the final cut, then upload only the approved export and text alternatives.",
          tradeoff:
            "Data movement and service cost are low, but editing, caption timing, and quality checks take researcher time.",
          dataBoundary:
            "Source footage stays local. Only the reviewed public export, captions, and transcript leave the machine.",
          network: "Not needed for recording or editing; required for final upload.",
          cost:
            "No service usage charge with existing tools; storage and researcher time remain.",
          hardware:
            "A laptop with a microphone and several gigabytes of free space; video encoding benefits from a modern processor.",
          evidence:
            "Keep the 120 to 140 word script, final video hash, captions, transcript, visual descriptions, rights record, and sign-off.",
          sources: [w3cTranscriptSource, w3cMediaSource],
        },
      ],
      tryNow: {
        intro: "Draft and check a one-minute evidence-led walkthrough.",
        items: [
          {
            id: "video-script",
            label: "Write 120 to 140 spoken words covering one interaction, its evidence, and one limitation.",
          },
          {
            id: "video-record",
            label: "Record the approved release in a clean profile using only public or synthetic material.",
          },
          {
            id: "video-access",
            label: "Correct captions and transcript, then add descriptions for visual information not spoken.",
          },
        ],
        evidence:
          "Keep the approved script, final video checksum, corrected captions, transcript, description notes, and reviewer sign-off.",
      },
    },
  },
};
