
import React from 'react';
import { divIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';

interface ClusterIconProps {
  count: number;
  size?: number;
}

// This component is for creating the HTML cluster icon content
export const ClusterIconComponent: React.FC<ClusterIconProps> = ({ count, size = 40 }) => {
  // Adjust the size based on the count
  const adjustedSize = count < 10 ? size : count < 50 ? size * 1.2 : size * 1.5;
  
  // Choose different background colors based on the count
  let bgColorClass = "bg-map-cluster-small";
  if (count >= 10 && count < 50) {
    bgColorClass = "bg-map-cluster-medium";
  } else if (count >= 50) {
    bgColorClass = "bg-map-cluster-large";
  }
  
  return (
    <div 
      style={{ 
        width: `${adjustedSize}px`, 
        height: `${adjustedSize}px`
      }}
      className={`flex items-center justify-center rounded-full ${bgColorClass} shadow-lg animate-pulse-soft`}
    >
      <span className="text-white font-medium text-sm">{count}</span>
    </div>
  );
};

// This function creates the Leaflet divIcon with our custom HTML
export const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 50 ? 48 : 56;
  
  const iconHtml = renderToString(<ClusterIconComponent count={count} size={size} />);
  
  return divIcon({
    html: iconHtml,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};
