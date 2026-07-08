import React from "react";
import { useRouter } from "next/navigation";

const DashboardHeader = ({ blueprintType, companyName, onSave, saving }) => {
    const router = useRouter();

    const title = blueprintType
        ?.replace(/-/g, " ")
        .replace("Blueprint", "Dashboard")
        || "Dashboard";

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Left — navigation + title */}
                <div className="flex items-center gap-3">
                    {/* Home button */}
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 text-gray-400 hover:text-[#15587B] hover:bg-gray-100 rounded-lg transition-all"
                        title="Go to Home"
                        aria-label="Go to Home"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </button>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Back to All Blueprints */}
                    <button
                        onClick={() => router.push("/all-blueprints")}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#15587B] hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-all"
                        aria-label="Go back to all blueprints"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        All Blueprints
                    </button>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Dashboard title */}
                    <div>
                        <h1 className="text-sm font-bold text-gray-800 leading-none">{title}</h1>
                        {companyName && (
                            <p className="text-xs text-gray-400 mt-0.5">{companyName}</p>
                        )}
                    </div>
                </div>

                {/* Right — Save */}
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#15587B] hover:bg-[#0f4460] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
