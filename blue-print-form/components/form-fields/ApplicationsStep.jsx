"use client";

import { memo, useEffect, useRef, useState } from "react";
import { TextInput, YesNoCompact } from "./FormComponents";

// ── Constants ──────────────────────────────────────────────────────────────

const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

const SENSITIVITY_FIELDS = [
    { key: "sensitivity",                label: "Sensitivity" },
    { key: "businessSensitivity",        label: "Business Sensitivity" },
    { key: "businessConfidentiality",    label: "Business Confidentiality" },
    { key: "personallyIdentifiableInfo", label: "Personally Identifiable Information" },
    { key: "hipaaRegulated",             label: "HIPAA-Regulated" },
];

// Keys for the five built-in categories that can never be deleted.
const DEFAULT_CATEGORY_KEYS = new Set(["productivity", "finance", "hrit", "payroll", "additional"]);

// ── Helpers ────────────────────────────────────────────────────────────────

const getPriorityActiveClass = (priority) => {
    switch (priority) {
        case "Low":      return "bg-green-500  text-white shadow-md ring-1 ring-green-600";
        case "Medium":   return "bg-blue-500   text-white shadow-md ring-1 ring-blue-600";
        case "High":     return "bg-orange-500 text-white shadow-md ring-1 ring-orange-600";
        case "Critical": return "bg-red-600    text-white shadow-md ring-1 ring-red-700";
        default:         return "bg-gray-100   text-gray-600";
    }
};

/** Convert a user-entered category name to a safe storage key slug */
const toSlug = (title) =>
    title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// ── Default seed applications for built-in categories ─────────────────────

const defaultApplications = {
    productivity: [
        { id: "prod-1", name: "Microsoft 365",   containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",  businessPriority: "Critical", offering: "SaaS", sensitivity: "High",     businessSensitivity: "High",   businessConfidentiality: "High",   personallyIdentifiableInfo: "Medium", hipaaRegulated: "Low" },
        { id: "prod-2", name: "Google Workspace", containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",  businessPriority: "High",     offering: "SaaS", sensitivity: "High",     businessSensitivity: "Medium", businessConfidentiality: "Medium", personallyIdentifiableInfo: "Low",    hipaaRegulated: "Low" },
    ],
    finance: [
        { id: "fin-1", name: "QuickBooks", containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "Critical", offering: "SaaS", sensitivity: "Critical", businessSensitivity: "Critical", businessConfidentiality: "Critical", personallyIdentifiableInfo: "High", hipaaRegulated: "Low" },
        { id: "fin-2", name: "NetSuite",   containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "High",     offering: "SaaS", sensitivity: "Critical", businessSensitivity: "High",     businessConfidentiality: "High",     personallyIdentifiableInfo: "High", hipaaRegulated: "Low" },
    ],
    hrit: [
        { id: "hr-1", name: "Workday",   containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "Critical", offering: "SaaS", sensitivity: "Critical", businessSensitivity: "High",  businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low" },
        { id: "hr-2", name: "BambooHR",  containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "High",     offering: "SaaS", sensitivity: "High",     businessSensitivity: "High",  businessConfidentiality: "High",     personallyIdentifiableInfo: "High",     hipaaRegulated: "Low" },
    ],
    payroll: [
        { id: "pay-1", name: "ADP Workforce Now", containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "Critical", offering: "SaaS", sensitivity: "Critical", businessSensitivity: "Critical", businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low" },
        { id: "pay-2", name: "Paychex",           containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No", businessPriority: "Critical", offering: "SaaS", sensitivity: "Critical", businessSensitivity: "Critical", businessConfidentiality: "Critical", personallyIdentifiableInfo: "Critical", hipaaRegulated: "Low" },
    ],
    additional: [
        { id: "add-1", name: "Salesforce", containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",  businessPriority: "Critical", offering: "SaaS", sensitivity: "High",   businessSensitivity: "High",  businessConfidentiality: "High",  personallyIdentifiableInfo: "Medium", hipaaRegulated: "Low" },
        { id: "add-2", name: "Zoom",       containsSensitiveInfo: "No",  mfa: "Yes", backedUp: "No",  byodAccess: "Yes",  businessPriority: "Medium",   offering: "SaaS", sensitivity: "Low",    businessSensitivity: "Low",   businessConfidentiality: "Low",   personallyIdentifiableInfo: "Low",    hipaaRegulated: "Low" },
        { id: "add-3", name: "Slack",      containsSensitiveInfo: "No",  mfa: "Yes", backedUp: "Yes", byodAccess: "Yes",  businessPriority: "Medium",   offering: "SaaS", sensitivity: "Medium", businessSensitivity: "Low",   businessConfidentiality: "Low",   personallyIdentifiableInfo: "Low",    hipaaRegulated: "Low" },
    ],
};

/** Three placeholder apps seeded into a newly created custom category */
const makeCustomDefaultApps = (categoryTitle) => [
    { id: `${Date.now()}-a`, name: `${categoryTitle} App 1`, containsSensitiveInfo: "", mfa: "", backedUp: "", byodAccess: "", businessPriority: "", offering: "", sensitivity: "", businessSensitivity: "", businessConfidentiality: "", personallyIdentifiableInfo: "", hipaaRegulated: "" },
    { id: `${Date.now()}-b`, name: `${categoryTitle} App 2`, containsSensitiveInfo: "", mfa: "", backedUp: "", byodAccess: "", businessPriority: "", offering: "", sensitivity: "", businessSensitivity: "", businessConfidentiality: "", personallyIdentifiableInfo: "", hipaaRegulated: "" },
    { id: `${Date.now()}-c`, name: `${categoryTitle} App 3`, containsSensitiveInfo: "", mfa: "", backedUp: "", byodAccess: "", businessPriority: "", offering: "", sensitivity: "", businessSensitivity: "", businessConfidentiality: "", personallyIdentifiableInfo: "", hipaaRegulated: "" },
];

// ── Priority toggle ─────────────────────────────────────────────────────────

const PriorityToggle = ({ label, value, onChange }) => (
    <div>
        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">{label}</label>
        <div className="flex gap-1.5">
            {PRIORITY_LEVELS.map((priority) => {
                const isActive = value === priority;
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

// ── Sensitivity dropdown colour helper ─────────────────────────────────────

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

                {/* Sensitivity Classification — collapsible */}
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setSensOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                            Sensitivity Classification
                        </span>
                        <svg
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${sensOpen ? "rotate-180" : "rotate-0"}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

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
                                        className={`w-full text-xs font-semibold p-1.5 border rounded transition-colors ${getSensSelectClass(app[field.key])}`}
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

// ── Add Category Modal ─────────────────────────────────────────────────────
// IMPORTANT: Defined at module scope (not inside ApplicationsStep) to prevent
// unmount/remount on every parent render — see docs/project-memory.md.

const AddCategoryModal = ({ existingKeys, onConfirm, onCancel }) => {
    const inputRef = useRef(null);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Auto-focus input when modal opens
        const t = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(t);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleConfirm();
        if (e.key === "Escape") onCancel();
    };

    const handleConfirm = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError("Category name cannot be empty.");
            return;
        }
        const slug = toSlug(trimmed);
        if (!slug) {
            setError("Please enter a valid name (letters or numbers).");
            return;
        }
        if (existingKeys.has(slug)) {
            setError("A category with this name already exists.");
            return;
        }
        onConfirm({ key: slug, title: trimmed });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[#34808A]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#34808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#15587B]">New Application Section</h2>
                        <p className="text-xs text-gray-500">Enter a name for the new category.</p>
                    </div>
                </div>

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Category Name
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Operations, Legal, Marketing…"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#34808A] focus:ring-1 focus:ring-[#34808A] outline-none transition"
                    />
                    {error && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-5 py-2 text-sm font-bold text-white bg-[#34808A] hover:bg-[#2b6f6f] rounded-lg shadow-sm transition"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Delete Category Confirm Modal ─────────────────────────────────────────

const DeleteCategoryModal = ({ title, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-gray-800">Delete Section</h2>
                    <p className="text-xs text-gray-500">This cannot be undone.</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
                Delete <span className="font-semibold text-gray-800">{title}</span> and all its applications?
            </p>
            <div className="flex gap-3 justify-end">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    Cancel
                </button>
                <button type="button" onClick={onConfirm} className="px-5 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition">
                    Delete
                </button>
            </div>
        </div>
    </div>
);

// ── App Group (stable top-level component) ─────────────────────────────────
// IMPORTANT: This MUST be defined outside ApplicationsStep.
// If defined inside the render body, React treats it as a new component type
// on every render, causing full unmount/remount of the subtree — which destroys
// focused inputs (focus loss bug) and resets scroll position (scroll bug).
// See docs/project-memory.md for the full explanation.

const AppGroup = ({ title, category, apps, allApplications, updateFormData, isCustom, onDeleteCategory }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const updateAppsList = (newApps) => {
        updateFormData({ applications: { ...allApplications, [category]: newApps } });
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
        <>
            {showDeleteModal && (
                <DeleteCategoryModal
                    title={title}
                    onConfirm={() => { setShowDeleteModal(false); onDeleteCategory(category); }}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#15587B]">{title}</h3>
                        {isCustom && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#34808A]/10 text-[#34808A] border border-[#34808A]/20">
                                Custom
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isCustom && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded transition flex items-center gap-1"
                                title="Delete this category"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={addApp}
                            className="text-xs bg-[#34808A] text-white px-3 py-1.5 rounded hover:bg-[#2b6f6f] transition"
                        >
                            + Add Application
                        </button>
                    </div>
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
        </>
    );
};

AppGroup.displayName = "AppGroup";

// ── Main Step Component ────────────────────────────────────────────────────

const ApplicationsStep = memo(({ formData, updateFormData }) => {
    const [showAddModal, setShowAddModal] = useState(false);

    const SENS_KEYS = [
        "sensitivity", "businessSensitivity",
        "businessConfidentiality", "personallyIdentifiableInfo", "hipaaRegulated",
    ];

    // Initialize default categories and migrate existing apps missing sensitivity fields.
    useEffect(() => {
        const currentApps = formData.applications || {};
        const needsInit = Object.keys(defaultApplications).some(
            (cat) => !currentApps[cat] || currentApps[cat].length === 0
        );

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
            const migratedApps = {};
            Object.entries(currentApps).forEach(([cat, arr]) => {
                migratedApps[cat] = Array.isArray(arr)
                    ? arr.map((app) => {
                        const patch = {};
                        SENS_KEYS.forEach((k) => { if (app[k] === undefined) patch[k] = ""; });
                        return Object.keys(patch).length ? { ...app, ...patch } : app;
                    })
                    : arr;
            });
            updateFormData({ applications: migratedApps });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const allApplications = formData.applications || {};
    const customCategories = formData.customCategories || [];

    // All existing category keys (built-in + custom) — used by modal for duplicate detection.
    const allCategoryKeys = new Set([
        ...DEFAULT_CATEGORY_KEYS,
        ...customCategories.map((c) => c.key),
    ]);

    const handleCreateCategory = ({ key, title }) => {
        setShowAddModal(false);
        updateFormData((prev) => ({
            ...prev,
            applications: {
                ...(prev.applications || {}),
                [key]: makeCustomDefaultApps(title),
            },
            customCategories: [
                ...(prev.customCategories || []),
                { key, title },
            ],
        }));
    };

    const handleDeleteCategory = (categoryKey) => {
        updateFormData((prev) => {
            const newApps = { ...(prev.applications || {}) };
            delete newApps[categoryKey];
            return {
                ...prev,
                applications: newApps,
                customCategories: (prev.customCategories || []).filter((c) => c.key !== categoryKey),
            };
        });
    };

    return (
        <>
            {showAddModal && (
                <AddCategoryModal
                    existingKeys={allCategoryKeys}
                    onConfirm={handleCreateCategory}
                    onCancel={() => setShowAddModal(false)}
                />
            )}

            <div className="max-w-7xl mx-auto space-y-8 pb-10">
                {/* ── Built-in categories (never deletable) ─────────────────── */}
                <AppGroup title="Productivity Applications" category="productivity" apps={allApplications.productivity || []} allApplications={allApplications} updateFormData={updateFormData} isCustom={false} onDeleteCategory={handleDeleteCategory} />
                <AppGroup title="Finance Applications"      category="finance"      apps={allApplications.finance      || []} allApplications={allApplications} updateFormData={updateFormData} isCustom={false} onDeleteCategory={handleDeleteCategory} />
                <AppGroup title="HRIT Applications"         category="hrit"         apps={allApplications.hrit         || []} allApplications={allApplications} updateFormData={updateFormData} isCustom={false} onDeleteCategory={handleDeleteCategory} />
                <AppGroup title="Payroll Applications"      category="payroll"      apps={allApplications.payroll      || []} allApplications={allApplications} updateFormData={updateFormData} isCustom={false} onDeleteCategory={handleDeleteCategory} />
                <AppGroup title="Additional Applications"   category="additional"   apps={allApplications.additional   || []} allApplications={allApplications} updateFormData={updateFormData} isCustom={false} onDeleteCategory={handleDeleteCategory} />

                {/* ── User-created custom categories ────────────────────────── */}
                {customCategories.map((cc) => (
                    <AppGroup
                        key={cc.key}
                        title={cc.title}
                        category={cc.key}
                        apps={allApplications[cc.key] || []}
                        allApplications={allApplications}
                        updateFormData={updateFormData}
                        isCustom={true}
                        onDeleteCategory={handleDeleteCategory}
                    />
                ))}

                {/* ── Add New Application Section button ────────────────────── */}
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-[#34808A]/40 text-[#34808A] font-semibold text-sm rounded-xl hover:border-[#34808A] hover:bg-[#34808A]/5 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Application Section
                    </button>
                </div>
            </div>
        </>
    );
});

ApplicationsStep.displayName = "ApplicationsStep";

export default ApplicationsStep;
