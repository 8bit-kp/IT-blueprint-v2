"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { notify } from "@/lib/notify";
import {
    FiHome, FiClipboard, FiFileText, FiGrid, FiShield,
    FiChevronLeft, FiChevronRight, FiLogOut, FiUser, FiCheck,
} from "react-icons/fi";
import { authAPI } from "@/utils/api";
import { useLocalStorageValue } from "@/lib/hooks/useLocalStorageValue";

/**
 * AppSidebar
 *
 * The one floating, rounded, collapsible sidebar used on every authenticated
 * page (everything except the public landing page, auth, and legal pages).
 * Visually generalises the sidebar first built for /assessment-report.
 *
 * Always shows the same primary cross-page navigation, plus an optional
 * "This Page" section of page-specific contextual links, plus a persistent
 * identity + logout footer — the three things that should look and behave
 * identically everywhere so the app reads as one connected flow rather than
 * six independently-built headers/sidebars.
 *
 * Two contextual navigation modes:
 *   - "scroll" (default): `sections` are anchor ids already present in the
 *     page DOM. The sidebar tracks scroll position itself (IntersectionObserver)
 *     and calls `scrollIntoView` on click — the caller does not need to manage
 *     active state. Used by assessment-report, assessment-complete,
 *     blueprint-summary, all-blueprints.
 *   - "action": the caller controls `activeId` and receives clicks via
 *     `onSelect(id)` — nothing auto-scrolls. Used by blueprint-form (steps)
 *     and blueprint-dashboard (dashboard type switch).
 *
 * Not rendered directly by pages — use `AppShell`, which owns the
 * expand/collapse state and the content margin that must stay in sync with it.
 */

const PRIMARY_NAV = [
    { href: "/", label: "Home", Icon: FiHome },
    { href: "/blueprint-form", label: "Assessment", Icon: FiClipboard },
    { href: "/blueprint-summary", label: "Summary", Icon: FiFileText },
    { href: "/all-blueprints", label: "Reports", Icon: FiGrid },
    { href: "/assessment-report", label: "Security Score", Icon: FiShield },
];

const AppSidebar = ({
    expanded,
    onToggleExpanded,
    sections = [],
    navMode = "scroll",
    activeId: controlledActiveId,
    onSelect,
    sidebarFooter,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const [scrollActiveId, setScrollActiveId] = useState(sections[0]?.id);
    const observerRef = useRef(null);

    const username = useLocalStorageValue("username");
    const companyName = useLocalStorageValue("userCompanyName");

    // Scroll-spy — only active in "scroll" mode, and only while sections exist.
    useEffect(() => {
        if (navMode !== "scroll" || !sections.length) return;
        const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
        if (!elements.length) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length > 0) setScrollActiveId(visible[0].target.id);
            },
            { rootMargin: "-15% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
        );
        elements.forEach((el) => observerRef.current.observe(el));
        return () => observerRef.current?.disconnect();
    }, [navMode, sections]);

    const activeId = navMode === "scroll" ? scrollActiveId : controlledActiveId;

    const handleSectionClick = (id) => {
        if (navMode === "scroll") {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            setScrollActiveId(id);
        }
        onSelect?.(id);
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Cookie may already be expired/missing — proceed with client cleanup regardless.
        }
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userCompanyName");
        localStorage.removeItem("userCreatedAt");
        notify.success("Logged out successfully");
        window.location.href = "/";
    };

    return (
        <aside
            className={[
                "hidden md:flex flex-col",
                "fixed left-4 top-4 bottom-4 z-40",
                "bg-white/95 backdrop-blur border border-gray-200 shadow-xl rounded-3xl",
                "transition-all duration-300 ease-in-out",
                expanded ? "w-60" : "w-16",
            ].join(" ")}
        >
            {/* ── Brand + collapse toggle ──────────────────────────────────── */}
            <div className={`flex items-center ${expanded ? "justify-between px-4" : "justify-center"} py-4 border-b border-gray-100 flex-shrink-0`}>
                {expanded ? (
                    <img src="/conslteklogo.png" alt="Consltek" className="h-6 w-auto object-contain" />
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#15587B] to-[#34808A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        C
                    </div>
                )}
                <button
                    type="button"
                    onClick={onToggleExpanded}
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    className={[
                        "w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-[#15587B] hover:bg-gray-100 transition-colors flex-shrink-0",
                        expanded ? "" : "absolute -right-2 top-3 bg-white border border-gray-200 shadow-sm",
                    ].join(" ")}
                >
                    {expanded ? <FiChevronLeft size={14} /> : <FiChevronRight size={12} />}
                </button>
            </div>

            {/* ── Primary cross-page navigation (identical on every page) ──── */}
            <nav className="flex-shrink-0 py-3 px-2 space-y-0.5" aria-label="Main navigation">
                {PRIMARY_NAV.map(({ href, label, Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <button
                            key={href}
                            type="button"
                            onClick={() => router.push(href)}
                            title={expanded ? undefined : label}
                            aria-current={isActive ? "page" : undefined}
                            className={[
                                "flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left transition-all duration-150",
                                isActive
                                    ? "bg-[#15587B]/8 text-[#15587B]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-[#15587B]",
                            ].join(" ")}
                        >
                            <span className={["flex-shrink-0 w-1 rounded-full transition-all duration-200", isActive ? "h-6 bg-[#34808A]" : "h-4 bg-transparent"].join(" ")} />
                            <Icon size={15} className={`flex-shrink-0 transition-colors ${isActive ? "text-[#15587B]" : "text-gray-400"}`} />
                            {expanded && <span className={`text-xs font-semibold truncate ${isActive ? "text-[#15587B]" : ""}`}>{label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* ── Contextual "This Page" navigation (per-page, optional) ───── */}
            {sections.length > 0 && (
                <>
                    <div className="border-t border-gray-100 mx-3" />
                    <div className={`flex items-center ${expanded ? "px-4" : "justify-center"} pt-3 pb-1 flex-shrink-0`}>
                        {expanded && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">This Page</span>}
                    </div>
                    <nav className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5" aria-label="Page sections">
                        {sections.map(({ id, label, Icon, state }) => {
                            const isActive = activeId === id;
                            const isDone = state === "done";
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => handleSectionClick(id)}
                                    title={expanded ? undefined : label}
                                    aria-current={isActive ? "true" : undefined}
                                    className={[
                                        "flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left transition-all duration-150",
                                        isActive
                                            ? "bg-[#15587B]/8 text-[#15587B]"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-[#15587B]",
                                    ].join(" ")}
                                >
                                    <span className={["flex-shrink-0 w-1 rounded-full transition-all duration-200", isActive ? "h-6 bg-[#34808A]" : "h-4 bg-transparent"].join(" ")} />
                                    <span
                                        className={[
                                            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                            isDone ? "bg-[#34808A] text-white" : isActive ? "bg-[#15587B] text-white" : "bg-gray-100 text-gray-400",
                                        ].join(" ")}
                                    >
                                        {isDone ? <FiCheck size={11} strokeWidth={3} /> : Icon ? <Icon size={12} /> : null}
                                    </span>
                                    {expanded && <span className="text-xs font-semibold truncate">{label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                    {expanded && sidebarFooter && <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">{sidebarFooter}</div>}
                </>
            )}

            {sections.length === 0 && <div className="flex-1" />}

            {/* ── Identity + logout (identical on every page) ──────────────────
                Company name is the primary identity line (big/bold); the
                username is secondary (small), shown underneath. Falls back
                to username-only if no company name is on file yet (e.g. a
                brand-new account that hasn't completed Step 1). Clicking the
                identity block opens /profile — the user's account +
                assessment-progress page. */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3">
                {(username || companyName) && (
                    <button
                        type="button"
                        onClick={() => router.push("/profile")}
                        title="View your profile"
                        className={[
                            "flex items-center gap-2.5 py-1 mb-2 w-full rounded-lg text-left hover:bg-gray-50 transition-colors",
                            expanded ? "px-1" : "justify-center",
                        ].join(" ")}
                    >
                        <div className="w-9 h-9 rounded-full bg-[#15587B] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {(companyName || username)?.[0]?.toUpperCase() || <FiUser size={14} />}
                        </div>
                        {expanded && (
                            <div className="min-w-0">
                                {companyName ? (
                                    <>
                                        <p className="truncate text-sm font-bold text-gray-800">
                                            {companyName}
                                        </p>
                                        {username && (
                                            <p className="truncate text-[10px] text-gray-400">
                                                @{username}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="truncate text-sm font-bold text-gray-800">
                                        @{username}
                                    </p>
                                )}
                            </div>
                        )}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleLogout}
                    title={expanded ? undefined : "Logout"}
                    className="flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <FiLogOut size={15} className="flex-shrink-0 ml-1" />
                    {expanded && <span className="text-xs font-semibold">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AppSidebar;
