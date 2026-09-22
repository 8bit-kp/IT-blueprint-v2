"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { applyTheme, readAppliedTheme } from "@/lib/theme";

const ThemeContext = createContext();

/**
 * ThemeProvider — global light/dark theme state for the whole app.
 *
 * The actual theme is already applied to the DOM before this ever mounts
 * (see lib/theme.js's inline script, embedded in app/layout.js) — that's
 * what prevents a flash of the wrong theme on load. This provider's job is
 * narrower: give components a React-friendly way to *read* the current
 * theme (for the sidebar toggle's icon/label) and *change* it (persisting
 * to localStorage and updating the DOM immediately, same as every other
 * `.nui` element already does via the CSS custom properties reacting to
 * the `data-theme` attribute).
 *
 * `useState(() => "light")` — not a lazy initializer reading the DOM/
 * localStorage — is deliberate: the server always renders "light" (it has
 * no access to the user's stored preference), so the client's first render
 * must match that exactly or React discards and re-renders the whole tree.
 * The real value is read from the DOM (already correct, set by the inline
 * script) in an effect right after mount — the same hydration-safe pattern
 * AppShell already uses for its sidebar-collapsed state.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the DOM attribute the inline script already set (a client-only source), once on mount, not deriving from other React state
        setTheme(readAppliedTheme());
    }, []);

    const setThemeAndPersist = useCallback((next) => {
        applyTheme(next);
        setTheme(next);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((current) => {
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeAndPersist, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/** `{ theme: "light" | "dark", setTheme(next), toggleTheme() }` */
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider (see app/layout.js)");
    }
    return ctx;
};
