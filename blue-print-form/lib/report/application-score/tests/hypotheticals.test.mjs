/**
 * lib/report/application-score/tests/hypotheticals.test.mjs
 *
 * Tests for the factual improvement-hypothetical recomputation (Task 7 of
 * prompt 3). Confirms hypotheticals come from the real scoring module, not
 * an estimate, and are consistent with the methodology's own formula.
 *
 * Run with: node --test lib/report/application-score/tests/hypotheticals.test.mjs
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";

import { calculatePortfolioRisk, getTopRiskDrivers, computeImprovementHypotheticals } from "../index.js";

const SECTIONS = [
    { id: "productivity", name: "Productivity Applications", baseWeight: 30, isCustom: false },
];

function app(overrides) {
    return {
        id: overrides.id, name: overrides.id, sectionId: "productivity",
        businessPriority: "critical", sensitiveInformation: "yes",
        mfaEnabled: "yes", backedUp: "yes", byodAccess: "no",
        ...overrides,
    };
}

describe("computeImprovementHypotheticals", () => {
    test("recomputed score is produced by the real module, matching a hand-checked value", () => {
        // 3 apps missing MFA, otherwise identical to a known worked profile.
        const apps = [
            app({ id: "a1", mfaEnabled: "no" }),
            app({ id: "a2", mfaEnabled: "no" }),
            app({ id: "a3", mfaEnabled: "no" }),
        ];
        const applicationsBySection = { productivity: apps };
        const baseline = calculatePortfolioRisk(SECTIONS, applicationsBySection);
        const drivers = getTopRiskDrivers(applicationsBySection);
        const hypotheticals = computeImprovementHypotheticals(SECTIONS, applicationsBySection, drivers);

        const mfaHypothetical = hypotheticals.find((h) => h.factor === "mfaEnabled");
        assert.ok(mfaHypothetical);
        assert.equal(mfaHypothetical.currentScore, baseline.overallScore);
        assert.equal(mfaHypothetical.affectedApplicationCount, 3);

        // Hand-check: Critical(1.00) + Sensitive(0.5) → Impact = 1.0.
        // All-good weakness (mfa yes .03, backup yes .03, byod no .03) = 1-(0.97^3) = 0.087327.
        // risk = 1.0 * (0.15 + 0.85*0.087327) = 22.4228 → rounds to 22 → score 78.
        // Single-section portfolio with 3 identical apps → mean=max=22 → sectionRisk=22 → overallScore=78.
        assert.equal(mfaHypothetical.hypotheticalScore, 78);
        assert.ok(mfaHypothetical.hypotheticalScore > mfaHypothetical.currentScore, "fixing MFA should raise the score");
    });

    test("flipping a factor never changes any other factor's contribution", () => {
        const applicationsBySection = {
            productivity: [
                app({ id: "a1", mfaEnabled: "no", backedUp: "no" }),
                app({ id: "a2", byodAccess: "yes" }),
            ],
        };
        const drivers = getTopRiskDrivers(applicationsBySection);
        const hypotheticals = computeImprovementHypotheticals(SECTIONS, applicationsBySection, drivers);

        // Fixing MFA alone should not be as good as fixing MFA+backup together —
        // sanity check that only the named factor was touched, not all weaknesses.
        const mfaOnly = hypotheticals.find((h) => h.factor === "mfaEnabled").hypotheticalScore;
        const bothBaseline = calculatePortfolioRisk(SECTIONS, {
            productivity: [app({ id: "a1", mfaEnabled: "yes", backedUp: "yes" }), app({ id: "a2", byodAccess: "yes" })],
        }).overallScore;
        assert.ok(mfaOnly <= bothBaseline, "fixing MFA alone should not outperform fixing MFA+backup together");
    });

    test("empty topRiskDrivers → empty hypotheticals array", () => {
        assert.deepEqual(computeImprovementHypotheticals(SECTIONS, { productivity: [] }, []), []);
    });

    test("Not Assessed portfolio → empty hypotheticals array, never a fabricated score", () => {
        const result = computeImprovementHypotheticals(SECTIONS, {}, [
            { factor: "mfaEnabled", description: "x", affectedApplicationCount: 1, totalContribution: 1 },
        ]);
        assert.deepEqual(result, []);
    });

    test("hypotheticals are ordered identically to the input topRiskDrivers", () => {
        const applicationsBySection = {
            productivity: [
                app({ id: "a1", mfaEnabled: "no" }),
                app({ id: "a2", backedUp: "no" }),
                app({ id: "a3", byodAccess: "yes" }),
            ],
        };
        const drivers = getTopRiskDrivers(applicationsBySection);
        const hypotheticals = computeImprovementHypotheticals(SECTIONS, applicationsBySection, drivers);
        assert.deepEqual(hypotheticals.map((h) => h.factor), drivers.map((d) => d.factor));
    });

    test("deterministic across repeated calls", () => {
        const applicationsBySection = { productivity: [app({ id: "a1", mfaEnabled: "no" })] };
        const drivers = getTopRiskDrivers(applicationsBySection);
        const h1 = computeImprovementHypotheticals(SECTIONS, applicationsBySection, drivers);
        const h2 = computeImprovementHypotheticals(SECTIONS, applicationsBySection, drivers);
        assert.deepEqual(h1, h2);
    });
});
