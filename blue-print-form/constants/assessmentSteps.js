import { FiBriefcase, FiServer, FiWifi, FiShield, FiLock, FiActivity, FiGrid } from "react-icons/fi";

// Single source of truth for the 7-step Current State Assessment's titles
// and icons — used by app/blueprint-form/page.js (the wizard itself) and
// app/profile/page.js (assessment-progress display), so both stay in sync
// without hand-duplicating the list.
export const ASSESSMENT_STEPS = [
    { step: 1, title: "Company Profile", Icon: FiBriefcase },
    { step: 2, title: "Facilities & Infrastructure", Icon: FiServer },
    { step: 3, title: "Network & Server Infra", Icon: FiWifi },
    { step: 4, title: "Governance & Admin Controls", Icon: FiShield },
    { step: 5, title: "Security Technical Controls", Icon: FiLock },
    { step: 6, title: "Business Operations", Icon: FiActivity },
    { step: 7, title: "Applications Portfolio", Icon: FiGrid },
];

export const TOTAL_ASSESSMENT_STEPS = ASSESSMENT_STEPS.length;
