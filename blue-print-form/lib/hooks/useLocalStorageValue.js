"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Hydration-safe READ of a localStorage value.
 *
 * A plain `useState(() => localStorage.getItem(key))` lazy initializer looks
 * convenient but causes a server/client hydration mismatch whenever the
 * stored value differs from the SSR default (localStorage doesn't exist on
 * the server, so the server always renders the default; the client's first
 * render would render the *real* stored value instead, and React discards
 * and re-renders the whole tree).
 *
 * `useSyncExternalStore` is React's sanctioned fix for exactly this: it
 * takes a separate `getServerSnapshot` so the server render and the
 * client's hydration pass agree, then re-reads the real value right after
 * hydration completes — no manual effect, no lint suppression needed.
 *
 * Read-only. For a value that also needs to persist writes (e.g. a
 * collapse toggle), pair a plain `useState` seeded with the same default
 * with a `useEffect` that reads localStorage once on mount.
 */
export function useLocalStorageValue(key, defaultValue = "") {
    return useSyncExternalStore(
        noopSubscribe,
        () => localStorage.getItem(key) ?? defaultValue,
        () => defaultValue,
    );
}
