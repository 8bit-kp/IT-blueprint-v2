"use client";

// AdvisorHandoffBanner — reusable 4-step engagement progress strip.
// Shown on post-assessment pages (assessment-complete, summary, all-blueprints)
// to orient the user within the consulting engagement journey.
//
// Restyled to the shared design system (styles/new-ui/tokens.css) — requires
// a `.nui`-scoped ancestor. Same props/behavior as before.
//
// Props:
//   title (string)       — headline shown in the dark header bar
//   description (string) — context paragraph shown in the body (optional)

import React from "react";

const STEPS = [
    { step: "1", label: "Assessment received by Consltek" },
    { step: "2", label: "Advisor reviews your Current State Report" },
    { step: "3", label: "Consultation is scheduled" },
    { step: "4", label: "Assessment with Remediation Plan is delivered" },
];

export default function AdvisorHandoffBanner({ title, description }) {
    return (
        <div className="rounded-[var(--nui-r)] overflow-hidden border border-[var(--nui-brand-deep)] shadow-[var(--nui-shadow-1)]">
            <div className="bg-[var(--nui-brand)] px-6 py-4 flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold text-white">{title}</p>
            </div>
            <div className="bg-[var(--nui-surface)] px-6 py-5">
                {description && (
                    <p className="text-sm text-[var(--nui-text-2)] leading-relaxed mb-4">{description}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {STEPS.map(({ step, label }) => (
                        <div key={step} className="flex items-start gap-3 bg-[var(--nui-surface-sunk)] rounded-[var(--nui-r-sm)] px-4 py-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--nui-accent)] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                                {step}
                            </span>
                            <p className="text-xs text-[var(--nui-text-2)] leading-snug">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
