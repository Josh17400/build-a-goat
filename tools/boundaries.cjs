#!/usr/bin/env node
// Boundary check: the few structural rules that keep the game's files honest. CI runs it.
//
//   1. Only src/js/core/storage.js touches the device's storage. Everything else asks Store,
//      or the owner of a saved thing (gems(), hallList(), achHave() ...).
//   2. The rule folders (what the game IS: ratings, career, league, legacy, economy, creator, save,
//      data, state, core) never draw, never read the page and never hold screen state. Screens live
//      in ui/, sound in audio/, the store and ads in platform/. A button's handler lives in
//      ui/actions.js: it runs a rule, then redraws.
//   3. Every action a saved run can replay still exists under its name. A saved run is a log of the
//      player's actions by function name, so renaming one would break saves already on devices.
//
//   node tools/boundaries.cjs
'use strict';
const fs = require('fs');
const path = require('path');

const JS = path.resolve(__dirname, '..', 'src', 'js');
const RULE_FOLDERS = ['core', 'data', 'state', 'ratings', 'career', 'league', 'legacy', 'economy', 'creator', 'save'];

const files = [];
(function walk(dir, prefix) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), prefix + e.name + '/');
    else if (e.name.endsWith('.js')) files.push({ rel: prefix + e.name, lines: fs.readFileSync(path.join(dir, e.name), 'utf8').split('\n') });
  }
})(JS, '');

const problems = [];
function scan(rule, pick, pattern) {
  for (const f of files.filter(pick)) {
    f.lines.forEach((line, i) => {
      const m = pattern.exec(line);
      if (m) problems.push(rule + '\n      src/js/' + f.rel + ':' + (i + 1) + '  ' + JSON.stringify(m[0]) + '  …' + line.slice(Math.max(0, m.index - 40), m.index + 50).trim() + '…');
    });
  }
}

scan('1. only core/storage.js touches the device storage (ask Store or the owner of the saved thing)',
  (f) => f.rel !== 'core/storage.js',
  /\b(localStorage|sessionStorage)\b/);

scan('2. rule folders never draw or read the page (move screen code to ui/, a button handler to ui/actions.js)',
  (f) => RULE_FOLDERS.includes(f.rel.split('/')[0]),
  /\bdocument\.|\bwindow\.|\brender\(\)|\bUI\(\)|\bscrollTo\(|\bonclick=|\binnerHTML\b|<(div|button|span|details|svg|small|table|h[1-4])[ >]|\bSND\.|\bPlat\.|\bplatToast\(/);

// 3. the saved run's action log
const all = files.map((f) => f.lines.join('\n')).join('\n');
const logged = /const LOGGED=\[([^\]]*)\]/.exec(all);
if (!logged) problems.push('3. the list of replayable actions (const LOGGED=[...]) was not found in src/js/save');
else {
  for (const name of logged[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean)) {
    const defs = all.split('\n').filter((l) => l.startsWith('function ' + name + '(')).length;
    if (defs !== 1) problems.push('3. a saved run replays "' + name + '" by name; it must be defined exactly once as a top-level function (found ' + defs + ')');
  }
}

if (problems.length) {
  console.error('boundaries: ' + problems.length + ' problem' + (problems.length > 1 ? 's' : '') + '\n\n  ' + problems.join('\n\n  ') + '\n');
  process.exit(1);
}
console.log('boundaries: ok (' + files.length + ' files; storage, rule folders and replayable actions)');
