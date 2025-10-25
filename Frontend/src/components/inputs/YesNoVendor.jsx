import ToggleButton from "./ToggleButton";

const vendors = ["Cisco", "Amazon", "Flipkart", "Microsoft"];

const YesNoVendor = ({ label, value, vendorValue, onChoice, onVendor }) => (
  <div className="mb-4">
    <p className="font-medium mb-2">{label}</p>
    <div className="flex items-center gap-4">
      <ToggleButton options={["Yes", "No", "Vendor"]} value={value} onChange={onChoice} />
      {value === "Vendor" && (
        <select
          value={vendorValue || ""}
          onChange={(e) => onVendor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select vendor</option>
          {vendors.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}
    </div>
  </div>
);
export default YesNoVendor;
