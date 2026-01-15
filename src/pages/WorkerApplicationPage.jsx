import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import api from "../lib/api.js";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

export function WorkerApplicationPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: profile?.fullName || user?.user_metadata?.name || "",
    email: user?.email || profile?.email || "",
    phone: profile?.phone || "",
    password: "",
    confirmPassword: "",
    workEligible: true,
    availability: "",
    experience: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("worker/apply", form);
      toast.success(response.data?.message || "Application submitted successfully! You can log in and track your application status.");
      navigate("/auth");
    } catch (err) {
      console.error("Application error:", err);
      toast.error(err.message || err.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <PageWrapper>
      <div className="section" style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <button
          onClick={() => navigate("/careers")}
          className="btn outline"
          style={{ marginBottom: "24px" }}
        >
          <ArrowLeft size={18} />
          Back to Careers
        </button>

        <div className="fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "#e0e7ff",
                color: "#4338ca",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "16px",
              }}
            >
              <Briefcase size={16} />
              <span>Join as Worker</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "12px" }}>
              Worker Application
            </h1>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              Apply to join ChorEscape as a service provider. We'll review your application and get back to you soon.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "32px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {/* Personal Information */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={20} />
                Personal Information
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  placeholder="e.g., Saskatchewan"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Work Eligibility */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={20} />
                Work Eligibility
              </h3>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    name="workEligible"
                    checked={form.workEligible}
                    onChange={handleChange}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <span>I am legally eligible to work in Canada</span>
                </label>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                  SIN / Tax ID
                  <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "4px" }}>
                    (Optional - will be requested after approval)
                  </span>
                </label>
                <input
                  type="text"
                  name="sinTaxId"
                  value={form.sinTaxId}
                  onChange={handleChange}
                  placeholder="Will be collected securely after approval"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={20} />
                Availability
              </h3>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                  Available Days
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.availability.includes(day)}
                        onChange={(e) => {
                          const current = form.availability.split(",").filter(Boolean);
                          if (e.target.checked) {
                            current.push(day);
                          } else {
                            current.splice(current.indexOf(day), 1);
                          }
                          setForm((prev) => ({ ...prev, availability: current.join(",") }));
                        }}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={20} />
                Experience
              </h3>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, fontSize: "14px" }}>
                  Tell us about your experience
                </label>
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your relevant work experience, skills, and why you'd be a great fit..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {/* Terms */}
            <div style={{ marginBottom: "32px", padding: "16px", background: "#f9fafb", borderRadius: "8px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                  required
                  style={{ marginTop: "4px", width: "18px", height: "18px", flexShrink: 0 }}
                />
                <div>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>
                    I accept the terms and conditions *
                  </span>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                    By submitting this application, I confirm that the information provided is accurate and I understand that my application will be reviewed before approval.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => navigate("/careers")}
                className="btn outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                disabled={loading || !form.termsAccepted}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>

          <div style={{ marginTop: "24px", padding: "16px", background: "#fef3c7", borderRadius: "8px", fontSize: "14px", color: "#92400e" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Note:</strong> After your application is approved, you'll receive login credentials to access the worker dashboard where you can upload required documents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

