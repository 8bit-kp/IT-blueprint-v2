"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";
import {
    FiBriefcase, FiServer, FiShield, FiGrid, FiActivity, FiEdit2,
    FiMapPin, FiCheckSquare, FiLock, FiShare2, FiLayers, FiZap,
    FiClipboard, FiAlertCircle, FiHardDrive,
} from "react-icons/fi";
import AppShell from "@/components/navigation/AppShell";
import { parseControlData } from "@/lib/reports/shared/parseControlData";
import { resolveCategoryTitle } from "@/lib/reports/shared/labels";
import AdvisorHandoffBanner from "@/components/engagement/AdvisorHandoffBanner";
import { useForm } from "@/context/FormContext";
import { ASSESSMENT_NAME, PRODUCT_NAME, REPORT_NAME } from "@/constants/messaging";

// ── New UI layer (design-system prototype — see docs/ui-redesign.md) ───────
import {
    NuiCanvas, NuiReveal, NuiHero, NuiSection, NuiPanel, NuiPanelHeader,
    NuiMetric, NuiMeter, NuiFact, NuiCheckRow, NuiButton, NuiEmptyState,
    NuiTableShell, NuiKeyValue, NuiKeyValueList, NuiStatus, NuiPriority, NuiTag,
} from "@/components/ui/new";

// ── Section registry ───────────────────────────────────────────────────────
// Each entry maps to a <section id="..."> element in the page body.
const SUMMARY_SECTIONS = [
    { id: "company",        label: "Company",        Icon: FiBriefcase },
    { id: "infrastructure", label: "Infrastructure", Icon: FiServer },
    { id: "security",       label: "Security",       Icon: FiShield },
    { id: "operations",     label: "Operations",     Icon: FiActivity },
    { id: "applications",   label: "Applications",   Icon: FiGrid },
];

// The seven governance answers rendered in the Governance panel. Declared
// once at module scope so the panel and the overview count can never drift.
const GOVERNANCE_ROWS = [
    ["Steering Committee", "securityCommittee"],
    ["Written Policy",     "securityPolicy"],
    ["Employee Training",  "employeeTraining"],
    ["BCDR Plan",          "bcdrPlan"],
    ["Cyber Insurance",    "cyberInsurance"],
    ["Incident Response",  "incidentResponse"],
    ["Pen Test (1yr)",     "penetrationTest"],
];

const FACILITY_ROWS = [
    ["On-Prem DC",  "hasOnPremDC"],
    ["Cloud Infra", "hasCloudInfra"],
    ["Generators",  "hasGenerator"],
    ["UPS Systems", "hasUPS"],
    ["Solar Power", "hasSolarPower"],
];

const CORE_VENDOR_ROWS = [
    { k: "WAN 1",              field: "WAN1" },
    { k: "WAN 2",              field: "WAN2" },
    { k: "Firewall / Routing", field: "routingVendor" },
    { k: "Switching",          field: "switchingVendor" },
    { k: "Wireless",           field: "wirelessVendor" },
    { k: "Virtualization",     field: "virtualizationVendor" },
    { k: "Cloud",              field: "cloudVendor" },
];

// ── Shared UI components ───────────────────────────────────────────────────

/** Top-right "Edit" affordance on a panel — unchanged behaviour, tertiary tier. */
const EditAction = ({ title, onEdit }) => (
    <NuiButton
        variant="ghost"
        size="sm"
        Icon={FiEdit2}
        onClick={onEdit}
        aria-label={`Edit ${title}`}
    >
        Edit
    </NuiButton>
);

/** Quick-jump rail rendered in the hero footer (all breakpoints). */
const SectionRail = ({ activeId, onSelect }) => (
    <nav aria-label="Jump to section">
        <ul className="nui-scroll-x flex gap-1.5 py-0.5">
            {SUMMARY_SECTIONS.map(({ id, label, Icon }) => {
                const active = activeId === id;
                return (
                    <li key={id} className="flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => onSelect(id)}
                            aria-current={active ? "true" : undefined}
                            className={[
                                "inline-flex items-center gap-1.5 rounded-[var(--nui-r-pill)] px-3 py-1.5 text-[11.5px] font-semibold",
                                "transition-[background-color,color] duration-[var(--nui-dur-fast)] ease-[var(--nui-ease)]",
                                active
                                    ? "bg-white text-[var(--nui-brand)]"
                                    : "text-[color:var(--nui-text-invert-2)] hover:bg-white/12 hover:text-[var(--nui-text-invert)]",
                            ].join(" ")}
                        >
                            <Icon aria-hidden="true" size={12} />
                            {label}
                        </button>
                    </li>
                );
            })}
        </ul>
    </nav>
);

// ── Page component ─────────────────────────────────────────────────────────

const BlueprintSummary = () => {
    const router = useRouter();
    const { setStep } = useForm();
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
                    notify.warning("Complete your assessment first", {
                        description: "Your Assessment Summary is available once your Current State Assessment has data to show.",
                    });
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching summary:", err);
                notify.error("Unable to load your assessment summary", {
                    description: "Please try again, or complete your Current State Assessment if you haven't yet.",
                });
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

    // Sends the user to the exact assessment step (and, where applicable, the
    // exact section within that step) that owns a given Summary card's data.
    // Reuses the wizard's existing shared FormContext step state directly
    // (the same setStep() the wizard's own step navigation already calls) so
    // the destination is correct even if Next.js's router reuses an
    // already-mounted /blueprint-form instance instead of remounting it (in
    // which case blueprint-form/page.js's mount-only localStorage-restore
    // effect would not re-run). localStorage.blueprintFormStep is also kept
    // in sync for the hard-reload-restore case. sectionId (optional) is a DOM
    // id inside that step, consumed by blueprint-form/page.js's
    // scroll-to-section effect.
    const handleEdit = useCallback((step, sectionId) => {
        setStep(step);
        if (typeof window !== "undefined") {
            localStorage.setItem("blueprintFormStep", String(step));
            if (sectionId) {
                sessionStorage.setItem("blueprintFormScrollTarget", sectionId);
            } else {
                sessionStorage.removeItem("blueprintFormScrollTarget");
            }
        }
        router.push("/blueprint-form");
    }, [router, setStep]);

    // ── Presentation-only aggregates ───────────────────────────────────────
    // Pure counts of rows this page already renders further down — used for
    // the overview strip and the section meters. No scoring, no weighting,
    // no new data: the Security Score / IT Maturity engine remains the only
    // place that assesses anything (lib/report/, PD-012).
    const overview = useMemo(() => {
        if (!formData) return null;

        const governanceInPlace = GOVERNANCE_ROWS
            .filter(([, field]) => formData[field] === "Yes").length;

        const techEntries = Object.entries(formData.technicalControls || {});
        const techInPlace = techEntries
            .filter(([, raw]) => parseControlData(raw).rawChoice === "Yes").length;

        const vendorsInPlace = CORE_VENDOR_ROWS
            .filter(({ field }) => parseControlData(formData[field]).rawChoice === "Yes").length;

        const appEntries = Object.entries(formData.applications || {})
            .filter(([, apps]) => Array.isArray(apps) && apps.length > 0);
        const appCount = appEntries.reduce((n, [, apps]) => n + apps.length, 0);

        return {
            governanceInPlace,
            governanceTotal: GOVERNANCE_ROWS.length,
            techEntries,
            techInPlace,
            techTotal: techEntries.length,
            vendorsInPlace,
            vendorsTotal: CORE_VENDOR_ROWS.length,
            appEntries,
            appCount,
            appCategoryCount: appEntries.length,
        };
    }, [formData]);

    // ── Loading / error states ─────────────────────────────────────────────

    if (loading) {
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
                        Loading your {REPORT_NAME}
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--nui-text-3)]">
                        Assembling your {ASSESSMENT_NAME} summary…
                    </p>
                </div>
            </div>
        );
    }

    if (error || !formData) {
        return (
            <div className="nui relative min-h-screen">
                <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0" />
                <main className="relative mx-auto flex min-h-screen max-w-lg items-center px-6">
                    <NuiEmptyState
                        Icon={FiAlertCircle}
                        title="No assessment data found"
                        description={`There is nothing to summarise yet. Complete your ${ASSESSMENT_NAME} and your ${REPORT_NAME} will appear here.`}
                        action={
                            <NuiButton variant="primary" onClick={() => router.push("/blueprint-form")}>
                                Return to the assessment
                            </NuiButton>
                        }
                    />
                </main>
            </div>
        );
    }

    // ── Derived display values (presentation only) ─────────────────────────

    const companyName = formData.companyName || "Your organisation";
    const industry = formData.industry === "Other" ? formData.otherIndustry : formData.industry;

    const heroTags = [
        industry && { label: "Industry", value: industry },
        formData.deploymentModel && { label: "Deployment", value: formData.deploymentModel },
        formData.itManagement && { label: "IT managed by", value: formData.itManagement },
        formData.mspRelationship === "Yes" && {
            label: "MSP",
            value: formData.mspName || "Yes",
        },
    ].filter(Boolean);

    const heroSnapshot = [
        { label: "Employees", value: formData.employees ?? "—" },
        { label: "Applications", value: overview.appCount },
    ];

    // ── Main render ────────────────────────────────────────────────────────

    return (
        <AppShell
            sections={SUMMARY_SECTIONS}
            contentClassName="px-4 pt-8 pb-24 sm:px-6 lg:px-8"
        >
            <NuiCanvas>
                <div className="mx-auto max-w-[1180px]">

                    {/* ── Page header ────────────────────────────────────── */}
                    <NuiReveal>
                        <NuiHero
                            eyebrow={`${PRODUCT_NAME} · ${REPORT_NAME}`}
                            title={companyName}
                            context={`Everything captured in your ${ASSESSMENT_NAME}, in one place. This is a read-only record — use Edit on any panel to change an answer in the assessment.`}
                            tags={heroTags}
                            snapshot={heroSnapshot}
                            footer={
                                isClient && (
                                    <SectionRail activeId={activeSection} onSelect={scrollToSection} />
                                )
                            }
                        />
                    </NuiReveal>

                    {/* ── Overview strip ─────────────────────────────────── */}
                    <NuiReveal
                        as="section"
                        delay={60}
                        aria-label="Assessment coverage at a glance"
                        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        <NuiMetric
                            label="Physical offices"
                            value={formData.physicalOffices ?? "—"}
                            Icon={FiMapPin}
                            caption={`Data centres: ${formData.hasDataCenters || "not reported"}`}
                        />
                        <NuiMetric
                            label="Governance controls"
                            value={overview.governanceInPlace}
                            unit={`/ ${overview.governanceTotal}`}
                            Icon={FiCheckSquare}
                            caption="Answered “Yes” in Governance & Admin"
                            meter={{ value: overview.governanceInPlace, total: overview.governanceTotal }}
                        />
                        <NuiMetric
                            label="Technical controls"
                            value={overview.techInPlace}
                            unit={overview.techTotal ? `/ ${overview.techTotal}` : undefined}
                            Icon={FiLock}
                            caption="Reported as in place"
                            meter={{ value: overview.techInPlace, total: overview.techTotal }}
                        />
                        <NuiMetric
                            label="Core network vendors"
                            value={overview.vendorsInPlace}
                            unit={`/ ${overview.vendorsTotal}`}
                            Icon={FiShare2}
                            caption="WAN, routing, switching, wireless, cloud"
                            meter={{ value: overview.vendorsInPlace, total: overview.vendorsTotal }}
                        />
                    </NuiReveal>

                    {/* ── Handoff Banner ─────────────────────────────────── */}
                    <NuiReveal delay={90} className="mt-8">
                        <AdvisorHandoffBanner
                            title="Your Current State Report has been generated"
                            description="This summary reflects your completed Current State Assessment. A Consltek advisor will review your assessment and reach out to schedule a consultation. The full Assessment with Remediation Plan — including gap analysis, risk assessment, and prioritised remediation — is developed during that engagement."
                        />
                    </NuiReveal>

                    <div className="mt-14 space-y-14">

                        {/* ── SECTION 1: Company ─────────────────────────── */}
                        <NuiSection
                            id="company"
                            innerRef={(el) => { sectionRefs.current["company"] = el; }}
                            index="01"
                            title="Company & Governance"
                            description="Who you are, where you operate from, and the governance controls you have on record."
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                                {/* Company Profile — record detail, quiet surface */}
                                <NuiReveal>
                                    <NuiPanel tone="flat" interactive className="h-full">
                                        <NuiPanelHeader
                                            title="Company Profile"
                                            Icon={FiBriefcase}
                                            action={<EditAction title="Company Profile" onEdit={() => handleEdit(1)} />}
                                        />
                                        <div className="px-5 pb-4 pt-1">
                                            <NuiKeyValueList>
                                                <NuiKeyValue label="Company" value={formData.companyName} />
                                                <NuiKeyValue label="Contact" value={formData.contactName} optional />
                                                <NuiKeyValue label="Email" value={formData.email} />
                                                <NuiKeyValue label="Phone" value={formData.phoneNumber} optional />
                                                <NuiKeyValue label="Industry" value={industry} />
                                                <NuiKeyValue label="Deployment Model" value={formData.deploymentModel} />
                                                <NuiKeyValue label="IT Management" value={formData.itManagement} />
                                                <NuiKeyValue label="MSP Relationship" value={formData.mspRelationship} />
                                                {formData.mspRelationship === "Yes" && (
                                                    <NuiKeyValue label="MSP Name" value={formData.mspName} optional />
                                                )}
                                            </NuiKeyValueList>

                                            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--nui-r-sm)] border border-[var(--nui-line)] bg-[var(--nui-line)]">
                                                <div className="bg-[var(--nui-surface-sunk)] px-4 py-3 text-center">
                                                    <dt className="nui-eyebrow text-[9.5px] font-bold text-[var(--nui-text-3)]">Employees</dt>
                                                    <dd className="nui-num mt-1 text-[19px] font-semibold text-[var(--nui-brand)]">
                                                        {formData.employees || "—"}
                                                    </dd>
                                                </div>
                                                <div className="bg-[var(--nui-surface-sunk)] px-4 py-3 text-center">
                                                    <dt className="nui-eyebrow text-[9.5px] font-bold text-[var(--nui-text-3)]">Remote</dt>
                                                    <dd className="nui-num mt-1 text-[19px] font-semibold text-[var(--nui-brand)]">
                                                        {formData.remotePercentage ?? "—"}%
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>

                                {/* Facilities & Power */}
                                <NuiReveal delay={60}>
                                    <NuiPanel tone="flat" interactive className="h-full">
                                        <NuiPanelHeader
                                            title="Facilities & Power"
                                            Icon={FiZap}
                                            action={<EditAction title="Facilities & Power" onEdit={() => handleEdit(2)} />}
                                        />
                                        <div className="px-5 pb-4 pt-4">
                                            <div className="mb-4 grid grid-cols-2 gap-3">
                                                <NuiFact label="Offices" value={formData.physicalOffices ?? "—"} emphasis />
                                                <NuiFact label="Datacenters">
                                                    <NuiStatus value={formData.hasDataCenters} />
                                                </NuiFact>
                                            </div>
                                            <div>
                                                {FACILITY_ROWS.map(([label, field]) => (
                                                    <NuiCheckRow key={label} label={label}>
                                                        <NuiStatus value={formData[field]} compact />
                                                    </NuiCheckRow>
                                                ))}
                                            </div>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>

                                {/* Governance — the one panel in this row carrying a meter */}
                                <NuiReveal delay={120}>
                                    <NuiPanel tone="flat" interactive className="h-full">
                                        <NuiPanelHeader
                                            title="Governance & Compliance"
                                            Icon={FiClipboard}
                                            meta={`${overview.governanceInPlace} of ${overview.governanceTotal} controls in place`}
                                            action={<EditAction title="Governance & Compliance" onEdit={() => handleEdit(4)} />}
                                        />
                                        <div className="px-5 pb-4 pt-4">
                                            <NuiMeter
                                                value={overview.governanceInPlace}
                                                total={overview.governanceTotal}
                                                label="Coverage"
                                            />
                                            <div className="mt-4">
                                                {GOVERNANCE_ROWS.map(([label, field]) => (
                                                    <NuiCheckRow key={label} label={label}>
                                                        <NuiStatus value={formData[field]} compact />
                                                    </NuiCheckRow>
                                                ))}
                                            </div>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>
                            </div>
                        </NuiSection>

                        {/* ── SECTION 2: Infrastructure ──────────────────── */}
                        <NuiSection
                            id="infrastructure"
                            innerRef={(el) => { sectionRefs.current["infrastructure"] = el; }}
                            index="02"
                            title="Network & Infrastructure"
                            description="Server footprint, wireless posture and the vendors behind your core network."
                            aside={
                                <EditAction title="Network & Infrastructure" onEdit={() => handleEdit(3)} />
                            }
                        >
                            {/* Server / wireless facts sit directly on the canvas —
                                they are attributes, not objects worth carding. */}
                            <NuiReveal className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <NuiFact
                                    label="Windows Servers"
                                    sub={formData.windowsServers === "Yes" ? `${formData.windowsOptions?.length || 0} options` : ""}
                                >
                                    <NuiStatus value={formData.windowsServers} compact />
                                </NuiFact>
                                <NuiFact
                                    label="Linux Servers"
                                    sub={formData.linuxServers === "Yes" ? `${formData.linuxOptions?.length || 0} options` : ""}
                                >
                                    <NuiStatus value={formData.linuxServers} compact />
                                </NuiFact>
                                <NuiFact label="Wireless Auth" value={formData.wirelessAuth} emphasis />
                                <NuiFact label="Guest Wifi">
                                    <NuiStatus value={formData.guestWireless} compact />
                                </NuiFact>
                            </NuiReveal>

                            <NuiReveal delay={60}>
                                <NuiPanel tone="flat">
                                    <NuiPanelHeader
                                        title="Core vendors"
                                        Icon={FiHardDrive}
                                        meta={`${overview.vendorsInPlace} of ${overview.vendorsTotal} in place`}
                                    />
                                    <NuiTableShell caption="Core network and infrastructure vendors">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="w-1/4">Type</th>
                                                <th scope="col" className="w-1/4">Vendor</th>
                                                <th scope="col" className="w-1/4">Offering</th>
                                                <th scope="col" className="w-1/4">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CORE_VENDOR_ROWS.map((item) => {
                                                const { displayValue, businessPriority, offering, rawChoice } =
                                                    parseControlData(formData[item.field]);
                                                return (
                                                    <tr key={item.k}>
                                                        <th scope="row" className="font-semibold text-[var(--nui-text)]">
                                                            {item.k}
                                                        </th>
                                                        <td>
                                                            {rawChoice === "No"
                                                                ? <NuiStatus value="No" compact />
                                                                : (
                                                                    <span className="font-medium text-[var(--nui-text)]">
                                                                        {displayValue || "—"}
                                                                    </span>
                                                                )}
                                                        </td>
                                                        <td>{offering ? <NuiTag>{offering}</NuiTag> : "—"}</td>
                                                        <td><NuiPriority value={businessPriority} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </NuiTableShell>
                                </NuiPanel>
                            </NuiReveal>
                        </NuiSection>

                        {/* ── SECTION 3: Security ────────────────────────── */}
                        <NuiSection
                            id="security"
                            innerRef={(el) => { sectionRefs.current["security"] = el; }}
                            index="03"
                            title="Security Technical Controls"
                            description="Every technical control captured in the assessment, with the vendor and priority you recorded against it."
                            aside={
                                <EditAction title="Security Technical Controls" onEdit={() => handleEdit(5)} />
                            }
                        >
                            <NuiReveal>
                                <NuiPanel tone="flat">
                                    <div className="flex flex-col gap-3 border-b border-[var(--nui-line-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                                        <div className="flex items-center gap-3">
                                            <span aria-hidden="true" className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-[var(--nui-r-xs)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)]">
                                                <FiShield size={14} />
                                            </span>
                                            <div>
                                                <h3 className="nui-display text-[13.5px] font-semibold text-[var(--nui-text)]">
                                                    Control coverage
                                                </h3>
                                                <p className="mt-0.5 text-[11.5px] text-[var(--nui-text-3)]">
                                                    Counted from the answers below — not a score.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:max-w-[280px]">
                                            <NuiMeter
                                                value={overview.techInPlace}
                                                total={overview.techTotal}
                                                label="In place"
                                            />
                                        </div>
                                    </div>

                                    {overview.techEntries.length === 0 ? (
                                        <div className="p-5">
                                            <NuiEmptyState
                                                compact
                                                Icon={FiLock}
                                                title="No technical controls recorded"
                                                description="Answer Step 5 of the assessment and the controls will be listed here."
                                                action={
                                                    <NuiButton variant="secondary" size="sm" Icon={FiEdit2} onClick={() => handleEdit(5)}>
                                                        Go to Step 5
                                                    </NuiButton>
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <NuiTableShell caption="Security technical controls">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Control Area</th>
                                                    <th scope="col">Solution / Vendor</th>
                                                    <th scope="col">Offering</th>
                                                    <th scope="col">Priority</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {overview.techEntries.map(([key, rawValue]) => {
                                                    const { displayValue, businessPriority, offering, rawChoice } =
                                                        parseControlData(rawValue);
                                                    return (
                                                        <tr key={key}>
                                                            <th scope="row" className="font-semibold text-[var(--nui-text)]">
                                                                {formatTechLabel(key)}
                                                            </th>
                                                            <td>
                                                                {rawChoice === "No"
                                                                    ? <NuiStatus value="No" compact />
                                                                    : (
                                                                        <span className="font-medium text-[var(--nui-text)]">
                                                                            {displayValue || "—"}
                                                                        </span>
                                                                    )}
                                                            </td>
                                                            <td>{offering ? <NuiTag>{offering}</NuiTag> : "—"}</td>
                                                            <td><NuiPriority value={businessPriority} /></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </NuiTableShell>
                                    )}
                                </NuiPanel>
                            </NuiReveal>
                        </NuiSection>

                        {/* ── SECTION 4: Operations ──────────────────────── */}
                        <NuiSection
                            id="operations"
                            innerRef={(el) => { sectionRefs.current["operations"] = el; }}
                            index="04"
                            title="Business Operations"
                            description="The business context an advisor needs in order to weigh technical risk against what the business actually does."
                        >
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <NuiReveal>
                                    <NuiPanel tone="flat" interactive className="h-full">
                                        <NuiPanelHeader
                                            title="Business Context"
                                            Icon={FiBriefcase}
                                            action={<EditAction title="Business Context" onEdit={() => handleEdit(6, "section-business-context")} />}
                                        />
                                        <div className="px-5 pb-4 pt-1">
                                            <NuiKeyValueList>
                                                <NuiKeyValue label="Primary Function" value={formData.primaryBusinessFunction} optional />
                                                <NuiKeyValue label="Products / Services" value={formData.mainProductsServices} optional />
                                                <NuiKeyValue label="Customer Type" value={formData.primaryCustomerType} optional />
                                                <NuiKeyValue label="Geographic Reach" value={formData.geographicReach} optional />
                                                <NuiKeyValue label="Locations" value={formData.numberOfLocations} optional />
                                            </NuiKeyValueList>
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>

                                <NuiReveal delay={60}>
                                    <NuiPanel tone="flat" interactive className="h-full">
                                        <NuiPanelHeader
                                            title="Business Criticality"
                                            Icon={FiActivity}
                                            action={<EditAction title="Business Criticality" onEdit={() => handleEdit(6, "section-business-criticality")} />}
                                        />
                                        <div className="px-5 pb-4 pt-1">
                                            <NuiKeyValueList>
                                                <NuiKeyValue label="Critical Function" value={formData.criticalBusinessFunction} optional />
                                                <NuiKeyValue label="24/7 Systems" value={formData.systemsRequiring24x7} optional />
                                                <NuiKeyValue label="Top Priority" value={formData.highestBusinessPriority} optional />
                                            </NuiKeyValueList>

                                            {(formData.operationalChallenges || []).length > 0 && (
                                                <div className="mt-4 border-t border-[var(--nui-line-soft)] pt-4">
                                                    <p className="nui-eyebrow mb-2 text-[9.5px] font-bold text-[var(--nui-text-3)]">
                                                        Operational challenges
                                                    </p>
                                                    <ul className="flex flex-wrap gap-1.5">
                                                        {formData.operationalChallenges.map((c) => (
                                                            <li key={c}><NuiTag tone="brand">{c}</NuiTag></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </NuiPanel>
                                </NuiReveal>
                            </div>
                        </NuiSection>

                        {/* ── SECTION 5: Applications ────────────────────── */}
                        <NuiSection
                            id="applications"
                            innerRef={(el) => { sectionRefs.current["applications"] = el; }}
                            index="05"
                            title="Application Portfolio"
                            description={
                                overview.appCount > 0
                                    ? `${overview.appCount} application${overview.appCount === 1 ? "" : "s"} across ${overview.appCategoryCount} categor${overview.appCategoryCount === 1 ? "y" : "ies"}, with the data-handling flags recorded for each.`
                                    : "Applications you record in Step 7 of the assessment appear here."
                            }
                        >
                            {overview.appEntries.length === 0 ? (
                                <NuiReveal>
                                    <NuiEmptyState
                                        Icon={FiLayers}
                                        title="No applications recorded yet"
                                        description="Add the applications your business depends on so your advisor can assess how sensitive data moves through them."
                                        action={
                                            <NuiButton variant="primary" Icon={FiEdit2} onClick={() => handleEdit(7)}>
                                                Add applications
                                            </NuiButton>
                                        }
                                    />
                                </NuiReveal>
                            ) : (
                                <div className="space-y-5">
                                    {overview.appEntries.map(([category, apps], i) => {
                                        const catTitle = resolveCategoryTitle(category, formData.customCategories);
                                        return (
                                            <NuiReveal key={category} delay={Math.min(i, 3) * 60}>
                                                <NuiPanel tone="flat">
                                                    <NuiPanelHeader
                                                        title={`${catTitle} Applications`}
                                                        Icon={FiGrid}
                                                        meta={`${apps.length} application${apps.length === 1 ? "" : "s"}`}
                                                        action={
                                                            <EditAction
                                                                title={`${catTitle} Applications`}
                                                                onEdit={() => handleEdit(7, `app-cat-${category}`)}
                                                            />
                                                        }
                                                    />
                                                    <NuiTableShell caption={`${catTitle} applications and their data-handling flags`}>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Provider</th>
                                                                <th scope="col">Sensitive</th>
                                                                <th scope="col">MFA</th>
                                                                <th scope="col">Backup</th>
                                                                <th scope="col">Priority</th>
                                                                <th scope="col">Sensitivity</th>
                                                                <th scope="col">Biz Sens.</th>
                                                                <th scope="col">Biz Conf.</th>
                                                                <th scope="col">PII</th>
                                                                <th scope="col">HIPAA</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {apps.map((app, idx) => (
                                                                <tr key={idx}>
                                                                    <th scope="row" className="whitespace-nowrap font-semibold text-[var(--nui-brand)]">
                                                                        {app.name}
                                                                    </th>
                                                                    <td><NuiStatus value={app.containsSensitiveInfo === "Yes" ? "Yes" : "No"} compact /></td>
                                                                    <td><NuiStatus value={app.mfa === "Yes" ? "Yes" : "No"} compact /></td>
                                                                    <td><NuiStatus value={app.backedUp === "Yes" ? "Yes" : "No"} compact /></td>
                                                                    <td><NuiPriority value={app.businessPriority} /></td>
                                                                    <td><NuiPriority value={app.sensitivity} /></td>
                                                                    <td><NuiPriority value={app.businessSensitivity} /></td>
                                                                    <td><NuiPriority value={app.businessConfidentiality} /></td>
                                                                    <td><NuiPriority value={app.personallyIdentifiableInfo} /></td>
                                                                    <td><NuiPriority value={app.hipaaRegulated} /></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </NuiTableShell>
                                                </NuiPanel>
                                            </NuiReveal>
                                        );
                                    })}
                                </div>
                            )}
                        </NuiSection>
                    </div>
                </div>
            </NuiCanvas>
        </AppShell>
    );
};

// ── Local helpers ──────────────────────────────────────────────────────────

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
