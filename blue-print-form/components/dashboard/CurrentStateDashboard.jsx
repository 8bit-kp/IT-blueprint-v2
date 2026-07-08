import React from "react";
import { getVendors } from "@/constants/vendors";
import { getPriorityChipClass, getStatusToggleClass } from "@/constants/colors";

const CurrentStateDashboard = ({ formData, updateField }) => {

    const applications = formData.applications || {
        productivity: [],
        finance: [],
        hrit: [],
        payroll: [],
        additional: []
    };

    const technicalControls = formData.technicalControls || {};


    const securityControls = [
        { label: "SOC-SIEM", key: "socSiem" },
        { label: "Data Classification", key: "dataClassification" },
        { label: "Endpoint Detection & Response", key: "edr" },
        { label: "MDM", key: "mdm" },
        { label: "MFA", key: "mfa" },
        { label: "NAC", key: "nac" },
        { label: "IAM", key: "iam" },
        { label: "Vulnerability Scanning", key: "vulnerabilityScanning" },
        { label: "E-mail Security", key: "emailSecurity" },
        { label: "SSL VPN", key: "sslVpn" },
        { label: "Data Loss Prevention", key: "dlp" },
        { label: "CASB", key: "casb" },
        { label: "Secure Web Gateway", key: "secureWebGateway" },
        { label: "NGFW", key: "nextGenFirewall" },
        { label: "Asset Management", key: "assetManagement" },
        { label: "SD-WAN", key: "sdWan" },
    ];


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
            businessPriority: "Low",
            offering: "SaaS",
            sensitivity: "Low",
            businessSensitivity: "Low",
            businessConfidentiality: "Low",
            personallyIdentifiableInfo: "Low",
            hipaaRegulated: "Low",
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

    const APP_ROW_COL_DEFS = [
        { key: 'name', label: 'name', min: 180, weight: 3 },      // Application / Function
        { key: 'priority', min: 76, weight: 1 },                  // Priority
        { key: 'offering', min: 76, weight: 1 },                  // Offering
        { key: 'sens1', min: 52, weight: 0.6 },                   // Sens.
        { key: 'mfa', min: 52, weight: 0.6 },                     // MFA
        { key: 'backup', min: 52, weight: 0.6 },                  // Backup
        { key: 'byod', min: 52, weight: 0.6 },                    // BYOD
        { key: 'sens2', min: 58, weight: 0.7 },                   // Sens.
        { key: 'bizS', min: 58, weight: 0.7 },                    // Biz S.
        { key: 'bizC', min: 58, weight: 0.7 },                    // Biz C.
        { key: 'pii', min: 58, weight: 0.7 },                     // PII
        { key: 'hipaa', min: 58, weight: 0.7 },                   // HIPAA
        { key: 'delete', min: 64, weight: 0.8 },                  // Delete (needs room for label)
    ];
    const APP_ROW_COLS = APP_ROW_COL_DEFS.map((c) => `minmax(${c.min}px, ${c.weight}fr)`).join(' ');
    const APP_ROW_MIN_WIDTH = `${APP_ROW_COL_DEFS.reduce((sum, c) => sum + c.min, 0)}px`;

    const renderApplicationSection = (title, category, apps) => (
        <div className="border-b border-gray-100 last:border-0">
            {/* Category label — full-width, flush, no horizontal offset */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/70">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-[#34808A]/60 rounded-full" />
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</h4>
                </div>
                <button
                    onClick={() => addApplication(category)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-[#15587B] rounded transition-all"
                    style={{ backgroundColor: 'rgba(21,88,123,0.08)' }}
                >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>
            {apps.length === 0 && (
                <div className="px-4 py-3 text-[11px] text-gray-400 italic">
                    No applications yet — click Add to create one.
                </div>
            )}
            {apps.map((app, index) => (
                <div
                    key={index}
                    className="grid gap-0 mb-1 bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#7BC5C5] transition-colors"
                    style={{ gridTemplateColumns: APP_ROW_COLS, width: '100%', minWidth: APP_ROW_MIN_WIDTH }}
                >
                    {/* Application Name */}
                    <input
                        type="text"
                        value={app.name || ""}
                        onChange={(e) => updateAppField(category, index, "name", e.target.value)}
                        placeholder="Application name..."
                        className="px-3 py-3 text-xs text-gray-800 font-medium placeholder-gray-400 border-r border-gray-200 focus:outline-none focus:bg-blue-50 min-w-0"
                    />
                    {/* Business Priority */}
                    <select
                        value={app.businessPriority || "Low"}
                        onChange={(e) => updateAppField(category, index, "businessPriority", e.target.value)}
                        className={`px-1 py-3 text-xs border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.businessPriority)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>
                    {/* Offering */}
                    <select
                        value={app.offering || "SaaS"}
                        onChange={(e) => updateAppField(category, index, "offering", e.target.value)}
                        className="px-1 py-3 text-xs text-gray-700 border-r border-gray-200 focus:outline-none font-medium"
                    >
                        <option value="SaaS">SaaS</option>
                        <option value="On-premise">On-prem</option>
                    </select>

                    {/* Sensitive Info — full-cell toggle */}
                    <div className="p-0 border-r border-gray-200">
                        <button
                            onClick={() => updateAppField(category, index, "containsSensitiveInfo", app.containsSensitiveInfo === "Yes" ? "No" : "Yes")}
                            className={`w-full h-full py-3 flex items-center justify-center text-[10px] font-bold transition-colors ${getStatusToggleClass(app.containsSensitiveInfo)}`}
                        >
                            {app.containsSensitiveInfo === "Yes" ? "Y" : "N"}
                        </button>
                    </div>

                    {/* MFA — full-cell toggle */}
                    <div className="p-0 border-r border-gray-200">
                        <button
                            onClick={() => updateAppField(category, index, "mfa", app.mfa === "Yes" ? "No" : "Yes")}
                            className={`w-full h-full py-3 flex items-center justify-center text-[10px] font-bold transition-colors ${getStatusToggleClass(app.mfa)}`}
                        >
                            {app.mfa === "Yes" ? "Y" : "N"}
                        </button>
                    </div>

                    {/* Backed Up — full-cell toggle */}
                    <div className="p-0 border-r border-gray-200">
                        <button
                            onClick={() => updateAppField(category, index, "backedUp", app.backedUp === "Yes" ? "No" : "Yes")}
                            className={`w-full h-full py-3 flex items-center justify-center text-[10px] font-bold transition-colors ${getStatusToggleClass(app.backedUp)}`}
                        >
                            {app.backedUp === "Yes" ? "Y" : "N"}
                        </button>
                    </div>

                    {/* BYOD — full-cell toggle */}
                    <div className="p-0 border-r border-gray-200">
                        <button
                            onClick={() => updateAppField(category, index, "byodAccess", app.byodAccess === "Yes" ? "No" : "Yes")}
                            className={`w-full h-full py-3 flex items-center justify-center text-[10px] font-bold transition-colors ${getStatusToggleClass(app.byodAccess)}`}
                        >
                            {app.byodAccess === "Yes" ? "Y" : "N"}
                        </button>
                    </div>

                    {/* Sensitivity */}
                    <select
                        value={app.sensitivity || "Low"}
                        onChange={(e) => updateAppField(category, index, "sensitivity", e.target.value)}
                        className={`px-1 py-3 text-[10px] border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.sensitivity)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>

                    {/* Business Sensitivity */}
                    <select
                        value={app.businessSensitivity || "Low"}
                        onChange={(e) => updateAppField(category, index, "businessSensitivity", e.target.value)}
                        className={`px-1 py-3 text-[10px] border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.businessSensitivity)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>

                    {/* Business Confidentiality */}
                    <select
                        value={app.businessConfidentiality || "Low"}
                        onChange={(e) => updateAppField(category, index, "businessConfidentiality", e.target.value)}
                        className={`px-1 py-3 text-[10px] border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.businessConfidentiality)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>

                    {/* PII */}
                    <select
                        value={app.personallyIdentifiableInfo || "Low"}
                        onChange={(e) => updateAppField(category, index, "personallyIdentifiableInfo", e.target.value)}
                        className={`px-1 py-3 text-[10px] border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.personallyIdentifiableInfo)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>

                    {/* HIPAA */}
                    <select
                        value={app.hipaaRegulated || "Low"}
                        onChange={(e) => updateAppField(category, index, "hipaaRegulated", e.target.value)}
                        className={`px-1 py-3 text-[10px] border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(app.hipaaRegulated)}`}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Med</option>
                        <option value="High">High</option>
                        <option value="Critical">Crit</option>
                    </select>

                    {/* Delete — trash icon, minimal 32px column */}
                    <button
                        onClick={() => removeApplication(category, index)}
                        className="flex items-center justify-center py-3 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove application"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                    {getVendors(control.key).map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    value={value.businessPriority || "Medium"}
                    onChange={(e) => updateTechnicalControl(control.key, "businessPriority", e.target.value)}
                    className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(value.businessPriority)}`}
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
                    {getVendors(item.key).map((v) => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
                <select
                    value={value.businessPriority || "Medium"}
                    onChange={(e) => updateInfraField(item.key, "businessPriority", e.target.value)}
                    className={`col-span-2 px-3 py-3 text-sm border-r border-gray-200 focus:outline-none font-semibold ${getPriorityChipClass(value.businessPriority)}`}
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Title */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Current State</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Applications · Security · Infrastructure</p>
                    </div>
                </div>

                {/* Table Header + Application Rows — horizontally scrollable as a unit */}
                <div className="overflow-x-auto">
                    {/* Header — uses APP_ROW_COLS, stretches to 100% (min-width floor for small screens) */}
                    <div
                        className="grid gap-0 bg-gray-100 text-gray-600 text-[10px] font-bold border-b border-gray-200"
                        style={{ gridTemplateColumns: APP_ROW_COLS, width: '100%', minWidth: APP_ROW_MIN_WIDTH }}
                    >
                        <div className="px-3 py-3 border-r border-gray-200">APPLICATION / FUNCTION</div>
                        <div className="px-2 py-3 border-r border-gray-200">PRIORITY</div>
                        <div className="px-2 py-3 border-r border-gray-200">OFFERING</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">SENS.</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">MFA</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">BACKUP</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">BYOD</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">SENS.</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">BIZ S.</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">BIZ C.</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">PII</div>
                        <div className="px-1 py-3 border-r border-gray-200 text-center">HIPAA</div>
                        <div className="px-1 py-3 text-center">DELETE</div>
                    </div>

                    {/* Application section labels + rows — stretch to 100% so the whole
                         table fills the card width, with a min-width floor for scrolling
                         on narrow screens instead of being pinned to max-content. */}
                    <div className="pb-3" style={{ width: '100%', minWidth: APP_ROW_MIN_WIDTH }}>
                        {/* Applications section label */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="w-1 h-4 bg-[#34808A] rounded-full" />
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Applications</h3>
                        </div>
                        {renderApplicationSection("Productivity", "productivity", applications.productivity || [])}
                        {renderApplicationSection("Finance", "finance", applications.finance || [])}
                        {renderApplicationSection("HR/IT", "hrit", applications.hrit || [])}
                        {renderApplicationSection("Payroll", "payroll", applications.payroll || [])}
                        {renderApplicationSection("Additional", "additional", applications.additional || [])}
                    </div>
                </div>{/* end overflow-x-auto */}

                {/* Security Section */}
                <div className="px-5 space-y-4 pb-5">
                    <div className="flex items-center gap-2 py-3 bg-gray-50 border-t border-b border-gray-100 -mx-5 px-5 mt-2 mb-4">
                        <div className="w-1 h-4 bg-[#34808A] rounded-full" />
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Security Technical Controls</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-0 bg-gray-100 text-gray-600 text-xs font-bold mb-2 rounded-lg overflow-hidden">
                        <div className="col-span-3 px-4 py-2">CONTROL</div>
                        <div className="col-span-3 px-4 py-2">PROVIDER</div>
                        <div className="col-span-2 px-3 py-2">PRIORITY</div>
                        <div className="col-span-4 px-3 py-2">OFFERING</div>
                    </div>
                    {securityControls.map((control) => renderTechnicalControlRow(control))}

                    {/* Infrastructure Section */}
                    <div className="flex items-center gap-2 py-3 bg-gray-50 border-t border-b border-gray-100 -mx-5 px-5 mt-4 mb-4">
                        <div className="w-1 h-4 bg-[#34808A] rounded-full" />
                        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Infrastructure &amp; Network</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-0 bg-gray-100 text-gray-600 text-xs font-bold mb-2 rounded-lg overflow-hidden">
                        <div className="col-span-3 px-4 py-2">COMPONENT</div>
                        <div className="col-span-3 px-4 py-2">PROVIDER</div>
                        <div className="col-span-2 px-3 py-2">PRIORITY</div>
                        <div className="col-span-4 px-3 py-2">OFFERING</div>
                    </div>
                    {infrastructureItems.map((item) => renderInfrastructureRow(item))}
                </div>
            </div>

            {/* Help Text */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#34808A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#34808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">Dashboard Tips</p>
                    <p className="text-xs text-gray-500">
                        Add new applications using the <strong>+ Add</strong> buttons. Select providers from the dropdown.
                        Click <strong>Save Changes</strong> at the top to persist modifications.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CurrentStateDashboard;