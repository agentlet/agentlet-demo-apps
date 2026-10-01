import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { findViolations, checkTree, listFiles } from '../scripts/check-typography.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'check-typography.mjs');
const EM = String.fromCodePoint(0x2014);
const EN = String.fromCodePoint(0x2013);
const DOT = String.fromCodePoint(0x00b7);
const BARCHART = String.fromCodePoint(0x1f4ca);

test('plain text has no violations', () => {
  assert.deepEqual(findViolations('Plain text, with a colon: and a hyphen - and (parentheses).'), []);
});

test('literal em dash, en dash and middle dot are reported with their position', () => {
  const found = findViolations(`line one\nab ${EM} cd ${EN} ef ${DOT} gh`);
  assert.deepEqual(found.map((v) => [v.line, v.rule]), [[2, 'em dash'], [2, 'en dash'], [2, 'middle dot']]);
  assert.equal(found[0].column, 4);
});

// The samples are assembled from parts so that this file does not contain them itself.
test('html entities and numeric references are reported', () => {
  const text = ['mdash;', 'ndash;', 'middot;', '#8212;', '#x2013;', '#183;'].map((body) => '&' + body).join(' ');
  assert.equal(findViolations(text).length, 6);
});

test('javascript escapes are reported', () => {
  const text = ['u2014', 'u2013', 'u00B7', 'u{2014}'].map((body) => '\\' + body).join(' ');
  assert.equal(findViolations(text).length, 4);
});

test('emoji are reported, ordinary symbols are not', () => {
  assert.equal(findViolations(`Report ${BARCHART}`).length, 1);
  assert.deepEqual(findViolations('Price: $5 + 3 x 2 = 11, 50% off, (c) &copy; &times; &rarr;'), []);
});

test('checkTree reads only the listed extensions and skips ignored folders', () => {
  const root = mkdtempSync(join(tmpdir(), 'typo-'));
  mkdirSync(join(root, 'node_modules'));
  mkdirSync(join(root, 'app'));
  writeFileSync(join(root, 'node_modules', 'bad.js'), `x ${EM} y`);
  writeFileSync(join(root, 'app', 'notes.txt'), `x ${EM} y`);
  writeFileSync(join(root, 'app', 'binary.pdf'), `x ${EM} y`);
  writeFileSync(join(root, 'app', 'index.html'), `<p>x ${EM} y</p>`);
  writeFileSync(join(root, 'app', 'ok.css'), 'a { color: red; }');
  assert.deepEqual(listFiles(root).map((f) => f.slice(root.length + 1)), ['app/index.html', 'app/ok.css']);
  const results = checkTree(root);
  assert.equal(results.length, 1);
  assert.equal(results[0].file, join('app', 'index.html'));
});

test('cli exits 1 on a violation and 0 on a clean tree', () => {
  const dirty = mkdtempSync(join(tmpdir(), 'typo-'));
  writeFileSync(join(dirty, 'a.md'), `a ${EM} b`);
  const bad = spawnSync(process.execPath, [SCRIPT, '--root', dirty], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /a\.md:1:3: em dash/);

  const clean = mkdtempSync(join(tmpdir(), 'typo-'));
  writeFileSync(join(clean, 'a.md'), 'a, b');
  const good = spawnSync(process.execPath, [SCRIPT, '--root', clean], { encoding: 'utf8' });
  assert.equal(good.status, 0);
});
