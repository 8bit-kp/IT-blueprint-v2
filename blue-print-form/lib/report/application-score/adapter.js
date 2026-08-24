/**
 * lib/report/application-score/adapter.js
 *
 * The ONLY place that knows how Step 7 (Application Portfolio Assessment)
 * data is actually stored on the blueprint document. Maps that storage
 * shape into the scoring module's `SectionDefinition[]` /
 * `ApplicationInput[]` inputs. No other file — in this folder or outside
 * it — should read `bp.applications` / `bp.customCategories` directly.
 *
 * Storage shape (see models/Blueprint.js, context/FormContext.jsx,
 * components/form-fields/ApplicationsStep.jsx):
 *
 *   bp.applications = {
 *     productivity: [ { id, name, businessPriority, containsSensitiveInfo,
 *                        mfa, backedUp, byodAccess, offering, ...sensitivity
 *                        classification fields not used here }, ... ],
 *     finance: [...], hrit: [...], payroll: [...], additional: [...],
 *     [customCategoryKey]: [...],
 *   }
 *   bp.customCategories = [ { key, title }, ... ]   // user-created sections only
 *
 * "Unanswered" representation: every scored field (`businessPriority`,
 * `containsSensitiveInfo`, `mfa`, `backedUp`, `byodAccess`) defaults to the
 * empty string `""` on a freshly-added application card (see
 * `makeCustomDefaultApps` / `AppGroup.addApp` in ApplicationsStep.jsx) and
 * stays `""` until the user picks a toggle value. The Yes/No toggle
 * (`YesNoCompact`) only ever writes the literal strings `"Yes"` / `"No"` —
 * there is no third UI state. So `""`, `undefined`, `null`, or any other
 * stray value all mean "the user never answered this" and must map to
 * `'unknown'`, never to a default `'no'`.
 */

import { DEFAULT_SECTION_WEIGHTS, CUSTOM_SECTION_WEIGHT } from "./constants.js";

/** @type {Record<string, string>} */
const DEFAULT_SECTION_NAMES = {
    productivity: "Productivity Applications",
    finance: "Finance Applications",
    hrit: "HRIT Applications",
    payroll: "Payroll Applications",
    additional: "Additional Applications",
};

/**
 * @param {*} v
 * @returns {import('./types.js').YesNoUnknown}
 */
function toYesNoUnknown(v) {
    if (typeof v === "string") {
        const normalized = v.trim().toLowerCase();
        if (normalized === "yes") return "yes";
        if (normalized === "no") return "no";
    }
    return "unknown";
}

/**
 * @param {*} v
 * @returns {import('./types.js').BusinessPriority|'unknown'}
 */
function toBusinessPriority(v) {
    if (typeof v === "string") {
        const normalized = v.trim().toLowerCase();
        if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "critical") {
            return normalized;
        }
    }
    return "unknown";
}

/**
 * @param {object} rawApp
 * @param {string} sectionId
 * @param {number} index - position within its section, used for a deterministic fallback id
 * @returns {import('./types.js').ApplicationInput}
 */
function toApplicationInput(rawApp, sectionId, index) {
    const app = rawApp && typeof rawApp === "object" ? rawApp : {};
    return {
        id: typeof app.id === "string" && app.id.length > 0 ? app.id : `${sectionId}-app-${index}`,
        name: typeof app.name === "string" ? app.name : "",
        sectionId,
        businessPriority: toBusinessPriority(app.businessPriority),
        sensitiveInformation: toYesNoUnknown(app.containsSensitiveInfo),
        mfaEnabled: toYesNoUnknown(app.mfa),
        backedUp: toYesNoUnknown(app.backedUp),
        byodAccess: toYesNoUnknown(app.byodAccess),
    };
}

/**
 * Maps the raw blueprint's Step 7 data into the Application Security Score
 * module's input shape. Empty sections are passed through unfiltered —
 * `calculatePortfolioRisk()` already excludes sections with zero
 * applications; special-casing them here would be redundant and risks
 * doing it incorrectly.
 *
 * @param {object} blueprintData - Raw blueprint document (same object passed to extractSignals())
 * @returns {{ sections: import('./types.js').SectionDefinition[], applicationsBySection: Record<string, import('./types.js').ApplicationInput[]> }}
 */
export function mapAssessmentToPortfolioInput(blueprintData) {
    const bp = blueprintData && typeof blueprintData === "object" ? blueprintData : {};
    const rawApplications = bp.applications && typeof bp.applications === "object" ? bp.applications : {};
    const customCategories = Array.isArray(bp.customCategories) ? bp.customCategories : [];

    /** @type {import('./types.js').SectionDefinition[]} */
    const sections = [
        ...Object.keys(DEFAULT_SECTION_NAMES).map((key) => ({
            id: key,
            name: DEFAULT_SECTION_NAMES[key],
            baseWeight: DEFAULT_SECTION_WEIGHTS[key],
            isCustom: false,
        })),
        ...customCategories
            .filter((cc) => cc && typeof cc.key === "string")
            .map((cc) => ({
                id: cc.key,
                name: typeof cc.title === "string" && cc.title.length > 0 ? cc.title : cc.key,
                baseWeight: CUSTOM_SECTION_WEIGHT,
                isCustom: true,
            })),
    ];

    /** @type {Record<string, import('./types.js').ApplicationInput[]>} */
    const applicationsBySection = {};
    for (const sectionId of Object.keys(rawApplications)) {
        const rawApps = rawApplications[sectionId];
        if (!Array.isArray(rawApps)) continue;
        applicationsBySection[sectionId] = rawApps.map((rawApp, index) => toApplicationInput(rawApp, sectionId, index));
    }

    return { sections, applicationsBySection };
}
