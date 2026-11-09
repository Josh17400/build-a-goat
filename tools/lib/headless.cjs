// The headless page the tools run the game in: tools/replay.cjs (seeded careers) and tools/test-game.cjs.
// The game's script runs unmodified in a Node vm against this stand-in for the browser.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOT = '\nS=newPlayer();bootSave();render();\n';
const FROZEN_NOW = Date.UTC(2026, 10, 9, 15, 0, 0);

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

// The stand-in page. Anything the game might touch but the tools do not care about is a "hole":
// every property read, call or construction on it yields the hole again, and it reads as 0 / ''.
//   screens       every innerHTML the game gives the app root is pushed here
//   opts.shell    a fake native shell (window.Shell), for the iOS paths
//   opts.storage  replaces the device's storage (to make it fail, for instance)
//   opts.timers   'hold' keeps setTimeout callbacks for flushTimers(); by default timers never fire
function page(screens, opts = {}) {
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
  const held = [];
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
  const localStorage = opts.storage || {
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
    navigator: { userAgent: 'headless', vibrate() {}, language: 'en-US', onLine: true },
    location: { search: '', href: 'http://headless.invalid/', hash: '', pathname: '/' },
    performance: { now: () => 0 },
    innerWidth: 390, innerHeight: 844, scrollY: 0, devicePixelRatio: 2,
    scrollTo() {}, scroll() {}, addEventListener() {}, removeEventListener() {},
    setTimeout: (fn) => (opts.timers === 'hold' ? held.push(fn) : 0),
    clearTimeout: (id) => { if (id > 0) held[id - 1] = null; },
    setInterval: () => 0, clearInterval() {},
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    getComputedStyle: () => hole,
    NodeFilter: { SHOW_TEXT: 4 },
    history: { pushState() {}, replaceState() {}, back() {} },
  };
  if (opts.shell) win.Shell = opts.shell;
  win.window = win.self = win.globalThis = win;
  // Runs every held timer once, in order. Timers set while flushing wait for the next flush.
  const flushTimers = () => {
    const due = held.slice();
    held.fill(null);
    for (const fn of due) if (fn) fn();
  };
  return { win, store, hole, flushTimers };
}

// The game's script from a built index.html. `boot: false` cuts the boot line so a tool can start careers itself.
function gameScript(htmlFile, { boot = true } = {}) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const m = /<script>([\s\S]*)<\/script>/.exec(html);
  if (!m) throw new Error('no inline <script> in ' + htmlFile);
  if (boot) return m[1];
  if (m[1].split(BOOT).length !== 2) throw new Error('the boot line was not found exactly once: ' + JSON.stringify(BOOT.trim()));
  return m[1].replace(BOOT, '\n');
}

// Runs the game in a page, plus `extra` source appended in the same scope so it sees every top-level name.
function runGame(source, extra, pg) {
  vm.createContext(pg.win);
  vm.runInContext(source + (extra || ''), pg.win, { filename: 'index.html<script>' });
  return pg.win;
}

module.exports = { ROOT, BOOT, FROZEN_NOW, rng, page, gameScript, runGame };
