/**
 * lib/report/application-score/index.js
 *
 * Public entry point for the Application Security Score module.
 *
 * This module is PURE LOGIC ONLY: functions in, structured data out.
 * No React, no DOM, no data fetching, no database calls, no UI strings
 * beyond the plain factual descriptions the methodology already defines.
 *
 * docs/application-security-score-methodology.md is the source of truth
 * for every formula, constant, and threshold used here. Nothing outside
 * this folder should import from anywhere in this folder other than this
 * index file.
 *
 * Type shapes (ApplicationInput, PortfolioScoreResult, etc.) are documented
 * as JSDoc typedefs in ./types.js and referenced via
 * `@param {import('./types.js').X}` comments throughout this folder — this
 * project has no TypeScript toolchain, so there is nothing to re-export at
 * runtime for them.
 *
 * `mapAssessmentToPortfolioInput()` (adapter.js) is the sole boundary
 * between how Step 7 happens to be stored on the blueprint document and
 * what this module's scoring functions expect — it is wired into the main
 * report pipeline in ../index.js (see docs/report-scoring-architecture.md).
 *
 * NOT done here (by design — see README.md): any UI, component, chart, or
 * dashboard rendering of this data. That is prompt 3 of this feature.
 */

export {
    calculateApplicationRisk,
    calculateApplicationSecurityScore,
    getRiskLevel,
    calculateSectionRisk,
    calculatePortfolioRisk,
} from "./scoring.js";

export { getTopRiskDrivers } from "./risk-drivers.js";

export { mapAssessmentToPortfolioInput } from "./adapter.js";

export { computeImprovementHypotheticals } from "./hypotheticals.js";

export {
    PRIORITY_IMPACT,
    SENSITIVITY_IMPACT,
    MFA_WEAKNESS,
    BACKUP_WEAKNESS,
    BYOD_WEAKNESS,
    RESIDUAL_FLOOR,
    SECTION_BLEND_ALPHA,
    DEFAULT_SECTION_WEIGHTS,
    CUSTOM_SECTION_WEIGHT,
    RISK_LEVEL_THRESHOLDS,
} from "./constants.js";
