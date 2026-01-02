// src/components/booking/BookingReviewCard.jsx
import { useState } from "react";
import { Pencil } from "lucide-react";
import apiClient from "../../lib/api.js";
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

  // Estimate price based on service and home size
  const estimatePrice = (homeSize, subService) => {
    const basePrices = {
      "1 Bedroom": 80,
      "2 Bedroom": 120,
      "3 Bedroom": 160,
      "4+ Bedroom": 200,
      "Studio": 60,
    };
    const base = basePrices[homeSize] || 100;
    const subServiceMultiplier = subService?.includes("Deep") ? 1.5 : 1.0;
    return Math.round(base * subServiceMultiplier);
  };

  const handleSubmitBooking = async () => {
    if (!schedule?.date || !address?.line1) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        serviceName: service || "Service",
        serviceSlug: service ? service.toLowerCase().replace(/\s+/g, "-") : null,
        subService: subService || null,
        frequency: frequency || null,
        date: schedule?.date || schedule?.date || new Date().toISOString().split('T')[0],
        timeSlot: schedule?.timeFrom && schedule?.timeTo 
          ? `${schedule.timeFrom} - ${schedule.timeTo}` 
          : schedule?.timeSlot || null,
        addressLine: address?.line1 || address?.addressLine || "",
        city: address?.city || "",
        province: address?.province || "SK",
        postal: address?.postalCode || address?.postal || "",
        country: address?.country || "Canada",
        notes: extras?.extraNotes || null,
        paymentMethod: "pay_later", // Default, can be changed based on payment selection
        paymentStatus: "pending",
      };

      let response;
      if (isAuthenticated) {
        // Logged-in user booking
        response = await apiClient.post(
          "/api/bookings",
          bookingData
        );
      } else {
        // Guest booking
        bookingData.guestName = address.fullName || "";
        bookingData.guestEmail = address.email || "";
        bookingData.guestPhone = address.phone || "";
        
        response = await apiClient.post(
          "/api/bookings/guest",
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
        <div className="review-total-amount">
          {details.service === "House Cleaning" && details.details?.homeSize
            ? `$${estimatePrice(details.details.homeSize, details.subService)}`
            : "$0.00"}
        </div>
        <div className="review-total-note">
          Final pricing will be confirmed once we review your booking.
          {frequency && frequency.includes("Weekly") && (
            <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--primary)" }}>
              💰 Save with recurring bookings!
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="review-actions">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          Back
        </button>

        <button 
          className="btn-outline"
          onClick={() => {
            // Set payment method before submitting
            handleSubmitBooking();
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Pay later"}
        </button>

        <button 
          className="btn-primary"
          onClick={() => {
            // Note: For now, both buttons use pay_later
            // In the future, you can add payment processing here
            handleSubmitBooking();
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Pay now"}
        </button>
      </div>
    </div>
  );
}
