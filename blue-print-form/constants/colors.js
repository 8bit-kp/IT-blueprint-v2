/**
 * CENTRALIZED THEME COLORS
 * ─────────────────────────────────────────────────────────────────────────────
 * All color classes used across the app live here. To change a color globally,
 * edit the value in the relevant object below — it will propagate everywhere.
 *
 * Usage:
 *   import { STATUS_COLORS, PRIORITY_COLORS, OFFERING_COLORS } from "@/constants/colors";
 *
 *   // Badge / pill (e.g. SecurityDashboard read-only display):
 *   <span className={STATUS_COLORS.badge["Yes"]}>Yes</span>
 *
 *   // Toggle button active state (e.g. CurrentStateDashboard):
 *   <button className={STATUS_COLORS.toggle["Yes"]}>YES</button>
 *
 *   // Priority button active state (e.g. FormComponents TechnicalControlCard):
 *   <button className={PRIORITY_COLORS.button["Critical"]}>Critical</button>
 *
 *   // Priority background chip (e.g. CurrentStateDashboard getPriorityColor):
 *   <select className={PRIORITY_COLORS.chip["High"]}>
 */

// ── Status: Yes / No / Partial ─────────────────────────────────────────────

export const STATUS_COLORS = {
    /**
     * Read-only pill badges used in dashboards (SecurityDashboard, blueprint-summary).
     * Tailwind classes: background + text + border.
     */
    badge: {
        Yes: "bg-green-100 text-green-800 border border-green-300 dark:bg-[var(--nui-ok-bg)] dark:text-[var(--nui-ok)] dark:border-[var(--nui-ok-line)]",
        No: "bg-red-100   text-red-800   border border-red-300 dark:bg-[var(--nui-risk-bg)] dark:text-[var(--nui-risk)] dark:border-[var(--nui-risk-line)]",
        Partial: "bg-teal-100  text-teal-800  border border-teal-300 dark:bg-[var(--nui-accent-tint)] dark:text-[var(--nui-accent)] dark:border-[var(--nui-line-strong)]",
        default: "bg-gray-100  text-gray-500  border border-gray-300 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-3)] dark:border-[var(--nui-line)]",
    },

    /**
     * Interactive toggle buttons used in CurrentStateDashboard app rows.
     * Tailwind classes for the active (selected) state only.
     */
    toggle: {
        Yes: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-[var(--nui-ok-bg)] dark:text-[var(--nui-ok)] dark:hover:bg-[var(--nui-ok-bg)]",
        No: "bg-red-100   text-red-700   hover:bg-red-200 dark:bg-[var(--nui-risk-bg)] dark:text-[var(--nui-risk)] dark:hover:bg-[var(--nui-risk-bg)]",
        default: "bg-gray-100  text-gray-600  hover:bg-gray-200 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-2)] dark:hover:bg-[var(--nui-line-soft)]",
    },

    /**
     * ToggleButton (FormComponents) active state classes.
     * Used for the Yes/No/Partial pill toggle in the form steps.
     */
    formToggle: {
        Yes: "bg-green-600  text-white shadow-md ring-1 ring-green-700",
        No: "bg-red-600    text-white shadow-md ring-1 ring-red-700",
        default: "bg-[#34808A]  text-white shadow-md ring-1 ring-[#2b6d75]",
    },
};

// ── Priority: Critical / High / Medium / Low ───────────────────────────────

export const PRIORITY_COLORS = {
    /**
     * Active state for priority toggle buttons in the form (TechnicalControlCard).
     */
    button: {
        Low:      "bg-green-500  text-white shadow-md ring-1 ring-green-600",
        Critical: "bg-red-600    text-white shadow-md ring-1 ring-red-700",
        High:     "bg-orange-500 text-white shadow-md ring-1 ring-orange-600",
        Medium:   "bg-blue-500   text-white shadow-md ring-1 ring-blue-600",
        default:  "bg-gray-100   text-gray-600 hover:bg-gray-200",
    },

    /**
     * Colored chip used inside <select> / row backgrounds in CurrentStateDashboard.
     */
    chip: {
        Critical: "bg-red-100    text-red-800    font-bold dark:bg-[var(--nui-risk-bg)] dark:text-[var(--nui-risk)]",
        High:     "bg-orange-100 text-orange-800 font-bold dark:bg-[var(--nui-warn-bg)] dark:text-[var(--nui-warn)]",
        Medium:   "bg-blue-100   text-blue-800   font-bold dark:bg-[var(--nui-info-bg)] dark:text-[var(--nui-info)]",
        Low:      "bg-green-100  text-green-800  font-bold dark:bg-[var(--nui-ok-bg)] dark:text-[var(--nui-ok)]",
        default:  "bg-gray-50    text-gray-600 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-3)]",
    },

    /**
     * Read-only pill badges in dashboards / blueprint-summary.
     * Solid saturated backgrounds with white text — already legible on dark
     * canvases without a dark: override (same rule as PRIORITY_COLORS.button).
     */
    badge: {
        Critical: "bg-red-600    text-white",
        High:     "bg-orange-500 text-white",
        Medium:   "bg-blue-500   text-white",
        Low:      "bg-green-500  text-white",
        default:  "bg-gray-200   text-gray-500 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-3)]",
    },
};

// ── Offering: SaaS / On-premise / Hybrid / Cloud ──────────────────────────

export const OFFERING_COLORS = {
    /**
     * Read-only pill badges used in SecurityDashboard.
     */
    badge: {
        "SaaS": "bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
        "On-premise": "bg-gray-100   text-gray-700   border border-gray-300 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-2)] dark:border-[var(--nui-line)]",
        "On-Premise": "bg-gray-100   text-gray-700   border border-gray-300 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-2)] dark:border-[var(--nui-line)]",
        "Hybrid": "bg-purple-100 text-purple-800  border border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        "Cloud": "bg-sky-100    text-sky-800     border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
        default: "bg-gray-100   text-gray-500    border border-gray-300 dark:bg-[var(--nui-surface-sunk)] dark:text-[var(--nui-text-3)] dark:border-[var(--nui-line)]",
    },
};

// ── Convenience helpers ────────────────────────────────────────────────────

/**
 * Returns the badge class for a status value (Yes / No / Partial).
 * Falls back to "default" if the value is not recognised.
 */
export function getStatusBadgeClass(value) {
    return STATUS_COLORS.badge[value] ?? STATUS_COLORS.badge.default;
}

/**
 * Returns the toggle-button active class for a status value.
 */
export function getStatusToggleClass(value) {
    return STATUS_COLORS.toggle[value] ?? STATUS_COLORS.toggle.default;
}

/**
 * Returns the select/chip background class for a priority value.
 */
export function getPriorityChipClass(value) {
    return PRIORITY_COLORS.chip[value] ?? PRIORITY_COLORS.chip.default;
}

/**
 * Returns the badge class for a priority value.
 */
export function getPriorityBadgeClass(value) {
    return PRIORITY_COLORS.badge[value] ?? PRIORITY_COLORS.badge.default;
}

/**
 * Returns the active button class for a priority value (used in form cards).
 */
export function getPriorityButtonClass(value, current) {
    if (value === current) {
        return PRIORITY_COLORS.button[value] ?? PRIORITY_COLORS.button.default;
    }
    return PRIORITY_COLORS.button.default;
}

/**
 * Returns the badge class for an offering value.
 */
export function getOfferingBadgeClass(value) {
    return OFFERING_COLORS.badge[value] ?? OFFERING_COLORS.badge.default;
}

// ── Donut Chart Colors (SecurityVisualsModal / dashboard-visuals) ──────────

/**
 * Hex colors used for the animated donut charts in the Security Visuals overlay.
 *   Yes     → green-500
 *   No      → red-500
 *   default → gray-300 (no data / empty)
 */
export const DONUT_COLORS = {
    Yes: "#22c55e",      // green-500
    No: "#ef4444",       // red-500
    default: "#d1d5db",  // gray-300 (no data)
};

/**
 * Returns the hex fill color for a donut arc based on the status value.
 */
export function getDonutColor(value) {
    return DONUT_COLORS[value] ?? DONUT_COLORS.default;
}

// ── Priority / Sensitivity Circle Colors ──────────────────────────────────

/**
 * Hex colors for the solid sensitivity circles in ApplicationDonutGrid.
 * Low=green, Medium=yellow, High=orange, Critical=red.
 * Also used for the business-priority donut rings.
 */
export const PRIORITY_HEX = {
    Low:      "#22c55e",  // green-500
    Medium:   "#eab308",  // yellow-500
    High:     "#f97316",  // orange-500
    Critical: "#ef4444",  // red-500
    default:  "#d1d5db",  // gray-300
};

// CSS var() references (not literal hex) so this pale background tint
// switches to its dark-surface-safe equivalent via the same html[data-theme]
// cascade the rest of the nui token system uses — see styles/new-ui/tokens.css.
// Safe here because the only consumer (ApplicationDonutGrid) sets it via an
// inline `style.backgroundColor`, not an SVG fill attribute.
export const PRIORITY_HEX_BG = {
    // nui has no dedicated "yellow" step, so Medium shares the amber warn-bg
    // with High — the yellow vs. orange text color (PRIORITY_HEX above)
    // still keeps the two tiers visually distinct.
    Low:      "var(--nui-ok-bg)",
    Medium:   "var(--nui-warn-bg)",
    High:     "var(--nui-warn-bg)",
    Critical: "var(--nui-risk-bg)",
    default:  "var(--nui-surface-sunk)",
};

/**
 * Returns the hex fill colour for a priority/sensitivity value.
 * Used by ApplicationDonutGrid for both donut rings and sensitivity circles.
 */
export function getPriorityHexColor(value) {
    return PRIORITY_HEX[value] ?? PRIORITY_HEX.default;
}

export function getPriorityHexBg(value) {
    return PRIORITY_HEX_BG[value] ?? PRIORITY_HEX_BG.default;
}
