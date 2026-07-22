/**
 * lib/report/maturity.js
 *
 * Maps a final Security Score (0–100) to one of 5 IT Maturity Levels.
 *
 * Score ranges are exclusive-lower, inclusive-upper:
 *   Level 1 (Initial):    0–30
 *   Level 2 (Basic):     31–50
 *   Level 3 (Developing):51–65
 *   Level 4 (Managed):   66–80
 *   Level 5 (Optimized): 81–100
 *
 * Descriptions state what the score indicates about the current state.
 * They do NOT include recommendations — that distinction preserves the
 * product principle that recommendations require human advisors (PD-003).
 */

const MATURITY_LEVELS = [
    {
        level:       1,
        name:        "Initial",
        scoreMin:    0,
        scoreMax:    30,
        color:       "#dc2626", // red
        description: "Technology is managed reactively with no formal security processes. Security incidents are likely occurring undetected. Controls are absent or inconsistently applied across the organisation.",
        riskProfile: "Extremely High — a single ransomware event or hardware failure could halt operations permanently.",
        characteristics: [
            "No documented security policies or procedures",
            "Critical technical controls absent (MFA, EDR, email security, NGFW)",
            "No tested backup or incident response capability",
            "Security incidents likely undetected",
        ],
    },
    {
        level:       2,
        name:        "Basic",
        scoreMin:    31,
        scoreMax:    50,
        color:       "#d97706", // amber
        description: "Some baseline controls are in place but inconsistently applied. Technology generally works but security is reactive rather than preventive. Key controls such as MFA or endpoint detection are absent.",
        riskProfile: "High — a targeted attack would likely succeed. Recovery from a serious incident would be slow and expensive.",
        characteristics: [
            "Some controls deployed but gaps remain in critical areas",
            "Security is primarily reactive",
            "Limited documentation and no formal review cadence",
            "Backups may exist but are not tested",
        ],
    },
    {
        level:       3,
        name:        "Developing",
        scoreMin:    51,
        scoreMax:    65,
        color:       "#ca8a04", // yellow-600
        description: "Key baseline controls are deployed and some formal processes are documented. The organisation is beginning to be proactive about security but has meaningful gaps remaining in technical controls or governance.",
        riskProfile: "Medium — commodity attacks would largely fail, but a sophisticated attacker could still succeed. Recovery would be difficult.",
        characteristics: [
            "MFA deployed on some or all systems",
            "Email security and endpoint protection present",
            "Backup exists; testing may be incomplete",
            "Some incident response documentation",
        ],
    },
    {
        level:       4,
        name:        "Managed",
        scoreMin:    66,
        scoreMax:    80,
        color:       "#34808A", // brand teal
        description: "Comprehensive security controls are in place and formal processes are documented and followed. Regular security reviews, tested backups, and formal incident response capability exist.",
        riskProfile: "Low–Medium — most attacks would fail. Incidents are detectable and recoverable within defined objectives.",
        characteristics: [
            "MFA deployed, EDR active, email security running",
            "Tested BCDR and documented IR plans",
            "Vulnerability scanning and annual pen testing in place",
            "Security governance committee and monthly reviews",
        ],
    },
    {
        level:       5,
        name:        "Optimized",
        scoreMin:    81,
        scoreMax:    100,
        color:       "#16a34a", // green
        description: "A continuous security improvement programme is in place. Advanced controls including SIEM, DLP, CASB, and data classification are deployed. Security is integrated into all business decisions.",
        riskProfile: "Low — the organisation presents a hardened target. Incidents are quickly detected, contained, and recovered from.",
        characteristics: [
            "Full 16-control technical security suite deployed",
            "SIEM, DLP, CASB, and data classification active",
            "Regular third-party validation (pen testing, audits)",
            "Security steering committee with C-level ownership",
        ],
    },
];

/**
 * Return the maturity level descriptor for a given final score.
 *
 * @param {number} finalScore - 0–100
 * @returns {object} Maturity level object
 */
export function getMaturityLevel(finalScore) {
    const score = Math.max(0, Math.min(100, Math.round(finalScore)));

    for (const level of MATURITY_LEVELS) {
        if (score >= level.scoreMin && score <= level.scoreMax) {
            return { ...level };
        }
    }

    // Fallback (should never reach here with valid 0-100 input)
    return { ...MATURITY_LEVELS[0] };
}

export { MATURITY_LEVELS };
