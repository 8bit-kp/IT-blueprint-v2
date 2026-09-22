"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";
import { FiGrid, FiArrowLeft, FiArrowRight, FiRotateCcw, FiSave } from "react-icons/fi";
import ProgressBar from "@/components/ProgressBar";
import AppShell from "@/components/navigation/AppShell";
import { NuiCanvas, NuiReveal, NuiHero, NuiSection, NuiButton } from "@/components/ui/new";
import { useForm } from "@/context/FormContext";
import { useRouter } from "next/navigation";
import WarningModal from "@/components/WarningModal";
import { ASSESSMENT_STEPS } from "@/constants/assessmentSteps";

// Import step components
import Step1 from "@/components/form-fields/CompanyInfoStep";
import Step2 from "@/components/form-fields/InfrastructureStep";
import Step3 from "@/components/form-fields/NetworkServerStep";
import Step4 from "@/components/form-fields/SecurityAdminStep";
import Step5 from "@/components/form-fields/SecurityTechStep";
import Step6 from "@/components/form-fields/BusinessOperationsStep";
import Step7 from "@/components/form-fields/ApplicationsStep";

// Derived from the shared ASSESSMENT_STEPS list (also used by /profile) so
// the two stay in sync without hand-duplicating titles/icons.
const stepTitles = Object.fromEntries(ASSESSMENT_STEPS.map((s) => [s.step, s.title]));
const STEP_ICONS = ASSESSMENT_STEPS.map((s) => s.Icon);

const initialTechControlState = { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" };

// Mini progress meter shown under the step list in the sidebar.
const ProgressFooter = ({ step, totalSteps, lastSavedStep }) => {
    const pct = Math.round((step / totalSteps) * 100);
    return (
        <div>
            <div className="flex justify-between text-[10px] text-[var(--nui-text-3)] mb-1.5">
                <span className="font-semibold uppercase tracking-wider">Progress</span>
                <span className="font-bold text-[var(--nui-accent)]">{pct}%</span>
            </div>
            <div className="h-1.5 bg-[var(--nui-surface-sunk)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--nui-accent)] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            {lastSavedStep > 0 && (
                <p className="text-[10px] text-[var(--nui-text-3)] mt-1.5">Last saved at step {lastSavedStep}</p>
            )}
        </div>
    );
};

// --- MAIN PAGE ---

export default function BlueprintForm() {
    const router = useRouter();
    const totalSteps = 7;
    const { formData, updateFormData, step, setStep, resetForm } = useForm();
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [lastSavedStep, setLastSavedStep] = useState(0);
    const [loadingReset, setLoadingReset] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [stepErrors, setStepErrors] = useState({});

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

    const clearError = useCallback((fieldName) => {
        setStepErrors(prev => {
            if (!prev[fieldName]) return prev;
            const { [fieldName]: _removed, ...rest } = prev;
            return rest;
        });
    }, []);

    const validateStep1 = useCallback((data) => {
        const errors = {};
        if (!data.companyName?.trim()) {
            errors.companyName = "Please enter your organisation's name to continue.";
        }
        const email = data.email?.trim() || "";
        if (!email) {
            errors.email = "Please enter a valid business email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "This doesn't look like a valid email address. Please check and try again.";
        }
        if (!data.industry) {
            errors.industry = "Please select the industry that best describes your organisation.";
        }
        if (!data.employees) {
            errors.employees = "Please select your approximate employee count to continue.";
        }
        if (!data.deploymentModel) {
            errors.deploymentModel = "Please select your primary deployment model to continue.";
        }
        if (!data.itManagement) {
            errors.itManagement = "Please indicate how your IT environment is managed.";
        }
        if (!data.mspRelationship) {
            errors.mspRelationship = "Please indicate whether your organisation has an existing MSP relationship.";
        }
        return errors;
    }, []);

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

    // Scroll to a specific section after arriving via a Summary "Edit" link.
    // Set by blueprint-summary/page.js in sessionStorage.blueprintFormScrollTarget
    // (a DOM id inside the target step) alongside localStorage.blueprintFormStep.
    useEffect(() => {
        if (typeof window === "undefined" || loadingData) return;
        const targetId = sessionStorage.getItem("blueprintFormScrollTarget");
        if (!targetId) return;
        sessionStorage.removeItem("blueprintFormScrollTarget");
        requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }, [step, loadingData]);

    // Initial Fetch
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            notify.error("Please login first");
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
                    notify.error("Session expired. Please login again.");
                    router.push("/auth");
                } else if (err.code === 'ECONNABORTED') {
                    notify.error("Request timeout. Please try again.");
                } else {
                    notify.error("Failed to load data. Please refresh the page.");
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
            notify.success(response.data?.message || "Saved successfully");
            return true;
        } catch (err) {
            console.error("Save error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("username");
                notify.error("Session expired. Please login again.");
                setTimeout(() => router.push("/auth"), 2000);
            } else if (err.code === 'ECONNABORTED') {
                notify.error("Save timeout. Please try again.");
            } else if (err.response?.data?.message) {
                notify.error(err.response.data.message);
            } else if (err.message) {
                notify.error("Error: " + err.message);
            } else {
                notify.error("Failed to save. Please check your connection and try again.");
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
        if (step === 1) {
            const errors = validateStep1(formData);
            if (Object.keys(errors).length > 0) {
                setStepErrors(errors);
                scrollToTop();
                return;
            }
        }
        setStepErrors({});
        const success = await saveStep(step);
        if (success) {
            if (step === totalSteps) {
                router.push("/assessment-complete");
            } else {
                setStep((prev) => prev + 1);
                scrollToTop();
            }
        }
    };

    const handleStepClick = (targetStep) => {
        if (targetStep !== step) {
            setStepErrors({});
            setStep(targetStep);
            scrollToTop();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStepErrors({});
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

            notify.success("All data has been reset to default values");
            scrollToTop();
        } catch (err) {
            console.error("Reset error:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("username");
                notify.error("Session expired. Please login again.");
                setTimeout(() => router.push("/auth"), 2000);
            } else {
                notify.error("Failed to reset data. Please try again.");
            }
        } finally {
            setLoadingReset(false);
        }
    };

    if (loadingData) {
        return (
            <div className="nui relative min-h-screen">
                <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
                <div
                    role="status"
                    aria-live="polite"
                    className="relative flex min-h-screen flex-col items-center justify-center px-6"
                >
                    <span
                        aria-hidden="true"
                        className="mb-5 inline-block h-9 w-9 animate-spin rounded-full border-2 border-[var(--nui-line-strong)] border-t-[var(--nui-brand)]"
                    />
                    <p className="nui-display text-[15px] font-semibold text-[var(--nui-text)]">
                        Loading your assessment
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--nui-text-3)]">
                        Restoring your saved progress…
                    </p>
                </div>
            </div>
        );
    }

    const stepSections = Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        return {
            id: String(stepNum),
            label: stepTitles[stepNum],
            Icon: STEP_ICONS[i] || FiGrid,
            state: stepNum === step ? "active" : (stepNum < step || stepNum <= lastSavedStep) ? "done" : "todo",
        };
    });

    return (
        <AppShell
            sections={stepSections}
            navMode="action"
            activeId={String(step)}
            onSelect={(id) => handleStepClick(Number(id))}
            sidebarFooter={<ProgressFooter step={step} totalSteps={totalSteps} lastSavedStep={lastSavedStep} />}
            contentClassName="px-4 pt-8 sm:px-6 lg:px-8"
            bottomBar={
                // AppShell renders `bottomBar` as a sibling of the NuiCanvas-wrapped
                // content below, not inside it — so this needs its own `.nui` scope
                // for the design tokens used here to resolve. See docs/ui-redesign.md.
                <div className="nui px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        {step > 1 && (
                            <NuiButton variant="secondary" size="lg" onClick={handleBack} Icon={FiArrowLeft}>
                                Back
                            </NuiButton>
                        )}
                        <span className="text-xs text-[var(--nui-text-3)] hidden sm:inline-block border-l border-[var(--nui-line)] pl-4">
                            {lastSavedStep > 0 ? `Last saved at Step ${lastSavedStep}` : "Not saved yet"}
                        </span>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <NuiButton
                            variant="danger"
                            size="md"
                            onClick={() => setShowResetModal(true)}
                            disabled={loadingReset || loadingSave}
                            loading={loadingReset}
                            Icon={FiRotateCcw}
                            title="Reset all data to default values"
                        >
                            {loadingReset ? "Resetting..." : (
                                <>
                                    <span className="hidden sm:inline">Reset Data</span>
                                    <span className="sm:hidden">Reset</span>
                                </>
                            )}
                        </NuiButton>
                        <NuiButton
                            variant="secondary"
                            size="md"
                            onClick={handleSaveOnly}
                            disabled={loadingSave || loadingReset}
                            loading={loadingSave}
                        >
                            {loadingSave ? "Saving..." : (
                                <>
                                    <span className="hidden sm:inline">Save Draft</span>
                                    <span className="sm:hidden">Save</span>
                                </>
                            )}
                        </NuiButton>
                        <NuiButton
                            variant="primary"
                            size="md"
                            onClick={handleSaveAndNext}
                            disabled={loadingSave || loadingReset}
                            loading={loadingSave}
                        >
                            {step === totalSteps ? (
                                <>
                                    <span className="hidden sm:inline">Complete Assessment</span>
                                    <span className="sm:hidden">Complete</span>
                                </>
                            ) : (
                                <span className="inline-flex items-center gap-1.5">
                                    Next Step <FiArrowRight size={14} aria-hidden="true" />
                                </span>
                            )}
                        </NuiButton>
                    </div>
                </div>
            }
        >
            <NuiCanvas>
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

                {/* Same `mx-auto max-w-[1180px]` wrapper every other migrated page uses
                    (see docs/ui-redesign.md) — kept as a real block element nested
                    inside NuiCanvas rather than a direct flex child of AppShell's
                    content column, which is what a fixed page width requires: AppShell's
                    column is a `flex flex-col` container, and a flex item with
                    `mx-auto` but no explicit width shrink-to-fits its own content
                    instead of filling the column (fixed for every page at the AppShell
                    level too — see components/navigation/AppShell.jsx — but this
                    wrapper's own non-flex nesting is what actually keeps this page's
                    width identical across all 7 steps regardless of how wide any one
                    step's content happens to be). */}
                <div className="mx-auto max-w-[1180px]">
                    <NuiReveal>
                        <NuiHero
                            eyebrow="IT Blueprint · Current State Assessment"
                            title={formData.companyName || "Current State Assessment"}
                            context="Complete all 7 steps to generate your Current State Report. Save your progress at any point — Save Draft keeps your place without advancing."
                        />
                    </NuiReveal>

                    <div ref={contentRef} className="pt-8 pb-24">
                        {/* Progress bar — visible on all screen sizes */}
                        <div className="mb-6">
                            <ProgressBar
                                step={step}
                                totalSteps={totalSteps}
                                onStepClick={handleStepClick}
                            />
                        </div>

                        {/* Step heading — editorial section spine, matching the
                            /blueprint-summary design language (docs/ui-redesign.md). */}
                        <NuiSection
                            index={`0${step}`}
                            title={stepTitles[step]}
                            description={
                                step === 1
                                    ? "This information contextualises your assessment for your Consltek advisor."
                                    : "All fields on this step are optional — completing them improves your Current State Report."
                            }
                            className="mb-6"
                        />

                        {/* Active step component */}
                        <div className="animate-fade-in">
                            {step === 1 && <Step1 formData={formData} setField={setField} errors={stepErrors} clearError={clearError} />}
                            {step === 2 && <Step2 formData={formData} setField={setField} />}
                            {step === 3 && <Step3 formData={formData} setField={setField} initialTechControlState={initialTechControlState} />}
                            {step === 4 && <Step4 formData={formData} setField={setField} />}
                            {step === 5 && <Step5 technicalControls={technicalControls} setTechnicalControls={setTechnicalControls} initialTechControlState={initialTechControlState} />}
                            {step === 6 && <Step6 formData={formData} setField={setField} />}
                            {step === 7 && <Step7 formData={formData} updateFormData={updateFormData} />}
                        </div>
                    </div>
                </div>
            </NuiCanvas>
        </AppShell>
    );
}
