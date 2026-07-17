"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiArrowLeft } from "react-icons/fi";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold text-[#15587B] mb-3 pb-2 border-b border-gray-100">{title}</h2>
    <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-26">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#15587B] transition mb-10"
        >
          <FiArrowLeft size={15} /> Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34808A]/10 text-[#34808A] text-xs font-bold uppercase tracking-wider mb-4">
            Legal
          </div>
          <h1 className="text-3xl font-extrabold text-[#15587B] mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Effective date: January 1, 2025 &nbsp;·&nbsp; Last updated: July 2025</p>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            This Privacy Policy describes how Consltek ("<strong>Consltek</strong>", "we", "us", or "our") collects,
            uses, and protects information submitted through the IT Blueprint platform. By using this platform you
            agree to the practices described in this policy.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly when creating an account or completing an IT Blueprint assessment, including:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Account credentials — username, email address, and hashed password.</li>
            <li>Organisation details — company name, contact person, phone number, and industry.</li>
            <li>IT environment data — infrastructure inventory, security controls, application portfolio, and network configuration entered during the assessment.</li>
          </ul>
          <p>We do not collect payment information, browsing history, or data from third-party sources.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>Information collected through this platform is used solely to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Provide, operate, and maintain the IT Blueprint service.</li>
            <li>Generate PDF assessment reports for your engagement.</li>
            <li>Authenticate and manage your account session.</li>
            <li>Enable your assigned Consltek consultant to review your submission as part of an active engagement.</li>
          </ul>
          <p>We do not use your data for advertising, profiling, or automated decision-making.</p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>Your data is stored in MongoDB Atlas, a SOC 2 Type II certified cloud database service. We implement the following security controls:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Encryption in transit:</strong> All connections between your browser and our servers are encrypted using TLS 1.2 or higher.</li>
            <li><strong>Authentication:</strong> Sessions are managed via short-lived JWT tokens stored in HTTP-only, Secure cookies — inaccessible to client-side scripts.</li>
            <li><strong>Access control:</strong> Blueprint data is isolated per account. No user can access another user's data.</li>
            <li><strong>Token revocation:</strong> All active sessions can be invalidated server-side without requiring a password change.</li>
            <li><strong>Input sanitisation:</strong> All submitted data is validated and sanitised server-side before persistence to prevent injection attacks.</li>
          </ul>
          <p className="italic text-gray-400 text-xs mt-3">Note: This platform is an internal consulting tool. It is not certified under ISO 27001 or SOC 2 independently. The MongoDB Atlas infrastructure it runs on holds those certifications.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            Assessment data is retained for the duration of your active account. If you request account deletion,
            all associated blueprint data will be permanently removed within 30 days.
          </p>
          <p>
            Consltek reserves the right to retain anonymised, aggregated statistics that cannot be linked back to
            any individual or organisation.
          </p>
        </Section>

        <Section title="5. Data Sharing">
          <p>
            We do not sell, rent, or trade your personal information or IT environment data to any third party.
            Your data may be accessed only by:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Consltek consultants assigned to your active engagement.</li>
            <li>Authorised Consltek platform administrators for support and maintenance purposes.</li>
          </ul>
          <p>
            We may be required to disclose information where compelled by applicable law or a valid legal process.
            We will notify you where legally permitted to do so.
          </p>
        </Section>

        <Section title="6. Cookies and Session Management">
          <p>
            This platform uses a single HTTP-only session cookie (<code className="bg-gray-100 px-1 rounded text-xs font-mono">auth_token</code>)
            to maintain your authenticated session. This cookie is not used for tracking or analytics.
            No third-party tracking cookies are set by this platform.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Object to the processing of your information.</li>
          </ul>
          <p>To exercise any of these rights, contact us at <strong>privacy@consltek.com</strong>.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be communicated via email
            or a notice on this platform. Continued use of the platform after any change constitutes acceptance
            of the updated policy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>For privacy-related enquiries, contact:</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-700">Consltek</p>
            <p className="text-gray-500">Email: privacy@consltek.com</p>
            <p className="text-gray-500">Website: consltek.com</p>
          </div>
        </Section>

      </main>

      <Footer />
    </div>
  );
}
