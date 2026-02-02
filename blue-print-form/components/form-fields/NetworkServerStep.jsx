// src/pages/form-fields/NetworkServerStep.jsx
import React from "react";

const NetworkServerStep = ({ data = {}, onChange, onNext, onPrev })  => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#15587B] mb-6">Network & Server Configuration</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Server Provider</label>
          <input
            type="text"
            name="serverProvider"
            value={data.serverProvider || ""}
            onChange={onChange}
            placeholder="e.g. AWS, Azure, GCP"
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A] placeholder-visible"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Database Type</label>
          <select
            name="databaseType"
            value={data.databaseType || ""}
            onChange={onChange}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A] placeholder-visible"
          >
            <option value="">Select DB</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="postgresql">PostgreSQL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
          <select
            name="backupFrequency"
            value={data.backupFrequency || ""}
            onChange={onChange}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A] placeholder-visible"
          >
            <option value="">Select</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
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

export default NetworkServerStep;
