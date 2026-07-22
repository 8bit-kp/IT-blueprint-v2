/**
 * lib/report/signals.js
 *
 * Extracts and normalises raw blueprint data into typed scoring signals.
 * Every field is treated as potentially absent — missing fields degrade
 * gracefully to false / 0 / null, never throwing.
 *
 * This is the sole place that knows the blueprint document's field layout.
 * All category scorers depend only on the signal object produced here.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

const isYes = (v) => typeof v === "string" && v.trim().toLowerCase() === "yes";

const ctrl = (tc, name) => isYes(tc?.[name]?.choice);

function getAllApps(applications) {
    if (!applications || typeof applications !== "object") return [];
    const apps = [];
    for (const key of Object.keys(applications)) {
        const arr = applications[key];
        if (Array.isArray(arr)) apps.push(...arr);
    }
    return apps.filter((a) => a && typeof a === "object");
}

function calcCoverage(apps, predicate) {
    if (!apps.length) return null; // null = "no apps recorded", distinct from 0%
    const count = apps.filter(predicate).length;
    return Math.round((count / apps.length) * 100);
}

// ── Exported signal list ──────────────────────────────────────────────────────

// 16 technical control keys (matches Blueprint.js technicalControls sub-schema)
export const TECH_CONTROL_KEYS = [
    "nextGenFirewall", "secureWebGateway", "casb", "dlp", "sslVpn",
    "emailSecurity", "vulnerabilityScanning", "iam", "nac", "mfa",
    "mdm", "edr", "dataClassification", "socSiem", "assetManagement", "sdWan",
];

/**
 * Extract all scoring signals from a raw blueprint document.
 *
 * @param {object} bp - Raw blueprint object (from API, lean Mongoose doc or empty {})
 * @returns {object} Flat signals object — all keys always present, missing → false/0/null
 */
export function extractSignals(bp) {
    if (!bp || typeof bp !== "object") bp = {};

    const tc       = bp.technicalControls || {};
    const allApps  = getAllApps(bp.applications);

    // PII/HIPAA classification: any non-empty, non-"Not set" value counts
    const hasSensitiveValue = (v) => v && v !== "Not set" && v !== "";
    const piiApps   = allApps.filter((a) => hasSensitiveValue(a.personallyIdentifiableInfo));
    const hipaaApps = allApps.filter(
        (a) => hasSensitiveValue(a.hipaaRegulated) && a.hipaaRegulated !== "No",
    );

    const appMfaCoverage    = calcCoverage(allApps, (a) => isYes(a.mfa));
    const appBackupCoverage = calcCoverage(allApps, (a) => isYes(a.backedUp));

    const guestWireless  = isYes(bp.guestWireless);
    const guestSegmented = isYes(bp.guestSegmentation);

    // Is wireless infra present? True if guest wireless is Yes OR wireless vendor is deployed
    const wirelessPresent = guestWireless || ctrl(tc, "wirelessVendor") || isYes(bp.wirelessVendor?.choice);

    return {
        // ── Identity & Access ─────────────────────────────────────────────
        mfaDeployed:          ctrl(tc, "mfa"),
        iamDeployed:          ctrl(tc, "iam"),
        wirelessAuth:         bp.wirelessAuth  || null,
        wirelessPresent,
        appMfaCoverage,
        linuxMfaAccess:       Array.isArray(bp.linuxOptions) && bp.linuxOptions.includes("MFA for Access"),

        // ── Endpoint & Device ─────────────────────────────────────────────
        edrDeployed:             ctrl(tc, "edr"),
        mdmDeployed:             ctrl(tc, "mdm"),
        desktopsProtected:       Array.isArray(bp.desktopOptions) && bp.desktopOptions.includes("Protected"),
        desktopsPatched:         Array.isArray(bp.desktopOptions) && bp.desktopOptions.includes("Fully patched"),
        desktopsMonitored:       Array.isArray(bp.desktopOptions) && bp.desktopOptions.includes("Monitored"),
        windowsServersProtected: Array.isArray(bp.windowsOptions) && bp.windowsOptions.includes("Protected"),
        windowsServersBackedUp:  Array.isArray(bp.windowsOptions) && bp.windowsOptions.includes("Backed-up"),
        windowsNotMonitored:     Array.isArray(bp.windowsOptions) && bp.windowsOptions.includes("Not Monitored"),
        linuxServersProtected:   Array.isArray(bp.linuxOptions)   && bp.linuxOptions.includes("Protected"),
        linuxServersPatched:     Array.isArray(bp.linuxOptions)   && bp.linuxOptions.includes("Fully patched"),

        // ── Network Security ──────────────────────────────────────────────
        ngfwDeployed:           ctrl(tc, "nextGenFirewall"),
        swgDeployed:            ctrl(tc, "secureWebGateway"),
        nacDeployed:            ctrl(tc, "nac"),
        haRoutingEnabled:       isYes(bp.haRouting),
        guestWirelessSegmented: guestWireless && guestSegmented,
        wanRedundancy:          isYes(bp.WAN1?.choice) && isYes(bp.WAN2?.choice),
        sdWanDeployed:          ctrl(tc, "sdWan"),

        // ── Data Protection & Backup ──────────────────────────────────────
        backupTested:        isYes(bp.testBackup),
        dlpDeployed:         ctrl(tc, "dlp"),
        dataClassDeployed:   ctrl(tc, "dataClassification"),
        casbDeployed:        ctrl(tc, "casb"),
        appBackupCoverage,
        hasCloudInfra:       isYes(bp.hasCloudInfra),
        piiAppsCount:        piiApps.length,
        hasPiiAppsWithoutBackup: piiApps.some((a) => !isYes(a.backedUp)),

        // ── Email & Communication ─────────────────────────────────────────
        emailSecurityDeployed: ctrl(tc, "emailSecurity"),

        // ── Governance & Policy ───────────────────────────────────────────
        securityPolicyExists:    isYes(bp.securityPolicy),
        securityCommitteeExists: isYes(bp.securityCommittee),
        monthlySecurityReview:   isYes(bp.securityReview),
        changeControlExists:     isYes(bp.changeControl),
        cyberInsuranceExists:    isYes(bp.cyberInsurance),

        // ── Incident Response & Recovery ──────────────────────────────────
        irPlanExists:   isYes(bp.incidentResponse),
        bcdrPlanExists: isYes(bp.bcdrPlan),
        penTestDone:    isYes(bp.penetrationTest),

        // ── Vulnerability & Threat Management ────────────────────────────
        vulnScanningDeployed: ctrl(tc, "vulnerabilityScanning"),

        // ── Cloud & Application Security ──────────────────────────────────
        sslVpnDeployed: ctrl(tc, "sslVpn"),

        // ── Security Awareness & Culture ─────────────────────────────────
        employeeTrainingDone:    isYes(bp.employeeTraining),
        operationalChallenges:   Array.isArray(bp.operationalChallenges) ? bp.operationalChallenges : [],

        // ── Monitoring & Visibility ───────────────────────────────────────
        socSiemDeployed:   ctrl(tc, "socSiem"),
        assetMgmtDeployed: ctrl(tc, "assetManagement"),

        // ── Physical & Operational Resilience ────────────────────────────
        upsPresent:       isYes(bp.hasUPS),
        generatorPresent: isYes(bp.hasGenerator),
        hasOnPremDC:      isYes(bp.hasOnPremDC),
        windowsServersPresent: isYes(bp.windowsServers),
        linuxServersPresent:   isYes(bp.linuxServers),
        serversMonitored:
            (Array.isArray(bp.windowsOptions) && bp.windowsOptions.includes("Monitored")) ||
            (Array.isArray(bp.linuxOptions)   && bp.linuxOptions.includes("Monitored")),

        // ── Context signals (for risk narrative, not direct scoring) ──────
        industry:            bp.industry            || null,
        employees:           bp.employees           || null,
        remotePercentage:    typeof bp.remotePercentage    === "number" ? bp.remotePercentage    : null,
        contractorPercentage:typeof bp.contractorPercentage=== "number" ? bp.contractorPercentage: null,
        primaryCustomerType: bp.primaryCustomerType  || null,
        geographicReach:     bp.geographicReach      || null,
        highestBusinessPriority: bp.highestBusinessPriority || null,
        deploymentModel:     bp.deploymentModel      || null,
        systemsRequiring24x7:bp.systemsRequiring24x7 || null,

        // ── Penalty-trigger signals (derived booleans) ────────────────────
        hipaaAppsWithoutControls: hipaaApps.length > 0 && !ctrl(tc, "dlp") && !ctrl(tc, "dataClassification"),
        piiStoredNoDlp:           piiApps.length > 0 && !ctrl(tc, "dlp"),
        guestWirelessUnsegmented: guestWireless && !guestSegmented,
        wirelessPsk:              wirelessPresent && bp.wirelessAuth === "PSK",

        // ── App portfolio metrics ─────────────────────────────────────────
        allAppsCount:    allApps.length,
        appMfaCoverage,
        appBackupCoverage,
        hipaaAppsCount:  hipaaApps.length,
        piiAppsCount:    piiApps.length,

        // ── Tech controls present (for "controls missing" KPI) ────────────
        technicalControlsPresent: TECH_CONTROL_KEYS.filter((k) => ctrl(tc, k)).length,
    };
}
