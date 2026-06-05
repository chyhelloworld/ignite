---
name: research
description: |
  Spark idea-engine · research. Live competitor research by category/platform (product, pricing, scale, review pain points), every fact with a source, never fabricated.
  Triggers: /spark:research, "check the competitors". 中文触发:/调研、「查查竞品」.
---

# spark-research: Research

**Role: fetch real competitor data from the web, every item with a source. Does not nurture ideas or draw feasibility conclusions.**

---

## Read Before You Begin

After activation, read these files before responding:

1. `background/_index.md` — settled terminology and project context; avoids re-asking about already-known terms.
2. The target idea file (`ideas/idea-NNNN_*.md`) — read frontmatter + the `## To research` section.
3. `rules/category-platform-map.md` — determines the primary research sources for this run.

Read all three, then begin.

---

## Pre-Check

**Before entering any Phase, verify both conditions below. Block immediately if either fails.**

### Check 1: status must be ≥ refined

Read the `status` field of the target idea:

- `status` is `raw` or `refining` → **block**, reply:
  > "This idea has not been refined yet — the `## To research` competitor keywords are missing. Run /spark:refine first to extract competitor keywords."
  **Do not proceed to any Phase.**

- `status` is `refined` (or later) → pass, continue.

### Check 2: ## To research must contain competitor keywords

Read the `## To research` section in the idea body and confirm ≥ 2 competitor keywords are present:

- Keywords missing or insufficient → **block**, same prompt as above (run /spark:refine first).
- Keywords present → pass, read `rules/category-platform-map.md` to determine primary research sources, then enter Phase 0.

---

## Phases 0–5

### Phase 0 — Read idea + determine primary research sources

1. Extract from `## To research`:
   - List of competitor keywords
   - List of facts to verify
2. Read `category` and `platform` from frontmatter.
3. Use the "Primary research sources" column in `rules/category-platform-map.md` to determine this run's primary sources:
   - Game / Steam → Steam same-tag charts, SteamDB
   - App / iOS → App Store charts, similar apps
   - SaaS / Web → general search + Product Hunt
   - Tool / Web → general search + Product Hunt + GitHub
   - Content / short-video or newsletter → platform search + benchmark accounts
   - Hardware / crowdfunding → crowdfunding platforms + e-commerce charts
4. Brief the user: "Researching idea-NNNN — primary sources: {sources}, keywords: {keywords}. Starting search…"

**This Phase only reads files and sets strategy. No web requests.**

### Phase 1 — Competitor discovery (web_search)

For each competitor keyword, use `web_search` with **keyword + primary platform** to build a candidate competitor list:

- Search strategy examples:
  - Steam games → `"{keyword}" site:store.steampowered.com` or `SteamDB {keyword} similar games`
  - App Store → `"{keyword}" app store top charts`
  - SaaS / tool → `"{keyword}" site:producthunt.com` or `best {keyword} tools`
  - Content → `"{keyword}" short-video account` or `"{keyword}" newsletter ranking`
- Identify **candidate competitors** from results (product name + one-line description).
- If the first round returns no results → retry with synonyms or drop restrictive qualifiers.

**Record every search source URL for tagging in Phase 3.**

### Phase 2 — Deep competitor dive (web_reader)

For each candidate competitor from Phase 1, use `web_reader` to fetch the official site / store page / Product Hunt page and extract:

| Dimension | Content |
|---|---|
| What it does | Core function in one sentence |
| Pricing | Price range (free / subscription / one-time / in-app purchase), with date |
| Scale | Downloads, review count, MAU, estimated users (whatever is findable) |
| Funding | Round + amount (if available) |
| User pain points | 2–3 pain points distilled from user reviews / App Store negative reviews / Steam negative reviews |

Every data point **must record its source URL**. If a data point cannot be found on the current page, mark it `[unverified]` — do not guess.

For tool failures see the "Error handling" section.

### Phase 3 — Information grading

Tag every item collected in Phase 2 according to the following rules:

| Tag | Condition |
|---|---|
| `[verified]` | Has a clear source URL + traceable date |
| `[unverified]` | No source link, or link is dead |
| `[AI-guess]` | Inferred from known information, not a direct source |
| `[disputed]` | Two sources give conflicting data; cannot determine which is correct |

**The evaluate gate accepts only `[verified]` data.** `[AI-guess]` and `[unverified]` items are reference only — they must not be stated as facts in the report.

### Phase 4 — Write research report + backfill

1. Write `research/idea-NNNN_research.md` (structure defined below under "Report structure").
2. Backfill the idea file frontmatter:
   ```yaml
   research_ref: research/idea-NNNN_research.md
   status: researched
   updated: {today's date}
   ```
3. Update the `status` column for the corresponding row in `ideas/_status.md` to `researched` and set `updated` to today's date.

**If Phase 2 encountered web tool failures that left the research incomplete, do not advance status (see "Error handling").**

### Phase 5 — Hook for evaluate

After the `## Market gaps & differentiation` section in the report, add an "Evaluate gate reference" paragraph summarising:

- **Price band**: mainstream pricing range in the market (only `[verified]` data).
- **Top user complaints**: top 2–3 pain points distilled from negative reviews, for the evaluate gate to challenge core assumptions.
- **Market gaps**: features / scenarios / audiences missing from existing competitors. If no strong evidence exists, tag `[AI-guess]`; do not state as fact.

Completion receipt:

```
Research complete: idea-NNNN "{title}" → researched.
Competitors found: {N}. Verified facts: {M}.
Next step: /spark:evaluate idea-NNNN
```

---

## Report structure

Written to `research/idea-NNNN_research.md`:

```markdown
---
idea: idea-NNNN
date: YYYY-MM-DD
platform: {platform}
sources_count: {number of verified sources}
---

# idea-NNNN Research Report

## Competitors

| Competitor | What it does | Pricing | Scale | Source |
|---|---|---|---|---|
| {name} | {function} | {price} [verified] | {scale} [verified] | [link](URL) |

## Price band

{Description of mainstream pricing range; each item tagged [verified] / [unverified]}

## User pain points (from negative reviews)

- {Pain point 1} [verified] — source: {link}
- {Pain point 2} [verified] — source: {link}

## Market gaps & differentiation

{Scenarios / audiences / features missing from existing competitors; inferences without strong evidence tagged [AI-guess]}

## Source-credibility note

- Verified ({N} items): facts with source links — the evaluate gate may rely on these.
- Unverified ({M} items): {list which data points could not be sourced}
- Disputed ({K} items): {list conflicting items with their respective sources}
```

---

## Anti-hallucination HARD rules

1. **Any competitor fact without a source link is tagged `[unverified]` and must never be written as a statement of fact in the report.**
2. **Numbers (pricing / scale / funding) must carry a source URL + the date the data was collected** — numbers go stale, and the date is part of credibility.
3. **Model memory is NOT a source.** The fact that Claude "knows" a competitor from training data does not mean there is a source link. The item must actually be fetched via `web_reader` before it may be tagged `[verified]`.
4. The evaluate gate accepts only `[verified]` data — the ceiling value of a research report is determined by its verified-fact count.

---

## Error handling

### No direct competitors found

This is not a failure; it is a strong signal. **Do not default to "blue ocean."**

How to handle:
- In `## Competitors` write: "No direct competitors found (keywords: {keywords}, primary sources: {sources}, search date: {date})."
- In `## Market gaps & differentiation` note: "No direct competitors may mean the need is not yet validated, or it may mean the need itself does not exist — hand to the evaluate gate for judgement; do not draw conclusions here."
- Advance `status` to `researched` as normal (research is complete; the result is simply that no direct competitors exist).

### Web tool timeout / failure

- A single tool call fails → retry once with different keywords; if it still fails → mark that competitor row `[research failed: tool timeout]`.
- If most competitor data cannot be retrieved, mark the top of the report **"Research incomplete"** and note the scope of failure.
- **Do not advance `status` to `researched`**; write today's date into the idea frontmatter `updated` field but keep `status: refined`.
- Prompt the user: "Web tool error — research incomplete. Please retry `/spark:research idea-NNNN` later. **Never substitute model memory for live web results.**"

### Sparse or contradictory data

- Two sources give conflicting data → **list both**, each with its source URL, both tagged `[disputed]`.
- **Do not reconcile.** Do not average. Do not pick the "more credible-feeling" one.
- Note the disputed items in `## Source-credibility note` and leave the judgement to the evaluate gate.

---

## Language

Respond in the user's language. Report section headers remain in English.
