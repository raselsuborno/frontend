// src/components/booking/BookingSummaryCard.jsx
import { Shield,CircleX } from "lucide-react";
export default function BookingSummaryCard({ service, details, step }) {
  if (!service || !details) return null;

  const {
    subService,
    frequency,
    extras = {},
    schedule = {},
    address = {},
  } = details;

  const SERVICES_WITH_FREQUENCY = [
    "Snow",
    "Cleaning",
    "Airbnb",
    "Laundry",
    "Lawn",
    "Maid",
  ];

  const { date, timeFrom, timeTo } = schedule || {};
  const { line1, city, postal } = address || {};

  return (
    <div className="summary-card">
      <div className="summary-title">Your Booking Summary</div>

      {/* SERVICE */}
      <div className="summary-section">
        <span className="summary-label">Service</span>
        <span className="summary-value">{service}</span>
      </div>

      {/* SUB SERVICE */}
      {step >= 2 && subService && (
        <div className="summary-section">
          <span className="summary-label">Service Type</span>
          <span className="summary-value">{subService}</span>
        </div>
      )}

      {/* FREQUENCY */}
      {step >= 2 &&
        SERVICES_WITH_FREQUENCY.includes(service) &&
        frequency && (
          <div className="summary-section">
            <span className="summary-label">Frequency</span>
            <span className="summary-value">{frequency}</span>
          </div>
        )}

      {/* EXTRAS */}
      {extras.homeSize && (
        <div className="summary-section">
          <span className="summary-label">Home Size</span>
          <span className="summary-value">{extras.homeSize}</span>
        </div>
      )}

      {extras.laundryUnits && (
        <div className="summary-section">
          <span className="summary-label">Laundry</span>
          <span className="summary-value">
            {extras.laundryUnits}
            {extras.laundryFold ? ` • ${extras.laundryFold}` : ""}
          </span>
        </div>
      )}

      {extras.handymanJobType && (
        <div className="summary-section">
          <span className="summary-label">Job Type</span>
          <span className="summary-value">{extras.handymanJobType}</span>
        </div>
      )}

      {extras.snowPropertyType && (
        <div className="summary-section">
          <span className="summary-label">Property</span>
          <span className="summary-value">
            {extras.snowPropertyType}
            {typeof extras.snowIncludeWalkways === "boolean" &&
              ` • ${
                extras.snowIncludeWalkways
                  ? "Includes walkways"
                  : "Driveway only"
              }`}
          </span>
        </div>
      )}

      {extras.autoVehicleType && (
        <div className="summary-section">
          <span className="summary-label">Vehicle</span>
          <span className="summary-value">{extras.autoVehicleType}</span>
        </div>
      )}

      {extras.extraNotes && (
        <div className="summary-section">
          <span className="summary-label">Additional Notes</span>
          <span className="summary-value">{extras.extraNotes}</span>
        </div>
      )}

      {/* SCHEDULE */}
      {(date || timeFrom || timeTo) && (
        <>
          <div className="summary-divider" />
          <div className="summary-section">
            <span className="summary-label">Schedule</span>
            <span className="summary-value">
              {date || "—"}
              {timeFrom && timeTo && ` • ${timeFrom} – ${timeTo}`}
            </span>
          </div>
        </>
      )}

      {/* ADDRESS */}
      {(line1 || city || postal) && (
        <div className="summary-section">
          <span className="summary-label">Address</span>
          <span className="summary-value">
            {[line1, city, postal].filter(Boolean).join(", ")}
          </span>
        </div>
      )}

      <div className="summary-divider" />

      {/* PRICING */}
      <div className="summary-row">
        <span>Estimated Subtotal</span>
        <span>—</span>
      </div>

      <div className="summary-row total">
        <span>Total</span>
        <span>To be confirmed</span>
      </div>

      <div className="summary-trust">
        <div><Shield size={14}/>Secure booking</div>
        <div><CircleX size={14}/>Free cancellation</div>
      </div>
    </div>
  );
}
