/**
 * lib/report/categories.js
 *
 * 12 weighted security category scoring functions.
 *
 * Each scorer receives the full signals object and returns:
 *   { id, name, weight, rawScore, contribution }
 *
 * rawScore:    0–100  (normalised within the category; raw points / max_points * 100)
 * contribution: rawScore * weight  (the portion added to the weighted composite)
 *
 * Design principles:
 *   - Missing signals degrade to 0 points, never throw
 *   - Raw scores are capped at 100 even if point totals exceed 100
 *   - Weights are expressed as decimals (0.15 = 15%), sum = 1.0
 */

const cap100 = (n) => Math.min(100, Math.max(0, n));
const pts    = (condition, points) => (condition ? points : 0);

// ── Category 1: Identity & Access Management — 15% ───────────────────────────
function scoreIAM(s) {
    let raw = 0;
    raw += pts(s.mfaDeployed, 35);
    raw += pts(s.iamDeployed, 20);

    // Wireless authentication strength
    if (s.wirelessAuth === "EAP-TLS")   raw += 15;
    else if (s.wirelessAuth === "EAP-PEAP") raw += 8;
    // PSK: 0 points

    // Per-application MFA coverage
    if (s.appMfaCoverage !== null) {
        if (s.appMfaCoverage >= 80) raw += 20;
        else if (s.appMfaCoverage >= 50) raw += 10;
    }

    raw += pts(s.linuxMfaAccess, 10);

    return { id: "iam", name: "Identity & Access Management", weight: 0.15, rawScore: cap100(raw) }; // 15%
}

// ── Category 2: Endpoint & Device Security — 14% ─────────────────────────────
function scoreEndpoint(s) {
    let raw = 0;
    raw += pts(s.edrDeployed, 30);
    raw += pts(s.mdmDeployed, 20);
    raw += pts(s.desktopsProtected, 15);
    raw += pts(s.desktopsPatched, 15);
    raw += pts(s.windowsServersProtected, 10);
    raw += pts(s.windowsServersBackedUp, 10);
    raw += pts(s.desktopsMonitored, 10);
    // Only award "not-monitored" credit when Windows servers are actually declared
    if (s.windowsServersPresent) {
        raw += pts(!s.windowsNotMonitored, 10);
    }
    raw += pts(s.linuxServersPatched, 10);
    // Max possible: 130 → cap at 100

    return { id: "endpoint", name: "Endpoint & Device Security", weight: 0.13, rawScore: cap100(raw) }; // 13%
}

// ── Category 3: Network Security — 13% ───────────────────────────────────────
function scoreNetwork(s) {
    let raw = 0;
    raw += pts(s.ngfwDeployed, 25);
    raw += pts(s.swgDeployed, 15);
    raw += pts(s.nacDeployed, 15);
    raw += pts(s.haRoutingEnabled, 10);
    raw += pts(s.guestWirelessSegmented, 10);
    raw += pts(s.wanRedundancy, 10);

    // Wireless auth — binary cut: not-PSK = 10, PSK = 0; no wireless = 0 (no risk, no credit)
    if (s.wirelessPresent) {
        raw += pts(s.wirelessAuth && s.wirelessAuth !== "PSK", 10);
    }

    raw += pts(s.sdWanDeployed, 5);
    // Max possible: 100 ✓

    return { id: "network", name: "Network Security", weight: 0.12, rawScore: cap100(raw) }; // 12%
}

// ── Category 4: Data Protection & Backup — 12% ───────────────────────────────
function scoreDataProtection(s) {
    let raw = 0;
    raw += pts(s.backupTested, 25);
    raw += pts(s.dlpDeployed, 20);
    raw += pts(s.dataClassDeployed, 15);
    raw += pts(s.casbDeployed, 15); // relevant regardless of cloud posture; absence is a gap

    if (s.appBackupCoverage !== null) {
        if (s.appBackupCoverage >= 80) raw += 15;
        else if (s.appBackupCoverage >= 50) raw += 7;
    }

    // No PII apps without backup — only meaningful when apps are actually recorded
    raw += pts(s.allAppsCount > 0 && (s.piiAppsCount === 0 || !s.hasPiiAppsWithoutBackup), 10);
    // Max possible: 100 ✓

    return { id: "dataprotection", name: "Data Protection & Backup", weight: 0.11, rawScore: cap100(raw) }; // 11%
}

// ── Category 5: Email & Communication Security — 10% ─────────────────────────
function scoreEmail(s) {
    let raw = 0;
    raw += pts(s.emailSecurityDeployed, 65);
    raw += pts(s.employeeTrainingDone, 35);
    // Max possible: 100 ✓

    return { id: "email", name: "Email & Communication Security", weight: 0.09, rawScore: cap100(raw) }; // 9%
}

// ── Category 6: Governance & Policy — 9% ─────────────────────────────────────
function scoreGovernance(s) {
    let raw = 0;
    raw += pts(s.securityPolicyExists, 30);
    raw += pts(s.securityCommitteeExists, 20);
    raw += pts(s.monthlySecurityReview, 20);
    raw += pts(s.changeControlExists, 15);
    raw += pts(s.cyberInsuranceExists, 15);
    // Max possible: 100 ✓

    return { id: "governance", name: "Governance & Policy", weight: 0.08, rawScore: cap100(raw) }; // 8%
}

// ── Category 7: Incident Response & Recovery — 9% ────────────────────────────
function scoreIR(s) {
    let raw = 0;
    raw += pts(s.irPlanExists, 35);
    raw += pts(s.bcdrPlanExists, 30);
    raw += pts(s.backupTested, 25);
    raw += pts(s.penTestDone, 10);
    // Max possible: 100 ✓

    return { id: "ir", name: "Incident Response & Recovery", weight: 0.08, rawScore: cap100(raw) }; // 8%
}

// ── Category 8: Vulnerability & Threat Management — 8% ───────────────────────
function scoreVulnerability(s) {
    let raw = 0;
    raw += pts(s.vulnScanningDeployed, 40);
    raw += pts(s.penTestDone, 30);
    raw += pts(s.windowsServersProtected, 15);
    raw += pts(s.linuxServersPatched, 15);
    // Max possible: 100 ✓

    return { id: "vulnerability", name: "Vulnerability & Threat Management", weight: 0.07, rawScore: cap100(raw) }; // 7%
}

// ── Category 9: Cloud & Application Security — 7% ────────────────────────────
function scoreCloudApp(s) {
    let raw = 0;
    raw += pts(s.casbDeployed, 30);

    if (s.appMfaCoverage !== null) {
        if (s.appMfaCoverage >= 80) raw += 20;
        else if (s.appMfaCoverage >= 50) raw += 10;
    }

    if (s.appBackupCoverage !== null) {
        if (s.appBackupCoverage >= 80) raw += 20;
        else if (s.appBackupCoverage >= 50) raw += 10;
    }

    raw += pts(s.dlpDeployed, 15);
    raw += pts(s.sdWanDeployed, 15);
    // Max possible: 100 ✓

    return { id: "cloudapp", name: "Cloud & Application Security", weight: 0.06, rawScore: cap100(raw) }; // 6%
}

// ── Category 10: Security Awareness & Culture — 5% ───────────────────────────
function scoreAwareness(s) {
    let raw = 0;
    raw += pts(s.employeeTrainingDone, 70);
    raw += pts(s.monthlySecurityReview, 20);

    // Bonus only when training is active AND org doesn't flag Security as a challenge
    const identifiedSecurityChallenge = s.operationalChallenges.includes("Security");
    raw += pts(s.employeeTrainingDone && !identifiedSecurityChallenge, 10);
    // Max possible: 100 ✓

    return { id: "awareness", name: "Security Awareness & Culture", weight: 0.05, rawScore: cap100(raw) };
}

// ── Category 11: Monitoring & Visibility — 4% ────────────────────────────────
function scoreMonitoring(s) {
    let raw = 0;
    raw += pts(s.socSiemDeployed, 50);
    raw += pts(s.assetMgmtDeployed, 30);
    raw += pts(s.monthlySecurityReview, 20);
    // Max possible: 100 ✓

    return { id: "monitoring", name: "Monitoring & Visibility", weight: 0.03, rawScore: cap100(raw) }; // 3%
}

// ── Category 12: Physical & Operational Resilience — 4% ──────────────────────
function scorePhysical(s) {
    let raw = 0;
    raw += pts(s.upsPresent, 40);
    raw += pts(s.generatorPresent, 30);
    raw += pts(s.serversMonitored, 30);
    // Max possible: 100 ✓

    // Non-penalise if no on-prem DC (physical resilience less relevant)
    // Scores still reflect what's deployed

    return { id: "physical", name: "Physical & Operational Resilience", weight: 0.03, rawScore: cap100(raw) }; // 3%
}

// ── Ordered array of all 12 scorers ──────────────────────────────────────────

const CATEGORY_SCORERS = [
    scoreIAM,
    scoreEndpoint,
    scoreNetwork,
    scoreDataProtection,
    scoreEmail,
    scoreGovernance,
    scoreIR,
    scoreVulnerability,
    scoreCloudApp,
    scoreAwareness,
    scoreMonitoring,
    scorePhysical,
];

/**
 * Score all 12 categories.
 *
 * @param {object} signals - Normalised signals from extractSignals()
 * @returns {Array<{id, name, weight, rawScore, contribution}>}
 */
export function scoreAllCategories(signals) {
    return CATEGORY_SCORERS.map((scorer) => {
        const { id, name, weight, rawScore } = scorer(signals);
        const contribution = Math.round(rawScore * weight * 10) / 10;
        return { id, name, weight, rawScore, contribution };
    });
}
