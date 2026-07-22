"use client";

/**
 * app/assessment-report/page.js
 *
 * 5-step interactive Current State Report viewer.
 *
 * Steps:
 *   1. Cover              — speedometer gauge, company name, maturity badge
 *   2. Executive Summary  — gauge, maturity, strengths, critical risks
 *   3. Key Metrics        — 6 KPI cards + 3 risk indicators
 *   4. Score Breakdown    — deduction waterfall + category radar
 *   5. Category Scores    — horizontal bar chart + category cards
 *
 * Guards:
 *   - Redirects to /auth if not logged in (localStorage.username absent)
 *   - Redirects to /blueprint-form if no meaningful blueprint data exists
 *
 * No Consltek branding on this page (brand-neutral report output).
 */

import React, { useState, useEffect } from "react";
import { useRouter }                  from "next/navigation";
import { blueprintAPI }               from "@/utils/api";
import { generateReport }             from "@/lib/report/index.js";
import GaugeChart                     from "@/components/report-charts/GaugeChart";
import CategoryRadar                  from "@/components/report-charts/CategoryRadar";
import WaterfallChart                 from "@/components/report-charts/WaterfallChart";
import HorizontalBarChart             from "@/components/report-charts/HorizontalBarChart";
import ProgressRing                   from "@/components/report-charts/ProgressRing";

// ── Brand colours ─────────────────────────────────────────────────────────────
const PRIMARY = "#15587B";
const ACCENT  = "#34808A";

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (s) => {
    if (s <= 30)  return "#ef4444";
    if (s <= 50)  return "#f97316";
    if (s <= 65)  return "#eab308";
    if (s <= 80)  return ACCENT;
    return "#22c55e";
};

const scoreZone = (s) => {
    if (s <= 30)  return { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    label: "Critical"   };
    if (s <= 50)  return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "At Risk"    };
    if (s <= 65)  return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", label: "Developing" };
    if (s <= 80)  return { bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-700",   label: "Managed"    };
    return              { bg: "bg-green-50",   border: "border-green-200",  text: "text-green-700",  label: "Optimized"  };
};

// A blueprint is "filled" if at least one Step 1 field is present
const hasMeaningfulBlueprint = (bp) => {
    if (!bp || typeof bp !== "object") return false;
    return !!(bp.companyName || bp.industry || bp.employees);
};

// ── Step labels ───────────────────────────────────────────────────────────────
const STEP_LABELS = ["Cover", "Executive Summary", "Key Metrics", "Score Breakdown", "Category Scores"];

// ── Step dot (pagination indicator) ──────────────────────────────────────────
const StepDot = ({ num, current, onClick }) => {
    const active   = num === current;
    const complete = num < current;
    return (
        <button
            type="button"
            onClick={() => onClick(num)}
            aria-label={`Go to step ${num}: ${STEP_LABELS[num - 1]}`}
            className={[
                "flex items-center justify-center rounded-full text-xs font-bold transition-all",
                "w-7 h-7 border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                active   ? "bg-[#15587B] border-[#15587B] text-white shadow-md" :
                complete ? "bg-[#34808A] border-[#34808A] text-white" :
                           "bg-white border-gray-300 text-gray-400 hover:border-[#34808A] hover:text-[#34808A]",
            ].join(" ")}
        >
            {complete ? "✓" : num}
        </button>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 1 — Cover
// ════════════════════════════════════════════════════════════════════════════
const StepCover = ({ report, companyName, assessmentDate }) => {
    const { score, maturity } = report;

    return (
        <div className="max-w-2xl mx-auto space-y-5 py-4">

            {/* ── Main report card ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Gradient top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#34808A] to-[#15587B]" />

                {/* Title block */}
                <div className="px-8 pt-8 pb-4 text-center space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        IT Security Assessment
                    </p>
                    <h1 className="text-2xl font-extrabold text-[#15587B] leading-tight">
                        Current State Report
                    </h1>
                    {companyName && (
                        <p className="text-base font-semibold text-gray-700">{companyName}</p>
                    )}
                    <p className="text-sm text-gray-400">{assessmentDate}</p>
                </div>

                {/* Speedometer gauge — hero element */}
                <div className="flex flex-col items-center px-6 pb-4">
                    <GaugeChart score={score} size={260} />
                </div>

                {/* Maturity level badge */}
                <div className="px-8 pb-8 flex justify-center">
                    <span
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-sm"
                        style={{ backgroundColor: maturity.color }}
                    >
                        <span>IT Maturity Level {maturity.level}</span>
                        <span className="opacity-70">—</span>
                        <span>{maturity.name}</span>
                    </span>
                </div>
            </div>

            {/* ── Confidentiality notice ─────────────────────────────────────── */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Confidentiality Notice
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                    This report contains infrastructure and security information for the named organisation.
                    It is generated automatically from the Current State Assessment and is intended solely
                    for the named contact and their assigned IT advisor. It must not be shared with third
                    parties without written consent.
                </p>
            </div>

            {/* ── Disclaimer ─────────────────────────────────────────────────── */}
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-lg mx-auto text-center px-4">
                This report is a snapshot assessment based on self-reported data. The Security Score and
                IT Maturity Level are calculated using a fixed, published methodology — they are not
                equivalent to the{" "}
                <strong className="text-gray-600">Assessment with Remediation Plan</strong>, which
                requires advisor review and is delivered as a paid engagement following your consultation.
            </p>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 2 — Executive Summary
// ════════════════════════════════════════════════════════════════════════════
const StepExecutive = ({ report, companyName }) => {
    const { score, maturity, strengths, criticalRisks } = report;

    const executiveNarrative = () => {
        const org = companyName || "Your organisation";
        if (score <= 30)
            return `${org} is operating with critical security gaps across multiple domains. The assessment reveals an absence of foundational controls — the current posture presents an unacceptably high risk of breach and extended operational disruption.`;
        if (score <= 50)
            return `${org} has some baseline controls in place, but significant gaps remain in critical areas including identity protection, endpoint detection, and resilience. A targeted attack would likely succeed with the current control set.`;
        if (score <= 65)
            return `${org} has deployed several important security controls and is developing its security posture. Key gaps remain that need to be addressed to reach a defensible baseline across all domains.`;
        if (score <= 80)
            return `${org} has a well-managed security posture with comprehensive controls in place across most domains. Continued investment in advanced monitoring and testing will further strengthen the defence.`;
        return `${org} demonstrates an optimised security posture with advanced controls deployed across all domains. The focus should be on continuous improvement and third-party validation to maintain this level.`;
    };

    return (
        <div className="space-y-6">
            {/* Score + maturity hero */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#34808A] to-[#15587B]" />
                <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <GaugeChart score={score} size={200} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">IT Maturity Level</p>
                            <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white"
                                style={{ backgroundColor: maturity.color }}
                            >
                                Level {maturity.level} — {maturity.name}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{executiveNarrative()}</p>
                        <p className="text-xs text-gray-400 italic">{maturity.riskProfile}</p>
                    </div>
                </div>
            </div>

            {/* Strengths + Critical Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-5 w-1 bg-green-500 rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">Top Strengths</h3>
                    </div>
                    {strengths.length === 0 ? (
                        <p className="text-xs text-gray-400">No categories scored above 60/100.</p>
                    ) : (
                        <ul className="space-y-3">
                            {strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                                        <p className="text-[11px] text-gray-500 leading-snug">{s.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-5 w-1 bg-red-500 rounded-full" />
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">Critical Risks</h3>
                    </div>
                    {criticalRisks.length === 0 ? (
                        <p className="text-xs text-gray-400">No critical penalties triggered — strong posture.</p>
                    ) : (
                        <ul className="space-y-3">
                            {criticalRisks.map((r, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-red-700">{r.label}</p>
                                        <p className="text-[11px] text-gray-500 leading-snug">{r.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Advisor next step */}
            <div className="bg-[#15587B]/5 border border-[#15587B]/15 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#15587B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-[#15587B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#15587B] mb-1">Your Advisor Follows Up</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            This report is a formulaic snapshot — it scores your answers against a fixed published
                            methodology. Your advisor will use it as the foundation for your{" "}
                            <strong className="text-gray-800">Assessment with Remediation Plan</strong>, which includes
                            contextual gap analysis, business-specific prioritisation, and a remediation roadmap
                            anchored to a specific standard or framework. That is the paid engagement and is not automated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 3 — Key Metrics
// ════════════════════════════════════════════════════════════════════════════
const RISK_CONFIG = {
    Critical: { bg: "bg-red-100",   text: "text-red-700",   dot: "bg-red-500"   },
    High:     { bg: "bg-red-50",    text: "text-red-600",   dot: "bg-red-400"   },
    Medium:   { bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-400" },
    Low:      { bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500" },
};

const RiskPill = ({ label, risk }) => {
    const cfg = RISK_CONFIG[risk] || RISK_CONFIG.Medium;
    return (
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${cfg.bg}`}>
            <span className="text-xs font-semibold text-gray-700">{label}</span>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${cfg.text}`}>
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {risk}
            </div>
        </div>
    );
};

const KpiCard = ({ label, value, sub, color, large = false }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="font-extrabold leading-none" style={{ fontSize: large ? 40 : 32, color: color || "#111827" }}>
            {value}
        </p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
);

const StepMetrics = ({ report }) => {
    const { score, maturity, metrics, risks } = report;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Key Performance Indicators</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <KpiCard
                        label="Security Score"
                        value={score}
                        sub="/ 100"
                        color={scoreColor(score)}
                        large
                    />
                    <KpiCard
                        label="IT Maturity Level"
                        value={`L${maturity.level}`}
                        sub={maturity.name}
                        color={maturity.color}
                        large
                    />
                    <KpiCard
                        label="Critical Findings"
                        value={metrics.criticalFindingsCount}
                        sub="penalties ≥ 7 pts"
                        color={metrics.criticalFindingsCount > 0 ? "#dc2626" : "#16a34a"}
                    />
                    <KpiCard
                        label="Controls Missing"
                        value={`${metrics.controlsMissingCount}/16`}
                        sub="tech controls absent"
                        color={metrics.controlsMissingCount > 8 ? "#dc2626" : metrics.controlsMissingCount > 4 ? "#d97706" : "#16a34a"}
                    />
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-start gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">App MFA Coverage</p>
                        <ProgressRing value={metrics.appMfaCoverage} size={60} strokeWidth={6} color={metrics.appMfaCoverage !== null && metrics.appMfaCoverage >= 80 ? "#16a34a" : "#d97706"} />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col items-start gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">App Backup Coverage</p>
                        <ProgressRing value={metrics.appBackupCoverage} size={60} strokeWidth={6} color={metrics.appBackupCoverage !== null && metrics.appBackupCoverage >= 80 ? "#16a34a" : "#d97706"} />
                    </div>
                </div>
            </div>

            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Risk Summary</p>
                <div className="space-y-2">
                    <RiskPill label="Cyber Risk"      risk={risks.cyber}      />
                    <RiskPill label="Downtime Risk"   risk={risks.downtime}   />
                    <RiskPill label="Compliance Risk" risk={risks.compliance} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                    Risk levels are derived mechanically from assessment signals. Precise risk quantification and
                    business-specific context are part of the{" "}
                    <strong className="text-gray-600">Assessment with Remediation Plan</strong>.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-1 rounded-full" style={{ backgroundColor: maturity.color }} />
                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">
                        Level {maturity.level} — {maturity.name}
                    </h3>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{maturity.description}</p>
                <ul className="space-y-1.5">
                    {maturity.characteristics.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                            {c}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 4 — Score Breakdown
// ════════════════════════════════════════════════════════════════════════════
const StepBreakdown = ({ report }) => {
    const { waterfall, categories, triggeredPenalties, appliedCap } = report;
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <h3 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Score Deduction Waterfall</h3>
                </div>
                <p className="text-xs text-gray-400 mb-5 ml-3">
                    Starting from the weighted composite, each triggered penalty is applied to produce the final score.
                </p>
                <WaterfallChart waterfall={waterfall} />
                {appliedCap !== null && (
                    <p className="text-[11px] text-amber-600 mt-3 border-l-2 border-amber-300 pl-3">
                        Score cap applied: one or more critical controls are absent. The cap prevents the score from
                        misrepresenting the organisation&apos;s actual risk exposure.
                    </p>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <h3 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Security Category Radar</h3>
                </div>
                <p className="text-xs text-gray-400 mb-4 ml-3">
                    Twelve security domains — the shape of the polygon reveals overall posture balance.
                </p>
                <CategoryRadar categories={categories} />
            </div>

            {triggeredPenalties.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-5 w-1 bg-red-500 rounded-full" />
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                            Penalties Applied ({triggeredPenalties.length})
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {triggeredPenalties.map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                <span className="text-xs text-gray-600">{p.label}</span>
                                <span className="text-xs font-bold text-red-600">−{p.value} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// STEP 5 — Category Scores
// ════════════════════════════════════════════════════════════════════════════
const StepCategories = ({ report }) => {
    const { categories } = report;

    const getZone = (s) => {
        if (s <= 30)  return { label: "Critical",   color: "#ef4444", badge: "bg-red-100 text-red-700"       };
        if (s <= 50)  return { label: "At Risk",    color: "#f97316", badge: "bg-amber-100 text-amber-700"   };
        if (s <= 65)  return { label: "Developing", color: "#eab308", badge: "bg-yellow-100 text-yellow-700" };
        if (s <= 80)  return { label: "Managed",    color: ACCENT,    badge: "bg-teal-100 text-teal-700"     };
        return              { label: "Optimized",   color: "#22c55e", badge: "bg-green-100 text-green-700"   };
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <h3 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Category Scores</h3>
                </div>
                <p className="text-xs text-gray-400 mb-5 ml-3">
                    Raw score per category (0–100), sorted by weight. Each bar shows the current score and the gap to 100.
                </p>
                <HorizontalBarChart categories={categories} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => {
                    const zone = getZone(c.rawScore);
                    return (
                        <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-xs font-semibold text-gray-700 leading-tight">{c.name}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${zone.badge}`}>
                                    {zone.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${c.rawScore}%`, backgroundColor: zone.color }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-700 w-10 text-right flex-shrink-0">
                                    {c.rawScore}/100
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[10px] text-gray-400">Weight: {Math.round(c.weight * 100)}%</span>
                                <span className="text-[10px] text-gray-400">Contribution: +{c.contribution}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                    <strong className="text-gray-600">Scoring methodology:</strong> Each category scores 0–100 based on
                    specific controls and configurations. Categories are weighted and summed to produce a composite,
                    then critical-control penalties and caps are applied. Full methodology is documented in the
                    IT Blueprint scoring architecture reference.
                </p>
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Fixed footer navigation bar
// ════════════════════════════════════════════════════════════════════════════
const NavBar = ({ step, total, setStep }) => (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#15587B] disabled:opacity-30 disabled:cursor-not-allowed transition rounded-lg hover:bg-gray-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
            </button>

            <div className="flex items-center gap-1.5">
                {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                    <StepDot key={n} num={n} current={step} onClick={setStep} />
                ))}
            </div>

            <button
                type="button"
                onClick={() => setStep((s) => Math.min(total, s + 1))}
                disabled={step === total}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#15587B] hover:text-[#0f4460] disabled:opacity-30 disabled:cursor-not-allowed transition rounded-lg hover:bg-blue-50"
            >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Main page component
// ════════════════════════════════════════════════════════════════════════════
export default function AssessmentReport() {
    const router = useRouter();

    const [step,           setStep]           = useState(1);
    const [report,         setReport]         = useState(null);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState(null);
    const [companyName,    setCompanyName]    = useState("");
    const [assessmentDate, setAssessmentDate] = useState("");

    const TOTAL_STEPS = 5;

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Auth guard
        const username = localStorage.getItem("username");
        if (!username) { router.push("/auth"); return; }

        blueprintAPI
            .getBlueprint()
            .then((res) => {
                const bp = res?.data?.blueprint || res?.data || {};

                // Form completion guard — redirect if no meaningful data exists
                if (!hasMeaningfulBlueprint(bp)) {
                    router.push("/blueprint-form");
                    return;
                }

                const data = generateReport(bp);
                setReport(data);

                if (bp.companyName) setCompanyName(bp.companyName);
                else {
                    const stored = localStorage.getItem("userCompanyName");
                    if (stored) setCompanyName(stored);
                }

                // Always show today's date — the report is generated now
                setAssessmentDate(
                    new Date().toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                    })
                );
            })
            .catch((err) => {
                // 404 = no blueprint yet — send to the form
                if (err?.response?.status === 404) {
                    router.push("/blueprint-form");
                } else {
                    setError("Unable to load your assessment data. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#34808A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Generating your Current State Report…</p>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
                <div className="text-center space-y-4 max-w-sm p-6">
                    <p className="text-sm text-red-600">{error || "Report data unavailable."}</p>
                    <button
                        type="button"
                        onClick={() => router.push("/assessment-complete")}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#15587B] rounded-lg hover:bg-[#0f4460] transition"
                    >
                        Back to Assessment Complete
                    </button>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    const stepProps = { report, companyName, assessmentDate };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">

            {/* ── Sticky top header ──────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => router.push("/assessment-complete")}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition flex-shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <div className="flex-shrink-0 text-center">
                        <p className="text-xs font-bold text-[#15587B]">Current State Report</p>
                        {companyName && <p className="text-[10px] text-gray-400">{companyName}</p>}
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <p className="text-[10px] text-gray-400 font-medium">
                            {step} / {TOTAL_STEPS}
                        </p>
                        <p className="text-[10px] text-gray-400">{STEP_LABELS[step - 1]}</p>
                    </div>
                </div>
            </div>

            {/* ── Scrollable content (pb-28 avoids fixed footer overlap) ──────── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-28">
                {/* Step label row */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-[#15587B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {step}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{STEP_LABELS[step - 1]}</h2>
                </div>

                {/* Active step */}
                {step === 1 && <StepCover {...stepProps} />}
                {step === 2 && <StepExecutive {...stepProps} />}
                {step === 3 && <StepMetrics {...stepProps} />}
                {step === 4 && <StepBreakdown {...stepProps} />}
                {step === 5 && <StepCategories {...stepProps} />}
            </div>

            {/* ── Fixed bottom nav ────────────────────────────────────────────── */}
            <NavBar step={step} total={TOTAL_STEPS} setStep={setStep} />
        </div>
    );
}
