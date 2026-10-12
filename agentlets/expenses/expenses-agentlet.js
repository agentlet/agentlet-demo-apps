// Expenses agentlet for the Westbrook Expenses demo app (expenses/).
//
// It adds a side panel with one action: check every pending receipt with AI,
// then approve the expenses whose receipt matches the claim. It is written as
// a bookmarklet payload, so it loads agentlet-core itself when the page does
// not have it yet. Plain modern JavaScript, no build step.
//
// Load it from the console or a bookmarklet:
//   const s = document.createElement('script');
//   s.src = 'https://agentlet.github.io/agentlet-demo-apps/agentlets/expenses/expenses-agentlet.js';
//   document.head.appendChild(s);
//
// AI calls need OPENAI_API_KEY (and optionally OPENAI_MODEL, OPENAI_BASE_URL)
// in the agentlet environment variables.
(async () => {
    'use strict';

    const CORE_URL = 'https://cdn.jsdelivr.net/npm/agentlet-core@2.5.0/dist/agentlet-core.min.js';
    const MODULE_NAME = 'expenses';
    const CURRENCY_BY_SYMBOL = { '$': 'USD', '€': 'EUR', 'zł': 'PLN' };

    /**
     * @typedef {object} PendingExpense
     * @property {string} id App expense id (data-expense-id on the card)
     * @property {string} employee
     * @property {string} description
     * @property {number} amount
     * @property {string} currency ISO code
     * @property {string} receipt Receipt file name (data-receipt on the card)
     */

    /**
     * @typedef {object} ReceiptCheck
     * @property {PendingExpense} expense
     * @property {boolean} matches
     * @property {string} merchant
     * @property {number} total
     * @property {string[]} findings
     * @property {string | null} thumbnail Data URL of the first receipt page
     * @property {string | null} error
     */

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Could not load ${src}`));
            document.head.appendChild(script);
        });
    }

    if (!window.agentlet) {
        await loadScript(CORE_URL);
        await new window.AgentletCore.default().init();
    }
    if (window.agentlet.modules.get(MODULE_NAME)) return;

    const { Dialog } = window.agentlet.utils;

    /** Small DOM helper: element with class, text and children. */
    function el(tag, className, text, children = []) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        for (const child of children) node.appendChild(child);
        return node;
    }

    /** Read the pending expenses from the cards of the pending tab. */
    function readPendingExpenses() {
        /** @type {PendingExpense[]} */
        const expenses = [];
        for (const card of document.querySelectorAll('#pending-expenses .expense-card')) {
            const receipt = card.dataset.receipt;
            const amountText = card.querySelector('.expense-amount')?.textContent?.trim() ?? '';
            const parsed = /^(\$|€|zł)\s*([\d,]+(?:\.\d+)?)$/.exec(amountText);
            if (!receipt || !parsed) continue;
            expenses.push({
                id: card.dataset.expenseId ?? '',
                employee: card.querySelector('.expense-employee')?.textContent?.trim() ?? '',
                description: card.querySelector('.expense-description')?.textContent?.trim() ?? '',
                amount: Number(parsed[2].replace(/,/g, '')),
                currency: CURRENCY_BY_SYMBOL[parsed[1]],
                receipt,
            });
        }
        return expenses;
    }

    /** Amount with the same symbol the app shows, e.g. $2,254.00, \u20ac86.75 or z\u014226.45. */
    function formatMoney(amount, currency) {
        const symbol = Object.keys(CURRENCY_BY_SYMBOL).find((key) => CURRENCY_BY_SYMBOL[key] === currency) ?? '';
        const digits = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
        return `${symbol}${digits}`;
    }

    /** Ask the model to compare one receipt with its claim; returns the parsed JSON answer. */
    async function askModel(expense, file) {
        const prompt = [
            'You check an expense receipt against an expense claim.',
            'The receipt is attached as page images.',
            '',
            `Receipt file: ${expense.receipt}`,
            `Claimed description: ${expense.description}`,
            `Claimed amount: ${expense.amount.toFixed(2)} ${expense.currency}`,
            '',
            'Reply with JSON only, no markdown, in this shape:',
            '{"merchant": "name printed on the receipt", "total": 0.00, "currency": "ISO code",',
            ' "matches": true, "findings": ["short sentence", "short sentence"]}',
            '"matches" is true only when the receipt total, currency, merchant and purchased items fit the claim.',
            'Give two or three findings, each under 100 characters.',
        ].join('\n');
        const reply = await window.agentlet.ai.sendPromptWithPDF(prompt, file, {
            pdfOptions: { scale: 1.5, maxPages: 3 },
        });
        const json = reply.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
        return JSON.parse(json);
    }

    /** Fetch a receipt, render its first page as a thumbnail and check it with AI. */
    async function checkReceipt(expense, onThumbnail) {
        /** @type {ReceiptCheck} */
        const result = { expense, matches: false, merchant: '', total: 0, findings: [], thumbnail: null, error: null };
        try {
            const response = await fetch(new URL(`mock/${expense.receipt}`, location.href));
            if (!response.ok) throw new Error(`Receipt ${expense.receipt} not found`);
            const file = new File([await response.blob()], expense.receipt, { type: 'application/pdf' });

            const [thumbnail] = await window.agentlet.ai.convertPDFToImages(file, {
                scale: 0.6,
                maxPages: 1,
                format: 'image/jpeg',
            });
            result.thumbnail = thumbnail ?? null;
            onThumbnail(result.thumbnail);

            const answer = await askModel(expense, file);
            result.merchant = String(answer.merchant ?? '');
            result.total = Number(answer.total);
            result.findings = Array.isArray(answer.findings) ? answer.findings.map(String) : [];
            // Trust the model for wording, not for arithmetic: the total is compared here.
            result.matches = answer.matches === true
                && answer.currency === expense.currency
                && Math.abs(result.total - expense.amount) < 0.005;
        } catch (error) {
            result.error = error instanceof Error ? error.message : String(error);
        }
        return result;
    }

    /** Progress dialog: a live element handed to the fullscreen dialog as custom content. */
    function createProgressView(total) {
        const status = el('p', 'xa-progress-status', 'Starting');
        const bar = el('div', 'xa-bar-fill');
        const thumbs = el('div', 'xa-thumbs');
        const root = el('div', 'xa-progress', undefined, [
            status,
            el('div', 'xa-bar', undefined, [bar]),
            el('h4', undefined, 'Receipts read'),
            thumbs,
        ]);
        return {
            root,
            update(index, expense) {
                status.textContent = `Receipt ${index + 1} of ${total}: ${expense.employee}, ${expense.description}`;
                bar.style.width = `${(index / total) * 100}%`;
            },
            addThumbnail(expense, src) {
                const image = el('img', 'xa-thumb-img');
                image.src = src;
                image.alt = `Receipt for ${expense.description}`;
                thumbs.appendChild(el('figure', 'xa-thumb', undefined, [
                    image,
                    el('figcaption', undefined, formatMoney(expense.amount, expense.currency)),
                ]));
            },
            done() {
                bar.style.width = '100%';
            },
        };
    }

    function createResultsView(results) {
        const rows = results.map((result) => {
            const { expense } = result;
            const badge = el(
                'span',
                `xa-badge ${result.error ? 'xa-badge-error' : result.matches ? 'xa-badge-ok' : 'xa-badge-warn'}`,
                result.error ? 'Check failed' : result.matches ? 'Matches' : 'Needs review',
            );
            // Matching receipts need two facts, a receipt that needs review gets all of them.
            const reasons = result.error ? [result.error] : result.matches ? result.findings.slice(0, 2) : result.findings;
            const thumb = el('div', 'xa-result-thumb');
            if (result.thumbnail) {
                const image = el('img');
                image.src = result.thumbnail;
                image.alt = '';
                thumb.appendChild(image);
            }
            return el('li', 'xa-result', undefined, [
                thumb,
                el('div', 'xa-result-body', undefined, [
                    el('div', 'xa-result-head', undefined, [
                        el('strong', undefined, expense.employee),
                        el('span', 'xa-result-desc', expense.description),
                        el('strong', 'xa-result-amount', formatMoney(expense.amount, expense.currency)),
                        badge,
                    ]),
                    el('ul', 'xa-reasons', undefined, reasons.map((reason) => el('li', undefined, reason))),
                ]),
            ]);
        });
        return el('ul', 'xa-results', undefined, rows);
    }

    /** Approve one pending expense through the app's own review dialog. */
    async function approveThroughUi(expenseId, comment) {
        const card = document.querySelector(`#pending-expenses .expense-card[data-expense-id="${expenseId}"]`);
        card?.querySelector('.expense-actions button')?.click();
        await sleep(450);
        for (const box of document.querySelectorAll('#expense-modal .checklist-item input[type="checkbox"]')) {
            box.checked = true;
            await sleep(110);
        }
        document.getElementById('approval-comments').value = comment;
        await sleep(350);
        document.querySelector('#expense-modal .approval-actions .btn-success')?.click();
        await sleep(600);
    }

    class ExpensesAgentlet extends window.agentlet.Module {
        constructor() {
            super({
                name: MODULE_NAME,
                version: '1.0.0',
                description: 'Checks pending receipts with AI in the Westbrook Expenses demo app',
                patterns: '/expenses/',
            });
            /** @type {HTMLElement | null} */
            this.summary = null;
        }

        getPanelTitle() {
            return 'Expense automation';
        }

        getStyles() {
            return `
                .xa-panel { display: flex; flex-direction: column; gap: 16px; }
                .xa-panel h2 { margin: 0 0 4px; font-size: 18px; }
                .xa-panel p { margin: 0; color: #5b6573; font-size: 13px; line-height: 1.45; }
                .xa-panel h3 { margin: 0 0 8px; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: #5b6573; }
                .xa-action { display: block; width: 100%; padding: 10px 12px; border: 1px solid #1f5fa8; border-radius: 6px;
                    background: #1f5fa8; color: #fff; font: inherit; font-size: 14px; font-weight: 500; text-align: left; cursor: pointer; }
                .xa-action:hover { background: #194f8c; }
                .xa-summary { padding: 10px 12px; border: 1px solid #d8dde4; border-radius: 6px; background: #f6f8fa; font-size: 13px; }
                .xa-summary[hidden] { display: none; }
                .xa-progress { min-width: 460px; }
                .xa-progress h4 { margin: 18px 0 10px; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: #5b6573; }
                .xa-progress-status { margin: 0 0 12px; font-size: 15px; }
                .xa-bar { height: 6px; border-radius: 3px; background: #e3e7ec; overflow: hidden; }
                .xa-bar-fill { width: 0; height: 100%; background: #1f5fa8; transition: width .4s ease; }
                .xa-thumbs { display: flex; gap: 16px; min-height: 210px; }
                .xa-thumb { margin: 0; width: 112px; text-align: center; font-size: 13px; color: #5b6573; }
                .xa-thumb-img { display: block; width: 112px; height: 156px; object-fit: cover; object-position: top;
                    border: 1px solid #d8dde4; border-radius: 4px; background: #fff; margin-bottom: 4px; }
                .xa-results { list-style: none; margin: -6px 0 0; padding: 0; min-width: 560px; }
                .xa-result { display: flex; gap: 14px; padding: 7px 0; border-bottom: 1px solid #e3e7ec; }
                .xa-result:last-child { border-bottom: 0; }
                .xa-result-thumb { flex: none; width: 44px; height: 60px; border: 1px solid #d8dde4; border-radius: 4px; overflow: hidden; background: #fff; }
                .xa-result-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
                .xa-result-body { flex: 1; min-width: 0; }
                .xa-result-head { display: flex; align-items: center; gap: 12px; font-size: 14px; }
                .xa-result-head > strong:first-child { flex: none; min-width: 96px; }
                .xa-result-desc { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; color: #5b6573; }
                .xa-result-amount { flex: none; min-width: 84px; text-align: right; }
                .xa-result-head + .xa-reasons { margin-top: 4px; }
                .xa-reasons { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.35; }
                .xa-badge { flex: none; padding: 2px 8px; border: 1px solid; border-radius: 4px; font-size: 12px; font-weight: 500; }
                .xa-badge-ok { color: #1c6b3c; background: #e8f5ec; border-color: #b7dfc4; }
                .xa-badge-warn { color: #8a5a00; background: #fff4dc; border-color: #f0d79c; }
                .xa-badge-error { color: #a12626; background: #fdecec; border-color: #f2bcbc; }
            `;
        }

        async mount(container) {
            const action = el('button', 'xa-action', 'Validate all receipts with AI');
            action.type = 'button';
            action.addEventListener('click', () => this.validateAllReceipts());
            this.summary = el('div', 'xa-summary');
            this.summary.hidden = true;
            container.replaceChildren(el('div', 'xa-panel', undefined, [
                el('div', undefined, undefined, [
                    el('h2', undefined, 'Expense automation'),
                    el('p', undefined, 'Read each pending receipt, compare it with the claim and approve the ones that match.'),
                ]),
                el('div', undefined, undefined, [el('h3', undefined, 'Receipts'), action]),
                this.summary,
            ]));
        }

        async validateAllReceipts() {
            if (!window.agentlet.ai.isAvailable()) {
                Dialog.warning('Set OPENAI_API_KEY in the agentlet environment variables to use the AI checks.');
                return;
            }
            document.querySelector('.nav-tab[data-tab="pending"]')?.click();
            const expenses = readPendingExpenses();
            if (expenses.length === 0) {
                Dialog.info('No pending expenses with a receipt to check.');
                return;
            }

            let cancelled = false;
            const progress = createProgressView(expenses.length);
            Dialog.show('fullscreen', {
                title: 'Checking receipts',
                icon: '',
                customContent: progress.root,
                showHeaderCloseButton: false,
                closeOnOverlay: false,
                buttons: [{ text: 'Cancel', value: 'cancel' }],
            }, (value) => {
                if (value === 'cancel') cancelled = true;
            });

            /** @type {ReceiptCheck[]} */
            const results = [];
            for (const [index, expense] of expenses.entries()) {
                if (cancelled) return;
                progress.update(index, expense);
                results.push(await checkReceipt(expense, (src) => src && progress.addThumbnail(expense, src)));
            }
            if (cancelled) return;
            progress.done();
            await sleep(500);
            Dialog.hide();
            this.showResults(results);
        }

        showResults(results) {
            const matching = results.filter((result) => result.matches);
            const review = results.length - matching.length;
            if (this.summary) {
                this.summary.hidden = false;
                this.summary.textContent = `${matching.length} of ${results.length} receipts match their claim, ${review} to review.`;
            }

            const body = createResultsView(results);
            const buttons = [{ text: 'Close', value: 'close' }];
            if (matching.length > 0) {
                buttons.unshift({ text: `Approve ${matching.length} matching expenses`, value: 'approve', primary: true });
            }
            Dialog.show('fullscreen', {
                title: 'Receipt check results',
                icon: '',
                customContent: body,
                buttons,
            }, (value) => {
                if (value === 'approve') this.approveMatching(matching);
            });
        }

        async approveMatching(matching) {
            for (const result of matching) {
                await approveThroughUi(result.expense.id, 'Receipt checked with AI: total and merchant match the claim.');
            }
            if (this.summary) {
                this.summary.textContent = `${matching.length} expenses approved, ${readPendingExpenses().length} left to review.`;
            }
        }
    }

    window.agentlet.modules.register(new ExpensesAgentlet());
})();
