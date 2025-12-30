// src/components/quote/CorporateInfoCard.jsx
import { useState } from "react";

export default function CorporateInfoCard({ onBack, onNext, details, setDetails }) {
  const [form, setForm] = useState({
    companyName: details?.companyInfo?.companyName || "",
    contactPerson: details?.companyInfo?.contactPerson || "",
    email: details?.companyInfo?.email || "",
    phone: details?.companyInfo?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Update parent details
      if (setDetails) {
        setDetails(prevDetails => ({
          ...prevDetails,
          companyInfo: updated
        }));
      }
      return updated;
    });
  };

  const canProceed = form.companyName && form.contactPerson && form.email;

  return (
    <div className="booking-card">
      <h2 className="details-title">Company information</h2>

      <div className="details-section">
        <input
          className="address-input"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Company name"
          required
        />
      </div>

      <div className="details-section">
        <input
          className="address-input"
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          placeholder="Contact person"
          required
        />
      </div>

      <div className="address-row">
        <input
          type="email"
          className="address-input"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          className="address-input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
      </div>

      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn-primary" onClick={onNext} disabled={!canProceed}>
          Next
        </button>
      </div>
    </div>
  );
}
