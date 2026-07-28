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
    success: { Icon: FiCheckCircle, iconColor: "#16a34a", iconBg: "bg-green-50" },
    error: { Icon: FiAlertCircle, iconColor: "#dc2626", iconBg: "bg-red-50" },
    warning: { Icon: FiAlertTriangle, iconColor: "#d97706", iconBg: "bg-amber-50" },
    info: { Icon: FiInfo, iconColor: "#15587B", iconBg: "bg-[#15587B]/8" },
};

const NotificationToast = ({ type = "info", message, description, visible = true, onDismiss }) => {
    const cfg = VARIANTS[type] || VARIANTS.info;
    const { Icon } = cfg;

    return (
        <div
            className={[
                "max-w-sm w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden",
                visible ? "animate-enter" : "animate-leave",
            ].join(" ")}
            role={type === "error" || type === "warning" ? "alert" : "status"}
        >
            <div className="h-1 w-full bg-gradient-to-r from-[#34808A] to-[#15587B]" />
            <div className="flex items-start gap-3 px-4 py-3.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                    <Icon size={16} style={{ color: cfg.iconColor }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{message}</p>
                    {description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>}
                </div>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-0.5 -mt-0.5 -mr-1"
                    aria-label="Dismiss notification"
                >
                    <FiX size={15} />
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
