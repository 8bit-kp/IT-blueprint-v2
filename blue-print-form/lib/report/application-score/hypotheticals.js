/**
 * lib/report/application-score/hypotheticals.js
 *
 * Factual "what would improve this" recomputation, per
 * docs/application-security-score-methodology.md § 15's "Improvement
 * recommendations" guidance: "calculated by literally re-running the
 * scoring function with those factors flipped, not free-text advice."
 *
 * This file introduces NO new scoring logic — it only calls the frozen
 * `calculatePortfolioRisk()` (scoring.js) a second time per driver, against
 * a copy of the portfolio with that one factor set to its already-defined
 * "good" value (`GOOD_VALUE`, risk-drivers.js). A recomputed hypothetical
 * score is a fact, not a recommendation.
 */

import { calculatePortfolioRisk } from "./scoring.js";
import { GOOD_VALUE } from "./risk-drivers.js";

/**
 * @param {Record<string, import('./types.js').ApplicationInput[]>} applicationsBySection
 * @param {import('./types.js').RiskDriverFactor} factor
 * @returns {Record<string, import('./types.js').ApplicationInput[]>}
 */
function withFactorFixed(applicationsBySection, factor) {
    const result = {};
    for (const [sectionId, apps] of Object.entries(applicationsBySection)) {
        result[sectionId] = apps.map((app) =>
            app[factor] === GOOD_VALUE[factor] ? app : { ...app, [factor]: GOOD_VALUE[factor] },
        );
    }
    return result;
}

/**
 * For each top risk driver, recompute the portfolio score as if every
 * flagged application had that one factor fixed, holding everything else
 * constant — the aggregate counterpart to risk-drivers.js's per-application
 * marginal contribution.
 *
 * @param {import('./types.js').SectionDefinition[]} sections
 * @param {Record<string, import('./types.js').ApplicationInput[]>} applicationsBySection
 * @param {import('./types.js').RiskDriver[]} topRiskDrivers
 * @returns {Array<{ factor: import('./types.js').RiskDriverFactor, description: string, affectedApplicationCount: number, currentScore: number, hypotheticalScore: number }>}
 */
export function computeImprovementHypotheticals(sections, applicationsBySection, topRiskDrivers) {
    if (!Array.isArray(topRiskDrivers) || topRiskDrivers.length === 0) return [];

    const baseline = calculatePortfolioRisk(sections, applicationsBySection);
    if (baseline.overallScore === null) return [];

    return topRiskDrivers.map((driver) => {
        const hypothetical = calculatePortfolioRisk(sections, withFactorFixed(applicationsBySection, driver.factor));
        return {
            factor: driver.factor,
            description: driver.description,
            affectedApplicationCount: driver.affectedApplicationCount,
            currentScore: baseline.overallScore,
            hypotheticalScore: hypothetical.overallScore,
        };
    });
}
