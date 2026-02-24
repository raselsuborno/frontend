import React, { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useLocation as useLocationContext } from "../contexts/LocationContext.jsx";

/**
 * Location Selector Component
 * Displays current location and allows users to change it
 * Urban Company-style location picker
 */
export function LocationSelector() {
  const { selectedLocation, updateLocation, availableLocations } = useLocationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLocationSelect = (location) => {
    updateLocation(location);
    setIsOpen(false);
  };

  if (!selectedLocation) {
    return null; // Don't render until location is loaded
  }

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          background: "var(--bg-soft, #f8f9fa)",
          border: "1px solid var(--border-subtle, #e2e8f0)",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--text-main, #0f172a)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--primary-soft, rgba(11, 92, 40, 0.1))";
          e.currentTarget.style.borderColor = "var(--primary, #0b5c28)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-soft, #f8f9fa)";
          e.currentTarget.style.borderColor = "var(--border-subtle, #e2e8f0)";
        }}
        aria-label="Select location"
        aria-expanded={isOpen}
      >
        <MapPin size={16} />
        <span>{selectedLocation.name}, {selectedLocation.province}</span>
        <ChevronDown 
          size={14} 
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "white",
            border: "1px solid var(--border-subtle, #e2e8f0)",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            minWidth: "200px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-soft, #64748b)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderBottom: "1px solid var(--border-subtle, #e2e8f0)",
            }}
          >
            Select Location
          </div>
          {availableLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: selectedLocation.id === location.id 
                  ? "var(--primary-soft, rgba(11, 92, 40, 0.1))" 
                  : "transparent",
                border: "none",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: selectedLocation.id === location.id ? 600 : 500,
                color: selectedLocation.id === location.id 
                  ? "var(--primary, #0b5c28)" 
                  : "var(--text-main, #0f172a)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedLocation.id !== location.id) {
                  e.currentTarget.style.background = "var(--bg-soft, #f8f9fa)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLocation.id !== location.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <MapPin size={16} />
              <div>
                <div>{location.name}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-soft, #64748b)",
                    marginTop: "2px",
                  }}
                >
                  {location.province}, Canada
                </div>
              </div>
              {selectedLocation.id === location.id && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--primary, #0b5c28)",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
