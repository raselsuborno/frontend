// src/quote/CorporateServicesCard.jsx
import * as Icons from "lucide-react";
import { CORPORATE_SERVICE_DEFS } from "./corporateServiceDefs";

export default function CorporateServicesCard({ selected, onSelect, onNext }) {
  return (
    <div className="service-card">
      <h2 className="service-title">Select a service</h2>

      <div className="service-grid">
        {Object.entries(CORPORATE_SERVICE_DEFS).map(([id, svc]) => {
          const Icon = Icons[svc.icon];

          return (
            <button
              key={id}
              className={`service-tile ${selected === id ? "active" : ""}`}
              onClick={() => onSelect(id)}
            >
              <div className="service-icon">
                <Icon size={18} />
              </div>
              <span>{svc.title}</span>
            </button>
          );
        })}
      </div>

      <div className="service-footer">
        <button className="btn-primary" disabled={!selected} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
