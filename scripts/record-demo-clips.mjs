#!/usr/bin/env node
// Records the two "before and after" demo clips of the Expenses app.
//
//   npm run record:demo                  record both clips into reports/demo-clips/
//   npm run record:demo -- --out <dir>   write the outputs somewhere else
//   npm run record:demo -- --part 2      record only one clip (1 or 2)
//   npm run record:demo -- --raw <dir>   also keep the untrimmed recordings and their timings
//   npm run record:demo -- --raw <dir> --encode-only   encode again from kept recordings
//   npm run record:demo -- --raw <dir> --no-encode       record and keep the raw clips only
//
// Part 1 replays the manual review of one expense. Part 2 injects the expenses
// agentlet and lets it check the receipts with AI. The AI is replayed, never
// live: the OpenAI endpoint is intercepted and answered from the fixtures in
// scripts/recording/fixtures/, with a short artificial latency. Any other
// request leaves the machine only if it goes to the local server; everything
// else is blocked.
//
// Needs: npm install, npx playwright install chromium, and ffmpeg on the PATH.
// Output per part: demo-part{N}.webm (VP9), .mp4 (H.264), -still.png (first
// frame) and .gif (palette optimised, for the README), plus a contact sheet.

import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RECORDING = join(ROOT, 'scripts', 'recording');
const CORE_DIST = join(ROOT, 'node_modules', 'agentlet-core', 'dist');
const AGENTLET_SOURCE = join(ROOT, 'agentlets', 'expenses', 'expenses-agentlet.js');

const VIEWPORT = { width: 1280, height: 720 };
const PLACEHOLDER_KEY = 'replayed-for-recording';
// Artificial latency of each replayed AI answer, per receipt.
const AI_LATENCY_MS = { 'example1.pdf': 1200, 'example2.pdf': 1400, 'example3.pdf': 1100, 'example4.pdf': 1300 };

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const step = (message) => console.log(`  ${message}`);

function parseArgs(argv) {
    const args = { out: join(ROOT, 'reports', 'demo-clips'), parts: [1, 2], raw: null, encodeOnly: false, encode: true };
    for (let i = 0; i < argv.length; i += 1) {
        if (argv[i] === '--out') args.out = resolve(argv[++i]);
        else if (argv[i] === '--part') args.parts = [Number(argv[++i])];
        else if (argv[i] === '--raw') args.raw = resolve(argv[++i]);
        else if (argv[i] === '--encode-only') args.encodeOnly = true;
        else if (argv[i] === '--no-encode') args.encode = false;
        else throw new Error(`Unknown argument: ${argv[i]}`);
    }
    return args;
}

/** Static file server for the repository root. */
function startServer() {
    const server = createServer((request, response) => {
        const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        let file = normalize(join(ROOT, urlPath));
        if (!file.startsWith(ROOT) || file.includes(`${join(ROOT, 'node_modules')}`)) {
            response.writeHead(403).end();
            return;
        }
        if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
        if (!existsSync(file)) {
            response.writeHead(404).end();
            return;
        }
        response.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
        response.end(readFileSync(file));
    });
    return new Promise((resolveServer) => {
        server.listen(0, '127.0.0.1', () => resolveServer({ server, origin: `http://127.0.0.1:${server.address().port}` }));
    });
}

function loadFixtures() {
    const fixtures = {};
    for (let i = 1; i <= 4; i += 1) {
        const name = `example${i}.pdf`;
        fixtures[name] = JSON.parse(readFileSync(join(RECORDING, 'fixtures', `example${i}.json`), 'utf8'));
    }
    return fixtures;
}

/**
 * Network policy of a recording: the local server is allowed, agentlet-core is
 * served from node_modules in place of the CDN, the OpenAI endpoint is
 * answered from the fixtures, and everything else is blocked and reported.
 */
async function installNetworkPolicy(context, origin, fixtures, blocked) {
    await context.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith(origin)) return route.continue();
        blocked.push(url);
        return route.abort();
    });

    await context.route(/^https:\/\/cdn\.jsdelivr\.net\/npm\/agentlet-core@[^/]+\/dist\//, (route) => {
        const file = new URL(route.request().url()).pathname.split('/dist/')[1];
        const path = join(CORE_DIST, normalize(file));
        if (!path.startsWith(CORE_DIST) || !existsSync(path)) return route.fulfill({ status: 404 });
        return route.fulfill({
            status: 200,
            body: readFileSync(path),
            headers: { 'content-type': MIME[extname(path)] ?? 'application/octet-stream', 'access-control-allow-origin': '*' },
        });
    });

    await context.route('https://api.openai.com/v1/chat/completions', async (route) => {
        const request = route.request();
        const key = request.headers().authorization;
        if (key !== `Bearer ${PLACEHOLDER_KEY}`) throw new Error('The replayed AI call carries an unexpected key');
        const body = request.postDataJSON();
        const text = body.messages[0].content.find((part) => part.type === 'text').text;
        const receipt = /Receipt file: (example\d\.pdf)/.exec(text)?.[1];
        if (!receipt || !fixtures[receipt]) return route.abort();
        await sleep(AI_LATENCY_MS[receipt]);
        return route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' },
            body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: JSON.stringify(fixtures[receipt]) } }] }),
        });
    });
}

/** Render the pages of a receipt PDF to PNG data URLs with agentlet-core (pdf.js), off camera. */
async function renderPdfPages(browser, origin, fixtures, receipt) {
    const context = await browser.newContext({ viewport: VIEWPORT });
    await installNetworkPolicy(context, origin, fixtures, []);
    const page = await context.newPage();
    await page.goto(`${origin}/expenses/index.html`);
    await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/agentlet-core@2.5.0/dist/agentlet-core.min.js' });
    const pages = await page.evaluate(async (name) => {
        await new window.AgentletCore.default().init();
        const blob = await fetch(`mock/${name}`).then((response) => response.blob());
        const file = new File([blob], name, { type: 'application/pdf' });
        return window.agentlet.ai.convertPDFToImages(file, { scale: 1.6, maxPages: 10, format: 'image/png' });
    }, receipt);
    await context.close();
    return pages;
}

// ---------------------------------------------------------------------------
// Pointer helpers: smooth, human-paced mouse movement with a visible cursor.
// ---------------------------------------------------------------------------

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

class Pointer {
    constructor(page) {
        this.page = page;
        this.x = VIEWPORT.width / 2;
        this.y = VIEWPORT.height / 2;
    }

    async place(x, y) {
        this.x = x;
        this.y = y;
        await this.page.mouse.move(x, y);
    }

    /** Move along a slightly curved path with ease in and out. */
    async moveTo(x, y, duration = 900) {
        const { x: x0, y: y0 } = this;
        const distance = Math.hypot(x - x0, y - y0);
        const time = Math.max(250, Math.min(duration, 250 + distance * 1.2));
        const bend = Math.min(40, distance * 0.08);
        const start = Date.now();
        for (;;) {
            const t = Math.min(1, (Date.now() - start) / time);
            const e = ease(t);
            const curve = Math.sin(Math.PI * e) * bend;
            await this.page.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e - curve);
            if (t >= 1) break;
            await sleep(12);
        }
        this.x = x;
        this.y = y;
    }

    async center(locator) {
        await locator.waitFor({ state: 'visible' });
        const box = await locator.boundingBox();
        return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }

    async click(locator, { duration, dx = 0, dy = 0, before = 150 } = {}) {
        const { x, y } = await this.center(locator);
        await this.moveTo(x + dx, y + dy, duration);
        await sleep(before);
        await this.page.mouse.down();
        await sleep(80);
        await this.page.mouse.up();
    }
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

async function openPendingList(page) {
    await page.goto(`${page.__origin}/expenses/index.html`);
    await page.locator('.nav-tab[data-tab="pending"]').click();
    await page.locator('#pending-expenses .expense-card').first().waitFor();
    // Let the first frames settle before the recorded part starts.
    await page.evaluate(() => document.fonts.ready);
}

async function partOne({ page, pointer, pdfPages }) {
    const hotelCard = page.locator('#pending-expenses .expense-card[data-expense-id="1"]');
    await sleep(700);

    await pointer.click(hotelCard.locator('.btn-primary'), { duration: 1100 });
    await page.locator('#expense-modal').waitFor({ state: 'visible' });
    await sleep(900);

    await pointer.click(page.locator('#download-receipt'), { duration: 1000 });
    await sleep(900);

    // The download opens in a document viewer outside the app.
    await page.evaluate((pages) => window.__openPdfViewer({ name: 'example2.pdf', pages }), pdfPages);
    await sleep(900);
    await pointer.moveTo(900, 420, 700);
    await page.evaluate(() => window.__scrollViewerTo({ top: 330, duration: 2400 }));
    await sleep(500);
    await pointer.moveTo(760, 560, 600);
    await page.evaluate(() => window.__scrollViewerTo({ page: 2, duration: 2200 }));
    await sleep(900);
    await page.evaluate(() => window.__scrollViewerTo({ top: document.getElementById('pdf-viewer-scroll').scrollTop + 420, duration: 1500 }));
    await sleep(1100);
    await pointer.click(page.locator('#pdf-viewer-close'), { duration: 900 });
    await page.waitForSelector('#pdf-viewer', { state: 'detached' });
    await sleep(400);

    for (const id of ['check-receipt', 'check-policy', 'check-business', 'check-dates']) {
        await pointer.click(page.locator(`label.checklist-item:has(#${id})`), { duration: 650, dx: -120 });
        await sleep(250);
    }
    await sleep(300);
    await pointer.click(page.locator('#expense-modal .btn-success'), { duration: 800 });
    await page.locator('.notification').first().waitFor();
    await sleep(1800);
}

async function partTwo({ page, pointer, agentletSource }) {
    await sleep(900);
    await pointer.moveTo(760, 470, 800);
    await sleep(300);

    // What the bookmarklet does: load the agentlet into the page.
    step('inject the agentlet');
    await page.addScriptTag({ content: agentletSource });
    const action = page.getByRole('button', { name: 'Validate all receipts with AI' });
    await action.waitFor();
    // Environment variables are normally set once in the panel; the key is a placeholder.
    await page.evaluate((key) => {
        window.agentlet.env.set('OPENAI_API_KEY', key);
        window.agentlet.ai.refresh();
    }, PLACEHOLDER_KEY);
    await sleep(1300);

    step('run the receipt validation');
    await pointer.click(action, { duration: 1100 });
    const approve = page.getByRole('button', { name: /^Approve \d matching expenses$/ });
    await approve.waitFor({ timeout: 60000 });
    await sleep(900);
    const results = page.getByText('Receipt check results');
    await results.waitFor();
    await pointer.moveTo(640, 600, 900);
    await sleep(3200);

    step('approve the matching expenses');
    await pointer.click(approve, { duration: 1000 });
    await page.getByText(/expenses approved, \d left to review/).waitFor({ timeout: 30000 });
    await sleep(2600);
}

// ---------------------------------------------------------------------------
// Encoding
// ---------------------------------------------------------------------------

function ffmpeg(args) {
    const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
}

function encode({ source, trimStart, duration, outDir, part }) {
    const base = join(outDir, `demo-part${part}`);
    const trim = ['-ss', trimStart.toFixed(3), '-t', duration.toFixed(3), '-i', source, '-an'];

    ffmpeg([...trim, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '37', '-pix_fmt', 'yuv420p',
        '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-r', '25', `${base}.webm`]);
    ffmpeg([...trim, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', '-r', '25', `${base}.mp4`]);
    ffmpeg(['-i', `${base}.mp4`, '-frames:v', '1', `${base}-still.png`]);
    // GIF for the README: no dithering keeps flat UI areas clean and the file small.
    ffmpeg(['-i', `${base}.mp4`, '-vf',
        'fps=10,scale=880:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=40:stats_mode=diff[p];'
        + '[b][p]paletteuse=dither=none:diff_mode=rectangle',
    '-loop', '0', `${base}.gif`]);
    // Contact sheet for review: one frame every 2 seconds.
    const rows = Math.ceil(Math.floor(duration / 2) / 4);
    ffmpeg(['-i', `${base}.mp4`, '-vf', `fps=1/2,scale=640:-1,tile=4x${rows}:padding=6:color=white`, '-frames:v', '1',
        '-update', '1', `${base}-sheet.png`]);
}

// ---------------------------------------------------------------------------

async function record(part, { browser, origin, fixtures, outDir, tmp, raw, encode: shouldEncode }) {
    const blocked = [];
    // Part 1 shows a receipt in a document viewer: render its pages before the camera runs.
    const pdfPages = part === 1 ? await renderPdfPages(browser, origin, fixtures, 'example2.pdf') : [];
    const t0 = Date.now();
    const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: 1,
        locale: 'en-US',
        colorScheme: 'light',
        recordVideo: { dir: tmp, size: VIEWPORT },
        acceptDownloads: true,
    });
    await installNetworkPolicy(context, origin, fixtures, blocked);
    await context.addInitScript({ path: join(RECORDING, 'cursor.js') });
    await context.addInitScript({ path: join(RECORDING, 'pdf-viewer.js') });

    const page = await context.newPage();
    page.__origin = origin;
    page.on('download', (download) => download.cancel().catch(() => {}));
    page.on('pageerror', (error) => console.error(`  page error: ${error.message}`));
    const video = page.video();

    const pointer = new Pointer(page);
    await openPendingList(page);
    await pointer.place(VIEWPORT.width / 2 + 160, 520);

    const started = Date.now();
    if (part === 1) {
        await partOne({ page, pointer, pdfPages });
    } else {
        await partTwo({ page, pointer, agentletSource: readFileSync(AGENTLET_SOURCE, 'utf8') });
    }
    const ended = Date.now();

    await context.close();
    const source = await video.path();
    if (blocked.length > 0) console.warn(`  blocked requests: ${[...new Set(blocked)].join(', ')}`);

    // The video starts when the page is created: drop everything before the scenario.
    const trimStart = (started - t0) / 1000;
    const duration = (ended - started) / 1000;
    if (raw) {
        mkdirSync(raw, { recursive: true });
        copyFileSync(source, join(raw, `part${part}.webm`));
        writeFileSync(join(raw, `part${part}.json`), JSON.stringify({ trimStart, duration }));
    }
    if (shouldEncode) {
        mkdirSync(outDir, { recursive: true });
        encode({ source, trimStart, duration, outDir, part });
    }
    console.log(`part ${part}: ${duration.toFixed(1)} s recorded`);
}

function encodeKept(part, { outDir, raw }) {
    const { trimStart, duration } = JSON.parse(readFileSync(join(raw, `part${part}.json`), 'utf8'));
    mkdirSync(outDir, { recursive: true });
    encode({ source: join(raw, `part${part}.webm`), trimStart, duration, outDir, part });
    console.log(`part ${part}: encoded ${duration.toFixed(1)} s`);
}

async function main() {
    const { out, parts, raw, encodeOnly, encode: shouldEncode } = parseArgs(process.argv.slice(2));
    if (encodeOnly) {
        for (const part of parts) encodeKept(part, { outDir: out, raw });
        return;
    }
    const tmp = mkdtempSync(join(tmpdir(), 'demo-clips-'));
    const { server, origin } = await startServer();
    const browser = await chromium.launch();
    const fixtures = loadFixtures();
    try {
        for (const part of parts) await record(part, { browser, origin, fixtures, outDir: out, tmp, raw, encode: shouldEncode });
    } finally {
        await browser.close();
        server.close();
        rmSync(tmp, { recursive: true, force: true });
    }
    console.log(`Clips written to ${out}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
