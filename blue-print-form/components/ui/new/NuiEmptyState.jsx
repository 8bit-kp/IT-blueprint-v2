"use client";

/**
 * NuiEmptyState — used for both the "nothing here yet" panel inside a
 * section and the page-level no-data view. Always names what is missing
 * and offers the single action that resolves it.
 */
const NuiEmptyState = ({ Icon, title, description, action, compact = false }) => (
    <div
        className={[
            "flex flex-col items-center justify-center rounded-[var(--nui-r)] border border-dashed",
            "border-[var(--nui-line-strong)] bg-[var(--nui-surface-quiet)] text-center",
            compact ? "px-5 py-8" : "px-6 py-14",
        ].join(" ")}
    >
        {Icon && (
            <span
                aria-hidden="true"
                className="mb-3 grid h-10 w-10 place-items-center rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)]"
            >
                <Icon size={18} />
            </span>
        )}
        <p className="nui-display text-[15px] font-semibold text-[var(--nui-text)]">{title}</p>
        {description && (
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--nui-text-3)]">
                {description}
            </p>
        )}
        {action && <div className="mt-5">{action}</div>}
    </div>
);

export default NuiEmptyState;
