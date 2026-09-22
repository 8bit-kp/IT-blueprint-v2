"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Disclosure — collapsible detail panel (default closed) used to tuck
 * away audit-trail-level detail (e.g. the score deduction waterfall,
 * data availability notes) behind a single toggle, so the primary
 * section content stays scannable.
 *
 * Restyled to the shared design system (styles/new-ui/tokens.css) — requires
 * a `.nui`-scoped ancestor. Same props/behavior as before.
 */
const Disclosure = ({ label, defaultOpen = false, children }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`border rounded-[var(--nui-r-sm)] overflow-hidden transition-colors duration-[var(--nui-dur)] ${open ? "border-[color:var(--nui-accent-tint-2)]" : "border-[var(--nui-line)]"}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={[
                    "w-full flex items-center justify-between gap-2 px-4 py-3 cursor-pointer transition-colors duration-[var(--nui-dur-fast)]",
                    open ? "bg-[var(--nui-accent-tint)] hover:bg-[color:var(--nui-accent-tint-2)]" : "bg-[var(--nui-surface-sunk)] hover:bg-[var(--nui-accent-tint)]",
                ].join(" ")}
            >
                <span className={`text-xs font-bold uppercase tracking-wide ${open ? "text-[var(--nui-brand)]" : "text-[var(--nui-text-2)]"}`}>
                    {label}
                </span>
                <span
                    className={[
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-[var(--nui-dur-fast)]",
                        open ? "bg-[var(--nui-brand)] text-white" : "bg-[var(--nui-surface)] border border-[var(--nui-line-strong)] text-[var(--nui-text-3)]",
                    ].join(" ")}
                >
                    <FiChevronDown size={13} className={`transition-transform duration-[var(--nui-dur-fast)] ${open ? "rotate-180" : ""}`} />
                </span>
            </button>
            {open && <div className="px-4 py-4 border-t border-[color:var(--nui-accent-tint-2)]">{children}</div>}
        </div>
    );
};

export default Disclosure;
