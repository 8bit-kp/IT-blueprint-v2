import React from "react";
import { getPriorityChipClass } from "@/constants/colors";
import { getVendors } from "@/constants/vendors";

const OperationalDashboard = ({ formData, updateField }) => {
    const infrastructureVendors = [
        { label: "WAN 1", key: "WAN1" },
        { label: "WAN 2", key: "WAN2" },
        { label: "WAN 3", key: "WAN3" },
        { label: "Switching Vendor", key: "switchingVendor" },
        { label: "Routing Vendor", key: "routingVendor" },
        { label: "Wireless Vendor", key: "wirelessVendor" },
        { label: "Baremetal Vendor", key: "baremetalVendor" },
        { label: "Virtualization Vendor", key: "virtualizationVendor" },
        { label: "Cloud Vendor", key: "cloudVendor" },
    ];

    const networkConfig = [
        { label: "Primary WAN", key: "primaryWAN" },
        { label: "Secondary WAN", key: "secondaryWAN" },
        { label: "Branch Offices", key: "branchOffices" },
        { label: "MPLS", key: "mpls" },
        { label: "SD-WAN", key: "sdWan" },
    ];

    const facilities = [
        { label: "Physical Offices", key: "physicalOffices" },
        { label: "Has Data Centers", key: "hasDataCenters" },
        { label: "On-Prem DC", key: "hasOnPremDC" },
        { label: "Cloud Infrastructure", key: "hasCloudInfra" },
        { label: "Generator", key: "hasGenerator" },
        { label: "UPS", key: "hasUPS" },
        { label: "Solar Power", key: "hasSolarPower" },
    ];

    const updateVendorField = (key, field, value) => {
        const currentValue = formData[key] || {};
        updateField(key, { ...currentValue, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Infrastructure Vendors Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Infrastructure Vendors</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Network and server infrastructure providers</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {infrastructureVendors.map((vendor) => {
                            const value = formData[vendor.key] || {};
                            const vendorList = getVendors(vendor.key);
                            return (
                                <div key={vendor.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line)] hover:border-[var(--nui-accent)]/50 transition-all">
                                    <div className="font-semibold text-[var(--nui-text-2)] text-sm flex items-center">{vendor.label}</div>
                                    {vendorList.length > 0 ? (
                                        <select
                                            value={value.vendor || ""}
                                            onChange={(e) => updateVendorField(vendor.key, "vendor", e.target.value)}
                                            className="px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg text-[var(--nui-text)] focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] bg-[var(--nui-surface)]"
                                        >
                                            <option value="">Select Vendor...</option>
                                            {vendorList.map((v) => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={value.vendor || ""}
                                            onChange={(e) => updateVendorField(vendor.key, "vendor", e.target.value)}
                                            placeholder="Enter vendor name..."
                                            className="px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg text-[var(--nui-text)] placeholder-gray-400 focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] focus:placeholder-gray-500 bg-[var(--nui-surface)]"
                                        />
                                    )}
                                    <select
                                        value={value.businessPriority || "Medium"}
                                        onChange={(e) => updateVendorField(vendor.key, "businessPriority", e.target.value)}
                                        className={`px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg font-semibold focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] ${getPriorityChipClass(value.businessPriority)}`}
                                    >
                                        <option value="Critical">Critical</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <select
                                        value={value.offering || "On-Premise"}
                                        onChange={(e) => updateVendorField(vendor.key, "offering", e.target.value)}
                                        className="px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg font-medium text-[var(--nui-text)] focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] bg-[var(--nui-surface)]"
                                    >
                                        <option value="On-Premise">On-Premise</option>
                                        <option value="SaaS">SaaS</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Cloud">Cloud</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Network Configuration Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Network Configuration</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">WAN connections and network topology</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {networkConfig.map((config) => (
                            <div key={config.key} className="flex items-center gap-4 p-4 bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line)] hover:border-[var(--nui-accent)]/50 transition-all">
                                <label className="flex-1 font-semibold text-[var(--nui-text-2)] text-sm">{config.label}</label>
                                <input
                                    type="text"
                                    value={formData[config.key] || ""}
                                    onChange={(e) => updateField(config.key, e.target.value)}
                                    placeholder="Enter value..."
                                    className="flex-1 px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg text-[var(--nui-text)] placeholder-gray-400 focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] focus:placeholder-gray-500 bg-[var(--nui-surface)]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="bg-[var(--nui-surface)] rounded-xl border border-[var(--nui-line)] overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[var(--nui-line-soft)] bg-[var(--nui-surface-sunk)]/50 flex items-center gap-2">
                    <div className="h-5 w-1 bg-[var(--nui-accent)] rounded-full" />
                    <div>
                        <h2 className="text-sm font-bold text-[var(--nui-brand)] uppercase tracking-wide">Facilities Information</h2>
                        <p className="text-xs text-[var(--nui-text-3)] mt-0.5">Physical infrastructure and data centers</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {facilities.map((facility) => (
                            <div key={facility.key} className="flex items-center gap-4 p-4 bg-[var(--nui-surface-sunk)] rounded-xl border border-[var(--nui-line)] hover:border-[var(--nui-accent)]/50 transition-all">
                                <label className="flex-1 font-semibold text-[var(--nui-text-2)] text-sm">{facility.label}</label>
                                <input
                                    type="text"
                                    value={formData[facility.key] || ""}
                                    onChange={(e) => updateField(facility.key, e.target.value)}
                                    placeholder="Enter value..."
                                    className="flex-1 px-4 py-2.5 border-2 border-[var(--nui-line-strong)] rounded-lg text-[var(--nui-text)] placeholder-gray-400 focus:ring-2 focus:ring-[var(--nui-accent)] focus:border-[var(--nui-accent)] focus:placeholder-gray-500 bg-[var(--nui-surface)]"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationalDashboard;
