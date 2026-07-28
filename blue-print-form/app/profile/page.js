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
    FiUser, FiMail, FiCalendar, FiCheck, FiEdit3, FiArrowRight,
    FiFileText, FiGrid, FiShield,
} from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";
import AppShell from "@/components/navigation/AppShell";
import InfoTile from "@/components/report-dashboard/InfoTile";
import { ASSESSMENT_STEPS, TOTAL_ASSESSMENT_STEPS } from "@/constants/assessmentSteps";
import { useLocalStorageValue } from "@/lib/hooks/useLocalStorageValue";

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
        <div className="flex items-center gap-3 py-2">
            <span
                className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    isDone ? "bg-[#34808A] text-white" : isCurrent ? "bg-[#15587B] text-white" : "bg-gray-100 text-gray-400",
                ].join(" ")}
            >
                {isDone ? <FiCheck size={12} strokeWidth={3} /> : <Icon size={12} />}
            </span>
            <span className={`text-sm ${isCurrent ? "font-semibold text-gray-800" : isDone ? "text-gray-600" : "text-gray-400"}`}>
                Step {step} — {title}
            </span>
            {isCurrent && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#15587B] bg-[#15587B]/8 px-2 py-0.5 rounded-full">
                    In Progress
                </span>
            )}
        </div>
    );
};

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
        "not-started": { label: "Not Started", badge: "bg-gray-100 text-gray-500" },
        "in-progress": { label: `In Progress — Step ${lastSavedStep} of ${TOTAL_ASSESSMENT_STEPS}`, badge: "bg-amber-100 text-amber-700" },
        "complete": { label: "Complete", badge: "bg-green-100 text-green-700" },
    };
    const statusCfg = STATUS_CONFIG[status];
    const progressPct = Math.round((Math.min(lastSavedStep, TOTAL_ASSESSMENT_STEPS) / TOTAL_ASSESSMENT_STEPS) * 100);

    const memberSince = formatDate(createdAt);
    const displayName = companyName || username;

    return (
        <AppShell title="My Account" subtitle={displayName} contentClassName="max-w-3xl mx-auto px-6 pb-10 space-y-6">

            {/* ── Identity hero ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#34808A] to-[#15587B]" />
                <div className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#15587B] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                        {displayName?.[0]?.toUpperCase() || <FiUser size={24} />}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-bold text-gray-800 truncate">{displayName || "Your Account"}</h1>
                        {companyName && username && (
                            <p className="text-sm text-gray-400 truncate">@{username}</p>
                        )}
                        {email && (
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                <FiMail size={13} className="flex-shrink-0" /> {email}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Assessment progress ───────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Current State Assessment</h2>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full flex-shrink-0 ${statusCfg.badge}`}>
                        {statusCfg.label}
                    </span>
                </div>

                {loading ? (
                    <div className="py-6 flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-[#34808A] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-[#34808A] rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>

                        <div className="divide-y divide-gray-50 mb-5">
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

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/blueprint-form")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#15587B] hover:bg-[#0f4460] rounded-xl shadow-sm transition"
                            >
                                <FiEdit3 size={14} />
                                {status === "not-started" ? "Start Assessment" : status === "in-progress" ? "Continue Assessment" : "Edit Assessment"}
                            </button>
                            {isComplete && (
                                <button
                                    type="button"
                                    onClick={() => router.push("/blueprint-summary")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#15587B] bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                                >
                                    View Summary
                                    <FiArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── Quick links (once there's something to show) ─────────── */}
            {!loading && isComplete && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                        <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Your Reports</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/all-blueprints")}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#34808A]/40 hover:bg-gray-50 transition text-left"
                        >
                            <FiFileText size={16} className="text-[#34808A] flex-shrink-0" />
                            <span className="text-xs font-semibold text-gray-700">Current State Report</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/assessment-report")}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#34808A]/40 hover:bg-gray-50 transition text-left"
                        >
                            <FiShield size={16} className="text-[#34808A] flex-shrink-0" />
                            <span className="text-xs font-semibold text-gray-700">Security Score</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/blueprint-dashboard?type=Current-State-Blueprint")}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#34808A]/40 hover:bg-gray-50 transition text-left"
                        >
                            <FiGrid size={16} className="text-[#34808A] flex-shrink-0" />
                            <span className="text-xs font-semibold text-gray-700">Dashboards</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── Account details ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                    <h2 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Account Details</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoTile label="Username" value={username} />
                    <InfoTile label="Company" value={companyName} />
                    <InfoTile label="Email" value={email} />
                    {memberSince && (
                        <InfoTile label="Member Since" value={memberSince} />
                    )}
                </div>
                <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5">
                    <FiCalendar size={11} className="flex-shrink-0" />
                    Your data is encrypted in transit and never sold — see the Privacy Policy for details.
                </p>
            </div>
        </AppShell>
    );
}
