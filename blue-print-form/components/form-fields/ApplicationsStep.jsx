"use client";

import { memo } from "react";
import { TextInput, YesNoCompact } from "./FormComponents";

const ApplicationCard = memo(({ app, index, updateApp, removeApp }) => {
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
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Business Priority</label>
                    <div className="flex gap-1.5">
                        {["High", "Medium", "Critical"].map((priority) => {
                            const currentPriority = app.businessPriority || "Medium";
                            return (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => updateApp(index, "businessPriority", priority)}
                                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${currentPriority === priority
                                            ? priority === "Critical"
                                                ? "bg-red-600 text-white shadow-md ring-1 ring-red-700"
                                                : priority === "High"
                                                    ? "bg-orange-500 text-white shadow-md ring-1 ring-orange-600"
                                                    : "bg-blue-500 text-white shadow-md ring-1 ring-blue-600"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {priority}
                                </button>
                            );
                        })}
                    </div>
                </div>
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
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
                <YesNoCompact label="Sensitive Info" value={app.containsSensitiveInfo} onChange={(v) => updateApp(index, "containsSensitiveInfo", v)} />
                <YesNoCompact label="MFA Enabled" value={app.mfa} onChange={(v) => updateApp(index, "mfa", v)} />
                <YesNoCompact label="Backed Up" value={app.backedUp} onChange={(v) => updateApp(index, "backedUp", v)} />
                <YesNoCompact label="BYOD Access" value={app.byodAccess} onChange={(v) => updateApp(index, "byodAccess", v)} />
            </div>
        </div>
    )
});

const ApplicationsStep = memo(({ formData, updateFormData }) => {
    const AppGroup = ({ title, category }) => {
        const apps = formData.applications?.[category] || [];

        const updateAppsList = (newApps) => {
            updateFormData({ applications: { ...formData.applications, [category]: newApps } });
        };

        const updateApp = (index, key, val) => {
            const newApps = [...apps];
            newApps[index] = { ...newApps[index], [key]: val };
            updateAppsList(newApps);
        }

        const addApp = () => {
            updateAppsList([...apps, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: "", containsSensitiveInfo: "", mfa: "", backedUp: "", byodAccess: "", businessPriority: "", offering: "" }]);
        }

        const removeApp = (index) => {
            updateAppsList(apps.filter((_, i) => i !== index));
        }

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <h3 className="text-lg font-bold text-[#15587B]">{title}</h3>
                    <button onClick={addApp} className="text-xs bg-[#34808A] text-white px-3 py-1.5 rounded hover:bg-[#2b6f6f] transition">
                        + Add Application
                    </button>
                </div>
                {apps.length === 0 && <div className="text-gray-400 text-sm italic border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">No applications added in this category yet.</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {apps.map((app, i) => (
                        <ApplicationCard key={app.id || i} app={app} index={i} updateApp={updateApp} removeApp={removeApp} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <AppGroup title="Productivity Applications" category="productivity" />
            <AppGroup title="Finance Applications" category="finance" />
            <AppGroup title="HRIT Applications" category="hrit" />
            <AppGroup title="Payroll Applications" category="payroll" />
            <AppGroup title="Additional Applications" category="additional" />
        </div>
    )
});

export default ApplicationsStep;
