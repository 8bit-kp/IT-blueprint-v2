"use client";

// EngagementTimeline — reusable consulting engagement progress visualisation.
//
// Props:
//   currentPhase (number, 1–6): The active phase. Phases before it are
//                                shown as completed; the active phase is
//                                highlighted; phases after it are upcoming.
//
// Phase map (aligns with docs/product-vision.md customer journey):
//   1  Current State Assessment
//   2  Current State Report Generated
//   3  Advisor Review
//   4  Consultation
//   5  Assessment with Remediation Plan
//   6  Implementation

import React from "react";

const PHASES = [
    {
        id: 1,
        label: "Current State Assessment",
        description: "Your IT environment is documented through the structured Current State Assessment.",
        tag: "Automated",
    },
    {
        id: 2,
        label: "Current State Report Generated",
        description: "An automated inventory of your infrastructure, applications, and security controls is generated immediately upon completion.",
        tag: "Automated",
    },
    {
        id: 3,
        label: "Advisor Review",
        description: "A Consltek advisor reviews your assessment in detail. Additional research may occur before the consultation.",
        tag: "Advisor",
    },
    {
        id: 4,
        label: "Consultation",
        description: "Your advisor schedules a discovery session to discuss your environment and agree on the scope of the full engagement.",
        tag: "Advisor",
    },
    {
        id: 5,
        label: "Assessment with Remediation Plan",
        description: "Your paid engagement — gap analysis, risk assessment, and a prioritised remediation roadmap anchored to a specific framework or standard.",
        tag: "Engagement",
    },
    {
        id: 6,
        label: "Implementation",
        description: "Consltek supports you through implementation, migration, security improvements, and ongoing advisory.",
        tag: "Engagement",
    },
];

const TAG_STYLES = {
    Automated:  "bg-teal-50 text-teal-700",
    Advisor:    "bg-blue-50 text-blue-700",
    Engagement: "bg-amber-50 text-amber-700",
};

const getPhaseStatus = (phaseId, currentPhase) => {
    if (phaseId < currentPhase) return "completed";
    if (phaseId === currentPhase) return "active";
    return "upcoming";
};

export default function EngagementTimeline({ currentPhase = 3 }) {
    return (
        <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100" aria-hidden="true" />
            <ol className="space-y-0">
                {PHASES.map((phase, index) => {
                    const status = getPhaseStatus(phase.id, currentPhase);
                    const isLast = index === PHASES.length - 1;
                    return (
                        <li key={phase.id} className={`relative flex gap-4 ${isLast ? "" : "pb-6"}`}>
                            {/* Status icon */}
                            <div className="relative z-10 flex-shrink-0">
                                {status === "completed" ? (
                                    <div className="w-8 h-8 rounded-full bg-[#34808A] flex items-center justify-center shadow-sm">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                ) : status === "active" ? (
                                    <div className="w-8 h-8 rounded-full bg-[#15587B] flex items-center justify-center shadow-sm ring-4 ring-[#15587B]/15">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-400">{phase.id}</span>
                                    </div>
                                )}
                            </div>
                            {/* Content */}
                            <div className={`flex-1 min-w-0 pb-1 ${status === "upcoming" ? "opacity-50" : ""}`}>
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h3 className={`text-sm font-semibold ${
                                        status === "completed" ? "text-[#34808A]" :
                                        status === "active"    ? "text-[#15587B]" :
                                                                  "text-gray-400"
                                    }`}>
                                        {phase.label}
                                    </h3>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide ${TAG_STYLES[phase.tag] || ""}`}>
                                        {phase.tag}
                                    </span>
                                    {status === "active" && (
                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs leading-relaxed ${
                                    status === "completed" ? "text-gray-500" :
                                    status === "active"    ? "text-gray-600" :
                                                              "text-gray-400"
                                }`}>
                                    {phase.description}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
