import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';

const ChatInterface = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: `Welcome ${user.name}! I'm your HR assistant. I can help you with leave applications, checking your balance, company policies, and more. How can I assist you today?`,
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    const userMsg = { 
      sender: 'user', 
      text: messageText,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://chatbot-backend-4-puvp.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        onLogout();
        return;
      }

      const data = await res.json();
      const botMsg = { 
        sender: 'bot', 
        text: data.reply || data.error,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again or contact IT support if the problem persists.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        sender: 'bot', 
        text: `Chat cleared! How can I help you, ${user.name}?`,
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md flex flex-col h-[75vh]">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">HR Assistant</h3>
              <p className="text-sm text-green-600">● Online</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map((msg, i) => (
            <Message 
              key={i} 
              message={msg} 
              isUser={msg.sender === 'user'} 
              userName={user.name}
            />
          ))}
          {loading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
};

export default ChatInterface;