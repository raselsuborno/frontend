// src/quote/CorporateDetailsCard.jsx
export default function CorporateDetailsCard({
  serviceConfig,
  details,
  setDetails,
  onBack,
  onNext,
}) {
  const { subServices, extrasType, title } = serviceConfig;

  const updateExtras = (patch) =>
    setDetails((p) => ({ ...p, extras: { ...p.extras, ...patch } }));

  const renderExtras = () => {
    switch (extrasType) {
      case "propertySize":
        return (
          <div className="details-section">
            <div className="details-label">Property size</div>
            <div className="details-pills">
              {["Small (under 5k sqft)", "Medium (5k–20k)", "Large (20k+)"].map(
                (o) => (
                  <div
                    key={o}
                    className={`details-pill ${
                      details.extras.propertySize === o ? "active" : ""
                    }`}
                    onClick={() => updateExtras({ propertySize: o })}
                  >
                    {o}
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "vehicleCount":
        return (
          <div className="details-section">
            <div className="details-label">Number of vehicles</div>
            <div className="details-pills">
              {["1–3", "4–10", "10+"].map((o) => (
                <div
                  key={o}
                  className={`details-pill ${
                    details.extras.vehicleCount === o ? "active" : ""
                  }`}
                  onClick={() => updateExtras({ vehicleCount: o })}
                >
                  {o}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-card">
      <h2 className="details-title">{title} details</h2>

      {/* SUB SERVICES */}
      <div className="details-section">
        <div className="details-label">Service type</div>
        <div className="details-options">
          {subServices.map((s) => (
            <div
              key={s}
              className={`details-option ${
                details.subService === s ? "active" : ""
              }`}
              onClick={() => setDetails((p) => ({ ...p, subService: s }))}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {renderExtras()}

      <div className="details-section">
        <div className="details-label">Additional notes</div>
        <textarea
          className="details-textarea"
          value={details.extras.notes || ""}
          onChange={(e) => updateExtras({ notes: e.target.value })}
        />
      </div>

      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!details.subService}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
