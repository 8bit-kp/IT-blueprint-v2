// src/pages/form-fields/SecurityTechStep.jsx
import React from "react";

const SecurityTechStep = ({ data = {}, onChange, onPrev })  => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#15587B] mb-6">Security Technology</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Encryption Level</label>
          <select
            name="encryptionLevel"
            value={data.encryptionLevel || ""}
            onChange={onChange}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A] placeholder-visible"
          >
            <option value="">Select</option>
            <option value="aes256">AES-256</option>
            <option value="rsa">RSA</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Intrusion Detection</label>
          <select
            name="intrusionDetection"
            value={data.intrusionDetection || ""}
            onChange={onChange}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-[#34808A] placeholder-visible"
          >
            <option value="">Select</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
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
          onClick={ () => alert("Form submitted!") }
          className="bg-[#935010] text-white px-6 py-2 rounded-lg hover:bg-[#15587B] transition"
        >
          Submit ✅
        </button>
      </div>
    </div>
  );
};

export default SecurityTechStep;
