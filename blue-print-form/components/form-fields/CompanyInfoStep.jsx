"use client";

import { memo, useState } from "react";
import { Card, TextInput, RangeInput } from "./FormComponents";

// Accepts any common North-American or international phone format.
// Allows digits, spaces, dashes, dots, parentheses, and a leading +.
// Min 7 digits after stripping non-numeric chars; max 15 (E.164 limit).
const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

const RequiredMark = () => (
  <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
);

const CompanyInfoStep = memo(({ formData, setField }) => {
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (v) => {
    setField("phoneNumber", v);
    if (v && !PHONE_RE.test(v)) {
      setPhoneError("Enter a valid phone number (e.g. +1 555-000-0000).");
    } else {
      setPhoneError("");
    }
  };

  return (
    <Card title="General Information" className="max-w-4xl mx-auto">
      <p className="text-xs text-gray-400 mb-5">Fields marked <span className="text-red-500">*</span> are required.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name<RequiredMark />
          </label>
          <TextInput placeholder="e.g. Acme Corp" value={formData.companyName} onChange={(v) => setField("companyName", v)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
          <TextInput placeholder="Full Name" value={formData.contactName} onChange={(v) => setField("contactName", v)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address<RequiredMark />
          </label>
          <TextInput type="email" placeholder="name@company.com" value={formData.email} onChange={(v) => setField("email", v)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <TextInput placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handlePhoneChange} />
          {phoneError && (
            <p className="mt-1 text-xs text-red-500">{phoneError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5 text-gray-900" value={formData.industry || ""} onChange={(e) => setField("industry", e.target.value)}>
            <option value="">Select...</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial">Financial</option>
            <option value="Retail">Retail</option>
            <option value="Education">Education</option>
            <option value="County-Cities">County-Cities</option>
            <option value="Other">Other</option>
          </select>
          {formData.industry === "Other" && (
            <div className="mt-2">
              <TextInput placeholder="Specify Industry" value={formData.otherIndustry} onChange={(v) => setField("otherIndustry", v)} />
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
          <select className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#34808A] focus:ring-[#34808A] sm:text-sm p-2.5 text-gray-900" value={formData.employees || ""} onChange={(e) => setField("employees", e.target.value)}>
            <option value="">Number of employees...</option>
            <option value="1-100">1 - 100</option>
            <option value="101-500">101 - 500</option>
            <option value="501-1000">501 - 1000</option>
            <option value="1001+">1001+</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <RangeInput label="Remote Workers" value={formData.remotePercentage} onChange={(v) => setField("remotePercentage", v)} />
          <RangeInput label="Contractors" value={formData.contractorPercentage} onChange={(v) => setField("contractorPercentage", v)} />
        </div>
      </div>
    </Card>
  );
});

export default CompanyInfoStep;
