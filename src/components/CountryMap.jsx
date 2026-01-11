// src/components/CountryMap.jsx
import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const CountryMap = ({ country, color = "#0b5c28" }) => {
  // Use world map for countries
  const worldUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
  // Use Natural Earth admin 1 (provinces/states) for Canadian provinces
  const canadaProvincesUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

  // Define the three target countries that should be filled with brand green
  const targetCountries = {
    canada: { codes: ["CAN", "CA"], names: ["Canada"] },
    australia: { codes: ["AUS", "AU"], names: ["Australia"] },
    uae: { codes: ["ARE", "AE"], names: ["United Arab Emirates", "UAE", "U.A.E."] },
  };

  // Country identification patterns - using ISO codes primarily
  const countryPatterns = {
    canada: {
      codes: ["CAN", "CA"],
      names: ["Canada"],
      center: [-106, 54], // Centered on Saskatchewan
      scale: 600,
      showProvinces: true, // Show provinces for Canada
      saskatchewanPin: [-106, 54], // Saskatchewan center coordinates
    },
    uae: {
      codes: ["ARE", "AE"],
      names: ["United Arab Emirates", "UAE", "U.A.E."],
      center: [54, 24],
      scale: 4500,
      showProvinces: false,
    },
    australia: {
      codes: ["AUS", "AU"],
      names: ["Australia"],
      center: [151, -33.9], // Centered on Sydney
      scale: 1000,
      showProvinces: false,
    },
  };

  const countryConfig = countryPatterns[country.toLowerCase()] || countryPatterns.canada;
  const geoUrl = worldUrl;

  const isTargetCountry = (geo) => {
    const props = geo.properties || {};
    const name = props.NAME || props.NAME_LONG || props.NAME_EN || props.name || props.NAME_1 || "";
    const isoA2 = props.ISO_A2 || props.ISO_A2_EH || "";
    const isoA3 = props.ISO_A3 || props.ISO_A3_EH || "";
    
    return (
      countryConfig.codes.includes(isoA2) ||
      countryConfig.codes.includes(isoA3) ||
      countryConfig.names.some(n => 
        name.toLowerCase() === n.toLowerCase() ||
        name.toLowerCase().includes(n.toLowerCase())
      )
    );
  };

  // Check if a geography is one of the three target countries (Canada, Australia, UAE)
  const isOneOfThreeCountries = (geo) => {
    const props = geo.properties || {};
    const name = props.NAME || props.NAME_LONG || props.NAME_EN || props.name || props.NAME_1 || "";
    const isoA2 = props.ISO_A2 || props.ISO_A2_EH || "";
    const isoA3 = props.ISO_A3 || props.ISO_A3_EH || "";
    
    return Object.values(targetCountries).some(config => 
      config.codes.includes(isoA2) ||
      config.codes.includes(isoA3) ||
      config.names.some(n => 
        name.toLowerCase() === n.toLowerCase() ||
        name.toLowerCase().includes(n.toLowerCase())
      )
    );
  };

  const isSaskatchewan = (geo) => {
    const props = geo.properties || {};
    const name = props.NAME || props.NAME_1 || props.name || "";
    return name && (name.toLowerCase() === "saskatchewan" || name.toLowerCase().includes("saskatchewan"));
  };

  return (
    <div className="country-map-wrapper">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: countryConfig.center,
          scale: countryConfig.scale,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Base country layer */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isTarget = isTargetCountry(geo);
              const isOneOfThree = isOneOfThreeCountries(geo);
              const isCanada = country.toLowerCase() === "canada" && isTarget;
              
              // Fill logic - more subtle colors:
              // - If it's the target country: subtle brand green
              // - If it's one of the three countries but not the target: very light green
              // - Otherwise: very light green (instead of gray)
              let fillColor;
              if (isTarget) {
                fillColor = "rgba(11, 92, 40, 0.35)"; // Subtle brand green for target country
              } else if (isOneOfThree) {
                fillColor = "rgba(11, 92, 40, 0.12)"; // Very light green for other target countries
              } else {
                fillColor = "rgba(11, 92, 40, 0.08)"; // Very light green for all other countries
              }
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke={isTarget ? "rgba(255, 255, 255, 0.6)" : "rgba(11, 92, 40, 0.12)"}
                  strokeWidth={isTarget ? (isCanada ? 1.5 : 0.5) : 0.25}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: isTarget ? "rgba(11, 92, 40, 0.4)" : fillColor,
                      outline: "none",
                      cursor: "default",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {/* For Canada, add a marker/pin for Saskatchewan */}
        {countryConfig.showProvinces && countryConfig.saskatchewanPin && (
          <Marker coordinates={countryConfig.saskatchewanPin}>
            <circle
              r={8}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="rgba(11, 92, 40, 0.5)"
              strokeWidth={2}
            />
            <circle
              r={4}
              fill="rgba(11, 92, 40, 0.5)"
            />
          </Marker>
        )}
      </ComposableMap>
    </div>
  );
};

export default CountryMap;
