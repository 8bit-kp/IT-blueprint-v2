"use client";

/**
 * ProgressRing — SVG circular progress ring for percentage KPI metrics.
 * Pure SVG, no external charting library.
 */

const ProgressRing = ({
    value = null,        // 0–100, or null for "no data"
    label = "",
    size  = 80,
    strokeWidth = 8,
    color = "#34808A",
    emptyColor = "#e5e7eb",
}) => {
    const r         = (size - strokeWidth) / 2;
    const cx        = size / 2;
    const cy        = size / 2;
    const C         = 2 * Math.PI * r;
    const filled    = value !== null ? (Math.min(100, Math.max(0, value)) / 100) * C : 0;
    const showValue = value !== null;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-label={label ? `${label}: ${value ?? "N/A"}%` : undefined}
                role="img"
            >
                {/* Background ring */}
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={emptyColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc (starts at 12 o'clock = -90°) */}
                {showValue && (
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${filled} ${C - filled}`}
                        strokeDashoffset={C * 0.25}  // rotate start to 12 o'clock
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                    />
                )}
                {/* Center value */}
                <text
                    x={cx} y={cy + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={showValue ? "#111827" : "#9ca3af"}
                    fontSize={size * 0.2}
                    fontWeight="700"
                    fontFamily="system-ui, sans-serif"
                >
                    {showValue ? `${value}%` : "—"}
                </text>
            </svg>
            {label && (
                <span className="text-[10px] font-semibold text-gray-500 text-center leading-tight max-w-[80px]">
                    {label}
                </span>
            )}
        </div>
    );
};

export default ProgressRing;
