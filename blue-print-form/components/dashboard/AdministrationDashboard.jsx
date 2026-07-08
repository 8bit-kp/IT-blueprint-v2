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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Company Profile</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Basic organizational information</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {companyFields.map((field) => (
                            <div key={field.key} className="flex flex-col gap-1.5">
                                <label className="font-semibold text-gray-600 text-xs uppercase tracking-wide">{field.label}</label>
                                <input
                                    type="text"
                                    value={formData[field.key] || ""}
                                    onChange={(e) => updateField(field.key, e.target.value)}
                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                    className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] focus:placeholder-gray-500 font-medium"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Governance Controls Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Administrative Controls</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Governance and compliance framework</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {governanceControls.map((control) => {
                            const value = formData[control.key] || "No";
                            return (
                                <div key={control.key} className="flex items-center justify-between rounded-xl overflow-hidden border border-gray-200 hover:border-[#34808A]/50 transition-all shadow-sm">
                                    <div className="flex-1 px-5 py-4 bg-gray-50">
                                        <span className="font-semibold text-gray-700 text-sm">{control.label}</span>
                                    </div>
                                    <select
                                        value={value}
                                        onChange={(e) => updateField(control.key, e.target.value)}
                                        className={`px-8 py-5 font-extrabold text-center min-w-[160px] focus:ring-2 focus:ring-[#34808A] focus:outline-none cursor-pointer text-base ${getStatusBadgeClass(value)} rounded-none border-0`}
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
