import React from 'react';

const QuizResults = ({ 
  score, 
  totalQuestions, 
  topic, 
  questions, 
  userAnswers, 
  onRestartQuiz 
}) => {
  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Not bad! 👌";
    return "Keep practicing! 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Quiz Complete!</h1>
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-purple-600">{score}</div>
          <div className="text-gray-600 text-lg">out of {totalQuestions}</div>
        </div>
        <div className="text-center text-2xl mb-4">{getScoreMessage()}</div>
        <div className="text-center text-lg text-gray-600 mb-8">
          You got {((score / totalQuestions) * 100).toFixed(0)}% correct on {topic}!
        </div>
        
        {/* Detailed Results */}
        <div className="mb-8 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Results:</h3>
          {questions.map((question, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 mb-2">
                {index + 1}. {question.question}
              </div>
              <div className="space-y-1">
                <div className={`${userAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: {userAnswers[index] !== null ? String.fromCharCode(65 + userAnswers[index]) + '. ' + question.options[userAnswers[index]] : 'No answer (Time up)'}
                </div>
                {userAnswers[index] !== question.correct && (
                  <div className="text-green-600">
                    Correct answer: {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onRestartQuiz} 
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Create New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;