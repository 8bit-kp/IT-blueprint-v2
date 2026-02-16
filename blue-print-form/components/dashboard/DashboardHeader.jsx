import React from "react";
import { useRouter } from "next/navigation";

const DashboardHeader = ({ blueprintType, companyName, onSave, saving }) => {
    const router = useRouter();

    return (
        <div className="bg-gradient-to-r from-[#15587B] to-[#34808A] text-white py-6 px-8 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/all-blueprints")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        aria-label="Go back to all blueprints"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {blueprintType?.replace(/-/g, " ").replace("Blueprint", "Dashboard") || "Dashboard"}
                        </h1>
                        <p className="text-sm text-white/80 mt-1">{companyName || "Company"}</p>
                    </div>
                </div>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-white text-[#15587B] font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
