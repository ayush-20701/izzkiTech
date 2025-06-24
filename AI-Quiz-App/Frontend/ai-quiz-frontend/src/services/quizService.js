// Service for handling quiz API calls
const API_BASE_URL = 'http://localhost:5000/api';

export const quizService = {
  // Generate questions from the backend
  generateQuestions: async (topic, numQuestions) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          numQuestions: numQuestions
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server Error: ${response.status}`);
      }

      if (!data.success || !data.questions) {
        throw new Error('Invalid response from server');
      }

      return data.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      
      if (error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
      } else {
        throw new Error(error.message || 'Failed to generate questions. Please try again.');
      }
    }
  },

  // Check server health
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};