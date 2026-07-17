/**
 * labels.js — shared label-formatting helpers for reports and dashboards.
 */

// Known IT acronyms that should be rendered in all-caps / specific casing.
const ACRONYM_MAP = {
    "Sd Wan":   "SD-WAN",
    "Soc Siem": "SOC / SIEM",
    "Ssl Vpn":  "SSL VPN",
    "Edr":      "EDR",
    "Mdm":      "MDM",
    "Mfa":      "MFA",
    "Nac":      "NAC",
    "Iam":      "IAM",
    "Dlp":      "DLP",
    "Casb":     "CASB",
};

/**
 * Converts a camelCase control key into a human-readable label,
 * applying known acronym replacements.
 *
 * e.g. "nextGenFirewall" → "Next Gen Firewall"
 *      "sdWan"           → "SD-WAN"
 */
export const formatControlLabel = (key) => {
    let label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());

    for (const [pattern, replacement] of Object.entries(ACRONYM_MAP)) {
        label = label.replace(pattern, replacement);
    }

    return label;
};

/**
 * Resolves the display title for an application category key.
 *
 * Built-in special case: "hrit" → "HR / IT"
 * Custom categories: looked up from the customCategories array stored in
 * the blueprint document.
 */
export const resolveCategoryTitle = (category, customCategories = []) => {
    const customMeta = customCategories.find((c) => c.key === category);
    if (customMeta) return customMeta.title;
    if (category === "hrit") return "HR / IT";
    return category.charAt(0).toUpperCase() + category.slice(1);
};
