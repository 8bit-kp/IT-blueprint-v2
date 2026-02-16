import React from "react";

const LoadingSpinner = ({ message = "Loading Dashboard..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#15587B] mx-auto mb-4"></div>
                <div className="text-[#15587B] font-medium text-lg">{message}</div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
