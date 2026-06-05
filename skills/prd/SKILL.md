---
name: prd
description: |
  Spark idea-engine · PRD. Turn a candidate + its business design into a verifiable PRD with a tech outline and task list.
  Triggers: /spark:prd, "draft a PRD". 中文触发:/prd、「出个 PRD」.
---

# spark-prd: PRD

Turn a candidate + its business design into a verifiable PRD; MVP-oriented, scope kept lean.

---

## Pre-Check

**Before entering any Phase, read the target idea's frontmatter. Block immediately if the condition below is not met.**

Read `ideas/idea-NNNN_*.md` → `artifacts`:

- `artifacts` does **not** contain the business-design file (`outputs/idea-NNNN_business.md`) → **block**, reply:
  > "Run /spark:business idea-NNNN first, then write the PRD."

  **Do not proceed to any Phase.**

- `artifacts` already contains the business-design file → pass, continue to `## Read Before You Begin`.

---

## Read Before You Begin

After activation and passing the pre-check, read the following files before responding:

1. `background/_index.md` — settled terminology and project context; avoids re-asking about already-known terms.
2. The target idea file (`ideas/idea-NNNN_*.md`) — frontmatter + full body.
3. `outputs/idea-NNNN_business.md` — **the PRD must align with its positioning / pricing / target audience** (this is the upstream source of truth).
4. `research/idea-NNNN_research.md` and `decisions/idea-NNNN_eval_*.md` (latest) — competitor reality and evaluation conclusions, used as basis for requirement trade-offs.

Read all of the above, then begin.

---

## Phases 0–4

### Phase 0 — Read all upstream

1. Extract from the business design: positioning (value proposition), target audience, business model, pricing tiers, GTM, key risks.
2. Extract from the idea: `category`, `platform`, `## Refined description`, `## Core assumptions`.
3. Extract from research / evaluation: competitor landscape, user pain points, still-unresolved assumptions.

**This Phase only reads files. No output to the user.**

---

### Phase 1 — PRD body

Produce the following in order:

1. **Background & goals**: why this is being built, what it aims to achieve (at least 1 quantifiable success metric).
2. **Users & scenarios (user stories)**: drawn from the target audience in the business design; written as "As a {role}, I want to {goal}, so that {value}."
3. **Functional requirements**: prioritised as **P0 / P1 / P2**; **every item must include acceptance criteria**:
   ```
   [P0] {Feature name}: {one-sentence description}
        Acceptance: {observable, testable pass condition}
   ```
   P0 = MVP must-have; P1 = important but not blocking; P2 = future consideration.
4. **Non-functional requirements**: performance / availability / security / compliance — list only what genuinely applies to this product.
5. **Out of scope (YAGNI)**: explicitly list what is **not** being built in this iteration, to prevent scope creep.

---

### Phase 2 — Technical approach

**Lightweight and MVP-oriented. Do not over-engineer.**

1. **Stack**: language / framework / key dependencies / deployment model — one sentence explaining why each choice fits the platform and effort level.
2. **System structure**: main components + data flow (prose or simple list; diagrams not required).
3. **Key data model**: core entities + key fields (MVP-necessary only).
4. **Main technical risks**: 2–3 items, each with a one-sentence mitigation idea.

---

### Phase 3 — Milestones & task list

1. **Milestones**: slice the path to the first usable version (MVP) into 2–4 milestones, each with a clear deliverable.
2. **Task list**: an executable task list grouped by milestone; each item is a small, independently completable task (following the PRD → architecture → task-breakdown habit). Granularity target: "one task, completable in one go."

---

### Phase 4 — Write to disk

**4a. Write the PRD document**

Write to `outputs/idea-NNNN_prd.md` (structure defined below under "PRD doc structure").

**4b. Backfill idea frontmatter**

Use the exact field names from `rules/schema.md`:

```yaml
artifacts:
  - outputs/idea-NNNN_business.md   # existing — keep
  - outputs/idea-NNNN_prd.md        # append
status: documented                  # terminal state: design document produced
updated: {today's date}
```

**4c. Update status overview**

In `ideas/_status.md`, update the corresponding row: set `status` to `documented` and `updated` to today's date.

**4d. Completion receipt**

```
PRD complete: idea-NNNN "{title}" → documented.
  Functional requirements: P0 {a} / P1 {b} / P2 {c} (all with acceptance criteria)
  Technical approach: {stack in one sentence}
  Milestones: {N}, tasks: {M}
  Output: outputs/idea-NNNN_prd.md
This idea has completed the full Spark idea-engine pipeline (capture → refine → research → evaluate → business → PRD).
```

---

## PRD doc structure

Written to `outputs/idea-NNNN_prd.md`:

```markdown
---
idea: idea-NNNN
date: YYYY-MM-DD
based_on: outputs/idea-NNNN_business.md
---

# idea-NNNN PRD

## Background & goals

## Users & scenarios (user stories)

## Functional requirements (P0 / P1 / P2, each with acceptance criteria)

## Non-functional requirements

## Out of scope (YAGNI)

## Technical approach (stack / structure / data model / risks)

## Milestones & task list
```

---

## Consistency & restraint

- **Align with the business design**: positioning, pricing, and target audience must match `outputs/idea-NNNN_business.md`. If a conflict is found, **the business design wins**; note it in the PRD as "Conflict with business design at point X — resolved by following business design."
- **Requirements must be verifiable**: every functional requirement must have an observable, testable acceptance criterion. If you cannot write an acceptance criterion, the requirement is not yet thought through — mark it P2 or move it to "Out of scope (YAGNI)."
- **Scope restraint**: MVP first. Push "nice to have" features to P2 or explicitly out of scope — don't gold-plate.
- **Evidence discipline**: competitor / market judgements cite only research items tagged `[verified]`; inferences are tagged `[AI-guess]` — never fabricate.

---

## Language

Respond in the user's language. PRD document section headers remain in English.
