"use client";

// StatusCard — small engagement status indicator pill.
// Used on the All Reports page to show report availability and future
// engagement states (advisor review, consultation scheduled, etc.).
//
// Props:
//   status:      "ready" | "pending" | "in_progress" | "complete"
//   label:       string — short label text

import React from "react";

const STATUS_CONFIG = {
    ready: {
        dot:    "bg-green-400",
        text:   "text-green-700",
        bg:     "bg-green-50",
        border: "border-green-100",
    },
    pending: {
        dot:    "bg-amber-400 animate-pulse",
        text:   "text-amber-700",
        bg:     "bg-amber-50",
        border: "border-amber-100",
    },
    in_progress: {
        dot:    "bg-blue-400 animate-pulse",
        text:   "text-blue-700",
        bg:     "bg-blue-50",
        border: "border-blue-100",
    },
    complete: {
        dot:    "bg-teal-500",
        text:   "text-teal-700",
        bg:     "bg-teal-50",
        border: "border-teal-100",
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
