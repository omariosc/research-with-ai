"use client";

import { Check, ExternalLink } from "./Icons";

export const CONFERENCE_CHECK_ITEMS = [
  {
    id: "map-local-ecosystem",
    label:
      "Map researchers, alumni, industry, clinicians and community groups before programming.",
  },
  {
    id: "assign-decision-rights",
    label:
      "Name the decision lead, coordinator and two or three people for urgent work.",
  },
  {
    id: "separate-boundaries-flexibility",
    label:
      "Write the firm boundaries and harmless changes the team can accept.",
  },
  {
    id: "record-programme-changes",
    label:
      "Keep advertised, revised and delivered programmes with reasons for changes.",
  },
  {
    id: "define-event-denominators",
    label:
      "Report registrations, RSVPs, check-ins, walk-ins, committee and feedback separately.",
  },
  {
    id: "clear-media-rights",
    label:
      "Record the source, rightsholder, permission, caption and alt text for every published photograph.",
  },
] as const;

const eventImages = [
  {
    src: "/images/ai-healthcare-conference/opening-mohammad-jawaad.jpg",
    width: 1280,
    height: 960,
    alt: "Mohammad Tasfiq Jawaad speaks at a lectern beside a Leeds AI Week 2026 title slide while attendees sit in the foreground.",
    caption: "Opening remarks linked the conference to Leeds AI Week.",
  },
  {
    src: "/images/ai-healthcare-conference/closing-mohammad-jawaad.jpg",
    width: 1280,
    height: 720,
    alt: "Mohammad Tasfiq Jawaad gives closing remarks beside a Leeds AI Week 2026 slide while attendees face the lectern.",
    caption: "Closing remarks recorded changes, thanks and next steps.",
  },
  {
    src: "/images/ai-healthcare-conference/audience-wide.jpg",
    width: 1280,
    height: 959,
    alt: "A seated audience watches a presentation on two screens in the Helix event space.",
    caption: "The Helix space supported talks, workshops and discussion.",
  },
  {
    src: "/images/ai-healthcare-conference/healthcare-it-landscape.jpg",
    width: 1280,
    height: 720,
    alt: "A presenter gestures towards a slide mapping fragmented healthcare IT systems across West Yorkshire.",
    caption: "Healthcare AI was discussed within fragmented local systems.",
  },
  {
    src: "/images/ai-healthcare-conference/nhs-data-ai-healthcare.jpg",
    width: 1280,
    height: 960,
    alt: "A presenter discusses using NHS data for AI-driven healthcare beside two matching presentation screens.",
    caption: "A keynote covered the value and difficulty of using NHS data.",
  },
  {
    src: "/images/ai-healthcare-conference/conference-session-wide.jpg",
    width: 1280,
    height: 960,
    alt: "Attendees face several presenters and two technical slides at the front of the Helix event space.",
    caption: "Several formats offered different routes into healthcare AI.",
  },
  {
    src: "/images/ai-healthcare-conference/sharib-ali-surgical-vision.jpg",
    width: 1280,
    height: 960,
    alt: "Sharib Ali presents a slide titled Key Pillars of Endoscopic and Surgical Computer Vision.",
    caption: "The programme included endoscopic and surgical computer vision.",
  },
] as const;

const teamRoles = [
  {
    role: "Conference co-chairs",
    count: 2,
    responsibility: "Hold the purpose, resolve disputes and make final calls.",
  },
  {
    role: "Financial officer",
    count: 1,
    responsibility: "Track spending, receipts and sponsorship conditions.",
  },
  {
    role: "AI Week chair and webmaster",
    count: 1,
    responsibility:
      "Link the conference to AI Week and update public information.",
  },
  {
    role: "Speaker coordinators",
    count: 3,
    responsibility: "Manage invitations, arrival, session needs and backups.",
  },
  {
    role: "Marketing lead",
    count: 1,
    responsibility:
      "Coordinate social, society and university promotion plus the banner.",
  },
  {
    role: "General volunteer",
    count: 1,
    responsibility: "Support registration, room turns and on-day jobs.",
  },
] as const;

const programmeComparison = [
  {
    session: "Registration and coffee",
    advertised: "09:00 to 09:45",
    revised: "09:15 to 09:50",
    record: "Revised in the supplied poster.",
  },
  {
    session: "Opening keynote",
    advertised: "10:00 to 11:00",
    revised: "10:00 to 11:00",
    record: "Retained.",
  },
  {
    session: "Digital pathology workshop",
    advertised: "11:00 to 12:00",
    revised: "11:00 to 12:00",
    record: "Retained.",
  },
  {
    session: "Lunch and poster session",
    advertised: "12:00 to 13:00",
    revised: "12:00 to 13:30",
    record: "30 minutes longer.",
  },
  {
    session: "Workshop 2: TBA",
    advertised: "13:00 to 14:00",
    revised: "Did not run",
    record:
      "Removed because the day was already dense; main points moved to the panel.",
  },
  {
    session: "Keynotes 2 and 3",
    advertised: "14:00 to 15:30",
    revised: "13:30 to 15:10",
    record: "Moved earlier.",
  },
  {
    session: "Panel discussion",
    advertised: "15:30 to 16:30",
    revised: "15:10 to 16:10",
    record:
      "Moved earlier; I joined and covered the removed workshop's main points.",
  },
] as const;

const rsvpRows = [
  { label: "Accepted", count: 78, className: "accepted" },
  { label: "Declined", count: 6, className: "declined" },
  { label: "No response", count: 94, className: "no-response" },
] as const;

const feedbackScores = [
  { label: "Overall satisfaction", score: 4.63, n: 30 },
  { label: "Value of the content", score: 4.67, n: 30 },
  { label: "Organisation", score: 4.73, n: 30 },
] as const;

const sessionRatings = [
  { label: "Keynote 1", excellent: 20, good: 10, average: 0, poor: 0 },
  { label: "Keynote 2", excellent: 16, good: 12, average: 2, poor: 0 },
  { label: "Keynote 3", excellent: 15, good: 13, average: 1, poor: 1 },
  { label: "NPIC workshop", excellent: 11, good: 11, average: 4, poor: 4 },
] as const;

function ConferenceChecklist({
  checked,
  onToggle,
}: {
  checked: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="deep-dive-checklist">
      <legend>Make this useful for your event</legend>
      {CONFERENCE_CHECK_ITEMS.map((item) => (
        <label key={item.id}>
          <input
            checked={checked.includes(item.id)}
            onChange={() => onToggle(item.id)}
            type="checkbox"
          />
          <span>
            <i>{checked.includes(item.id) ? <Check size={15} /> : null}</i>
            {item.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function ConferenceCaseStudy({
  checked,
  onToggle,
}: {
  checked: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section
      aria-labelledby="conference-case-title"
      className="deep-dive deep-dive-conference"
    >
      <div className="deep-dive-heading">
        <p>A student-led conference built from local relationships</p>
        <h2 id="conference-case-title">
          Build the programme from the community you already have
        </h2>
        <span>
          We used the local research community to connect healthcare AI,
          doctoral training, career routes and wider public participation. The
          choices we made before and during the day are the practical lesson.
        </span>
      </div>

      <div className="conference-story-lead">
        <figure>
          <img
            alt={eventImages[0].alt}
            height={eventImages[0].height}
            src={eventImages[0].src}
            width={eventImages[0].width}
          />
          <figcaption>{eventImages[0].caption}</figcaption>
        </figure>
        <div>
          <p>
            Researchers from the{" "}
            <a
              href="https://ai-medical.leeds.ac.uk"
              rel="noreferrer"
              target="_blank"
            >
              UKRI Centre for Doctoral Training in Artificial Intelligence for
              Medical Diagnosis and Care
            </a>{" "}
            (CDT) brought medical, surgical and industry experience to the
            panel. Three graduates led a digital pathology workshop with the{" "}
            <a href="https://npic.ac.uk" rel="noreferrer" target="_blank">
              National Pathology Imaging Co-operative
            </a>{" "}
            (NPIC), showing how PhD connections can grow into local jobs and
            collaborations.
          </p>
        </div>
      </div>

      <div className="conference-context-grid">
        <article>
          <span>Timing constraint</span>
          <h3>Choose the day around the audience</h3>
          <p>
            Sunday avoided weekday hospital placements. The day after
            Valentine&apos;s Day added no-show risk, but did not stop the event.
          </p>
        </article>
        <article>
          <span>Small-budget rule</span>
          <h3>Protect the basics first</h3>
          <p>
            A free university venue and sponsorship from the AI-Medical CDT
            let us spend most of the small budget on food, plus one banner and
            no cash prizes.
          </p>
        </article>
        <article>
          <span>Community reach</span>
          <h3>Repeat the invitation</h3>
          <p>
            Promotion used AI Society and MedTech Instagram, LinkedIn and
            university mailing lists because no channel reached everyone.
          </p>
        </article>
        <article>
          <span>On-day care</span>
          <h3>Make housekeeping visible</h3>
          <p>
            RSVP captured dietary needs; the team checked access and briefed
            photography, fire and evacuation. Access details stay private.
          </p>
        </article>
      </div>

      <section
        aria-labelledby="conference-flexibility-title"
        className="conference-flexibility"
      >
        <div>
          <p>Operating principle</p>
          <h3 id="conference-flexibility-title">
            Be firm on the boundary and flexible at the edge
          </h3>
          <span>
            Protect people and priorities without making harmless variation a
            crisis.
          </span>
        </div>
        <article>
          <strong>Keep firm</strong>
          <ul>
            <li>Safe capacity, emergencies and access routes</li>
            <li>Consent, privacy, dietary handling and photography</li>
            <li>Speaker commitments, committee welfare and decision ownership</li>
            <li>Spending, public claims and incident escalation</li>
          </ul>
        </article>
        <article>
          <strong>Stay flexible</strong>
          <ul>
            <li>
              Accept walk-ins only after protecting safe capacity and reserved
              places
            </li>
            <li>Accept small timing shifts that protect priority sessions</li>
            <li>Move useful material when a workshop no longer adds value</li>
            <li>Simplify polish before participant care</li>
          </ul>
        </article>
      </section>

      <section
        aria-labelledby="conference-committee-title"
        className="conference-committee"
      >
        <div className="conference-section-heading">
          <span>Organising model</span>
          <h3 id="conference-committee-title">
            Give people a clear lane and keep one decision route
          </h3>
          <p>
            We planned through Teams calls and used WhatsApp for quick
            coordination. The co-chairs kept key changes clear for everyone.
          </p>
        </div>
        <article className="conference-team-evidence">
          <span>Nine named roles</span>
          <h3>Decide what needs owning before recruiting the team</h3>
          <p>
            Our core team had two co-chairs, a financial officer, an AI Week
            chair and webmaster, three speaker coordinators, a marketing lead
            and a general volunteer. Clear roles kept decisions moving.
          </p>
        </article>
        <div
          aria-describedby="conference-role-table-hint"
          aria-label="Conference organising roles and responsibilities, horizontally scrollable"
          className="conference-role-table"
          role="region"
          tabIndex={0}
        >
          <p
            className="conference-table-hint"
            id="conference-role-table-hint"
          >
            Swipe sideways to see every responsibility in the role table.
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Slots</th>
                <th scope="col">Primary responsibility</th>
              </tr>
            </thead>
            <tbody>
              {teamRoles.map((role) => (
                <tr key={role.role}>
                  <th scope="row">{role.role}</th>
                  <td>{role.count}</td>
                  <td>{role.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="conference-team-lessons">
        <article>
          <strong>Keep an overview owner</strong>
          <p>
            One co-chair keeps work moving while the decision lead resolves
            event-wide choices.
          </p>
        </article>
        <article>
          <strong>Name a surge team</strong>
          <p>
            Keep two or three people reachable for urgent arrivals, room
            changes and supplies.
          </p>
        </article>
        <article>
          <strong>Recruit for constructive progress</strong>
          <p>
            Useful challenge brings evidence and an alternative. Name who
            decides when consensus stalls.
          </p>
        </article>
      </div>

      <section
        aria-labelledby="conference-programme-comparison-title"
        className="conference-programme-comparison"
      >
        <article className="conference-programme-note">
          <span>Two programme states</span>
          <h3>Keep the original agenda and the final schedule</h3>
          <p>
            We kept the web agenda that people first saw and compared it with
            the timetable delivered on the day. This made the schedule change
            easy to explain afterwards.
          </p>
        </article>
        <div>
          <div className="conference-section-heading">
            <span>Change control</span>
            <h3 id="conference-programme-comparison-title">
              Archive what was advertised and what people actually received
            </h3>
            <p>
              Workshop 2 did not run; its main points moved to the final panel.
              The revision was shared on Instagram and at opening.
            </p>
          </div>
          <p
            className="conference-table-hint"
            id="conference-programme-table-hint"
          >
            Swipe sideways to see the decision record for each session.
          </p>
          <div
            aria-describedby="conference-programme-table-hint"
            aria-label="Advertised and revised programme comparison, horizontally scrollable"
            className="conference-comparison-table"
            role="region"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">Advertised web agenda</th>
                  <th scope="col">Revised schedule</th>
                  <th scope="col">Record</th>
                </tr>
              </thead>
              <tbody>
                {programmeComparison.map((row) => (
                  <tr key={row.session}>
                    <th scope="row">{row.session}</th>
                    <td>{row.advertised}</td>
                    <td>{row.revised}</td>
                    <td>{row.record}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="conference-programme-logic">
        <article>
          <span>Current researchers</span>
          <h3>Different routes into doctoral research</h3>
          <p>
            Current CDT researchers discussed the benefits and realities of a
            healthcare AI PhD with prospective researchers and the wider
            community.
          </p>
        </article>
        <article>
          <span>Former researchers</span>
          <h3>Digital pathology beyond the PhD</h3>
          <p>
            Three former CDT researchers connected practical digital pathology
            methods with local jobs and continuing university relationships.
          </p>
        </article>
        <article>
          <span>Participant contributions</span>
          <h3>Give people a reason to contribute</h3>
          <p>
            We had over a dozen submitted essays and posters, with one winner
            and one runner-up in each category.
          </p>
        </article>
      </div>

      <section
        aria-labelledby="conference-denominator-ledger-title"
        className="conference-denominator-ledger"
      >
        <div className="conference-section-heading">
          <span>What we measured</span>
          <h3 id="conference-denominator-ledger-title">
            Keep registration, attendance and feedback separate
          </h3>
          <p>
            Each list answered a different question. Keeping them separate
            made our public summary clearer and our next event easier to plan.
          </p>
        </div>
        <div className="conference-denominator-grid">
          <article>
            <span>Registration record</span>
            <strong>135 registrations</strong>
            <p>
              This was the headline demand figure and showed why confirmation
              and no-show planning mattered.
            </p>
          </article>
          <article>
            <span>On-day flags</span>
            <strong>67 marked HERE</strong>
            <p>
              The check-in sheet and a separate 75-row on-day list were used
              for different parts of event delivery.
            </p>
          </article>
          <article>
            <span>Attendance</span>
            <strong>about 74</strong>
            <p>
              We had about 74 attendees on the day, in addition to the
              organising committee.
            </p>
          </article>
          <article>
            <span>Feedback record</span>
            <strong>30 responses</strong>
            <p>
              We report every satisfaction and session rating against these 30
              completed forms.
            </p>
          </article>
        </div>
        <div className="conference-rsvp">
          <div>
            <strong>RSVP response roster</strong>
            <p>
              We used this later response snapshot to plan reminders, food and
              room capacity rather than treating it as the attendance count.
            </p>
          </div>
          <div className="conference-rsvp-bars" role="img" aria-label="Of 178 RSVP response rows, 78 were accepted, 6 declined and 94 had no response.">
            {rsvpRows.map((row) => (
              <div key={row.label}>
                <span>{row.label}</span>
                <i>
                  <b
                    className={row.className}
                    style={{ width: `${(row.count / 178) * 100}%` }}
                  />
                </i>
                <strong>{row.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="conference-feedback-chart-title"
        className="conference-feedback-analysis"
      >
        <div className="conference-section-heading">
          <span>Feedback, with denominators</span>
          <h3 id="conference-feedback-chart-title">
            Show the whole scale and the spread, not only a flattering mean
          </h3>
          <p>
            Every chart uses 30 returned forms and describes respondents only.
          </p>
        </div>
        <div
          aria-labelledby="conference-overall-scores-title"
          className="conference-score-chart"
          role="group"
        >
          <div className="conference-section-heading">
            <span>Overall scores</span>
            <h3 id="conference-overall-scores-title">
              Mean feedback scores on the full 1 to 5 scale
            </h3>
            <p>Bars start at zero; higher scores are better.</p>
          </div>
          <div className="conference-score-axis" aria-hidden="true">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          {feedbackScores.map((item) => (
            <div className="conference-score-row" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <span>n={item.n}</span>
              </div>
              <i
                aria-label={`${item.label}: ${item.score.toFixed(2)} out of 5 from ${item.n} responses`}
                role="img"
              >
                <b style={{ width: `${(item.score / 5) * 100}%` }} />
              </i>
              <strong>{item.score.toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div
          aria-labelledby="conference-session-ratings-title"
          className="conference-session-ratings"
          role="group"
        >
          <div className="conference-section-heading">
            <span>Session distribution</span>
            <h3 id="conference-session-ratings-title">
              How each session was rated across four response categories
            </h3>
            <p>Each stack shows counts out of 30 forms.</p>
          </div>
          <div className="conference-rating-legend" aria-hidden="true">
            <span className="excellent">Excellent</span>
            <span className="good">Good</span>
            <span className="average">Average</span>
            <span className="poor">Poor</span>
          </div>
          {sessionRatings.map((item) => (
            <div className="conference-rating-row" key={item.label}>
              <strong>{item.label}</strong>
              <div
                aria-label={`${item.label}: ${item.excellent} excellent, ${item.good} good, ${item.average} average and ${item.poor} poor ratings, n=30`}
                className="conference-rating-stack"
                role="img"
              >
                {item.excellent ? (
                  <span
                    className="excellent"
                    style={{ width: `${(item.excellent / 30) * 100}%` }}
                  >
                    {item.excellent}
                  </span>
                ) : null}
                {item.good ? (
                  <span
                    className="good"
                    style={{ width: `${(item.good / 30) * 100}%` }}
                  >
                    {item.good}
                  </span>
                ) : null}
                {item.average ? (
                  <span
                    className="average"
                    style={{ width: `${(item.average / 30) * 100}%` }}
                  >
                    {item.average}
                  </span>
                ) : null}
                {item.poor ? (
                  <span
                    className="poor"
                    style={{ width: `${(item.poor / 30) * 100}%` }}
                  >
                    {item.poor}
                  </span>
                ) : null}
              </div>
              <span>n=30</span>
            </div>
          ))}
          <p>
            NPIC has the widest spread. The form cannot explain why, so review
            it qualitatively rather than claiming causation.
          </p>
        </div>
      </section>

      <div className="conference-feedback">
        <div>
          <span>30</span>
          <p>feedback responses</p>
        </div>
        <div>
          <span>29/30</span>
          <p>rated satisfaction 4 or 5</p>
        </div>
        <div>
          <span>29/30</span>
          <p>rated content value 4 or 5</p>
        </div>
        <div>
          <span>29/30</span>
          <p>rated organisation 4 or 5</p>
        </div>
        <div>
          <span>22/30</span>
          <p>had not attended a similar event</p>
        </div>
        <div>
          <span>28/30</span>
          <p>said yes or maybe to future involvement</p>
        </div>
      </div>

      <div className="conference-boundary">
        <strong>How to read the results</strong>
        <p>
          The ratings come from 30 feedback respondents. Registration, RSVP,
          check-in and attendance figures answer different questions, so we
          report them separately. Most respondents were students or trainees,
          which is useful context when applying the feedback elsewhere.
        </p>
      </div>

      <div className="conference-operations-gallery">
        <article>
          <span>Practical recognition</span>
          <h3>Certificates can document contribution without becoming prizes</h3>
          <p>
            We created attendance and contribution certificates, checked every
            name and kept one reusable template for future events.
          </p>
        </article>
        <article>
          <span>Low-cost logistics</span>
          <h3>Record the rule that drove each purchase</h3>
          <p>
            A free venue, bulk snacks and roughly one pizza for every two
            people kept the event affordable. We planned dietary requirements
            through the RSVP form and shared the few leftovers at the end.
          </p>
        </article>
        <article>
          <span>Participant contributions</span>
          <h3>Plan posters and essays as part of the programme</h3>
          <p>
            We received over a dozen essays and posters, with one winner and
            one runner-up in each category. The lunch session gave attendees
            time to discuss the work directly with contributors.
          </p>
        </article>
      </div>

      <div className="conference-public-response">
        <div className="conference-public-response-heading">
          <span>Public response</span>
          <h3>The conversation continued after the event</h3>
          <p>
            Two organiser posts drew more than 100 reactions alongside
            comments and reposts, extending the event beyond the room.
          </p>
        </div>
        <article>
          <strong>Conference recap</strong>
          <span>62 reactions · 4 comments · 3 reposts</span>
          <p>54 likes, 4 loves, 3 celebrates and 1 support.</p>
        </article>
        <article>
          <strong>Opening keynote post</strong>
          <span>53 reactions · 2 comments · 2 reposts</span>
          <p>44 likes, 4 celebrates, 3 loves and 2 supports.</p>
        </article>
      </div>

      <div className="conference-comment-evidence">
        <strong>Public comment themes</strong>
        <ul>
          <li>Appreciation for AI Week, organisers and contributors</li>
          <li>Interest in panel questions and healthcare AI opportunities and challenges</li>
          <li>Positive descriptions of the day, audience and local community</li>
        </ul>
        <p>
          Six public comments reflected appreciation for the organisers,
          interest in the panel and enthusiasm for Leeds&apos; healthcare AI
          community.
        </p>
      </div>

      <div className="conference-gallery" aria-label="Conference photographs">
        {eventImages.slice(1).map((image) => (
          <figure key={image.src}>
            <img
              alt={image.alt}
              height={image.height}
              loading="lazy"
              src={image.src}
              width={image.width}
            />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className="deep-dive-footer">
        <ConferenceChecklist checked={checked} onToggle={onToggle} />
        <div className="deep-dive-download">
          <ExternalLink size={22} />
          <div>
            <strong>Explore the supporting material</strong>
            <p>
              The programme, recap and organising records follow the event
              from planning through evaluation.
            </p>
            <div className="conference-source-links">
              <a
                href="https://www.leedsaiweek.co.uk/ai-in-healthcare"
                rel="noreferrer"
                target="_blank"
              >
                Advertised programme
                <ExternalLink size={14} />
              </a>
              <a
                href="https://www.linkedin.com/posts/mohammad-tasfiq-jawaad_leedsaiweek-ai-healthcare-ugcPost-7428858664037396480-NJEn/"
                rel="noreferrer"
                target="_blank"
              >
                Conference recap
                <ExternalLink size={14} />
              </a>
              <a href="/citations/ai-healthcare-conference-first-hand-2026-07-26.md">
                First-hand record
              </a>
              <a href="/citations/ai-healthcare-conference-operations-and-evaluation-2026-07-26.md">
                Operations and evaluation record
              </a>
              <a href="/citations/ai-healthcare-conference-media-2026-07-26.md">
                Media and permission record
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
