(() => {
    if (!('onpageswap' in window && 'onpagereveal' in window)) {
        loadFallback();
        return;
    }

    function loadFallback() {
        if (!Element.prototype.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const root = document.documentElement;
        const storageKey = 'solar-navigation-snapshot';
        let pending = false;
        try {
            const snapshot = JSON.parse(sessionStorage.getItem(storageKey));
            const home = new URL('index.html', location.href);
            const currentKind = location.pathname === new URL('contents.html', home).pathname ? 'contents' : 'home';
            const history = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
            pending = snapshot && Number.isFinite(snapshot.time) && Date.now() - snapshot.time < 8000 &&
                ['home', 'contents'].includes(snapshot.from) && snapshot.from !== currentKind &&
                (snapshot.to === currentKind || (snapshot.to === null && history));
        } catch {
            // Storage is optional; loading the compatibility layer must not block links.
        }

        // Cover the incoming page before the optional stylesheet arrives.
        const guard = document.createElement('style');
        guard.textContent = '.solar-fallback-pending main { opacity: 0; }';
        if (pending) {
            root.classList.add('solar-fallback-pending');
            document.head.append(guard);
        }
        const release = () => {
            root.classList.remove('solar-fallback-pending');
            guard.remove();
        };
        const fail = () => {
            root.dataset.solarFallbackExpired = 'true';
            release();
        };
        // A slow or failed load shows the page normally, never a late animation.
        const timeout = setTimeout(fail, 1500);
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'solar-transitions-fallback.css?v=1';
        stylesheet.onerror = () => { clearTimeout(timeout); fail(); };
        stylesheet.onload = () => {
            const script = document.createElement('script');
            script.src = 'solar-transitions-fallback.js?v=2';
            script.onerror = () => { clearTimeout(timeout); fail(); };
            script.onload = () => {
                clearTimeout(timeout);
                guard.remove();
            };
            document.head.append(script);
        };
        document.head.append(stylesheet);
    }

    let activeTransition;

    function settleTransition(transition) {
        // A restored page may already be participating in a newer transition.
        if (activeTransition !== transition) return;
        document.documentElement.classList.remove('solar-transition-active');
        activeTransition = undefined;
    }

    function prepareTransition(event) {
        const transition = event.viewTransition;
        if (!transition) {
            settleTransition(activeTransition);
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            transition.skipTransition();
            settleTransition(activeTransition);
            return;
        }

        activeTransition = transition;
        document.documentElement.classList.add('solar-transition-active');
        // Outgoing transitions normally reject ready when the page is hidden.
        transition.ready.catch(() => {});
        transition.finished.then(
            () => settleTransition(transition),
            () => settleTransition(transition)
        );
    }

    // Registered by a parser-blocking head script before the first render.
    window.addEventListener('pageswap', prepareTransition);
    window.addEventListener('pagereveal', prepareTransition);
})();
