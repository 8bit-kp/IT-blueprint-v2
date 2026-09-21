"use client";

/**
 * TopBar — the one page-header bar used on every authenticated page that
 * still needs one (most migrated pages now use a page-owned `NuiHero`
 * instead — see docs/ui-redesign.md §11's resolved open question). Rendered
 * nested inside AppShell's content column, so it never needs to know the
 * sidebar's width itself — it just fills the column it's given.
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — rounded,
 * `.nui`-toned, matching `AppSidebar`'s card language. Requires a `.nui`
 * ancestor; `AppShell` provides that on its own root, so this never needs to
 * carry the scope itself.
 *
 * Deliberately minimal: title + optional subtitle (usually the company
 * name), plus an optional small set of page-specific FUNCTIONAL actions
 * (e.g. "Save Changes"). Cross-page navigation (Home, Assessment, Summary,
 * Reports, Security Score) lives in AppSidebar's primary nav — TopBar
 * should not duplicate it.
 *
 * `actions`: { label, onClick, variant?: "primary"|"secondary"|"danger", Icon?, loading?, disabled? }[]
 */

const VARIANTS = {
    primary: "text-white bg-[var(--nui-brand)] hover:bg-[var(--nui-brand-hover)] shadow-[var(--nui-shadow-1)]",
    secondary: "text-[var(--nui-text-2)] bg-[var(--nui-surface-sunk)] hover:bg-[var(--nui-line-soft)]",
    danger: "text-white bg-[var(--nui-risk)] hover:bg-[var(--nui-risk-hover)]",
};

const ActionButton = ({ label, onClick, variant = "primary", Icon, loading, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={[
            "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-[var(--nui-r-sm)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:outline-offset-1",
            VARIANTS[variant] || VARIANTS.primary,
        ].join(" ")}
    >
        {loading ? (
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        ) : (
            Icon && <Icon size={14} />
        )}
        {label}
    </button>
);

const TopBar = ({ title, subtitle, actions = [] }) => (
    <div className="sticky top-8 z-30">
        {/* px-6 here matches the px-6 every page's contentClassName applies inside
            its own max-w-6xl mx-auto wrapper below — without it this box spans
            edge-to-edge of the container while the content underneath is inset
            24px on each side, so the two never line up. */}
        <div className="max-w-6xl mx-auto px-6">
            <div className="bg-[var(--nui-surface)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] rounded-[var(--nui-r)] px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-sm font-bold text-[var(--nui-brand)] leading-none truncate">{title}</h1>
                    {subtitle && <p className="text-xs text-[var(--nui-text-3)] mt-0.5 truncate">{subtitle}</p>}
                </div>
                {actions.length > 0 && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {actions.map((a, i) => (
                            <ActionButton key={i} {...a} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default TopBar;
