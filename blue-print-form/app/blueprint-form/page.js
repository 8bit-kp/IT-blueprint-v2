"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { blueprintAPI } from "@/utils/api";
import toast from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar";
import FormSidebarNav from "@/components/navigation/FormSidebarNav";
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
    const [loadingReset, setLoadingReset] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    // Ref for the scrollable main-content column so step navigation can
    // scroll it back to the top (instead of relying on window.scrollTo which
    // does not work when only the inner div is scrolling).
    const contentRef = useRef(null);

    const [technicalControls, setTechnicalControls] = useState({
        nextGenFirewall: { ...initialTechControlState },
        secureWebGateway: { ...initialTechControlState },
        casb: { ...initialTechControlState },
        dlp: { ...initialTechControlState },
        sslVpn: { ...initialTechControlState },
        emailSecurity: { ...initialTechControlState },
        vulnerabilityScanning: { ...initialTechControlState },
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

    // Persist step to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem("blueprintFormStep", step.toString());
    }, [step]);

    // Initial Fetch
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            toast.error("Please login first");
            router.push("/auth");
            return;
        }

        const fetchBlueprint = async () => {
            setLoadingData(true);

            try {
                const res = await blueprintAPI.getBlueprint();
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

                    if (!Array.isArray(data.customCategories)) {
                        data.customCategories = [];
                    }

                    // Pre-fill company info from account registration data if the
                    // blueprint fields are still empty (new user who hasn't filled
                    // Step 1 yet). Account data was stored at login time.
                    if (!data.email) {
                        const accountEmail = localStorage.getItem("userEmail");
                        if (accountEmail) data.email = accountEmail;
                    }
                    if (!data.companyName) {
                        const accountCompanyName = localStorage.getItem("userCompanyName");
                        if (accountCompanyName) data.companyName = accountCompanyName;
                    }

                    updateFormData(data);
                    setLastSavedStep(data._lastSavedStep || 0);
                } else {
                    // New user — no saved blueprint yet. Pre-fill from account data.
                    const accountEmail = localStorage.getItem("userEmail");
                    const accountCompanyName = localStorage.getItem("userCompanyName");
                    if (accountEmail || accountCompanyName) {
                        updateFormData((prev) => ({
                            ...prev,
                            ...(accountEmail ? { email: accountEmail } : {}),
                            ...(accountCompanyName ? { companyName: accountCompanyName } : {}),
                        }));
                    }
                }
            } catch (err) {
                console.error("fetch blueprint err", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("username");
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
                customCategories: Array.isArray(formData.customCategories) ? formData.customCategories : [],
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

            const response = await blueprintAPI.saveBlueprint(normalizedData);

            setLastSavedStep(currentStep);
            toast.success(response.data?.message || "Saved successfully");
            return true;
        } catch (err) {
            console.error("Save error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("username");
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

    const scrollToTop = () => {
        // Scroll the inner content column (desktop) and the window (mobile)
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                scrollToTop();
            }
        }
    };

    const handleStepClick = (targetStep) => {
        if (targetStep !== step) {
            setStep(targetStep);
            scrollToTop();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            scrollToTop();
        }
    };

    const handleResetData = async () => {
        setLoadingReset(true);
        try {
            resetForm();

            const freshTechControls = {};
            Object.keys(technicalControls).forEach(key => {
                freshTechControls[key] = { ...initialTechControlState };
            });
            setTechnicalControls(freshTechControls);

            setStep(1);
            setLastSavedStep(0);
            localStorage.setItem("blueprintFormStep", "1");

            await blueprintAPI.saveBlueprint({
                applications: {
                    productivity: [],
                    finance: [],
                    hrit: [],
                    payroll: [],
                    additional: []
                },
                customCategories: [],
                _lastSavedStep: 0
            });

            toast.success("All data has been reset to default values");
            scrollToTop();
        } catch (err) {
            console.error("Reset error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("username");
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
        <div className="min-h-screen bg-[#F3F4F6] font-sans">

            {/* ── Top Header (sticky) ──────────────────────────────────────── */}
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

            {/* ── Body: Sidebar + Content ──────────────────────────────────── */}
            <div className="flex">

                {/* Sidebar — desktop only, sticky below header */}
                <FormSidebarNav
                    step={step}
                    totalSteps={totalSteps}
                    lastSavedStep={lastSavedStep}
                    stepTitles={stepTitles}
                    onStepClick={handleStepClick}
                />

                {/* Main content column — no outer max-width; each step Card owns its own */}
                <div ref={contentRef} className="flex-1 min-w-0 pb-24">
                    <div className="px-4 py-6">

                        {/* Progress bar — visible on all screen sizes */}
                        <div className="max-w-5xl mx-auto mb-6">
                            <ProgressBar
                                step={step}
                                totalSteps={totalSteps}
                                onStepClick={handleStepClick}
                            />
                        </div>

                        {/* Step heading — same max-width as all step cards */}
                        <div className="flex justify-between items-end mb-6 max-w-5xl mx-auto px-0">
                            <div>
                                <h2 className="text-2xl font-bold text-[#15587B]">{stepTitles[step]}</h2>
                                <p className="text-sm text-gray-500">Please fill in the details below.</p>
                            </div>
                        </div>

                        {/* Active step component */}
                        <div className="animate-fade-in">
                            {step === 1 && <Step1 formData={formData} setField={setField} />}
                            {step === 2 && <Step2 formData={formData} setField={setField} />}
                            {step === 3 && <Step3 formData={formData} setField={setField} initialTechControlState={initialTechControlState} />}
                            {step === 4 && <Step4 formData={formData} setField={setField} />}
                            {step === 5 && <Step5 technicalControls={technicalControls} setTechnicalControls={setTechnicalControls} initialTechControlState={initialTechControlState} />}
                            {step === 6 && <Step6 formData={formData} updateFormData={updateFormData} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Fixed Bottom Action Bar ──────────────────────────────────── */}
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
