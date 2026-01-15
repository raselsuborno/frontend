// src/components/booking/BookingAddressCard.jsx
import React, { useEffect, useState } from "react";
import api from "../../lib/api.js";

export default function BookingAddressCard({
  details,
  setDetails,
  onBack,
  onNext,
  isAuthenticated = false,
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
  const [loading, setLoading] = useState(isAuthenticated);

  /* =========================
     LOAD SAVED ADDRESSES FOR LOGGED-IN USER
  ========================= */
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadAddresses = async () => {
      try {
        // Try to load saved addresses first
        const addressesResponse = await api.get("addresses");
        const savedAddresses = addressesResponse.data || [];

        if (savedAddresses && savedAddresses.length > 0) {
          // Convert saved addresses to booking format
          const convertedAddresses = savedAddresses.map((addr) => ({
            id: addr.id,
            label: addr.label,
            fullName: addr.fullName || "",
            email: "",
            phone: addr.phone || "",
            line1: addr.street,
            line2: addr.unit || "",
            city: addr.city,
            postalCode: addr.postal,
            province: addr.province,
            country: addr.country || "Canada",
          }));

          // Get profile email for addresses
          try {
            const profileResponse = await api.get("profile/me");
            const email = profileResponse.data?.email || "";
            convertedAddresses.forEach((addr) => {
              addr.email = email;
            });
          } catch (e) {
            console.error("Failed to load profile email:", e);
          }

          setAddresses(convertedAddresses);
          
          // Select default address or first address
          const defaultIndex = convertedAddresses.findIndex((a) => savedAddresses.find((sa) => sa.id === a.id)?.isDefault) || 0;
          setSelectedIndex(defaultIndex >= 0 ? defaultIndex : 0);

          setDetails((prev) => ({
            ...prev,
            address: convertedAddresses[defaultIndex >= 0 ? defaultIndex : 0],
          }));
        } else {
          // Fallback to profile address if no saved addresses
          const profileResponse = await api.get("profile/me");
          const profile = profileResponse.data || {};

          if (profile.street || profile.city) {
            const profileAddress = {
              fullName: profile.fullName || profile.name || "",
              email: profile.email || "",
              phone: profile.phone || "",
              line1: profile.street || "",
              line2: profile.unit || "",
              city: profile.city || "",
              postalCode: profile.postal || "",
              province: profile.province || "",
            };

            if (profileAddress.line1 || profileAddress.city) {
              setAddresses([profileAddress]);
              setSelectedIndex(0);
              setDetails((prev) => ({
                ...prev,
                address: profileAddress,
              }));
            }
          }
        }
      } catch (error) {
        console.error("[BookingAddressCard] Failed to load addresses:", error);
        // Continue with empty form if load fails
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [isAuthenticated, setDetails]);

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
  if (loading) {
    return (
      <div className="booking-card">
        <h2 className="details-title">Loading your address...</h2>
        <p className="muted">Please wait while we load your saved address.</p>
      </div>
    );
  }

  return (
    <div className="booking-card">
      <h2 className="details-title">Where should we go?</h2>
      
      {isAuthenticated && addresses[0]?.line1 && (
        <p className="muted" style={{ marginBottom: "16px", fontSize: "14px" }}>
          ✓ Using your saved address. You can edit it below.
        </p>
      )}

      {/* ADDRESS SELECTOR - Show saved addresses */}
      {isAuthenticated && addresses.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
            Select a saved address:
          </label>
          <div className="details-pills" style={{ flexWrap: "wrap", gap: "8px" }}>
            {addresses.map((addr, i) => (
              <div
                key={addr.id || i}
                className={`details-pill ${i === selectedIndex ? "active" : ""}`}
                onClick={() => {
                  setSelectedIndex(i);
                  setDetails((prev) => ({
                    ...prev,
                    address: addr,
                  }));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  padding: "8px 16px",
                }}
              >
                {addr.label && (
                  <span style={{ fontWeight: 600 }}>{addr.label}:</span>
                )}
                <span>{addr.line1}, {addr.city}</span>
              </div>
            ))}
          </div>
          <button
            className="btn-link"
            onClick={() => {
              // Add a new temporary address
              const newAddr = {
                fullName: "",
                email: addresses[0]?.email || "",
                phone: "",
                line1: "",
                line2: "",
                city: "",
                postalCode: "",
              };
              setAddresses([...addresses, newAddr]);
              setSelectedIndex(addresses.length);
              setDetails((prev) => ({
                ...prev,
                address: newAddr,
              }));
            }}
            style={{ marginTop: "8px", fontSize: "14px" }}
          >
            + Use a different address
          </button>
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
