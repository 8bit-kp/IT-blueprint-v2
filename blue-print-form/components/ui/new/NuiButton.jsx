"use client";

/**
 * NuiButton — the action hierarchy for the new UI.
 *
 *   primary    solid brand — the one action a view most wants
 *   secondary  outlined neutral
 *   ghost      text-only, tinted on hover — the tertiary tier
 *   inverse    for use on the dark hero panel
 *   danger     solid risk-red — destructive actions (delete, reset)
 *
 * Presentational only. Every consumer passes the same onClick handler the
 * old markup already had. `loading` swaps the icon for a spinner and forces
 * `disabled`, so a caller can pass its existing `loading`/`disabled` state
 * straight through without duplicating the spinner markup itself.
 */
const VARIANTS = {
    primary:
        "text-white bg-[var(--nui-brand)] hover:bg-[var(--nui-brand-hover)] shadow-[var(--nui-shadow-1)]",
    secondary:
        "text-[var(--nui-text-2)] bg-[var(--nui-surface)] border border-[var(--nui-line-strong)] hover:border-[var(--nui-accent)] hover:text-[var(--nui-brand)]",
    ghost:
        "text-[var(--nui-accent)] hover:bg-[var(--nui-accent-tint)] hover:text-[var(--nui-brand)]",
    inverse:
        "text-[var(--nui-text-invert)] bg-white/10 border border-white/20 hover:bg-white/20",
    danger:
        "text-white bg-[var(--nui-risk)] hover:bg-[var(--nui-risk-hover)] shadow-[var(--nui-shadow-1)]",
};

const SIZES = {
    sm: "px-2.5 py-1 text-[11px] gap-1",
    md: "px-3.5 py-2 text-[12px] gap-1.5",
    lg: "px-5 py-2.5 text-[13px] gap-2",
};

const Spinner = ({ size }) => (
    <svg className="animate-spin" style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

const NuiButton = ({
    variant = "secondary",
    size = "md",
    Icon,
    loading = false,
    disabled = false,
    children,
    className = "",
    ...rest
}) => {
    const iconSize = size === "sm" ? 12 : size === "lg" ? 15 : 14;
    return (
        <button
            type="button"
            disabled={disabled || loading}
            className={[
                "inline-flex items-center justify-center rounded-[var(--nui-r-sm)] font-semibold",
                "transition-[background-color,color,border-color,box-shadow] duration-[var(--nui-dur-fast)] ease-[var(--nui-ease)]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                SIZES[size] || SIZES.md,
                VARIANTS[variant] || VARIANTS.secondary,
                className,
            ].join(" ")}
            {...rest}
        >
            {loading ? <Spinner size={iconSize} /> : Icon && <Icon aria-hidden="true" size={iconSize} />}
            {children}
        </button>
    );
};

export default NuiButton;
