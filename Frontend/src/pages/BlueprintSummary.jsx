import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import CurrentState from "./CurrentState";
import BlueprintDocument from "./coverpages/BlueprintDocument";

const Section = ({ title, children }) => (
  <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 mb-8 border border-gray-200">
    <h2 className="text-xl font-semibold text-[#15587B] mb-5 border-l-4 border-[#34808A] pl-3">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Item = ({ label, value }) => (
  <div className="flex justify-between border-b border-dashed border-gray-300 pb-2">
    <span className="font-medium text-gray-800">{label}</span>
    <span className="text-gray-600">{value || "—"}</span>
  </div>
);

const BlueprintSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData;

  if (!formData) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          No data found
        </h2>
        <button
          onClick={() => navigate("/blueprint")}
          className="px-5 py-2 bg-[#935010] text-white rounded-lg shadow hover:bg-[#7a3d0d] transition"
        >
          Go Back to Form
        </button>
      </div>
    );
  }
  const handleDownloadPdf = async () => {
  
    const blob = await pdf(
      <BlueprintDocument
        companyName={formData.companyName || "—"}
        preparedDate={new Date()}
        author="Rajesh Haridas"
        currentState={<CurrentState formData={formData} />}
      />
    ).toBlob();
    

    saveAs(blob, "IT-Blueprint.pdf");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#f0f4f8] to-[#e2ecf0] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#34808A] to-[#15587B] text-white rounded-2xl shadow-lg p-8 mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-wide mb-2">
            IT Blueprint Summary
          </h1>
          <p className="text-white/90 text-lg">
            Review all your submitted information below
          </p>
        </div>

        {/* STEP 1 */}
        <Section title="Step 1: Company Information">
          <Item label="Company Name" value={formData.companyName} />
          <Item label="Contact Name" value={formData.contactName} />
          <Item label="Email" value={formData.email} />
          <Item label="Phone Number" value={formData.phoneNumber} />
          <Item label="Industry" value={formData.industry} />
          <Item label="Other Industry" value={formData.otherIndustry} />
          <Item label="Employees" value={formData.employees} />
          <Item label="Remote %" value={`${formData.remotePercentage || 0}%`} />
          <Item
            label="Contractor %"
            value={`${formData.contractorPercentage || 0}%`}
          />
        </Section>

        {/* STEP 2 */}
        <Section title="Step 2: Infrastructure - Facilities">
          <Item label="Physical Offices" value={formData.physicalOffices} />
          <Item label="Data Centers" value={formData.hasDataCenters} />
          <Item label="On-prem DC" value={formData.hasOnPremDC} />
          <Item label="Cloud Infra" value={formData.hasCloudInfra} />
          <Item label="Generator" value={formData.hasGenerator} />
          <Item label="UPS" value={formData.hasUPS} />
        </Section>

        {/* STEP 3 */}
        <Section title="Step 3: Network and Server Infrastructure">
          <Item label="Main Location" value={formData.mainLocation} />
          <Item label="WAN 1" value={formData.WAN1} />
          <Item label="WAN 2" value={formData.WAN2} />
          <Item label="WAN 3" value={formData.WAN3} />
          <Item label="Switching Vendor" value={formData.switchingVendor} />
          <Item label="Routing Vendor" value={formData.routingVendor} />
          <Item label="Wireless Vendor" value={formData.wirelessVendor} />
          <Item label="Bare Metal Vendor" value={formData.baremetalVendor} />
          <Item
            label="Virtualization Vendor"
            value={formData.virtualizationVendor}
          />
          <Item label="Cloud Vendor" value={formData.cloudVendor} />
          <Item label="HA Routing" value={formData.haRouting} />
          <Item label="Wireless Auth" value={formData.wirelessAuth} />
          <Item label="Guest Wireless" value={formData.guestWireless} />
          <Item label="Guest Segmentation" value={formData.guestSegmentation} />
          <Item label="Windows Servers" value={formData.windowsServers} />
          <Item
            label="Windows Options"
            value={(formData.windowsOptions || []).join(", ")}
          />
          <Item label="Linux Servers" value={formData.linuxServers} />
          <Item
            label="Linux Options"
            value={(formData.linuxOptions || []).join(", ")}
          />
          <Item
            label="Desktop Options"
            value={(formData.desktopOptions || []).join(", ")}
          />
        </Section>

        {/* STEP 4 */}
        <Section title="Step 4: Security Administrative Controls">
          <Item label="Security Committee" value={formData.securityCommittee} />
          <Item label="Security Policy" value={formData.securityPolicy} />
          <Item label="Employee Training" value={formData.employeeTraining} />
          <Item label="BCDR Plan" value={formData.bcdrPlan} />
          <Item label="Cyber Insurance" value={formData.cyberInsurance} />
          <Item label="Backup Testing" value={formData.testBackup} />
          <Item label="Change Control" value={formData.changeControl} />
          <Item label="Incident Response" value={formData.incidentResponse} />
          <Item label="Security Review" value={formData.securityReview} />
          <Item label="Penetration Test" value={formData.penetrationTest} />
        </Section>

        {/* STEP 5 */}
        <Section title="Step 5: Security Technical Controls">
          {Object.entries(formData.technicalControls || {}).map(
            ([key, value]) => (
              <Item
                key={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={value}
              />
            )
          )}
        </Section>

        {/* STEP 6 */}
        <Section title="Step 6: Applications">
          {Object.entries(formData.applications || {}).map(
            ([category, apps]) => (
              <div key={category} className="mb-4">
                <h3 className="text-lg font-semibold text-[#34808A] mb-3 capitalize border-l-2 border-[#935010] pl-2">
                  {category}
                </h3>
                {(apps || []).length > 0 ? (
                  apps.map((app, i) => (
                    <div
                      key={i}
                      className="border rounded-xl p-4 mb-3 bg-gray-50 hover:bg-gray-100 shadow-sm"
                    >
                      <Item label="App Name" value={app.name} />
                      <Item
                        label="Contains Sensitive Info"
                        value={app.containsSensitiveInfo}
                      />
                      <Item label="MFA" value={app.mfa} />
                      <Item label="Backed Up" value={app.backedUp} />
                      <Item label="BYOD Access" value={app.byodAccess} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">
                    No applications added.
                  </p>
                )}
              </div>
            )
          )}
        </Section>

        {/* BUTTONS */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={() => navigate("/blueprint-form")}
            className="px-6 py-3 bg-[#34808A] text-white rounded-xl shadow-md hover:bg-[#2b6f6f] transition"
          >
            ← Back to Edit
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-6 py-3 bg-[#935010] text-white rounded-xl shadow-md hover:bg-[#7a3d0d] transition"
          >
            Download Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintSummary;
