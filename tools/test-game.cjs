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
const EXPORTS = ';globalThis.__g={Store,Plat,UI,gems,addGems,setGems,gear,gtpBank,setGtp,hallList,hallAdd,achHave,canSave,noAds,grantNoAds,bookGet,getS,SV,avatar,randLook,faceFeatures,LOOKS,setDice:f=>{R=f;}};';

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
