import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The replayed AI answers used by scripts/record-demo-clips.mjs. Each one must
// fit the claim of the expense that carries the same receipt, so that a clip
// never shows an answer the receipt could not have produced.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = (n) => JSON.parse(readFileSync(join(ROOT, 'scripts', 'recording', 'fixtures', `example${n}.json`), 'utf8'));

// Receipt file, claimed currency and amount in expenses/script.js, total printed on the PDF.
const RECEIPTS = [
  { n: 1, currency: 'EUR', amount: 86.75, matches: true },
  { n: 2, currency: 'USD', amount: 2254.0, matches: true },
  { n: 3, currency: 'PLN', amount: 26.45, matches: false },
  { n: 4, currency: 'EUR', amount: 43.9, matches: true },
];

for (const { n, currency, amount, matches } of RECEIPTS) {
  test(`fixture for example${n}.pdf has the answer shape the agentlet reads`, () => {
    const answer = fixture(n);
    assert.equal(typeof answer.merchant, 'string');
    assert.equal(answer.currency, currency);
    assert.equal(answer.total, amount);
    assert.equal(answer.matches, matches);
    assert.ok(Array.isArray(answer.findings) && answer.findings.length >= 2);
    assert.ok(answer.findings.every((finding) => typeof finding === 'string' && finding.length < 100));
  });
}

test('the claimed amounts in the fixtures test match the app data', () => {
  const source = readFileSync(join(ROOT, 'expenses', 'script.js'), 'utf8');
  for (const { n, currency, amount } of RECEIPTS) {
    const block = new RegExp(`amount: ${amount.toFixed(2)},\\s*currency: "${currency}"[\\s\\S]*?receipt: "example${n}\\.pdf"`);
    assert.match(source, block, `example${n}.pdf claim in expenses/script.js`);
  }
});
