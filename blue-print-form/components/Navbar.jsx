"use client";

import Link from "next/link";
import { useState } from "react";
import { notify } from "@/lib/notify";
import { FiLogOut, FiUser, FiLogIn } from "react-icons/fi";
import { authAPI } from "@/utils/api";
import { useLocalStorageValue } from "@/lib/hooks/useLocalStorageValue";

/**
 * Navbar — top navigation for PUBLIC pages only (/, /privacy-policy,
 * /terms-of-service). Restyled to the shared design system
 * (styles/new-ui/tokens.css) — carries its own `.nui` scope since it is
 * never nested inside AppShell (which provides that scope on authenticated
 * pages). Same props/behavior as before.
 */
function Navbar() {
  // Username is stored in localStorage only for display purposes.
  // The actual authentication token lives in an HTTP-only cookie.
  const username = useLocalStorageValue("username");
  // Local override for the brief window between clicking Logout and the
  // hard navigation below — useLocalStorageValue won't reflect a same-tab
  // localStorage.removeItem() on its own (it has no subscription source),
  // so this gives instant visual feedback without needing setState-in-effect.
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = async () => {
    try {
      // Ask the server to expire the auth_token HTTP-only cookie.
      await authAPI.logout();
    } catch {
      // If the server call fails the cookie may already be expired or missing.
      // Proceed with client-side cleanup regardless.
    }

    // Clear the display username and account fields from localStorage.
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userCompanyName");
    localStorage.removeItem("userCreatedAt");
    setLoggedOut(true);

    notify.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (

    <nav className="nui fixed top-0 left-0 right-0 z-50 bg-[var(--nui-surface)]/90 backdrop-blur-md border-b border-[var(--nui-line)] shadow-[var(--nui-shadow-1)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo Section */}
        <a
          href="https://consltek.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/conslteklogo.png"
            alt="Consltek Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </a>

        {/* User / Auth Section */}
        <div className="flex items-center gap-4">
          {username && !loggedOut ? (
            <>
              {/* User Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-[var(--nui-accent-tint)] border border-[color:var(--nui-accent-tint-2)] rounded-[var(--nui-r-pill)]">
                <div className="w-6 h-6 bg-[var(--nui-brand)] rounded-full flex items-center justify-center text-white text-xs">
                  <FiUser />
                </div>
                <span className="text-sm font-semibold text-[var(--nui-brand)] truncate max-w-[150px]">
                  {username}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--nui-text-2)] hover:text-[var(--nui-risk)] hover:bg-[var(--nui-risk-bg)] rounded-[var(--nui-r-pill)] transition-all duration-200"
                title="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <FiLogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-5 py-2 bg-[var(--nui-warm)] text-white text-sm font-bold rounded-[var(--nui-r-pill)] shadow-[var(--nui-shadow-1)] hover:brightness-90 hover:shadow-[var(--nui-shadow-2)] transition-all duration-300"
            >
              Login <FiLogIn size={16} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
