import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Plus, FileText, Tag, DollarSign, MapPin, User, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import { useNavigate } from "react-router-dom";

export function PostChoreModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [userProfile, setUserProfile] = useState(null);

  // Chore details
  const [chore, setChore] = useState({
    title: "",
    category: "Cleaning",
    description: "",
    budget: "",
  });

  // Guest address info (only for guests)
  const [guestAddress, setGuestAddress] = useState({
    street: "",
    city: "",
    province: "",
    postal: "",
    country: "Canada",
  });

  // Load user profile if logged in
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadUserProfile();
    }
  }, [isOpen, isLoggedIn]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("profile/me");
      setUserProfile(response.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  // Close modal on ESC or outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    setChore({ title: "", category: "Cleaning", description: "", budget: "" });
    setGuestAddress({ street: "", city: "", province: "", postal: "", country: "Canada", email: "", name: "", phone: "" });
    onClose();
  };

  const handleNext = () => {
    if (!chore.title.trim()) {
      toast.error("Please enter a chore title");
      return;
    }

    if (isLoggedIn) {
      // Logged in user: post directly
      handleSubmitChore();
    } else {
      // Guest: go to address step
      setStep(2);
    }
  };

  const handleSubmitChore = async () => {
    if (!chore.title.trim()) {
      toast.error("Please enter a chore title");
      return;
    }

    // For guests, validate address and contact info
    if (!isLoggedIn) {
      if (!guestAddress.email || !guestAddress.email.trim()) {
        toast.error("Please provide your email address");
        return;
      }
      if (!guestAddress.street || !guestAddress.city || !guestAddress.postal) {
        toast.error("Please fill in all required address fields");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        title: chore.title.trim(),
        category: chore.category || "Other",
        description: chore.description.trim() || null,
        budget: chore.budget ? parseFloat(chore.budget) : null,
      };

      // Add address and guest info
      if (!isLoggedIn) {
        payload.address = guestAddress.street;
        payload.city = guestAddress.city;
        payload.province = guestAddress.province || "SK";
        payload.postal = guestAddress.postal;
        payload.guestEmail = guestAddress.email;
        payload.guestName = guestAddress.name || null;
        payload.guestPhone = guestAddress.phone || null;
      } else {
        // For logged in users, use profile address if available
        if (userProfile?.street || userProfile?.city) {
          payload.address = userProfile.street || "";
          payload.city = userProfile.city || "";
          payload.province = userProfile.province || "SK";
          payload.postal = userProfile.postal || "";
        }
      }

      await api.post("chores", payload);

      toast.success(
        isLoggedIn
          ? "Chore posted successfully! Check your dashboard to track it."
          : "Chore posted successfully! We'll review it and contact you soon."
      );

      handleClose();

      // Redirect logged in users to dashboard after a delay
      if (isLoggedIn) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Post chore error:", err);
      toast.error(err.message || err.data?.message || "Failed to post chore. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="home-modal-overlay" style={{ zIndex: 1050 }}>
      <div className="home-modal-card" ref={modalRef}>
        <button className="home-modal-close" onClick={handleClose}>
          <X size={20} />
        </button>

        {/* Step 1: Chore Details */}
        {step === 1 && (
          <>
            <div className="home-modal-header">
              <div className="home-modal-icon">
                <Plus size={24} />
              </div>
              <h3 className="home-modal-title">Post a Chore</h3>
              <p className="home-modal-subtitle">
                Tell us what you need and we'll match you with the right professional
              </p>
            </div>

            <div className="home-modal-form">
              <div className="home-modal-form-group">
                <label className="home-modal-label">Chore Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Deep clean entire house"
                  className="home-modal-input"
                  value={chore.title}
                  onChange={(e) => setChore({ ...chore, title: e.target.value })}
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Category *</label>
                <select
                  className="home-modal-input"
                  value={chore.category}
                  onChange={(e) => setChore({ ...chore, category: e.target.value })}
                >
                  <option>Cleaning</option>
                  <option>Handyman</option>
                  <option>Furniture Assembly</option>
                  <option>Moving Help</option>
                  <option>Car Cleaning</option>
                  <option>Yard Work</option>
                  <option>Laundry</option>
                  <option>Snow Removal</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Description (optional)</label>
                <textarea
                  placeholder="Describe the chore in detail..."
                  className="home-modal-textarea"
                  rows="4"
                  value={chore.description}
                  onChange={(e) => setChore({ ...chore, description: e.target.value })}
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Budget (optional)</label>
                <input
                  type="number"
                  placeholder="e.g., 120"
                  className="home-modal-input"
                  value={chore.budget}
                  onChange={(e) => setChore({ ...chore, budget: e.target.value })}
                  min="0"
                  step="1"
                />
              </div>

              <button
                className="btn home-modal-btn"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Posting..." : isLoggedIn ? "Post Chore" : "Continue"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </>
        )}

        {/* Step 2: Guest Address (only for guests) */}
        {!isLoggedIn && step === 2 && (
          <>
            <div className="home-modal-header">
              <div className="home-modal-icon">
                <MapPin size={24} />
              </div>
              <h3 className="home-modal-title">Service Address</h3>
              <p className="home-modal-subtitle">
                We need your address to provide accurate service
              </p>
            </div>

            <div className="home-modal-form">
              <div className="home-modal-form-group">
                <label className="home-modal-label">Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="home-modal-input"
                  value={guestAddress.email}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Full Name (optional)</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="home-modal-input"
                  value={guestAddress.name}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, name: e.target.value })
                  }
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="(306) 555-1234"
                  className="home-modal-input"
                  value={guestAddress.phone}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, phone: e.target.value })
                  }
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Street Address *</label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  className="home-modal-input"
                  value={guestAddress.street}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, street: e.target.value })
                  }
                  required
                />
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">City *</label>
                <input
                  type="text"
                  placeholder="Regina"
                  className="home-modal-input"
                  value={guestAddress.city}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, city: e.target.value })
                  }
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="home-modal-form-group">
                  <label className="home-modal-label">Province *</label>
                  <input
                    type="text"
                    placeholder="SK"
                    className="home-modal-input"
                    value={guestAddress.province}
                    onChange={(e) =>
                      setGuestAddress({ ...guestAddress, province: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="home-modal-form-group">
                  <label className="home-modal-label">Postal Code *</label>
                  <input
                    type="text"
                    placeholder="S4P 0A1"
                    className="home-modal-input"
                    value={guestAddress.postal}
                    onChange={(e) =>
                      setGuestAddress({ ...guestAddress, postal: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="home-modal-form-group">
                <label className="home-modal-label">Country</label>
                <input
                  type="text"
                  placeholder="Canada"
                  className="home-modal-input"
                  value={guestAddress.country}
                  onChange={(e) =>
                    setGuestAddress({ ...guestAddress, country: e.target.value })
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  className="btn home-modal-btn"
                  onClick={handleSubmitChore}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "Posting..." : "Post Chore"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

