import React from "react";

const CurrentStateDashboard = ({ formData, updateField }) => {
    // Application Categories
    const productivityApps = formData.productivityApplications || [];
    const financeApps = formData.financeApplications || [];
    const hritApps = formData.hritApplications || [];
    const payrollApps = formData.payrollApplications || [];
    const additionalApps = formData.additionalApplications || [];

    // Security Controls
    const securityControls = [
        { label: "SOC-SIEM", key: "siem" },
        { label: "Data Classification", key: "dataClassification" },
        { label: "Endpoint Detection & Response", key: "edr" },
        { label: "MDM", key: "mdm" },
        { label: "MFA", key: "mfa" },
        { label: "NAC", key: "nac" },
        { label: "IAM", key: "iam" },
        { label: "Vulnerability Mgmt", key: "vulnerabilityManagement" },
        { label: "E-mail Security", key: "emailSecurity" },
        { label: "SSA-VPN", key: "vpn" },
        { label: "Data Loss Prevention", key: "dlp" },
        { label: "CASB", key: "casb" },
        { label: "Secure Web Gateway", key: "secureWebGateway" },
        { label: "NGFW", key: "firewall" },
    ];

    // Infrastructure
    const infrastructureItems = [
        { label: "SD/WAN", key: "sdWan" },
        { label: "Cloud", key: "cloudVendor" },
        { label: "Virtualization", key: "virtualizationVendor" },
        { label: "Baremetal", key: "baremetalVendor" },
        { label: "Wireless", key: "wirelessVendor" },
        { label: "Routing", key: "routingVendor" },
        { label: "Switching", key: "switchingVendor" },
        { label: "WAN2", key: "WAN2" },
        { label: "WAN1", key: "WAN1" },
        { label: "UPS", key: "hasUPS" },
        { label: "Generator", key: "hasGenerator" },
    ];

    const updateAppField = (category, index, field, value) => {
        const updatedApps = [...formData[category]];
        updatedApps[index] = { ...updatedApps[index], [field]: value };
        updateField(category, updatedApps);
    };

    const addApplication = (category) => {
        const updatedApps = [...(formData[category] || []), { name: "", vendor: "", inUse: "No" }];
        updateField(category, updatedApps);
    };

    const removeApplication = (category, index) => {
        const updatedApps = formData[category].filter((_, i) => i !== index);
        updateField(category, updatedApps);
    };

    const updateControlField = (key, field, value) => {
        const currentValue = formData[key] || {};
        updateField(key, { ...currentValue, [field]: value });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Critical": return "bg-red-100 text-red-800 font-bold";
            case "High": return "bg-orange-100 text-orange-800 font-bold";
            case "Medium": return "bg-blue-100 text-blue-800 font-bold";
            case "Low": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    const renderApplicationSection = (title, category, apps) => (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2 bg-gradient-to-r from-[#0F4C5C] to-[#15587B] px-4 py-2.5 rounded-t-lg">
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <button
                    onClick={() => addApplication(category)}
                    className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-md transition-all flex items-center gap-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>
            {apps.map((app, index) => (
                <div key={index} className="grid grid-cols-12 gap-0 mb-1 bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors">
                    <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 flex items-center border-r border-gray-200">{title}</div>
                    <input
                        type="text"
                        value={app.vendor || ""}
                        onChange={(e) => updateAppField(category, index, "vendor", e.target.value)}
                        placeholder="Enter provider name..."
                        className="col-span-3 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-r border-gray-200 focus:outline-none focus:bg-blue-50 focus:placeholder-gray-500"
                    />
                    <select
                        value={app.priority || "Medium"}
                        onChange={(e) => updateAppField(category, index, "priority", e.target.value)}
                        className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityColor(app.priority)}`}
                    >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <select
                        value={app.offering || "SaaS"}
                        onChange={(e) => updateAppField(category, index, "offering", e.target.value)}
                        className="col-span-2 px-3 py-3 text-sm text-gray-700 border-r border-gray-200 focus:outline-none focus:bg-blue-50 font-medium"
                    >
                        <option value="SaaS">SaaS</option>
                        <option value="On-Premise">On-Premise</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    <button
                        onClick={() => removeApplication(category, index)}
                        className="col-span-2 px-2 py-3 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );

    const renderControlRow = (control, bgColor) => {
        const value = formData[control.key] || {};
        return (
            <div key={control.key} className={`grid grid-cols-12 gap-0 border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors mb-2 ${bgColor}`}>
                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 flex items-center border-r border-gray-200">{control.label}</div>
                <input
                    type="text"
                    value={value.vendor || ""}
                    onChange={(e) => updateControlField(control.key, "vendor", e.target.value)}
                    placeholder="Enter provider name..."
                    className={`col-span-3 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border-r border-gray-200 focus:outline-none focus:bg-blue-50 focus:placeholder-gray-500 ${bgColor}`}
                />
                <select
                    value={value.businessPriority || "Medium"}
                    onChange={(e) => updateControlField(control.key, "businessPriority", e.target.value)}
                    className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityColor(value.businessPriority)}`}
                >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <select
                    value={value.offering || "SaaS"}
                    onChange={(e) => updateControlField(control.key, "offering", e.target.value)}
                    className={`col-span-4 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:bg-blue-50 font-medium ${bgColor}`}
                >
                    <option value="SaaS">SaaS</option>
                    <option value="On-Premise">On-Premise</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Cloud">Cloud</option>
                </select>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Main Table Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Title */}
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-6">
                    <h2 className="text-3xl font-bold">Current State</h2>
                    <p className="text-sm text-white/90 mt-2">Applications • Security • Infrastructure</p>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-0 bg-[#0F4C5C] text-white text-sm font-bold sticky top-0 z-10">
                    <div className="col-span-3 px-4 py-4 border-r border-white/20">FUNCTION</div>
                    <div className="col-span-3 px-4 py-4 border-r border-white/20">PROVIDER</div>
                    <div className="col-span-2 px-3 py-4 border-r border-white/20">PRIORITY</div>
                    <div className="col-span-4 px-3 py-4">OFFERING</div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Applications Section */}
                    <div className="bg-gradient-to-r from-[#0F4C5C] to-[#15587B] text-white px-4 py-3 rounded-lg -mx-6 -mt-6 mb-4">
                        <h3 className="text-base font-bold">Applications</h3>
                    </div>
                    {renderApplicationSection("Productivity", "productivityApplications", productivityApps)}
                    {renderApplicationSection("Finance", "financeApplications", financeApps)}
                    {renderApplicationSection("Hrit", "hritApplications", hritApps)}
                    {renderApplicationSection("Payroll", "payrollApplications", payrollApps)}
                    {renderApplicationSection("Additional", "additionalApplications", additionalApps)}

                    {/* Security Section */}
                    <div className="bg-gradient-to-r from-[#7BC5C5] to-[#B8E6E6] text-gray-900 px-4 py-3 rounded-lg -mx-6 mt-8 mb-4">
                        <h3 className="text-base font-bold">Security</h3>
                    </div>
                    {securityControls.map((control, index) => 
                        renderControlRow(control, "bg-white")
                    )}

                    {/* Infrastructure Section */}
                    <div className="bg-gradient-to-r from-[#7BC5C5] to-[#B8E6E6] text-gray-900 px-4 py-3 rounded-lg -mx-6 mt-8 mb-4">
                        <h3 className="text-base font-bold">Infrastructure</h3>
                    </div>
                    {infrastructureItems.map((item, index) => 
                        renderControlRow(item, "bg-white")
                    )}
                </div>
            </div>

            {/* Help Text */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">Dashboard Tips</p>
                        <p className="text-sm text-blue-800">
                            Add new applications using the <strong>+ Add</strong> buttons. Edit providers, priorities, and offerings directly in the table. 
                            Click <strong>Save Changes</strong> at the top to save all modifications to your database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentStateDashboard;
