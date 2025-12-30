import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper";
import { API_BASE } from "../config.js";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, LockKeyhole, Eye, EyeOff, ArrowLeft } from "lucide-react";
import logo from "../assets/chorebunny.png";

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  useEffect(() => setMsg(""), [mode]);

  // =========================
  // LOGIN
  // =========================
  async function login(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Logged in!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err?.response?.data || err);
      setMsg("Invalid email or password.");
      toast.error("Login failed");
    }

    setLoading(false);
  }

  // =========================
  // SIGNUP
  // =========================
  async function register(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      setMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      console.log("Signup error:", err?.response?.data || err);
      setMsg(err?.response?.data?.message || "Signup failed.");
      toast.error("Signup failed");
    }

    setLoading(false);
  }

  return (
    <PageWrapper>
      <div className="auth-wrapper">
        <div className={`flip-card ${mode === "signup" ? "flipped" : ""}`}>
          <div className="flip-inner">

            {/* ========== LOGIN ========== */}
            <div className="flip-face flip-front">
              <div className="auth-card fade-in-up">
                <div className="auth-header">
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">Log in to your account</p>
                </div>

                <form onSubmit={login} className="auth-form">
                  {/* EMAIL */}
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type="email"
                      placeholder=" "
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      required
                    />
                    <label>Email address</label>
                  </div>

                  {/* PASSWORD */}
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      required
                    />
                    <label>Password</label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {msg && (
                    <div className="form-error-container">
                      <p className="form-error">{msg}</p>
                    </div>
                  )}

                  <button className="btn auth-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-btn-loading">
                        <span className="auth-spinner"></span>
                        Logging in...
                      </span>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </form>

                <div className="auth-footer">
                  <p className="forgot-link">
                    <span onClick={() => navigate("/forgot-password")}>
                      Forgot password?
                    </span>
                  </p>

                  <p className="muted switcher">
                    Don't have an account?{" "}
                    <span className="switcher-link" onClick={() => setMode("signup")}>
                      Sign Up
                    </span>
                  </p>

                  <Link to="/" className="auth-back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ========== SIGNUP ========== */}
            <div className="flip-face flip-back">
              <div className="auth-card fade-in-up">
                <div className="auth-header">
                  <div className="auth-title-with-icon">
                    <img src={logo} alt="ChorEscape" className="auth-logo" />
                    <h2 className="auth-title">Create Account</h2>
                  </div>
                  <p className="auth-subtitle">Join ChorEscape in seconds</p>
                </div>

                <form onSubmit={register} className="auth-form">
                  {/* NAME */}
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type="text"
                      placeholder=" "
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      required
                    />
                    <label>Full name</label>
                  </div>

                  {/* EMAIL */}
                  <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type="email"
                      placeholder=" "
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      required
                    />
                    <label>Email address</label>
                  </div>

                  {/* PASSWORD */}
                  <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      required
                    />
                    <label>Password</label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* CONFIRM */}
                  <div className="input-group">
                    <LockKeyhole size={18} className="input-icon" />
                    <input
                      className="auth-input"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=" "
                      value={form.confirm}
                      onChange={(e) => setField("confirm", e.target.value)}
                      required
                    />
                    <label>Confirm password</label>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {msg && (
                    <div className="form-error-container">
                      <p className="form-error">{msg}</p>
                    </div>
                  )}

                  <button className="btn auth-btn" disabled={loading}>
                    {loading ? (
                      <span className="auth-btn-loading">
                        <span className="auth-spinner"></span>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="auth-footer">
                  <p className="muted switcher">
                    Already have an account?{" "}
                    <span className="switcher-link" onClick={() => setMode("login")}>
                      Log In
                    </span>
                  </p>

                  <Link to="/" className="auth-back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
