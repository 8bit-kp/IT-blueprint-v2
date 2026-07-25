"use client";

/**
 * app/assessment-report/page.js
 *
 * Single-page executive dashboard for the Current State Report.
 *
 * Replaces the previous 5-step paginated flow (Cover / Executive Summary /
 * Key Metrics / Score Breakdown / Category Scores) with one continuous
 * scroll organized into anchored sections, navigable via the floating
 * ReportSidebar. No scoring or maturity logic changed — generateReport()
 * output is rendered as-is; only presentation and navigation changed.
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
} from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { generateReport } from "@/lib/report/index.js";

import GaugeChart from "@/components/report-charts/GaugeChart";
import CategoryRadar from "@/components/report-charts/CategoryRadar";
import WaterfallChart from "@/components/report-charts/WaterfallChart";
import HorizontalBarChart from "@/components/report-charts/HorizontalBarChart";
import ProgressRing from "@/components/report-charts/ProgressRing";

import ReportSidebar from "@/components/navigation/ReportSidebar";
import SectionCard from "@/components/report-dashboard/SectionCard";
import StatCard from "@/components/report-dashboard/StatCard";
import InfoTile from "@/components/report-dashboard/InfoTile";
import EmptyStateNotice from "@/components/report-dashboard/EmptyStateNotice";
import Disclosure from "@/components/report-dashboard/Disclosure";

// ── Brand colours ────────────────────────────────────────────────────────────
const PRIMARY = "#15587B";
const ACCENT = "#34808A";

// ── Score zone helpers (shared logic, unchanged from the prior page) ────────
const scoreColor = (s) => {
    if (s <= 30) return "#ef4444";
    if (s <= 50) return "#f97316";
    if (s <= 65) return "#eab308";
    if (s <= 80) return ACCENT;
    return "#22c55e";
};

const scoreZone = (s) => {
    if (s <= 30) return { badge: "bg-red-100 text-red-700", label: "Critical" };
    if (s <= 50) return { badge: "bg-amber-100 text-amber-700", label: "At Risk" };
    if (s <= 65) return { badge: "bg-yellow-100 text-yellow-700", label: "Developing" };
    if (s <= 80) return { badge: "bg-teal-100 text-teal-700", label: "Managed" };
    return { badge: "bg-green-100 text-green-700", label: "Optimized" };
};

const RISK_CONFIG = {
    Critical: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    High: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
    Medium: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    Low: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
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
    { id: "business-operations", label: "Business Operations", Icon: FiTrendingUp },
    { id: "business-workflows", label: "Business Workflows", Icon: FiGitBranch },
    { id: "applications", label: "Technology Stack", Icon: FiGrid },
    { id: "assessment-data", label: "Assessment Data", Icon: FiFileText },
];

// ════════════════════════════════════════════════════════════════════════════
// Section: Overview
// ════════════════════════════════════════════════════════════════════════════
const OverviewSection = ({ report, companyName, assessmentDate }) => {
    const { score, maturity, metrics } = report;
    const zone = scoreZone(score);

    return (
        <SectionCard
            id="overview"
            eyebrow="Current State Report"
            title={companyName ? `${companyName} — Security Score` : "Security Score"}
            description={`Generated ${assessmentDate}. A snapshot assessment based on self-reported data, calculated from a fixed, published methodology.`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="flex flex-col items-center gap-3 mx-auto">
                    <GaugeChart score={score} size={220} />
                    <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${zone.badge}`}
                    >
                        IT Maturity Level {maturity.level} — {maturity.name}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard label="Security Score" value={score} sub="out of 100" color={scoreColor(score)} large Icon={FiShield} />
                    <StatCard label="Maturity Level" value={`L${maturity.level}`} sub={maturity.name} color={maturity.color} large Icon={FiTrendingUp} />
                    <StatCard
                        label="Critical Findings"
                        value={metrics.criticalFindingsCount}
                        sub="penalties ≥ 7 pts"
                        color={metrics.criticalFindingsCount > 0 ? "#dc2626" : "#16a34a"}
                        Icon={FiAlertTriangle}
                    />
                    <StatCard
                        label="Controls Missing"
                        value={`${metrics.controlsMissingCount}/16`}
                        sub="tech controls absent"
                        color={metrics.controlsMissingCount > 8 ? "#dc2626" : metrics.controlsMissingCount > 4 ? "#d97706" : "#16a34a"}
                        Icon={FiShield}
                    />
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center gap-1">
                        <ProgressRing value={metrics.appMfaCoverage} size={56} strokeWidth={6} color={metrics.appMfaCoverage !== null && metrics.appMfaCoverage >= 80 ? "#16a34a" : "#d97706"} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">App MFA Coverage</span>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center gap-1">
                        <ProgressRing value={metrics.appBackupCoverage} size={56} strokeWidth={6} color={metrics.appBackupCoverage !== null && metrics.appBackupCoverage >= 80 ? "#16a34a" : "#d97706"} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">App Backup Coverage</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-[#15587B]/5 border border-[#15587B]/15 rounded-xl px-5 py-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                    This report is a formulaic snapshot — it scores your answers against a fixed published methodology.
                    It is not equivalent to the{" "}
                    <strong className="text-gray-800">Assessment with Remediation Plan</strong>, which requires advisor
                    review and is delivered as a paid engagement following your consultation.
                </p>
            </div>
        </SectionCard>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// Section: Executive Summary strengths/risks (rendered inside Security)
// ════════════════════════════════════════════════════════════════════════════
const StrengthsAndRisks = ({ strengths, criticalRisks }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
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
                            <FiCheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                                <p className="text-[11px] text-gray-500 leading-snug">{s.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
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
                            <FiAlertTriangle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Facilities</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <InfoTile label="Physical Offices" value={bp.physicalOffices} />
                        <InfoTile label="Data Centers" value={yn(bp.hasDataCenters)} />
                        <InfoTile label="On-Prem DC" value={yn(bp.hasOnPremDC)} />
                        <InfoTile label="Cloud Infrastructure" value={yn(bp.hasCloudInfra)} />
                        <InfoTile label="Generator" value={yn(bp.hasGenerator)} />
                        <InfoTile label="UPS" value={yn(bp.hasUPS)} />
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Network</p>
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Servers &amp; Desktops</p>
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Risk Summary</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {["cyber", "downtime", "compliance"].map((k) => {
                            const cfg = RISK_CONFIG[risks[k]] || RISK_CONFIG.Medium;
                            const labels = { cyber: "Cyber Risk", downtime: "Downtime Risk", compliance: "Compliance Risk" };
                            return (
                                <div key={k} className={`flex items-center justify-between rounded-xl px-4 py-3 ${cfg.bg}`}>
                                    <span className="text-xs font-semibold text-gray-700">{labels[k]}</span>
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${cfg.text}`}>
                                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        {risks[k]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                        Risk levels are derived mechanically from assessment signals. Precise risk quantification and
                        business-specific context are part of the{" "}
                        <strong className="text-gray-600">Assessment with Remediation Plan</strong>.
                    </p>
                </div>

                <Disclosure label={`Score Deduction Waterfall${appliedCap !== null ? " (cap applied)" : ""}`}>
                    <WaterfallChart waterfall={waterfall} />
                    {appliedCap !== null && (
                        <p className="text-[11px] text-amber-600 mt-3 border-l-2 border-amber-300 pl-3">
                            Score cap applied: one or more critical controls are absent. The cap prevents the score
                            from misrepresenting the organisation&apos;s actual risk exposure.
                        </p>
                    )}
                    {triggeredPenalties.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Penalties Applied ({triggeredPenalties.length})
                            </p>
                            <div className="space-y-1.5">
                                {triggeredPenalties.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                                        <span className="text-xs text-gray-600">{p.label}</span>
                                        <span className="text-xs font-bold text-red-600">−{p.value} pts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Disclosure>

                <Disclosure label={`IT Maturity Characteristics — Level ${maturity.level}`}>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{maturity.description}</p>
                    <ul className="space-y-1.5">
                        {maturity.characteristics.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Operational Challenges</p>
                    {hasChips ? (
                        <div className="flex flex-wrap gap-2">
                            {bp.operationalChallenges.map((c, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-[#15587B]/8 text-[#15587B] text-xs font-semibold">
                                    {c}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400">No operational challenges recorded.</p>
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
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-1.5">
                            <ProgressRing value={report.metrics.appMfaCoverage} size={64} strokeWidth={7} color={ACCENT} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">MFA Coverage</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-1.5">
                            <ProgressRing value={report.metrics.appBackupCoverage} size={64} strokeWidth={7} color={PRIMARY} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Backup Coverage</span>
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
        if (s <= 30) return { label: "Critical", color: "#ef4444", badge: "bg-red-100 text-red-700" };
        if (s <= 50) return { label: "At Risk", color: "#f97316", badge: "bg-amber-100 text-amber-700" };
        if (s <= 65) return { label: "Developing", color: "#eab308", badge: "bg-yellow-100 text-yellow-700" };
        if (s <= 80) return { label: "Managed", color: ACCENT, badge: "bg-teal-100 text-teal-700" };
        return { label: "Optimized", color: "#22c55e", badge: "bg-green-100 text-green-700" };
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
                            <div key={c.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-xs font-semibold text-gray-700 leading-tight">{c.name}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${zone.badge}`}>
                                        {zone.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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

                <Disclosure label={`Data Availability Notes (${dataGaps.length})`}>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        These signals are not captured by the current 7-step assessment, so the scoring engine cannot
                        use them. They are listed here for transparency.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {dataGaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                                {gap}
                            </li>
                        ))}
                    </ul>
                </Disclosure>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        <strong className="text-gray-600">Scoring methodology:</strong> Each category scores 0–100
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
    const [sidebarExpanded, setSidebarExpanded] = useState(() => {
        if (typeof window === "undefined") return true;
        const stored = localStorage.getItem("reportSidebarExpanded");
        return stored !== null ? stored === "true" : true;
    });

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
                    router.push("/blueprint-form");
                } else {
                    setError("Unable to load your assessment data. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    const toggleSidebar = () => {
        setSidebarExpanded((v) => {
            localStorage.setItem("reportSidebarExpanded", String(!v));
            return !v;
        });
    };

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
    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">
            {/* ── Sticky compact header ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className={[sidebarExpanded ? "md:ml-64" : "md:ml-24", "transition-[margin] duration-300"].join(" ")}>
                    <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/assessment-complete")}
                            className="md:hidden flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition flex-shrink-0"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <div>
                            <p className="text-xs font-bold text-[#15587B]">Current State Report</p>
                            {companyName && <p className="text-[10px] text-gray-400">{companyName}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push("/blueprint-form")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#15587B] rounded-full hover:bg-[#0f4460] transition flex-shrink-0"
                        >
                            Edit Assessment
                        </button>
                    </div>
                </div>
            </div>

            <ReportSidebar
                sections={SECTIONS}
                expanded={sidebarExpanded}
                onToggleExpanded={toggleSidebar}
                onEditAssessment={() => router.push("/blueprint-form")}
                onBack={() => router.push("/assessment-complete")}
            />

            {/* ── Scrollable content ───────────────────────────────────────────
                Left margin tracks the sidebar's current width (collapsed
                icon rail vs. expanded labeled panel) so content is never
                hidden behind it. Inner max-w-6xl/mx-auto/px-6 matches the
                container convention used by every other protected page
                (blueprint-summary, all-blueprints, assessment-complete). */}
            <main className={[sidebarExpanded ? "md:ml-64" : "md:ml-24", "transition-[margin] duration-300"].join(" ")}>
                <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

                <OverviewSection report={report} companyName={companyName} assessmentDate={assessmentDate} />
                <OrganizationSection blueprint={blueprint} />
                <InfrastructureSection blueprint={blueprint} />
                <SecuritySection report={report} />
                <BusinessOperationsSection blueprint={blueprint} />
                <BusinessWorkflowsSection />
                <ApplicationsSection blueprint={blueprint} report={report} />
                <AssessmentDataSection report={report} />
                </div>
            </main>
        </div>
    );
}
