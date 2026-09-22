"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/components/navigation/AppSidebar";
import TopBar from "@/components/navigation/TopBar";

const STORAGE_KEY = "appSidebarExpanded";

/**
 * AppShell — wraps a single protected page's content with the app-wide
 * floating sidebar and top bar. This is the ONE thing every authenticated
 * page (everything except the public landing/auth/legal pages) should
 * render at its root, replacing what used to be six independently-built
 * header/sidebar combinations.
 *
 * Owns the sidebar's expand/collapse state (persisted to localStorage, so
 * the preference is shared across every page — collapse once, stay
 * collapsed everywhere) and keeps the content's left margin in lockstep
 * with the sidebar's current width.
 *
 * Props:
 *   title, subtitle, actions   → passed straight to TopBar
 *   sections, navMode,
 *   activeId, onSelect,
 *   sidebarFooter              → passed straight to AppSidebar (see its
 *                                docstring for "scroll" vs "action" mode)
 *   contentClassName           → override the default max-w-6xl content
 *                                container classes for pages needing a
 *                                different width or padding
 *   bottomBar                  → optional node rendered in a floating
 *                                rounded card (same visual language as
 *                                AppSidebar/TopBar) pinned to the bottom
 *                                and shifted with the sidebar, for pages
 *                                with a persistent wizard-style action bar
 *                                (blueprint-form). Pass only the bar's
 *                                inner content — AppShell supplies the
 *                                card chrome (bg/border/shadow/rounding).
 */
const AppShell = ({
    title,
    subtitle,
    actions,
    sections,
    navMode,
    activeId,
    onSelect,
    sidebarFooter,
    contentClassName = "max-w-6xl mx-auto px-6 py-8",
    bottomBar,
    children,
}) => {
    // Default to expanded so the server render and the client's first
    // (hydration) render agree — a lazy `useState(() => localStorage...)`
    // initializer would read the real stored value immediately on the
    // client's first render, before hydration, causing a server/client
    // mismatch whenever the user had previously collapsed the sidebar.
    // Reading the actual preference in an effect after mount is the
    // correct, hydration-safe way to sync from this client-only source.
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage (a client-only external system) once on mount, not deriving from other React state
            setExpanded(stored === "true");
        }
    }, []);

    const toggleExpanded = () => {
        setExpanded((v) => {
            localStorage.setItem(STORAGE_KEY, String(!v));
            return !v;
        });
    };

    return (
        <div className="nui min-h-screen bg-[var(--nui-canvas)] font-sans">
            <AppSidebar
                expanded={expanded}
                onToggleExpanded={toggleExpanded}
                sections={sections}
                navMode={navMode}
                activeId={activeId}
                onSelect={onSelect}
                sidebarFooter={sidebarFooter}
            />

            {/* 304px = 32px sidebar inset + 240px (w-60) sidebar width + 32px gap — not a
                step on Tailwind's default spacing scale (which jumps 72 -> 80), so this
                uses an explicit pixel value rather than a silently-no-op `ml-76`. */}
            {/* flex + gap-8 (not TopBar's own margin) creates the space between the
                top bar and the content below — gap is immune to margin-collapsing
                edge cases around `position: sticky` elements that a plain mb-8
                on TopBar itself was not reliably producing. */}
            <div className={[expanded ? "md:ml-[304px]" : "md:ml-32", "flex flex-col gap-8", "transition-[margin] duration-300"].join(" ")}>
                {title && <TopBar title={title} subtitle={subtitle} actions={actions} />}
                {/* `w-full` is required here, not cosmetic: this div is a flex item
                    (parent is `flex flex-col`), and a flex item with `mx-auto` but no
                    explicit width shrink-to-fits its own content instead of stretching
                    to fill the column — so `max-w-6xl mx-auto` alone silently renders at
                    whatever width that page's content happens to need, which visibly
                    changed the page's width per step on /blueprint-form (each step's
                    content has a different natural width). `w-full` gives it an
                    explicit 100% width first, which `max-w-*` then correctly caps and
                    `mx-auto` correctly centers only once the column is wider than that
                    cap. Affects every page using this default/overridden
                    contentClassName — not just the one that happened to make it visible. */}
                <div className={`w-full ${contentClassName}`}>{children}</div>
            </div>

            {bottomBar && (
                <div
                    className={[
                        "fixed bottom-8 left-8 right-8 z-30 transition-[left] duration-300",
                        expanded ? "md:left-[304px]" : "md:left-32",
                    ].join(" ")}
                >
                    {/* px-6 matches TopBar's own inset so the bottom bar's left/right edges
                        line up exactly with the top bar and the page content between them. */}
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="bg-[var(--nui-surface)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-2)] rounded-[var(--nui-r)] overflow-hidden">
                            {bottomBar}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppShell;
