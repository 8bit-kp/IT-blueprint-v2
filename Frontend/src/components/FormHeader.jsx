import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FormHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        
        {/* Left Section: Back Button & Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-[#15587B] hover:text-white hover:border-[#15587B] transition-all duration-200 shadow-sm"
            title="Go Back Dashboard"
          >
            <FiArrowLeft size={18} className="transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* Title Block */}
          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-bold text-[#15587B] tracking-tight leading-tight">
              Manage Your IT Blueprint
            </h1>
            <span className="text-[10px] sm:text-xs text-gray-400 font-semibold tracking-wide uppercase">
              System Configuration
            </span>
          </div>
        </div>

        {/* Right Section: Logo */}
        <div className="flex items-center">
          <img
            src="/conslteklogo.png"
            alt="Consltek Logo"
            className="h-8 md:h-10 w-auto object-contain transition-opacity hover:opacity-90"
          />
        </div>
      </div>
    </header>
  );
};

export default FormHeader;