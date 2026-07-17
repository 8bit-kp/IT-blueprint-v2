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

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-16">

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
          <h1 className="text-3xl font-extrabold text-[#15587B] mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400">Effective date: January 1, 2025 &nbsp;·&nbsp; Last updated: July 2025</p>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            These Terms of Service ("<strong>Terms</strong>") govern your access to and use of the Consltek IT Blueprint
            platform ("<strong>Platform</strong>") operated by Consltek ("<strong>Consltek</strong>", "we", "us", or "our").
            By accessing or using the Platform you agree to be bound by these Terms. If you do not agree, do not use the Platform.
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account or submitting any data through this Platform, you represent that you are at least
            18 years of age and have the authority to bind the organisation on whose behalf you are using the Platform.
            Use of the Platform is governed by these Terms and the Consltek Privacy Policy, which is incorporated
            herein by reference.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            The IT Blueprint Platform is a professional assessment tool provided by Consltek to its clients and
            authorised consultants. It enables users to document an organisation's current-state IT infrastructure,
            security controls, and application portfolio, and to generate structured PDF reports for use in
            consulting engagements.
          </p>
          <p>
            Access to the Platform is provided exclusively as part of a Consltek engagement or by express invitation.
            Unauthorised use is prohibited.
          </p>
        </Section>

        <Section title="3. Account Responsibilities">
          <p>You are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Maintaining the confidentiality of your account credentials.</li>
            <li>All activity that occurs under your account.</li>
            <li>Ensuring that the information you submit is accurate and that you have the authority to disclose it.</li>
            <li>Notifying Consltek immediately at <strong>support@consltek.com</strong> if you suspect unauthorised access to your account.</li>
          </ul>
          <p>
            Consltek reserves the right to suspend or terminate accounts where misuse, unauthorised access, or
            breach of these Terms is suspected.
          </p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Use the Platform for any unlawful purpose or in violation of any applicable regulation.</li>
            <li>Submit false, misleading, or fabricated IT environment data.</li>
            <li>Attempt to probe, scan, or test the vulnerability of the Platform or its infrastructure.</li>
            <li>Introduce malware, scripts, or any code designed to disrupt or damage the Platform.</li>
            <li>Scrape, harvest, or systematically extract data from the Platform.</li>
            <li>Attempt to access another user's account or data.</li>
          </ul>
        </Section>

        <Section title="5. Data and Confidentiality">
          <p>
            All IT environment data you submit through the Platform is treated as confidential. Consltek will not
            disclose your data to any third party except as described in the Privacy Policy or as required by law.
          </p>
          <p>
            You retain ownership of all data you submit. By submitting data, you grant Consltek a limited,
            non-exclusive licence to process and store that data for the sole purpose of delivering the Platform
            service and fulfilling your consulting engagement.
          </p>
          <p>
            PDF reports generated by the Platform are produced entirely in your browser. No report content
            is transmitted to or stored on Consltek servers beyond the underlying assessment data.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The Platform, including its software, design, trademarks, and all content produced by Consltek, is
            the exclusive property of Consltek and is protected by applicable intellectual property law.
          </p>
          <p>
            You are granted a limited, non-transferable licence to use the Platform solely for the purpose of
            completing your IT assessment. You may not copy, modify, distribute, or reverse-engineer any part
            of the Platform.
          </p>
        </Section>

        <Section title="7. Disclaimers">
          <p>
            The Platform is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind,
            express or implied. Consltek does not warrant that the Platform will be uninterrupted, error-free, or
            free of security vulnerabilities.
          </p>
          <p>
            Assessment reports generated by the Platform are informational and are intended to support a consulting
            engagement. They do not constitute a formal security audit, certification, or legal compliance assessment.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Consltek shall not be liable for any indirect,
            incidental, consequential, or punitive damages arising from your use of or inability to use the Platform,
            including but not limited to loss of data, loss of revenue, or loss of business opportunity.
          </p>
          <p>
            Consltek's total aggregate liability for any claim arising out of or related to these Terms shall not
            exceed the fees paid by you to Consltek in the twelve months preceding the claim.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            Consltek may suspend or terminate your access to the Platform at any time, with or without notice,
            if you breach these Terms or if required for security or operational reasons.
          </p>
          <p>
            You may request account deletion at any time by contacting <strong>support@consltek.com</strong>.
            Upon termination, your data will be deleted in accordance with the Privacy Policy.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of the jurisdiction in which
            Consltek is incorporated, without regard to its conflict of law provisions. Any dispute arising under
            these Terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will provide reasonable notice of material
            changes. Your continued use of the Platform following any change constitutes acceptance of the
            updated Terms.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>For questions about these Terms, contact:</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-gray-700">Consltek</p>
            <p className="text-gray-500">Email: legal@consltek.com</p>
            <p className="text-gray-500">Website: consltek.com</p>
          </div>
        </Section>

      </main>

      <Footer />
    </div>
  );
}
