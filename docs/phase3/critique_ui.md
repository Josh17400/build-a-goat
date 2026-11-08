# Phase 3 round 2: UI lead's critique and merge

From the UI and visual-beauty lead. I read content.md and systems.md in full and checked them against my own ui.md.
No game files were edited.

**Already shipped tonight, so not re-proposed:** haptics on big moments (with a Vibration switch), the grinning portrait
in the ring / MVP / first All-Star banners, the final season playing its story windows before the plaque, DPOY rating
the player on the league scale, and 44 px swatch tap areas. That changes four things in my own list:
- My #2 (haptics) is mostly done. All that's left is a very light tick on option picks and point spends, and success or
  error buzzes on gamble results. It's a 20-minute follow-up, not a headline item.
- My #11a (moment expressions) is half done. The mean-mug face for backfires and missed final plays is still open.
- My #9 (touch pass) is half done. Small segmented buttons (36 px), section headers (32 px), look chips (38 px) and the
  shrinking Look preview are still open.
- Systems #1 and Content #2 are partly done (the farewell season card now shows). Their leftovers are below.

---

## 1. Their top 8, seen through UI and feel

### Content lead (content.md)

**C1. Clutch Moments 2.0: AGREE, strongly. Improve the screen as well as the words.**
This is the game's favorite feature and its most-repeated complaint, and the text half is cheap. From the UI side, each
new situation should look different on the scoreboard, not just read differently:
- Free throws show "FT 1 of 2" where the clock usually is.
- The 0.8-second inbound shows the clock at 0:00.8, frozen.
- Overtime shows an "OT" tag instead of "4TH".
- On the road, the opponent's side of the scoreboard is lit and gets a small "ROAD" tag.
- The result needs a reveal: "SWISH" or "RIM OUT" slammed in big type with the crowd sound, not a small result line.
  That is my Big Moment screen (#1), so build them together.
Keep the cap of 2 clutch stops per postseason. It helps pacing and makes each one feel bigger.

**C2. The Final Chapter: AGREE. Push back on stop count; improve the visuals.**
The farewell card shipped, and the rest is good story. UI notes:
- "How do you go out?" should be a dimmed-arena moment screen, not another option card. Keep it to one stop per career,
  and skippable.
- Jersey night should show a real rafter banner: a hanging pennant in the team colors with your number and name. That
  needs team colors (my #3). Until then, use the jersey color from the portrait.
- The highlights list should become a vertical timeline (age on the left, icon, one line), in order, with the ring and MVP
  rows in gold. A plain list of 10 lines is what testers call "out of order" and "missing things".
- The epilogue should be a single tap on a row of chips, written onto the plaque in italics under the tier.

**C3. Daily Build 2.0: AGREE. Merge the sharing with the plaque share.**
Twists, a streak and a share card are cheap and give a reason to open the app every day. UI notes:
- Show "Today's Twist" as a banner card with an icon, not a sentence in the Daily text.
- The streak is a flame chip with the day count on the home or setup screen.
- The text share line is fine, but send the plaque image with it. One share pipeline should serve both (see the merge
  section).
- Owner-rule watch: a twist like "Durability locked at 1" is fine only if Durability is a trait the player can already
  see. No twist may name or reveal a hidden stat (frame development, decline, injury, minutes, scoring).

**C4. Scenario Challenges and Weekly Challenge: AGREE, but later. Improve visibility.**
Good replay value, especially for Rookie players who hit GOAT fast. Two UI points:
- While a challenge is running, show its goal as a chip on the career header, with progress ("Rings with 3 teams: 1/3").
  A goal you can't see is a goal you forget.
- The Challenge Book should be a grid of medal cards, not a list.
Put it on a home screen (my #14) rather than adding another drawer item. The menu already has 9 entries.

**C5. Dynasty Mode: AGREE as a paid expansion. Push back on timing.**
The Family Tree is a great visual: portraits side by side, the son with his father's skin tone and hair color as a
starting look (still fully editable), and a "Jr." option on the jersey. But it builds on things that don't exist yet:
stored looks in the Hall of Builds (my #13), the epilogue (C2) and team colors (my #3). Do it after those, not before.

**C6. Rivalry 2.0: AGREE. The rival needs a face.**
The cheapest big win here is visual. Rivals have no portrait today. Generate one from the rival's name (the same random
look tool the creator uses, seeded so it never changes) and show it on:
- the rivalry card,
- the clutch screen ("Guarded by Bryce Vance", with a small portrait),
- the draft card,
- the retirement handshake.
The ledger card should be a "tale of the tape": two portraits facing each other, with mirrored bars for rings, MVPs,
points and head to head. The scheduled retirement and the Young Gun are good. Give the Young Gun a portrait too, with a
cocky expression.

**C7. Midseason and summer refresh with a visible stake: AGREE.**
The stake is what fixes "it's just a sentence". UI: show the stake as a chip on the moment card ("Win 8 of the next 12").
On the season card, show the result as a mini progress bar (7/12, missed) plus the points it paid. This is the same
component as Systems #4's "what it did" chips, so build one shared piece.

**C8. Trophy Room: AGREE. Merge it with my Hall of Builds wall and with the Big Moment screens.**
Every Big Moment screen should end with "Saved to your Trophy Room", and the card in the room should be the same layout,
shrunk. One menu entry, "Trophy Room", with two tabs: **Plaques** (my #13) and **Moments** (C8). Store the look, team,
age and line of text, never an image, to keep saves small.

### Systems lead (systems.md)

**S1. No silent endings: AGREE. Finish it, and make the ending feel like an ending.**
The farewell story windows shipped. The rest is small and painful when missing: the "why your career ended" card, the cut
warning pause that can never fire (the off-by-one), and the "Is It Time?" prompt instead of a silent 30% retirement. UI:
- The career-over card should be a moment screen: the lights dim, "FINAL BUZZER", one line saying why, then the plaque.
  A plain card here wastes the most emotional transition in the game.
- The roster-risk warning should be a red band on the career header with the points chip pulsing. Point to Spend; never
  spend for the player.

**S2. Spend screen previews: AGREE, strongly. Push back on button text length.**
Ten reports, and it turns guessing into planning. But "+10 · 21 pts · OVR +1" will not fit on a 375 pt wide row that
already holds four buttons; it will wrap or get cut off. Suggestions:
- Two-line buttons: "+10" big, "21 pts" small underneath.
- Show the OVR effect on the skill's own bar as a lighter "ghost" segment and a small "OVR +1" tag at the row's end.
- The "What moves your OVR" strip should be chips with mini bars at the top of the screen, and tapping a chip opens that
  skill's group.
- Max always takes two taps: agree.
- Only preview the open group, as they say, so taps stay fast on older iPhones.

**S3. Pacing: AGREE. Merge it with my story window redesign and Big Moments.**
"While you simmed" is right. Show it as a row of mini season tiles (year, W-L, points per game, award icons) that you can
tap to expand, not a long text block. The quick recap card should use my season card design (headline band, medals,
grouped notes), so one card holds the whole quiet season. The one rule to agree on: a Big Moment never counts as an
extra stop. In Whole Career it plays for about 2.5 seconds and moves on by itself unless tapped. It's a reward, not a
decision.

**S4. Every choice shows what it did: AGREE on the display half.**
UI: one shared "change chip" with before → after and a green or red arrow ("36 → 32 MPG"), used on season cards, moment
results and free agency offers. That one component fixes S4, C7's stake results and the "word-for-word identical" offers
at the same time. The shot-share change is a balance call, so it goes in the harness bundle.

**S5. Award fairness: DPOY shipped. Neutral on MVP and ROY balance; add the display lines.**
The MVP and ROY formulas are a harness question for the systems lead. From the UI side, show DPOY and ROY finishes on the
season card like the existing All-Star and MVP lines. When voter fatigue costs you an MVP, add one honest line ("Voters
went with a new face this year") so it doesn't feel like a bug.

**S6. Make the GOAT rule clear: AGREE, strongly. Merge it with my Legacy meter (#8).**
One redesigned Legacy card:
- The main bar shows progress to the next tier.
- A ladder with notches, ending in "350 + #1 in the debate".
- One rank, clearly labelled ("#14 all-time, active players included").
- A "man to beat" chip with the #1 legend's portrait and score.
Varying the 345 is a good idea; confirm it with the harness. This is the cheapest fix for the most confusing rule in the
game.

**S7. Story consistency guard: AGREE.**
Nothing to see, but it's what makes everything else believable. A season card with a gold title banner loses all its
shine if the line under it contradicts it. Medium effort. I'd do it right after the pacing work, because the new recap
card will put contradicting lines side by side.

**S8. Late-career stakes: SPLIT IT.**
- **Legacy goals after 30** ("pass Andre Vance for 5th on the scoring list"): agree strongly. They're cheap, and each
  pass deserves a small moment ("You pass Andre Vance").
- **The Veteran group: push back for now.** "Clutch prep: slightly better odds on final plays" means buying better
  clutch odds with points. Even though the player places every point, it takes the magic out of the best moment in the
  game. Longevity moves GOAT odds. If it ships, it goes in the balance bundle, with a distinct gold-trimmed group so it
  reads as special.

---

## 2. Where the three docs overlap or conflict, and how to merge

1. **Clutch (C1 + S10 + my Big Moments).** One "Clutch 2.0" package. **Now:** more lines with a no-repeat memory,
   different Game 6 and Game 7 lines, no final shot for an injured player, the scoreboard states, and the result reveal.
   **Later, with the harness:** the new situation types' odds, a 95+ skill reading Good, "Great look", and the Game 6
   rule.

2. **The ending (S1 rest + C2 rest + my plaque #4 + Big Moments).** One fixed screen order:
   1. Farewell season story (shipped)
   2. "How do you go out?" moment
   3. Final-buzzer card saying why the career ended
   4. Tiered plaque with a Share button
   5. Epilogue chips, written onto the plaque
   6. Hall of Fame induction, then the rest of the end screen

3. **Plaque frames (my #4 vs C9 cosmetics). This is a real conflict.** The tier frame must be automatic and earned. It is
   the honest badge of the tier, and a GOAT foil frame must never be for sale, or it cheapens the rarest result in the
   game. Gems can buy accents only: backgrounds, nameplate styles, trim colors. These must never look like a higher
   tier's frame.

4. **Team colors and draft night (my #3 vs C9).** Team kits and crests are the free base layer. The draft suit and cap,
   signature shoes and court themes are paid or earned layers on top. Build the kits first, so the cosmetics have
   something to sit on.

5. **Collections (C8 Trophy Room + my #13 Hall of Builds wall + my #1 Big Moments).** One "Trophy Room" with Plaques and
   Moments tabs. The Big Moment screen is the card art.

6. **Stops and taps (C's stop budget + S3 pacing + my moments and story windows).** One budget, using the content
   numbers: at most 2 optional offseason stops, 1 midseason stop and 2 clutch stops per postseason. The systems lead's
   `nextQ` counter enforces it. Big Moments auto-advance in Whole Career, so they cost no taps. Recap mode uses the
   redesigned season card.

7. **"What happened" display (S4 + C7 + my season card #5).** One change-chip component and one "Decisions" section on
   the season card.

8. **Legacy clarity (S6 + my #8).** One Legacy card redesign. Ship it as a single change.

9. **Sharing (C3 + my #4).** One pipeline: draw the plaque (or the Daily result card) as an image and send it with a
   one-line text summary through the share sheet. The first version uses the web share sheet; the native
   `@capacitor/share` plugin comes later with a TestFlight build.

10. **Where new things live (C3, C4, C8 vs the menu).** A home screen (my #14) holds Continue, New Player, the Daily
    with its streak, Challenges and the Trophy Room. Otherwise the drawer grows to 12+ items.

11. **Odds wording (S9 "about 3 in 10" vs today's word labels). I lean against numbers.** "3 in 10" reads like a casino
    and edges toward showing what the hidden factors add up to. Keep word labels, give each word one fixed range, and
    always show both outcomes plus the bonus a success pays. If the owner wants numbers, that's his call (the systems
    lead flagged it too).

12. **Rival faces (C6) and team colors (my #3).** Rival portraits wear their team's colors, so the two are best built
    one after the other.

---

## 3. Joint top 10, ordered by fun gained per hour of work

Shipped items are left out. "Harness" means the GOAT-odds check must pass before shipping.

| # | Item (sources) | Effort | Why it ranks here |
|---|---|---|---|
| 1 | **Clutch 2.0, text and screen half:** 6+ lines per play with no repeats, different Game 6/7 lines, no final shot while injured, scoreboard states for FT, inbound, OT and road (C1, S10, my #1) | Small | The favorite feature and the most-repeated complaint, for an evening of writing |
| 2 | **Legacy card redesign:** next-tier bar, notched ladder to "350 + #1", one labelled rank, "man to beat" chip (S6, my #8) | Small | Removes the most confusing rule and gives every career a near goal |
| 3 | **No silent endings, the rest:** final-buzzer card with the reason, cut-risk pause from season 1 with the same OVR line, Is It Time? prompt (S1) | Small | High pain, small fix; the career's last screen should never be a surprise |
| 4 | **Spend previews:** two-line buttons with cost, ghost OVR gain on the bar, "What moves your OVR" chip strip, Max always two taps (S2) | Medium | Ten reports; turns "wasted points" into a plan |
| 5 | **Big Moment screens:** full-screen ring, MVP, game-winner reveal, draft pick, GOAT crowned; auto-advance in Whole Career; mean-mug on misses (my #1, building on tonight's banners and haptics) | Medium | The payoff testers keep asking for; makes the peaks memorable and screenshot-worthy |
| 6 | **Pacing pack:** "While you simmed" season tiles, one stop budget, always stop for big events, no trade ask right after signing (S3, content stop budget) | Medium | Whole Career drops to 2-3 taps and nobody misses a title |
| 7 | **Final Chapter, the rest:** "How do you go out?" moment, epilogue chips on the plaque, ordered highlight timeline, rafter banner (C2) | Small-medium | Turns the ending into the documentary finish; story only |
| 8 | **Daily 2.0:** Today's Twist banner, streak chip, share card (C3) | Small | A daily reason to open the app, and free word of mouth |
| 9 | **Choices show what they did:** shared before → after chips, midseason stakes with a result bar, a "Decisions" section on the season card (S4 display, C7 stakes, my #5) | Medium | Nine reports of "nothing happened"; one component fixes three complaints |
| 10 | **A plaque worth sharing:** automatic tier frames (GOAT foil never for sale), big score medallion, portrait in final-team kit, Share button that the Daily reuses (my #4, C9 frames) | Medium | The trophy and the marketing; GOAT should look as rare as it is |

**Next in line:**
- Team colors and crests with rival portraits (my #3, C6): big effort, the biggest jump in looking like a sports game.
- The story consistency guard (S7).
- Rivalry 2.0 story beats (C6).
- The Trophy Room (C8 with my #13).

**Polish folded in:** the toast redesign and the type and touch pass (my #7, #9, #10) are each under an evening and should
ride along with whichever item touches those screens.

**Balance bundle, tuned once:** MVP and ROY fairness (S5), honest risk labels (S9), the Veteran group (S8), the clutch odds
half (S10), shot share (S4) and the difficulty spread (S13). All of these go through the harness together.

### Owner-rule check for the top 10
- **Hidden stats stay hidden:**
  - #4 previews only OVR and role fit, which are already on screen.
  - #2 shows tier thresholds already shown in text.
  - #8's twists may not name a hidden stat.
  - The true ceiling stays on the end screen (#10).
- **No auto-spending:** #3 and #4 only point to Spend; nothing spends for the player.
- **Growth is points the player places; losses stay automatic:** untouched. No item adds growth.
- **Not easy, odds on target:**
  - #1, #2, #3, #5, #7, #9 (display half) and #10 are display or text only.
  - #6 changes when you stop, not what happens.
  - #8's twists are limits only.
  - Anything that changes odds sits in the balance bundle with the harness.
- **Story windows stay and stay skippable:**
  - Big Moments live inside the story sequence and are covered by Skip.
  - #7 adds one skippable stop per career.
  - #6 trims optional stops but removes no story window.
- **Original names, the NABL, a pure draft:** #8 twists never set the draft slot. Crests and banners use original
  names only.
- **Perks one-time, Rookie earns no GTP, gems or achievements:** #8's streak rewards are cosmetic only, Rookie plaques
  show no GTP, and Trophy Room moments count only on Pro and Hall of Fame.
- **Whole Career stays a stop-at-every-decision mode:** #6 trims extra stops but still stops at every real choice, so
  the tabled hands-off mode stays tabled.
