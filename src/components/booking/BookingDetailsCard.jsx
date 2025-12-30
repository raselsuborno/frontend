import React, { useEffect } from "react";

const SERVICES_WITH_FREQUENCY = [
  "Snow",
  "Cleaning",
  "Airbnb",
  "Laundry",
  "Lawn",
  "Maid",
];

export default function BookingDetailsCard({
  serviceConfig,
  details,
  setDetails,
  onBack,
  onNext,
}) {
  const { subServices = [], title, extrasType, id } = serviceConfig;
  const { subService, frequency, extras } = details;

  /* =========================
     AUTO SELECT FIRST SUBSERVICE
  ========================= */
  useEffect(() => {
    if (!subService && subServices.length) {
      setDetails((prev) => ({
        ...prev,
        subService: subServices[0],
      }));
    }
  }, [subService, subServices, setDetails]);

  /* =========================
     HELPERS
  ========================= */
  const update = (patch) =>
    setDetails((prev) => ({ ...prev, ...patch }));

  const updateExtras = (patch) =>
    setDetails((prev) => ({
      ...prev,
      extras: { ...prev.extras, ...patch },
    }));

  /* =========================
     SERVICE-SPECIFIC EXTRAS
  ========================= */
  const renderExtras = () => {
    switch (extrasType) {
      case "homeSize":
        return (
          <div className="details-section">
            <div className="details-label">Home size</div>
            <div className="details-options">
              {[
                "Apartment (1–2 rooms)",
                "Small Home (2–3 rooms)",
                "Medium Home (3–4 rooms)",
                "Large Home (4+ rooms)",
              ].map((opt) => (
                <div
                  key={opt}
                  className={`details-option ${
                    extras.homeSize === opt ? "active" : ""
                  }`}
                  onClick={() => updateExtras({ homeSize: opt })}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        );

      case "laundryUnits":
        return (
          <>
            <div className="details-section">
              <div className="details-label">Laundry volume</div>
              <div className="details-pills">
                {["1–2 loads", "3–4 loads", "5+ loads"].map((opt) => (
                  <div
                    key={opt}
                    className={`details-pill ${
                      extras.laundryUnits === opt ? "active" : ""
                    }`}
                    onClick={() => updateExtras({ laundryUnits: opt })}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <div className="details-label">Folding</div>
              <div className="details-pills">
                {["Folded", "No Folding"].map((opt) => (
                  <div
                    key={opt}
                    className={`details-pill ${
                      extras.laundryFold === opt ? "active" : ""
                    }`}
                    onClick={() => updateExtras({ laundryFold: opt })}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "handymanJob":
        return (
          <div className="details-section">
            <div className="details-label">Job type</div>
            <div className="details-pills">
              {[
                "Furniture assembly",
                "Mounting / TV",
                "Repairs",
                "Other small jobs",
              ].map((opt) => (
                <div
                  key={opt}
                  className={`details-pill ${
                    extras.handymanJobType === opt ? "active" : ""
                  }`}
                  onClick={() =>
                    updateExtras({ handymanJobType: opt })
                  }
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        );

      case "snowOptions":
        return (
          <>
            <div className="details-section">
              <div className="details-label">Property type</div>
              <div className="details-pills">
                {["House driveway", "Parking pad", "Small lot"].map((opt) => (
                  <div
                    key={opt}
                    className={`details-pill ${
                      extras.snowPropertyType === opt ? "active" : ""
                    }`}
                    onClick={() =>
                      updateExtras({ snowPropertyType: opt })
                    }
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <div className="details-label">Include walkways?</div>
              <div className="details-pills">
                {["Yes", "No"].map((opt) => (
                  <div
                    key={opt}
                    className={`details-pill ${
                      extras.snowIncludeWalkways === (opt === "Yes")
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      updateExtras({
                        snowIncludeWalkways: opt === "Yes",
                      })
                    }
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "autoType":
        return (
          <div className="details-section">
            <div className="details-label">Vehicle type</div>
            <div className="details-pills">
              {["Car", "SUV", "Truck / Van"].map((opt) => (
                <div
                  key={opt}
                  className={`details-pill ${
                    extras.autoVehicleType === opt ? "active" : ""
                  }`}
                  onClick={() =>
                    updateExtras({ autoVehicleType: opt })
                  }
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = Boolean(subService);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="booking-card">
      <h2 className="details-title">{title} details</h2>

      {/* SERVICE TYPE */}
      <div className="details-section">
        <div className="details-label">Service type</div>
        <div className="details-options">
          {subServices.map((s) => (
            <div
              key={s}
              className={`details-option ${
                subService === s ? "active" : ""
              }`}
              onClick={() => update({ subService: s })}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* FREQUENCY (SELECT SERVICES ONLY) */}
      {SERVICES_WITH_FREQUENCY.includes(id) && (
        <div className="details-section">
          <div className="details-label">How often?</div>
          <div className="details-pills">
            {["One-Time", "Weekly", "Bi-weekly", "Monthly"].map((f) => (
              <div
                key={f}
                className={`details-pill ${
                  frequency === f ? "active" : ""
                }`}
                onClick={() => update({ frequency: f })}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE-SPECIFIC EXTRAS */}
      {renderExtras()}

      {/* ✅ ADDITIONAL NOTES — FOR ALL SERVICES */}
      <div className="details-section">
        <div className="details-label">Additional notes (optional)</div>
        <textarea
          className="details-textarea"
          placeholder="Access notes, issues, pets, special requests, etc."
          value={extras.extraNotes || ""}
          onChange={(e) =>
            updateExtras({ extraNotes: e.target.value })
          }
        />
      </div>

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
          Next
        </button>
      </div>
    </div>
  );
}
