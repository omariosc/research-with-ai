import type {
  GuidePath,
  GuidePathMode,
  Source,
  WorkshopGuidance,
} from "@/lib/types";

const sources = {
  leeds: {
    title: "AI in Healthcare Conference programme",
    url: "https://www.leedsaiweek.co.uk/ai-in-healthcare",
  },
  luu: {
    title: "Leeds University Union event listing",
    url: "https://engage.luu.org.uk/events/87BV2/ai-in-healthcare-conference-2026",
  },
  hsePlan: {
    title: "HSE event safety: getting started",
    url: "https://www.hse.gov.uk/event-safety/getting-started.htm",
  },
  hseCrowd: {
    title: "HSE event safety: assess crowd safety risks",
    url: "https://www.hse.gov.uk/event-safety/crowd-management-assess.htm",
  },
  hseVenue: {
    title: "HSE event safety: venue and site design",
    url: "https://www.hse.gov.uk/event-safety/venue-site-design.htm",
  },
  ico: {
    title: "ICO privacy notice for events, seminars, and workshops",
    url: "https://ico.org.uk/global/privacy-notice/attend-an-event-seminar-or-workshop/",
  },
  w3c: {
    title: "W3C guidance for accessible presentations and events",
    url: "https://www.w3.org/WAI/teach-advocate/accessible-presentations/",
  },
  leedsAccessibility: {
    title: "University of Leeds guidance for making events accessible",
    url: "https://equality.leeds.ac.uk/support-and-resources/accessibility-guidance/making-your-event-accessible/",
  },
  leedsSafeguarding: {
    title: "University of Leeds safeguarding policy",
    url: "https://secretariat.leeds.ac.uk/policy-on-safeguarding-children-young-persons-and-adults-in-vulnerable-circumstances/",
    note: "The University marks this policy as under review from June 2026. Recheck the current approved process before relying on it.",
  },
} satisfies Record<string, Source>;

type PathDraft = {
  title: string;
  bestFor: string;
  approach: string;
  tradeoff: string;
  dataBoundary: string;
  evidence: string;
};

function makePath(
  stepId: string,
  mode: GuidePathMode,
  draft: PathDraft,
  pathSources: Source[],
): GuidePath {
  const defaults = {
    hosted: {
      network: "Reliable internet access and an approved provider account.",
      cost:
        "Check subscription, per-user, storage, messaging, transaction, and export charges before committing.",
      hardware: "A current browser on an ordinary laptop or phone is sufficient.",
    },
    managed: {
      network:
        "Institutional network or an approved managed cloud service may be required.",
      cost:
        "Allow staff time for setup, permissions, support, procurement, and retention.",
      hardware:
        "Standard managed workstations plus any venue equipment specified by the event team.",
    },
    local: {
      network:
        "The core record can work offline; approved transfers and publication happen separately.",
      cost:
        "Usually low software cost, with organiser time, secure storage, printing, and backup still required.",
      hardware:
        "A laptop with encrypted storage and a tested backup or export route.",
    },
  }[mode];

  return {
    id: `${stepId}-${mode}`,
    mode,
    ...draft,
    ...defaults,
    sources: pathSources,
  };
}

function pathsFor(
  stepId: string,
  pathSources: Source[],
  hosted: PathDraft,
  managed: PathDraft,
  local: PathDraft,
): GuidePath[] {
  return [
    makePath(stepId, "hosted", hosted, pathSources),
    makePath(stepId, "managed", managed, pathSources),
    makePath(stepId, "local", local, pathSources),
  ];
}

export const conferenceGuidance: WorkshopGuidance = {
  lastVerified: "2026-07-26",
  phases: [
    {
      id: "frame",
      title: "Frame the conference",
      summary:
        "Define the community outcome, learn from experienced organisers, and map the relationships around the event.",
      stepIds: ["purpose", "community"],
    },
    {
      id: "organise",
      title: "Organise people and programme",
      summary:
        "Assign authority and resources, then design sessions that serve the stated outcomes.",
      stepIds: ["team-budget", "programme"],
    },
    {
      id: "commit",
      title: "Make responsible commitments",
      summary:
        "Support contributors and partners, then settle venue, safety, access, food, and technical responsibilities.",
      stepIds: ["speakers-partners", "venue-care"],
    },
    {
      id: "prepare",
      title: "Prepare the operation",
      summary:
        "Register and communicate with people carefully, then rehearse the operational plan and fallbacks.",
      stepIds: ["registration", "run-show"],
    },
    {
      id: "deliver-learn",
      title: "Deliver and learn",
      summary:
        "Make accountable live decisions, reconcile the evidence, and turn the event into sustained community work.",
      stepIds: ["deliver", "evaluate"],
    },
  ],
  routes: [
    {
      id: "orientation",
      title: "Orientation",
      description:
        "Test whether the event has a real purpose, a defensible registration plan, and an honest evaluation route.",
      bestFor:
        "An early idea, a committee discussion, or a proposal before invitations are sent.",
      stepIds: ["purpose", "registration", "evaluate"],
    },
    {
      id: "small-community-event",
      title: "Small community event",
      description:
        "Follow eight essential stages from purpose to evaluation. This shorter route assumes that the core audience and contributors are already known; use the full conference route when you still need community mapping, partner development, or detailed speaker coordination.",
      bestFor:
        "A local seminar, careers panel, or practical workshop with one venue, a modest audience, and already identified contributors.",
      stepIds: [
        "purpose",
        "team-budget",
        "programme",
        "venue-care",
        "registration",
        "run-show",
        "deliver",
        "evaluate",
      ],
    },
    {
      id: "full-conference",
      title: "Full conference",
      description:
        "Use every stage for a multi-format day involving speakers, workshops, panels, competitions, partners, and volunteers.",
      bestFor:
        "A full-day interdisciplinary conference similar in scope to the Leeds first-hand case.",
      stepIds: [
        "purpose",
        "community",
        "team-budget",
        "programme",
        "speakers-partners",
        "venue-care",
        "registration",
        "run-show",
        "deliver",
        "evaluate",
      ],
    },
    {
      id: "post-event-recovery",
      title: "Post-event recovery",
      description:
        "Reconcile a completed event, correct the public archive, analyse feedback, and preserve the lessons.",
      bestFor:
        "A team whose event has finished but whose attendance, delivered programme, consent, or impact record remains fragmented.",
      stepIds: ["registration", "deliver", "evaluate"],
    },
  ],
  steps: {
    purpose: {
      why:
        "Purpose determines who is invited, what the programme contains, how money is spent, and what evidence will count afterwards.",
      terms: [
        {
          label: "Community outcome",
          definition:
            "A specific change in access, understanding, relationships, skills, or follow-up that the event aims to support.",
        },
        {
          label: "Non-goal",
          definition:
            "An attractive activity or claim that the event deliberately excludes.",
        },
      ],
      tips: [
        {
          title: "Interview before you announce",
          body:
            "Ask potential attendees and community partners what would make the day worth their time before choosing sessions.",
        },
        {
          title: "Write a stopping rule",
          body:
            "Record which missing approval, owner, venue condition, or resource would cause the team to pause or reduce scope.",
        },
      ],
      paths: pathsFor(
        "purpose",
        [sources.leeds, sources.luu],
        {
          title: "Hosted planning interview",
          bestFor: "Public ideas and a quick first conference brief.",
          approach:
            "Use a hosted assistant to ask structured questions, then test the draft with real community members.",
          tradeoff:
            "Fast and conversational, but it can make generic event language sound more certain than the evidence.",
          dataBoundary:
            "Share public context only. Keep private relationships, negotiations, attendee data, and sensitive needs out.",
          evidence:
            "Save the dated questions, human-edited brief, interview notes, unresolved decisions, and named approval.",
        },
        {
          title: "Institutional proposal route",
          bestFor: "An event needing university, society, funder, or venue approval.",
          approach:
            "Draft inside the approved planning system and map every outcome to the host's event requirements.",
          tradeoff:
            "Review is traceable, but approval cycles can shape the timeline and scope.",
          dataBoundary:
            "Keep planning details within the host's approved workspace and access groups.",
          evidence:
            "Retain the approved brief, host requirements, reviewer comments, decision log, and approval date.",
        },
        {
          title: "Paper and whiteboard route",
          bestFor: "A new group, an offline workshop, or an idea containing private context.",
          approach:
            "Facilitate the purpose exercise without an AI service, then type only the approved result into the project.",
          tradeoff:
            "Requires stronger human facilitation but exposes no planning context to an external provider.",
          dataBoundary:
            "Raw discussion remains in the room; only the agreed brief enters the project record.",
          evidence:
            "Photograph or transcribe the approved outcome map, non-goals, open questions, and owner.",
        },
      ),
      tryNow: {
        intro:
          "Test whether the proposed event creates a useful change for a real local group.",
        items: [
          { id: "purpose-try-1", label: "Name one primary community" },
          { id: "purpose-try-2", label: "Write one observable outcome" },
          { id: "purpose-try-3", label: "Add one non-goal and stopping rule" },
        ],
        evidence:
          "A dated one-page brief reviewed by at least one intended participant and the accountable event lead.",
      },
    },
    community: {
      why:
        "Advice from experienced organisers prevents repeat mistakes, while a stakeholder map reveals who can contribute and who might otherwise be excluded.",
      terms: [
        {
          label: "Warm introduction",
          definition:
            "An introduction made through an existing trusted relationship rather than an unsolicited approach.",
        },
        {
          label: "Representation gap",
          definition:
            "A relevant community or viewpoint that the current network and programme do not include.",
        },
      ],
      tips: [
        {
          title: "Record advice as a decision",
          body:
            "For each useful recommendation, note what changed, who owns the action, and what remains context-specific.",
        },
        {
          title: "Create an open route",
          body:
            "Balance invited contributors with a public expression of interest, poster call, essay call, question submission, or partner nomination.",
        },
      ],
      paths: pathsFor(
        "community",
        [sources.leeds, sources.luu],
        {
          title: "Public ecosystem scan",
          bestFor: "Mapping public organisations, events, speakers, and themes.",
          approach:
            "Use search and AI summarisation to create candidates, then verify each claim at its original source.",
          tradeoff:
            "Broad coverage is quick, but search visibility can over-represent established institutions and outdated profiles.",
          dataBoundary:
            "Use public professional information only and do not enrich it with private contact details.",
          evidence:
            "Keep source links, retrieval dates, verification status, selection reasons, and a record of omitted groups.",
        },
        {
          title: "Partner referral map",
          bestFor: "An event embedded in universities, healthcare, industry, or societies.",
          approach:
            "Ask approved partner contacts for advice and introductions, then record relationship ownership and consent.",
          tradeoff:
            "Trust supports faster coordination, but the network can become closed and over-dependent on a few people.",
          dataBoundary:
            "Store private contact and relationship notes only in the approved team system.",
          evidence:
            "Maintain an advice log, introduction consent, contact owner, programme effect, and representation review.",
        },
        {
          title: "In-person listening map",
          bestFor: "Grassroots groups and communities with limited online visibility.",
          approach:
            "Hold short conversations or a listening session and map needs without collecting unnecessary identities.",
          tradeoff:
            "Richer local context takes more time and depends on careful facilitation.",
          dataBoundary:
            "Record themes rather than names unless follow-up contact is explicitly agreed.",
          evidence:
            "Keep a de-identified theme summary, participation route, changes made, and unresolved gaps.",
        },
      ),
      tryNow: {
        intro:
          "Ask one experienced organiser and one intended participant different questions.",
        items: [
          { id: "community-try-1", label: "Record advice that changes the plan" },
          { id: "community-try-2", label: "Name one missing viewpoint" },
          { id: "community-try-3", label: "Create one open participation route" },
        ],
        evidence:
          "A source-linked stakeholder map and advice log that distinguish confirmed relationships from possible introductions.",
      },
    },
    "team-budget": {
      why:
        "Events fail quietly when everyone is helping but nobody owns a decision, cost, deadline, safety action, or handover.",
      terms: [
        {
          label: "Accountable owner",
          definition:
            "The one person responsible for ensuring a decision or task is completed and escalated when necessary.",
        },
        {
          label: "Contingency",
          definition:
            "Reserved time, money, capacity, or an alternative plan for a plausible disruption.",
        },
      ],
      tips: [
        {
          title: "Separate doing, approving, and deciding",
          body:
            "A volunteer may collect quotes while a financial officer approves spending. Set a decision deadline and name who decides when discussion no longer improves the plan.",
        },
        {
          title: "Price hidden work and name the surge team",
          body:
            "Include access support, waste, volunteer food, and post-event work. Keep two or three reliable people free enough to solve urgent problems through a clear decision route.",
        },
      ],
      paths: pathsFor(
        "team-budget",
        [sources.hsePlan],
        {
          title: "Hosted project board",
          bestFor: "A distributed volunteer team coordinating public, non-sensitive tasks.",
          approach:
            "Use an online board with owners, dates, dependencies, approvals, and a separate restricted finance record.",
          tradeoff:
            "Visibility is strong, but notification noise and broad access can expose negotiations or personal data.",
          dataBoundary:
            "Keep public tasks separate from quotes, contracts, contact details, reimbursements, and incident information.",
          evidence:
            "Export the milestone plan, ownership history, approval log, budget version, and close-out.",
        },
        {
          title: "Institutional event workflow",
          bestFor: "Events operating under formal society, university, NHS, or funder rules.",
          approach:
            "Map committee roles onto the host's finance, procurement, safety, and event approval processes.",
          tradeoff:
            "Controls are clearer, but lead times and permitted suppliers may limit choices.",
          dataBoundary:
            "Finance, contracts, and approvals remain in authorised institutional systems.",
          evidence:
            "Keep approval references, purchase records, role matrix, risk owner, and reconciliation.",
        },
        {
          title: "Local responsibility pack",
          bestFor: "A compact team working from one secure shared folder.",
          approach:
            "Maintain a versioned task CSV, budget sheet, decision log, and weekly review agenda.",
          tradeoff:
            "Simple and portable, but concurrent editing and reminders need manual discipline.",
          dataBoundary:
            "Restrict the folder and create a redacted export for wider volunteers.",
          evidence:
            "Retain dated files, owner changes, budget states, receipts index, and approval signatures.",
        },
      ),
      tryNow: {
        intro:
          "Take the next ten event decisions and give each one a real owner and approval route.",
        items: [
          { id: "team-try-1", label: "Assign one accountable owner per task" },
          { id: "team-try-2", label: "Mark every cost by evidence status" },
          { id: "team-try-3", label: "Add a backup for each critical role" },
        ],
        evidence:
          "A responsibility matrix, milestone plan, bounded budget, contingency, and decision log reviewed by the team.",
      },
    },
    programme: {
      why:
        "A programme is an argument about what matters. Format, order, breaks, and who gets to speak determine whether the audience can participate.",
      terms: [
        {
          label: "Programme arc",
          definition:
            "The deliberate sequence through which participants build context, encounter evidence, take part, and identify next steps.",
        },
        {
          label: "Fallback session",
          definition:
            "A prepared alternative that can run if a contributor, room, connection, or piece of equipment becomes unavailable.",
        },
      ],
      tips: [
        {
          title: "Give every format a job and a stopping rule",
          body:
            "Use a keynote for synthesis, a workshop for practice, a panel for genuine differences, and posters for contribution. Remove a low-value session when the day is already full.",
        },
        {
          title: "Protect the boundary, flex the format",
          body:
            "Protect safety, access, speaker commitments, breaks, capacity, and the purpose. Add realistic time for questions, movement, food, prayer, room resets, and overruns.",
        },
      ],
      paths: pathsFor(
        "programme",
        [sources.leeds, sources.w3c],
        {
          title: "AI-assisted programme comparison",
          bestFor: "Comparing several schedules after outcomes and contributors are known.",
          approach:
            "Ask an assistant to identify omissions, timing pressure, repeated formats, and fallback options.",
          tradeoff:
            "Useful for critique, but it cannot know audience energy, relationships, or contributor constraints unless people provide them.",
          dataBoundary:
            "Use confirmed public session information and remove private negotiation notes.",
          evidence:
            "Save programme versions, assumptions, human decisions, contributor confirmation, and accessibility review.",
        },
        {
          title: "Shared programme workshop",
          bestFor: "A multi-partner event whose sessions have different owners.",
          approach:
            "Review the programme in an approved team workspace with purpose, audience, owner, needs, and fallback per session.",
          tradeoff:
            "Shared ownership improves realism, but late edits need disciplined version control.",
          dataBoundary:
            "Keep unannounced names and contact details restricted until contributors approve publication.",
          evidence:
            "Retain review comments, confirmation status, version history, programme matrix, and approved public export.",
        },
        {
          title: "Printed programme cards",
          bestFor: "An in-room planning session or a programme containing confidential invitations.",
          approach:
            "Arrange session cards on a timeline, stress-test the flow, then transcribe the approved sequence.",
          tradeoff:
            "Fast and tangible, but remote contributors and change history require a deliberate capture step.",
          dataBoundary:
            "Private contributor information stays off external services.",
          evidence:
            "Keep a dated photograph or transcription, decision notes, timing calculation, and fallback list.",
        },
      ),
      tryNow: {
        intro:
          "Give each proposed session one audience outcome and one credible fallback.",
        items: [
          { id: "programme-try-1", label: "Name the purpose of each format" },
          { id: "programme-try-2", label: "Add transitions and access time" },
          { id: "programme-try-3", label: "Prepare one session cancellation" },
        ],
        evidence:
          "A versioned programme matrix showing purpose, timing, owner, participation route, needs, and fallback.",
      },
    },
    "speakers-partners": {
      why:
        "Contributors and partners are people making commitments, not content slots. Clear expectations protect trust and prevent avoidable surprises.",
      terms: [
        {
          label: "Contributor brief",
          definition:
            "The agreed audience, purpose, format, timing, support, permissions, expenses, and practical requirements for a session.",
        },
        {
          label: "In-kind support",
          definition:
            "A non-cash contribution such as venue space, staff time, promotion, equipment, food, or printing.",
        },
      ],
      tips: [
        {
          title: "Explain why this person",
          body:
            "A specific invitation should connect the contributor's work or experience to the audience need.",
        },
        {
          title: "Confirm public facts",
          body:
            "Ask contributors to approve their name, title, affiliation, biography, session description, photograph, and recording choice.",
        },
      ],
      paths: pathsFor(
        "speakers-partners",
        [sources.leeds, sources.w3c],
        {
          title: "AI-drafted personalised pack",
          bestFor: "Preparing consistent invitations and briefs from verified facts.",
          approach:
            "Generate a first draft with explicit placeholders, then let the relationship owner rewrite, send, and follow up.",
          tradeoff:
            "Consistency saves time, but generic praise or invented details can damage trust.",
          dataBoundary:
            "Use public biographies and approved event facts only. Keep contact details and negotiations outside the prompt.",
          evidence:
            "Retain verified source links, approved invitation, sent version, confirmation, needs, rights, and relationship owner.",
        },
        {
          title: "Managed contributor portal",
          bestFor: "Several speakers needing biographies, slides, travel, access, and AV coordination.",
          approach:
            "Use an approved form or portal with restricted access and one contributor record per person.",
          tradeoff:
            "Information is structured, but the form must not replace personal contact or collect unnecessary details.",
          dataBoundary:
            "Limit access to the contributor support team and set retention before collection.",
          evidence:
            "Keep data fields, privacy text, submissions, approvals, change log, and deletion record.",
        },
        {
          title: "Direct human coordination",
          bestFor: "A small programme or relationships needing personal care.",
          approach:
            "Use a local checklist while one named organiser handles each conversation directly.",
          tradeoff:
            "Warm and flexible, but status can become invisible unless it is recorded.",
          dataBoundary:
            "Private correspondence stays with authorised organisers; publish only approved facts.",
          evidence:
            "Maintain a minimal confirmation tracker, approved biography, practical needs, permissions, and final thanks.",
        },
      ),
      tryNow: {
        intro:
          "Write one invitation that is specific enough for the recipient to make an informed decision.",
        items: [
          { id: "speaker-try-1", label: "State why the person is being invited" },
          { id: "speaker-try-2", label: "Mark every unresolved commitment" },
          { id: "speaker-try-3", label: "Confirm support and permissions" },
        ],
        evidence:
          "An approved contributor pack plus a restricted tracker for confirmation, needs, permissions, and relationship ownership.",
      },
    },
    "venue-care": {
      why:
        "A valuable programme is not deliverable until capacity, movement, safety, access, food, welfare, equipment, and venue responsibilities are agreed.",
      terms: [
        {
          label: "Venue walk-through",
          definition:
            "An in-person check of the actual routes, rooms, layouts, equipment, access, exits, facilities, and handovers.",
        },
        {
          label: "Residual risk",
          definition:
            "The risk remaining after reasonable controls are in place and reviewed by the responsible people.",
        },
      ],
      tips: [
        {
          title: "Test the room and protect private needs",
          body:
            "Test routes, layouts, microphones, captions, facilities, and exits. Keep dietary, disability, health, and welfare information restricted to people who need it to act.",
        },
        {
          title: "Send access and safeguarding information early",
          body:
            "Describe access, timings, breaks, refreshments, emergencies, and how to ask for support. Check the expected audience and follow the host's current safeguarding and incident process.",
        },
      ],
      paths: pathsFor(
        "venue-care",
        [sources.leedsAccessibility, sources.leedsSafeguarding],
        {
          title: "Hosted operations checklist",
          bestFor: "Coordinating non-sensitive venue tasks across a distributed team.",
          approach:
            "Track inspections, suppliers, equipment, access actions, and owners online while sensitive needs remain restricted.",
          tradeoff:
            "Status is visible, but a checklist cannot inspect the venue or approve safety.",
          dataBoundary:
            "Do not place names, access disclosures, dietary details, incidents, door codes, or private contacts in a broad board.",
          evidence:
            "Export completed checks, owner sign-offs, test results, supplier confirmations, and unresolved actions.",
        },
        {
          title: "Venue and institution process",
          bestFor: "A university, healthcare, civic, or commercial venue with formal controls.",
          approach:
            "Use the venue's safety, capacity, access, catering, security, and incident procedures with named interfaces.",
          tradeoff:
            "Experienced support reduces uncertainty, but responsibilities can be assumed rather than explicitly agreed.",
          dataBoundary:
            "Sensitive requests and incident records stay in the approved venue or host process.",
          evidence:
            "Keep capacity approval, responsibility split, risk assessment, access review, AV test, and emergency brief.",
        },
        {
          title: "Offline event pack",
          bestFor: "A small venue or a team needing reliable documents without connectivity.",
          approach:
            "Create printed and local copies of essential plans, contacts, layouts, checklists, and escalation actions.",
          tradeoff:
            "Resilient during outages, but printed sensitive information must be minimised, controlled, and destroyed securely.",
          dataBoundary:
            "Separate general volunteer cards from restricted access, welfare, and emergency contact records.",
          evidence:
            "Record pack version, distribution, briefing, return or destruction, and post-event updates.",
        },
      ),
      tryNow: {
        intro:
          "Walk one attendee journey from arrival to departure and identify every avoidable barrier or unmanaged handoff.",
        items: [
          { id: "venue-try-1", label: "Confirm capacity and responsibilities" },
          { id: "venue-try-2", label: "Test access, audio, and fallbacks" },
          { id: "venue-try-3", label: "Protect sensitive requests" },
        ],
        evidence:
          "A signed venue walk-through, proportionate risk record, access plan, catering and AV checks, and escalation card.",
      },
    },
    registration: {
      why:
        "Registration creates a duty to handle people's information carefully and an operational need to distinguish interest from confirmed physical attendance.",
      terms: [
        {
          label: "Status dictionary",
          definition:
            "A precise definition for registered, invited, accepted, declined, cancelled, waitlisted, walk-in, checked-in, and responded.",
        },
        {
          label: "Data minimisation",
          definition:
            "Collecting only the fields required for an explained event purpose.",
        },
      ],
      tips: [
        {
          title: "Reconfirm scarce places and make cancellation easy",
          body:
            "When demand exceeds capacity, ask people to accept or release their place. A clear cancellation route releases capacity without shaming anyone who cannot attend.",
        },
        {
          title: "Plan reconciliation and walk-ins before check-in",
          body:
            "Set the unique identifier, duplicate rule, exclusions, and authoritative source. Prepare a quick consent route for safe-capacity walk-ins without displacing protected places or access provision.",
        },
      ],
      paths: pathsFor(
        "registration",
        [sources.ico, sources.hseCrowd],
        {
          title: "Hosted ticketing or form service",
          bestFor: "Public registration, automated confirmations, reminders, and a waitlist.",
          approach:
            "Configure the minimum fields, capacity, status transitions, privacy text, export, deletion, and cancellation route.",
          tradeoff:
            "Automation helps communication, but provider defaults may collect more data or obscure the final denominator.",
          dataBoundary:
            "Confirm controller and processor roles, access, location, retention, exports, and any special category data handling.",
          evidence:
            "Retain the blank form, privacy notice, status definitions, configuration, communication schedule, and deletion plan.",
        },
        {
          title: "Institution-managed registration",
          bestFor: "An event requiring approved identity, accessibility, or attendance systems.",
          approach:
            "Use the host's event system and agree how organisers receive only the information needed to act.",
          tradeoff:
            "Governance and support are clearer, but exports and custom workflows can be constrained.",
          dataBoundary:
            "Personal records stay in the institution's approved service with role-based access.",
          evidence:
            "Keep system owner, field purposes, access list, status export, reconciliation rule, and retention confirmation.",
        },
        {
          title: "Local registration register",
          bestFor: "A small invitation-only event with a low-volume manual process.",
          approach:
            "Maintain an encrypted local register and send individual communications through an approved account.",
          tradeoff:
            "The schema is controllable, but duplicates, reminders, access, backup, and deletion need manual work.",
          dataBoundary:
            "The identifiable register remains encrypted and separate from de-identified planning aggregates.",
          evidence:
            "Retain the blank schema, access record, backup test, communication log, reconciliation, and deletion record.",
        },
      ),
      tryNow: {
        intro:
          "Audit the form without using a single attendee record, then define the denominator workflow.",
        items: [
          { id: "registration-try-1", label: "Justify or remove every field" },
          { id: "registration-try-2", label: "Define each registration status" },
          { id: "registration-try-3", label: "Write the reconciliation rule" },
        ],
        evidence:
          "An approved blank form, privacy notice, status dictionary, capacity model, communication plan, and reconciliation specification.",
      },
    },
    "run-show": {
      why:
        "A public programme tells attendees what to expect. A run sheet tells the team who acts, when, with what dependency and fallback.",
      terms: [
        {
          label: "Cue",
          definition:
            "A specific signal that prompts an introduction, time warning, slide change, room action, or transition.",
        },
        {
          label: "Tabletop exercise",
          definition:
            "A discussion-based rehearsal in which the team works through a plausible disruption and records decisions.",
        },
      ],
      tips: [
        {
          title: "Rehearse boring failures against the priority stack",
          body:
            "Test missing adapters, late food, unavailable speakers, locked rooms, and absent volunteers. Put people, safety, access, speakers, and committee readiness before schedule polish.",
        },
        {
          title: "Protect the breaks",
          body:
            "Recovering time by removing every break transfers programme risk to accessibility, welfare, food, and networking.",
        },
      ],
      paths: pathsFor(
        "run-show",
        [sources.hsePlan, sources.hseVenue],
        {
          title: "Live collaborative run sheet",
          bestFor: "A larger team updating non-sensitive operational status in real time.",
          approach:
            "Use a shared view with one editor or controlled roles, a frozen baseline, and an offline export.",
          tradeoff:
            "Changes are visible, but connectivity, permissions, accidental edits, and notification overload require controls.",
          dataBoundary:
            "Use role contacts rather than broad personal details and keep incidents or needs in restricted channels.",
          evidence:
            "Save the approved baseline, access roles, offline copy, change history, scenario results, and final delivered version.",
        },
        {
          title: "Venue command plan",
          bestFor: "An event with venue staff, security, AV, catering, and multiple organisers.",
          approach:
            "Join the event run sheet to venue handovers, emergency procedures, supplier timings, and escalation contacts.",
          tradeoff:
            "Interfaces are explicit, but a late programme change can affect several teams at once.",
          dataBoundary:
            "Share each team only the operational and contact information it needs.",
          evidence:
            "Keep the responsibility handoff, brief attendance, AV check, supplier confirmation, and change approval route.",
        },
        {
          title: "Printed command folder",
          bestFor: "A single-site event requiring resilience when Wi-Fi or devices fail.",
          approach:
            "Print a numbered, time-stamped run sheet and role cards, then nominate one master copy for changes.",
          tradeoff:
            "Reliable and quick to scan, but changed copies can diverge and private details can be misplaced.",
          dataBoundary:
            "Use minimal role contacts, control copies, and return or destroy them after close-out.",
          evidence:
            "Retain the master version, distribution list, briefing record, handwritten changes, and archived delivered schedule.",
        },
      ),
      tryNow: {
        intro:
          "Run a ten-minute tabletop for one missing contributor and one failed piece of AV.",
        items: [
          { id: "run-try-1", label: "Name the live decision-maker" },
          { id: "run-try-2", label: "State who must be told and how" },
          { id: "run-try-3", label: "Record the archive update" },
        ],
        evidence:
          "A versioned run sheet, volunteer brief, contact card, offline fallback, and tabletop action log.",
      },
    },
    deliver: {
      why:
        "The team needs a shared operational picture, but people responsible for safety, welfare, access, and relationships must retain live authority.",
      terms: [
        {
          label: "Live decision log",
          definition:
            "A minimal time-stamped record of a material change, its human approver, communication, and follow-up.",
        },
        {
          label: "Close-out",
          definition:
            "The deliberate handover, reconciliation, cleanup, file control, welfare check, and venue release after the programme ends.",
        },
      ],
      tips: [
        {
          title: "Use roles and protect the people delivering the day",
          body:
            "Use role labels where a broad team does not need personal contact details. Make sure speakers know where to be and organisers can eat, take breaks, listen, and ask for help.",
        },
        {
          title: "Be relaxed about harmless variation",
          body:
            "A spare-capacity walk-in, a small timing drift, or a room-layout change may need only a quick note. Escalate changes that affect safety, access, capacity, consent, speakers, money, or the event purpose.",
        },
      ],
      paths: pathsFor(
        "deliver",
        [sources.hsePlan, sources.ico],
        {
          title: "Shared event-day command view",
          bestFor: "A distributed team with reliable devices and a controlled collaboration service.",
          approach:
            "Track timing, owners, status, non-sensitive changes, and follow-up without turning the board into an incident system.",
          tradeoff:
            "A common view helps coordination, but screens can distract from participants and sensitive notes can spread.",
          dataBoundary:
            "No attendee names, needs, incidents, private contacts, or unapproved photographs enter the broad view.",
          evidence:
            "Export the delivered timeline, human approvals, public changes, handovers, and close-out status.",
        },
        {
          title: "Managed incident and operations split",
          bestFor: "A venue with separate event, security, first aid, welfare, and technical processes.",
          approach:
            "Use the run sheet for routine coordination and route incidents immediately into the accountable venue process.",
          tradeoff:
            "Specialist owners respond appropriately, but every volunteer must understand the escalation boundary.",
          dataBoundary:
            "Incident and sensitive welfare data remain in the restricted authorised system.",
          evidence:
            "Keep briefing attendance, escalation test, non-sensitive decision log, formal incident references, and handover.",
        },
        {
          title: "Radio, card, and paper log",
          bestFor: "A single venue where movement and unreliable connectivity make screens impractical.",
          approach:
            "Coordinate through named roles, short radio protocol, printed cards, and one controlled paper log.",
          tradeoff:
            "Fast and resilient, but transcription and secure storage are required after the event.",
          dataBoundary:
            "Use minimum information on radio and paper; move private conversations to the authorised person.",
          evidence:
            "Retain the de-identified master log, change approvals, equipment return, close-out, and archive update.",
        },
      ),
      tryNow: {
        intro:
          "Walk through the final thirty minutes, when fatigue and unclear ownership often create missed handovers.",
        items: [
          { id: "deliver-try-1", label: "Assign cleanup and equipment owners" },
          { id: "deliver-try-2", label: "Reconcile files and consent choices" },
          { id: "deliver-try-3", label: "Confirm the venue handover" },
        ],
        evidence:
          "A minimal event-day log, delivered programme, consent-respecting media record, and signed close-out checklist.",
      },
    },
    evaluate: {
      why:
        "A successful day can still be described badly. Reconciled denominators, respondent limits, and follow-up evidence keep the public record useful and credible.",
      terms: [
        {
          label: "Respondent denominator",
          definition:
            "The number of people who answered the relevant question, which may differ between items and from event attendance.",
        },
        {
          label: "Contribution claim",
          definition:
            "A bounded statement about what the event plausibly supported, distinct from claiming it caused a later outcome.",
        },
      ],
      tips: [
        {
          title: "Use a denominator ledger, not a neat funnel",
          body:
            "Registrations, attendance, walk-ins, speakers, volunteers, duplicates, and feedback may not form one nested cohort. Define every count, source, exclusion, and reconciliation status before drawing a rate.",
        },
        {
          title: "Ask later",
          body:
            "A short follow-up after several weeks can reveal contacts, applications, collaborations, or further events that same-day satisfaction cannot.",
        },
      ],
      paths: pathsFor(
        "evaluate",
        [sources.leeds, sources.ico],
        {
          title: "Approved aggregate analysis",
          bestFor: "Creating a dashboard or report from de-identified, reviewed aggregates.",
          approach:
            "Reconcile identifiable source records inside the approved boundary, then give the analysis tool only bounded aggregate tables.",
          tradeoff:
            "Charts and drafts are quick, but small cells, free text, and vague denominators can still mislead or identify people.",
          dataBoundary:
            "No raw attendee records, private comments, access needs, or contact details enter a general-purpose AI service.",
          evidence:
            "Keep the reconciliation specification, aggregate snapshot, denominator checks, analysis version, reviewer, and public release.",
        },
        {
          title: "Institutional evaluation and archive",
          bestFor: "Events needing sponsor reporting, certificate checks, controlled records, or long-term stewardship.",
          approach:
            "Reconcile and analyse within approved systems, then deposit a redacted after-action report and delivered programme.",
          tradeoff:
            "Governance is stronger, but feedback access, retention, and reporting timelines need coordination.",
          dataBoundary:
            "Identifiable records remain role-restricted and public outputs pass disclosure and consent review.",
          evidence:
            "Retain data definitions, access log, reconciliation, report approval, archive location, retention, and deletion.",
        },
        {
          title: "Local reproducible evaluation",
          bestFor: "A small team that can analyse records securely on one controlled machine.",
          approach:
            "Use a local script or spreadsheet to deduplicate, define cohorts, calculate aggregates, and generate a redacted report.",
          tradeoff:
            "Processing stays controlled, but the team must test formulas, preserve source records, and arrange independent review.",
          dataBoundary:
            "Identifiable inputs stay encrypted locally; only disclosure-checked aggregates leave the boundary.",
          evidence:
            "Keep input hashes, field definitions, script or formulas, checked outputs, limitations, review, and publication approval.",
        },
      ),
      tryNow: {
        intro:
          "Write one accurate result sentence from a small aggregate and one limitation that prevents overclaiming.",
        items: [
          { id: "evaluate-try-1", label: "State numerator and denominator" },
          { id: "evaluate-try-2", label: "Separate respondents from attendees" },
          { id: "evaluate-try-3", label: "Assign one later follow-up" },
        ],
        evidence:
          "A reproducible reconciliation, aggregate results table, limitations, after-action review, delivered archive, and follow-up register.",
      },
    },
  },
};
