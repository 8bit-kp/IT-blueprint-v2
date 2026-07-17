/**
 * controlMaps.js — canonical ordered lists for controls and vendor rows.
 *
 * These lists are the single source of truth for:
 *   - Security technical controls (Step 5)
 *   - Administrative / governance controls (Step 4)
 *   - Network / infrastructure vendor rows (Step 3)
 *
 * Import from here in dashboards, summaries, and PDF documents.
 */

/**
 * Security technical controls — Step 5.
 * Order matches the form and the Current State PDF table.
 */
export const TECHNICAL_CONTROLS = [
    { label: "Next-Gen Firewall",      key: "nextGenFirewall" },
    { label: "Secure Web Gateway",     key: "secureWebGateway" },
    { label: "CASB",                   key: "casb" },
    { label: "DLP",                    key: "dlp" },
    { label: "SSL VPN",                key: "sslVpn" },
    { label: "Email Security",         key: "emailSecurity" },
    { label: "Vulnerability Scanning", key: "vulnerabilityScanning" },
    { label: "IAM",                    key: "iam" },
    { label: "NAC",                    key: "nac" },
    { label: "MFA",                    key: "mfa" },
    { label: "MDM",                    key: "mdm" },
    { label: "EDR",                    key: "edr" },
    { label: "Data Classification",    key: "dataClassification" },
    { label: "SOC / SIEM",             key: "socSiem" },
    { label: "Asset Management",       key: "assetManagement" },
    { label: "SD-WAN",                 key: "sdWan" },
];

/**
 * Administrative / governance controls — Step 4.
 */
export const ADMIN_CONTROLS = [
    { label: "Security Committee",      key: "securityCommittee" },
    { label: "IT Governance",           key: "itGovernance" },
    { label: "Security Policies",       key: "securityPolicies" },
    { label: "Risk Assessment",         key: "riskAssessment" },
    { label: "Incident Response",       key: "incidentResponse" },
    { label: "Business Continuity",     key: "businessContinuity" },
    { label: "Disaster Recovery",       key: "disasterRecovery" },
    { label: "Security Training",       key: "securityTraining" },
    { label: "Third Party Risk",        key: "thirdPartyRisk" },
    { label: "Vulnerability Management",key: "vulnerabilityManagement" },
    { label: "Penetration Testing",     key: "penetrationTest" },
];

/**
 * Network / infrastructure vendor rows — Step 3.
 * Order matches the summary table and the Current State PDF.
 */
export const VENDOR_ROWS = [
    { label: "WAN 1",             key: "WAN1" },
    { label: "WAN 2",             key: "WAN2" },
    { label: "WAN 3",             key: "WAN3" },
    { label: "Firewall / Routing",key: "routingVendor" },
    { label: "Switching",         key: "switchingVendor" },
    { label: "Wireless",          key: "wirelessVendor" },
    { label: "Bare Metal",        key: "baremetalVendor" },
    { label: "Virtualization",    key: "virtualizationVendor" },
    { label: "Cloud",             key: "cloudVendor" },
];
