import React from 'react';

const QuestionDisplay = ({ 
  question, 
  selectedAnswer, 
  onAnswerClick 
}) => {
  if (!question) return null;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
        {question.question}
      </h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          
          return (
            <button
              key={index}
              onClick={() => onAnswerClick(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold mr-3 text-purple-600">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default QuestionDisplay;