import './App.css'
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMsg = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMsg]);
    setInput('');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-4 flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className={`p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l p-2 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="bg-blue-500 text-white px-4 rounded-r" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
