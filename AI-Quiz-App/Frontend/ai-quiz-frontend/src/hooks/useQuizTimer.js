import { useEffect, useRef } from 'react';

// Custom hook for managing quiz timer
export const useQuizTimer = (
  timeLeft, 
  setTimeLeft, 
  quizStarted, 
  quizCompleted, 
  selectedAnswer, 
  onTimeUp,
  timePerQuestion
) => {
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Don't start timer if quiz not started, completed, or answer selected
    if (!quizStarted || quizCompleted || selectedAnswer !== null) {
      return;
    }

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizCompleted, selectedAnswer, onTimeUp, timePerQuestion, setTimeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
};