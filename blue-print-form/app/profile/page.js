"use client";

/**
 * app/profile/page.js
 *
 * Reached by clicking the username/company avatar in AppSidebar. Shows the
 * account's identity (company, username, email) and Current State
 * Assessment progress (not started / in progress / complete, with a
 * per-step breakdown) — "what has this user done so far."
 *
 * Sources data from the same two places every other page already uses:
 * localStorage for identity (via the hydration-safe useLocalStorageValue
 * hook) and blueprintAPI.getBlueprint() for assessment progress. No new
 * API route, no new business logic — this is a presentation page over
 * data that already exists.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiUser, FiCalendar, FiCheck, FiEdit3, FiArrowRight,
    FiFileText, FiGrid, FiShield, FiClipboard,
} from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";
import AppShell from "@/components/navigation/AppShell";
import { ASSESSMENT_STEPS, TOTAL_ASSESSMENT_STEPS } from "@/constants/assessmentSteps";
import { useLocalStorageValue } from "@/lib/hooks/useLocalStorageValue";
import {
    NuiCanvas, NuiReveal, NuiHero, NuiSection, NuiPanel, NuiPanelHeader,
    NuiButton, NuiMeter, NuiTag, NuiKeyValue, NuiKeyValueList,
} from "@/components/ui/new";

// A blueprint is "filled" if at least one Step 1 field is present — same
// heuristic used by /assessment-report and /assessment-complete.
const hasMeaningfulBlueprint = (bp) => {
    if (!bp || typeof bp !== "object") return false;
    return !!(bp.companyName || bp.industry || bp.employees);
};

const formatDate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

// One row per assessment step, checkmark once past lastSavedStep.
const StepRow = ({ step, title, Icon, state }) => {
    const isDone = state === "done";
    const isCurrent = state === "current";
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-[var(--nui-line-soft)] last:border-0">
            <span
                className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    isDone ? "bg-[var(--nui-accent)] text-white" : isCurrent ? "bg-[var(--nui-brand)] text-white" : "bg-[var(--nui-surface-sunk)] text-[var(--nui-text-3)]",
                ].join(" ")}
            >
                {isDone ? <FiCheck size={12} strokeWidth={3} /> : <Icon size={12} />}
            </span>
            <span className={`text-sm ${isCurrent ? "font-semibold text-[var(--nui-text)]" : isDone ? "text-[var(--nui-text-2)]" : "text-[var(--nui-text-3)]"}`}>
                Step {step} — {title}
            </span>
            {isCurrent && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-[var(--nui-brand)] bg-[var(--nui-accent-tint)] px-2 py-0.5 rounded-full">
                    In Progress
                </span>
            )}
        </div>
    );
};

// One of the three report quick-link tiles, shown once the assessment is complete.
const ReportLink = ({ Icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2.5 px-4 py-3 rounded-[var(--nui-r-sm)] border border-[var(--nui-line)] hover:border-[color:var(--nui-accent-tint-2)] hover:bg-[var(--nui-surface-sunk)] transition-colors duration-[var(--nui-dur-fast)] text-left"
    >
        <Icon size={16} className="text-[var(--nui-accent)] flex-shrink-0" />
        <span className="text-xs font-semibold text-[var(--nui-text-2)]">{label}</span>
    </button>
);

export default function Profile() {
    const router = useRouter();
    const username = useLocalStorageValue("username");
    const companyName = useLocalStorageValue("userCompanyName");
    const email = useLocalStorageValue("userEmail");
    const createdAt = useLocalStorageValue("userCreatedAt");

    const [lastSavedStep, setLastSavedStep] = useState(0);
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) { router.push("/auth"); return; }

        blueprintAPI
            .getBlueprint()
            .then((res) => {
                const bp = res?.data?.blueprint || res?.data || {};
                setStarted(hasMeaningfulBlueprint(bp));
                setLastSavedStep(typeof bp._lastSavedStep === "number" ? bp._lastSavedStep : 0);
            })
            .catch(() => {
                notify.error("Unable to load your assessment progress", {
                    description: "Please refresh the page to try again.",
                });
            })
            .finally(() => setLoading(false));
    }, [router]);

    const isComplete = lastSavedStep >= TOTAL_ASSESSMENT_STEPS;
    const status = isComplete ? "complete" : (started || lastSavedStep > 0) ? "in-progress" : "not-started";

    const STATUS_CONFIG = {
        "not-started": { label: "Not Started", tone: "invert" },
        "in-progress": { label: `In Progress — Step ${lastSavedStep} of ${TOTAL_ASSESSMENT_STEPS}`, tone: "invert" },
        "complete": { label: "Complete", tone: "invert" },
    };
    const statusCfg = STATUS_CONFIG[status];
    const progressPct = Math.round((Math.min(lastSavedStep, TOTAL_ASSESSMENT_STEPS) / TOTAL_ASSESSMENT_STEPS) * 100);

    const memberSince = formatDate(createdAt);
    const displayName = companyName || username;

    const ctaLabel = status === "not-started" ? "Start Assessment" : status === "in-progress" ? "Continue Assessment" : "Edit Assessment";

    return (
        <AppShell contentClassName="px-4 pt-8 pb-24 sm:px-6 lg:px-8">
            <NuiCanvas>
                <div className="mx-auto max-w-[900px] space-y-14">

                    {/* ── Welcome / identity hero ─────────────────────────── */}
                    <NuiReveal>
                        <NuiHero
                            eyebrow="IT Blueprint · My Account"
                            title={displayName || "Your Account"}
                            context={
                                companyName && username
                                    ? `@${username}`
                                    : "Your account overview and Current State Assessment progress."
                            }
                            tags={[
                                email && { label: "Email", value: email },
                                memberSince && { label: "Member since", value: memberSince },
                            ].filter(Boolean)}
                            footer={
                                <div className="flex flex-wrap items-center gap-2">
                                    <NuiTag tone="invert">{statusCfg.label}</NuiTag>
                                </div>
                            }
                        />
                    </NuiReveal>

                    {/* ── Assessment progress ─────────────────────────────── */}
                    <NuiSection
                        index="01"
                        title="Current State Assessment"
                        description="Your progress through the 7-step assessment, and the action that moves it forward."
                    >
                        <NuiReveal>
                            <NuiPanel tone="flat">
                                <NuiPanelHeader
                                    title="Assessment Progress"
                                    Icon={FiClipboard}
                                    meta={loading ? undefined : `${Math.min(lastSavedStep, TOTAL_ASSESSMENT_STEPS)} of ${TOTAL_ASSESSMENT_STEPS} steps saved`}
                                />

                                {loading ? (
                                    <div className="py-10 flex items-center justify-center">
                                        <span
                                            aria-hidden="true"
                                            className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-[var(--nui-line-strong)] border-t-[var(--nui-brand)]"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-6 pt-4">
                                        <NuiMeter value={progressPct} total={100} label="Overall completion" tone="brand" showCount={false} />
                                        <p className="nui-num mt-1 text-right text-[11px] font-semibold text-[var(--nui-text-2)]">{progressPct}%</p>

                                        <div className="mt-4">
                                            {ASSESSMENT_STEPS.map(({ step, title, Icon }) => (
                                                <StepRow
                                                    key={step}
                                                    step={step}
                                                    title={title}
                                                    Icon={Icon}
                                                    state={step <= lastSavedStep ? "done" : step === lastSavedStep + 1 ? "current" : "todo"}
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <NuiButton variant="primary" size="lg" Icon={FiEdit3} onClick={() => router.push("/blueprint-form")}>
                                                {ctaLabel}
                                            </NuiButton>
                                            {isComplete && (
                                                <NuiButton variant="secondary" size="lg" Icon={FiArrowRight} onClick={() => router.push("/blueprint-summary")} className="flex-row-reverse">
                                                    View Summary
                                                </NuiButton>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </NuiPanel>
                        </NuiReveal>
                    </NuiSection>

                    {/* ── Quick links (once there's something to show) ────── */}
                    {!loading && isComplete && (
                        <NuiSection index="02" title="Your Reports" description="Jump straight to the deliverables generated from your completed assessment.">
                            <NuiReveal>
                                <NuiPanel tone="flat" className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <ReportLink Icon={FiFileText} label="Current State Report" onClick={() => router.push("/all-blueprints")} />
                                        <ReportLink Icon={FiShield} label="Security Score" onClick={() => router.push("/assessment-report")} />
                                        <ReportLink Icon={FiGrid} label="Dashboards" onClick={() => router.push("/blueprint-dashboard?type=Current-State-Blueprint")} />
                                    </div>
                                </NuiPanel>
                            </NuiReveal>
                        </NuiSection>
                    )}

                    {/* ── Account details ─────────────────────────────────── */}
                    <NuiSection index={isComplete ? "03" : "02"} title="Account Details" description="Identity information tied to this account.">
                        <NuiReveal>
                            <NuiPanel tone="flat">
                                <NuiPanelHeader title="Account" Icon={FiUser} />
                                <div className="px-6 pb-2 pt-1">
                                    <NuiKeyValueList>
                                        <NuiKeyValue label="Username" value={username} />
                                        <NuiKeyValue label="Company" value={companyName} optional />
                                        <NuiKeyValue label="Email" value={email} />
                                        {memberSince && <NuiKeyValue label="Member Since" value={memberSince} optional />}
                                    </NuiKeyValueList>
                                </div>
                                <div className="px-6 pb-5 pt-3 border-t border-[var(--nui-line-soft)] mt-2">
                                    <p className="text-[11px] text-[var(--nui-text-3)] flex items-center gap-1.5">
                                        <FiCalendar size={11} className="flex-shrink-0" aria-hidden="true" />
                                        Your data is encrypted in transit and never sold — see the Privacy Policy for details.
                                    </p>
                                </div>
                            </NuiPanel>
                        </NuiReveal>
                    </NuiSection>
                </div>
            </NuiCanvas>
        </AppShell>
    );
}
