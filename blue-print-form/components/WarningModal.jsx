"use client";

import { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

/**
 * WarningModal — confirm/cancel dialog, restyled to the shared design
 * system (styles/new-ui/tokens.css). Same props, same behavior (Escape to
 * close, backdrop click to close, body scroll lock while open) as before —
 * only the visual treatment changed: flat risk-red accent instead of
 * gradients, a single fade+rise entrance instead of pulsing/ping decorative
 * blobs, calmer hover states. See docs/ui-redesign.md.
 */
export default function WarningModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Yes, Continue", cancelText = "Cancel" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Strip the legacy "⚠️ WARNING" emoji prefix some callers still pass —
  // the icon header now carries that meaning visually.
  const cleanTitle = (title || "Warning").replace(/^[^\w]*WARNING[^\w]*/i, "").trim() || "Warning";

  return (
    <div className="nui fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[color:rgba(15,42,56,0.55)] backdrop-blur-sm nui-modal-fade"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--nui-surface)] rounded-[var(--nui-r-lg)] shadow-[var(--nui-shadow-3)] max-w-lg w-full overflow-hidden border border-[var(--nui-line)] nui-modal-rise">
        {/* Flat risk accent — no gradient, no pulsing decoration */}
        <div className="h-1 w-full bg-[var(--nui-risk)]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-[var(--nui-r-sm)] flex items-center justify-center text-[var(--nui-text-3)] hover:text-[var(--nui-text)] hover:bg-[var(--nui-surface-sunk)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:outline-offset-1"
        >
          <FiX size={16} />
        </button>

        {/* Icon header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-[var(--nui-line-soft)]">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--nui-risk-bg)] rounded-full mb-4">
            <FiAlertTriangle size={26} className="text-[var(--nui-risk)]" strokeWidth={2} />
          </div>
          <h3 className="nui-display text-xl font-bold text-[var(--nui-text)]">
            {cleanTitle}
          </h3>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="bg-[var(--nui-risk-bg)] border border-[var(--nui-risk-line)] rounded-[var(--nui-r)] p-5">
            <p className="text-[var(--nui-text-2)] text-sm leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[var(--nui-surface-sunk)] px-8 py-5 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-[var(--nui-line-soft)]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-[var(--nui-text-2)] bg-[var(--nui-surface)] border border-[var(--nui-line-strong)] rounded-[var(--nui-r-sm)] hover:border-[var(--nui-accent)] hover:text-[var(--nui-brand)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--nui-accent)] focus-visible:outline-offset-1"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--nui-risk)] hover:bg-[var(--nui-risk-hover)] rounded-[var(--nui-r-sm)] shadow-[var(--nui-shadow-1)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--nui-risk)] focus-visible:outline-offset-1"
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Fade + 8px rise entrance, matching the design system's animation
          language (styles/new-ui/tokens.css). The global `.nui, .nui *`
          prefers-reduced-motion block collapses these to 1ms — no separate
          handling needed here. */}
      <style jsx>{`
        @keyframes nui-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes nui-modal-rise-in {
          from { opacity: 0; transform: translate3d(0, 10px, 0) scale(0.98); }
          to { opacity: 1; transform: none; }
        }
        .nui-modal-fade {
          animation: nui-modal-fade-in 180ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .nui-modal-rise {
          animation: nui-modal-rise-in 220ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
