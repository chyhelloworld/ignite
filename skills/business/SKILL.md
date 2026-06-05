---
name: business
description: |
  Spark idea-engine · business. Turn a go-verdict candidate into positioning, audience, business model, pricing, and GTM.
  Triggers: /spark:business, "draft a business plan". 中文触发:/商业、「出个商业方案」.
---

# spark:business — Business Design

Only produce a business plan for ideas with `verdict: go`; does not write PRDs or technical implementation.

---

## Pre-Check

**Before entering any Phase, read the target idea's frontmatter. Block immediately if the condition is not met.**

Read `verdict` and `status` from `ideas/idea-NNNN_*.md`:

- `verdict` is not `go` → **block**, reply:
  > "This idea hasn't passed the gate (verdict≠go). Run /spark:evaluate first."

  **Do not proceed to any Phase.**

- `verdict: go` and `status: candidate` → passed; continue to `## Read First`.

---

## Read First

After activation and passing the pre-check, read these files before saying anything:

1. `background/_index.md` — settled terminology and project background; avoid re-asking about known terms.
2. The target idea file (`ideas/idea-NNNN_*.md`) — read all frontmatter fields and the full body.
3. `research/idea-NNNN_research.md` — read competitor list, price band, user pain points; **only trust `[verified]` data**.
4. `decisions/idea-NNNN_eval_*.md` (take the file with the latest date in its name) — read evaluation conclusions and still-uncertain assumptions.

Read everything first, then proceed.

---

## Phases 0–7

### Phase 0 — Load & Organize

1. Extract from the idea file:
   - `category`, `platform`, `effort`, `excitement`.
   - Core feature positioning from `## Refined description`.
   - The `## Core assumptions` list.
2. Extract from the research report (only trust `[verified]`):
   - Competitor list and strongest competitor.
   - Market price band (this is the anchor for Phase 4 pricing — do not skip).
   - Top 2–3 user pain points.
3. Extract from the eval snapshot:
   - Final verdict rationale.
   - Which assumptions are still "uncertain" (revisited in Phase 6 risk review).

**This Phase only reads files; do not output any analysis to the user.**

---

### Phase 1 — Positioning (one-line value proposition)

Produce a one-line value proposition with this structure:

> "For **{target user}**, in **{context/scenario}**, we provide **{core capability}**, so you can **{pain solved}**, unlike **{shortcoming of existing alternatives}**."

Requirements:
- User group must be specific (avoid over-broad terms like "everyone" or "developers").
- Pain point must come from `[verified]` user complaints or unmet needs in the research report.
- Differentiation must come from the "no direct collision" rationale in the eval snapshot; if the eval snapshot marks differentiation as `[AI-guess]`, label it `[AI-guess]` here too.

---

### Phase 2 — Target Audience

Based on the idea's `platform` and research conclusions, provide:

1. **User persona**: who uses it, in what context, what their core needs are (no more than 5 attributes).
2. **Discovery paths**: where this type of user typically goes on that `platform` and how they can be reached.
   - Steam game → tag pages / sales / content creators.
   - iOS/Android app → charts / ASO / communities / KOLs.
   - SaaS/Web tool → Product Hunt / SEO / developer communities.
   - Content account (TikTok/WeChat) → cross-promotion with similar accounts / algorithmic distribution.
3. **Where early seed users are**: specific communities or channels easiest to reach during cold start (≥1 item).

---

### Phase 3 — Business Model (money-printer view)

Break down using the three money-printer elements:

| Element | Content |
|---|---|
| **Input (what you put in)** | Production cost, time, operational labor, customer acquisition cost |
| **Output (what it reliably produces)** | Specific revenue streams (subscription / one-time purchase / revenue share / ads / service fee…) |
| **Switching cost** | How hard it is for users to replace this product |

Then answer "**how it makes money**": which stream is primary, which is secondary, and whether there are platform cuts or distribution fees.

Business model conclusions are labeled `[AI-conclusion]` (derived from axioms); revenue figures with no research backing are labeled `[AI-guess]`.

---

### Phase 4 — Pricing (loss-leader / profit tier / price-gap check)

**Hard rule: must cite the `[verified]` price band from the research report as the pricing anchor — never price out of thin air.**

Steps:
1. Cite the research price band ([verified]): "The mainstream market price range is {X–Y per month or USD} (source: {corresponding section of research report})."
2. Based on the **"pricing is product"** axiom, define two tiers:
   - **Loss-leader**: low-price or free features that lower the barrier to trying; purpose is customer acquisition, not revenue.
   - **Profit tier**: premium features/plans that cover costs and generate profit.
3. **Price-gap check**: profit tier price ÷ loss-leader price ratio; ideal is 10×, acceptable range is 5–15×. If the ratio falls outside this range, explain why.
4. Label conclusions: pricing structure is labeled `[AI-conclusion]`; specific price figures sourced from research are labeled `[verified]`; figures that are estimates are labeled `[AI-guess]`.

---

### Phase 5 — GTM (cold start + acquisition channels)

Output two parts:

**Cold start (0 → first real users)**

Provide specific paths by `platform`:
- Steam game → Steam wishlist page, devlog communities, YouTuber/streamer early access.
- App (iOS/Android) → TestFlight / beta invites, niche forums (Reddit / V2EX), app review coverage.
- SaaS/Web → Product Hunt launch, Hacker News Show HN, target user communities.
- Content (TikTok/WeChat) → engage in comments of top accounts, ride trending hashtags, cross-promotion cold start.

**Acquisition channels (scale-up)**

List 2–3 primary channels (matched to platform + user persona), each with:
- Channel name and specific action.
- Expected unit acquisition cost (UAC): high / medium / low, labeled `[AI-guess]` (cite `[verified]` if research has data).

**Reminder**: invoking the "traffic ≠ revenue" axiom — high traffic does not equal money made; conversion rate and LTV matter more than DAU. [AI-conclusion]

---

### Phase 6 — Risk Review

List 3–5 key **business** risks (do not list technical risks — those belong in the PRD), format:

```
Risk N: "{risk description}"
Severity: High / Medium / Low
Mitigation: {one sentence}
```

Then **revisit the eval snapshot**: list each core assumption still marked "uncertain" at evaluation time, and note "this assumption still needs validation during business design execution."

---

### Phase 7 — Write Out

**7a. Write the business-design document**

Write to `outputs/idea-NNNN_business.md` (structure defined below in "Business-design doc structure").

**7b. Back-fill the idea frontmatter**

Strictly use field names from `rules/schema.md`:

```yaml
artifacts:
  - outputs/idea-NNNN_business.md   # append; do not overwrite existing entries
updated: {today's date}
# status stays candidate — do NOT change to documented (that's /spark:prd)
```

**7c. Update the status overview**

In `ideas/_status.md`, update the `updated` field for the corresponding row to today's date (status stays `candidate`, do not change).

**7d. Completion receipt**

```
Business design complete: idea-NNNN "{title}"
  Positioning: {one-line value proposition summary}
  Business model: {how it makes money, one sentence}
  Pricing anchor: [verified] {price band source}
  Output: outputs/idea-NNNN_business.md
  artifacts appended; status remains candidate.
Next step: /spark:prd idea-NNNN — generate PRD + technical plan + task list.
```

---

## Business-design doc structure

Write to `outputs/idea-NNNN_business.md`:

```markdown
---
idea: idea-NNNN
date: YYYY-MM-DD
---

# idea-NNNN Business Design

## Positioning (one-line value prop)

## Target audience

## Business model (input / output / how it makes money)

## Pricing (loss-leader / profit tier / price-gap check)

## GTM (cold start + acquisition channels)

## Key risks & assumptions to validate
```

---

## Axioms & Evidence Discipline

This skill's analysis framework draws on three business axioms:

| Axiom | Purpose |
|---|---|
| **Pricing is product** | Pricing structure is itself part of product strategy; don't set prices after designing the product — they're the same decision. |
| **Money-printer input / output** | Use the three elements — input / output / switching cost — to break down a business model and verify whether it can sustainably make money. |
| **Traffic ≠ revenue** | Chasing traffic while ignoring conversion and LTV is a common way to die; acquisition channels must be designed together with the monetization path. |

**Evidence discipline:**

- Axioms are used as an **analysis framework**; conclusions derived from axioms are labeled `[AI-conclusion]`.
- **Numerical facts** — pricing, volume, market size — are only cited from `[verified]` data in the research report; estimates with no backing are labeled `[AI-guess]`.
- **Never fabricate competitor data** — if the research report has no verified data for something, say "no corresponding verified data in research report" and do not fill in your own.
- Every conclusive statement in the business design must be traceable to: ① `[verified]` facts from research, ② axiom-derived reasoning (labeled `[AI-conclusion]`), or ③ an explicit `[AI-guess]`.

---

## Language

Respond in the user's language. If the user writes in English → reply in English; if in Chinese → reply in Chinese. Doc section headers always stay in English regardless of the conversation language.
