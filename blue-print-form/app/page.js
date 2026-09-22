"use client";

import { FiArrowRight, FiFileText, FiShield, FiCpu, FiLayers, FiLock, FiDatabase, FiCheckCircle, FiUserCheck, FiEyeOff, FiUsers, FiHelpCircle, FiBarChart2, FiCheck, FiX } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { NuiReveal } from "@/components/ui/new";

// ── Hero product-preview mockup ─────────────────────────────────────────────
// A purely decorative, illustrative preview of the Current State Report —
// generic company name, static sample values, clearly not live data. Built
// locally to this page (no dependency on lib/report/ or any real score
// logic) so it can never drift out of sync with, or be mistaken for, an
// actual assessment result.

const MOCK_SCORE = 82;
const MOCK_ROWS = [
  { label: "Multi-Factor Authentication", ok: true },
  { label: "Endpoint Detection & Response", ok: true },
  { label: "Data Loss Prevention", ok: false },
  { label: "Backup & Recovery Tested", ok: true },
];

const ScoreRing = ({ value, size = 92 }) => {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--nui-line)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--nui-ok)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  );
};

const MockRow = ({ label, ok }) => (
  <div className="flex items-center gap-2 py-1.5 border-b border-[var(--nui-line-soft)] last:border-0">
    <span
      className={[
        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full",
        ok ? "bg-[var(--nui-ok-bg)] text-[var(--nui-ok)]" : "bg-[var(--nui-risk-bg)] text-[var(--nui-risk)]",
      ].join(" ")}
    >
      {ok ? <FiCheck size={10} strokeWidth={3} /> : <FiX size={10} strokeWidth={3} />}
    </span>
    <span className="truncate text-[11px] font-medium text-[var(--nui-text-2)]">{label}</span>
  </div>
);

const ReportPreviewCard = () => (
  // `lg:ml-auto` (not `lg:mx-0`) is required, not cosmetic: this card's own
  // max-width is narrower than the grid column it sits in, and a plain
  // `mx-0` left-aligns it — flush on the left, but leaving a growing dead
  // gap on the right that the text column (which naturally fills its own
  // column edge-to-edge) doesn't have, so the page's left and right padding
  // stop matching. `ml-auto` instead pushes the card to the column's right
  // edge, which lines it up with the same right inset every other section
  // on the page (and the navbar) already uses.
  <div className="relative mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0">
    {/* Second card peeking out behind, for depth */}
    <div
      aria-hidden="true"
      className="absolute inset-x-6 -bottom-4 top-4 -z-10 rotate-[4deg] rounded-[var(--nui-r-lg)] border border-[var(--nui-line)] bg-[var(--nui-surface)] opacity-60 shadow-[var(--nui-shadow-1)]"
    />
    <div className="overflow-hidden rounded-[var(--nui-r-lg)] border border-[var(--nui-line)] bg-[var(--nui-surface)] shadow-[var(--nui-shadow-3)] -rotate-[1.5deg] transition-transform duration-500 hover:rotate-0">
      <div className="bg-[var(--nui-brand)] px-5 py-4">
        <p className="nui-eyebrow text-[9px] font-bold text-[color:var(--nui-text-invert-2)]">Sample · Current State Report</p>
        <p className="mt-1 text-sm font-bold text-white">Acme Manufacturing Co.</p>
      </div>
      <div className="flex items-center gap-4 px-5 pt-5">
        <div className="relative flex-shrink-0">
          <ScoreRing value={MOCK_SCORE} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="nui-num text-lg font-extrabold leading-none text-[var(--nui-text)]">{MOCK_SCORE}</span>
            <span className="text-[8px] font-semibold text-[var(--nui-text-3)]">/ 100</span>
          </div>
        </div>
        <div>
          <p className="nui-eyebrow text-[9px] font-bold text-[var(--nui-text-3)]">Security Score</p>
          <p className="text-sm font-bold text-[var(--nui-ok)]">Managed</p>
          <p className="mt-0.5 text-[10px] text-[var(--nui-text-3)]">12 weighted categories</p>
        </div>
      </div>
      <div className="px-5 pb-5 pt-4">
        {MOCK_ROWS.map((r) => <MockRow key={r.label} {...r} />)}
      </div>
    </div>
  </div>
);

// Compact Feature Card Component
const FeatureCard = ({ index, icon: Icon, title, desc }) => (
  <div className="group relative overflow-hidden rounded-[var(--nui-r)] border border-[var(--nui-line)] bg-[var(--nui-surface)] p-6 shadow-[var(--nui-shadow-1)] transition-all duration-[var(--nui-dur)] hover:-translate-y-0.5 hover:border-[color:var(--nui-accent-tint-2)] hover:shadow-[var(--nui-shadow-2)]">
    <span aria-hidden="true" className="nui-num absolute right-5 top-4 text-3xl font-extrabold text-[var(--nui-line)] transition-colors duration-[var(--nui-dur)] group-hover:text-[var(--nui-accent-tint)]">
      {index}
    </span>
    <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--nui-r-sm)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)] transition-transform duration-[var(--nui-dur)] group-hover:scale-110">
      <Icon size={20} />
    </div>
    <h3 className="relative mb-2 text-lg font-bold text-[var(--nui-brand)]">{title}</h3>
    <p className="relative text-sm leading-relaxed text-[var(--nui-text-2)]">{desc}</p>
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

// A single real fact chip in the hero's stat strip — every number here is a
// structural fact about the product (step count, category count, report
// count), never a metric or claim about outcomes.
const FactChip = ({ value, label }) => (
  <div className="flex items-baseline gap-1.5">
    <span className="nui-num text-lg font-extrabold text-[var(--nui-brand)]">{value}</span>
    <span className="text-xs text-[var(--nui-text-3)]">{label}</span>
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
          every authenticated page (styles/new-ui/tokens.css). */}
      <div aria-hidden="true" className="nui-bg pointer-events-none fixed inset-0 -z-10" />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Hero Content */}
      <main className="flex-grow relative z-10">

        {/* ── Hero: asymmetric two-column composition ─────────────────────── */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-20">

          {/* Left: copy */}
          <NuiReveal as="div" className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-[var(--nui-r-pill)] bg-[var(--nui-surface)] border border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--nui-accent)] animate-pulse"></span>
              <span className="nui-eyebrow text-xs font-bold text-[var(--nui-text-2)]">IT Infrastructure Assessment</span>
            </div>

            <h1 className="nui-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-[var(--nui-brand)] mb-6 tracking-tight leading-[1.08]">
              Document Your{" "}
              <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--nui-accent),var(--nui-brand))]">
                IT Landscape
              </span>
            </h1>

            <p className="text-lg text-[var(--nui-text-3)] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Consltek helps IT consultants and their clients capture a complete picture of their current infrastructure, security controls, and application portfolio, in one structured, shareable document.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
              <button
                onClick={() => handleNavigation("/blueprint-form")}
                className="group whitespace-nowrap px-7 py-4 bg-[var(--nui-brand)] text-white font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-2)] hover:bg-[var(--nui-brand-hover)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Assessment <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleNavigation("/blueprint-summary")}
                className="group whitespace-nowrap px-7 py-4 bg-[var(--nui-surface)] text-[var(--nui-brand)] border border-[var(--nui-line)] font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-1)] hover:border-[color:var(--nui-accent-tint-2)] hover:bg-[var(--nui-surface-sunk)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiFileText className="text-[var(--nui-text-3)] group-hover:text-[var(--nui-brand)] transition-colors" /> View Summary
              </button>

              <button
                onClick={() => handleNavigation("/all-blueprints")}
                className="group whitespace-nowrap px-7 py-4 bg-[linear-gradient(90deg,var(--nui-accent),var(--nui-brand))] text-white font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-2)] hover:shadow-[var(--nui-shadow-3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiLayers className="group-hover:rotate-12 transition-transform" /> All Reports
              </button>
            </div>

            {/* Real-fact strip — structural facts about the product, not metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 border-t border-[var(--nui-line-soft)] pt-6">
              <FactChip value="7" label="assessment steps" />
              <span aria-hidden="true" className="hidden h-4 w-px bg-[var(--nui-line)] sm:block" />
              <FactChip value="12" label="security categories" />
              <span aria-hidden="true" className="hidden h-4 w-px bg-[var(--nui-line)] sm:block" />
              <FactChip value="5" label="report types" />
            </div>
          </NuiReveal>

          {/* Right: product-preview mockup */}
          <NuiReveal as="div" delay={90} className="pt-4 lg:pt-0">
            <ReportPreviewCard />
          </NuiReveal>
        </div>

        <div className="mx-auto w-full max-w-7xl px-6">
          {/* Feature Highlights Grid */}
          <NuiReveal as="div" delay={60} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            <FeatureCard
              index="01"
              icon={FiLayers}
              title="Infrastructure"
              desc="Document your network, servers, and facility setup in a single, structured format."
            />
            <FeatureCard
              index="02"
              icon={FiShield}
              title="Security Controls"
              desc="Track compliance, administrative policies, and technical security measures effortlessly."
            />
            <FeatureCard
              index="03"
              icon={FiCpu}
              title="Application Portfolio"
              desc="Keep a precise inventory of critical applications, vendors, and business priorities."
            />
          </NuiReveal>

          {/* Why We Collect This Information */}
          <NuiReveal as="div" delay={90} className="w-full max-w-6xl mx-auto mt-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--nui-r-pill)] bg-[var(--nui-accent-tint)] text-[var(--nui-accent)] text-xs font-bold uppercase tracking-wider mb-3">
                Transparency
              </div>
              <h2 className="text-2xl font-bold text-[var(--nui-brand)] mb-2">Why we ask these questions</h2>
              <p className="text-sm text-[var(--nui-text-3)] max-w-xl mx-auto">
                Before requesting IT environment information, we want to be clear about why it&rsquo;s needed, how it will be used, and who will have access to it.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <WhyCard icon={FiHelpCircle} title="Why this information is requested">
                <p>
                  Consltek advisors need an accurate picture of your current IT environment before they can offer meaningful guidance.
                </p>
                <p>
                  Without structured discovery, consulting engagements spend multiple sessions collecting information that could be documented in advance, adding time and cost before any analysis begins.
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
          <NuiReveal as="div" className="w-full max-w-6xl mx-auto mt-10 bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r)] shadow-[var(--nui-shadow-1)] p-8">
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
                  Consltek is a professional IT consulting firm specialising in infrastructure assessment, security advisory, and technology strategy for mid-market organisations. Our work is grounded in structured discovery: we assess what exists before recommending what should change.
                </p>
                <p className="text-sm text-[var(--nui-text-2)] leading-relaxed mb-3">
                  The IT Blueprint platform was built to accelerate that discovery process. Rather than spending the first phase of an engagement manually gathering information, advisors can begin consultation with an accurate, current-state inventory already in hand.
                </p>
                <p className="text-sm text-[var(--nui-text-2)] leading-relaxed">
                  The assessment is provided at no cost. The consulting engagement, where real analysis and planning occur, follows after your advisor reviews the Current State Report.
                </p>
              </div>
            </div>
          </NuiReveal>

          {/* Trust & Data Security Section */}
          <NuiReveal as="div" delay={60} className="w-full max-w-6xl mx-auto mt-20 bg-[var(--nui-surface)] border border-[var(--nui-line)] rounded-[var(--nui-r)] shadow-[var(--nui-shadow-1)] overflow-hidden">
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
                  desc="Sessions are maintained via short-lived JWT tokens stored in HTTP-only, Secure cookies, inaccessible to client-side scripts and protected against XSS."
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
          <NuiReveal as="div" delay={90} className="w-full max-w-6xl mx-auto mt-10 mb-16 border border-dashed border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r)] p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--nui-brand)] mb-2">What happens after the assessment?</h2>
                <p className="text-sm text-[var(--nui-text-3)] max-w-xl">
                  Once your Current State Assessment is complete, a Consltek advisor reviews your report and schedules a consultation. From there, Consltek delivers the <strong className="text-[var(--nui-text-2)]">Assessment with Remediation Plan</strong>, a professional engagement covering gap analysis, risk assessment, and a prioritised remediation roadmap tailored to your organisation.
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
        </div>

      </main>

      <Footer />
    </div>
  );
}
