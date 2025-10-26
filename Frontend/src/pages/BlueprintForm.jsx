import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "../components/ProgressBar";
import { useForm } from "../context/FormContext";
import { useNavigate } from "react-router-dom";
import FormHeader from "../components/FormHeader";

const vendors = ["Cisco", "Amazon", "Flipkart", "Microsoft"];
const stepTitles = {
    1: "Step 1: Company Information",
    2: "Step 2: Infrastructure - Facilities",
    3: "Step 3: Network and Server Infrastructure",
    4: "Step 4: Security Administrative Controls",
    5: "Step 5: Security Technical Controls",
    6: "Step 6: Applications",
};

const ToggleButton = ({ options, value, onChange }) => {
    return (
        <div className="flex gap-3">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-2 rounded-lg border ${value === opt ? "bg-[#34808A] text-white" : "bg-gray-100"
                        }`}
                    type="button"
                >
                    {opt}
                </button>
            ))}
        </div>
    );
};

const ApplicationSection = ({ title, apps = [], onChange }) => {
    const updateApp = (index, key, value) => {
        const newApps = [...apps];
        newApps[index] = { ...newApps[index], [key]: value };
        onChange(newApps);
    };

    const addApp = () => {
        onChange([
            ...apps,
            {
                name: "",
                containsSensitiveInfo: "",
                mfa: "",
                backedUp: "",
                byodAccess: "",
            },
        ]);
    };

    const removeApp = (index) => {
        const newApps = apps.filter((_, i) => i !== index);
        onChange(newApps);
    };

    return (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-[#15587B] mb-3">{title}</h3>

            {apps.map((app, i) => (
                <div key={i} className="mb-4 border-b pb-4 last:border-none">
                    <input
                        placeholder="Application Name"
                        className="border p-2 rounded w-full mb-3"
                        value={app.name}
                        onChange={(e) => updateApp(i, "name", e.target.value)}
                    />

                    <YesNo
                        label="Contains PHI/PII/Sensitive information"
                        value={app.containsSensitiveInfo}
                        onChange={(v) => updateApp(i, "containsSensitiveInfo", v)}
                    />
                    <YesNo label="MFA" value={app.mfa} onChange={(v) => updateApp(i, "mfa", v)} />
                    <YesNo
                        label="Backed Up"
                        value={app.backedUp}
                        onChange={(v) => updateApp(i, "backedUp", v)}
                    />
                    <YesNo
                        label="BYOD Access Allowed"
                        value={app.byodAccess}
                        onChange={(v) => updateApp(i, "byodAccess", v)}
                    />

                    {title === "Additional Applications" && (
                        <button
                            type="button"
                            onClick={() => removeApp(i)}
                            className="mt-2 text-red-600 text-sm underline"
                        >
                            Remove Application
                        </button>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addApp}
                className="mt-2 px-3 py-2 bg-[#34808A] text-white rounded hover:bg-[#2b6f6f]"
            >
                + Add Application
            </button>
        </div>
    );
};


// For yes/no inputs
const YesNo = ({ label, value, onChange }) => (
    <div className="mb-4">
        <p className="font-medium mb-2">{label}</p>
        <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
    </div>
);

// For technical controls: three choices - Yes, No, Vendor
const YesNoVendor = ({ label, value, vendorValue, onChoice, onVendor }) => {
    // value: "Yes" | "No" | "Vendor"
    return (
        <div className="mb-4">
            <p className="font-medium mb-2">{label}</p>
            <div className="flex items-center gap-4">
                <ToggleButton options={["Yes", "No", "Vendor"]} value={value} onChange={onChoice} />
                {value === "Vendor" && (
                    <select
                        value={vendorValue || ""}
                        onChange={(e) => onVendor(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select vendor</option>
                        {vendors.map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
};

const MultiCheckbox = ({ label, options, values = [], onChange }) => {
    const toggle = (opt) => {
        if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
        else onChange([...values, opt]);
    };

    return (
        <div className="mb-4">
            <p className="font-medium mb-2">{label}</p>
            <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`px-3 py-2 rounded-lg border ${values.includes(opt) ? "bg-[#34808A] text-white" : "bg-gray-100"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function BlueprintForm() {
    const navigate = useNavigate();
    const totalSteps = 6;
    const { formData, updateFormData, step, setStep } = useForm();
    const [loadingSave, setLoadingSave] = useState(false);
    const [lastSavedStep, setLastSavedStep] = useState(0); // step number last saved successfully
    const token = localStorage.getItem("token");

    // local copies for technicalControls vendor selections
    const [technicalControls, setTechnicalControls] = useState({
        nextGenFirewall: { choice: "", vendor: "" },
        secureWebGateway: { choice: "", vendor: "" },
        casb: { choice: "", vendor: "" },
        dlp: { choice: "", vendor: "" },
        ssaVpn: { choice: "", vendor: "" },
        emailSecurity: { choice: "", vendor: "" },
        vulnerabilityMgmt: { choice: "", vendor: "" },
        iam: { choice: "", vendor: "" },
        nac: { choice: "", vendor: "" },
        mfa: { choice: "", vendor: "" },
        mdm: { choice: "", vendor: "" },
        edr: { choice: "", vendor: "" },
        dataClassification: { choice: "", vendor: "" },
        socSiem: { choice: "", vendor: "" },
    });

    // fetch existing blueprint on mount and prefill
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
                    // populate context formData
                    updateFormData(data);
                    // populate technicalControls local state if present
                    if (data.technicalControls) {
                        const tc = {};
                        Object.keys(technicalControls).forEach((k) => {
                            const val = data.technicalControls[k];
                            // data stored as either "Yes"/"No"/"Vendor:<vendor>"
                            if (!val) tc[k] = { choice: "", vendor: "" };
                            else if (val.startsWith("Vendor:")) {
                                tc[k] = { choice: "Vendor", vendor: val.split("Vendor:")[1] };
                            } else {
                                tc[k] = { choice: val, vendor: "" };
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

    // helper to persist technicalControls into formData (stringify each entry)
    const persistTechnicalControlsToForm = () => {
        const tcPayload = {};
        Object.entries(technicalControls).forEach(([k, v]) => {
            if (v.choice === "Vendor") tcPayload[k] = `Vendor:${v.vendor || ""}`;
            else tcPayload[k] = v.choice || "";
        });
        updateFormData({ technicalControls: tcPayload });
    };

    const saveStep = async (currentStep = step) => {
        setLoadingSave(true);
        try {
            // ensure technical controls local state is written to formData
            persistTechnicalControlsToForm();

            // attach a helper property _lastSavedStep so backend stores it (optional)
            const payload = { ...formData, _lastSavedStep: currentStep };

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

            // ✅ Save using saveStep
            await saveStep(step);

            if (step === totalSteps) {
                navigate("/blueprint-summary", { state: { formData } });
            } else {
                setStep((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Error saving blueprint:", err);
        } finally {
            setLoadingSave(false);
        }
    };
    // Back button (always allowed)
    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

   
    const setField = (key, value) =>
        updateFormData({    
            ...formData,
            [key]: value,
        });

    

    const Step1 = () => (
        <div className="space-y-4">
            <input
                placeholder="Name of the Company"
                className="border p-2 w-full rounded"
                value={formData.companyName || ""}
                onChange={(e) => setField("companyName", e.target.value)}
            />
            <input
                placeholder="Contact Name"
                className="border p-2 w-full rounded"
                value={formData.contactName || ""}
                onChange={(e) => setField("contactName", e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
                value={formData.email || ""}
                onChange={(e) => setField("email", e.target.value)}
            />
            <input
                placeholder="Phone Number"
                className="border p-2 w-full rounded"
                value={formData.phoneNumber || ""}
                onChange={(e) => setField("phoneNumber", e.target.value)}
            />

            <select
                className="border p-2 w-full rounded"
                value={formData.industry || ""}
                onChange={(e) => setField("industry", e.target.value)}
            >
                <option value="">Select Industry</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial">Financial</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="County-Cities">County-Cities</option>
                <option value="Others">Others</option>
            </select>

            <input
                placeholder="Specify (if Others)"
                className="border p-2 w-full rounded"
                value={formData.otherIndustry || ""}
                onChange={(e) => setField("otherIndustry", e.target.value)}
            />

            <select
                className="border p-2 w-full rounded"
                value={formData.employees || ""}
                onChange={(e) => setField("employees", e.target.value)}
            >
                <option value="">Number of employees (including contractors)</option>
                <option value="1-100">1 - 100</option>
                <option value="101-500">101 - 500</option>
                <option value="501-1000">501 - 1000</option>
                <option value="1001+">1001 and above</option>
            </select>

            <div>
                <label className="block mb-1">Percentage of remote workers: {formData.remotePercentage || 0}%</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.remotePercentage || 0}
                    onChange={(e) => setField("remotePercentage", Number(e.target.value))}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block mb-1">Percentage of contractors: {formData.contractorPercentage || 0}%</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.contractorPercentage || 0}
                    onChange={(e) => setField("contractorPercentage", Number(e.target.value))}
                    className="w-full"
                />
            </div>
        </div>
    );

    const Step2 = () => {
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
                                    <button
                                        key={o}
                                        type="button"
                                        onClick={() => setField(c.key, o)}
                                        className={`px-4 py-2 rounded border ${formData[c.key] === o ? "bg-[#34808A] text-white" : "bg-gray-100"
                                            }`}
                                    >
                                        {o}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <YesNo
                            key={c.key}
                            label={c.label}
                            value={formData[c.key]}
                            onChange={(val) => setField(c.key, val)}
                        />
                    )
                )}
            </div>
        );
    };

    const Step3 = () => (
        <div className="space-y-4">
            <input
                placeholder="If multiple locations, main location (HQ)"
                className="border p-2 w-full rounded"
                value={formData.mainLocation || ""}
                onChange={(e) => setField("mainLocation", e.target.value)}
            />

            <div className="flex gap-4">
                <YesNo label="WAN 1" value={formData.WAN1} onChange={(v) => setField("WAN1", v)} />
                <YesNo label="WAN 2" value={formData.WAN2} onChange={(v) => setField("WAN2", v)} />
                <YesNo label="WAN 3" value={formData.WAN3} onChange={(v) => setField("WAN3", v)} />
            </div>

            <DropdownField label="Switching (Vendor)" name="switchingVendor" value={formData.switchingVendor} onChange={(v) => setField("switchingVendor", v)} />
            <DropdownField label="Routing (Vendor)" name="routingVendor" value={formData.routingVendor} onChange={(v) => setField("routingVendor", v)} />
            <DropdownField label="Wireless (Vendor)" name="wirelessVendor" value={formData.wirelessVendor} onChange={(v) => setField("wirelessVendor", v)} />
            <DropdownField label="Baremetal (Vendor)" name="baremetalVendor" value={formData.baremetalVendor} onChange={(v) => setField("baremetalVendor", v)} />
            <DropdownField label="Virtualization (Vendor)" name="virtualizationVendor" value={formData.virtualizationVendor} onChange={(v) => setField("virtualizationVendor", v)} />
            <DropdownField label="Cloud (Vendor)" name="cloudVendor" value={formData.cloudVendor} onChange={(v) => setField("cloudVendor", v)} />

            <YesNo label="Do you have HA for your routing?" value={formData.haRouting} onChange={(v) => setField("haRouting", v)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="font-medium mb-2">What authentication mechanism do you use for wireless?</p>
                    <ToggleButton
                        options={["PSK", "EAP-PEAP", "EAP-TLS"]}
                        value={formData.wirelessAuth}
                        onChange={(v) => setField("wirelessAuth", v)}
                    />
                </div>

                <YesNo label="Do you have Guest Wireless Network?" value={formData.guestWireless} onChange={(v) => setField("guestWireless", v)} />
                <YesNo label="Have you segmented the guest wireless network from internal networks?" value={formData.guestSegmentation} onChange={(v) => setField("guestSegmentation", v)} />
            </div>

            {/* Server types */}
            <YesNo label="Do you have Windows Servers in your environment?" value={formData.windowsServers} onChange={(v) => setField("windowsServers", v)} />
            <MultiCheckbox
                label="Windows Servers - click all that apply"
                options={["Protected", "Backed-up", "Monitored", "Not Monitored"]}
                values={formData.windowsOptions || []}
                onChange={(vals) => setField("windowsOptions", vals)}
            />

            <YesNo label="Do you have Linux Servers in your environment?" value={formData.linuxServers} onChange={(v) => setField("linuxServers", v)} />
            <MultiCheckbox
                label="Linux Servers - click all that apply"
                options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up", "MFA for Access"]}
                values={formData.linuxOptions || []}
                onChange={(vals) => setField("linuxOptions", vals)}
            />

            <MultiCheckbox
                label="Desktops - click all that apply"
                options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up"]}
                values={formData.desktopOptions || []}
                onChange={(vals) => setField("desktopOptions", vals)}
            />
        </div>
    );

    const Step4 = () => (
        <div className="space-y-4">
            <h1>kishan</h1>
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
    );

    const Step5 = () => (
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
            ].map((ctl) => {
                const local = technicalControls[ctl.key] || { choice: "", vendor: "" };
                return (
                    <YesNoVendor
                        key={ctl.key}
                        label={ctl.label}
                        value={local.choice}
                        vendorValue={local.vendor}
                        onChoice={(choice) => {
                            setTechnicalControls((prev) => ({ ...prev, [ctl.key]: { ...prev[ctl.key], choice } }));
                        }}
                        onVendor={(vendor) => {
                            setTechnicalControls((prev) => ({ ...prev, [ctl.key]: { ...prev[ctl.key], vendor } }));
                        }}
                    />
                );
            })}
        </div>
    );

    const Step6 = () => (
        <div className="space-y-6">
            <ApplicationSection
                title="Productivity Applications"
                apps={formData.applications?.productivity || []}
                onChange={(apps) =>
                    updateFormData({
                        applications: {
                            ...formData.applications,
                            productivity: apps,
                        },
                    })
                }
            />
            <ApplicationSection
                title="Finance Applications"
                apps={formData.applications?.finance || []}
                onChange={(apps) =>
                    updateFormData({
                        applications: {
                            ...formData.applications,
                            finance: apps,
                        },
                    })
                }
            />
            <ApplicationSection
                title="HRIT Applications"
                apps={formData.applications?.hrit || []}
                onChange={(apps) =>
                    updateFormData({
                        applications: {
                            ...formData.applications,
                            hrit: apps,
                        },
                    })
                }
            />
            <ApplicationSection
                title="Payroll Applications"
                apps={formData.applications?.payroll || []}
                onChange={(apps) =>
                    updateFormData({
                        applications: {
                            ...formData.applications,
                            payroll: apps,
                        },
                    })
                }
            />
            <ApplicationSection
                title="Additional Applications"
                apps={formData.applications?.additional || []}
                onChange={(apps) =>
                    updateFormData({
                        applications: {
                            ...formData.applications,
                            additional: apps,
                        },
                    })
                }
            />
        </div>
    );


    // small helper component used above (declared here to avoid hoisting issues)
    function DropdownField({ label, value, onChange }) {
        return (
            <div className="mb-4">
                <p className="font-medium mb-2">{label}</p>
                <select
                    className="border p-2 rounded w-full"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select vendor</option>
                    {vendors.map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    /* -----------------------
       Final render
       ----------------------- */
    return (
        <div>
            <FormHeader />
            <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2ecf0] flex flex-col items-center p-6">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">

                    <ProgressBar step={step} totalSteps={totalSteps} />

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#15587B]">
                            {stepTitles[step]}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Last saved step: {lastSavedStep}
                        </p>
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
                        {/* Back button */}
                        <div>
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                >
                                    ← Back
                                </button>
                            )}
                        </div>

                        {/* Save & Save & Next buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSaveOnly}
                                disabled={loadingSave}
                                className={`px-4 py-2 rounded-lg border text-gray-700 ${loadingSave
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 transition"
                                    }`}
                            >
                                {loadingSave ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={handleSaveAndNext}
                                disabled={loadingSave}
                                className={`px-4 py-2 text-white rounded-lg ${loadingSave
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#34808A] hover:bg-[#2b6f6f] transition"
                                    }`}
                            >
                                {step === totalSteps ? "Finish" : "Save & Next →"}
                            </button>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                        Tip: Use <strong>Save</strong> to store the current step. Use{" "}
                        <strong>Save & Next</strong> to store and proceed to the next step.
                    </p>
                </div>
            </div>
        </div>

    );
}
