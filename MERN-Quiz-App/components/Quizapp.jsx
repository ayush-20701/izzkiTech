import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer effect
  useEffect(() => {
    if (quizCompleted || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, quizCompleted, selectedAnswer]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    // Record null answer for timeout and move to next question
    const newAnswers = [...userAnswers, null];
    setUserAnswers(newAnswers);
    moveToNextQuestion();
  };

  const handleAnswerClick = (answerIndex) => {
    // Allow changing selection before clicking next
    setSelectedAnswer(answerIndex);
  };

  const handleNextClick = () => {
    // Record the answer and move to next question
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const getScoreMessage = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Not bad! 👌";
    return "Keep practicing! 💪";
  };

  const getTimerClass = () => {
    if (timeLeft <= 5) return "timer-critical";
    if (timeLeft <= 10) return "timer-warning";
    return "timer-normal";
  };

  if (quizCompleted) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Quiz Complete!</h1>
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-indigo-600">{score}</div>
            <div className="text-gray-600 text-lg">out of {questions.length}</div>
          </div>
          <div className="text-center text-2xl mb-4">{getScoreMessage()}</div>
          <div className="text-center text-lg text-gray-600 mb-8">
            You got {((score / questions.length) * 100).toFixed(0)}% correct!
          </div>
          
          {/* Detailed Results */}
          <div className="mb-8">
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
            onClick={restartQuiz} 
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${
              timeLeft <= 5 ? 'bg-red-100 text-red-600' : 
              timeLeft <= 10 ? 'bg-yellow-100 text-yellow-600' : 
              'bg-green-100 text-green-600'
            }`}>
              <span>⏱️</span>
              <span>{timeLeft}s</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3 mb-8">
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-semibold mr-3 text-indigo-600">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Next Button - appears after selecting an answer */}
        {selectedAnswer !== null && (
          <div className="text-center">
            <div className="mb-4 text-sm text-gray-600">
              You can change your answer before proceeding
            </div>
            <button
              onClick={handleNextClick}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;