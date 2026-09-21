"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBarChart2, FiGrid, FiLayers, FiDownloadCloud } from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BlueprintDocument from "@/components/coverpages/BlueprintDocument";
import SecurityDocument from "@/components/coverpages/SecurityDocument";
import FinancialDocument from "@/components/coverpages/FinancialDocument";
import OperationalDocument from "@/components/coverpages/OperationalDocument";
import AdministrationDocument from "@/components/coverpages/AdministrationDocument";
import CompleteDocument from "@/components/coverpages/CompleteDocument";
import SecurityDonutGrid from "@/components/dashboard-visuals/SecurityDonutGrid";
import ApplicationDonutGrid from "@/components/dashboard-visuals/ApplicationDonutGrid";
import AdvisorHandoffBanner from "@/components/engagement/AdvisorHandoffBanner";
import StatusCard from "@/components/engagement/StatusCard";
import AppShell from "@/components/navigation/AppShell";
import { NuiCanvas, NuiReveal, NuiHero, NuiSection } from "@/components/ui/new";

const REPORT_SECTIONS = [
    { id: "security-visuals", label: "Security Visuals", Icon: FiBarChart2 },
    { id: "application-visuals", label: "App Visuals", Icon: FiGrid },
    { id: "report-sections", label: "Report Sections", Icon: FiLayers },
    { id: "download-all", label: "Download All", Icon: FiDownloadCloud },
];

// ── Icons ──────────────────────────────────────────────────────────────────

const IconCurrentState = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const IconSecurity = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);
const IconFinancial = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconOperational = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
);
const IconAdmin = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const IconDashboard = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const IconDownload = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const IconChevron = ({ collapsed }) => (
    <svg
        className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "-rotate-90" : "rotate-0"}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);

// ── Blueprint Card ─────────────────────────────────────────────────────────

const BlueprintCard = ({
    title,
    description,
    icon,
    documentComponent,
    formData,
    fileName,
    downloadName,  // human-readable PDF filename (decoupled from routing key)
    tag,
    accentColor,   // { bar: "#hex", barTo: "#hex", icon: "rgba(...)", text: "#hex" }
    reportStatus = "ready",  // "ready" | "pending" | "in_progress" — future-ready
}) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const bar     = accentColor?.bar    || "#15587B";
    const barTo   = accentColor?.barTo  || "#34808A";
    const iconBg  = accentColor?.icon   || "rgba(21,88,123,0.09)";
    const iconTxt = accentColor?.text   || "#15587B";

    return (
        <div className="group bg-[var(--nui-surface)] rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] hover:shadow-[var(--nui-shadow-3)] hover:-translate-y-0.5 transition-all duration-[var(--nui-dur)] overflow-hidden flex flex-col">
            {/* Accent top bar — unique per document type, intentionally not a
                brand-teal token (see docs/ui-redesign.md — fixed per-type colour
                coding, same rule as score-zone palettes). */}
            <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(to right, ${bar}, ${barTo})` }}
            />

            <div className="flex flex-col flex-1 p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                        {/* Icon badge */}
                        <div
                            className="flex-shrink-0 w-10 h-10 rounded-[var(--nui-r-sm)] flex items-center justify-center shadow-[var(--nui-shadow-1)]"
                            style={{ backgroundColor: iconBg, color: iconTxt }}
                        >
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--nui-text)] leading-tight">{title}</h3>
                            <p className="text-xs text-[var(--nui-text-3)] mt-0.5 leading-snug">{description}</p>
                        </div>
                    </div>
                    {tag && (
                        <span
                            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{ color: bar, backgroundColor: iconBg }}
                        >
                            {tag}
                        </span>
                    )}
                </div>

                {/* Divider + status */}
                <div className="border-t border-[var(--nui-line-soft)] pt-3 mb-3 flex items-center justify-between">
                    <StatusCard
                        status={reportStatus}
                        label={
                            reportStatus === "ready"       ? "Report Ready" :
                            reportStatus === "pending"     ? "Advisor Review Pending" :
                            reportStatus === "in_progress" ? "In Progress" :
                                                              "Report Ready"
                        }
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                        {/* View Dashboard */}
                        <button
                            onClick={() => window.open(`/blueprint-dashboard?type=${fileName}`, "_blank")}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-[var(--nui-r-sm)] transition-all duration-150"
                            style={{
                                color: bar,
                                backgroundColor: "var(--nui-surface-sunk)",
                                borderColor: "var(--nui-line)",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = iconBg; e.currentTarget.style.borderColor = bar + "55"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--nui-surface-sunk)"; e.currentTarget.style.borderColor = "var(--nui-line)"; }}
                        >
                            <IconDashboard />
                            View Dashboard
                        </button>

                        {/* Download PDF */}
                        {isClient && (
                            <PDFDownloadLink
                                document={documentComponent}
                                fileName={`${downloadName || fileName}-${(formData.companyName || "Company").replace(/\s+/g, "_")}.pdf`}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-[var(--nui-r-sm)] transition-all duration-150 shadow-[var(--nui-shadow-1)]"
                                style={{ backgroundColor: bar }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                            >
                                {({ loading }) => (
                                    <>
                                        <IconDownload />
                                        <span>{loading ? "Preparing…" : "Download PDF"}</span>
                                    </>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Page ───────────────────────────────────────────────────────────────────

const AllBlueprintsPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [visualsCollapsed, setVisualsCollapsed] = useState(true);
    const [appsCollapsed, setAppsCollapsed] = useState(true);

    useEffect(() => { setIsClient(true); }, []);

    useEffect(() => {
        const fetchBlueprint = async () => {
            // Auth guard: username in localStorage is the client-side login indicator.
            // Real auth is enforced server-side via the HTTP-only cookie.
            const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
            if (!username) { router.push("/auth"); return; }
            try {
                setLoading(true);
                // blueprintAPI uses withCredentials — cookie is sent automatically.
                const res = await blueprintAPI.getBlueprint();
                if (res.data && Object.keys(res.data).length > 0) {
                    setFormData(res.data);
                } else {
                    notify.warning("Complete your assessment first", {
                        description: "Your Current State Report is available once your Current State Assessment has data to show.",
                    });
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching blueprint:", err);
                notify.error("Unable to load your report", {
                    description: "Please try again, or complete your Current State Assessment if you haven't yet.",
                });
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlueprint();
    }, [router]);

    // ── Loading state ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="nui relative min-h-screen">
            <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
            <div role="status" aria-live="polite" className="relative flex min-h-screen flex-col items-center justify-center px-6">
                <span aria-hidden="true" className="mb-5 inline-block h-9 w-9 animate-spin rounded-full border-2 border-[var(--nui-line-strong)] border-t-[var(--nui-brand)]" />
                <p className="nui-display text-[15px] font-semibold text-[var(--nui-text)]">Loading your report</p>
                <p className="mt-1 text-[13px] text-[var(--nui-text-3)]">Assembling your Current State Report…</p>
            </div>
        </div>
    );

    if (error || !formData) return (
        <div className="nui relative min-h-screen">
            <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
            <div className="relative flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm font-semibold text-[var(--nui-text)]">No assessment data found.</p>
                <button onClick={() => router.push("/blueprint-form")}
                    className="text-xs text-[var(--nui-accent)] underline underline-offset-2 hover:text-[var(--nui-brand)]">
                    Return to Assessment
                </button>
            </div>
        </div>
    );

    // ── Blueprint definitions ──────────────────────────────────────────────
    const blueprints = [
        {
            title: "Current State Report",
            description: "Complete inventory of current IT infrastructure & environment",
            tag: "Overview",
            icon: <IconCurrentState />,
            documentComponent: <BlueprintDocument companyName={formData.companyName || "—"} preparedDate={new Date()} currentStateData={formData} />,
            fileName: "Current-State-Blueprint",
            downloadName: "Current-State-Report",
            accentColor: { bar: "#15587B", barTo: "#34808A", icon: "rgba(21,88,123,0.09)", text: "#15587B" },
        },
        {
            title: "Security Controls Summary",
            description: "Inventory of current security controls, technical defenses & policies",
            tag: "Security",
            icon: <IconSecurity />,
            documentComponent: <SecurityDocument companyName={formData.companyName || "—"} preparedDate={new Date()} securityData={formData} />,
            fileName: "Security-Blueprint",
            downloadName: "Security-Controls-Summary",
            accentColor: { bar: "#b91c1c", barTo: "#ef4444", icon: "rgba(185,28,28,0.08)", text: "#b91c1c" },
        },
        {
            title: "Financial Applications Summary",
            description: "Inventory of current financial applications & business-critical systems",
            tag: "Finance",
            icon: <IconFinancial />,
            documentComponent: <FinancialDocument companyName={formData.companyName || "—"} preparedDate={new Date()} financialData={formData} />,
            fileName: "Financial-Blueprint",
            downloadName: "Financial-Applications-Summary",
            accentColor: { bar: "#047857", barTo: "#10b981", icon: "rgba(4,120,87,0.08)", text: "#047857" },
        },
        {
            title: "Infrastructure & Operations Summary",
            description: "Inventory of current network infrastructure, servers & operations",
            tag: "Operations",
            icon: <IconOperational />,
            documentComponent: <OperationalDocument companyName={formData.companyName || "—"} preparedDate={new Date()} operationalData={formData} />,
            fileName: "Operational-Blueprint",
            downloadName: "Infrastructure-Operations-Summary",
            accentColor: { bar: "#6d28d9", barTo: "#a78bfa", icon: "rgba(109,40,217,0.08)", text: "#6d28d9" },
        },
        {
            title: "Governance & Controls Summary",
            description: "Inventory of current governance policies & administrative controls",
            tag: "Governance",
            icon: <IconAdmin />,
            documentComponent: <AdministrationDocument companyName={formData.companyName || "—"} preparedDate={new Date()} administrationData={formData} />,
            fileName: "Administration-Blueprint",
            downloadName: "Governance-Controls-Summary",
            accentColor: { bar: "#b45309", barTo: "#f59e0b", icon: "rgba(180,83,9,0.08)", text: "#b45309" },
        },
    ];

    return (
        <AppShell
            sections={REPORT_SECTIONS}
            contentClassName="px-4 pt-8 pb-24 sm:px-6 lg:px-8"
        >
            <NuiCanvas>
                <div className="mx-auto max-w-[1180px] space-y-14">

                    {/* ── Hero ──────────────────────────────────────────── */}
                    <NuiReveal>
                        <NuiHero
                            eyebrow="IT Blueprint · Current State Report"
                            title={formData.companyName || "Current State Report"}
                            context="Every report section generated from your Current State Assessment, ready to view as a live dashboard or download as a branded PDF."
                        />
                    </NuiReveal>

                    {/* ── SECURITY VISUALS SECTION ─────────────────────────── */}
                    <NuiReveal>
                        <div id="security-visuals" className="scroll-mt-24 bg-[var(--nui-surface)] rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] overflow-hidden">
                            {/* Collapsible header */}
                            <button
                                onClick={() => setVisualsCollapsed(v => !v)}
                                aria-expanded={!visualsCollapsed}
                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--nui-surface-sunk)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:-outline-offset-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-[var(--nui-r-xs)] bg-[var(--nui-brand)] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--nui-text)]">Security Data Visualisation</p>
                                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">
                                            Live status of all security controls · Green = Yes · Red = No · Grey = Not configured
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Legend pills — visible when collapsed */}
                                    {visualsCollapsed && (
                                        <div className="hidden sm:flex items-center gap-2">
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-ok)] inline-block" /> Yes
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-risk)] inline-block" /> No
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-idle)] inline-block" /> N/A
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-[var(--nui-text-3)]">
                                        <IconChevron collapsed={visualsCollapsed} />
                                    </span>
                                </div>
                            </button>

                            {/* Content */}
                            {!visualsCollapsed && (
                                <>
                                    <div className="h-px bg-[var(--nui-line-soft)]" />
                                    {/* Legend bar */}
                                    <div className="px-6 py-2.5 bg-[var(--nui-surface-sunk)] border-b border-[var(--nui-line-soft)] flex items-center gap-5 text-[11px] font-medium text-[var(--nui-text-2)]">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-ok)] inline-block" />
                                            Yes — Implemented
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-risk)] inline-block" />
                                            No — Not Implemented
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-idle)] inline-block" />
                                            Not Configured
                                        </span>
                                    </div>
                                    <div className="px-6 py-6">
                                        <SecurityDonutGrid formData={formData} />
                                    </div>
                                </>
                            )}
                        </div>
                    </NuiReveal>

                    {/* ── APPLICATION VISUALS SECTION ──────────────────────── */}
                    <NuiReveal delay={60}>
                        <div id="application-visuals" className="scroll-mt-24 bg-[var(--nui-surface)] rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] overflow-hidden">
                            {/* Collapsible header */}
                            <button
                                onClick={() => setAppsCollapsed(v => !v)}
                                aria-expanded={!appsCollapsed}
                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--nui-surface-sunk)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:-outline-offset-2"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-[var(--nui-r-xs)] bg-[var(--nui-brand)] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--nui-text)]">Application Data Visualisation</p>
                                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">
                                            All application portfolios · colour = business priority · Red = Critical · Orange = High · Blue = Medium
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Legend pills — visible when collapsed */}
                                    {appsCollapsed && (
                                        <div className="hidden sm:flex items-center gap-2">
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-risk)] inline-block" /> Critical
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-warn)] inline-block" /> High
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--nui-text-3)]">
                                                <span className="w-2 h-2 rounded-full bg-[var(--nui-info)] inline-block" /> Medium
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-[var(--nui-text-3)]">
                                        <IconChevron collapsed={appsCollapsed} />
                                    </span>
                                </div>
                            </button>

                            {/* Content */}
                            {!appsCollapsed && (
                                <>
                                    <div className="h-px bg-[var(--nui-line-soft)]" />
                                    {/* Legend bar */}
                                    <div className="px-6 py-2.5 bg-[var(--nui-surface-sunk)] border-b border-[var(--nui-line-soft)] flex items-center gap-5 text-[11px] font-medium text-[var(--nui-text-2)]">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-risk)] inline-block" />
                                            Critical
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-warn)] inline-block" />
                                            High
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-info)] inline-block" />
                                            Medium
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--nui-idle)] inline-block" />
                                            Low
                                        </span>
                                    </div>
                                    <div className="px-6 py-6">
                                        <ApplicationDonutGrid formData={formData} />
                                    </div>
                                </>
                            )}
                        </div>
                    </NuiReveal>

                    {/* ── ADVISOR HANDOFF BANNER ───────────────────────────── */}
                    <NuiReveal delay={90}>
                        <AdvisorHandoffBanner
                            title="Your Current State Report has been generated"
                            description="The sections below are your Current State Report — an automated inventory of your IT environment as documented in your assessment. A Consltek advisor will review this report and reach out to schedule a consultation. The full Assessment with Remediation Plan — including gap analysis, risk assessment, and prioritised remediation — is developed during that engagement."
                        />
                    </NuiReveal>

                    {/* ── REPORT SECTIONS ───────────────────────────────────── */}
                    <NuiSection
                        id="report-sections"
                        index="01"
                        title="Report Sections"
                        description="Each section below is its own focused PDF — view it as a live dashboard first, or download it directly."
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {blueprints.map((bp, idx) => (
                                <NuiReveal key={idx} delay={Math.min(idx, 3) * 60}>
                                    <BlueprintCard
                                        title={bp.title}
                                        description={bp.description}
                                        tag={bp.tag}
                                        icon={bp.icon}
                                        documentComponent={bp.documentComponent}
                                        formData={formData}
                                        fileName={bp.fileName}
                                        downloadName={bp.downloadName}
                                        accentColor={bp.accentColor}
                                    />
                                </NuiReveal>
                            ))}
                        </div>
                    </NuiSection>

                    {/* ── DOWNLOAD ALL ──────────────────────────────────────── */}
                    <NuiReveal>
                        <div id="download-all" className="scroll-mt-24 border-t border-[var(--nui-line)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-[var(--nui-text-2)]">Complete Current State Report</p>
                                <p className="text-xs text-[var(--nui-text-3)] mt-0.5">All report sections compiled into a single PDF file</p>
                            </div>
                            {isClient && (
                                <PDFDownloadLink
                                    document={
                                        <CompleteDocument
                                            companyName={formData.companyName || "—"}
                                            preparedDate={new Date()}
                                            formData={formData}
                                        />
                                    }
                                    fileName={`Complete-Current-State-Report-${(formData.companyName || "Company").replace(/\s+/g, "_")}.pdf`}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--nui-brand)] hover:bg-[var(--nui-brand-hover)] rounded-[var(--nui-r-sm)] shadow-[var(--nui-shadow-1)] transition-colors duration-150 whitespace-nowrap"
                                >
                                    {({ loading }) => (
                                        <>
                                            <IconDownload />
                                            <span>{loading ? "Preparing…" : "Download Complete File"}</span>
                                        </>
                                    )}
                                </PDFDownloadLink>
                            )}
                        </div>
                    </NuiReveal>
                </div>
            </NuiCanvas>
        </AppShell>
    );
};

export default AllBlueprintsPage;
