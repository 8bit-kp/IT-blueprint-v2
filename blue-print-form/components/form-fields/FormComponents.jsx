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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[#34808A]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#34808A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#15587B]">Add Custom Vendor</h2>
                        <p className="text-xs text-gray-500">Enter the vendor name to add it to the list.</p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Vendor Name
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. CrowdStrike, Palo Alto…"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#34808A] focus:ring-1 focus:ring-[#34808A] outline-none transition"
                    />
                    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
                </div>

                <div className="flex gap-3 justify-end">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        Cancel
                    </button>
                    <button type="button" onClick={handleConfirm} className="px-5 py-2 text-sm font-bold text-white bg-[#34808A] hover:bg-[#2b6f6f] rounded-lg shadow-sm transition">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#34808A] rounded-full"></div>
                <h3 className="font-semibold text-[#15587B] text-sm uppercase tracking-wide">{title}</h3>
            </div>
        )}
        <div className="p-5">{children}</div>
    </div>
);

export const ToggleButton = memo(({ options, value, onChange }) => {
    return (
        <div className="flex bg-gray-100 p-1 rounded-lg w-max shadow-inner ring-2 ring-[#34808A]/50 shadow-[#34808A]/30">
            {options.map((opt) => {
                const isActive = value === opt;

                // Meaningful colors
                let activeClass = "bg-white text-[#15587B] shadow-sm ring-1 ring-gray-200";
                if (isActive) {
                    if (opt === "Yes") activeClass = "bg-green-600 text-white shadow-md ring-1 ring-green-700";
                    else if (opt === "No") activeClass = "bg-red-600 text-white shadow-md ring-1 ring-red-700";
                    else activeClass = "bg-[#34808A] text-white shadow-md ring-1 ring-[#2b6d75]";
                }

                return (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-md transition-all duration-200 ${isActive
                            ? activeClass
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
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

export const TextInput = memo(({ placeholder, value, onChange, type = "text", className = "" }) => {
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
            className={`block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-1 focus:ring-[#34808A] sm:text-sm p-2.5 text-gray-900 placeholder:text-gray-500 ${className}`}
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
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-semibold text-[#34808A] bg-[#34808A]/10 px-2 py-0.5 rounded">
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
                    background: `linear-gradient(to right, #34808A ${localValue}%, #e5e7eb ${localValue}%)`
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-transparent"
            />
        </div>
    );
});

export const YesNo = memo(({ label, value, onChange }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-200 last:border-b gap-2 sm:gap-8">
        <span className="text-sm font-medium text-gray-700 sm:min-w-[250px]">{label}</span>
        <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
    </div>
));

export const YesNoCompact = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center text-xs text-gray-600">
        <span className="font-medium">{label}</span>
        <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner ring-2 ring-[#34808A]/50 shadow-[#34808A]/30">
            <button
                type="button"
                onClick={() => onChange("Yes")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 ${value === "Yes" ? "bg-green-600 text-white shadow-md ring-1 ring-green-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
            >
                Yes
            </button>
            <button
                type="button"
                onClick={() => onChange("No")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 ${value === "No" ? "bg-red-600 text-white shadow-md ring-1 ring-red-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
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
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${values.includes(opt)
                            ? "bg-[#34808A] text-white border-[#34808A]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
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

            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#34808A] transition bg-white shadow-sm flex flex-col justify-between h-full">
                <div>
                    <p className="font-semibold text-gray-800 mb-3 text-sm">{label}</p>
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
                                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[#34808A] focus:ring-[#34808A] w-full p-2 border text-gray-900"
                            >
                                <option value="">Select Vendor...</option>
                                {vendorOptions.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Business Priority</label>
                        <div className="flex gap-1.5">
                            {["High", "Medium", "Critical"].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => handleChange("businessPriority", priority)}
                                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${getPriorityButtonClass(priority, currentPriority)}`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Offering</label>
                        <select
                            className="w-full text-xs border-gray-200 rounded bg-gray-50 focus:bg-white transition p-1 border text-gray-900"
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
