---
name: capture
description: |
  Spark idea-engine · capture. Store a one-line idea into the pool with zero friction; preserve the original verbatim.
  Triggers: /spark:capture, "jot this down", "save this". 中文触发:/捕捉、「记一下」「先存着」.
---

# capture — Spark Idea Engine

**Only creates a raw atom. No follow-up questions, no elaboration, no research.**

---

## Atom creation process

**Step 1 — Get the id**

Scan all files matching `idea-NNNN_*.md` under `ideas/`, extract the numeric part, take the maximum + 1. If none exist, start from `idea-0001`. Pad to four digits with leading zeros.

**Step 2 — Determine the filename**

File path: `ideas/idea-NNNN_<title>.md`

Derive the title from the noun phrase in the user's input — no more than ~15 characters, do not reword or abstract the original meaning.

**Step 3 — Write frontmatter (copy the template below verbatim, replace placeholders)**

```yaml
---
id: idea-NNNN
title: one-line title
status: raw
kind: single
parents: []
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

- `status` is always `raw`
- `category / platform / effort / excitement / verdict / death_reason / research_ref / eval_ref` are all `null`
- `tags / parents / artifacts / relationships` are empty arrays `[]`
- `created` and `updated` are today's date (obtain via Bash `date +%F` or system date)

**Step 4 — Write the body skeleton (template below)**

```markdown
## Original [user]
> {user's exact words, verbatim}

## Refined description
(to refine)

## Core assumptions
(to refine)

## To research
(to refine)

## Refinement log [AI-meta]
```

The block quote under `## Original [user]` must be the user's exact words, unchanged.

---

## Zero-friction rules

- If the input contains an unknown term or private background word → **do not interrupt, do not search the web, do not ask follow-up questions**. Write one line `to-background: [term]` in `## To research` and leave it for a later `/spark:background` or `/spark:refine` call.
- During the capture phase: no web search, no follow-up questions, no evaluation, no rewording of the original.

---

## Wrap-up

**Update `ideas/_status.md`**: append one row to the table:

```
| idea-NNNN | title | raw |  |  |  |  |  | YYYY-MM-DD |
```

(leave verdict / category / platform / excitement / effort columns blank)

The 9 columns are: id / title / status / verdict / category / platform / excitement / effort / updated.

**Receipt one-liner**:

```
Saved: idea-NNNN · ideas/idea-NNNN_<title>.md. Next: /spark:refine
```

---

## Boundaries

- **Empty input** → do not create a file; reply "No idea captured — please provide a one-line idea."
- **Multiple ideas in one message** → split into separate atoms, run the full process for each in sequence, then return a combined receipt listing all ids.

---

## Language

Respond in the user's language. English input is kept verbatim in `## Original [user]`; skeleton headers remain in English.
