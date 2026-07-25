import type { Workshop } from "@/lib/types";

export const interactivePaper: Workshop = {
  slug: "interactive-paper",
  number: "02",
  shortTitle: "Research website",
  title: "Building a Website for Your Research Using AI",
  navTitle: "Research website",
  description:
    "Turn a paper and repository into a clear, accessible project website. Let AI organise and draft, then verify every claim, asset, demo, and release.",
  promise:
    "Finish with a website brief, source manifest, evidence map, rights ledger, tested release plan, and captioned walkthrough script.",
  duration: "10 stages · about 60 minutes",
  accent: "ochre",
  startLabel: "Define the reader and purpose",
  steps: [
    {
      id: "brief",
      title: "Decide what the website must do",
      summary:
        "Choose one main reader, one task they should complete, a 25-word takeaway, and a primary action. Ask AI to surface missing decisions, not make them for you.",
      action:
        "Complete a short intake and set explicit non-goals before choosing a framework or visual style.",
      output: "website_brief.md",
      prompt: `Interview me to create a one-page brief for a research website. Ask about the intended reader, the task they should complete, the 25-word takeaway, the primary action, the paper and repository, available media, accessibility needs, sensitive material, deadline, and non-goals. Ask one focused group of questions at a time. Do not invent answers. End with a concise brief and a list of unresolved decisions.`,
      checkpoint:
        "A colleague who has not read the paper can identify the audience, takeaway, action, and boundaries from the brief alone.",
      watchFor:
        "A polished visual concept can hide an unclear purpose. Do not let the tool choose scientific emphasis on your behalf.",
      videoCue:
        "Show the intake turning a vague idea into a one-page brief, including one answer that changes the proposed site.",
      sources: [
        {
          title: "Paper2Web",
          url: "https://aclanthology.org/2026.acl-demo.57/",
        },
        {
          title: "Schema.org ScholarlyArticle",
          url: "https://schema.org/ScholarlyArticle",
        },
      ],
    },
    {
      id: "sources",
      title: "Freeze and inventory the sources",
      summary:
        "Record the exact paper, supplement, repository commit, dataset version, and media files before AI extracts or rewrites anything.",
      action:
        "Give every source a stable ID, canonical link, version, retrieval date, local path, checksum, and sensitivity label.",
      output: "source_manifest.md",
      prompt: `Create a source manifest for the files and links below. For each item, record a stable ID, title, authors or owner, DOI or canonical URL, version or commit SHA, retrieval date, local path, SHA-256 checksum if available, access conditions, sensitivity, and whether it may be sent to an external AI service. Flag missing metadata and duplicate versions. Never include credentials or personal data in the manifest.

Sources:
[Paste the source list here]`,
      checkpoint:
        "Every claim and asset can point to one exact source version, and restricted material has a clear handling rule.",
      watchFor:
        "Do not upload unpublished, patient-identifiable, licensed, or confidential material to an AI service unless its use is authorised.",
      videoCue:
        "Change a repository URL into a pinned commit and show how the manifest preserves the version used by the website.",
      sources: [
        {
          title: "Crossref REST API",
          url: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/",
        },
        {
          title: "DataCite Metadata Schema",
          url: "https://schema.datacite.org/",
        },
        {
          title: "Citation File Format",
          url: "https://citation-file-format.github.io/",
        },
      ],
    },
    {
      id: "rights",
      title: "Clear rights before extracting assets",
      summary:
        "Citation, access, and permission are different. Check the licence and rights holder for text, figures, tables, code, data, fonts, and icons.",
      action:
        "Create an asset-by-asset ledger covering licence, attribution, permitted changes, and publication status.",
      output: "RIGHTS.md",
      prompt: `Build a rights ledger for this research website. Inventory paper text, figures, tables, supplementary files, code, data, icons, fonts, photographs, and generated media. For each item, record the rights holder, source, licence, required attribution, whether modification and web republication are permitted, and the evidence checked. Mark unclear cases as blocked. Treat the content licence, code licence, and data terms separately.`,
      checkpoint:
        "Every public asset is cleared, attributed, original, or replaced. Blocked items are absent from the build.",
      watchFor:
        "A citation does not grant republication rights, and an open paper does not automatically make its code or datasets open.",
      videoCue:
        "Compare a citable figure with a reusable figure, then replace one asset whose permission cannot be established.",
      sources: [
        {
          title: "Creative Commons FAQ",
          url: "https://creativecommons.org/faq/",
        },
        {
          title: "GitHub guide to repository licensing",
          url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository",
        },
        {
          title: "SPDX licence information",
          url: "https://spdx.dev/learn/handling-license-info/",
        },
      ],
    },
    {
      id: "claims",
      title: "Map every claim to evidence",
      summary:
        "Separate what the paper reports, what you reproduced, what an author states, and what you infer. Give each public claim an exact source locator.",
      action:
        "Build a checklist with claim IDs, wording class, evidence, numeric context, confidence, and limitations.",
      output: "claim_evidence.md",
      prompt: `Using only the frozen sources, create a claim-evidence checklist for the proposed website. Give each claim a stable ID and classify it as paper_reports, reproduced, author_statement, or inference. Link it to an exact page, section, figure, table, repository file, or run record. Preserve denominators, units, uncertainty, comparison conditions, and limitations. Rewrite unsupported claims cautiously and leave unresolved claims blocked.`,
      checkpoint:
        "Every numerical or scientific statement has an exact locator. Only results from a documented run use the word reproduced.",
      watchFor:
        "AI summaries often remove conditions, merge results, or turn association into causation. Check the original source for every central claim.",
      videoCue:
        "Trace one headline number from website sentence to table cell, metric definition, and run record.",
      sources: [
        {
          title: "Paper2Web",
          url: "https://aclanthology.org/2026.acl-demo.57/",
        },
        {
          title: "Crossref REST API",
          url: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/",
        },
      ],
    },
    {
      id: "architecture",
      title: "Turn evidence into a page sequence",
      summary:
        "Use progressive disclosure: a quick overview first, then method, results, demo, reproduction details, limitations, citation, rights, and contact.",
      action:
        "Map every section to a reader need, approved claims, source assets, and a word budget.",
      output: "site_map.md",
      prompt: `Design a concise information architecture from my website brief, source manifest, rights ledger, and claim-evidence checklist. Use this sequence unless the evidence suggests a better one: metadata and links, 30-second overview, problem, method, results, demo, reproduction, limitations, citation, rights, and contact. For each section, state the reader question, approved claim IDs, assets, interaction, word budget, and accessible fallback. Do not add claims or sections merely to make the site look complete.`,
      checkpoint:
        "A reader can find the paper, code, main result, limitation, and reproduction path without reading the whole page.",
      watchFor:
        "Do not reproduce the paper line by line. The website should guide a reader while preserving routes back to the primary record.",
      videoCue:
        "Show claim cards being arranged into the final page sequence and remove one section that serves no reader task.",
      sources: [
        {
          title: "Schema.org ScholarlyArticle",
          url: "https://schema.org/ScholarlyArticle",
        },
        {
          title: "ORCID Public API",
          url: "https://info.orcid.org/what-is-orcid/services/public-api/",
        },
        {
          title: "Paper2Web",
          url: "https://aclanthology.org/2026.acl-demo.57/",
        },
      ],
    },
    {
      id: "media",
      title: "Prepare figures, tables, and descriptions",
      summary:
        "Preserve the link between every asset, its source, caption, and claim. Write useful alternatives for readers who cannot see or interact with it.",
      action:
        "Create an asset manifest with approved file, caption, rights, alt text, long description, and source locator.",
      output: "asset_manifest.md",
      prompt: `Prepare a web asset manifest from the approved sources and rights ledger. For every figure, table, diagram, and video, record the source locator, filename, format, dimensions, caption, attribution, linked claim IDs, concise alt text, and any long description or transcript required. Preserve semantic tables as HTML rather than images. Flag values that need manual checking after extraction and do not infer unseen visual details.`,
      checkpoint:
        "Captions and values match the source, tables remain navigable, descriptions convey the relevant information, and rights are recorded.",
      watchFor:
        "OCR and vision models can transpose labels, miss symbols, or invent visual relationships. Verify extracted values and descriptions manually.",
      videoCue:
        "Turn one paper figure into a semantic figure with caption, alt text, long description, and a visible source link.",
      sources: [
        {
          title: "W3C Images Tutorial",
          url: "https://www.w3.org/WAI/tutorials/images/",
        },
        {
          title: "W3C Tables Tutorial",
          url: "https://www.w3.org/WAI/tutorials/tables/",
        },
        {
          title: "W3C table captions and summaries",
          url: "https://www.w3.org/WAI/tutorials/tables/caption-summary/",
        },
      ],
    },
    {
      id: "demo",
      title: "Build the site and prove the demo",
      summary:
        "Ask a coding agent to implement from the checked artefacts. Treat a live model, recorded run, illustrative interaction, and static result as different things.",
      action:
        "Run the repository from a clean clone at a pinned commit and document inputs, environment, hardware, seed, output, and fallback.",
      output: "reproducibility.md",
      prompt: `Implement the approved site map using [framework or plain HTML]. Use only claims and assets listed in the checked manifests. Add semantic HTML, keyboard operation, visible focus, responsive layouts, reduced-motion support, source links, and metadata. For the demo, document whether it is live, recorded, illustrative, or static, plus the exact commit, environment, command, input, seed, hardware, output, checksum, failure state, and accessible fallback. Show proposed changes as a reviewable diff.`,
      checkpoint:
        "A clean clone produces the stated result, the demo is labelled honestly, and the page still explains the work when scripts or the model fail.",
      watchFor:
        "Never send private medical data to a public demo. Do not imply that a staged interaction is a live or independently reproduced result.",
      videoCue:
        "Open the demo from a clean build, show its provenance panel, then disable it and use the fallback.",
      sources: [
        {
          title: "Citation File Format",
          url: "https://citation-file-format.github.io/",
        },
        {
          title: "GitHub immutable releases",
          url: "https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases",
        },
        {
          title: "Citing a repository with Zenodo",
          url: "https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content",
        },
      ],
    },
    {
      id: "validate",
      title: "Preview and validate locally",
      summary:
        "Automated scores are a starting point. Test the built site at small and large widths, with a keyboard, zoom, reduced motion, and real source links.",
      action:
        "Record build, browser, accessibility, performance, link, and content checks in one validation report.",
      output: "validation_report.md",
      prompt: `Audit this local research website without changing it. Run the documented clean build, then check routes, external links, media, console and network errors, headings, landmarks, labels, keyboard order, visible focus, 200% zoom, reduced motion, colour contrast, and widths of 360, 768, and 1440 pixels. Use standards validation and an automated accessibility scanner, then add manual findings they cannot cover. For each issue, record evidence, severity, owner, and retest status.`,
      checkpoint:
        "The production build passes, central journeys work without a mouse, no critical accessibility issue remains, and every claim and asset is checked again.",
      watchFor:
        "A perfect automated score does not prove accessibility, usability, scientific accuracy, or working external links.",
      videoCue:
        "Navigate the page by keyboard, zoom to 200%, and show one issue caught by a human check rather than the score.",
      sources: [
        {
          title: "Web Content Accessibility Guidelines 2.2",
          url: "https://www.w3.org/TR/WCAG22/",
        },
        {
          title: "W3C validators and tools",
          url: "https://www.w3.org/developers/tools/",
        },
        {
          title: "axe-core",
          url: "https://github.com/dequelabs/axe-core",
        },
      ],
    },
    {
      id: "deploy",
      title: "Deploy an auditable release",
      summary:
        "Publish the exact reviewed commit to a preview first. Record the production URL, release time, archive, metadata, domain, privacy choices, and rollback path.",
      action:
        "Keep analytics off unless there is a clear need, lawful basis, transparent notice, retention rule, and tested consent behaviour.",
      output: "release_record.md",
      prompt: `Create a release checklist for this research website. Include the exact commit and build command, preview approval, production URL, timestamp, HTTPS, custom domain, canonical URL, scholarly metadata, social preview, source links, archive or DOI, licence, privacy notice, analytics decision, data collected, cookies or local storage, retention, processor location, consent requirements, rollback, and post-release link check. Do not deploy until the named reviewer approves the preview.`,
      checkpoint:
        "The live URL matches the approved commit, metadata and links resolve, privacy information matches actual behaviour, and rollback has been tested.",
      watchFor:
        "Preview URLs may remain reachable. Never place restricted material in a preview, commit history, client bundle, analytics event, or public environment variable.",
      videoCue:
        "Compare preview and production, confirm the commit in the release record, then open the privacy and citation information.",
      sources: [
        {
          title: "Cloudflare Pages Git integration",
          url: "https://developers.cloudflare.com/pages/configuration/git-integration/",
        },
        {
          title: "Cloudflare Pages preview deployments",
          url: "https://developers.cloudflare.com/pages/configuration/preview-deployments/",
        },
        {
          title: "ICO guidance on storage and access technologies",
          url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/",
        },
      ],
    },
    {
      id: "video",
      title: "Record the walkthrough and freeze the release",
      summary:
        "Use the website as the visual spine for a short human explanation. Show the problem, one interaction, its evidence, a limitation, and the reproduction route.",
      action:
        "Write a 120 to 140 word script for one minute, rehearse against the approved release, then add captions and a transcript.",
      output: "video_script.md",
      prompt: `Write a one-minute walkthrough for the approved research website using 120 to 140 spoken words. Cover the research problem, intended reader, one useful interaction, the evidence behind it, one important limitation, and where to find the paper, code, and reproduction instructions. Use plain language and mark each on-screen action. Add a caption-ready transcript, pronunciation notes, and visual descriptions for information not conveyed in speech. Use only public or synthetic data.`,
      checkpoint:
        "The recording matches the released site, stays within time, names a limitation, and has accurate captions, transcript, and media rights.",
      watchFor:
        "A fast product tour can overclaim the science. Keep the evidence visible and remove notifications, private tabs, identifiers, and unreleased material.",
      videoCue:
        "Record the final one-minute route in a clean browser and end on the paper, code, and reproduction links.",
      sources: [
        {
          title: "W3C audio and video guidance",
          url: "https://www.w3.org/WAI/media/av/",
        },
        {
          title: "W3C transcript guidance",
          url: "https://www.w3.org/WAI/media/av/transcripts/",
        },
        {
          title: "W3C visual description guidance",
          url: "https://www.w3.org/WAI/media/av/description/",
        },
      ],
    },
  ],
  sourceLibrary: [
    {
      title: "Paper2Web",
      url: "https://aclanthology.org/2026.acl-demo.57/",
      note: "A primary research reference for turning papers into interactive web pages.",
    },
    {
      title: "Paper2All",
      url: "https://github.com/YuhangChen1/Paper2All",
      note: "A useful design reference. No top-level licence was detected when this module was prepared, so do not copy code or assets without permission.",
    },
    {
      title: "Schema.org ScholarlyArticle",
      url: "https://schema.org/ScholarlyArticle",
      note: "Structured metadata for scholarly work on the web.",
    },
    {
      title: "Web Content Accessibility Guidelines 2.2",
      url: "https://www.w3.org/TR/WCAG22/",
      note: "The accessibility baseline for the build and review.",
    },
    {
      title: "Creative Commons FAQ",
      url: "https://creativecommons.org/faq/",
      note: "A practical starting point for reuse, attribution, and licence questions.",
    },
    {
      title: "Cloudflare Pages custom domains",
      url: "https://developers.cloudflare.com/pages/configuration/custom-domains/",
      note: "Deployment guidance for connecting a project site to a custom domain.",
    },
  ],
};
