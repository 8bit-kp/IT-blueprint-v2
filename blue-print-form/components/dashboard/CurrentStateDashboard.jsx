import React from "react";

const vendors = [
    "APC", "ATT", "Barracuda", "Cato", "Cisco", "Dell", "IBM",
    "Microsoft", "Multi-vendor", "Nodeware", "RapidFire", "VMWare", "No Data"
];

const CurrentStateDashboard = ({ formData, updateField }) => {
    // Application Categories - synced with database structure
    const applications = formData.applications || {
        productivity: [],
        finance: [],
        hrit: [],
        payroll: [],
        additional: []
    };

    // Technical Controls - synced with database structure
    const technicalControls = formData.technicalControls || {};

    // Security Controls mapping to technicalControls
    const securityControls = [
        { label: "SOC-SIEM", key: "socSiem" },
        { label: "Data Classification", key: "dataClassification" },
        { label: "Endpoint Detection & Response", key: "edr" },
        { label: "MDM", key: "mdm" },
        { label: "MFA", key: "mfa" },
        { label: "NAC", key: "nac" },
        { label: "IAM", key: "iam" },
        { label: "Vulnerability Mgmt", key: "vulnerabilityMgmt" },
        { label: "E-mail Security", key: "emailSecurity" },
        { label: "SSA-VPN", key: "ssaVpn" },
        { label: "Data Loss Prevention", key: "dlp" },
        { label: "CASB", key: "casb" },
        { label: "Secure Web Gateway", key: "secureWebGateway" },
        { label: "NGFW", key: "nextGenFirewall" },
        { label: "Asset Management", key: "assetManagement" },
        { label: "SD-WAN", key: "sdWan" },
    ];

    // Infrastructure items - synced with formData structure
    const infrastructureItems = [
        { label: "Cloud", key: "cloudVendor" },
        { label: "Virtualization", key: "virtualizationVendor" },
        { label: "Baremetal", key: "baremetalVendor" },
        { label: "Wireless", key: "wirelessVendor" },
        { label: "Routing", key: "routingVendor" },
        { label: "Switching", key: "switchingVendor" },
        { label: "WAN 3", key: "WAN3" },
        { label: "WAN 2", key: "WAN2" },
        { label: "WAN 1", key: "WAN1" },
    ];

    const updateAppField = (category, index, field, value) => {
        const updatedApps = {
            ...applications,
            [category]: applications[category].map((app, i) => 
                i === index ? { ...app, [field]: value } : app
            )
        };
        updateField('applications', updatedApps);
    };

    const addApplication = (category) => {
        const newApp = { 
            name: "", 
            containsSensitiveInfo: "No", 
            mfa: "No", 
            backedUp: "No", 
            byodAccess: "No",
            businessPriority: "Medium",
            offering: "SaaS"
        };
        const updatedApps = {
            ...applications,
            [category]: [...(applications[category] || []), newApp]
        };
        updateField('applications', updatedApps);
    };

    const removeApplication = (category, index) => {
        const updatedApps = {
            ...applications,
            [category]: applications[category].filter((_, i) => i !== index)
        };
        updateField('applications', updatedApps);
    };

    const updateTechnicalControl = (key, field, value) => {
        const currentControl = technicalControls[key] || { choice: "Yes", vendor: "", businessPriority: "Medium", offering: "SaaS" };
        const updatedControls = {
            ...technicalControls,
            [key]: { ...currentControl, [field]: value }
        };
        updateField('technicalControls', updatedControls);
    };

    const updateInfraField = (key, field, value) => {
        const currentValue = formData[key] || { choice: "Yes", vendor: "", businessPriority: "Medium", offering: "SaaS" };
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
                <h4 className="text-sm font-bold text-white capitalize">{category}</h4>
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
            {apps.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500">
                    No applications added yet. Click "+ Add" to add one.
                </div>
            )}
            {apps.map((app, index) => (
                <div key={index} className="grid grid-cols-12 gap-0 mb-1 bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors">
                    <input
                        type="text"
                        value={app.name || ""}
                        onChange={(e) => updateAppField(category, index, "name", e.target.value)}
                        placeholder="Application name..."
                        className="col-span-4 px-4 py-3 text-sm text-gray-800 font-medium placeholder-gray-400 border-r border-gray-200 focus:outline-none focus:bg-blue-50 focus:placeholder-gray-500"
                    />
                    <select
                        value={app.businessPriority || "Medium"}
                        onChange={(e) => updateAppField(category, index, "businessPriority", e.target.value)}
                        className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityColor(app.businessPriority)}`}
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
                        <option value="On-premise">On-premise</option>
                    </select>
                    <div className="col-span-2 px-3 py-3 flex items-center justify-center text-xs space-x-1 border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded ${app.mfa === "Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>MFA</span>
                    </div>
                    <button
                        onClick={() => removeApplication(category, index)}
                        className="col-span-2 px-2 py-3 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );

    const renderTechnicalControlRow = (control) => {
        const value = technicalControls[control.key] || { choice: "Yes", vendor: "", businessPriority: "Medium", offering: "SaaS" };
        return (
            <div key={control.key} className="grid grid-cols-12 gap-0 border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors mb-2 bg-white">
                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 flex items-center border-r border-gray-200">{control.label}</div>
                <select
                    value={value.vendor || ""}
                    onChange={(e) => updateTechnicalControl(control.key, "vendor", e.target.value)}
                    className="col-span-3 px-4 py-3 text-sm text-gray-800 border-r border-gray-200 focus:outline-none focus:bg-blue-50"
                >
                    <option value="">Select Provider...</option>
                    {vendors.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    value={value.businessPriority || "Medium"}
                    onChange={(e) => updateTechnicalControl(control.key, "businessPriority", e.target.value)}
                    className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityColor(value.businessPriority)}`}
                >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <select
                    value={value.offering || "SaaS"}
                    onChange={(e) => updateTechnicalControl(control.key, "offering", e.target.value)}
                    className="col-span-4 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:bg-blue-50 font-medium"
                >
                    <option value="SaaS">SaaS</option>
                    <option value="On-premise">On-premise</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Cloud">Cloud</option>
                </select>
            </div>
        );
    };

    const renderInfrastructureRow = (item) => {
        const value = formData[item.key] || { choice: "Yes", vendor: "", businessPriority: "Medium", offering: "SaaS" };
        return (
            <div key={item.key} className="grid grid-cols-12 gap-0 border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors mb-2 bg-white">
                <div className="col-span-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 flex items-center border-r border-gray-200">{item.label}</div>
                <select
                    value={value.vendor || ""}
                    onChange={(e) => updateInfraField(item.key, "vendor", e.target.value)}
                    className="col-span-3 px-4 py-3 text-sm text-gray-800 border-r border-gray-200 focus:outline-none focus:bg-blue-50"
                >
                    <option value="">Select Provider...</option>
                    {vendors.map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    value={value.businessPriority || "Medium"}
                    onChange={(e) => updateInfraField(item.key, "businessPriority", e.target.value)}
                    className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityColor(value.businessPriority)}`}
                >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <select
                    value={value.offering || "SaaS"}
                    onChange={(e) => updateInfraField(item.key, "offering", e.target.value)}
                    className="col-span-4 px-3 py-3 text-sm text-gray-700 focus:outline-none focus:bg-blue-50 font-medium"
                >
                    <option value="SaaS">SaaS</option>
                    <option value="On-premise">On-premise</option>
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
                    <div className="col-span-4 px-4 py-4 border-r border-white/20">APPLICATION / FUNCTION</div>
                    <div className="col-span-2 px-3 py-4 border-r border-white/20">PRIORITY</div>
                    <div className="col-span-2 px-3 py-4 border-r border-white/20">OFFERING</div>
                    <div className="col-span-2 px-3 py-4 border-r border-white/20">STATUS</div>
                    <div className="col-span-2 px-2 py-4">ACTION</div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Applications Section */}
                    <div className="bg-gradient-to-r from-[#0F4C5C] to-[#15587B] text-white px-4 py-3 rounded-lg -mx-6 -mt-6 mb-4">
                        <h3 className="text-base font-bold">Applications</h3>
                    </div>
                    {renderApplicationSection("Productivity", "productivity", applications.productivity || [])}
                    {renderApplicationSection("Finance", "finance", applications.finance || [])}
                    {renderApplicationSection("HR/IT", "hrit", applications.hrit || [])}
                    {renderApplicationSection("Payroll", "payroll", applications.payroll || [])}
                    {renderApplicationSection("Additional", "additional", applications.additional || [])}

                    {/* Security Section */}
                    <div className="bg-gradient-to-r from-[#7BC5C5] to-[#B8E6E6] text-gray-900 px-4 py-3 rounded-lg -mx-6 mt-8 mb-4">
                        <h3 className="text-base font-bold">Security Technical Controls</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-0 bg-gray-100 text-gray-700 text-xs font-bold mb-2">
                        <div className="col-span-3 px-4 py-2">CONTROL</div>
                        <div className="col-span-3 px-4 py-2">PROVIDER</div>
                        <div className="col-span-2 px-3 py-2">PRIORITY</div>
                        <div className="col-span-4 px-3 py-2">OFFERING</div>
                    </div>
                    {securityControls.map((control) => renderTechnicalControlRow(control))}

                    {/* Infrastructure Section */}
                    <div className="bg-gradient-to-r from-[#7BC5C5] to-[#B8E6E6] text-gray-900 px-4 py-3 rounded-lg -mx-6 mt-8 mb-4">
                        <h3 className="text-base font-bold">Infrastructure & Network</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-0 bg-gray-100 text-gray-700 text-xs font-bold mb-2">
                        <div className="col-span-3 px-4 py-2">COMPONENT</div>
                        <div className="col-span-3 px-4 py-2">PROVIDER</div>
                        <div className="col-span-2 px-3 py-2">PRIORITY</div>
                        <div className="col-span-4 px-3 py-2">OFFERING</div>
                    </div>
                    {infrastructureItems.map((item) => renderInfrastructureRow(item))}
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
                            Add new applications using the <strong>+ Add</strong> buttons. Select providers from the dropdown menu. 
                            All changes sync with your database. Click <strong>Save Changes</strong> at the top to persist modifications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentStateDashboard;