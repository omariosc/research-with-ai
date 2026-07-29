"use client";

import { useEffect, useMemo, useState } from "react";
import { builderKey, copyText, downloadText } from "@/lib/storage";
import { TUTORIAL_VERSION_LABEL, WORKSHOP_RELEASES } from "@/lib/version";
import { Check, Copy, Download } from "./Icons";

type CopyState = "idle" | "copied";

const conferenceRelease = WORKSHOP_RELEASES["ai-healthcare-conference"];

type ConferenceForm = {
  title: string;
  purpose: string;
  audience: string;
  owner: string;
  teamRoles: string;
  decisionRule: string;
  surgeTeam: string;
  registrations: string;
  expectedRate: string;
  capacity: string;
  committeeSpeakers: string;
  walkInReserve: string;
  walkInRule: string;
  budget: string;
  cateringCost: string;
  accessibility: string;
  safeguarding: string;
  privacy: string;
  advertisedProgramme: string;
  deliveredChanges: string;
  postEventDenominators: string;
};

const defaults: ConferenceForm = {
  title: "AI in Healthcare Conference",
  purpose:
    "Bring researchers, students, clinicians, industry and the wider community together around useful healthcare AI work.",
  audience:
    "Students, researchers, clinicians, industry colleagues and interested members of the public",
  owner: "",
  teamRoles:
    "List each role, the decisions it owns, and a named backup for critical work.",
  decisionRule:
    "The accountable event lead hears time-bounded advice and makes the final decision when consensus stalls.",
  surgeTeam:
    "Keep two or three reliable people available for urgent speaker, venue, registration, or logistics work.",
  registrations: "",
  expectedRate: "60",
  capacity: "",
  committeeSpeakers: "",
  walkInReserve: "",
  walkInRule:
    "Welcome last-minute arrivals only when safe capacity, catering, consent, and access provision allow. Never displace speakers, organisers, confirmed attendees, or agreed access support.",
  budget: "",
  cateringCost: "",
  accessibility:
    "Ask about access needs early and agree a named response process with the venue.",
  safeguarding:
    "Confirm whether protected groups may attend, follow the host's current safeguarding process, and name the human escalation route.",
  privacy:
    "Keep registration data in the approved event system. Give AI tools only aggregate or synthetic planning figures.",
  advertisedProgramme:
    "Record the public programme version and date. Keep detailed operational notes in the restricted run sheet.",
  deliveredChanges:
    "Record material changes, who approved them, how people were told, and what the final archive must correct.",
  postEventDenominators:
    "Reconcile registrations, accepted places, declines, non-responses, cancellations, verified check-ins, walk-ins, speakers, committee, volunteers, and item-level feedback responses separately.",
};

function parseNonNegative(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function displayNumber(value: number | null, digits = 0) {
  if (value === null) return "Not entered";
  return value.toLocaleString("en-GB", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function scenarioAttendance(registrations: number | null, rate: number) {
  return registrations === null
    ? null
    : Math.round(registrations * (rate / 100));
}

export function ConferencePlanBuilder({
  projectId,
}: {
  projectId: string;
}) {
  const [form, setForm] = useState<ConferenceForm>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const storageKey = builderKey("conference", projectId);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const stored = JSON.parse(raw) as {
          schemaVersion?: unknown;
          value?: unknown;
        };
        if (
          stored.schemaVersion === 1 &&
          stored.value &&
          typeof stored.value === "object"
        ) {
          const candidate = stored.value as Record<string, unknown>;
          const restored = Object.fromEntries(
            Object.entries(defaults).map(([key, fallback]) => [
              key,
              typeof candidate[key] === "string" ? candidate[key] : fallback,
            ]),
          ) as ConferenceForm;
          queueMicrotask(() => setForm(restored));
        }
      }
    } catch {
      // The planner remains usable if storage is unavailable or malformed.
    }
    queueMicrotask(() => setLoaded(true));
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ schemaVersion: 1, value: form }),
      );
    } catch {
      // The planner remains usable when local storage is unavailable or full.
    }
  }, [form, loaded, storageKey]);

  const registrations = parseNonNegative(form.registrations);
  const rawRate = parseNonNegative(form.expectedRate);
  const expectedRate =
    rawRate === null ? null : Math.min(100, Math.max(0, rawRate));
  const capacity = parseNonNegative(form.capacity);
  const committeeSpeakers = parseNonNegative(form.committeeSpeakers);
  const walkInReserve = parseNonNegative(form.walkInReserve);
  const budget = parseNonNegative(form.budget);
  const cateringCost = parseNonNegative(form.cateringCost);
  const baseAttendance =
    registrations === null || expectedRate === null
      ? null
      : scenarioAttendance(registrations, expectedRate);
  const lowRate =
    expectedRate === null ? 45 : Math.max(0, expectedRate - 15);
  const highRate =
    expectedRate === null ? 75 : Math.min(100, expectedRate + 15);
  const lowAttendance = scenarioAttendance(registrations, lowRate);
  const highAttendance = scenarioAttendance(registrations, highRate);
  const protectedSeats =
    committeeSpeakers === null || walkInReserve === null
      ? null
      : committeeSpeakers + walkInReserve;
  const highRoomDemand =
    highAttendance === null || protectedSeats === null
      ? null
      : highAttendance + protectedSeats;
  const capacityWarning =
    capacity !== null &&
    highRoomDemand !== null &&
    highRoomDemand > capacity;
  const baseCatering =
    baseAttendance === null || cateringCost === null
      ? null
      : baseAttendance * cateringCost;
  const costPerExpectedAttendee =
    budget === null || baseAttendance === null || baseAttendance === 0
      ? null
      : budget / baseAttendance;
  const errors = [
    ...(!form.title.trim() ? ["Name the event."] : []),
    ...(!form.purpose.trim() ? ["State the community purpose."] : []),
    ...(!form.audience.trim() ? ["Describe the intended audience."] : []),
    ...(!form.owner.trim() ? ["Name the accountable event lead."] : []),
    ...(!form.decisionRule.trim()
      ? ["State how the team will make a final decision."]
      : []),
    ...(form.registrations.trim() && registrations === null
      ? ["Registrations must be a non-negative number."]
      : []),
    ...(form.expectedRate.trim() &&
    (rawRate === null || rawRate > 100)
      ? ["Expected attendance rate must be between 0 and 100."]
      : []),
    ...(form.committeeSpeakers.trim() && committeeSpeakers === null
      ? ["Speakers and committee seats must be a non-negative number."]
      : []),
    ...(form.walkInReserve.trim() && walkInReserve === null
      ? ["Walk-in reserve must be a non-negative number."]
      : []),
  ];

  const output = useMemo(
    () => `# Conference planning record: ${form.title || "Untitled event"}

> Tutorial release: ${TUTORIAL_VERSION_LABEL}
> Canonical tutorial: ${conferenceRelease.canonicalUrl}
> Planning figures are scenarios, not promises or verified attendance.

## Purpose and ownership

- **Purpose:** ${form.purpose || "Not entered"}
- **Audience:** ${form.audience || "Not entered"}
- **Accountable lead:** ${form.owner || "Not entered"}
- **Team roles and backups:** ${form.teamRoles || "Not entered"}
- **Decision rule:** ${form.decisionRule || "Not entered"}
- **Surge team:** ${form.surgeTeam || "Not entered"}

## Live priority stack

1. People, safety, access, consent, and safeguarding
2. Speaker commitments and organising-team readiness
3. Capacity, food, privacy, and the core participant experience
4. The agreed learning purpose and essential programme
5. Timing polish, room layout, and optional production

Be firm on the boundary and flexible at the edge. A harmless walk-in, small timing drift, or room-layout change may be acceptable. Changes affecting the first four priorities need an accountable human decision and clear communication.

## Attendance scenarios

- **Registrations entered:** ${displayNumber(registrations)}
- **Low participant scenario:** ${displayNumber(lowAttendance)} people at ${displayNumber(lowRate)}%
- **Working participant scenario:** ${displayNumber(baseAttendance)} people at ${displayNumber(expectedRate)}%
- **High participant scenario:** ${displayNumber(highAttendance)} people at ${displayNumber(highRate)}%
- **Speakers and committee seats:** ${displayNumber(committeeSpeakers)}
- **Walk-in reserve:** ${displayNumber(walkInReserve)}
- **High room-demand scenario:** ${displayNumber(highRoomDemand)}
- **Venue capacity:** ${displayNumber(capacity)}
- **Capacity review:** ${
      capacityWarning
        ? "REVISE. The high room-demand scenario exceeds the entered capacity."
        : capacity === null || highRoomDemand === null
          ? "Incomplete. Enter registrations and capacity."
          : "The entered capacity covers the high room-demand scenario."
    }

Do not call a forecast an attendance result. After the event, report registrations, accepted places, cancellations, verified check-ins, walk-ins, speakers, volunteers and feedback responses separately.

### Walk-in rule

${form.walkInRule || "Not entered"}

## Budget and catering

- **Total budget entered:** £${displayNumber(budget, 2)}
- **Catering assumption per expected attendee:** £${displayNumber(cateringCost, 2)}
- **Base catering scenario:** £${displayNumber(baseCatering, 2)}
- **Budget per expected attendee:** £${displayNumber(costPerExpectedAttendee, 2)}

Confirm dietary requirements, allergens, service arrangements, waste handling and the final order with accountable people. A calculator does not make a food-safety or accessibility decision.

## Accessibility plan

${form.accessibility || "Not entered"}

## Safeguarding and escalation

${form.safeguarding || "Not entered"}

## Privacy plan

${form.privacy || "Not entered"}

Do not paste attendee names, emails, accessibility disclosures, dietary information or identifiable feedback into a general-purpose AI service. Use synthetic examples or reviewed aggregate counts.

## Advertised and delivered programme

### Advertised programme record

${form.advertisedProgramme || "Not entered"}

### Delivered changes

${form.deliveredChanges || "Not entered"}

Archive both versions. A practical change can be the right decision, but the public record should not claim that a cancelled or replaced session ran.

## Post-event denominator ledger

${form.postEventDenominators || "Not entered"}

For each count, record its definition, source, exclusions, duplicate rule, reconciliation status, numerator, and denominator. Do not force walk-ins, speakers, committee members, volunteers, and anonymous feedback into a false conversion funnel.

## Human approval gates

- [ ] Purpose, audience and success criteria agreed
- [ ] Team roles, backups, decision rule and surge team agreed
- [ ] Venue capacity, access and emergency arrangements checked
- [ ] Safeguarding and incident escalation route checked with the host
- [ ] Budget owner approved expenditure
- [ ] Speaker invitations and biographies personally reviewed
- [ ] Registration privacy notice and photography approach approved
- [ ] Dietary and accessibility requests handled by named people
- [ ] Run sheet, backups and escalation contacts confirmed
- [ ] Delivered programme and attendance denominators reconciled
- [ ] Public photographs, quotations and claims cleared for release

## AI-use record

Record the AI tool, task, inputs, information withheld, output used, human reviewer and any decision that changed. AI can draft scenarios and checklists. Your organising team still makes the final decisions about relationships, money, access, safety, privacy and public claims.
`,
    [
      baseAttendance,
      baseCatering,
      budget,
      capacity,
      capacityWarning,
      cateringCost,
      committeeSpeakers,
      costPerExpectedAttendee,
      expectedRate,
      form,
      highAttendance,
      highRoomDemand,
      highRate,
      lowAttendance,
      lowRate,
      protectedSeats,
      registrations,
      walkInReserve,
    ],
  );
  const previewOutput =
    errors.length > 0
      ? `# Conference planning record

> Tutorial release: ${TUTORIAL_VERSION_LABEL}
> Canonical tutorial: ${conferenceRelease.canonicalUrl}

Complete the accountable lead and any other required fields to preview and export the full planning record.`
      : output;

  async function handleCopy() {
    await copyText(output);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1600);
  }

  function update<K extends keyof ConferenceForm>(
    key: K,
    value: ConferenceForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="builder-section" id="builder">
      <div className="section-heading section-heading-wide">
        <p>Conference planner</p>
        <h2>Turn registrations into an honest operating range</h2>
        <span>
          Build a local planning record without entering attendee data. Change
          the assumptions and keep the low, working and high scenarios visible.
        </span>
      </div>

      <aside className="watch-note" role="note">
        <span>Replace the templates</span>
        <p>
          The prefilled sentences are starting points, not completed plans.
          Replace them with your event&apos;s owners, evidence, constraints and
          agreed decisions before exporting the record.
        </p>
      </aside>

      <div className="builder-grid">
        <form
          className="builder-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <section aria-labelledby="conference-plan-purpose">
            <h3
              className="conference-builder-label"
              id="conference-plan-purpose"
            >
              01 Purpose and accountable ownership
            </h3>
            <label className="field">
              <span>Event title</span>
              <input
                onChange={(event) => update("title", event.target.value)}
                value={form.title}
              />
            </label>
            <label className="field">
              <span>Community purpose</span>
              <textarea
                onChange={(event) => update("purpose", event.target.value)}
                rows={3}
                value={form.purpose}
              />
            </label>
            <label className="field">
              <span>Intended audience</span>
              <textarea
                onChange={(event) => update("audience", event.target.value)}
                rows={2}
                value={form.audience}
              />
            </label>
            <label className="field">
              <span>Accountable event lead</span>
              <input
                onChange={(event) => update("owner", event.target.value)}
                value={form.owner}
              />
            </label>
          </section>

          <section aria-labelledby="conference-plan-team">
            <h3
              className="conference-builder-label"
              id="conference-plan-team"
            >
              02 Team and decision rights
            </h3>
            <label className="field">
              <span>Roles, owned decisions, and backups</span>
              <textarea
                onChange={(event) => update("teamRoles", event.target.value)}
                rows={3}
                value={form.teamRoles}
              />
            </label>
            <label className="field">
              <span>Final decision rule</span>
              <textarea
                onChange={(event) => update("decisionRule", event.target.value)}
                rows={3}
                value={form.decisionRule}
              />
            </label>
            <label className="field">
              <span>Two or three-person surge team</span>
              <textarea
                onChange={(event) => update("surgeTeam", event.target.value)}
                rows={3}
                value={form.surgeTeam}
              />
            </label>
          </section>

          <section aria-labelledby="conference-plan-attendance">
            <h3
              className="conference-builder-label"
              id="conference-plan-attendance"
            >
              03 Attendance and room demand
            </h3>
            <div className="field-row">
              <label className="field">
                <span>Registrations</span>
                <input
                  min="0"
                  onChange={(event) =>
                    update("registrations", event.target.value)
                  }
                  step="1"
                  type="number"
                  value={form.registrations}
                />
              </label>
              <label className="field">
                <span>Expected attendance rate (%)</span>
                <input
                  max="100"
                  min="0"
                  onChange={(event) =>
                    update("expectedRate", event.target.value)
                  }
                  step="1"
                  type="number"
                  value={form.expectedRate}
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Venue capacity</span>
                <input
                  min="0"
                  onChange={(event) => update("capacity", event.target.value)}
                  step="1"
                  type="number"
                  value={form.capacity}
                />
              </label>
              <label className="field">
                <span>Speakers and committee seats</span>
                <input
                  min="0"
                  onChange={(event) =>
                    update("committeeSpeakers", event.target.value)
                  }
                  step="1"
                  type="number"
                  value={form.committeeSpeakers}
                />
              </label>
            </div>

            <label className="field">
              <span>Walk-in reserve</span>
              <input
                min="0"
                onChange={(event) =>
                  update("walkInReserve", event.target.value)
                }
                step="1"
                type="number"
                value={form.walkInReserve}
              />
            </label>

            <div className="field">
              <div className="conference-scenario" aria-live="polite">
                <span>Live high room-demand check</span>
                <strong>{displayNumber(highRoomDemand)}</strong>
                <small>
                  {displayNumber(highAttendance)} participants plus{" "}
                  {displayNumber(protectedSeats)} protected seats
                </small>
              </div>
            </div>

            <label className="field">
              <span>Last-minute arrival rule</span>
              <textarea
                onChange={(event) => update("walkInRule", event.target.value)}
                rows={4}
                value={form.walkInRule}
              />
            </label>
          </section>

          <section aria-labelledby="conference-plan-governance">
            <h3
              className="conference-builder-label"
              id="conference-plan-governance"
            >
              04 Budget, care and governance
            </h3>
            <div className="field-row">
              <label className="field">
                <span>Total budget (£)</span>
                <input
                  min="0"
                  onChange={(event) => update("budget", event.target.value)}
                  step="0.01"
                  type="number"
                  value={form.budget}
                />
              </label>
              <label className="field">
                <span>Catering per expected attendee (£)</span>
                <input
                  min="0"
                  onChange={(event) =>
                    update("cateringCost", event.target.value)
                  }
                  step="0.01"
                  type="number"
                  value={form.cateringCost}
                />
              </label>
            </div>

            <label className="field">
              <span>Accessibility plan</span>
              <textarea
                onChange={(event) =>
                  update("accessibility", event.target.value)
                }
                rows={3}
                value={form.accessibility}
              />
            </label>
            <label className="field">
              <span>Safeguarding and incident escalation</span>
              <textarea
                onChange={(event) =>
                  update("safeguarding", event.target.value)
                }
                rows={3}
                value={form.safeguarding}
              />
            </label>
            <label className="field">
              <span>Registration data and AI boundary</span>
              <textarea
                onChange={(event) => update("privacy", event.target.value)}
                rows={3}
                value={form.privacy}
              />
            </label>
          </section>

          <section aria-labelledby="conference-plan-evaluation">
            <h3
              className="conference-builder-label"
              id="conference-plan-evaluation"
            >
              05 Change control and evaluation
            </h3>
            <label className="field">
              <span>Advertised programme record</span>
              <textarea
                onChange={(event) =>
                  update("advertisedProgramme", event.target.value)
                }
                rows={3}
                value={form.advertisedProgramme}
              />
            </label>
            <label className="field">
              <span>Delivered changes and communication</span>
              <textarea
                onChange={(event) =>
                  update("deliveredChanges", event.target.value)
                }
                rows={3}
                value={form.deliveredChanges}
              />
            </label>
            <label className="field">
              <span>Post-event denominator ledger</span>
              <textarea
                onChange={(event) =>
                  update("postEventDenominators", event.target.value)
                }
                rows={4}
                value={form.postEventDenominators}
              />
            </label>
          </section>

          {errors.length > 0 ? (
            <div className="builder-stop" role="alert">
              <strong>Planning record needs attention</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : capacityWarning ? (
            <div className="builder-stop" role="alert">
              <strong>Capacity review required</strong>
              <p>
                The high room-demand scenario exceeds the entered venue
                capacity. Revise registration controls, capacity or the
                operating plan before treating it as viable.
              </p>
            </div>
          ) : (
            <div className="builder-valid" role="status">
              Required fields are present for a draft. This is not operational
              approval. The accountable lead and the relevant venue, access,
              safety, finance, privacy and safeguarding owners must review the
              evidence and approve their own decisions.
            </div>
          )}
        </form>

        <div className="builder-output">
          <div className="output-header">
            <span>conference_plan.md</span>
            <span>local draft</span>
          </div>
          <div className="conference-scenario" aria-live="polite">
            <span>High room demand</span>
            <strong>{displayNumber(highRoomDemand)}</strong>
            <small>
              {displayNumber(highAttendance)} participants plus{" "}
              {displayNumber(protectedSeats)}{" "}
              protected seats
            </small>
          </div>
          <pre>{previewOutput}</pre>
          <div className="builder-actions">
            <button
              className="button button-secondary"
              disabled={errors.length > 0}
              onClick={handleCopy}
              type="button"
            >
              {copyState === "copied" ? (
                <Check size={17} />
              ) : (
                <Copy size={17} />
              )}
              {copyState === "copied" ? "Copied" : "Copy plan"}
            </button>
            <button
              className="button button-primary"
              disabled={errors.length > 0}
              onClick={() =>
                downloadText(
                  "conference_plan.md",
                  output,
                  "text/markdown;charset=utf-8",
                )
              }
              type="button"
            >
              <Download size={17} />
              Download Markdown
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
