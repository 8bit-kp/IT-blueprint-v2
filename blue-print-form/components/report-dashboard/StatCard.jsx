"use client";

/**
 * StatCard — compact KPI card used in the executive dashboard stat row.
 * Reused across Overview, Assessment Data, and any section needing a
 * headline number (score, count, coverage %, etc.).
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — requires
 * a `.nui`-scoped ancestor. Same props/behavior as before: `color` is a raw
 * hex the caller controls (scoreZone/severity palettes are intentionally
 * fixed and separate from the brand tokens — see docs/ui-redesign.md).
 */
const StatCard = ({ label, value, sub, color = "#111827", Icon, large = false }) => (
    <div className="bg-[var(--nui-surface)] rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] p-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
            <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-1.5 leading-snug">
                {label}
            </p>
            <p
                className="nui-num font-extrabold leading-none"
                style={{ fontSize: large ? 34 : 26, color }}
            >
                {value}
            </p>
            {sub && <p className="text-xs text-[var(--nui-text-3)] mt-1.5">{sub}</p>}
        </div>
        {Icon && (
            <div
                className="w-9 h-9 rounded-[var(--nui-r-sm)] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}1A` }}
            >
                <Icon size={16} style={{ color }} />
            </div>
        )}
    </div>
);

export default StatCard;
