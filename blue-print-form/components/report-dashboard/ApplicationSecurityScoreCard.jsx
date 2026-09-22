"use client";

/**
 * ApplicationSecurityScoreCard — the Application Security Score
 * visualization: gauge + portfolio band badge + a compact KPI row (total
 * applications, risk distribution, highest-risk application, section
 * contributing most risk). Mirrors SecurityScoreCard's structure/scope so
 * the two read as a matched pair, while remaining its own distinct card
 * with its own title, never merged into the main score's gauge.
 *
 * Renders only `report.applicationSecurityScore` (a PortfolioScoreResult
 * from lib/report/application-score) — never computes or re-derives a
 * score. "Highest-risk application" and "section contributing most risk"
 * are plain sort/max reads over already-computed fields, not new scoring.
 *
 * See docs/application-security-score-methodology.md §§ 9, 16.
 */

import { FiLayers, FiAlertTriangle, FiBarChart2 } from "react-icons/fi";
import GaugeChart from "@/components/report-charts/GaugeChart";
import StatCard from "@/components/report-dashboard/StatCard";
import EmptyStateNotice from "@/components/report-dashboard/EmptyStateNotice";

// Portfolio-level Application Security Score bands — a display-only
// classification of the already-computed overallScore, per
// docs/application-security-score-methodology.md § 9. Not scoring logic:
// the same kind of local label/color lookup this dashboard already uses
// for the main score (see SecurityScoreCard's scoreZone / GaugeChart's
// getZoneColor) applied to this score's own six-tier band table.
const APPLICATION_SCORE_BANDS = [
    { min: 90, label: "Excellent",         badge: "bg-green-100 text-green-700" },
    { min: 75, label: "Strong",            badge: "bg-teal-100 text-teal-700" },
    { min: 55, label: "Moderate",          badge: "bg-yellow-100 text-yellow-700" },
    { min: 35, label: "Needs Improvement", badge: "bg-amber-100 text-amber-700" },
    { min: 15, label: "Poor",              badge: "bg-orange-100 text-orange-700" },
    { min: 0,  label: "Critical",          badge: "bg-red-100 text-red-700" },
];

const getApplicationScoreBand = (score) =>
    APPLICATION_SCORE_BANDS.find((b) => score >= b.min) || APPLICATION_SCORE_BANDS[APPLICATION_SCORE_BANDS.length - 1];

const RISK_DISTRIBUTION_COLOR = { low: "#16a34a", medium: "#d97706", high: "#f97316", critical: "#dc2626" };

const driverCount = (topRiskDrivers, factor) =>
    topRiskDrivers.find((d) => d.factor === factor)?.affectedApplicationCount ?? 0;

const ApplicationSecurityScoreCard = ({ report }) => {
    const appScore = report.applicationSecurityScore;

    if (!appScore || appScore.overallScore === null) {
        return (
            <EmptyStateNotice
                Icon={FiLayers}
                title="Application and data security: Not yet assessed"
                description="Complete the Application Portfolio section (Step 7 of the Current State Assessment) to see this score."
            />
        );
    }

    const { overallScore, totalApplications, riskDistribution, sections, topRiskDrivers } = appScore;
    const band = getApplicationScoreBand(overallScore);

    const allApps = sections.flatMap((s) => s.applications);
    const highestRiskApp = allApps.length
        ? [...allApps].sort((a, b) => b.riskScore - a.riskScore)[0]
        : null;
    const topRiskSection = sections.length
        ? [...sections].sort((a, b) => b.normalizedWeight * b.sectionRisk - a.normalizedWeight * a.sectionRisk)[0]
        : null;

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="flex flex-col items-center gap-3 mx-auto">
                    <GaugeChart score={overallScore} size={220} />
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${band.badge}`}>
                        {band.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard label="Applications Assessed" value={totalApplications} sub="across all sections" Icon={FiLayers} color="#15587B" />
                    <StatCard
                        label="Without MFA"
                        value={driverCount(topRiskDrivers, "mfaEnabled")}
                        sub="flagged applications"
                        color={driverCount(topRiskDrivers, "mfaEnabled") > 0 ? "#dc2626" : "#16a34a"}
                        Icon={FiAlertTriangle}
                    />
                    <StatCard
                        label="Without Backup"
                        value={driverCount(topRiskDrivers, "backedUp")}
                        sub="flagged applications"
                        color={driverCount(topRiskDrivers, "backedUp") > 0 ? "#dc2626" : "#16a34a"}
                        Icon={FiAlertTriangle}
                    />
                    <StatCard
                        label="With BYOD Access"
                        value={driverCount(topRiskDrivers, "byodAccess")}
                        sub="flagged applications"
                        color={driverCount(topRiskDrivers, "byodAccess") > 0 ? "#d97706" : "#16a34a"}
                        Icon={FiAlertTriangle}
                    />
                    {highestRiskApp && (
                        <StatCard
                            label="Highest-Risk Application"
                            value={<span className="block truncate text-base">{highestRiskApp.name || "Unnamed"}</span>}
                            sub={`Risk ${highestRiskApp.riskScore}/100 — ${highestRiskApp.riskLevel}`}
                            color="#dc2626"
                            Icon={FiAlertTriangle}
                        />
                    )}
                    {topRiskSection && (
                        <StatCard
                            label="Section Contributing Most Risk"
                            value={<span className="block truncate text-base">{topRiskSection.sectionName}</span>}
                            sub={`Risk ${Math.round(topRiskSection.sectionRisk)}/100 · ${Math.round(topRiskSection.normalizedWeight * 100)}% weight`}
                            color="#d97706"
                            Icon={FiBarChart2}
                        />
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["low", "medium", "high", "critical"].map((level) => (
                    <div key={level} className="bg-[var(--nui-surface-sunk)] border border-[var(--nui-line)] rounded-[var(--nui-r-sm)] px-3 py-2 flex items-center justify-between">
                        <span className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)]">
                            {level === "low" ? "Low" : level === "medium" ? "Medium" : level === "high" ? "High" : "Critical"}
                        </span>
                        <span className="nui-num text-sm font-extrabold" style={{ color: RISK_DISTRIBUTION_COLOR[level] }}>
                            {riskDistribution[level]}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-[var(--nui-accent-tint)] border border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r)] px-5 py-4">
                <p className="text-xs text-[var(--nui-text-2)] leading-relaxed">
                    This is an independent snapshot of the applications recorded in your Application Portfolio (Step 7),
                    calculated from a fixed published methodology. It is separate from the main Security Score above and
                    is not equivalent to the <strong className="text-[var(--nui-text)]">Assessment with Remediation Plan</strong>.
                </p>
            </div>
        </div>
    );
};

export default ApplicationSecurityScoreCard;
