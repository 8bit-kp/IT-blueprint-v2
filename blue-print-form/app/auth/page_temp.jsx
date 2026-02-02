import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowLeft } from "react-icons/fi";

// Reusable InputField component
const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <Icon size={18} />
    </div>
    <input
      {...props}
      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#34808A] focus:border-[#34808A] block transition-all placeholder-gray-400 ${props.className || ""}`}
    />
  </div>
);

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    password: "",
  });

  // ✅ Single change handler (works reliably for all fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/${endpoint}`,
        payload
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
      }

      toast.success(
        isLogin ? "Login successful!" : "Registration successful! Please login."
      );

      if (!isLogin) setIsLogin(true);
      else navigate("/");
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center items-center p-4 relative font-sans">
      <Toaster position="top-center" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#15587B] transition font-medium text-sm"
      >
        <FiArrowLeft /> Back to Home
      </button>

      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="flex justify-center mb-8">
          <img src="./conslteklogo.png" alt="Consltek" className="h-12 object-contain" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#15587B] to-[#34808A]" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#15587B]">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin
                ? "Enter your credentials to access your dashboard."
                : "Create your account to start building blueprints."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </label>
              <InputField
                icon={FiUser}
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Extra Fields for Registration */}
            {!isLogin && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email Address
                  </label>
                  <InputField
                    icon={FiMail}
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </label>
                  <InputField
                    icon={FiBriefcase}
                    type="text"
                    name="companyName"
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <InputField
                icon={FiLock}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg text-white font-bold text-sm tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#15587B] hover:bg-[#0f4460] hover:shadow-lg"
              }`}
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin((prev) => !prev);
                  setFormData({
                    username: "",
                    email: "",
                    companyName: "",
                    password: "",
                  });
                }}
                className="text-[#34808A] font-bold hover:text-[#2b6f6f] hover:underline transition ml-1"
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Consltek. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Auth;
