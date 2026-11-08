# Build a GOAT: systems lead critique and merge (Phase 3, round 2)

From the systems and improvements lead. I read ui.md and content.md and re-checked each claim against the current
index.html (after the "Overnight 4" commit). I edited no game files.

**Already shipped tonight, so I do not count it as open work:**
- the final season plays its story windows before the plaque;
- Whole Career checks roster risk from pro season 1;
- DPOY uses the league's own formula;
- a kept playstyle keeps its role on every team;
- the clutch "up 1, on defense" setup is rarer;
- **haptics** (`sndFx`, with a `bag_haptics` switch, never on plain taps);
- team colors from a name hash on the header, season cards, draft card and plaque;
- banners for every ring and the first All-Star;
- MVP voting leans a bit more on wins;
- no "missed a game" line in an 82-game season;
- big-man last shots.

**One change from tonight works against the pacing goal.** Midseason moments now come in 45% of seasons, and the per-season
cap went from 3 stops to 4 (`midPend`). That is fine on its own, but every new content idea also wants stops. The merge
below proposes one shared budget so the stops do not creep back to 5 or 6 a season.

---

## 1. Their top 8 proposals, one by one

### UI and visual beauty (ui.md)

**UI 1. Big Moment screens: AGREE, with three conditions.**
- **One moment per season, at most** (ring beats MVP beats first All-Star beats a title-winning shot). Otherwise a
  ring + Finals MVP + MVP year adds three taps to Whole Career.
- **It should replace the gold banner on the season card, not sit on top of it.** Today `seasonCard` already works out
  first ring, ring number, first MVP and first All-Star, so the moment piece should read the same flags (one source of
  truth).
- **The clutch result should stay inside the existing clutch piece,** not become a separate overlay step. A clutch pick
  re-runs the bracket (`seasonPlayoffs` replays from saved dice), and an overlay timed off `S.lastResult` can fire twice
  on resume.

It is display only, the story sequence already lives in the saved UI state, and Skip covers it. Odds: none. It also gives
my "Next Decision must stop for big moments" fix something to stop on: the same piece.

**UI 2. Haptics: ALREADY SHIPPED. Keep the shipped version.** The shipped `sndFx` buzzes on the same beats as the
sounds and deliberately skips plain taps and point ticks. I would not add the proposed tick on every `.opt` / dock tap.
On a 20-season Whole Career that is hundreds of buzzes, and it would fire on the disabled "Make your call above" button.

**UI 3. Team identity: AGREE ON THE CHEAP HALF; PUSH BACK ON PRIORITY FOR CRESTS.**
- **Already there:** a color from a name hash.
- **Worth doing now (small to medium):**
  - a fixed `TEAM_KIT` table of three-letter tag plus two colors, index-matched to `TEAMS` exactly like `OLD_TEAMS`.
    The team-rename code relies on index matching, so the kit must follow the same order or a renamed old save gets the
    wrong colors;
  - the colors and tags on both sides of the clutch scoreboard and on free-agency cards.
- **Later:** procedural crests. They are big art work, and fun per hour is lower than the clarity fixes.
- **Save safety:** saves store team names as text, so a kit table is safe for old runs.

**UI 4. Tiered plaque + Share: AGREE ON FRAMES; PUSH BACK ON IMAGE SHARE AS STEP 1.**
- **Frames by tier** are cheap, display only, and make THE GOAT look rare. Yes.
- **Image share** means drawing an SVG portrait with bundled fonts onto a canvas inside the iOS web view. That is the
  riskiest kind of web code on iPhone (font loading, tainted canvas, file sharing). There is no share support in the game
  or in `native/shell.js` today.
- **Step 1 instead:** a text share card (content #3's Wordle-style line) through one small native plugin
  (`@capacitor/share` via `Shell`). Step 2: the image, once step 1 has proven the native path on TestFlight.
- **Conflict with content #9 (frames sold for gems):** the tier frame must stay earned only (see merge 6).

**UI 5. Broadcast season cards: AGREE, and make it the same thing as my "Quick recap" card.**
- **The grouping needs a data change.** Splitting notes into "The season / Off the court / Development" needs each note
  to carry a type. Today notes are plain strings with an emoji prefix, and grouping by emoji is fragile. Do it together
  with the story fact sheet (my #7): notes become `{type, text}`. Old saves keep their string notes, so the card must
  draw both.
- **Swipe to advance:** only on pieces with no choice (as proposed), and only on a clearly horizontal swipe, so a
  vertical scroll never skips a season.
- **Witness tests:** keep the words, as they say.

**UI 6. Career hub with hero and tabs: AGREE WITH THEIR STEP 1 ONLY (hero header).**
- **The tabs are big work and hide things.** The roster-risk card, the trade-request card and the "While you simmed"
  card (my #3) must never sit behind a tab.
- **They break most Witness flows,** which expect one page.
- **Ship the hero header** (with the "N pts to spend" chip, which also helps the non-spender problem). Revisit tabs only
  if testers still complain about scrolling.

**UI 7. Toast pills: AGREE.** Small, display only, and it fixes a real overlap bug. The toast lives outside `#app`, so
it must run `iconize` itself, as they note.

**UI 8. Legacy meter shows the next step: AGREE, and merge it with my GOAT-rule clarity (#6).**
- **The ladder's last notch must show both GOAT conditions:** 350 score AND #1 in the GOAT debate, active players
  included. Otherwise a bar filling to 351 tells the player they made it when they did not (g1a's exact complaint).
- **Engineering point:** the tier thresholds already live in two places that disagree. `legacyCard` lists GOAT as
  "350 score and 5 All-Stars", but `tierOf` needs no All-Star count for GOAT. One `TIERS` table should feed `tierOf`, the
  meter and the ladder, so they can never drift.
- **Odds:** none, if the thresholds themselves stay.

### Content and expansions (content.md)

**Content 1. Clutch Moments 2.0: AGREE ON THE TEXT HALF NOW; THE CAP AND NEW SITUATIONS NEED CARE.**
- **Text half** (5-6 lines per outcome, no repeats within a career, opponent and age in the line): zero odds risk.
  Reuse the memory `flavor()` already keeps (`S.seenF` plus the cross-career recent list).
- **"A cap of 2 clutch stops changes nothing about who wins" is not right.** When a moment is not shown, the game is
  decided by team strength alone. When it is shown, it is decided by the player's chosen option (often 50-70% for a good
  player). So capping changes ring odds, and rings are 12 GOAT points each.
- **The fix:** resolve over-cap moments with the same clutch formula and the best option, from the same saved dice.
  The result then matches what a smart player gets, and resume stays deterministic.
- **New situations** (free throws, inbound, overtime) need base odds tuned on the balance harness.
- **The injured-player rule exists** (major injuries are excluded), but r27c still got a final shot in a torn-ACL season,
  so tie it to games played in the fact sheet, not to the injury text.

**Content 2. The Final Chapter: AGREE; part of it shipped tonight.**
- **What remains is good and cheap:** chronological highlights that include midseason moments, trades and rival
  knockouts; road-city farewell gifts; jersey nights; a Hall of Fame presenter; an epilogue line.
- **Two systems notes:**
  - make "How do you go out?" the regular-season home finale, so it can never contradict a real playoff final play;
  - add my "why your career ended" line for cuts and forced retirements, which the farewell path does not cover.
- **Push back:** do not build the epilogue as groundwork for Coaching. Keep it a text field; a big mode should not shape a
  small feature.
- **Save:** one new field in the Hall of Builds list is safe (old entries load).

**Content 3. Daily Build 2.0: AGREE, with one balance catch.**
- **The Daily earns GTP and achievements today** (it plays on Pro; only gems are switched off), so a twist that makes
  the day easier inflates the store currency. Twists must be limits only (they say so). For safety, give the Daily a
  fixed, small GTP payout.
- **Streaks run on the phone's clock,** so they are easy to cheat. That is fine for cosmetic rewards, never for GTP.
- **Game Center** is native work; later.
- **"Same dice for everyone"** only holds until two players make different choices. That is fine, but the share line
  should say "same start", not "same career".

**Content 4. Scenario and Weekly Challenges: AGREE, medium.**
- **It fixes a real gap:** Rookie GOAT-chasers have nothing new to chase.
- **Systems needs:**
  - the challenge setup is stored in the saved run, so resume keeps it;
  - goals are checked in `finish()`, like achievements;
  - Rookie earns no medals;
  - GTP rewards stay small.
- **"90s Enforcer: 3 DPOY" is now possible but hard,** since tonight's DPOY change gives a rim protector about 2 a
  career. Good as the hard challenge.

**Content 5. Dynasty Mode: PUSH BACK ON SIZE AND TIMING.**
- **It is big, not medium.** It touches the legend list, the era order, class and rival creation, the Hall of Builds
  layout, a new Family Tree screen and a new store product (a native release).
- **Eras run out** after 3 or 4 generations (6 eras, moving 20 years at a time).
- **Balance:** a GOAT parent already sits on the all-time list, so a son must beat his father to be #1. That is a great
  story, but it makes the GOAT rarer for dynasty players; check with the harness.
- **Save:** a family record grows the native backup copy. Keep it compact.
- **Verdict:** a good paid expansion after the free updates, not now.

**Content 6. Rivalry 2.0: AGREE, with an odds flag.**
- **The rival is often the active #1 who blocks THE GOAT** (g1a). Forcing his retirement at 34-36 removes that blocker
  earlier, so GOAT odds rise a little. Use a high-chance retirement window rather than a fixed age, and check with the
  harness.
- **"Franchise Nemesis" is cheap:** the team that knocked you out twice is already in each season's playoff record.
- **The verdict already counts rings first** (rings × 5, MVPs × 3, All-Stars × 0.8, plus points), so what is missing is
  showing that rule, not changing it.

**Content 7. Midseason and summer refresh with a visible stake: AGREE on the stake, IMPROVE how it pays.**
- **The visible stake fixes the loudest content complaint** ("result is just a sentence") and matches my #4.
- **Problem:** a separate bonus-point goal per moment adds points every season, which moves the odds, and adds a second
  goal list on screen.
- **Better:** the stake replaces one of the season's 3 goals. Same reward sizes, the same goals card, zero odds change.
- **"Reinvent your game should offer a new style" cannot grant the style directly:** the style follows your skills, and
  growth must be points the player places. Instead, Reinvent pays the points and sets a target role that the spend
  screen highlights (my #2).
- **Do the story fact sheet first.** 12 new moments written onto today's separate checks means 12 new chances to
  contradict the season.
- **Agree on removing the duplicate Mentor the Rookie.**

**Content 8. Trophy Room: AGREE, later, and merge it with UI 13 (trophy wall).**
- **Save safety:** every progress key is copied as one blob to the phone's native storage, rewritten 400 ms after any
  change, including every gem or GTP change. A large trophy key makes every one of those writes bigger.
- **Caps:** a hard cap per card type and one compact record per card (season, kind, short text), about 30 KB total.
- **Rookie** earns no cards.

---

## 2. Overlaps and conflicts, and how to merge them

1. **The ending (my #1, content #2, UI #1 and #4).** One "Final Chapter" feature in order:
   - final season story (shipped);
   - a "why it ended" line, plus a one-season-ahead warning: "next season is your last: spend your points now";
   - farewell gift lines and the home-finale choice;
   - the GOAT-crowned or final-tier Big Moment;
   - the tiered plaque;
   - chronological highlights.
   One owner, one test pass.
2. **Big moments (UI #1, content #2 jersey nights, my #3 "stop for big moments").** One `moment` story piece with a
   fixed priority and a limit of one per season in Whole Career. Next Decision stops on it. Skip covers it.
3. **Stops per season (my #3, content's ground rule, UI #5 swipe and #12 bumper, tonight's midseason 45% / cap 4).**
   - **The budget:** one shared count in `nextQ` and `midPend`. At most 2 optional offseason choices besides the summer
     and free agency, at most 1 midseason moment, and clutch stops capped as in content #1 (over-cap moments
     resolved by the formula).
   - **New content fits inside the budget or becomes a card line.**
   - **The broadcast bumper (UI #12)** is off in Whole Career and Quick recap.
   - **Revisit tonight's cap of 4** under this budget.
4. **Clutch (my #10, content #1).** Use content's bigger version, plus my two pieces: odds words that respect elite skills
   (95+ reads "Good", a new "Great look" tier), and over-cap moments resolved by the same formula. One balance check for
   both.
5. **Choices that show their effect (my #4, content #7 stake, content's "differ in what happens").**
   - The season card prints each choice's effect with its size ("36 → 32 MPG, about −2 points").
   - The stake is one of the 3 season goals.
   - Contract roles change shot share (this half needs the harness).
6. **Plaque frames (UI #4 earned by tier, content #9 sold for gems).** The tier frame is automatic and earned only,
   never sold, so a GOAT plaque always means a GOAT. Gem items are accents that sit on top (backgrounds, nameplates, foil
   color), on any tier.
7. **Free-agency offers that all read the same (UI #3, content #10, my #4).** One offer card: team tag and colors, last
   record, team strength rank, the named co-star, coach style, the role and what it means for your shots. All of it
   already exists in the league sim except the coach.
8. **Legacy meter and GOAT rule (UI #8, my #6).** One `TIERS` table for `tierOf`, the meter and the ladder. The ladder's
   top shows both GOAT conditions. Varying the #1 legend's score (my #6) is a separate, harness-checked change.
9. **Share (UI #4, content #3).** One Share feature: the text card first, the image later. One native plugin.
10. **Collections (UI #13 trophy wall, content #8 Trophy Room).** One screen with two views (your careers, your
    moments) and one compact save record. It ships with the save-size work (my #12).
11. **Cuts and dead ends (my #1 and #13, content #11 Second Chance).** First the cheap part: the warning and "spend now"
    (partly shipped). Second Chance comes later. It is a new mini-sim and extends weak careers, so check the odds.
12. **Order dependency for all new writing:** the story fact sheet (my #7) and story-as-data tables come before
    content #7's 12 moments and content #1's new situations. Otherwise every new line repeats today's contradiction
    bugs, and the refactor (my #14) gets harder with every line added to the single file.

---

## 3. Joint top 10, ordered by fun gained per hour of work

Hours are rough estimates for one focused agent session, including a Witness check. "Harness" = the balance sims for
the GOAT targets.

| # | Proposal (sources) | Why it wins per hour | Hours | Odds risk | Owner-rule check |
|---|---|---|---|---|---|
| 1 | **Clutch text 2.0:** 5-6 lines per outcome, no repeats in a career, Game 6 and Game 7 never share a line or score (content 1, my 10) | The most-loved feature and the most-repeated complaint; mostly writing | 2 | None (text only) | Original names; NABL |
| 2 | **Legacy ladder + GOAT rule line + one TIERS table** (UI 8, my 6) | Kills the "351 but not the GOAT" surprise and gives young players a near goal; also fixes a hidden threshold drift | 2 | None (same thresholds) | No hidden stats shown |
| 3 | **Spend preview:** every button shows "OVR +1" or the role-fit gain, Max always confirms, role names in messages, the "lean into" hint aims at a new role (my 2, my 11) | The loudest complaint (10 reports); turns "wasted points" into a plan | 4 | None | Informs only; no auto-spend |
| 4 | **Big Moment piece inside the story,** one per season, and Next Decision stops on it (UI 1, my 3) | The peaks people screenshot; fixes "my first title was simmed past" | 4 | None | Story windows stay, Skip covers it |
| 5 | **Shared stop budget + "While you simmed" card** (my 3, content rule) | Whole Career from 4-6 taps to 2-3; nobody misses a season | 3 | Low (a capped moment becomes a card line with no effect; spot-check) | Story windows stay; hands-off mode still tabled |
| 6 | **Final Chapter remainder:** why it ended, chronological highlights with midseason moments and trades, farewell gifts, home-finale choice (content 2, my 1) | Endings are what players talk about; the system half shipped tonight | 3 | None (after the last season) | Skippable; one stop per career |
| 7 | **Choices show their effect + the stake as a season goal** (my 4 display half, content 7) | "Nothing happened" was in 9 reports; reuses the goals card | 3-4 | None (same reward sizes) | Growth stays player-placed points |
| 8 | **Daily 2.0:** twist of the day, streak, text share card (content 3, UI 4 share) | The cheapest reason to open the app every day | 4 (plus a small native plugin for share) | Low (limits only; fixed small Daily GTP) | Draft stays pure; premades fill skills only; Equipment stays off |
| 9 | **Polish pass:** tiered plaque frames, toast pills, 44 pt touch targets (UI 4 frames, UI 7, UI 9) | Three small CSS-heavy wins that make it feel premium on iPhone | 3 | None | GOAT frame earned only; Rookie shows no GTP |
| 10 | **Story fact sheet:** one record of the season's facts that every story line reads, plus an automated contradiction check over 500 sim careers (my 7) | Stops the self-contradictions (12 reports) and must come before new content | 4 | None | No hidden stats in text |

**Just outside the top 10 (worth doing next, in this order):**
- **11. Award pass:** MVP voter fatigue and Rookie of the Year by production. One harness retune.
- **12. Broadcast season card** (UI 5, built on #10's note types).
- **13. Rivalry 2.0:** retirement window and nemesis. Harness.
- **14. Scenario and Weekly Challenges.**
- **15. Veteran points for capped players** (my 8). Harness.
- **16. Honest summer risk labels** (my 9). Harness.
- **17. Team kits and tags** (UI 3, cheap half).

Do 11, 13, 15 and 16 together as one balance pass so the odds are retuned once.

**Do regardless (insurance, not fun per hour):**
- **(a) A golden-master check before any balance or refactor work:** 200 fixed-seed careers per difficulty, recorded so
  every change is measured. About 2 hours.
- **(b) iOS save safety:** copy the in-progress run to native storage at each season end, and keep retired league players
  as small records (today a run save reaches 710-830 KB by career end). About 4 hours. The first purge of a 30-minute
  career costs a player.

**Not now:** Dynasty Mode, Coaching, Era Packs, Legends Mode, crests, and career-hub tabs. They are good expansions, but
each is big. Each should wait until the fact sheet and the story-as-data tables exist, so they are not written into the
single file the way today's content is.
