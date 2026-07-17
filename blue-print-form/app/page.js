"use client";

import { FiArrowRight, FiFileText, FiShield, FiCpu, FiLayers, FiLock, FiDatabase, FiCheckCircle } from "react-icons/fi";
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

// Trust signal pill
const TrustPill = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 bg-white/70 border border-gray-200 rounded-full px-4 py-2 shadow-sm text-sm text-gray-600">
    <Icon size={14} className="text-[#34808A] flex-shrink-0" />
    <span>{label}</span>
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

        {/* Trust & Data Security Section */}
        <div className="w-full max-w-6xl mt-16 bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#15587B] mb-2">Your data is handled with care</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Consltek is an IT consulting firm. This tool is provided to clients and consultants to document IT environments as part of an engagement. Your information is not sold or shared with third parties.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <TrustPill icon={FiLock} label="Encrypted in transit (HTTPS)" />
            <TrustPill icon={FiDatabase} label="Stored in MongoDB Atlas (cloud)" />
            <TrustPill icon={FiShield} label="Session secured with HTTP-only cookies" />
            <TrustPill icon={FiCheckCircle} label="Access-controlled per account" />
            <TrustPill icon={FiCheckCircle} label="Not shared with third parties" />
          </div>
        </div>

        {/* What Happens Next */}
        <div className="w-full max-w-6xl mt-8 border border-dashed border-[#34808A]/40 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[#15587B] mb-2">What happens after the assessment?</h2>
              <p className="text-sm text-gray-500 max-w-xl">
                Once your current-state documentation is complete, a Consltek consultant will review it with you to identify gaps, security risks, and opportunities for improvement — leading to a roadmap tailored to your organisation.
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
