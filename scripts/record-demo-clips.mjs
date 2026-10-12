#!/usr/bin/env node
// Records the two "before and after" demo clips of the Expenses app.
//
//   npm run record:demo                  record both clips into reports/demo-clips/
//   npm run record:demo -- --out <dir>   write the outputs somewhere else
//   npm run record:demo -- --part 2      record only one clip (1 or 2)
//   npm run record:demo -- --raw <dir>   also keep the trimmed 1280x720 master of each clip
//   npm run record:demo -- --raw <dir> --encode-only   encode again from kept masters
//   npm run record:demo -- --raw <dir> --no-encode       record and keep the masters only
//
// Part 1 replays the manual review of one expense. Part 2 injects the expenses
// agentlet and lets it check the receipts with AI. The AI is replayed, never
// live: the OpenAI endpoint is intercepted and answered from the fixtures in
// scripts/recording/fixtures/, with a short artificial latency. Any other
// request leaves the machine only if it goes to the local server; everything
// else is blocked.
//
// Frames come from the Chrome DevTools screencast of a page rendered at a device
// scale factor of 2 (2560x1440), not from Playwright's recordVideo, which is
// too soft for small text. They are placed on a steady 25 fps timeline by
// timestamp and downscaled once with lanczos into a lossless master.
//
// Needs: npm install, npx playwright install chromium, and ffmpeg on the PATH.
// Output per part: demo-part{N}.webm (VP9), .mp4 (H.264), -still.png (first
// frame) and .gif (palette optimised, for the README), plus a contact sheet.

import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RECORDING = join(ROOT, 'scripts', 'recording');
const CORE_DIST = join(ROOT, 'node_modules', 'agentlet-core', 'dist');
const AGENTLET_SOURCE = join(ROOT, 'agentlets', 'expenses', 'expenses-agentlet.js');

const VIEWPORT = { width: 1280, height: 720 };
const SCALE = 2;
const FPS = 25;
// A clip that runs longer than this is recorded again: a loaded machine stretches the real work.
const MAX_SECONDS = { 1: 35, 2: 40 };
const ATTEMPTS = 4;
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
        return window.agentlet.ai.convertPDFToImages(file, { scale: 2.5, maxPages: 10, format: 'image/png' });
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
    await sleep(500);
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
    await sleep(1000);

    step('run the receipt validation');
    await pointer.click(action, { duration: 1000 });
    const precheck = page.getByRole('button', { name: /^Pre-check \d matching expenses$/ });
    await precheck.waitFor({ timeout: 60000 });
    await sleep(500);
    await pointer.moveTo(640, 610, 800);
    await sleep(2300);

    step('review the matching expenses');
    await pointer.click(precheck, { duration: 800 });
    // The agentlet opens each matching expense with the receipt and date boxes ticked.
    // The reviewer ticks the two boxes left to them and approves: slowly on the first
    // expense, quicker on the next ones.
    const pace = [{ move: 650, pause: 220, hold: 500 }, { move: 380, pause: 80, hold: 150 }, { move: 380, pause: 80, hold: 150 }];
    for (const [index, { move, pause, hold }] of pace.entries()) {
        // Wait for the agentlet to finish: dialog open, two boxes ticked, the other two untouched, comment added.
        await page.waitForFunction(() => getComputedStyle(document.getElementById('expense-modal')).display !== 'none'
            && document.getElementById('check-receipt').checked
            && document.getElementById('check-dates').checked
            && !document.getElementById('check-policy').checked
            && !document.getElementById('check-business').checked
            && document.getElementById('approval-comments').value.length > 0, undefined, { timeout: 15000 });
        await sleep(index === 0 ? 600 : 100);
        for (const id of ['check-policy', 'check-business']) {
            await pointer.click(page.locator(`label.checklist-item:has(#${id})`), { duration: move, dx: -140, before: pause });
            await sleep(pause);
        }
        await sleep(hold);
        await pointer.click(page.locator('#expense-modal .btn-success'), { duration: move });
        await page.waitForFunction(() => getComputedStyle(document.getElementById('expense-modal')).display === 'none');
    }
    await page.getByText(/approved by you, \d left to review/).waitFor({ timeout: 30000 });
    await pointer.moveTo(560, 560, 800);
    await sleep(1800);
}

// ---------------------------------------------------------------------------
// Encoding
// ---------------------------------------------------------------------------

function ffmpeg(args) {
    const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
}

/**
 * Chrome DevTools screencast: a JPEG frame of the whole page, at full device
 * resolution, every time the page changes. Frames are written to disk as they
 * arrive and carry the time at which they were painted.
 */
async function startCapture(page, dir) {
    mkdirSync(dir, { recursive: true });
    const client = await page.context().newCDPSession(page);
    const frames = [];
    const writes = [];
    let announceFirst;
    const first = new Promise((resolveFirst) => { announceFirst = resolveFirst; });
    client.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
        const file = join(dir, `${String(frames.length).padStart(6, '0')}.jpg`);
        frames.push({ time: metadata.timestamp, file });
        writes.push(writeFile(file, Buffer.from(data, 'base64')));
        client.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
        announceFirst();
    });
    await client.send('Page.startScreencast', {
        format: 'jpeg', quality: 100, maxWidth: VIEWPORT.width * SCALE, maxHeight: VIEWPORT.height * SCALE, everyNthFrame: 1,
    });
    return {
        first,
        async stop() {
            await client.send('Page.stopScreencast');
            await Promise.all(writes);
            return frames;
        },
    };
}

/**
 * Turn timestamped frames into a steady 25 fps master between two instants:
 * each frame is held until the next one arrives, so quiet periods repeat the
 * last frame. The 2560x1440 frames are downscaled once with lanczos into a
 * lossless 1280x720 master.
 */
function buildMaster({ frames, start, end, dir, master }) {
    let from = frames.findLastIndex((frame) => frame.time <= start);
    if (from < 0) from = 0;
    const lines = [];
    for (let i = from; i < frames.length && frames[i].time < end; i += 1) {
        const shown = Math.max(frames[i].time, start);
        const until = i + 1 < frames.length ? Math.min(frames[i + 1].time, end) : end;
        if (until <= shown) continue;
        lines.push(`file '${frames[i].file}'`, `duration ${(until - shown).toFixed(4)}`);
    }
    // The concat demuxer ignores the duration of the last entry unless the file is repeated.
    lines.push(lines[lines.length - 2]);
    const list = join(dir, 'frames.txt');
    writeFileSync(list, lines.join('\n'));
    ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-an',
        '-vf', `fps=${FPS},scale=${VIEWPORT.width}:${VIEWPORT.height}:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv444p`,
        '-c:v', 'ffv1', '-level', '3', master]);
}

/** Duration of a media file in seconds, read from the ffmpeg banner (ffprobe is not always installed). */
function durationOf(path) {
    const banner = spawnSync('ffmpeg', ['-hide_banner', '-i', path], { encoding: 'utf8' }).stderr;
    const [, h, m, sec] = /Duration: (\d+):(\d+):([\d.]+)/.exec(banner);
    return Number(h) * 3600 + Number(m) * 60 + Number(sec);
}

function fileSize(path) {
    return statSync(path).size;
}

function encode({ master, outDir, part }) {
    const base = join(outDir, `demo-part${part}`);
    const input = ['-i', master, '-an'];

    ffmpeg([...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '26', '-pix_fmt', 'yuv420p',
        '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-g', '250', `${base}.webm`]);
    ffmpeg([...input, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', `${base}.mp4`]);
    ffmpeg([...input, '-frames:v', '1', '-update', '1', `${base}-still.png`]);

    // GIF for the README: no dithering keeps flat UI areas clean and the file small.
    // Narrower widths are tried until the file fits in 3 MB.
    for (const width of [960, 880, 800, 720]) {
        ffmpeg([...input, '-vf',
            `fps=10,scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];`
            + '[b][p]paletteuse=dither=none:diff_mode=rectangle',
        '-loop', '0', `${base}.gif`]);
        if (fileSize(`${base}.gif`) < 3 * 1024 * 1024) break;
    }

    // Contact sheet for review: one frame every 2 seconds.
    const rows = Math.ceil((Math.floor(durationOf(master) / 2) + 1) / 4);
    ffmpeg([...input, '-vf', `fps=1/2,scale=640:-1,tile=4x${rows}:padding=6:color=white`, '-frames:v', '1', '-update', '1', `${base}-sheet.png`]);
}

// ---------------------------------------------------------------------------

async function recordOnce(part, { browser, origin, fixtures, tmp, pdfPages }) {
    const blocked = [];
    const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: SCALE,
        locale: 'en-US',
        colorScheme: 'light',
        acceptDownloads: true,
    });
    await installNetworkPolicy(context, origin, fixtures, blocked);
    await context.addInitScript({ path: join(RECORDING, 'cursor.js') });
    await context.addInitScript({ path: join(RECORDING, 'pdf-viewer.js') });

    const page = await context.newPage();
    page.__origin = origin;
    page.on('download', (download) => download.cancel().catch(() => {}));
    page.on('pageerror', (error) => console.error(`  page error: ${error.message}`));

    const pointer = new Pointer(page);
    await openPendingList(page);
    const frameDir = join(tmp, `frames-part${part}`);
    const capture = await startCapture(page, frameDir);
    await pointer.place(VIEWPORT.width / 2 + 160, 520);
    await capture.first;
    await sleep(300);

    const start = Date.now() / 1000;
    if (part === 1) {
        await partOne({ page, pointer, pdfPages });
    } else {
        await partTwo({ page, pointer, agentletSource: readFileSync(AGENTLET_SOURCE, 'utf8') });
    }
    const end = Date.now() / 1000;

    const frames = await capture.stop();
    await context.close();
    if (blocked.length > 0) console.warn(`  blocked requests: ${[...new Set(blocked)].join(', ')}`);

    const master = join(tmp, `part${part}-master.mkv`);
    buildMaster({ frames, start, end, dir: tmp, master });
    return { master, seconds: end - start, frameCount: frames.length };
}

async function record(part, { browser, origin, fixtures, outDir, tmp, raw, encode: shouldEncode }) {
    // Part 1 shows a receipt in a document viewer: render its pages before the camera runs.
    const pdfPages = part === 1 ? await renderPdfPages(browser, origin, fixtures, 'example2.pdf') : [];
    let take;
    for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
        take = await recordOnce(part, { browser, origin, fixtures, tmp, pdfPages });
        if (take.seconds <= MAX_SECONDS[part]) break;
        console.warn(`  take ${attempt} ran ${take.seconds.toFixed(1)} s (limit ${MAX_SECONDS[part]} s)${attempt < ATTEMPTS ? ', recording again' : ''}`);
    }
    const { master } = take;
    if (raw) {
        mkdirSync(raw, { recursive: true });
        copyFileSync(master, join(raw, `part${part}-master.mkv`));
    }
    if (shouldEncode) {
        mkdirSync(outDir, { recursive: true });
        encode({ master, outDir, part });
    }
    console.log(`part ${part}: ${take.seconds.toFixed(1)} s recorded from ${take.frameCount} frames`);
}

function encodeKept(part, { outDir, raw }) {
    mkdirSync(outDir, { recursive: true });
    encode({ master: join(raw, `part${part}-master.mkv`), outDir, part });
    console.log(`part ${part}: encoded`);
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
