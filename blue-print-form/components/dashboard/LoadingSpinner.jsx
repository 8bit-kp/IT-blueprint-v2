import React from "react";

const LoadingSpinner = ({ message = "Loading Dashboard..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--nui-surface-sunk)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--nui-brand)] mx-auto mb-4"></div>
                <div className="text-[var(--nui-brand)] font-medium text-lg">{message}</div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
