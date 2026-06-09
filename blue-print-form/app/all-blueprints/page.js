"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BlueprintDocument from "@/components/coverpages/BlueprintDocument";
import SecurityDocument from "@/components/coverpages/SecurityDocument";
import FinancialDocument from "@/components/coverpages/FinancialDocument";
import OperationalDocument from "@/components/coverpages/OperationalDocument";
import AdministrationDocument from "@/components/coverpages/AdministrationDocument";
import CompleteDocument from "@/components/coverpages/CompleteDocument";
import SecurityDonutGrid from "@/components/dashboard-visuals/SecurityDonutGrid";
import ApplicationDonutGrid from "@/components/dashboard-visuals/ApplicationDonutGrid";

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
    tag,
    accentColor,   // { bar: "#hex", barTo: "#hex", icon: "rgba(...)", text: "#hex" }
}) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const bar     = accentColor?.bar    || "#15587B";
    const barTo   = accentColor?.barTo  || "#34808A";
    const iconBg  = accentColor?.icon   || "rgba(21,88,123,0.09)";
    const iconTxt = accentColor?.text   || "#15587B";

    return (
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
            {/* Accent top bar — unique per card */}
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
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: iconBg, color: iconTxt }}
                        >
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>
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

                {/* Divider */}
                <div className="border-t border-gray-100 mb-4" />

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                        {/* View Dashboard */}
                        <button
                            onClick={() => window.open(`/blueprint-dashboard?type=${fileName}`, "_blank")}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-lg transition-all duration-150"
                            style={{
                                color: bar,
                                backgroundColor: "#f9fafb",
                                borderColor: "#e5e7eb",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = iconBg; e.currentTarget.style.borderColor = bar + "55"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#f9fafb"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
                        >
                            <IconDashboard />
                            View Dashboard
                        </button>

                        {/* Download PDF */}
                        {isClient && (
                            <PDFDownloadLink
                                document={documentComponent}
                                fileName={`${fileName}-${(formData.companyName || "Company").replace(/\s+/g, "_")}.pdf`}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-150 shadow-sm"
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
    const [visualsCollapsed, setVisualsCollapsed] = useState(false);
    const [appsCollapsed, setAppsCollapsed] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    useEffect(() => {
        const fetchBlueprint = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) { router.push("/auth"); return; }
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data && Object.keys(res.data).length > 0) {
                    setFormData(res.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching blueprint:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlueprint();
    }, [router]);

    // ── Loading state ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
            <div className="w-8 h-8 border-2 border-[#34808A] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading blueprints…</p>
        </div>
    );

    if (error || !formData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
            <p className="text-sm font-semibold text-gray-600">No blueprint data found.</p>
            <button onClick={() => router.push("/blueprint-form")}
                className="text-xs text-[#34808A] underline underline-offset-2">
                Return to Form
            </button>
        </div>
    );

    // ── Blueprint definitions ──────────────────────────────────────────────
    const blueprints = [
        {
            title: "Current State Blueprint",
            description: "Complete overview of current IT infrastructure",
            tag: "Overview",
            icon: <IconCurrentState />,
            documentComponent: <BlueprintDocument companyName={formData.companyName || "—"} preparedDate={new Date()} currentStateData={formData} />,
            fileName: "Current-State-Blueprint",
            accentColor: { bar: "#15587B", barTo: "#34808A", icon: "rgba(21,88,123,0.09)", text: "#15587B" },
        },
        {
            title: "Security Blueprint",
            description: "Security controls, technical defenses & policies",
            tag: "Security",
            icon: <IconSecurity />,
            documentComponent: <SecurityDocument companyName={formData.companyName || "—"} preparedDate={new Date()} securityData={formData} />,
            fileName: "Security-Blueprint",
            accentColor: { bar: "#b91c1c", barTo: "#ef4444", icon: "rgba(185,28,28,0.08)", text: "#b91c1c" },
        },
        {
            title: "Financial Blueprint",
            description: "Financial applications & business-critical systems",
            tag: "Finance",
            icon: <IconFinancial />,
            documentComponent: <FinancialDocument companyName={formData.companyName || "—"} preparedDate={new Date()} financialData={formData} />,
            fileName: "Financial-Blueprint",
            accentColor: { bar: "#047857", barTo: "#10b981", icon: "rgba(4,120,87,0.08)", text: "#047857" },
        },
        {
            title: "Operational Blueprint",
            description: "Network infrastructure, servers & operations",
            tag: "Operations",
            icon: <IconOperational />,
            documentComponent: <OperationalDocument companyName={formData.companyName || "—"} preparedDate={new Date()} operationalData={formData} />,
            fileName: "Operational-Blueprint",
            accentColor: { bar: "#6d28d9", barTo: "#a78bfa", icon: "rgba(109,40,217,0.08)", text: "#6d28d9" },
        },
        {
            title: "Administration & Controls Blueprint",
            description: "Governance, policies & administrative controls",
            tag: "Governance",
            icon: <IconAdmin />,
            documentComponent: <AdministrationDocument companyName={formData.companyName || "—"} preparedDate={new Date()} administrationData={formData} />,
            fileName: "Administration-Blueprint",
            accentColor: { bar: "#b45309", barTo: "#f59e0b", icon: "rgba(180,83,9,0.08)", text: "#b45309" },
        },
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fa] pb-24">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Left: brand mark + title */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#15587B] to-[#34808A] flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-gray-800 leading-none">All Blueprints</h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {formData.companyName}
                            </p>
                        </div>
                    </div>

                    {/* Right: nav actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push("/blueprint-form")}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150"
                        >
                            Edit Data
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <button
                            onClick={() => router.push("/blueprint-summary")}
                            className="px-3 py-1.5 text-xs font-medium text-[#15587B] hover:bg-[#15587B]/8 rounded-lg transition-all duration-150"
                            style={{ "--tw-hover-bg": "rgba(21,88,123,0.08)" }}
                        >
                            View Summary
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

                {/* ── SECURITY VISUALS SECTION ─────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Collapsible header */}
                    <button
                        onClick={() => setVisualsCollapsed(v => !v)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-150"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#15587B] to-[#34808A] flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Security Data Visualisation</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Live status of all security controls · Green = Yes · Red = No · Grey = Not configured
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Legend pills — visible when collapsed */}
                            {visualsCollapsed && (
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Yes
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> No
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> N/A
                                    </span>
                                </div>
                            )}
                            <span className="text-gray-400">
                                <IconChevron collapsed={visualsCollapsed} />
                            </span>
                        </div>
                    </button>

                    {/* Content */}
                    {!visualsCollapsed && (
                        <>
                            <div className="h-px bg-gray-100" />
                            {/* Legend bar */}
                            <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-5 text-[11px] font-medium text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                                    Yes — Implemented
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                                    No — Not Implemented
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                                    Not Configured
                                </span>
                            </div>
                            <div className="px-6 py-6">
                                <SecurityDonutGrid formData={formData} />
                            </div>
                        </>
                    )}
                </div>

                {/* ── APPLICATION VISUALS SECTION ──────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Collapsible header */}
                    <button
                        onClick={() => setAppsCollapsed(v => !v)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-150"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#15587B] to-[#34808A] flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Application Data Visualisation</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    All application portfolios · colour = business priority · Red = Critical · Orange = High · Blue = Medium
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Legend pills — visible when collapsed */}
                            {appsCollapsed && (
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Critical
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> High
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Medium
                                    </span>
                                </div>
                            )}
                            <span className="text-gray-400">
                                <IconChevron collapsed={appsCollapsed} />
                            </span>
                        </div>
                    </button>

                    {/* Content */}
                    {!appsCollapsed && (
                        <>
                            <div className="h-px bg-gray-100" />
                            {/* Legend bar */}
                            <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-5 text-[11px] font-medium text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                                    Critical
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                                    High
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                                    Medium
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
                                    Low
                                </span>
                            </div>
                            <div className="px-6 py-6">
                                <ApplicationDonutGrid formData={formData} />
                            </div>
                        </>
                    )}
                </div>

                {/* ── SECTION LABEL ─────────────────────────────────────── */}
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
                        Blueprint Documents
                    </p>

                    {/* ── CARDS GRID ─────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {blueprints.map((bp, idx) => (
                            <BlueprintCard
                                key={idx}
                                title={bp.title}
                                description={bp.description}
                                tag={bp.tag}
                                icon={bp.icon}
                                documentComponent={bp.documentComponent}
                                formData={formData}
                                fileName={bp.fileName}
                                accentColor={bp.accentColor}
                            />
                        ))}
                    </div>
                </div>

                {/* ── DOWNLOAD ALL ──────────────────────────────────────── */}
                <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Complete Documentation Package</p>
                        <p className="text-xs text-gray-400 mt-0.5">All 5 blueprints compiled into a single PDF file</p>
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
                            fileName={`Complete-IT-Blueprint-${(formData.companyName || "Company").replace(/\s+/g, "_")}.pdf`}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#15587B] hover:bg-[#0f4460] rounded-lg shadow-sm transition-all duration-150 whitespace-nowrap"
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
            </div>
        </div>
    );
};

export default AllBlueprintsPage;
