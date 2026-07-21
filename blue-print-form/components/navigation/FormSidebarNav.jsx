"use client";

import { useState } from "react";
import {
    FiCheck,
    FiChevronLeft,
    FiChevronRight,
    FiBriefcase,
    FiServer,
    FiWifi,
    FiShield,
    FiLock,
    FiActivity,
    FiGrid,
} from "react-icons/fi";

// One icon per step — order matches stepTitles in blueprint-form/page.js
const STEP_ICONS = [FiBriefcase, FiServer, FiWifi, FiShield, FiLock, FiActivity, FiGrid];

/**
 * FormSidebarNav
 *
 * Collapsible left-hand sidebar for the 7-step Current State Assessment form.
 *
 * Props:
 *   step          {number}            Current active step (1-indexed).
 *   totalSteps    {number}            Total number of steps.
 *   lastSavedStep {number}            Highest step that has been saved (0 = none).
 *   stepTitles    {Record<number,string>} Map of step number → display title.
 *   onStepClick   {(n: number) => void}  Called when a non-active step is clicked.
 *
 * Visibility:
 *   - Hidden on mobile (md:flex).  The caller keeps ProgressBar for mobile.
 *   - Desktop: expanded (default) or icon-only when collapsed.
 */
const FormSidebarNav = ({ step, totalSteps, lastSavedStep = 0, stepTitles, onStepClick }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside
            className={[
                // Hidden below md breakpoint — caller shows ProgressBar instead
                "hidden md:flex flex-col",
                "bg-white border-r border-gray-200 shadow-sm flex-shrink-0",
                "sticky top-[4.5rem] self-start overflow-y-auto",
                // Height fills viewport below the fixed FormHeader (h-18 = 4.5rem)
                "h-[calc(100vh-4.5rem)]",
                "transition-all duration-300 ease-in-out",
                expanded ? "w-56" : "w-16",
            ].join(" ")}
        >
            {/* ── Toggle Button ───────────────────────────────────────────── */}
            <div className={`flex ${expanded ? "justify-end px-3" : "justify-center"} py-3 border-b border-gray-100`}>
                <button
                    onClick={() => setExpanded((v) => !v)}
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#15587B] hover:bg-gray-100 transition-colors"
                >
                    {expanded ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
                </button>
            </div>

            {/* ── Step List ───────────────────────────────────────────────── */}
            <nav className="flex-1 py-4 px-2 space-y-1" aria-label="Form steps">
                {Array.from({ length: totalSteps }).map((_, i) => {
                    const stepNum = i + 1;
                    const isActive    = stepNum === step;
                    const isCompleted = stepNum < step || stepNum <= lastSavedStep;
                    const isClickable = !isActive;
                    const Icon = STEP_ICONS[i] || FiGrid;

                    const indicatorClass = isActive
                        ? "bg-[#15587B] text-white shadow-md"
                        : isCompleted
                            ? "bg-[#34808A] text-white"
                            : "bg-gray-100 text-gray-400";

                    const rowClass = [
                        "flex items-center gap-3 rounded-xl px-2 py-2.5 w-full transition-all duration-150",
                        isActive
                            ? "bg-[#15587B]/8 text-[#15587B]"
                            : isClickable
                                ? "text-gray-600 hover:bg-gray-50 hover:text-[#15587B] cursor-pointer"
                                : "text-gray-400 cursor-default",
                    ].join(" ");

                    return (
                        <button
                            key={stepNum}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Step ${stepNum}: ${stepTitles[stepNum]}`}
                            disabled={!isClickable}
                            onClick={() => isClickable && onStepClick(stepNum)}
                            className={rowClass}
                            title={expanded ? undefined : `Step ${stepNum}: ${stepTitles[stepNum]}`}
                        >
                            {/* Circle indicator */}
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${indicatorClass}`}>
                                {isCompleted && !isActive ? (
                                    <FiCheck size={13} strokeWidth={3} />
                                ) : (
                                    <Icon size={14} />
                                )}
                            </span>

                            {/* Label — only when expanded */}
                            {expanded && (
                                <div className="flex flex-col items-start min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                                        Step {stepNum}
                                    </span>
                                    <span className={`text-xs font-semibold leading-tight truncate max-w-[140px] ${isActive ? "text-[#15587B]" : ""}`}>
                                        {stepTitles[stepNum]}
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* ── Progress Footer ─────────────────────────────────────────── */}
            {expanded && (
                <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                        <span className="font-semibold uppercase tracking-wider">Progress</span>
                        <span className="font-bold text-[#34808A]">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#34808A] rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((step / totalSteps) * 100)}%` }}
                        />
                    </div>
                    {lastSavedStep > 0 && (
                        <p className="text-[10px] text-gray-400 mt-1.5">
                            Last saved at step {lastSavedStep}
                        </p>
                    )}
                </div>
            )}
        </aside>
    );
};

export default FormSidebarNav;
