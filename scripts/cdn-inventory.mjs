#!/usr/bin/env node
// Inventory of external scripts and stylesheets referenced by the HTML files.
// Zero dependencies, Node >= 20.
//
//   node scripts/cdn-inventory.mjs --check            fail on unpinned or unverified resources
//   node scripts/cdn-inventory.mjs [--out <path>]     write a CycloneDX 1.5 SBOM
//
// Options: --root <dir> (default: repo root), --out <path>
// (default: reports/security/sbom-cdn.cdx.json), --allowlist <file>
// (default: scripts/cdn-allowlist.json), --check (no SBOM written unless --out is given).

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXACT_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'reports']);

/**
 * Parse a CDN URL into package information.
 * Returns { cdn, name, version, file, pinned, purl } or null for an unknown host.
 * `version` is the raw version segment (may be a range or tag); `pinned` is true
 * only for an exact semver; `file` is the explicit path inside the package ('' if none).
 */
export function parseCdnUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl);
  } catch {
    return null;
  }
  const segments = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);

  if (url.hostname === 'cdn.jsdelivr.net' && segments[0] === 'npm') {
    return parseNpmRef(segments.slice(1), 'jsdelivr');
  }
  if (url.hostname === 'unpkg.com') {
    return parseNpmRef(segments, 'unpkg');
  }
  if (url.hostname === 'cdnjs.cloudflare.com' && segments[0] === 'ajax' && segments[1] === 'libs') {
    const [, , name, version, ...rest] = segments;
    if (!name) return null;
    return {
      cdn: 'cdnjs',
      name,
      version: version ?? '',
      file: rest.join('/'),
      pinned: EXACT_VERSION.test(version ?? ''),
      purl: null,
    };
  }
  return null;
}

function parseNpmRef(segments, cdn) {
  let name;
  let rest;
  if (segments[0]?.startsWith('@')) {
    if (segments.length < 2) return null;
    // Scoped: @scope/pkg@version/file
    const [pkgSeg, ...tail] = segments.slice(1);
    const at = pkgSeg.indexOf('@');
    name = `${segments[0]}/${at === -1 ? pkgSeg : pkgSeg.slice(0, at)}`;
    rest = [at === -1 ? '' : pkgSeg.slice(at + 1), ...tail];
  } else {
    if (segments.length < 1) return null;
    const [pkgSeg, ...tail] = segments;
    const at = pkgSeg.indexOf('@');
    name = at === -1 ? pkgSeg : pkgSeg.slice(0, at);
    rest = [at === -1 ? '' : pkgSeg.slice(at + 1), ...tail];
  }
  const [version, ...fileParts] = rest;
  const pinned = EXACT_VERSION.test(version);
  return {
    cdn,
    name,
    version,
    file: fileParts.join('/'),
    pinned,
    purl: pinned ? npmPurl(name, version) : null,
  };
}

export function npmPurl(name, version) {
  // purl spec: the scope's "@" is percent-encoded in the namespace.
  const encoded = name.startsWith('@') ? `%40${name.slice(1)}` : name;
  return `pkg:npm/${encoded}@${version}`;
}

/** Extract external <script src> and <link rel=stylesheet href> references from HTML. */
export function extractExternalRefs(html) {
  const refs = [];
  const tagPattern = /<(script|link)\b[^>]*>/gi;
  let match;
  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0];
    const kind = match[1].toLowerCase();
    const attrs = parseAttributes(tag);
    let url;
    if (kind === 'script') url = attrs.src;
    else if (/\bstylesheet\b/i.test(attrs.rel ?? '')) url = attrs.href;
    if (!url || !/^(https?:)?\/\//i.test(url)) continue;
    refs.push({
      kind: kind === 'script' ? 'script' : 'stylesheet',
      url,
      integrity: attrs.integrity ?? '',
      crossorigin: attrs.crossorigin,
    });
  }
  return refs;
}

function parseAttributes(tag) {
  const attrs = {};
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  const body = tag.replace(/^<\w+/, '');
  let m;
  while ((m = pattern.exec(body)) !== null) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

const SRI_PATTERN = /^sha(256|384|512)-[A-Za-z0-9+/]+={0,2}$/;

export function hasValidIntegrity(value) {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every((t) => SRI_PATTERN.test(t));
}

/**
 * Evaluate references against the rules. allowlist is an array of
 * { url, reason }; an allowlisted URL is exempt from the version and
 * integrity rules and must carry a non-empty reason.
 * Returns { components, problems, warnings }.
 */
export function evaluate(refs, allowlist = []) {
  const problems = [];
  const warnings = [];
  const components = [];
  const allowed = new Map(allowlist.map((a) => [a.url, a]));

  for (const a of allowlist) {
    if (!a.url || !a.reason || !String(a.reason).trim()) {
      problems.push(`allowlist entry ${JSON.stringify(a)} needs both "url" and a non-empty "reason"`);
    }
  }

  for (const ref of refs) {
    const where = `${ref.file ?? 'html'}: ${ref.url}`;
    if (allowed.has(ref.url)) {
      warnings.push(`${where} is allowlisted (${allowed.get(ref.url).reason})`);
      continue;
    }
    const parsed = parseCdnUrl(ref.url);
    if (!parsed) {
      problems.push(`${where}: unknown host. Use jsDelivr, unpkg or cdnjs with an exact version, or add the URL to the allowlist with a reason.`);
      continue;
    }
    if (!parsed.pinned) {
      problems.push(`${where}: version "${parsed.version || '(none)'}" of ${parsed.name} is not an exact x.y.z version. Pin it, for example ${parsed.name}@1.2.3/dist/file.js.`);
    } else if (!parsed.file) {
      problems.push(`${where}: no explicit file path after the version. Reference the exact file, for example ${parsed.name}@${parsed.version}/dist/file.js.`);
    }
    if (!hasValidIntegrity(ref.integrity)) {
      problems.push(`${where}: missing or malformed integrity attribute (expected sha256-, sha384- or sha512- base64 digest).`);
    } else if (String(ref.crossorigin ?? '') !== 'anonymous' && ref.crossorigin !== '') {
      problems.push(`${where}: integrity requires crossorigin="anonymous".`);
    }
    if (parsed.pinned) {
      if (parsed.cdn === 'cdnjs') {
        warnings.push(`${where}: cdnjs library names do not reliably map to npm packages, emitting a component without purl.`);
      }
      components.push({ ...parsed, kind: ref.kind, url: ref.url, integrity: ref.integrity, file_in_repo: ref.file });
    }
  }
  return { components, problems, warnings };
}

/** Build a CycloneDX 1.5 BOM with one component per unique pinned package. */
export function buildSbom(components, { now = new Date(), name = 'agentlet-demo-apps' } = {}) {
  const byKey = new Map();
  for (const c of components) {
    const key = c.purl ?? `${c.cdn}:${c.name}@${c.version}`;
    if (!byKey.has(key)) byKey.set(key, { ...c, urls: new Set(), integrities: new Set() });
    const entry = byKey.get(key);
    entry.urls.add(c.url);
    if (c.integrity) entry.integrities.add(c.integrity);
  }
  const bomComponents = [...byKey.entries()].map(([key, c]) => {
    const component = {
      type: 'library',
      'bom-ref': c.purl ?? `cdn:${c.cdn}/${c.name}@${c.version}`,
      name: c.name,
      version: c.version,
      externalReferences: [...c.urls].map((url) => ({ type: 'distribution', url })),
    };
    if (c.purl) component.purl = c.purl;
    else component.properties = [{ name: 'agentlet:purl-unavailable', value: `${c.cdn} package names are not reliably mapped to npm` }];
    return component;
  });
  bomComponents.sort((a, b) => a['bom-ref'].localeCompare(b['bom-ref']));
  return {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    version: 1,
    metadata: {
      timestamp: now.toISOString(),
      component: { type: 'application', name, 'bom-ref': name },
      tools: { components: [{ type: 'application', name: 'cdn-inventory' }] },
    },
    components: bomComponents,
  };
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.html')) yield full;
  }
}

export function scanRepo(root) {
  const refs = [];
  for (const file of walk(root)) {
    for (const ref of extractExternalRefs(readFileSync(file, 'utf8'))) {
      refs.push({ ...ref, file: relative(root, file) });
    }
  }
  return refs;
}

function parseArgs(argv) {
  const opts = { check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') opts.check = true;
    else if (a === '--root') opts.root = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--allowlist') opts.allowlist = argv[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  return opts;
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const opts = parseArgs(process.argv.slice(2));
  const root = resolve(opts.root ?? join(here, '..'));
  const allowlistPath = resolve(opts.allowlist ?? join(root, 'scripts', 'cdn-allowlist.json'));
  const allowlist = existsSync(allowlistPath) ? JSON.parse(readFileSync(allowlistPath, 'utf8')) : [];

  const refs = scanRepo(root);
  const { components, problems, warnings } = evaluate(refs, allowlist);

  for (const w of warnings) console.warn(`warning: ${w}`);
  console.log(`${refs.length} external resource(s) found, ${components.length} pinned.`);
  for (const p of problems) console.error(`error: ${p}`);

  if (!opts.check || opts.out) {
    const out = resolve(root, opts.out ?? 'reports/security/sbom-cdn.cdx.json');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify(buildSbom(components), null, 2)}\n`);
    console.log(`SBOM written to ${relative(process.cwd(), out) || out}`);
  }
  if (problems.length > 0) {
    console.error(`cdn-inventory failed with ${problems.length} problem(s).`);
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
