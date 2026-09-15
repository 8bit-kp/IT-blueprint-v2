"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Disclosure — collapsible detail panel (default closed) used to tuck
 * away audit-trail-level detail (e.g. the score deduction waterfall,
 * data availability notes) behind a single toggle, so the primary
 * section content stays scannable.
 */
const Disclosure = ({ label, defaultOpen = false, children }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`border rounded-xl overflow-hidden transition-colors ${open ? "border-[#34808A]/30" : "border-gray-200"}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={[
                    "w-full flex items-center justify-between gap-2 px-4 py-3 cursor-pointer transition-colors",
                    open ? "bg-[#15587B]/[0.06] hover:bg-[#15587B]/10" : "bg-gray-50 hover:bg-[#15587B]/[0.06]",
                ].join(" ")}
            >
                <span className={`text-xs font-bold uppercase tracking-wide ${open ? "text-[#15587B]" : "text-gray-700"}`}>
                    {label}
                </span>
                <span
                    className={[
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                        open ? "bg-[#15587B] text-white" : "bg-white border border-gray-300 text-gray-500",
                    ].join(" ")}
                >
                    <FiChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </span>
            </button>
            {open && <div className="px-4 py-4 border-t border-[#34808A]/15">{children}</div>}
        </div>
    );
};

export default Disclosure;
