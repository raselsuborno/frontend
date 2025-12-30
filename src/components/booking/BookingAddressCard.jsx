// src/components/booking/BookingAddressCard.jsx
import React, { useEffect, useState } from "react";

export default function BookingAddressCard({
  details,
  setDetails,
  onBack,
  onNext,

  // 🔐 future-proof auth props
  isAuthenticated = false,
  userProfile = null,
}) {
  /* =========================
     LOCAL STATE
  ========================= */
  const [addresses, setAddresses] = useState([
    {
      fullName: "",
      email: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  /* =========================
     PREFILL FOR LOGGED-IN USER
  ========================= */
  useEffect(() => {
    if (!isAuthenticated || !userProfile) return;

    const profileAddress = {
      fullName: userProfile.fullName || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
      line1: userProfile.address?.line1 || "",
      line2: userProfile.address?.line2 || "",
      city: userProfile.address?.city || "",
      postalCode: userProfile.address?.postalCode || "",
    };

    setAddresses([profileAddress]);
    setSelectedIndex(0);

    setDetails((prev) => ({
      ...prev,
      address: profileAddress,
    }));
  }, [isAuthenticated, userProfile, setDetails]);

  /* =========================
     UPDATE HELPERS
  ========================= */
  const updateField = (field, value) => {
    setAddresses((prev) => {
      const copy = [...prev];
      copy[selectedIndex] = { ...copy[selectedIndex], [field]: value };

      setDetails((d) => ({
        ...d,
        address: copy[selectedIndex],
      }));

      return copy;
    });
  };

  const addNewAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        fullName: "",
        email: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
      },
    ]);
    setSelectedIndex(addresses.length);
  };

  const current = addresses[selectedIndex];
  const canProceed =
    current.line1 && current.city && current.postalCode;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="booking-card">
      <h2 className="details-title">Where should we go?</h2>

      {/* ADDRESS SWITCHER */}
      {isAuthenticated && addresses.length > 1 && (
        <div className="details-pills">
          {addresses.map((_, i) => (
            <div
              key={i}
              className={`details-pill ${i === selectedIndex ? "active" : ""}`}
              onClick={() => setSelectedIndex(i)}
            >
              Address {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* GUEST DETAILS */}
      {!isAuthenticated && (
        <>
          <input
            className="address-input address-full"
            placeholder="Full name"
            value={current.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />

          <div className="address-row">
            <input
              className="address-input"
              placeholder="Email"
              value={current.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <input
              className="address-input"
              placeholder="Phone"
              value={current.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        </>
      )}

      {/* ADDRESS */}
      <input
        className="address-input address-full"
        placeholder="Address line 1"
        value={current.line1}
        onChange={(e) => updateField("line1", e.target.value)}
      />

      <input
        className="address-input address-full"
        placeholder="Address line 2 (optional)"
        value={current.line2}
        onChange={(e) => updateField("line2", e.target.value)}
      />

      <div className="address-row">
        <input
          className="address-input"
          placeholder="City"
          value={current.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <input
          className="address-input"
          placeholder="Postal code"
          value={current.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
        />
      </div>

      {/* ADD ADDRESS */}
      {isAuthenticated && (
        <button className="btn-link" onClick={addNewAddress}>
          + Add another address
        </button>
      )}

      {/* ACTIONS */}
      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={onNext}
        >
          Review
        </button>
      </div>
    </div>
  );
}
