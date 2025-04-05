import React from 'react';

const Navbar = () => {
    return (
      <nav className="flex justify-between items-center p-4 px-8">
        <div className="text-2xl font-bold text-purple-600">Nyaay<span className="font-hindi">साथी</span></div>
        <div className="flex space-x-6">
          <a href="/" className="text-gray-700 hover:text-purple-600">Home</a>
          <a href="/analyzer" className="text-gray-700 hover:text-purple-600">AI Case Analyzer</a>
          <a href="/chatbot" className="text-gray-700 hover:text-purple-600">NyaayBot</a>
          <a href="http://localhost:5001/" className="text-gray-700 hover:text-purple-600">Document Generator</a>
          <a href="http://localhost:5173/" className="text-gray-700 hover:text-purple-600">Pro Bono Lawyer</a>
          <a href="#" className="text-gray-700 hover:text-purple-600">About</a>
        </div>
      </nav>
    );
  };

export default Navbar;