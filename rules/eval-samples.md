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
Expected: business writes `outputs/idea-NNNN_business.md` (with pricing tiers), artifacts appended, status stays candidate; PRD writes `outputs/idea-NNNN_prd.md` (functional requirements with acceptance criteria), status set to documented. A non-go candidate is blocked by /spark:business; a candidate without a business design is blocked by /spark:prd.
