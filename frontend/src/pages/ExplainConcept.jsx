import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ExplainConcept = () => {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/explain', { concept });
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      setExplanation('Sorry, I couldn\'t fetch an explanation. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Explain This Concept</h1>
      <div className="flex">
        <input
          type="text"
          className="border p-2 w-full"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="Enter a concept you want explained..."
        />
        <button
          className="bg-blue-500 text-white p-2 ml-2"
          onClick={handleExplain}
          disabled={loading}
        >
          {loading ? 'Explaining...' : 'Explain'}
        </button>
      </div>
      {explanation && (
        <div className="mt-4 p-4 border bg-gray-100">
          {explanation}
        </div>
      )}
    </div>
  );
};

export default ExplainConcept;
