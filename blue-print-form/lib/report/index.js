/**
 * lib/report/index.js
 *
 * Single entry point for the IT Blueprint scoring engine.
 *
 * Usage:
 *   import { generateReport } from "@/lib/report";
 *   const report = generateReport(blueprintData);
 *
 * The output object is the same for all audiences (customer and future advisor).
 * The `audience` field is an extension point: when the Advisor Panel is built,
 * pass audience: "advisor" and gate restricted sections inside each consumer.
 * See docs/report-scoring-architecture.md § Advisor Panel Extension Point.
 *
 * Design: pure function — same input always produces same output. No I/O.
 */

import { extractSignals }                                        from "./signals.js";
import { scoreAllCategories }                                    from "./categories.js";
import { computeScore, computeMetrics, deriveRiskSummary, deriveStrengthsAndRisks } from "./scoring.js";
import { getMaturityLevel }                                      from "./maturity.js";

// Known signals that are absent from the assessment today.
// Listed here so report consumers can surface gaps to the user.
// Do NOT add assessment fields to backfill these — that is a separate future task.
const DATA_AVAILABILITY_GAPS = [
    "Patch management cadence (M-01)",
    "Password policy / shared admin account controls (M-02)",
    "RTO / RPO requirements (M-03)",
    "Last backup restoration test date — precision (M-04)",
    "OS end-of-life / unsupported software status (M-05)",
    "Remote access method detail (VPN vs RDP-exposed vs Zero Trust) (M-06)",
    "Email authentication records (SPF / DKIM / DMARC) (M-07)",
    "Third-party vendor remote access count (M-08)",
    "Privileged access management / PAM (M-09)",
    "Cyber incident history (last 24 months) (M-10)",
    "DNS filtering presence (M-11)",
    "Offboarding process (same-day account deprovisioning) (M-12)",
    "Security log retention period (M-13)",
    "Regulatory compliance scope (PCI-DSS, GDPR, CCPA, SOC2, CMMC) (M-14)",
    "IT budget as % of revenue (M-15)",
    "BYOD MDM enrolment coverage (M-16)",
];

/**
 * Generate a complete Current State Report data object.
 *
 * @param {object} blueprintData - Raw blueprint document from the API
 * @param {{ audience?: "customer"|"advisor" }} [options]
 * @returns {ReportData}
 */
export function generateReport(blueprintData, options = {}) {
    const audience   = options.audience || "customer";

    // ── Signal extraction ─────────────────────────────────────────────────
    const signals    = extractSignals(blueprintData);

    // ── Category scoring ──────────────────────────────────────────────────
    const categories = scoreAllCategories(signals);

    // ── Score computation (composite → penalties → caps) ─────────────────
    const { finalScore, weightedComposite, triggeredPenalties, appliedCap, waterfall } =
        computeScore(signals, categories);

    // ── Maturity level ────────────────────────────────────────────────────
    const maturity = getMaturityLevel(finalScore);

    // ── KPI metrics ───────────────────────────────────────────────────────
    const metrics  = computeMetrics(signals, triggeredPenalties);

    // ── Risk summary ──────────────────────────────────────────────────────
    const risks    = deriveRiskSummary(signals, finalScore);

    // ── Strengths and critical risks ──────────────────────────────────────
    const { strengths, criticalRisks } = deriveStrengthsAndRisks(categories, triggeredPenalties);

    // ── Assemble report object ────────────────────────────────────────────
    return {
        // ── Extension point ────────────────────────────────────────────────
        // audience: "customer" | "advisor"
        // Currently always "customer" — no gating logic enforced.
        // When the Advisor Panel is built, pass audience: "advisor" and gate
        // restricted fields (e.g., full waterfall, raw signal data) here
        // rather than in each consumer component.
        audience,

        // ── Score ──────────────────────────────────────────────────────────
        score:            finalScore,
        weightedComposite,
        appliedCap,

        // ── Maturity ───────────────────────────────────────────────────────
        maturity,

        // ── Scoring breakdown ──────────────────────────────────────────────
        categories,
        triggeredPenalties,
        waterfall,

        // ── Top-level narrative (mechanically derived) ─────────────────────
        strengths,
        criticalRisks,

        // ── KPI metrics ────────────────────────────────────────────────────
        metrics: {
            ...metrics,
            finalScore,
            maturityLevel: maturity.level,
            maturityName:  maturity.name,
        },

        // ── Risk summary ───────────────────────────────────────────────────
        risks,

        // ── Signals (available for advisor consumption; not surfaced in customer UI) ──
        signals,

        // ── Data availability ──────────────────────────────────────────────
        // Gaps are listed for transparency. A future assessment-expansion task
        // should add questions to collect these signals.
        dataGaps: DATA_AVAILABILITY_GAPS,
    };
}
