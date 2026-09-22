"use client";

import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

/**
 * NotificationToast — the branded card rendered by every toast in the app
 * (see lib/notify.js). Replaces react-hot-toast's default bubble with a
 * Consltek-styled card: the same top accent gradient used on the auth card,
 * assessment-complete hero, and other primary cards, plus a semantic
 * status icon (success/error/warning/info colors are never reskinned to
 * brand teal — they communicate fixed meaning, same rule as scoreZone/
 * severity elsewhere in the app).
 */

const VARIANTS = {
    success: { Icon: FiCheckCircle, iconColor: "var(--nui-ok)", iconBg: "bg-[var(--nui-ok-bg)]" },
    error: { Icon: FiAlertCircle, iconColor: "var(--nui-risk)", iconBg: "bg-[var(--nui-risk-bg)]" },
    warning: { Icon: FiAlertTriangle, iconColor: "var(--nui-warn)", iconBg: "bg-[var(--nui-warn-bg)]" },
    info: { Icon: FiInfo, iconColor: "var(--nui-info)", iconBg: "bg-[var(--nui-info-bg)]" },
};

const NotificationToast = ({ type = "info", message, description, visible = true, onDismiss }) => {
    const cfg = VARIANTS[type] || VARIANTS.info;
    const { Icon } = cfg;

    return (
        <div
            className={[
                "max-w-sm w-full bg-[var(--nui-surface)] rounded-2xl shadow-[var(--nui-shadow-3)] border border-[var(--nui-line)] overflow-hidden",
                visible ? "animate-enter" : "animate-leave",
            ].join(" ")}
            role={type === "error" || type === "warning" ? "alert" : "status"}
        >
            <div className="h-1 w-full bg-gradient-to-r from-[var(--nui-accent)] to-[var(--nui-brand)]" />
            <div className="flex items-start gap-3 px-4 py-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                    <Icon size={16} style={{ color: cfg.iconColor }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-[var(--nui-text)] leading-snug">{message}</p>
                    {description && <p className="text-xs text-[var(--nui-text-3)] mt-1 leading-relaxed">{description}</p>}
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="flex-shrink-0 text-[var(--nui-text-3)] hover:text-[var(--nui-text-2)] transition-colors p-0.5 -mt-0.5 -mr-1"
                    aria-label="Dismiss notification"
                >
                    <FiX size={15} />
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
