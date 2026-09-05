import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, ShieldCheck, HelpCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

type Message = {
  text: string;
  isUser: boolean;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi, I can help explain your rights and general legal terms. I can't give specific legal advice or look up your case, but I can help you understand what's going on. What would you like to know?",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    const newMessages = [...messages, { text: userText, isUser: true }];
    setMessages(newMessages);
    setIsTyping(true);

    // Format history for the API (skip the first greeting message to keep it clean, or include it. Let's include it)
    const history = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      text: msg.text
    }));

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        message: userText,
        history: history
      });

      setMessages([...newMessages, { text: res.data.text, isUser: false }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages([...newMessages, { text: "I'm having trouble right now, please try again or call the NALSA helpline at 15100 for immediate help.", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-900 text-amber-400 rounded-full shadow-lg hover:bg-blue-800 transition-transform hover:scale-105 flex items-center justify-center border-2 border-amber-500 z-50"
          aria-label="Open Rights Chat"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 flex flex-col overflow-hidden z-50 max-h-[80vh]">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 border-b-4 border-amber-500 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-white p-0.5 border border-amber-500 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Adalat Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm font-serif">Legal Rights Assistant</h3>
                <p className="text-[10px] text-slate-300">अधिकार सहायक | Adalat Companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 min-h-[300px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm shadow-sm ${
                  msg.isUser 
                    ? 'bg-blue-900 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm bg-white text-slate-800 border border-slate-200 rounded-bl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 px-4 py-2 border-t border-amber-200 flex items-start gap-2">
            <HelpCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-tight font-semibold text-amber-900">
              This chatbot gives general information, not legal advice. For specific cases, consult a lawyer or call NALSA at <strong>15100</strong>.
            </p>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about your rights..."
              className="flex-1 bg-slate-100 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-amber-500"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
