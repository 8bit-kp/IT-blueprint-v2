import { FiArrowRight, FiFileText, FiShield, FiCpu, FiLayers } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

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

const Home = () => {
  const navigate = useNavigate();

  // Helper for auth checks
  const handleNavigation = (path) => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (username && token) {
      navigate(path);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col font-sans">
      
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
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">IT Infrastructure Planning</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#15587B] mb-6 tracking-tight leading-[1.1]">
            Build Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34808A] to-[#15587B]">IT Blueprint</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Consolidate your details, strategies, and security processes into one comprehensive document. Plan smarter, stay organized, and move faster.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleNavigation("/blueprint-form")}
              className="group min-w-[200px] px-8 py-4 bg-[#15587B] text-white font-bold rounded-full shadow-xl shadow-blue-900/10 hover:bg-[#0f4460] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Blueprint <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleNavigation("/blueprint-summary")}
              className="group min-w-[200px] px-8 py-4 bg-white text-[#15587B] border border-gray-200 font-bold rounded-full shadow-sm hover:border-[#15587B]/30 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiFileText className="text-gray-400 group-hover:text-[#15587B] transition-colors" /> View Summary
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid (Fills screen space effectively) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-auto">
          <FeatureCard 
            icon={FiLayers} 
            title="Infrastructure" 
            desc="Document your Network, Servers, and Facility setup in a single, structured format." 
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
};

export default Home;