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
        "AT&T",
        "Comcast",
        "Google Fiber",
        "Spectrum",
        "Verizon",
        "Others",
    ],

    switching: [
        "Aruba",
        "Cisco",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    routing: [
        "Aruba",
        "Cisco",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    wireless: [
        "Cisco",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    baremetal: [
        "Dell",
        "HP",
        "IBM",
        "Supermicro",
        "Others",
    ],

    virtualization: [
        "Broadcom (VMware)",
        "Citrix",
        "Linux (KVM)",
        "Microsoft (Hyper-V)",
        "Nutanix",
        "Proxmox",
        "Others",
    ],

    cloud: [
        "Alibaba Cloud",
        "AWS",
        "Google Cloud (GCP)",
        "IBM Cloud",
        "Microsoft Azure",
        "Oracle Cloud",
        "Others",
    ],

    // ── Security Stack ───────────────────────────────────────────────────────

    nextGenFirewall: [
        "Cato",
        "Check Point",
        "Cisco",
        "Fortinet",
        "Palo Alto Networks",
        "Others",
    ],

    secureWebGateway: [
        "Cato",
        "Cloudflare",
        "Netskope",
        "Palo Alto Networks",
        "Zscaler",
        "Others",
    ],

    casb: [
        "Cato",
        "Microsoft Defender for Cloud Apps",
        "Netskope",
        "Palo Alto Networks",
        "Others",
    ],

    dlp: [
        "Cato",
        "Dropsuite",
        "Microsoft Purview",
        "Zscaler",
        "Others",
    ],

    sslVpn: [
        "Cisco AnyConnect",
        "Cato VPN",
        "FortiGate",
        "Ivanti",
        "OpenVPN",
        "Others",
    ],

    emailSecurity: [
        "Barracuda",
        "Cato",
        "IRONSCALES",
        "Microsoft Defender",
        "Proofpoint",
        "Others",
    ],

    vulnerabilityScanning: [
        "Cato",
        "Nodeware",
        "Qualys",
        "Rapid7",
        "Tenable",
        "Others",
    ],

    iam: [
        "Auth0",
        "Cato",
        "Microsoft Entra ID",
        "Okta",
        "Ping Identity",
        "Others",
    ],

    nac: [
        "Aruba ClearPass",
        "Cisco ISE",
        "Extreme Networks",
        "FortiNAC",
        "Varonis",
        "Others",
    ],

    mfa: [
        "Cato",
        "Duo",
        "Google Workspace (MFA)",
        "Microsoft Entra ID",
        "Okta",
        "Others",
    ],

    mdm: [
        "Ivanti",
        "Jamf / Jamf Pro",
        "JumpCloud",
        "Microsoft Intune",
        "Omnissa (VMware Workspace ONE)",
        "Others",
    ],

    edr: [
        "Bitdefender",
        "Cato",
        "CrowdStrike",
        "Huntress",
        "Microsoft Defender",
        "SentinelOne",
        "Sophos",
        "Trend Micro",
        "Others",
    ],

    dataClassification: [
        "Cato",
        "Lepide",
        "Microsoft Purview",
        "Power BI",
        "Tableau",
        "Others",
    ],

    socSiem: [
        "Cato",
        "CrowdStrike",
        "Elastic SIEM",
        "Google Chronicle",
        "Microsoft Sentinel",
        "Splunk",
        "Sumo Logic",
        "Others",
    ],

    assetManagement: [
        "Asset Panda",
        "Cato",
        "Lansweeper",
        "ScalePad",
        "Zoho Asset Management",
        "Others",
    ],

    sdWan: [
        "Cato",
        "Cisco Meraki",
        "Fortinet",
        "Palo Alto Networks",
        "Zscaler",
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
