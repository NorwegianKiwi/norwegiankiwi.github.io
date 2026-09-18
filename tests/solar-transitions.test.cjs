const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

const source = readFileSync(new URL('../solar-transitions.js', `file://${__filename}`), 'utf8');
const fallbackSource = readFileSync(new URL('../solar-transitions-fallback.js', `file://${__filename}`), 'utf8');
const key = 'solar-navigation-snapshot';
const rect = { x: 100, y: 200, width: 30, height: 30, opacity: '0.4' };
const snapshot = (changes = {}) => JSON.stringify({
    from: 'home', to: 'contents', time: Date.now(),
    planets: { cv: rect, geography: rect, puzzle: rect }, ...changes
});

function setup({ value, reduced = false, blocked = false, native = false, history = false, fallback = true, readyState = 'loading' } = {}) {
    const events = {};
    const documentEvents = {};
    const classes = new Set();
    const storage = new Map(value ? [[key, value]] : []);
    const assets = [];
    const timers = new Map();
    const dataset = {};
    const animations = [];
    let timerId = 0;
    const window = {
        addEventListener: (name, handler) => { events[name] = handler; },
        matchMedia: () => ({ matches: reduced })
    };
    if (native) Object.assign(window, { onpageswap: null, onpagereveal: null });
    runInNewContext(source + (fallback ? '\n' + fallbackSource : ''), {
        window, URL, Element: { prototype: { animate() {} } },
        location: { href: 'https://example.test/contents.html', origin: 'https://example.test', pathname: '/contents.html' },
        performance: { getEntriesByType: () => [{ type: history ? 'back_forward' : 'navigate' }] },
        setTimeout: fn => { timers.set(++timerId, fn); return timerId; },
        clearTimeout: id => timers.delete(id),
        document: {
            readyState,
            head: { append: element => assets.push(element) },
            createElement: tag => ({ tagName: tag, remove() {} }),
            documentElement: { dataset, classList: {
                add: (...names) => names.forEach(name => classes.add(name)),
                remove: (...names) => names.forEach(name => classes.delete(name))
            } },
            addEventListener: (name, handler) => { documentEvents[name] = handler; },
            querySelectorAll: () => [],
            querySelector: selector => selector === 'main' ? {
                animate: (frames, options) => {
                    animations.push({ frames, options });
                    return { finished: Promise.resolve(), cancel() {} };
                }
            } : null
        },
        sessionStorage: {
            getItem: name => { if (blocked) throw Error('blocked'); return storage.get(name); },
            removeItem: name => { if (blocked) throw Error('blocked'); storage.delete(name); },
            setItem: (name, value) => { if (blocked) throw Error('blocked'); storage.set(name, value); }
        }
    });
    return { events, documentEvents, classes, storage, assets, timers, dataset, animations };
}

test('native browsers keep native listeners and do not install fallback', () => {
    const state = setup({ native: true, value: snapshot() });
    assert.equal(typeof state.events.pagereveal, 'function');
    assert.equal(state.events.pagehide, undefined);
    assert.equal(state.storage.has(key), true);
    assert.equal(state.assets.length, 0);
});

test('native transitions work with the fallback file removed', () => {
    const state = setup({ native: true, fallback: false });
    assert.equal(typeof state.events.pageswap, 'function');
    assert.equal(typeof state.events.pagereveal, 'function');
    assert.equal(state.events.pagehide, undefined);
});

test('before the fallback loads, no click or pagehide handlers delay navigation', () => {
    const state = setup({ fallback: false });
    assert.equal(Object.keys(state.events).length, 0);
    assert.equal(Object.keys(state.documentEvents).length, 0);
    assert.equal(state.classes.size, 0);
});

test('unsupported browsers request CSS first, then load the fallback script', () => {
    const state = setup({ fallback: false });
    assert.equal(state.assets.length, 1);
    assert.equal(state.assets[0].href, 'solar-transitions-fallback.css?v=1');
    state.assets[0].onload();
    assert.equal(state.assets[1].src, 'solar-transitions-fallback.js?v=2');
});

test('reduced motion avoids both fallback downloads', () => {
    const state = setup({ fallback: false, reduced: true });
    assert.equal(state.assets.length, 0);
});

test('incoming content is protected until loading completes or fails', () => {
    const state = setup({ fallback: false, value: snapshot() });
    assert.equal(state.classes.has('solar-fallback-pending'), true);
    state.assets.find(asset => asset.tagName === 'link').onerror();
    assert.equal(state.classes.size, 0);
    assert.equal(state.dataset.solarFallbackExpired, 'true');
});

test('a slow fallback load releases the page and suppresses late animation', () => {
    const state = setup({ fallback: false, value: snapshot() });
    for (const fn of state.timers.values()) fn();
    assert.equal(state.classes.size, 0);
    assert.equal(state.dataset.solarFallbackExpired, 'true');
});

test('fallback consumes a matching snapshot before first render', () => {
    const state = setup({ value: snapshot() });
    assert.equal(state.classes.has('solar-fallback-pending'), true);
    assert.equal(typeof state.documentEvents.DOMContentLoaded, 'function');
    assert.equal(state.storage.has(key), false);
    assert.equal(state.events.pagereveal, undefined);
});

test('fallback arriving after DOMContentLoaded starts without waiting for another event', () => {
    const state = setup({ value: snapshot(), readyState: 'complete' });
    assert.equal(state.documentEvents.DOMContentLoaded, undefined);
    assert.equal(state.animations.length, 1);
    assert.equal(state.animations[0].options.duration, 500);
    assert.equal(state.classes.has('solar-fallback-pending'), false);
});

test('reduced motion neither prepares nor records an animation', () => {
    const state = setup({ value: snapshot(), reduced: true });
    state.events.pagehide();
    assert.equal(state.classes.size, 0);
    assert.equal(state.storage.size, 0);
});

test('blocked storage leaves ordinary navigation available', () => {
    const state = setup({ blocked: true });
    assert.doesNotThrow(() => state.events.pagehide());
    assert.equal(state.classes.size, 0);
});

test('stale, malformed, same-page, and unrelated snapshots are ignored', () => {
    for (const value of [
        '{', snapshot({ time: Date.now() - 9000 }), snapshot({ from: 'contents' }),
        snapshot({ to: 'home' }), snapshot({ to: 'other' }), snapshot({ planets: {} }), snapshot({ time: null })
    ]) {
        const state = setup({ value });
        assert.equal(state.classes.size, 0);
        assert.equal(state.storage.size, 0);
    }
});

test('a destination-free history snapshot only applies to back/forward', () => {
    const value = snapshot({ to: null });
    assert.equal(setup({ value }).classes.size, 0);
    assert.equal(setup({ value, history: true }).classes.has('solar-fallback-pending'), true);
});
