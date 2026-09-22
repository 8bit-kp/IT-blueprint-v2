"use client";

import NuiMeter from "@/components/ui/new/NuiMeter";

/**
 * NuiMetric — a headline figure in the page's overview strip.
 *
 * Every metric shown on /blueprint-summary is a plain count of rows the
 * page already renders further down (employees, offices, controls answered
 * "Yes", applications listed). No score, no weighting, no derived
 * assessment logic — that lives in lib/report/ and stays there.
 */
const NuiMetric = ({ label, value, unit, caption, Icon, meter }) => (
    <div className="relative flex h-full flex-col gap-3 rounded-[var(--nui-r)] border border-[var(--nui-line)] bg-[var(--nui-surface)] p-4 shadow-[var(--nui-shadow-1)] transition-[box-shadow,border-color] duration-[var(--nui-dur)] ease-[var(--nui-ease)] hover:border-[var(--nui-line-strong)] hover:shadow-[var(--nui-shadow-2)]">
        <div className="flex items-start justify-between gap-2">
            <p className="nui-eyebrow text-[10px] font-bold leading-snug text-[var(--nui-text-3)]">
                {label}
            </p>
            {Icon && (
                <span aria-hidden="true" className="text-[var(--nui-accent)] opacity-70">
                    <Icon size={15} />
                </span>
            )}
        </div>

        <div>
            <p className="nui-num nui-display text-[28px] font-semibold leading-none text-[var(--nui-text)]">
                {value}
                {unit && <span className="ml-0.5 text-[15px] font-medium text-[var(--nui-text-3)]">{unit}</span>}
            </p>
            {caption && <p className="mt-1.5 text-[11.5px] text-[var(--nui-text-3)]">{caption}</p>}
        </div>

        {/* mt-auto pins the bar to the card floor so a metric without one
            keeps its number at the same height as its neighbours */}
        {meter && <div className="mt-auto"><NuiMeter {...meter} showCount={false} label={undefined} /></div>}
    </div>
);

export default NuiMetric;
