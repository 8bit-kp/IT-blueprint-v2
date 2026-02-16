import React from "react";

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
        <div className="space-y-8">
            {/* Company Profile Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Company Profile</h2>
                    <p className="text-sm text-white/90 mt-1">Basic organizational information</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {companyFields.map((field) => (
                            <div key={field.key} className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700 text-sm">{field.label}</label>
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Administrative Controls</h2>
                    <p className="text-sm text-white/90 mt-1">Governance and compliance framework</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {governanceControls.map((control) => {
                            const value = formData[control.key] || "No";
                            const bgColor = value === "Yes" ? "bg-white border-2 border-gray-800" : value === "Partial" ? "bg-[#F59E0B]" : "bg-[#DC2626]";
                            const textColor = value === "Yes" ? "text-gray-900" : "text-white";
                            
                            return (
                                <div key={control.key} className="flex items-center rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#34808A] transition-all shadow-sm">
                                    <div className="flex-1 bg-gradient-to-r from-[#7BC5C5] to-[#B8E6E6] px-6 py-5">
                                        <span className="font-bold text-gray-900">{control.label}</span>
                                    </div>
                                    <select
                                        value={value}
                                        onChange={(e) => updateField(control.key, e.target.value)}
                                        className={`px-8 py-5 font-extrabold text-center min-w-[160px] ${bgColor} ${textColor} focus:ring-2 focus:ring-[#34808A] focus:outline-none cursor-pointer text-base`}
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
