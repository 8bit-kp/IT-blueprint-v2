import React from "react";

const SecurityDashboard = ({ formData, updateField }) => {
    const technicalControls = [
        { label: "Firewall", key: "firewall" },
        { label: "Endpoint Security", key: "endpointSecurity" },
        { label: "Email Security", key: "emailSecurity" },
        { label: "SIEM", key: "siem" },
        { label: "EDR", key: "edr" },
        { label: "MDM", key: "mdm" },
        { label: "MFA", key: "mfa" },
        { label: "NAC", key: "nac" },
        { label: "IAM", key: "iam" },
        { label: "SSO", key: "sso" },
        { label: "VPN", key: "vpn" },
        { label: "DLP", key: "dlp" },
        { label: "CASB", key: "casb" },
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

    const updateControlField = (key, field, value) => {
        const currentValue = formData[key] || {};
        updateField(key, { ...currentValue, [field]: value });
    };

    return (
        <div className="space-y-8">
            {/* Technical Controls Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Security Technical Controls</h2>
                    <p className="text-sm text-white/90 mt-1">Manage your security infrastructure and tools</p>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#0F4C5C] text-white text-sm">
                                    <th className="px-4 py-4 text-left font-bold">Control</th>
                                    <th className="px-4 py-4 text-left font-bold">Status</th>
                                    <th className="px-4 py-4 text-left font-bold">Vendor</th>
                                    <th className="px-4 py-4 text-left font-bold">Priority</th>
                                    <th className="px-4 py-4 text-left font-bold">Offering</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicalControls.map((control, index) => {
                                    const value = formData[control.key] || {};
                                    return (
                                        <tr key={control.key} className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-[#B8E6E6]/30" : "bg-white"}`}>
                                            <td className="px-4 py-4 font-semibold text-gray-800">{control.label}</td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={value.choice || "No"}
                                                    onChange={(e) => updateControlField(control.key, "choice", e.target.value)}
                                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] bg-white"
                                                >
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                    <option value="Partial">Partial</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={value.vendor || ""}
                                                    onChange={(e) => updateControlField(control.key, "vendor", e.target.value)}
                                                    placeholder="Enter vendor name..."
                                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] focus:placeholder-gray-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={value.businessPriority || "Medium"}
                                                    onChange={(e) => updateControlField(control.key, "businessPriority", e.target.value)}
                                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] bg-white"
                                                >
                                                    <option value="Critical">Critical</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={value.offering || "SaaS"}
                                                    onChange={(e) => updateControlField(control.key, "offering", e.target.value)}
                                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] bg-white"
                                                >
                                                    <option value="SaaS">SaaS</option>
                                                    <option value="On-Premise">On-Premise</option>
                                                    <option value="Hybrid">Hybrid</option>
                                                    <option value="Cloud">Cloud</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Administrative Controls Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Governance & Administrative Controls</h2>
                    <p className="text-sm text-white/90 mt-1">Policy framework and compliance status</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {adminControls.map((control) => (
                            <div key={control.key} className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#7BC5C5]/30 to-[#B8E6E6]/30 rounded-xl border-2 border-[#7BC5C5]/50 hover:border-[#34808A] transition-all">
                                <label className="flex-1 font-semibold text-gray-800">{control.label}</label>
                                <select
                                    value={formData[control.key] || "No"}
                                    onChange={(e) => updateField(control.key, e.target.value)}
                                    className="px-5 py-2.5 border-2 border-gray-300 rounded-lg font-bold text-gray-800 bg-white focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A]"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Partial">Partial</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
