const MultiCheckbox = ({ label, options, values = [], onChange }) => {
  const toggle = (opt) => {
    if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
    else onChange([...values, opt]);
  };

  return (
    <div className="mb-4">
      <p className="font-medium mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-2 rounded-lg border transition ${
              values.includes(opt) ? "bg-[#34808A] text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
export default MultiCheckbox;
