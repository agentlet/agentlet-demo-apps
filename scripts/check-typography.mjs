#!/usr/bin/env node
// Plain-punctuation check. Zero dependencies, Node >= 20.
//
//   node scripts/check-typography.mjs [--root <dir>]
//
// Fails (exit code 1) when a text file contains an em dash, an en dash or a
// middle dot, in literal form or as an HTML entity or JavaScript escape, or an
// emoji. Use a comma, a colon, parentheses or a plain hyphen instead, and an
// inline SVG icon instead of an emoji. Binary files are never read.
//
// The forbidden characters are built from code points below, so that this file
// does not contain them itself.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const EXTENSIONS = new Set(['.html', '.js', '.css', '.md', '.json', '.mjs', '.yml']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'reports']);

const NAMED = [
  [0x2014, 'em dash', 'mdash', '8212', '2014'],
  [0x2013, 'en dash', 'ndash', '8211', '2013'],
  [0x00b7, 'middle dot', 'middot', '183', '00b7'],
];

const RULES = [];
for (const [code, name, entity, decimal, hex] of NAMED) {
  RULES.push({ name, re: new RegExp(String.fromCodePoint(code), 'g') });
  RULES.push({ name: `${name} entity`, re: new RegExp(`&(?:${entity};|#${decimal};|#x${hex};)`, 'gi') });
  RULES.push({ name: `${name} escape`, re: new RegExp(`\\\\u\\{?${hex}\\}?`, 'gi') });
}
RULES.push({ name: 'emoji', re: new RegExp(`\\p{Emoji_Presentation}|${String.fromCodePoint(0xfe0f)}`, 'gu') });

/** Returns [{ line, column, rule, match }] for every violation in `text`. */
export function findViolations(text) {
  const found = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((content, i) => {
    for (const { name, re } of RULES) {
      re.lastIndex = 0;
      for (let m = re.exec(content); m; m = re.exec(content)) {
        found.push({ line: i + 1, column: m.index + 1, rule: name, match: m[0] });
      }
    }
  });
  return found;
}

/** Lists the text files under `root` that the check applies to. */
export function listFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      if (SKIP_DIRS.has(entry)) continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (EXTENSIONS.has(extname(entry).toLowerCase())) files.push(full);
    }
  };
  walk(root);
  return files.sort();
}

/** Checks every applicable file under `root`; returns [{ file, line, column, rule }]. */
export function checkTree(root) {
  const results = [];
  for (const file of listFiles(root)) {
    for (const v of findViolations(readFileSync(file, 'utf8'))) {
      results.push({ file: relative(root, file), ...v });
    }
  }
  return results;
}

function main(argv) {
  const rootIndex = argv.indexOf('--root');
  const root = resolve(rootIndex >= 0 ? argv[rootIndex + 1] : fileURLToPath(new URL('..', import.meta.url)));
  const results = checkTree(root);
  for (const r of results) console.error(`${r.file}:${r.line}:${r.column}: ${r.rule}`);
  if (results.length > 0) {
    console.error(`\n${results.length} typography problem(s). Use plain punctuation (comma, colon, parentheses, hyphen) and SVG icons instead of emoji.`);
    return 1;
  }
  console.log(`Typography check passed (${listFiles(root).length} files).`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
