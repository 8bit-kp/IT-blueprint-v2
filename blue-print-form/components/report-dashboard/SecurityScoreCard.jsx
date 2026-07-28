"use client";

/**
 * SecurityScoreCard — the Security Score visualization: gauge + maturity
 * badge, the 6-card KPI row (score, maturity level, critical findings,
 * controls missing, app MFA/backup coverage), and the advisor-boundary
 * disclaimer.
 *
 * Extracted from the assessment-report dashboard's "Report Home" section
 * so both `/assessment-report` and `/assessment-complete` render the exact
 * same score presentation from one place — no duplicated markup, no
 * duplicated score math. This component only renders `report` (the
 * `generateReport()` output); it never computes or re-derives a score.
 */

import { FiShield, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";
import GaugeChart from "@/components/report-charts/GaugeChart";
import ProgressRing from "@/components/report-charts/ProgressRing";
import StatCard from "@/components/report-dashboard/StatCard";

const ACCENT = "#34808A";

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

const SecurityScoreCard = ({ report }) => {
    const { score, maturity, metrics } = report;
    const zone = scoreZone(score);

    return (
        <div>
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
        </div>
    );
};

export default SecurityScoreCard;
