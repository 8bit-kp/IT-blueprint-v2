"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SecurityDonutGrid from "./SecurityDonutGrid";

// ── Loading Spinner (lightweight inline) ──────────────────────────────────

const SpinnerOverlay = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-[#34808A] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">{message || "Loading…"}</p>
    </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────

/**
 * SecurityVisualsModal
 *
 * Full-screen overlay that fetches live blueprint data from the API and
 * renders animated donut charts for all Security controls.
 *
 * Props:
 *   onClose – () => void   called when the user dismisses the modal
 */
const SecurityVisualsModal = ({ onClose }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch fresh data every time the modal opens
    useEffect(() => {
        const fetchData = async () => {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                setError("You are not logged in. Please log in and try again.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blueprint/get`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFormData(res.data);
            } catch (err) {
                console.error("SecurityVisualsModal fetch error:", err);
                setError("Failed to load data. Please close and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Prevent body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal panel */}
            <div className="relative flex flex-col w-full h-full max-w-7xl mx-auto my-4 mx-4 bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Modal header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-[#15587B] to-[#34808A] text-white px-8 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            {/* Bar chart icon */}
                            <svg className="w-7 h-7 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            Security Blueprint — Data Visualisation
                        </h2>
                        <p className="text-sm text-white/80 mt-1">
                            Live data from your blueprint · Green = Yes · Red = No · Grey = Not configured
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
                        aria-label="Close visualisation"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Legend bar */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-3 flex items-center gap-6 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                        Yes — Implemented
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                        No — Not Implemented
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
                        Not Configured
                    </span>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {loading && <SpinnerOverlay message="Fetching live blueprint data…" />}

                    {error && !loading && (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <p className="text-red-500 font-semibold mb-2">{error}</p>
                                <button
                                    onClick={onClose}
                                    className="mt-2 px-4 py-2 bg-[#34808A] text-white rounded-lg text-sm font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && formData && (
                        <SecurityDonutGrid formData={formData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityVisualsModal;
