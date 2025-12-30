import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BrushCleaning,
  Home,
  Truck,
  Bug,
  Snowflake,
  Shirt,
  Wrench,
  Trees,
  UserCheck,
  Hammer,
  Car,
  Thermometer,
} from "lucide-react";

const SERVICES = [
  { id: "Cleaning", label: "Cleaning", Icon: BrushCleaning },
  { id: "Airbnb", label: "Airbnb or Rental", Icon: Home },
  { id: "Move", label: "Move-In or Out", Icon: Truck },
  { id: "Pest", label: "Pest Control", Icon: Bug },
  { id: "Snow", label: "Snow Removal", Icon: Snowflake },
  { id: "Laundry", label: "Laundry", Icon: Shirt },
  { id: "Handyman", label: "Handyman", Icon: Wrench },
  { id: "Lawn", label: "Lawn Care", Icon: Trees },
  { id: "Maid", label: "Maid Service", Icon: UserCheck },
  { id: "Renovation", label: "Home Renovation", Icon: Hammer },
  { id: "Automotive", label: "Automotive", Icon: Car },
  { id: "HVAC", label: "HVAC & Plumbing", Icon: Thermometer },
];

export default function BookingServicesCard({ selected, onSelect, onNext }) {
  const navigate = useNavigate(); // ✅ ADD THIS

  return (
    <div className="service-card">
      <h2 className="service-title">Choose your service</h2>

      <div className="service-grid">
        {SERVICES.map(({ id, label, Icon }) => {
          const active = selected === id;

          return (
            <button
              key={id}
              type="button"
              className={`service-tile ${active ? "active" : ""}`}
              onClick={() => onSelect(id)}
            >
              <div className="service-icon">
                <Icon size={18} />
              </div>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="service-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/services")} // ✅ THIS IS IT
        >
          Back to services
        </button>

        <button
          type="button"
          className="btn-primary"
          disabled={!selected}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
