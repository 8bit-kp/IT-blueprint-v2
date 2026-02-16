"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

// Import Dashboard Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SaveMessage from "@/components/dashboard/SaveMessage";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import CurrentStateDashboard from "@/components/dashboard/CurrentStateDashboard";
import SecurityDashboard from "@/components/dashboard/SecurityDashboard";
import OperationalDashboard from "@/components/dashboard/OperationalDashboard";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import AdministrationDashboard from "@/components/dashboard/AdministrationDashboard";

const BlueprintDashboard = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blueprintType = searchParams.get("type");
    
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

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
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            router.push("/auth");
            return;
        }

        try {
            setSaving(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/save`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("✓ Changes saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error saving blueprint:", err);
            setMessage("✗ Error saving changes. Please try again.");
            setTimeout(() => setMessage(""), 3000);
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
        <div className="min-h-screen bg-gray-50">
            {/* Header Component */}
            <DashboardHeader
                blueprintType={blueprintType}
                companyName={formData.companyName}
                onSave={handleSave}
                saving={saving}
            />

            {/* Save Message Component */}
            <SaveMessage message={message} />

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto py-8 px-8">
                {renderDashboard()}
            </div>
        </div>
    );
};

export default BlueprintDashboard;
