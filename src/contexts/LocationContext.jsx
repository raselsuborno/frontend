import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Location Context
 * Manages user's selected location (Canada-only for now)
 * 
 * Supported locations:
 * - Regina
 * - White City
 * - Lumsden
 */

const LocationContext = createContext();

export const CANADA_LOCATIONS = [
  { id: "regina", name: "Regina", province: "SK" },
  { id: "white-city", name: "White City", province: "SK" },
  { id: "lumsden", name: "Lumsden", province: "SK" },
];

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        // Validate that the location is still in our supported list
        const isValid = CANADA_LOCATIONS.some(loc => loc.id === parsed.id);
        if (isValid) {
          setSelectedLocation(parsed);
        } else {
          // If saved location is invalid, default to first location
          const defaultLocation = CANADA_LOCATIONS[0];
          setSelectedLocation(defaultLocation);
          localStorage.setItem("selectedLocation", JSON.stringify(defaultLocation));
        }
      } catch (e) {
        console.error("Failed to parse saved location:", e);
        // Default to first location
        const defaultLocation = CANADA_LOCATIONS[0];
        setSelectedLocation(defaultLocation);
        localStorage.setItem("selectedLocation", JSON.stringify(defaultLocation));
      }
    } else {
      // No saved location - default to first location
      const defaultLocation = CANADA_LOCATIONS[0];
      setSelectedLocation(defaultLocation);
      localStorage.setItem("selectedLocation", JSON.stringify(defaultLocation));
    }
  }, []);

  const updateLocation = (location) => {
    if (!location || !CANADA_LOCATIONS.some(loc => loc.id === location.id)) {
      console.warn("Invalid location:", location);
      return;
    }
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", JSON.stringify(location));
  };

  const value = {
    selectedLocation,
    updateLocation,
    availableLocations: CANADA_LOCATIONS,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
