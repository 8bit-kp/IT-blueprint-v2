"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import BlueprintDocument from "@/components/coverpages/BlueprintDocument";
import SecurityDocument from "@/components/coverpages/SecurityDocument";
import FinancialDocument from "@/components/coverpages/FinancialDocument";
import OperationalDocument from "@/components/coverpages/OperationalDocument";
import AdministrationDocument from "@/components/coverpages/AdministrationDocument";
import CompleteDocument from "@/components/coverpages/CompleteDocument";

const BlueprintCard = ({ title, description, icon, documentComponent, formData, fileName, bgColor = "bg-gradient-to-br from-blue-500 to-blue-600" }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className={`${bgColor} p-6 text-white`}>
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-sm text-white/90 mt-1">{description}</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => window.open(`/blueprint-dashboard?type=${fileName}`, '_blank')}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#15587B] bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Dashboard
                    </button>

                    {isClient && (
                        <PDFDownloadLink
                            document={documentComponent}
                            fileName={`${fileName}-${(formData.companyName || "Company").replace(/\s+/g, '_')}.pdf`}
                            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#935010] hover:bg-[#7a3d0d] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            {({ blob, url, loading, error }) => (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{loading ? "Preparing..." : "Download PDF"}</span>
                                </>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
        </div>
    );
};

const AllBlueprintsPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
                console.error("Error fetching blueprint:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchBlueprint();
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#15587B] font-medium">Loading Blueprints...</div>;
    if (error || !formData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Data Found</h2>
            <button onClick={() => router.push("/blueprint-form")} className="text-[#34808A] underline">Return to Form</button>
        </div>
    );

    const blueprints = [
        {
            title: "Current State Blueprint",
            description: "Complete overview of current IT infrastructure",
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            documentComponent: <BlueprintDocument companyName={formData.companyName || "—"} preparedDate={new Date()} currentStateData={formData} />,
            fileName: "Current-State-Blueprint",
            bgColor: "bg-gradient-to-br from-[#15587B] to-[#34808A]"
        },
        {
            title: "Security Blueprint",
            description: "Security controls, technical defenses & policies",
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
            documentComponent: <SecurityDocument companyName={formData.companyName || "—"} preparedDate={new Date()} securityData={formData} />,
            fileName: "Security-Blueprint",
            bgColor: "bg-gradient-to-br from-red-500 to-red-600"
        },
        {
            title: "Financial Blueprint",
            description: "Financial applications & business-critical systems",
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            documentComponent: <FinancialDocument companyName={formData.companyName || "—"} preparedDate={new Date()} financialData={formData} />,
            fileName: "Financial-Blueprint",
            bgColor: "bg-gradient-to-br from-green-500 to-green-600"
        },
        {
            title: "Operational Blueprint",
            description: "Network infrastructure, servers & operations",
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
            documentComponent: <OperationalDocument companyName={formData.companyName || "—"} preparedDate={new Date()} operationalData={formData} />,
            fileName: "Operational-Blueprint",
            bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
        },
        {
            title: "Administration & Controls Blueprint",
            description: "Governance, policies & administrative controls",
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
            documentComponent: <AdministrationDocument companyName={formData.companyName || "—"} preparedDate={new Date()} administrationData={formData} />,
            fileName: "Administration-Blueprint",
            bgColor: "bg-gradient-to-br from-orange-500 to-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            {/* HEADER */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-[#15587B] to-[#34808A] p-3 rounded-xl text-white shadow-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 leading-none">All Blueprints</h1>
                                <p className="text-sm text-gray-500 mt-1">Complete documentation suite for <span className="font-semibold text-[#34808A]">{formData.companyName}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => router.push("/blueprint-form")} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Edit Data
                            </button>
                            <button onClick={() => router.push("/blueprint-summary")} className="px-4 py-2 text-sm font-medium text-[#15587B] bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                                View Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLUEPRINTS GRID */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blueprints.map((blueprint, index) => (
                        <BlueprintCard
                            key={index}
                            title={blueprint.title}
                            description={blueprint.description}
                            icon={blueprint.icon}
                            documentComponent={blueprint.documentComponent}
                            formData={formData}
                            fileName={blueprint.fileName}
                            bgColor={blueprint.bgColor}
                        />
                    ))}
                </div>

                {/* DOWNLOAD COMPLETE FILE BUTTON */}
                <div className="mt-12 flex justify-center">
                    {isClient && (
                        <PDFDownloadLink
                            document={
                                <CompleteDocument 
                                    companyName={formData.companyName || "—"} 
                                    preparedDate={new Date()} 
                                    formData={formData} 
                                />
                            }
                            fileName={`Complete-IT-Blueprint-${(formData.companyName || "Company").replace(/\s+/g, '_')}.pdf`}
                            className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#15587B] to-[#34808A] hover:from-[#0d3d51] hover:to-[#2b6d75] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                        >
                            {({ blob, url, loading, error }) => (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{loading ? "Preparing Complete File..." : "Download Complete File (All Blueprints)"}</span>
                                </>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllBlueprintsPage;
