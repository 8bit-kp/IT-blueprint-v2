import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  name: String,
  containsSensitiveInfo: String, // Yes or No
  mfa: String, // Yes or No
  backedUp: String, // Yes or No
  byodAccess: String, // Yes or No
  businessPriority: String, // High, Medium, Critical
  offering: String, // SaaS, On-premise
});

// Schema for Technical/Infrastructure Controls
const technicalControlSchema = new mongoose.Schema({
  choice: String, // Yes, No, Vendor
  vendor: String, // Specific vendor name if "Vendor" is chosen
  businessPriority: String, // High, Medium, Critical
  offering: String, // SaaS, On-premise
}, { _id: false });

const blueprintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Step 1: Company Info
  companyName: String,
  contactName: String,
  email: String,
  phoneNumber: String,
  industry: String,
  otherIndustry: String,
  employees: String,
  remotePercentage: Number,
  contractorPercentage: Number,

  // Step 2: Infrastructure - Facilities
  physicalOffices: String,
  hasDataCenters: String,
  hasOnPremDC: String,
  hasCloudInfra: String,
  hasGenerator: String,
  hasUPS: String,

  // ✅ Step 3: Network & Server Infrastructure (Updated to Objects)
  mainLocation: String,
  WAN1: technicalControlSchema,
  WAN2: technicalControlSchema,
  WAN3: technicalControlSchema,
  switchingVendor: technicalControlSchema,
  routingVendor: technicalControlSchema,
  wirelessVendor: technicalControlSchema,
  baremetalVendor: technicalControlSchema,
  virtualizationVendor: technicalControlSchema,
  cloudVendor: technicalControlSchema,
  
  // Remaining Step 3 fields (simple strings/arrays)
  haRouting: String,
  wirelessAuth: String,
  guestWireless: String,
  guestSegmentation: String,
  windowsServers: String,
  windowsOptions: [String],
  linuxServers: String,
  linuxOptions: [String],
  desktopOptions: [String],

  // Step 4: Security Admin Controls
  securityCommittee: String,
  securityPolicy: String,
  employeeTraining: String,
  bcdrPlan: String,
  cyberInsurance: String,
  testBackup: String,
  changeControl: String,
  incidentResponse: String,
  securityReview: String,
  penetrationTest: String,

  // Step 5: Technical Controls
  technicalControls: {
    nextGenFirewall: technicalControlSchema,
    secureWebGateway: technicalControlSchema,
    casb: technicalControlSchema,
    dlp: technicalControlSchema,
    ssaVpn: technicalControlSchema,
    emailSecurity: technicalControlSchema,
    vulnerabilityMgmt: technicalControlSchema,
    iam: technicalControlSchema,
    nac: technicalControlSchema,
    mfa: technicalControlSchema,
    mdm: technicalControlSchema,
    edr: technicalControlSchema,
    dataClassification: technicalControlSchema,
    socSiem: technicalControlSchema,
    assetManagement: technicalControlSchema,
    sdWan: technicalControlSchema,
  },

  // Step 6: Applications
  applications: {
    productivity: [appSchema],
    finance: [appSchema],
    hrit: [appSchema],
    payroll: [appSchema],
    additional: [appSchema],
  },
});

export default mongoose.model("Blueprint", blueprintSchema);