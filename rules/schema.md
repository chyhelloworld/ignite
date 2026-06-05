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
