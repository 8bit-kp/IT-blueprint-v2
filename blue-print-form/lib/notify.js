import toast from "react-hot-toast";
import NotificationToast from "@/components/notifications/NotificationToast";

/**
 * notify — the one way this app shows toast notifications.
 *
 * Wraps react-hot-toast's toast.custom() with the branded NotificationToast
 * card instead of react-hot-toast's default bubble, so every popup in the
 * app — login errors, save failures, session-expiry, "complete your
 * assessment first" warnings, etc. — looks the same and matches the rest
 * of the design system. Call sites that used to call toast.error(...) /
 * toast.success(...) directly now call notify.error(...) / notify.success(...).
 *
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {string} message
 * @param {{ description?: string, duration?: number }} [opts]
 */
const show = (type, message, opts = {}) =>
    toast.custom(
        (t) => (
            <NotificationToast
                type={type}
                message={message}
                description={opts.description}
                visible={t.visible}
                onDismiss={() => toast.dismiss(t.id)}
            />
        ),
        { duration: opts.duration ?? (type === "error" || type === "warning" ? 5000 : 3500) },
    );

export const notify = {
    success: (message, opts) => show("success", message, opts),
    error: (message, opts) => show("error", message, opts),
    warning: (message, opts) => show("warning", message, opts),
    info: (message, opts) => show("info", message, opts),
};

export default notify;
