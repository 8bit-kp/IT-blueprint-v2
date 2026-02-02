"use client";

import { createContext, useState, useContext, useMemo, useCallback } from "react";

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
    applications: {
      productivity: [],
      finance: [],
      hrit: [],
      payroll: [],
      additional: []
    }
  });

  const [step, setStep] = useState(1);

  // ✅ OPTIMIZED: Memoized update function
  const updateFormData = useCallback((updater) => {
    setFormData((prev) => {
      if (typeof updater === "function") {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  }, []);

  // Optional: reset form
  const resetForm = useCallback(() =>
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
      applications: {
        productivity: [],
        finance: [],
        hrit: [],
        payroll: [],
        additional: []
      }
    }), []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ formData, updateFormData, step, setStep, resetForm }),
    [formData, updateFormData, step, resetForm]
  );

  return (
    <FormContext.Provider value={contextValue}>
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
