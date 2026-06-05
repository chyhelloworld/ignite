---
name: init
description: |
  Spark idea-engine · init. Scaffold the Spark workspace (folders + rule/config templates) into the current project so the other skills can run. Run once per project.
  Triggers: /spark:init, "set up spark here", "initialize the idea engine". 中文触发:/初始化、「在这里搭好想法引擎」.
---

# init: scaffold the Spark workspace

Set up the local-file structure the Spark skills read and write. **Run once in a project.** This skill only creates files/dirs; it never overwrites existing ones.

---

## When to run

The first time a user wants to use Spark in a project (after installing the `spark` plugin), or whenever `node tools/validate.mjs` reports missing structure. If the workspace already exists, report that and do nothing destructive.

---

## Steps

### Step 1 — Create directories

```bash
mkdir -p ideas research decisions outputs background/projects rules
touch research/.gitkeep decisions/.gitkeep outputs/.gitkeep background/projects/.gitkeep
```

### Step 2 — Prefer copying bundled templates from the plugin

If the `CLAUDE_PLUGIN_ROOT` env var is set, copy the canonical templates from the installed plugin (do **not** overwrite existing files):

```bash
SRC="${CLAUDE_PLUGIN_ROOT:-}"
if [ -n "$SRC" ] && [ -d "$SRC/rules" ]; then
  for f in schema.md category-platform-map.md death-reasons.md eval-samples.md; do
    [ -f "rules/$f" ] || cp "$SRC/rules/$f" "rules/$f"
  done
  [ -f background/glossary.md ] || cp "$SRC/background/glossary.md" background/glossary.md
  [ -f background/_index.md ]   || cp "$SRC/background/_index.md"   background/_index.md
  [ -f ideas/_status.md ]       || cp "$SRC/ideas/_status.md"       ideas/_status.md
fi
```

### Step 3 — Fallback: write templates inline

For any of the 7 template files **still missing** after Step 2, write it with the content below (skip files that already exist). Use the Write tool.

**`rules/schema.md`**
````markdown
# Schema & Stage Definitions

## Idea atom frontmatter fields

| field | values | notes |
|---|---|---|
| id | `idea-NNNN` | 4-digit sequence, incrementing, never reused |
| title | string | one-line title |
| status | raw/refining/refined/researching/researched/evaluated/candidate/documented | current stage |
| kind | single/combo | combo is produced by /spark:combine |
| parents | `[idea-..]` | source atoms for a combo; `[]` for single |
| tags | `[..]` | topic tags, used by combine for clustering |
| category | game/app/saas/content/hardware/tool/… | category |
| platform | Steam/iOS/Android/Web/mini-program/Douyin/WeChat-official/… | launch platform |
| effort | S/M/L/XL | effort estimate |
| excitement | 1-5 | your subjective excitement |
| verdict | null/go/no-go/maybe | evaluation gate result |
| death_reason | null or a death-reason word | required on no-go; from death-reasons.md |
| created / updated | YYYY-MM-DD | dates |
| research_ref / eval_ref | path or null | linked snapshots |
| artifacts | `[..]` | business design / PRD outputs |
| relationships | `[{type,target}]` | complement/collision/same-origin/counter |

## Status flow

raw →(refine)→ refined →(research)→ researched →(evaluate)→ evaluated
  ├ verdict=go → candidate →(business/prd)→ documented
  ├ verdict=maybe → back to research / refine
  └ verdict=no-go → stays in pool, death_reason required, becomes combine fuel

## Source tags (used in body prose)

`[user]` user's own words · `[AI-guess]` unverified inference · `[AI-conclusion]` reasoned conclusion · `[correction]` later fix · `[verified]` fact with a source link · `[unverified]` no source · `[disputed]` contradictory, unresolved

## Idea atom body fixed structure

```
## Original [user]
## Refined description
## Core assumptions
## To research
## Refinement log [AI-meta]
```
````

**`rules/category-platform-map.md`**
````markdown
# Category → default launch platform map

> During refine, `platform` is auto-filled from `category`; the user can override per idea. Freely editable.

| category | default platform | research source |
|---|---|---|
| game | Steam | Steam same-tag charts, SteamDB |
| app | iOS | App Store charts, similar apps |
| saas | Web | general search + Product Hunt |
| content | Douyin | platform search + benchmark accounts |
| tool | Web | general search + Product Hunt + GitHub |
| hardware | crowdfunding | crowdfunding platforms + e-commerce charts |

Available platforms: Steam / iOS / Android / Web / mini-program / Douyin / WeChat-official / crowdfunding / WeChat / desktop.
````

**`rules/death-reasons.md`**
````markdown
# Death-reason vocabulary (controlled)

> On a no-go verdict, `death_reason` MUST be one of these. /spark:combine matches complements on it. Extensible.

| death_reason | meaning | complemented by |
|---|---|---|
| lacks-traffic | buildable but no one knows it | an idea that brings its own traffic/channel |
| lacks-monetization | has users but can't collect money | an idea with a paying scenario |
| lacks-tech | implementation beyond current ability | an idea with existing tech assets |
| collision-no-diff | a strong competitor already exists with no differentiation | an idea offering a differentiation angle |
| weak-demand | pain too weak, no one buys | an idea with a strong-demand scenario |
| effort-too-large | investment far beyond bearable | an idea that reuses / cuts cost |
| platform-limit | platform policy / cut / review blocks it | an idea that switches or bypasses the platform |
````

**`rules/eval-samples.md`**
````markdown
# Golden-sample regression

> After changing any skill, dry-run the relevant samples to confirm behavior. This is the system's only "test".

## S1 Pseudo-concept must be demoted
Input: `/spark:capture "I want to build an AI that changes the world"` then `/spark:refine`
Expected: refine's language-trap check finds the core word undefinable → tags `#vague`, status does not advance to researching, no research triggered.

## S2 Clear idea runs the main line
Input: `/spark:capture "a negative-review aggregator for Steam indie games"` → `/spark:refine` → `/spark:research` → `/spark:evaluate`
Expected: refine passes the gate (category=game, platform=Steam auto-filled, ≥1 assumption, ≥2 keywords); research finds competitors each with a source; evaluate returns a verdict.

## S3 Collision must be no-go with a death reason
Input: an idea highly overlapping a mature competitor with no differentiation, taken to `/spark:evaluate`
Expected: evaluate detects collision, verdict=no-go, death_reason=`collision-no-diff`, atom stays in pool.

## S4 Complementary dead atoms must be paired
Setup: two no-go atoms in the pool with death_reason `lacks-traffic` and `lacks-monetization`
Input: `/spark:combine`
Expected: pairs them into a combo candidate (kind=combo, parents include both), creating a new idea atom.

## S5 Unknown term must trigger background research
Input: `/spark:capture "a SteamDB for roguelikes"` → `/spark:refine`
Expected: background flags SteamDB/roguelike, asks consent, then researches online and writes into `background/glossary.md` (with source + date).

## S6 Candidate produces business design and PRD
Setup: a go-verdict candidate (idea-NNNN, status=candidate)
Input: `/spark:business idea-NNNN` → `/spark:prd idea-NNNN`
Expected: business writes `outputs/idea-NNNN_business.md` (with pricing tiers), artifacts appended, status stays candidate; PRD writes `outputs/idea-NNNN_prd.md` (functional requirements with acceptance criteria), status set to documented.
````

**`background/glossary.md`**
````markdown
# Glossary

> Public terms, grown live during conversation. Each row is written by /spark:background and must carry a source + date.

| term | definition | key facts | source | date | tags |
|---|---|---|---|---|---|
````

**`background/_index.md`**
````markdown
# Background index

> Every skill reads this at start to grab context fast. Terms point to glossary rows; projects point to project files.

## Terms
| term | one-liner |
|---|---|

## Projects
| project | one-liner | file |
|---|---|---|
````

**`ideas/_status.md`**
````markdown
# Status overview

> First entry point. Each skill updates its own row on finish. Sort by excitement desc / effort asc to see what to act on next.

| id | title | status | verdict | category | platform | excitement | effort | updated |
|---|---|---|---|---|---|---|---|---|
````

### Step 4 — Report

Tell the user which folders/files were created (and which already existed and were left untouched). Then:

```
Spark workspace is ready. Next: /spark:capture "your one-line idea"
```

---

## Boundaries

- Never overwrite an existing file — only create what's missing.
- This skill scaffolds structure only; it does not capture, refine, or research.

## Language

Respond in the user's language (English in → English; 中文 in → 中文). Template file contents stay English.
