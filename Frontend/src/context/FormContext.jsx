import { createContext, useState, useContext } from "react";

const FormContext = createContext();

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

  // ✅ FIXED: Supports both functional and object-style updates
  const updateFormData = (updater) => {
    setFormData((prev) => {
      if (typeof updater === "function") {
        // when you call updateFormData(prev => ...)
        return updater(prev);
      }
      // when you call updateFormData({...})
      return { ...prev, ...updater };
    });
  };

  // Optional: reset form
  const resetForm = () =>
    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phoneNumber: "",
      industry: "",
      otherIndustry: "",
      employees: "",
      remotePercentage: 0,
      contractorPercentage: 0,
    });

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, step, setStep, resetForm }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
