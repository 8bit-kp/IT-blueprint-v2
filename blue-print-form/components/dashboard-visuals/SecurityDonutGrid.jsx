"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { getDonutColor, DONUT_COLORS } from "@/constants/colors";

// ── Single Donut Card ─────────────────────────────────────────────────────

const DonutCard = ({ label, status }) => {
    const fillColor = getDonutColor(status);
    const emptyColor = DONUT_COLORS.default;

    // Full ring = 1 segment at 100%
    const data = [{ value: 100 }];

    return (
        <div className="flex flex-col items-center gap-2 bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-300">
            {/* Donut */}
            <div className="relative">
                <PieChart width={120} height={120}>
                    {/* Background track */}
                    <Pie
                        data={[{ value: 100 }]}
                        cx={55}
                        cy={55}
                        innerRadius={38}
                        outerRadius={52}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        isAnimationActive={false}
                        stroke="none"
                    >
                        <Cell fill={emptyColor} />
                    </Pie>
                    {/* Filled arc */}
                    <Pie
                        data={data}
                        cx={55}
                        cy={55}
                        innerRadius={38}
                        outerRadius={52}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        isAnimationActive={!!status}
                        animationBegin={0}
                        animationDuration={900}
                        animationEasing="ease-out"
                        stroke="none"
                    >
                        <Cell fill={fillColor} />
                    </Pie>
                </PieChart>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                        className="text-xs font-bold leading-tight"
                        style={{ color: fillColor === DONUT_COLORS.default ? "#9ca3af" : fillColor }}
                    >
                        {status || "—"}
                    </span>
                </div>
            </div>

            {/* Control name */}
            <p className="text-center text-xs font-semibold text-gray-700 leading-snug px-1">
                {label}
            </p>
        </div>
    );
};

// ── Technical Controls Grid ───────────────────────────────────────────────

const technicalControls = [
    { label: "Next Gen Firewall", key: "nextGenFirewall" },
    { label: "Secure Web Gateway", key: "secureWebGateway" },
    { label: "CASB", key: "casb" },
    { label: "Data Loss Prevention", key: "dlp" },
    { label: "SSL VPN", key: "sslVpn" },
    { label: "Email Security", key: "emailSecurity" },
    { label: "Vulnerability Scanning", key: "vulnerabilityScanning" },
    { label: "IAM", key: "iam" },
    { label: "NAC", key: "nac" },
    { label: "MFA", key: "mfa" },
    { label: "MDM", key: "mdm" },
    { label: "EDR", key: "edr" },
    { label: "Data Classification", key: "dataClassification" },
    { label: "SOC - SIEM", key: "socSiem" },
    { label: "Asset Management", key: "assetManagement" },
    { label: "SD-WAN", key: "sdWan" },
];

const adminControls = [
    { label: "Security Committee", key: "securityCommittee" },
    { label: "IT Governance", key: "itGovernance" },
    { label: "Security Policies", key: "securityPolicies" },
    { label: "Risk Assessment", key: "riskAssessment" },
    { label: "Incident Response", key: "incidentResponse" },
    { label: "Business Continuity", key: "businessContinuity" },
    { label: "Disaster Recovery", key: "disasterRecovery" },
    { label: "Security Training", key: "securityTraining" },
    { label: "Third Party Risk", key: "thirdPartyRisk" },
    { label: "Vulnerability Management", key: "vulnerabilityManagement" },
    { label: "Penetration Testing", key: "penetrationTest" },
];

// ── Section Wrapper ────────────────────────────────────────────────────────

const DonutSection = ({ title, subtitle, items }) => (
    <div className="mb-10">
        {/* Section header */}
        <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-6 py-4 rounded-xl mb-5 shadow">
            <h3 className="text-lg font-bold">{title}</h3>
            {subtitle && <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>}
        </div>

        {/* Donut grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
                <DonutCard key={item.key} label={item.label} status={item.status} />
            ))}
        </div>
    </div>
);

// ── Main Export ────────────────────────────────────────────────────────────

/**
 * SecurityDonutGrid
 *
 * Props:
 *   formData – the raw blueprint document from the DB
 */
const SecurityDonutGrid = ({ formData }) => {
    const dbTech = formData?.technicalControls || {};

    const techItems = technicalControls.map((c) => ({
        ...c,
        // technical controls store status under .choice
        status: dbTech[c.key]?.choice || null,
    }));

    const adminItems = adminControls.map((c) => ({
        ...c,
        // governance controls stored directly on formData
        status: formData?.[c.key] || null,
    }));

    return (
        <div>
            <DonutSection
                title="Security Technical Controls"
                subtitle="Next Gen Firewall → SD-WAN: current implementation status"
                items={techItems}
            />
            <DonutSection
                title="Governance & Administrative Controls"
                subtitle="Policy framework and compliance status"
                items={adminItems}
            />
        </div>
    );
};

export default SecurityDonutGrid;
