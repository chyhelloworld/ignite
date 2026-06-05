---
name: refine
description: |
  Spark idea-engine · refine. Interactively flesh out a one-line idea into a researchable one; demote vague/pseudo-concepts; scan for sparks at the end.
  Triggers: /spark:refine, "help me think this idea through". 中文触发:/完善、「帮我把这个想法想清楚」.
---

# spark:refine — Refine

**Responsibility: turn a raw one-liner into a researchable, refined idea. No research, no feasibility verdict — that's for later.**

---

## Read First (before speaking)

After activation, read all of the following before saying anything:

1. `background/_index.md` — settled terminology and project context; avoid re-asking about words already defined there.
2. The target idea file (`ideas/idea-NNNN_*.md`) — read the raw body text and current frontmatter.
3. `rules/category-platform-map.md` — reference this table when auto-filling `platform` in Phase 3.

Read everything, then speak.

---

## Phases 0–7 (Core Flow)

> Discipline: **advance one Phase at a time; ask one question, then stop and wait for the user's response before moving on.**

### Phase 0 — Load atom + warm up

- Read the full raw atom (frontmatter + body `## Original [user]`).
- **First write action:** change `status` from `raw` to `refining` (marks this idea as in-progress; if the session is interrupted mid-way, the next session can see it is being worked on rather than untouched).
- Scan all atoms in `ideas/` for their `tags`, `category`, and `death_reason` (if present) — warm-up data for the Phase 7 spark scan.
- **Do not say anything to the user yet.** Prepare internally, then move to Phase 1.

### Phase 1 — Recap + icebreaker question

- Restate the user's raw idea in **one sentence** (confirm understanding, do not rewrite it).
- Immediately ask the **first question**:

  > "Whose problem does this solve, and what exactly is the pain? Can you be more specific?"

- Stop and wait for the user's response.

### Phase 2 — Language-trap detection

- Examine the core words in the user's response (and the original raw text).
- **If you find vague, undefined key terms** (e.g., "efficient", "premium", "smart", "better", "convenient", "disruptive"):
  - Push the user to define them, e.g.: "When you say 'efficient' — does that mean saving time, saving money, or reducing errors?"
  - **Ask about one term at a time.** If the user still cannot define it → trigger the demotion flow (see "Demotion Criteria" below).
- If core terms are clear → proceed directly to Phase 3.

### Phase 3 — Product shape + category/platform

- Based on the conversation, determine the product shape (app / saas / game / content / tool / hardware / …).
- Use `rules/category-platform-map.md` to **auto-fill** `category` → `platform`.
- Confirm with the user or allow an override:

  > "I'm classifying this as {category} · {platform} — does that sound right, or would you describe it differently?"

- Stop and wait for the user's confirmation or their override values.

### Phase 4 — Core assumptions

- Work with the user to extract **1–3 core assumptions**: what must be true for this idea to work?
- Guide the conversation: "For this idea to hold up, it depends on a few premises — which one do you think is most critical?"
- **Propose one assumption at a time:** put it forward, stop and wait for the user to confirm or revise it, write the confirmed assumption into `## Core assumptions`, then propose the next one. Do not dump all 1–3 at once.

  ```
  - [assumption] {assumption statement}
  ```

- Once 1–3 assumptions are confirmed by the user, move to Phase 5.

### Phase 5 — Subjective scoring + effort estimate

- Ask for excitement:

  > "On a scale of 1–5, how excited are you about this idea?" (This is `[user]` data — only you know it.)

- After the user answers, give an AI effort estimate (S / M / L / XL, tagged `[AI-guess]`) with a one-sentence rationale.
- Stop and wait for the user's feedback on the effort estimate or their acceptance of it.

### Phase 6 — Research to-do list

- Based on category + platform + core assumptions, compile:
  - **Competitor keywords** (≥ 2, for use when running `/spark:research`)
  - **Facts to verify** (≥ 1, e.g., pricing ranges, user-base size, technical feasibility)
- Write these into `## To research`:

  ```
  - Competitor keywords: {keyword1}, {keyword2}
  - Facts to verify: {item1}
  ```

- Ask the user to confirm or add any missing keywords.

### Phase 7 — Wrap-up spark scan

- **Scan the pool for sparks:** go through all atoms in `ideas/` (including no-go atoms) and check whether their tags / category / death_reason are complementary to or combinable with the current idea.
  - If there is a match → surface it: "{idea-NNNN} ({title}) might complement this one — you could dig deeper with `/spark:combine`."
  - If no match → do not force one.
- **Write back** (see "Write-Back" section below).

---

## Exit Gate

**All four conditions must be met before setting `status` to `refined`. If any one is missing, do not change the status.**

① A single sentence clearly states "whose pain, what pain"
② `category` + `platform` are determined
③ `## Core assumptions` has ≥ 1 entry
④ Competitor keywords ≥ 2 (written into `## To research`)

If not met → **do not** set status to `refined`; keep it `refining` and note which condition is missing.

---

## Demotion Criteria

The following ideas **skip research and stay in the pool as fuel**:

| Criterion | Tag to add |
|---|---|
| Core term still cannot be defined after pushing (e.g., "better", "smart" remain undefined) | `#pseudo-concept` |
| Cannot name who uses it or what specific pain it solves | `#vague` |
| Fundamentally an emotion or wish, not a product shape (e.g., "make the world a better place") | `#not-a-product` |

**Demotion steps:**
- Roll `status` back to `raw` (Phase 0 set it to `refining`; a hard demotion returns it to the pool bottom as raw fuel).
- Add the corresponding tag to `tags`.
- Write a one-sentence explanation of why it was demoted into `## Refinement log [AI-meta]`.
- **Never delete an atom** — dead atoms are fuel for the spark scan.

> Distinguish two kinds of "didn't exit the gate": ① **Demotion** (pseudo-concept / vague / not-a-product) → roll back to `raw` + add tag; ② **Just not done yet** (incomplete info, session paused) → keep `refining` and resume next time.

Tell the user: "This idea is still too vague to refine right now. I've left it in the pool tagged `#vague`. Come back and work on it when you're ready."

---

## Background Hook

In the following situations, **pause the refinement flow and suggest running `/spark:background`**:

- The body contains `pending-background:[term]` (a marker left during capture).
- A term or private project reference comes up in conversation that the AI cannot confidently interpret.

Prompt: "I'm not sure about '{term}' — should we run `/spark:background` to clarify it first, then come back to refine? I won't look it up online on my own."
Wait for the user to confirm before switching; do not go online unilaterally.

---

## Write-Back

After Phase 7 completes and all exit gate conditions are satisfied, update the following:

### Frontmatter fields to update

Strictly follow field names from `rules/schema.md`. **Keep YAML values clean — do not embed source tags inside YAML** (they are not valid YAML):

```yaml
status: refined
category: {confirmed value}
platform: {confirmed value}
effort: {S/M/L/XL}
excitement: {1-5}
tags: [...existing + newly added]
updated: {today's date}
```

Source attribution goes in prose: `effort` is AI-estimated, `excitement` is user-given. If a record is needed, add a one-liner in `## Refinement log [AI-meta]` (e.g., "effort=M [AI-guess]; excitement=4 [user]").

### Body sections to fill

- `## Refined description`: one paragraph clearly stating "whose pain + what pain + initial product shape".
- `## Core assumptions`: one line per entry, format `- [assumption] {content}`.
- `## To research`: competitor keywords + facts to verify.
- `## Refinement log [AI-meta]`: key turning points, directions the user rejected, product shapes that were discarded, demotion reason if applicable.

### Status overview update

Update the corresponding row in `ideas/_status.md`: status / category / platform / excitement / effort / updated.

### Completion receipt

```
Refinement complete: idea-NNNN "{title}" → refined.
Core assumptions: {N}. Competitor keywords: {keywords}.
Next step: /spark:research idea-NNNN
```

---

## Dialogue Discipline

- **Ask one question at a time. Stop after asking and wait for the user's response.**
- Do not run through Phases 0–7 all at once and dump the output.
- Each Phase has exactly one question (or confirmation) put to the user.
- If the user answers multiple questions in one message → acknowledge each in order, do not skip ahead.
- Refinement only fattens the idea: **no online research, no feasibility conclusions** (those belong to `/spark:research` and `/spark:evaluate`).

---

## Language

Respond in the user's language. If the user writes in English → reply in English. File section headers stay in English regardless.
