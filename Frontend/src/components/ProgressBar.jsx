const ProgressBar = ({ step, totalSteps }) => {
  // Adjust progress: 0% at step 1, 100% at last step
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

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
