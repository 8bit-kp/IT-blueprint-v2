import React from "react";

const SaveMessage = ({ message }) => {
    if (!message) return null;

    const isSuccess = message.includes("✓");

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium
                    ${isSuccess
                        ? "bg-white border-green-200 text-green-800"
                        : "bg-white border-red-200 text-red-700"
                    }`}
            >
                {isSuccess ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
                <span>{message.replace("✓ ", "").replace("✗ ", "")}</span>
            </div>
        </div>
    );
};

export default SaveMessage;
