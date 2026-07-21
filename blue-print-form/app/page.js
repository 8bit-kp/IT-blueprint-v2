"use client";

import { FiArrowRight, FiFileText, FiShield, FiCpu, FiLayers, FiLock, FiDatabase, FiCheckCircle, FiUserCheck, FiEyeOff, FiUsers, FiHelpCircle, FiBarChart2 } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

// Compact Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:border-[#34808A]/30 transition-all duration-300 group">
    <div className="w-10 h-10 bg-[#34808A]/10 rounded-lg flex items-center justify-center mb-4 text-[#34808A] group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <h3 className="text-lg font-bold text-[#15587B] mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

// Security control card
const SecurityCard = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3 bg-[#15587B]/5 border border-[#15587B]/10 rounded-xl p-4">
    <div className="w-8 h-8 bg-[#15587B]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={15} className="text-[#15587B]" />
    </div>
    <div>
      <p className="text-xs font-bold text-[#15587B] uppercase tracking-wide mb-0.5">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// Why-we-collect card
const WhyCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white/70 border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
    <div className="w-9 h-9 bg-[#34808A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={18} className="text-[#34808A]" />
    </div>
    <h3 className="text-sm font-bold text-[#15587B]">{title}</h3>
    <div className="text-sm text-gray-500 leading-relaxed space-y-1">{children}</div>
  </div>
);

export default function Home() {
  const router = useRouter();

  // Helper for auth checks — checks localStorage.username as the client-side
  // login indicator. The real auth is enforced server-side via HTTP-only cookie.
  const handleNavigation = (path) => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem("username");
      if (username) {
        router.push(path);
      } else {
        router.push("/auth");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col pt-7 font-sans">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-gray-100/50 -z-10" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#34808A]/10 rounded-full blur-3xl animate-[blobMove1_20s_infinite]" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-[#15587B]/10 rounded-full blur-3xl animate-[blobMove2_25s_infinite]" />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Hero Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-6 py-12 lg:py-20 max-w-7xl mx-auto w-full relative z-10">

        {/* Text Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#34808A] animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">IT Infrastructure Assessment</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#15587B] mb-6 tracking-tight leading-[1.1]">
            Document Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34808A] to-[#15587B]">IT Landscape</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Consltek helps IT consultants and their clients capture a complete picture of their current infrastructure, security controls, and application portfolio — in one structured, shareable document.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleNavigation("/blueprint-form")}
              className="group min-w-[200px] px-8 py-4 bg-[#15587B] text-white font-bold rounded-full shadow-xl shadow-blue-900/10 hover:bg-[#0f4460] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Assessment <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigation("/blueprint-summary")}
              className="group min-w-[200px] px-8 py-4 bg-white text-[#15587B] border border-gray-200 font-bold rounded-full shadow-sm hover:border-[#15587B]/30 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiFileText className="text-gray-400 group-hover:text-[#15587B] transition-colors" /> View Summary
            </button>

            <button
              onClick={() => handleNavigation("/all-blueprints")}
              className="group min-w-[200px] px-8 py-4 bg-gradient-to-r from-[#34808A] to-[#15587B] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiLayers className="group-hover:rotate-12 transition-transform" /> All Reports
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <FeatureCard
            icon={FiLayers}
            title="Infrastructure"
            desc="Document your network, servers, and facility setup in a single, structured format."
          />
          <FeatureCard
            icon={FiShield}
            title="Security Controls"
            desc="Track compliance, administrative policies, and technical security measures effortlessly."
          />
          <FeatureCard
            icon={FiCpu}
            title="Application Portfolio"
            desc="Keep a precise inventory of critical applications, vendors, and business priorities."
          />
        </div>

        {/* Why We Collect This Information */}
        <div className="w-full max-w-6xl mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34808A]/10 text-[#34808A] text-xs font-bold uppercase tracking-wider mb-3">
              Transparency
            </div>
            <h2 className="text-2xl font-bold text-[#15587B] mb-2">Why we ask these questions</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Before requesting IT environment information, we want to be clear about why it's needed, how it will be used, and who will have access to it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <WhyCard icon={FiHelpCircle} title="Why this information is requested">
              <p>
                Consltek advisors need an accurate picture of your current IT environment before they can offer meaningful guidance.
              </p>
              <p>
                Without structured discovery, consulting engagements spend multiple sessions collecting information that could be documented in advance — adding time and cost before any analysis begins.
              </p>
              <p>
                The assessment replaces that unstructured gathering with a single, efficient process.
              </p>
            </WhyCard>

            <WhyCard icon={FiBarChart2} title="How it is used">
              <p>Your assessment data is used to:</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Generate your <strong className="text-gray-700">Current State Report</strong> immediately after completion.</li>
                <li>Help your assigned advisor prepare for your consultation with accurate, current information.</li>
                <li>Provide the structured starting point for your <strong className="text-gray-700">Assessment with Remediation Plan</strong>.</li>
              </ul>
              <p className="mt-1">It is not used for any other purpose.</p>
            </WhyCard>

            <WhyCard icon={FiUsers} title="Who has access">
              <p>
                Access is strictly limited to:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Your <strong className="text-gray-700">assigned Consltek advisor</strong>.</li>
                <li>Consltek staff <strong className="text-gray-700">directly supporting</strong> your engagement and report processing.</li>
              </ul>
              <p className="mt-1">
                No assessment data is shared with, sold to, or accessible by any party outside Consltek. Consltek personnel cannot access accounts they are not directly assigned to.
              </p>
            </WhyCard>
          </div>
        </div>

        {/* About Consltek */}
        <div className="w-full max-w-6xl mt-8 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left: brand mark */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
              <img src="/conslteklogo.png" alt="Consltek" className="h-10 object-contain" />
              <div className="flex flex-col gap-1.5">
                {[
                  "Infrastructure Advisory",
                  "Security Consulting",
                  "Technology Strategy",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2.5 py-0.5 rounded-full bg-[#15587B]/8 text-[#15587B] text-[10px] font-semibold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px self-stretch bg-gray-200" />

            {/* Right: description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#15587B] mb-3">About Consltek</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Consltek is a professional IT consulting firm specialising in infrastructure assessment, security advisory, and technology strategy for mid-market organisations. Our work is grounded in structured discovery — we assess what exists before recommending what should change.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                The IT Blueprint platform was built to accelerate that discovery process. Rather than spending the first phase of an engagement manually gathering information, advisors can begin consultation with an accurate, current-state inventory already in hand.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The assessment is provided at no cost. The consulting engagement — where real analysis and planning occur — follows after your advisor reviews the Current State Report.
              </p>
            </div>
          </div>
        </div>

        {/* Trust & Data Security Section */}
        <div className="w-full max-w-6xl mt-16 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm overflow-hidden">
          {/* Header bar */}
          <div className="bg-[#15587B] px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <FiShield size={18} className="text-white/80" />
              <h2 className="text-base font-bold text-white tracking-wide">Enterprise Data Security Standards</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              SOC 2-Aligned Infrastructure
            </span>
          </div>
          {/* Cards grid */}
          <div className="p-8">
            <p className="text-sm text-gray-500 mb-6 max-w-2xl">
              This platform is operated by Consltek exclusively for active client engagements. All submitted IT environment data is treated as confidential and processed in accordance with the following security controls.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <SecurityCard
                icon={FiLock}
                title="TLS 1.2+ Encryption in Transit"
                desc="All data exchanged between your browser and our servers is protected by Transport Layer Security, preventing interception or tampering."
              />
              <SecurityCard
                icon={FiDatabase}
                title="SOC 2-Aligned Cloud Data Residency"
                desc="Assessment data is persisted in MongoDB Atlas, a SOC 2 Type II certified cloud database service with encryption at rest."
              />
              <SecurityCard
                icon={FiShield}
                title="Secure Session Management"
                desc="Sessions are maintained via short-lived JWT tokens stored in HTTP-only, Secure cookies — inaccessible to client-side scripts and protected against XSS."
              />
              <SecurityCard
                icon={FiUserCheck}
                title="Revocable Access Control"
                desc="Access to your assessment can be revoked at any time by authorized Consltek administrators, without requiring a password reset."
              />
              <SecurityCard
                icon={FiCheckCircle}
                title="Your Data Is Isolated to Your Organization"
                desc="Assessment data is strictly scoped to your account. No other customer or Consltek user can access your data at any layer of the system."
              />
              <SecurityCard
                icon={FiEyeOff}
                title="No Third-Party Data Disclosure"
                desc="Your IT environment data is not sold, rented, or shared with any third party. It is used solely to fulfil your Consltek consulting engagement."
              />
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="w-full max-w-6xl mt-8 border border-dashed border-[#34808A]/40 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[#15587B] mb-2">What happens after the assessment?</h2>
              <p className="text-sm text-gray-500 max-w-xl">
                Once your Current State Assessment is complete, a Consltek advisor reviews your report and schedules a consultation. From there, Consltek delivers the <strong className="text-gray-600">Assessment with Remediation Plan</strong> — a professional engagement covering gap analysis, risk assessment, and a prioritised remediation roadmap tailored to your organisation.
              </p>
            </div>
            <button
              onClick={() => handleNavigation("/blueprint-form")}
              className="flex-shrink-0 px-7 py-3 bg-[#935010] text-white font-bold rounded-full shadow-md hover:bg-[#7a4110] hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              Begin Assessment <FiArrowRight />
            </button>
          </div>
        </div>

      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes blobMove1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.1); }
        }
        @keyframes blobMove2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.1); }
        }
      `}</style>

      <Footer />
    </div>
  );
}
