import React, { useEffect, useState } from "react";
import apiClient from "../lib/api.js";

export function ProfileEditPage() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    apiClient
      .get("/api/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => setMsg("⚠️ Could not load profile"));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await apiClient.put("/api/profile", user);
      setMsg("✅ Profile updated successfully!");
    } catch {
      setMsg("❌ Failed to update profile. Please try again later.");
    }
  };

  if (!token) {
    return (
      <section className="section">
        <h2>Profile</h2>
        <p className="muted">
          You need to log in to edit your profile. Go to Login or Sign Up.
        </p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Edit Profile</h2>
      <form className="card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address
          <input
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            placeholder="e.g. 1234 Main St, Regina, SK"
          />
        </label>

        <button className="btn" type="submit">
          Save Changes
        </button>

        {msg && (
          <p className="muted" style={{ marginTop: 10 }}>
            {msg}
          </p>
        )}
      </form>
    </section>
  );
}
