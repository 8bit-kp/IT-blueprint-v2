const CompanyInfoStep = ({ data = {}, onChange, onNext }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Name of the Company"
        className="border p-2 w-full rounded"
        value={data.companyName || ""}
        onChange={handleChange("companyName")}
      />
      <input
        placeholder="Contact Name"
        className="border p-2 w-full rounded"
        value={data.contactName || ""}
        onChange={handleChange("contactName")}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full rounded"
        value={data.email || ""}
        onChange={handleChange("email")}
      />
      <input
        placeholder="Phone Number"
        className="border p-2 w-full rounded"
        value={data.phoneNumber || ""}
        onChange={handleChange("phoneNumber")}
      />

      <select
        className="border p-2 w-full rounded"
        value={data.industry || ""}
        onChange={handleChange("industry")}
      >
        <option value="">Select Industry</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Financial">Financial</option>
        <option value="Retail">Retail</option>
        <option value="Education">Education</option>
        <option value="County-Cities">County-Cities</option>
        <option value="Others">Others</option>
      </select>

      <input
        placeholder="Specify (if Others)"
        className="border p-2 w-full rounded"
        value={data.otherIndustry || ""}
        onChange={handleChange("otherIndustry")}
      />

      <select
        className="border p-2 w-full rounded"
        value={data.employees || ""}
        onChange={handleChange("employees")}
      >
        <option value="">Number of employees (including contractors)</option>
        <option value="1-100">1 - 100</option>
        <option value="101-500">101 - 500</option>
        <option value="501-1000">501 - 1000</option>
        <option value="1001+">1001 and above</option>
      </select>

      <div>
        <label className="block mb-1">
          Percentage of remote workers: {data.remotePercentage || 0}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.remotePercentage || 0}
          onChange={handleChange("remotePercentage")}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1">
          Percentage of contractors: {data.contractorPercentage || 0}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.contractorPercentage || 0}
          onChange={handleChange("contractorPercentage")}
          className="w-full"
        />
      </div>

      <button
        className="px-4 py-2 bg-[#34808A] text-white rounded"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
};

export default CompanyInfoStep;
