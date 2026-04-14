/**
 * VENDOR LISTS PER SERVICE
 * ─────────────────────────────────────────────────────────────────────────────
 * To add or remove a vendor for any service, simply edit the array for that
 * service key below. "Others" must always remain as the last entry.
 *
 * Infrastructure keys: WAN, switching, routing, wireless, baremetal,
 *                      virtualization, cloud
 * Security keys:       nextGenFirewall, secureWebGateway, casb, dlp, sslVpn,
 *                      emailSecurity, vulnerabilityScanning, iam, nac, mfa,
 *                      mdm, edr, dataClassification, socSiem, assetManagement,
 *                      sdWan
 */

export const VENDORS = {
    // ── Infrastructure ──────────────────────────────────────────────────────

    /** WAN 1 / WAN 2 / WAN 3 */
    WAN: [
        "Spectrum",
        "Comcast",
        "Google Fiber",
        "AT&T",
        "Verizon",
        "Others",
    ],

    switching: [
        "Cisco",
        "Aruba",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    routing: [
        "Cisco",
        "Aruba",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    wireless: [
        "Cisco",
        "UniFi",
        "Meraki",
        "Juniper",
        "Extreme",
        "Others",
    ],

    baremetal: [
        "Dell",
        "IBM",
        "HP",
        "Supermicro",
        "Others",
    ],

    virtualization: [
        "Microsoft (Hyper-V)",
        "Citrix",
        "Broadcom (VMware)",
        "Proxmox",
        "Nutanix",
        "Linux (KVM)",
        "Others",
    ],

    cloud: [
        "Google Cloud (GCP)",
        "AWS",
        "Microsoft Azure",
        "Oracle Cloud",
        "IBM Cloud",
        "Alibaba Cloud",
        "Others",
    ],

    // ── Security Stack ───────────────────────────────────────────────────────

    nextGenFirewall: [
        "Cato",
        "Palo Alto Networks",
        "Fortinet",
        "Cisco",
        "Check Point",
        "Others",
    ],

    secureWebGateway: [
        "Cato",
        "Zscaler",
        "Palo Alto Networks",
        "Netskope",
        "Cloudflare",
        "Others",
    ],

    casb: [
        "Cato",
        "Netskope",
        "Microsoft Defender for Cloud Apps",
        "Palo Alto Networks",
        "Others",
    ],

    dlp: [
        "Cato",
        "Dropsuite",
        "Zscaler",
        "Microsoft Purview",
        "Others",
    ],

    /** SSL VPN (was ssaVpn) */
    sslVpn: [
        "Cato VPN",
        "Cisco AnyConnect",
        "Ivanti",
        "FortiGate",
        "OpenVPN",
        "Others",
    ],

    emailSecurity: [
        "Cato",
        "IRONSCALES",
        "Proofpoint",
        "Barracuda",
        "Microsoft Defender",
        "Others",
    ],

    /** Vulnerability Scanning (was vulnerabilityMgmt) */
    vulnerabilityScanning: [
        "Cato",
        "Tenable",
        "Nodeware",
        "Qualys",
        "Rapid7",
        "Others",
    ],

    iam: [
        "Cato",
        "Okta",
        "Microsoft Entra ID",
        "Ping Identity",
        "Auth0",
        "Others",
    ],

    nac: [
        "Cato",
        "Cisco ISE",
        "Aruba ClearPass",
        "Extreme Networks",
        "FortiNAC",
        "Others",
    ],

    mfa: [
        "Cato",
        "Duo",
        "Microsoft Entra ID",
        "Google Workspace (MFA)",
        "Okta",
        "Others",
    ],

    mdm: [
        "Microsoft Intune",
        "JumpCloud",
        "Jamf / Jamf Pro",
        "Omnissa (VMware Workspace ONE)",
        "Ivanti",
        "Others",
    ],

    edr: [
        "Cato",
        "CrowdStrike",
        "Microsoft Defender",
        "SentinelOne",
        "Huntress",
        "Bitdefender",
        "Sophos",
        "Trend Micro",
        "Others",
    ],

    dataClassification: [
        "Cato",
        "Microsoft Purview",
        "Tableau",
        "Power BI",
        "Lepide",
        "Others",
    ],

    socSiem: [
        "Cato",
        "Microsoft Sentinel",
        "Splunk",
        "Google Chronicle",
        "CrowdStrike",
        "Elastic SIEM",
        "Sumo Logic",
        "Others",
    ],

    assetManagement: [
        "Cato",
        "Lansweeper",
        "ScalePad",
        "Zoho Asset Management",
        "Asset Panda",
        "Others",
    ],

    sdWan: [
        "Cato",
        "Cisco Meraki",
        "Fortinet",
        "Zscaler",
        "Palo Alto Networks",
        "Others",
    ],
};

/**
 * Helper: get vendors for a given service key.
 * Returns an empty array if the key is not recognised —
 * this lets the UI show a free-text field instead of a locked dropdown.
 *
 * Usage:  getVendors("nextGenFirewall")  → ["Cato", "Palo Alto Networks", ...]
 *         getVendors("WAN1")             → VENDORS.WAN  (WAN1/2/3 all map to WAN)
 */
export function getVendors(serviceKey) {
    // WAN1, WAN2, WAN3 all share the same list
    if (serviceKey === "WAN1" || serviceKey === "WAN2" || serviceKey === "WAN3") {
        return VENDORS.WAN;
    }
    // switching / routing / wireless keys from infraControls
    if (serviceKey === "switchingVendor") return VENDORS.switching;
    if (serviceKey === "routingVendor") return VENDORS.routing;
    if (serviceKey === "wirelessVendor") return VENDORS.wireless;
    if (serviceKey === "baremetalVendor") return VENDORS.baremetal;
    if (serviceKey === "virtualizationVendor") return VENDORS.virtualization;
    if (serviceKey === "cloudVendor") return VENDORS.cloud;

    // Security stack keys match directly
    return VENDORS[serviceKey] || [];
}
