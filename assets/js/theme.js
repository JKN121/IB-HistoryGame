/**
 * Shared theme store for Chrono.
 *
 * The landing pages (index.html, how-to-play.html) and the game (game.html) all
 * read and write the same localStorage key, so toggling the theme anywhere
 * carries over to every other page.
 *
 * Load this from <head> without `defer`: it stamps the mode onto <html> before
 * the first paint, which is what keeps dark-mode visitors from seeing a white
 * flash while the rest of the page loads.
 */
window.ChronoTheme = (function () {
    const STORAGE_KEY = 'chrono-theme';
    const DEFAULT_MODE = 'light';
    const listeners = new Set();

    // Storage throws in some privacy modes — fall back to the default rather than
    // taking the whole page down with it.
    function read() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : DEFAULT_MODE;
        } catch {
            return DEFAULT_MODE;
        }
    }

    function paint(mode) {
        const root = document.documentElement;
        root.classList.toggle('dark-mode', mode === 'dark');
        root.classList.toggle('light-mode', mode !== 'dark');
    }

    function notify(mode) {
        listeners.forEach(fn => fn(mode));
    }

    function set(mode) {
        const next = mode === 'dark' ? 'dark' : 'light';
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* preference just won't survive the session */
        }
        paint(next);
        notify(next);
        return next;
    }

    // Mirror changes made in other tabs, e.g. the landing page sitting open next
    // to the game.
    window.addEventListener('storage', e => {
        if (e.key !== STORAGE_KEY) return;
        const mode = read();
        paint(mode);
        notify(mode);
    });

    paint(read());

    return {
        get: read,
        isDark: () => read() === 'dark',
        set,
        toggle: () => set(read() === 'dark' ? 'light' : 'dark'),
        /** Registers a listener and returns an unsubscribe function. */
        onChange: fn => {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
    };
})();
