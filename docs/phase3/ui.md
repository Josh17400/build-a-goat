# Build a GOAT: UI and visual-beauty proposal (Phase 3)

Lens: what would make this look and feel like a premium, AAA mobile sports game on an iPhone.
Sources: the art samples (career, career2, creator_*, grid0/1, aging), witness/shots (r-setup, r-hs, r-nba, r-draft,
r-skills, story-1/2, late-clutch), playtest shots (g1a plaque, r26a season card), the CSS (index.html lines 16-330), and the
screen code (drawScreen, seasonCard, legacyCard, plaqueHTML, endHTML, seqHTML/seqPiece, clutchHTML, lookEditor, avatar,
hero, platToast, fxAfter, sndReact, hofHTML). I also read the tester feedback sections of rounds g1a-g2c and r26a-r30c.
I did not edit any game files.

---

## 1. Honest assessment of the current look

### What is already good (keep it)
- **A real visual identity.** The game feels like "an arena at night": hardwood background with grain and a vignette,
  orange and gold accents, center-court arc at the bottom, Bebas Neue headlines, Barlow Condensed labels. Most text-based
  sports sims look like spreadsheets. This one doesn't.
- **One icon language.** Every emoji in the game text is swapped for a matching line icon (`iconize`), so screens look
  designed, not typed.
- **The character art is the strongest asset.** Flat-vector portraits with real range (25 hairstyles, 8 skin tones,
  gear, jewelry, tattoos), a spotlight background, and believable aging (gray temples at 32-36, white at 39, see
  aging.png). Hairstyle and gear thumbnails drawn on *your own* player (creator_hair.png, creator_gear.png) are a premium
  touch that big studios ship.
- **The clutch screen is the best screen in the game** (late-clutch.png): a glowing scoreboard, red game clock,
  big condensed scores. It looks like a broadcast.
- **The story windows have structure**: progress dots, a Skip button, a title that slams in, cards that slide in and out,
  stat numbers that count up.
- **Motion is considered**: screen entrances, OVR ring bump, confetti, synthesized sounds, and a reduced-motion setting.

### Weak spots (where it stops feeling premium)
1. **Big moments are under-staged.** A first ring or MVP gets a gold banner on top of the season card. A title won on a
   Finals game-winner shows up as one small "Clutch: you came through" line (r-nba.png). Three different testers asked for
   a real celebration screen ("confetti, ring, banner").
2. **No team identity.** Teams have names but no colors, no crest, no abbreviation. The jersey color is picked from 10
   colors by a hash (`teamLook`). The scoreboard, draft card, free agency and season cards are text only. Sports games live
   on team branding; this is the biggest gap between "good sim" and "sports game".
3. **The career screen is one long column of same-weight cards** (career.png / career2.png): player, bank, legacy, goals,
   trade, season, rivalry, all-time, league, log. Everything has the same border, the same glow, the same size. The most
   important facts (you won the title, you were All-Star) are 16 px lines inside a list of 10 lines, at the same weight as
   "You buy your mom a house".
4. **The retirement plaque is the same card for a Bust and for THE GOAT** (g1a 553s shot). The GOAT score, the number
   the whole game is about, is the smallest text on the plaque. The era line ("BUILD A GOAT · THE 80S – THE 90S") wraps
   mid-phrase. The screen says "Screenshot the plaque and send it" instead of giving a Share button.
5. **Toasts break the polish.** The badge toast is one long run-on sentence joined with " · ", it uses native color emoji
   (it is added outside `#app`, so the icon swap never runs on it), and it covers the screen title (career.png shows two
   of them stacked over "NABL Career").
6. **The player is tiny once the career starts.** The header portrait is 60 px; season cards and story windows have no
   portrait at all. A tester: "a big player portrait aging with the seasons would sell the fantasy."
7. **Story windows leave half the screen empty** (story-1.png, story-2.png), and in the pro career the big hero stat tiles
   are dropped (they only show for high school and college).
8. **Tiny text and small touch targets.** Labels at 9-10 px (`.ovr span` .58rem, `.th small` .64rem, `.gt` .64rem,
   `.risk` .68rem). Touch targets under Apple's 44 pt: skin/color swatches 34 px, small segmented buttons 36 px, expandable
   sections 32 px, look chips 38 px.
9. **Long sentences where a chip would do.** Example on the Legacy card: "Next tier: Perennial All-Star at 60 score and 4
   All-Star seasons (you have made 0) · on pace for ~12,000 pts", in small gray type.
10. **Haptics are installed but never used.** The iOS shell ships `@capacitor/haptics` and exposes `Shell.haptic()`, but
    index.html never calls it. On an iPhone this is the cheapest "premium feel" there is.
11. **Small inconsistencies**: some choice buttons have no icon while their neighbors do (r-nba.png, "Post camp with a
    retired center"); multi-part playoff lines once broke into narrow side-by-side columns (r26a 290s shot, re-check it is
    fixed); the dock button's shine and the clutch clock blink run forever, so the screen is never calm.

---

## 2. Ranked proposals

Ranked by how much premium feel each adds for the work. Every item is display-only unless stated: none changes odds,
balance, or what the player is told about hidden stats.

### 1. Big Moment screens (full-screen celebrations)
- **What:** A full-screen takeover for the career's peak moments: first ring (and ring #N), MVP, first All-Star, a
  title-winning or series-winning final play, draft night pick, GOAT crowned, new legacy tier reached. Dark scrim,
  spotlight, the player's portrait large (about 200 px) in team colors with a "fired up" expression, a trophy/medal
  graphic, a slammed Bebas headline ("CHAMPIONS", "MVP", "RING #3"), one supporting line, confetti, fanfare, a strong
  haptic. Tap anywhere to continue. Missed final plays get a quieter version (dim, "RIM OUT", the "mean mug" face).
- **Why:** These are the moments people remember and screenshot. Right now they are lines in a list. Testers asked for this
  three times.
- **How:** Add a `'moment'` piece at the front of the story window list in `startSeq()` when the last season has a ring,
  MVP or first All-Star (the `seasonCard` already computes `firstR/firstM/firstA/ringN`; reuse that). `seqPiece('moment')`
  returns the takeover markup, so the existing Skip button covers it and story windows stay skippable. For the clutch
  result, show the same overlay when `S.lastResult.cl` is new (sndReact already detects it). Reuse `confetti()`, the `slam`
  and `pop` keyframes, and `SND.play('fanfare','cheer')`. New CSS block `.moment` modeled on `.drawer` (fixed, inset 0).
- **Effort:** Medium. **Risk:** Low-medium. Must not add taps to Whole Career beyond one tap per real peak; Witness runs
  (`html.wt`) should skip the animation. Respect reduced motion (no confetti, no slam).

### 2. Haptics on every meaningful beat
- **What:** Light tick when you pick an option or add a skill point, a "success" buzz when a gamble pays off or a clutch
  shot drops, an "error" buzz when it backfires, a heavy thump on draft pick, ring, MVP and GOAT, a medium tap when OVR
  goes up. A "Vibration" switch next to Sound and Music.
- **Why:** On iPhone, haptics are what make a tap feel physical. Every premium iOS game uses them. The plugin is already
  in the app; it just isn't called.
- **How:** Add `Plat.haptic(kind)` (calls `Shell.haptic` when present, does nothing on the web or under Witness). Call it
  from `sndReact()` next to each `SND.play` (the same "what changed" logic already exists), and from the pointerdown tap
  hook for `.opt` and `.dock button`. Toggle stored as `bag_haptics` in `soundCard()`.
- **Effort:** Small. **Risk:** Low. Only needs the normal www rebuild, not new native code. Keep the tap tick very light
  and skip it on rapid repeated taps (spending 10 points should not buzz 10 times).

### 3. Team identity: colors, crests and abbreviations for all 30 NABL teams
- **What:** Each team gets a fixed two-color kit and a three-letter tag (Phoenix Scorch: PHX, orange and charcoal; Memphis
  Kodiaks: MEM, brown and ice blue), plus a simple procedural crest: a shield or roundel in the team colors with the tag
  or the first letter of the nickname. Used everywhere a team appears: your jersey in the portrait, a color band on your
  career header, a stripe on each season card, both sides of the clutch scoreboard, the draft card, free agency and trade
  offers, the season log.
- **Why:** This is the single biggest step from "text sim" to "sports game". It also fixes tester complaints that free
  agency offers all look the same, and it makes trades and team-ups visible at a glance.
- **How:** A `TEAM_KIT` array index-matched to `TEAMS` (same pattern as `OLD_TEAMS`): `[tag, primary, secondary]`. A
  `crest(team, size)` SVG function. `teamLook()` uses the kit instead of the hash; `avatar()` accepts a direct jersey and
  trim color (today it only takes an index into the 10 `JERSEYS`). Set CSS variables `--tm1/--tm2` on the career header
  and season card. `clutchHTML()` already knows `x.my` and `x.op`, so the scoreboard can color each side.
- **Effort:** Big (mostly choosing 30 good palettes and checking contrast). **Risk:** Low for saves (display only). Owner
  rule: names and crests stay original; pick colors that fit the nickname rather than copying a real team's scheme, and no
  real logos.

### 4. A plaque worth sharing: tiered frames, big score, Share button
- **What:** The plaque's frame matches the tier: matte wood for Bust and Journeyman, steel for Role Player, bronze for
  Starter, silver for All-Star, gold for Hall of Famer, gold with a slow light sweep for Top 10, and an animated "diamond
  foil" for THE GOAT. Layout: centered portrait (about 150 px, final-team kit, real age), name in Bebas, tier on a ribbon,
  GOAT score in a big medallion, badges as tier-colored medals, accolades as trophy icons with counts (ring x8, MVP x4).
  The era line becomes a small two-line kicker that never wraps mid-phrase. Fixed 4:5 proportions so it looks right as an
  image. Replace "Screenshot the plaque and send it" with a **Share** button.
- **Why:** The plaque is the game's trophy and its free marketing. A GOAT plaque should look rarer than a Bust plaque,
  because GOAT is rare.
- **How:** `plaqueHTML(c, sc, t)` adds a class from the tier (`tier-goat`, `tier-hof` and so on) and is restructured; CSS
  for each frame next to `.plaque`. Share, step 1 (no native change): draw the plaque to a canvas (portrait SVG as an image,
  text with the bundled fonts after `document.fonts.ready`) and use the web share sheet or a download. Step 2: add
  `@capacitor/share` through `Shell` for a native iOS share sheet.
- **Effort:** Medium (step 2 adds a small native change). **Risk:** Low for the redesign; medium for step 2 (needs a new
  native build and TestFlight). The true ceiling stays end-screen-only, as now. Rookie plaques show no GTP.

### 5. Season cards and story windows that read like a broadcast
- **What:** Each season card opens with a headline band in team colors: team crest, W-L in big numbers, the playoff
  result as one chip ("Lost Conf Finals 3-4", "CHAMPIONS"), role and minutes as a chip, and a small portrait at that age.
  Awards become a row of medal chips. The remaining notes are grouped: "The season" (games, injuries, playoffs), "Off the
  court" (life and story lines), "Development" (points earned, shown as one gold callout). In story windows: the pro
  career gets the same three big count-up stat tiles high school has, the portrait appears under the title, the content is
  vertically centered so the screen doesn't look half empty, and you can swipe left to go to the next window on pieces
  that have no choice in them.
- **Why:** The season is the main loop; it should read in two seconds. Today it is a list of 10 to 15 same-size lines.
- **How:** `seasonCard(s, lite)` gets an `.sc-head` block and grouped notes; `seqPiece('season')` shows the `seqstats`
  tiles for the pro career too and passes a flag so `seasonCard` hides its small tiles; `seqHTML()` adds the portrait and a
  `min-height` on `.seqcard` that fills the space above the dock; a touch handler on `.seqcard` calls `seqNext()` on a
  left swipe, only when the piece has no options. Always emit `<span>` after the icon in `.ev` lines so multi-part playoff
  lines can never break into columns.
- **Effort:** Medium. **Risk:** Low-medium. Witness tests look for text on these cards, so keep the same words. Story
  windows stay, and Skip stays.

### 6. Career screen: a hero header and a shorter scroll
- **What:** Replace the top of the pro career screen with a hero header: large portrait (about 110 px) in team colors on a
  team-color gradient, name, team crest and record, OVR ring, and a gold "24 pts to spend" chip that opens Spend. Below it,
  a three-way switch: **This season** (goals, last season, trade request), **Legacy** (GOAT meter, benchmarks, GOAT debate,
  rivalry), **League** (all-time lists, league year, season log). The Sim button stays in the dock.
- **Why:** Today the career screen is a 10-card scroll where nothing stands out. A hub with a hero and three short panels
  is how premium sports career modes are laid out, and it fixes a tester's "the GOAT debate is hidden at the bottom".
- **How:** In `drawScreen()`'s `st==='nba'` branch, a new `careerHero()` replaces `playerCard(true)`, and
  `UI().hubTab` picks which cards follow. Pending decisions (`S.pend`) and the roster-risk warning always sit above the
  switch, so nothing important hides.
- **Effort:** Big. **Risk:** Medium. Discoverability (people must notice the switch) and Witness tests that expect all
  cards on one page. Could ship in two steps: hero header first (small), tabs later.

### 7. Toasts that look like achievement pops
- **What:** Badge and purchase notices become compact pills: a tier-colored medal, "Silver Catch & Cash", one per line,
  at most three, then "+2 more". They slide down below the notch, never cover the screen title for more than a moment,
  and tapping one opens the Badges tab.
- **Why:** The current toast is the least polished thing on screen (run-on text, color emoji, overlapping copies).
- **How:** `platToast()` takes an array, keeps one container with a queue, and runs `iconize()` on what it shows.
  `spendBadges()` passes `badgeLines(ch)` as a list instead of joining with " · ". Medal art from `bMed(tier)`.
- **Effort:** Small. **Risk:** Low.

### 8. A Legacy meter that shows the next step, not just the mountain
- **What:** The main bar shows progress to the **next tier** (6 of 60 toward Perennial All-Star) with the tier's name at the
  end, and a thin ladder underneath with notches for Perennial All-Star, Hall of Famer, Top 10 and GOAT and a marker for
  you. The long "Next tier..." sentence becomes two chips: "60 score" and "4 All-Star seasons: 0/4". Bars fill with an
  animation when they grow.
- **Why:** "6 / 350" with an empty bar (career.png) tells a young player they are nowhere. A near goal pulls people
  forward. Nothing about difficulty changes: the same thresholds, shown better.
- **How:** `legacyCard()` already has the `steps` list and `nx` (next tier); draw the segment bar and the ladder from them.
  Fill animation: a keyframe from the previous width, only when the screen key changes (the `fxBefore/fxAfter` pattern).
- **Effort:** Small. **Risk:** Low.

### 9. Touch comfort pass for iPhone
- **What:** Every tappable thing at least 44 pt: color swatches (keep the 34 px circle but give it a 44 px hit area),
  small segmented buttons, expandable section headers, look chips, the top step tabs. On the Look step, the sticky preview
  card shrinks to a small portrait once you scroll, so on a small iPhone with the tab bar, the dock and a banner ad there
  is still room to see the options. Keep the main actions at the bottom (already true).
- **Why:** Mis-taps feel cheap. On an iPhone SE or mini with a banner ad, the sticky header plus preview plus dock plus ad
  leave about 300 pt for content today.
- **How:** CSS: `.sw` (add an `::after` with negative inset), `.seg.sm button` min-height 44, `details>summary`
  min-height 44, `button.lkc` 44, `.tabs button` 40+. A scroll listener (or IntersectionObserver) toggles `.compact` on
  `.lookcard .stage`.
- **Effort:** Small. **Risk:** Low.

### 10. Type and density pass
- **What:** Minimum label size about 11.5 px (`.ovr span`, `.th small`, `.gt`, `.risk`, `.attr .imp`, `.ach .gotlbl`).
  Turn long explanatory sentences into chips or a single bold line plus a "how it works" fold. Use gold only for real
  achievements (today gold is used for awards, bank points, role labels and hints, so it stops meaning "special").
  Tabular numbers on stat tiles and tables so columns line up. Give every choice button an icon (fallback icon when the
  text has none).
- **Why:** Premium games have fewer words per screen and a clear rule for what each color means.
- **How:** CSS sizes in lines 90-168 and 279; copy changes in `legacyCard`, `hero` and `bankBlock`; a default icon in
  `optBtn()`.
- **Effort:** Small-medium (mostly copy). **Risk:** Low; check Witness text matches when wording changes.

### 11. Character art touches
- **What:**
  (a) Moment expressions: the portrait grins on a ring, looks fired up on a game-winner, mean-mugs after a backfire (for
  that screen only; the chosen look is untouched).
  (b) Jersey-number contrast: when the trim color is too close to the jersey color (gray 23 on royal, teal-ish 0 on teal in
  aging.png), add a dark or light outline automatically.
  (c) Body step preview: show your portrait next to a simple height silhouette against a 10-foot rim, with shoulders that
  widen for Strong and narrow for Lean (`avatar()` already reads `S.frame`).
  (d) Bigger portraits in career: header 60 px to about 84 px; a small portrait on each season card.
- **Why:** The art is the best asset; it should be seen more and react to the story.
- **How:** (a) pass `{...teamLook(S.look), face: N}` to `avatar()` in moment screens; (b) a luminance check where `avatar()`
  draws the number; (c) the `body` tab in `buildHTML()`; (d) `hero()` size and `seasonCard()`.
- **Effort:** Small-medium. **Risk:** Low.

### 12. Motion polish: calmer when idle, richer when it matters
- **What:** The dock button shine plays once or twice when a screen opens, not forever; the clutch clock stops blinking
  after a few seconds. Forward moves slide left, going back slides right. Bars and the GOAT score count up when they
  change. Optional: a one-second "broadcast bumper" after Sim Season (team-color wipe with the record ticking up to the
  final W-L), tap to skip, off in Whole Career and reduced motion.
- **Why:** Constant idle motion feels cheap; motion that marks change feels expensive.
- **How:** CSS lines 271 and 311 (iteration counts), a direction class on `#app` set in `fxAfter()`, count-up reusing the
  stat count-up code already in `fxAfter()`. Bumper: a short overlay in `playSeason()`.
- **Effort:** Small (bumper: medium). **Risk:** Low; the bumper must never slow Whole Career or Witness runs.

### 13. Hall of Builds as a trophy wall
- **What:** Your past careers as a grid of mini plaques (portrait in final team kit, tier frame, score), best first. Tap
  one to see its details. The current table stays as a "Details" view.
- **Why:** A collection you want to fill is a strong reason to play again, and it shows off the art.
- **How:** In `finish()`, also save `look`, `age` and `team` in the Hall of Builds record; `hofHTML()` draws the grid.
  Older records without a look get a neutral silhouette.
- **Effort:** Medium. **Risk:** Low (adds fields to a local list; old entries still load).

### 14. A real home screen
- **What:** When you open the app: the logo with the bouncing ball, your current player's portrait and "Continue: Season 6,
  Phoenix Scorch", a big **New Player** button, the Daily Build, and your best plaque. The builder starts after you choose.
- **Why:** Today the first screen is the Setup step with difficulty buttons (r-setup.png), and a tester noted the saved run
  is easy to miss. A home screen is how premium games say "welcome back".
- **How:** A `homeHTML()` drawn by `drawScreen()` when there is a saved run or on first open after the intro; reuses
  `continueCard()`, `BALL`, and the plaque component from proposal 4.
- **Effort:** Medium. **Risk:** Medium (changes the opening flow; Witness flows that start on Setup need a step added).

---

## Owner-rule check
- Hidden stats stay hidden: no new visual shows ceiling, frame effects, injury risk or hidden traits; the true ceiling
  stays on the end screen only.
- No auto-spending: the bank chip and toasts only point to Spend; nothing spends for the player.
- Story windows stay and stay skippable; Big Moments live inside them and are covered by Skip.
- Original names: crests are procedural shapes with original tags; the league is the NABL; no real logos or team color
  copies.
- Difficulty is untouched: nothing here changes odds or shows numeric odds.
- Rookie: no GTP shown on Rookie plaques or moments.
