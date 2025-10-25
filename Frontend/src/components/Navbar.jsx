import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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

    // redirect after a small delay so user sees the toast
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <a
          href="https://consltek.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          <img
            src="./conslteklogo.png"
            alt="Consltek Logo"
            className="h-10 w-auto"
          />
        </a>

        {username ? (
          <div className="flex items-center space-x-4">
            <span className="text-[#15587B] font-semibold">Hi, {username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#935010] text-white rounded hover:bg-[#15587B] transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 bg-[#935010] text-white rounded hover:bg-[#15587B] transition"
          >
            Login
          </Link>
        )}
      </nav>
    </>
  );
}

export default Navbar;
