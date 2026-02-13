"use client";

import { memo, useState, useEffect, useRef } from "react";

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
        <div className="flex bg-gray-100 p-1 rounded-lg w-max shadow-inner">
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
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-bold text-[#34808A]">{localValue}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={localValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#34808A]"
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
        <div className="flex bg-gray-100 rounded p-0.5 shadow-inner">
            <button
                type="button"
                onClick={() => onChange("Yes")}
                className={`px-2.5 py-0.5 rounded transition-all duration-200 ${value === "Yes" ? "bg-green-600 shadow text-white font-bold scale-105" : "text-gray-400 hover:text-gray-600"}`}
            >
                Y
            </button>
            <button
                type="button"
                onClick={() => onChange("No")}
                className={`px-2.5 py-0.5 rounded transition-all duration-200 ${value === "No" ? "bg-red-600 shadow text-white font-bold scale-105" : "text-gray-400 hover:text-gray-600"}`}
            >
                N
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

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Set default priority to "Critical" if not set
    const currentPriority = businessPriority || "Critical";
    // Set default offering to "SaaS" if not set
    const currentOffering = offering || "SaaS";

    return (
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
                            value={vendor || ""}
                            onChange={(e) => handleChange("vendor", e.target.value)}
                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[#34808A] focus:ring-[#34808A] w-full p-2 border text-gray-900"
                        >
                            <option value="">Select Vendor...</option>
                            {vendors.map((v) => <option key={v} value={v}>{v}</option>)}
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
                                className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${currentPriority === priority
                                    ? priority === "Critical"
                                        ? "bg-red-600 text-white shadow-md ring-1 ring-red-700"
                                        : priority === "High"
                                            ? "bg-orange-500 text-white shadow-md ring-1 ring-orange-600"
                                            : "bg-blue-500 text-white shadow-md ring-1 ring-blue-600"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
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
    );
});
