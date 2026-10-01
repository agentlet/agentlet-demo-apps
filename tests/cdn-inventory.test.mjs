import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseCdnUrl, extractExternalRefs, evaluate, buildSbom, npmPurl } from '../scripts/cdn-inventory.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'cdn-inventory.mjs');
const SRI = 'sha384-jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ';

test('jsdelivr npm url with version and file path', () => {
  const r = parseCdnUrl('https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js');
  assert.equal(r.name, 'chart.js');
  assert.equal(r.version, '4.5.1');
  assert.equal(r.file, 'dist/chart.umd.min.js');
  assert.equal(r.pinned, true);
  assert.equal(r.purl, 'pkg:npm/chart.js@4.5.1');
});

test('jsdelivr npm url without version or file path is not pinned', () => {
  const r = parseCdnUrl('https://cdn.jsdelivr.net/npm/chart.js');
  assert.equal(r.name, 'chart.js');
  assert.equal(r.pinned, false);
  assert.equal(r.purl, null);
});

test('jsdelivr ranges and tags are not pinned', () => {
  for (const v of ['4', '4.5', '^4.5.1', 'latest', '4.x']) {
    assert.equal(parseCdnUrl(`https://cdn.jsdelivr.net/npm/chart.js@${v}/dist/chart.umd.min.js`).pinned, false, v);
  }
});

test('jsdelivr version without file path parses with empty file', () => {
  const r = parseCdnUrl('https://cdn.jsdelivr.net/npm/chart.js@4.5.1');
  assert.equal(r.pinned, true);
  assert.equal(r.file, '');
});

test('scoped package', () => {
  const r = parseCdnUrl('https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js');
  assert.equal(r.name, '@popperjs/core');
  assert.equal(r.version, '2.11.8');
  assert.equal(r.file, 'dist/umd/popper.min.js');
  assert.equal(r.purl, 'pkg:npm/%40popperjs/core@2.11.8');
  assert.equal(npmPurl('@a/b', '1.0.0'), 'pkg:npm/%40a/b@1.0.0');
});

test('unversioned scoped package', () => {
  const r = parseCdnUrl('https://cdn.jsdelivr.net/npm/@popperjs/core');
  assert.equal(r.name, '@popperjs/core');
  assert.equal(r.pinned, false);
});

test('unpkg', () => {
  const r = parseCdnUrl('https://unpkg.com/lodash@4.17.21/lodash.min.js');
  assert.equal(r.cdn, 'unpkg');
  assert.equal(r.name, 'lodash');
  assert.equal(r.purl, 'pkg:npm/lodash@4.17.21');
  assert.equal(parseCdnUrl('https://unpkg.com/lodash').pinned, false);
});

test('cdnjs has no purl', () => {
  const r = parseCdnUrl('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js');
  assert.equal(r.cdn, 'cdnjs');
  assert.equal(r.name, 'Chart.js');
  assert.equal(r.version, '4.4.0');
  assert.equal(r.pinned, true);
  assert.equal(r.purl, null);
});

test('unknown host returns null', () => {
  assert.equal(parseCdnUrl('https://example.com/lib.js'), null);
  assert.equal(parseCdnUrl('not a url'), null);
});

test('extractExternalRefs finds external scripts and stylesheets only', () => {
  const html = `
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.example/css?family=X">
    <link rel="icon" href="https://example.com/favicon.ico">
    <script src="script.js"></script>
    <script src='//cdn.jsdelivr.net/npm/a@1.0.0/x.js' integrity="${SRI}" crossorigin></script>
    <script>var s = "https://example.com/inline.js";</script>`;
  const refs = extractExternalRefs(html);
  assert.equal(refs.length, 2);
  assert.equal(refs[0].kind, 'stylesheet');
  assert.equal(refs[1].url, '//cdn.jsdelivr.net/npm/a@1.0.0/x.js');
  assert.equal(refs[1].integrity, SRI);
});

const good = { kind: 'script', file: 'a.html', url: 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js', integrity: SRI, crossorigin: 'anonymous' };

test('evaluate accepts a pinned resource with integrity', () => {
  const r = evaluate([good]);
  assert.deepEqual(r.problems, []);
  assert.equal(r.components.length, 1);
});

test('evaluate rejects unpinned, missing integrity, missing crossorigin, unknown host, missing file', () => {
  const r = evaluate([
    { ...good, url: 'https://cdn.jsdelivr.net/npm/chart.js' },
    { ...good, integrity: '' },
    { ...good, crossorigin: undefined },
    { ...good, url: 'https://example.com/x.js' },
    { ...good, url: 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1' },
  ]);
  assert.equal(r.problems.some((p) => p.includes('not an exact')), true);
  assert.equal(r.problems.some((p) => p.includes('integrity attribute')), true);
  assert.equal(r.problems.some((p) => p.includes('crossorigin')), true);
  assert.equal(r.problems.some((p) => p.includes('unknown host')), true);
  assert.equal(r.problems.some((p) => p.includes('explicit file path')), true);
});

test('allowlist exempts a url and requires a reason', () => {
  const font = { kind: 'stylesheet', file: 'a.html', url: 'https://fonts.example/css?family=X', integrity: '' };
  assert.deepEqual(evaluate([font], [{ url: font.url, reason: 'fonts are unversioned' }]).problems, []);
  assert.equal(evaluate([font], [{ url: font.url, reason: '' }]).problems.length > 0, true);
});

test('cdnjs component warns and has no purl in the sbom', () => {
  const ref = { ...good, url: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js' };
  const r = evaluate([ref]);
  assert.equal(r.warnings.length, 1);
  const bom = buildSbom(r.components, { now: new Date('2026-01-01T00:00:00Z') });
  assert.equal(bom.components[0].purl, undefined);
  assert.equal(bom.components[0]['bom-ref'], 'cdn:cdnjs/Chart.js@4.4.0');
});

test('sbom is CycloneDX 1.5 with one component per package', () => {
  const r = evaluate([good, { ...good, file: 'b.html' }]);
  const bom = buildSbom(r.components);
  assert.equal(bom.bomFormat, 'CycloneDX');
  assert.equal(bom.specVersion, '1.5');
  assert.equal(bom.components.length, 1);
  const c = bom.components[0];
  assert.equal(c.name, 'chart.js');
  assert.equal(c.version, '4.5.1');
  assert.equal(c.purl, 'pkg:npm/chart.js@4.5.1');
  assert.equal(c['bom-ref'], c.purl);
  assert.equal(c.externalReferences[0].url, good.url);
});

function runCli(files, args) {
  const root = mkdtempSync(join(tmpdir(), 'cdn-inv-'));
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), content);
  }
  const res = spawnSync(process.execPath, [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
  return { root, ...res };
}

test('cli --check passes on a pinned page and fails on an unpinned one', () => {
  const pinned = `<script src="${good.url}" integrity="${SRI}" crossorigin="anonymous"></script>`;
  assert.equal(runCli({ 'a/index.html': pinned }, ['--check']).status, 0);
  const bad = runCli({ 'a/index.html': '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>' }, ['--check']);
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /not an exact/);
});

test('cli writes the sbom to the requested path', () => {
  const pinned = `<script src="${good.url}" integrity="${SRI}" crossorigin="anonymous"></script>`;
  const out = join(mkdtempSync(join(tmpdir(), 'cdn-out-')), 'x', 'sbom.json');
  const res = runCli({ 'index.html': pinned }, ['--out', out]);
  assert.equal(res.status, 0);
  assert.equal(JSON.parse(readFileSync(out, 'utf8')).components[0].purl, 'pkg:npm/chart.js@4.5.1');
});
