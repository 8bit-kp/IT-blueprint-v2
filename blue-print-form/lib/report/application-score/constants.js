/**
 * lib/report/application-score/constants.js
 *
 * Every tunable parameter for the Application Security Score, exactly as
 * specified in docs/application-security-score-methodology.md §§ 4, 7, 9, 14.
 * scoring.js and risk-drivers.js must reference these constants only —
 * never inline the numbers below.
 */

/** @type {Record<import('./types.js').BusinessPriority|'unknown', number>} */
export const PRIORITY_IMPACT = {
    low:      0.15,
    medium:   0.40,
    high:     0.70,
    critical: 1.00,
    unknown:  0.40, // treated as Medium — see methodology § 10
};

/** @type {Record<import('./types.js').YesNoUnknown, number>} */
export const SENSITIVITY_IMPACT = {
    yes:     0.50,
    no:      0.00,
    unknown: 0.25,
};

/** @type {Record<import('./types.js').YesNoUnknown, number>} */
export const MFA_WEAKNESS = {
    no:      0.75,
    yes:     0.03,
    unknown: 0.45,
};

/** @type {Record<import('./types.js').YesNoUnknown, number>} */
export const BACKUP_WEAKNESS = {
    no:      0.40,
    yes:     0.03,
    unknown: 0.25,
};

/** @type {Record<import('./types.js').YesNoUnknown, number>} */
export const BYOD_WEAKNESS = {
    yes:     0.25,
    no:      0.03,
    unknown: 0.15,
};

// Floor applied to Weakness so a flawless application still carries a small
// amount of inherent risk proportional to its Impact — see methodology § 4.3.
export const RESIDUAL_FLOOR = 0.15;

// Section-level blend between mean (overall health) and max (single
// high-risk outlier) — see methodology § 8.
export const SECTION_BLEND_ALPHA = 0.7;

/** @type {Record<string, number>} */
export const DEFAULT_SECTION_WEIGHTS = {
    productivity: 30,
    finance:      25,
    hrit:         20,
    payroll:      15,
    additional:   10,
};

export const CUSTOM_SECTION_WEIGHT = 5;

/**
 * Application-level risk classification (0-100 risk, higher = worse).
 * @type {Array<{max: number, level: import('./types.js').RiskLevel}>}
 */
export const RISK_LEVEL_THRESHOLDS = [
    { max: 24,  level: 'Low' },
    { max: 49,  level: 'Medium' },
    { max: 74,  level: 'High' },
    { max: 100, level: 'Critical' },
];
