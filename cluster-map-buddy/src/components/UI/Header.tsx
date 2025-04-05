
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <h1 className="text-3xl font-light tracking-tight text-gray-900">
          <span className="font-medium">Advocates & NGOs</span> Explorer
        </h1>
      </div>
    </header>
  );
};

export default Header;
