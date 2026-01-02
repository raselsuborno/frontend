import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, ShoppingBag, User, LogOut, LayoutDashboard, ChevronDown, Shield, Briefcase } from "lucide-react";
import logo from "../assets/chorebunny.png";
import { AuthModal } from "./auth-modal";
import { Tooltip } from "./ui/Tooltip.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";


document.body.classList.add("dark-theme");

export function Navbar() {
  // Use AuthContext for user, profile, role, loading, and logout
  const { user, profile, role, loading, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Load cart on route change
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);

    // close mobile menu on navigation
    setMobileOpen(false);
  }, [location.pathname]);

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

  // Dark mode toggle
  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark-theme") : root.classList.remove("dark-theme");
  }, [dark]);

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
    <header className="nav">
      {/* LEFT SECTION */}
      <div className="nav-left">
        <div className="brand" onClick={() => navigate("/")}>
          <img src={logo} alt="ChorEscape Logo" className="brand-logo" />
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
        <Link className={linkClass("/shop")} to="/shop">
          Shop
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
            >
              {userAvatar ? (
                <img src={userAvatar} alt={firstName} className="nav-user-avatar" />
              ) : (
                <div className="nav-user-avatar-placeholder">
                  <User size={18} />
                </div>
              )}
              <span className="nav-user-name">{firstName}</span>
              <ChevronDown size={16} style={{ transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
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
                      <div style={{ 
                        display: "inline-block",
                        marginTop: "4px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        background: role === "ADMIN" ? "#dc2626" : role === "WORKER" ? "#059669" : "#3b82f6",
                        color: "white"
                      }}>
                        {role}
                      </div>
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

        {!user && (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="nav-pill nav-pill-desktop"
          >
            Log in
          </button>
        )}

        {/* Cart */}
        <Tooltip text={`${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`}>
          <div className="icon-btn cart-icon-wrapper">
            <Link to="/cart">
              <ShoppingBag size={20} style={{ color: "var(--primary)" }} />
            </Link>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </Tooltip>

        {/* Dark Mode */}
        <Tooltip text={dark ? "Switch to light mode" : "Switch to dark mode"}>
          <span className="icon-btn dark-toggle" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </span>
        </Tooltip>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`nav-mobile-toggle ${mobileOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <div className={`nav-mobile ${mobileOpen ? "nav-mobile-open" : ""}`}>
        <nav className="nav-mobile-links">
          <Link className={linkClass("/")} to="/">
            Home
          </Link>
          <Link className={linkClass("/services")} to="/services">
            Services
          </Link>
          <Link className={linkClass("/pricing-booking")} to="/pricing-booking">
            Book
          </Link>
          <Link className={linkClass("/shop")} to="/shop">
            Shop
          </Link>
          <Link className={linkClass("/about")} to="/about">
            About
          </Link>
          <Link className={linkClass("/contact")} to="/contact">
            Contact
          </Link>
        </nav>

        <div className="nav-mobile-actions">
          {user ? (
            <>
              <button
                type="button"
                className="btn nav-mobile-btn"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                className="btn outline nav-mobile-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn nav-mobile-btn"
              onClick={() => setAuthModalOpen(true)}
            >
              Log in / Sign up
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
