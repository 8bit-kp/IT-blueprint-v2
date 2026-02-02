import React from "react";

const ProgressBar = ({ step, totalSteps }) => {
  // Calculate specific percentage for text label
  const percentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2.5 px-0.5">
        <span className="text-xs font-bold text-[#15587B] uppercase tracking-wider">
          Step {step} <span className="text-gray-400 font-medium">/ {totalSteps}</span>
        </span>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {percentage}% Complete
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="flex gap-1.5 h-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          
          // Determine state of this specific segment
          const isCompleted = stepNum < step;
          const isActive = stepNum === step;

          // Base classes
          let barColor = "bg-gray-200"; // Future steps
          
          if (isCompleted) {
            barColor = "bg-[#34808A]"; // Completed steps
          } else if (isActive) {
            barColor = "bg-[#34808A] shadow-[0_0_8px_rgba(52,128,138,0.5)]"; // Current step (with glow)
          }

          return (
            <div
              key={index}
              className={`flex-1 rounded-full transition-all duration-500 ease-out ${barColor} ${isActive ? 'scale-y-110' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;