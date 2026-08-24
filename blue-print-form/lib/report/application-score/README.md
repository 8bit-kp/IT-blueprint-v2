# Application Security Score

Pure-logic scoring module for the Application Portfolio Assessment (Step 7 of
the Current State Assessment). Companion to, and independent from, the main
Security Score in `lib/report/`.

**Source of truth:** [`docs/application-security-score-methodology.md`](../../../docs/application-security-score-methodology.md).
Every formula, constant, and threshold in this folder must match that
document exactly. If a future change is needed, update the doc first, then
this code, then the tests.

## What this module is

Functions in, structured data out. No React, no DOM, no data fetching, no
database calls, no free-text recommendations. `calculatePortfolioRisk()` is
the main entry point — call it with section definitions and applications
grouped by section, get back a fully-populated score breakdown.

Import everything from the folder root:

```js
import { calculatePortfolioRisk, getTopRiskDrivers } from "@/lib/report/application-score";
```

Nothing outside this folder should import from `scoring.js`, `risk-drivers.js`,
`constants.js`, or `types.js` directly.

## Data wiring (prompt 2)

`adapter.js` (`mapAssessmentToPortfolioInput()`) is the sole boundary between
how Step 7 happens to be stored on the blueprint document and what this
module's scoring functions expect — no other file, in this folder or out,
should read `bp.applications` / `bp.customCategories` directly. It is wired
into `../index.js` (`generateReport()`), which attaches the result under
`report.applicationSecurityScore`, additive alongside the main Security
Score. See `docs/report-scoring-architecture.md` § 7a.

## UI rendering (prompt 3)

`report.applicationSecurityScore` and `report.applicationScoreHypotheticals`
(see `hypotheticals.js` below) are rendered on `/assessment-report` by
`components/report-dashboard/ApplicationSecurityScoreCard.jsx` (compact
gauge + band + KPI tiles, paired with the main `SecurityScoreCard`) and a
page-local `ApplicationSecuritySection` (deep dive: risk drivers,
hypotheticals, section breakdown, application table). Both render only —
no scoring, adapter, or report-assembly code was touched to add them. See
`docs/frontend.md`'s "Application Security section" for the component
breakdown.

## What this module does NOT do

- No UI, component, or page lives inside this folder — rendering lives in
  `components/report-dashboard/` and `app/assessment-report/page.js`.
- Does not read from or write to the assessment form, MongoDB, or any API
  directly (the adapter only transforms a blueprint object already handed
  to it by `generateReport()`).
- Does not touch the main Security Score (`lib/report/scoring.js`,
  `categories.js`, `signals.js`, `maturity.js`).
- `hypotheticals.js` introduces no new scoring logic — it only calls the
  frozen `calculatePortfolioRisk()` a second time per driver.

## Conventions

This project has no TypeScript toolchain (no `tsconfig.json`, no
`typescript` dependency) — the methodology doc's reference implementation
(§ 14) is written in TypeScript, but this folder mirrors the existing
`lib/report/*.js` convention instead: plain ES modules with JSDoc type
comments. Type shapes live in `types.js` as JSDoc `@typedef`s only, referenced
via `@param {import('./types.js').X}` elsewhere in the folder.

## Tests

```bash
node --test lib/report/application-score/tests/applicationScore.test.mjs   # module logic (prompt 1)
node --test lib/report/application-score/tests/adapter.test.mjs            # Step 7 → module input mapping (prompt 2)
node --test lib/report/application-score/tests/hypotheticals.test.mjs      # improvement hypotheticals (prompt 3)
node --test lib/report/tests/applicationScoreIntegration.test.mjs          # generateReport() wiring (prompt 2)
```

UI rendering has no automated tests — verified manually end-to-end against a
disposable local MongoDB instance (see the prompt 3 Final Report).
