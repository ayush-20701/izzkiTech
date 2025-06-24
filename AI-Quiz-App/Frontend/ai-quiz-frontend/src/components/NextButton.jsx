import React from 'react';

const NextButton = ({ 
  selectedAnswer, 
  isLastQuestion, 
  onNextClick 
}) => {
  if (selectedAnswer === null) return null;

  return (
    <div className="text-center">
      <div className="mb-4 text-sm text-gray-600">
        You can change your answer before proceeding
      </div>
      <button
        onClick={onNextClick}
        className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

export default NextButton;