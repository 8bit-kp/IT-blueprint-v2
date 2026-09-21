"use client";

/**
 * NuiPanelHeader — the header row inside a NuiPanel.
 *
 * Title left (with an optional icon and a small meta line), actions right.
 * Uses a hairline rule instead of the old tinted header band, so a panel
 * reads as one object rather than two stacked strips.
 */
const NuiPanelHeader = ({ title, meta, Icon, action, className = "" }) => (
    <div
        className={[
            "flex items-start justify-between gap-3 px-5 pt-4 pb-3",
            "border-b border-[var(--nui-line-soft)]",
            className,
        ].join(" ")}
    >
        <div className="flex items-start gap-3 min-w-0">
            {Icon && (
                <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-[var(--nui-r-xs)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)]"
                >
                    <Icon size={14} />
                </span>
            )}
            <div className="min-w-0">
                <h3 className="nui-display text-[13.5px] font-semibold leading-snug text-[var(--nui-text)]">
                    {title}
                </h3>
                {meta && (
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--nui-text-3)]">{meta}</p>
                )}
            </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
    </div>
);

export default NuiPanelHeader;
