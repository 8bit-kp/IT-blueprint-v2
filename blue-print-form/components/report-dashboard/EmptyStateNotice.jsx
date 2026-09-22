"use client";

/**
 * EmptyStateNotice — transparent "not yet collected" panel. Used wherever
 * an assessment section has no backing data (e.g. Business Workflows,
 * which is not yet a live form step) so the dashboard never fabricates
 * content to fill the space.
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — requires
 * a `.nui`-scoped ancestor. Same props/behavior as before.
 */
const EmptyStateNotice = ({ Icon, title, description }) => (
    <div className="border border-dashed border-[var(--nui-line-strong)] bg-[var(--nui-surface-quiet)] rounded-[var(--nui-r)] px-6 py-8 flex flex-col items-center text-center gap-3">
        {Icon && (
            <div className="w-11 h-11 rounded-full bg-[var(--nui-accent-tint)] flex items-center justify-center">
                <Icon size={18} className="text-[var(--nui-accent)]" />
            </div>
        )}
        <p className="text-sm font-semibold text-[var(--nui-text)]">{title}</p>
        {description && (
            <p className="text-xs text-[var(--nui-text-3)] max-w-md leading-relaxed">{description}</p>
        )}
    </div>
);

export default EmptyStateNotice;
