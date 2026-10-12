// In-page fake mouse cursor for screen recordings. Playwright videos do not
// show the pointer, so this draws one that follows the real mouse events.
// Injected with addInitScript, so it survives navigation.
(() => {
    if (window.__fakeCursor) return;

    const CURSOR_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
            <path d="M3 2 L3 22.5 L8.2 18.2 L11.6 26.4 L15 25 L11.6 17 L18.4 16.6 Z"
                fill="#ffffff" stroke="#111827" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>`;

    const state = { x: 640, y: 360 };

    function install() {
        const root = document.createElement('div');
        root.id = 'fake-cursor';
        root.style.cssText = [
            'position:fixed', 'left:0', 'top:0', 'width:0', 'height:0',
            'z-index:2147483647', 'pointer-events:none', 'will-change:transform',
        ].join(';');

        const arrow = document.createElement('div');
        arrow.innerHTML = CURSOR_SVG;
        arrow.style.cssText = 'position:absolute;left:-3px;top:-2px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))';
        root.appendChild(arrow);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fake-cursor-ripple {
                from { transform: translate(-50%, -50%) scale(.3); opacity: .55; }
                to { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
            }
            .fake-cursor-ripple {
                position: absolute; left: 0; top: 0; width: 40px; height: 40px; border-radius: 50%;
                background: rgba(31, 95, 168, .45); animation: fake-cursor-ripple .5s ease-out forwards;
            }`;
        root.appendChild(style);
        document.documentElement.appendChild(root);

        const place = (x, y) => {
            state.x = x;
            state.y = y;
            root.style.transform = `translate(${x}px, ${y}px)`;
        };
        place(state.x, state.y);

        addEventListener('mousemove', (event) => place(event.clientX, event.clientY), true);
        addEventListener('mousedown', () => {
            const ripple = document.createElement('div');
            ripple.className = 'fake-cursor-ripple';
            root.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }, true);
        window.__fakeCursor = { place };
    }

    if (document.documentElement) install();
    else document.addEventListener('DOMContentLoaded', install, { once: true });
})();
