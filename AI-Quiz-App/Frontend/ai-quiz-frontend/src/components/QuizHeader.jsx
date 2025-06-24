import React from 'react';

const QuizHeader = ({ 
  currentQuestion, 
  totalQuestions, 
  topic, 
  timeLeft 
}) => {
  const getTimerClass = () => {
    if (timeLeft <= 5) return 'bg-red-100 text-red-600';
    if (timeLeft <= 10) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-gray-600 font-medium">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <div className="text-sm text-purple-600 font-medium">
            Topic: {topic}
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${getTimerClass()}`}>
          <span>⏱️</span>
          <span>{timeLeft}s</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizHeader;