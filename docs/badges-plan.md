# Badges, four new skills and a player profile: plan

Status: approved by the owner and built (2026-11-06). Final tuning: badge caps PPG +2, FG% +2, 3P% +2.5, rebounds +10%; Hall of Fame difficulty NABL points 1.15. Author: the Build a GOAT iOS session, for the owner and the game session.

## In short

- **Four new skills** for post players and wings/forwards: **Hook Shot**, **Post Fade**, **Off-Ball Movement**,
  **Lateral Quickness**. 21 skills become 25.
- **29 badges plus the existing story badge.** You earn them from your skills, they level up Bronze → Silver → Gold
  → Platinum, and each one gives a small, visible boost to your stats. All names are our own (none taken from NBA 2K).
- Badges are **earned, never bought**. They are announced in the season story and can **fade with age**.
- A **Player Profile** screen: tap your player during a career to see overview, skills, badges, stats and traits.
  The main career screen keeps only the header, bonus points and the season.

## 1. Four new skills

| Skill | Group | Built for |
|---|---|---|
| **Hook Shot** | Finishing | Post players: the soft hook over a defender |
| **Post Fade** | Shooting | Posts and forwards: the turnaround fadeaway from the block |
| **Off-Ball Movement** | Basketball IQ | Wings: cuts, relocating, running off screens |
| **Lateral Quickness** | Defense | Wings/forwards: sliding with drivers, switching onto anyone |

Groups after the change: Shooting 5, Finishing 4, Playmaking 2, Defense 5, Rebounding 2, Athleticism 4, IQ 3.

**Post Moves gets you the shot; Hook Shot and Post Fade finish it.** Bigs hook, forwards fade, and a post scorer can
lean either way.

**Size and frame** (visible like the others):
- Hook Shot: +1 per inch of height. Strong +3, Lean −2.
- Post Fade: +0.5 per inch (higher release).
- Lateral Quickness: −0.9 per inch (big men slide slower). Lean +4, Strong −4.
- Off-Ball Movement: no size effect.

**What they do in the season sim:**
- Hook Shot and Post Fade count toward Finishing and Shooting, so they feed points like the rest of their groups.
- FG% uses your **best three** of Close Shot, Layup, Dunk and Hook Shot, so guards and bigs each finish their own way.
- Off-Ball Movement adds points and a little FG% without needing Ball Handle (catch-and-shoot, backdoor cuts).
- Lateral Quickness counts toward Defense, so it raises steals and Defensive Player of the Year voting.

**Archetype weights** (added, then each role is renormalized):

| Archetype | New skill weights |
|---|---|
| Post Scorer | Hook 12, Post Fade 8, Off-Ball 2 |
| Stretch Big | Post Fade 6, Off-Ball 5, Hook 2 |
| Rim Protector / Glass Cleaner | Hook 4 / 3, small Off-Ball or Lateral |
| Point Forward | Post Fade 4, Off-Ball 3, Lateral 3, Hook 2 |
| 3-and-D Wing | Lateral 8, Off-Ball 6 |
| Lockdown Defender | Lateral 12, Off-Ball 2 |
| Two-Way Wing | Lateral 5, Off-Ball 4, Post Fade 2, Hook 1 |
| Sharpshooter | Off-Ball 8, Post Fade 2 |
| Slasher / Athletic Finisher | Off-Ball 5, Lateral 2 (Finisher also Hook 2) |
| Shot Creator | Post Fade 4, Off-Ball 2, Lateral 2 |
| Floor General | Lateral 3, Off-Ball 2 |

The calibration (`ARCH_CAL`, `ARCH_OFF`) is measured again with the same method as the archetype rework.

**Points:** 4 more skills spread the same budget thinner. Starting OVR (the owner's targets: about 55 / 50 / 45) and growth speed are
re-measured, and budgets and bonus points get raised if a point now buys noticeably less OVR (likely +10–15%).

**Events:** two new summer options ("Post camp with a retired center": Hook, Post Fade, Post Moves; "Wing defense
lab": Lateral Quickness, Off-Ball Movement). The college "Big-man camp" perk adds Hook Shot.

## 2. Badges

### How you earn them

- Each badge has a **rating**: the average of its skills, using the numbers shown on screen (height and frame
  included). Some badges also need a size range (Skyline Shooter is for 6'9" and up).
- **Tiers:** Bronze at 72, Silver 80, Gold 87, Platinum 94. Starting values, tuned in the balance phase.
- **Tiers open up as your career does.** High school can reach Silver, college Gold, the NABL Platinum. A freshman
  can't be Gold yet; the card says "Gold opens in college".
- **When:** at the start of your career, the moment spending points crosses a line ("🏅 Silver Rainmaker!"), and
  at the end of each season.
- **Fading with age:** at season end, a badge drops one tier if its rating falls 3 below that tier's line. Athletic
  badges fade first and shooting and IQ badges last, so aging players naturally reinvent themselves. The story says
  so: "Age is catching up: Air Raid drops to Silver."
- **Story badges** come from moments, not skills. **Big Shot Maker** (win the college title) stays as it is.
- Badges are pure functions of your skills and size, with no dice. Upgrades and fades happen at fixed points, so
  replays and the Daily Build stay identical.

### The badges

Effects are at Bronze → Platinum (Silver and Gold sit in between).

**Shooting**

| Badge | Skills | Effect |
|---|---|---|
| Rainmaker | Three-Point | 3P% +0.6 → +2.4, PPG +0.3 → +1.2 |
| Catch & Cash | Three-Point + Off-Ball Movement | 3P% +0.4 → +1.6, PPG +0.25 → +1.0 |
| Elbow Operator | Mid-Range | FG% +0.5 → +2.0, PPG +0.3 → +1.2 |
| Silk Fade | Post Fade + Mid-Range | PPG +0.4 → +1.6, FG% +0.3 → +1.2 |
| Skyline Shooter | Three-Point + Mid-Range, 6'9"+ | 3P% +0.4 → +1.6, team offense up (spacing) |
| Free Money | Free Throw | FT% +1.5 → +6, PPG +0.2 → +0.8 |

**Finishing**

| Badge | Skills | Effect |
|---|---|---|
| Contortionist | Layup | FG% +0.5 → +2.0, PPG +0.2 → +0.8 |
| Air Raid | Dunk + Vertical | FG% +0.4 → +1.6, All-Star votes up (highlights) |
| Foul Magnet | Layup or Post Moves + Strength | PPG +0.4 → +1.6 (trips to the line) |
| Hook, Line & Sinker | Hook Shot | FG% +0.5 → +2.0, PPG +0.3 → +1.2 |
| Low-Post Surgeon | Post Moves + best of Hook Shot / Post Fade | PPG +0.4 → +1.6, APG +4% → +16% (kick-outs) |
| Second Helping | Off. Rebound + best of Dunk / Close Shot | RPG +3% → +12%, PPG +0.3 → +1.2 (putbacks) |
| Coast to Coast | Speed + best of Dunk / Layup | PPG +0.35 → +1.4 (transition) |

**Playmaking**

| Badge | Skills | Effect |
|---|---|---|
| Table Setter | Passing + Basketball IQ | APG +5% → +20% |
| Yo-Yo | Ball Handle | Turnovers −5% → −20%, PPG +0.2 → +0.8 |
| Grab-and-Go | Def. Rebound + Ball Handle + Passing | APG +4% → +16%, RPG +2% → +8% |
| Extra Pass | Passing + Off-Ball Movement | APG +3% → +12%, team offense up |

**Defense**

| Badge | Skills | Effect |
|---|---|---|
| Velcro | Perimeter D + Lateral Quickness | DPOY votes up, SPG +3% → +12%, team defense up |
| Lane Pirate | Steal + Basketball IQ | SPG +3.5% → +14% |
| Swat Team | Block + Vertical | BPG +3.5% → +14% |
| No Fly Zone | Block + Interior D, 6'9"+ | BPG +3% → +12%, DPOY votes and team defense up |
| Bouncer | Interior D + Strength | DPOY votes up, RPG +2% → +8%, team defense up |
| Switchblade | Perimeter D + Interior D + Lateral Quickness, 6'5" to 6'10" | DPOY votes and team defense up (guards 1 through 5) |

**Rebounding, body and mind**

| Badge | Skills | Effect |
|---|---|---|
| Vacuum | Def. Rebound + Strength | RPG +3.5% → +14% |
| Mountain Goat | Vertical + best of Off. / Def. Rebound | RPG +3% → +12% (out-leaps bigger players) |
| Bottomless Tank | Stamina | Minutes +0.5 → +2 |
| Metronome | Consistency | Season-to-season swings −15% → −60% (steadier stat lines) |
| Film Junkie | Basketball IQ | Turnovers −3% → −12%, team offense up |
| Backdoor Bandit | Off-Ball Movement + Layup | PPG +0.3 → +1.2, FG% +0.3 → +1.2 |

**Story:** Big Shot Maker (unchanged: better playoff series odds and a Consistency bump).

### Limits

- **Caps on the total from all badges:** PPG +3, FG% +2.5, 3P% +3, FT% +6, rebounds, assists, steals and blocks
  +15%, turnovers −15%, small caps on team strength and DPOY votes. A player with 12 badges is better, not broken.
- **Award votes get their own cap.** Better stats already raise your award score, so the badges' extra DPOY and
  All-Star votes are capped separately and awards don't inflate twice.
- League players get no badges, so every badge stat is pure upside for you. That's why stats are re-checked against
  the league right after the badge engine goes in.
- **Badges apply in high school and college too**, so they show up in recruiting stars and draft stock.
- **Why this fits the league:** today your top-end seasons run 1–2 PPG under league players of the same OVR. Badges are
  tuned to close that gap, not overshoot it, and checked with the game session's `probe2` comparison.

### Signature badges per archetype

The projection card and the profile show three badges that fit what you are becoming:

| Archetype | Signature badges |
|---|---|
| Floor General | Table Setter, Yo-Yo, Film Junkie |
| Shot Creator | Elbow Operator, Yo-Yo, Silk Fade |
| Sharpshooter | Rainmaker, Catch & Cash, Free Money |
| Slasher | Contortionist, Air Raid, Foul Magnet |
| Lockdown Defender | Velcro, Lane Pirate, Bottomless Tank |
| 3-and-D Wing | Catch & Cash, Velcro, Switchblade |
| Two-Way Wing | Switchblade, Backdoor Bandit, Extra Pass |
| Point Forward | Grab-and-Go, Table Setter, Silk Fade |
| Athletic Finisher | Air Raid, Coast to Coast, Second Helping |
| Stretch Big | Skyline Shooter, Silk Fade, Vacuum |
| Post Scorer | Low-Post Surgeon, Hook Line & Sinker, Foul Magnet |
| Glass Cleaner | Vacuum, Second Helping, Mountain Goat |
| Rim Protector | No Fly Zone, Swat Team, Bouncer |

### Names

Every badge name is our own. Common NBA 2K badge names (Deadeye, Posterizer, Clamps, Anchor, Dimer, Brick Wall,
Limitless Range, Catch & Shoot and so on) were avoided on purpose, along with names already used for our archetypes,
traits, perks, gear and achievements. Tier names are Bronze, Silver, Gold and **Platinum**. "Hall of Fame" is already
a difficulty and a career tier, so it isn't used for badges.

### Where badges show

- **Skills screen (build and spending):** each skill shows the next badge it feeds ("3 more to Silver Rainmaker").
  The projection card adds "Badges you start with" and your archetype's signature badges.
- **Season story:** earned, upgraded and faded badges, one line each.
- **Profile → Badges tab:** everything you hold with tier medals and effects, then "close to" upgrades, then locked
  badges with what they need.
- **End plaque and Hall of Builds:** your Gold and Platinum badges and a badge count.
- **Badge Book (menu):** every badge with the best tier you have ever reached, across careers. Three achievements:
  hold 10 badges at once, reach Platinum, discover all 29. Like every achievement they don't count on Rookie, and the
  Badge Book never pays GTP or gems on Rookie.
- Medals use the game's own `icon('medal')` in tier colors, not emoji.

## 3. Player Profile

**The main career screen keeps:** a compact header (avatar, name, archetype and age, OVR ring) with a "Profile ›"
cue, the bonus-points bar, and the season content. The Traits list leaves the main screen.

**Tap the header to open the Profile** (a full screen with a back button, like the menu pages). Five tabs:

1. **Overview:** big avatar, name, archetype with its top three fits, OVR, **height, weight**, frame, age, era,
   team or school, draft pick, rival, hype and stars in high school.
2. **Skills:** all 25 skills by group with group averages and next-badge hints. **Spending bonus points moves here**:
   the main screen's "Spend" button opens this tab with the + buttons.
3. **Badges:** described above.
4. **Stats:** per-game averages for high school, college and the NABL; a season-by-season NABL table (PPG, RPG,
   APG, SPG, BPG, FG%, 3P%, FT%); career totals; awards.
5. **Traits:** the 11 traits with their ratings.

**Weight** is shown, not chosen. It comes from height, the frame's name, Strength and age, rounded to 5 lb (never
from the frame's hidden effects). For example, 6'10"
Lean is about 220 lb, 6'2" Balanced about 190 lb and 7'0" Strong about 270 lb, and a 14-year-old is lighter. It has
no effect on play: frame already sets your build, and that keeps hidden frame effects hidden.

High school and college seasons are stored as text today. New seasons also store the numbers, and older saves get
their averages read back from the text.

## 4. Saves and rules

- **Version bump.** A saved run gets the four new skills started from related ones, so nobody's OVR drops:
  Hook = average of Post Moves and Close Shot; Post Fade = Post Moves and Mid-Range; Off-Ball = Basketball IQ and
  Speed; Lateral = Perimeter D and Speed. Its hidden ceiling shifts by the OVR change, as in the archetype conversion.
- `legacyOvr()` keeps the original 21-skill groups, so runs from before archetypes still convert correctly.
- The new skills are filled in before anything rates the player (a missing skill would break the rating).
- The existing story-badge list (Big Shot Maker) moves into the new badge model and keeps its name, so old saves
  neither lose it nor show it twice. Badges for a continued run are computed on load without story lines.
- **Owner rules kept:** no auto-spend; nothing bought with gems or GTP gives a badge directly (Equipment still adds
  skill points as today); hidden frame effects stay hidden; badge and archetype reads never roll dice; no
  "Unicorn"-style names.

## 5. Testing

- All current Witness tests, updated for 25 skills and the profile (the flow test and any check that reads the
  traits block).
- **New tests:**
  - The Profile opens from the header, shows height and weight, and spending works from its Skills tab.
  - A badge appears exactly at its line, and only up to the stage cap.
  - A badge fades at season end below its line minus 3, and never fades from spending.
  - Badge effects stay inside the caps.
  - Replay and Daily Build determinism are unchanged.
  - An old save converts with no OVR drop, then plays on.
- **Stat alignment:** `probe2` before and after badges; the top end should land at league level.

## 6. Balance

Retune to the odds the owner just approved:

| Difficulty | GOAT | Top 10 | Hall of Famer |
|---|---|---|---|
| Rookie | about 9% | | |
| Pro | 1% | 2% | about 4.3% |
| Hall of Fame | 0.5% | 1% | 2.5% |

The levers are NABL bonus points and the badge tier lines. Then three Witness AI playtesters (a big, a wing, a
guard) play full careers and report on whether badges feel earned and the Profile is easy to use.

## 7. Phases

1. **Player Profile** (screen only, no rule changes). Ships on its own and declutters the screen right away.
2. **New skills:** groups, size and frame effects, archetype weights, recalibration, events, budgets, save conversion.
3. **Badge engine:** the table, ratings, tiers, stage caps, upgrade and fade, effects in high school, college and
   NABL stats, caps.
4. **Badge screens:** skill hints, the Profile tab, story lines, plaque and Hall of Builds, Badge Book and
   achievements.
5. **Saves and tests.**
6. **Balance and playtest.**
7. **Ship:** push, TestFlight, notes for the game session.

## Review notes from the game session (folded in)

1. **Existing badges:** story badges are already a list of names shown as gold pills. Migrate them, and update every
   place that adds or reads them (including the Big Shot Maker playoff bonus).
2. **Stats vs the league:** league players get no badges, so re-check against `probe2` after phase 3. Award vote
   bonuses get their own cap (see Limits).
3. **Rookie:** badge achievements follow the no-achievements-on-Rookie rule; the Badge Book never pays on Rookie.
4. **Gear:** Equipment adds +1 to +3 to skills at career start, so it can push a skill over a badge line. This is
   open question 6 for the owner.
5. **Season story:** a badge step joins the story sequence and is skipped when nothing changed. The story's existing
   spending step must keep working after spending moves to the Profile (a Witness test depends on it).
6. **High school and college lines:** the story reads stats from the season text, so keep that text format and store
   the numbers alongside it.
7. **Determinism:** badges change only when you start a career, spend points or finish a season, never while the
   screen redraws (a redraw also saves, so a change there would stick).
8. **Old saves:** fill in the four new skills before anything rates the player.
9. **Starting OVR:** keep the owner's targets of about 55 / 50 / 45 after adding skills.
10. **Names:** "Iron Lungs" was too close to the "Iron body" perk; renamed **Bottomless Tank**.
11. **Weight:** uses only the frame's name, never its hidden effects.
12. **Tests and tools:** the flow test opens skill groups by their visible names; the Quick Start tests count premade
    fills; the balance harness needs the four new skills.

## Open questions for the owner

1. The four new skills (Hook Shot, Post Fade, Off-Ball Movement, Lateral Quickness): keep or swap? Other options
   were Help Defense, Box Out and Transition.
2. Badge names and tiers (Bronze, Silver, Gold, Platinum): any you want renamed?
3. Badges fade with age: yes?
4. Weight shown only (from height, frame and strength) rather than a separate choice: OK?
5. Badge Book and its three achievements now, or later?
6. Gear bought with gems adds a few skill points at career start, so **Gold gear can unlock a badge tier** (an
   indirect way to buy one). Allow it? The game session and I think it's fine, and it helps gem sales.
