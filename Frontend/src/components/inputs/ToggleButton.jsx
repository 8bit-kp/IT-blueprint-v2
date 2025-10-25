const ToggleButton = ({ options, value, onChange }) => {
  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-2 rounded-lg border transition ${
            value === opt ? "bg-[#34808A] text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
          type="button"
        >
          {opt}
        </button>
      ))}
    </div>
  );
};
export default ToggleButton;
