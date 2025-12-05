import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiLogOut, FiUser, FiLogIn } from "react-icons/fi";

function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);

    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <a
            href="https://consltek.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="./conslteklogo.png"
              alt="Consltek Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>

          {/* User / Auth Section */}
          <div className="flex items-center gap-4">
            {username ? (
              <>
                {/* User Badge */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 border border-blue-100 rounded-full">
                  <div className="w-6 h-6 bg-[#15587B] rounded-full flex items-center justify-center text-white text-xs">
                    <FiUser />
                  </div>
                  <span className="text-sm font-semibold text-[#15587B] truncate max-w-[150px]">
                    {username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Logout"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-5 py-2 bg-[#935010] text-white text-sm font-bold rounded-full shadow-md hover:bg-[#7a3d0d] hover:shadow-lg transition-all duration-300"
              >
                Login <FiLogIn size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;