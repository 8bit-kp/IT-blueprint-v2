import ToggleButton from "./ToggleButton";

const YesNo = ({ label, value, onChange }) => (
  <div className="mb-4">
    <p className="font-medium mb-2">{label}</p>
    <ToggleButton options={["Yes", "No"]} value={value} onChange={onChange} />
  </div>
);
export default YesNo;
