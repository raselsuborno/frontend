import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, ShoppingBag } from "lucide-react";
import logo from "../assets/chorebunny.png";
import { AuthModal } from "./auth-modal";


document.body.classList.add("dark-theme");

export function Navbar() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load user + cart on route change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);

    // close mobile menu on navigation
    setMobileOpen(false);
  }, [location.pathname]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("authStateChanged", handleAuthChange);
    return () => window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark-theme") : root.classList.remove("dark-theme");
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  const linkClass = (path) => (location.pathname === path ? "active" : "");

  // Get first name only
  const firstName = user?.name?.split(" ")[0] ?? "Dashboard";

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
        {/* Desktop auth / dashboard pill */}
        {user && (
          <Link to="/dashboard" className="nav-pill nav-pill-desktop">
            {firstName}
          </Link>
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
        <div className="icon-btn cart-icon-wrapper">
          <Link to="/cart">
            <ShoppingBag size={20} style={{ color: "var(--primary)" }} />
          </Link>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>

        {/* Dark Mode */}
        <span className="icon-btn dark-toggle" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </span>

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
