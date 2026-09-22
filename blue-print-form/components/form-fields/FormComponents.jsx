"use client";

import { memo, useState, useEffect, useRef } from "react";
import { getPriorityButtonClass } from "@/constants/colors";

// ── Custom Vendor Modal ────────────────────────────────────────────────────
// IMPORTANT: defined at module scope — never inside a render body.
// See docs/project-memory.md: components defined inside render bodies cause
// React to unmount/remount the subtree on every render.

const CustomVendorModal = ({ existingVendors, onConfirm, onCancel }) => {
    const inputRef = useRef(null);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(t);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleConfirm();
        if (e.key === "Escape") onCancel();
    };

    const handleConfirm = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError("Vendor name cannot be empty.");
            return;
        }
        if (existingVendors.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
            setError("This vendor already exists in the list.");
            return;
        }
        onConfirm(trimmed);
    };

    return (
        <div className="nui fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[color:rgba(15,42,56,0.45)] backdrop-blur-sm" onClick={onCancel} />
            {/* Dialog */}
            <div className="relative bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r-lg)] shadow-[var(--nui-shadow-3)] w-full max-w-sm p-6 z-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[var(--nui-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="nui-display text-[14px] font-semibold text-[var(--nui-text)]">Add Custom Vendor</h2>
                        <p className="text-xs text-[var(--nui-text-3)]">Enter the vendor name to add it to the list.</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-[10px] font-bold text-[var(--nui-text-3)] mb-1.5 uppercase tracking-wide">
                        Vendor Name
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. CrowdStrike, Palo Alto…"
                        className="w-full rounded-[var(--nui-r-sm)] border border-[var(--nui-line-strong)] px-3 py-2.5 text-sm text-[var(--nui-text)] placeholder:text-[var(--nui-text-3)] focus:border-[var(--nui-accent)] focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:outline-offset-1 outline-none transition"
                    />
                    {error && <p className="mt-1.5 text-xs font-medium text-[var(--nui-risk)]">{error}</p>}
                </div>

                <div className="flex gap-3 justify-end">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[var(--nui-text-2)] bg-[var(--nui-surface-sunk)] hover:bg-[var(--nui-line-soft)] rounded-[var(--nui-r-sm)] transition">
                        Cancel
                    </button>
                    <button type="button" onClick={handleConfirm} className="px-5 py-2 text-sm font-bold text-white bg-[var(--nui-accent)] hover:bg-[var(--nui-accent-hover)] rounded-[var(--nui-r-sm)] shadow-[var(--nui-shadow-1)] transition">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Card = ({ id, title, children, className = "" }) => (
    <div id={id} className={`bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r)] shadow-[var(--nui-shadow-1)] overflow-hidden ${className}`}>
        {title && (
            <div className="px-5 pt-4 pb-3 border-b border-[var(--nui-line-soft)] flex items-center gap-2.5">
                <div className="h-4 w-1 bg-[var(--nui-accent)] rounded-full flex-shrink-0" />
                <h3 className="nui-display font-semibold text-[var(--nui-text)] text-[13.5px]">{title}</h3>
            </div>
        )}
        <div className="p-5">{children}</div>
    </div>
);

export const ToggleButton = memo(({ options, value, onChange }) => {
    return (
        <div className="inline-flex bg-[var(--nui-surface-sunk)] p-1 rounded-[var(--nui-r-sm)] border border-[var(--nui-line)] w-max">
            {options.map((opt) => {
                const isActive = value === opt;

                // Fixed-meaning semantic colors — same rule as the rest of the
                // design system: Yes/No are never reskinned to brand teal.
                let activeClass = "bg-[var(--nui-surface)] text-[var(--nui-text)] shadow-[var(--nui-shadow-1)] border border-[var(--nui-line)]";
                if (isActive) {
                    if (opt === "Yes") activeClass = "bg-[var(--nui-ok)] text-white shadow-[var(--nui-shadow-1)]";
                    else if (opt === "No") activeClass = "bg-[var(--nui-risk)] text-white shadow-[var(--nui-shadow-1)]";
                    else activeClass = "bg-[var(--nui-accent)] text-white shadow-[var(--nui-shadow-1)]";
                }

                return (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-[var(--nui-r-xs)] transition-all duration-150 ${isActive
                            ? activeClass
                            : "text-[var(--nui-text-3)] hover:text-[var(--nui-text)] hover:bg-[var(--nui-line-soft)]"
                            }`}
                        type="button"
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
});

export const TextInput = memo(({ placeholder, value, onChange, type = "text", className = "", error = false }) => {
    const [localValue, setLocalValue] = useState(value || "");
    const timerRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onChange(newValue);
        }, 300);
    };

    const handleBlur = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (localValue !== value) onChange(localValue);
    };

    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`block w-full rounded-[var(--nui-r-sm)] border sm:text-sm p-2.5 text-[var(--nui-text)] placeholder:text-[var(--nui-text-3)] transition-colors ${error ? "border-[var(--nui-risk-line)] focus:border-[var(--nui-risk)] bg-[var(--nui-risk-bg)]" : "border-[var(--nui-line-strong)] bg-[var(--nui-surface)] focus:border-[var(--nui-accent)]"} outline-none focus-visible:ring-2 focus-visible:ring-[var(--nui-accent)]/40 ${className}`}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
});

export const RangeInput = memo(({ label, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || 0);
    const timerRef = useRef(null);

    useEffect(() => {
        setLocalValue(value || 0);
    }, [value]);

    const handleChange = (e) => {
        const newValue = Number(e.target.value);
        setLocalValue(newValue);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onChange(newValue);
        }, 200);
    };

    return (
        <div className="bg-[var(--nui-surface-sunk)] p-4 rounded-[var(--nui-r)] border border-[var(--nui-line)]">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-[var(--nui-text-2)]">{label}</label>
                <span className="nui-num text-sm font-semibold text-[var(--nui-brand)] bg-[var(--nui-accent-tint)] px-2 py-0.5 rounded-[var(--nui-r-xs)]">
                    {localValue}%
                </span>
            </div>

            <input
                type="range"
                min="0"
                max="100"
                value={localValue}
                onChange={handleChange}
                style={{
                    background: `linear-gradient(to right, var(--nui-accent) ${localValue}%, var(--nui-line-strong) ${localValue}%)`
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-transparent"
            />
        </div>
    );
});

export const YesNo = memo(({ label, value, onChange }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-[var(--nui-line-soft)] last:border-b gap-2 sm:gap-8">
        <span className="text-sm font-medium text-[var(--nui-text-2)] sm:min-w-[250px]">{label}</span>
        <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
    </div>
));

export const YesNoCompact = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center text-xs text-[var(--nui-text-2)]">
        <span className="font-medium">{label}</span>
        <div className="flex bg-[var(--nui-surface-sunk)] rounded-[var(--nui-r-sm)] p-1 border border-[var(--nui-line)]">
            <button
                type="button"
                onClick={() => onChange("Yes")}
                className={`px-3 py-1 rounded-[var(--nui-r-xs)] text-xs font-bold transition-all duration-150 ${value === "Yes" ? "bg-[var(--nui-ok)] text-white shadow-[var(--nui-shadow-1)]" : "text-[var(--nui-text-3)] hover:text-[var(--nui-text)] hover:bg-[var(--nui-line-soft)]"}`}
            >
                Yes
            </button>
            <button
                type="button"
                onClick={() => onChange("No")}
                className={`px-3 py-1 rounded-[var(--nui-r-xs)] text-xs font-bold transition-all duration-150 ${value === "No" ? "bg-[var(--nui-risk)] text-white shadow-[var(--nui-shadow-1)]" : "text-[var(--nui-text-3)] hover:text-[var(--nui-text)] hover:bg-[var(--nui-line-soft)]"}`}
            >
                No
            </button>
        </div>
    </div>
);

export const MultiCheckbox = memo(({ label, options, values = [], onChange }) => {
    const toggle = (opt) => {
        if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
        else onChange([...values, opt]);
    };

    return (
        <div className="mb-4">
            <p className="text-sm font-medium text-[var(--nui-text-2)] mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`px-3 py-1.5 text-xs rounded-[var(--nui-r-pill)] border transition-all ${values.includes(opt)
                            ? "bg-[var(--nui-accent)] text-white border-[var(--nui-accent)]"
                            : "bg-[var(--nui-surface)] text-[var(--nui-text-2)] border-[var(--nui-line-strong)] hover:border-[var(--nui-accent)]"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
});

export const TechnicalControlCard = memo(({ label, data, onChange, vendors, initialTechControlState }) => {
    const { choice, vendor, businessPriority, offering } = data || initialTechControlState;
    const [showCustomModal, setShowCustomModal] = useState(false);

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Set default priority to "Critical" if not set
    const currentPriority = businessPriority || "Critical";
    // Set default offering to "SaaS" if not set
    const currentOffering = offering || "SaaS";

    // Determine if the current vendor value is a custom one (not in the predefined list
    // and not empty / not "Others"). If so, inject it as an option so the dropdown
    // renders consistently after page reload or step navigation.
    const isCustomVendor = vendor && vendor !== "Others" && !vendors.includes(vendor);

    // Full option list: predefined + injected custom (if applicable).
    // "Others" is always the last item in `vendors` (per vendors.js convention).
    const vendorOptions = isCustomVendor
        ? [...vendors.slice(0, -1), vendor, vendors[vendors.length - 1]] // insert before "Others"
        : vendors;

    const handleVendorChange = (e) => {
        const selected = e.target.value;
        if (selected === "Others") {
            // Open modal instead of storing "Others" directly.
            setShowCustomModal(true);
        } else {
            handleChange("vendor", selected);
        }
    };

    const handleCustomVendorConfirm = (customName) => {
        setShowCustomModal(false);
        // Store the custom name directly — same field, same format as built-in vendors.
        handleChange("vendor", customName);
    };

    return (
        <>
            {showCustomModal && (
                <CustomVendorModal
                    existingVendors={vendors}
                    onConfirm={handleCustomVendorConfirm}
                    onCancel={() => setShowCustomModal(false)}
                />
            )}

            <div className="group relative border border-[var(--nui-line)] rounded-[var(--nui-r)] p-4 hover:border-[var(--nui-line-strong)] hover:shadow-[var(--nui-shadow-2)] transition-[box-shadow,border-color] duration-[var(--nui-dur)] bg-[var(--nui-surface)] shadow-[var(--nui-shadow-1)] flex flex-col justify-between h-full overflow-hidden">
                <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--nui-accent)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-[var(--nui-dur)]" />
                <div>
                    <p className="font-semibold text-[var(--nui-text)] mb-3 text-sm">{label}</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <ToggleButton
                                options={["Yes", "No"]}
                                value={choice}
                                onChange={(val) => handleChange("choice", val)}
                            />
                        </div>

                        {choice === "Yes" && (
                            <select
                                value={isCustomVendor ? vendor : (vendor || "")}
                                onChange={handleVendorChange}
                                className="text-sm rounded-[var(--nui-r-sm)] border border-[var(--nui-line-strong)] focus:border-[var(--nui-accent)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--nui-accent)]/40 w-full p-2 text-[var(--nui-text)] bg-[var(--nui-surface)]"
                            >
                                <option value="">Select Vendor...</option>
                                {vendorOptions.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--nui-line-soft)] space-y-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--nui-text-3)] block mb-2 tracking-wide">Business Priority</label>
                        <div className="flex gap-1.5">
                            {["High", "Medium", "Critical"].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => handleChange("businessPriority", priority)}
                                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-[var(--nui-r-xs)] transition-all duration-200 ${getPriorityButtonClass(priority, currentPriority)}`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--nui-text-3)] block mb-1 tracking-wide">Offering</label>
                        <select
                            className="w-full text-xs rounded-[var(--nui-r-xs)] border border-[var(--nui-line)] bg-[var(--nui-surface-sunk)] focus:bg-[var(--nui-surface)] focus:border-[var(--nui-accent)] outline-none transition p-1 text-[var(--nui-text)]"
                            value={currentOffering}
                            onChange={(e) => handleChange("offering", e.target.value)}
                        >
                            <option value="SaaS">SaaS</option>
                            <option value="On-premise">On-prem</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
});
