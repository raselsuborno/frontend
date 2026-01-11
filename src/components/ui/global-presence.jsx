import React from 'react';
import { MapPin, Globe, Users } from 'lucide-react';
import '../globe.css';

const GlobalPresence = () => {
  const locations = [
    {
      country: 'Canada',
      city: 'Ottawa',
      flag: '🇨🇦',
      description: 'Serving communities across the Great White North',
      color: '#FF4B4B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF4B4B 100%)',
    },
    {
      country: 'United Arab Emirates',
      city: 'Dubai',
      flag: '🇦🇪',
      description: 'Bringing premium services to the Emirates',
      color: '#00843D',
      gradient: 'linear-gradient(135deg, #00A652 0%, #00843D 100%)',
    },
    {
      country: 'Australia',
      city: 'Sydney',
      flag: '🇦🇺',
      description: 'Quality service down under',
      color: '#FFCD00',
      gradient: 'linear-gradient(135deg, #FFE135 0%, #FFCD00 100%)',
    },
  ];

  return (
    <div className="global-presence-container">
      <div className="global-presence-grid">
        {locations.map((location, index) => (
          <div
            key={location.country}
            className="global-presence-card"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div 
              className="global-presence-flag-wrapper"
              style={{
                background: location.gradient,
              }}
            >
              <div className="global-presence-flag">{location.flag}</div>
            </div>
            
            <div className="global-presence-content">
              <h3 className="global-presence-country">{location.country}</h3>
              <div className="global-presence-location">
                <MapPin size={14} />
                <span>{location.city}</span>
              </div>
              <p className="global-presence-description">
                {location.description}
              </p>
            </div>

            <div className="global-presence-decoration">
              <div className="global-presence-dot" style={{ '--dot-color': location.color }}></div>
              <div className="global-presence-dot" style={{ '--dot-color': location.color, animationDelay: '0.2s' }}></div>
              <div className="global-presence-dot" style={{ '--dot-color': location.color, animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalPresence;


