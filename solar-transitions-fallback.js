// Optional compatibility layer. Native transitions work without this file.
(() => {
    if ('onpageswap' in window && 'onpagereveal' in window) return;
    if (!Element.prototype.animate) return;

    const storageKey = 'solar-navigation-snapshot';
    const root = document.documentElement;
    const home = new URL('index.html', location.href);
    const contents = new URL('contents.html', location.href);
    const isHome = url => url.pathname === home.pathname || url.pathname === new URL('.', home).pathname;
    const pageKind = url => isHome(url) ? 'home' : url.pathname === contents.pathname ? 'contents' : null;
    const currentKind = pageKind(new URL(location.href));
    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let destination = null;
    let cleanup = () => {};
    let fallbackRun = 0;

    function capture(element) {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
            x: rect.x, y: rect.y, width: rect.width, height: rect.height,
            opacity: style.opacity, background: style.background, filter: style.filter
        };
    }

    // This also records the departure position for browser back/forward navigation.
    // No navigation is intercepted and no page content is stored.
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
        const url = new URL(link.href);
        destination = (url.origin === location.origin && pageKind(url)) || 'other';
    });

    window.addEventListener('pagehide', () => {
        cleanup();
        try {
            sessionStorage.removeItem(storageKey);
            if (reducedMotion()) return;
            const planets = {};
            document.querySelectorAll('[data-planet]').forEach(element => {
                planets[element.dataset.planet] = capture(element);
            });
            const sun = document.querySelector('.central-light');
            sessionStorage.setItem(storageKey, JSON.stringify({
                from: currentKind, to: destination, time: Date.now(), planets,
                sun: sun ? capture(sun) : null
            }));
        } catch {
            // Storage can be unavailable; ordinary navigation still works.
        }
        destination = null;
    });

    function takeSnapshot(historyNavigation) {
        try {
            const value = sessionStorage.getItem(storageKey);
            sessionStorage.removeItem(storageKey);
            if (!value || reducedMotion()) return null;
            const snapshot = JSON.parse(value);
            if (!Number.isFinite(snapshot.time) || Date.now() - snapshot.time > 8000 || snapshot.from === currentKind ||
                !['home', 'contents'].includes(snapshot.from) ||
                (snapshot.to !== currentKind && !(snapshot.to === null && historyNavigation))) return null;
            const validRect = rect => rect && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(rect[key])) &&
                rect.width > 0 && rect.height > 0;
            if (!['cv', 'geography', 'puzzle'].every(key => validRect(snapshot.planets?.[key]))) return null;
            if (snapshot.sun && !validRect(snapshot.sun)) return null;
            return snapshot;
        } catch {
            return null;
        }
    }

    function reveal(snapshot) {
        cleanup();
        if (!snapshot || reducedMotion()) return;
        const overlays = [];
        const hidden = [];
        const animations = [];
        const run = ++fallbackRun;
        let timer;
        cleanup = () => {
            if (run !== fallbackRun) return;
            ++fallbackRun;
            clearTimeout(timer);
            animations.forEach(animation => animation.cancel());
            overlays.forEach(element => element.remove());
            hidden.forEach(([element, visibility]) => { element.style.visibility = visibility; });
            root.classList.remove('solar-transition-active', 'solar-fallback-pending');
        };
        const options = { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' };
        try {
            root.classList.add('solar-transition-active');
            document.querySelectorAll('[data-planet]').forEach(element => {
                const from = snapshot.planets[element.dataset.planet];
                const to = capture(element);
                const clone = element.cloneNode(true);
                clone.removeAttribute('data-planet');
                clone.setAttribute('aria-hidden', 'true');
                Object.assign(clone.style, {
                    position: 'fixed', left: `${to.x}px`, top: `${to.y}px`,
                    width: `${to.width}px`, height: `${to.height}px`, margin: '0',
                    pointerEvents: 'none', zIndex: '19', transformOrigin: '0 0',
                    transition: 'none', visibility: 'visible'
                });
                document.body.append(clone);
                overlays.push(clone);
                hidden.push([element, element.style.visibility]);
                element.style.visibility = 'hidden';
                animations.push(clone.animate([
                    { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: from.opacity },
                    { transform: 'none', opacity: to.opacity }
                ], options));
            });
            if (snapshot.sun) {
                const sun = document.createElement('div');
                const from = snapshot.sun;
                sun.setAttribute('aria-hidden', 'true');
                Object.assign(sun.style, {
                    position: 'fixed', left: `${from.x}px`, top: `${from.y}px`,
                    width: `${from.width}px`, height: `${from.height}px`,
                    background: from.background, filter: from.filter, borderRadius: '50%',
                    pointerEvents: 'none', zIndex: '18'
                });
                document.body.append(sun);
                overlays.push(sun);
                animations.push(sun.animate([{ opacity: from.opacity }, { opacity: 0 }], options));
            }
            const main = document.querySelector('main');
            animations.push(main.animate([{ opacity: 0 }, { opacity: 1 }], options));
            root.classList.remove('solar-fallback-pending');
            const finish = cleanup;
            timer = setTimeout(finish, 1000);
            Promise.all(animations.map(animation => animation.finished)).then(finish, finish);
        } catch {
            cleanup();
        }
    }

    const saved = takeSnapshot(performance.getEntriesByType('navigation')[0]?.type === 'back_forward');
    const initial = root.dataset.solarFallbackExpired ? null : saved;
    root.classList.remove('solar-fallback-pending');
    if (initial) {
        root.classList.add('solar-fallback-pending');
        // Never leave content hidden if loading or animation setup fails.
        const timeout = setTimeout(() => {
            root.dataset.solarFallbackExpired = 'true';
            root.classList.remove('solar-fallback-pending');
        }, 1500);
        const start = () => {
            clearTimeout(timeout);
            reveal(root.dataset.solarFallbackExpired ? null : initial);
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', start, { once: true });
        } else {
            start();
        }
    }
    window.addEventListener('pageshow', event => {
        if (event.persisted) reveal(takeSnapshot(true));
    });
})();
