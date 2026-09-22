"use client";

/**
 * InfoTile — small label/value tile for raw inventory facts (organization
 * profile, infrastructure, business operations). Renders "Not reported" for
 * any missing/empty value rather than hiding the tile, so the grid stays
 * visually stable regardless of how much the customer filled in.
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — requires
 * a `.nui`-scoped ancestor. Same props/behavior as before.
 */
const InfoTile = ({ label, value }) => {
    const isEmpty = value === null || value === undefined || value === "";
    const display = isEmpty ? "Not reported" : value;
    return (
        <div className="group bg-[var(--nui-surface)] border border-[var(--nui-line)] hover:border-[color:var(--nui-accent-tint-2)] shadow-[var(--nui-shadow-1)] hover:shadow-[var(--nui-shadow-2)] rounded-[var(--nui-r-sm)] px-4 py-3 transition-all duration-[var(--nui-dur)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--nui-accent)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-[var(--nui-dur)]" />
            <p className="nui-eyebrow text-[10px] font-bold text-[var(--nui-text-3)] mb-1">{label}</p>
            <p className={`text-sm leading-snug ${isEmpty ? "font-medium text-[var(--nui-text-3)] italic" : "font-semibold text-[var(--nui-text)]"}`}>
                {display}
            </p>
        </div>
    );
};

export default InfoTile;
