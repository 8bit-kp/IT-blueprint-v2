import React from "react";

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
    ];

    const updateVendorField = (key, field, value) => {
        const currentValue = formData[key] || {};
        updateField(key, { ...currentValue, [field]: value });
    };

    return (
        <div className="space-y-8">
            {/* Infrastructure Vendors Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Infrastructure Vendors</h2>
                    <p className="text-sm text-white/90 mt-1">Network and server infrastructure providers</p>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {infrastructureVendors.map((vendor) => {
                            const value = formData[vendor.key] || {};
                            return (
                                <div key={vendor.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gradient-to-r from-[#B8E6E6]/40 to-[#7BC5C5]/30 rounded-xl border-2 border-[#7BC5C5]/50 hover:border-[#34808A] transition-all">
                                    <div className="font-bold text-gray-800 flex items-center">{vendor.label}</div>
                                    <input
                                        type="text"
                                        value={value.vendor || ""}
                                        onChange={(e) => updateVendorField(vendor.key, "vendor", e.target.value)}
                                        placeholder="Enter vendor name..."
                                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] focus:placeholder-gray-500 bg-white"
                                    />
                                    <select
                                        value={value.businessPriority || "Medium"}
                                        onChange={(e) => updateVendorField(vendor.key, "businessPriority", e.target.value)}
                                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-800 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] bg-white"
                                    >
                                        <option value="Critical">Critical</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <select
                                        value={value.offering || "SaaS"}
                                        onChange={(e) => updateVendorField(vendor.key, "offering", e.target.value)}
                                        className="px-4 py-2.5 border-2 border-gray-300 rounded-lg font-medium text-gray-800 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] bg-white"
                                    >
                                        <option value="SaaS">SaaS</option>
                                        <option value="On-Premise">On-Premise</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Network Configuration Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Network Configuration</h2>
                    <p className="text-sm text-white/90 mt-1">WAN connections and network topology</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {networkConfig.map((config) => (
                            <div key={config.key} className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#7BC5C5]/30 to-[#B8E6E6]/30 rounded-xl border-2 border-[#7BC5C5]/50 hover:border-[#34808A] transition-all">
                                <label className="flex-1 font-bold text-gray-800">{config.label}</label>
                                <input
                                    type="text"
                                    value={formData[config.key] || ""}
                                    onChange={(e) => updateField(config.key, e.target.value)}
                                    placeholder="Enter value..."
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] focus:placeholder-gray-500 bg-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5">
                    <h2 className="text-2xl font-bold">Facilities Information</h2>
                    <p className="text-sm text-white/90 mt-1">Physical infrastructure and data centers</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {facilities.map((facility) => (
                            <div key={facility.key} className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#7BC5C5]/30 to-[#B8E6E6]/30 rounded-xl border-2 border-[#7BC5C5]/50 hover:border-[#34808A] transition-all">
                                <label className="flex-1 font-bold text-gray-800">{facility.label}</label>
                                <input
                                    type="text"
                                    value={formData[facility.key] || ""}
                                    onChange={(e) => updateField(facility.key, e.target.value)}
                                    placeholder="Enter value..."
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#34808A] focus:border-[#34808A] focus:placeholder-gray-500 bg-white"
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
