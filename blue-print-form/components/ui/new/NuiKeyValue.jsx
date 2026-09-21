"use client";

/**
 * NuiKeyValue — a definition list for record-style facts.
 *
 * Semantic <dl>/<dt>/<dd> rather than the old flex rows, so assistive tech
 * reads label/value pairs as pairs. Missing values are stated in words
 * ("Not provided" / "Not reported") and additionally marked with an
 * italic muted treatment — never colour alone.
 */
export const NuiKeyValueList = ({ children, className = "" }) => (
    <dl className={`divide-y divide-[var(--nui-line-soft)] ${className}`}>{children}</dl>
);

export const NuiKeyValue = ({ label, value, optional = false }) => {
    const empty = value === null || value === undefined || value === "";
    const display = empty ? (optional ? "Not provided" : "Missing") : value;

    return (
        <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-4 py-2.5">
            <dt className="text-[12px] font-medium text-[var(--nui-text-3)]">{label}</dt>
            <dd
                title={empty ? undefined : String(value)}
                className={[
                    "min-w-0 break-words text-right text-[13px]",
                    empty
                        ? optional
                            ? "italic text-[var(--nui-text-3)]"
                            : "italic font-medium text-[var(--nui-warn)]"
                        : "font-semibold text-[var(--nui-text)]",
                ].join(" ")}
            >
                {display}
            </dd>
        </div>
    );
};

export default NuiKeyValue;
