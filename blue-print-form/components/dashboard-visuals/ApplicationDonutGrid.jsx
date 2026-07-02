"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { getPriorityHexColor, getPriorityHexBg } from "@/constants/colors";

// ── Sensitivity circle field definitions ───────────────────────────────────
const SENSITIVITY_CIRCLES = [
    { key: "sensitivity",                abbr: "S",  label: "Sensitivity" },
    { key: "businessSensitivity",        abbr: "BS", label: "Business Sensitivity" },
    { key: "businessConfidentiality",    abbr: "BC", label: "Business Confidentiality" },
    { key: "personallyIdentifiableInfo", abbr: "PI", label: "Personally Identifiable Information" },
    { key: "hipaaRegulated",             abbr: "H",  label: "HIPAA-Regulated" },
];

// ── Solid Sensitivity Circle ────────────────────────────────────────────────
// Displays a filled circle with a 1-3 letter abbreviation centered inside.
// Color is driven by the field value: Low=green, Medium=yellow, High=orange, Critical=red.

const SensitivityCircle = ({ abbr, value, label }) => {
    const bg    = getPriorityHexColor(value);
    const text  = "#ffffff";
    const empty = !value;

    return (
        <div
            className="flex flex-col items-center gap-0.5"
            title={`${label}: ${value || "Not set"}`}
        >
            {/* Circle */}
            <div
                className="flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                    width: 34,
                    height: 34,
                    backgroundColor: empty ? "#e5e7eb" : bg,
                    boxShadow: empty ? "none" : `0 2px 6px ${bg}55`,
                }}
            >
                <span
                    className="font-black leading-none select-none"
                    style={{
                        fontSize: abbr.length > 2 ? 9 : 11,
                        color: empty ? "#9ca3af" : text,
                        letterSpacing: "-0.5px",
                    }}
                >
                    {abbr}
                </span>
            </div>
            {/* Value label below circle */}
            <span
                className="text-[8px] font-semibold uppercase leading-none"
                style={{ color: empty ? "#9ca3af" : bg }}
            >
                {value ? value.slice(0, 4) : "—"}
            </span>
        </div>
    );
};


// ── Single Application Donut Card ──────────────────────────────────────────

const AppDonutCard = ({ app }) => {
    const priority   = app.businessPriority;
    const fillColor  = getPriorityHexColor(priority);
    const bgColor    = getPriorityHexBg(priority);
    const trackColor = "#e5e7eb"; // gray-200

    const displayName = (app.name?.trim()) || "Unnamed App";
    const shortName   = displayName.length > 18 ? displayName.slice(0, 16) + "…" : displayName;

    return (
        <div
            className="flex flex-col items-center rounded-2xl shadow-md border p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{
                backgroundColor: "#ffffff",
                borderColor: fillColor + "44",
                borderWidth: "1.5px",
            }}
        >
            {/* Provider name at top */}
            <p
                className="text-center text-[11px] font-bold leading-tight px-1 truncate w-full mb-1"
                title={displayName}
                style={{ color: fillColor }}
            >
                {shortName}
            </p>

            {/* Donut ring */}
            <div className="relative">
                <PieChart width={110} height={110}>
                    {/* Background track */}
                    <Pie
                        data={[{ value: 100 }]}
                        cx={50} cy={50}
                        innerRadius={34} outerRadius={48}
                        startAngle={90} endAngle={-270}
                        dataKey="value"
                        isAnimationActive={false}
                        stroke="none"
                    >
                        <Cell fill={trackColor} />
                    </Pie>
                    {/* Filled arc */}
                    <Pie
                        data={[{ value: 100 }]}
                        cx={50} cy={50}
                        innerRadius={34} outerRadius={48}
                        startAngle={90} endAngle={-270}
                        dataKey="value"
                        isAnimationActive={!!priority}
                        animationBegin={0}
                        animationDuration={900}
                        animationEasing="ease-out"
                        stroke="none"
                    >
                        <Cell fill={fillColor} />
                    </Pie>
                </PieChart>

                {/* Center label — priority text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span
                        className="text-[10px] font-black leading-tight text-center px-1"
                        style={{ color: fillColor }}
                    >
                        {priority || "—"}
                    </span>
                </div>
            </div>

            {/* Offering badge */}
            {app.offering && (
                <span
                    className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1"
                    style={{ backgroundColor: bgColor, color: fillColor }}
                >
                    {app.offering}
                </span>
            )}

            {/* ── Sensitivity Circles Row ── */}
            <div className="grid grid-cols-5 place-items-center gap-5 w-full mt-3 pt-3 border-t border-gray-100">
                {SENSITIVITY_CIRCLES.map((sc) => (
                    <SensitivityCircle
                        key={sc.key}
                        abbr={sc.abbr}
                        value={app[sc.key]}
                        label={sc.label}
                    />
                ))}
            </div>
        </div>
    );
};

// ── Category Section ────────────────────────────────────────────────────────

const CategorySection = ({ title, apps }) => {
    if (!apps || apps.length === 0) return null;

    return (
        <div className="mb-10">
            {/* Section header */}
            <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-6 py-4 rounded-xl mb-5 shadow flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-sm text-white/80 mt-0.5">
                        {apps.length} application{apps.length !== 1 ? "s" : ""} · ring = business priority · circles = sensitivity classification
                    </p>
                </div>
                {/* Priority legend dots */}
                <div className="flex items-center gap-1 flex-shrink-0 text-[10px] text-white/80 gap-3">
                    {[
                        { label: "Low",      color: "#22c55e" },
                        { label: "Medium",   color: "#eab308" },
                        { label: "High",     color: "#f97316" },
                        { label: "Critical", color: "#ef4444" },
                    ].map(({ label, color }) => (
                        <span key={label} className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Sensitivity circle legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 px-1 text-[10px] text-gray-500 font-medium">
                <span className="font-semibold text-gray-600">Circles:</span>
                {SENSITIVITY_CIRCLES.map((sc) => (
                    <span key={sc.key}>
                        <span className="font-bold text-gray-700">{sc.abbr}</span> = {sc.label}
                    </span>
                ))}
            </div>

            {/* Donut grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {apps.map((app, i) => (
                    <AppDonutCard key={app.id || i} app={app} />
                ))}
            </div>
        </div>
    );
};

// ── Main Export ─────────────────────────────────────────────────────────────

/**
 * ApplicationDonutGrid
 *
 * Props:
 *   formData – the raw blueprint document from the DB
 *
 * Each application gets one donut card.
 * - Donut ring colour  → businessPriority (Low=green, Medium=yellow, High=orange, Critical=red)
 * - Provider name      → top of card
 * - Sensitivity circles → S, BS, BC, PI, H — solid filled circles coloured by field value
 *
 * Adding or removing apps from the form is automatically reflected here.
 */
const ApplicationDonutGrid = ({ formData }) => {
    const applications   = formData?.applications   || {};
    const customCats     = formData?.customCategories || [];

    // Title lookup for the five built-in categories
    const BUILTIN_TITLES = {
        productivity: "Productivity Applications",
        finance:      "Finance Applications",
        hrit:         "HR / IT Applications",
        payroll:      "Payroll Applications",
        additional:   "Additional Applications",
    };

    // Build a unified title map: built-in keys + user-created keys
    const titleMap = { ...BUILTIN_TITLES };
    customCats.forEach((cc) => { titleMap[cc.key] = cc.title; });

    // Render every key present in applications (including custom ones)
    const categoryKeys = Object.keys(applications);

    const hasAnyApp = categoryKeys.some((k) => (applications[k]?.length ?? 0) > 0);

    if (!hasAnyApp) {
        return (
            <div className="py-16 text-center text-gray-400 text-sm">
                No applications found. Add applications in the blueprint form to see them here.
            </div>
        );
    }

    return (
        <div>
            {categoryKeys.map((key) => (
                <CategorySection
                    key={key}
                    title={titleMap[key] || (key.charAt(0).toUpperCase() + key.slice(1))}
                    apps={applications[key] || []}
                />
            ))}
        </div>
    );
};

export default ApplicationDonutGrid;
