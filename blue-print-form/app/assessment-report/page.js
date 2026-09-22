"use client";

/**
 * app/assessment-report/page.js
 *
 * Single-page executive dashboard for the Current State Report.
 *
 * Replaces the previous 5-step paginated flow (Cover / Executive Summary /
 * Key Metrics / Score Breakdown / Category Scores) with one continuous
 * scroll organized into anchored sections, navigable via the app-wide
 * AppShell/AppSidebar (scroll mode). No scoring or maturity logic changed —
 * generateReport() output is rendered as-is; only presentation and
 * navigation changed.
 *
 * Sections:
 *   Overview            — score gauge, maturity badge, headline KPI row
 *   Organization         — company profile facts (raw blueprint)
 *   Infrastructure        — facilities, network, servers (raw blueprint)
 *   Security              — category radar/bars, waterfall, risks, strengths
 *   Business Operations  — business context, criticality, challenges
 *   Business Workflows   — transparent "not yet collected" notice
 *   Applications          — technology stack / application inventory
 *   Assessment Data       — full category table, data availability notes
 *
 * Guards:
 *   - Redirects to /auth if not logged in (localStorage.username absent)
 *   - Redirects to /blueprint-form if no meaningful blueprint data exists
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiHome, FiBriefcase, FiServer, FiShield, FiTrendingUp,
    FiGitBranch, FiGrid, FiFileText, FiCheckCircle, FiAlertTriangle,
    FiLayers, FiInfo,
} from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { generateReport } from "@/lib/report/index.js";
import { getRiskLevel } from "@/lib/report/application-score";
import { notify } from "@/lib/notify";

import CategoryRadar from "@/components/report-charts/CategoryRadar";
import WaterfallChart from "@/components/report-charts/WaterfallChart";
import HorizontalBarChart from "@/components/report-charts/HorizontalBarChart";
import ProgressRing from "@/components/report-charts/ProgressRing";

import AppShell from "@/components/navigation/AppShell";
import SectionCard from "@/components/report-dashboard/SectionCard";
import InfoTile from "@/components/report-dashboard/InfoTile";
import EmptyStateNotice from "@/components/report-dashboard/EmptyStateNotice";
import Disclosure from "@/components/report-dashboard/Disclosure";
import SecurityScoreCard from "@/components/report-dashboard/SecurityScoreCard";
import ApplicationSecurityScoreCard from "@/components/report-dashboard/ApplicationSecurityScoreCard";
import { NuiCanvas, NuiReveal, NuiHero } from "@/components/ui/new";

// ── Brand colours ────────────────────────────────────────────────────────────
const PRIMARY = "#15587B";
const ACCENT = "#34808A";

const RISK_CONFIG = {
    Critical: { bg: "bg-[var(--nui-risk-bg)]", text: "text-[var(--nui-risk)]", dot: "bg-[var(--nui-risk)]" },
    High: { bg: "bg-[var(--nui-risk-bg)]", text: "text-[var(--nui-risk)]", dot: "bg-[var(--nui-risk)]" },
    Medium: { bg: "bg-[var(--nui-warn-bg)]", text: "text-[var(--nui-warn)]", dot: "bg-[var(--nui-warn)]" },
    Low: { bg: "bg-[var(--nui-ok-bg)]", text: "text-[var(--nui-ok)]", dot: "bg-[var(--nui-ok)]" },
};

// A blueprint is "filled" if at least one Step 1 field is present
const hasMeaningfulBlueprint = (bp) => {
    if (!bp || typeof bp !== "object") return false;
    return !!(bp.companyName || bp.industry || bp.employees);
};

// ── Raw-field display helpers (Additional Context sections read directly ────
// from the blueprint document, not the scoring engine — inventory context,
// not scored signals) ─────────────────────────────────────────────────────
const yn = (v) => (v === "Yes" ? "Yes" : v === "No" ? "No" : v || "—");

const fmtControl = (ctrl) => {
    if (!ctrl || !ctrl.choice) return "Not configured";
    if (ctrl.choice === "Yes") return ctrl.vendor ? `Yes — ${ctrl.vendor}` : "Yes";
    return "No";
};

const fmtList = (arr) => (Array.isArray(arr) && arr.length ? arr.join(", ") : "—");

const APP_CATEGORY_LABELS = {
    productivity: "Productivity",
    finance: "Finance",
    hrit: "HR / IT",
    payroll: "Payroll",
    additional: "Additional",
};

const getCategoryLabel = (key, customCategories) => {
    if (APP_CATEGORY_LABELS[key]) return APP_CATEGORY_LABELS[key];
    const custom = customCategories?.find((c) => c.key === key);
    return custom?.title || key;
};

// ── Report navigation sections (shared by sidebar + anchors) ────────────────
const SECTIONS = [
    { id: "overview", label: "Report Home", Icon: FiHome },
    { id: "organization", label: "Organization", Icon: FiBriefcase },
    { id: "infrastructure", label: "Infrastructure", Icon: FiServer },
    { id: "security", label: "Security", Icon: FiShield },
    { id: "application-security", label: "Application Security", Icon: FiLayers },
    { id: "business-operations", label: "Business Operations", Icon: FiTrendingUp },
    { id: "business-workflows", label: "Business Workflows", Icon: FiGitBranch },
    { id: "applications", label: "Technology Stack", Icon: FiGrid },
    { id: "assessment-data", label: "Assessment Data", Icon: FiFileText },
];

// ════════════════════════════════════════════════════════════════════════════
// Section: Overview
// ════════════════════════════════════════════════════════════════════════════
const OverviewSection = ({ report }) => (
    <SectionCard
        id="overview"
        eyebrow="Score Breakdown"
        title="Security Score & Coverage"
        description="The gauge, maturity level, and headline KPIs behind the score above, plus the independent Application Security companion score."
        Icon={FiHome}
    >
        <SecurityScoreCard report={report} />

        <div className="mt-6 pt-6 border-t border-[var(--nui-line-soft)]">
            <h3 className="text-sm font-bold text-[var(--nui-text)] mb-1">Application and data security</h3>
            <p className="text-xs text-[var(--nui-text-3)] mb-5 max-w-xl leading-relaxed">
                An independent companion score scoped to the Application Portfolio (Step 7), calculated from its own
                fixed methodology. Related to, but never merged into, the Security Score above.
            </p>
            <ApplicationSecurityScoreCard report={report} />
        </div>
    </SectionCard>
);

// ════════════════════════════════════════════════════════════════════════════
// Section: Executive Summary strengths/risks (rendered inside Security)
// ════════════════════════════════════════════════════════════════════════════
const StrengthsAndRisks = ({ strengths, criticalRisks }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--nui-surface-sunk)] rounded-[var(--nui-r)] border border-[var(--nui-line-soft)] p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-1 bg-[var(--nui-ok)] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--nui-text-2)]">Top Strengths</h3>
            </div>
            {strengths.length === 0 ? (
                <p className="text-xs text-[var(--nui-text-3)]">No categories scored above 60/100.</p>
            ) : (
                <ul className="space-y-3">
                    {strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <FiCheckCircle size={14} className="text-[var(--nui-ok)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-[var(--nui-text-2)]">{s.label}</p>
                                <p className="text-[11px] text-[var(--nui-text-3)] leading-snug">{s.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="bg-[var(--nui-surface-sunk)] rounded-[var(--nui-r)] border border-[var(--nui-line-soft)] p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-1 bg-[var(--nui-risk)] rounded-full" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--nui-text-2)]">Critical Risks</h3>
            </div>
            {criticalRisks.length === 0 ? (
                <p className="text-xs text-[var(--nui-text-3)]">No critical penalties triggered — strong posture.</p>
            ) : (
                <ul className="space-y-3">
                    {criticalRisks.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <FiAlertTriangle size={14} className="text-[var(--nui-risk)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-[var(--nui-risk)]">{r.label}</p>
                                <p className="text-[11px] text-[var(--nui-text-3)] leading-snug">{r.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);

// ════════════════════════════════════════════════════════════════════════════
// Section: Organization
// ════════════════════════════════════════════════════════════════════════════
const OrganizationSection = ({ blueprint }) => {
    const bp = blueprint || {};
    return (
        <SectionCard
            id="organization"
            eyebrow="Company Profile"
            title="Organization Overview"
            description="Who the organization is and how it operates, as reported in Step 1 of the assessment."
            Icon={FiBriefcase}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <InfoTile label="Company Name" value={bp.companyName} />
                <InfoTile label="Industry" value={bp.otherIndustry || bp.industry} />
                <InfoTile label="Employees" value={bp.employees} />
                <InfoTile label="Remote Workforce" value={typeof bp.remotePercentage === "number" ? `${bp.remotePercentage}%` : "—"} />
                <InfoTile label="Contractors" value={typeof bp.contractorPercentage === "number" ? `${bp.contractorPercentage}%` : "—"} />
                <InfoTile label="Deployment Model" value={bp.deploymentModel} />
                <InfoTile label="Internal IT / MSP" value={bp.itManagement} />
                <InfoTile label="MSP Relationship" value={bp.mspRelationship} />
                <InfoTile label="Primary Customer Type" value={bp.primaryCustomerType} />
                <InfoTile label="Geographic Reach" value={bp.geographicReach} />
                <InfoTile label="Number of Locations" value={bp.numberOfLocations} />
                <InfoTile label="Main Location" value={bp.mainLocation} />
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Infrastructure
// ════════════════════════════════════════════════════════════════════════════
const InfrastructureSection = ({ blueprint }) => {
    const bp = blueprint || {};
    return (
        <SectionCard
            id="infrastructure"
            eyebrow="Facilities & Network"
            title="Infrastructure Overview"
            description="Facilities, network topology, and server environment, as reported in Steps 2–3 of the assessment."
            Icon={FiServer}
        >
            <div className="space-y-5">
                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-2">Facilities</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <InfoTile label="Physical Offices" value={bp.physicalOffices} />
                        <InfoTile label="Data Centers" value={yn(bp.hasDataCenters)} />
                        <InfoTile label="On-Prem DC" value={yn(bp.hasOnPremDC)} />
                        <InfoTile label="Cloud Infrastructure" value={yn(bp.hasCloudInfra)} />
                        <InfoTile label="Generator" value={yn(bp.hasGenerator)} />
                        <InfoTile label="UPS" value={yn(bp.hasUPS)} />
                        <InfoTile label="Solar Power" value={yn(bp.hasSolarPower)} />
                    </div>
                </div>

                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-2">Network</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <InfoTile label="WAN 1" value={fmtControl(bp.WAN1)} />
                        <InfoTile label="WAN 2" value={fmtControl(bp.WAN2)} />
                        <InfoTile label="Switching" value={fmtControl(bp.switchingVendor)} />
                        <InfoTile label="Routing" value={fmtControl(bp.routingVendor)} />
                        <InfoTile label="Wireless" value={fmtControl(bp.wirelessVendor)} />
                        <InfoTile label="HA Routing" value={yn(bp.haRouting)} />
                        <InfoTile label="Wireless Auth" value={bp.wirelessAuth} />
                        <InfoTile label="Guest Wireless" value={yn(bp.guestWireless)} />
                    </div>
                </div>

                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-2">Servers &amp; Desktops</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <InfoTile label="Windows Servers" value={yn(bp.windowsServers)} />
                        <InfoTile label="Windows Posture" value={fmtList(bp.windowsOptions)} />
                        <InfoTile label="Linux Servers" value={yn(bp.linuxServers)} />
                        <InfoTile label="Linux Posture" value={fmtList(bp.linuxOptions)} />
                        <InfoTile label="Desktop Posture" value={fmtList(bp.desktopOptions)} />
                        <InfoTile label="Virtualization" value={fmtControl(bp.virtualizationVendor)} />
                        <InfoTile label="Bare Metal" value={fmtControl(bp.baremetalVendor)} />
                        <InfoTile label="Cloud Vendor" value={fmtControl(bp.cloudVendor)} />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Security
// ════════════════════════════════════════════════════════════════════════════
const SecuritySection = ({ report }) => {
    const { categories, waterfall, triggeredPenalties, appliedCap, strengths, criticalRisks, risks, maturity } = report;

    return (
        <SectionCard
            id="security"
            eyebrow="Assessment Results"
            title="Security Overview"
            description="Twelve weighted security domains — the radar shape reveals overall posture balance; bars show individual category scores."
            Icon={FiShield}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <CategoryRadar categories={categories} />
                    </div>
                    <div>
                        <HorizontalBarChart categories={categories} />
                    </div>
                </div>

                <StrengthsAndRisks strengths={strengths} criticalRisks={criticalRisks} />

                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-3">Risk Summary</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {["cyber", "downtime", "compliance"].map((k) => {
                            const cfg = RISK_CONFIG[risks[k]] || RISK_CONFIG.Medium;
                            const labels = { cyber: "Cyber Risk", downtime: "Downtime Risk", compliance: "Compliance Risk" };
                            return (
                                <div key={k} className={`flex items-center justify-between rounded-xl px-4 py-3 ${cfg.bg}`}>
                                    <span className="text-xs font-semibold text-[var(--nui-text-2)]">{labels[k]}</span>
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${cfg.text}`}>
                                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        {risks[k]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-[var(--nui-text-3)] mt-2 leading-relaxed">
                        Risk levels are derived mechanically from assessment signals. Precise risk quantification and
                        business-specific context are part of the{" "}
                        <strong className="text-[var(--nui-text-2)]">Assessment with Remediation Plan</strong>.
                    </p>
                </div>

                <Disclosure label={`Score Deduction Waterfall${appliedCap !== null ? " (cap applied)" : ""}`}>
                    <WaterfallChart waterfall={waterfall} />
                    {appliedCap !== null && (
                        <p className="text-[11px] text-[var(--nui-warn)] mt-3 border-l-2 border-[var(--nui-warn-line)] pl-3">
                            Score cap applied: one or more critical controls are absent. The cap prevents the score
                            from misrepresenting the organisation&apos;s actual risk exposure.
                        </p>
                    )}
                    {triggeredPenalties.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--nui-line-soft)]">
                            <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-2">
                                Penalties Applied ({triggeredPenalties.length})
                            </p>
                            <div className="space-y-1.5">
                                {triggeredPenalties.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--nui-line-soft)] last:border-0">
                                        <span className="text-xs text-[var(--nui-text-2)]">{p.label}</span>
                                        <span className="text-xs font-bold text-[var(--nui-risk)]">−{p.value} pts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Disclosure>

                <Disclosure label={`IT Maturity Characteristics — Level ${maturity.level}`}>
                    <p className="text-xs text-[var(--nui-text-2)] mb-3 leading-relaxed">{maturity.description}</p>
                    <ul className="space-y-1.5">
                        {maturity.characteristics.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[var(--nui-text-3)]">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--nui-text-3)] flex-shrink-0" />
                                {c}
                            </li>
                        ))}
                    </ul>
                </Disclosure>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Application Security (deep dive on report.applicationSecurityScore)
// ════════════════════════════════════════════════════════════════════════════
// Everything here reads from report.applicationSecurityScore /
// report.applicationScoreHypotheticals, both already fully computed by
// generateReport(). This section renders; it never calculates — the only
// arithmetic below (sorting by riskScore, summing incomplete-app counts) is
// a plain UI-layer read/derive over already-computed fields, the same kind
// of local derivation AssessmentDataSection/ApplicationsSection already do
// elsewhere on this page.

const HYPOTHETICAL_VERB_PHRASE = {
    mfaEnabled: "Enabling MFA",
    backedUp: "Enabling backups",
    byodAccess: "Restricting BYOD access",
    sensitiveInformation: "Reducing sensitive-information exposure",
};

const IncompleteDataTag = () => (
    <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--nui-r-pill)] text-[10px] font-semibold bg-[var(--nui-idle-bg)] text-[var(--nui-idle)] border border-dashed border-[var(--nui-idle-line)]"
        title="One or more fields on this application were left unanswered — this is not a confirmed weakness."
    >
        <FiInfo size={10} />
        Not fully assessed
    </span>
);

const RiskLevelBadge = ({ level }) => {
    const cfg = RISK_CONFIG[level] || RISK_CONFIG.Medium;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {level}
        </span>
    );
};

const ApplicationSecuritySection = ({ report }) => {
    const appScore = report.applicationSecurityScore;
    const hypotheticals = report.applicationScoreHypotheticals || [];

    if (!appScore || appScore.overallScore === null) {
        return (
            <SectionCard
                id="application-security"
                eyebrow="Application Portfolio"
                title="Application Security"
                description="An independent score scoped to the Application Portfolio Assessment (Step 7)."
                Icon={FiLayers}
            >
                <EmptyStateNotice
                    Icon={FiLayers}
                    title="Application and data security: Not yet assessed"
                    description="Complete the Application Portfolio section (Step 7 of the Current State Assessment) to see this score."
                />
            </SectionCard>
        );
    }

    const { sections, topRiskDrivers } = appScore;

    // Section breakdown: worst-first by risk, so the section dragging the
    // score down most is immediately visible rather than reading top-to-bottom.
    const sectionsByRisk = [...sections].sort((a, b) => b.sectionRisk - a.sectionRisk);

    // Application table: single flat table across all sections, sorted
    // worst-first — a portfolio can span several sections, and a per-section
    // sub-table would bury a single high-risk app inside whichever section
    // happens to render last. One sortable-by-eye list keeps it visible.
    const allApps = sections
        .flatMap((s) => s.applications.map((a) => ({ ...a, sectionName: s.sectionName })))
        .sort((a, b) => b.riskScore - a.riskScore);

    const incompleteCount = allApps.filter((a) => a.hasIncompleteData).length;

    return (
        <SectionCard
            id="application-security"
            eyebrow="Application Portfolio"
            title="Application Security"
            description="A deeper look at application and data security: what's driving it, which sections and applications carry the most risk, and what fixing the top issues would do to the score."
            Icon={FiLayers}
        >
            <div className="space-y-6">
                {/* ── Top Risk Drivers ────────────────────────────────────────── */}
                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-3">Top Risk Drivers</p>
                    {topRiskDrivers.length === 0 ? (
                        <p className="text-xs text-[var(--nui-text-3)]">No significant risk drivers identified.</p>
                    ) : (
                        <ul className="space-y-2">
                            {topRiskDrivers.map((d, i) => (
                                <li key={d.factor} className="flex items-center justify-between gap-3 bg-[var(--nui-surface-sunk)] border border-[var(--nui-line-soft)] rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-5 h-5 rounded-full bg-[var(--nui-risk-bg)] text-[var(--nui-risk)] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-xs font-medium text-[var(--nui-text-2)]">{d.description}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[var(--nui-text-3)] flex-shrink-0">
                                        {d.affectedApplicationCount} app{d.affectedApplicationCount === 1 ? "" : "s"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ── Improvement Hypotheticals (factual, module-recomputed) ──── */}
                {hypotheticals.length > 0 && (
                    <div>
                        <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-3">
                            If the Top Issues Were Fixed
                        </p>
                        <ul className="space-y-1.5">
                            {hypotheticals.map((h) => (
                                <li key={h.factor} className="flex items-start gap-2 text-xs text-[var(--nui-text-2)] leading-relaxed">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--nui-accent)] flex-shrink-0" />
                                    <span>
                                        {HYPOTHETICAL_VERB_PHRASE[h.factor] || "Fixing this factor"} on the{" "}
                                        {h.affectedApplicationCount} flagged application{h.affectedApplicationCount === 1 ? "" : "s"} would
                                        raise the application and data security score to approximately{" "}
                                        <strong className="text-[var(--nui-text)]">{h.hypotheticalScore}</strong> (currently {h.currentScore}).
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ── Section Breakdown ────────────────────────────────────────── */}
                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-3">Section Breakdown</p>
                    <div className="space-y-2.5">
                        {sectionsByRisk.map((s) => {
                            const level = getRiskLevel(Math.round(s.sectionRisk));
                            const cfg = RISK_CONFIG[level] || RISK_CONFIG.Medium;
                            return (
                                <div key={s.sectionId} className="bg-[var(--nui-surface-sunk)] border border-[var(--nui-line-soft)] rounded-xl px-4 py-3">
                                    <div className="flex items-center justify-between mb-2 gap-3">
                                        <span className="text-xs font-semibold text-[var(--nui-text-2)] truncate">{s.sectionName}</span>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-[10px] text-[var(--nui-text-3)]">{Math.round(s.normalizedWeight * 100)}% weight</span>
                                            <RiskLevelBadge level={level} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-[var(--nui-line)] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cfg.dot}`}
                                                style={{ width: `${Math.min(100, Math.round(s.sectionRisk))}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-[var(--nui-text-2)] w-16 text-right flex-shrink-0">
                                            Risk {Math.round(s.sectionRisk)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Incomplete data note (portfolio level) ───────────────────── */}
                {incompleteCount > 0 && (
                    <div className="flex items-start gap-2.5 bg-[var(--nui-surface-sunk)] border border-[var(--nui-line-soft)] rounded-xl px-4 py-3">
                        <FiInfo size={14} className="text-[var(--nui-text-3)] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--nui-text-3)] leading-relaxed">
                            {incompleteCount} application{incompleteCount === 1 ? " has" : "s have"} unanswered fields — complete
                            them in Step 7 for a more accurate score.
                        </p>
                    </div>
                )}

                {/* ── Application Breakdown Table ──────────────────────────────── */}
                <div>
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--nui-brand)] bg-[var(--nui-accent-tint)] border border-[color:var(--nui-accent-tint-2)] rounded-full px-3 py-1 mb-3">
                        Applications ({allApps.length}), highest risk first
                    </p>
                    <div className="overflow-x-auto border border-[var(--nui-line-soft)] rounded-xl">
                        <table className="w-full text-xs min-w-[520px]">
                            <thead>
                                <tr className="bg-[var(--nui-surface-sunk)] border-b border-[var(--nui-line-soft)]">
                                    <th className="text-left font-bold uppercase tracking-wide text-[var(--nui-text-3)] text-[10px] px-4 py-2.5">Provider Name</th>
                                    <th className="text-left font-bold uppercase tracking-wide text-[var(--nui-text-3)] text-[10px] px-4 py-2.5">Section</th>
                                    <th className="text-left font-bold uppercase tracking-wide text-[var(--nui-text-3)] text-[10px] px-4 py-2.5">Risk Score</th>
                                    <th className="text-left font-bold uppercase tracking-wide text-[var(--nui-text-3)] text-[10px] px-4 py-2.5">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allApps.map((a) => (
                                    <tr key={a.id} className="border-b border-[var(--nui-line-soft)] last:border-0 hover:bg-[var(--nui-surface-sunk)]/60 transition-colors">
                                        <td className="px-4 py-2.5 font-medium text-[var(--nui-text-2)]">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate max-w-[160px]">{a.name || "Unnamed application"}</span>
                                                {a.hasIncompleteData && <IncompleteDataTag />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 text-[var(--nui-text-3)]">{a.sectionName}</td>
                                        <td className="px-4 py-2.5 font-bold text-[var(--nui-text-2)]">{a.riskScore}/100</td>
                                        <td className="px-4 py-2.5"><RiskLevelBadge level={a.riskLevel} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Business Operations
// ════════════════════════════════════════════════════════════════════════════
const BusinessOperationsSection = ({ blueprint }) => {
    const bp = blueprint || {};
    const hasChips = Array.isArray(bp.operationalChallenges) && bp.operationalChallenges.length > 0;

    return (
        <SectionCard
            id="business-operations"
            eyebrow="Business Context"
            title="Business Operations"
            description="Business context, criticality, and operational challenges, as reported in Step 6 of the assessment."
            Icon={FiTrendingUp}
        >
            <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <InfoTile label="Primary Business Function" value={bp.primaryBusinessFunction} />
                    <InfoTile label="Main Products / Services" value={bp.mainProductsServices} />
                    <InfoTile label="Critical Business Function" value={bp.criticalBusinessFunction} />
                    <InfoTile label="Systems Requiring 24x7" value={bp.systemsRequiring24x7} />
                    <InfoTile label="Highest Business Priority" value={bp.highestBusinessPriority} />
                    <InfoTile label="Number of Locations" value={bp.numberOfLocations} />
                    <InfoTile label="Primary Customer Type" value={bp.primaryCustomerType} />
                    <InfoTile label="Geographic Reach" value={bp.geographicReach} />
                </div>

                <div>
                    <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-2">Operational Challenges</p>
                    {hasChips ? (
                        <div className="flex flex-wrap gap-2">
                            {bp.operationalChallenges.map((c, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-[var(--nui-accent-tint)] text-[var(--nui-brand)] text-xs font-semibold">
                                    {c}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-[var(--nui-text-3)]">No operational challenges recorded.</p>
                    )}
                </div>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Business Workflows
// ════════════════════════════════════════════════════════════════════════════
const BusinessWorkflowsSection = () => (
    <SectionCard
        id="business-workflows"
        eyebrow="Coming Soon"
        title="Business Workflows"
        description="How work, identity, and access move through the organization — captured separately from the application inventory above."
        Icon={FiGitBranch}
    >
        <EmptyStateNotice
            Icon={FiGitBranch}
            title="Not yet collected"
            description="Business Workflows (data flow, provisioning, offboarding, and critical dependencies) is a planned assessment step that does not exist in the current 7-step Current State Assessment. This section will populate automatically once that step is added — no data is fabricated here."
        />
    </SectionCard>
);

// ════════════════════════════════════════════════════════════════════════════
// Section: Applications / Technology Stack
// ════════════════════════════════════════════════════════════════════════════
const ApplicationsSection = ({ blueprint, report }) => {
    const bp = blueprint || {};
    const applications = bp.applications && typeof bp.applications === "object" ? bp.applications : {};
    const categoryEntries = Object.entries(applications).filter(([, v]) => Array.isArray(v));
    const totalApps = categoryEntries.reduce((sum, [, arr]) => sum + arr.length, 0);

    return (
        <SectionCard
            id="applications"
            eyebrow="Application Portfolio"
            title="Technology Stack"
            description="Applications recorded across all categories, plus MFA and backup coverage across the portfolio."
            Icon={FiGrid}
        >
            {totalApps === 0 ? (
                <EmptyStateNotice
                    Icon={FiGrid}
                    title="No applications recorded yet"
                    description="Add applications in Step 7 of the Current State Assessment to populate this section."
                />
            ) : (
                <div className="space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {categoryEntries.map(([key, arr]) => (
                            <InfoTile key={key} label={getCategoryLabel(key, bp.customCategories)} value={`${arr.length} app${arr.length === 1 ? "" : "s"}`} />
                        ))}
                        <InfoTile label="Total Applications" value={totalApps} />
                        <InfoTile label="PII-Handling Apps" value={report.signals.piiAppsCount} />
                        <InfoTile label="HIPAA-Regulated Apps" value={report.signals.hipaaAppsCount} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                        <div className="bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line-soft)] p-4 flex flex-col items-center gap-1.5">
                            <ProgressRing value={report.metrics.appMfaCoverage} size={64} strokeWidth={7} color={ACCENT} />
                            <span className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] text-center">MFA Coverage</span>
                        </div>
                        <div className="bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line-soft)] p-4 flex flex-col items-center gap-1.5">
                            <ProgressRing value={report.metrics.appBackupCoverage} size={64} strokeWidth={7} color={PRIMARY} />
                            <span className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] text-center">Backup Coverage</span>
                        </div>
                    </div>
                </div>
            )}
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Assessment Data (full category table + methodology + data gaps)
// ════════════════════════════════════════════════════════════════════════════
const AssessmentDataSection = ({ report }) => {
    const { categories, dataGaps } = report;

    const getZone = (s) => {
        if (s <= 30) return { label: "Critical", color: "#ef4444", badge: "bg-red-100 text-red-700 dark:bg-[var(--nui-risk-bg)] dark:text-[var(--nui-risk)]" };
        if (s <= 50) return { label: "At Risk", color: "#f97316", badge: "bg-amber-100 text-amber-700 dark:bg-[var(--nui-warn-bg)] dark:text-[var(--nui-warn)]" };
        if (s <= 65) return { label: "Developing", color: "#eab308", badge: "bg-yellow-100 text-yellow-700 dark:bg-[var(--nui-warn-bg)] dark:text-[var(--nui-warn)]" };
        if (s <= 80) return { label: "Managed", color: ACCENT, badge: "bg-teal-100 text-teal-700 dark:bg-[var(--nui-accent-tint)] dark:text-[var(--nui-accent)]" };
        return { label: "Optimized", color: "#22c55e", badge: "bg-green-100 text-green-700 dark:bg-[var(--nui-ok-bg)] dark:text-[var(--nui-ok)]" };
    };

    return (
        <SectionCard
            id="assessment-data"
            eyebrow="Current State Summary"
            title="Assessment Data"
            description="The complete 12-category score table underlying the composite Security Score, plus known data-availability gaps."
            Icon={FiFileText}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((c) => {
                        const zone = getZone(c.rawScore);
                        return (
                            <div key={c.id} className="bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line-soft)] p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-xs font-semibold text-[var(--nui-text-2)] leading-tight">{c.name}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${zone.badge}`}>
                                        {zone.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-[var(--nui-line)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${c.rawScore}%`, backgroundColor: zone.color }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-[var(--nui-text-2)] w-10 text-right flex-shrink-0">
                                        {c.rawScore}/100
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-[10px] text-[var(--nui-text-3)]">Weight: {Math.round(c.weight * 100)}%</span>
                                    <span className="text-[10px] text-[var(--nui-text-3)]">Contribution: +{c.contribution}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Disclosure label={`Data Availability Notes (${dataGaps.length})`}>
                    <p className="text-xs text-[var(--nui-text-3)] mb-3 leading-relaxed">
                        These signals are not captured by the current 7-step assessment, so the scoring engine cannot
                        use them. They are listed here for transparency.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {dataGaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[var(--nui-text-3)]">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--nui-line-strong)] flex-shrink-0" />
                                {gap}
                            </li>
                        ))}
                    </ul>
                </Disclosure>

                <div className="bg-[var(--nui-surface-sunk)] border border-[var(--nui-line-soft)] rounded-xl p-4">
                    <p className="text-[11px] text-[var(--nui-text-3)] leading-relaxed">
                        <strong className="text-[var(--nui-text-2)]">Scoring methodology:</strong> Each category scores 0–100
                        based on specific controls and configurations. Categories are weighted and summed to produce
                        a composite, then critical-control penalties and caps are applied. Full methodology is
                        documented in the IT Blueprint scoring architecture reference.
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Main page component
// ════════════════════════════════════════════════════════════════════════════
export default function AssessmentReport() {
    const router = useRouter();

    const [blueprint, setBlueprint] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [assessmentDate, setAssessmentDate] = useState("");

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
                    notify.warning("Complete your assessment first", {
                        description: "Your Security Score is generated once your Current State Assessment is complete.",
                    });
                    router.push("/blueprint-form");
                    return;
                }

                setBlueprint(bp);
                setReport(generateReport(bp));

                if (bp.companyName) setCompanyName(bp.companyName);
                else {
                    const storedName = localStorage.getItem("userCompanyName");
                    if (storedName) setCompanyName(storedName);
                }

                // Always show today's date — the report is generated now
                setAssessmentDate(
                    new Date().toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                    }),
                );
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    notify.warning("Complete your assessment first", {
                        description: "Your Security Score is generated once your Current State Assessment is complete.",
                    });
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
            <div className="nui relative min-h-screen">
                <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
                <div
                    role="status"
                    aria-live="polite"
                    className="relative flex min-h-screen flex-col items-center justify-center px-6"
                >
                    <span
                        aria-hidden="true"
                        className="mb-5 inline-block h-9 w-9 animate-spin rounded-full border-2 border-[var(--nui-line-strong)] border-t-[var(--nui-brand)]"
                    />
                    <p className="nui-display text-[15px] font-semibold text-[var(--nui-text)]">
                        Generating your Current State Report
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--nui-text-3)]">
                        Calculating your Security Score from your assessment data…
                    </p>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error || !report) {
        return (
            <div className="nui relative min-h-screen">
                <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
                <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
                    <p className="mb-4 max-w-sm text-sm text-[var(--nui-risk)]">{error || "Report data unavailable."}</p>
                    <button
                        type="button"
                        onClick={() => router.push("/assessment-complete")}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[var(--nui-brand)] rounded-[var(--nui-r-sm)] hover:bg-[var(--nui-brand-hover)] transition-colors"
                    >
                        Back to Assessment Complete
                    </button>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AppShell
            sections={SECTIONS}
            contentClassName="px-4 pt-8 pb-24 sm:px-6 lg:px-8"
        >
            <NuiCanvas>
                <div className="mx-auto max-w-[1180px] space-y-6">
                    <NuiReveal>
                        <NuiHero
                            eyebrow="IT Blueprint · Current State Report"
                            title={companyName || "Security Score"}
                            context={`Generated ${assessmentDate}. A snapshot assessment based on self-reported data, calculated from a fixed, published methodology, not the advisor-built Assessment with Remediation Plan.`}
                            snapshot={[
                                { label: "Security Score", value: report.score, unit: "/100" },
                                { label: "Maturity", value: `L${report.maturity.level}` },
                            ]}
                        />
                    </NuiReveal>

                    <OverviewSection report={report} />
                    <OrganizationSection blueprint={blueprint} />
                    <InfrastructureSection blueprint={blueprint} />
                    <SecuritySection report={report} />
                    <ApplicationSecuritySection report={report} />
                    <BusinessOperationsSection blueprint={blueprint} />
                    <BusinessWorkflowsSection />
                    <ApplicationsSection blueprint={blueprint} report={report} />
                    <AssessmentDataSection report={report} />
                </div>
            </NuiCanvas>
        </AppShell>
    );
}
