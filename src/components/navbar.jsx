import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, LayoutDashboard, ChevronDown, Shield, Briefcase } from "lucide-react";
import logo from "../assets/chorebunny.png";
import { AuthModal } from "./auth-modal";
import { Tooltip } from "./ui/Tooltip.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export function Navbar() {
  // Use AuthContext for user, profile, role, loading, and logout
  const { user, profile, role, loading, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();


  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false);
      await logout(); // Calls supabase.auth.signOut() via AuthContext
      // Wait a bit for auth state to update
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Force reload to clear all state
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if logout fails
      navigate("/");
      window.location.reload();
    }
  };

  const linkClass = (path) => (location.pathname === path ? "active" : "");

  // Get user display info (from AuthContext profile)
  const userDisplayName = profile?.fullName || user?.name || user?.email?.split("@")[0] || "User";
  const firstName = userDisplayName.split(" ")[0];
  const userAvatar = profile?.profilePicUrl || user?.profilePicUrl;

  // Role-based access checks (normalized to uppercase)
  const isAdmin = role === "ADMIN";
  const isWorker = role === "WORKER";
  const isCustomer = role === "CUSTOMER" || !role; // Default to customer if no role

  return (
  <header className="nav nav-visible">
      <div className="nav-container">
        {/* LEFT SECTION */}
        <div className="nav-left">
          <div className="brand" onClick={() => navigate("/")}>
            <img src={logo} alt="ChorEscape" className="brand-logo" />
            <span className="brand-title">ChorEscape</span>
          </div>
        </div>

        {/* CENTER SECTION – desktop */}
        <nav className="nav-center">
          <Link className={linkClass("/")} to="/">
            Home
          </Link>
          <Link className={linkClass("/services")} to="/services">
            Services
          </Link>
          <Link className={linkClass("/pricing-booking")} to="/pricing-booking">
            Book
          </Link>
          <Link className={linkClass("/about")} to="/about">
            About
          </Link>
          <Link className={linkClass("/contact")} to="/contact">
            Contact
          </Link>
        </nav>

      {/* RIGHT SECTION */}
      <div className="nav-right">
        {/* User Menu Dropdown */}
        {user && (
          <div className="nav-user-menu-wrapper" ref={userMenuRef}>
            <button
              className="nav-user-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
            >
              {userAvatar ? (
                <img src={userAvatar} alt={firstName} className="nav-user-avatar" />
              ) : (
                <div className="nav-user-avatar-placeholder">
                  <User size={18} />
                </div>
              )}
              <ChevronDown
                size={14}
                className="nav-user-chevron"
                style={{
                  transition: "transform 0.2s",
                  transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  opacity: 0.7,
                }}
              />
            </button>
            
            {userMenuOpen && (
              <div className="nav-user-menu">
                <div className="nav-user-menu-header">
                  <div className="nav-user-menu-avatar">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userDisplayName} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                    <div>
                    <div className="nav-user-menu-name">{userDisplayName}</div>
                    <div className="nav-user-menu-email">{profile?.email || user?.email}</div>
                    {role && (
                      <span className={`role-badge role-badge-${role.toLowerCase()}`}>
                        {role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="nav-user-menu-divider" />
                <button
                  className="nav-user-menu-item"
                  onClick={() => {
                    navigate("/dashboard");
                    setUserMenuOpen(false);
                  }}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </button>
                {/* Admin Dashboard Link - Only visible to admins */}
                {isAdmin && (
                  <button
                    className="nav-user-menu-item"
                    onClick={() => {
                      navigate("/admin");
                      setUserMenuOpen(false);
                    }}
                  >
                    <Shield size={18} />
                    <span>Admin Dashboard</span>
                  </button>
                )}
                {/* Worker Dashboard Link - Only visible to workers (future) */}
                {isWorker && (
                  <button
                    className="nav-user-menu-item"
                    onClick={() => {
                      navigate("/worker");
                      setUserMenuOpen(false);
                    }}
                  >
                    <Briefcase size={18} />
                    <span>Worker Dashboard</span>
                  </button>
                )}
                <div className="nav-user-menu-divider" />
                <button
                  className="nav-user-menu-item"
                  onClick={() => {
                    handleLogout();
                    setUserMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !user && (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="btn btn-primary nav-pill nav-pill-desktop"
          >
            Log in
          </button>
        )}
        
        {loading && (
          <div className="nav-loading">Loading...</div>
        )}
      </div>

      </div>
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
