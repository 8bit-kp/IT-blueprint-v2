"use client";

/**
 * NuiFact — a compact label/value tile for inventory facts that do not
 * warrant a full card (server config, wireless auth, office counts …).
 * Sits directly on the canvas as a light surface, not as another card.
 */
const NuiFact = ({ label, value, sub, emphasis = false, children }) => (
    <div className="rounded-[var(--nui-r-sm)] border border-[var(--nui-line)] bg-[var(--nui-surface)] px-3.5 py-3">
        <p className="nui-eyebrow mb-1.5 text-[9.5px] font-bold text-[var(--nui-text-3)]">{label}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {children ?? (
                <span
                    className={[
                        "nui-num text-[13px] font-semibold",
                        emphasis ? "text-[var(--nui-brand)]" : "text-[var(--nui-text)]",
                        value === null || value === undefined || value === "" ? "text-[var(--nui-text-3)]" : "",
                    ].join(" ")}
                >
                    {value === null || value === undefined || value === "" ? "—" : value}
                </span>
            )}
            {sub && <span className="text-[10.5px] text-[var(--nui-text-3)]">{sub}</span>}
        </div>
    </div>
);

export default NuiFact;
