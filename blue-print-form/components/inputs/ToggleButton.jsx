const ToggleButton = ({ options, value, onChange }) => {
  // Function to get button styling based on option and selection state
  const getButtonStyle = (opt) => {
    const isSelected = value === opt;

    // Special styling for Yes/No buttons
    if (opt === "Yes") {
      return isSelected
        ? "bg-green-600 text-white border-green-700 shadow-md"
        : "bg-white text-green-700 border-green-300 hover:bg-green-50";
    }

    if (opt === "No") {
      return isSelected
        ? "bg-red-600 text-white border-red-700 shadow-md"
        : "bg-white text-red-700 border-red-300 hover:bg-red-50";
    }

    // Default styling for other options (like "Vendor")
    return isSelected
      ? "bg-[#34808A] text-white border-[#34808A] shadow-md"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-semibold ${getButtonStyle(opt)}`}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
export default ToggleButton;
