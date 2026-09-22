"use client";

/**
 * NuiSection — an editorial section heading + its content.
 *
 * Replaces the old "coloured bar + uppercase label" heading. A numbered
 * index, a tight display title and an optional description give the page a
 * readable spine, and the section itself is NOT wrapped in a card — only
 * the blocks inside it are. That is what stops every part of the page from
 * looking like the same rectangle.
 *
 * `innerRef` is a plain ref callback so the page can keep its existing
 * scroll-spy refs exactly as they were, and `id` stays the anchor id that
 * AppSidebar's scroll mode observes.
 */
const NuiSection = ({ id, innerRef, index, title, description, aside, children, className = "" }) => (
    <section id={id} ref={innerRef} className={`scroll-mt-28 ${className}`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                    {index && (
                        <span className="nui-num nui-eyebrow text-[10px] font-bold text-[var(--nui-accent)]">
                            {index}
                        </span>
                    )}
                    <span aria-hidden="true" className="h-px w-8 bg-[var(--nui-line-strong)]" />
                </div>
                <h2 className="nui-display mt-1.5 text-[19px] font-semibold leading-tight text-[var(--nui-text)] sm:text-[21px]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--nui-text-3)]">
                        {description}
                    </p>
                )}
            </div>
            {aside && <div className="flex-shrink-0">{aside}</div>}
        </div>
        {children}
    </section>
);

export default NuiSection;
