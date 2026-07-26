# Target-learner pilot protocol

Use this protocol before submission and again after a material tutorial change.
It tests whether a new Masters or PhD researcher can transfer the method to a
fresh case. It is not a satisfaction survey.

## Participants

Recruit at least one target learner per tutorial who did not help build it.
Three per tutorial is a stronger minimum if time permits. Record research
stage, relevant technical experience, accessibility needs, and prior use of AI
tools without collecting unnecessary personal information.

Use public or synthetic material only. Do not ask a participant to expose
credentials, private infrastructure, unpublished results, patient data, or
restricted datasets. Obtain consent before recording a screen, voice, or name.

## Session setup

1. Record the tutorial URL, version, browser, device, date, and facilitator.
2. Give the learner the stated prerequisites, but no private coaching.
3. Ask the learner to complete the predeclared task from a clean browser
   profile. They may use the tutorial, its prompts, and linked evidence.
4. Note observable difficulty and requested help. Do not reveal the intended
   answer until the task or stop rule is reached.
5. Give a short transfer task with different material.
6. Debrief only after the scored work is complete.

Stop the task if the learner is about to disclose sensitive information, run
untrusted code outside the declared sandbox, change external state without
approval, or continue after the time limit. Record the stop as a design
finding, not a participant failure.

## Core tasks

### Agentic AI in Research

Give the learner one public biomedical paper with a public repository. Ask
them to:

- write a bounded research question and acceptance rule;
- classify three statements as reported, independently checked, or unresolved;
- identify the data and execution boundary before using an agent;
- propose one falsifiable hypothesis and counter-hypothesis; and
- produce a release checklist that does not overstate reproduction.

Transfer question: for a second paper, name the first three artefacts they
would pin and one result they would refuse to claim.

### Building a Website for Your Research Using AI

Give the learner a public paper, one figure, and a repository. Ask them to:

- state the intended reader and 25-word takeaway;
- create one claim-to-source record with an exact locator;
- decide whether and how the figure may be republished;
- distinguish live, reproduced, and illustrative output; and
- find the paper, code, main limitation, and reproduction path in the result.

Transfer question: show a new figure with unclear rights and ask what should
appear on the public site before permission is established.

### Developing Custom Annotation Tools Using AI

Give the learner a synthetic annotation scenario and two example records. Ask
them to:

- write one include rule, exclude rule, and ambiguity rule;
- choose a coordinate frame and missing-value convention;
- identify which work must remain possible without AI assistance;
- export and reimport the canonical record; and
- name each scientific field lost by the training-format export.

Transfer question: introduce an out-of-frame object and ask how the schema,
interface, and reviewer record should represent it.

## Scoring

Score each criterion from 0 to 2.

| Score | Meaning |
| --- | --- |
| 0 | Missing, unsafe, or scientifically misleading |
| 1 | Partly correct but needs prompting or loses an important condition |
| 2 | Correct, independently explained, and transferred to the new case |

Use these shared criteria:

1. Evidence is traced to a precise source.
2. Reported, checked, and unresolved claims remain distinct.
3. Sensitive data and untrusted execution are handled safely.
4. The requested artefact is complete and inspectable.
5. The learner explains a limitation without prompting.
6. The learner transfers the workflow to the new case.

Also record completion time, help requests, critical errors, unsafe actions
avoided, navigation failures, and any accessibility barrier. Confidence and
satisfaction may be recorded after scoring, but they do not replace observed
performance.

## Release rule

Block release for any unmitigated issue that could cause sensitive-data
disclosure, unsafe execution, loss of canonical annotations, false
reproduction claims, or inability to complete the central task with the stated
prerequisites.

For other findings, record severity, owner, change, and retest result. Retest
the failed step with a learner who did not see the original answer where
possible. Preserve negative feedback and missing observations.

## Session record

Copy this section for each participant:

```text
Tutorial and version:
Canonical URL:
Date:
Participant code:
Research stage:
Relevant prior experience:
Browser, device, and accessibility setup:
Task material and version:
Start and finish time:
Help requests:
Critical errors:
Unsafe actions attempted or avoided:
Criterion scores, 0 to 2:
Transfer answer:
Where the learner became stuck:
Participant's final limitation statement:
Observed accessibility barrier:
Facilitator intervention:
Change proposed:
Owner:
Retest result:
Open risk:
```

Summarise results by tutorial and criterion. With a very small pilot, report
the individual observations and avoid percentages that imply precision the
sample cannot support.
