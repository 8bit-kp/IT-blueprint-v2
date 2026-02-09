"use client";

import { useEffect, useState, useCallback, memo, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import { useForm } from "@/context/FormContext";
import { useRouter } from "next/navigation";
import FormHeader from "@/components/FormHeader";

// Import step components
import Step1 from "@/components/form-fields/CompanyInfoStep";
import Step2 from "@/components/form-fields/InfrastructureStep";
import Step3 from "@/components/form-fields/NetworkServerStep";
import Step4 from "@/components/form-fields/SecurityAdminStep";
import Step5 from "@/components/form-fields/SecurityTechStep";
import Step6 from "@/components/form-fields/ApplicationsStep";

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

const initialTechControlState = { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" };

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
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
                const res = await axios.get(`${backendUrl}/api/blueprint/get`, {
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

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
            const response = await axios.post(
                `${backendUrl}/api/blueprint/save`,
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
                    {step === 3 && <Step3 formData={formData} setField={setField} vendors={vendors} initialTechControlState={initialTechControlState} />}
                    {step === 4 && <Step4 formData={formData} setField={setField} />}
                    {step === 5 && <Step5 technicalControls={technicalControls} setTechnicalControls={setTechnicalControls} vendors={vendors} initialTechControlState={initialTechControlState} />}
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
