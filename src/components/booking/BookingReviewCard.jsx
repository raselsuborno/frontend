// src/components/booking/BookingReviewCard.jsx
import { useState } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../../config.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BookingReviewCard({
  service,
  details,
  onEditService,
  onEditSchedule,
  onEditAddress,
  onBack,
}) {
  const { subService, frequency, extras, schedule, address } = details;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const handleSubmitBooking = async () => {
    if (!schedule?.date || !address?.line1) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        date: schedule.date,
        timeSlot: schedule.timeFrom && schedule.timeTo 
          ? `${schedule.timeFrom} - ${schedule.timeTo}` 
          : null,
        addressLine: address.line1,
        city: address.city,
        province: "SK", // Default to Saskatchewan
        postal: address.postalCode,
        notes: extras?.extraNotes || null,
      };

      // Add service ID if available (you may need to map service name to ID)
      // For now, we'll let the backend handle service lookup by name/slug
      if (service) {
        bookingData.serviceSlug = service.toLowerCase().replace(/\s+/g, "-");
      }

      let response;
      if (isAuthenticated) {
        // Logged-in user booking
        response = await axios.post(
          `${API_BASE}/api/bookings`,
          bookingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Guest booking
        bookingData.guestName = address.fullName || "";
        bookingData.guestEmail = address.email || "";
        bookingData.guestPhone = address.phone || "";
        
        response = await axios.post(
          `${API_BASE}/api/bookings/guest`,
          bookingData
        );
      }

      toast.success("Booking submitted successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-card">
      <h2 className="details-title">Review your booking</h2>

      {/* SERVICE */}
      <div className="review-section">
        <div className="review-header">
          <span className="review-label">Service</span>
          <Pencil
            size={16}
            className="review-edit"
            onClick={onEditService}
          />
        </div>

        <div className="review-main-text">
          {service} — {subService}
        </div>

        {frequency && (
          <div className="review-subtext">{frequency}</div>
        )}

        {extras?.extraNotes && (
          <div className="review-subtext">
            Notes: {extras.extraNotes}
          </div>
        )}
      </div>

      {/* DATE & TIME */}
      {schedule?.date && (
        <div className="review-section">
          <div className="review-header">
            <span className="review-label">Date & Time</span>
            <Pencil
              size={16}
              className="review-edit"
              onClick={onEditSchedule}
            />
          </div>

          <div className="review-main-text">
            {schedule.date}
          </div>

          <div className="review-subtext">
            {schedule.timeFrom} – {schedule.timeTo}
          </div>
        </div>
      )}

      {/* ADDRESS */}
      {address?.line1 && (
        <div className="review-section">
          <div className="review-header">
            <span className="review-label">Address</span>
            <Pencil
              size={16}
              className="review-edit"
              onClick={onEditAddress}
            />
          </div>

          <div className="review-main-text">
            {address.line1}
          </div>

          <div className="review-subtext">
            {address.city}, {address.postalCode}
          </div>
        </div>
      )}

      {/* ESTIMATED TOTAL */}
      <div className="review-total">
        <div className="review-total-label">Estimated Total</div>
        <div className="review-total-amount">$0.00</div>
        <div className="review-total-note">
          Final pricing will be confirmed once we review your booking.
        </div>
      </div>

      {/* ACTIONS */}
      <div className="review-actions">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          Back
        </button>

        <button 
          className="btn-outline"
          onClick={handleSubmitBooking}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Pay later"}
        </button>

        <button 
          className="btn-primary"
          onClick={handleSubmitBooking}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Pay now"}
        </button>
      </div>
    </div>
  );
}
