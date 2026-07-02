import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
    name: String,
    containsSensitiveInfo: String,
    mfa: String,
    backedUp: String,
    byodAccess: String,
    businessPriority: String,
    offering: String,
    // Sensitivity classification fields (added in v2)
    sensitivity: String,
    businessSensitivity: String,
    businessConfidentiality: String,
    personallyIdentifiableInfo: String,
    hipaaRegulated: String,
});

const technicalControlSchema = new mongoose.Schema({
    choice: String,
    vendor: String,
    businessPriority: String,
    offering: String,
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

    // Step 3: Network & Server Infrastructure
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
        sslVpn: technicalControlSchema,
        emailSecurity: technicalControlSchema,
        vulnerabilityScanning: technicalControlSchema,
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
    // Fixed categories use typed sub-arrays; the field itself is Mixed so that
    // user-created custom categories (arbitrary keys) can also be stored here
    // without Mongoose stripping them. The save route uses the raw MongoDB driver
    // for exactly this reason — see docs/project-memory.md.
    applications: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            productivity: [],
            finance:      [],
            hrit:         [],
            payroll:      [],
            additional:   [],
        },
    },

    // Custom application category metadata (Step 6 — user-created sections)
    // Each entry: { key: String (slug used as applications[key]), title: String (display name) }
    // Default categories are NOT listed here — only user-created ones.
    customCategories: {
        type: [{ key: String, title: String, _id: false }],
        default: [],
    },
});

blueprintSchema.index({ userId: 1 });
blueprintSchema.set("timestamps", true);

export default mongoose.models.Blueprint || mongoose.model("Blueprint", blueprintSchema);
