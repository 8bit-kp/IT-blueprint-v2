import React from "react";
import { getStatusBadgeClass } from "@/constants/colors";

const AdministrationDashboard = ({ formData, updateField }) => {
    const companyFields = [
        { label: "Company Name", key: "companyName" },
        { label: "Industry", key: "industry" },
        { label: "Employees", key: "employees" },
        { label: "IT Department Size", key: "itDepartmentSize" },
    ];

    const governanceControls = [
        { label: "Security Committee", key: "securityCommittee" },
        { label: "IT Governance", key: "itGovernance" },
        { label: "Security Policies", key: "securityPolicies" },
        { label: "Incident Response Plan", key: "incidentResponse" },
        { label: "Business Continuity Plan", key: "businessContinuity" },
        { label: "Disaster Recovery Plan", key: "disasterRecovery" },
        { label: "Security Training", key: "securityTraining" },
        { label: "Risk Assessment", key: "riskAssessment" },
    ];

    return (
        <div className="space-y-6">
            {/* Company Profile Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Company Profile</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Basic organizational information</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {companyFields.map((field) => (
                            <div key={field.key} className="flex flex-col gap-1.5">
                                <label className="font-semibold text-[var(--nui-text-2)] text-xs uppercase tracking-wide">{field.label}</label>
                                <input
                                    type="text"
                                    value={formData[field.key] || ""}
                                    onChange={(e) => updateField(field.key, e.target.value)}
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    className="px-4 py-3 border-2 border-[var(--nui-line-strong)] rounded-lg text-[var(--nui-text)] placeholder-gray-400 focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] focus:placeholder-gray-500 font-medium"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Governance Controls Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Administrative Controls</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Governance and administrative controls inventory from your assessment</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {governanceControls.map((control) => {
                            const value = formData[control.key] || "No";
                            return (
                                <div key={control.key} className="flex items-center justify-between rounded-xl overflow-hidden border border-[var(--nui-line)] hover:border-[var(--nui-accent)]/50 transition-all shadow-sm">
                                    <div className="flex-1 px-5 py-4 bg-[var(--nui-surface-sunk)]">
                                        <span className="font-semibold text-[var(--nui-text-2)] text-sm">{control.label}</span>
                                    </div>
                                    <select
                                        value={value}
                                        onChange={(e) => updateField(control.key, e.target.value)}
                                        className={`px-8 py-5 font-extrabold text-center min-w-[160px] focus:ring-2 focus:ring-[var(--nui-accent)] focus:outline-none cursor-pointer text-base ${getStatusBadgeClass(value)} rounded-none border-0`}
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="Partial">Partial</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdministrationDashboard;
