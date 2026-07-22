"use client";

/**
 * WaterfallChart — deduction waterfall showing how the final score is derived.
 *
 * Displays:
 *   1. Weighted composite bar (teal)
 *   2. Each triggered penalty as a labeled deduction (red)
 *   3. Cap adjustment if applied (amber)
 *   4. Final score bar (color-coded by score)
 *
 * Implemented as styled HTML bars (proportional to max 100) rather than
 * a Recharts waterfall — simpler, more readable, fully responsive.
 */

// Module-scope helper: score colour
const getScoreColor = (score) => {
    if (score <= 30)  return "#dc2626";
    if (score <= 50)  return "#d97706";
    if (score <= 65)  return "#ca8a04";
    if (score <= 80)  return "#34808A";
    return "#16a34a";
};

// Module-scope bar row
const WaterfallRow = ({ label, value, maxValue = 100, type, isLast = false }) => {
    const isComposite = type === "composite";
    const isPenalty   = type === "penalty";
    const isCap       = type === "cap";
    const isFinal     = type === "final";
    const isFloor     = type === "floor";

    const absValue  = Math.abs(value);
    const barWidth  = Math.round((absValue / maxValue) * 100);

    let barColor;
    if (isComposite)       barColor = "#34808A";
    else if (isPenalty)    barColor = "#dc2626";
    else if (isCap)        barColor = "#d97706";
    else if (isFloor)      barColor = "#9ca3af";
    else /* final */       barColor = getScoreColor(value);

    let valueLabel;
    if (isComposite || isFinal) valueLabel = `${value}`;
    else                        valueLabel = `${value > 0 ? "+" : ""}${value}`;

    return (
        <div className={`flex items-center gap-3 py-2 ${isLast ? "" : "border-b border-gray-50"}`}>
            {/* Label */}
            <div className="w-52 flex-shrink-0 pr-2">
                <span className={`text-xs leading-tight ${isFinal ? "font-bold text-gray-800" : isPenalty ? "text-red-700" : isCap ? "text-amber-700" : "text-gray-600"}`}>
                    {label}
                </span>
            </div>

            {/* Bar + value */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, barWidth)}%`, backgroundColor: barColor }}
                    />
                </div>
                <span className={`text-xs font-bold w-10 text-right flex-shrink-0 ${isPenalty ? "text-red-600" : isCap ? "text-amber-600" : "text-gray-700"}`}>
                    {valueLabel}
                </span>
            </div>
        </div>
    );
};

const WaterfallChart = ({ waterfall = [] }) => {
    // Exclude the "final" entry from the main list — display it separately at bottom
    const rows    = waterfall.filter((w) => w.type !== "final");
    const finalRow= waterfall.find((w)  => w.type === "final");
    const maxValue= Math.max(...waterfall.map((w) => Math.abs(w.value)), 100);

    if (!waterfall.length) {
        return <p className="text-sm text-gray-400">No waterfall data available.</p>;
    }

    return (
        <div className="w-full">
            {/* Header row */}
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 mb-1">
                <div className="w-52 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Component</span>
                </div>
                <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contribution</span>
                </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
                <WaterfallRow
                    key={i}
                    label={row.label}
                    value={row.value}
                    maxValue={maxValue}
                    type={row.type}
                />
            ))}

            {/* Divider before final */}
            {finalRow && (
                <>
                    <div className="border-t-2 border-gray-300 my-3" />
                    <WaterfallRow
                        label={finalRow.label}
                        value={finalRow.value}
                        maxValue={maxValue}
                        type="final"
                        isLast
                    />
                </>
            )}
        </div>
    );
};

export default WaterfallChart;
