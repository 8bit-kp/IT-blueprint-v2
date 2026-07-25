"use client";

/**
 * StatCard — compact KPI card used in the executive dashboard stat row.
 * Reused across Overview, Assessment Data, and any section needing a
 * headline number (score, count, coverage %, etc.).
 */
const StatCard = ({ label, value, sub, color = "#111827", Icon, large = false }) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 leading-snug">
                {label}
            </p>
            <p
                className="font-extrabold leading-none"
                style={{ fontSize: large ? 34 : 26, color }}
            >
                {value}
            </p>
            {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        </div>
        {Icon && (
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}1A` }}
            >
                <Icon size={16} style={{ color }} />
            </div>
        )}
    </div>
);

export default StatCard;
