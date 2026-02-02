"use client";

import { useEffect, useState, useCallback, memo, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import { useForm } from "@/context/FormContext";
import { useRouter } from "next/navigation";
import FormHeader from "@/components/FormHeader";

const vendors = [
    "APC", "ATT", "Barracuda", "Cato", "Cisco", "Dell", "IBM",
    "Microsoft", "Multi-vendor", "Nodeware", "RapidFire", "VMWare", "No Data"
];

const stepTitles = {
    1: "Company Profile",
    2: "Facilities & Infrastructure",
    3: "Network & Server Infra",
    4: "Governance & Admin Controls",
    5: "Security Technical Controls",
    6: "Applications Portfolio",
};

const initialTechControlState = { choice: "", vendor: "", businessPriority: "", offering: "" };

// --- MINIMALIST UI COMPONENTS ---

const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#34808A] rounded-full"></div>
                <h3 className="font-semibold text-[#15587B] text-sm uppercase tracking-wide">{title}</h3>
            </div>
        )}
        <div className="p-5">{children}</div>
    </div>
);

const ToggleButton = memo(({ options, value, onChange }) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg w-max">
            {options.map((opt) => {
                const isActive = value === opt;
                return (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${isActive
                            ? "bg-white text-[#15587B] shadow-sm ring-1 ring-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                        type="button"
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
});

// Replaces TechnicalControlRow with a card style
const TechnicalControlCard = memo(({ label, data, onChange }) => {
    const { choice, vendor, businessPriority, offering } = data || initialTechControlState;

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:border-[#34808A] transition bg-white shadow-sm flex flex-col justify-between h-full">
            <div>
                <p className="font-semibold text-gray-800 mb-3 text-sm">{label}</p>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <ToggleButton
                            options={["Yes", "No", "Vendor"]}
                            value={choice}
                            onChange={(val) => handleChange("choice", val)}
                        />
                    </div>

                    {choice === "Vendor" && (
                        <select
                            value={vendor || ""}
                            onChange={(e) => handleChange("vendor", e.target.value)}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[#34808A] focus:ring-[#34808A] w-full p-2 border"
                        >
                            <option value="">Select Vendor...</option>
                            {vendors.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Priority</label>
                    <select
                        className="w-full text-xs border-gray-200 rounded bg-gray-50 focus:bg-white transition p-1 border"
                        value={businessPriority || ""}
                        onChange={(e) => handleChange("businessPriority", e.target.value)}
                    >
                        <option value="">-</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Offering</label>
                    <select
                        className="w-full text-xs border-gray-200 rounded bg-gray-50 focus:bg-white transition p-1 border"
                        value={offering || ""}
                        onChange={(e) => handleChange("offering", e.target.value)}
                    >
                        <option value="">-</option>
                        <option value="SaaS">SaaS</option>
                        <option value="On-premise">On-prem</option>
                    </select>
                </div>
            </div>
        </div>
    );
});

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

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Priority</label>
                    <select
                        className="w-full text-xs border-gray-200 rounded bg-gray-50 p-1.5 border"
                        value={app.businessPriority || ""}
                        onChange={(e) => updateApp(index, "businessPriority", e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Offering</label>
                    <select
                        className="w-full text-xs border-gray-200 rounded bg-gray-50 p-1.5 border"
                        value={app.offering || ""}
                        onChange={(e) => updateApp(index, "offering", e.target.value)}
                    >
                        <option value="">Select...</option>
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
})

const YesNo = memo(({ label, value, onChange }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100 last:border-0 gap-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
    </div>
));

const YesNoCompact = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center text-xs text-gray-600">
        <span>{label}</span>
        <div className="flex bg-gray-100 rounded p-0.5">
            <button type="button" onClick={() => onChange("Yes")} className={`px-2 py-0.5 rounded transition ${value === "Yes" ? "bg-white shadow text-teal-700 font-bold" : "text-gray-400 hover:text-gray-600"}`}>Y</button>
            <button type="button" onClick={() => onChange("No")} className={`px-2 py-0.5 rounded transition ${value === "No" ? "bg-white shadow text-gray-700 font-bold" : "text-gray-400 hover:text-gray-600"}`}>N</button>
        </div>
    </div>
);

const MultiCheckbox = memo(({ label, options, values = [], onChange }) => {
    const toggle = useCallback((opt) => {
        if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
        else onChange([...values, opt]);
    }, [values, onChange]);

    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${values.includes(opt)
                            ? "bg-[#34808A] text-white border-[#34808A]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
});

const TextInput = memo(({ placeholder, value, onChange, type = "text", className = "" }) => {
    const [localValue, setLocalValue] = useState(value || "");
    const timerRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // Debounce onChange
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onChange(newValue);
        }, 300); // 300ms debounce
    };

    const handleBlur = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (localValue !== value) onChange(localValue);
    };

    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-1 focus:ring-[#34808A] sm:text-sm p-2.5 placeholder-visible ${className}`}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
});

const RangeInput = memo(({ label, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || 0);
    const timerRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || 0);
    }, [value]);

    const handleChange = (e) => {
        const newValue = Number(e.target.value);
        setLocalValue(newValue);

        // Debounce onChange for better performance
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onChange(newValue);
        }, 200); // 200ms debounce for range slider
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-bold text-[#34808A]">{localValue}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={localValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#34808A]"
            />
        </div>
    );
});

// --- STEPS ---

const Step1 = memo(({ formData, setField }) => (
    <Card title="General Information" className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <TextInput placeholder="e.g. Acme Corp" value={formData.companyName} onChange={(v) => setField("companyName", v)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <TextInput placeholder="Full Name" value={formData.contactName} onChange={(v) => setField("contactName", v)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <TextInput type="email" placeholder="name@company.com" value={formData.email} onChange={(v) => setField("email", v)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <TextInput placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={(v) => setField("phoneNumber", v)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5" value={formData.industry || ""} onChange={(e) => setField("industry", e.target.value)}>
                    <option value="">Select...</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial">Financial</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="County-Cities">County-Cities</option>
                    <option value="Others">Others</option>
                </select>
                {formData.industry === "Others" && (
                    <div className="mt-2">
                        <TextInput placeholder="Specify Industry" value={formData.otherIndustry} onChange={(v) => setField("otherIndustry", v)} />
                    </div>
                )}
            </div>
            <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <select className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5" value={formData.employees || ""} onChange={(e) => setField("employees", e.target.value)}>
                    <option value="">Number of employees...</option>
                    <option value="1-100">1 - 100</option>
                    <option value="101-500">101 - 500</option>
                    <option value="501-1000">501 - 1000</option>
                    <option value="1001+">1001+</option>
                </select>
            </div>
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <RangeInput label="Remote Workers" value={formData.remotePercentage} onChange={(v) => setField("remotePercentage", v)} />
                <RangeInput label="Contractors" value={formData.contractorPercentage} onChange={(v) => setField("contractorPercentage", v)} />
            </div>
        </div>
    </Card>
));

const Step2 = memo(({ formData, setField }) => (
    <Card title="Facilities" className="max-w-4xl mx-auto">
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-medium text-gray-800 mb-3 text-sm">How many physical office spaces do you have?</p>
                <div className="flex flex-wrap gap-2">
                    {["1", "2-5", "5-25", "25+"].map(opt => (
                        <button key={opt} onClick={() => setField("physicalOffices", opt)} className={`flex-1 py-2 text-sm rounded border transition ${formData.physicalOffices === opt ? "bg-[#34808A] text-white border-[#34808A]" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <YesNo label="Have Datacenters?" value={formData.hasDataCenters} onChange={(v) => setField("hasDataCenters", v)} />
                    <YesNo label="On-Prem DC?" value={formData.hasOnPremDC} onChange={(v) => setField("hasOnPremDC", v)} />
                    <YesNo label="Cloud Infra?" value={formData.hasCloudInfra} onChange={(v) => setField("hasCloudInfra", v)} />
                </div>
                <div className="space-y-2">
                    <YesNo label="Onsite Generator?" value={formData.hasGenerator} onChange={(v) => setField("hasGenerator", v)} />
                    <YesNo label="UPS Systems?" value={formData.hasUPS} onChange={(v) => setField("hasUPS", v)} />
                </div>
            </div>
        </div>
    </Card>
));

const Step3 = memo(({ formData, setField }) => {
    const infraControls = [
        { key: "WAN1", label: "WAN 1" },
        { key: "WAN2", label: "WAN 2" },
        { key: "WAN3", label: "WAN 3" },
        { key: "switchingVendor", label: "Switching" },
        { key: "routingVendor", label: "Routing" },
        { key: "wirelessVendor", label: "Wireless" },
        { key: "baremetalVendor", label: "Baremetal" },
        { key: "virtualizationVendor", label: "Virtualization" },
        { key: "cloudVendor", label: "Cloud" },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Card title="Main Location">
                <TextInput placeholder="HQ Location Name" value={formData.mainLocation} onChange={(v) => setField("mainLocation", v)} />
            </Card>

            <div>
                <h3 className="text-lg font-semibold text-[#15587B] mb-4 pl-1">Infrastructure Vendors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {infraControls.map((ctl) => {
                        const currentData = (typeof formData[ctl.key] === 'object' && formData[ctl.key] !== null)
                            ? formData[ctl.key]
                            : initialTechControlState;
                        return (
                            <TechnicalControlCard
                                key={ctl.key}
                                label={ctl.label}
                                data={currentData}
                                onChange={(newData) => setField(ctl.key, newData)}
                            />
                        );
                    })}
                </div>
            </div>

            <Card title="Network Config & Servers">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <YesNo label="HA Routing?" value={formData.haRouting} onChange={(v) => setField("haRouting", v)} />
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100 gap-2">
                        <span className="text-sm font-medium text-gray-700">Wireless Auth</span>
                        <ToggleButton options={["PSK", "EAP-PEAP", "EAP-TLS"]} value={formData.wirelessAuth} onChange={(v) => setField("wirelessAuth", v)} />
                    </div>
                    <YesNo label="Guest Wireless?" value={formData.guestWireless} onChange={(v) => setField("guestWireless", v)} />
                    <YesNo label="Guest Segmentation?" value={formData.guestSegmentation} onChange={(v) => setField("guestSegmentation", v)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
                    <div>
                        <YesNo label="Windows Servers?" value={formData.windowsServers} onChange={(v) => setField("windowsServers", v)} />
                        {formData.windowsServers === "Yes" && (
                            <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
                                <MultiCheckbox label="Select features:" options={["Protected", "Backed-up", "Monitored", "Not Monitored"]} values={formData.windowsOptions || []} onChange={(vals) => setField("windowsOptions", vals)} />
                            </div>
                        )}
                    </div>
                    <div>
                        <YesNo label="Linux Servers?" value={formData.linuxServers} onChange={(v) => setField("linuxServers", v)} />
                        {formData.linuxServers === "Yes" && (
                            <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
                                <MultiCheckbox label="Select features:" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up", "MFA for Access"]} values={formData.linuxOptions || []} onChange={(vals) => setField("linuxOptions", vals)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <MultiCheckbox label="Desktops - Select all that apply:" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up"]} values={formData.desktopOptions || []} onChange={(vals) => setField("desktopOptions", vals)} />
                </div>
            </Card>
        </div>
    );
});

const Step4 = memo(({ formData, setField }) => (
    <Card title="Governance Checklist" className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <YesNo label="Security Steering Committee?" value={formData.securityCommittee} onChange={(v) => setField("securityCommittee", v)} />
            <YesNo label="Written Security Policy?" value={formData.securityPolicy} onChange={(v) => setField("securityPolicy", v)} />
            <YesNo label="Employee Training?" value={formData.employeeTraining} onChange={(v) => setField("employeeTraining", v)} />
            <YesNo label="Written BCDR Plan?" value={formData.bcdrPlan} onChange={(v) => setField("bcdrPlan", v)} />
            <YesNo label="Cybersecurity Insurance?" value={formData.cyberInsurance} onChange={(v) => setField("cyberInsurance", v)} />
            <YesNo label="Test Backup Recovery?" value={formData.testBackup} onChange={(v) => setField("testBackup", v)} />
            <YesNo label="Change Control Process?" value={formData.changeControl} onChange={(v) => setField("changeControl", v)} />
            <YesNo label="Incident Response Plan?" value={formData.incidentResponse} onChange={(v) => setField("incidentResponse", v)} />
            <YesNo label="Monthly Security Review?" value={formData.securityReview} onChange={(v) => setField("securityReview", v)} />
            <YesNo label="Penetration Test (1 yr)?" value={formData.penetrationTest} onChange={(v) => setField("penetrationTest", v)} />
        </div>
    </Card>
));

const Step5 = memo(({ technicalControls, setTechnicalControls }) => {
    const controls = [
        { key: "nextGenFirewall", label: "Next Gen Firewall" },
        { key: "secureWebGateway", label: "Secure Web Gateway" },
        { key: "casb", label: "CASB" },
        { key: "dlp", label: "Data Loss Prevention" },
        { key: "ssaVpn", label: "SSA-VPN" },
        { key: "emailSecurity", label: "E-mail Security" },
        { key: "vulnerabilityMgmt", label: "Vuln. Management" },
        { key: "iam", label: "IAM" },
        { key: "nac", label: "NAC" },
        { key: "mfa", label: "MFA" },
        { key: "mdm", label: "MDM" },
        { key: "edr", label: "EDR" },
        { key: "dataClassification", label: "Data Classification" },
        { key: "socSiem", label: "SOC - SIEM" },
        { key: "assetManagement", label: "Asset Management" },
        { key: "sdWan", label: "SD-WAN" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {controls.map((ctl) => {
                    const localData = technicalControls[ctl.key] || { ...initialTechControlState };
                    return (
                        <TechnicalControlCard
                            key={ctl.key}
                            label={ctl.label}
                            data={localData}
                            onChange={(newData) => {
                                setTechnicalControls((prev) => ({
                                    ...prev,
                                    [ctl.key]: newData
                                }));
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

const Step6 = memo(({ formData, updateFormData }) => {
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

// --- MAIN PAGE ---

export default function BlueprintForm() {
    const router = useRouter();
    const totalSteps = 6;
    const { formData, updateFormData, step, setStep } = useForm();
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [lastSavedStep, setLastSavedStep] = useState(0);
    const [token, setToken] = useState(null);

    const [technicalControls, setTechnicalControls] = useState({
        nextGenFirewall: { ...initialTechControlState },
        secureWebGateway: { ...initialTechControlState },
        casb: { ...initialTechControlState },
        dlp: { ...initialTechControlState },
        ssaVpn: { ...initialTechControlState },
        emailSecurity: { ...initialTechControlState },
        vulnerabilityMgmt: { ...initialTechControlState },
        iam: { ...initialTechControlState },
        nac: { ...initialTechControlState },
        mfa: { ...initialTechControlState },
        mdm: { ...initialTechControlState },
        edr: { ...initialTechControlState },
        dataClassification: { ...initialTechControlState },
        socSiem: { ...initialTechControlState },
        assetManagement: { ...initialTechControlState },
        sdWan: { ...initialTechControlState },
    });

    const setField = useCallback((key, value) => {
        updateFormData((prev) => ({ ...prev, [key]: value }));
    }, [updateFormData]);

    // Initial Fetch - Optimized
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            toast.error("Please login first");
            router.push("/auth");
            return;
        }
        setToken(storedToken);

        const fetchBlueprint = async () => {
            setLoadingData(true);

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/get`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                    timeout: 10000,
                });
                const data = res.data || {};

                if (data && Object.keys(data).length) {
                    if (data.technicalControls) {
                        const tc = {};
                        Object.keys(data.technicalControls).forEach((k) => {
                            const val = data.technicalControls[k];
                            if (typeof val === 'object' && val !== null) {
                                tc[k] = { ...initialTechControlState, ...val };
                            } else if (typeof val === 'string') {
                                if (val.startsWith("Vendor:")) {
                                    tc[k] = { ...initialTechControlState, choice: "Vendor", vendor: val.split("Vendor:")[1] };
                                } else {
                                    tc[k] = { ...initialTechControlState, choice: val };
                                }
                            }
                        });
                        setTechnicalControls(tc);
                    }

                    if (!data.applications) {
                        data.applications = {
                            productivity: [],
                            finance: [],
                            hrit: [],
                            payroll: [],
                            additional: []
                        };
                    }

                    updateFormData(data);
                    setLastSavedStep(data._lastSavedStep || 0);
                }
            } catch (err) {
                console.error("fetch blueprint err", err);
                if (err.response?.status === 401) {
                    toast.error("Session expired. Please login again.");
                    router.push("/auth");
                } else if (err.code === 'ECONNABORTED') {
                    toast.error("Request timeout. Please try again.");
                } else {
                    toast.error("Failed to load data. Please refresh the page.");
                }
            } finally {
                setLoadingData(false);
            }
        };
        fetchBlueprint();
    }, [router, updateFormData]);

    const persistTechnicalControlsToForm = useCallback(() => {
        updateFormData({ technicalControls });
    }, [technicalControls, updateFormData]);

    const saveStep = async (currentStep = step) => {
        setLoadingSave(true);
        try {
            persistTechnicalControlsToForm();

            const applications = formData.applications || {
                productivity: [],
                finance: [],
                hrit: [],
                payroll: [],
                additional: []
            };

            const normalizeVendorField = (value) => {
                if (!value) return initialTechControlState;
                if (typeof value === 'object' && value !== null) return value;
                if (typeof value === 'string') {
                    if (value === 'Yes' || value === 'No') {
                        return { ...initialTechControlState, choice: value };
                    } else {
                        return { ...initialTechControlState, choice: 'Vendor', vendor: value };
                    }
                }
                return initialTechControlState;
            };

            const normalizedData = {
                ...formData,
                applications,
                WAN1: normalizeVendorField(formData.WAN1),
                WAN2: normalizeVendorField(formData.WAN2),
                WAN3: normalizeVendorField(formData.WAN3),
                switchingVendor: normalizeVendorField(formData.switchingVendor),
                routingVendor: normalizeVendorField(formData.routingVendor),
                wirelessVendor: normalizeVendorField(formData.wirelessVendor),
                baremetalVendor: normalizeVendorField(formData.baremetalVendor),
                virtualizationVendor: normalizeVendorField(formData.virtualizationVendor),
                cloudVendor: normalizeVendorField(formData.cloudVendor),
                technicalControls: technicalControls,
                _lastSavedStep: currentStep
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/save`,
                normalizedData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000
                }
            );

            setLastSavedStep(currentStep);
            toast.success(response.data?.message || "Saved successfully");
            return true;
        } catch (err) {
            console.error("Save error:", err);
            if (err.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                setTimeout(() => router.push("/auth"), 2000);
            } else if (err.code === 'ECONNABORTED') {
                toast.error("Save timeout. Please try again.");
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err.message) {
                toast.error("Error: " + err.message);
            } else {
                toast.error("Failed to save. Please check your connection and try again.");
            }
            return false;
        } finally {
            setLoadingSave(false);
        }
    };

    const handleSaveOnly = async () => {
        await saveStep(step);
    };

    const handleSaveAndNext = async () => {
        const success = await saveStep(step);
        if (success) {
            if (step === totalSteps) {
                router.push("/blueprint-summary");
            } else {
                setStep((prev) => prev + 1);
                window.scrollTo(0, 0);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo(0, 0);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#15587B] mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your blueprint...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-24">
            <FormHeader />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <ProgressBar step={step} totalSteps={totalSteps} />

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#15587B]">{stepTitles[step]}</h2>
                        <p className="text-sm text-gray-500">Please fill in the details below.</p>
                    </div>
                </div>

                <div className="animate-fade-in">
                    {step === 1 && <Step1 formData={formData} setField={setField} />}
                    {step === 2 && <Step2 formData={formData} setField={setField} />}
                    {step === 3 && <Step3 formData={formData} setField={setField} />}
                    {step === 4 && <Step4 formData={formData} setField={setField} />}
                    {step === 5 && <Step5 technicalControls={technicalControls} setTechnicalControls={setTechnicalControls} />}
                    {step === 6 && <Step6 formData={formData} updateFormData={updateFormData} />}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-[#15587B] hover:border-gray-300 transition-all duration-200 group"
                            >
                                <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
                                <span>Back</span>
                            </button>
                        )}
                        <span className="text-xs text-gray-400 hidden sm:inline-block border-l border-gray-300 pl-4">
                            {lastSavedStep > 0 ? `Last saved at Step ${lastSavedStep}` : "Not saved yet"}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSaveOnly}
                            disabled={loadingSave}
                            className="px-4 sm:px-6 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                        >
                            {loadingSave ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            onClick={handleSaveAndNext}
                            disabled={loadingSave}
                            className="px-6 sm:px-8 py-2.5 text-sm text-white bg-[#15587B] hover:bg-[#0f4460] rounded-lg font-bold shadow-md transition flex items-center gap-2"
                        >
                            {step === totalSteps ? "Finish & Review" : "Next Step →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
