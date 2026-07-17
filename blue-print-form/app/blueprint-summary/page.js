"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { blueprintAPI } from "@/utils/api";
import {
    FiBriefcase, FiServer, FiShield, FiGrid, FiFileText, FiHome, FiEdit
} from "react-icons/fi";
import SummarySidebarNav from "@/components/navigation/SummarySidebarNav";
import { parseControlData } from "@/lib/reports/shared/parseControlData";
import { resolveCategoryTitle } from "@/lib/reports/shared/labels";

// ── Section registry ───────────────────────────────────────────────────────
// Each entry maps to a <section id="..."> element in the page body.
const SUMMARY_SECTIONS = [
    { id: "company",        label: "Company",        Icon: FiBriefcase },
    { id: "infrastructure", label: "Infrastructure", Icon: FiServer },
    { id: "security",       label: "Security",       Icon: FiShield },
    { id: "applications",   label: "Applications",   Icon: FiGrid },
];

// ── Shared UI components ───────────────────────────────────────────────────

const SectionCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col ${className}`}>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <div className="h-4 w-1 bg-[#34808A] rounded-full" />
            <h2 className="font-bold text-[#15587B] text-sm uppercase tracking-wider">{title}</h2>
        </div>
        <div className="p-5 flex-1">{children}</div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0 text-sm">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold text-right max-w-[60%] truncate" title={value?.toString()}>
            {value || "—"}
        </span>
    </div>
);

const Badge = ({ text, type = "neutral" }) => {
    if (!text) return <span className="text-gray-300">-</span>;

    let classes = "bg-gray-100 text-gray-600";
    const t = text.toString().toLowerCase();

    if (type === "priority") {
        if (t === "critical") classes = "bg-red-50 text-red-700 border border-red-100";
        else if (t === "high") classes = "bg-orange-50 text-orange-700 border border-orange-100";
        else if (t === "medium") classes = "bg-blue-50 text-blue-700 border border-blue-100";
        else if (t === "low") classes = "bg-green-50 text-green-700 border border-green-100";
        else classes = "bg-gray-50 text-gray-500 border border-gray-100";
    } else if (type === "status") {
        if (["yes", "true", "protected", "fully patched"].includes(t))
            classes = "bg-teal-50 text-teal-700 border border-teal-100";
        else if (["no", "false", "no data"].includes(t))
            classes = "bg-gray-50 text-gray-400 border border-gray-100";
        else if (t === "vendor")
            classes = "bg-indigo-50 text-indigo-700 border border-indigo-100";
    }

    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap ${classes}`}>
            {text}
        </span>
    );
};

// ── Page component ─────────────────────────────────────────────────────────

const BlueprintSummary = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeSection, setActiveSection] = useState("company");
    const [isClient, setIsClient] = useState(false);

    // Refs for each section so we can scroll to them
    const sectionRefs = useRef({});

    useEffect(() => { setIsClient(true); }, []);

    // Fetch blueprint data
    useEffect(() => {
        const fetchBlueprint = async () => {
            const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
            if (!username) { router.push("/auth"); return; }

            try {
                setLoading(true);
                const res = await blueprintAPI.getBlueprint();
                if (res.data && Object.keys(res.data).length > 0) {
                    setFormData(res.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching summary:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlueprint();
    }, [router]);

    // IntersectionObserver — updates activeSection as user scrolls
    useEffect(() => {
        if (!formData) return;

        const observers = [];
        const threshold = 0.3;

        SUMMARY_SECTIONS.forEach(({ id }) => {
            const el = sectionRefs.current[id];
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold, rootMargin: "-80px 0px -40% 0px" }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [formData]);

    const scrollToSection = useCallback((id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        setActiveSection(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    // ── Loading / error states ─────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#15587B] mb-4" />
                    <p className="text-gray-600 font-medium">Loading Blueprint Summary…</p>
                </div>
            </div>
        );
    }

    if (error || !formData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-700 mb-2">No Data Found</h2>
                <button onClick={() => router.push("/blueprint-form")} className="text-[#34808A] underline">
                    Return to Form
                </button>
            </div>
        );
    }

    // ── Main render ────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#F3F4F6]">

            {/* ── Sticky Top Header ──────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-full px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#15587B] p-2 rounded-lg text-white">
                            <FiFileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 leading-none">Blueprint Summary</h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Configuration for{" "}
                                <span className="font-semibold text-[#34808A]">{formData.companyName || "—"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            <FiHome size={15} /> <span className="hidden sm:inline">Home</span>
                        </button>
                        <button
                            onClick={() => router.push("/blueprint-form")}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            <FiEdit size={15} /> <span className="hidden sm:inline">Edit Data</span>
                        </button>
                        <button
                            onClick={() => router.push("/all-blueprints")}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#935010] hover:bg-[#7a3d0d] rounded-lg shadow-sm transition flex items-center gap-2"
                        >
                            <FiGrid size={15} />
                            <span className="hidden sm:inline">All Reports</span>
                            <span className="sm:hidden">Reports</span>
                        </button>
                    </div>
                </div>

                {/* Mobile: horizontal section pills */}
                <div className="md:hidden flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                    {SUMMARY_SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                activeSection === id
                                    ? "bg-[#15587B] text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Body: Sidebar + Sections ────────────────────────────────── */}
            <div className="flex">

                {/* Sidebar — desktop only */}
                <SummarySidebarNav
                    sections={SUMMARY_SECTIONS}
                    activeSection={activeSection}
                    onSectionClick={scrollToSection}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 pb-20">

                        {/* ── SECTION 1: Company ──────────────────────────── */}
                        <section
                            id="company"
                            ref={(el) => { sectionRefs.current["company"] = el; }}
                            className="scroll-mt-20 space-y-6"
                        >
                            <SectionHeader label="Company & Governance" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Company Profile */}
                                <SectionCard title="Company Profile">
                                    <div className="space-y-1">
                                        <DetailRow label="Company" value={formData.companyName} />
                                        <DetailRow label="Contact" value={formData.contactName} />
                                        <DetailRow label="Email" value={formData.email} />
                                        <DetailRow label="Phone" value={formData.phoneNumber} />
                                        <DetailRow
                                            label="Industry"
                                            value={formData.industry === "Other" ? formData.otherIndustry : formData.industry}
                                        />
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100">
                                            <div className="text-center">
                                                <span className="block text-xs text-gray-400 uppercase">Employees</span>
                                                <span className="text-lg font-bold text-[#15587B]">{formData.employees || "—"}</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-xs text-gray-400 uppercase">Remote</span>
                                                <span className="text-lg font-bold text-[#15587B]">{formData.remotePercentage ?? "—"}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Facilities & Power */}
                                <SectionCard title="Facilities & Power">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-blue-50 rounded p-3 text-center">
                                            <div className="text-xs text-blue-600 font-bold uppercase">Offices</div>
                                            <div className="text-xl font-bold text-blue-900">{formData.physicalOffices ?? "—"}</div>
                                        </div>
                                        <div className="bg-teal-50 rounded p-3 text-center">
                                            <div className="text-xs text-teal-600 font-bold uppercase">Datacenters</div>
                                            <div className="text-xl font-bold text-teal-900">{formData.hasDataCenters ?? "—"}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            ["On-Prem DC",   formData.hasOnPremDC],
                                            ["Cloud Infra",  formData.hasCloudInfra],
                                            ["Generators",   formData.hasGenerator],
                                            ["UPS Systems",  formData.hasUPS],
                                        ].map(([l, v]) => (
                                            <div key={l} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{l}</span>
                                                <Badge text={v} type="status" />
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>

                                {/* Governance */}
                                <SectionCard title="Governance & Compliance">
                                    <div className="grid grid-cols-1 gap-y-2">
                                        {[
                                            ["Steering Committee", formData.securityCommittee],
                                            ["Written Policy",     formData.securityPolicy],
                                            ["Employee Training",  formData.employeeTraining],
                                            ["BCDR Plan",          formData.bcdrPlan],
                                            ["Cyber Insurance",    formData.cyberInsurance],
                                            ["Incident Response",  formData.incidentResponse],
                                            ["Pen Test (1yr)",     formData.penetrationTest],
                                        ].map(([l, v]) => (
                                            <div key={l} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-600">{l}</span>
                                                <Badge text={v} type="status" />
                                            </div>
                                        ))}
                                    </div>
                                </SectionCard>
                            </div>
                        </section>

                        {/* ── SECTION 2: Infrastructure ────────────────────── */}
                        <section
                            id="infrastructure"
                            ref={(el) => { sectionRefs.current["infrastructure"] = el; }}
                            className="scroll-mt-20"
                        >
                            <SectionHeader label="Network & Infrastructure" />
                            <SectionCard title="Network & Infrastructure">
                                <div className="flex flex-col gap-8">

                                    {/* Servers & Config */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Configuration & Servers</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <InfoChip label="Windows Servers" value={formData.windowsServers}
                                                sub={formData.windowsServers === "Yes" ? `(${formData.windowsOptions?.length || 0} opts)` : ""} />
                                            <InfoChip label="Linux Servers" value={formData.linuxServers}
                                                sub={formData.linuxServers === "Yes" ? `(${formData.linuxOptions?.length || 0} opts)` : ""} />
                                            <InfoChip label="Wireless Auth" value={formData.wirelessAuth} plain />
                                            <InfoChip label="Guest Wifi" value={formData.guestWireless} />
                                        </div>
                                    </div>

                                    {/* Core Vendors Table */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Core Vendors</h3>
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-5 py-3 font-semibold w-1/4">Type</th>
                                                        <th className="px-5 py-3 font-semibold w-1/4">Vendor</th>
                                                        <th className="px-5 py-3 font-semibold w-1/4">Offering</th>
                                                        <th className="px-5 py-3 font-semibold w-1/4">Priority</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {[
                                                        { k: "WAN 1",              v: formData.WAN1 },
                                                        { k: "WAN 2",              v: formData.WAN2 },
                                                        { k: "Firewall / Routing", v: formData.routingVendor },
                                                        { k: "Switching",          v: formData.switchingVendor },
                                                        { k: "Wireless",           v: formData.wirelessVendor },
                                                        { k: "Virtualization",     v: formData.virtualizationVendor },
                                                        { k: "Cloud",              v: formData.cloudVendor },
                                                    ].map((item) => {
                                                        const { displayValue, businessPriority, offering, rawChoice } = parseControlData(item.v);
                                                        return (
                                                            <tr key={item.k} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="px-5 py-3 font-medium text-gray-700">{item.k}</td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`font-medium ${rawChoice === "No" ? "text-red-400 opacity-80" : "text-gray-800"}`}>
                                                                        {displayValue}
                                                                    </span>
                                                                </td>
                                                                <td className="px-5 py-3 text-gray-500">{offering || "—"}</td>
                                                                <td className="px-5 py-3"><Badge text={businessPriority} type="priority" /></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </section>

                        {/* ── SECTION 3: Security ──────────────────────────── */}
                        <section
                            id="security"
                            ref={(el) => { sectionRefs.current["security"] = el; }}
                            className="scroll-mt-20"
                        >
                            <SectionHeader label="Security Technical Controls" />
                            <SectionCard title="Security Technical Controls">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">Control Area</th>
                                                <th className="px-5 py-3 font-semibold">Solution / Vendor</th>
                                                <th className="px-5 py-3 font-semibold">Offering</th>
                                                <th className="px-5 py-3 font-semibold">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(formData.technicalControls || {}).map(([key, rawValue]) => {
                                                const { displayValue, businessPriority, offering, rawChoice } = parseControlData(rawValue);
                                                const label = formatTechLabel(key);
                                                return (
                                                    <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-5 py-3 font-medium text-gray-700">{label}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`text-gray-800 ${rawChoice === "No" ? "text-red-500 opacity-70" : ""}`}>
                                                                {displayValue}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-gray-500">{offering || "—"}</td>
                                                        <td className="px-5 py-3"><Badge text={businessPriority} type="priority" /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </SectionCard>
                        </section>

                        {/* ── SECTION 4: Applications ──────────────────────── */}
                        <section
                            id="applications"
                            ref={(el) => { sectionRefs.current["applications"] = el; }}
                            className="scroll-mt-20 space-y-6"
                        >
                            <SectionHeader label="Application Portfolio" />
                            {Object.entries(formData.applications || {}).map(([category, apps]) => {
                                if (!apps || apps.length === 0) return null;
                                const catTitle = resolveCategoryTitle(category, formData.customCategories);
                                return (
                                    <SectionCard key={category} title={`${catTitle} Applications`}>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 text-left">
                                                    <tr>
                                                        <th className="px-2 py-2 font-medium">Provider</th>
                                                        <th className="px-2 py-2 font-medium">Sensitive</th>
                                                        <th className="px-2 py-2 font-medium">MFA</th>
                                                        <th className="px-2 py-2 font-medium">Backup</th>
                                                        <th className="px-2 py-2 font-medium">Priority</th>
                                                        <th className="px-2 py-2 font-medium">Sensitivity</th>
                                                        <th className="px-2 py-2 font-medium">Biz Sens.</th>
                                                        <th className="px-2 py-2 font-medium">Biz Conf.</th>
                                                        <th className="px-2 py-2 font-medium">PII</th>
                                                        <th className="px-2 py-2 font-medium">HIPAA</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {apps.map((app, i) => (
                                                        <tr key={i}>
                                                            <td className="px-2 py-2.5 font-semibold text-[#15587B]">{app.name}</td>
                                                            <td className="px-2 py-2.5"><Badge text={app.containsSensitiveInfo === "Yes" ? "Yes" : "No"} type="status" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.mfa === "Yes" ? "Yes" : "No"} type="status" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.backedUp === "Yes" ? "Yes" : "No"} type="status" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.businessPriority} type="priority" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.sensitivity} type="priority" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.businessSensitivity} type="priority" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.businessConfidentiality} type="priority" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.personallyIdentifiableInfo} type="priority" /></td>
                                                            <td className="px-2 py-2.5"><Badge text={app.hipaaRegulated} type="priority" /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </SectionCard>
                                );
                            })}
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Local helpers ──────────────────────────────────────────────────────────

/** Section heading rendered above each group of cards. */
const SectionHeader = ({ label }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-1.5 bg-[#34808A] rounded-full" />
        <h2 className="text-base font-bold text-[#15587B] uppercase tracking-wide">{label}</h2>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);

/** Small info chip used in the Infrastructure section. */
const InfoChip = ({ label, value, sub = "", plain = false }) => (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
        <span className="text-xs text-gray-500 block mb-1">{label}</span>
        <div className="flex items-center gap-2">
            {plain ? (
                <span className="text-sm font-bold text-[#15587B]">{value || "-"}</span>
            ) : (
                <Badge text={value} type="status" />
            )}
            {sub && <span className="text-[10px] text-gray-400 truncate">{sub}</span>}
        </div>
    </div>
);

/** Formats a camelCase tech-control key into a readable label with acronyms. */
const ACRONYMS = {
    "Sd Wan": "SD-WAN", "Soc Siem": "SOC / SIEM", "Edr": "EDR",
    "Mdm": "MDM", "Mfa": "MFA", "Nac": "NAC", "Iam": "IAM",
    "Ssl Vpn": "SSL VPN", "Dlp": "DLP", "Casb": "CASB",
};

const formatTechLabel = (key) => {
    let label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    for (const [p, r] of Object.entries(ACRONYMS)) label = label.replace(p, r);
    return label;
};

export default BlueprintSummary;
