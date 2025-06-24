const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-2 max-w-xs">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium">
          AI
        </div>
        
        {/* Typing indicator */}
        <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            AI is typing...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;