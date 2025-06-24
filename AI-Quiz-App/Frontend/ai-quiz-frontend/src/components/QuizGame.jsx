import React from 'react';
import QuizHeader from './QuizHeader';
import QuestionDisplay from './QuestionDisplay';
import NextButton from './NextButton';

const QuizGame = ({ 
  questions,
  currentQuestion,
  selectedAnswer,
  topic,
  timeLeft,
  onAnswerClick,
  onNextClick
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <QuizHeader 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          topic={topic}
          timeLeft={timeLeft}
        />

        <QuestionDisplay 
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswer}
          onAnswerClick={onAnswerClick}
        />

        <NextButton 
          selectedAnswer={selectedAnswer}
          isLastQuestion={currentQuestion === questions.length - 1}
          onNextClick={onNextClick}
        />
      </div>
    </div>
  );
};

export default QuizGame;