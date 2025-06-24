import { useState } from 'react';

const ChatInput = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    onSendMessage(input.trim());
    setInput('');
  };

  const quickActions = [
    "Check my leave balance",
    "Apply for leave",
    "Check leave status",
    "Company policies"
  ];

  return (
    <div className="border-t bg-white p-4">
      {/* Quick Actions */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInput(action)}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200"
              disabled={loading}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about leaves, policies, or anything HR related..."
          disabled={loading}
          maxLength={500}
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center space-x-2"
          disabled={loading || !input.trim()}
        >
          <span>Send</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
      
      {/* Character count */}
      <div className="text-xs text-gray-400 mt-1 text-right">
        {input.length}/500
      </div>
    </div>
  );
};

export default ChatInput;