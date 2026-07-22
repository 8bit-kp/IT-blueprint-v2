"use client";

/**
 * HorizontalBarChart — per-category horizontal bar chart.
 * Uses Recharts BarChart with layout="vertical".
 *
 * Colour-coded by score zone:
 *   0–30:  red    (#dc2626)
 *   31–50: amber  (#d97706)
 *   51–65: yellow (#ca8a04)
 *   66–80: teal   (#34808A)
 *   81+:   green  (#16a34a)
 */

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
    LabelList,
} from "recharts";

// Module-scope helpers
const getBarColor = (score) => {
    if (score <= 30)  return "#dc2626";
    if (score <= 50)  return "#d97706";
    if (score <= 65)  return "#ca8a04";
    if (score <= 80)  return "#34808A";
    return "#16a34a";
};

const SHORT_NAMES = {
    "Identity & Access Management":     "IAM",
    "Endpoint & Device Security":       "Endpoint",
    "Network Security":                 "Network",
    "Data Protection & Backup":         "Data Prot.",
    "Email & Communication Security":   "Email Sec.",
    "Governance & Policy":              "Governance",
    "Incident Response & Recovery":     "IR / Recovery",
    "Vulnerability & Threat Management":"Vuln Mgmt",
    "Cloud & Application Security":     "Cloud / App",
    "Security Awareness & Culture":     "Awareness",
    "Monitoring & Visibility":          "Monitoring",
    "Physical & Operational Resilience":"Physical",
};

const CategoryTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs max-w-48">
            <p className="font-bold text-gray-800 mb-0.5">{d.fullName}</p>
            <p className="text-gray-500">Score: <span className="font-bold" style={{ color: getBarColor(d.rawScore) }}>{d.rawScore}/100</span></p>
            <p className="text-gray-500">Weight: <span className="font-medium">{Math.round(d.weight * 100)}%</span></p>
            <p className="text-gray-500">Contribution: <span className="font-medium">+{d.contribution} pts</span></p>
        </div>
    );
};

const HorizontalBarChart = ({ categories = [] }) => {
    const data = categories.map((c) => ({
        name:        SHORT_NAMES[c.name] || c.name,
        fullName:    c.name,
        rawScore:    c.rawScore,
        gap:         100 - c.rawScore,
        weight:      c.weight,
        contribution:c.contribution,
    }));

    return (
        <ResponsiveContainer width="100%" height={categories.length * 36 + 40}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 60, bottom: 5, left: 10 }}
                barSize={16}
            >
                <CartesianGrid horizontal={false} stroke="#f3f4f6" strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={82}
                    tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CategoryTooltip />} cursor={{ fill: "#f9fafb" }} />

                {/* Gap bar (background, light gray) */}
                <Bar dataKey="gap" stackId="a" fill="#f3f4f6" radius={[0, 6, 6, 0]} isAnimationActive={false} />

                {/* Score bar (foreground, colour-coded) */}
                <Bar dataKey="rawScore" stackId="a" radius={[0, 4, 4, 0]} isAnimationActive>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(entry.rawScore)} />
                    ))}
                    <LabelList
                        dataKey="rawScore"
                        position="right"
                        style={{ fontSize: 10, fontWeight: 700, fill: "#374151" }}
                        formatter={(v) => `${v}`}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HorizontalBarChart;
