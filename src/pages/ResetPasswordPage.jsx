import React, { useState } from "react";
import { PageWrapper } from "../components/page-wrapper";
import { toast } from "react-hot-toast";

export function ResetPasswordPage() {
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pass !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password updated (demo mode)");
  };

  return (
    <PageWrapper>
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: "420px" }}>
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <label>New Password</label>
            <input
              className="auth-input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button className="btn auth-btn">Reset Password</button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
