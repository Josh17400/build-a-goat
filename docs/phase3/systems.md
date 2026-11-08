# Build a GOAT: Systems and improvements proposal (Phase 3)

Lens: changes to the systems that already exist (spending, pacing, feedback, awards, difficulty, late career, code health,
iOS stability) that would most raise fun, fairness and clarity. Nothing here adds a new mode; every idea is checked
against the owner rules at the end.

How I worked: read the tester feedback from the 21 most recent playtests (r26a to r30c, g1a to g2c, plus the notes
so far from the g3 round, which is still running), then read the code behind each complaint in `index.html`. I also ran
a read-only probe (my own script, in the scratchpad, using the game's test-only tools) through 4 Pro careers to measure
save size and defense ratings. No game files were changed.

Headline: fun is steady at 4/5 in almost every report. What drags it down is not missing content. It is (a) payoffs
the player never sees, (b) points that seem to vanish, (c) too many taps in quiet seasons, and (d) results that
contradict their own text. Most of these are small or medium fixes with no effect on the GOAT odds.

---

## 1. Top recurring player pain points (with evidence)

Report ids are in brackets. "Root cause" is what the code actually does.

**P1. The last season is skipped (9 reports).** The farewell tour, the ring chase, the final title: the game jumps
straight to the plaque without a season card. [g1b, g2b, g2c, r26b, r27c, r28c, r29b, r29c, r30c]
Root cause: when the final season ends, `finish()` runs inside the season sim (`seasonPlayoffs`, the farewell, age and
cut checks near line 1044). The stage becomes `end`, and the story windows are switched off for `end` (`startSeq`
bails out, and `drawScreen` hides the story sequence on `end`).

**P2. Points that do not move OVR (10 reports).** "Spent 45 points, OVR did not move", "40 points gave +1",
"Max out Steal ate 55 points". [g1b, g1c, g2b, g2c, g3b, g3c, r27b, r28b, r30a, r30c]
Root cause: OVR is your single best role, and that role leans heavily on its top skills (the role weights are raised
to the power 1.6). The buttons show the point cost but never the OVR effect. The "high impact" tag only shows inside an
opened group. The explanation arrives after the spend, and still says "a PF's OVR" (the old position wording). Max only
asks for a second tap on low-impact skills.

**P3. Too many taps, or whole seasons skipped (9 reports).** Whole Career took 4 to 6 taps a season, and Next Decision
sims seasons "silently", including a first title. [g2b, g2c, r26c, r27c, r28c, r29b, r29c, r30b, r30c]
Root cause: Next Decision (`simAll`) plays the season with no story windows and parks the season card at the very
bottom, under the decision and the Legacy card. Whole Career shows every story card as its own step (final plays,
season, badges, goals, history, decision, league, spend). Offseason prompts stack up: free agency, game-change choice,
Ask Out, a random event (35%), the summer and a career moment. Only the midseason moment respects the cap of 3 stops.

**P4. Choices with no visible effect (9 reports).** "Cut your minutes: still 36 MPG and PPG went up", "Co-star /
Featured role: same 36 minutes", "Payday: no money anywhere". [r26a, r26b, r26c, r28a, r28c, r29b, r29c, r30a, r30b]
Root cause: midseason results are one sentence. Contract roles only set a minimum on minutes (Starter 28, Co-star 30,
Featured 32), but any 85+ OVR player already gets 33 to 36, so the label never shows. "Fewer shots" is a small
nudge that a year of growth easily outweighs.

**P5. Stories that contradict the numbers (12 reports).** Food poisoning costs a game, but 82 games played and an iron
man bonus [g2b, r27a, r30a]. A summer injury, then a Red-Hot Start right after [r26c]. Co-Star Goes Down while the
co-star wins MVP [r30c]. Ask Out names the wrong team [r30c]. A torn ACL, then the player takes a Game 7 final shot
[r27c]. A 22-assist game next to a 13-assist season high, and season goals swapped after a trade [r26a]. Classmate MVP
news that disagrees with the league page [r26b]. The rival's retirement announced twice [r29b]. A promised Starter
role that turns into bench minutes [r28c]. A "better team" line in a 23-59 season [r30b]. A playoff-loss line in a
16-0 run [g1a].
Root cause: each story line is written from its own little check, with no shared record of the season's facts.

**P6. Awards feel unfair (6 reports).** MVP on a 41-41 team, and 11 MVPs in one career [g1b]. A 72-10 scoring champion
loses MVP to a rival on a 35-win team [g2b]. A rim protector never wins DPOY despite 3+ blocks a game, and an
All-Star rookie loses Rookie of the Year [g2c]. 0 All-Stars at 91-93 OVR [r27c].
Root cause: MVP counts team wins only lightly (0.25 per win). Your DPOY score is the average of all 5 defense skills,
so a specialist is dragged down by his weak side, while league players get a rating based on OVR plus a wide spread.
Probe: the best league defender each year rated 91 to 99 on this scale, while my four probe careers rated 51 to 75
(league players at the same OVR averaged 66 to 72, so a lopsided defender trails even them). Rookie of the Year
looks at points only.

**P7. The GOAT rule is a surprise (4 reports).** Passed 350 and stayed 2nd, then suddenly THE GOAT once the rival
retired [g1a]. Two different all-time ranks on one card [g2b, r29c]. "The #1 legend was exactly 345 in both careers"
[g2c].
Root cause: THE GOAT needs 350 score AND #1 in the debate, active players included. The "next tier" line ranks you
against legends and retired players only, while the debate line counts everyone. The #1 legend's score is fixed by a
formula, so it is always exactly 345.

**P8. Risk labels do not mean much (5 reports).** "Better odds" summers backfired 5 of 6 times [r26a]. Risky summers
paid off 11 of 12 times on Pro, including two "worse odds" picks: "risk feels nearly free" [r27a]. The streetball
tournament won 6 of 6 [r29a]. A "Low risk" movie with only a downside shown [r29c].
Root cause: odds are coin flips moved up to 20 points by your skills, plus 6 after a miss. A success also pays 5 / 3 / 1
hidden bonus points on top of the skill gains, while misses are small. So High risk is usually the best pick on average,
and the label words cover wide ranges.

**P9. Clutch plays repeat, and the odds read wrong (9 reports).** The same "Pull-up from the logo" line in Games 6 and
7, the same score twice [g1b, r26a, r26b]. The same Conference Finals Game 7 two years running [r26c]. The pattern
"win Game 6, lose Game 7" over and over [g1b, r29c]. A 98 Three-Point reads only Fair, and 93 Passing reads Long odds
[g1b, g1c, r28a].
Root cause: only 2 or 3 text lines per outcome, with no memory of what was used. A 99 skill adds only about 23 points to
a 36-46% base, so even a great look rarely reaches "Good odds" (60%).

**P10. Late career goes on autopilot and points pile up (4 reports).** 288 points left over with everything capped, and
11 MVPs [g1b]. "The late game became autopilot" after 95 OVR, and 87 unspent points with no warning [g2b]. 206 points
banked [r29c]. 21 unspent points lost at retirement [g1c].
Root cause: once the key skills are capped, points have nothing to buy, and MVP voting never tires of you.

**P11. The style label flips, or never changes (11 reports).** "Your Game Is Changing" flip-flopped 4 times [r27a].
Five Pro wing testers never saw it in 16 or 17 seasons [r26b, r27b, r28b, r29b, r30b]. It came only at age 34 [g2c]. The
header, the fit list and the "lean into" hint name three different roles [g1b, g2b, r27b, r29a, r30a].
Root cause: your label holds unless another role leads by 1.5, but the hint targets the 2nd row of the list, which can
be your own role. The choice fires once per pair of roles, with a 4-season cooldown, so near-tie builds can bounce
A to B to A, while settled builds never see it.

**P12. Careers end without warning (2 reports, high pain).** On Rookie, Whole Career ran on with 177 banked points and
the player was cut at 20, with no pause [r27c]. A career ended at 39 with no "Is It Time?" prompt [r28c].
Root cause: an off-by-one. Whole Career only checks the roster risk once 2+ seasons are done, but the first cut check
happens right after season 2, so the pause can never come first. The red risk card and the pause also use two different
OVR numbers. And a 30% random retirement for low-OVR veterans has no prompt.

**Hidden risk (not in playtests, found in code and probe): the iOS save.** The in-progress run is not copied to the
phone's native storage (the code comment says so: only gems, gear, GTP and similar are mirrored). If iOS clears the web
storage, a 30-minute career is lost. The run save also grows to 710 to 830 KB by career end, because 960 to 1,200
retired league players are kept in full, and it is rewritten after most taps.

**Difficulty spread.** Rookie testers rated difficulty 1 or 2 out of 5 (9 reports). All 3 finished Rookie GOAT chases
got THE GOAT on career 1 or 2 [g1a, g1b, g2b], and one premade casual run got 10 rings "with almost no thought" [r29c].
Yet a Rookie player who never spent got cut at 20 [r27c]. Pro testers rated 2 to 4 with no GOATs in about 12 careers,
which matches the targets. No tester has played Hall of Fame in the recent rounds.

---

## 2. Ranked proposals

Effort: small = an evening, medium = one or two sessions, big = a multi-session project.
"Balance harness" = the existing odds sims (bal.py / probe2.py) that check the GOAT targets.

### 1. No silent endings: the final season always plays out on screen  (fixes P1, P12)
- **What:** the last season gets its full story (final plays, season card, history), then a short "Your career is over"
  card that says why (farewell tour done / age 41 / out of the league at 58 OVR), then the plaque. One season ahead,
  the game warns you whenever the next season could be your last ("Your roster spot is at risk", "Next season is your
  farewell: spend your 87 points now, they are worth nothing after you retire"). Whole Career pauses before any season
  that could end the career, even with 0 points banked.
- **Player benefit:** the farewell tour and the ring chase get their payoff. No more "I got cut and never saw it coming".
- **Code:** in `seasonPlayoffs`, the three `finish()` paths (farewell, age / 20 seasons, cut) set a "career over"
  flag, and `startSeq` builds the story sequence for the last season before the stage switches to `end` (or allow the
  sequence on `end`). Add an "ending" story piece. In `autoStep`, check risk from season 1 (`S.nba.length>=1`, not `>=2`)
  and use the same OVR line as the cut; show the same number on the red risk card. Turn the silent 30% veteran
  retirement into an "Is It Time?" prompt with "Retire" or "One more year".
- **Effort:** small to medium. **Risk:** none to the odds if the cut and retirement rules stay the same. Story windows
  stay and can be skipped (owner rule).

### 2. A spend screen that shows the result before you tap  (fixes P2, part of P11)
- **What:** every +, +10 and Max button shows its effect: "+10 · 21 pts · OVR +1", or "OVR +0 · Post Scorer fit +3"
  when it builds toward another role. A "What moves your OVR" strip at the top lists your six high-impact skills and
  their next-point cost, without opening any group. Max always takes two taps ("Tap again: 55 pts → 99, OVR +2").
  After a spend, the message names your role, not a position ("Free Throw adds little to a Slasher's OVR").
- **Player benefit:** spending becomes a plan, not a guess. The "wasted points" feeling goes away because you see the
  role fit rise even when OVR does not.
- **Code:** `skillRow` already runs a trial raise for +10 (`stepN`); add the shown-OVR before/after to the same trial
  (raise, read `OV()`, put back) and the top-3 role fits. `impactMap` already ranks impact; render its top 6 as the strip
  in `profSkills` / `bankBlock`. `armMax`: always confirm. `spend()`: replace `S.pos` with the role name. `projCard`:
  aim the "lean into" hint at the best role that is not your current label (today it uses the 2nd row, which can be
  your own role). Only compute previews for the open group plus the strip, to keep taps fast on older iPhones.
- **Effort:** medium. **Risk:** none. It only informs; nothing is spent for the player (owner rule kept). OVR is
  already visible, so no hidden stat is revealed.

### 3. Pacing: one tap for a quiet season, a stop for every big one  (fixes P3)
- **What:** (a) Next Decision shows a "While you simmed" card at the top of the screen it lands on: record, stats,
  awards and playoff result for each season it played. It always stops for the story when something big happens (a
  ring, an MVP, a first All-Star, a 50-point night). (b) A "Quick recap" story setting: the season, badges, goals,
  history and league news become one scrollable card; final plays and decisions keep their own steps. (c) An offseason
  limit: at most 2 optional moments besides the summer and free agency; extras wait a year. No Ask Out or Trade Demand
  in the same offseason you just signed (r27a, r30c).
- **Player benefit:** Whole Career drops from 4-6 taps to 2-3 in a normal season, and nobody misses a title.
- **Code:** `simAll` keeps a list of the seasons it played and stops early on big awards; `drawScreen` (NBA) renders the
  list first. `startSeq` gets a recap mode (`['clutch','recap','decision','spend']`). `nextQ` counts optional stops
  (event, talk, evo, career moment) against a per-offseason budget. Guards against a trade ask right after signing
  already exist on some paths (`S.lastFa`), but r27a and r30c still hit it, so check every path that can offer one.
- **Effort:** medium. **Risk:** none to the odds. Story windows still exist and stay skippable.

### 4. Every choice shows what it did  (fixes P4)
- **What:** each summer, midseason and career-moment result appears on the season card with its real size: "Cut your
  minutes: 36 → 32 MPG, about −2 points a night", "Rivalry Night: you won the TV game 112-108". Contract roles become
  real. Featured means more shots, Co-star a few more, Ring chase fewer shots, and the offer says so before you sign.
  "Playing for a Payday" raises free-agency interest, and the free-agency card says why.
- **Player benefit:** decisions feel like they matter. Fewer "nothing happened" reports.
- **Code:** `choose()` already builds an effect list for midseason picks ("more shots", "fewer minutes"); keep the size
  of each change (`S.next` before and after) and print it in `seasonCard`. In `faPend`, give each role a shot-share
  change (stored like `S.usage`) on top of the existing minute floors. Store a payday flag that `faPend` reads.
- **Effort:** medium. **Risk:** medium. Shot share changes points, which feed awards and GOAT score. Re-run the balance
  harness, and keep ring-chase as a real trade-off (rings for stats).

### 5. Award fairness pass: MVP, DPOY, Rookie of the Year  (fixes P6, helps P10)
- **What:** MVP counts team success more (about 0.45 per win instead of 0.25), and voters tire of you a little (a small
  minus for each MVP in the last 3 seasons, as real voters do). DPOY rates your defense by your role: the better of your
  perimeter side (Perimeter D, Lateral Quickness, Steal) and your interior side (Interior D, Block, Def. Rebound), plus
  a little credit for actual steals and blocks. Tune it so you match league players at the same OVR. Rookie of the Year
  uses the full production score, not points alone. The season card shows your DPOY and ROY finish, like the existing
  All-Star and MVP lines.
- **Player benefit:** a 72-10 scoring champion wins MVP. Rim protectors and lockdown wings can finally win DPOY.
  11-MVP careers become rare, so late seasons keep their suspense.
- **Code:** the awards block in `seasonPlayoffs` (about lines 962-972): the `mv`, `dp` and `ry` formulas and `ME.d`.
- **Effort:** medium (the code is a few lines; the tuning is the work). **Risk:** high to the odds. MVP is worth 18 GOAT
  points and DPOY 5. Voter fatigue lowers the smart Rookie rate, which the playtests suggest is too high, but it could
  push Pro below target. Re-tune with the balance harness to the targets (Rookie ~9-10% casual; Pro ~1% casual, 4.3-5%
  smart; HoF ~0.5% casual, 2-2.5% smart). The "match NPCs at the same OVR" rule is the yardstick for DPOY.

### 6. Make the GOAT rule clear from day one  (fixes P7)
- **What:** the Legacy card states the rule in one line from season 1: "THE GOAT needs 350 score AND #1 in the GOAT
  debate (active players count)". Show one clearly labelled rank, or both side by side ("#11 among legends and retired
  players · #14 counting active players"). When the active #1 retires, a history line says "X retires: the GOAT debate
  is yours to lose". The #1 legend's score varies by era and run (for example 330 to 365, same average as today) and he
  is named early as "the man to beat".
- **Player benefit:** no surprise "you have 351 but you are not the GOAT". A clear target to chase.
- **Code:** `legacyCard` / `goatRace` (labels and rule line), `tierOf` (no change to the rule), `makeLegends` (spread the
  top score around today's 345), plus a retirement news line in the season history block.
- **Effort:** small. **Risk:** low. Varying the #1 legend changes single runs, not the average; confirm with the harness.

### 7. A story consistency guard  (fixes P5)
- **What:** before any story line is written, the season builds one fact sheet: games played, games missed and why,
  injuries and their timing, co-star status, team record, trades. Every story template reads from it. Rules:
  "misses a game" lowers games played (and blocks iron man); no Red-Hot Start after a summer injury; Co-Star Goes Down
  really sidelines that player; Ask Out names your current team; a player out with a major injury does not take
  playoff final shots; season goals are frozen at the start of the season even after a trade; the season high is never
  below a number quoted in a story line.
- **Player benefit:** the game stops contradicting itself, which is what makes testers distrust the sim.
- **Code:** a `facts` object filled in `simNBA` before the notes are written; midseason, event and flavor functions read
  it. Add an automated check: a node probe or Witness test that sims 500 careers and flags any contradiction
  (text vs. numbers).
- **Effort:** medium. **Risk:** none.

### 8. Late-career stakes and a use for capped points  (fixes P10)
- **What:** when your role's key skills are maxed, a "Veteran" group appears on the spend screen. Points can go into
  Longevity (slower decline next season), Clutch prep (slightly better odds on this season's final plays) or Locker
  Room (team chemistry). The player places every point. From about age 30, season goals turn into legacy targets:
  "pass Name for 5th on the all-time scoring list", "ring #4", "15th All-Star".
- **Player benefit:** the last 6 to 8 seasons stop being autopilot, and points keep their meaning to the end.
- **Code:** `skillAcc` adds the group when every high-impact skill passes `atCap`. Effects reuse existing knobs:
  `addNext({declAdj})` for Longevity, a flag read in `clutchPend`'s odds for Clutch prep, `addNext({team})` for Locker
  Room. `makeGoals` switches to legacy goals after age 30.
- **Effort:** medium. **Risk:** medium. Longevity means longer careers and more GOAT score, so price it high and re-tune.
  Owner rules hold: all growth is still points the player places, and aging still happens automatically (this only
  softens it, like today's Yoga and Load management summers).

### 9. Honest risk labels on summer decisions  (fixes P8)
- **What:** show the odds in plain buckets ("about 3 in 10", "5 in 10", "7 in 10") with both outcomes, including the
  bonus points a success pays (today they are a surprise). Make High risk a real gamble: a miss also costs something
  you can feel (for example −2 in a key skill or no development bonus), or the success chance drops to about 40%.
- **Player benefit:** "better odds" means what it says, and the risky pick is a real decision instead of a free win.
- **Code:** `gamble()` and `riskTag()`: print the bucket from `pAdj()`; add the bonus point line from `choose()` to the
  description; adjust the High-risk fail functions in `summerNBA` (and the HS and college sets).
- **Effort:** small. **Risk:** medium. Summer points feed GOAT odds, so re-tune. "x in 10" combines skills and traits
  into one number without naming a hidden stat. Flag it to the owner anyway, since it is closer to the line than words.

### 10. Clutch plays: more variety, odds that respect your best skill  (fixes P9)
- **What:** 6+ result lines per option, with no repeats within a career, so Games 6 and 7 never share a line or score.
  A 95+ skill should read Good, and a new "Great look" label tops it. Keep the overall clutch win rate the same by
  trimming the odds of weak options. In the Finals, stop at Game 6 only when it is an elimination game for you, so the
  "won 6, lost 7" script stops repeating.
- **Player benefit:** the best moment in the game (every tester says so) stays fresh, and your build shows up in it.
- **Code:** `CL_OFF` / `CL_THREE` / `CL_DEF` text pools; `S.clSeen` memory in `clutchPend`; the score formula
  (`(skill-68)*.0075`) gets a steeper weight for the top option; the Game 6 condition in `seasonPlayoffs` (`rd===3`).
- **Effort:** small to medium. **Risk:** low to medium. Clutch results decide rings (12 GOAT points each); keep the
  average clutch win rate unchanged and check with the harness.

### 11. Style label stability  (fixes P11)
- **What:** the header, the fit list and the hint always agree: the role you are labelled is marked "your style" in the
  list. "Your Game Is Changing" fires only after the new role has led clearly (by 3+) for 2 seasons in a row. It never
  offers back a role you just chose to keep. It can come from age 22 on, and also after a deliberate spend into another
  role (30+ points into that role's key skills).
- **Player benefit:** no flip-flops, and players who build toward a new identity actually get the moment.
- **Code:** `archetype()` (the 1.5 hold), the change block in `growWhy`, `projCard` and `profOver` (labels), `evoPend`.
- **Effort:** small. **Risk:** low. The embrace bonus (+2 ceiling) is already limited to twice.

### 12. iOS save safety and speed  (hidden risk)
- **What:** (a) copy the in-progress run to the phone's native storage at each season end, so an iOS storage purge
  cannot wipe a career. (b) Shrink the run save by keeping retired league players as small records (name, team, career
  totals, awards, rings): from 710-830 KB toward about 200 KB. (c) Save at decisions and season ends instead of after
  most taps. (d) A safety net: if a screen fails to draw, show "Something went wrong. Your run is safe" with Continue,
  instead of a frozen page. (e) Long term (with #14): store waiting decisions as plain data, not as code. Today
  they hold functions that cannot be saved, so the game logs actions and replays them on load, and after an app update
  a replayed season could come out differently.
- **Player benefit:** players who never lose a run never notice this. That is the point: one lost 30-minute career
  can cost a player for good.
- **Code:** `MIRROR` in the Plat block (today it excludes `bag_run`; add a season-end copy through `Shell.store`);
  `lgOffseason` / `snapJSON` (compact retired players; `allTime` only needs totals); `afterAction` / `writeSnap`
  (fewer writes); a try/catch around `drawScreen` in `render`; decisions as data (`{kind, id, params}` with the
  functions looked up by id) so `runSafe()` is always true and `writeSnap` can run at any point.
- **Effort:** medium. **Risk:** none to balance. Test resume on a device; the existing `save.witness.mjs` covers the
  web side.

### 13. Difficulty spread check: Rookie, Pro and Hall of Fame
- **What:** (a) run a Hall of Fame playtest round plus a harness check, since no recent tester played it. (b) Keep
  Rookie's casual rate at 9-10%, but lower the engaged-player ceiling through late-career fixes (#5 and #8), not by
  making the start harder. Rookie's league is already 11 points weaker than Pro's, on top of more starting points
  and small bonuses on summers and final plays. (c) Protect the non-spender: on Rookie, the story's spend step gets
  louder when 40+ points sit unused and OVR is low ("Your 76 points could make you a starter"). Nothing is spent for
  the player.
- **Player benefit:** Rookie stays welcoming without being a 10-ring autopilot, and nobody gets cut for not knowing the
  bank exists.
- **Code:** tuning in `DIFFS` and the award formulas; the spend story piece in `startSeq` / `bankBlock`.
- **Effort:** small (tests and tuning). **Risk:** touches the odds by design; owner signs off on any target change.

### 14. A safe path to the SOLID refactor
- **What:** today the game is one 440 KB file. One global `S` is read and written everywhere; the sim, the story text
  and the HTML are mixed together; the playoffs pause by throwing an error on purpose; and the save system works by
  wrapping global functions. Suggested order:
  0. **A safety net first:** 200 fixed-seed careers per difficulty, recorded (tier, score, rings, MVPs). Every refactor
     step must reproduce them exactly, plus the balance harness as a second gate.
  1. **Pure rules out first:** cost, OVR and role fit, award formulas, GOAT score and tiers move into small modules
     that take inputs and return results (no `S`). They are easy to test.
  2. **The season engine returns a result object;** a separate story layer turns it into lines (this is also #7's
     fact sheet), and the screens only draw it.
  3. **One "action" door** (`dispatch('spend', skill, n)`) replaces the wrapped globals. It feeds the save log, undo and
     any future analytics.
  4. **Playoffs as a step-by-step state machine** instead of throw-and-replay.
  5. **Split into files;** `build_www.py` joins them back into one page for iOS.
- **Player benefit:** none directly. Fewer bugs per fix, faster future features, and fixes like #1, #3 and #7 get
  much easier.
- **Effort:** big (do it in slices, one per session). **Risk:** high without step 0, low with it.

---

## 3. Suggested bundles (order of work)

- **Bundle A, quick wins with no balance change:** #1 (including the cut fix), #6 (labels and the rule line), #11,
  and #2. These hit the four loudest complaints.
- **Bundle B, pacing and trust:** #3, #7, the text half of #10, and the display half of #4.
- **Bundle C, one balance pass (single harness run and retune):** #5, #8, #9, the odds half of #10, the shot-share
  half of #4, and #13. Do these together so the odds are tuned once, not five times.
- **Bundle D, engineering:** #12 soon (cheap insurance), then #14 in slices, starting with step 0.

## 4. Owner-rule check

- **Hidden stats stay hidden:** previews show OVR and role fit, which are already visible. Odds buckets (#9) combine
  skills and traits into one number without naming any hidden stat; flagged for the owner's call. The true ceiling
  stays on the end screen.
- **No auto-spending:** nothing here spends a point. #2 only informs, #8 adds new places for the player to put points,
  and #13 only reminds louder.
- **All growth is points the player places; losses stay automatic:** kept. Longevity (#8) softens aging but does not
  replace it, like today's summers.
- **Not easy; GOAT odds targets:** #4, #5, #8, #9, #10 and #13 touch the odds. They are grouped into one harness retune
  (Bundle C) and must land back on the targets.
- **Player stats match NPCs at the same OVR:** #5's DPOY rating is tuned to this rule; check with the probe.
- **Story windows stay (skippable):** #1 adds one; #3 merges some into one card in an optional mode. None removed.
- **Pure draft, original names, one-time perks, Rookie earns no GTP:** untouched.
- **Whole Career hands-off mode stays tabled:** #3 only trims stops inside the current Whole Career; it does not
  make it hands-off.
