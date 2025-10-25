const ProgressBar = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
      <div
        className="bg-[#34808A] h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
