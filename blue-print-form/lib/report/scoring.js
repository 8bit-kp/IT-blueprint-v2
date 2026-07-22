/**
 * lib/report/scoring.js
 *
 * Composite weighting, critical-control penalty pass, score-cap pass,
 * and deduction waterfall production.
 *
 * Processing order (must not change without updating docs):
 *   1. Weighted composite = Σ(categoryRawScore × categoryWeight)
 *   2. Absolute penalties applied cumulatively
 *   3. Score cap: most severe applicable cap wins
 *   4. Clamp to [0, 100]
 */

// ── Penalty definitions ───────────────────────────────────────────────────────

const PENALTIES = [
    { id: "no_mfa",            label: "No MFA Deployed",                  value: 15,  signal: (s) => !s.mfaDeployed },
    { id: "no_edr",            label: "No EDR / Endpoint Protection",      value: 12,  signal: (s) => !s.edrDeployed },
    { id: "no_email_security", label: "No Email Security",                 value: 10,  signal: (s) => !s.emailSecurityDeployed },
    { id: "no_ngfw",           label: "No Next-Gen Firewall",              value: 10,  signal: (s) => !s.ngfwDeployed },
    { id: "backup_not_tested", label: "Backup Not Tested",                 value: 8,   signal: (s) => !s.backupTested },
    { id: "pii_no_dlp",        label: "PII Stored Without DLP",            value: 8,   signal: (s) => s.piiStoredNoDlp },
    { id: "no_ir_plan",        label: "No Incident Response Plan",         value: 7,   signal: (s) => !s.irPlanExists },
    { id: "no_bcdr",           label: "No BCDR Plan",                      value: 7,   signal: (s) => !s.bcdrPlanExists },
    { id: "no_security_policy",label: "No Security Policy",                value: 5,   signal: (s) => !s.securityPolicyExists },
    { id: "no_training",       label: "No Employee Security Training",     value: 5,   signal: (s) => !s.employeeTrainingDone },
    { id: "guest_unsegmented", label: "Guest Wireless Not Segmented",      value: 5,   signal: (s) => s.guestWirelessUnsegmented },
    { id: "wireless_psk",      label: "Wireless Using Shared Password (PSK)", value: 5, signal: (s) => s.wirelessPsk },
    { id: "hipaa_no_controls", label: "HIPAA Applications Without DLP / Data Classification", value: 10, signal: (s) => s.hipaaAppsWithoutControls },
];

// ── Score-cap rules ───────────────────────────────────────────────────────────
// Evaluated after penalties; most-severe matching cap wins.

const CAP_RULES = [
    // Most severe first; evaluated top-to-bottom and the first match wins for composite logic,
    // but we actually find the MINIMUM (lowest) cap that applies.
    { ids: ["no_mfa", "no_edr", "no_ngfw", "no_email_security"], cap: 45 },
    { ids: ["no_mfa", "no_edr", "no_ngfw"],                       cap: 52 },
    { ids: ["no_mfa", "no_edr"],                                   cap: 58 },
    { ids: ["no_mfa"],                                             cap: 65 },
];

// ── Core scoring pipeline ─────────────────────────────────────────────────────

/**
 * Compute the final security score with waterfall breakdown.
 *
 * @param {object}  signals    - From extractSignals()
 * @param {Array}   categories - From scoreAllCategories()
 * @returns {{
 *   finalScore: number,
 *   weightedComposite: number,
 *   triggeredPenalties: Array,
 *   appliedCap: number|null,
 *   waterfall: Array,
 * }}
 */
export function computeScore(signals, categories) {
    // ── Step 1: Weighted composite ────────────────────────────────────────
    const weightedComposite = Math.round(
        categories.reduce((sum, c) => sum + c.contribution, 0) * 10,
    ) / 10;

    // ── Step 2: Evaluate which penalties trigger ──────────────────────────
    const triggeredPenalties = PENALTIES.filter((p) => p.signal(signals)).map((p) => ({
        id:    p.id,
        label: p.label,
        value: p.value, // absolute deduction
    }));

    // ── Step 3: Apply penalties cumulatively ──────────────────────────────
    const totalPenalty      = triggeredPenalties.reduce((sum, p) => sum + p.value, 0);
    const afterPenalties    = Math.round((weightedComposite - totalPenalty) * 10) / 10;
    const triggeredPenaltyIds = new Set(triggeredPenalties.map((p) => p.id));

    // ── Step 4: Apply score cap ───────────────────────────────────────────
    let appliedCap = null;
    for (const rule of CAP_RULES) {
        if (rule.ids.every((id) => triggeredPenaltyIds.has(id))) {
            // This rule's conditions are all met — check if it's the tightest cap
            if (appliedCap === null || rule.cap < appliedCap) {
                appliedCap = rule.cap;
            }
        }
    }

    const afterCap     = appliedCap !== null ? Math.min(afterPenalties, appliedCap) : afterPenalties;
    const finalScore   = Math.round(Math.min(100, Math.max(0, afterCap)));

    // ── Step 5: Build deduction waterfall ────────────────────────────────
    // The waterfall shows how the final score is derived from the composite.
    const waterfall = [];

    // Starting point: weighted composite
    waterfall.push({
        type:         "composite",
        label:        "Weighted Composite Score",
        value:        weightedComposite,
        runningTotal: weightedComposite,
    });

    // Each triggered penalty
    let running = weightedComposite;
    for (const p of triggeredPenalties) {
        running = Math.round((running - p.value) * 10) / 10;
        waterfall.push({
            type:         "penalty",
            id:           p.id,
            label:        p.label,
            value:        -p.value,
            runningTotal: running,
        });
    }

    // Cap adjustment (only if cap actually reduces the score)
    if (appliedCap !== null && running > appliedCap) {
        const capAdjustment = Math.round((appliedCap - running) * 10) / 10;
        waterfall.push({
            type:         "cap",
            label:        `Score Cap Applied (missing critical controls)`,
            value:        capAdjustment,
            runningTotal: appliedCap,
        });
        running = appliedCap;
    }

    // Floor clamp entry if needed
    if (running < 0) {
        waterfall.push({
            type:         "floor",
            label:        "Score Floor (minimum 0)",
            value:        -running,
            runningTotal: 0,
        });
    }

    // Final score entry
    waterfall.push({
        type:         "final",
        label:        "Final Security Score",
        value:        finalScore,
        runningTotal: finalScore,
    });

    return { finalScore, weightedComposite, triggeredPenalties, appliedCap, waterfall };
}

// ── Risk summary derivation ───────────────────────────────────────────────────

/**
 * Derive three High/Medium/Low risk labels from signals and the final score.
 * These are mechanical derivations — not analyst judgments.
 *
 * @param {object} signals
 * @param {number} finalScore
 * @returns {{ cyber: string, downtime: string, compliance: string }}
 */
export function deriveRiskSummary(signals, finalScore) {
    // Cyber risk
    let cyberRisk;
    if (finalScore <= 35)                                                     cyberRisk = "Critical";
    else if (finalScore <= 55 || (!signals.mfaDeployed || !signals.edrDeployed)) cyberRisk = "High";
    else if (finalScore <= 70)                                                cyberRisk = "Medium";
    else                                                                      cyberRisk = "Low";

    // Downtime risk — physical + BCDR signals
    const downtimeSignals = [
        signals.upsPresent, signals.generatorPresent,
        signals.haRoutingEnabled, signals.backupTested,
        signals.bcdrPlanExists,
    ].filter(Boolean).length; // 0–5

    let downtimeRisk;
    const has24x7 = !!signals.systemsRequiring24x7;
    if (downtimeSignals <= 1 || (has24x7 && downtimeSignals <= 2)) downtimeRisk = "High";
    else if (downtimeSignals <= 3)                                  downtimeRisk = "Medium";
    else                                                            downtimeRisk = "Low";

    // Compliance risk — regulatory exposure + policy signals
    const highRiskIndustries = ["Healthcare", "Financial Services", "Government", "Government/Municipal"];
    const industryIsRegulated = highRiskIndustries.some(
        (i) => signals.industry && signals.industry.toLowerCase().includes(i.toLowerCase()),
    );

    let complianceRisk;
    const hasPiiOrHipaa = signals.piiAppsCount > 0 || signals.hipaaAppsCount > 0;
    const hasPolicy     = signals.securityPolicyExists && signals.changeControlExists;
    if ((industryIsRegulated || hasPiiOrHipaa) && !hasPolicy) complianceRisk = "High";
    else if (industryIsRegulated || hasPiiOrHipaa)            complianceRisk = "Medium";
    else                                                       complianceRisk = "Low";

    return { cyber: cyberRisk, downtime: downtimeRisk, compliance: complianceRisk };
}

// ── Strengths and critical risks derivation ───────────────────────────────────

const STRENGTH_DESCRIPTIONS = {
    iam:           "Identity controls (MFA, IAM) are deployed — credential-based attacks are significantly mitigated.",
    endpoint:      "Endpoints are protected with EDR and patch management — malware and ransomware defences are in place.",
    network:       "Network security controls (NGFW, SWG, NAC) are deployed — perimeter defences are established.",
    dataprotection:"Backups are tested and data classification is in place — recovery capability is validated.",
    email:         "Email security and employee training are deployed — the primary phishing attack vector is addressed.",
    governance:    "Security policies and governance processes are formally documented and enforced.",
    ir:            "Incident response and disaster recovery plans are in place — the organisation can respond to incidents systematically.",
    vulnerability: "Vulnerability scanning is active — known weaknesses are regularly identified and tracked.",
    cloudapp:      "Cloud access and application security controls are deployed — shadow IT and data exfiltration risks are managed.",
    awareness:     "Employee security awareness program is active — the human attack vector is addressed.",
    monitoring:    "SIEM and asset management provide visibility — threats can be detected and investigated.",
    physical:      "Physical resilience controls (UPS, generator) are in place — power-related outage risk is mitigated.",
};

const PENALTY_RISK_DESCRIPTIONS = {
    no_mfa:            "No MFA: a single stolen password gives an attacker immediate access to all systems. Prevents 99.9% of automated attacks when deployed.",
    no_edr:            "No EDR: modern malware and ransomware operate silently on endpoints without behavioural detection. Traditional antivirus misses ~40% of modern threats.",
    no_email_security: "No email security: 90% of attacks begin with a phishing email. Without filtering and sandboxing, every email is a potential breach vector.",
    no_ngfw:           "No next-generation firewall: the network perimeter is defended only by basic packet filtering, which cannot detect or block application-layer attacks.",
    backup_not_tested: "Backups not tested: an untested backup is a hypothesis, not a recovery capability. Most ransomware victims with 'backups' discover restoration failures during an incident.",
    pii_no_dlp:        "PII stored without DLP: there is no mechanism to detect or prevent sensitive data from leaving via email, upload, or cloud sync.",
    no_ir_plan:        "No incident response plan: without a documented plan, breach containment is ad hoc. Every extra hour of confusion during an incident extends the blast radius.",
    no_bcdr:           "No BCDR plan: without a documented recovery procedure, an outage or ransomware event has no structured recovery path — recovery times are measured in weeks, not hours.",
    no_security_policy:"No security policy: there is no documented baseline to enforce, audit, or hold staff accountable to — the foundation of all security controls is missing.",
    no_training:       "No employee training: 82% of breaches involve a human element. Without awareness training, every employee is an unguarded entry point for social engineering.",
    guest_unsegmented: "Guest wireless is unsegmented: a guest device — or an attacker with a laptop — can reach internal systems from the guest network.",
    wireless_psk:      "Wireless using PSK: a single shared password protects wireless access. One compromised device, one departed employee, or one overheard password exposes the entire wireless network.",
    hipaa_no_controls: "HIPAA applications without DLP or data classification: regulated health data has no controls preventing exfiltration. HIPAA breach penalties average $100–$50,000 per affected record.",
};

/**
 * Derive top 3 strengths and top 3 critical risks from category scores
 * and triggered penalties. Purely mechanical — no authored narrative.
 *
 * @param {Array}  categories         - From scoreAllCategories()
 * @param {Array}  triggeredPenalties - From computeScore()
 * @returns {{ strengths: Array, criticalRisks: Array }}
 */
export function deriveStrengthsAndRisks(categories, triggeredPenalties) {
    // Strengths: categories with rawScore >= 60, sorted highest first, top 3
    const strengths = categories
        .filter((c) => c.rawScore >= 60)
        .sort((a, b) => b.rawScore - a.rawScore)
        .slice(0, 3)
        .map((c) => ({
            label:       c.name,
            score:       c.rawScore,
            description: STRENGTH_DESCRIPTIONS[c.id] || `${c.name} controls are performing well.`,
        }));

    // Critical risks: triggered penalties sorted by value descending, top 3
    const criticalRisks = triggeredPenalties
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .map((p) => ({
            label:       p.label,
            penalty:     p.value,
            description: PENALTY_RISK_DESCRIPTIONS[p.id] || `This control is missing — address promptly.`,
        }));

    // If fewer than 3 triggered penalties, fill with lowest-scoring categories
    if (criticalRisks.length < 3) {
        const weakCategories = categories
            .filter((c) => c.rawScore < 40)
            .sort((a, b) => a.rawScore - b.rawScore)
            .slice(0, 3 - criticalRisks.length)
            .filter((c) => !criticalRisks.some((r) => r.label === c.name))
            .map((c) => ({
                label:       c.name,
                penalty:     0,
                description: `${c.name} scored below 40/100 — this category has significant gaps.`,
            }));
        criticalRisks.push(...weakCategories);
    }

    return { strengths, criticalRisks };
}

// ── Key metrics ───────────────────────────────────────────────────────────────

/**
 * Compute the 6 KPI card metrics.
 *
 * @param {object} signals
 * @param {Array}  triggeredPenalties
 * @returns {{ criticalFindingsCount, controlsMissingCount, appMfaCoverage, appBackupCoverage }}
 */
export function computeMetrics(signals, triggeredPenalties) {
    // Critical findings = penalties with value >= 7
    const criticalFindingsCount = triggeredPenalties.filter((p) => p.value >= 7).length;

    // Controls missing = 16 total tech controls minus those deployed
    const controlsMissingCount = 16 - signals.technicalControlsPresent;

    return {
        criticalFindingsCount,
        controlsMissingCount,
        appMfaCoverage:    signals.appMfaCoverage,
        appBackupCoverage: signals.appBackupCoverage,
    };
}
