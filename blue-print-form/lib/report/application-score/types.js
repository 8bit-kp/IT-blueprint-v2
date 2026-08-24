/**
 * lib/report/application-score/types.js
 *
 * JSDoc type definitions for the Application Security Score module.
 * This file has no runtime exports — it exists purely so other files in
 * this folder (and any future consumer) can reference these shapes via
 * `@param {import('./types.js').X}` JSDoc comments.
 *
 * These mirror the TypeScript interfaces in
 * docs/application-security-score-methodology.md § 14 exactly, field for
 * field, translated to JSDoc typedefs because this project has no
 * TypeScript toolchain (no tsconfig.json, no `typescript` dependency) —
 * see lib/report/*.js (the main Security Score) for the same convention.
 */

/** @typedef {'low'|'medium'|'high'|'critical'} BusinessPriority */

/** @typedef {'yes'|'no'|'unknown'} YesNoUnknown */

/** @typedef {'Low'|'Medium'|'High'|'Critical'} RiskLevel */

/**
 * @typedef {object} ApplicationInput
 * @property {string} id
 * @property {string} name - "Provider Name" in the UI
 * @property {string} sectionId
 * @property {BusinessPriority|'unknown'} businessPriority
 * @property {YesNoUnknown} sensitiveInformation
 * @property {YesNoUnknown} mfaEnabled
 * @property {YesNoUnknown} backedUp
 * @property {YesNoUnknown} byodAccess
 */

/**
 * @typedef {object} SectionDefinition
 * @property {string} id
 * @property {string} name
 * @property {number} baseWeight
 * @property {boolean} isCustom
 */

/**
 * @typedef {object} ApplicationScoreResult
 * @property {string} id
 * @property {string} name
 * @property {string} sectionId
 * @property {number} riskScore
 * @property {number} securityScore
 * @property {RiskLevel} riskLevel
 * @property {boolean} hasIncompleteData
 */

/**
 * @typedef {object} SectionScoreResult
 * @property {string} sectionId
 * @property {string} sectionName
 * @property {number} applicationCount
 * @property {number} sectionRisk
 * @property {number} normalizedWeight
 * @property {ApplicationScoreResult[]} applications
 */

/** @typedef {'sensitiveInformation'|'mfaEnabled'|'backedUp'|'byodAccess'} RiskDriverFactor */

/**
 * @typedef {object} RiskDriver
 * @property {RiskDriverFactor} factor
 * @property {string} description
 * @property {number} affectedApplicationCount
 * @property {number} totalContribution
 */

/**
 * @typedef {object} PortfolioScoreResult
 * @property {number|null} overallScore
 * @property {number|null} overallRisk
 * @property {RiskLevel|'Not Assessed'} riskLevel
 * @property {number} totalApplications
 * @property {SectionScoreResult[]} sections
 * @property {RiskDriver[]} topRiskDrivers
 * @property {{low: number, medium: number, high: number, critical: number}} riskDistribution
 */

export {};
