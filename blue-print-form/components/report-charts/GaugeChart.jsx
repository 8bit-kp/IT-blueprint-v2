"use client";

/**
 * GaugeChart — Speedometer-style gauge with colored zone bands, tick labels,
 * and a tapered needle with a counterweight tail.
 *
 * Zone bands (unchanged from the scoring model):
 *   0–30:   #ef4444  (red)     — Critical
 *   30–50:  #f97316  (orange)  — At Risk
 *   50–65:  #eab308  (yellow)  — Developing
 *   65–80:  #34808A  (teal)    — Managed
 *   80–100: #22c55e  (green)   — Optimized
 *
 * Fix: the previous version placed the score number's baseline only ~14px
 * below the pivot, so the tall digits' ascenders visually collided with the
 * needle hub. This version uses a fixed internal 300x250 coordinate system
 * with deliberate vertical rhythm: arc → pivot → (gap) → score → unit →
 * zone badge, so nothing overlaps at any score value or render size.
 */

const ZONES = [
    { start: 0,    end: 0.30, color: "#ef4444" },
    { start: 0.30, end: 0.50, color: "#f97316" },
    { start: 0.50, end: 0.65, color: "#eab308" },
    { start: 0.65, end: 0.80, color: "#34808A" },
    { start: 0.80, end: 1.00, color: "#22c55e" },
];

const getZoneColor = (score) => {
    const f = Math.min(100, Math.max(0, score)) / 100;
    for (const z of ZONES) {
        if (f <= z.end) return z.color;
    }
    return ZONES[ZONES.length - 1].color;
};

const getScoreLabel = (score) => {
    if (score <= 30) return "Critical";
    if (score <= 50) return "At Risk";
    if (score <= 65) return "Developing";
    if (score <= 80) return "Managed";
    return "Optimized";
};

// ── Fixed internal coordinate system ────────────────────────────────────
const W = 300;
const H = 250;
const CX = 150;
const CY = 130;
const R = 88;
const SW = 20;              // band stroke width
const C = 2 * Math.PI * R;
const HALF_C = C / 2;
const GAP_FRAC = 0.006;     // small visual gap between adjacent bands

const polar = (angle, radius) => ({
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
});

const GaugeChart = ({ score = 0, size = 240 }) => {
    const s = Math.min(100, Math.max(0, score));
    const color = getZoneColor(s);
    const height = size * (H / W);

    // Needle: rotates from π (score 0, 9 o'clock) to 0 (score 100, 3 o'clock)
    const ang = Math.PI * (1 - s / 100);
    const needleLen = R * 0.60;
    const tailLen = R * 0.16;
    const tip = polar(ang, needleLen);
    const tail = polar(ang + Math.PI, tailLen);

    // Needle body as a slim tapered quadrilateral (wider at hub, sharp at tip)
    const hubHalfWidth = 4.2;
    const perp = ang + Math.PI / 2;
    const perpVec = { x: Math.cos(perp), y: -Math.sin(perp) };
    const hubL = { x: CX + hubHalfWidth * perpVec.x, y: CY + hubHalfWidth * perpVec.y };
    const hubR = { x: CX - hubHalfWidth * perpVec.x, y: CY - hubHalfWidth * perpVec.y };

    return (
        <svg
            width={size}
            height={height}
            viewBox={`0 0 ${W} ${H}`}
            aria-label={`Security Score: ${score} out of 100 — ${getScoreLabel(s)}`}
            role="img"
        >
            <defs>
                <filter id="gaugeNeedleShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" floodColor="#0f172a" floodOpacity="0.35" />
                </filter>
                <radialGradient id="gaugePivotGrad" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#4b5563" />
                    <stop offset="100%" stopColor="#111827" />
                </radialGradient>
            </defs>

            {/* ── Background track ──────────────────────────────────────────── */}
            <circle
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={SW + 5}
                strokeDasharray={`${HALF_C} ${HALF_C}`}
                strokeDashoffset={HALF_C}
                strokeLinecap="butt"
            />

            {/* ── Colored zone bands, with a hairline gap between segments ──── */}
            {ZONES.map((z, i) => {
                const isFirst = i === 0;
                const isLast = i === ZONES.length - 1;
                const start = z.start + (isFirst ? 0 : GAP_FRAC / 2);
                const end = z.end - (isLast ? 0 : GAP_FRAC / 2);
                const len = Math.max(0, (end - start) * HALF_C);
                const offset = HALF_C * (1 - start);
                return (
                    <circle key={i}
                        cx={CX} cy={CY} r={R}
                        fill="none"
                        stroke={z.color}
                        strokeWidth={SW}
                        strokeDasharray={`${len} ${C - len}`}
                        strokeDashoffset={offset}
                        strokeLinecap="butt"
                    />
                );
            })}

            {/* ── Tick labels at 0 / 50 / 100 ──────────────────────────────── */}
            {[0, 50, 100].map((tickVal) => {
                const tAng = Math.PI * (1 - tickVal / 100);
                const p = polar(tAng, R + SW / 2 + 14);
                return (
                    <text
                        key={tickVal}
                        x={p.x}
                        y={p.y + 4}
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize={11}
                        fontWeight="600"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        {tickVal}
                    </text>
                );
            })}

            {/* ── Needle (tapered polygon, tip + counterweight tail) ────────── */}
            <g filter="url(#gaugeNeedleShadow)">
                <polygon
                    points={`${tip.x},${tip.y} ${hubL.x},${hubL.y} ${tail.x},${tail.y} ${hubR.x},${hubR.y}`}
                    fill="#1f2937"
                />
            </g>

            {/* ── Pivot ───────────────────────────────────────────────────── */}
            <circle cx={CX} cy={CY} r={12} fill="url(#gaugePivotGrad)" stroke="#f9fafb" strokeWidth={2} />
            <circle cx={CX} cy={CY} r={4} fill="#f9fafb" opacity={0.9} />

            {/* ── Score number — generous clearance below the pivot ─────────── */}
            <text
                x={CX}
                y={CY + 62}
                textAnchor="middle"
                fill="#111827"
                fontSize={46}
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                {Math.round(s)}
            </text>

            {/* ── / 100 label ─────────────────────────────────────────────── */}
            <text
                x={CX}
                y={CY + 83}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={13}
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                out of 100
            </text>

            {/* ── Zone badge (pill) ───────────────────────────────────────── */}
            <g transform={`translate(${CX}, ${CY + 104})`}>
                <rect
                    x={-58} y={-13} width={116} height={26} rx={13}
                    fill={color}
                    opacity={0.14}
                    stroke={color}
                    strokeWidth={1.25}
                />
                <text
                    x={0} y={5}
                    textAnchor="middle"
                    fill={color}
                    fontSize={13}
                    fontWeight="700"
                    fontFamily="system-ui, -apple-system, sans-serif"
                >
                    {getScoreLabel(s)}
                </text>
            </g>
        </svg>
    );
};

export default GaugeChart;