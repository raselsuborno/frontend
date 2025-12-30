// src/quote/CorporateSummaryCard.jsx
export default function CorporateSummaryCard({ service, details }) {
  if (!service) return null;

  return (
    <div className="summary-card">
      <div className="summary-title">Quote Summary</div>

      <div className="summary-section">
        <span className="summary-label">Service</span>
        <span className="summary-value">{service}</span>
      </div>

      {details.subService && (
        <div className="summary-section">
          <span className="summary-label">Type</span>
          <span className="summary-value">{details.subService}</span>
        </div>
      )}

      {Object.values(details.extras || {}).map(
        (v, i) =>
          v && (
            <div key={i} className="summary-section">
              <span className="summary-value">{v}</span>
            </div>
          )
      )}

      <div className="summary-divider" />

      <div className="summary-row total">
        <span>Estimated</span>
        <span>Custom Quote</span>
      </div>
    </div>
  );
}
