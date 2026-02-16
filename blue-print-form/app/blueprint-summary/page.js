"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import BlueprintDocument from "@/components/coverpages/BlueprintDocument";

// --- UI HELPERS ---

const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col ${className}`}>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <div className="h-4 w-1 bg-[#34808A] rounded-full"></div>
            <h2 className="font-bold text-[#15587B] text-sm uppercase tracking-wider">{title}</h2>
        </div>
        <div className="p-5 flex-1">{children}</div>
    </div>
);

const DetailRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between items-start py-2 border-b border-gray-50 last:border-0 text-sm ${className}`}>
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800 font-semibold text-right max-w-[60%] truncate" title={value?.toString()}>
            {value || "—"}
        </span>
    </div>
);

const Badge = ({ text, type = "neutral" }) => {
    if (!text) return <span className="text-gray-300">-</span>;

    let classes = "bg-gray-100 text-gray-600";
    const t = text.toString().toLowerCase();

    if (type === "priority") {
        if (t === "critical") classes = "bg-red-50 text-red-700 border border-red-100";
        else if (t === "high") classes = "bg-orange-50 text-orange-700 border border-orange-100";
        else if (t === "medium") classes = "bg-blue-50 text-blue-700 border border-blue-100";
        else classes = "bg-green-50 text-green-700 border border-green-100";
    } else if (type === "status") {
        if (t === "yes" || t === "true" || t === "protected" || t === "fully patched") classes = "bg-teal-50 text-teal-700 border border-teal-100";
        else if (t === "no" || t === "false" || t === "no data") classes = "bg-gray-50 text-gray-400 border border-gray-100";
        else if (t === "vendor") classes = "bg-indigo-50 text-indigo-700 border border-indigo-100";
    }

    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap ${classes}`}>
            {text}
        </span>
    );
};

// Logic helper to parse the mixed data types (String vs Object)
const parseControlData = (val) => {
    let choice = "";
    let vendor = "";
    let businessPriority = "";
    let offering = "";

    if (typeof val === "object" && val !== null) {
        choice = val.choice;
        vendor = val.vendor;
        businessPriority = val.businessPriority;
        offering = val.offering;
    } else {
        // Legacy support
        if (val && val.toString().startsWith("Vendor:")) {
            choice = "Yes";
            vendor = val.toString().split("Vendor:")[1];
        } else {
            choice = val;
        }
    }

    // Determine what to show in the main column
    // If choice is "Yes" and vendor is specified, show the vendor name
    const displayValue = (choice === "Yes" && vendor) ? vendor : choice;

    return { displayValue, businessPriority, offering, rawChoice: choice };
};

const BlueprintSummary = () => {
    const router = useRouter();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBlueprint = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                router.push("/auth");
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data && Object.keys(res.data).length > 0) {
                    setFormData(res.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching summary:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBlueprint();
    }, [router]);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // The handleDownloadPdf function is no longer needed as PDFDownloadLink handles the download directly.
    // const handleDownloadPdf = async () => {
    //     // This function is still used as a fallback or for custom logic
    //     // but it's better to use PDFDownloadLink in the UI
    //     try {
    //         const blob = await pdf(
    //             <BlueprintDocument
    //                 companyName={formData.companyName || "—"}
    //                 preparedDate={new Date()}
    //                 currentStateData={formData}
    //             />
    //         ).toBlob();
    //         saveAs(blob, `IT-Blueprint-${(formData.companyName || "Company").replace(/\s+/g, '_')}.pdf`);
    //     } catch (err) {
    //         console.error("PDF Error", err);
    //         alert("Failed to generate PDF. Check console for details.");
    //     }
    // };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#15587B] font-medium">Loading Blueprint...</div>;
    if (error || !formData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Data Found</h2>
            <button onClick={() => router.push("/blueprint-form")} className="text-[#34808A] underline">Return to Form</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-20">

            {/* STICKY HEADER */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#15587B] p-2 rounded-lg text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 leading-none">Blueprint Summary</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Configuration for <span className="font-semibold text-[#34808A]">{formData.companyName}</span></p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push("/blueprint-form")} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Edit Data</button>

                        <button 
                            onClick={() => router.push("/all-blueprints")}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#935010] hover:bg-[#7a3d0d] rounded-lg shadow-sm transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Go to All Blueprints</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* ROW 1: OVERVIEW GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1: Company */}
                    <Card title="Company Profile">
                        <div className="space-y-1">
                            <DetailRow label="Company" value={formData.companyName} />
                            <DetailRow label="Contact" value={formData.contactName} />
                            <DetailRow label="Email" value={formData.email} />
                            <DetailRow label="Phone" value={formData.phoneNumber} />
                            <DetailRow label="Industry" value={formData.industry === "Others" ? formData.otherIndustry : formData.industry} />
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100">
                                <div className="text-center">
                                    <span className="block text-xs text-gray-400 uppercase">Employees</span>
                                    <span className="text-lg font-bold text-[#15587B]">{formData.employees}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs text-gray-400 uppercase">Remote</span>
                                    <span className="text-lg font-bold text-[#15587B]">{formData.remotePercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Step 2: Facilities */}
                    <Card title="Facilities & Power">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 rounded p-3 text-center">
                                <div className="text-xs text-blue-600 font-bold uppercase">Offices</div>
                                <div className="text-xl font-bold text-blue-900">{formData.physicalOffices}</div>
                            </div>
                            <div className="bg-teal-50 rounded p-3 text-center">
                                <div className="text-xs text-teal-600 font-bold uppercase">Datacenters</div>
                                <div className="text-xl font-bold text-teal-900">{formData.hasDataCenters}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm"><span className="text-gray-600">On-Prem DC</span> <Badge text={formData.hasOnPremDC} type="status" /></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Cloud Infra</span> <Badge text={formData.hasCloudInfra} type="status" /></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Generators</span> <Badge text={formData.hasGenerator} type="status" /></div>
                            <div className="flex justify-between items-center text-sm"><span className="text-gray-600">UPS Systems</span> <Badge text={formData.hasUPS} type="status" /></div>
                        </div>
                    </Card>

                    {/* Step 4: Governance */}
                    <Card title="Governance & Compliance">
                        <div className="grid grid-cols-1 gap-y-2">
                            {[
                                ["Steering Committee", formData.securityCommittee],
                                ["Written Policy", formData.securityPolicy],
                                ["Employee Training", formData.employeeTraining],
                                ["BCDR Plan", formData.bcdrPlan],
                                ["Cyber Insurance", formData.cyberInsurance],
                                ["Incident Response", formData.incidentResponse],
                                ["Pen Test (1yr)", formData.penetrationTest]
                            ].map(([l, v], i) => (
                                <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-600">{l}</span>
                                    <Badge text={v} type="status" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ROW 2: INFRASTRUCTURE (UPDATED) */}
                <Card title="Network & Infrastructure">
                    <div className="flex flex-col gap-8">

                        {/* Top Section: Servers & Config */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Configuration & Servers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <span className="text-xs text-gray-500 block mb-1">Windows Servers</span>
                                    <div className="flex items-center gap-2">
                                        <Badge text={formData.windowsServers} type="status" />
                                        {formData.windowsServers === "Yes" && (
                                            <span className="text-[10px] text-gray-400 truncate">
                                                ({formData.windowsOptions?.length || 0} opts)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <span className="text-xs text-gray-500 block mb-1">Linux Servers</span>
                                    <div className="flex items-center gap-2">
                                        <Badge text={formData.linuxServers} type="status" />
                                        {formData.linuxServers === "Yes" && (
                                            <span className="text-[10px] text-gray-400 truncate">
                                                ({formData.linuxOptions?.length || 0} opts)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col justify-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Wireless Auth</span>
                                        <span className="text-sm font-bold text-[#15587B]">{formData.wirelessAuth || "-"}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col justify-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Guest Wifi</span>
                                        <div className="flex gap-1">
                                            <Badge text={formData.guestWireless} type="status" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Core Vendors Table */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Core Vendors</h3>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold w-1/4">Type</th>
                                            <th className="px-6 py-3 font-semibold w-1/4">Vendor</th>
                                            <th className="px-6 py-3 font-semibold w-1/4">Offering</th>
                                            <th className="px-6 py-3 font-semibold w-1/4">Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { k: "WAN 1", v: formData.WAN1 },
                                            { k: "WAN 2", v: formData.WAN2 },
                                            { k: "Firewall/Routing", v: formData.routingVendor },
                                            { k: "Switching", v: formData.switchingVendor },
                                            { k: "Wireless", v: formData.wirelessVendor },
                                            { k: "Virtualization", v: formData.virtualizationVendor },
                                            { k: "Cloud", v: formData.cloudVendor }
                                        ].map((item, i) => {
                                            const { displayValue, businessPriority, offering, rawChoice } = parseControlData(item.v);
                                            return (
                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-3 font-medium text-gray-700">{item.k}</td>
                                                    <td className="px-6 py-3">
                                                        <span className={`font-medium ${rawChoice === 'No' ? 'text-red-400 opacity-80' : 'text-gray-800'}`}>
                                                            {displayValue}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-500">{offering || "—"}</td>
                                                    <td className="px-6 py-3"><Badge text={businessPriority} type="priority" /></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ROW 3: TECHNICAL CONTROLS (TABLE) */}
                <Card title="Security Technical Controls">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Control Area</th>
                                    <th className="px-6 py-3 font-semibold">Solution / Vendor</th>
                                    <th className="px-6 py-3 font-semibold">Offering</th>
                                    <th className="px-6 py-3 font-semibold">Priority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(formData.technicalControls || {}).map(([key, rawValue]) => {
                                    const { displayValue, businessPriority, offering, rawChoice } = parseControlData(rawValue);
                                    
                                    // Format label with proper capitalization for acronyms
                                    let label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                                    
                                    // Convert specific acronyms to all caps
                                    const acronyms = {
                                        'Sd Wan': 'SD WAN',
                                        'Soc Siem': 'SOC SIEM',
                                        'Edr': 'EDR',
                                        'Mdm': 'MDM',
                                        'Mfa': 'MFA',
                                        'Nac': 'NAC',
                                        'Iam': 'IAM',
                                        'Ssa Vpn': 'SSA VPN',
                                        'Dlp': 'DLP',
                                        'Casb': 'CASB'
                                    };
                                    
                                    Object.entries(acronyms).forEach(([pattern, replacement]) => {
                                        label = label.replace(pattern, replacement);
                                    });

                                    return (
                                        <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-gray-700">{label}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-gray-800 ${rawChoice === 'No' ? 'text-red-500 opacity-70' : ''}`}>
                                                        {displayValue}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">{offering || "—"}</td>
                                            <td className="px-6 py-3"><Badge text={businessPriority} type="priority" /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* ROW 4: APPLICATIONS (GRID OF TABLES) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {Object.entries(formData.applications || {}).map(([category, apps]) => {
                        if (!apps || apps.length === 0) return null;
                        const catTitle = category.charAt(0).toUpperCase() + category.slice(1);

                        return (
                            <Card key={category} title={`${catTitle} Applications`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 text-left">
                                            <tr>
                                                <th className="px-2 py-2 font-medium">Provider</th>
                                                <th className="px-2 py-2 font-medium">Data</th>
                                                <th className="px-2 py-2 font-medium">MFA</th>
                                                <th className="px-2 py-2 font-medium">Backup</th>
                                                <th className="px-2 py-2 font-medium">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {apps.map((app, i) => (
                                                <tr key={i}>
                                                    <td className="px-2 py-2.5 font-semibold text-[#15587B]">{app.name}</td>
                                                    <td className="px-2 py-2.5"><Badge text={app.containsSensitiveInfo === "Yes" ? "Yes" : null} type="status" /></td>
                                                    <td className="px-2 py-2.5"><Badge text={app.mfa === "Yes" ? "Yes" : null} type="status" /></td>
                                                    <td className="px-2 py-2.5"><Badge text={app.backedUp === "Yes" ? "Yes" : null} type="status" /></td>
                                                    <td className="px-2 py-2.5"><Badge text={app.businessPriority} type="priority" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )
                    })}
                </div>

            </div>
        </div>
    );
};

export default BlueprintSummary;
