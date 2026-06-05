---
name: background
description: |
  Spark idea-engine · background. Flag unfamiliar terms/projects, ask consent, then web-research public terms / ask you about private background, and persist to the background library.
  Triggers: /spark:background, "do you know these terms". 中文触发:/背景、「这几个词你懂吗」.
---

# background — Spark Idea Engine

Flag unknown terms/projects → ask consent → web-research public terms / ask about private projects → persist to `background/`.

---

## Read First (before speaking)

After activation, **read `background/_index.md` first**, noting which terms and projects are already settled. Do not re-research or re-ask about anything already in the index. Finish reading before saying anything.

---

## Phase 0–4 (Core Flow)

### Phase 0 — Read the Background Index

- Read `background/_index.md` in full.
- Note every term already in the `## Terms` table and every project already in the `## Projects` table.
- **Stay silent.** Build the internal checklist, then move to Phase 1.

---

### Phase 1 — Identify Uncertain Items

Scan the current conversation (or the specified idea file) for all **uncertain or unknown nouns and project-background references**. Classify each as one of two types:

| Type | Description | Examples |
|---|---|---|
| **Public term** | Industry vocabulary, product name, or technical noun — authoritative definition findable on the web | SteamDB, roguelike, ARR |
| **Private background** | Apparently the user's own project, codename, or abbreviation — only the user knows | "my side project", "the XX platform", "that app" |

**Rules:**
- Already in the Phase 0 index → skip; do not list it.
- Unsure whether public or private → treat as private (ask the user; do not guess).
- Generic everyday words ("app", "user", "product") → do not flag.

---

### Phase 2 — Flag + Ask Consent (D10 Hard Constraint)

**Never web-search and never launch extended questioning without explicit user confirmation.**

List every item identified in Phase 1 together and present them to the user. Example format:

> "I have a few terms I'm not sure about — before I do anything, let me check with you:
>
> - **SteamDB** (public term — want me to look up a short definition online?)
> - **roguelike** (public term — want me to look it up?)
> - **that side project** (looks like a private project of yours — could you give me a quick description?)
>
> Which of these should I research or fill in?"

**Wait for the user's explicit confirmation (written consent) before entering Phase 3.** Items the user says "skip" or "not needed" are silently dropped and nothing is written for them.

---

### Phase 3a — Public Terms (after consent)

For each public term the user has approved:

1. Use web search (`web_search` + `web_reader`) to retrieve a definition and key facts.
2. **Every result must carry a source URL.** If no URL can be found, tag the fact `[unverified]` — never substitute model memory.
3. Append one row to `background/glossary.md`. The row must **exactly match the existing header columns**:

   ```
   | term | definition | key facts | source | date | tags |
   ```

   - **definition**: one sentence, ≤ 30 words.
   - **key facts**: 1–3 facts separated by semicolons.
   - **source**: the original URL; if unavailable write `none` and prefix key facts with `[unverified]`.
   - **date**: today's date `YYYY-MM-DD`.
   - **tags**: 2–4 keywords (e.g., `game-platform`, `database`, `SaaS`).
   - Facts backed by a source URL → tag `[verified]`.

4. **One term per row.** Do not merge multiple terms into one row or split a single term across rows.

---

### Phase 3b — Private Background (after consent)

For each private project the user has approved, ask the following 3 questions one at a time (wait for the answer before asking the next):

1. "What is this project in one sentence?"
2. "What stage is it at right now?"
3. "What's the connection between it and the current idea?"

After collecting the answers:

- Scan the `background/projects/` directory for the highest existing sequence number `NNN` → new number = highest + 1 (first file uses `001`).
- Create `background/projects/proj-NNN_<name>.md` with the following structure:

  ```markdown
  # {Project Name}

  > Source tag: [user] · Date: {YYYY-MM-DD}

  ## What It Is
  {User's own words or a lightly cleaned version} [user]

  ## Current Status
  {Progress} [user]

  ## Constraints & Key People
  {Known constraints, key people (codenames are fine)} [user]

  ## Connection to the Current Idea
  {User-supplied explanation of the relationship} [user]
  ```

- Tag every piece of content `[user]`. **Do not fabricate anything on the user's behalf.**
- Sensitive names may be replaced by the user's chosen codename; record the codename in the file.

---

### Phase 4 — Update Index + Return to Conversation

1. **Update `background/_index.md`**:
   - New public terms → append to the `## Terms` table (`| term | one-liner |`); copy the one-liner from the matching glossary row.
   - New private projects → append to the `## Projects` table (`| project | one-liner | file |`); set file to the relative path `projects/proj-NNN_<name>.md`.

2. **Return to the original conversation** with the newly filled-in background:
   - Called by `/spark:refine` → say: "Background updated — returning to `/spark:refine`."
   - Called by `/spark:capture` (via `to-background: [term]` marker) → say: "Background recorded — you can continue with `/spark:capture` or `/spark:refine`."
   - User triggered `/spark:background` directly → give a brief summary of what was written and suggest a next step.

---

## Trigger Reference

| Trigger | Description |
|---|---|
| User runs `/spark:background` manually | Run identification + flagging flow on the current conversation |
| `/spark:refine` built-in background hook | Refine pauses on an uncertain term and jumps into this skill |
| `/spark:capture` leaves a `to-background: [term]` marker | Capture does not interrupt; user triggers this skill later manually or via `/spark:refine` |
| User says "do you know these terms" / "look up these terms first" | Same as manual `/spark:background` |

**Core constraint (D10): no web search, no extended questioning without user consent.** The Phase 2 confirmation step must never be skipped.

---

## Write Rules

### Glossary (`background/glossary.md`)

- Append to the end of the table. **Never modify existing rows.**
- Column order must exactly match the header: `| term | definition | key facts | source | date | tags |`.
- One term per row; definition ≤ 30 words; key facts 1–3 items separated by semicolons.
- No source URL available → prefix key facts with `[unverified]`, write `none` in the source column.

### Project Files (`background/projects/proj-NNN_<name>.md`)

- Required sections: "What It Is / Current Status / Constraints & Key People / Connection to the Current Idea".
- Every content item tagged `[user]` — no inference, no expansion.
- Filename sequence number is zero-padded to three digits (`proj-001_...`).

---

## Source Tags

| Tag | Meaning |
|---|---|
| `[user]` | Provided directly by the user |
| `[verified]` | Public fact backed by a source URL |
| `[unverified]` | Claim without a retrievable source URL |

---

## Language

Respond in the user's language. Files use English section headers regardless of conversation language.
