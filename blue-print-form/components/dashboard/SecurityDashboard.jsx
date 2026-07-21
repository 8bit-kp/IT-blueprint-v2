import React from "react";
import { getStatusBadgeClass, getPriorityBadgeClass, getOfferingBadgeClass } from "@/constants/colors";
import { TECHNICAL_CONTROLS, ADMIN_CONTROLS } from "@/lib/reports/shared/controlMaps";

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
    // Imported from lib/reports/shared/controlMaps — single source of truth

    // Pull nested technicalControls object from DB data
    const dbTechControls = formData?.technicalControls || {};

    return (
        <div className="space-y-6">
            {/* ── Technical Controls Table ───────────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Security Technical Controls</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Security controls inventory from your Current State Assessment</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-xs">
                                    <th className="px-4 py-3 text-left font-bold">Control</th>
                                    <th className="px-4 py-3 text-left font-bold">Status</th>
                                    <th className="px-4 py-3 text-left font-bold">Vendor / Provider</th>
                                    <th className="px-4 py-3 text-left font-bold">Priority</th>
                                    <th className="px-4 py-3 text-left font-bold">Offering</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TECHNICAL_CONTROLS.map((control, index) => {
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Governance &amp; Administrative Controls</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Governance and administrative controls inventory from your assessment</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ADMIN_CONTROLS.map((control) => (
                            <div
                                key={control.key}
                                className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#34808A]/50 transition-colors"
                            >
                                <span className="font-semibold text-gray-700 text-sm">{control.label}</span>
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
