import React, { useState } from "react";
import { PageWrapper } from "../components/page-wrapper";
import { toast } from "react-hot-toast";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Password reset link sent to your email (demo mode)");
  };

  return (
    <PageWrapper>
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: "420px" }}>
          <h2>Forgot Password</h2>
          <p className="muted">We'll email you a reset link.</p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="btn auth-btn">Send Reset Link</button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
