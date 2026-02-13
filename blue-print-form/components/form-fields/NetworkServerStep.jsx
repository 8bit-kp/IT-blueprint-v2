"use client";

import { memo } from "react";
import { Card, TextInput, TechnicalControlCard, YesNo, ToggleButton, MultiCheckbox } from "./FormComponents";

const NetworkServerStep = memo(({ formData, setField, vendors, initialTechControlState }) => {
  const infraControls = [
    { key: "WAN1", label: "WAN 1" },
    { key: "WAN2", label: "WAN 2" },
    { key: "WAN3", label: "WAN 3" },
    { key: "switchingVendor", label: "Switching" },
    { key: "routingVendor", label: "Routing" },
    { key: "wirelessVendor", label: "Wireless" },
    { key: "baremetalVendor", label: "Baremetal" },
    { key: "virtualizationVendor", label: "Virtualization" },
    { key: "cloudVendor", label: "Cloud" },
  ];

  return (
    <Card title="Network & Server Infrastructure" className="max-w-5xl mx-auto">
      <div className="space-y-8">
        {/* Main Location Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wider">Main Location</h3>
          <TextInput placeholder="HQ Location Name" value={formData.mainLocation} onChange={(v) => setField("mainLocation", v)} />
        </div>

        {/* Infrastructure Vendors Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Infrastructure Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {infraControls.map((ctl) => {
              const currentData = (typeof formData[ctl.key] === 'object' && formData[ctl.key] !== null)
                ? formData[ctl.key]
                : initialTechControlState;
              return (
                <TechnicalControlCard
                  key={ctl.key}
                  label={ctl.label}
                  data={currentData}
                  onChange={(newData) => setField(ctl.key, newData)}
                  vendors={vendors}
                  initialTechControlState={initialTechControlState}
                />
              );
            })}
          </div>
        </div>

        {/* Network Config & Servers Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Network Config & Servers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <YesNo label="HA Routing?" value={formData.haRouting} onChange={(v) => setField("haRouting", v)} />
            <div className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-200 gap-2">
              <span className="text-sm font-medium text-gray-700">Wireless Auth</span>
              <ToggleButton options={["PSK", "EAP-PEAP", "EAP-TLS"]} value={formData.wirelessAuth} onChange={(v) => setField("wirelessAuth", v)} />
            </div>
            <YesNo label="Guest Wireless?" value={formData.guestWireless} onChange={(v) => setField("guestWireless", v)} />
            <YesNo label="Guest Segmentation?" value={formData.guestSegmentation} onChange={(v) => setField("guestSegmentation", v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
            <div>
              <YesNo label="Windows Servers?" value={formData.windowsServers} onChange={(v) => setField("windowsServers", v)} />
              {formData.windowsServers === "Yes" && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
                  <MultiCheckbox label="Select features:" options={["Protected", "Backed-up", "Monitored", "Not Monitored"]} values={formData.windowsOptions || []} onChange={(vals) => setField("windowsOptions", vals)} />
                </div>
              )}
            </div>
            <div>
              <YesNo label="Linux Servers?" value={formData.linuxServers} onChange={(v) => setField("linuxServers", v)} />
              {formData.linuxServers === "Yes" && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200">
                  <MultiCheckbox label="Select features:" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up", "MFA for Access"]} values={formData.linuxOptions || []} onChange={(vals) => setField("linuxOptions", vals)} />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <MultiCheckbox label="Desktops - Select all that apply:" options={["Fully patched", "Stored PHI/PII", "Monitored", "Protected", "Backed up"]} values={formData.desktopOptions || []} onChange={(vals) => setField("desktopOptions", vals)} />
          </div>
        </div>
      </div>
    </Card>
  );
});

export default NetworkServerStep;
