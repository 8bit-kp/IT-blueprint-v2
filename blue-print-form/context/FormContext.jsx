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
    // Facilities & Infrastructure defaults
    physicalOffices: "1",
    hasDataCenters: "Yes",
    hasOnPremDC: "Yes",
    hasCloudInfra: "Yes",
    hasGenerator: "Yes",
    hasUPS: "Yes",
    // Governance & Admin Controls defaults
    securityCommittee: "Yes",
    securityPolicy: "Yes",
    employeeTraining: "Yes",
    bcdrPlan: "Yes",
    cyberInsurance: "Yes",
    testBackup: "Yes",
    changeControl: "Yes",
    incidentResponse: "Yes",
    securityReview: "Yes",
    penetrationTest: "Yes",
    // Network & Server Infra defaults
    WAN1: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    WAN2: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    WAN3: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    switchingVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    routingVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    wirelessVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    baremetalVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    virtualizationVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
    cloudVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
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
      // Facilities & Infrastructure defaults
      physicalOffices: "1",
      hasDataCenters: "Yes",
      hasOnPremDC: "Yes",
      hasCloudInfra: "Yes",
      hasGenerator: "Yes",
      hasUPS: "Yes",
      // Governance & Admin Controls defaults
      securityCommittee: "Yes",
      securityPolicy: "Yes",
      employeeTraining: "Yes",
      bcdrPlan: "Yes",
      cyberInsurance: "Yes",
      testBackup: "Yes",
      changeControl: "Yes",
      incidentResponse: "Yes",
      securityReview: "Yes",
      penetrationTest: "Yes",
      // Network & Server Infra defaults
      WAN1: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      WAN2: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      WAN3: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      switchingVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      routingVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      wirelessVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      baremetalVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      virtualizationVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
      cloudVendor: { choice: "Yes", vendor: "", businessPriority: "Critical", offering: "SaaS" },
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
