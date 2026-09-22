import React from "react";

/**
 * ProgressBar
 *
 * Renders a segmented progress indicator for the multi-step form.
 *
 * Props:
 *   step        {number}   - The current active step (1-indexed).
 *   totalSteps  {number}   - Total number of steps.
 *   onStepClick {function} - Optional. Called with the target step number when
 *                            a segment is clicked. When omitted the bar is
 *                            visual-only (backward-compatible).
 *
 * Clicking the currently active segment is a no-op.
 *
 * Styled with the shared design-system tokens (styles/new-ui/tokens.css) —
 * requires a `.nui`-scoped ancestor, same as every other restyled component
 * in this migration. See docs/ui-redesign.md.
 */
const ProgressBar = ({ step, totalSteps, onStepClick }) => {
  // Calculate specific percentage for text label
  const percentage = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2.5 px-0.5">
        <span className="nui-eyebrow text-[11px] font-bold text-[var(--nui-brand)]">
          Step {step} <span className="text-[var(--nui-text-3)] font-medium normal-case tracking-normal">/ {totalSteps}</span>
        </span>
        <span className="nui-num text-[10px] font-semibold text-[var(--nui-text-3)] bg-[var(--nui-surface-sunk)] px-2 py-0.5 rounded-[var(--nui-r-xs)] border border-[var(--nui-line)]">
          {percentage}% Complete
        </span>
      </div>

      {/* Segmented Bar */}
      <div className="flex gap-1.5 h-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;

          // Determine state of this specific segment
          const isCompleted = stepNum < step;
          const isActive    = stepNum === step;

          // Base classes
          let barColor = "bg-[var(--nui-line)]"; // Future steps

          if (isCompleted) {
            barColor = "bg-[var(--nui-accent)]"; // Completed steps
          } else if (isActive) {
            barColor = "bg-[var(--nui-accent)] shadow-[0_0_6px_rgba(52,128,138,0.45)]"; // Current step (subtle glow)
          }

          // When a click handler is provided, make each non-active segment
          // interactive. The active segment click is intentionally a no-op.
          const isClickable = !!onStepClick && !isActive;

          return (
            <div
              key={index}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              title={isClickable ? `Go to Step ${stepNum}` : undefined}
              aria-label={isClickable ? `Go to Step ${stepNum}` : undefined}
              aria-current={isActive ? "step" : undefined}
              onClick={() => isClickable && onStepClick(stepNum)}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onStepClick(stepNum);
                }
              }}
              className={[
                "flex-1 rounded-[var(--nui-r-pill)] transition-all duration-500 ease-out",
                barColor,
                isActive ? "scale-y-110" : "",
                isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default",
                isClickable ? "focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:outline-offset-2" : "",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
