import React, { useEffect, useRef, useState, useMemo } from 'react';
import '../globe.css';

const Earth = () => {
  const [GlobeComponent, setGlobeComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Location markers for Canada, UAE, and Australia
  const locations = [
    { lat: 45.4215, lng: -75.6972, label: 'Canada' }, // Canada (Ottawa)
    { lat: 25.276987, lng: 55.296249, label: 'UAE' }, // UAE (Dubai)
    { lat: -33.8688, lng: 151.2093, label: 'Australia' }, // Australia (Sydney)
  ];

  useEffect(() => {
    // Dynamically import react-globe.gl to avoid SSR issues
    if (typeof window !== 'undefined') {
      // Try to import react-globe.gl
      Promise.resolve()
        .then(() => {
          // Check if module exists
          try {
            // Try require first (for CommonJS)
            const globe = require('react-globe.gl');
            setGlobeComponent(() => globe.default || globe);
            setIsLoading(false);
          } catch (e) {
            // Fallback to dynamic import
            return import('react-globe.gl');
          }
        })
        .then((module) => {
          if (module && module.default) {
            setGlobeComponent(() => module.default);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.warn('react-globe.gl not installed. Install with: npm install react-globe.gl three');
          setError('Package not installed');
          setIsLoading(false);
        });
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="globe-container globe-loading">
        <div className="globe-loading-text">Loading globe...</div>
      </div>
    );
  }

  // If GlobeComponent is not available, show fallback with installation instructions
  if (!GlobeComponent || error) {
    return (
      <div className="globe-container globe-fallback">
        <div className="globe-fallback-content">
          <p className="globe-fallback-text">
            To enable 3D globe visualization, install the required packages:
          </p>
          <code className="globe-fallback-code">
            npm install react-globe.gl three
          </code>
          <p className="globe-fallback-hint">
            Then restart your dev server
          </p>
        </div>
      </div>
    );
  }

  // Render the Globe component - map rendered as dots
  return (
    <div className="globe-container globe-ready">
      <GlobeComponent
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        showGraticules={false}
        onGlobeReady={(globe) => {
          if (globe) {
            // Render map as dots/particles
            const scene = globe.scene();
            scene.traverse((child) => {
              if (child.isMesh && child.material) {
                const material = child.material;
                // Apply light green color to map and make it appear dotted
                if (material.map) {
                  // Light green color overlay
                  material.color.setHex(0xd4dcd0); // Light green
                  material.emissive.setHex(0xe8ede4);
                  material.emissiveIntensity = 0.3;
                  material.transparent = true;
                  material.opacity = 0.9;
                  material.needsUpdate = true;
                  
                  // Create dotted effect by adjusting material properties
                  material.alphaTest = 0.5;
                  material.side = 2; // DoubleSide
                }
              }
            });

            if (globe.controls) {
              // Center the globe anchor point
              globe.controls().target.set(0, 0, 0);
              
              // Auto-rotate horizontally (left to right in continuous loop)
              globe.controls().autoRotate = true;
              globe.controls().autoRotateSpeed = 1.5;
              // Limit vertical rotation (keep horizontal only)
              globe.controls().minPolarAngle = Math.PI / 2;
              globe.controls().maxPolarAngle = Math.PI / 2;
              // Enable smooth rotation
              globe.controls().enableDamping = true;
              globe.controls().dampingFactor = 0.05;
              
              // Set initial camera position centered
              globe.camera().position.set(0, 0, 300);
              globe.camera().lookAt(0, 0, 0);
              
              // Continuous animation loop for smooth rotation
              const animate = () => {
                globe.controls().update();
                requestAnimationFrame(animate);
              };
              animate();
            }
          }
        }}
        // Location markers (Canada, UAE, Australia) with pulsing rings
        ringsData={locations}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => () => 'rgba(11, 92, 40, 0.5)'}
        ringMaxRadius={4}
        ringPropagationSpeed={0.5}
        ringRepeatPeriod={1500}
      />
    </div>
  );
};

export default Earth;

