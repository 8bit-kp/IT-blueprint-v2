import React from "react";

const InfrastructureStep = ({ data = {}, onChange, onNext, onPrev }) => {
  // Wrap onChange so it updates the correct field
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#15587B] mb-6">Infrastructure Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hosting Type</label>
          <select
            name="hostingType"
            value={data.hostingType || ""}
            onChange={handleChange("hostingType")}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A]"
          >
            <option value="">Select</option>
            <option value="cloud">Cloud</option>
            <option value="onPremise">On-premise</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Operating System</label>
          <select
            name="os"
            value={data.os || ""}
            onChange={handleChange("os")}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A]"
          >
            <option value="">Select OS</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
            <option value="macos">macOS</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="bg-[#34808A] text-white px-6 py-2 rounded-lg hover:bg-[#15587B] transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default InfrastructureStep;
