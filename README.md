# Ignite — the Spark idea engine

[简体中文](README.zh.md)

Turn your scattered, half-formed ideas (often just one line) into something real: an AI fleshes them out with you, researches competitors online, runs a feasibility gate, recombines the dead ones into fresh sparks, and produces a business design + PRD for the survivors.

A **local-file knowledge engine + 10 Claude Code skills**, packaged as an installable plugin. Inspired by [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill)'s "atom library + skills" and decision-system patterns.

---

## What it is

Most ideas you have are half a sentence. Evaluating them directly is wasteful; deleting them is a loss. Spark treats every idea as an **atom in a pool**:

- **A single idea may not stand on its own** — but it is never deleted. It stays in the pool with a "death reason" as fuel.
- **Real sparks often come from recombination** — the AI scans the whole pool (including dead ideas) and pairs A + C by topic and complementary death reasons into a new candidate.
- **Flesh out rough ideas before researching** — an interactive dialogue grows a one-liner into "who has what pain + core assumptions + competitor keywords", so you don't burn research budget on bad ideas.
- **Research only trusts sourced facts** — every competitor / price / scale number needs a link; no link → tagged `[unverified]`, never fabricated.

```text
ideas pool (atoms, never deleted)
  │  ① /spark:capture     one line is fine; stored verbatim
  ▼
② /spark:refine ⇄ /spark:combine   flesh out interactively; unknown terms → /spark:background; scan for sparks
  │   ⤷ vague / pseudo-concept → demoted back to pool, no research wasted
  ▼
③ /spark:research    live competitors by category/platform, every fact sourced
  ▼
④ /spark:evaluate    challenge core assumptions → go / no-go / maybe
  │   go ─────────────────▶ candidate
  │   no-go → demoted to pool (structured death reason) ──┐
  ▼                                                       │
⑤ /spark:combine   scan whole pool (incl. dead) and pair complements ←┘ → combo candidate → back to ②
  │
  ▼  candidate past the gate
⑥ /spark:business    positioning / audience / model / pricing / GTM
  ▼
⑦ /spark:prd         PRD (with acceptance criteria) + tech outline + task list → documented
```

Cross-cutting: **/spark:background** keeps a glossary + project profiles so the AI understands your shorthand.

---

## The 10 skills

| skill | command | what it does |
|---|---|---|
| idea | `/spark:idea` | router — sends your request to the right skill |
| capture | `/spark:capture` | zero-friction: store a one-line idea as a raw atom, verbatim |
| refine | `/spark:refine` | interactive flesh-out; demote pseudo-concepts; scan for sparks |
| background | `/spark:background` | flag unknown terms → ask consent → web-research / ask you → persist |
| research | `/spark:research` | live competitor research by category/platform, every fact sourced |
| evaluate | `/spark:evaluate` | feasibility gate; no-go demotes to the pool with a death reason |
| combine | `/spark:combine` | scan the whole pool (incl. dead atoms) and pair complements |
| business | `/spark:business` | positioning / model / pricing / GTM for a go candidate |
| prd | `/spark:prd` | verifiable PRD + tech outline + task list → `documented` |
| init | `/spark:init` | scaffold the workspace into your project (run once) |

---

## Install

```text
/plugin marketplace add chyhelloworld/ignite
/plugin install spark@ignite
```

Then, in the project where you want to keep your ideas:

```text
/spark:init                                  # scaffold ideas/ research/ rules/ … (once)
/spark:capture "a negative-review aggregator for Steam indie games"
/spark:refine idea-0001                       # flesh out (asks before researching unknown terms)
/spark:research idea-0001                      # sourced competitors
/spark:evaluate idea-0001                       # go → candidate
/spark:business idea-0001                        # business design
/spark:prd idea-0001                              # PRD → documented
```

Not sure which to use? `/spark:idea` routes for you.

### Local development (inside this repo)

```bash
git clone https://github.com/chyhelloworld/ignite.git
cd ignite
claude --plugin-dir .     # load the plugin from the working tree
```

---

## Directory structure

```text
.claude-plugin/         plugin.json (name: spark) + marketplace.json (name: ignite)
skills/                 the 10 skills (SKILL.md)
ideas/                  idea atoms (one file per idea) + _status.md (first entry point)
research/               research snapshots (write-once, sourced)
decisions/              evaluation snapshots (write-once, dated)
outputs/                business design + PRD
background/             glossary (public terms) + projects/ (private background) + _index.md
rules/                  schema · category-platform-map · death-reasons · eval-samples (config)
tools/validate.mjs      structure + frontmatter validator (the only automated gate)
docs/                   design docs (spec / plan) — kept as design history
```

> `ideas/research/decisions/outputs` hold per-project user data; `rules/` and `background/` ship with the plugin as templates and are copied into your project by `/spark:init`.

### Idea atom (data contract)

```yaml
---
id: idea-0042
title: one-line title
status: raw            # raw→refining→refined→researching→researched→evaluated→candidate→documented
kind: single           # single | combo
parents: []            # source atoms for a combo
tags: [ai, tooling]
category: game          # category → default launch platform
platform: Steam
effort: null            # S/M/L/XL
excitement: null        # your excitement 1-5
verdict: null           # go | no-go | maybe
death_reason: null      # required on no-go; the matching key for /spark:combine
research_ref: null
eval_ref: null
artifacts: []           # business design / PRD
relationships: []       # complement | collision | same-origin | counter
---
```

Full field + status-flow definitions: `rules/schema.md`.

---

## Design ideas

- **Data contract first, skills grow later** — changing a prompt is cheap; migrating dozens of stored ideas is expensive, so the atom schema and directory contract are nailed down first.
- **Cross-cutting capabilities vs the main line** — `combine` (recombining dead ideas) and `background` (term/project memory) are cross-cutting layers, not pipeline stages, reused across the system.
- **Structured death reason = precise matching key** — a no-go must record a controlled death reason so `combine` can pair complements ("lacks-traffic" × "brings traffic").
- **Anti-hallucination hard rule** — research/evaluate only trust facts with a source link; model memory is not a source.

Design + decision records (Chinese, kept as history):
`docs/superpowers/specs/` and `docs/superpowers/plans/`.

---

## Self-check

```bash
node tools/validate.mjs    # OK: structure contract and skill frontmatter all pass
```

Skill behavior is regression-tested by hand against the golden samples in `rules/eval-samples.md` (prompt systems don't fit automated test frameworks).

---

## License

[CC BY-NC 4.0](LICENSE). Free for personal / learning / research / non-commercial use with attribution; **commercial use requires separate permission**. Methodology inspired by [dbskill](https://github.com/dontbesilent2025/dbskill) (also CC BY-NC 4.0); code and prompts written independently.

---

> Built with Claude Code via a brainstorm → spec → plan → multi-agent implementation flow.
