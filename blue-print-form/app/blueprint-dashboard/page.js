"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiFileText, FiShield, FiActivity, FiDollarSign, FiSettings, FiSave } from "react-icons/fi";
import { blueprintAPI } from "@/utils/api";
import { notify } from "@/lib/notify";

// Import Dashboard Components
import AppShell from "@/components/navigation/AppShell";
import SaveMessage from "@/components/dashboard/SaveMessage";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import CurrentStateDashboard from "@/components/dashboard/CurrentStateDashboard";
import SecurityDashboard from "@/components/dashboard/SecurityDashboard";
import OperationalDashboard from "@/components/dashboard/OperationalDashboard";
import FinancialDashboard from "@/components/dashboard/FinancialDashboard";
import AdministrationDashboard from "@/components/dashboard/AdministrationDashboard";

// Contextual "This Page" nav — lets the user switch dashboard type in place
// instead of going back to /all-blueprints and opening a new tab.
const DASHBOARD_TYPES = [
    { id: "Current-State-Blueprint", label: "Current State", Icon: FiFileText },
    { id: "Security-Blueprint", label: "Security", Icon: FiShield },
    { id: "Operational-Blueprint", label: "Operational", Icon: FiActivity },
    { id: "Financial-Blueprint", label: "Financial", Icon: FiDollarSign },
    { id: "Administration-Blueprint", label: "Administration", Icon: FiSettings },
];

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
                    notify.warning("Complete your assessment first", {
                        description: "Dashboards are available once your Current State Assessment has data to show.",
                    });
                    router.push("/blueprint-form");
                }
            } catch (err) {
                console.error("Error fetching blueprint:", err);
                notify.error("Unable to load your dashboard", {
                    description: "Please try again, or complete your Current State Assessment if you haven't yet.",
                });
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

    const title = blueprintType?.replace(/-/g, " ").replace("Blueprint", "Dashboard") || "Dashboard";

    return (
        <AppShell
            title={title}
            subtitle={formData.companyName}
            sections={DASHBOARD_TYPES}
            navMode="action"
            activeId={blueprintType}
            onSelect={(id) => router.push(`/blueprint-dashboard?type=${id}`)}
            actions={[{ label: saving ? "Saving..." : "Save Changes", onClick: handleSave, loading: saving, Icon: FiSave }]}
            contentClassName="max-w-6xl mx-auto px-6 pb-6"
        >
            <SaveMessage message={message} />
            {renderDashboard()}
        </AppShell>
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
