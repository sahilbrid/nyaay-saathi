import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function LegalAnalysisChatbot() {
  const [caseDescription, setCaseDescription] = useState('');
  const [caseAnalysis, setCaseAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setCaseAnalysis(null);

    try {
      const response = await axios.post('http://localhost:5000/analyze', {
        case_description: caseDescription
      });

      setCaseAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCaseAnalysis = () => {
    if (!caseAnalysis) return null;

    return (
      <div className="bg-gray-50 rounded-xl p-8 mt-8">
        {/* Case Category */}
        <h2 className="text-2xl font-bold text-purple-600 border-b-2 border-purple-500 pb-2 mb-6">
          Case Category: {caseAnalysis.case_category || 'Not Specified'}
        </h2>

        {/* Key Details Section */}
        <section className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Key Details</h3>
          {caseAnalysis.key_details && (
            <div>
              <p><strong>Description:</strong> {caseAnalysis.key_details.description}</p>
              
              {caseAnalysis.key_details.primary_issues && (
                <div className="mt-4">
                  <strong>Primary Issues:</strong>
                  <ul className="list-disc pl-5">
                    {caseAnalysis.key_details.primary_issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {caseAnalysis.key_details.potential_violations && (
                <div className="mt-4">
                  <strong>Potential Violations:</strong>
                  <ul className="list-disc pl-5">
                    {caseAnalysis.key_details.potential_violations.map((violation, index) => (
                      <li key={index}>{violation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Preliminary Risk Assessment */}
        <section className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Preliminary Risk Assessment</h3>
          {caseAnalysis.preliminary_risk_assessment && (
            <div>
              <p><strong>Complexity:</strong> {caseAnalysis.preliminary_risk_assessment.complexity}</p>
              <p><strong>Potential Impact:</strong> {caseAnalysis.preliminary_risk_assessment.potential_impact}</p>
            </div>
          )}
        </section>

        {/* Recommended Next Steps */}
        <section className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Recommended Next Steps</h3>
          {caseAnalysis.recommended_next_steps && (
            <ul className="list-disc pl-5">
              {caseAnalysis.recommended_next_steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Step-by-Step Guidance */}
        <section className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Step-by-Step Guidance</h3>
          {caseAnalysis.step_by_step_guidance && (
            <div>
              {Object.entries(caseAnalysis.step_by_step_guidance).map(([key, value]) => {
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="mb-4">
                      <h4 className="text-lg font-medium text-purple-600 mb-2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <ul className="list-disc pl-5">
                        {value.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return (
                  <p key={key}>
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
                  </p>
                );
              })}
            </div>
          )}
        </section>

        {/* Case Duration */}
        <section className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Case Duration</h3>
          {caseAnalysis.case_duration && (
            <div>
              <p><strong>Duration: </strong>The case will take approximately {caseAnalysis.case_duration}</p>
            </div>
          )}
        </section>

        {/* Legal Clauses */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-500 pb-2 mb-4">Relevant Legal Clauses</h3>
          {caseAnalysis.legal_clauses?.statutes && (
            <div>
              {caseAnalysis.legal_clauses.statutes.map((statute, index) => (
                <div key={index} className="bg-gray-100 border-l-4 border-purple-600 p-4 mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{statute.name}</h4>
                  <p><strong>Explanation:</strong> {statute.explanation}</p>
                  <p><strong>Relevance:</strong> {statute.relevance}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-lg p-8 font-sans">
      <Navbar/>
      <br></br>
      <br></br>
      <div className="text-center mb-8 text-gray-800">
        <h1 className="text-4xl font-bold mb-2 text-purple-600">Case Analyzer</h1>
        <p className="text-gray-600">Get comprehensive legal insights for your case</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-8">
        <textarea 
          value={caseDescription}
          onChange={(e) => setCaseDescription(e.target.value)}
          placeholder="Describe your legal case in detail..."
          rows={6}
          required
          className="w-full p-4 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-600 resize-y text-base"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Case'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      
      {renderCaseAnalysis()}
    </div>
  );
}

export default LegalAnalysisChatbot;