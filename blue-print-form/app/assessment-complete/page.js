"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiShield, FiDownload, FiMap, FiUsers, FiClock, FiFileText, FiChevronRight } from "react-icons/fi";
import EngagementTimeline from "@/components/engagement/EngagementTimeline";
import SecurityScoreCard from "@/components/report-dashboard/SecurityScoreCard";
import EmptyStateNotice from "@/components/report-dashboard/EmptyStateNotice";
import AppShell from "@/components/navigation/AppShell";
import { blueprintAPI } from "@/utils/api";
import { generateReport } from "@/lib/report/index.js";
import { useLocalStorageValue } from "@/lib/hooks/useLocalStorageValue";
import {
    NuiCanvas, NuiReveal, NuiHero, NuiSection, NuiPanel, NuiPanelHeader,
    NuiButton, NuiTag,
} from "@/components/ui/new";

const SECTIONS = [
    { id: "complete", label: "Complete", Icon: FiCheckCircle },
    { id: "security-score", label: "Security Score", Icon: FiShield },
    { id: "report-actions", label: "Report Actions", Icon: FiDownload },
    { id: "consulting-journey", label: "Consulting Journey", Icon: FiMap },
    { id: "advisor-info", label: "Advisor Info", Icon: FiUsers },
];

// A blueprint is "filled" if at least one Step 1 field is present — same
// heuristic used by /assessment-report before calling generateReport().
const hasMeaningfulBlueprint = (bp) => {
    if (!bp || typeof bp !== "object") return false;
    return !!(bp.companyName || bp.industry || bp.employees);
};

// ── Module-scope helper components ─────────────────────────────────────────
// Defined at module scope per coding-conventions.md — never inside render body.

// Advisor action bullet used in the "What your advisor does next" card.
const AdvisorAction = ({ text }) => (
    <li className="flex items-start gap-2.5 text-sm text-[var(--nui-text-2)]">
        <div className="w-5 h-5 rounded-full bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-2.5 h-2.5 text-[var(--nui-accent)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
        {text}
    </li>
);

// One of the two report-access action cards (Download / Review Summary).
const ActionCard = ({ Icon, title, description, onClick, buttonLabel, buttonVariant = "primary" }) => (
    <NuiPanel tone="flat" interactive className="h-full">
        <div className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[var(--nui-accent)]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--nui-text)] mb-0.5">{title}</p>
                <p className="text-xs text-[var(--nui-text-3)] mb-3 leading-relaxed">{description}</p>
                <NuiButton variant={buttonVariant} size="sm" Icon={FiChevronRight} onClick={onClick} className="flex-row-reverse">
                    {buttonLabel}
                </NuiButton>
            </div>
        </div>
    </NuiPanel>
);

// ── Page component ──────────────────────────────────────────────────────────

export default function AssessmentComplete() {
    const router = useRouter();
    const companyName = useLocalStorageValue("userCompanyName");
    const [report, setReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const username = localStorage.getItem("username");
        if (!username) { router.push("/auth"); return; }

        // Reuses the same generateReport() entry point as /assessment-report —
        // no score math lives here, only the fetch + render.
        blueprintAPI
            .getBlueprint()
            .then((res) => {
                const bp = res?.data?.blueprint || res?.data || {};
                if (hasMeaningfulBlueprint(bp)) setReport(generateReport(bp));
            })
            .catch(() => {
                // Non-fatal — the completion page still renders without a score.
            })
            .finally(() => setReportLoading(false));
    }, [router]);

    return (
        <AppShell
            sections={SECTIONS}
            contentClassName="px-4 pt-8 pb-24 sm:px-6 lg:px-8"
        >
            <NuiCanvas>
                <div className="mx-auto max-w-[1080px] space-y-14">

                    {/* ── Section 1: Completion hero ──────────────────────── */}
                    <NuiReveal>
                        <NuiHero
                            eyebrow="IT Blueprint · Current State Assessment"
                            title="Your Current State Assessment is Complete"
                            context={
                                companyName
                                    ? `Well done, ${companyName}. Your Current State Report has been generated and your assessment is now with Consltek.`
                                    : "Your Current State Report has been generated and your assessment is now with Consltek."
                            }
                            footer={
                                <div id="complete" className="scroll-mt-24 flex flex-wrap gap-2">
                                    <NuiTag tone="invert">✓ Assessment Received</NuiTag>
                                    <NuiTag tone="invert">✓ Current State Report Generated</NuiTag>
                                    <span className="inline-flex items-center gap-1.5 rounded-[var(--nui-r-pill)] border border-white/20 bg-white/12 px-2.5 py-[3px] text-[11px] font-medium text-[var(--nui-text-invert)]">
                                        <FiClock size={11} aria-hidden="true" /> Advisor Review Pending
                                    </span>
                                </div>
                            }
                        />
                    </NuiReveal>

                    {/* ── Section 2/3: Security Score + "View Full Report" ──
                        The visual focal point of the page — reuses the exact
                        SecurityScoreCard rendered on /assessment-report (same
                        generateReport() output, no re-derived logic). */}
                    <NuiSection
                        id="security-score"
                        index="01"
                        title="Your Security Score"
                        description="A formulaic snapshot of your Current State Assessment — not the advisor-built Assessment with Remediation Plan."
                    >
                        <NuiReveal>
                            <NuiPanel tone="raised" className="p-6">
                                {reportLoading ? (
                                    <div className="flex flex-col items-center justify-center gap-3 py-10">
                                        <span
                                            aria-hidden="true"
                                            className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--nui-line-strong)] border-t-[var(--nui-brand)]"
                                        />
                                        <p className="text-xs text-[var(--nui-text-3)]">Calculating your Security Score…</p>
                                    </div>
                                ) : report ? (
                                    <>
                                        <SecurityScoreCard report={report} />
                                        <div className="mt-6 flex justify-center">
                                            <NuiButton variant="primary" size="lg" Icon={FiChevronRight} onClick={() => router.push("/assessment-report")} className="flex-row-reverse">
                                                View Full Assessment Report
                                            </NuiButton>
                                        </div>
                                    </>
                                ) : (
                                    <EmptyStateNotice
                                        Icon={FiShield}
                                        title="Security Score not available yet"
                                        description="Your score will appear here once your Current State Assessment data is available."
                                    />
                                )}
                            </NuiPanel>
                        </NuiReveal>
                    </NuiSection>

                    {/* ── Section 4/5: Report access (unchanged actions) ──── */}
                    <NuiSection
                        id="report-actions"
                        index="02"
                        title="Access Your Current State Report"
                        description="Download the full PDF report, or review the data you submitted."
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <NuiReveal>
                                <ActionCard
                                    Icon={FiFileText}
                                    title="Download Your Report"
                                    description="Access all PDF sections of your Current State Report."
                                    onClick={() => router.push("/all-blueprints")}
                                    buttonLabel="View Report"
                                    buttonVariant="primary"
                                />
                            </NuiReveal>
                            <NuiReveal delay={60}>
                                <ActionCard
                                    Icon={FiCheckCircle}
                                    title="Review Your Assessment"
                                    description="Review the data you submitted and make any corrections."
                                    onClick={() => router.push("/blueprint-summary")}
                                    buttonLabel="View Summary"
                                    buttonVariant="secondary"
                                />
                            </NuiReveal>
                        </div>
                    </NuiSection>

                    {/* ── Section 6/7: Consulting journey + Advisor review ── */}
                    <NuiSection
                        index="03"
                        title="What Happens Next"
                        description="Where you are in the Consltek engagement, and what your advisor does before your consultation."
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Engagement timeline */}
                            <NuiReveal>
                                <NuiPanel id="consulting-journey" tone="flat" className="scroll-mt-24 h-full">
                                    <NuiPanelHeader title="Your Consulting Journey" Icon={FiMap} />
                                    <div className="p-6">
                                        <EngagementTimeline currentPhase={3} />
                                    </div>
                                </NuiPanel>
                            </NuiReveal>

                            {/* Advisor review + upcoming deliverable */}
                            <div id="advisor-info" className="scroll-mt-24 space-y-4">
                                <NuiReveal delay={60}>
                                    <NuiPanel tone="flat">
                                        <NuiPanelHeader title="What Your Advisor Does Next" Icon={FiUsers} />
                                        <div className="p-6 pt-4">
                                            <ul className="space-y-3">
                                                <AdvisorAction text="Reviews your Current State Report in detail." />
                                                <AdvisorAction text="May conduct additional research on your environment and industry context." />
                                                <AdvisorAction text="Prepares an agenda for your consultation covering the key areas of your assessment." />
                                                <AdvisorAction text="Reaches out to schedule your consultation at a time that works for your team." />
                                            </ul>
                                            <div className="mt-4 pt-3 border-t border-[var(--nui-line-soft)]">
                                                <p className="text-xs text-[var(--nui-text-3)] leading-relaxed">
                                                    <strong className="text-[var(--nui-text-2)]">Important:</strong> Recommendations and remediation plans require professional judgment and are not automatically generated. Your{" "}
                                                    <strong className="text-[var(--nui-text-2)]">Assessment with Remediation Plan</strong> — the paid engagement — is developed by your advisor based on a specific framework or standard, and delivered following your consultation.
                                                </p>
                                            </div>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>

                                {/* Upcoming deliverable card */}
                                <NuiReveal delay={90}>
                                    <NuiPanel tone="quiet" className="p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <FiFileText size={15} className="text-[var(--nui-brand)]" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--nui-brand)] mb-1">Assessment with Remediation Plan</h4>
                                                <p className="text-xs text-[var(--nui-text-2)] leading-relaxed">
                                                    Following your consultation, Consltek will propose and deliver your{" "}
                                                    <strong>Assessment with Remediation Plan</strong> — your paid engagement. This includes gap analysis, risk assessment, and a prioritised roadmap anchored to a specific standard or framework.
                                                </p>
                                            </div>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>
                            </div>
                        </div>
                    </NuiSection>
                </div>
            </NuiCanvas>
        </AppShell>
    );
}
