import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import BlueprintDocument from "./coverpages/BlueprintDocument";

const Section = ({ title, children }) => (
  <div className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 mb-8 border border-gray-200">
    <h2 className="text-xl font-semibold text-[#15587B] mb-5 border-l-4 border-[#34808A] pl-3">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </div>
);

// Updated Item to allow custom styling via className or subItem prop
const Item = ({ label, value, className = "" }) => (
  <div className={`flex justify-between border-b border-dashed border-gray-300 pb-2 ${className}`}>
    <span className="font-medium text-gray-800">{label}</span>
    <span className="text-gray-600">{value || "—"}</span>
  </div>
);

const BlueprintSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Initialize state
  const [formData, setFormData] = useState(location.state?.formData || null);
  const [loading, setLoading] = useState(!location.state?.formData);
  const [error, setError] = useState(false);

  // 2. Fetch data if missing
  useEffect(() => {
    if (formData) return;

    const fetchBlueprint = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blueprint/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Object.keys(res.data).length > 0) {
          setFormData(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprint();
  }, [formData, navigate]);

  const handleDownloadPdf = async () => {
    try {
      // Generate the PDF blob
      const blob = await pdf(
        <BlueprintDocument
          companyName={formData.companyName || "—"}
          preparedDate={new Date()}
          currentStateData={formData}
        />
      ).toBlob();

      // Trigger download
      saveAs(blob, "IT-Blueprint.pdf");
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to generate PDF. Please check console for details.");
    }
  };

  // 4. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#15587B] mb-4"></div>
          <p className="text-[#15587B] font-semibold">Loading your Blueprint...</p>
        </div>
      </div>
    );
  }

  // 5. Error / No Data State
  if (error || !formData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          No data found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find a saved blueprint for your account.
        </p>
        <button
          onClick={() => navigate("/blueprint-form")}
          className="px-5 py-2 bg-[#935010] text-white rounded-lg shadow hover:bg-[#7a3d0d] transition"
        >
          Go Back to Form
        </button>
      </div>
    );
  }

  // 6. Success State
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

        {/* STEP 3 - UPDATED to handle complex objects */}
        <Section title="Step 3: Network and Server Infrastructure">
          <Item label="Main Location" value={formData.mainLocation} />
          
          <div className="mt-4 space-y-2">
            {[
              { key: "WAN1", label: "WAN 1" },
              { key: "WAN2", label: "WAN 2" },
              { key: "WAN3", label: "WAN 3" },
              { key: "switchingVendor", label: "Switching Vendor" },
              { key: "routingVendor", label: "Routing Vendor" },
              { key: "wirelessVendor", label: "Wireless Vendor" },
              { key: "baremetalVendor", label: "Bare Metal Vendor" },
              { key: "virtualizationVendor", label: "Virtualization Vendor" },
              { key: "cloudVendor", label: "Cloud Vendor" },
            ].map((field) => {
              const val = formData[field.key];
              let choice = "";
              let vendor = "";
              let businessPriority = "";
              let offering = "";

              if (typeof val === "object" && val !== null) {
                choice = val.choice;
                vendor = val.vendor;
                businessPriority = val.businessPriority;
                offering = val.offering;
              } else {
                choice = val;
              }

              const displayValue =
                choice === "Vendor"
                  ? `Vendor: ${vendor || "Unspecified"}`
                  : choice;

              return (
                <div key={field.key} className="mb-2">
                  <Item label={field.label} value={displayValue} />
                  {(businessPriority || offering) && (
                    <div className="bg-gray-50 rounded-lg p-2 mb-2 ml-4 border-l-2 border-gray-300">
                      {businessPriority && (
                        <Item
                          label="Business Priority"
                          value={businessPriority}
                          className="text-sm border-none pb-1"
                        />
                      )}
                      {offering && (
                        <Item
                          label="Offering"
                          value={offering}
                          className="text-sm border-none pb-0"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-4">
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
          </div>
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

        {/* STEP 5 - Technical Controls */}
        <Section title="Step 5: Security Technical Controls">
          {Object.entries(formData.technicalControls || {}).map(([key, value]) => {
            // Check if value is complex object or legacy string
            let choice = "";
            let vendor = "";
            let businessPriority = "";
            let offering = "";

            if (typeof value === 'object' && value !== null) {
              choice = value.choice;
              vendor = value.vendor;
              businessPriority = value.businessPriority;
              offering = value.offering;
            } else {
              // Legacy string support
              if (value && value.toString().startsWith("Vendor:")) {
                choice = "Vendor";
                vendor = value.toString().split("Vendor:")[1];
              } else {
                choice = value;
              }
            }

            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            const displayValue = choice === "Vendor" ? `Vendor: ${vendor || "Unspecified"}` : choice;

            return (
              <div key={key} className="mb-4 border-b border-gray-100 pb-2">
                <Item label={label} value={displayValue} />
                {(businessPriority || offering) && (
                  <div className="bg-gray-50 rounded-lg p-2 mt-1">
                    {businessPriority && <Item label="Business Priority" value={businessPriority} className="text-sm pl-4" />}
                    {offering && <Item label="Offering" value={offering} className="text-sm pl-4" />}
                  </div>
                )}
              </div>
            );
          })}
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
                      <Item label="Provider" value={app.name} />

                      {/* Business Priority and Offering */}
                      <Item label="Business Priority" value={app.businessPriority} />
                      <Item label="Offering" value={app.offering} />

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
        <div className="flex justify-center gap-6 mt-12 pb-10">
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