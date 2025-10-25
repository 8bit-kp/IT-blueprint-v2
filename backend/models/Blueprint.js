import mongoose from "mongoose";

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

  // Step 2: Infrastructure
  physicalOffices: String,
  hasDataCenters: String,
  hasOnPremDC: String,
  hasCloudInfra: String,
  hasGenerator: String,
  hasUPS: String,

  // Step 3: Network & Server
  mainLocation: String,
  WAN1: String,
  WAN2: String,
  WAN3: String,
  switchingVendor: String,
  routingVendor: String,
  wirelessVendor: String,
  baremetalVendor: String,
  virtualizationVendor: String,
  cloudVendor: String,
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
    nextGenFirewall: String,
    secureWebGateway: String,
    casb: String,
    dlp: String,
    ssaVpn: String,
    emailSecurity: String,
    vulnerabilityMgmt: String,
    iam: String,
    nac: String,
    mfa: String,
    mdm: String,
    edr: String,
    dataClassification: String,
    socSiem: String,
  },
});

export default mongoose.model("Blueprint", blueprintSchema);
