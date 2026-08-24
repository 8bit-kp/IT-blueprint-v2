/**
 * lib/report/application-score/scoring.js
 *
 * Application-, section-, and portfolio-level Application Security Score
 * calculations. Formulas match docs/application-security-score-methodology.md
 * §§ 4, 8, 9, 14 exactly:
 *
 *   Impact          = 1 - (1 - P) × (1 - S)                      [probabilistic OR]
 *   Weakness        = 1 - (1 - w_mfa) × (1 - w_backup) × (1 - w_byod)
 *   Application Risk (0-1) = Impact × (RESIDUAL_FLOOR + (1 - RESIDUAL_FLOOR) × Weakness)
 *   Application Risk Score (0-100) = round(Risk × 100)
 *   Application Security Score     = 100 - Risk Score
 *
 *   Section Risk    = SECTION_BLEND_ALPHA × mean(app risks) + (1 - SECTION_BLEND_ALPHA) × max(app risks)
 *   Portfolio Risk  = Σ (normalizedWeight_i × SectionRisk_i), weights renormalized to active sections
 *
 * Pure functions only: no React, no DOM, no data fetching, no database
 * calls. See README.md for this module's isolation boundary.
 */

import {
    PRIORITY_IMPACT,
    SENSITIVITY_IMPACT,
    MFA_WEAKNESS,
    BACKUP_WEAKNESS,
    BYOD_WEAKNESS,
    RESIDUAL_FLOOR,
    SECTION_BLEND_ALPHA,
    RISK_LEVEL_THRESHOLDS,
} from "./constants.js";
import { getTopRiskDrivers } from "./risk-drivers.js";

// ── Application-level scoring ─────────────────────────────────────────────────

/**
 * @param {import('./types.js').ApplicationInput} app
 * @returns {boolean}
 */
function hasUnknownField(app) {
    return (
        app.businessPriority === "unknown" ||
        app.sensitiveInformation === "unknown" ||
        app.mfaEnabled === "unknown" ||
        app.backedUp === "unknown" ||
        app.byodAccess === "unknown"
    );
}

/**
 * @param {import('./types.js').ApplicationInput} app
 * @returns {{ risk: number, hasIncompleteData: boolean }}
 */
export function calculateApplicationRisk(app) {
    const priority    = PRIORITY_IMPACT[app.businessPriority] ?? PRIORITY_IMPACT.unknown;
    const sensitivity = SENSITIVITY_IMPACT[app.sensitiveInformation] ?? SENSITIVITY_IMPACT.unknown;
    const impact      = 1 - (1 - priority) * (1 - sensitivity);

    const wMfa    = MFA_WEAKNESS[app.mfaEnabled] ?? MFA_WEAKNESS.unknown;
    const wBackup = BACKUP_WEAKNESS[app.backedUp] ?? BACKUP_WEAKNESS.unknown;
    const wByod   = BYOD_WEAKNESS[app.byodAccess] ?? BYOD_WEAKNESS.unknown;
    const weakness = 1 - (1 - wMfa) * (1 - wBackup) * (1 - wByod);

    const riskFraction = impact * (RESIDUAL_FLOOR + (1 - RESIDUAL_FLOOR) * weakness);

    return {
        risk: Math.round(riskFraction * 100),
        hasIncompleteData: hasUnknownField(app),
    };
}

/**
 * @param {import('./types.js').ApplicationInput} app
 * @returns {number}
 */
export function calculateApplicationSecurityScore(app) {
    const { risk } = calculateApplicationRisk(app);
    return 100 - risk;
}

/**
 * Application-level risk classification (0-100 risk, higher = worse).
 *
 * @param {number} risk
 * @returns {import('./types.js').RiskLevel}
 */
export function getRiskLevel(risk) {
    const match = RISK_LEVEL_THRESHOLDS.find((t) => risk <= t.max);
    return match ? match.level : "Critical";
}

// ── Section-level aggregation ─────────────────────────────────────────────────

/**
 * Empty sections must be excluded upstream (see calculatePortfolioRisk) —
 * never scored as 0. Called with an empty array, this throws.
 *
 * @param {number[]} appRiskScores
 * @returns {number}
 */
export function calculateSectionRisk(appRiskScores) {
    if (appRiskScores.length === 0) {
        throw new Error("calculateSectionRisk should not be called with an empty section");
    }
    const mean = appRiskScores.reduce((sum, r) => sum + r, 0) / appRiskScores.length;
    const max  = Math.max(...appRiskScores);
    return SECTION_BLEND_ALPHA * mean + (1 - SECTION_BLEND_ALPHA) * max;
}

// ── Portfolio-level aggregation ───────────────────────────────────────────────

/**
 * @param {import('./types.js').SectionDefinition[]} sections
 * @param {Record<string, import('./types.js').ApplicationInput[]>} applicationsBySection
 * @returns {import('./types.js').PortfolioScoreResult}
 */
export function calculatePortfolioRisk(sections, applicationsBySection) {
    const sectionResults = [];
    let totalActiveWeight = 0;
    let totalApplications = 0;

    for (const section of sections) {
        const apps = applicationsBySection[section.id] ?? [];
        if (apps.length === 0) continue; // empty sections never enter the weight sum

        const appResults = apps.map((app) => {
            const { risk, hasIncompleteData } = calculateApplicationRisk(app);
            return {
                id: app.id,
                name: app.name,
                sectionId: section.id,
                riskScore: risk,
                securityScore: 100 - risk,
                riskLevel: getRiskLevel(risk),
                hasIncompleteData,
            };
        });

        const sectionRisk = calculateSectionRisk(appResults.map((a) => a.riskScore));

        sectionResults.push({
            sectionId: section.id,
            sectionName: section.name,
            applicationCount: apps.length,
            sectionRisk,
            normalizedWeight: 0, // filled in below, once totalActiveWeight is known
            applications: appResults,
        });

        totalActiveWeight += section.baseWeight;
        totalApplications += apps.length;
    }

    if (sectionResults.length === 0) {
        // No applications anywhere — "Not Assessed", never 0 and never 100.
        return {
            overallScore: null,
            overallRisk: null,
            riskLevel: "Not Assessed",
            totalApplications: 0,
            sections: [],
            topRiskDrivers: [],
            riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
        };
    }

    let portfolioRisk = 0;
    for (const result of sectionResults) {
        const section = sections.find((s) => s.id === result.sectionId);
        if (!section) continue;
        result.normalizedWeight = section.baseWeight / totalActiveWeight;
        portfolioRisk += result.normalizedWeight * result.sectionRisk;
    }

    const overallRisk  = Math.round(portfolioRisk);
    const overallScore = 100 - overallRisk;

    const allApps = sectionResults.flatMap((s) => s.applications);
    const riskDistribution = {
        low:      allApps.filter((a) => a.riskLevel === "Low").length,
        medium:   allApps.filter((a) => a.riskLevel === "Medium").length,
        high:     allApps.filter((a) => a.riskLevel === "High").length,
        critical: allApps.filter((a) => a.riskLevel === "Critical").length,
    };

    return {
        overallScore,
        overallRisk,
        riskLevel: getRiskLevel(overallRisk),
        totalApplications,
        sections: sectionResults,
        topRiskDrivers: getTopRiskDrivers(applicationsBySection),
        riskDistribution,
    };
}
