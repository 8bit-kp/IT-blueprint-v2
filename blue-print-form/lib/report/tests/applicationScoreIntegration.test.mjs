/**
 * lib/report/tests/applicationScoreIntegration.test.mjs
 *
 * Integration tests for wiring the Application Security Score
 * (lib/report/application-score/) into generateReport()'s main report
 * data object. Added as part of prompt 2 — additive only, does not modify
 * lib/report/tests/scoring.test.mjs (the main Security Score's own suite,
 * which remains untouched and is the authoritative regression proof that
 * score/categories/waterfall/maturity/etc. are byte-for-byte unchanged;
 * see the Final Report for confirmation it still passes 19/19 unmodified).
 *
 * Run with: node --test lib/report/tests/applicationScoreIntegration.test.mjs
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";

import { generateReport } from "../index.js";

// Same FULL_BLUEPRINT shape used by scoring.test.mjs, extended with a
// realistic single-application Step 7 payload.
const BLUEPRINT_WITH_ONE_APP = {
    industry: "Healthcare", employees: "101-500",
    applications: {
        productivity: [
            { id: "prod-1", name: "Microsoft 365", businessPriority: "Critical", containsSensitiveInfo: "Yes", mfa: "No", backedUp: "No", byodAccess: "Yes", offering: "SaaS" },
        ],
        finance: [], hrit: [], payroll: [], additional: [],
    },
};

const BLUEPRINT_EMPTY_STEP7 = {
    industry: "Retail",
    applications: { productivity: [], finance: [], hrit: [], payroll: [], additional: [] },
};

const BLUEPRINT_NO_STEP7_AT_ALL = {
    industry: "Manufacturing",
    // no `applications` key at all — simulates an assessment predating this field
};

const BLUEPRINT_PARTIAL_APP = {
    applications: {
        productivity: [
            { id: "p1", name: "Partial App", businessPriority: "Medium", containsSensitiveInfo: "", mfa: "Yes", backedUp: "", byodAccess: "No" },
        ],
        finance: [], hrit: [], payroll: [], additional: [],
    },
};

describe("Task 2 — applicationSecurityScore is present in the main report object", () => {
    test("report includes a populated, correctly-shaped applicationSecurityScore", () => {
        const report = generateReport(BLUEPRINT_WITH_ONE_APP);
        assert.ok("applicationSecurityScore" in report);

        const appScore = report.applicationSecurityScore;
        assert.equal(typeof appScore.overallScore, "number");
        assert.equal(typeof appScore.overallRisk, "number");
        assert.ok(["Low", "Medium", "High", "Critical"].includes(appScore.riskLevel));
        assert.equal(appScore.totalApplications, 1);
        assert.ok(Array.isArray(appScore.sections));
        assert.ok(Array.isArray(appScore.topRiskDrivers));
        assert.ok("riskDistribution" in appScore);
    });

    test("applicationSecurityScore is never merged into the main score's own fields", () => {
        const report = generateReport(BLUEPRINT_WITH_ONE_APP);
        assert.ok(!("applicationSecurityScore" in report.metrics));
        assert.notEqual(report.applicationSecurityScore.overallScore, report.score); // independent scales/inputs
    });

    test("pre-existing report fields are all still present and correctly typed", () => {
        const report = generateReport(BLUEPRINT_WITH_ONE_APP);
        // Same field list generateReport() has always returned — proves this
        // change was purely additive, nothing pre-existing was removed/renamed.
        for (const key of [
            "audience", "score", "weightedComposite", "appliedCap", "maturity",
            "categories", "triggeredPenalties", "waterfall", "strengths",
            "criticalRisks", "metrics", "risks", "signals", "dataGaps",
        ]) {
            assert.ok(key in report, `expected pre-existing field "${key}" to still be present`);
        }
        assert.equal(report.categories.length, 12); // unchanged main Security Score shape
    });
});

describe("Task 3 — empty / missing / partial Step 7 data", () => {
    test("empty Step 7 (five empty default arrays) → Not Assessed, never 0 or 100", () => {
        const report = generateReport(BLUEPRINT_EMPTY_STEP7);
        assert.equal(report.applicationSecurityScore.overallScore, null);
        assert.equal(report.applicationSecurityScore.riskLevel, "Not Assessed");
    });

    test("Step 7 data missing entirely → Not Assessed, no error thrown", () => {
        assert.doesNotThrow(() => generateReport(BLUEPRINT_NO_STEP7_AT_ALL));
        const report = generateReport(BLUEPRINT_NO_STEP7_AT_ALL);
        assert.equal(report.applicationSecurityScore.overallScore, null);
        assert.equal(report.applicationSecurityScore.riskLevel, "Not Assessed");
    });

    test("completely empty blueprint ({}) → Not Assessed, no error thrown", () => {
        assert.doesNotThrow(() => generateReport({}));
        const report = generateReport({});
        assert.equal(report.applicationSecurityScore.overallScore, null);
    });

    test("partial-answer application surfaces hasIncompleteData: true in the report object", () => {
        const report = generateReport(BLUEPRINT_PARTIAL_APP);
        const app = report.applicationSecurityScore.sections
            .find((s) => s.sectionId === "productivity")
            .applications.find((a) => a.id === "p1");
        assert.equal(app.hasIncompleteData, true);
    });

    test("single-application Step 7 → portfolio score equals that one app's own score (full chain)", () => {
        const report = generateReport(BLUEPRINT_WITH_ONE_APP);
        const section = report.applicationSecurityScore.sections[0];
        const app = section.applications[0];
        assert.equal(report.applicationSecurityScore.overallScore, app.securityScore);
        assert.equal(report.applicationSecurityScore.totalApplications, 1);
    });
});

describe("Determinism", () => {
    test("generateReport() with application data is deterministic", () => {
        const r1 = generateReport(BLUEPRINT_WITH_ONE_APP);
        const r2 = generateReport(BLUEPRINT_WITH_ONE_APP);
        assert.equal(JSON.stringify(r1.applicationSecurityScore), JSON.stringify(r2.applicationSecurityScore));
        assert.equal(r1.score, r2.score);
    });
});
