import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, CheckCircle } from "lucide-react";
import apiClient from "../../lib/api.js";
import toast from "react-hot-toast";

export default function BookingPaymentCard({
  service,
  details,
  onBack,
  onComplete,
}) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("pay_later");
  const [processing, setProcessing] = useState(false);

  const calculateTotal = () => {
    let total = service?.basePrice || 0;
    // Add any additional pricing logic here based on subService, frequency, etc.
    return total;
  };

  const handleSubmit = async () => {
    setProcessing(true);
    try {
      // Create booking
      const bookingData = {
        serviceId: service?.id,
        serviceSlug: service?.slug,
        subService: details.subService,
        frequency: details.frequency,
        notes: details.extraNotes,
        paymentMethod,
        paymentStatus: paymentMethod === "pay_later" ? "pending" : "pending",
        // Add date, timeSlot, address from details
        ...details,
      };

      const response = await apiClient.post("/api/bookings", bookingData);
      toast.success("Booking created successfully!");
      
      if (onComplete) {
        onComplete(response.data);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Booking creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="booking-card">
      <h2 className="details-title">Payment</h2>

      <div className="details-section">
        <div className="details-label">Payment Method</div>
        <div className="details-options">
          <div
            className={`details-option ${paymentMethod === "pay_later" ? "active" : ""}`}
            onClick={() => setPaymentMethod("pay_later")}
          >
            <Wallet size={20} style={{ marginRight: "8px" }} />
            Pay Later
          </div>
          <div
            className={`details-option ${paymentMethod === "card" ? "active" : ""}`}
            onClick={() => setPaymentMethod("card")}
          >
            <CreditCard size={20} style={{ marginRight: "8px" }} />
            Credit Card
          </div>
        </div>
      </div>

      {paymentMethod === "card" && (
        <div className="details-section">
          <div className="details-label">Card Information</div>
          <div style={{ padding: "16px", background: "var(--bg-soft)", borderRadius: "8px" }}>
            <p className="muted">Payment gateway integration coming soon</p>
            <p className="muted" style={{ fontSize: "12px", marginTop: "8px" }}>
              For now, please select "Pay Later" to complete your booking.
            </p>
          </div>
        </div>
      )}

      <div className="details-section">
        <div style={{
          padding: "16px",
          background: "var(--primary-soft)",
          borderRadius: "8px",
          border: "1px solid var(--primary)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack} disabled={processing}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={processing || (paymentMethod === "card")}
        >
          {processing ? (
            "Processing..."
          ) : paymentMethod === "pay_later" ? (
            <>
              <CheckCircle size={18} style={{ marginRight: "8px" }} />
              Complete Booking
            </>
          ) : (
            "Coming Soon"
          )}
        </button>
      </div>
    </div>
  );
}
