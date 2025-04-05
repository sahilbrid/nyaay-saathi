
import React from 'react';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';

interface MarkerIconProps {
  size?: number;
}

// This component is for creating the HTML icon content
export const MarkerIconComponent: React.FC<MarkerIconProps> = ({ size = 30 }) => {
  return (
    <div 
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
      className="relative"
    >
      <div className="absolute inset-0 bg-map-marker rounded-full flex items-center justify-center shadow-lg animate-pulse-soft">
        <div className="w-1/2 h-1/2 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

// This function creates the Leaflet divIcon with our custom HTML
export const createMarkerIcon = (size: number = 30) => {
  const iconHtml = renderToString(<MarkerIconComponent size={size} />);
  
  return divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};
