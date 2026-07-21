// Product terminology constants — single source of truth for all customer-facing copy.
// Aligned with docs/product-vision.md and product-decisions.md (PD-001 through PD-010).
//
// Rules:
//   PRODUCT_NAME      — the overall platform/brand. Not a specific deliverable.
//   ASSESSMENT_NAME   — what the customer fills in.
//   REPORT_NAME       — the automated output generated immediately after the assessment.
//   ENGAGEMENT_NAME   — the paid, advisor-built consulting engagement sold at the consultation.
//
// Do NOT use ENGAGEMENT_NAME as if it is produced automatically by the application.
// Do NOT use REPORT_NAME labels (Security/Financial/Operational/etc.) for automated output —
// those labels are reserved for the advisor-delivered engagement (PD-005).

export const PRODUCT_NAME     = "IT Blueprint";
export const ASSESSMENT_NAME  = "Current State Assessment";
export const REPORT_NAME      = "Current State Report";
export const ENGAGEMENT_NAME  = "Assessment with Remediation Plan";
