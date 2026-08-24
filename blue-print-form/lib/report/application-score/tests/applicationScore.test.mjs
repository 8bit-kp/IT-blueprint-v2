/**
 * lib/report/application-score/tests/applicationScore.test.mjs
 *
 * Test suite for the Application Security Score module.
 * Run with: node --test lib/report/application-score/tests/applicationScore.test.mjs
 *
 * Covers:
 *   - Task 1: type module loads cleanly, folder isolation
 *   - Task 2: constants match the methodology doc exactly
 *   - Task 3: application-level scoring — Scenarios 1-8 from the methodology
 *   - Task 4: section-level aggregation
 *   - Task 5: portfolio-level aggregation — Scenarios 9-13
 *   - Task 6: risk driver explainability
 *   - Task 7: public API surface + end-to-end integration
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
    calculateApplicationRisk,
    calculateApplicationSecurityScore,
    getRiskLevel,
    calculateSectionRisk,
    calculatePortfolioRisk,
    getTopRiskDrivers,
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
} from "../index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FOLDER_DIR = path.join(__dirname, "..");

// ── Fixtures: one ApplicationInput per methodology Scenario 1-8 ────────────────

let nextId = 0;
function app(overrides) {
    nextId += 1;
    return {
        id: `app-${nextId}`,
        name: `Test App ${nextId}`,
        sectionId: "productivity",
        businessPriority: "medium",
        sensitiveInformation: "no",
        mfaEnabled: "yes",
        backedUp: "yes",
        byodAccess: "no",
        ...overrides,
    };
}

const SCENARIOS = {
    // #, description, expected risk, expected score
    s1: app({ businessPriority: "low", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" }),
    s2: app({ businessPriority: "medium", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" }),
    s3: app({ businessPriority: "medium", sensitiveInformation: "yes", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" }),
    s4: app({ businessPriority: "high", sensitiveInformation: "yes", mfaEnabled: "no", backedUp: "yes", byodAccess: "no" }),
    s5: app({ businessPriority: "high", sensitiveInformation: "yes", mfaEnabled: "no", backedUp: "no", byodAccess: "yes" }),
    s6: app({ businessPriority: "critical", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" }),
    s7: app({ businessPriority: "critical", sensitiveInformation: "yes", mfaEnabled: "no", backedUp: "no", byodAccess: "yes" }),
    s8: app({ businessPriority: "unknown", sensitiveInformation: "unknown", mfaEnabled: "unknown", backedUp: "unknown", byodAccess: "unknown" }),
};

// ── Task 1: types module + folder isolation ───────────────────────────────────

describe("Task 1 — types", () => {
    test("types.js loads without throwing and has no runtime surface", async () => {
        const mod = await import("../types.js");
        assert.deepEqual(Object.keys(mod), []);
    });

    test("no file in the folder imports from a UI/component/page path", () => {
        const files = readdirSync(FOLDER_DIR).filter((f) => f.endsWith(".js"));
        for (const file of files) {
            const src = readFileSync(path.join(FOLDER_DIR, file), "utf8");
            const importLines = src.match(/^import .*from ["'].*["'];?$/gm) || [];
            for (const line of importLines) {
                assert.ok(
                    /from ["']\.\//.test(line),
                    `${file} has a non-relative-local import: ${line}`,
                );
                assert.ok(
                    !/components|\/app\/|context|models/.test(line),
                    `${file} appears to import from a UI/page path: ${line}`,
                );
            }
        }
    });
});

// ── Task 2: constants ──────────────────────────────────────────────────────────

describe("Task 2 — constants match the methodology doc exactly", () => {
    test("PRIORITY_IMPACT", () => {
        assert.deepEqual(PRIORITY_IMPACT, { low: 0.15, medium: 0.40, high: 0.70, critical: 1.00, unknown: 0.40 });
    });

    test("SENSITIVITY_IMPACT", () => {
        assert.deepEqual(SENSITIVITY_IMPACT, { yes: 0.50, no: 0.00, unknown: 0.25 });
    });

    test("MFA_WEAKNESS", () => {
        assert.deepEqual(MFA_WEAKNESS, { no: 0.75, yes: 0.03, unknown: 0.45 });
    });

    test("BACKUP_WEAKNESS", () => {
        assert.deepEqual(BACKUP_WEAKNESS, { no: 0.40, yes: 0.03, unknown: 0.25 });
    });

    test("BYOD_WEAKNESS", () => {
        assert.deepEqual(BYOD_WEAKNESS, { yes: 0.25, no: 0.03, unknown: 0.15 });
    });

    test("RESIDUAL_FLOOR and SECTION_BLEND_ALPHA", () => {
        assert.equal(RESIDUAL_FLOOR, 0.15);
        assert.equal(SECTION_BLEND_ALPHA, 0.7);
    });

    test("DEFAULT_SECTION_WEIGHTS and CUSTOM_SECTION_WEIGHT", () => {
        assert.deepEqual(DEFAULT_SECTION_WEIGHTS, { productivity: 30, finance: 25, hrit: 20, payroll: 15, additional: 10 });
        assert.equal(CUSTOM_SECTION_WEIGHT, 5);
    });

    test("RISK_LEVEL_THRESHOLDS", () => {
        assert.deepEqual(RISK_LEVEL_THRESHOLDS, [
            { max: 24, level: "Low" },
            { max: 49, level: "Medium" },
            { max: 74, level: "High" },
            { max: 100, level: "Critical" },
        ]);
    });

    test("no magic numbers in scoring.js / risk-drivers.js", () => {
        const magicNumbers = ["0.15", "0.85", "0.03", "0.75", "0.40", "0.70", "1.00", "0.50", "0.25", "0.45", "0.65", "0.7,", "0.3 "];
        for (const file of ["scoring.js", "risk-drivers.js"]) {
            const src = readFileSync(path.join(FOLDER_DIR, file), "utf8");
            for (const n of magicNumbers) {
                assert.ok(!src.includes(n), `${file} contains magic number literal "${n}"`);
            }
        }
    });
});

// ── Task 3: application-level scoring — Scenarios 1-8 ─────────────────────────

describe("Task 3 — application-level scoring (Scenarios 1-8)", () => {
    const expected = {
        s1: { risk: 3, score: 97 },
        s2: { risk: 9, score: 91 },
        s3: { risk: 16, score: 84 },
        s4: { risk: 68, score: 32 },
        s5: { risk: 77, score: 23 },
        s6: { risk: 22, score: 78 },
        s7: { risk: 90, score: 10 },
        s8: { risk: 39, score: 61 },
    };

    for (const [key, exp] of Object.entries(expected)) {
        test(`Scenario ${key} — risk ${exp.risk}, score ${exp.score}`, () => {
            const { risk } = calculateApplicationRisk(SCENARIOS[key]);
            const score = calculateApplicationSecurityScore(SCENARIOS[key]);
            assert.ok(Math.abs(risk - exp.risk) <= 1, `risk ${risk} not within ±1 of ${exp.risk}`);
            assert.ok(Math.abs(score - exp.score) <= 1, `score ${score} not within ±1 of ${exp.score}`);
            assert.equal(risk + score, 100);
        });
    }

    test("relative ordering: 1 < 2 < 3 < 6 < 4 < 5 < 7", () => {
        const order = ["s1", "s2", "s3", "s6", "s4", "s5", "s7"];
        const risks = order.map((k) => calculateApplicationRisk(SCENARIOS[k]).risk);
        for (let i = 1; i < risks.length; i++) {
            assert.ok(risks[i] > risks[i - 1], `expected risk(${order[i]})=${risks[i]} > risk(${order[i - 1]})=${risks[i - 1]}`);
        }
    });

    test("Scenario 8 — all-unknown app is flagged incomplete", () => {
        const { hasIncompleteData } = calculateApplicationRisk(SCENARIOS.s8);
        assert.equal(hasIncompleteData, true);
    });

    test("hasIncompleteData is false when every field is answered", () => {
        const { hasIncompleteData } = calculateApplicationRisk(SCENARIOS.s1);
        assert.equal(hasIncompleteData, false);
    });

    test("hasIncompleteData is true if even a single field is unknown", () => {
        const partial = app({ mfaEnabled: "unknown" });
        assert.equal(calculateApplicationRisk(partial).hasIncompleteData, true);
    });

    test("getRiskLevel boundaries", () => {
        assert.equal(getRiskLevel(24), "Low");
        assert.equal(getRiskLevel(25), "Medium");
        assert.equal(getRiskLevel(49), "Medium");
        assert.equal(getRiskLevel(50), "High");
        assert.equal(getRiskLevel(74), "High");
        assert.equal(getRiskLevel(75), "Critical");
        assert.equal(getRiskLevel(0), "Low");
        assert.equal(getRiskLevel(100), "Critical");
    });
});

// ── Task 4: section-level aggregation ─────────────────────────────────────────

describe("Task 4 — section-level aggregation", () => {
    test("single-application section: mean equals max equals section risk", () => {
        assert.equal(calculateSectionRisk([42]), 42);
    });

    test("dilution example: 30 apps at risk 5 + 1 app at risk 90 ≈ 32.4", () => {
        const scores = [...Array(30).fill(5), 90];
        const sectionRisk = calculateSectionRisk(scores);
        assert.ok(Math.abs(sectionRisk - 32.4) <= 1, `expected ≈32.4, got ${sectionRisk}`);
    });

    test("empty array throws rather than silently returning 0", () => {
        assert.throws(() => calculateSectionRisk([]));
    });
});

// ── Task 5: portfolio-level aggregation — Scenarios 9-13 ──────────────────────

const SECTIONS = [
    { id: "productivity", name: "Productivity Applications", baseWeight: DEFAULT_SECTION_WEIGHTS.productivity, isCustom: false },
    { id: "finance", name: "Finance Applications", baseWeight: DEFAULT_SECTION_WEIGHTS.finance, isCustom: false },
    { id: "hrit", name: "HRIT Applications", baseWeight: DEFAULT_SECTION_WEIGHTS.hrit, isCustom: false },
    { id: "payroll", name: "Payroll Applications", baseWeight: DEFAULT_SECTION_WEIGHTS.payroll, isCustom: false },
    { id: "additional", name: "Additional Applications", baseWeight: DEFAULT_SECTION_WEIGHTS.additional, isCustom: false },
];

describe("Task 5 — portfolio-level aggregation (Scenarios 9-13)", () => {
    test("Scenario 9 — single-application portfolio (Scenario 7's profile) ≈ score 10", () => {
        const result = calculatePortfolioRisk(SECTIONS, { productivity: [SCENARIOS.s7] });
        assert.ok(Math.abs(result.overallScore - 10) <= 1);
        assert.equal(result.totalApplications, 1);
        assert.equal(result.sections.length, 1);
        assert.equal(result.sections[0].normalizedWeight, 1);
    });

    test("Scenario 10 — zero applications anywhere → Not Assessed", () => {
        const result = calculatePortfolioRisk(SECTIONS, {});
        assert.equal(result.overallScore, null);
        assert.equal(result.overallRisk, null);
        assert.equal(result.riskLevel, "Not Assessed");
        assert.deepEqual(result.riskDistribution, { low: 0, medium: 0, high: 0, critical: 0 });
    });

    test("Scenario 11 — only a custom section populated (2 Low-risk apps) → custom section takes 100% weight, score ≈ 96", () => {
        const sectionsWithCustom = [...SECTIONS, { id: "custom-1", name: "Collaboration Tools", baseWeight: CUSTOM_SECTION_WEIGHT, isCustom: true }];
        const lowApp1 = app({ sectionId: "custom-1", businessPriority: "low", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" });
        const lowApp2 = app({ sectionId: "custom-1", businessPriority: "low", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" });

        const result = calculatePortfolioRisk(sectionsWithCustom, { "custom-1": [lowApp1, lowApp2] });

        assert.equal(result.sections.length, 1);
        assert.equal(result.sections[0].sectionId, "custom-1");
        assert.equal(result.sections[0].normalizedWeight, 1);
        assert.ok(Math.abs(result.overallScore - 96) <= 3, `expected ≈96, got ${result.overallScore}`);
    });

    test("Scenario 12 — Productivity (30 Low + 1 Scenario-7 app), Finance (2 Medium), rest empty ≈ Moderate band", () => {
        const lowApps = Array.from({ length: 30 }, () =>
            app({ sectionId: "productivity", businessPriority: "low", sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "yes" }),
        );
        const highRiskApp = app({ ...SCENARIOS.s7, sectionId: "productivity" });
        const mediumApps = Array.from({ length: 2 }, () =>
            app({ sectionId: "finance", businessPriority: "medium", sensitiveInformation: "yes", mfaEnabled: "yes", backedUp: "no", byodAccess: "yes" }),
        );

        const result = calculatePortfolioRisk(SECTIONS, {
            productivity: [...lowApps, highRiskApp],
            finance: mediumApps,
        });

        assert.equal(result.totalApplications, 33);
        // Doc marks this scenario's "≈64" as approximate; assert the correct band and a generous tolerance.
        assert.ok(result.overallScore >= 40 && result.overallScore <= 75, `expected Moderate-ish band, got ${result.overallScore}`);
    });

    test("Scenario 13 — two custom sections, one populated (High/Sensitive/no-MFA), one empty → weight fully shifts, score ≈ 32", () => {
        const sectionsWithCustoms = [
            { id: "custom-a", name: "Custom A", baseWeight: CUSTOM_SECTION_WEIGHT, isCustom: true },
            { id: "custom-b", name: "Custom B", baseWeight: CUSTOM_SECTION_WEIGHT, isCustom: true },
        ];
        const riskyApp = app({ ...SCENARIOS.s4, sectionId: "custom-a" }); // risk 68 / score 32

        const result = calculatePortfolioRisk(sectionsWithCustoms, { "custom-a": [riskyApp] });

        assert.equal(result.sections.length, 1);
        assert.equal(result.sections[0].normalizedWeight, 1);
        assert.ok(Math.abs(result.overallScore - 32) <= 1, `expected ≈32, got ${result.overallScore}`);
    });

    test("removing an empty default section from the input does not change the score", () => {
        const oneApp = { productivity: [SCENARIOS.s2] };
        const withEmptySections = calculatePortfolioRisk(SECTIONS, oneApp);
        const withoutEmptySections = calculatePortfolioRisk(
            SECTIONS.filter((s) => s.id === "productivity"),
            oneApp,
        );
        assert.equal(withEmptySections.overallScore, withoutEmptySections.overallScore);
    });

    test("normalized weights across active sections always sum to 1", () => {
        const result = calculatePortfolioRisk(SECTIONS, {
            productivity: [SCENARIOS.s1],
            finance: [SCENARIOS.s2],
            hrit: [SCENARIOS.s3],
        });
        const sum = result.sections.reduce((acc, s) => acc + s.normalizedWeight, 0);
        assert.ok(Math.abs(sum - 1) < 0.001, `expected ≈1, got ${sum}`);
    });
});

// ── Task 6: risk drivers ───────────────────────────────────────────────────────

describe("Task 6 — risk drivers (explainability)", () => {
    test("MFA ranks above Backup when 3 apps lack MFA and 1 lacks backup", () => {
        const noMfaApps = Array.from({ length: 3 }, () => app({ mfaEnabled: "no" }));
        const noBackupApp = app({ backedUp: "no" });
        const drivers = getTopRiskDrivers({ productivity: [...noMfaApps, noBackupApp] });

        const mfaDriver = drivers.find((d) => d.factor === "mfaEnabled");
        const backupDriver = drivers.find((d) => d.factor === "backedUp");
        assert.ok(mfaDriver, "expected an mfaEnabled driver");
        assert.ok(backupDriver, "expected a backedUp driver");
        assert.ok(mfaDriver.totalContribution > backupDriver.totalContribution);
        assert.equal(mfaDriver.affectedApplicationCount, 3);
        assert.equal(backupDriver.affectedApplicationCount, 1);
    });

    test("a factor already at its good value contributes 0 for that app", () => {
        const perfectApp = app({ sensitiveInformation: "no", mfaEnabled: "yes", backedUp: "yes", byodAccess: "no" });
        const drivers = getTopRiskDrivers({ productivity: [perfectApp] });
        assert.equal(drivers.length, 0);
    });

    test("descriptions contain the correct affected-application counts", () => {
        const apps = Array.from({ length: 4 }, () => app({ mfaEnabled: "no" }));
        const drivers = getTopRiskDrivers({ productivity: apps });
        const mfaDriver = drivers.find((d) => d.factor === "mfaEnabled");
        assert.equal(mfaDriver.description, "4 applications do not have MFA enabled");
    });

    test("output is deterministic across repeated calls", () => {
        const apps = [app({ mfaEnabled: "no" }), app({ backedUp: "no" }), app({ byodAccess: "yes" })];
        const a = getTopRiskDrivers({ productivity: apps });
        const b = getTopRiskDrivers({ productivity: apps });
        assert.deepEqual(a, b);
    });
});

// ── Task 7: module entry point ────────────────────────────────────────────────

describe("Task 7 — module entry point", () => {
    test("entire public API is importable from the index alone", () => {
        assert.equal(typeof calculateApplicationRisk, "function");
        assert.equal(typeof calculateApplicationSecurityScore, "function");
        assert.equal(typeof getRiskLevel, "function");
        assert.equal(typeof calculateSectionRisk, "function");
        assert.equal(typeof calculatePortfolioRisk, "function");
        assert.equal(typeof getTopRiskDrivers, "function");
    });

    test("calculatePortfolioRisk end-to-end on a mixed sample portfolio returns a fully populated result", () => {
        const result = calculatePortfolioRisk(SECTIONS, {
            productivity: [SCENARIOS.s1, SCENARIOS.s2],
            finance: [SCENARIOS.s3],
            hrit: [],
            payroll: [SCENARIOS.s7],
        });

        assert.equal(typeof result.overallScore, "number");
        assert.equal(typeof result.overallRisk, "number");
        assert.ok(["Low", "Medium", "High", "Critical"].includes(result.riskLevel));
        assert.equal(result.totalApplications, 4);
        assert.equal(result.sections.length, 3); // hrit excluded (empty)
        assert.ok(Array.isArray(result.topRiskDrivers));
        assert.ok("low" in result.riskDistribution);
        assert.ok("medium" in result.riskDistribution);
        assert.ok("high" in result.riskDistribution);
        assert.ok("critical" in result.riskDistribution);

        for (const section of result.sections) {
            assert.ok("sectionId" in section);
            assert.ok("sectionName" in section);
            assert.ok("applicationCount" in section);
            assert.ok("sectionRisk" in section);
            assert.ok("normalizedWeight" in section);
            for (const a of section.applications) {
                assert.ok("id" in a);
                assert.ok("name" in a);
                assert.ok("sectionId" in a);
                assert.ok("riskScore" in a);
                assert.ok("securityScore" in a);
                assert.ok("riskLevel" in a);
                assert.ok("hasIncompleteData" in a);
            }
        }
    });
});
