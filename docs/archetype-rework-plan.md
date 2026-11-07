# Archetype rework: plan

Status: approved by the owner and built (2026-11-06). Author: the Build a GOAT iOS session, for the owner and the game session.
Calibration constants (ARCH_CAL, ARCH_OFF) were measured with the prototype method on the real code: role templates at
each reference height on Pro for CAL, and the mean of random plus old-position builds against the old rating for OFF.

## The problem

You pick a position (PG/SG/SF/PF/C) and OVR weighs your skills by that position's fixed recipe.
Builds that make sense on a real court rate badly when they don't match the recipe:

- A 6'10" "PF" with 99 three/mid/close, elite speed, vertical, layups and dunks, but no handle,
  passing or strength rates **69** (75 if listed as a SF). On a real team that is a hyper-athletic
  stretch big, a starter.
- A 6'9" lean shooter gets about 25% less OVR per point in Three-Point than in Dunk, only because the
  Shooting group splits its weight over four skills and Finishing over three.
- "High impact" labels only mark the six skills that raise OVR most for the chosen position, so
  shooting, IQ and Consistency look useless for many builds.

## The idea

No position choice. You choose height and body type, spend your points, and the game tells you
what you are turning into: **"Slashing Stretch Big"**, **"3-and-D Wing"**, **"Floor General"**.
OVR rates you at the role your skills fit best.

## How it works

### 1. Archetypes replace positions inside OVR

Thirteen archetypes. Each has a **reference height** (it plays the part a position's base height
plays today) and its own **weights over the 21 skills**:

| Archetype | Ref. height | Core skills |
|---|---|---|
| Floor General | 6'2" | Passing, Ball Handle, IQ, Speed |
| Shot Creator | 6'3" | Ball Handle, Mid-Range, Three, Layup |
| Sharpshooter | 6'5" | Three, Mid-Range, Free Throw, Consistency |
| Slasher | 6'5" | Layup, Dunk, Speed, Vertical |
| Lockdown Defender | 6'6" | Perimeter D, Steal, Speed, Stamina |
| 3-and-D Wing | 6'7" | Three, Perimeter D, Steal |
| Two-Way Wing | 6'7" | everything a little (the generalist) |
| Point Forward | 6'8" | Passing, Ball Handle, IQ, Def. Rebound |
| Athletic Finisher | 6'9" | Dunk, Vertical, Layup, Speed, Off. Rebound |
| Stretch Big | 6'10" | Three, Mid-Range, Close Shot, Consistency |
| Post Scorer | 6'10" | Post Moves, Close Shot, Strength |
| Glass Cleaner | 6'10" | Def./Off. Rebound, Strength, Vertical |
| Rim Protector | 7'0" | Block, Interior D, Def. Rebound, Strength |

- Rating in an archetype = its weighted skills, with height bonuses measured from **its** reference
  height (exactly how positions work today). So a 6'1" "rim protector" is rated as a badly
  undersized one, and never wins that label.
- **OVR = your best archetype.** A per-archetype calibration makes an equally good build rate the
  same in every role, and one global offset keeps the average player where today's average sits,
  so the league (whose players keep today's ratings) still lines up.
- Prototype on today's code, same builds:

| Build | Today | Archetype OVR | Reads as |
|---|---|---|---|
| Wife's 6'10" sniper (99 shooting, fast, bouncy, no handle/strength), mid-career | 69 | **80** | Stretch Big |
| 6'9" lean sniper wing, mid-career | 73 | **80** | Sharpshooter |
| 7'0" elite rim protector, mid-career | 78 | **86** | Glass Cleaner / Rim Protector |
| 6'2" elite floor general, mid-career | 82 | **90** | Floor General |
| Balanced 80s everywhere at 6'7" | 90 | 86 | Two-Way Wing |
| Build screen: lean shooter / slasher / floor general | 49 / 48 / 52 | 52 / 54 / 53 | as named |
| Exploit: every point into Three-Point | 43 | 42 | no gain |
| Exploit: 6'1" "rim protector" | 41 | 44 | read as a wing |

### 2. The name the player sees

- **Primary** = best archetype. **Secondary modifier** = the best archetype from a *different*
  family (shooting, finishing, playmaking, perimeter defense, interior) when it is within about
  4 OVR: "Slashing Stretch Big", "Playmaking Sharpshooter", "Rim-Protecting Glass Cleaner",
  "High-Flying Slasher", "Lockdown 3-and-D Wing". Otherwise just the primary.
- Names use ordinary basketball vocabulary, our own combinations.
- It updates live while building, and **evolves during a career**. When it changes at the end of a
  season the story says so: "Your game has evolved: you now play like a Two-Way Wing."

### 3. Listed position (automatic, never chosen)

Tables and text that need a short position (class rankings and their filter, draft boards, Hall of
Builds, mentor and recruit events) get one derived from height + archetype: Floor General at 6'2" is
a PG; a Stretch Big at 6'10" is a PF; a 7'0" Rim Protector is a C. `S.pos` becomes this derived value
and is refreshed whenever skills or height change, so the many places that read it keep working.
League (computer) players keep their positions; only you stop picking one.

### 4. Build flow

1. **Setup**: difficulty, era, Daily Build (unchanged)
2. **Look**: name and appearance (unchanged)
3. **Body**: height (one slider, 5'10" to 7'3"; Growth genes adds 3") and frame. The position picker
   is removed. A size line explains what height does ("Big-man size: rebounding and blocking up,
   handle and speed down").
4. **Skills**: a live **"You project as"** card at the top: the name, OVR, the top three fits as
   bars, and "to lean into X, raise A, B, C". Quick start becomes archetype templates (fill skills
   only, never height), each showing its best height range. "High impact" now marks the skills that
   raise OVR most *for what you are becoming*, so a shooter sees shooting tagged.
5. **Traits** (unchanged)

In a career: the header shows the archetype ("Slashing Stretch Big · 6'10" · Lean · Age 21"); the
plaque, the end screen and the Hall of Builds show it too.

### 5. Systems that follow the archetype instead of the position

| Today (position) | After |
|---|---|
| `ovr()` = POS weights + POSCAL + height vs position | best archetype fit (above) |
| natural growth picks skills by position weights | by your current archetype's weights, plus some spread so you can evolve |
| summer "relevant skill" picks | from your archetype's core skills |
| scout grade: height vs position | height vs your archetype's reference height |
| guard-only summer option, big-only post option, PF/C rebound goals, PG/SG assist goals | from archetype family (perimeter vs big; playmaker) |
| "Tall/Undersized for a SF" | size line vs your archetype |
| premades tied to positions ("Made for your position") | archetype templates |

### 6. Old saved careers

Bump the save version. A career saved before the change is converted when it is continued: its
hidden ceiling is shifted by (new OVR - old OVR) so growth room is preserved, and its listed position
is derived. The few actions logged after its last snapshot replay under the new growth rules, so a
continued run can differ slightly from before; nothing is lost. Hall of Builds history is left as is.
Today's position-based OVR is kept as `legacyOvr()` only for this conversion.

### 7. Balance

The rework moves every rating, so the odds are re-tuned afterwards to the current targets:
Rookie about 9% GOAT (kept), Pro 1% / 2% / 5% (GOAT / Top 10 / Hall of Famer), Hall of Fame
0.5% / 1% / 2%. Tools: the game session's balance harness (updated for no positions) and the
playtest harness. Specialists will be stronger than today; the cost curve (1, 2, then 3 points per
level) and archetype weights that still need several skills keep one-skill builds from winning.

### 8. Testing

- Every existing Witness test (27) updated where it reads positions or premades.
- New tests: no position picker; the projection card updates as skills change; the wife's build
  rates 78+ as a Stretch Big; one-skill and wrong-size exploits rate no better than a coherent build;
  an old saved career converts and plays on; replay determinism unchanged.
- Balance sims (thousands of careers per difficulty) and three Witness AI playtesters building
  specialists on purpose.

## Review notes from the game session (folded into the phases below)

1. **Stats must match the league at the same OVR.** NABL stats scale your numbers so you produce
   like a league player of the same internal OVR, and `dsp()` is anchored on the league's OVR spread.
   Taking the *best* of 13 fits nudges your OVR up, most for optimized builds, and that compounds into
   minutes, team strength and award votes (`c.ovr*.6`). After phase 1, run the game session's
   `probe2.py` (your PPG/RPG/APG vs league players at the same OVR, in buckets) and correct the offset
   or the fit spread until they line up, so "78 OVR averaging 24/8/9" can't come back.
2. **Owner rules:** Quick Start templates fill skills only; no "Unicorn"-style template (it was
   removed on purpose) and no modifier name that reads like one; hidden frame effects stay hidden (the
   fit bars and "raise A, B, C" come from OVR changes only); no auto-spend.
3. **Position consumers** (27 hits) also include the HS/college rebound and assist lines,
   `makeLegends`/`immortalize` (they store `pos`: store the derived listed position), and the
   end-screen story.
4. **Tests:** `flow.witness.json` taps "PG"; several tests call `applyArch(0/1/2)` by index, and the
   Witness reset scene uses `applyArch(2)` plus +14 to reach the playoffs and free agency. Keep those
   template slots meaningful and the test prospect strong, or update the tests.
5. **Daily Build** must still give everyone the same build (seeded). New defaults (height 6'7",
   Balanced) and a pure archetype read keep it identical for all players.
6. **Balance harness** (`bal.py`, `probe2.py`) picks a position and position weights: switch them to
   random height plus archetype-weighted (or random) skills, and keep checking "avg start" against the
   freshman targets (about 55 / 50 / 45).
7. **Determinism:** `archetype()`, `listedPos()` and the derived `S.pos` never call `R()`; they are
   pure functions of skills, height and frame, recomputed when those change, never via dice in render.

## Phases

1. **Engine**: archetype table, `ovr()` / `archetype()` / `listedPos()`, calibration, `legacyOvr()`.
   Verify the prototype numbers in the real code, then align stats with the league (`probe2.py`).
2. **Systems**: growth, summers, scout grade, goals, clutch options, events, derived `S.pos`.
3. **Build UI**: Body without position, Skills projection card, archetype templates, impact tags,
   copy.
4. **Career UI**: header, plaque, end screen, Hall of Builds, "your game evolved" note.
5. **Saves and tests**: version bump and conversion, Witness updates and new tests (keep
   `applyArch(0/1/2)` and the reset-scene prospect working), Daily Build check, harness update.
6. **Balance**: stat alignment re-check, then retune to the targets; playtest; fix.
7. **Ship**: push, TestFlight, notes for the game session.

## Open questions for the owner

1. The 13 archetypes and the "Slashing Stretch Big" naming style: keep, add, rename?
2. OVR = best fit means a balanced all-80s player rates a bit lower than today (86 vs 90) while
   specialists rate higher. OK, or blend in a small all-around bonus?
3. Height range 5'10" to 7'3" (7'6" with Growth genes)?
4. Archetype can change during a career: yes?
5. Old saved careers convert and keep playing (recommended) rather than being reset?
