import type { Workshop } from "@/lib/types";

const leedsAiWeekSource = {
  title: "Leeds AI Week 2026",
  url: "https://www.leedsaiweek.co.uk",
};

const conferencePageSource = {
  title: "AI in Healthcare Conference programme",
  url: "https://www.leedsaiweek.co.uk/ai-in-healthcare",
};

const luuListingSource = {
  title: "Leeds University Union event listing",
  url: "https://engage.luu.org.uk/events/87BV2/ai-in-healthcare-conference-2026",
};

const aiMedicalCdtSource = {
  title:
    "UKRI Centre for Doctoral Training in Artificial Intelligence for Medical Diagnosis and Care",
  url: "https://ai-medical.leeds.ac.uk",
};

const npicSource = {
  title: "National Pathology Imaging Co-operative",
  url: "https://npic.ac.uk",
};

const hsePlanningSource = {
  title: "HSE event safety: getting started",
  url: "https://www.hse.gov.uk/event-safety/getting-started.htm",
};

const hseCrowdSource = {
  title: "HSE event safety: assess crowd safety risks",
  url: "https://www.hse.gov.uk/event-safety/crowd-management-assess.htm",
};

const hseVenueSource = {
  title: "HSE event safety: venue and site design",
  url: "https://www.hse.gov.uk/event-safety/venue-site-design.htm",
};

const icoEventSource = {
  title: "ICO privacy notice for events, seminars, and workshops",
  url: "https://ico.org.uk/global/privacy-notice/attend-an-event-seminar-or-workshop/",
};

const w3cEventSource = {
  title: "W3C guidance for accessible presentations and events",
  url: "https://www.w3.org/WAI/teach-advocate/accessible-presentations/",
};

const leedsAccessibleEventSource = {
  title: "University of Leeds guidance for making events accessible",
  url: "https://equality.leeds.ac.uk/support-and-resources/accessibility-guidance/making-your-event-accessible/",
};

const leedsSafeguardingSource = {
  title: "University of Leeds policy on safeguarding particular groups",
  url: "https://secretariat.leeds.ac.uk/policy-on-safeguarding-children-young-persons-and-adults-in-vulnerable-circumstances/",
  note: "The University marks this policy as under review from June 2026. Recheck the current approved process before relying on it.",
};

const recapPostSource = {
  title: "Public organiser recap with conference photographs",
  url: "https://www.linkedin.com/posts/mohammad-tasfiq-jawaad_leedsaiweek-ai-healthcare-ugcPost-7428858664037396480-NJEn/",
  note: "Conference photographs and post-event reflections from co-organiser Mohammad Tasfiq Jawaad.",
};

const openingPostSource = {
  title: "Public opening keynote update with conference photographs",
  url: "https://www.linkedin.com/posts/mohammad-tasfiq-jawaad_leedsaiweek-healthcare-ai-activity-7428762183339180032-_Vyb",
  note: "Opening-day photographs and updates from co-organiser Mohammad Tasfiq Jawaad.",
};

export const aiHealthcareConference: Workshop = {
  slug: "ai-healthcare-conference",
  number: "04",
  shortTitle: "AI healthcare conference",
  title: "Run an AI in Healthcare Conference",
  navTitle: "Healthcare conference",
  description:
    "Build a safe, useful research event from a local need. Follow a first-hand Leeds AI Week case through delivery and evaluation.",
  promise:
    "Finish with a brief, responsibility map, costed programme, speaker pack, safety checks, versioned run sheet, evaluation plan, and public record.",
  duration: "10 stages · about 85 guided minutes",
  projectTime:
    "A one-day conference normally needs months. Smaller events can move faster, but safety, accessibility, privacy, and speaker care still need named owners.",
  audience:
    "Students, researchers, clinicians, technical communities, and local organisers convening people around AI in healthcare.",
  prerequisites: [
    "A clear local need and one accountable event lead",
    "A host organisation or venue contact who can confirm approval, capacity, safety, and access requirements",
    "A small organising group with named responsibility for programme, money, communications, and delivery",
    "Permission to process registration data and a plan that keeps personal or sensitive details out of general-purpose AI tools",
  ],
  outcomes: [
    "Define the conference around a community outcome",
    "Build a transparent team structure with decision rights, deadlines, budget limits, and escalation routes",
    "Design an interdisciplinary programme that connects research careers, practical methods, and the wider public",
    "Use AI to compare options and prepare materials while people own relationships, commitments, safety, and public claims",
    "Measure registrations, verified attendance, feedback, and follow-up with explicit denominators and honest limitations",
  ],
  quickRoute: ["purpose", "registration", "evaluate"],
  accent: "rose",
  startLabel: "Define the community outcome",
  caseStudy: {
    eyebrow: "First-hand Leeds AI Week case",
    title: "A student-led conference built from local relationships",
    context:
      "We ran the AI in Healthcare Conference on Sunday 15 February 2026 at Helix, University of Leeds, as the final day of Leeds AI Week. The programme combined three keynotes, a digital pathology workshop, a panel, student competitions and time for people to meet.",
    expected:
      "We wanted to make local healthcare AI work visible, help people understand routes into interdisciplinary research, and create conversations across students, researchers, industry, and the wider community.",
    observed: [
      "The panel brought together current researchers from the UKRI Centre for Doctoral Training in Artificial Intelligence for Medical Diagnosis and Care, with different academic, professional, medical, surgical and industry routes into research.",
      "The panel discussed the benefits and realities of doing a PhD while giving people outside the immediate research group a route into the conversation.",
      "The National Pathology Imaging Co-operative digital pathology workshop was led by three CDT graduates whose doctoral work involved digital histopathology. Their later local employment and continuing university relationships showed how a research network can persist beyond a PhD.",
      "We had over a dozen submitted essays and posters, with one winner and one runner-up in each category.",
      "We received 135 registrations and had about 74 attendees on the day, in addition to the organising committee.",
      "Thirty feedback forms were returned. Mean ratings were 4.63 out of 5 for satisfaction, 4.67 for content value, and 4.73 for organisation.",
      "Among the 30 respondents, 22 said they had not attended a similar AI or healthcare conference and 28 said yes or maybe to future involvement.",
      "We dropped the advertised second workshop because the day was already full, moved its main points into the final panel, and shared the revised schedule before and at the event.",
      "Two co-chairs worked with a financial officer, an AI Week chair and webmaster, three speaker coordinators, a marketing lead, and a general volunteer. A small group also stayed ready for last-minute work.",
      "A free university venue and sponsorship from the AI-Medical CDT let us spend most of the small budget on food, with a smaller amount used for a banner and no cash prizes.",
    ],
    changes: [
      "Keep a public programme and a separate versioned operational run sheet, then archive what was actually delivered.",
      "Use existing relationships to open doors, but design sessions so that people outside those networks can participate.",
      "Treat career routes and research collaboration as programme outcomes.",
      "Reconcile registration, acceptance, walk-in, check-in, and feedback records before publishing attendance or response rates.",
      "Protect safety, consent, access, speaker commitments, committee welfare, and decision ownership while remaining flexible about walk-ins, small timing changes, and session format.",
      "Recruit for reliability and constructive progress, record who decides when consensus stalls, and keep two or three people available for urgent tasks.",
    ],
    boundary:
      "The ratings come from 30 feedback respondents, most of whom were students or trainees. Registration, RSVP, check-in and attendance records served different purposes, so the tutorial reports them separately and uses about 74 as the on-day attendance figure. Personal registration, dietary and access details are never published.",
    sources: [
      leedsAiWeekSource,
      conferencePageSource,
      luuListingSource,
      aiMedicalCdtSource,
      npicSource,
      recapPostSource,
      openingPostSource,
    ],
  },
  assessment: [
    {
      id: "conference-denominator",
      question:
        "A registration workbook contains duplicate emails, accepted invitations, walk-ins, and incomplete check-in flags. Which attendance headline is ready to publish?",
      options: [
        {
          id: "largest-sheet",
          label: "Use the largest row count",
          correct: false,
          feedback:
            "Rows can represent different workflow stages and can include duplicates. A large number is not automatically the attendance denominator.",
        },
        {
          id: "roughly-half",
          label: "Report that roughly half attended",
          correct: false,
          feedback:
            "An estimate can guide planning, but it should not replace a reconciled public result.",
        },
        {
          id: "reconcile-first",
          label: "Define each status and reconcile unique verified people first",
          correct: true,
          feedback:
            "Correct. Publish registrations, accepted places, verified attendance, walk-ins, and responses separately, with definitions and limitations.",
        },
      ],
    },
    {
      id: "conference-private-data",
      question:
        "An organiser wants AI to analyse a registration export containing names, emails, dietary needs, and accessibility requests. What should happen?",
      options: [
        {
          id: "upload-private",
          label: "Upload it because the event is public",
          correct: false,
          feedback:
            "A public event does not make registration records public. Some needs may reveal sensitive information.",
        },
        {
          id: "remove-names-only",
          label: "Delete names but keep every other field",
          correct: false,
          feedback:
            "Email addresses, free text, small groups, and combinations of attributes can still identify people.",
        },
        {
          id: "minimise-and-approve",
          label: "Use an approved process and the minimum de-identified fields",
          correct: true,
          feedback:
            "Correct. Confirm the lawful purpose, access, retention, tool approval, aggregation, and disclosure risk before analysis.",
        },
      ],
    },
    {
      id: "conference-live-change",
      question:
        "A workshop leader becomes unavailable on the day. What is the best response?",
      options: [
        {
          id: "pretend-delivered",
          label: "Leave the published record unchanged",
          correct: false,
          feedback:
            "The archived programme would then claim something that did not happen.",
        },
        {
          id: "agent-decides",
          label: "Let an AI scheduling tool choose a replacement session",
          correct: false,
          feedback:
            "A live change affects people, commitments, accessibility, timing, and safety. An accountable organiser must decide.",
        },
        {
          id: "controlled-change",
          label: "Use the agreed fallback, brief the team, and record the change",
          correct: true,
          feedback:
            "Correct. Communicate the change clearly, protect breaks and essential logistics, and update the post-event record.",
        },
      ],
    },
  ],
  glossary: [
    {
      term: "Conference brief",
      definition:
        "A one-page statement of purpose, audience, intended outcomes, constraints, and non-goals.",
    },
    {
      term: "Stakeholder map",
      definition:
        "A record of the communities, partners, contributors, decision-makers, and people affected by the event.",
    },
    {
      term: "Decision rights",
      definition:
        "An explicit account of who proposes, approves, delivers, and is informed about each material decision.",
    },
    {
      term: "Run sheet",
      definition:
        "The operational schedule with timings, owners, rooms, cues, contacts, dependencies, and fallbacks.",
    },
    {
      term: "Change control",
      definition:
        "A simple process for approving, communicating, and recording a departure from the agreed plan.",
    },
    {
      term: "Safe capacity",
      definition:
        "The occupancy permitted after venue layout, access, exits, staffing, and relevant risk controls are considered.",
    },
    {
      term: "Reasonable adjustment",
      definition:
        "A change that reduces a barrier for a disabled participant, speaker, volunteer, or attendee.",
    },
    {
      term: "Data minimisation",
      definition:
        "Collecting and retaining only the personal information needed for a stated purpose.",
    },
    {
      term: "Verified attendance",
      definition:
        "A person counted through a declared physical check-in method rather than inferred from registration.",
    },
    {
      term: "No-show rate",
      definition:
        "The proportion of a clearly defined booked or confirmed group that did not attend, using reconciled unique-person records.",
    },
    {
      term: "Response rate",
      definition:
        "The number of eligible people who responded divided by a declared eligible denominator.",
    },
    {
      term: "After-action review",
      definition:
        "A structured reflection on what was intended, what happened, why it differed, and what should change.",
    },
  ],
  steps: [
    {
      id: "purpose",
      title: "Define the community outcome",
      duration: "8 minutes guided",
      checkpointLabel: "Purpose gate",
      summary:
        "Start with the people and change the event should serve. A full room is an operating constraint, not the purpose.",
      action:
        "Write a one-page brief naming the primary community, intended outcomes, non-goals, success indicators, constraints, and final human owner.",
      output: "conference-brief.md",
      prompt: `Interview me as a critical conference adviser. Ask about the local need, primary and secondary audiences, what people should understand or do afterwards, why a live event is useful, non-goals, budget and capacity constraints, and who owns the final decision. Do not invent local needs or treat registrations as impact. End with a one-page conference brief, five unresolved questions, and three ways the idea could fail.`,
      checkpoint:
        "A person outside the organising group can explain who the event is for, what should change, what is out of scope, and who can approve commitments.",
      watchFor:
        "Do not use AI to manufacture a community need. Speak to potential attendees and local groups before fixing the format.",
      videoCue:
        "Turn the vague goal 'run an AI conference' into a brief centred on local healthcare AI careers, research exchange, and wider community access.",
      sources: [leedsAiWeekSource, luuListingSource],
    },
    {
      id: "community",
      title: "Learn from organisers and map the local network",
      duration: "8 minutes guided",
      checkpointLabel: "Community gate",
      summary:
        "Ask people who have delivered events, identify communities already doing the work, and record what each relationship can and cannot provide.",
      action:
        "Build a stakeholder map and advice log covering potential attendees, speakers, societies, institutions, community groups, sponsors, venue teams, and overlooked voices.",
      output: "stakeholders-and-advice.csv",
      prompt: `Help me structure a stakeholder map from the notes below. Separate confirmed relationships from possible introductions. For each group, record why the event matters to them, what we should ask, what we can offer, who owns the relationship, and any risk of over-representing one network. Do not infer endorsements. Finish with an interview guide for experienced event organisers and five groups we may be missing.

Notes:
[Paste non-sensitive notes here]`,
      checkpoint:
        "Every priority group has a named human contact or an ethical outreach route, and advice that changed the plan is recorded.",
      watchFor:
        "A strong personal network can accelerate invitations while quietly narrowing the programme. Keep an open route for people outside the organisers' circles.",
      videoCue:
        "Show how advice from previous conference organisers and university societies becomes decisions, owners, and a record of unresolved gaps.",
      sources: [leedsAiWeekSource, luuListingSource],
    },
    {
      id: "team-budget",
      title: "Set roles, decision rights, and a bounded budget",
      duration: "10 minutes guided",
      checkpointLabel: "Authority gate",
      summary:
        "Give programme, finance, administration, web, communications, safety, access, and event-day work accountable owners before invitations or spending accelerate.",
      action:
        "Create a responsibility matrix, approval thresholds, timeline, budget ledger, contingency, and escalation route.",
      output: "team-budget-and-decisions.xlsx",
      prompt: `Act as a project coordinator. Turn the proposed tasks, dates, and cost estimates below into a responsibility matrix and milestone plan. Mark each figure as quote, estimate, confirmed, or paid. Identify single points of failure, unowned safety or accessibility work, dependencies, and decisions that need formal approval. Do not choose people, approve spending, or invent prices.

Inputs:
[Paste roles, dates, and non-sensitive estimates here]`,
      checkpoint:
        "Each critical task has one accountable owner, a deadline, a backup, an approval route, and a budget status that can be audited. The team also names a final decision route and two or three people available for urgent work.",
      watchFor:
        "Many volunteers does not mean shared accountability. Recruit for constructive progress, avoid invisible labour and unclear reimbursements, and record who decides when consensus stalls.",
      videoCue:
        "Build the Leeds role map, then show how an overview owner, a final decision route, and a small surge team reduce last-minute confusion.",
      sources: [hsePlanningSource],
    },
    {
      id: "programme",
      title: "Design a programme with different ways to participate",
      duration: "10 minutes guided",
      checkpointLabel: "Programme gate",
      summary:
        "Connect keynotes, practical learning, careers, discussion, breaks, and participant contributions to the outcomes in the brief.",
      action:
        "Draft a programme matrix with audience purpose, format, owner, duration, accessibility needs, evidence boundary, and fallback for every session.",
      output: "programme-matrix.csv",
      prompt: `Compare three programme options for the audience and outcomes below. Include talks, a practical session, a career or community discussion, participant contributions, breaks, and unstructured conversation. For each option, identify whose viewpoint is missing, cognitive load, timing risk, and a fallback if one session is cancelled. Do not invent speakers or promise participation. Preserve time for lunch, access needs, questions, and transitions.

Audience and outcomes:
[Paste the approved brief here]`,
      checkpoint:
        "Every session has a purpose, owner, realistic transition, accessible participation route, and fallback. The programme includes more than one professional or disciplinary viewpoint.",
      watchFor:
        "A long sequence of expert talks can look prestigious while leaving little room for questions, new voices, practical learning, or rest. Do not keep a low-value session only because it was advertised.",
      videoCue:
        "Compare the advertised Leeds programme with what was delivered, including the cancelled second workshop and the organiser joining the panel.",
      sources: [conferencePageSource, w3cEventSource],
    },
    {
      id: "speakers-partners",
      title: "Invite speakers and partners with clear expectations",
      duration: "8 minutes guided",
      checkpointLabel: "Commitment gate",
      summary:
        "Use relationships thoughtfully, make the invitation specific, and agree what support, credit, expenses, consent, and preparation each contributor receives.",
      action:
        "Prepare an invitation, contributor brief, partner record, biography check, access request route, rights permission, and named relationship owner.",
      output: "speaker-and-partner-pack.md",
      prompt: `Draft a warm, concise contributor invitation from the confirmed facts below. State why this person is being approached, the audience, session purpose, date, venue, expected contribution, preparation, expenses status, accessibility contact, recording and photography choice, and response deadline. Mark every missing fact in square brackets. Do not exaggerate prestige, imply payment, or claim an endorsement.

Confirmed facts:
[Paste approved facts here]`,
      checkpoint:
        "Each contributor has confirmed the correct title, format, timing, practical needs, expenses, public biography, photography or recording choice, and main contact.",
      watchFor:
        "AI can draft correspondence but cannot hold a relationship. A named organiser should personalise, send, answer, and record every commitment.",
      videoCue:
        "Show how existing CDT, university, and local industry relationships supported keynotes, a PhD panel, and the digital pathology workshop.",
      sources: [
        conferencePageSource,
        luuListingSource,
        aiMedicalCdtSource,
        npicSource,
      ],
    },
    {
      id: "venue-care",
      title: "Plan the venue, safety, access, food, and AV",
      duration: "10 minutes guided",
      checkpointLabel: "Care gate",
      summary:
        "Treat safe capacity, accessibility, dietary needs, equipment, breaks, travel, photography, and emergency arrangements as core programme design.",
      action:
        "Complete a venue walk-through, proportionate risk assessment, access plan, catering calculation, AV test, photography process, and escalation card.",
      output: "venue-care-and-risk-pack.md",
      prompt: `Review the event plan below as a cautious operations assistant. Produce questions for the venue and accountable organiser about capacity, layout, exits, first aid, emergencies, access, microphones, captions, quiet space, travel, dietary requirements, allergens, photography, safeguarding, insurance, and AV. Separate legal or institutional decisions from practical checks. Do not declare the event safe or accessible.

Plan:
[Paste non-sensitive operational details here]`,
      checkpoint:
        "The venue and event owners have approved capacity and responsibilities. Access requests, food information, emergency actions, AV fallbacks, photography choices, safeguarding scope, and incident escalation have named processes.",
      watchFor:
        "Do not infer that a modern venue is accessible or that dietary and access details are ordinary survey data. Ask, minimise, protect, and act on them. Check whether under-18s or protected participants may attend and follow the host's current process.",
      videoCue:
        "Walk through the operational checklist, then show how low-cost snacks and a standard lunch still require quantities, allergens, owners, and contingencies.",
      sources: [
        hsePlanningSource,
        hseCrowdSource,
        hseVenueSource,
        w3cEventSource,
        leedsAccessibleEventSource,
        leedsSafeguardingSource,
        icoEventSource,
      ],
    },
    {
      id: "registration",
      title: "Register, communicate, and forecast honestly",
      duration: "9 minutes guided",
      checkpointLabel: "Registration gate",
      summary:
        "Collect only what the event needs, define each registration status, and plan reminders, cancellations, waitlists, and catering without presenting a forecast as attendance.",
      action:
        "Create a minimised registration schema, privacy notice, status dictionary, communications calendar, capacity model, and check-in reconciliation plan.",
      output: "registration-and-communications-plan.md",
      prompt: `Audit this proposed registration form and communications plan. For every field, ask what purpose requires it, who can access it, how long it is retained, whether it could reveal sensitive information, and whether a less intrusive alternative works. Then define registered, invited, accepted, cancelled, waitlisted, walk-in, checked-in, and feedback respondent. Create low, central, and high attendance scenarios, but do not predict an exact turnout without evidence.

Draft:
[Paste field names and communication dates, never attendee records]`,
      checkpoint:
        "The form is approved and minimised, statuses have one meaning, capacity is enforced, reminders and cancellation routes are scheduled, and no private attendee data enters an unapproved AI tool.",
      watchFor:
        "Registration, acceptance, attendance, room occupancy, and feedback are different denominators. Keep unique-person records and document late or manual changes.",
      videoCue:
        "Use a synthetic workbook to show why duplicate emails and mixed HERE, NEW, and Accepted fields cannot support a headline until reconciled.",
      sources: [icoEventSource, hseCrowdSource],
    },
    {
      id: "run-show",
      title: "Build the run sheet and rehearse failure",
      duration: "8 minutes guided",
      checkpointLabel: "Readiness gate",
      summary:
        "Translate the public programme into an operational clock with owners, contacts, cues, dependencies, fallbacks, and authority for live changes.",
      action:
        "Create a minute-level run sheet, contact card, volunteer briefing, speaker arrival plan, room reset checklist, and three tabletop scenarios.",
      output: "event-run-sheet.xlsx",
      prompt: `Convert the approved programme into an operational run sheet. Include setup, registration, speaker arrival, AV checks, introductions, time cues, transitions, breaks, food, competitions, photographs, cleanup, owners, contacts, dependencies, and fallbacks. Then simulate a missing speaker, AV failure, and attendance outside the catering forecast. Do not make safety decisions or contact anyone.

Programme:
[Paste the approved programme here]`,
      checkpoint:
        "Every minute that needs coordination has an owner, the team has rehearsed the main fallbacks, and one accountable person can approve and communicate live changes.",
      watchFor:
        "The public agenda is not a run sheet. Missing transition, setup, food, and cleanup time creates avoidable pressure. Rank people and safety, speaker and committee readiness, core participant value, and production polish in that order.",
      videoCue:
        "Rehearse the loss of the second workshop and show the exact decisions, announcements, timing changes, and archive update it triggers.",
      sources: [hsePlanningSource, hseVenueSource],
    },
    {
      id: "deliver",
      title: "Deliver, adapt, and preserve consent",
      duration: "7 minutes guided",
      checkpointLabel: "Live control gate",
      summary:
        "Run the room through named people, protect agreed boundaries, stay flexible on harmless variation, communicate changes, and record decisions without turning the day into a data collection exercise.",
      action:
        "Use a live command view for timings, incidents, changes, consent choices, check-in exceptions, and handover notes, then close the venue deliberately.",
      output: "event-day-log.md",
      prompt: `Act only as a note-structuring assistant. Turn the de-identified operational updates below into a time-stamped event log with decision, human approver, action, communication, and follow-up. Flag safety, access, privacy, or welfare issues for the responsible person immediately. Do not recommend overriding venue instructions, infer attendance, identify people, or publish the log.

Updates:
[Paste de-identified updates here]`,
      checkpoint:
        "The team can account for material programme changes and operational issues, consent choices remain respected, and the venue, finances, files, and equipment have a named close-out.",
      watchFor:
        "Do not let live note-taking expose attendee details. Walk-ins are welcome only while safe capacity and the minimum check-in process hold. Emergencies, welfare, safety, and access needs go to accountable people, not a chatbot.",
      videoCue:
        "Show a calm change-control record for the actual programme difference, followed by a deliberate handover and venue close.",
      sources: [hsePlanningSource, hseVenueSource, icoEventSource],
    },
    {
      id: "evaluate",
      title: "Reconcile outcomes and sustain the community",
      duration: "7 minutes guided",
      checkpointLabel: "Evidence gate",
      summary:
        "Separate reach, experience, learning, follow-up, and longer-term collaboration. Publish denominators and uncertainty, then turn lessons into reusable assets.",
      action:
        "Reconcile registration and attendance, analyse de-identified feedback, complete an after-action review, thank contributors, archive the delivered programme, and assign follow-up owners.",
      output: "conference-evaluation-and-follow-up.md",
      prompt: `Analyse only the aggregated event results below. For every percentage, state numerator, denominator, missingness, and whether the sample is attendees, respondents, or another group. Separate descriptive results from interpretation. Draft an after-action review with planned, observed, explanation, keep, change, unresolved, and named follow-up fields. Do not infer causation, quote private comments, or claim community impact from satisfaction alone.

Aggregates:
[Paste approved aggregate results here]`,
      checkpoint:
        "Every public number has a defined denominator, the delivered programme is archived, limitations are visible, contributors are thanked, and each promised follow-up has an owner and date.",
      watchFor:
        "High ratings from voluntary respondents are useful but do not represent everyone. Engagement reactions, registrations, attendance, learning, and later collaboration are different outcomes.",
      videoCue:
        "Build the Leeds feedback summary from 30 responses, keep that denominator visible, and report registration, attendance and feedback as separate measures.",
      sources: [conferencePageSource, recapPostSource, openingPostSource],
    },
  ],
  sourceLibrary: [
    {
      ...leedsAiWeekSource,
      note: "Primary public record for the wider week and the conference's place within it.",
    },
    {
      ...conferencePageSource,
      note: "The published programme and starting point for the final schedule delivered on the day.",
    },
    {
      ...luuListingSource,
      note: "Primary public event listing for format, venue, collaborators, sponsors, and participant competitions.",
    },
    {
      ...recapPostSource,
      note: "Conference photographs, public reactions and the organising team's post-event reflections.",
    },
    {
      ...openingPostSource,
      note: "Opening-day photographs and a public account of the conference as it happened.",
    },
    {
      ...aiMedicalCdtSource,
      note: "The doctoral training community that supported the event and contributed researchers, graduates and sponsorship.",
    },
    {
      ...npicSource,
      note: "The Leeds-based digital pathology collaboration represented in the practical workshop.",
    },
    {
      ...hsePlanningSource,
      note: "Official starting point for proportionate event safety planning and clear responsibilities.",
    },
    {
      ...hseCrowdSource,
      note: "Official guidance for assessing crowd, arrival, circulation, capacity, and departure risks.",
    },
    {
      ...hseVenueSource,
      note: "Official guidance for clarifying organiser and venue responsibilities.",
    },
    {
      ...w3cEventSource,
      note: "Practical accessibility questions for organisers, speakers, venues, materials, and audience participation.",
    },
    {
      ...leedsAccessibleEventSource,
      note: "Local guidance covering invitations, timing, venue access, refreshments, emergency evacuation, and accessible materials.",
    },
    {
      ...leedsSafeguardingSource,
      note: "Local policy for activities that may involve children, young people, or adults in vulnerable circumstances. The page says the policy is under review from June 2026.",
    },
    {
      ...icoEventSource,
      note: "An official example of event data handling, including contact, dietary, and access information.",
    },
  ],
};
