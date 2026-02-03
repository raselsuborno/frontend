import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import apiClient from "../../lib/api.js";
import { Sparkles } from "lucide-react";

// Common icons for services
const ICON_OPTIONS = [
  "Brush", "Home", "Truck", "Bug", "Snowflake", "Shirt", "Wrench", "Trees",
  "UserCheck", "Hammer", "Car", "Thermometer", "Building2", "ClipboardList",
  "Sparkles", "Droplet", "Wind", "Zap", "Package", "Heart", "Star", "Settings"
];

export default function BookingServicesCard({ selected, onSelect, onNext }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get("/public/services?type=RESIDENTIAL");
        setServices(response.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (iconName) => {
    if (!iconName) return Sparkles;
    
    // Normalize icon name (capitalize first letter)
    const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const iconNameWithSuffix = normalizedName + 'Icon';
    
    // Try different variations: Car, CarIcon, original name
    // Lucide exports icons as objects, so we check for existence
    let IconComponent = null;
    
    if (normalizedName in LucideIcons) {
      IconComponent = LucideIcons[normalizedName];  // Try "Car"
    } else if (iconNameWithSuffix in LucideIcons) {
      IconComponent = LucideIcons[iconNameWithSuffix];  // Try "CarIcon"
    } else if (iconName in LucideIcons) {
      IconComponent = LucideIcons[iconName];  // Try original
    }
    
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" (tried: ${normalizedName}, ${iconNameWithSuffix}) not found, using Sparkles as fallback`);
      return Sparkles;
    }
    
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="service-card">
        <h2 className="service-title">Choose your service</h2>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="service-card">
      <h2 className="service-title">Choose your service</h2>

      <div className="service-grid">
        {services.length === 0 ? (
          <p>No services available</p>
        ) : (
          services.map((service) => {
            const Icon = getIcon(service.iconName);
            const active = selected?.id === service.id || selected?.slug === service.slug;

            return (
              <button
                key={service.id}
                type="button"
                className={`service-tile ${active ? "active" : ""}`}
                onClick={() => onSelect(service)}
              >
                <div className="service-icon">
                  <Icon size={18} />
                </div>
                <span>{service.title}</span>
              </button>
            );
          })
        )}
      </div>

      <div className="service-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/services")}
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

// Export for admin use
export { ICON_OPTIONS };
