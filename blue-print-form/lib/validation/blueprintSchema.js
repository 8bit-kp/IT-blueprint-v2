import { z } from "zod";

// ---------------------------------------------------------------------------
// Helper: enum that also accepts "" (empty string)
// ---------------------------------------------------------------------------

/**
 * Wraps z.enum so that an empty string ("") is also accepted.
 *
 * Form fields in this app send "" when left blank — not undefined/null.
 * A plain z.enum() correctly rejects "", which causes saves to fail for
 * partially-filled forms. This helper treats "" as "not yet filled" without
 * widening the allowed set of non-empty values.
 *
 * @param {readonly string[]} values - The valid non-empty enum members.
 * @returns A Zod schema that accepts any member of `values` or "".
 */
function optionalEnum(values) {
    return z.union([z.enum(values), z.literal("")]).optional();
}


// ---------------------------------------------------------------------------
// Reusable sub-schemas
// ---------------------------------------------------------------------------

/**
 * Technical control sub-schema.
 * Mirrors: { choice, vendor, businessPriority, offering }
 * Used by Step 3 (network/server fields) and Step 5 (technicalControls object).
 * All fields optional — partial saves must work from every step.
 *
 * Enum fields use optionalEnum() so that unfilled controls (sent as "") are
 * accepted without widening the allowed set of real enum values.
 */
const technicalControlSchema = z
    .object({
        // Note: both "On-premise" and "On-Premise" appear in the codebase
        // (the casing inconsistency is acknowledged in docs/coding-conventions.md).
        // Both values are accepted here to avoid rejecting existing saved data.
        choice:           optionalEnum(["Yes", "No"]),
        vendor:           z.string().optional(),
        businessPriority: optionalEnum(["Critical", "High", "Medium", "Low"]),
        offering:         optionalEnum(["SaaS", "On-premise", "On-Premise", "Hybrid", "Cloud"]),
    })
    .optional();

// ---------------------------------------------------------------------------
// Application item schema (Step 6)
// ---------------------------------------------------------------------------

/**
 * Loose schema for a single application entry.
 * Known fields are validated; unknown fields (e.g. future schema additions)
 * are passed through via .passthrough() so the validator never strips data.
 *
 * The App Schema v2 sensitivity fields are validated as strings when present.
 * The raw MongoDB write path preserves these fields; this schema does not
 * interfere with them.
 */
/**
 * Loose schema for a single application entry.
 * Known fields are validated; unknown fields (e.g. future schema additions)
 * are passed through via .passthrough() so the validator never strips data.
 *
 * The App Schema v2 sensitivity fields are validated as strings when present.
 * The raw MongoDB write path preserves these fields; this schema does not
 * interfere with them.
 *
 * businessPriority and offering use optionalEnum() so that applications where
 * those fields were left blank ("") continue to pass validation.
 */
const appItemSchema = z
    .object({
        name: z.string().optional(),
        // Yes / No string fields — stored as "Yes" / "No" / "" (unfilled)
        containsSensitiveInfo: z.string().optional(),
        mfa:                   z.string().optional(),
        backedUp:              z.string().optional(),
        byodAccess:            z.string().optional(),
        businessPriority: optionalEnum(["Critical", "High", "Medium", "Low"]),
        offering:         optionalEnum(["SaaS", "On-premise", "On-Premise", "Hybrid", "Cloud"]),
        // Sensitivity classification fields (App Schema v2)
        sensitivity:              z.string().optional(),
        businessSensitivity:      z.string().optional(),
        businessConfidentiality:  z.string().optional(),
        personallyIdentifiableInfo: z.string().optional(),
        hipaaRegulated:           z.string().optional(),
    })
    .passthrough(); // preserve any future fields without rejecting the payload

// ---------------------------------------------------------------------------
// Applications field schema (Step 6)
// ---------------------------------------------------------------------------

/**
 * The applications object is intentionally permissive.
 *
 * It uses z.record() so that:
 *   - Built-in categories (productivity, finance, hrit, payroll, additional) work.
 *   - User-created dynamic categories (arbitrary slug keys) work.
 *   - Future categories work without schema changes.
 *
 * Category names are NOT hardcoded / enumerated — doing so would break
 * dynamic category support.
 */
const applicationsSchema = z
    .record(z.string(), z.array(appItemSchema))
    .optional();

// ---------------------------------------------------------------------------
// Custom categories schema (Step 6 metadata)
// ---------------------------------------------------------------------------

const customCategorySchema = z.object({
    key: z.string(),
    title: z.string(),
});

// ---------------------------------------------------------------------------
// Top-level Blueprint payload schema
// ---------------------------------------------------------------------------

/**
 * Blueprint validation schema.
 *
 * Design rules:
 *   1. Every field is optional — partial saves must work from every form step.
 *   2. Primitive types are enforced where the schema is known.
 *   3. Enum values are enforced for known controlled vocabularies.
 *   4. No business-rule validation (no cross-field checks, no required fields,
 *      no percentage totals, no step-completion logic).
 *   5. .passthrough() at the top level so unknown fields from deepClean()
 *      are not rejected (forward-compatibility).
 *   6. _id, __v, userId are stripped before this schema is applied
 *      (handled upstream in the save route).
 */
export const blueprintSchema = z
    .object({
        // ---------------------------------------------------------------
        // Step 1 — Company Info
        // ---------------------------------------------------------------
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
        industry: z.string().optional(),
        otherIndustry: z.string().optional(),
        employees: z.string().optional(),
        remotePercentage: z.number().optional(),
        contractorPercentage: z.number().optional(),

        // ---------------------------------------------------------------
        // Step 2 — Facilities & Infrastructure
        // ---------------------------------------------------------------
        physicalOffices: z.string().optional(),
        hasDataCenters: z.string().optional(),
        hasOnPremDC: z.string().optional(),
        hasCloudInfra: z.string().optional(),
        hasGenerator: z.string().optional(),
        hasUPS: z.string().optional(),

        // ---------------------------------------------------------------
        // Step 3 — Network & Server Infrastructure
        // ---------------------------------------------------------------
        mainLocation: z.string().optional(),
        WAN1: technicalControlSchema,
        WAN2: technicalControlSchema,
        WAN3: technicalControlSchema,
        switchingVendor: technicalControlSchema,
        routingVendor: technicalControlSchema,
        wirelessVendor: technicalControlSchema,
        baremetalVendor: technicalControlSchema,
        virtualizationVendor: technicalControlSchema,
        cloudVendor: technicalControlSchema,
        haRouting: z.string().optional(),
        wirelessAuth: z.string().optional(),
        guestWireless: z.string().optional(),
        guestSegmentation: z.string().optional(),
        windowsServers: z.string().optional(),
        windowsOptions: z.array(z.string()).optional(),
        linuxServers: z.string().optional(),
        linuxOptions: z.array(z.string()).optional(),
        desktopOptions: z.array(z.string()).optional(),

        // ---------------------------------------------------------------
        // Step 4 — Security Admin Controls
        // ---------------------------------------------------------------
        securityCommittee: z.string().optional(),
        securityPolicy: z.string().optional(),
        employeeTraining: z.string().optional(),
        bcdrPlan: z.string().optional(),
        cyberInsurance: z.string().optional(),
        testBackup: z.string().optional(),
        changeControl: z.string().optional(),
        incidentResponse: z.string().optional(),
        securityReview: z.string().optional(),
        penetrationTest: z.string().optional(),

        // ---------------------------------------------------------------
        // Step 5 — Technical Security Controls
        // ---------------------------------------------------------------
        technicalControls: z
            .object({
                nextGenFirewall: technicalControlSchema,
                secureWebGateway: technicalControlSchema,
                casb: technicalControlSchema,
                dlp: technicalControlSchema,
                sslVpn: technicalControlSchema,
                emailSecurity: technicalControlSchema,
                vulnerabilityScanning: technicalControlSchema,
                iam: technicalControlSchema,
                nac: technicalControlSchema,
                mfa: technicalControlSchema,
                mdm: technicalControlSchema,
                edr: technicalControlSchema,
                dataClassification: technicalControlSchema,
                socSiem: technicalControlSchema,
                assetManagement: technicalControlSchema,
                sdWan: technicalControlSchema,
            })
            .passthrough() // forward-compat: tolerate new control keys without breaking
            .optional(),

        // ---------------------------------------------------------------
        // Step 6 — Applications
        // ---------------------------------------------------------------
        applications: applicationsSchema,

        // Custom application category metadata
        customCategories: z.array(customCategorySchema).optional(),

        // ---------------------------------------------------------------
        // Internal save-state field
        // ---------------------------------------------------------------
        _lastSavedStep: z.number().optional(),
    })
    .passthrough(); // tolerate unknown top-level fields from deepClean output

// ---------------------------------------------------------------------------
// Validation helper
// ---------------------------------------------------------------------------

/**
 * Validates a sanitized Blueprint payload against the Zod schema.
 *
 * Call this AFTER deepClean() and BEFORE collection.updateOne().
 *
 * @param {object} data - The sanitized payload (output of deepClean).
 * @returns {{ success: true } | { success: false, errors: object }}
 */
export function validateBlueprint(data) {
    const result = blueprintSchema.safeParse(data);

    if (result.success) {
        return { success: true };
    }

    // Use Zod's flattened field errors — concise, no stack traces, follows
    // the existing backend convention of { message, success: false }.
    const flattened = result.error.flatten();
    return {
        success: false,
        errors: flattened.fieldErrors,
    };
}
