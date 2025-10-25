import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

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

      if (!isLogin) setIsLogin(true); // Switch to login after register
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e2ecf0] relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#34808A] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-[#935010] opacity-20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#15587B] mb-6 text-center">
            {isLogin ? "Login to" : "Register for"}{" "}
            <span className="text-[#34808A]">Dashboard</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34808A]"
              />
            </div>

            {/* Email (only for Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34808A]"
                />
              </div>
            )}

            {/* Company (only for Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34808A]"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34808A]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-3 flex items-center justify-center font-semibold rounded-lg shadow transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#34808A] to-[#15587B] text-white hover:scale-105 hover:from-[#15587B] hover:to-[#34808A]"
              }`}
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* Toggle between Login/Register */}
          <p className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#34808A] font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
