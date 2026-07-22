"use client";

/**
 * CategoryRadar — 12-axis radar chart for all security categories.
 * Uses Recharts RadarChart (already in the project).
 */

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// Module-scope custom tooltip
const RadarTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { subject, value } = payload[0]?.payload || {};
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700">{subject}</p>
            <p className="text-[#15587B] font-bold">{value}/100</p>
        </div>
    );
};

// Short labels for 12-axis radar (full names are too long)
const SHORT_LABELS = {
    "Identity & Access Management":     "IAM",
    "Endpoint & Device Security":       "Endpoint",
    "Network Security":                 "Network",
    "Data Protection & Backup":         "Data Prot.",
    "Email & Communication Security":   "Email",
    "Governance & Policy":              "Governance",
    "Incident Response & Recovery":     "IR",
    "Vulnerability & Threat Management":"Vuln Mgmt",
    "Cloud & Application Security":     "Cloud/App",
    "Security Awareness & Culture":     "Awareness",
    "Monitoring & Visibility":          "Monitoring",
    "Physical & Operational Resilience":"Physical",
};

const CategoryRadar = ({ categories = [] }) => {
    const data = categories.map((c) => ({
        subject: SHORT_LABELS[c.name] || c.name,
        value:   c.rawScore,
        fullName:c.name,
    }));

    return (
        <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid gridType="polygon" stroke="#e5e7eb" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 500 }}
                />
                <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#15587B"
                    fill="#15587B"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#15587B", strokeWidth: 0 }}
                />
                <Tooltip content={<RadarTooltip />} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default CategoryRadar;
