---
name: combine
description: |
  Spark idea-engine · combine. Scan the whole pool (incl. dead atoms) and pair complements by topic / death reason into new combo candidates.
  Triggers: /spark:combine, "mix and match for sparks". 中文触发:/找火花、「拼拼看有没有火花」.
---

# spark:combine — Find Sparks

Scan the whole pool (including dead atoms) by topic / death-reason complement to propose combinations; build combo candidates; new combos go back to `/spark:refine` to be cultivated.

---

## Two Triggers

| Trigger | Scan scope |
|---|---|
| User manually invokes `/spark:combine` (or "mix and match for sparks") | **Full-pool scan**: read every atom under `ideas/` |
| Called by `/spark:refine` at wrap-up (Phase 7) | **Lightweight scan**: only atoms whose `tags` / `category` / `death_reason` relate to the current idea |

---

## Scan Flow

### Step 1 — Read the whole pool

Read every `idea-NNNN_*.md` file under `ideas/`. For each atom extract:
- `id`, `title`, `tags`, `category`, `verdict`, `death_reason`, `relationships`

**Atoms with `verdict: no-go` MUST be included in the scan — they are spark fuel, never filtered out.**

### Step 2 — Match dimensions

For every pair (A, B) check two dimensions for combinability:

**① Topic proximity**: A and B share overlapping `tags` or `category` → likely the same user group or scenario.

**② Death-reason complement**: consult the "can be complemented by" column in `rules/death-reasons.md`:

| A's death_reason | What B can supply |
|---|---|
| lacks-traffic | B brings traffic / a channel |
| lacks-monetization | B has a paying scenario |
| lacks-tech | B has tech assets |
| collision-no-diff | B offers a differentiation angle |
| weak-demand | B has a strong-demand scenario |
| effort-too-large | B reuses / cuts cost |
| platform-limit | B switches or bypasses the platform |

> Complementarity is bidirectional: when B has a `death_reason`, check equally whether A can fill B's gap.

### Step 3 — Surface candidates

Present the valuable combinations in this format:

```
{idea-A title} + {idea-C title} might strike a spark around {X}
Reason: {why they complement / why there is a spark, one sentence}
```

- **Propose at most 3 pairs per run**, ranked by spark strength (death-reason complement takes priority over pure topic proximity).
- If no worthwhile combination is found → say so honestly: "No combinations worth pairing were found in this scan."

---

## Building a Combo Atom

After the user selects a combination, execute the following steps:

### Step 1 — Get the next id

Scan all `idea-NNNN_*.md` under `ideas/`, extract the highest sequence number, add 1, zero-pad to four digits → `idea-NNNN`.

### Step 2 — Create the new atom file

File path: `ideas/idea-NNNN_<title>.md`

Title: use "{A short title} × {C short title}" or a concise phrase capturing the combination point (≈ 15 words max).

**Frontmatter template (copy verbatim, replace placeholders):**

```yaml
---
id: idea-NNNN
title: {one-sentence combination title}
status: raw
kind: combo
parents: [idea-A, idea-C]
tags: []
category: null
platform: null
effort: null
excitement: null
verdict: null
death_reason: null
created: YYYY-MM-DD
updated: YYYY-MM-DD
research_ref: null
eval_ref: null
artifacts: []
relationships: []
---
```

- `kind` is always `combo`; `parents` lists the two source atom ids.
- `status` is always `raw` — a new combo must go through refine → research → evaluate from the start.
- All other fields follow the capture template: null / empty array; created = updated = today's date.

**Body skeleton:**

```markdown
## Original [user]
> Derived from {idea-A title} + {idea-C title}: {combination point in one sentence} [AI-conclusion]

## Refined description
(to be refined)

## Core assumptions
(to be refined)

## To research
(to be refined)

## Refinement log [AI-meta]
```

> The `## Original [user]` section carries the `[AI-conclusion]` tag — this combination was proposed by the AI, not stated in the user's own words.

### Step 3 — Write back to source atoms' relationships

**Leave the original A and C files untouched** except appending one entry to each atom's `relationships` array:

```yaml
- { type: complement, target: idea-NNNN }
```

(`idea-NNNN` is the id of the newly created combo.)

### Step 4 — Update status overview

Append one row to the table in `ideas/_status.md` (columns match the header: id / title / status / verdict / category / platform / excitement / effort / updated; leave verdict and other columns blank for the new combo):

```
| idea-NNNN | title | raw |  |  |  |  |  | YYYY-MM-DD |
```

(`kind: combo` is recorded in the atom's frontmatter; the status overview has no `kind` column — do NOT write `combo` in the verdict column.)

---

## Wrap-Up

After the file is created, prompt the user:

```
Combo idea-NNNN "{title}" created.
Sources: idea-A "{A title}" + idea-C "{C title}"
Next step: /spark:refine idea-NNNN  →  cultivate it from the start (combos also go through refine → research → evaluate).
```

---

## Boundaries

- **Pool has fewer than 2 atoms** → skip the scan; reply: "Too few ideas in the pool — capture a few more before looking for sparks."
- **User selects no combination** → create no file; keep the suggestions; re-scan the next time the user triggers combine.
- **Two atoms already have a complement relationship** (each other already appears in `relationships`) → skip; do not re-propose.
- **Combo atoms themselves** (`kind: combo`) may serve as source atoms in a subsequent round of combinations, but they have lower priority than single atoms.

---

## Language

Respond in the user's language. File section headers stay in English regardless.
