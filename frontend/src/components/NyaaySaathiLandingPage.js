import React from 'react';
import Navbar from './Navbar';

// Navbar Component
// const Navbar = () => {
//   return (
//     <nav className="flex justify-between items-center p-4 px-8">
//       <div className="text-2xl font-bold text-purple-600">Nyaaysathi</div>
//       <div className="flex space-x-6">
//         <a href="/" className="text-gray-700 hover:text-purple-600">Home</a>
//         <a href="/analyzer" className="text-gray-700 hover:text-purple-600">AI Case Analyzer</a>
//         <a href="#" className="text-gray-700 hover:text-purple-600">AI Legal Assistant</a>
//         <a href="#" className="text-gray-700 hover:text-purple-600">Document Generator</a>
//         <a href="#" className="text-gray-700 hover:text-purple-600">Pro Bono Lawyer</a>
//         <a href="#" className="text-gray-700 hover:text-purple-600">About</a>
//       </div>
//     </nav>
//   );
// };

// Landing Page Component
const NyaaysathiLandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="text-sm bg-purple-100 text-purple-800 inline-block px-3 py-1 rounded-full mb-4">
          AI-Powered Legal Assistance
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Nyaay<span className="font-hindi">साथी</span></h1>
        <h2 className="text-3xl text-gray-700 mb-6">Making Legal Help Accessible for Everyone</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Get AI-powered legal guidance, generate documents, and connect with pro bono lawyers - all in one platform designed for people across India.
        </p>
        <div className="space-x-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Get Legal Help Now →
          </button>
          <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50">
            Generate Documents 📄
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Nyaay<span className="font-hindi">साथी</span> Helps You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform combines AI technology with legal expertise to provide comprehensive assistance for your legal needs.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {/* AI Legal Assistant */}
          <div className="text-center p-6 border rounded-lg hover:shadow-lg transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Legal Assistant</h3>
            <p className="text-gray-600 mb-4">Get personalized legal advice through our multilingual AI assistant that understands your specific case details.</p>
            <button className="text-purple-600 hover:underline">Try Now →</button>
          </div>

          {/* Document Generator */}
          <div className="text-center p-6 border rounded-lg hover:shadow-lg transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Generator</h3>
            <p className="text-gray-600 mb-4">Auto-fill and create professional legal documents including notices, petitions, and complaints.</p>
            <button className="text-purple-600 hover:underline">Try Now →</button>
          </div>

          {/* Risk Assessment */}
          <div className="text-center p-6 border rounded-lg hover:shadow-lg transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600 mb-4">AI analyzes past cases to predict outcomes and success rates for your specific legal situation.</p>
            <button className="text-purple-600 hover:underline">Try Now →</button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 px-16">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4 italic">"The AI legal assistant helped me understand my tenant rights in Hindi, which made a huge difference for my family."</p>
            <div className="font-semibold text-gray-800">Ramesh K., Delhi</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4 italic">"I was able to generate an employment discrimination complaint in minutes instead of paying thousands for a lawyer."</p>
            <div className="font-semibold text-gray-800">Priya S., Mumbai</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4 italic">"The case prediction feature helped me understand my chances of success before pursuing legal action."</p>
            <div className="font-semibold text-gray-800">Vikram J., Bangalore</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-purple-100 mb-8">Take the first step towards resolving your legal challenges with our AI-powered platform.</p>
        <div className="space-x-4">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50">
            Get Legal Help Now →
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Generate Documents 📄
          </button>
        </div>
      </div>
    </div>
  );
};

export default NyaaysathiLandingPage;