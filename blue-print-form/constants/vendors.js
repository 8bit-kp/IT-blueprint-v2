/**
 * VENDOR LISTS PER SERVICE
 * ─────────────────────────────────────────────────────────────────────────────
 * To add or remove a vendor for any service, simply edit the array for that
 * service key below. "Others" should always remain as the last entry.
 *
 * Keys used:
 *   Infrastructure  → WAN, switching, routing, wireless, baremetal,
 *                     virtualization, cloud
 *   Security Stack  → nextGenFirewall, secureWebGateway, casb, dlp, ssaVpn,
 *                     emailSecurity, vulnerabilityMgmt, iam, nac, mfa, mdm,
 *                     edr, dataClassification, socSiem, assetManagement, sdWan
 */

export const VENDORS = {
    // ── Infrastructure ──────────────────────────────────────────────────────

    /** WAN 1 / WAN 2 / WAN 3 */
    WAN: [
        "Cato",
        "Spectrum",
        "Comcast",
        "Google Fiber",
        "AT&T",
        "Verizon",
        "Others",
    ],

    switching: [
        "Cato",
        "Cisco",
        "Aruba",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    routing: [
        "Cato",
        "Cisco",
        "Aruba",
        "Extreme",
        "Juniper",
        "Meraki",
        "UniFi",
        "Others",
    ],

    wireless: [
        "Cato",
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
        "Cato",
        "Microsoft (Hyper-V)",
        "Citrix",
        "Broadcom (VMware)",
        "Proxmox",
        "Nutanix",
        "Linux (KVM)",
        "Others",
    ],

    cloud: [
        "Cato",
        "Google Cloud (GCP)",
        "AWS",
        "Microsoft Azure",
        "Oracle Cloud",
        "IBM Cloud",
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
        "Palo Alto",
        "Netskope",
        "Cloudflare",
        "Others",
    ],

    casb: [
        "Cato",
        "Netskope",
        "Microsoft Defender for Cloud Apps",
        "Palo Alto",
        "Others",
    ],

    dlp: [
        "Cato",
        "Dropsuite",
        "Zscaler",
        "Microsoft Purview",
        "Others",
    ],

    /** SSL VPN */
    ssaVpn: [
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

    vulnerabilityMgmt: [
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
        "Microsoft Entra",
        "Google Workspace",
        "Okta",
        "Others",
    ],

    mdm: [
        "Cato",
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
        "CrowdStrike Falcon",
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
        "Palo Alto",
        "Others",
    ],
};

/**
 * Helper: get vendors for a given service key.
 * Returns an empty array if the key is not found —
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
