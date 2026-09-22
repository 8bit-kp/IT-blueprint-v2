import React from "react";

const SaveMessage = ({ message }) => {
    if (!message) return null;

    const isSuccess = message.includes("✓");

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-[var(--nui-shadow-2)] border text-sm font-medium
                    ${isSuccess
                        ? "bg-[var(--nui-surface)] border-[var(--nui-ok-line)] text-[var(--nui-ok)]"
                        : "bg-[var(--nui-surface)] border-[var(--nui-risk-line)] text-[var(--nui-risk)]"
                    }`}
            >
                {isSuccess ? (
                    <div className="w-6 h-6 rounded-full bg-[var(--nui-ok-bg)] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[var(--nui-ok)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--nui-risk-bg)] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[var(--nui-risk)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
