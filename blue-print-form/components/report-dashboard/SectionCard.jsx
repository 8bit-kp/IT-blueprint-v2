"use client";

/**
 * SectionCard — the standard shell for every dashboard section on the
 * report page. Provides the anchor id (with scroll-margin so the sticky
 * header + floating sidebar never cover the heading), title row with an
 * optional icon/eyebrow/description, and an optional right-aligned action
 * slot (e.g. a collapsible toggle button).
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — requires
 * a `.nui`-scoped ancestor. Same props/behavior as before: a flat accent
 * top-bar and a flat accent-tinted icon badge replace the previous gradient
 * treatments (design principle: no gradients outside the page hero — see
 * docs/ui-redesign.md), hairline border instead of shadow-only header/body
 * split.
 */
const SectionCard = ({ id, eyebrow, title, description, Icon, action, children }) => (
    <section id={id} className="scroll-mt-24">
        <div className="bg-[var(--nui-surface)] rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] hover:shadow-[var(--nui-shadow-2)] transition-shadow duration-[var(--nui-dur)] overflow-hidden">
            {/* Brand accent bar — gives every section a consistent color identity instead of a flat top edge */}
            <div className="h-1 bg-[var(--nui-accent)]" />

            <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-[var(--nui-line-soft)]">
                <div className="flex items-start gap-3.5 min-w-0">
                    {Icon && (
                        <div className="w-11 h-11 rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0">
                            <Icon size={19} className="text-[var(--nui-brand)]" />
                        </div>
                    )}
                    <div className="min-w-0">
                        {eyebrow && (
                            <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-accent)] mb-0.5">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="nui-display text-base sm:text-lg font-bold text-[var(--nui-text)] leading-tight">{title}</h2>
                        {description && (
                            <p className="text-xs text-[var(--nui-text-3)] mt-1 max-w-xl leading-relaxed">{description}</p>
                        )}
                    </div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
            <div className="px-6 pb-7 pt-4">{children}</div>
        </div>
    </section>
);

export default SectionCard;
