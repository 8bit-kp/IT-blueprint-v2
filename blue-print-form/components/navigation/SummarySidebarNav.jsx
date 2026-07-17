"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * SummarySidebarNav
 *
 * Collapsible sidebar for the Blueprint Summary page.
 * Renders a list of named sections; clicking one calls onSectionClick(id).
 * The activeSection prop controls which item is highlighted.
 *
 * Props:
 *   sections       { id, label, icon? }[]   Ordered list of sections.
 *   activeSection  string                   ID of the currently visible section.
 *   onSectionClick (id: string) => void     Called when a section link is clicked.
 */
const SummarySidebarNav = ({ sections, activeSection, onSectionClick }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside
            className={[
                "hidden md:flex flex-col",
                "bg-white border-r border-gray-200 shadow-sm flex-shrink-0",
                "sticky top-0 self-start overflow-y-auto",
                "h-screen",
                "transition-all duration-300 ease-in-out",
                expanded ? "w-52" : "w-14",
            ].join(" ")}
        >
            {/* ── Header / Toggle ─────────────────────────────────────────── */}
            <div className={`flex items-center ${expanded ? "justify-between px-4" : "justify-center"} py-4 border-b border-gray-100`}>
                {expanded && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Sections
                    </span>
                )}
                <button
                    onClick={() => setExpanded((v) => !v)}
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-[#15587B] hover:bg-gray-100 transition-colors"
                >
                    {expanded ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
                </button>
            </div>

            {/* ── Section Links ────────────────────────────────────────────── */}
            <nav className="flex-1 py-3 px-2 space-y-0.5" aria-label="Summary sections">
                {sections.map(({ id, label, Icon }) => {
                    const isActive = activeSection === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onSectionClick(id)}
                            title={expanded ? undefined : label}
                            aria-current={isActive ? "location" : undefined}
                            className={[
                                "flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-left transition-all duration-150",
                                isActive
                                    ? "bg-[#15587B]/8 text-[#15587B]"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-[#15587B]",
                            ].join(" ")}
                        >
                            {/* Active indicator bar */}
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
        </aside>
    );
};

export default SummarySidebarNav;
