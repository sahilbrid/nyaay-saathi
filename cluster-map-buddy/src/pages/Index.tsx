
import React from 'react';
import Header from '@/components/UI/Header';
import MapComponent from '@/components/Map/MapComponent';

const Index: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Header />
      <MapComponent />
    </div>
  );
};

export default Index;
