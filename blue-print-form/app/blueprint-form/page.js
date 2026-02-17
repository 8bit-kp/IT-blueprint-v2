"use client";

import { useEffect, useState, useCallback, memo, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import { useForm } from "@/context/FormContext";
import { useRouter } from "next/navigation";
import FormHeader from "@/components/FormHeader";
import WarningModal from "@/components/WarningModal";

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
    const { formData, updateFormData, step, setStep, resetForm } = useForm();
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [lastSavedStep, setLastSavedStep] = useState(0);
    const [token, setToken] = useState(null);
    const [loadingReset, setLoadingReset] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

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

    // Restore step from localStorage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedStep = localStorage.getItem("blueprintFormStep");
        if (savedStep) {
            const stepNum = parseInt(savedStep, 10);
            if (stepNum >= 1 && stepNum <= totalSteps) {
                setStep(stepNum);
            }
        }
    }, [setStep, totalSteps]);

    // Save step to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem("blueprintFormStep", step.toString());
    }, [step]);

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
                    // Clear invalid token
                    localStorage.removeItem("token");
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
                // Clear invalid token
                localStorage.removeItem("token");
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

    const handleResetData = async () => {
        setLoadingReset(true);
        try {
            // Reset local form data
            resetForm();
            
            // Reset technical controls
            const freshTechControls = {};
            Object.keys(technicalControls).forEach(key => {
                freshTechControls[key] = { ...initialTechControlState };
            });
            setTechnicalControls(freshTechControls);

            // Reset to step 1
            setStep(1);
            setLastSavedStep(0);
            
            // Clear saved step from localStorage
            localStorage.setItem("blueprintFormStep", "1");

            // Delete data from backend
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
            await axios.post(
                `${backendUrl}/api/blueprint/save`,
                {
                    applications: {
                        productivity: [],
                        finance: [],
                        hrit: [],
                        payroll: [],
                        additional: []
                    },
                    _lastSavedStep: 0
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000
                }
            );

            toast.success("All data has been reset to default values");
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Reset error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                toast.error("Session expired. Please login again.");
                setTimeout(() => router.push("/auth"), 2000);
            } else {
                toast.error("Failed to reset data. Please try again.");
            }
        } finally {
            setLoadingReset(false);
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

            <WarningModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={handleResetData}
                title="⚠️ WARNING"
                message="This will permanently delete all your filled data and reset the form to default values. This action cannot be undone.

Are you sure you want to continue?"
                confirmText="Yes, Reset All Data"
                cancelText="Cancel"
            />

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
                            onClick={() => setShowResetModal(true)}
                            disabled={loadingReset || loadingSave}
                            className="px-4 sm:px-6 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center gap-2"
                            title="Reset all data to default values"
                        >
                            {loadingReset ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Resetting...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="hidden sm:inline">Reset Data</span>
                                    <span className="sm:hidden">Reset</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSaveOnly}
                            disabled={loadingSave || loadingReset}
                            className="px-4 sm:px-6 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-lg font-medium transition"
                        >
                            {loadingSave ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            onClick={handleSaveAndNext}
                            disabled={loadingSave || loadingReset}
                            className="px-6 sm:px-8 py-2.5 text-sm text-white bg-[#15587B] hover:bg-[#0f4460] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-bold shadow-md transition flex items-center gap-2"
                        >
                            {step === totalSteps ? "Finish & Review" : "Next Step →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
