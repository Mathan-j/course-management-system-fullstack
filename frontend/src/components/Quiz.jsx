import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Quiz = ({ courseId, sectionIndex, lessonIndex }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.post('/generate-quiz', {
          courseId,
          sectionIndex,
          lessonIndex,
        });
        // Assuming the API returns an object with a 'quiz' array
        setQuiz(response.data.quiz || response.data); // Adjust based on actual API response structure
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId !== undefined && sectionIndex !== undefined && lessonIndex !== undefined) {
      fetchQuiz();
    }
  }, [courseId, sectionIndex, lessonIndex]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) return <div className="p-4">Loading quiz...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!quiz || quiz.length === 0) return <div className="p-4">No quiz available for this lesson.</div>;

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      {!showResult ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1} of {quiz.length}</h3>
          <p className="mb-4 text-lg">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 border rounded-md transition-colors duration-200
                  ${selectedAnswer === option ? 'bg-blue-200 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
          <p className="text-xl mb-2">You scored {score} out of {quiz.length} questions correctly.</p>
          <button
            className="mt-4 bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700"
            onClick={() => {
              setScore(0);
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setQuiz(null); // Reset quiz to re-fetch if needed
            }}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
