"use client";

import { memo, useState } from "react";
import { Card, TextInput, RangeInput } from "./FormComponents";
import ConfidentialityNotice from "@/components/trust/ConfidentialityNotice";

// Accepts any common North-American or international phone format.
// Allows digits, spaces, dashes, dots, parentheses, and a leading +.
// Min 7 digits after stripping non-numeric chars; max 15 (E.164 limit).
const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

// ── Module-scope helper components (never inside render body) ──────────────

const RequiredMark = () => (
    <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
);

const OptionalBadge = () => (
    <span className="ml-1.5 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wide align-middle">
        Optional
    </span>
);

const FieldError = ({ message }) =>
    message ? (
        <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1">
            <svg className="w-3 h-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {message}
        </p>
    ) : null;

const HelperText = ({ text }) =>
    text ? <p className="mt-1 text-xs text-gray-400 leading-relaxed">{text}</p> : null;

// Pill-style button group for selecting a single option from a short list.
// Used for Deployment Model, IT Management, MSP Relationship.
const OptionGroup = ({ options, value, onChange, error }) => (
    <div className={`flex flex-wrap gap-2 ${error ? "p-2 rounded-lg border border-red-200 bg-red-50/30" : ""}`}>
        {options.map(opt => {
            const isActive = value === opt;
            return (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg border transition-all duration-150 ${
                        isActive
                            ? "bg-[#15587B] text-white border-[#15587B] shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#34808A] hover:text-[#15587B] hover:bg-gray-50"
                    }`}
                >
                    {opt}
                </button>
            );
        })}
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────

const CompanyInfoStep = memo(({ formData, setField, errors = {}, clearError }) => {
    const [phoneError, setPhoneError] = useState("");

    const handlePhoneChange = (v) => {
        setField("phoneNumber", v);
        if (v && !PHONE_RE.test(v)) {
            setPhoneError("Enter a valid phone number (e.g. +1 555-000-0000).");
        } else {
            setPhoneError("");
        }
    };

    // Update a required field and clear its validation error.
    const handleRequired = (key, value) => {
        setField(key, value);
        if (clearError) clearError(key);
    };

    return (
        <>
            <ConfidentialityNotice />
            <Card title="General Information" className="max-w-5xl mx-auto">
                <p className="text-xs text-gray-400 mb-6">
                    Fields marked <span className="text-red-500">*</span> are required to proceed. All other fields are optional and improve the accuracy of your Current State Report.
                </p>

                <div className="space-y-8">

                    {/* ── Organisation Details ──────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name<RequiredMark />
                            </label>
                            <TextInput
                                placeholder="e.g. Acme Corp"
                                value={formData.companyName}
                                onChange={(v) => handleRequired("companyName", v)}
                                error={!!errors.companyName}
                            />
                            <HelperText text="The organisation being assessed." />
                            <FieldError message={errors.companyName} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Person<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="Full Name"
                                value={formData.contactName}
                                onChange={(v) => setField("contactName", v)}
                            />
                            <HelperText text="The individual responsible for completing this assessment." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address<RequiredMark />
                            </label>
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(v) => handleRequired("email", v)}
                                error={!!errors.email}
                            />
                            <HelperText text="Your advisor will use this address to follow up and schedule your consultation." />
                            <FieldError message={errors.email} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="+1 (555) 000-0000"
                                value={formData.phoneNumber}
                                onChange={handlePhoneChange}
                            />
                            {phoneError ? (
                                <FieldError message={phoneError} />
                            ) : (
                                <HelperText text="An alternate contact method for your advisor." />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Industry<RequiredMark />
                            </label>
                            <select
                                className={`block w-full rounded-md border shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5 text-gray-900 ${
                                    errors.industry ? "border-red-300 bg-red-50/30" : "border-gray-300"
                                }`}
                                value={formData.industry || ""}
                                onChange={(e) => handleRequired("industry", e.target.value)}
                            >
                                <option value="">Select your industry...</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Financial">Financial Services</option>
                                <option value="Retail">Retail</option>
                                <option value="Education">Education</option>
                                <option value="County-Cities">Government / Municipal</option>
                                <option value="Other">Other</option>
                            </select>
                            <HelperText text="Helps contextualise your assessment findings." />
                            <FieldError message={errors.industry} />
                            {formData.industry === "Other" && (
                                <div className="mt-2">
                                    <TextInput
                                        placeholder="Specify industry"
                                        value={formData.otherIndustry}
                                        onChange={(v) => setField("otherIndustry", v)}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Organisation Size<RequiredMark />
                            </label>
                            <select
                                className={`block w-full rounded-md border shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5 text-gray-900 ${
                                    errors.employees ? "border-red-300 bg-red-50/30" : "border-gray-300"
                                }`}
                                value={formData.employees || ""}
                                onChange={(e) => handleRequired("employees", e.target.value)}
                            >
                                <option value="">Select employee band...</option>
                                <option value="1-100">1 – 100 employees</option>
                                <option value="101-500">101 – 500 employees</option>
                                <option value="501-1000">501 – 1,000 employees</option>
                                <option value="1001+">1,001+ employees</option>
                            </select>
                            <HelperText text="Approximate headcount — an exact number is not required." />
                            <FieldError message={errors.employees} />
                        </div>
                    </div>

                    {/* ── IT Environment (Required) ─────────────────────────────── */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold text-gray-800">IT Environment Overview</h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                                These three fields are required. They help your advisor understand your environment before your consultation.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Deployment Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deployment Model<RequiredMark />
                                </label>
                                <OptionGroup
                                    options={["Cloud", "On-Prem", "Hybrid"]}
                                    value={formData.deploymentModel}
                                    onChange={(v) => handleRequired("deploymentModel", v)}
                                    error={!!errors.deploymentModel}
                                />
                                <HelperText text="Where your primary IT systems are hosted: cloud-only, on-premises, or a combination of both." />
                                <FieldError message={errors.deploymentModel} />
                            </div>

                            {/* IT Management */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IT Management<RequiredMark />
                                </label>
                                <OptionGroup
                                    options={["Internal", "Outsourced", "Mixed"]}
                                    value={formData.itManagement}
                                    onChange={(v) => handleRequired("itManagement", v)}
                                    error={!!errors.itManagement}
                                />
                                <HelperText text="Whether your IT is managed by internal staff, an external provider, or a combination of both." />
                                <FieldError message={errors.itManagement} />
                            </div>

                            {/* MSP Relationship */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Existing MSP Relationship<RequiredMark />
                                </label>
                                <OptionGroup
                                    options={["Yes", "No"]}
                                    value={formData.mspRelationship}
                                    onChange={(v) => handleRequired("mspRelationship", v)}
                                    error={!!errors.mspRelationship}
                                />
                                <HelperText text="Does your organisation currently have a contract with a Managed Service Provider?" />
                                <FieldError message={errors.mspRelationship} />
                                {formData.mspRelationship === "Yes" && (
                                    <div className="mt-3 pl-1">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            MSP Name<OptionalBadge />
                                        </label>
                                        <TextInput
                                            placeholder="e.g. Acme Managed Services"
                                            value={formData.mspName || ""}
                                            onChange={(v) => setField("mspName", v)}
                                        />
                                        <HelperText text="Helps your advisor engage the right stakeholders." />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Staffing Breakdown (Optional) ────────────────────────── */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700">
                                Staffing Breakdown<OptionalBadge />
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                                These figures help contextualise your IT environment. Skip this section if the information is not readily available.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RangeInput
                                label="Remote Workers"
                                value={formData.remotePercentage}
                                onChange={(v) => setField("remotePercentage", v)}
                            />
                            <RangeInput
                                label="Contractors"
                                value={formData.contractorPercentage}
                                onChange={(v) => setField("contractorPercentage", v)}
                            />
                        </div>
                    </div>

                </div>
            </Card>
        </>
    );
});

export default CompanyInfoStep;
