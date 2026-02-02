import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
    name: String,
    containsSensitiveInfo: String,
    mfa: String,
    backedUp: String,
    byodAccess: String,
    businessPriority: String,
    offering: String,
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

blueprintSchema.index({ userId: 1 });
blueprintSchema.set("timestamps", true);

export default mongoose.models.Blueprint || mongoose.model("Blueprint", blueprintSchema);
