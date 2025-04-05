
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { parisLocations, LocationData } from '@/utils/mapData';
import { createMarkerIcon } from './MarkerIcon';
import { createClusterIcon } from './ClusterIcon';
import LoadingSpinner from '../UI/LoadingSpinner';

// Fix for Leaflet default marker icon issues
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map animations when idle
const MapAnimator = () => {
  const map = useMap();
  
  useEffect(() => {
    const handleMoveEnd = () => {
      document.querySelectorAll('.leaflet-marker-icon').forEach((el) => {
        el.classList.add('animate-fade-in');
        setTimeout(() => {
          el.classList.remove('animate-fade-in');
        }, 500);
      });
    };
    
    map.on('moveend', handleMoveEnd);
    
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map]);
  
  return null;
};

const MapComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<LocationData[]>([]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLocations(parisLocations);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Paris coordinates
  const initialPosition: [number, number] = [19.121566178077988, 72.82371429566717];
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={initialPosition}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              icon={createMarkerIcon(30)}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-medium text-lg location-title">{location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Contact - {location.contact}</p>
                  {location.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                      {location.category}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <div className="absolute bottom-5 right-5 z-[1000] text-xs text-gray-500 bg-white/80 px-2 py-1 rounded shadow-sm backdrop-blur-sm">
          Locations: {locations.length}
        </div>
        
        <div className="absolute top-5 right-5 z-[1000] map-controls">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control">
            <a 
              className="leaflet-control-zoom-in" 
              href="#" 
              title="Zoom in" 
              role="button" 
              aria-label="Zoom in"
              onClick={(e) => {
                e.preventDefault();
                const map = document.querySelector('.leaflet-container')?.__reactLeaflet?.map;
                if (map) map.zoomIn();
              }}
            >
              +
            </a>
            <a 
              className="leaflet-control-zoom-out" 
              href="#" 
              title="Zoom out" 
              role="button" 
              aria-label="Zoom out"
              onClick={(e) => {
                e.preventDefault();
                const map = document.querySelector('.leaflet-container')?.__reactLeaflet?.map;
                if (map) map.zoomOut();
              }}
            >
              −
            </a>
          </div>
        </div>
        
        <MapAnimator />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
