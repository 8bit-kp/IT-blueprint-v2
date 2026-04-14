import React from "react";
import { getStatusBadgeClass, getPriorityBadgeClass, getOfferingBadgeClass } from "@/constants/colors";

// ── Color-coded badge helpers ──────────────────────────────────────────────

const StatusBadge = ({ value }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(value)}`}>
        {value || "—"}
    </span>
);

const PriorityBadge = ({ value }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadgeClass(value)}`}>
        {value || "—"}
    </span>
);

const OfferingBadge = ({ value }) => (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getOfferingBadgeClass(value)}`}>
        {value || "—"}
    </span>
);

// ── Main Component ─────────────────────────────────────────────────────────

const SecurityDashboard = ({ formData }) => {
    // Keys match exactly what the Blueprint model stores under technicalControls
    const technicalControls = [
        { label: "Next Gen Firewall", key: "nextGenFirewall" },
        { label: "Secure Web Gateway", key: "secureWebGateway" },
        { label: "CASB", key: "casb" },
        { label: "Data Loss Prevention", key: "dlp" },
        { label: "SSA-VPN", key: "ssaVpn" },
        { label: "Email Security", key: "emailSecurity" },
        { label: "Vulnerability Management", key: "vulnerabilityMgmt" },
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

    // Pull nested technicalControls object from DB data
    const dbTechControls = formData?.technicalControls || {};

    return (
        <div className="space-y-8">
            {/* ── Technical Controls Table ───────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Security Technical Controls</h2>
                    <p className="text-sm text-white/90 mt-1">
                        Data fetched from your Security Technical Controls submission
                    </p>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#0F4C5C] text-white text-sm">
                                    <th className="px-4 py-4 text-left font-bold">Control</th>
                                    <th className="px-4 py-4 text-left font-bold">Status</th>
                                    <th className="px-4 py-4 text-left font-bold">Vendor / Provider</th>
                                    <th className="px-4 py-4 text-left font-bold">Priority</th>
                                    <th className="px-4 py-4 text-left font-bold">Offering</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicalControls.map((control, index) => {
                                    const value = dbTechControls[control.key] || {};
                                    return (
                                        <tr
                                            key={control.key}
                                            className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-[#B8E6E6]/30" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-4 py-4 font-semibold text-gray-800">
                                                {control.label}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge value={value.choice} />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {value.vendor ? (
                                                    <span className="font-medium">{value.vendor}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <PriorityBadge value={value.businessPriority} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <OfferingBadge value={value.offering} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Administrative Controls Grid ───────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Governance &amp; Administrative Controls</h2>
                    <p className="text-sm text-white/90 mt-1">Policy framework and compliance status</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {adminControls.map((control) => (
                            <div
                                key={control.key}
                                className="flex items-center justify-between gap-4 p-5 bg-gradient-to-r from-[#7BC5C5]/30 to-[#B8E6E6]/30 rounded-xl border-2 border-[#7BC5C5]/50"
                            >
                                <span className="font-semibold text-gray-800">{control.label}</span>
                                <StatusBadge value={formData?.[control.key]} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
