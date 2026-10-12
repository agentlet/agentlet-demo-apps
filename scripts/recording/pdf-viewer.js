// In-page stand-in for the PDF viewer that opens after a receipt download.
// Headless Chromium has no built-in PDF viewer and a recording must not show
// browser chrome, so the pages (rendered beforehand with pdf.js) are shown in
// a plain full-window document viewer: dark toolbar, grey desk, white pages.
(() => {
    window.__openPdfViewer = ({ name, pages }) => {
        const overlay = document.createElement('div');
        overlay.id = 'pdf-viewer';
        overlay.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:2147483000', 'display:flex', 'flex-direction:column',
            'background:#525659', 'font:13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
            'opacity:0', 'transition:opacity .25s ease',
        ].join(';');

        const bar = document.createElement('div');
        bar.style.cssText = 'flex:none;height:44px;display:flex;align-items:center;gap:16px;padding:0 16px;background:#323639;color:#f1f3f4;';
        const title = document.createElement('span');
        title.textContent = name;
        title.style.cssText = 'flex:1;font-weight:500;font-size:14px;';
        const counter = document.createElement('span');
        counter.id = 'pdf-viewer-counter';
        counter.textContent = `1 / ${pages.length}`;
        const zoom = document.createElement('span');
        zoom.textContent = '100%';
        zoom.style.cssText = 'padding:4px 8px;border-radius:4px;background:#202124;';
        const close = document.createElement('button');
        close.id = 'pdf-viewer-close';
        close.type = 'button';
        close.textContent = 'Close';
        close.style.cssText = 'height:28px;padding:0 12px;border:1px solid #5f6368;border-radius:4px;background:transparent;color:#f1f3f4;font:inherit;cursor:pointer;';
        close.addEventListener('click', () => window.__closePdfViewer());
        bar.append(title, counter, zoom, close);

        const scroller = document.createElement('div');
        scroller.id = 'pdf-viewer-scroll';
        scroller.style.cssText = 'flex:1;overflow:auto;padding:16px 0;scrollbar-width:none;';
        const imgs = pages.map((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.style.cssText = 'display:block;width:640px;max-width:90%;margin:0 auto 14px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4);';
            scroller.appendChild(img);
            return img;
        });
        scroller.addEventListener('scroll', () => {
            const middle = scroller.scrollTop + scroller.clientHeight / 2;
            let current = 0;
            imgs.forEach((img, index) => { if (img.offsetTop <= middle) current = index; });
            counter.textContent = `${current + 1} / ${pages.length}`;
        });

        overlay.append(bar, scroller);
        document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });
    };

    window.__closePdfViewer = () => {
        const overlay = document.getElementById('pdf-viewer');
        if (!overlay) return;
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 260);
    };

    // Ease the viewer to a vertical position (px, or the top of page n) over a duration.
    window.__scrollViewerTo = ({ top, page, duration }) => new Promise((resolve) => {
        const scroller = document.getElementById('pdf-viewer-scroll');
        const target = page !== undefined
            ? scroller.querySelectorAll('img')[page].offsetTop - 16
            : top;
        const from = scroller.scrollTop;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            scroller.scrollTop = from + (target - from) * eased;
            if (t < 1) requestAnimationFrame(step);
            else resolve();
        };
        requestAnimationFrame(step);
    });
})();
