"use client";

/**
 * GaugeChart — Speedometer-style gauge with colored zone bands and a needle.
 *
 * The full semicircular arc is always visible as five colored bands:
 *   0–30:   #ef4444  (red)     — Critical
 *   30–50:  #f97316  (orange)  — At Risk
 *   50–65:  #eab308  (yellow)  — Developing
 *   65–80:  #34808A  (teal)    — Managed
 *   80–100: #22c55e  (green)   — Optimized
 *
 * A needle rotates from 9 o'clock (score 0) to 3 o'clock (score 100)
 * via 12 o'clock (score 50). Math: angle = π × (1 − score/100).
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
    if (score <= 30)  return "Critical";
    if (score <= 50)  return "At Risk";
    if (score <= 65)  return "Developing";
    if (score <= 80)  return "Managed";
    return "Optimized";
};

const GaugeChart = ({ score = 0, size = 220 }) => {
    const r      = size * 0.36;
    const cx     = size / 2;
    const cy     = size * 0.52;
    const C      = 2 * Math.PI * r;
    const halfC  = C / 2;
    const sw     = size * 0.056;
    const s      = Math.min(100, Math.max(0, score));

    // Needle: rotates from π (9 o'clock) to 0 (3 o'clock)
    const ang  = Math.PI * (1 - s / 100);
    const nLen = r * 0.78;
    const tipX = cx + nLen * Math.cos(ang);
    const tipY = cy - nLen * Math.sin(ang);

    // Needle base wings — a slim triangle polygon
    const baseHalf = size * 0.008;
    const perpAng  = ang + Math.PI / 2;
    const bx1 = cx + baseHalf * Math.cos(perpAng);
    const by1 = cy - baseHalf * Math.sin(perpAng);
    const bx2 = cx - baseHalf * Math.cos(perpAng);
    const by2 = cy + baseHalf * Math.sin(perpAng);

    const color = getZoneColor(s);

    return (
        <svg
            width={size}
            height={size * 0.74}
            viewBox={`0 0 ${size} ${size * 0.74}`}
            aria-label={`Security Score: ${score} out of 100`}
            role="img"
        >
            {/* ── Background track (slightly wider than bands for a border effect) */}
            <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={sw + 4}
                strokeDasharray={`${halfC} ${halfC}`}
                strokeDashoffset={halfC}
                strokeLinecap="butt"
            />

            {/* ── Coloured zone bands ────────────────────────────────────────── */}
            {ZONES.map((z, i) => {
                const len    = (z.end - z.start) * halfC;
                const offset = halfC * (1 - z.start);
                return (
                    <circle key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={z.color}
                        strokeWidth={sw}
                        strokeDasharray={`${len} ${C - len}`}
                        strokeDashoffset={offset}
                        strokeLinecap="butt"
                    />
                );
            })}

            {/* ── Needle shadow ──────────────────────────────────────────────── */}
            <polygon
                points={`${tipX + 1.5},${tipY + 1.5} ${bx1 + 1.5},${by1 + 1.5} ${bx2 + 1.5},${by2 + 1.5}`}
                fill="rgba(0,0,0,0.15)"
            />

            {/* ── Needle (triangle polygon, sharp tip) ──────────────────────── */}
            <polygon
                points={`${tipX},${tipY} ${bx1},${by1} ${bx2},${by2}`}
                fill="#111827"
            />

            {/* ── Pivot outer ring ───────────────────────────────────────────── */}
            <circle cx={cx} cy={cy} r={size * 0.030} fill="#1f2937" />
            {/* ── Pivot inner highlight ─────────────────────────────────────── */}
            <circle cx={cx} cy={cy} r={size * 0.014} fill="#f9fafb" />

            {/* ── Score number ───────────────────────────────────────────────── */}
            <text
                x={cx}
                y={cy + size * 0.045}
                textAnchor="middle"
                fill="#111827"
                fontSize={size * 0.165}
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                {score}
            </text>

            {/* ── / 100 label ────────────────────────────────────────────────── */}
            <text
                x={cx}
                y={cy + size * 0.125}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={size * 0.062}
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                / 100
            </text>

            {/* ── Zone label ─────────────────────────────────────────────────── */}
            <text
                x={cx}
                y={cy + size * 0.20}
                textAnchor="middle"
                fill={color}
                fontSize={size * 0.060}
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                {getScoreLabel(score)}
            </text>
        </svg>
    );
};

export default GaugeChart;
