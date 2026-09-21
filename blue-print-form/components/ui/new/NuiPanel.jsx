"use client";

/**
 * NuiPanel — the single surface primitive of the new UI.
 *
 * Deliberately has tones rather than "one card style for everything", so a
 * page can decide per block whether something is a real elevated object, a
 * quiet grouping, a recessed data well, or a branded highlight. The old
 * summary page wrapped every single block in the same white rounded card;
 * that flatness is the main thing these tones exist to fix.
 *
 *   tone="raised"    white surface, hairline border, soft elevation  (default)
 *   tone="flat"      white surface, hairline border, no elevation
 *   tone="sunk"      recessed neutral well — for tables / dense data
 *   tone="quiet"     near-canvas surface — grouping without an object
 *   tone="brand"     deep teal panel, inverted text — one per view, max
 *
 * `interactive` adds a hover lift + a brand accent rail on the left edge.
 * It is presentational only; it does not make the panel clickable.
 */
const TONES = {
    raised: "bg-[var(--nui-surface)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-2)]",
    flat:   "bg-[var(--nui-surface)] border border-[var(--nui-line)]",
    sunk:   "bg-[var(--nui-surface-sunk)] border border-[var(--nui-line)]",
    quiet:  "bg-[var(--nui-surface-quiet)] border border-[var(--nui-line-soft)]",
    brand:  "bg-[var(--nui-brand)] border border-[var(--nui-brand-deep)] shadow-[var(--nui-shadow-3)] text-[var(--nui-text-invert)]",
};

const NuiPanel = ({
    tone = "raised",
    interactive = false,
    className = "",
    children,
    as: Tag = "div",
    ...rest
}) => (
    <Tag
        className={[
            "group/panel relative rounded-[var(--nui-r)] overflow-hidden",
            "transition-[box-shadow,transform,border-color] duration-[var(--nui-dur)] ease-[var(--nui-ease)]",
            TONES[tone] || TONES.raised,
            interactive
                ? "hover:shadow-[var(--nui-shadow-3)] hover:border-[var(--nui-line-strong)] hover:-translate-y-px"
                : "",
            className,
        ].join(" ")}
        {...rest}
    >
        {interactive && (
            <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--nui-accent)] origin-top scale-y-0 group-hover/panel:scale-y-100 transition-transform duration-[var(--nui-dur)] ease-[var(--nui-ease)]"
            />
        )}
        {children}
    </Tag>
);

export default NuiPanel;
