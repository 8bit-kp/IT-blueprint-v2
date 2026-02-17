"use client";

import { useEffect } from "react";

export default function WarningModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Continue", cancelText = "Cancel" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with gradient and blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in border border-red-100">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
        
        {/* Warning Icon Header */}
        <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center border-b border-red-100">
          {/* Floating animation circles */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-red-200/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-200/30 rounded-full blur-2xl animate-pulse delay-75" />
          
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-11 w-11 text-white relative z-10" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            {title || "⚠️ WARNING"}
          </h3>
        </div>

        {/* Content */}
        <div className="p-8 bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 border border-red-100/50 shadow-inner">
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gradient-to-br from-gray-50/95 to-gray-100/95 backdrop-blur-sm px-8 py-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-200/50">
          <button
            onClick={onClose}
            className="group px-6 py-3 text-sm font-semibold text-gray-700 bg-white/90 backdrop-blur-sm border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {cancelText}
            </span>
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="group px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {confirmText}
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95) translateY(-10px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </div>
  );
}
