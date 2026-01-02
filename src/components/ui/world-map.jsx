import React, { useState, useEffect } from 'react';
import '../globe.css';

// World map TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Operation locations
const locations = [
  { 
    name: 'Canada', 
    coordinates: [-95, 56],
    city: 'Ottawa'
  },
  { 
    name: 'UAE', 
    coordinates: [54, 24],
    city: 'Dubai'
  },
  { 
    name: 'Australia', 
    coordinates: [133, -25],
    city: 'Sydney'
  },
];

const WorldMap = () => {
  const [mounted, setMounted] = useState(false);
  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // Dynamically import react-simple-maps
    if (typeof window !== 'undefined') {
      import('react-simple-maps')
        .then((module) => {
          setMapComponent({
            ComposableMap: module.ComposableMap,
            Geographies: module.Geographies,
            Geography: module.Geography,
            Marker: module.Marker,
          });
        })
        .catch((err) => {
          console.warn('react-simple-maps not installed. Install with: npm install react-simple-maps topojson-client');
          setMapComponent('error');
        });
    }
  }, []);

  if (!mounted) {
    return (
      <div className="globe-container globe-loading">
        <div className="globe-loading-text">Loading map...</div>
      </div>
    );
  }

  if (MapComponent === 'error' || !MapComponent) {
    return (
      <div className="globe-container globe-fallback">
        <div className="globe-fallback-content">
          <p className="globe-fallback-text">
            To enable world map visualization, install the required packages:
          </p>
          <code className="globe-fallback-code">
            npm install react-simple-maps topojson-client
          </code>
          <p className="globe-fallback-hint">
            Then restart your dev server
          </p>
        </div>
      </div>
    );
  }

  const { ComposableMap, Geographies, Geography, Marker } = MapComponent;

  return (
    <div className="globe-container globe-ready world-map-container">
      <ComposableMap
        projectionConfig={{
          scale: 240,
          center: [0, 20],
        }}
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.NAME;
              // Check multiple possible name formats for each country
              const isOperationCountry = 
                countryName === 'Canada' ||
                countryName === 'United Arab Emirates' ||
                countryName === 'U.A.E.' ||
                countryName === 'UAE' ||
                countryName === 'Australia';

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isOperationCountry ? '#d4dcd0' : '#e8e8e8'}
                  stroke={isOperationCountry ? 'none' : '#d0d0d0'}
                  strokeWidth={isOperationCountry ? 0 : 0.5}
                  style={{
                    default: {
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    },
                    hover: {
                      fill: isOperationCountry ? '#c4d4c0' : '#d8d8d8',
                      outline: 'none',
                    },
                    pressed: {
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        {locations.map(({ name, coordinates, city }) => (
          <Marker key={name} coordinates={coordinates}>
            <g>
              {/* Marker pin - outer circle */}
              <circle r={4} fill="#0b5c28" />
              {/* Marker pin - inner circle */}
              <circle r={3} fill="#d4dcd0" />
              {/* Marker pin - center dot */}
              <circle r={1.5} fill="#0b5c28" />
            </g>
            <text
              textAnchor="middle"
              y={-18}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fill: '#0b5c28',
                fontSize: '13px',
                fontWeight: '600',
                pointerEvents: 'none',
              }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default WorldMap;

