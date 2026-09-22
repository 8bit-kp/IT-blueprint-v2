"use client";

/**
 * NuiHero — the page header for the new UI.
 *
 * One deep-teal panel carrying: what the page is (eyebrow), whose report it
 * is (title), the report context line, the facts that qualify it (tags),
 * and an optional right-hand snapshot rail. It is the single "large"
 * moment on the page — everything below it is quiet by comparison, which
 * is what gives the layout a hierarchy the old flat card grid never had.
 *
 * Kept compact (no oversized display type, no full-bleed image) so it
 * orients rather than dominates.
 */
const NuiHero = ({ eyebrow, title, context, tags = [], snapshot = [], actions, footer }) => (
    <header className="relative overflow-hidden rounded-[var(--nui-r-lg)] border border-[var(--nui-brand-deep)] bg-[var(--nui-brand)] shadow-[var(--nui-shadow-3)]">
        {/* Depth: diagonal brand gradient + faded blueprint grid + accent hairline */}
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--nui-brand-deep)_0%,var(--nui-brand)_52%,#176472_100%)]"
        />
        <span aria-hidden="true" className="nui-hero-grid pointer-events-none absolute inset-0" />
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)]"
        />

        <div className="relative flex flex-col gap-7 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0">
                {eyebrow && (
                    <p className="nui-eyebrow text-[10px] font-bold text-[color:var(--nui-text-invert-2)]">
                        {eyebrow}
                    </p>
                )}
                <h1 className="nui-display mt-2 text-[26px] font-semibold leading-[1.1] text-[var(--nui-text-invert)] sm:text-[32px]">
                    {title}
                </h1>
                {context && (
                    <p className="mt-2.5 max-w-xl text-[13px] leading-relaxed text-[color:var(--nui-text-invert-2)]">
                        {context}
                    </p>
                )}

                {tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                        {tags.map(({ label, value }) => (
                            <li
                                key={label}
                                className="inline-flex items-baseline gap-1.5 rounded-[var(--nui-r-pill)] border border-white/20 bg-white/12 px-3 py-1 text-[11.5px] text-[var(--nui-text-invert)] backdrop-blur-[2px]"
                            >
                                {/* label/value hierarchy is carried by weight, not opacity —
                                    dimmed text on the tinted pill would drop below AA */}
                                <span className="font-normal">{label}</span>
                                <span className="font-semibold">{value}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}
            </div>

            {snapshot.length > 0 && (
                <dl
                    className={[
                        "grid w-full flex-shrink-0 gap-px overflow-hidden rounded-[var(--nui-r)] border border-white/15 bg-white/10 sm:w-auto",
                        // Column count follows the number of stats so the rail
                        // never leaves an empty cell.
                        snapshot.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
                    ].join(" ")}
                >
                    {snapshot.map(({ label, value, unit }) => (
                        <div key={label} className="bg-[color:rgba(12,64,90,0.35)] px-5 py-4 sm:min-w-[118px]">
                            <dt className="nui-eyebrow text-[9.5px] font-bold text-[color:var(--nui-text-invert-2)]">
                                {label}
                            </dt>
                            <dd className="nui-num mt-1.5 text-[22px] font-semibold leading-none text-[var(--nui-text-invert)]">
                                {value}
                                {unit && <span className="ml-0.5 text-[13px] font-medium opacity-70">{unit}</span>}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}
        </div>

        {footer && (
            <div className="relative border-t border-white/12 bg-[color:rgba(12,64,90,0.35)] px-6 py-3 sm:px-8">
                {footer}
            </div>
        )}
    </header>
);

export default NuiHero;
