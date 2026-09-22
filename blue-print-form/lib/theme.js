/**
 * lib/theme.js — the single source of truth for the two things that must
 * stay in exact sync: the localStorage key and the inline script that sets
 * `data-theme` on <html> before hydration.
 *
 * Not a React module — this is shared, unopinionated data/logic consumed by
 * both a plain <script> (app/layout.js, runs before React) and
 * ThemeContext.jsx (runs as React, after hydration). Keeping the constant
 * and the script logic in one file means they can never drift apart.
 */

export const THEME_STORAGE_KEY = "theme";
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Returns the inline script SOURCE (a plain string, not a function) that
 * app/layout.js embeds via `<script dangerouslySetInnerHTML>` as the very
 * first thing in <body>. It must run synchronously, before any content
 * paints, or the page flashes the wrong theme for one frame on every load —
 * exactly the problem `suppressHydrationWarning` on <html>/<body> (already
 * present in layout.js) exists to allow us to fix this way: read the stored
 * preference (falling back to the OS preference on a first visit), and set
 * the attribute directly via the DOM, before React ever touches the page.
 *
 * Deliberately plain string interpolation, not a template literal closure —
 * `dangerouslySetInnerHTML` needs the literal source text, not a compiled
 * function body.
 */
export function getThemeInitScript() {
    return `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var t=(s==="light"||s==="dark")?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t);}catch(e){}})();`;
}

/** Reads the theme currently applied to the DOM (set by the inline script
 * above, or by a previous toggle). Used only to seed React state after
 * mount — see ThemeContext.jsx for why this isn't read during the initial
 * render. */
export function readAppliedTheme() {
    if (typeof document === "undefined") return "light";
    const attr = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    return attr === "dark" ? "dark" : "light";
}

/** Applies a theme to both the DOM (so every `.nui`-scoped element and every
 * `dark:` utility across the whole app updates immediately, with no
 * re-render needed) and localStorage (so it persists across reloads and
 * navigation). Called by ThemeContext's toggle — never call this directly
 * from a component; use `useTheme()` instead so React state stays in sync
 * with the DOM. */
export function applyTheme(theme) {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Private browsing / storage disabled — theme still applies for
        // this page view, it just won't persist across a reload.
    }
}
