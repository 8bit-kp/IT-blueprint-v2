/**
 * lib/report/application-score/risk-drivers.js
 *
 * Explainability layer: ranks which weak factors (Sensitive Information,
 * MFA, Backup, BYOD) contribute most to portfolio risk, using marginal
 * (counterfactual) contribution rather than arbitrary counts — see
 * docs/application-security-score-methodology.md § 14.
 *
 * Descriptions are plain and factual only ("4 applications do not have MFA
 * enabled") — no authored advice, no narrative.
 */

import { calculateApplicationRisk } from "./scoring.js";

// Exported (not just used internally) so hypotheticals.js can flip the same
// factor to the same "good" value when recomputing an improvement scenario,
// instead of redefining this mapping a second time.
/** @type {Record<import('./types.js').RiskDriverFactor, import('./types.js').YesNoUnknown>} */
export const GOOD_VALUE = {
    sensitiveInformation: "no",
    mfaEnabled: "yes",
    backedUp: "yes",
    byodAccess: "no",
};

/** @type {Record<import('./types.js').RiskDriverFactor, string>} */
const LABELS = {
    sensitiveInformation: "applications store sensitive information without adequate compensating controls",
    mfaEnabled: "applications do not have MFA enabled",
    backedUp: "applications are not backed up",
    byodAccess: "applications allow BYOD access",
};

/**
 * For each weak factor on each application, recompute that application's
 * risk with only that one factor flipped to its "good" value, holding
 * everything else constant. The difference is that factor's marginal
 * contribution for that application. Contributions are summed per factor
 * across all applications, then ranked descending.
 *
 * @param {Record<string, import('./types.js').ApplicationInput[]>} applicationsBySection
 * @param {number} [topN]
 * @returns {import('./types.js').RiskDriver[]}
 */
export function getTopRiskDrivers(applicationsBySection, topN = 5) {
    const allApps = Object.values(applicationsBySection).flat();
    /** @type {import('./types.js').RiskDriverFactor[]} */
    const factors = ["sensitiveInformation", "mfaEnabled", "backedUp", "byodAccess"];

    const totals = {
        sensitiveInformation: { totalContribution: 0, affectedCount: 0 },
        mfaEnabled: { totalContribution: 0, affectedCount: 0 },
        backedUp: { totalContribution: 0, affectedCount: 0 },
        byodAccess: { totalContribution: 0, affectedCount: 0 },
    };

    for (const app of allApps) {
        const { risk: actualRisk } = calculateApplicationRisk(app);

        for (const factor of factors) {
            if (app[factor] === GOOD_VALUE[factor]) continue;

            const counterfactual = { ...app, [factor]: GOOD_VALUE[factor] };
            const { risk: counterfactualRisk } = calculateApplicationRisk(counterfactual);
            const contribution = actualRisk - counterfactualRisk;

            if (contribution > 0) {
                totals[factor].totalContribution += contribution;
                totals[factor].affectedCount += 1;
            }
        }
    }

    return factors
        .map((factor) => ({
            factor,
            description: `${totals[factor].affectedCount} ${LABELS[factor]}`,
            affectedApplicationCount: totals[factor].affectedCount,
            totalContribution: Math.round(totals[factor].totalContribution),
        }))
        .filter((d) => d.affectedApplicationCount > 0)
        .sort((a, b) => b.totalContribution - a.totalContribution)
        .slice(0, topN);
}
