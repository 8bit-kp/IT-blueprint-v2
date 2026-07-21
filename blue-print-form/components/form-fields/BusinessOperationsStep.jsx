"use client";

import { memo } from "react";
import { Card, TextInput } from "./FormComponents";

// NOTE: Workflow-signal fields (data flow, provisioning, SSO, MFA, offboarding,
// critical dependencies) are intentionally absent from this section.
// They belong to the dedicated Business Workflows step — see docs/frontend.md.

// ── Module-scope helper components ─────────────────────────────────────────
// IMPORTANT: All helpers are defined at module scope, never inside a render
// body — see docs/project-memory.md for why this matters.

const OptionalBadge = () => (
    <span className="ml-1.5 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wide align-middle">
        Optional
    </span>
);

const HelperText = ({ text }) =>
    text ? <p className="mt-1 text-xs text-gray-400 leading-relaxed">{text}</p> : null;

// Pill-style single-select button group — reused for Customer Type, Geographic
// Reach, and Business Priority selections.
const OptionGroup = ({ options, value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const isActive = value === opt;
            return (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(isActive ? "" : opt)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-all duration-150 ${
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

// Multi-select chip group — used for Operational Challenges.
const MultiSelectChips = ({ options, values = [], onChange }) => {
    const toggle = (opt) => {
        if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
        else onChange([...values, opt]);
    };
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 ${
                        values.includes(opt)
                            ? "bg-[#15587B] text-white border-[#15587B]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#34808A] hover:text-[#15587B]"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
};

// ── Constants ───────────────────────────────────────────────────────────────

const CUSTOMER_TYPE_OPTIONS = ["B2B", "B2C", "Government", "Mixed"];
const GEOGRAPHIC_REACH_OPTIONS = ["Local", "National", "International"];
const PRIORITY_OPTIONS = ["Growth", "Security", "Compliance", "Cost Reduction", "Operational Efficiency"];
const LOCATION_OPTIONS = ["1", "2–5", "6–10", "11–25", "26+"];
const CHALLENGE_OPTIONS = [
    "Security",
    "Downtime",
    "Compliance",
    "Growth",
    "Cost Management",
    "Remote Workforce",
    "Legacy Systems",
    "Vendor Management",
    "Other",
];

// ── Main Component ──────────────────────────────────────────────────────────

const BusinessOperationsStep = memo(({ formData, setField }) => {
    return (
        <>
            {/* ── Section 1: Business Context ─────────────────────────────── */}
            <Card title="Business Context" className="max-w-5xl mx-auto">
                <p className="text-xs text-gray-400 mb-6">
                    This section helps your Consltek advisor understand your organisation's operating model before
                    the consultation. All fields are optional.
                </p>

                <div className="space-y-6">

                    {/* Primary Business Function + Products / Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Primary Business Function<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="e.g. Healthcare delivery, legal services, manufacturing"
                                value={formData.primaryBusinessFunction}
                                onChange={(v) => setField("primaryBusinessFunction", v)}
                            />
                            <HelperText text="Briefly describe what the organisation does at its core." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Main Products or Services<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="e.g. Cloud ERP platform, insurance underwriting"
                                value={formData.mainProductsServices}
                                onChange={(v) => setField("mainProductsServices", v)}
                            />
                            <HelperText text="The key offerings your organisation delivers to customers." />
                        </div>
                    </div>

                    {/* Customer Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Customer Type<OptionalBadge />
                        </label>
                        <OptionGroup
                            options={CUSTOMER_TYPE_OPTIONS}
                            value={formData.primaryCustomerType}
                            onChange={(v) => setField("primaryCustomerType", v)}
                        />
                        <HelperText text="Who your organisation primarily sells to or serves." />
                    </div>

                    {/* Geographic Reach + Number of Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Geographic Reach<OptionalBadge />
                            </label>
                            <OptionGroup
                                options={GEOGRAPHIC_REACH_OPTIONS}
                                value={formData.geographicReach}
                                onChange={(v) => setField("geographicReach", v)}
                            />
                            <HelperText text="The geographic scope of your operations or customer base." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Business Locations<OptionalBadge />
                            </label>
                            <OptionGroup
                                options={LOCATION_OPTIONS}
                                value={formData.numberOfLocations}
                                onChange={(v) => setField("numberOfLocations", v)}
                            />
                            <HelperText text="Approximate number of offices, branches, or sites." />
                        </div>
                    </div>
                </div>
            </Card>

            {/* ── Section 2: Business Criticality ─────────────────────────── */}
            <Card title="Business Criticality" className="max-w-5xl mx-auto mt-6">
                <p className="text-xs text-gray-400 mb-6">
                    Helps your advisor prioritise findings and focus the consultation on what matters most.
                    All fields are optional.
                </p>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Most Critical Business Function<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="e.g. Billing and invoicing, patient scheduling"
                                value={formData.criticalBusinessFunction}
                                onChange={(v) => setField("criticalBusinessFunction", v)}
                            />
                            <HelperText text="The single function that most affects revenue or operations if disrupted." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Systems That Cannot Experience Downtime<OptionalBadge />
                            </label>
                            <TextInput
                                placeholder="e.g. Payment processing, patient management system"
                                value={formData.systemsRequiring24x7}
                                onChange={(v) => setField("systemsRequiring24x7", v)}
                            />
                            <HelperText text="Systems or services where any outage has an immediate operational or financial impact." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Highest Business Priority<OptionalBadge />
                        </label>
                        <OptionGroup
                            options={PRIORITY_OPTIONS}
                            value={formData.highestBusinessPriority}
                            onChange={(v) => setField("highestBusinessPriority", v)}
                        />
                        <HelperText text="The strategic priority that most influences IT decisions right now." />
                    </div>
                </div>
            </Card>

            {/* ── Section 3: Operational Challenges ───────────────────────── */}
            <Card title="Operational Challenges" className="max-w-5xl mx-auto mt-6">
                <p className="text-xs text-gray-400 mb-5">
                    Select any challenges your organisation is currently experiencing. This helps your advisor
                    focus the consultation on your most pressing areas.
                </p>

                <MultiSelectChips
                    options={CHALLENGE_OPTIONS}
                    values={formData.operationalChallenges || []}
                    onChange={(v) => setField("operationalChallenges", v)}
                />

                {(formData.operationalChallenges || []).length > 0 && (
                    <p className="mt-3 text-xs text-[#34808A] font-medium">
                        {formData.operationalChallenges.length} challenge
                        {formData.operationalChallenges.length !== 1 ? "s" : ""} selected
                    </p>
                )}
            </Card>

        </>
    );
});

export default BusinessOperationsStep;
