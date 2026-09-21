"use client";

import { FiArrowRight, FiFileText, FiShield, FiCpu, FiLayers, FiLock, FiDatabase, FiCheckCircle, FiUserCheck, FiEyeOff, FiUsers, FiHelpCircle, FiBarChart2 } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { NuiReveal } from "@/components/ui/new";

// Compact Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-[var(--nui-surface)] p-6 rounded-[var(--nui-r)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] hover:shadow-[var(--nui-shadow-2)] hover:border-[color:var(--nui-accent-tint-2)] transition-all duration-[var(--nui-dur)] group">
    <div className="w-10 h-10 bg-[var(--nui-accent-tint)] rounded-[var(--nui-r-sm)] flex items-center justify-center mb-4 text-[var(--nui-accent)] group-hover:scale-110 transition-transform duration-[var(--nui-dur)]">
      <Icon size={20} />
    </div>
    <h3 className="text-lg font-bold text-[var(--nui-brand)] mb-2">{title}</h3>
    <p className="text-sm text-[var(--nui-text-2)] leading-relaxed">{desc}</p>
  </div>
);

// Security control card
const SecurityCard = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3 bg-[var(--nui-accent-tint)] border border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r-sm)] p-4">
    <div className="w-8 h-8 bg-[var(--nui-surface)] rounded-[var(--nui-r-xs)] flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={15} className="text-[var(--nui-brand)]" />
    </div>
    <div>
      <p className="text-xs font-bold text-[var(--nui-brand)] uppercase tracking-wide mb-0.5">{title}</p>
      <p className="text-xs text-[var(--nui-text-3)] leading-relaxed">{desc}</p>
    </div>
  </div>
);

// Why-we-collect card
const WhyCard = ({ icon: Icon, title, children }) => (
  <div className="bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r-sm)] p-6 flex flex-col gap-3">
    <div className="w-9 h-9 bg-[var(--nui-accent-tint)] rounded-[var(--nui-r-sm)] flex items-center justify-center flex-shrink-0">
      <Icon size={18} className="text-[var(--nui-accent)]" />
    </div>
    <h3 className="text-sm font-bold text-[var(--nui-brand)]">{title}</h3>
    <div className="text-sm text-[var(--nui-text-3)] leading-relaxed space-y-1">{children}</div>
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
    <div className="nui min-h-screen relative flex flex-col pt-7 font-sans">

      {/* Ambient canvas — same brand bloom + faded blueprint grid used across
          every authenticated page (styles/new-ui/tokens.css), replacing the
          previous large pulsing/moving blur blobs with the calmer, consistent
          treatment. */}
      <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0 -z-10" />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Hero Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-6 py-12 lg:py-20 max-w-7xl mx-auto w-full relative z-10">

        {/* Text Section */}
        <NuiReveal as="div" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-[var(--nui-r-pill)] bg-[var(--nui-surface)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--nui-accent)] animate-pulse"></span>
            <span className="nui-eyebrow text-xs font-bold text-[var(--nui-text-2)]">IT Infrastructure Assessment</span>
          </div>

          <h1 className="nui-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--nui-brand)] mb-6 tracking-tight leading-[1.1]">
            Document Your <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--nui-accent),var(--nui-brand))]">IT Landscape</span>
          </h1>

          <p className="text-lg text-[var(--nui-text-3)] max-w-2xl mx-auto leading-relaxed mb-10">
            Consltek helps IT consultants and their clients capture a complete picture of their current infrastructure, security controls, and application portfolio — in one structured, shareable document.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleNavigation("/blueprint-form")}
              className="group min-w-[200px] px-8 py-4 bg-[var(--nui-brand)] text-white font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-2)] hover:bg-[var(--nui-brand-hover)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Assessment <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigation("/blueprint-summary")}
              className="group min-w-[200px] px-8 py-4 bg-[var(--nui-surface)] text-[var(--nui-brand)] border border-[var(--nui-line)] font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-1)] hover:border-[color:var(--nui-accent-tint-2)] hover:bg-[var(--nui-surface-sunk)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiFileText className="text-[var(--nui-text-3)] group-hover:text-[var(--nui-brand)] transition-colors" /> View Summary
            </button>

            <button
              onClick={() => handleNavigation("/all-blueprints")}
              className="group min-w-[200px] px-8 py-4 bg-[linear-gradient(90deg,var(--nui-accent),var(--nui-brand))] text-white font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-2)] hover:shadow-[var(--nui-shadow-3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiLayers className="group-hover:rotate-12 transition-transform" /> All Reports
            </button>
          </div>
        </NuiReveal>

        {/* Feature Highlights Grid */}
        <NuiReveal as="div" delay={60} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
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
        </NuiReveal>

        {/* Why We Collect This Information */}
        <NuiReveal as="div" delay={90} className="w-full max-w-6xl mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--nui-r-pill)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)] text-xs font-bold uppercase tracking-wider mb-3">
              Transparency
            </div>
            <h2 className="text-2xl font-bold text-[var(--nui-brand)] mb-2">Why we ask these questions</h2>
            <p className="text-sm text-[var(--nui-text-3)] max-w-xl mx-auto">
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
                <li>Generate your <strong className="text-[var(--nui-text-2)]">Current State Report</strong> immediately after completion.</li>
                <li>Help your assigned advisor prepare for your consultation with accurate, current information.</li>
                <li>Provide the structured starting point for your <strong className="text-[var(--nui-text-2)]">Assessment with Remediation Plan</strong>.</li>
              </ul>
              <p className="mt-1">It is not used for any other purpose.</p>
            </WhyCard>

            <WhyCard icon={FiUsers} title="Who has access">
              <p>
                Access is strictly limited to:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Your <strong className="text-[var(--nui-text-2)]">assigned Consltek advisor</strong>.</li>
                <li>Consltek staff <strong className="text-[var(--nui-text-2)]">directly supporting</strong> your engagement and report processing.</li>
              </ul>
              <p className="mt-1">
                No assessment data is shared with, sold to, or accessible by any party outside Consltek. Consltek personnel cannot access accounts they are not directly assigned to.
              </p>
            </WhyCard>
          </div>
        </NuiReveal>

        {/* About Consltek */}
        <NuiReveal as="div" className="w-full max-w-6xl mt-8 bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r)] shadow-[var(--nui-shadow-1)] p-8">
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
                    className="inline-block px-2.5 py-0.5 rounded-[var(--nui-r-pill)] bg-[var(--nui-accent-tint)] text-[var(--nui-brand)] text-[10px] font-semibold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px self-stretch bg-[var(--nui-line)]" />

            {/* Right: description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[var(--nui-brand)] mb-3">About Consltek</h2>
              <p className="text-sm text-[var(--nui-text-2)] leading-relaxed mb-3">
                Consltek is a professional IT consulting firm specialising in infrastructure assessment, security advisory, and technology strategy for mid-market organisations. Our work is grounded in structured discovery — we assess what exists before recommending what should change.
              </p>
              <p className="text-sm text-[var(--nui-text-2)] leading-relaxed mb-3">
                The IT Blueprint platform was built to accelerate that discovery process. Rather than spending the first phase of an engagement manually gathering information, advisors can begin consultation with an accurate, current-state inventory already in hand.
              </p>
              <p className="text-sm text-[var(--nui-text-2)] leading-relaxed">
                The assessment is provided at no cost. The consulting engagement — where real analysis and planning occur — follows after your advisor reviews the Current State Report.
              </p>
            </div>
          </div>
        </NuiReveal>

        {/* Trust & Data Security Section */}
        <NuiReveal as="div" delay={60} className="w-full max-w-6xl mt-16 bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r)] shadow-[var(--nui-shadow-1)] overflow-hidden">
          {/* Header bar */}
          <div className="bg-[var(--nui-brand)] px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <FiShield size={18} className="text-white/80" />
              <h2 className="text-base font-bold text-white tracking-wide">Enterprise Data Security Standards</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1 rounded-[var(--nui-r-pill)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--nui-ok)] animate-pulse" />
              SOC 2-Aligned Infrastructure
            </span>
          </div>
          {/* Cards grid */}
          <div className="p-8">
            <p className="text-sm text-[var(--nui-text-3)] mb-6 max-w-2xl">
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
        </NuiReveal>

        {/* What Happens Next */}
        <NuiReveal as="div" delay={90} className="w-full max-w-6xl mt-8 border border-dashed border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r)] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--nui-brand)] mb-2">What happens after the assessment?</h2>
              <p className="text-sm text-[var(--nui-text-3)] max-w-xl">
                Once your Current State Assessment is complete, a Consltek advisor reviews your report and schedules a consultation. From there, Consltek delivers the <strong className="text-[var(--nui-text-2)]">Assessment with Remediation Plan</strong> — a professional engagement covering gap analysis, risk assessment, and a prioritised remediation roadmap tailored to your organisation.
              </p>
            </div>
            <button
              onClick={() => handleNavigation("/blueprint-form")}
              className="flex-shrink-0 px-7 py-3 bg-[var(--nui-warm)] text-white font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-2)] hover:brightness-90 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              Begin Assessment <FiArrowRight />
            </button>
          </div>
        </NuiReveal>

      </main>

      <Footer />
    </div>
  );
}
