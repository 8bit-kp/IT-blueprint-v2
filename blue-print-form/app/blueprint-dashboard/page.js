"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { blueprintAPI } from "@/utils/api";

// Import Dashboard Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SaveMessage from "@/components/dashboard/SaveMessage";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import CurrentStateDashboard from "@/components/dashboard/CurrentStateDashboard";
import SecurityDashboard from "@/components/dashboard/SecurityDashboard";
import OperationalDashboard from "@/components/dashboard/OperationalDashboard";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import AdministrationDashboard from "@/components/dashboard/AdministrationDashboard";

const BlueprintDashboardContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blueprintType = searchParams.get("type");
    
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchBlueprint = async () => {
            // Auth guard: username in localStorage is the client-side login indicator.
            // Real auth is enforced server-side via the HTTP-only cookie.
            const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
            if (!username) {
                router.push("/auth");
                return;
            }

            try {
                setLoading(true);
                // blueprintAPI uses withCredentials — cookie is sent automatically.
                const res = await blueprintAPI.getBlueprint();

                if (res.data && Object.keys(res.data).length > 0) {
                    setFormData(res.data);
                } else {
                    router.push("/blueprint-form");
                }
            } catch (err) {
                console.error("Error fetching blueprint:", err);
                router.push("/blueprint-form");
            } finally {
                setLoading(false);
            }
        };

        fetchBlueprint();
    }, [router, blueprintType]);

    const handleSave = async () => {
        // Auth guard
        const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
        if (!username) {
            router.push("/auth");
            return;
        }

        try {
            setSaving(true);

            // Clean the formData before sending - remove _id and __v fields
            const { _id, __v, ...cleanData } = formData;

            console.log("Saving blueprint data:", cleanData);

            // blueprintAPI uses withCredentials — cookie is sent automatically.
            const response = await blueprintAPI.saveBlueprint(cleanData);

            console.log("Save response:", response.data);

            setMessage("✓ Changes saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error saving blueprint:", err);
            console.error("Error response:", err.response?.data);

            const errorMsg = err.response?.data?.message || "Error saving changes. Please try again.";
            setMessage(`✗ ${errorMsg}`);
            setTimeout(() => setMessage(""), 5000);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Loading State
    if (loading) {
        return <LoadingSpinner message="Loading Dashboard..." />;
    }

    // No Data State
    if (!formData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-700">No data found</div>
            </div>
        );
    }

    // Render different dashboards based on type
    const renderDashboard = () => {
        switch (blueprintType) {
            case "Current-State-Blueprint":
                return <CurrentStateDashboard formData={formData} updateField={updateField} />;
            case "Security-Blueprint":
                return <SecurityDashboard formData={formData} updateField={updateField} />;
            case "Operational-Blueprint":
                return <OperationalDashboard formData={formData} updateField={updateField} />;
            case "Financial-Blueprint":
                return <FinancialDashboard formData={formData} updateField={updateField} />;
            case "Administration-Blueprint":
                return <AdministrationDashboard formData={formData} updateField={updateField} />;
            default:
                return (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                        <p className="text-gray-700">Unknown blueprint type</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Header Component */}
            <DashboardHeader
                blueprintType={blueprintType}
                companyName={formData.companyName}
                onSave={handleSave}
                saving={saving}
            />

            {/* Save Message Component */}
            <SaveMessage message={message} />

            <div className="max-w-7xl mx-auto py-6 px-6">
                {renderDashboard()}
            </div>
        </div>
    );
};

// Wrap with Suspense to fix Next.js build error
const BlueprintDashboard = () => {
    return (
        <Suspense fallback={<LoadingSpinner message="Loading Dashboard..." />}>
            <BlueprintDashboardContent />
        </Suspense>
    );
};

export default BlueprintDashboard;
