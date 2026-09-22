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
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Security Technical Controls</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Security controls inventory from your Current State Assessment</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[var(--nui-surface-sunk)] text-[var(--nui-text-2)] text-xs">
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
                                            className={`border-b border-[var(--nui-line)] hover:bg-[var(--nui-surface-sunk)] transition-colors ${index % 2 === 0 ? "bg-[var(--nui-accent-tint)]" : "bg-[var(--nui-surface)]"
                                                }`}
                                        >
                                            <td className="px-4 py-4 font-semibold text-[var(--nui-text)]">
                                                {control.label}
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge value={value.choice} />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[var(--nui-text-2)]">
                                                {value.vendor ? (
                                                    <span className="font-medium">{value.vendor}</span>
                                                ) : (
                                                    <span className="text-[var(--nui-text-3)] italic text-xs">—</span>
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
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Governance &amp; Administrative Controls</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Governance and administrative controls inventory from your assessment</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ADMIN_CONTROLS.map((control) => (
                            <div
                                key={control.key}
                                className="flex items-center justify-between gap-4 p-4 bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line)] hover:border-[var(--nui-accent)]/50 transition-colors"
                            >
                                <span className="font-semibold text-[var(--nui-text-2)] text-sm">{control.label}</span>
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
