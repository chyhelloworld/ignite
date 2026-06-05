---
name: evaluate
description: |
  Spark idea-engine · evaluate. Feasibility gate: challenge core assumptions against verified evidence, return go/no-go/maybe; no-go demotes the idea to the pool with a death reason.
  Triggers: /spark:evaluate, "can this be done". 中文触发:/评估、「这个能不能做」.
---

# spark:evaluate — Feasibility Gate

Challenge each core assumption one by one; issue go/no-go/maybe; no-go writes a death reason and keeps the atom in the pool — never deletes it.

---

## Read First (before speaking)

After activation, read these before saying anything:

1. `background/_index.md` — settled terminology and project background; avoid re-asking about known terms.
2. The target idea file (`ideas/idea-NNNN_*.md`) — read the frontmatter + body, focusing on `## Core Assumptions`.
3. `rules/death-reasons.md` — on no-go, `death_reason` must come only from this controlled vocabulary.

Read everything first, then proceed.

---

## Pre-Check

**Before entering any Phase, verify the following; block immediately if not satisfied.**

Read the target idea's `research_ref` field:

- `research_ref` is `null` or missing → **Block**, reply:
  > "Run /spark:research first — no evidence, no evaluation."

  **Do not continue to any Phase.**

- `research_ref` has a value (pointing to a research snapshot) → pass; read `research/idea-NNNN_research.md`, then proceed to Phase 0.

---

## Phase 0–5

### Phase 0 — Read the Idea + Research Report

1. Read the idea file in full; extract:
   - Every assumption listed under `## Core Assumptions` (list them numbered).
   - The `category`, `platform`, and `effort` fields from the frontmatter.
2. Read `research/idea-NNNN_research.md` in full; extract:
   - **Only facts tagged `[verified]`** are admissible evidence; everything else (`[unverified]` / `[AI-guess]` / `[uncertain]`) is reference-only and cannot drive a verdict.
   - Competitor list, price range, user pain points, market gaps, and the "Evaluation Reference" section.
3. Internally build an "Assumption × Evidence" mapping table to prepare for Phase 1.

**This Phase reads files only — output nothing to the user.**

---

### Phase 1 — Challenge Each Core Assumption

For every assumption under `## Core Assumptions`, issue a three-value verdict:

| Verdict | Criterion |
|---|---|
| **holds** | The research report contains `[verified]` evidence that directly supports the assumption |
| **unconfirmed** | No sufficient `[verified]` evidence — neither supports nor refutes |
| **refuted** | The research report contains `[verified]` evidence that directly contradicts the assumption |

**Hard rule: every verdict must cite specific `[verified]` evidence from the research report (source + fact). An assumption with no verified evidence can only be `unconfirmed` — never `holds` and never `refuted`.**

Output format (per assumption):

```
Assumption N: "{assumption text}"
Verdict: holds / unconfirmed / refuted
Evidence: [verified] {fact description} — Source: {link / report section}
```

---

### Phase 2 — Competitor Reality Check (Collision Detection)

Based on the competitor list and market gaps in the research report, answer three questions:

1. **Is there already a competitor doing this well** (high feature overlap, strong user reputation, large scale)?
2. **Where is the differentiation**: what is the core difference between this idea and the strongest competitor?
3. **Collision verdict**: if there is "high feature overlap" and you "cannot articulate differentiation" → judge as **collision**.

The collision verdict also relies only on `[verified]` data. If there is no evidence for a differentiation claim, tag it `[AI-guess]`.

---

### Phase 3 — Business Quick-Screen

Three quick screens, each scored pass / uncertain / fail:

1. **Real willingness-to-pay signal**: does the research report contain evidence of users actually paying (existing competitor pricing + sales/subscription figures)? Or is the market landscape purely "free + ads"?
2. **Effort vs. resources**: does the idea's `effort` estimate (S/M/L/XL) match current available resources (solo / small team)? effort=XL with resources = solo indie developer → fail.
3. **Platform reality**: will platform commission / review policy / algorithm rules block the commercial path? (Refer to `rules/category-platform-map.md` and platform information in the research report.)

---

### Phase 4 — Issue Verdict

Based on Phase 1–3 results, apply the following criteria and issue exactly one verdict:

#### `go`

- Core assumptions **mostly hold** (count of `holds` > count of `unconfirmed` + `refuted`)
- **Differentiation exists** (Phase 2 can articulate it, not purely AI-guess)
- Effort is **manageable** (Phase 3 resource match passes)

→ `verdict: go`, `status: candidate`

#### `maybe`

- A key assumption is **unconfirmed** but not refuted (missing data, not a wrong direction)
- Differentiation is articulable but evidence is thin
- No obvious fatal item in the quick-screen

→ `verdict: maybe`, `status: evaluated`
→ Suggest: "A key assumption lacks sufficient evidence. Consider going back to `/spark:research idea-NNNN` to gather more data, or to `/spark:refine idea-NNNN` to adjust direction."

#### `no-go`

Any **one** of the following is sufficient for no-go:
- A core assumption is **refuted** (there is `[verified]` evidence directly negating it)
- Phase 2 judges it a **collision with no differentiation**
- Effort **far exceeds resources** and cannot be decomposed

→ `verdict: no-go`, `status: evaluated`, **`death_reason` is required**

---

### Phase 5 — Write Eval Snapshot + Backfill + Update Overview

#### 5a. Write the Eval Snapshot

Write to `decisions/idea-NNNN_eval_YYYYMMDD.md` (see structure below under "Eval Snapshot Structure").

**Write once, never edit** — if a re-evaluation is needed later, create a new file with a new date.

#### 5b. Backfill the Idea Frontmatter

Follow the field names from `rules/schema.md` exactly:

```yaml
verdict: go / no-go / maybe
eval_ref: decisions/idea-NNNN_eval_YYYYMMDD.md
status: candidate   # when go; otherwise: evaluated
death_reason: {death-reason slug}   # required when no-go, taken from rules/death-reasons.md; null otherwise
updated: {today's date}
```

#### 5c. Update the Status Overview

In `ideas/_status.md`, update the corresponding row: `status`, `verdict`, `updated`.

---

## Verdict Criteria (Quick Reference)

| verdict | Core conditions | Status flow |
|---|---|---|
| `go` | Assumptions mostly hold + differentiation exists + effort manageable | `evaluated → candidate` |
| `maybe` | Key assumption unconfirmed (not refuted) | stays `evaluated` |
| `no-go` | Assumption refuted / collision no-diff / effort far exceeds resources | stays `evaluated`, **death_reason required** |

---

## Death-Reason Mechanism (Core)

On no-go, `death_reason` **must** be taken from the controlled vocabulary in `rules/death-reasons.md`:

| Death reason slug | When it applies |
|---|---|
| `lacks-traffic` | Product can be built but no one will find it; no acquisition path |
| `lacks-monetization` | Has users but no paid scenario or willingness to pay is extremely low |
| `lacks-tech` | Implementation barrier exceeds currently available technical assets |
| `collision-no-diff` | A competitor already does this well and the idea has no differentiation |
| `weak-demand` | Pain point is not painful enough; research shows users won't pay |
| `effort-too-large` | Investment far exceeds what a solo / small team can sustain |
| `platform-limit` | Platform policy / commission / review blocks the commercial path |

**Why this must be structured:** `death_reason` is fuel for `/spark:combine` doing complementary matching. An idea that died from `lacks-traffic` can pair with an idea that has a built-in traffic channel; one that died from `lacks-monetization` can pair with one that has a paid use-case. A structured death reason is a precise match key.

In the eval snapshot, expand the death reason with one sentence of detail — not just the slug, but "why this specific death reason applies to this specific idea, so /spark:combine can use it."

**Never delete a no-go atom** — it stays in the idea pool, waiting for `/spark:combine` to activate it.

---

## Eval Snapshot Structure

Write to `decisions/idea-NNNN_eval_YYYYMMDD.md`:

```markdown
---
idea: idea-NNNN
date: YYYY-MM-DD
verdict: go / no-go / maybe
death_reason: null / {death-reason slug}
---

# idea-NNNN Eval Snapshot YYYY-MM-DD

## Assumption Verdicts

| # | Assumption | Verdict | Cited Verified Evidence |
|---|---|---|---|
| 1 | {assumption text} | holds / unconfirmed / refuted | [verified] {fact} — Source: {link} |
| 2 | ... | ... | ... |

## Collision Check

- Strongest competitor: {name} ({one-line description})
- Differentiation: {differentiating point / "no differentiation"}
- Conclusion: collision / no collision

## Business Quick-Screen

- Willingness-to-pay signal: {pass / uncertain / fail} — {one-line rationale}
- Effort vs. resources: {pass / uncertain / fail} — {effort estimate vs. current resources}
- Platform reality: {pass / uncertain / fail} — {one-line rationale}

## Conclusion & One-Line Prescription

**verdict: {go / no-go / maybe}**

{One sentence explaining why this verdict was reached}

{no-go only}: death_reason: `{slug}` — {one sentence explaining why this death reason applies to this idea, for use by /spark:combine}
```

---

## Wrap-Up

After Phase 5 completes, report to the user:

**go:**
```
Evaluation complete: idea-NNNN "{title}" → verdict: go → candidate.
Core assumptions: {N} of {total} hold. Differentiation: {differentiating point}.
Next step: /spark:business idea-NNNN to produce business design (positioning / model / pricing / GTM), then /spark:prd for the design doc.
```

**no-go:**
```
Evaluation complete: idea-NNNN "{title}" → verdict: no-go.
Demoted to pool. death_reason: {slug}.
It will serve as fuel when /spark:combine runs — it will be used in complementary matching.
```

**maybe:**
```
Evaluation complete: idea-NNNN "{title}" → verdict: maybe.
Key assumption "{which assumption}" lacks sufficient evidence. Suggested next steps:
- Gather more evidence → /spark:research idea-NNNN (specify the gap to fill)
- Adjust direction → /spark:refine idea-NNNN
```

---

## Anti-Hallucination Rules

- **Only `[verified]` evidence** drives verdicts; `[unverified]` / `[AI-guess]` are not admissible for verdicts.
- When an assumption has no corresponding verified evidence, verdict is `unconfirmed` — not `holds`, not `refuted`.
- Do not fabricate competitor data — if the research report has none, say "research report contains no verified data on this."

---

## Language

Respond in the user's language. If the user writes in Chinese, reply in Chinese; if in English, reply in English. Snapshot section headers and body always stay in English.
