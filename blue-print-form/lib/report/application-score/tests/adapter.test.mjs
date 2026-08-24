/**
 * lib/report/application-score/tests/adapter.test.mjs
 *
 * Tests for the Step 7 → module-input adapter.
 * Run with: node --test lib/report/application-score/tests/adapter.test.mjs
 */

import assert from "node:assert/strict";
import { test, describe } from "node:test";

import { mapAssessmentToPortfolioInput } from "../adapter.js";
import { DEFAULT_SECTION_WEIGHTS, CUSTOM_SECTION_WEIGHT } from "../constants.js";

// A fully-answered sample Step 7 payload, matching the real storage shape
// seeded by ApplicationsStep.jsx / FormContext.jsx.
const FULL_STEP7 = {
    applications: {
        productivity: [
            { id: "prod-1", name: "Microsoft 365", businessPriority: "Critical", containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "Yes", offering: "SaaS" },
        ],
        finance: [
            { id: "fin-1", name: "QuickBooks", businessPriority: "High", containsSensitiveInfo: "Yes", mfa: "No", backedUp: "Yes", byodAccess: "No", offering: "SaaS" },
        ],
        hrit: [],
        payroll: [],
        additional: [],
        collaboration_tools: [
            { id: "cust-1", name: "Notion", businessPriority: "Low", containsSensitiveInfo: "No", mfa: "Yes", backedUp: "Yes", byodAccess: "No" },
        ],
    },
    customCategories: [{ key: "collaboration_tools", title: "Collaboration Tools" }],
};

describe("Task 1 — mapAssessmentToPortfolioInput", () => {
    test("fully-answered payload maps every field correctly", () => {
        const { applicationsBySection } = mapAssessmentToPortfolioInput(FULL_STEP7);
        const app = applicationsBySection.productivity[0];

        assert.equal(app.id, "prod-1");
        assert.equal(app.name, "Microsoft 365");
        assert.equal(app.sectionId, "productivity");
        assert.equal(app.businessPriority, "critical");
        assert.equal(app.sensitiveInformation, "yes");
        assert.equal(app.mfaEnabled, "yes");
        assert.equal(app.backedUp, "yes");
        assert.equal(app.byodAccess, "yes");
    });

    test("mixed Yes/No answers translate independently per field", () => {
        const { applicationsBySection } = mapAssessmentToPortfolioInput(FULL_STEP7);
        const app = applicationsBySection.finance[0];

        assert.equal(app.businessPriority, "high");
        assert.equal(app.sensitiveInformation, "yes");
        assert.equal(app.mfaEnabled, "no");
        assert.equal(app.backedUp, "yes");
        assert.equal(app.byodAccess, "no");
    });

    describe("every real 'unanswered' representation maps to 'unknown'", () => {
        const unansweredValues = ["", undefined, null, "Maybe", 0, false];

        for (const raw of unansweredValues) {
            test(`businessPriority=${JSON.stringify(raw)} → 'unknown'`, () => {
                const { applicationsBySection } = mapAssessmentToPortfolioInput({
                    applications: { productivity: [{ id: "a", name: "App", businessPriority: raw, containsSensitiveInfo: "Yes", mfa: "Yes", backedUp: "Yes", byodAccess: "No" }] },
                });
                assert.equal(applicationsBySection.productivity[0].businessPriority, "unknown");
            });

            test(`containsSensitiveInfo=${JSON.stringify(raw)} → 'unknown'`, () => {
                const { applicationsBySection } = mapAssessmentToPortfolioInput({
                    applications: { productivity: [{ id: "a", name: "App", businessPriority: "Low", containsSensitiveInfo: raw, mfa: "Yes", backedUp: "Yes", byodAccess: "No" }] },
                });
                assert.equal(applicationsBySection.productivity[0].sensitiveInformation, "unknown");
            });

            test(`mfa=${JSON.stringify(raw)} → 'unknown'`, () => {
                const { applicationsBySection } = mapAssessmentToPortfolioInput({
                    applications: { productivity: [{ id: "a", name: "App", businessPriority: "Low", containsSensitiveInfo: "No", mfa: raw, backedUp: "Yes", byodAccess: "No" }] },
                });
                assert.equal(applicationsBySection.productivity[0].mfaEnabled, "unknown");
            });

            test(`backedUp=${JSON.stringify(raw)} → 'unknown'`, () => {
                const { applicationsBySection } = mapAssessmentToPortfolioInput({
                    applications: { productivity: [{ id: "a", name: "App", businessPriority: "Low", containsSensitiveInfo: "No", mfa: "Yes", backedUp: raw, byodAccess: "No" }] },
                });
                assert.equal(applicationsBySection.productivity[0].backedUp, "unknown");
            });

            test(`byodAccess=${JSON.stringify(raw)} → 'unknown'`, () => {
                const { applicationsBySection } = mapAssessmentToPortfolioInput({
                    applications: { productivity: [{ id: "a", name: "App", businessPriority: "Low", containsSensitiveInfo: "No", mfa: "Yes", backedUp: "Yes", byodAccess: raw }] },
                });
                assert.equal(applicationsBySection.productivity[0].byodAccess, "unknown");
            });
        }

        test("a freshly-added application card (all fields '') maps entirely to 'unknown'", () => {
            const freshCard = { id: "new-1", name: "", businessPriority: "", containsSensitiveInfo: "", mfa: "", backedUp: "", byodAccess: "" };
            const { applicationsBySection } = mapAssessmentToPortfolioInput({ applications: { additional: [freshCard] } });
            const app = applicationsBySection.additional[0];
            assert.equal(app.businessPriority, "unknown");
            assert.equal(app.sensitiveInformation, "unknown");
            assert.equal(app.mfaEnabled, "unknown");
            assert.equal(app.backedUp, "unknown");
            assert.equal(app.byodAccess, "unknown");
        });
    });

    test("default sections receive correct base weights and isCustom: false", () => {
        const { sections } = mapAssessmentToPortfolioInput(FULL_STEP7);
        for (const key of ["productivity", "finance", "hrit", "payroll", "additional"]) {
            const section = sections.find((s) => s.id === key);
            assert.ok(section, `expected a section for ${key}`);
            assert.equal(section.baseWeight, DEFAULT_SECTION_WEIGHTS[key]);
            assert.equal(section.isCustom, false);
        }
    });

    test("custom sections receive CUSTOM_SECTION_WEIGHT and isCustom: true", () => {
        const { sections } = mapAssessmentToPortfolioInput(FULL_STEP7);
        const custom = sections.find((s) => s.id === "collaboration_tools");
        assert.ok(custom);
        assert.equal(custom.baseWeight, CUSTOM_SECTION_WEIGHT);
        assert.equal(custom.isCustom, true);
        assert.equal(custom.name, "Collaboration Tools");
    });

    test("a mix of populated and empty sections maps without dropping or corrupting populated ones", () => {
        const { applicationsBySection } = mapAssessmentToPortfolioInput(FULL_STEP7);
        assert.equal(applicationsBySection.productivity.length, 1);
        assert.equal(applicationsBySection.finance.length, 1);
        assert.equal(applicationsBySection.hrit.length, 0);
        assert.equal(applicationsBySection.payroll.length, 0);
        assert.equal(applicationsBySection.additional.length, 0);
        assert.equal(applicationsBySection.collaboration_tools.length, 1);
    });

    test("application IDs are stable across repeated maps of the same input", () => {
        const first = mapAssessmentToPortfolioInput(FULL_STEP7);
        const second = mapAssessmentToPortfolioInput(FULL_STEP7);
        assert.equal(first.applicationsBySection.productivity[0].id, second.applicationsBySection.productivity[0].id);
    });

    test("an application card with no id gets a deterministic generated id", () => {
        const payload = { applications: { productivity: [{ name: "No ID App", businessPriority: "Low", containsSensitiveInfo: "No", mfa: "Yes", backedUp: "Yes", byodAccess: "No" }] } };
        const first = mapAssessmentToPortfolioInput(payload);
        const second = mapAssessmentToPortfolioInput(payload);
        assert.equal(first.applicationsBySection.productivity[0].id, second.applicationsBySection.productivity[0].id);
        assert.equal(first.applicationsBySection.productivity[0].id, "productivity-app-0");
    });

    test("empty Step 7 (all five default arrays empty) → all sections present, all empty", () => {
        const { sections, applicationsBySection } = mapAssessmentToPortfolioInput({
            applications: { productivity: [], finance: [], hrit: [], payroll: [], additional: [] },
        });
        assert.equal(sections.length, 5);
        for (const key of ["productivity", "finance", "hrit", "payroll", "additional"]) {
            assert.deepEqual(applicationsBySection[key], []);
        }
    });

    test("Step 7 data missing entirely does not throw", () => {
        assert.doesNotThrow(() => mapAssessmentToPortfolioInput({}));
        assert.doesNotThrow(() => mapAssessmentToPortfolioInput(null));
        assert.doesNotThrow(() => mapAssessmentToPortfolioInput(undefined));

        const { sections, applicationsBySection } = mapAssessmentToPortfolioInput(undefined);
        assert.equal(sections.length, 5); // the 5 defaults always exist as identities
        assert.deepEqual(applicationsBySection, {}); // nothing to score
    });
});
