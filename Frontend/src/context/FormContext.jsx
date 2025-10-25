import { createContext, useState, useContext } from "react";

const FormContext = createContext();

// Provider
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phoneNumber: "",
    industry: "",
    otherIndustry: "",
    employees: "",
    remotePercentage: 0,
    contractorPercentage: 0,
    // add more default fields if necessary
  });

  const [step, setStep] = useState(1);

  // Merge new data into existing formData
  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Optional: reset form
  const resetForm = () => setFormData({});

  return (
    <FormContext.Provider value={{ formData, updateFormData, step, setStep, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook to use the context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
