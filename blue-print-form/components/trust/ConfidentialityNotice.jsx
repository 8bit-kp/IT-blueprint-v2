"use client";

import { FiLock, FiUsers, FiClock, FiEyeOff } from "react-icons/fi";

// Reusable Assessment Data & Confidentiality notice.
// Rendered at the top of Step 1 (CompanyInfoStep) — immediately before the first question.
// Per product-vision.md PD-008: trust context must be reinforced at the exact moment
// sensitive data entry begins.
//
// Restyled to the shared design system (styles/new-ui/tokens.css) — requires
// a `.nui`-scoped ancestor (present: this only ever renders inside
// /blueprint-form, which is `.nui`-scoped). Same content/behavior as before.

const NoticePoint = ({ icon: Icon, title, body }) => (
  <div className="flex items-start gap-2.5">
    <div className="w-6 h-6 rounded-[var(--nui-r-xs)] bg-[var(--nui-accent-tint)] flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={12} className="text-[var(--nui-brand)]" />
    </div>
    <div>
      <p className="text-xs font-semibold text-[var(--nui-text-2)] mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nui-text-3)] leading-relaxed">{body}</p>
    </div>
  </div>
);

const ConfidentialityNotice = () => (
  <div className="max-w-5xl mx-auto mb-6">
    <div className="bg-[var(--nui-surface)] border border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r)] overflow-hidden shadow-[var(--nui-shadow-1)]">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-[var(--nui-line-soft)] bg-[var(--nui-accent-tint)]">
        <FiLock size={13} className="text-[var(--nui-brand)] flex-shrink-0" />
        <p className="text-xs font-bold text-[var(--nui-brand)] uppercase tracking-wide">
          Assessment Data &amp; Confidentiality
        </p>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-xs text-[var(--nui-text-2)] leading-relaxed mb-4">
          The information you provide is used solely to generate your{" "}
          <strong className="text-[var(--nui-text)]">Current State Report</strong> and to help your
          assigned Consltek advisor prepare for your consultation. Once your assessment is
          submitted, Consltek will assign an advisor to your account and reach out to schedule
          your consultation. Your data is not used for any other purpose.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <NoticePoint
            icon={FiUsers}
            title="Who has access"
            body="Your assigned Consltek advisor and Consltek staff directly supporting your engagement. No one outside Consltek can access your data."
          />
          <NoticePoint
            icon={FiEyeOff}
            title="Never sold"
            body="Assessment data is never sold, rented, or shared with any third party under any circumstances."
          />
          <NoticePoint
            icon={FiLock}
            title="Security practices"
            body="Data is encrypted in transit using TLS 1.2+ and stored at rest in a SOC 2 Type II certified cloud database."
          />
          <NoticePoint
            icon={FiClock}
            title="Retention period"
            body="Data is retained for the duration of your active account and permanently removed within 30 days of an account deletion request."
          />
        </div>

        {/* Policy links — intentionally readable, not fine print */}
        <div className="mt-4 pt-3 border-t border-[var(--nui-line-soft)] flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-xs text-[var(--nui-text-3)]">For complete details:</span>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--nui-accent)] hover:text-[var(--nui-brand)] hover:underline font-semibold"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--nui-accent)] hover:text-[var(--nui-brand)] hover:underline font-semibold"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ConfidentialityNotice;
