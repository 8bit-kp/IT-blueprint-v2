import { FiArrowRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
// import WaveFooter from "../components/WaveFooter";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2ecf0] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#34808A] opacity-20 rounded-full blur-3xl animate-[blobMove1_12s_infinite]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#935010] opacity-20 rounded-full blur-3xl animate-[blobMove2_14s_infinite]" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] px-6 pt-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#15587B] mb-4 leading-tight tracking-tight">
          Build Your{" "}
          <span className="text-[#34808A] drop-shadow-md">IT Blueprint</span>
        </h1>

        <p className="text-gray-700 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed mb-8">
          We bring together{" "}
          <span className="font-semibold text-[#935010]">
            your details, strategies, and processes
          </span>{" "}
          into one comprehensive{" "}
          <span className="font-semibold text-[#34808A]">IT Blueprint</span>.
          <br />
          Plan smarter, stay{" "}
          <span className="text-[#34808A] font-semibold">organized</span>, and
          move <span className="text-[#34808A] font-semibold">faster</span> with
          clarity.
        </p>

        <button
          onClick={() => {
            const username = localStorage.getItem("username");
            const token = localStorage.getItem("token");

            if (username && token) {
              navigate("/blueprint-form");
            } else {
              navigate("/auth");
            }
          }}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-[#935010] to-[#15587B] text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2"
        >
          Fill the Detailes <FiArrowRight size={18} />
        </button>
      </section>

      <style>{`
        @keyframes blobMove1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.1); }
        }
        @keyframes blobMove2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-60px, 40px) scale(1.1); }
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default Home;