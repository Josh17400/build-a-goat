#!/usr/bin/env node
// Replay check: plays a fixed set of seeded careers through the built index.html, headless, and
// fingerprints everything the game produced: every screen's HTML after every action, the full game
// state at the end of each career, and everything it wrote to storage. Every few steps it also
// fingerprints the save and reopens the run from it, so saving and loading are part of the replay.
//
// A change that is meant to leave the game's behaviour alone (a refactor, a move between files) must
// leave the fingerprint alone. A change that is meant to alter gameplay or a screen changes it; then
// look at what moved (--dump before and after, and diff) and record the new one with --save.
//
//   node tools/replay.cjs              print the fingerprint
//   node tools/replay.cjs --check      exit 1 if it differs from tools/replay.digest.json
//   node tools/replay.cjs --save       record the current fingerprint in tools/replay.digest.json
//   node tools/replay.cjs --dump DIR   also write each career's end state and last screen to DIR
//   Options: --careers N (per difficulty, default 12)   --html FILE (default ../index.html)
//
// How it stays exact: the page's script runs unmodified in a Node vm with a stand-in page (below),
// Math.random is a seeded generator (the game seeds its career dice from it), the clock is frozen, and
// timers never fire. The player's choices come from a second seeded generator, so they never disturb
// the game's own dice. Only the boot line is cut: the harness starts each career itself.
// Not covered here: what the browser does to a screen after it is drawn (emoji to icons, the league
// name swap, layout, sound). The Witness tests cover those in a real browser.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DIGEST = path.join(__dirname, 'replay.digest.json');
const BOOT = '\nS=newPlayer();bootSave();render();\n';
const FROZEN_NOW = Date.UTC(2026, 10, 9, 15, 0, 0);

function fail(msg) {
  console.error('replay: ' + msg);
  process.exit(1);
}

function args() {
  const a = process.argv.slice(2), o = { careers: 12, html: path.join(ROOT, 'index.html'), mode: 'print', dump: null };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--check') o.mode = 'check';
    else if (a[i] === '--save') o.mode = 'save';
    else if (a[i] === '--dump') o.dump = path.resolve(a[++i] || fail('--dump needs a folder'));
    else if (a[i] === '--careers') o.careers = Number(a[++i]) || fail('--careers needs a number');
    else if (a[i] === '--html') o.html = path.resolve(a[++i] || fail('--html needs a file'));
    else fail('unknown option ' + a[i]);
  }
  return o;
}

// mulberry32: small, fast, and identical on every platform.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The stand-in page. Anything the game might touch but the replay does not care about is a "hole":
// every property read, call or construction on it yields the hole again, and it reads as 0 / ''.
function page(screens) {
  const hole = new Proxy(function () {}, {
    get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === Symbol.iterator ? function* () {} : k === 'then' ? undefined : k === 'length' ? 0 : hole),
    apply: () => hole,
    construct: () => hole,
    set: () => true,
  });
  const classList = { contains: () => false, add() {}, remove() {}, toggle() {} };
  // An element: remembers its innerHTML (the app root's is the screen), a text value, and is a hole otherwise.
  const element = (id) => {
    const own = { innerHTML: '', value: 'Replay', id, classList, style: hole, dataset: {} };
    return new Proxy(own, {
      get: (t, k) => (k in t ? t[k] : k === 'querySelector' ? () => null : k === 'querySelectorAll' ? () => [] : hole),
      set: (t, k, v) => {
        t[k] = v;
        if (id === 'app' && k === 'innerHTML') screens.push(String(v));
        return true;
      },
    });
  };
  const byId = new Map();
  const store = new Map();
  const document = {
    documentElement: element('html'),
    body: element('body'),
    head: element('head'),
    activeElement: null,
    visibilityState: 'visible',
    hidden: false,
    getElementById: (id) => byId.get(id) || (byId.set(id, element(id)), byId.get(id)),
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => element(tag),
    createTreeWalker: () => ({ nextNode: () => null }),
    addEventListener() {},
    removeEventListener() {},
  };
  const localStorage = {
    getItem: (k) => (store.has(String(k)) ? store.get(String(k)) : null),
    setItem: (k, v) => void store.set(String(k), String(v)),
    removeItem: (k) => void store.delete(String(k)),
    key: (i) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
    clear: () => store.clear(),
  };
  class FrozenDate extends Date {
    constructor(...a) { if (a.length) super(...a); else super(FROZEN_NOW); }
    static now() { return FROZEN_NOW; }
  }
  const win = {
    document, localStorage, Date: FrozenDate, console,
    navigator: { userAgent: 'replay', vibrate() {}, language: 'en-US', onLine: true },
    location: { search: '', href: 'http://replay.invalid/', hash: '', pathname: '/' },
    performance: { now: () => 0 },
    innerWidth: 390, innerHeight: 844, scrollY: 0, devicePixelRatio: 2,
    scrollTo() {}, scroll() {}, addEventListener() {}, removeEventListener() {},
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    getComputedStyle: () => hole,
    NodeFilter: { SHOW_TEXT: 4 },
    history: { pushState() {}, replaceState() {}, back() {} },
  };
  win.window = win.self = win.globalThis = win;
  return { win, store };
}

// Runs inside the game's own script scope (it is appended to the script), so it sees every top-level
// name. `__io` is the bridge back to Node. Keep it to the game's public moves: what a player can do.
const HARNESS = String.raw`
;(function replayHarness(){
  const io=globalThis.__io, DIFFS_ORDER=['pro','hof','rookie'];
  for(let n=0;n<io.careers;n++)for(let d=0;d<DIFFS_ORDER.length;d++){
    const diffKey=DIFFS_ORDER[d], seed=1000+n*3+d, pc=io.rng(seed*104729+17), pi=k=>Math.floor(pc()*k);
    Math.random=io.rng(seed*7919+1);
    R=Math.random;S=newPlayer();S.ui={tab:'setup'};setDiff(diffKey);
    // two builds in three are a premade; the third is placed by hand, one tap at a time
    if(n%3<2)applyArch(pi(ARCH.length));
    else{S.height=H_MIN+pi(H_MAX-H_MIN+1);S.frame=Object.keys(FRAMES)[pi(Object.keys(FRAMES).length)];let g=0;while(g++<900&&spent()<START_BUDGET){const k=SUBKEYS[pi(SUBKEYS.length)];pc()<.3?adjN(k,10):adj(k,1);}}
    const T=TRAITS.map(t=>t[0]);toggleTrait(T.splice(pi(T.length),1)[0]);toggleTrait(T.splice(pi(T.length),1)[0]);
    render();startCareer();render();
    let steps=0;
    for(;steps<400&&S.stage!=='end';steps++){const st=S.stage;
      if(st==='hs'){if(S.summerPend)chooseSummer(pi(S.summerPend.opts.length));else if(S.bank>0&&pc()<.34)spend(SUBKEYS[pi(SUBKEYS.length)],1+pi(3));else if(S.bank>40&&pc()<.5)smartSpend();else simHS();}
      else if(st==='offers')chooseSchool(pi(S.offers.length));
      else if(st==='college'){if(S.summerPend)chooseSummer(pi(S.summerPend.opts.length));else if(!S.col.length)simCol();else if(S.mustDeclare||pc()<.4)declare();else returnSchool();}
      else if(st==='draft')startNBA();
      else if(st==='nba'){if(S.pend)choose(pi(S.pend.opts.length));else if(S.bank>0&&pc()<.3)spend(SUBKEYS[pi(SUBKEYS.length)],1+pi(3));else if(S.bank>0&&pc()<.6)smartSpend();else simNBA();}
      else throw new Error('replay: unknown stage '+st);
      render();
      // every few steps: fingerprint what is saved right now, then close and reopen the run from that save
      if(steps%7===3&&S.stage!=='end'){io.mark();resumeRun();render();}
    }
    if(S.stage!=='end')throw new Error('replay: career '+diffKey+' #'+seed+' did not end in 400 steps (stage '+S.stage+')');
    const c=career();
    io.done({diff:diffKey,seed,steps,tier:tierOf(goatScore(c),c)[0],goatScore:goatScore(c),career:c,state:S});
  }
})();
`;

function run(o) {
  if (!fs.existsSync(o.html)) fail('no such file: ' + o.html);
  const html = fs.readFileSync(o.html, 'utf8');
  const m = /<script>([\s\S]*)<\/script>/.exec(html);
  if (!m) fail('no inline <script> in ' + o.html);
  if (m[1].split(BOOT).length !== 2) fail('the boot line was not found exactly once: ' + JSON.stringify(BOOT.trim()));
  const screens = [];
  const { win, store } = page(screens);
  const all = crypto.createHash('sha256');
  const careers = [];
  // JSON without functions; Map/Set and undefined never appear in saved state.
  const plain = (v) => JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : x));
  win.__io = {
    careers: o.careers,
    rng,
    mark() {
      screens.push('<!-- saved: ' + plain([...store.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) + ' -->');
    },
    done(r) {
      const h = crypto.createHash('sha256');
      for (const s of screens) h.update(s).update('\u0000');
      const state = plain(r);
      const saved = plain([...store.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)));
      h.update(state).update('\u0000').update(saved);
      const digest = h.digest('hex');
      all.update(digest);
      careers.push({ diff: r.diff, seed: r.seed, steps: r.steps, screens: screens.length, tier: r.tier, digest });
      if (o.dump) {
        const base = path.join(o.dump, r.diff + '-' + r.seed);
        fs.writeFileSync(base + '.state.json', JSON.stringify(JSON.parse(state), null, 1));
        fs.writeFileSync(base + '.storage.json', JSON.stringify(JSON.parse(saved), null, 1));
        fs.writeFileSync(base + '.screens.html', screens.join('\n<!-- ======== next screen ======== -->\n'));
      }
      screens.length = 0;
    },
  };
  if (o.dump) fs.mkdirSync(o.dump, { recursive: true });
  vm.createContext(win);
  vm.runInContext(m[1].replace(BOOT, '\n') + HARNESS, win, { filename: 'index.html<script>' });
  return { fingerprint: all.digest('hex'), careers };
}

const o = args();
const t0 = Date.now();
const res = run(o);
const tiers = {};
for (const c of res.careers) tiers[c.tier] = (tiers[c.tier] || 0) + 1;
const summary = res.careers.length + ' careers, ' + res.careers.reduce((s, c) => s + c.screens, 0) + ' screens, ' +
  Object.entries(tiers).map(([k, v]) => v + ' ' + k).join(', ');
if (o.mode === 'save') {
  fs.writeFileSync(DIGEST, JSON.stringify({ careers: o.careers, fingerprint: res.fingerprint, each: res.careers.map((c) => c.diff + '-' + c.seed + ' ' + c.digest.slice(0, 16)) }, null, 1) + '\n');
  console.log('replay: saved ' + res.fingerprint.slice(0, 16) + ' (' + summary + ')');
} else if (o.mode === 'check') {
  if (!fs.existsSync(DIGEST)) fail('no tools/replay.digest.json yet; record one with --save');
  const want = JSON.parse(fs.readFileSync(DIGEST, 'utf8'));
  if (want.careers !== o.careers) fail('the saved fingerprint is for --careers ' + want.careers);
  if (want.fingerprint !== res.fingerprint) {
    const moved = res.careers.filter((c, i) => want.each[i] !== c.diff + '-' + c.seed + ' ' + c.digest.slice(0, 16)).map((c) => c.diff + '-' + c.seed);
    fail('the game no longer plays the same: ' + moved.length + ' of ' + res.careers.length + ' careers changed (first: ' + moved[0] +
      '). If that is intended, record it with --save; if not, --dump before and after and diff.');
  }
  console.log('replay: identical, ' + res.fingerprint.slice(0, 16) + ' (' + summary + ', ' + ((Date.now() - t0) / 1000).toFixed(1) + 's)');
} else {
  console.log('replay: ' + res.fingerprint + ' (' + summary + ', ' + ((Date.now() - t0) / 1000).toFixed(1) + 's)');
}
