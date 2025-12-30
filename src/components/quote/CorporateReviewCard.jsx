import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../../config.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CorporateReviewCard({ service, details, onBack }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitQuote = async () => {
    setLoading(true);
    try {
      const quoteData = {
        name: details?.companyInfo?.contactPerson || "",
        email: details?.companyInfo?.email || "",
        phone: details?.companyInfo?.phone || "",
        serviceType: service || "",
        details: [
          details?.subService && `Service Details: ${details.subService}`,
          details?.extras && Object.entries(details.extras)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
          details?.companyInfo?.companyName && `Company: ${details.companyInfo.companyName}`
        ].filter(Boolean).join("\n") || null,
      };

      await axios.post(`${API_BASE}/api/quotes`, quoteData);
      
      toast.success("Quote request submitted successfully! 🎉");
      navigate("/");
    } catch (err) {
      console.error("Quote error:", err);
      toast.error(err.response?.data?.message || "Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-card">
      <div className="review-title">Review your request</div>

      {/* SERVICE */}
      <div className="review-section">
        <div className="review-header">
          <span className="review-label">Service</span>
        </div>
        <div className="review-main-text">{service}</div>
      </div>

      {/* DETAILS */}
      {details.subService && (
        <div className="review-section">
          <div className="review-header">
            <span className="review-label">Details</span>
          </div>
          <div className="review-main-text">{details.subService}</div>
        </div>
      )}

      {/* COMPANY INFO */}
      {details?.companyInfo?.companyName && (
        <div className="review-section">
          <div className="review-header">
            <span className="review-label">Company</span>
          </div>
          <div className="review-main-text">{details.companyInfo.companyName}</div>
          <div className="review-subtext">
            Contact: {details.companyInfo.contactPerson}
            {details.companyInfo.email && ` • ${details.companyInfo.email}`}
            {details.companyInfo.phone && ` • ${details.companyInfo.phone}`}
          </div>
        </div>
      )}

      {/* EXTRAS */}
      {details.extras &&
        Object.entries(details.extras).length > 0 && (
          <div className="review-section">
            <div className="review-header">
              <span className="review-label">Additional info</span>
            </div>
            {Object.entries(details.extras).map(
              ([_, value]) =>
                value && (
                  <div key={value} className="review-subtext">
                    {value}
                  </div>
                )
            )}
          </div>
        )}

      {/* ACTIONS */}
      <div className="review-actions">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          Back
        </button>
        <button className="btn-primary" onClick={handleSubmitQuote} disabled={loading}>
          {loading ? "Submitting..." : "Request quote"}
        </button>
      </div>
    </div>
  );
}
