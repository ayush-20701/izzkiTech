import React from 'react';

const QuizSetup = ({ 
  topic, 
  setTopic, 
  numQuestions, 
  setNumQuestions, 
  totalTime, 
  setTotalTime, 
  isGenerating, 
  generationError, 
  onGenerateQuestions 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          AI Quiz Generator
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Topic *
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., World History, Science, Mathematics"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Time (minutes)
            </label>
            <select
              value={totalTime / 60}
              onChange={(e) => setTotalTime(parseInt(e.target.value) * 60)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>

          {generationError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {generationError}
            </div>
          )}

          <button
            onClick={onGenerateQuestions}
            disabled={isGenerating}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Questions...' : 'Generate Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;