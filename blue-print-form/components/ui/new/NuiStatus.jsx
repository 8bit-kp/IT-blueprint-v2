"use client";

import { FiCheck, FiX, FiMinus } from "react-icons/fi";

/**
 * Status + priority indicators for the new UI.
 *
 * Accessibility rule applied throughout: state is never communicated by
 * colour alone. Every status pill carries a glyph, and every priority tag
 * carries a 4-segment level meter, so the value survives greyscale,
 * low-vision and colour-blind viewing.
 *
 * The semantic hues are the same fixed meanings the app already uses
 * (green = yes/low, red = no/critical, amber = high, blue = medium); they
 * are deliberately NOT reskinned to brand teal.
 */

const STATUS_STYLES = {
    yes:  { cls: "text-[var(--nui-ok)]   bg-[var(--nui-ok-bg)]   border-[var(--nui-ok-line)]",   Icon: FiCheck },
    no:   { cls: "text-[var(--nui-risk)] bg-[var(--nui-risk-bg)] border-[var(--nui-risk-line)]", Icon: FiX },
    idle: { cls: "text-[var(--nui-idle)] bg-[var(--nui-idle-bg)] border-[var(--nui-idle-line)]", Icon: FiMinus },
    info: { cls: "text-[var(--nui-info)] bg-[var(--nui-info-bg)] border-[var(--nui-info-line)]", Icon: FiCheck },
};

const resolveStatusKey = (text) => {
    const t = String(text).trim().toLowerCase();
    if (["yes", "true", "protected", "fully patched", "enabled"].includes(t)) return "yes";
    if (["no", "false", "no data", "none"].includes(t)) return "no";
    if (t === "vendor") return "info";
    return "idle";
};

/** Yes / No / neutral pill with a glyph. */
export const NuiStatus = ({ value, compact = false }) => {
    if (value === null || value === undefined || value === "") {
        return <span className="text-[13px] text-[var(--nui-text-3)]">—</span>;
    }
    const { cls, Icon } = STATUS_STYLES[resolveStatusKey(value)];
    return (
        <span
            className={[
                "inline-flex items-center gap-1 rounded-[var(--nui-r-pill)] border font-semibold",
                compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-[3px] text-[11px]",
                cls,
            ].join(" ")}
        >
            <Icon aria-hidden="true" size={compact ? 10 : 11} strokeWidth={3} />
            {value}
        </span>
    );
};

/* ── Priority / sensitivity ──────────────────────────────────────────────── */

const PRIORITY_LEVELS = {
    critical: { level: 4, cls: "text-[var(--nui-risk)]", bar: "bg-[var(--nui-risk)]" },
    high:     { level: 3, cls: "text-[var(--nui-warn)]", bar: "bg-[var(--nui-warn)]" },
    medium:   { level: 2, cls: "text-[var(--nui-info)]", bar: "bg-[var(--nui-info)]" },
    low:      { level: 1, cls: "text-[var(--nui-ok)]",   bar: "bg-[var(--nui-ok)]" },
};

/**
 * Priority tag: label + a 4-segment level meter. Values that are not one of
 * the four priority levels (the Applications table reuses this column style
 * for Yes/No flags such as PII and HIPAA) fall through to a plain status
 * pill so nothing is ever rendered as a meaningless zero-bar meter.
 */
export const NuiPriority = ({ value }) => {
    if (!value) return <span className="text-[13px] text-[var(--nui-text-3)]">—</span>;

    const spec = PRIORITY_LEVELS[String(value).trim().toLowerCase()];
    if (!spec) return <NuiStatus value={value} compact />;

    return (
        <span className={`inline-flex items-center gap-1.5 ${spec.cls}`}>
            <span aria-hidden="true" className="flex items-end gap-[2px]">
                {[1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={[
                            "w-[3px] rounded-[1px] transition-colors",
                            i === 1 ? "h-[5px]" : i === 2 ? "h-[7px]" : i === 3 ? "h-[9px]" : "h-[11px]",
                            i <= spec.level ? spec.bar : "bg-[var(--nui-line-strong)]",
                        ].join(" ")}
                    />
                ))}
            </span>
            <span className="text-[11px] font-semibold">{value}</span>
        </span>
    );
};

/** Neutral metadata tag (offering, industry, challenge chips …). */
export const NuiTag = ({ children, tone = "neutral" }) => {
    const tones = {
        neutral: "bg-[var(--nui-surface-sunk)] text-[var(--nui-text-2)] border-[var(--nui-line)]",
        brand:   "bg-[var(--nui-accent-tint)] text-[var(--nui-brand)] border-[color:var(--nui-accent-tint-2)]",
        invert:  "bg-white/10 text-[var(--nui-text-invert)] border-white/15",
    };
    return (
        <span className={`inline-flex items-center rounded-[var(--nui-r-pill)] border px-2.5 py-[3px] text-[11px] font-medium ${tones[tone] || tones.neutral}`}>
            {children}
        </span>
    );
};

export default NuiStatus;
