"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EngagementTimeline from "@/components/engagement/EngagementTimeline";

// ── Module-scope helper components ─────────────────────────────────────────
// Defined at module scope per coding-conventions.md — never inside render body.

const CheckIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChevronIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const HomeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

// Status pill rendered in the hero section.
const StatusPill = ({ icon, label, variant }) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold";
    const variants = {
        success: "bg-green-50 border-green-200 text-green-700",
        pending: "bg-amber-50 border-amber-200 text-amber-700",
    };
    return (
        <div className={`${base} ${variants[variant] || variants.success}`}>
            {icon}
            {label}
        </div>
    );
};

// Advisor action bullet used in the "What your advisor does next" card.
const AdvisorAction = ({ text }) => (
    <li className="flex items-start gap-2.5 text-sm text-gray-600">
        <div className="w-5 h-5 rounded-full bg-[#34808A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-2.5 h-2.5 text-[#34808A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
        {text}
    </li>
);

// ── Page component ──────────────────────────────────────────────────────────

export default function AssessmentComplete() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const username = localStorage.getItem("username");
        if (!username) { router.push("/auth"); return; }
        const stored = localStorage.getItem("userCompanyName");
        if (stored) setCompanyName(stored);
    }, [router]);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans">

            {/* ── Sticky top header ─────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#15587B] to-[#34808A] flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-gray-800 leading-none">Assessment Complete</h1>
                            {companyName && (
                                <p className="text-xs text-gray-400 mt-0.5">{companyName}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                        <HomeIcon />
                        Home
                    </button>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 pb-24">

                {/* ── Section 1: Completion hero ──────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#34808A] to-[#15587B]" />
                    <div className="px-8 py-10 flex flex-col items-center text-center">
                        {/* Checkmark circle */}
                        <div className="w-16 h-16 rounded-full bg-[#34808A]/10 flex items-center justify-center mb-5 flex-shrink-0">
                            <svg className="w-8 h-8 text-[#34808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#15587B] mb-2">
                            Your Current State Assessment is Complete
                        </h2>
                        <p className="text-sm text-gray-500 max-w-lg mb-7 leading-relaxed">
                            {companyName
                                ? `Well done, ${companyName}. Your Current State Report has been generated and your assessment is now with Consltek.`
                                : "Your Current State Report has been generated and your assessment is now with Consltek."
                            }
                        </p>
                        {/* Status pills */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <StatusPill variant="success" icon={<CheckIcon />} label="Assessment Received" />
                            <StatusPill variant="success" icon={<CheckIcon />} label="Current State Report Generated" />
                            <StatusPill variant="pending" icon={<ClockIcon />} label="Advisor Review Pending" />
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Consulting journey + Advisor review ──── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Engagement timeline */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                            <h3 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">Your Consulting Journey</h3>
                        </div>
                        <EngagementTimeline currentPhase={3} />
                    </div>

                    {/* Advisor review + upcoming deliverable */}
                    <div className="space-y-4">
                        {/* What advisor does next */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-5 w-1 bg-[#34808A] rounded-full" />
                                <h3 className="text-sm font-bold text-[#15587B] uppercase tracking-wide">What Your Advisor Does Next</h3>
                            </div>
                            <ul className="space-y-3">
                                <AdvisorAction text="Reviews your Current State Report in detail." />
                                <AdvisorAction text="May conduct additional research on your environment and industry context." />
                                <AdvisorAction text="Prepares an agenda for your consultation covering the key areas of your assessment." />
                                <AdvisorAction text="Reaches out to schedule your consultation at a time that works for your team." />
                            </ul>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    <strong className="text-gray-600">Important:</strong> Recommendations and remediation plans require professional judgment and are not automatically generated. Your{" "}
                                    <strong className="text-gray-600">Assessment with Remediation Plan</strong> — the paid engagement — is developed by your advisor based on a specific framework or standard, and delivered following your consultation.
                                </p>
                            </div>
                        </div>

                        {/* Upcoming deliverable card */}
                        <div className="bg-[#15587B]/5 border border-[#15587B]/15 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#15587B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-[#15587B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#15587B] mb-1">Assessment with Remediation Plan</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Following your consultation, Consltek will propose and deliver your{" "}
                                        <strong>Assessment with Remediation Plan</strong> — your paid engagement. This includes gap analysis, risk assessment, and a prioritised roadmap anchored to a specific standard or framework.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section 3: Report access ─────────────────────────── */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                        Access Your Current State Report
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Report downloads */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-[#34808A]/40 transition">
                            <div className="w-10 h-10 rounded-lg bg-[#34808A]/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#34808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 mb-0.5">Download Your Report</p>
                                <p className="text-xs text-gray-400 mb-3">Access all PDF sections of your Current State Report.</p>
                                <button
                                    type="button"
                                    onClick={() => router.push("/all-blueprints")}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#15587B] hover:bg-[#0f4460] rounded-lg shadow-sm transition"
                                >
                                    View Report
                                    <ChevronIcon />
                                </button>
                            </div>
                        </div>

                        {/* Summary review */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-[#34808A]/40 transition">
                            <div className="w-10 h-10 rounded-lg bg-[#15587B]/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#15587B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 mb-0.5">Review Your Assessment</p>
                                <p className="text-xs text-gray-400 mb-3">Review the data you submitted and make any corrections.</p>
                                <button
                                    type="button"
                                    onClick={() => router.push("/blueprint-summary")}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#15587B] bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    View Summary
                                    <ChevronIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
