import { useEffect, useState, useCallback, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "../components/ProgressBar";
import { useForm } from "../context/FormContext";
import { useNavigate } from "react-router-dom";
import FormHeader from "../components/FormHeader";

const vendors = [
    "APC", "ATT", "Barracuda", "Cato", "Cisco", "Dell", "IBM", 
    "Microsoft", "Multi-vendor", "Nodeware", "RapidFire", "VMWare", "No Data"
];

const stepTitles = {
    1: "Step 1: Company Information",
    2: "Step 2: Infrastructure - Facilities",
    3: "Step 3: Network and Server Infrastructure",
    4: "Step 4: Security Administrative Controls",
    5: "Step 5: Security Technical Controls",
    6: "Step 6: Applications",
};

// Default state for Technical Control Objects
const initialTechControlState = { choice: "", vendor: "", businessPriority: "", offering: "" };

// --- UI COMPONENTS ---

const ToggleButton = memo(({ options, value, onChange }) => {
    return (
        <div className="flex gap-3">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-2 rounded-lg border ${value === opt ? "bg-[#34808A] text-white" : "bg-gray-100"}`}
                    type="button"
                >
                    {opt}
                </button>
            ))}
        </div>
    );
});

const TechnicalControlRow = memo(({ label, data, onChange }) => {
    // Fallback to empty state if data is undefined
    const { choice, vendor, businessPriority, offering } = data || initialTechControlState;

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold text-[#15587B] mb-3">{label}</p>
            
            {/* Row 1: Choice & Vendor Select */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
                <ToggleButton 
                    options={["Yes", "No", "Vendor"]} 
                    value={choice} 
                    onChange={(val) => handleChange("choice", val)} 
                />
                
                {choice === "Vendor" && (
                    <select
                        value={vendor || ""}
                        onChange={(e) => handleChange("vendor", e.target.value)}
                        className="border p-2 rounded w-full md:w-64"
                    >
                        <option value="">Select vendor</option>
                        {vendors.map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Row 2: Business Priority & Offering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="font-medium mb-1 text-sm text-gray-600">Business Priority</p>
                    <select
                        className="border p-2 rounded w-full bg-white"
                        value={businessPriority || ""}
                        onChange={(e) => handleChange("businessPriority", e.target.value)}
                    >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div>
                    <p className="font-medium mb-1 text-sm text-gray-600">Offering</p>
                    <select
                        className="border p-2 rounded w-full bg-white"
                        value={offering || ""}
                        onChange={(e) => handleChange("offering", e.target.value)}
                    >
                        <option value="">Select Offering</option>
                        <option value="SaaS">SaaS</option>
                        <option value="On-premise">On-premise</option>
                    </select>
                </div>
            </div>
        </div>
    );
});

const ApplicationSection = memo(({ title, apps = [], onChange }) => {
    const safeApps = apps || [];

    const updateApp = useCallback((index, key, value) => {
        const newApps = [...safeApps];
        newApps[index] = { ...newApps[index], [key]: value };
        onChange(newApps);
    }, [safeApps, onChange]);

    const addApp = useCallback(() => {
        onChange([
            ...safeApps,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name: "",
                containsSensitiveInfo: "",
                mfa: "",
                backedUp: "",
                byodAccess: "",
                businessPriority: "",
                offering: "",
            },
        ]);
    }, [safeApps, onChange]);

    const removeApp = useCallback((index) => {
        const newApps = safeApps.filter((_, i) => i !== index);
        onChange(newApps);
    }, [safeApps, onChange]);

    return (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-[#15587B] mb-3">{title}</h3>
            {safeApps.map((app, i) => {
                const stableKey = app.id || `app-${i}`;
                return (
                    <div key={`${title}-app-${stableKey}`} className="mb-6 border-b pb-6 last:border-none last:pb-0">
                        <div className="mb-4">
                            <TextInput
                                placeholder="Provider Name"
                                value={app.name || ""}
                                onChange={(v) => updateApp(i, "name", v)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="font-medium mb-2 text-sm">Business Priority</p>
                                <select
                                    className="border p-2 rounded w-full bg-white"
                                    value={app.businessPriority || ""}
                                    onChange={(e) => updateApp(i, "businessPriority", e.target.value)}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <p className="font-medium mb-2 text-sm">Offering</p>
                                <select
                                    className="border p-2 rounded w-full bg-white"
                                    value={app.offering || ""}
                                    onChange={(e) => updateApp(i, "offering", e.target.value)}
                                >
                                    <option value="">Select Offering</option>
                                    <option value="SaaS">SaaS</option>
                                    <option value="On-premise">On-premise</option>
                                </select>
                            </div>
                        </div>
                        <YesNo label="Contains PHI/PII/Sensitive information" value={app.containsSensitiveInfo} onChange={(v) => updateApp(i, "containsSensitiveInfo", v)} />
                        <YesNo label="MFA" value={app.mfa} onChange={(v) => updateApp(i, "mfa", v)} />
                        <YesNo label="Backed Up" value={app.backedUp} onChange={(v) => updateApp(i, "backedUp", v)} />
                        <YesNo label="BYOD Access Allowed" value={app.byodAccess} onChange={(v) => updateApp(i, "byodAccess", v)} />
                        {title === "Additional Applications" && (
                            <button type="button" onClick={() => removeApp(i)} className="mt-2 text-red-600 text-sm underline hover:text-red-800">
                                Remove Application
                            </button>
                        )}
                    </div>
                );
            })}
            <button type="button" onClick={addApp} className="mt-2 px-3 py-2 bg-[#34808A] text-white rounded hover:bg-[#2b6f6f] transition">
                + Add Application
            </button>
        </div>
    );
});

const YesNo = memo(({ label, value, onChange }) => (
    <div className="mb-4">
        <p className="font-medium mb-2">{label}</p>
        <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
    </div>
));

const MultiCheckbox = memo(({ label, options, values = [], onChange }) => {
    const toggle = useCallback((opt) => {
        if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
        else onChange([...values, opt]);
    }, [values, onChange]);

    return (
        <div className="mb-4">
            <p className="font-medium mb-2">{label}</p>
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`px-3 py-2 rounded-lg border ${values.includes(opt) ? "bg-[#34808A] text-white" : "bg-gray-100"}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
});

const TextInput = memo(({ placeholder, value, onChange, type = "text" }) => {
    const [localValue, setLocalValue] = useState(value || "");
    useEffect(() => { setLocalValue(value || ""); }, [value]);
    const handleChange = (e) => setLocalValue(e.target.value);
    const handleBlur = () => { if (localValue !== value) onChange(localValue); };

    return (
        <input
            type={type}
            placeholder={placeholder}
            className="border p-2 w-full rounded"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
});

const RangeInput = memo(({ label, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || 0);
    useEffect(() => { setLocalValue(value || 0); }, [value]);
    const handleChange = (e) => setLocalValue(Number(e.target.value));
    const handleBlur = () => { if (localValue !== value) onChange(localValue); };

    return (
        <div>
            <label className="block mb-1">{label}: {localValue}%</label>
            <input type="range" min="1" max="100" value={localValue} onChange={handleChange} onBlur={handleBlur} className="w-full" />
        </div>
    );
});

// --- MAIN FORM COMPONENT ---

export default function BlueprintForm() {
    const navigate = useNavigate();
    const totalSteps = 6;
    const { formData, updateFormData, step, setStep } = useForm();
    const [loadingSave, setLoadingSave] = useState(false);
    const [lastSavedStep, setLastSavedStep] = useState(0);
    const token = localStorage.getItem("token");

    // Initialize Technical Controls state (for Step 5)
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
        updateFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, [updateFormData]);

    // Fetch Blueprint Data
    useEffect(() => {
        const fetchBlueprint = async () => {
            if (!token) {
                toast.error("Please login first");
                navigate("/auth");
                return;
            }
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blueprint/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data || {};
                
                if (data && Object.keys(data).length) {
                    updateFormData(data);

                    // Populate technicalControls local state (Step 5)
                    if (data.technicalControls) {
                        const tc = { ...technicalControls };
                        Object.keys(data.technicalControls).forEach((k) => {
                            const val = data.technicalControls[k];
                            if (typeof val === 'object' && val !== null) {
                                tc[k] = {
                                    choice: val.choice || "",
                                    vendor: val.vendor || "",
                                    businessPriority: val.businessPriority || "",
                                    offering: val.offering || ""
                                };
                            } else if (typeof val === 'string') {
                                // Backward compatibility
                                if (val.startsWith("Vendor:")) {
                                    tc[k] = { ...initialTechControlState, choice: "Vendor", vendor: val.split("Vendor:")[1] };
                                } else {
                                    tc[k] = { ...initialTechControlState, choice: val };
                                }
                            }
                        });
                        setTechnicalControls(tc);
                    }
                    setLastSavedStep(data._lastSavedStep || 0);
                }
            } catch (err) {
                console.error("fetch blueprint err", err);
            }
        };
        fetchBlueprint();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const persistTechnicalControlsToForm = useCallback(() => {
        updateFormData({ technicalControls });
    }, [technicalControls, updateFormData]);

    const saveStep = async (currentStep = step) => {
        setLoadingSave(true);
        try {
            persistTechnicalControlsToForm();
            const payload = { 
                ...formData, 
                technicalControls: technicalControls,
                _lastSavedStep: currentStep 
            };

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/blueprint/save`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLastSavedStep(currentStep);
            toast.success("Saved successfully");
            return true;
        } catch (err) {
            console.error("save error", err);
            toast.error(err.response?.data?.message || "Failed to save step");
            return false;
        } finally {
            setLoadingSave(false);
        }
    };

    const handleSaveOnly = async () => {
        await saveStep(step);
    };

    const handleSaveAndNext = async () => {
        try {
            setLoadingSave(true);
            await saveStep(step);
            if (step === totalSteps) {
                navigate("/blueprint-summary", { state: { formData: { ...formData, technicalControls } } });
            } else {
                setStep((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Error saving blueprint:", err);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // --- STEP COMPONENTS ---

    const Step1 = memo(() => {
        return (
            <div className="space-y-4">
                <TextInput placeholder="Name of the Company" value={formData.companyName} onChange={(v) => setField("companyName", v)} />
                <TextInput placeholder="Contact Name" value={formData.contactName} onChange={(v) => setField("contactName", v)} />
                <TextInput type="email" placeholder="Email" value={formData.email} onChange={(v) => setField("email", v)} />
                <TextInput placeholder="Phone Number" value={formData.phoneNumber} onChange={(v) => setField("phoneNumber", v)} />
                <select className="border p-2 w-full rounded" value={formData.industry || ""} onChange={(e) => setField("industry", e.target.value)}>
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial">Financial</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="County-Cities">County-Cities</option>
                    <option value="Others">Others</option>
                </select>
                <TextInput placeholder="Specify (if Others)" value={formData.otherIndustry} onChange={(v) => setField("otherIndustry", v)} />
                <select className="border p-2 w-full rounded" value={formData.employees || ""} onChange={(e) => setField("employees", e.target.value)}>
                    <option value="">Number of employees (including contractors)</option>
                    <option value="1-100">1 - 100</option>
                    <option value="101-500">101 - 500</option>
                    <option value="501-1000">501 - 1000</option>
                    <option value="1001+">1001 and above</option>
                </select>
                <RangeInput label="Percentage of remote workers" value={formData.remotePercentage} onChange={(v) => setField("remotePercentage", v)} />
                <RangeInput label="Percentage of contractors" value={formData.contractorPercentage} onChange={(v) => setField("contractorPercentage", v)} />
            </div>
        );
    });

    const Step2 = memo(() => {
        const choices = [
            { label: "How many physical office spaces you have", key: "physicalOffices", opts: ["1", "2-5", "5-25", "25+"] },
            { label: "Do you have one or more datacenters", key: "hasDataCenters" },
            { label: "Do you have an on-premise datacenter", key: "hasOnPremDC" },
            { label: "Do you have a cloud infrastructure (Azure, AWS, G-suite)", key: "hasCloudInfra" },
            { label: "Do you have a generator onsite critical locations", key: "hasGenerator" },
            { label: "Do you have UPS at all your data centers", key: "hasUPS" },
        ];
        return (
            <div className="space-y-4">
                {choices.map((c) =>
                    c.opts ? (
                        <div key={c.key}>
                            <p className="font-medium mb-2">{c.label}</p>
                            <div className="flex gap-3">
                                {c.opts.map((o) => (
                                    <button key={o} type="button" onClick={() => setField(c.key, o)} className={`px-4 py-2 rounded border ${formData[c.key] === o ? "bg-[#34808A] text-white" : "bg-gray-100"}`}>
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <YesNo key={c.key} label={c.label} value={formData[c.key]} onChange={(val) => setField(c.key, val)} />
                    )
                )}
            </div>
        );
    });

    // ✅ STEP 3 UPDATED TO USE TECHNICAL CONTROL ROW
    const Step3 = memo(() => {
        const infrastructureControls = [
            { key: "WAN1", label: "WAN 1" },
            { key: "WAN2", label: "WAN 2" },
            { key: "WAN3", label: "WAN 3" },
            { key: "switchingVendor", label: "Switching (Vendor)" },
            { key: "routingVendor", label: "Routing (Vendor)" },
            { key: "wirelessVendor", label: "Wireless (Vendor)" },
            { key: "baremetalVendor", label: "Baremetal (Vendor)" },
            { key: "virtualizationVendor", label: "Virtualization (Vendor)" },
            { key: "cloudVendor", label: "Cloud (Vendor)" },
        ];

        return (
            <div className="space-y-4">
                <TextInput placeholder="If multiple locations, main location (HQ)" value={formData.mainLocation} onChange={(v) => setField("mainLocation", v)} />
                
                <div className="border-t my-6 border-gray-200"></div>
                <h3 className="text-lg font-semibold text-[#15587B] mb-4">Infrastructure Vendors</h3>

                {infrastructureControls.map((ctl) => {
                    // Safe access to object data from formData
                    const currentData = (typeof formData[ctl.key] === 'object' && formData[ctl.key] !== null) 
                        ? formData[ctl.key] 
                        : initialTechControlState;

                    return (
                        <TechnicalControlRow
                            key={ctl.key}
                            label={ctl.label}
                            data={currentData}
                            onChange={(newData) => setField(ctl.key, newData)}
                        />
                    );
                })}

                <div className="border-t my-6 border-gray-200"></div>

                <YesNo label="Do you have HA for your routing?" value={formData.haRouting} onChange={(v) => setField("haRouting", v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium mb-2">What authentication mechanism do you use for wireless?</p>
                        <ToggleButton options={["PSK", "EAP-PEAP", "EAP-TLS"]} value={formData.wirelessAuth} onChange={(v) => setField("wirelessAuth", v)} />
                    </div>
                    <YesNo label="Do you have Guest Wireless Network?" value={formData.guestWireless} onChange={(v) => setField("guestWireless", v)} />
                    <YesNo label="Have you segmented the guest wireless network from internal networks?" value={formData.guestSegmentation} onChange={(v) => setField("guestSegmentation", v)} />
                </div>
                
                <YesNo label="Do you have Windows Servers in your environment?" value={formData.windowsServers} onChange={(v) => setField("windowsServers", v)} />
                <MultiCheckbox label="Windows Servers - click all that apply" options={["Protected", "Backed-up", "Monitored", "Not Monitored"]} values={formData.windowsOptions || []} onChange={(vals) => setField("windowsOptions", vals)} />
                
                <YesNo label="Do you have Linux Servers in your environment?" value={formData.linuxServers} onChange={(v) => setField("linuxServers", v)} />
                <MultiCheckbox label="Linux Servers - click all that apply" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up", "MFA for Access"]} values={formData.linuxOptions || []} onChange={(vals) => setField("linuxOptions", vals)} />
                
                <MultiCheckbox label="Desktops - click all that apply" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up"]} values={formData.desktopOptions || []} onChange={(vals) => setField("desktopOptions", vals)} />
            </div>
        );
    });

    const Step4 = memo(() => (
        <div className="space-y-4">
            <YesNo label="Do you have a security steering committee?" value={formData.securityCommittee} onChange={(v) => setField("securityCommittee", v)} />
            <YesNo label="Do you have a written security policy?" value={formData.securityPolicy} onChange={(v) => setField("securityPolicy", v)} />
            <YesNo label="Do you provide employee security training?" value={formData.employeeTraining} onChange={(v) => setField("employeeTraining", v)} />
            <YesNo label="Do you have a written BCDR Plan?" value={formData.bcdrPlan} onChange={(v) => setField("bcdrPlan", v)} />
            <YesNo label="Do you have Cybersecurity Insurance?" value={formData.cyberInsurance} onChange={(v) => setField("cyberInsurance", v)} />
            <YesNo label="Do you test your backup recovery?" value={formData.testBackup} onChange={(v) => setField("testBackup", v)} />
            <YesNo label="Do you have documented change control process?" value={formData.changeControl} onChange={(v) => setField("changeControl", v)} />
            <YesNo label="Do you have a documented incident response plan?" value={formData.incidentResponse} onChange={(v) => setField("incidentResponse", v)} />
            <YesNo label="Do you conduct monthly security review meetings?" value={formData.securityReview} onChange={(v) => setField("securityReview", v)} />
            <YesNo label="Have you conducted a Penetration Testing in the last 1 year?" value={formData.penetrationTest} onChange={(v) => setField("penetrationTest", v)} />
        </div>
    ));

    const Step5 = memo(() => (
        <div className="space-y-4">
            {[
                { key: "nextGenFirewall", label: "Next Generation Firewall" },
                { key: "secureWebGateway", label: "Secure Web Gateway" },
                { key: "casb", label: "Cloud Access Security Broker" },
                { key: "dlp", label: "Data Loss Prevention" },
                { key: "ssaVpn", label: "SSA-VPN" },
                { key: "emailSecurity", label: "E-mail Security" },
                { key: "vulnerabilityMgmt", label: "Vulnerability Management" },
                { key: "iam", label: "Identity and Access Management" },
                { key: "nac", label: "Network Access Control" },
                { key: "mfa", label: "Multi-Factor Authentication" },
                { key: "mdm", label: "Mobile Device Management" },
                { key: "edr", label: "EndPoint Detection and Response" },
                { key: "dataClassification", label: "Data Classification" },
                { key: "socSiem", label: "SOC - SIEM" },
                { key: "assetManagement", label: "Asset Management" },
                { key: "sdWan", label: "SD-WAN" },
            ].map((ctl) => {
                const localData = technicalControls[ctl.key] || { ...initialTechControlState };
                return (
                    <TechnicalControlRow
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
    ));

    const Step6 = memo(() => (
        <div className="space-y-6">
            <ApplicationSection title="Productivity Applications" apps={formData.applications?.productivity || []} onChange={(apps) => updateFormData({ applications: { ...formData.applications, productivity: apps } })} />
            <ApplicationSection title="Finance Applications" apps={formData.applications?.finance || []} onChange={(apps) => updateFormData({ applications: { ...formData.applications, finance: apps } })} />
            <ApplicationSection title="HRIT Applications" apps={formData.applications?.hrit || []} onChange={(apps) => updateFormData({ applications: { ...formData.applications, hrit: apps } })} />
            <ApplicationSection title="Payroll Applications" apps={formData.applications?.payroll || []} onChange={(apps) => updateFormData({ applications: { ...formData.applications, payroll: apps } })} />
            <ApplicationSection title="Additional Applications" apps={formData.applications?.additional || []} onChange={(apps) => updateFormData({ applications: { ...formData.applications, additional: apps } })} />
        </div>
    ));

    return (
        <div>
            <FormHeader />
            <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2ecf0] flex flex-col items-center p-6">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
                    <ProgressBar step={step} totalSteps={totalSteps} />
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#15587B]">{stepTitles[step]}</h2>
                        <p className="text-sm text-gray-500">Last saved step: {lastSavedStep}</p>
                    </div>

                    <div className="mb-6">
                        {step === 1 && <Step1 />}
                        {step === 2 && <Step2 />}
                        {step === 3 && <Step3 />}
                        {step === 4 && <Step4 />}
                        {step === 5 && <Step5 />}
                        {step === 6 && <Step6 />}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div>
                            {step > 1 && (
                                <button onClick={handleBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                                    ← Back
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleSaveOnly} disabled={loadingSave} className={`px-4 py-2 rounded-lg border text-gray-700 ${loadingSave ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100 transition"}`}>
                                {loadingSave ? "Saving..." : "Save"}
                            </button>
                            <button onClick={handleSaveAndNext} disabled={loadingSave} className={`px-4 py-2 text-white rounded-lg ${loadingSave ? "bg-gray-400 cursor-not-allowed" : "bg-[#34808A] hover:bg-[#2b6f6f] transition"}`}>
                                {step === totalSteps ? "Finish" : "Save & Next →"}
                            </button>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                        Tip: Use <strong>Save</strong> to store the current step. Use <strong>Save & Next</strong> to store and proceed to the next step.
                    </p>
                </div>
            </div>
        </div>
    );
}