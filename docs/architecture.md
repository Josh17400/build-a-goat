# How the game's code is organized

The game still ships as one file, `index.html`. GitHub Pages serves it and the iOS app wraps it.
That file is now **built** from the files in `src/`. Edit `src/`, never `index.html`.

## The everyday loop

```bash
node tools/build.cjs
```

That rebuilds `index.html`. Before committing, run the checks:

```bash
node tools/build.cjs --check
```

```bash
node tools/boundaries.cjs
```

```bash
node tools/test-game.cjs
```

```bash
node tools/replay.cjs --check
```

CI runs the first three on every TestFlight build. The replay check and the Witness tests are run by hand.

## Where things live

`src/index.html` is the page shell, `src/styles.css` the stylesheet, and `src/js/` the script, split by job.
`src/manifest.json` lists the script files in load order.

| Folder | What it holds |
|---|---|
| `core` | Small helpers, and `storage.js`: the only code that touches the device's saved data |
| `data` | Constants and eras |
| `state` | What a new player looks like |
| `ratings` | Archetypes and OVR, badges, the OVR display scale |
| `career` | Growth, high school, college, the draft, pro seasons, playoffs, decisions, summers, goals |
| `league` | The simulated league, your rival, league news |
| `legacy` | The verdict, achievements, history, the ending |
| `economy` | Difficulty, GTP, perks, gems and gear |
| `creator` | Premade builds |
| `save` | The saved run |
| `ui` | Every screen and card, and `actions.js`: what each button does |
| `avatar` | The player portrait |
| `audio` | Sound and music |
| `platform` | Ads, the store and the iOS progress mirror |
| `dev` | The bulk simulator and the Witness test hook |

`boot.js` starts the game. It sits before `platform` in the load order on purpose.

## The three rules

`tools/boundaries.cjs` enforces these.

1. **Only `core/storage.js` touches storage.** Everything else asks `Store`, or better, the owner of the
   saved thing: `gems()` and `addGems()`, `gtpBank()`, `hallList()` and `hallAdd()`, `achHave()`, and so on.
   The iOS app mirrors progress to native storage by listening to `Store`, so a write that goes around
   `Store` would not be backed up.
2. **Rule folders never draw.** `core`, `data`, `state`, `ratings`, `career`, `league`, `legacy`, `economy`,
   `creator` and `save` change the game and never touch the page. A button's handler lives in
   `ui/actions.js`: it runs a rule, then redraws.
3. **Never rename a replayable action.** A saved run is a log of the player's actions by function name
   (`LOGGED` in `save/save.js`). Renaming one breaks saves already on devices.

## Adding things

- **A badge, achievement, archetype or event:** add a row to its table (`BADGES`, `ACH`, `ARCHS`, the event lists).
- **A kind of season goal:** add its check to `GOAL_OK` in `career/goals.js` and offer it in `makeGoals`.
- **A piece of the season story:** add it to `SEQ` in `ui/season-story.js` and say when it appears in `startSeq`.
- **A saved value:** give it one owner (a getter and a setter built on `Store`) and have everything else call the owner.
- **A new source file:** add it to `src/manifest.json`. A `const` must be listed before any file that
  uses it while the page is loading. Functions can be used from anywhere.

## The safety nets

| Check | What it proves |
|---|---|
| `tools/build.cjs --check` | `index.html` is exactly what `src/` builds |
| `tools/boundaries.cjs` | The three rules above still hold |
| `tools/test-game.cjs` | Storage that fails or is damaged does not break the game; the iOS progress mirror works against a fake native shell |
| `tools/replay.cjs --check` | 24 seeded careers produce exactly the same screens, results and saves as the recorded fingerprint |
| Witness tests | 91 checks in a real browser |

**The replay fingerprint changes whenever gameplay or a screen changes on purpose.** After an intended
change, record the new one:

```bash
node tools/replay.cjs --save
```

A refactor must leave it alone. To see what moved, dump before and after and compare the folders:

```bash
node tools/replay.cjs --dump before
```

To find which source file built a line of `index.html` (from a device error, for example):

```bash
node tools/build.cjs --where 1234
```

## What is still shared

The script is still one classic `<script>` with shared top-level names, and most rules read and write
one game-state object, `S`. Splitting the files did not change that. Known follow-ups:

- The side menu is described in five places (`ui/menu.js`); it should be one registry of pages.
- Rules still write player-facing text with emoji into season notes.
- `S` is read directly in about 2,000 places. Narrowing that is a long job best done one area at a time.
