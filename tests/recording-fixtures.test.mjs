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

// Receipt file, claimed currency, amount and date in expenses/script.js, as printed on the PDF.
const RECEIPTS = [
  { n: 1, currency: 'EUR', amount: 86.75, date: '2017-11-24', employee: 'Jens Walter', matches: true },
  { n: 2, currency: 'USD', amount: 2254.0, date: '2019-12-01', employee: 'Jens Walter', matches: true },
  { n: 3, currency: 'PLN', amount: 26.45, date: '2020-02-25', employee: 'Elena Petrova', matches: false },
  { n: 4, currency: 'EUR', amount: 43.9, date: '2021-03-19', employee: 'Jens Walter', matches: true },
];

for (const { n, currency, amount, date, matches } of RECEIPTS) {
  test(`fixture for example${n}.pdf has the answer shape the agentlet reads`, () => {
    const answer = fixture(n);
    assert.equal(typeof answer.merchant, 'string');
    assert.equal(answer.currency, currency);
    assert.equal(answer.total, amount);
    assert.equal(answer.date, date);
    assert.equal(answer.matches, matches);
    assert.ok(Array.isArray(answer.findings) && answer.findings.length >= 2);
    assert.ok(answer.findings.every((finding) => typeof finding === 'string' && finding.length < 100));
  });
}

test('the claims in this test match the app data', () => {
  const source = readFileSync(join(ROOT, 'expenses', 'script.js'), 'utf8');
  for (const { n, currency, amount, date, employee } of RECEIPTS) {
    const block = new RegExp(
      `employee: "${employee}",\\s*amount: ${amount.toFixed(2)},\\s*currency: "${currency}"[^}]*?date: "${date}"[^}]*?receipt: "example${n}\\.pdf"`,
    );
    assert.match(source, block, `example${n}.pdf claim in expenses/script.js`);
  }
});
