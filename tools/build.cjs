#!/usr/bin/env node
// Builds ../index.html (the one-file game that GitHub Pages serves and the iOS app wraps) from src/.
//
//   src/index.html      the page shell, with one marker line for the stylesheet and one for the script
//   src/styles.css      the stylesheet
//   src/manifest.json   the script's source files, in load order
//   src/js/**           the script, one file per job (ratings, career stages, league, saving, screens ...)
//
// The files are joined as they are: nothing is minified, wrapped or reordered, so every line of the
// built index.html is a line of exactly one source file, in manifest order. The script is still one
// classic <script> with shared top-level names; the manifest order is the load order, and a `const`
// must be listed before any file that uses it while the page is loading.
//
//   node tools/build.cjs            write index.html
//   node tools/build.cjs --check    exit 1 if index.html is not what the sources build (CI runs this)
//   node tools/build.cjs --where N  print the source file and line that built line N of index.html
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'index.html');
const CSS_MARK = '/*@@build:css@@*/';
const JS_MARK = '/*@@build:js@@*/';

function fail(msg) {
  console.error('build: ' + msg);
  process.exit(1);
}

// A source file as text. Sources are LF and end with a newline, so joining them never merges two lines.
function read(rel) {
  const file = path.join(SRC, rel);
  if (!fs.existsSync(file)) fail('missing source file src/' + rel);
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('\r')) fail('src/' + rel + ' has CRLF line endings; sources must be LF');
  if (!text.endsWith('\n')) fail('src/' + rel + ' must end with a newline');
  return text;
}

// The built page as a list of {rel, text} parts in output order (the shell appears three times).
function parts() {
  const manifest = JSON.parse(read('manifest.json'));
  if (!Array.isArray(manifest.js) || !manifest.js.length) fail('src/manifest.json needs a "js" list');
  const seen = new Set();
  for (const rel of manifest.js) {
    if (seen.has(rel)) fail('src/manifest.json lists js/' + rel + ' twice');
    seen.add(rel);
  }
  // A source file left out of the manifest would silently drop out of the game.
  const onDisk = [];
  (function walk(dir, prefix) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), prefix + e.name + '/');
      else if (e.name.endsWith('.js')) onDisk.push(prefix + e.name);
    }
  })(path.join(SRC, 'js'), '');
  const orphans = onDisk.filter((rel) => !seen.has(rel));
  if (orphans.length) fail('not in src/manifest.json: ' + orphans.map((r) => 'js/' + r).join(', '));

  const shell = read('index.html');
  const cssAt = shell.indexOf(CSS_MARK + '\n');
  const jsAt = shell.indexOf(JS_MARK + '\n');
  if (cssAt < 0 || jsAt < 0 || jsAt < cssAt) fail('src/index.html needs the css marker line, then the js marker line');
  if (shell.indexOf(CSS_MARK, cssAt + 1) >= 0 || shell.indexOf(JS_MARK, jsAt + 1) >= 0) fail('a marker appears twice in src/index.html');
  return [
    { rel: 'index.html', text: shell.slice(0, cssAt), line: 1 },
    { rel: 'styles.css', text: read('styles.css'), line: 1 },
    { rel: 'index.html', text: shell.slice(cssAt + CSS_MARK.length + 1, jsAt), line: lineOf(shell, cssAt) + 1 },
    ...manifest.js.map((rel) => ({ rel: 'js/' + rel, text: read('js/' + rel), line: 1 })),
    { rel: 'index.html', text: shell.slice(jsAt + JS_MARK.length + 1), line: lineOf(shell, jsAt) + 1 },
  ];
}

// 1-based line number of the character at `index`.
function lineOf(text, index) {
  let n = 1;
  for (let i = text.indexOf('\n'); i >= 0 && i < index; i = text.indexOf('\n', i + 1)) n++;
  return n;
}

const countLines = (text) => text.split('\n').length - 1;

function where(n) {
  let at = 1;
  for (const p of parts()) {
    const len = countLines(p.text);
    if (n < at + len) return 'src/' + p.rel + ':' + (p.line + n - at);
    at += len;
  }
  fail('index.html has no line ' + n);
}

const arg = process.argv[2];
if (arg === '--where') {
  const n = Number(process.argv[3]);
  if (!Number.isInteger(n) || n < 1) fail('usage: node tools/build.cjs --where <line of index.html>');
  console.log(where(n));
} else if (arg === '--check') {
  const built = parts().map((p) => p.text).join('');
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (built !== have) {
    const a = built.split('\n'), b = have.split('\n');
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    fail('index.html is not what src/ builds (first difference at line ' + (i + 1) + ', from ' + where(Math.min(i + 1, a.length - 1)) +
      '). Edit the files in src/, then run: node tools/build.cjs');
  }
  console.log('build: index.html matches src/ (' + countLines(built) + ' lines)');
} else if (arg === undefined) {
  const built = parts().map((p) => p.text).join('');
  fs.writeFileSync(OUT, built);
  console.log('build: wrote index.html (' + countLines(built) + ' lines, ' + Buffer.byteLength(built) + ' bytes)');
} else {
  fail('unknown option ' + arg + ' (use --check, --where <line>, or nothing to build)');
}
