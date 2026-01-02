import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, LockKeyhole, Eye, EyeOff, X } from "lucide-react";
import logo from "../assets/chorebunny.png";

export function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const modalRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when mode changes
  useEffect(() => {
    setForm({ name: "", email: "", password: "", confirm: "" });
  }, [mode]);

  // =========================
  // LOGIN
  // =========================
  async function login(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      // Store session token and user data
      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Welcome back!");
      onClose();
      // Trigger a custom event to update navbar
      window.dispatchEvent(new Event("authStateChanged"));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Invalid email or password");
    }

    setLoading(false);
  }

  // =========================
  // SIGNUP
  // =========================
  async function register(e) {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
          },
        },
      });

      if (error) throw error;

      // Session is automatically handled by Supabase and AuthContext
      // No need to manually store tokens - Supabase handles persistence
      if (data.session) {
        toast.success("Account created successfully!");
        onClose();
        navigate("/dashboard");
      } else {
        // Email confirmation required
        toast.success("Account created! Please check your email to confirm your account.");
        onClose();
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.message || "Signup failed");
    }

    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container" ref={modalRef}>
        {/* Close Button */}
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header with Tabs */}
        <div className="auth-modal-header">
          <div className="auth-modal-tabs">
            <button
              className={`auth-modal-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-modal-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Join
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="auth-modal-content">
          {mode === "login" ? (
            <>
              <div className="auth-modal-title-section">
                <h2 className="auth-modal-title">Welcome back</h2>
                <p className="auth-modal-subtitle">Sign in to your account</p>
              </div>

              <form onSubmit={login} className="auth-modal-form">
                <div className="auth-modal-input-group">
                  <Mail size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                  />
                </div>

                <div className="auth-modal-input-group">
                  <Lock size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-modal-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="auth-modal-forgot">
                  <button
                    type="button"
                    className="auth-modal-forgot-link"
                    onClick={() => {
                      onClose();
                      navigate("/forgot-password");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  className="btn auth-modal-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Continue"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-modal-title-section">
                <img src={logo} alt="ChorEscape" className="auth-modal-logo" />
                <h2 className="auth-modal-title">Create your account</h2>
                <p className="auth-modal-subtitle">Join ChorEscape today</p>
              </div>

              <form onSubmit={register} className="auth-modal-form">
                <div className="auth-modal-input-group">
                  <User size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                  />
                </div>

                <div className="auth-modal-input-group">
                  <Mail size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                  />
                </div>

                <div className="auth-modal-input-group">
                  <Lock size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-modal-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="auth-modal-input-group">
                  <LockKeyhole size={18} className="auth-modal-input-icon" />
                  <input
                    className="auth-modal-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={form.confirm}
                    onChange={(e) => setField("confirm", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-modal-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  className="btn auth-modal-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Continue"}
                </button>
              </form>

              <p className="auth-modal-terms">
                By continuing, you agree to ChorEscape's{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

