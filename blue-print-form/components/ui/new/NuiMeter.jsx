"use client";

/**
 * NuiMeter — a thin horizontal coverage bar.
 *
 * Presentation only: it renders a value/total that the caller has already
 * counted from data the page displays anyway. It computes no score and
 * applies no weighting.
 *
 * Uses the native <progress> semantics via role/aria attributes so screen
 * readers get the numbers, and always renders the "x of y" text next to it
 * — the bar is never the only way to read the value.
 */
const NuiMeter = ({ value = 0, total = 0, label, tone = "brand", showCount = true }) => {
    const safeTotal = total > 0 ? total : 0;
    const ratio = safeTotal ? Math.min(1, Math.max(0, value / safeTotal)) : 0;

    const tones = {
        brand: "bg-[var(--nui-accent)]",
        ok:    "bg-[var(--nui-ok)]",
        warn:  "bg-[var(--nui-warn)]",
        risk:  "bg-[var(--nui-risk)]",
    };

    return (
        <div className="w-full">
            {(label || showCount) && (
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    {label && (
                        <span className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)]">
                            {label}
                        </span>
                    )}
                    {showCount && safeTotal > 0 && (
                        <span className="nui-num text-[11px] font-semibold text-[var(--nui-text-2)]">
                            {value}<span className="text-[var(--nui-text-3)]"> / {safeTotal}</span>
                        </span>
                    )}
                </div>
            )}
            <div
                role="meter"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={safeTotal || 1}
                aria-label={label ? `${label}: ${value} of ${safeTotal}` : undefined}
                className="h-1.5 w-full overflow-hidden rounded-[var(--nui-r-pill)] bg-[var(--nui-line)]"
            >
                <div
                    className={`nui-meter-fill h-full w-full rounded-[var(--nui-r-pill)] ${tones[tone] || tones.brand}`}
                    style={{ "--nui-fill": ratio }}
                />
            </div>
        </div>
    );
};

export default NuiMeter;
