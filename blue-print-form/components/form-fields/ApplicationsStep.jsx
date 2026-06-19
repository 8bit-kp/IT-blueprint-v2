"use client";

import { memo, useEffect, useState } from "react";
import { TextInput, YesNoCompact } from "./FormComponents";

// ── Priority levels (Low → Medium → High → Critical) ──────────────────────
const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

// ── Sensitivity classification fields ─────────────────────────────────────
const SENSITIVITY_FIELDS = [
    { key: "sensitivity",                label: "Sensitivity" },
    { key: "businessSensitivity",        label: "Business Sensitivity" },
    { key: "businessConfidentiality",    label: "Business Confidentiality" },
    { key: "personallyIdentifiableInfo", label: "Personally Identifiable Information" },
    { key: "hipaaRegulated",             label: "HIPAA-Regulated" },
];

// ── Priority button color styles (Low=green, Med=blue, High=orange, Crit=red)
const getPriorityActiveClass = (priority) => {
    switch (priority) {
        case "Low":      return "bg-green-500  text-white shadow-md ring-1 ring-green-600";
        case "Medium":   return "bg-blue-500   text-white shadow-md ring-1 ring-blue-600";
        case "High":     return "bg-orange-500 text-white shadow-md ring-1 ring-orange-600";
        case "Critical": return "bg-red-600    text-white shadow-md ring-1 ring-red-700";
        default:         return "bg-gray-100   text-gray-600";
    }
};

// ── Default applications for each category ────────────────────────────────
const defaultApplications = {
    productivity: [
        {
            id: "prod-1", name: "Microsoft 365",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "High", businessSensitivity: "High",
            businessConfidentiality: "High", personallyIdentifiableInfo: "Medium", hipaaRegulated: "Low",
        },
        {
            id: "prod-2", name: "Google Workspace",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",
            businessPriority: "High", offering: "SaaS",
            sensitivity: "High", businessSensitivity: "Medium",
            businessConfidentiality: "Medium", personallyIdentifiableInfo: "Low", hipaaRegulated: "Low",
        },
    ],
    finance: [
        {
            id: "fin-1", name: "QuickBooks",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "Critical", businessSensitivity: "Critical",
            businessConfidentiality: "Critical", personallyIdentifiableInfo: "High", hipaaRegulated: "Low",
        },
        {
            id: "fin-2", name: "NetSuite",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "High", offering: "SaaS",
            sensitivity: "Critical", businessSensitivity: "High",
            businessConfidentiality: "High", personallyIdentifiableInfo: "High", hipaaRegulated: "Low",
        },
    ],
    hrit: [
        {
            id: "hr-1", name: "Workday",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "Critical", businessSensitivity: "High",
            businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low",
        },
        {
            id: "hr-2", name: "BambooHR",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "High", offering: "SaaS",
            sensitivity: "High", businessSensitivity: "High",
            businessConfidentiality: "High", personallyIdentifiableInfo: "High", hipaaRegulated: "Low",
        },
    ],
    payroll: [
        {
            id: "pay-1", name: "ADP Workforce Now",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "Critical", businessSensitivity: "Critical",
            businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low",
        },
        {
            id: "pay-2", name: "Paychex",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "Critical", businessSensitivity: "Critical",
            businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low",
        },
    ],
    additional: [
        {
            id: "add-1", name: "Salesforce",
            containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",
            businessPriority: "Critical", offering: "SaaS",
            sensitivity: "High", businessSensitivity: "High",
            businessConfidentiality: "High", personallyIdentifiableInfo: "Medium", hipaaRegulated: "Low",
        },
        {
            id: "add-2", name: "Zoom",
            containsSensitiveInfo: "No", mfa: "Yes", backedUp: "No", byodAccess: "Yes",
            businessPriority: "Medium", offering: "SaaS",
            sensitivity: "Low", businessSensitivity: "Low",
            businessConfidentiality: "Low", personallyIdentifiableInfo: "Low", hipaaRegulated: "Low",
        },
        {
            id: "add-3", name: "Slack",
            containsSensitiveInfo: "No", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",
            businessPriority: "Medium", offering: "SaaS",
            sensitivity: "Medium", businessSensitivity: "Low",
            businessConfidentiality: "Low", personallyIdentifiableInfo: "Low", hipaaRegulated: "Low",
        },
    ],
};

// ── Priority toggle button group ───────────────────────────────────────────
// When `value` is empty / undefined the toggle shows all buttons unselected (gray).
// Only highlights when user explicitly picks a value — so nothing is saved as
// a silent default and the visualization only shows colour once data exists.
const PriorityToggle = ({ label, value, onChange }) => (
    <div>
        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">{label}</label>
        <div className="flex gap-1.5">
            {PRIORITY_LEVELS.map((priority) => {
                const isActive = value === priority;   // ← no || "Low" fallback
                return (
                    <button
                        key={priority}
                        type="button"
                        onClick={() => onChange(priority)}
                        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                            isActive ? getPriorityActiveClass(priority) : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {priority}
                    </button>
                );
            })}
        </div>
    </div>
);

// ── Sensitivity dropdown colour helper ────────────────────────────────────
const getSensSelectClass = (value) => {
    switch (value) {
        case "Low":      return "text-green-700  bg-green-50  border-green-200";
        case "Medium":   return "text-yellow-700 bg-yellow-50 border-yellow-200";
        case "High":     return "text-orange-700 bg-orange-50 border-orange-200";
        case "Critical": return "text-red-700    bg-red-50    border-red-200";
        default:         return "text-gray-500   bg-gray-50   border-gray-200";
    }
};

// ── Single Application Card ────────────────────────────────────────────────
const ApplicationCard = memo(({ app, index, updateApp, removeApp }) => {
    const [sensOpen, setSensOpen] = useState(false);

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm relative group hover:shadow-md transition">
            <button
                type="button"
                onClick={() => removeApp(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                title="Remove App"
            >
                ✕
            </button>

            {/* Provider Name */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">Provider Name</label>
                <TextInput
                    placeholder="e.g. Salesforce"
                    value={app.name || ""}
                    onChange={(v) => updateApp(index, "name", v)}
                    className="font-medium text-gray-800 placeholder:font-normal"
                />
            </div>

            <div className="space-y-3 mb-4">
                {/* Business Priority */}
                <PriorityToggle
                    label="Business Priority"
                    value={app.businessPriority}
                    onChange={(v) => updateApp(index, "businessPriority", v)}
                />

                {/* Offering */}
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Offering</label>
                    <select
                        className="w-full text-xs border-gray-200 rounded bg-gray-50 p-1.5 border text-gray-900"
                        value={app.offering || ""}
                        onChange={(e) => updateApp(index, "offering", e.target.value)}
                    >
                        <option value="">Select Offering...</option>
                        <option value="SaaS">SaaS</option>
                        <option value="On-premise">On-prem</option>
                    </select>
                </div>

                {/* ── Sensitivity Classification — collapsible ── */}
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                    {/* Header row with arrow toggle */}
                    <button
                        type="button"
                        onClick={() => setSensOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                            Sensitivity Classification
                        </span>
                        <svg
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                                sensOpen ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Collapsible body — dropdowns */}
                    {sensOpen && (
                        <div className="px-3 py-2 space-y-2 bg-white">
                            {SENSITIVITY_FIELDS.map((field) => (
                                <div key={field.key}>
                                    <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">
                                        {field.label}
                                    </label>
                                    <select
                                        value={app[field.key] || ""}
                                        onChange={(e) => updateApp(index, field.key, e.target.value)}
                                        className={`w-full text-xs font-semibold p-1.5 border rounded transition-colors ${
                                            getSensSelectClass(app[field.key])
                                        }`}
                                    >
                                        <option value="">— Not set —</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Yes/No toggles */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
                <YesNoCompact label="Sensitive Info"  value={app.containsSensitiveInfo} onChange={(v) => updateApp(index, "containsSensitiveInfo", v)} />
                <YesNoCompact label="MFA Enabled"     value={app.mfa}                   onChange={(v) => updateApp(index, "mfa", v)} />
                <YesNoCompact label="Backed Up"       value={app.backedUp}              onChange={(v) => updateApp(index, "backedUp", v)} />
                <YesNoCompact label="BYOD Access"     value={app.byodAccess}            onChange={(v) => updateApp(index, "byodAccess", v)} />
            </div>
        </div>
    );
});


ApplicationCard.displayName = "ApplicationCard";

// ── Main Step Component ────────────────────────────────────────────────────
const ApplicationsStep = memo(({ formData, updateFormData }) => {
    // Sensitivity field keys we manage
    const SENS_KEYS = [
        "sensitivity", "businessSensitivity",
        "businessConfidentiality", "personallyIdentifiableInfo", "hipaaRegulated",
    ];

    // Initialize categories that are empty, AND migrate existing apps
    // that don't yet have the sensitivity fields (older DB documents).
    useEffect(() => {
        const currentApps = formData.applications || {};
        const needsInit = Object.keys(defaultApplications).some(
            (cat) => !currentApps[cat] || currentApps[cat].length === 0
        );

        // Check if any existing app is missing at least one sensitivity field
        const needsMigration = !needsInit && Object.values(currentApps).some(
            (arr) => Array.isArray(arr) && arr.some(
                (app) => SENS_KEYS.some((k) => app[k] === undefined)
            )
        );

        if (needsInit) {
            const initializedApps = { ...currentApps };
            Object.keys(defaultApplications).forEach((cat) => {
                if (!initializedApps[cat] || initializedApps[cat].length === 0) {
                    initializedApps[cat] = [...defaultApplications[cat]];
                }
            });
            updateFormData({ applications: initializedApps });
        } else if (needsMigration) {
            // For existing apps missing sensitivity fields, set them to ""
            // so the next Save will persist them explicitly.
            const migratedApps = {};
            Object.entries(currentApps).forEach(([cat, arr]) => {
                migratedApps[cat] = Array.isArray(arr)
                    ? arr.map((app) => {
                        const patch = {};
                        SENS_KEYS.forEach((k) => {
                            if (app[k] === undefined) patch[k] = "";
                        });
                        return Object.keys(patch).length ? { ...app, ...patch } : app;
                    })
                    : arr;
            });
            updateFormData({ applications: migratedApps });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const AppGroup = ({ title, category }) => {
        const apps = formData.applications?.[category] || [];

        const updateAppsList = (newApps) => {
            updateFormData({ applications: { ...formData.applications, [category]: newApps } });
        };

        const updateApp = (index, key, val) => {
            const newApps = [...apps];
            newApps[index] = { ...newApps[index], [key]: val };
            updateAppsList(newApps);
        };

        const addApp = () => {
            updateAppsList([
                ...apps,
                {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: "",
                    containsSensitiveInfo: "",
                    mfa: "",
                    backedUp: "",
                    byodAccess: "",
                    businessPriority: "",
                    offering: "",
                    // Sensitivity fields — empty by default; user must explicitly choose
                    sensitivity: "",
                    businessSensitivity: "",
                    businessConfidentiality: "",
                    personallyIdentifiableInfo: "",
                    hipaaRegulated: "",
                },
            ]);
        };

        const removeApp = (index) => {
            updateAppsList(apps.filter((_, i) => i !== index));
        };

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-bold text-[#15587B]">{title}</h3>
                    <button
                        onClick={addApp}
                        className="text-xs bg-[#34808A] text-white px-3 py-1.5 rounded hover:bg-[#2b6f6f] transition"
                    >
                        + Add Application
                    </button>
                </div>
                {apps.length === 0 && (
                    <div className="text-gray-400 text-sm italic border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        No applications added in this category yet.
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {apps.map((app, i) => (
                        <ApplicationCard
                            key={app.id || i}
                            app={app}
                            index={i}
                            updateApp={updateApp}
                            removeApp={removeApp}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <AppGroup title="Productivity Applications" category="productivity" />
            <AppGroup title="Finance Applications"      category="finance" />
            <AppGroup title="HRIT Applications"         category="hrit" />
            <AppGroup title="Payroll Applications"      category="payroll" />
            <AppGroup title="Additional Applications"   category="additional" />
        </div>
    );
});

ApplicationsStep.displayName = "ApplicationsStep";

export default ApplicationsStep;
