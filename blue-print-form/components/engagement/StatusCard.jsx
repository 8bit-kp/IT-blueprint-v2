"use client";

// StatusCard — small engagement status indicator pill.
// Used on the All Reports page to show report availability and future
// engagement states (advisor review, consultation scheduled, etc.).
//
// Restyled to the shared design system (styles/new-ui/tokens.css) — requires
// a `.nui`-scoped ancestor. Same props/behavior as before; fixed-meaning
// semantic colours (ready=ok, pending/in_progress=warn/info, complete=accent)
// map to the equivalent nui tokens, same rule as every other status marker
// in the app.
//
// Props:
//   status:      "ready" | "pending" | "in_progress" | "complete"
//   label:       string — short label text

import React from "react";

const STATUS_CONFIG = {
    ready: {
        dot:    "bg-[var(--nui-ok)]",
        text:   "text-[var(--nui-ok)]",
        bg:     "bg-[var(--nui-ok-bg)]",
        border: "border-[var(--nui-ok-line)]",
    },
    pending: {
        dot:    "bg-[var(--nui-warn)] animate-pulse",
        text:   "text-[var(--nui-warn)]",
        bg:     "bg-[var(--nui-warn-bg)]",
        border: "border-[var(--nui-warn-line)]",
    },
    in_progress: {
        dot:    "bg-[var(--nui-info)] animate-pulse",
        text:   "text-[var(--nui-info)]",
        bg:     "bg-[var(--nui-info-bg)]",
        border: "border-[var(--nui-info-line)]",
    },
    complete: {
        dot:    "bg-[var(--nui-accent)]",
        text:   "text-[var(--nui-brand)]",
        bg:     "bg-[var(--nui-accent-tint)]",
        border: "border-[color:var(--nui-accent-tint-2)]",
    },
};

export default function StatusCard({ status = "ready", label }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <span className={`text-[10px] font-semibold ${cfg.text}`}>{label}</span>
        </div>
    );
}
