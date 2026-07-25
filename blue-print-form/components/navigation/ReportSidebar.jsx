"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEdit3, FiArrowLeft } from "react-icons/fi";

/**
 * ReportSidebar
 *
 * Floating, collapsible, rounded navigation rail scoped to the
 * /assessment-report single-page dashboard. Distinct from
 * FormSidebarNav / SummarySidebarNav (page-scoped patterns already used
 * elsewhere in the app) — this one adds scroll-spy active-section
 * tracking and two persistent actions (Edit Assessment, Back).
 *
 * Expand/collapse is controlled by the parent page (rather than internal
 * state) because the page's main-content margin must shift in lockstep
 * with the sidebar's width.
 *
 * Props:
 *   sections         { id, label, Icon }[]   Ordered nav sections (anchors on the page).
 *   expanded          boolean                Current expand/collapse state.
 *   onToggleExpanded  () => void             Called when the collapse chevron is clicked.
 *   onEditAssessment  () => void             Called by the "Edit Assessment" action.
 *   onBack            () => void             Called by the "Back" action.
 */
const ReportSidebar = ({ sections, expanded, onToggleExpanded, onEditAssessment, onBack }) => {
    const [active, setActive] = useState(sections[0]?.id);
    const observerRef = useRef(null);

    // ── Scroll-spy: highlight whichever section is most visible ──────────────
    useEffect(() => {
        const elements = sections
            .map((s) => document.getElementById(s.id))
            .filter(Boolean);
        if (!elements.length) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length > 0) {
                    setActive(visible[0].target.id);
                }
            },
            { rootMargin: "-15% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
        );

        elements.forEach((el) => observerRef.current.observe(el));
        return () => observerRef.current?.disconnect();
    }, [sections]);

    const handleNavClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
    };

    return (
        <aside
            className={[
                "hidden md:flex flex-col",
                "fixed left-4 top-20 bottom-4 z-20",
                "bg-white/95 backdrop-blur border border-gray-200 shadow-xl rounded-3xl",
                "transition-all duration-300 ease-in-out",
                expanded ? "w-56" : "w-16",
            ].join(" ")}
        >
            {/* ── Header / collapse toggle ─────────────────────────────────── */}
            <div className={`flex items-center ${expanded ? "justify-between px-4" : "justify-center"} py-4 border-b border-gray-100 flex-shrink-0`}>
                {expanded && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Report Sections
                    </span>
                )}
                <button
                    type="button"
                    onClick={onToggleExpanded}
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-[#15587B] hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                    {expanded ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
                </button>
            </div>

            {/* ── Section links ────────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Report sections">
                {sections.map(({ id, label, Icon }) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleNavClick(id)}
                            title={expanded ? undefined : label}
                            aria-current={isActive ? "location" : undefined}
                            className={[
                                "flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left transition-all duration-150",
                                isActive
                                    ? "bg-[#15587B]/8 text-[#15587B]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-[#15587B]",
                            ].join(" ")}
                        >
                            <span
                                className={[
                                    "flex-shrink-0 w-1 rounded-full transition-all duration-200",
                                    isActive ? "h-6 bg-[#34808A]" : "h-4 bg-transparent",
                                ].join(" ")}
                            />
                            {Icon && (
                                <Icon
                                    size={15}
                                    className={`flex-shrink-0 transition-colors ${isActive ? "text-[#15587B]" : "text-gray-400"}`}
                                />
                            )}
                            {expanded && (
                                <span className={`text-xs font-semibold truncate ${isActive ? "text-[#15587B]" : ""}`}>
                                    {label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* ── Persistent actions ───────────────────────────────────────── */}
            <div className="flex-shrink-0 border-t border-gray-100 p-2 space-y-1">
                <button
                    type="button"
                    onClick={onEditAssessment}
                    title={expanded ? undefined : "Edit Assessment"}
                    className={[
                        "flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left transition-colors",
                        "text-[#15587B] hover:bg-[#15587B]/8",
                    ].join(" ")}
                >
                    <FiEdit3 size={15} className="flex-shrink-0 ml-1" />
                    {expanded && <span className="text-xs font-bold truncate">Edit Assessment</span>}
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    title={expanded ? undefined : "Back"}
                    className="flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    <FiArrowLeft size={15} className="flex-shrink-0 ml-1" />
                    {expanded && <span className="text-xs font-semibold truncate">Back</span>}
                </button>
            </div>
        </aside>
    );
};

export default ReportSidebar;
