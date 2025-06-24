import React, { useState, useEffect } from 'react';
import QuizSetup from './QuizSetup';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
import { quizService } from '../services/quizService';
import { useQuizTimer } from '../hooks/useQuizTimer';

const QuizApp = () => {
  // App state management
  const [appState, setAppState] = useState('setup'); // 'setup', 'playing', 'completed'
  
  // Setup states
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [totalTime, setTotalTime] = useState(300); // in seconds
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Game states
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Calculate time per question
  const timePerQuestion = Math.floor(totalTime / numQuestions);

  // Custom hook for timer management
  useQuizTimer(
    timeLeft,
    setTimeLeft,
    quizStarted,
    appState === 'completed',
    selectedAnswer,
    handleTimeUp,
    timePerQuestion
  );

  // Reset timer when moving to next question
  useEffect(() => {
    if (appState === 'playing') {
      setTimeLeft(timePerQuestion);
    }
  }, [currentQuestion, appState, timePerQuestion]);

  // Handle quiz generation
  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      setGenerationError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const generatedQuestions = await quizService.generateQuestions(topic, numQuestions);
      setQuestions(generatedQuestions);
      setAppState('playing');
      setQuizStarted(true);
      setTimeLeft(timePerQuestion);
    } catch (error) {
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle time up
  function handleTimeUp() {
    const newAnswers = [...userAnswers, null];
    setUserAnswers(newAnswers);
    moveToNextQuestion();
  }

  // Handle answer selection
  const handleAnswerClick = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  // Handle next button click
  const handleNextClick = () => {
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    moveToNextQuestion();
  };

  // Move to next question or complete quiz
  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(timePerQuestion);
    } else {
      setAppState('completed');
      setQuizStarted(false);
    }
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    // Reset all states
    setAppState('setup');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuizStarted(false);
    setTimeLeft(0);
    setQuestions([]);
    setTopic('');
    setGenerationError('');
  };

  // Calculate score
  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index]?.correct ? 1 : 0);
    }, 0);
  };

  // Render based on app state
  switch (appState) {
    case 'setup':
      return (
        <QuizSetup
          topic={topic}
          setTopic={setTopic}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          totalTime={totalTime}
          setTotalTime={setTotalTime}
          isGenerating={isGenerating}
          generationError={generationError}
          onGenerateQuestions={handleGenerateQuestions}
        />
      );

    case 'playing':
      return (
        <QuizGame
          questions={questions}
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          topic={topic}
          timeLeft={timeLeft}
          onAnswerClick={handleAnswerClick}
          onNextClick={handleNextClick}
        />
      );

    case 'completed':
      return (
        <QuizResults
          score={calculateScore()}
          totalQuestions={questions.length}
          topic={topic}
          questions={questions}
          userAnswers={userAnswers}
          onRestartQuiz={handleRestartQuiz}
        />
      );

    default:
      return null;
  }
};

export default QuizApp;