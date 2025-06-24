const Message = ({ message, isUser }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          isUser ? 'bg-blue-500' : 'bg-gray-500'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>
        
        {/* Message bubble */}
        <div className={`px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-sm' 
            : 'bg-gray-200 text-gray-800 rounded-bl-sm'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </div>
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp || Date.now())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;