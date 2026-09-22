"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NuiReveal — one-shot fade + 10px rise as an element scrolls into view.
 *
 * Purely decorative: it never gates content behind JS in a way that could
 * hide real data. If IntersectionObserver is unavailable the child is
 * revealed on mount, and `prefers-reduced-motion: reduce` neutralises the
 * animation entirely in tokens.css.
 *
 * `delay` staggers siblings (use small values — 0/60/120ms — so a grid
 * assembles rather than crawls).
 */
const NuiReveal = ({ as: Tag = "div", delay = 0, className = "", children, ...rest }) => {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // No IntersectionObserver (very old browsers, some test runners):
        // reveal on the next frame rather than synchronously in the effect
        // body, so this stays a callback-driven update like the observer path.
        if (typeof IntersectionObserver === "undefined") {
            const raf = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(raf);
        }

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) { setShown(true); obs.disconnect(); }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`nui-reveal ${className}`}
            data-in={shown ? "1" : "0"}
            style={{ "--nui-delay": `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default NuiReveal;
