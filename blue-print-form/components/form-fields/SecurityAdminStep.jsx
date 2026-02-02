// src/pages/form-fields/SecurityAdminStep.jsx
import React from "react";

const SecurityAdminStep = ({ data = {}, onChange, onNext, onPrev })  => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#15587B] mb-6">Security Administration</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Access Control System</label>
          <input
            type="text"
            name="accessControl"
            value={data.accessControl || ""}
            onChange={onChange}
            placeholder="e.g. Role-based, MFA"
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Audit Logging Enabled?</label>
          <select
            name="auditLogging"
            value={data.auditLogging || ""}
            onChange={onChange}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A]"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Security Team Size</label>
          <input
            type="number"
            name="securityTeamSize"
            value={data.securityTeamSize || ""}
            onChange={onChange}
            placeholder="Number of admins"
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A]"
          />
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

export default SecurityAdminStep;
