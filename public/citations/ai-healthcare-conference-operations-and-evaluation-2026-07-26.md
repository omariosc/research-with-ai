# AI in Healthcare Conference operations and evaluation record

Reviewed on 26 July 2026 for the Research with AI tutorial. This record contains aggregate results only. The source workbooks remain outside the repository because they contain names, email addresses and free-text responses.

## Source files

| Workbook | SHA-256 | Sheets used |
| --- | --- | --- |
| `Attendance AI conf.xlsx` | `6460f1db5abc0efea1f7e96fe424876aaf764dfcf54630d0996f3cac72022133` | `Final attendees list`, `Sheet1`, `Sheet2` |
| `Feedback and Attendance certificate  (Responses).xlsx` | `d05c267274df3ea2f6b2424ea2e23122416ae97cb578382c97b1669c6195b3ea` | `Form responses 1` |

The files were inspected read-only. No source value was changed. Names, email addresses, dietary information, access information, affiliations, travel locations and free-text feedback were not copied into the tutorial or this record.

## Denominator ledger

These lists were created for different operational purposes and cannot yet be treated as one nested funnel.

| Evidence source | Aggregate result | Interpretation |
| --- | ---: | --- |
| `Final attendees list` | 135 non-empty rows | Recorded registration rows. One full entry is repeated, so this is not yet a unique-person count. |
| `Final attendees list` status | 103 `OLD`, 32 `NEW` | Local workflow labels. Their operational definition was not recorded in the workbook and should be confirmed before publication. |
| `Final attendees list` check-in flag | 67 `HERE` flags | One candidate physical-attendance record. The method, exclusions and handling of people without a flag are not documented. |
| `Sheet1` RSVP response | 78 accepted, 6 declined, 94 did not respond, total 178 | A separate RSVP workflow. The accepted rows contain one repeated email identifier. This roster is not assumed to be a subset of the 135 registration rows. |
| `Sheet2` on-day block | 75 rows | A separate name and email block. Its relationship to the `HERE` flags, committee, speakers and walk-ins remains unresolved. |
| Chair's first-hand estimate | about 74 participants, excluding committee members | A useful working estimate, not a verified attendance denominator. |
| `Form responses 1` | 30 responses | Exact feedback-form row count. It is not presented as a response rate while attendance is unresolved. |

### Counts that are not yet publishable as exact results

- Unique registered people
- Verified non-committee participants
- Committee members physically present
- Speakers counted separately from participants
- Walk-ins
- No-shows
- Total people in the building
- Feedback response rate
- Cost per attendee

A release-ready reconciliation needs a status dictionary, exact-match and reviewed fuzzy duplicate rules, a decision on whether committee and speakers are counted, a walk-in rule, and a named approver.

## Feedback results

All 30 response rows contained values for the three numeric summary items and four session-rating items.

### Numeric items

| Item | Mean | n | Distribution |
| --- | ---: | ---: | --- |
| Overall satisfaction | 4.63 out of 5 | 30 | 1 rated 3, 9 rated 4, 20 rated 5 |
| Value of conference content | 4.67 out of 5 | 30 | 1 rated 3, 8 rated 4, 21 rated 5 |
| Organisation | 4.73 out of 5 | 30 | 1 rated 3, 6 rated 4, 23 rated 5 |

Means are arithmetic means of the 30 observed integer ratings. No missing values were imputed.

### Session items

| Session | Excellent | Good | Average | Poor | n |
| --- | ---: | ---: | ---: | ---: | ---: |
| Keynote 1 | 20 | 10 | 0 | 0 | 30 |
| Keynote 2 | 16 | 12 | 2 | 0 | 30 |
| Keynote 3 | 15 | 13 | 1 | 1 | 30 |
| NPIC workshop | 11 | 11 | 4 | 4 | 30 |

The NPIC workshop has the widest response spread. The form does not establish why. A causal explanation would require reviewed qualitative evidence or follow-up, not speculation from the rating distribution.

### Reach and future involvement

| Item | Result | n |
| --- | ---: | ---: |
| Had not attended a similar AI or healthcare conference | 22 | 30 |
| Had attended a similar event | 8 | 30 |
| Interested in supporting in some capacity | 14 | 30 |
| Interested in organising | 4 | 30 |
| Maybe, wanted more information | 10 | 30 |
| Not interested at this time | 2 | 30 |
| Yes or maybe to future involvement | 28 | 30 |

These are respondent characteristics. They do not establish the composition of all attendees.

### Respondent context

A case-insensitive keyword grouping was used only to describe the feedback
sample coarsely. Terms including student, undergraduate, postgraduate, MSc,
PhD, doctoral, trainee and foundation-year notation were grouped as student or
trainee. All other, unclear and missing values were combined.

| Coarse group | Result | n |
| --- | ---: | ---: |
| Student or trainee | 21 | 30 |
| Other, unclear or not supplied | 9 | 30 |

This is not a demographic classification and does not show the composition of
everyone present. It indicates that the feedback sample was student-heavy and
should not be described as representative of the wider public.

## Advertised and revised programme

The [Leeds AI Week conference page](https://www.leedsaiweek.co.uk/ai-in-healthcare) records the earlier advertised agenda. The supplied schedule poster and chair's first-hand account record a revision.

| Session | Advertised web agenda | Revised poster or first-hand record | Evidence type |
| --- | --- | --- | --- |
| Registration and coffee | 09:00 to 09:45 | 09:15 to 09:50 | Public web page and organiser-supplied poster |
| Opening keynote | 10:00 to 11:00 | 10:00 to 11:00 | Public web page and organiser-supplied poster |
| Digital pathology workshop | 11:00 to 12:00 | 11:00 to 12:00 | Public web page and organiser-supplied poster |
| Lunch and poster session | 12:00 to 13:00 | 12:00 to 13:30 | Public web page and organiser-supplied poster |
| Workshop 2: TBA | 13:00 to 14:00 | Did not run | Public web page and chair's first-hand account |
| Keynotes 2 and 3 | 14:00 to 15:30 | 13:30 to 15:10 | Public web page and organiser-supplied poster |
| Panel discussion | 15:30 to 16:30 | 15:10 to 16:10; organiser joined the panel | Public web page, organiser-supplied poster and chair's first-hand account |

The chair states that the revised schedule was shared on Instagram and announced at the beginning of the day. The removed workshop's main points were moved into the panel. The chair judged that another hour would add limited value to an already information-dense day and observed some post-lunch attrition. This is a first-hand operational judgement, not an independently measured causal result.

## Organising structure

The chair described the following role slots:

| Role | Slots |
| --- | ---: |
| Conference co-chairs | 2 |
| Financial officer | 1 |
| AI Week chair, also conference webmaster | 1 |
| Speaker coordinators | 3 |
| Marketing lead | 1 |
| General volunteer | 1 |

The role list contains nine slots. A committee photograph shows ten people, but photographs are not used to infer membership or role allocation.

The first-hand account identifies two useful governance patterns:

- One person maintained the operational overview while the accountable chair retained the final decision route.
- Two or three people needed to remain available for last-minute work.

Regular Teams calls supported structured planning and a WhatsApp group supported rapid coordination. A reusable process should also retain material decisions, actions and approvals in a durable log.

Committee recruitment should consider reliability and constructive behaviour, not only availability. Disagreement is useful when it includes evidence, an alternative and respect for a decision deadline. The team should record who decides when consensus stalls and how repeated unconstructive behaviour is handled.

## First-hand logistics record

The chair supplied the following operational account:

- Sunday was chosen partly because medical students can have hospital placements during the working week.
- The day after Valentine's Day was treated as a possible registration and no-show risk.
- A suitable University of Leeds venue was provided without a venue charge.
- Sponsorship came through the medical AI CDT.
- Most of the small budget was used for food. A smaller amount supported one large marketing banner.
- No cash prize money was offered.
- Snacks were bought in bulk.
- Pizza was ordered at roughly one pizza for every two people, with a small number of leftovers taken away by attendees and organisers.
- Promotion used AI Society and MedTech Society Instagram accounts, LinkedIn and university mailing lists.
- Dietary needs were collected through the RSVP process.
- Venue accessibility was considered during selection. No individual attendee's access information is included here.
- Opening housekeeping covered photography or consent, fire and evacuation arrangements.
- RSVP confirmation, cancellations and non-response were important because registrations could exceed room capacity.

Prices, receipts, exact sponsorship value, room capacity, allergen controls and food waste were not reviewed, so no cost-effectiveness or food-suitability claim is made.

## Flexible delivery with protected boundaries

The chair emphasised flexibility for low-risk changes, including last-minute arrivals. A reusable rule is:

- Keep firm on safe capacity, emergency arrangements, access, consent, privacy, dietary handling, speaker commitments, committee welfare, approved spending and public claims.
- Stay flexible on walk-ins when capacity remains, small timing changes, session format, movement between rooms and simplification of non-essential production.

The order of priorities should protect people first, then speaker and committee readiness, then the core participant experience, then production polish.

## Media and certificate boundary

The organiser supplied a folder containing 141 conference photographs plus
selected review examples. Identifiable people, badges and QR codes require a
publication review. Public Drive access alone does not establish a reuse
licence or subject consent, so the collection link and selected files are not
published in the repository or tutorial.

The personalised contribution certificate contains a named recipient and named
signatories. It is neither linked nor copied. A public template should use a
clearly synthetic recipient and role labels.

See the separate [media and permission record](./ai-healthcare-conference-media-2026-07-26.md) for retained assets, hashes and release conditions.

## Interpretation limits

- Feedback was voluntary and may be affected by non-response and positivity bias.
- No response rate is calculated.
- The workbooks were operational records, not a pre-registered evaluation dataset.
- Free-text feedback was excluded from this public record.
- Workbook categories were not silently reconciled.
- Social reactions and comments are platform engagement, not evidence of attendance, learning or later collaboration.
- This case documents one locally organised event and does not guarantee the same results elsewhere.
