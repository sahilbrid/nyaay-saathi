import React, { useState } from 'react';
import axios from 'axios';

const LegalAidCaseInput = () => {
  const [inputMethod, setInputMethod] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [caseAnalysis, setCaseAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (inputMethod === 'text') {
        response = await axios.post('http://localhost:5000/understand_case', {
          text: textInput
        });
      } else {
        const formData = new FormData();
        formData.append('audio', audioFile);
        
        response = await axios.post('http://localhost:5000/understand_case', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setCaseAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze case. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Legal Aid Case Understanding</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Input Method:</label>
        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => setInputMethod('text')}
            className={`px-4 py-2 rounded ${
              inputMethod === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Text Input
          </button>
          <button 
            type="button"
            onClick={() => setInputMethod('audio')}
            className={`px-4 py-2 rounded ${
              inputMethod === 'audio' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Audio Input
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {inputMethod === 'text' ? (
          <textarea 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your legal case in detail..."
            className="w-full p-2 border rounded mb-4 h-32"
            required
          />
        ) : (
          <div className="mb-4">
            <input 
              type="file" 
              accept="audio/*"
              onChange={handleAudioUpload}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          {isLoading ? 'Analyzing...' : 'Understand My Case'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {caseAnalysis && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Case Analysis Result</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(caseAnalysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LegalAidCaseInput;