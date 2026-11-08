# Overnight report: Build a GOAT (Nov 8)

Started 1:16 AM. Work is committed locally only; nothing is pushed to TestFlight until you say so.

## Read this first

**What happened overnight**
- 25 rounds of 3 Witness playtesters (75 sessions): GOAT chases on every difficulty and style, first-time players, art-director reviews of the creator, and a menus-and-screens review. After each round I fixed what they found, ran the full test suite (89 automated tests, all passing) and committed locally.
- Testers reached THE GOAT on Rookie (eight times, often on the first career), Pro (a rim protector on career 3) and Hall of Fame (a center on career 2, with perks). Most Pro and Hall of Fame careers ended at Hall of Famer or Top 10 All-Time, which is where you want them.
- Phase 2 rebuilt the character creator and polished the character art (aging, team colors, portraits on banners and the Final Buzzer card).
- Phase 3: three high-effort leads proposed and debated what to add next. Their joint top 10 is below, and the full documents are in `docs/phase3/`.
- GOAT odds were rechecked after every balance change and retuned once (Rookie .45 to .40, Hall of Fame .75 to .77).

**Biggest changes you will notice**
1. The last season of a career plays out on screen (Final Season), then a Final Buzzer card says why it ended.
2. Banners with your grinning portrait for rings, MVPs, first All-Star, Rookie of the Year, first scoring title and first DPOY.
3. Clutch final plays have about twice as many result lines, never repeat within a career, and name the opponent.
4. Next Decision stops for title and MVP seasons, and otherwise leaves a "While you simmed" summary.
5. Fairer awards: top-5 scorers and the DPOY (10+ points) make the All-Star team; DPOY works for real defenders without being automatic; Finals MVP and Rookie of the Year look at production.
6. No more accidental risky picks: newly shown choices ignore taps for half a second, and summer options are listed safe first.
7. Whole Career and Next Decision pace better: a pause before your final season and when 60+ points pile up, a milestone watch ("1,240 points from 30,000") on retire and farewell, and a cleaner menu (Your profile, How to play, Escape to close).
8. Haptics on iPhone for big moments, with a Vibration switch.
9. The creator: grouped tabs, picture thumbnails, a preview that shrinks while you scroll, realistic aging, and team colors as a pro.

**Decisions for you** (details in each round below)
1. **OVR ceilings differ by style** (wings and slashers reach about 90 with their key skills maxed; point guards and bigs about 84). Fixing it means changing the OVR formula and retuning odds.
2. **Reset all progress erases bought gems.** Keep purchases through a reset?
3. **Pro odds spread:** a 5,000-career run gives casual 0.7% and smart 5.5% (targets ~1% and 4.3–5%). The gap between casual and smart players is a little wider than you want; narrowing it is a design question, not a single number to tweak.
4. **Pure scorers rarely win MVP**, so they stall below 350 (one tester won 14 scoring titles over two careers, several on 63- to 70-win teams, and no MVP). The most-repeated balance complaint of the night.
5. **Bench-role rings** at 37 count in full toward the GOAT score; scale ring credit by role?
6. **Whole Career pacing:** it still stops 3 to 4 times a season; nearly every tester said it plays like Next Decision. The phase 3 "stop budget" proposal (cap optional stops per offseason) is the fix, but it changes how often you see moments, so it is your call.
7. **Final plays per playoff run:** late in a career a Game 7 last shot comes up almost every year. Capping them at 2 per playoffs keeps them special but changes series win rates, so it belongs in the balance pass.
8. **iOS save safety:** the in-progress career isn't mirrored to the phone's native storage (an iOS storage purge would wipe it) and grows to 700–800 KB. Worth fixing before a wide release.
9. **Phase 3 priorities:** which of the joint top 10 to build next (spend-screen previews and the stop budget were the most requested by testers).
10. **Ship it?** If you're happy, push and start TestFlight. Nothing has been pushed.

**Where things are**
- 48 local commits on `feat/ios-monetization` since last night's push (none pushed).
- Every playtest report is in `witness/playtests/<name>/report.md` (g1a through g18c), with replays and screenshots.
- The phase 3 proposals and critiques are in `docs/phase3/`.
- To ship when you're ready: `git push origin HEAD:main`, then `gh workflow run ios.yml --ref main --repo Josh17400/build-a-goat`.

## Phase 1: GOAT-chase playtests

Testers kept playing careers until they reached THE GOAT, and listed every bug, UI issue and fun idea.

### Round G1 (3 testers)

| Tester | Result | Fun | Difficulty |
|---|---|---|---|
| Rookie rim protector | THE GOAT on career 1 (8 rings, 4 MVPs, 19 All-Stars) | 4/5 | 2/5 |
| Rookie guard | THE GOAT on career 2 (11 MVPs, 4 rings) | 4/5 | 2/5 |
| Pro wing | Not GOAT after 1.5 careers (2 rings each) | 4/5 | 4/5 |

**Fixed after G1**
- All-Star snubs explained: season card shows your All-Star voting rank ("31st, top 24 make it").
- No more "Mystery Prospect": a blank name gets a real random name.
- GOAT race line on the Legacy card: your rank, who is #1 and the score gap.
- Clutch odds weigh your best skill more (a 98 Three-Point now reads as a good look).
- First ring and first MVP get a gold celebration banner on the season card.
- Spend screen: +10 buttons show their point cost; the Undo bar sits under the list so rows never jump.
- "You play like" shows a "leaning toward X" note when another style rates a hair higher.
- Late-career random growth is smaller (no +50 development while declining).
- Story fixes: no "playoff loss" line in a sweep; Finals final plays count as highlights only in title years; #1 pick draft card no longer empty; team-up card shows pros and cons; load management warns about the 65-game award rule.

### Round G2 (3 testers)

| Tester | Result |
|---|---|
| Art director review of the creator | Notes below (phase 2) |
| Rookie wing | THE GOAT |
| Pro big | Hall of Famer, not GOAT |

**Fixed after G2**
- Class rankings: the up and down arrows now measure "this season" (from where you stood when the season started), not a stale snapshot.
- A story line no longer claims you missed a game during an 82-game season.
- MVP voting leans a bit more on team wins.
- The All-Star voting rank also shows in seasons you made it.
- The GOAT debate line says it includes active players. Rookie shows MVPs instead of a GTP tile (Rookie earns no GTP).
- The rivalry card says what the lead is based on ("you lead on legacy").
- A young player whose OVR dropped after an injury is told so plainly.
- Every title gets a banner (Ring #2, #3 ...), and your first All-Star does too.
- A "Request a trade" card between seasons (once every two seasons, never in a contract's last year).
- The plaque remembers your best badges from the whole career, not only the last season's.
- No classmate shares your last name.
- Big men get last-shot plays of their own: a lob at the rim and crashing for the putback.

### Round G3 (3 testers)

| Tester | Result |
|---|---|
| Art director, second pass | Notes below (phase 2) |
| Rookie wing | Hall of Famer |
| Pro big | Hall of Famer |

**Fixed after G3**
- A second ring with the same team says "Champions again with the X. Banner number 2", not "this time with".
- The Request a trade card is hidden the season right after you sign as a free agent.
- Bigs who cannot shoot are no longer offered the pull-up three or step-back on a last shot.
- Defensive Player of the Year voting now sees a rim protector's real value (interior defense and blocks).
- Midseason moments come a little more often (45% of seasons, up to 4 stops a career).
- Text: "+1 · 1 pt" (not pts), "Stay out of it" says what it does, the mixtape result says what it did to your hype, two more post-move endings, and the lob and post-camp lines have proper icons.

### Round G4 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Art director, third pass | Notes below (phase 2) | 3/5 |
| Hall of Fame guard | Hall of Famer (3 rings, 7 All-Stars), not GOAT | 4/5 |
| Pro center | Perennial All-Star (2 rings, 14 DPOYs) | 3/5 |

**Fixed after G4**
- The last season of a career now plays out on screen ("Final Season": final plays, season card, badges, goals, history), then the plaque. It used to jump straight to the plaque (also flagged in 9 older reports).
- Defensive Player of the Year: my G3 change overshot (a 65 OVR bench rookie won it). The player is now rated on the same scale as league players, plus a capped bonus for defensive specialists. Measured over 12 careers each: a rim protector wins about 1.6 a career, a two-way wing about 0.5, a shooter almost never, and nobody wins in their first two seasons.
- Choosing "Stay a Rim Protector" now keeps that role on every team (it used to snap back to the new style).
- The "lean into" hint points at a different style, not the one you already have.
- The All-Star line no longer says "top 24 make it" when you made it from 25th or lower (it says you were a coaches pick).
- No "Play 75+ games" goal when you already know you will miss part of the season.
- The Retire now option shows your legacy score and how far the next tier is.
- Plaque era line never breaks in the middle of "2000S".
- A summer result you already read in the story is not repeated on the hub.
- Whole Career checks your roster risk from your first pro season (it waited a season too long).
- Final plays: the "up 1, on defense" situation is a bit rarer, so offense-minded players (bigs included) get more shots.

### Round G5 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Art director, fourth pass | Notes below (phase 2) | 3/5 |
| Rookie point guard (Whole Career) | Top 10 All-Time (4 rings, 10 All-Stars), not GOAT | n/a |
| Pro two-way wing | Top 10 All-Time (3 rings, 8 All-Stars, 3 DPOYs), not GOAT | n/a |

**Fixed after G5**
- **Clutch 2.0 (text):** every final play has 2 to 3 more result lines, some naming the opponent, and no line repeats within a career until all are used. Game 6 and Game 7 can no longer share a line. Odds unchanged.
- "Next Decision" stops on any title or MVP season and shows its story. It used to sim straight past a title.
- The last story window of a career is "The Final Buzzer": your portrait and why it ended (farewell tour done, age, no contract at N OVR).
- Finals MVP goes to the champion who produced, not the biggest name on the bench.
- Class news no longer says a classmate "has a ring before you" when you already have one.
- The ring-chase offer says it means a bench role (about 20 to 26 minutes).
- No Request a trade card right after a title.
- The All-Star banner says "The coaches picked you" or "The fans and players voted you in", matching your voting rank.
- The difficulty card on a locked run describes your difficulty instead of pitching it.
- The Legacy card has a second bar: progress to the next tier ("Next: Perennial All-Star · 51 to go"). The GOAT step now matches the real tier rule.
- Haptics on iPhone: a light buzz on draft night, a heavy one for rings and MVPs, success and error buzzes on gambles and final plays. Never on plain taps or point spending. A Vibration switch sits in Sound settings (iPhone only).

### Round G6 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Art director, fifth pass (plus the career ending) | Rookie career to the plaque | 4/5 |
| Hall of Fame center | **THE GOAT on career 2** (6 MVPs, 3 rings, score 389); career 1 Top 10 All-Time | 4/5 |
| First-time player on Rookie | All-Star tier; first ten minutes rated 7/10 for clarity | 4/5 |

**Fixed after G6**
- DPOY, final tune: the player's defense rating tops out at 99 like everyone else's, and voters tire of repeat winners (each past DPOY costs a little, for league stars too). The G6 center won 11 before this. Measured over 30 careers each: an all-in rim protector averages 2 a career (most 0 to 4, rarely up to 9), a balanced build about 0.4, and nobody wins in their first two seasons.
- Every MVP gets a banner ("MVP #3"), and a title plus MVP season says both ("Ring #2 and MVP").
- The menu no longer shows "-203 GTP, 210 in cart" after perks were paid for.
- Graying is even across hair colors (black hair now shows salt-and-pepper at 36, auburn no longer goes fully silver), and headwear keeps the color it had when young.
- The Final Buzzer card is a full card: big aged portrait, age and seasons, why it ended, and points, rings, All-Stars and MVPs. The Final Season window says up front that it is your last season.
- The plaque wears your main team's colors (most seasons, title years count double), not your last team's.
- A jersey is retired for stars, not for a 5-point bench player who caught one ring.
- Whole Career pauses before your final season if you have 10+ points banked, and the hub shows "This is your final season: spend your points now".
- The college-title highlight comes from the season you actually won it (it used to trust a badge and say "age 18").
- A 30-minute starter is no longer described as "in a small role".
- The Stopper Job event only goes to players who can defend.
- No two classmates share a last name.
- How to play explains that Rookie earns no GTP or gems.

### Round G7 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Art director, sixth pass | Rookie career to the plaque | 3/5 |
| Pro rim protector, all-in defense | All-Star tier (6 DPOYs, 2 rings) | n/a |
| Pro shooting guard, Whole Career pacing | Champion Role Player (4 rings, 25,855 points, **zero All-Stars**) | 4/5 |

**Fixed after G7**
- **All-Star wall:** a 25-point scorer (4th in the league, 54 wins) finished 27th in voting because the vote leans on rebounds and assists. Now the league's top 5 scorers and the Defensive Player of the Year always make the team (the same rules for league players). The card says how you got in ("in as a top-5 scorer"). This lets scorers and defensive bigs reach the tiers that need All-Star seasons; odds are being rechecked.
- Ninja headband and pre-wrap keep their colors at every age (they are picked against your natural hair color).
- Graying softened a little more at 32 to 37 (testers went back and forth: one said too little on black hair, the next too much; this is the middle).
- The creator toggle says "At 18" and "At 36" (the "Now" label made people expect age 14).
- Only one spend prompt shows at a time (the final-season nudge doubled up with the Whole Career pause).
- No stray dot after "Hype 0" in high school.
- "Sit a couple of weeks" warns that awards need 65 games.
- Rookie of the Year gets its own banner.
- The season card's role label (Starter / Bench rotation) now matches the role line.

**Seen but not changed (noted for you)**
- Team colors work, but nobody notices them when the team color happens to match your own creator kit. The team identity proposal (fixed colors plus a tag and crest) would fix this.
- Pacing: Whole Career takes 3 to 5 taps a season. One tester said that felt right; others wanted fewer. The phase 3 "stop budget" proposal covers this.
- Position labels follow height (a 6'4" Sharpshooter is listed PG).
- The Rim Protector premade projected as "Glass Cleaner" at its own default body. *Fixed:* its skill mix now leans on blocks and interior defense, and it reads as Rim Protector on every body 6'8" and up.

### Round G8 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Art director, seventh pass | Rookie career (3 rings) to the plaque | 4/5 |
| Pro scorer (Sharpshooter) | Hall of Famer (3 rings, 6 All-Stars); career 2 had 6 scoring titles by 31 | n/a |
| Hall of Fame two-way wing | Solid Starter (1 ring); "no hard bugs" | 4/5 |

**Confirmed working:** the top-5 scorer All-Star rule (every top-5 season made it, labeled "in as a top-5 scorer"), the creator layout fixes, At 18 / At 36, headbands on gray hair, Next Decision stopping on a title season.

**Fixed after G8**
- Recruiting stars are now drawn as small gold vector stars with a readable label ("3 of 5 stars"). Two testers reported a dangling dot after "Hype"; the stars were showing as icons, but screen readers and text views saw nothing there.
- Fans weigh scoring in All-Star votes (a scoring champion on a 58-win team was voted 18th; a +1 Star Power shoe deal moved him to 4th). Zero-sum across the league; odds rechecked.
- Season cards show your Defensive Player of the Year voting rank when you are top 8 and did not win.
- Steals and blocks never read a flat 0.0 for a rotation player (an aging big showed 0.0 BPG).
- Retire now warns that your unspent points are lost.
- The Final Buzzer card and the plaque show the same jersey (your main team).
- Headwear stays visible against both your natural and your graying hair.
- Sixth Man of the Year only goes to players labeled as coming off the bench.
- The spend hint names the right button ("Tap the button below").

**Design notes from G8 (not changed)**
- A pure scorer stalls well below 350 without MVPs and rings (6 scoring titles by 31, best MVP finish 5th at 37.8 points a game). Worth discussing in the balance pass: more weight for scoring titles, or MVP voting that rewards a scoring champion on a winning team.
- "True ceiling" only appears at retirement, so a player can't tell early that GOAT is out of reach for a build. That is by design (hidden stats stay hidden); flagging only because testers keep asking.
- Free-agency cards show the OVR from when the offers were made, even if you spend points before choosing.

### Round G9 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| First-time player on Rookie | Top 10 All-Time (5 rings, 13 All-Stars), **16 points short of 30,000**; first ten minutes 8/10 | 4/5 |
| Pro Floor General | Solid Starter; OVR peaked at 78 with every core skill at 99 | n/a |
| Pro Post Bully | Top 10 All-Time (6 rings, 12 All-Stars), **50 points short of 30,000** | 4/5 |

**Fixed after G9**
- **"While you simmed":** when Next Decision plays seasons without stopping, a card lists each one (team, record, points/rebounds/assists, playoff result, awards). Title and MVP seasons still open their full story.
- **Milestone watch:** Retire now and the farewell tour options say when you are within 3,000 points of 10k/20k/30k/40k ("You are 1,240 points from 30,000"). Two testers missed 30,000 by 16 and 50 points.
- No viral videos or social media storms in the 80s, 90s and 2000s. Those eras get highlight-show and barbershop versions; the mixtape becomes a "highlight tape".
- "1 career" (not "1 careers") in the menu.

**Biggest open issue (needs your call): OVR ceilings differ by style.** With a build's top 8 to 12 skills at 99 and everything else at 60:

| Style | OVR |
|---|---|
| Sharpshooter, Slasher, Two-Way Wing | 89–90 |
| Floor General, Post Bully | 84 |
| Rim Protector | 83 |

So point guards and bigs hit a lower ceiling for the same effort. That explains the "centers plateau at 82–84" report from earlier tonight and the Floor General stuck at 78. Fixing it means changing the OVR formula, which moves every odds number, so I left it for a daytime balance pass.

**Also seen, not changed**
- Class rank drops after each college season because new points are unspent (#4 to #12), then jumps back when you spend.
- Contenders still sometimes collapse the year you join (a 52-30 Finals team went 33-49), and a 62-20 team lost in round 1 twice. This was already on the open list.
- The rival won MVP while your teammate; pure scorers rarely win MVP.

### Round G10 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Rookie wing, Next Decision pacing | **THE GOAT on career 2** (score 506, 10 MVPs, 3 rings, 38,055 points) | 4/5 |
| Pro Slasher | Top 10 All-Time (5 rings, 1 MVP, 35,843 points) | n/a |
| Art director, eighth pass | 17-season Rookie career to the plaque | 4/5 |

**Confirmed working:** Next Decision plus the While you simmed card ("a good loop"), the milestone note on Retire now, drawn recruiting stars, same main-team jersey on the Final Buzzer and plaque, beards growing in at 17.

**Fixed after G10**
- **Accidental choices:** two testers tapped Next and hit the risky first summer option that appeared under their finger. Choices now ignore taps for half a second after a story step changes.
- **Headwear color, final call:** testers disagreed (color changes with age vs. disappears on gray). It now keeps one color for life, picked against your natural hair, and its outline keeps it visible on gray.
- The creator's preview card shrinks to a small strip once you scroll into the options, so it no longer hides the grid.
- The plaque labels its badges "Best badges of your career" (it showed Gold for a badge that later dropped to Silver).
- While you simmed shows each season's OVR change.
- ~~MVP voters rarely reward a losing team~~ (tried, then reverted after the odds check: it pushed Pro casual down to 0.5% and smart up to 6.6%). Left for the balance pass.
- The "Is It Time?" prompt shows the milestone note and your unspent points.

**Seen, not changed**
- MVP for pure scorers is the main wall on Pro (7 scoring titles, usually 2nd to 5th in MVP). This pulls the other way from the losing-team fix above; both belong in the balance pass.
- Season goals change after a trade; "Cut your minutes" did not visibly change minutes; one game-winner listed twice on the plaque; OVR stalls at 93 for years with hundreds of points banked.

### Round G11 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Hall of Fame Slasher | Hall of Famer (2 rings, 6 All-Stars); Next Decision stopped on both title seasons as intended | n/a |
| Pro Two-Way Wing, Whole Career | All-Star tier (2 rings, 1 DPOY) | n/a |
| Menus and screens explorer (new) | Visited every menu and all six Profile tabs; one Daily Build career | 3/5 |

**Fixed after G11**
- **Hall of Builds on a phone:** the table only showed two columns (tier, score and the rest were off screen). It is now a stacked list: name, style and tier on top; difficulty, score, PPG, rings, MVPs and pick below; highlights under that.
- "Reset all progress" is styled as a dangerous action; the progress line says "1 career".
- One name everywhere: GTP Store (one card said GTP Shop).
- The Daily Build says it earns GTP but no gems (a tester finished a Daily career with 0 gems and no explanation).
- After a trade or signing, the goals card says "New team, new goals" (goals changed silently before).
- "Race for the Top Seed" only fires for a team that won 50+ last season (it fired for a 38-44 team).
- First scoring title and first Defensive Player of the Year get banners.
- League headlines never show only a last name you share with a league player (an "Ellison MVP" headline was a teammate).

**Seen, not changed (menus explorer's list, for a UI pass)**
- No Profile entry in the side menu; GTP Store and How to play disappear from it once a career starts.
- The end-of-career recap is easy to tap past and can't be reopened; Hall of Builds rows can't be tapped to reopen an old career.
- Profile: Timeline leaves out the draft and major injuries; Traits doesn't mark your two locked traits; Badges lists an already-reached badge under "Close to"; the Skills tip suggests raising a skill that is already 99.
- Achievements and Badge Book share an icon; some perks have icons and some don't.
- The Daily Build can be replayed any number of times a day; turning it on hides perks already in your cart without a message.
- Pacing in Whole Career is still 4 to 7 taps a season (one offseason stopped 4 times in a row).

### Round G12 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Pro rim protector, Whole Career | **THE GOAT on career 3** (5 rings, 3 MVPs, several DPOYs, score 350); earlier careers Hall of Famer and Top 10 | 4/5 |
| First-time player on Rookie | Top 10 All-Time (3 rings, 11 All-Stars, 3 scoring titles) | 4/5 |
| Menus explorer, second pass | All four menu fixes confirmed | 3/5 |

**Fixed after G12**
- **Accidental choices, part 2:** in Whole Career a new decision could pop up right where Next was (it turned down a superteam offer by accident). Every newly shown decision now ignores taps for half a second, not only story steps.
- The side menu during a career has "Your profile" and "How to play".
- Rookie of the Year looks at the whole stat line, not points alone (a #1 pick who was already an All-Star and DPOY lost to a 15-point scorer).
- DPOY only carries a player onto the All-Star team if he also scores 10+ a game (a 6.8-point big made it from 43rd in voting).
- The Daily Build card says your cart went back to your GTP; the difficulty card says the Daily earns no gems.
- The reset warning lists gems (including bought gems) and equipment; its two buttons no longer touch.
- Achievements and the Badge Book have different icons.
- Only one spend prompt on the Whole Career cut-risk pause.

**Needs your call**
- **Reset all progress erases purchased gems and equipment.** The warning now says so, but you may prefer to keep bought gems through a reset (App Store reviewers and players can treat losing purchases as a problem).
- A late-career ring as a 12-minute bench player counts in full toward the GOAT score; one tester suggested ring credit scale with role.

### Round G13 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Rookie point guard, tap-guard check | Perennial All-Star (4 All-Stars, no rings); the tap guard never misfired | 3/5 |
| Pro pure scorers (two careers) | Hall of Famer (6 scoring titles), then Top 10 All-Time (7 rings, 8 scoring titles, score 318), **0 MVPs** | n/a |
| Creator and menus, final pass | Every menu plus a 16-season Pro career | 4/5 |

**Fixed after G13**
- **Tie-game final plays:** one of tonight's new free-throw lines said "You split the free throws. Not enough." in a tied game, where a split wins; it is replaced. A missed final shot with the score tied now says the game goes to overtime and the other team pulls away, instead of reading like an outright loss.
- **Daily Build and the perk cart:** turning the Daily on sets your cart aside, and turning it off gives it back (it used to empty the cart silently).
- "Ask Out?" fires at most once every three seasons (it came up in back-to-back seasons with the same text).
- "You maxed out your tools" no longer appears when you retire with 40+ unspent points.
- Achievements uses the trophy icon on its own page too.
- The GTP Store entry on the career recap says it leaves the recap.
- Undo clears the old "raised X" message on the spend screen.

**The pure-scorer MVP wall, confirmed again:** 14 scoring titles across two careers, several on 63- to 70-win teams, and no MVP. In one career the player finished 2nd four times behind a teammate with 8 MVPs. This is the single biggest balance question for the next pass.

### Round G14 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Hall of Fame Floor General | All-Star tier (4 rings, 2 All-Stars); Next Decision stopped on every title season | 4/5 |
| Pro rim protector | Top 10 All-Time (8 DPOYs, 7 rings, 11 All-Stars); called the big-man last-shot plays "the best part of the game" | n/a |
| First-time player, Whole Career | **THE GOAT on career 2** (6 MVPs, 3 rings, 37,249 points, score 412) | 4/5 |

**Fixed after G14**
- **Kept playstyle, consistent everywhere:** after you choose to stay a Rim Protector, the spend screen says "Your style: Rim Protector" (and notes what your skills currently lean toward), and later prompts ask about leaving Rim Protector, never about an identity you already turned down.
- No playstyle-change prompt in a farewell season or after 32 (one promised "untapped potential" at 34).
- **Free-agency fit text:** three testers saw "You fill their biggest need: Shooting" with a weak shooting average. Fit uses your two best skills in a group, while the screen shows the group average; the text now only claims a fit when the average agrees (offers themselves unchanged).
- Team labels show last season's record ("Contender (56-26 last season)"), since testers kept joining "Contenders" that missed the playoffs.
- League award tiles show "M. Duvall" instead of "DUVALL" (several players shared a surname).
- No Request-a-trade card right after a trade.
- A stale "you have 0 points" message from college no longer shows on the pro spend screen.

### Round G15 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Daily Build | Perennial All-Star (5 rings); Daily rules "mostly clear" | n/a |
| Pro Post Bully | Hall of Famer (33,036 points, ROY, 3 rings, 7 All-Stars) | 4/5 |
| Art director, ninth pass | 16-season Rookie career to the plaque; gentle graying, stable headwear and the Final Buzzer confirmed | 4/5 |

**Fixed after G15**
- The creator preview shrinks as soon as it pins to the top (it only shrank near the bottom of the page).
- A new rival never shares your last name.
- The plaque story only blames injuries when there were some (a career that ended for lack of a contract said "injuries and bad luck").
- With the Daily on, the difficulty card says "Earns GTP and achievements" (it still said gems).
- Final-play skill tags name every skill that feeds the odds ("your Dunk and Vertical are low", not "your Dunk is low" with Dunk at 86). Post-ups use Post Moves and Strength together, which is why a 99 post scorer with low Strength still saw "Fair odds".
- How to play, opened mid-career, ends with "Back to your career" instead of "Let's build".

**Seen, not changed**
- All-Star voting still lags for high scorers outside the top 5 (28.2 points, 9th in scoring, voted 37th).
- Trades and midseason moments can be absent for many seasons in a row, then cluster.
- The league's surname pool is small (four players with the same surname in one top 10).
- A few story lines repeat in back-to-back seasons (badge "fades away"), and the season-high line sat at exactly 38 points for several early seasons.

### Round G16 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Rookie wing explorer | Top 10 All-Time (4 rings, 8 All-Stars, 1 DPOY, 2 scoring titles, no MVP) | n/a |
| Pro Slasher | First-ballot Hall of Famer (4 rings, 1 Finals MVP, 7 All-Stars) | n/a |
| Hall of Fame rim protector | Top 10 All-Time (3 rings, 2 Finals MVPs, 7 DPOYs, no MVP); Next Decision "worked as intended" | n/a |

**Fixed after G16**
- Escape closes the side menu, a menu page, the How to play guide, or the profile.
- The Legacy card's last step reads "THE GOAT (and #1 in the GOAT debate)", so the second condition is no longer small print.
- The plaque shows a scoring-title chip (up to five chips now).

**Explained, not changed**
- "OVR 69 to 68" in a season recap while the header shows 69 (reported three times): the recap records your OVR at the end of the season, and summer choices and training change it before you look at the header. A one-line "after the summer" note on the header would remove the confusion.
- The #1 legend in the GOAT debate is always exactly 345: the 10 legends are a fixed ladder (345, 323, 301 ...), so the bar is identical every career. A little random spread (say 335 to 355) would make each league's GOAT debate feel different without changing the odds much.

### Round G17 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Pro Two-Way Wing, Next Decision | All-Star tier (1 ring, 1 DPOY); OVR stalled around 80–82 | n/a |
| Rookie Post Bully | Hall of Famer pace (10 All-Stars, 2 scoring titles, 1 DPOY) at 33 | n/a |
| First-time player on Pro | Top 10 All-Time (#1 pick, 6 rings, 11 All-Stars, 30,714 points, 0 MVPs) | 4/5 |

**Fixed after G17**
- **Whole Career and banked points:** it now pauses once when you have 60+ points banked (at most every three seasons), so points don't pile up to 127 unspent.
- Switching to Next Decision clears the "Whole Career paused" banner.
- The All-Star line says "(voted in)" when you made it on votes (a bare "16th" next to All-Star read like a miss).
- The league's top-players table shows a RINGS header (a ring emoji there had no icon and showed blank).
- The plaque counts multiple college titles ("2× college national champion").
- The shoe deal says "Star Power is already 5/5: more hype instead" when it is maxed, and gives the hype.

**Seen, not changed**
- Final plays come up in nearly every playoff run late in a career and stop feeling special. The content lead's "at most 2 final plays per playoffs" idea fits, but it changes how often you win series, so it belongs in the balance pass.
- The pure-scorer MVP wall again (two scoring titles at 34 and 35 PPG on 56- and 57-win teams, best MVP finish 4th).
- Every random name used the same surname in this tester's runs. That comes from the test harness's fixed random seed, not real play.

### Round G18 (3 testers, final round)

| Tester | Result | Fun |
|---|---|---|
| Rookie Slasher, Whole Career pacing | **THE GOAT on career 1** (score 436, 6 rings, 4 MVPs, 37,998 points); the new 60-point pause worked | 4/5 |
| Hall of Fame Two-Way Wing | 4 rings by 29; Next Decision stopped for every title season | 4/5 |
| Art and menus, very last pass | Profile and How to play in the career menu and the new reset warning confirmed | n/a |

**Fixed after G18**
- **Accidental risky summers:** testers kept committing to a risky summer by tapping through, because the high-risk option sat where Next usually is. Summer options are now listed safe first, risky last (same dice, so the same options appear).
- The difficulty note starts with the difficulty's name ("Hall of Fame: The biggest challenge..."). Three testers read the Pro text before tapping Hall of Fame and reported the wrong numbers.
- The "Is It Time?" prompt shows your current OVR after you spend points (it kept the old number).
- The Whole Career pause card says "Points spent" once you are below 10, and shows a single Spend button.
- Achievements say they unlock when your career ends (a tester hit a Game 7 winner and saw it still locked mid-career).
- Achievements uses the trophy on its own page; Ice in your veins and Iron body perks have icons; locked difficulty buttons look disabled during the Daily Build.

**Seen, not changed**
- Whole Career still stops 3 to 4 times a season (recap, summer, career moment, midseason, free agency). Testers consistently say it plays like Next Decision. The phase 3 "stop budget" proposal is the fix.
- Free-agency offers show your OVR from when the offers were made (you can raise it before choosing).
- Teaming up with your rival can push him to #1 in the GOAT debate, with no warning.

### Round G19 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| First-time player on Rookie | 2nd all-time (score 482, 11 rings, 4 MVPs), 8 points behind the retired rival | 4/5 |
| Pro Sharpshooter | 86 OVR and 3 All-Stars by season 6 (OVR does keep climbing past 84 for wings) | 4/5 |
| Art and menus | No crashes; menus, Profile, Badge Book and timeline "look clean" | n/a |

**Fixed after G19**
- The reset warning lists the Badge Book too, and reads as a proper list.
- The GTP perk "Ice in your veins" is renamed "Cold-blooded" (it sounded like the "Ice in the Veins" achievement).
- The Daily Build card names today's era.

**Not a bug (checked):** testers in four rounds said the Rivalry, GOAT debate and League sections "can't be opened". I checked in a browser: every main section header is tappable. The test harness was also listing the sub-sections inside closed sections as tappable, and those are hidden until you open the parent.

**Seen, not changed**
- Teaming up with your rival can push him past you in the GOAT debate (it cost this tester THE GOAT by 8 points), and late ring chases win titles easily. The team-up card now warns "Every ring you win together counts for his legacy too"; the balance side is for the balance pass.
- Low-usage seasons can still win MVP on a great team (12.3 points in 26 minutes).
- "Top 10 All-Time" undersells finishing 2nd ever; a "#2 all-time" line on the plaque would land better.

### Round G20 (3 testers, last round)

| Tester | Result | Fun |
|---|---|---|
| First-time player on Pro | Drafted #6, starter at 29; "the highlight was draft night" | 4/5 |
| Hall of Fame center | 2 DPOYs, 2 All-Stars by 29 after four years on the bench | 4/5 |
| Rookie Slasher, Whole Career | **THE GOAT on career 1** (score 439, 10 rings, 3 MVPs, 14 All-Stars); the 60-point pause worked | 4/5 |

**Fixed after G20**
- No "Ask Out?" trade moment in the same offseason as free agency (it came right after a re-signing).
- A GOAT career's highlights say "#1 in the all-time GOAT debate" instead of an older "top 5 (3rd)" line, and only the latest GOAT-debate milestone is kept.

**Seen, not changed**
- Joining your rival can let him win MVP most years and lead the GOAT debate (the team-up card now warns about the legacy side).
- "Carry the load" cut minutes in one case (36 to 26); free-agency cards show the OVR from when offers were made.

### Round G21 (3 testers, final round before 8 AM)

| Tester | Result | Fun |
|---|---|---|
| Pro rim protector | 1 All-Star and 1 DPOY by 26; DPOY "felt earned, not automatic" | n/a |
| Pro Floor General | Solid Starter (99 Passing, Three-Point, Mid-Range and IQ, about 12 PPG); career 2 won a title with Finals Game 6 and 7 winners | n/a |
| Daily Build | Season 5 when stopped; the Daily rules were clear on the build screen | 3/5 |

**Fixed after G21**
- With a kept style, the "lean into" hint points at your kept style (it told a kept Rim Protector to raise rebounding).
- No "Trade Talks: they're rebuilding" moment right after you were traded to a contender.
- "Red-Hot Start" no longer claims you are top five in scoring.
- Choosing Sim Season clears an old Whole Career banner.
- A free-agency card with low interest no longer claims "they know you and want to keep you".
- A college season that missed the tournament no longer names you conference tournament MVP (now first-team all-conference).

**Seen, not changed**
- Point guards with elite passing still miss All-Star teams (the OVR-ceiling and scorer-voting questions above).
- Injuries can keep a defender under the 65-game line in most seasons, which decides DPOY more than defense does.
- Spend buttons change their step size near a cap ("by 10" becomes "by 2"), and cost per point rises above 80 without the button saying so. Both are covered by the phase 3 spend-preview proposal.

### Round G22 (3 testers)

| Tester | Result | Fun |
|---|---|---|
| Rookie first-timer | Hall of Famer pace at 33 (2 rings, 7 All-Stars); first ten minutes 8/10 | 4/5 |
| Pro rim protector | 3 straight DPOYs and 3 All-Stars by 24; "DPOY works for a rim protector" | n/a |
| Hall of Fame Sharpshooter | Top 10 All-Time (8 rings, 2 Finals MVPs, 35,609 points, 0 MVPs); Next Decision showed every title season | n/a |

**Fixed after G22**
- When you finish top 8 in DPOY voting and lose, the season card names the winner.

**Checked, not a game bug:** "Close menu left the menu open" comes from the close animation's 230 ms timer, which the test harness's frame-stepped clock may not advance; it closes normally on a device.

### Round G23 (3 testers, last round of the night)

| Tester | Result | Fun |
|---|---|---|
| Pro Slasher | 1 ring by 28 after a trade and a free-agent recruit | n/a |
| Rookie rim protector | 80 OVR at 27; the GOAT race line and spend screen read clearly | n/a |
| Creator final check | Every creator fix confirmed in game; Rookie career to Hall of Famer | 4/5 |

**Fixed after G23**
- **Creator strip, last bug:** shrinking the preview at the very bottom of the Uniform tab made the page shorter than the scroll position, so the app jumped and a black band appeared. The strip now keeps the page height the same, and it keeps the At 18 / At 36 toggle visible.
- The Final Buzzer portrait smiles instead of keeping a shouting expression.
- The Final Season card hides "points to spend" lines once the career is over.
- "Stay an Athletic Finisher" (was "Stay a Athletic Finisher").
- The bonus line says "defensive stats" when steals and blocks earned it (it said "big season" for a 7-point bench year).
- When you finish top 8 in DPOY voting and lose, the season card names the winner (from G22).

### Round G24 (3 testers, final round)

| Tester | Result | Fun |
|---|---|---|
| Pro Two-Way Wing | Stopped at season 5 after a major injury (69 OVR) | 3/5 |
| Hall of Fame Floor General | A title in season 2 (Next Decision showed the ring story); starter at 77 OVR after 8 seasons | 4/5 |
| First-time player on Rookie | **THE GOAT on career 1** (score 450, 7 rings, 6 MVPs) in about 20 real minutes | 4/5 |

**Fixed after G24**
- **Spend screen, buttons moving under your finger:** after a raise, an Undo row appeared above the skills and pushed the buttons down (a tap meant for "Raise by 10" hit "Max out"). Undo now only appears below the list.
- "A five-star freshman takes your shots" no longer fires in your own freshman year.

**Checked, not a bug:** "Hall of Fame selected but the setup text describes Pro" (reported again): in a browser, picking Hall of Fame shows "Hall of Fame: ... 120 skill points, start around 45 OVR". The tester read the card before the switch.

**Last word on Rookie:** testers reached THE GOAT on Rookie eight times tonight, often on the first career, and several called it too easy. The simulated odds (9.5% casual, 38% smart) are on your target, so this is about how good real players are at the game, not a tuning error. If Rookie should feel harder for engaged players, the smart-player odds are the number to look at.

### Round G25 (3 testers, 20-minute sessions to finish by 8 AM)

| Tester | Result | Fun |
|---|---|---|
| Pro Floor General | Title in season 3 on three last-play calls (a Game 7 stop, then Finals Game 6 and 7 winners); 0 All-Stars at 10–11 assists | n/a |
| Rookie Post Bully | 81 OVR at 23; the GOAT race line and spend math checked out | 3/5 |
| Menus check | Distinct menu icons, Your profile / How to play, and the reset warning confirmed | 3/5 |

**Fixed after G25**
- Iron body and Injury insurance perks have different icons.

**Seen, not changed**
- Pass-first point guards (10+ assists, 11–16 points) never make All-Star teams; same root as the OVR-ceiling and award questions in "Decisions for you".
- The Undo button can sit half under the bottom bar in the season story's spend step on some screens.
- The Undo label names only the last skill while it can refund several quick taps on the same group.

## GOAT odds (checked overnight)

Simulated 1,500 careers per row with the balance harness. "Casual" spends points at random; "smart" spends them well.

Final build (after round G18, 1,500 careers per row):

| Difficulty | Casual GOAT | Smart GOAT | Your target |
|---|---|---|---|
| Rookie | 9.5% | 38.0% | ~9–10% casual |
| Pro | 0.6% | 5.1% | ~1% casual, 4.3–5% smart |
| Hall of Fame | 0.3% | 2.7% | ~0.5% casual, 2–2.5% smart |

One last catch from this check: after the safe-first summer reorder, a skipped high-school summer would have auto-picked the risky option (it used to take the last one, which had been safe). That pushed Rookie casual to 11.1% in the first final run. It now always takes a safe option, and Rookie came back to 9.5%.

Identical runs swing by about ±0.8 points on the smart column, so Pro smart is somewhere around 5.5% and Hall of Fame smart around 2.6%: both slightly above target, casual slightly below. A larger Pro run (5,000 careers each way) then pinned it down: **casual 0.7% (±0.1), smart 5.5% (±0.3)**. Both are just outside your targets, in opposite directions, so no single setting fixes both: the casual/smart gap itself would need a design change (for example, making smart spending matter a little less, or giving casual players more help from the spend screen).

- The All-Star changes (top-5 scorers and the DPOY always make the team) pushed Rookie casual up to 11%. To compensate, Rookie pro-season points went from .45 to .40, and Hall of Fame from .75 to .77 (between the two settings tested). Pro is unchanged.
- Run-to-run noise is about ±0.5 points at these sample sizes.

## Phase 2: Characters and creator

**New creator (Look step)**
- A live preview card at the top: your player, name, number and look, with an At 18 / At 36 toggle to see how you will age; it shrinks to a small strip while you scroll the options.
- Options grouped into Face, Hair, Gear and Uniform tabs.
- Color swatches for skin, hair color, jersey and trim.
- Picture thumbnails of YOUR player for hairstyles, facial hair, expressions, headwear, arms, jewelry and mouthguards.
- Jersey number box.

**Character art polish**
- Arena spotlight from above, faint arena lights, and a vignette that grounds the player.
- Soft key light on the face and a rim light on the cheek.
- Fabric shading on the jersey.
- Condensed sports font for the jersey number.

**After the art director reviews (G2 and G3)**
- Realistic aging: a little gray at the temples from 32, salt-and-pepper from 35, full gray and wrinkles from 38. Graying drains the color first, so auburn hair turns silver instead of pink. Dyed colors stay.
- No full beards on 14-year-olds (stubble at most until 17).
- Bright jerseys get a deeper background so the player stands out.
- You wear your school's colors in college and your team's colors as a pro (header, season cards, draft card, plaque). The creator keeps your own kit for high school.
- Random look never picks a trim that matches the jersey.
- Creator: no scroll box inside the hair grid, a bigger preview, uniform pictures for the jersey styles, hair pictures shown without hats, mouthguards or shades, "Preview at 36", a typed jersey number box styled for the dark screens, and your player shown on the Body step.

**After the art director reviews (G4 and G5)**
- Title, MVP and first All-Star banners show your player grinning (or fired up for MVP) in that season's team colors and age.
- Pro teams never wear a plain white kit (it read as an unstyled default).
- Gentler graying: 36 now reads salt-and-pepper, not 60. A white headband on gray hair takes the jersey color so it never disappears.
- Goggles and the face mask never stack with "Too cool" shades.
- Arm and uniform pictures are wide strips, three to a row, so sleeves and ink read. Mouthguard pictures hide the beard so the four options differ.
- The ten jersey colors sit in two even rows of five. Swatches keep their size but have a 44 px tap area. No browser spinner arrows on the number box.
- The creator says facial hair grows in at 17 (it shows as stubble in high school).

**After the later reviews (G6 to G19)**
- Graying tuned three times to land in the middle: 36 reads salt-and-pepper on every hair color (black hair shows silver, auburn no longer goes fully gray), full gray from 38.
- Headwear keeps one color for life (testers disagreed on whether it should change with age); its outline keeps it visible on gray hair.
- The Final Buzzer card: a big aged portrait in your main team's colors, age and seasons, why it ended, and your four career numbers. The plaque wears the same main-team jersey.
- The creator preview shrinks to a small strip as soon as it pins to the top while you scroll.
- The toggle reads "At 18" and "At 36"; ten jersey colors sit in two rows of five; arm and uniform pictures are three to a row; mouthguard pictures hide the beard.
- Recruiting stars are drawn as vector stars with a readable label.
- The Rim Protector premade reads as a Rim Protector on every 7-foot body.

**Still open for the art pass**
- Season cards have no portrait (testers asked in nearly every art round).
- Team identity: team colors only show on your jersey, so nobody notices them when they match your own kit. Fixed team kits, a three-letter tag and a simple original crest are the phase 3 proposal for this.
- The darkest skin tone loses some contrast on brows and mouth lines in small thumbnails.

## Phase 3: three leads discuss what to add next

Three high-effort agents each wrote a proposal (UI and beauty, content and expansions, systems and improvements), then read each other's and argued it out. Full documents are in `docs/phase3/`.

**Where all three agree (joint top 10, most fun per hour first)**
1. **Clutch 2.0, text half.** More lines, no repeats, Game 6 and 7 always different. *Shipped tonight.* The other half (free-throw, inbound, overtime and road Game 7 situations, big-man plays everywhere) is next.
2. **Legacy card with near goals.** A bar to the next tier, a ladder ending in "350 and #1 in the debate", a named legend to pass next. *The next-tier bar shipped tonight;* the ladder and "man to beat" chip are left.
3. **No silent endings.** *The final season story and the Final Buzzer card shipped tonight.* Left: a warning one season ahead ("next season could be your last, spend your 87 points"), and an "Is it time?" prompt instead of the silent 30% chance of retiring when OVR drops below 61.
4. **Spend screen previews.** Every +, +10 and Max shows what it does ("OVR +1", "Post Scorer fit +3") before you tap; Max always takes two taps. Fixes the most common complaint ("my points vanished"). About 4 hours.
5. **Big Moment screens.** One full-screen celebration per peak season (ring, MVP, game-winner, draft pick, GOAT crowned), built on tonight's banner portrait and haptics, skippable, never an extra tap in Whole Career.
6. **One stop budget for pacing.** Whole Career testers count 3 to 6 taps a season. Cap optional stops per offseason, let extra moments wait a year, and add a "While you simmed" row of season tiles.
7. **Final Chapter, the rest.** A "How do you go out?" last home game, a Hall of Fame presenter, a one-tap life-after-basketball epilogue, jersey banners, highlights in order.
8. **Daily Build 2.0.** A daily twist that only adds limits (never free stats or a draft slot), a streak with cosmetic rewards, a Wordle-style share line.
9. **Choices show what they did.** The season card prints the real size of each choice ("36 to 32 MPG, about 2 fewer points a night"). Never shows hidden injury or aging numbers.
10. **A plaque worth sharing.** Frames by tier (wood to diamond, earned only, never sold), a big GOAT score, the final-team uniform, and a Share button.

**Next in line:** team identity (fixed colors, a three-letter tag and a simple original crest for all 30 teams). It's big, but it's the largest step toward looking like a real sports game.

**Bigger expansions (paid-pack candidates):** Dynasty Mode (your son enters the league 20 years later, story only, nothing passes down), Scenario Challenges with a weekly challenge, Era Packs, Legends Mode, and a coaching career after retirement.

**What they argued against**
- **"Clutch prep" with points:** all three dropped it. Buying better odds on final plays takes the magic out of the favorite moment.
- **Selling plaque frames:** dropped. The frame must show the tier you earned, so a bought gold or diamond look would cheapen THE GOAT. Backgrounds and celebration styles can still be sold for gems.
- **Odds as "3 in 10":** reads like a casino and edges toward revealing hidden stats. Keep word labels, but give each one fixed meaning and show both outcomes.
- **Career screen tabs:** ship the hero header first and skip the tabs; tabs would hide the rival and league news.

**Rules for all of it:** anything that changes GOAT odds (MVP voter fatigue, contract roles, veteran points, clutch odds, honest risk labels) goes into one balance pass, checked once against your targets. Before any balance or refactor work, record 200 fixed-seed careers per difficulty as a regression baseline.

**Two risks no tester would find (systems lead)**
- **iOS save safety:** the in-progress career is not copied to the phone's native storage, so an iOS storage purge would wipe a 30-minute career. The save is also 710 to 830 KB by career end, mostly 1,000 retired league players kept in full. Recommended: mirror the run at each season end and slim retired players. Not changed tonight because it touches the native save path.
- **The meter and tier code disagreed** on whether THE GOAT needs 5 All-Stars. *Fixed tonight* (the meter now follows the tier rule).


## Afternoon: OVR rework (Nov 8)

You asked for two things: any build can reach 99, and players start low and climb. Both are in. They are committed locally and not pushed.

### What changed
- **Any style can reach 99.** OVR is now the better of two ratings: the old all-around rating, and a new core rating built on your style's 7 most important skills. Get those 7 to 99 and the rest of your game to about 72, and you are a 99 in that style. This holds for all 13 styles, and a test checks it. Below the top, nothing changes.
- **Your style can change as you spend.** OVR rates you at your best-fitting style. Lean into new skills and the label follows once you have a clear edge, with a message when it happens.
- **You start at 25.** Every skill starts at 25 (it was 40), so you are a 25 before you place a point. Budgets are now 350 (Rookie), 310 (Pro) and 260 (Hall of Fame), which puts average starts at about 50, 45 and 40.
- **The climb makes up the gap.** The hidden ceiling sits higher, and high school and college add a share of the lower start each season. By the draft, players are back where they were on the old build.
- **The projection card has a Road to 99 note.** It lists your 7 core skills with their current values, marks the ones that are as high as they go ("max"), and shows where the rest of your game stands against the 72 bar. Once your core is maxed, it tells you to raise the rest.

### GOAT odds (sims, 2,500 careers each)
| Difficulty | Casual | Smart | Target |
|---|---|---|---|
| Rookie | 9.1% | 33% | ~9–10% casual |
| Pro | 0.4% | 4.9% | ~1% / 4.3–5% |
| Hall of Fame | 0.2% | 2.0% | ~0.5% / 2–2.5% |

Pro casual is a little under target. Raising it would also push Pro smart over 5%.

How often careers reach 99 (600 sims each):

| Difficulty | Reach 99: casual / smart | Reach 90+: casual / smart |
|---|---|---|
| Rookie | 5% / 31% | 55% / 98% |
| Pro | 0.3% / 5.5% | 3% / 27% |
| Hall of Fame | 0% / 3.3% | 1.5% / 12.5% |

### Bugs found and fixed along the way
- New players were created with every skill at 40, whatever the floor was, so the weaker start did nothing at first.
- Penalty floors of 30 would have *raised* a skill sitting at 25. They now stop at 25.
- **Found by the playtesters:** skills could not read below 25 on court. With the new start, any size penalty froze a skill at "Maxed for your build": a guard's Block, a center's Three-Point, a wing's Ball Handle. The floor is now 1, and a test covers the shortest and tallest heights.
- The creator's Max button could push a skill past 99 and waste points. It now stops at 99.

### Playtest round 1 (before the frozen-skill fix)
- **Pro point guard:** went 25 → 57 in the creator → 69 at the draft (#8). Peaked at 78, held back by the frozen skills.
- **Rookie center:** went 25 → 61 → 82 at the draft (#1). Peaked at 97 with 4 rings and 3 MVPs.
- **Hall of Fame wing:** went 25 → 48 → 64 at the draft (#39). Peaked at 77.
- **What all three said:** the creator with +10 and Max felt great, and the style change in the creator was well explained. All three rated it fun 4/5.

### Playtest round 2 (after the fixes)
- **Rookie center:** went 25 → 65 → 95 at the draft (#1). Reached 99 at age 21 and held it, with 4 rings and 5 MVPs. The tester called Rookie far too easy for a min-maxer.
- **Pro point guard:** went 25 → 55 → 67 at the draft (#13). Peaked at 79. The core was maxed by age 23, but the rest of his game sat at about 30 against the 72 bar, and growth stops in the prime years.
- **Hall of Fame wing:** went 25 → 49 → 63 at the draft (#29). Peaked at 80.
- **Confirmed fixed:** frozen skills, the "now" values, and the creator stopping at 99.
- **Found and fixed after this round:**
  - The ✓ tick never showed, because the emoji renderer has no icon for it. The note now says "max".
  - The note said "get these to 99" even for core skills a body tops out below 99, and even after all 7 were done.
  - The creator's lean hint named skills that were already at 99.

### Still open
- At the same OVR, players still score about 3 points a game more than NPCs. This was true before today, and the new build is slightly closer.
- When a summer penalty hits a skill already at 25, the message still says "-3 Three-Point".
- Free agency cards can show your OVR from before you spent that offseason's points.
- A high school growth spurt can cut a skill you already paid to max (Ball Handle 98 → 92).
- One freshman recap said +29 points while 33 arrived in the bank.
- **Your call:** on Pro, 99 is rare (5.5% of smart careers, 0.3% of casual ones). The main block is the "rest of your game at 72" bar, because those skills now start at 25. Making 99 easier to reach would also raise the GOAT odds unless something else tightens.
