"use client";

import { FiLock, FiUsers, FiClock, FiEyeOff } from "react-icons/fi";

// Reusable Assessment Data & Confidentiality notice.
// Rendered at the top of Step 1 (CompanyInfoStep) — immediately before the first question.
// Per product-vision.md PD-008: trust context must be reinforced at the exact moment
// sensitive data entry begins.

const NoticePoint = ({ icon: Icon, title, body }) => (
  <div className="flex items-start gap-2.5">
    <div className="w-6 h-6 rounded-md bg-[#15587B]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={12} className="text-[#15587B]" />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-0.5">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
    </div>
  </div>
);

const ConfidentialityNotice = () => (
  <div className="max-w-5xl mx-auto mb-6">
    <div className="bg-white border border-[#15587B]/15 rounded-xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-[#15587B]/10 bg-[#15587B]/5">
        <FiLock size={13} className="text-[#15587B] flex-shrink-0" />
        <p className="text-xs font-bold text-[#15587B] uppercase tracking-wide">
          Assessment Data &amp; Confidentiality
        </p>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          The information you provide is used solely to generate your{" "}
          <strong className="text-gray-700">Current State Report</strong> and to help your
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
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-xs text-gray-400">For complete details:</span>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#34808A] hover:underline font-semibold"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#34808A] hover:underline font-semibold"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default ConfidentialityNotice;
