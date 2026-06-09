"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

// ── Priority → hex color mapping ───────────────────────────────────────────
// Matches the colors used in the blueprint form ApplicationsStep.jsx
const PRIORITY_COLORS = {
    Critical: "#ef4444",   // red-500
    High: "#f97316",       // orange-500
    Medium: "#3b82f6",     // blue-500
    Low: "#9ca3af",        // gray-400
    default: "#d1d5db",    // gray-300 (no data)
};

function getPriorityColor(priority) {
    return PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.default;
}

// ── Priority badge background (subtle) ─────────────────────────────────────
const PRIORITY_BG = {
    Critical: "#fee2e2",   // red-100
    High: "#ffedd5",       // orange-100
    Medium: "#dbeafe",     // blue-100
    Low: "#f3f4f6",        // gray-100
    default: "#f9fafb",
};

function getPriorityBg(priority) {
    return PRIORITY_BG[priority] ?? PRIORITY_BG.default;
}

// ── Single Application Donut Card ──────────────────────────────────────────

const AppDonutCard = ({ appName, priority, offering }) => {
    const fillColor = getPriorityColor(priority);
    const trackColor = "#e5e7eb"; // gray-200

    const data = [{ value: 100 }];

    const displayName = appName?.trim() || "Unnamed App";
    const shortName = displayName.length > 18
        ? displayName.slice(0, 16) + "…"
        : displayName;

    return (
        <div
            className="flex flex-col items-center gap-2 rounded-2xl shadow-md border p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{
                backgroundColor: "#ffffff",
                borderColor: fillColor + "33",
                borderWidth: "1.5px",
            }}
        >
            {/* Provider name at top */}
            <p
                className="text-center text-[11px] font-bold leading-tight px-1 truncate w-full"
                title={displayName}
                style={{ color: fillColor }}
            >
                {shortName}
            </p>

            {/* Donut */}
            <div className="relative">
                <PieChart width={110} height={110}>
                    {/* Background track */}
                    <Pie
                        data={[{ value: 100 }]}
                        cx={50}
                        cy={50}
                        innerRadius={34}
                        outerRadius={48}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        isAnimationActive={false}
                        stroke="none"
                    >
                        <Cell fill={trackColor} />
                    </Pie>
                    {/* Filled arc */}
                    <Pie
                        data={data}
                        cx={50}
                        cy={50}
                        innerRadius={34}
                        outerRadius={48}
                        startAngle={90}
                        endAngle={-270}
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
                        className="text-[10px] font-bold leading-tight text-center px-1"
                        style={{ color: fillColor }}
                    >
                        {priority || "—"}
                    </span>
                </div>
            </div>

            {/* Offering badge */}
            {offering && (
                <span
                    className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                        backgroundColor: getPriorityBg(priority),
                        color: fillColor,
                    }}
                >
                    {offering}
                </span>
            )}
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
                        {apps.length} application{apps.length !== 1 ? "s" : ""} · colour = business priority
                    </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" title="Critical" />
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block ml-1" title="High" />
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block ml-1" title="Medium" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block ml-1" title="Low" />
                </div>
            </div>

            {/* Donut grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {apps.map((app, i) => (
                    <AppDonutCard
                        key={app.id || i}
                        appName={app.name}
                        priority={app.businessPriority}
                        offering={app.offering}
                    />
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
 * Reads formData.applications which has the shape:
 *   {
 *     productivity: [{ name, businessPriority, offering, ... }, ...],
 *     finance:      [...],
 *     hrit:         [...],
 *     payroll:      [...],
 *     additional:   [...],
 *   }
 *
 * Each application gets one donut card.
 * Donut colour is driven by businessPriority:
 *   Critical → red   | High → orange | Medium → blue | Low → gray
 * Provider name is displayed at the top of the card.
 * Adding or removing apps in the form is automatically reflected here.
 */
const ApplicationDonutGrid = ({ formData }) => {
    const applications = formData?.applications || {};

    const categories = [
        { key: "productivity", label: "Productivity Applications" },
        { key: "finance",      label: "Finance Applications" },
        { key: "hrit",         label: "HR / IT Applications" },
        { key: "payroll",      label: "Payroll Applications" },
        { key: "additional",   label: "Additional Applications" },
    ];

    const hasAnyApp = categories.some(
        (c) => (applications[c.key]?.length ?? 0) > 0
    );

    if (!hasAnyApp) {
        return (
            <div className="py-16 text-center text-gray-400 text-sm">
                No applications found. Add applications in the blueprint form to see them here.
            </div>
        );
    }

    return (
        <div>
            {categories.map((cat) => (
                <CategorySection
                    key={cat.key}
                    title={cat.label}
                    apps={applications[cat.key] || []}
                />
            ))}
        </div>
    );
};

export default ApplicationDonutGrid;
