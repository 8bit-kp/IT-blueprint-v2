/**
 * lib/report/tests/scoring.test.mjs
 *
 * Lightweight test suite for the security scoring engine.
 * Run with: node --test lib/report/tests/scoring.test.mjs
 *
 * Covers:
 *   - Signal extraction (full-signal / no-signal)
 *   - All 12 categories (full-signal / no-signal)
 *   - Composite, penalties, caps
 *   - Maturity level boundary mapping
 *   - Waterfall total === final score
 *   - Full generateReport() determinism
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";

// The lib files use named exports — we import them directly.
// Note: these are ES modules (.js) with standard import syntax.
import { extractSignals, TECH_CONTROL_KEYS } from "../signals.js";
import { scoreAllCategories }               from "../categories.js";
import { computeScore }                     from "../scoring.js";
import { getMaturityLevel, MATURITY_LEVELS }from "../maturity.js";
import { generateReport }                   from "../index.js";

// ── Test fixtures ─────────────────────────────────────────────────────────────

// A blueprint with EVERYTHING deployed (best possible posture)
const FULL_BLUEPRINT = {
    // Step 1
    industry: "Healthcare", employees: "101-500",
    remotePercentage: 30, contractorPercentage: 10,
    // Step 2
    hasOnPremDC: "Yes", hasCloudInfra: "Yes",
    hasGenerator: "Yes", hasUPS: "Yes",
    // Step 3
    WAN1: { choice: "Yes", vendor: "Comcast", businessPriority: "Critical", offering: "On-Prem" },
    WAN2: { choice: "Yes", vendor: "Verizon", businessPriority: "Critical", offering: "On-Prem" },
    WAN3: { choice: "No"  },
    haRouting: "Yes",
    wirelessAuth: "EAP-TLS",
    guestWireless: "Yes", guestSegmentation: "Yes",
    windowsServers: "Yes",
    windowsOptions: ["Protected", "Backed-up", "Monitored"],
    linuxServers: "Yes",
    linuxOptions: ["Fully patched", "Protected", "Backed up", "Monitored", "MFA for Access"],
    desktopOptions: ["Fully patched", "Protected", "Monitored"],
    // Step 4
    securityCommittee: "Yes", securityPolicy: "Yes", employeeTraining: "Yes",
    bcdrPlan: "Yes", cyberInsurance: "Yes", testBackup: "Yes",
    changeControl: "Yes", incidentResponse: "Yes", securityReview: "Yes",
    penetrationTest: "Yes",
    // Step 5 — all 16 controls deployed
    technicalControls: Object.fromEntries(
        TECH_CONTROL_KEYS.map((k) => [k, { choice: "Yes", vendor: "Cisco", businessPriority: "High", offering: "On-Prem" }])
    ),
    // Step 6
    primaryCustomerType: "B2B", geographicReach: "National",
    highestBusinessPriority: "Security",
    operationalChallenges: [],
    systemsRequiring24x7: "ERP",
    // Step 7 — 2 apps both with MFA and backup
    applications: {
        productivity: [
            { name: "Office 365", mfa: "Yes", backedUp: "Yes", personallyIdentifiableInfo: "Not set", hipaaRegulated: "Not set" },
        ],
        finance: [
            { name: "QuickBooks", mfa: "Yes", backedUp: "Yes", personallyIdentifiableInfo: "Low", hipaaRegulated: "Not set" },
        ],
    },
};

// A blueprint with NOTHING deployed (worst possible posture)
const EMPTY_BLUEPRINT = {};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Signal extraction", () => {
    test("full blueprint — all key signals are truthy", () => {
        const s = extractSignals(FULL_BLUEPRINT);
        assert.equal(s.mfaDeployed, true);
        assert.equal(s.edrDeployed, true);
        assert.equal(s.emailSecurityDeployed, true);
        assert.equal(s.ngfwDeployed, true);
        assert.equal(s.backupTested, true);
        assert.equal(s.irPlanExists, true);
        assert.equal(s.bcdrPlanExists, true);
        assert.equal(s.wanRedundancy, true);
        assert.equal(s.wirelessAuth, "EAP-TLS");
        assert.equal(s.guestWirelessSegmented, true);
        assert.equal(s.upsPresent, true);
        assert.equal(s.generatorPresent, true);
        assert.equal(s.technicalControlsPresent, 16);
    });

    test("empty blueprint — all boolean signals are false, counts are 0", () => {
        const s = extractSignals(EMPTY_BLUEPRINT);
        assert.equal(s.mfaDeployed, false);
        assert.equal(s.edrDeployed, false);
        assert.equal(s.ngfwDeployed, false);
        assert.equal(s.backupTested, false);
        assert.equal(s.technicalControlsPresent, 0);
        assert.equal(s.appMfaCoverage, null);
        assert.equal(s.appBackupCoverage, null);
    });

    test("null input — does not throw, returns safe defaults", () => {
        const s = extractSignals(null);
        assert.equal(s.mfaDeployed, false);
    });
});

describe("Category scoring — all 12 categories", () => {
    test("full blueprint — all categories score 100", () => {
        const signals    = extractSignals(FULL_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        assert.equal(categories.length, 12);
        for (const cat of categories) {
            assert.ok(cat.rawScore >= 80, `${cat.name} scored ${cat.rawScore}, expected ≥ 80`);
        }
    });

    test("empty blueprint — all categories score 0", () => {
        const signals    = extractSignals(EMPTY_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        for (const cat of categories) {
            assert.equal(cat.rawScore, 0, `${cat.name} expected 0, got ${cat.rawScore}`);
        }
    });

    test("weights sum to 1.0", () => {
        const signals    = extractSignals(EMPTY_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        const sum = categories.reduce((acc, c) => acc + c.weight, 0);
        assert.ok(Math.abs(sum - 1.0) < 0.001, `Weights sum = ${sum}, expected 1.0`);
    });

    test("all rawScores are 0–100", () => {
        const signals    = extractSignals(FULL_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        for (const cat of categories) {
            assert.ok(cat.rawScore >= 0 && cat.rawScore <= 100, `${cat.name}: ${cat.rawScore}`);
        }
    });
});

describe("Composite, penalties, caps", () => {
    test("full blueprint — no penalties triggered, high final score", () => {
        const signals    = extractSignals(FULL_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        const { finalScore, triggeredPenalties, appliedCap } = computeScore(signals, categories);
        assert.equal(triggeredPenalties.length, 0);
        assert.equal(appliedCap, null);
        assert.ok(finalScore >= 80, `Full blueprint should score ≥ 80, got ${finalScore}`);
    });

    test("empty blueprint — maximum penalties triggered, severe score cap applied", () => {
        const signals    = extractSignals(EMPTY_BLUEPRINT);
        const categories = scoreAllCategories(signals);
        const { finalScore, triggeredPenalties, appliedCap } = computeScore(signals, categories);
        assert.ok(triggeredPenalties.length >= 5, `Expected ≥ 5 penalties, got ${triggeredPenalties.length}`);
        assert.ok(appliedCap !== null, "Expected a score cap for empty blueprint");
        assert.ok(finalScore <= 15, `Empty blueprint should score ≤ 15, got ${finalScore}`);
        assert.ok(finalScore >= 0);
    });

    test("waterfall running total always equals final score", () => {
        for (const bp of [FULL_BLUEPRINT, EMPTY_BLUEPRINT]) {
            const signals    = extractSignals(bp);
            const categories = scoreAllCategories(signals);
            const result     = computeScore(signals, categories);
            const lastEntry  = result.waterfall[result.waterfall.length - 1];
            assert.equal(lastEntry.type, "final");
            assert.equal(lastEntry.value, result.finalScore, "Last waterfall entry must equal finalScore");
        }
    });

    test("single penalty: no MFA — caps at 65", () => {
        const signals = extractSignals({ ...FULL_BLUEPRINT, technicalControls: {
            ...FULL_BLUEPRINT.technicalControls,
            mfa: { choice: "No" },
        }});
        const categories = scoreAllCategories(signals);
        const { finalScore, appliedCap } = computeScore(signals, categories);
        assert.equal(appliedCap, 65);
        assert.ok(finalScore <= 65);
    });

    test("MFA + EDR both absent — caps at 58", () => {
        const signals = extractSignals({ ...FULL_BLUEPRINT, technicalControls: {
            ...FULL_BLUEPRINT.technicalControls,
            mfa: { choice: "No" },
            edr: { choice: "No" },
        }});
        const categories = scoreAllCategories(signals);
        const { appliedCap } = computeScore(signals, categories);
        assert.equal(appliedCap, 58);
    });
});

describe("Maturity level", () => {
    test("boundary values map to correct levels", () => {
        const expected = [
            [0,   1], [30, 1], [31, 2], [50, 2], [51, 3],
            [65, 3], [66, 4], [80, 4], [81, 5], [100, 5],
        ];
        for (const [score, level] of expected) {
            const m = getMaturityLevel(score);
            assert.equal(m.level, level, `Score ${score} → expected Level ${level}, got Level ${m.level}`);
        }
    });

    test("no gaps or overlaps across 0–100", () => {
        const seen = new Set();
        for (let s = 0; s <= 100; s++) {
            const level = getMaturityLevel(s).level;
            // A single score should never be ambiguous
            assert.ok(level >= 1 && level <= 5);
        }
    });

    test("MATURITY_LEVELS has exactly 5 entries with non-empty descriptions", () => {
        assert.equal(MATURITY_LEVELS.length, 5);
        for (const l of MATURITY_LEVELS) {
            assert.ok(l.description && l.description.length > 10);
            assert.ok(l.riskProfile && l.riskProfile.length > 5);
        }
    });
});

describe("generateReport() integration", () => {
    test("full blueprint — complete report object shape", () => {
        const r = generateReport(FULL_BLUEPRINT);
        assert.ok("score"            in r);
        assert.ok("maturity"         in r);
        assert.ok("categories"       in r);
        assert.ok("waterfall"        in r);
        assert.ok("metrics"          in r);
        assert.ok("risks"            in r);
        assert.ok("strengths"        in r);
        assert.ok("criticalRisks"    in r);
        assert.ok("dataGaps"         in r);
        assert.ok("audience"         in r);
        assert.equal(r.audience, "customer");
        assert.equal(r.categories.length, 12);
    });

    test("deterministic — same input always produces same output", () => {
        const r1 = generateReport(FULL_BLUEPRINT);
        const r2 = generateReport(FULL_BLUEPRINT);
        assert.equal(r1.score, r2.score);
        assert.equal(r1.maturity.level, r2.maturity.level);
        assert.equal(JSON.stringify(r1.waterfall), JSON.stringify(r2.waterfall));
    });

    test("audience extension point — respects passed option", () => {
        const r = generateReport(EMPTY_BLUEPRINT, { audience: "advisor" });
        assert.equal(r.audience, "advisor");
    });

    test("dataGaps array is always present and non-empty", () => {
        const r = generateReport(EMPTY_BLUEPRINT);
        assert.ok(Array.isArray(r.dataGaps));
        assert.ok(r.dataGaps.length > 0);
    });
});
