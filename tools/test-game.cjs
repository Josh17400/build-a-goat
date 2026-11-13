#!/usr/bin/env node
// Headless tests for the parts of the game the replay cannot reach: storage that fails or holds
// damaged data, and the iOS progress mirror (which needs a native shell). They run the built
// index.html's own script in the stand-in page from tools/lib/headless.cjs.
//
//   node tools/test-game.cjs
'use strict';
const path = require('path');
const { ROOT, page, gameScript, runGame } = require('./lib/headless.cjs');

const HTML = path.join(ROOT, 'index.html');
// Appended to the game's script: hands the tests the top-level names they need (a `const` is not a
// property of the page's global object).
const EXPORTS = ';globalThis.__g={Store,Plat,UI,gems,addGems,setGems,gear,gtpBank,setGtp,hallList,hallAdd,achHave,canSave,noAds,grantNoAds,bookGet,getS,SV,avatar,randLook,faceFeatures,LOOKS,HAIRS,HAIR_TOP,setDice:f=>{R=f;}};';

const tests = [];
const test = (name, fn) => tests.push([name, fn]);
function eq(got, want, what) {
  const a = JSON.stringify(got), b = JSON.stringify(want);
  if (a !== b) throw new Error((what ? what + ': ' : '') + 'got ' + a + ', want ' + b);
}
function ok(v, what) {
  if (!v) throw new Error(what || 'expected a truthy value');
}

// Boots the game in a fresh page and returns its exported names plus the page.
function boot(opts) {
  const screens = [];
  const pg = page(screens, opts);
  const win = runGame(gameScript(HTML), EXPORTS, pg);
  return { g: win.__g, pg, screens };
}

// A native shell as native/shell.js presents it, recording what the game asks of it.
function fakeShell(saved) {
  const calls = { put: [], hydrate: [], state: [] };
  const shell = {
    native: true,
    liveAds: false,
    store: {
      hydrate: (key) => { calls.hydrate.push(key); return Promise.resolve(saved === undefined ? null : saved); },
      put: (key, json) => { calls.put.push([key, json]); },
    },
    app: { onState: (fn) => { calls.state.push(fn); } },
    configure() {},
    ads: { available: () => false, showBanner() {}, removeBanner() {}, onBanner() {}, rewarded: () => Promise.resolve(false) },
    iap: { available: () => false, owned: () => Promise.resolve([]), getProducts: () => Promise.resolve([]), price: () => null },
    splash: { hide() {} },
  };
  // anything else the game asks of the shell is a harmless no-op
  const soft = (o) => new Proxy(o, { get: (t, k) => (k in t ? t[k] : typeof k === 'symbol' || k === 'then' ? undefined : () => undefined) });
  for (const k of ['store', 'app', 'ads', 'iap', 'splash']) shell[k] = soft(shell[k]);
  return { shell: soft(shell), calls };
}

test('Store reads, writes and removes, and parses with fallbacks', () => {
  const { g, pg } = boot();
  eq(g.Store.get('bag_none'), null);
  eq(g.Store.set('bag_x', 5), true);
  eq(g.Store.get('bag_x'), '5', 'values are stored as strings');
  eq(g.Store.setJson('bag_o', { a: 1 }), true);
  eq(g.Store.obj('bag_o'), { a: 1 });
  eq(g.Store.obj('bag_none'), {}, 'a missing object');
  eq(g.Store.list('bag_none'), [], 'a missing list');
  eq(g.Store.json('bag_none'), null, 'missing json');
  ok(g.Store.obj('bag_none') !== g.Store.obj('bag_none'), 'each fallback is a fresh object (callers add to it)');
  pg.store.set('bag_bad', '{not json');
  eq(g.Store.obj('bag_bad'), {}, 'damaged object');
  eq(g.Store.list('bag_bad'), [], 'damaged list');
  eq(g.Store.json('bag_bad'), null, 'damaged json');
  pg.store.set('bag_wrong', '[1,2]');
  eq(g.Store.obj('bag_wrong'), {}, 'a list where an object belongs');
  pg.store.set('bag_wrong2', '{"a":1}');
  eq(g.Store.list('bag_wrong2'), [], 'an object where a list belongs');
  ok(g.Store.keys().includes('bag_x'));
  g.Store.remove('bag_x');
  eq(g.Store.get('bag_x'), null);
  eq(g.Store.ok(), true);
});

test('Store tells its listeners about writes and removals that landed', () => {
  const { g } = boot();
  const seen = [];
  g.Store.onChange((k) => seen.push(k));
  g.Store.set('bag_a', '1');
  g.Store.setJson('bag_b', {});
  g.Store.remove('bag_a');
  eq(seen, ['bag_a', 'bag_b', 'bag_a']);
});

test('each saved thing has one owner that reads and writes it', () => {
  const { g, pg } = boot();
  eq(g.gems(), 0);
  g.addGems(12);
  g.addGems(-2);
  eq(g.gems(), 10);
  eq(pg.store.get('bag_gems'), '10');
  g.setGtp(41.6);
  eq(g.gtpBank(), 42);
  g.setGtp(-5);
  eq(g.gtpBank(), 0, 'GTP never goes below zero');
  eq(g.hallList(), []);
  for (let i = 0; i < 17; i++) g.hallAdd({ name: 'P' + i, score: i });
  eq(g.hallList().length, 15, 'the Hall of Builds keeps the best 15');
  eq(g.hallList()[0].score, 16, 'best first');
  eq(g.hallList()[14].score, 2);
  eq(g.noAds(), false);
  g.grantNoAds();
  eq(g.noAds(), true);
  eq(g.achHave(), {});
});

test('the game boots and plays on when storage refuses every call', () => {
  const refuse = () => { throw new Error('storage is off'); };
  const storage = { getItem: refuse, setItem: refuse, removeItem: refuse, key: refuse, get length() { return refuse(); }, clear: refuse };
  const { g, screens } = boot({ storage });
  ok(screens.length > 0, 'the first screen was drawn');
  eq(g.Store.ok(), false);
  eq(g.Store.get('bag_gems'), null);
  eq(g.Store.set('bag_gems', 5), false, 'a dropped write says so');
  eq(g.Store.keys(), []);
  eq(g.gems(), 0);
  g.addGems(5);
  eq(g.gems(), 0);
  eq(g.gtpBank(), 0);
  eq(g.hallList(), []);
  eq(g.achHave(), {});
  eq(g.canSave(), false, 'no saving without storage');
  ok(g.UI().intro == null, 'the intro is not forced on every launch when it cannot be remembered');
  eq(g.getS().diff, 'pro', 'the default difficulty');
});

test('damaged saved data reads as empty instead of breaking a screen', () => {
  const { g, pg } = boot();
  for (const k of ['bag_gems', 'bag_gear', 'bag_hof', 'bag_ach', 'bag_bbook', 'bag_gtp']) pg.store.set(k, '{{{');
  eq(g.gems(), 0);
  eq(g.gear(), {});
  eq(g.hallList(), []);
  eq(g.achHave(), {});
  eq(g.bookGet(), {});
  eq(g.gtpBank(), 0);
});

test('iOS: progress written by the game is mirrored to the native store', async () => {
  const { shell, calls } = fakeShell();
  const { g, pg } = boot({ shell, timers: 'hold' });
  await g.Plat.boot();
  eq(calls.hydrate, ['bag_all'], 'boot asks the native store for its copy');
  calls.put.length = 0;
  pg.flushTimers();
  calls.put.length = 0;
  g.addGems(7);
  eq(calls.put, [], 'the mirror is batched, not written on every change');
  pg.flushTimers();
  eq(calls.put.length, 1, 'one mirror write after the batch delay');
  eq(calls.put[0][0], 'bag_all');
  eq(JSON.parse(calls.put[0][1]).bag_gems, '7', 'the mirror holds the new gems');
  eq(pg.store.get('bag_all'), calls.put[0][1], 'the same blob is kept on the web side');
});

test('iOS: the in-progress run and the mirror itself are not mirrored', async () => {
  const { shell, calls } = fakeShell();
  const { g, pg } = boot({ shell, timers: 'hold' });
  await g.Plat.boot();
  pg.flushTimers();
  calls.put.length = 0;
  g.Store.set(g.SV.snap, '{"big":"run"}');
  g.Store.set(g.SV.build, '{}');
  g.Store.set('bag_all', '{}');
  g.Store.set('other_key', '1');
  pg.flushTimers();
  eq(calls.put, [], 'no mirror write for run, build, the blob itself or foreign keys');
  g.Store.setJson('bag_gear', { shoes: 1 });
  pg.flushTimers();
  const blob = JSON.parse(calls.put[0][1]);
  eq(blob.bag_gear, '{"shoes":1}');
  ok(!('bag_run' in blob) && !('bag_build' in blob) && !('bag_all' in blob) && !('other_key' in blob), 'only progress keys are in the blob');
});

test('iOS: removing progress is mirrored, and going to the background mirrors at once', async () => {
  const { shell, calls } = fakeShell();
  const { g, pg } = boot({ shell, timers: 'hold' });
  await g.Plat.boot();
  g.addGems(3);
  pg.flushTimers();
  calls.put.length = 0;
  g.Store.remove('bag_gems');
  pg.flushTimers();
  ok(!('bag_gems' in JSON.parse(calls.put[0][1])), 'the removed key left the mirror');
  calls.put.length = 0;
  g.addGems(9);
  eq(calls.state.length, 1, 'the game listens for the app going to the background');
  calls.state[0](false);
  eq(calls.put.length, 1, 'backgrounding writes the mirror without waiting');
  eq(JSON.parse(calls.put[0][1]).bag_gems, '9');
});

test('iOS: after a purge, boot restores progress from the native copy', async () => {
  const saved = JSON.stringify({ bag_gems: '77', bag_gtp: '12', bag_noads: '1', bag_run: 'must be ignored', other: 'x' });
  const { shell } = fakeShell(saved);
  const { g, pg } = boot({ shell, timers: 'hold' });
  eq(g.gems(), 0, 'nothing on the web side before the native copy arrives');
  await g.Plat.boot();
  eq(g.gems(), 77);
  eq(g.gtpBank(), 12);
  eq(g.noAds(), true, 'Remove Ads survives the purge');
  eq(pg.store.get('bag_run'), undefined, 'a run in the blob is not restored');
  eq(pg.store.get('other'), undefined);
});

test('looks: a look saved before face features existed draws the same as the defaults', () => {
  const { g } = boot();
  const old = { num: 7, skin: 2, hair: 3, hc: 1, fh: 5, face: 1, head: 1, arms: 2, jew: 1, guard: 0, jer: 4, trim: 1, js: 1 };
  const now = { ...old, fs: 0, ey: 0, ec: 0, br: 0, no: 0, mk: 0 };
  const same = (a, b) => a.replace(/av\d+/g, 'av') === b.replace(/av\d+/g, 'av');
  ok(same(g.avatar(old, 24, 90, 1), g.avatar(now, 24, 90, 1)), 'missing features mean the first option of each');
  ok(!same(g.avatar(old, 24, 90, 1), g.avatar({ ...now, fs: 2 }, 24, 90, 1)), 'a face shape changes the drawing');
});

test('looks: a random look rolls the same dice as before and derives its face features from them', () => {
  const { g } = boot();
  let rolls = 0;
  const dice = (seed) => { let a = seed; return () => { rolls++; a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };
  g.setDice(dice(5));
  const one = g.randLook();
  const used = rolls;
  g.setDice(dice(5));
  const two = g.randLook();
  eq(one, two, 'the same dice give the same look, features included');
  const rolled = g.LOOKS.filter((x) => !x[3]).length, derived = g.LOOKS.filter((x) => x[3]).map((x) => x[0]);
  eq(derived, ['fs', 'ey', 'ec', 'br', 'no', 'mk']);
  ok(used <= 1 + rolled + 12, 'no dice are spent on the derived features (' + used + ' rolls for ' + rolled + ' rolled options)');
  for (const k of derived) ok(Number.isInteger(one[k]) && one[k] >= 0, k + ' is set');
  eq(g.faceFeatures({ ...one }), one, 'deriving again changes nothing');
});

test('looks: every option draws, and no combination produces a broken drawing', () => {
  const { g } = boot();
  const counts = Object.fromEntries(g.LOOKS.map(([k, , o]) => [k, o().length]));
  const check = (L, age, why) => {
    const svg = g.avatar(L, age, 90, 1);
    ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), 'an svg for ' + why);
    const bad = /NaN|undefined|null|Infinity/.exec(svg);
    ok(!bad, why + ' contains "' + (bad && bad[0]) + '"');
  };
  const base = { num: 23, skin: 3, hair: 1, hc: 0, fh: 0, face: 0, head: 0, arms: 0, jew: 0, guard: 0, jer: 1, trim: 0, js: 0 };
  for (const [k, n] of Object.entries(counts)) for (let v = 0; v < n; v++) for (const age of [14, 24, 39]) check({ ...base, [k]: v }, age, k + '=' + v + ' at ' + age);
  let a = 99;
  g.setDice(() => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; });
  const seen = Object.fromEntries(Object.keys(counts).map((k) => [k, new Set()]));
  for (let i = 0; i < 1500; i++) { const L = g.randLook(); check(L, 14 + (i % 28), 'random look ' + i); for (const k in seen) seen[k].add(L[k]); }
  for (const k of ['fs', 'ey', 'ec', 'br', 'no', 'mk', 'js']) eq(seen[k].size, counts[k], 'random looks reach every ' + k + ' option');
});

test('looks: on a card every hairstyle is scaled to fill it without its hair leaving the top', () => {
  const { g } = boot();
  const base = { num: 23, skin: 3, hc: 0, fh: 0, face: 0, head: 0, arms: 0, jew: 0, guard: 0, jer: 1, trim: 0, js: 0 };
  g.HAIRS.forEach((name, hair) => {
    ok(typeof g.HAIR_TOP[name] === 'number', 'HAIR_TOP has no entry for "' + name + '" (measure its top and add it)');
    const m = /transform="matrix\(([0-9.]+) 0 0 [0-9.]+ /.exec(g.avatar({ ...base, hair }, 24, 90, 1));
    ok(m, name + ': the card scales its figure');
    const fit = +m[1], top = 140 - (140 - g.HAIR_TOP[name]) * fit;
    ok(fit >= 1 && fit <= 1.14, name + ': scale ' + fit + ' is between 1 and 1.14');
    ok(top >= -1.5, name + ': the hair top lands at ' + top.toFixed(1) + ', inside the card');
    ok(!/transform="matrix/.test(g.avatar({ ...base, hair }, 24, 90, 0)), name + ': without a card nothing is scaled (the creator crops depend on it)');
  });
});

// A device's storage that outlives one boot, so a test can close the game and open it again.
function device() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
    setItem: (k, v) => void m.set(String(k), String(v)),
    removeItem: (k) => void m.delete(String(k)),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
    clear: () => m.clear(),
  };
}
const RUN_EXPORTS = EXPORTS.replace(/};$/, '') + ',startCareer,abandonRun,quitRun,hasRun,autosave,menuItems,spentNow:()=>spent(),budgetNow:()=>START_BUDGET};';
function bootOn(storage) {
  const pg = page([], { storage });
  return runGame(gameScript(HTML), RUN_EXPORTS, pg).__g;
}

test('starting a career uses up its draft: reopening the game shows a new player in the creator', () => {
  const dev = device();
  let g = bootOn(dev);
  g.getS().name = 'First Player';
  g.autosave();
  ok(dev.getItem('bag_build'), 'the half-finished build is saved while you make it');
  g.startCareer();
  eq(dev.getItem('bag_build'), null, 'draft after the career starts');
  g = bootOn(dev);
  ok(g.hasRun(), 'the run is still saved');
  eq(g.getS().stage, 'build');
  ok(g.getS().name !== 'First Player', 'the creator holds a new player, not the one already playing');
  g.getS().name = 'Second Player';
  g.autosave();
  g = bootOn(dev);
  eq(g.getS().name, 'Second Player', 'a draft of a genuinely new player still comes back');
});

test('a draft left by older versions that is the saved run itself is skipped on launch', () => {
  const dev = device();
  let g = bootOn(dev);
  g.getS().name = 'Old Draft';
  g.autosave();
  const stale = dev.getItem('bag_build');
  g.startCareer();
  dev.setItem('bag_build', stale); // older versions never removed it
  g = bootOn(dev);
  ok(g.getS().name !== 'Old Draft', 'the creator does not reopen the player already in a run');
  ok(!/Old Draft/.test(dev.getItem('bag_build') || ''), 'the stale draft is gone (the new player\'s own draft may be saved)');
  ok(g.hasRun(), 'the run itself is untouched');
});

test('Reset all progress is a testing tool: the App Store build leaves it out', () => {
  const dev = device();
  const win = runGame(gameScript(HTML), EXPORTS.replace(/};$/, '') + ',settingsCard,resetProgress};', page([], { storage: dev }));
  const g = win.__g;
  ok(g.settingsCard().includes('Reset all progress'), 'TestFlight and web builds show the reset button');
  win.BAG_ADS = 'live';
  g.addGems(40);
  ok(!g.settingsCard().includes('Reset all progress'), 'the release build has no reset button');
  g.resetProgress();
  ok(g.gems() === 40, 'and reset does nothing there, so gems stay');
});

test('Abandon build deletes the run and opens a fresh creator; Main menu keeps it', () => {
  const dev = device();
  let g = bootOn(dev);
  g.getS().name = 'Quitter';
  g.startCareer();
  ok(g.menuItems().some((m) => m[0] === 'abandon'), 'the side menu offers Abandon build during a career');
  const hof = g.hallList().length;
  g.quitRun();
  ok(g.hasRun(), 'Main menu keeps the run');
  ok(!g.menuItems().some((m) => m[0] === 'abandon'), 'no Abandon build on the creator');
  g = bootOn(dev);
  g.startCareer();
  g.abandonRun();
  ok(!g.hasRun(), 'the run is gone');
  for (const k of ['bag_run', 'bag_run_meta', 'bag_run_log', 'bag_run_ui']) eq(dev.getItem(k), null, k);
  ok(!/Quitter/.test(dev.getItem('bag_build') || ''), 'no draft of the abandoned player');
  eq(g.getS().stage, 'build');
  eq(g.getS().name, '', 'a fresh player');
  eq(g.hallList().length, hof, 'nothing added to the Hall of Builds');
  g = bootOn(dev);
  ok(!g.hasRun(), 'still gone after reopening');
});

test('a creator draft saved while skills started at 25 opens with every skill at 40 or more, within budget', () => {
  const dev = device();
  let g = bootOn(dev);
  const d = JSON.parse(JSON.stringify(g.getS()));
  delete d.ui;
  for (const k of Object.keys(d.attrs)) d.attrs[k] = 25;
  d.attrs.three = 90; d.attrs.mid = 85; d.attrs.handle = 80; d.attrs.pass = 80; d.attrs.speed = 80; d.name = 'Old Draft';
  dev.setItem('bag_build', JSON.stringify(d));
  g = bootOn(dev);
  const s = g.getS();
  eq(s.name, 'Old Draft', 'the draft itself is kept');
  for (const [k, v] of Object.entries(s.attrs)) ok(v >= 40, k + ' is ' + v + ', below the start of 40');
  ok(g.spentNow() <= g.budgetNow(), 'spent ' + g.spentNow() + ' of ' + g.budgetNow());
});

// ---------- a whole career, for the tests that need a run in a given state ----------
// PLAY is appended to the game's script: __play(stop) plays on from wherever the run is (answering every decision with its
// first option, the best odds in the clutch) until the career ends or stop() says so.
const PLAY = `;globalThis.__play=function(stop){
  const spendAll=()=>{let g=0;const wn=ARCHS[archetype().id].wn.slice().sort((a,b)=>b[1]-a[1]).map(x=>x[0]);while(S.bank>0&&g++<80)spend(wn[g%wn.length],10);};
  for(let i=0;i<4000&&S.stage!=='end';i++){if(stop&&stop())return true;const st=S.stage;if(UI().seq)UI().seq=null;
    if(st==='build'){const T=TRAITS.map(t=>t[0]);while(S.picked.length<2)toggleTrait(T[S.picked.length]);startCareer();}
    else if(st==='hs'){if(S.summerPend)chooseSummer(0);else{spendAll();simHS();}}else if(st==='offers')chooseSchool(0);
    else if(st==='college'){if(S.summerPend)chooseSummer(0);else if(!S.col.length||S.colNext)simCol();else declare();}else if(st==='draft')startNBA();
    else if(st==='nba'){if(S.pend){const p=S.pend;choose(p.kind==='clutch'?p.best||0:0);}else{spendAll();simNBA();}}}
  UI().seq=null;render();return S.stage==='end';};`;
const CAREER_EXPORTS = RUN_EXPORTS.replace(/};$/, '') + ',resumeRun,buildAnother,liveRun,continueCard,doubleRewards,rewardCard,render,act,playSeason,seqSkip,esc,settleTx,syncPurchases,shopBuy,shopRestore,SHOP_PACKS,askTrade,get chooseSummer(){return chooseSummer},get simHS(){return simHS},play:s=>globalThis.__play(s)};';
// opts.clock = {t} is the page clock (performance.now), which starts again near zero every time the app is launched
function launch(storage, opts = {}) {
  const pg = page([], Object.assign({ storage }, opts.page));
  if (opts.clock) pg.win.performance = { now: () => opts.clock.t };
  const g = runGame(gameScript(HTML), PLAY + CAREER_EXPORTS, pg).__g;
  return opts.withPage ? { g, pg } : g;
}
const tick = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };

test('a decision left open is answerable straight after the app is closed and reopened', () => {
  const dev = device();
  // 20 minutes into a session, the first summer decision comes up and the app is closed
  let g = launch(dev, { clock: { t: 20 * 60 * 1000 } });
  g.play(() => !!g.getS().summerPend);
  g.render();
  ok(g.getS().summerPend, 'a summer decision is open');
  const clock = { t: 3000 };
  g = launch(dev, { clock });
  ok(g.resumeRun(), 'the run resumes');
  ok(g.getS().summerPend, 'the decision is still open');
  clock.t += 2000;
  g.act(g.chooseSummer, 0);
  ok(!g.getS().summerPend, 'a tap 2 seconds after Continue answers it');
});

test('a finished career stays saved for its recap, pays its rewards once, and Build Another clears it', () => {
  const dev = device();
  let g = launch(dev);
  ok(g.play(), 'the career ends');
  const paid = [g.gems(), g.gtpBank(), g.hallList().length];
  ok(paid[0] > 0 && paid[2] === 1, 'rewards were paid: ' + paid);
  ok(g.hasRun() && !g.liveRun(), 'the finished career is saved, and is not a run in progress');
  for (let i = 0; i < 2; i++) {
    g = launch(dev);
    eq(g.getS().stage, 'build', 'reopening the app lands on the creator');
    ok(/See your career recap/.test(g.continueCard()), 'the saved card offers the recap');
    ok(g.resumeRun(), 'the recap reopens');
    eq(g.getS().stage, 'end');
    eq([g.gems(), g.gtpBank(), g.hallList().length], paid, 'nothing is paid again (reopen ' + (i + 1) + ')');
  }
  g.buildAnother();
  ok(!g.hasRun(), 'Build Another clears the saved career');
  eq(launch(dev).hasRun(), false, 'and it stays cleared');
});

test('a replay that ends the career pays once, however often Continue is used', () => {
  const dev = device();
  let g = launch(dev);
  // stop on the first "is it time to retire" decision, then make the saved log end the career (as a changed sim could)
  ok(g.play(() => g.getS().pend && g.getS().pend.kind === 'retire'), 'a retirement decision came up');
  g.render();
  const lg = JSON.parse(dev.getItem('bag_run_log'));
  lg.log.push(['choose', 0]);
  dev.setItem('bag_run_log', JSON.stringify(lg));
  g = launch(dev);
  ok(g.resumeRun());
  eq(g.getS().stage, 'end', 'the replay ended the career');
  const paid = [g.gems(), g.gtpBank(), g.hallList().length];
  for (let i = 0; i < 2; i++) {
    g = launch(dev);
    ok(g.resumeRun());
    eq([g.gems(), g.gtpBank(), g.hallList().length], paid, 'Continue ' + (i + 2) + ' pays nothing more');
  }
});

test('the double-rewards ad pays what it offered even if Build Another is tapped while it loads', async () => {
  let settleAd = null;
  const { shell } = fakeShell();
  shell.ads.available = () => true;
  shell.ads.showRewarded = () => new Promise((r) => { settleAd = r; });
  const { g } = launch(device(), { page: { shell }, withPage: true });
  ok(g.play(), 'the career ends');
  const gems0 = g.gems(), gtp0 = g.gtpBank(), offer = g.getS().gemsRun, offerGtp = g.getS().gtpRun;
  ok(offer > 0, 'there are gems to double');
  g.doubleRewards();
  g.buildAnother();
  settleAd({ rewarded: true });
  await tick();
  eq([g.gems(), g.gtpBank()], [gems0 + offer, gtp0 + offerGtp], 'the bonus still arrives');
});

test('a gem pack is paid exactly once: on the spot, or later if the store approves it late', async () => {
  let txs = [{ key: 'old-1', product: 'bag_gems_t1' }], buy = null;
  const { shell } = fakeShell();
  shell.iap.available = () => true;
  shell.iap.transactions = () => Promise.resolve(txs.slice());
  shell.iap.purchase = (sku) => Promise.resolve(buy(sku));
  shell.iap.restore = () => Promise.resolve([]);
  const { g } = launch(device(), { page: { shell }, withPage: true });
  const pack = (sku) => g.SHOP_PACKS.find((p) => p.sku === sku).gems;
  await g.Plat.boot(); await tick();
  eq(g.gems(), 0, 'purchases made before this bookkeeping existed are the baseline, not paid again');

  // a normal purchase: paid on the spot, and its transaction in the list is not paid a second time
  buy = (sku) => { txs.push({ key: 'new-1', product: sku }); return { ok: true, txs: txs.slice() }; };
  g.shopBuy('bag_gems_t2'); await tick();
  eq(g.gems(), pack('bag_gems_t2'), 'paid on the spot');
  await g.syncPurchases();
  eq(g.gems(), pack('bag_gems_t2'), 'not paid again when the list is read later');

  // the store answers before its list has the new purchase: still paid once
  buy = () => ({ ok: true, txs: txs.slice() });
  g.shopBuy('bag_gems_t1'); await tick();
  let want = pack('bag_gems_t2') + pack('bag_gems_t1');
  eq(g.gems(), want, 'paid on the spot');
  txs.push({ key: 'new-2', product: 'bag_gems_t1' });
  await g.syncPurchases();
  eq(g.gems(), want, 'its late-arriving transaction is recognized as already paid');

  // Ask to Buy: the purchase call fails, the approval lands later
  buy = () => ({ ok: false, error: 'Payment is pending' });
  g.shopBuy('bag_gems_t3'); await tick();
  eq(g.gems(), want, 'nothing is paid while it is pending');
  txs.push({ key: 'late-1', product: 'bag_gems_t3' });
  await g.syncPurchases();
  want += pack('bag_gems_t3');
  eq(g.gems(), want, 'the approved purchase is paid when the app next looks');
  await g.syncPurchases();
  eq(g.gems(), want, 'and only once');

  // the store's list cannot be read: nothing changes
  const readable = shell.iap.transactions;
  shell.iap.transactions = () => Promise.reject(new Error('offline'));
  await g.syncPurchases();
  eq(g.gems(), want, 'a failed read pays nothing');

  // Restore purchases never pays for gem packs, even ones this device has not seen
  txs.push({ key: 'other-device', product: 'bag_gems_t5' });
  shell.iap.transactions = readable;
  g.shopRestore(); await tick();
  await g.syncPurchases();
  eq(g.gems(), want, 'restore settles the list without paying');
});

test('a name with a quote mark survives being drawn into a text field', () => {
  eq(launch(device()).esc('Earvin "Magic" <b>'), 'Earvin &quot;Magic&quot; &lt;b&gt;');
});

test('a refused save keeps the last good save usable instead of rolling the run back', () => {
  const dev = device();
  let g = launch(dev);
  g.play(() => g.getS().nba.length >= 2 && !g.getS().pend);
  const real = dev.setItem;
  // from here on the device refuses anything as large as a full snapshot
  dev.setItem = (k, v) => { if (String(v).length > 100000) throw new Error('QuotaExceededError'); real(k, v); };
  g.play(() => g.getS().nba.length >= 4 && !g.getS().pend);
  const want = [g.getS().nba.length, g.getS().age, g.getS().bank];
  dev.setItem = real;
  g = launch(dev);
  ok(g.resumeRun(), 'the run resumes');
  eq([g.getS().nba.length, g.getS().age, g.getS().bank], want, 'at the point the player reached, not at the last full save');
});

(async () => {
  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn();
      console.log('  pass  ' + name);
    } catch (e) {
      failed++;
      console.log('  FAIL  ' + name + '\n        ' + String(e && e.message || e).split('\n')[0]);
    }
  }
  console.log(failed ? 'test-game: ' + failed + ' of ' + tests.length + ' failed' : 'test-game: all ' + tests.length + ' passed');
  process.exit(failed ? 1 : 0);
})();
