
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border-t-2 border-map-marker animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">Loading</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
