"use client";

import { memo } from "react";
import { TechnicalControlCard } from "./FormComponents";

const SecurityTechStep = memo(({ technicalControls, setTechnicalControls, vendors, initialTechControlState }) => {
  const controls = [
    { key: "nextGenFirewall", label: "Next Gen Firewall" },
    { key: "secureWebGateway", label: "Secure Web Gateway" },
    { key: "casb", label: "CASB" },
    { key: "dlp", label: "Data Loss Prevention" },
    { key: "ssaVpn", label: "SSA-VPN" },
    { key: "emailSecurity", label: "E-mail Security" },
    { key: "vulnerabilityMgmt", label: "Vuln. Management" },
    { key: "iam", label: "IAM" },
    { key: "nac", label: "NAC" },
    { key: "mfa", label: "MFA" },
    { key: "mdm", label: "MDM" },
    { key: "edr", label: "EDR" },
    { key: "dataClassification", label: "Data Classification" },
    { key: "socSiem", label: "SOC - SIEM" },
    { key: "assetManagement", label: "Asset Management" },
    { key: "sdWan", label: "SD-WAN" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {controls.map((ctl) => {
          const localData = technicalControls[ctl.key] || { ...initialTechControlState };
          return (
            <TechnicalControlCard
              key={ctl.key}
              label={ctl.label}
              data={localData}
              onChange={(newData) => {
                setTechnicalControls((prev) => ({
                  ...prev,
                  [ctl.key]: newData
                }));
              }}
              vendors={vendors}
              initialTechControlState={initialTechControlState}
            />
          );
        })}
      </div>
    </div>
  );
});

export default SecurityTechStep;
