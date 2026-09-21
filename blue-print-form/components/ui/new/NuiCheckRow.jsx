"use client";

/**
 * NuiCheckRow — one "control / answer" line inside a checklist panel
 * (facilities, governance). A hairline-separated row rather than a nested
 * card: these are attributes of the panel they sit in, not objects of
 * their own.
 */
const NuiCheckRow = ({ label, children }) => (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--nui-line-soft)] py-2 last:border-0">
        <span className="min-w-0 truncate text-[12.5px] text-[var(--nui-text-2)]">{label}</span>
        <span className="flex-shrink-0">{children}</span>
    </div>
);

export default NuiCheckRow;
