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
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{label}</span>
                <FiChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="px-4 py-4">{children}</div>}
        </div>
    );
};

export default Disclosure;
