import React, { useState, useRef, useEffect } from "react";
import apiClient from "../lib/api.js";
import toast from "react-hot-toast";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Heart,
  HeartOff,
  CalendarDays,
  RotateCcw,
  Trash2,
  Star,
} from "lucide-react";

export function BookingDetailModal({ booking, isOpen, onClose, onUpdate }) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");

  // Initialize form when booking changes
  useEffect(() => {
    if (booking && isOpen) {
      const bookingDate = booking.date ? new Date(booking.date).toISOString().split('T')[0] : "";
      setNewDate(bookingDate);
      setNewTimeSlot(booking.timeSlot || "");
      setRescheduleMode(false);
    }
  }, [booking, isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const handleReschedule = async () => {
    if (!newDate) {
      toast.error("Please select a new date");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/api/bookings/${booking.id}/reschedule`, {
        date: newDate,
        timeSlot: newTimeSlot,
      });
      toast.success("Booking rescheduled successfully!");
      setRescheduleMode(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error("Reschedule error:", err);
      toast.error(err.response?.data?.message || "Failed to reschedule booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.delete(`/api/bookings/${booking.id}`);
      toast.success("Booking cancelled successfully");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleRebook = async () => {
    if (!confirm("Create a new booking with the same details?")) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/api/bookings/${booking.id}/rebook`, {
        date: booking.date,
        timeSlot: booking.timeSlot,
      });
      toast.success("Booking rebooked successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error("Rebook error:", err);
      toast.error(err.response?.data?.message || "Failed to rebook");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/api/bookings/${booking.id}/favorite`);
      toast.success(response.data.message || (booking.isFavorite ? "Removed from favorites" : "Added to favorites"));
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Toggle favorite error:", err);
      toast.error(err.response?.data?.message || "Failed to update favorite status");
    } finally {
      setLoading(false);
    }
  };

  const isPast = booking.date ? new Date(booking.date) < new Date() : false;
  const isCancelled = booking.status === "CANCELLED";
  const isCompleted = booking.status === "COMPLETED";
  const canReschedule = !isCancelled && !isCompleted;
  const canCancel = !isCancelled && !isCompleted;
  const canRebook = isCancelled;

  return (
    <div className="auth-modal-overlay" style={{ zIndex: 1000 }}>
      <div className="auth-modal-container" ref={modalRef} style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ padding: "24px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
                {booking.service?.name || booking.serviceName || "Service"}
              </h2>
              {booking.subService && (
                <p className="muted" style={{ fontSize: "14px", marginBottom: "4px" }}>
                  {booking.subService}
                </p>
              )}
              <span
                className={`dash-status-pill dash-status-pill-${(booking.status || "PENDING").toLowerCase()}`}
                style={{ fontSize: "12px", padding: "4px 12px" }}
              >
                {booking.status || "PENDING"}
              </span>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                color: booking.isFavorite ? "var(--primary)" : "var(--text-muted)",
              }}
              title={booking.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {booking.isFavorite ? <Star size={24} fill="currentColor" /> : <Star size={24} />}
            </button>
          </div>

          {/* Booking Details */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Calendar size={20} style={{ color: "var(--primary)" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>Date</div>
                <div className="muted" style={{ fontSize: "13px" }}>
                  {booking.date ? new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "—"}
                </div>
              </div>
            </div>

            {booking.timeSlot && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <Clock size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>Time</div>
                  <div className="muted" style={{ fontSize: "13px" }}>{booking.timeSlot}</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
              <MapPin size={20} style={{ color: "var(--primary)", marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>Address</div>
                <div className="muted" style={{ fontSize: "13px" }}>
                  {booking.addressLine}
                  <br />
                  {booking.city}, {booking.province} {booking.postal}
                </div>
              </div>
            </div>

            {booking.frequency && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <RotateCcw size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>Frequency</div>
                  <div className="muted" style={{ fontSize: "13px" }}>{booking.frequency}</div>
                </div>
              </div>
            )}

            {booking.notes && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <FileText size={20} style={{ color: "var(--primary)", marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>Notes</div>
                  <div className="muted" style={{ fontSize: "13px" }}>{booking.notes}</div>
                </div>
              </div>
            )}
          </div>

          {/* Reschedule Form */}
          {rescheduleMode && (
            <div style={{
              padding: "16px",
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
                Reschedule Booking
              </h3>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "4px", fontWeight: 500 }}>
                  Time Slot (optional)
                </label>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="e.g., 9:00 AM - 12:00 PM"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn-secondary"
                  onClick={() => setRescheduleMode(false)}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleReschedule}
                  disabled={loading || !newDate}
                  style={{ flex: 1 }}
                >
                  {loading ? "Rescheduling..." : "Confirm Reschedule"}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {canReschedule && !rescheduleMode && (
              <button
                className="btn-outline"
                onClick={() => setRescheduleMode(true)}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <CalendarDays size={16} />
                Reschedule
              </button>
            )}

            {canCancel && (
              <button
                className="btn-outline"
                onClick={handleCancel}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--error)" }}
              >
                <Trash2 size={16} />
                Cancel Booking
              </button>
            )}

            {canRebook && (
              <button
                className="btn-primary"
                onClick={handleRebook}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <RotateCcw size={16} />
                Rebook
              </button>
            )}

            {(isCompleted || isPast) && !isCancelled && (
              <button
                className="btn-outline"
                onClick={handleRebook}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <RotateCcw size={16} />
                Book Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

