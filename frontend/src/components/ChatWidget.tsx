import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, HelpCircle } from 'lucide-react';
import type { SupportedLanguage } from '../data/translations';

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api');

type Message = {
  text: string;
  isUser: boolean;
};

const CHAT_TRANSLATIONS: Record<SupportedLanguage, { greeting: string; placeholder: string; disclaimer: string; title: string; subtitle: string }> = {
  en: {
    greeting: "Hi, I can help explain your rights and general legal terms. I can't give specific legal advice or look up your case, but I can help you understand what's going on. What would you like to know?",
    placeholder: "Ask a question about your rights...",
    disclaimer: "This chatbot gives general information, not legal advice. For specific cases, consult a lawyer or call NALSA at 15100.",
    title: "Legal Rights Assistant",
    subtitle: "अधिकार सहायक | Adalat Companion"
  },
  hi: {
    greeting: "नमस्ते, मैं आपके अधिकारों और सामान्य कानूनी शब्दों को समझने में आपकी मदद कर सकता हूँ। मैं विशिष्ट कानूनी सलाह नहीं दे सकता, लेकिन प्रक्रिया समझने में आपकी सहायता करूँगा। आप क्या जानना चाहते हैं?",
    placeholder: "अपने कानूनी अधिकारों के बारे में पूछें...",
    disclaimer: "यह चैटबॉट केवल सामान्य जानकारी प्रदान करता है, कानूनी सलाह नहीं। विशिष्ट मामले के लिए वकील से संपर्क करें या 15100 पर कॉल करें।",
    title: "कानूनी अधिकार सहायक",
    subtitle: "अधिकार सहायक | अदालत साथी"
  },
  ta: {
    greeting: "வணக்கம், உங்கள் உரிமைகள் மற்றும் பொதுவான சட்ட விதிமுறைகளை எளிமையாக விளக்க நான் உதவ முடியும். நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
    placeholder: "உங்கள் உரிமைகள் பற்றி கேள்வி கேளுங்கள்...",
    disclaimer: "இந்த சாட்பாட் பொதுவான தகவல்களை மட்டுமே வழங்குகிறது, சட்ட ஆலோசனை அல்ல. இலவச சட்ட உதவிக்கு 15100 என்ற எண்ணை அழைக்கவும்.",
    title: "சட்ட உரிமைகள் உதவியாளர்",
    subtitle: "உரிமை உதவியாளர் | அதாலத் தோழன்"
  },
  te: {
    greeting: "నమస్కారం, మీ హక్కులు మరియు సాధారణ చట్టపరమైన నిబంధనలను అర్థం చేసుకోవడంలో నేను మీకు సహాయపడగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
    placeholder: "మీ చట్టపరమైన హక్కుల గురించి అడగండి...",
    disclaimer: "ఈ చాట్‌బాట్ సాధారణ సమాచారాన్ని మాత్రమే అందిస్తుంది, చట్టపరమైన సలహా కాదు. ఉచిత న్యాయ సహాయం కోసం 15100కు కాల్ చేయండి.",
    title: "చట్టపరమైన హక్కుల సహాయకుడు",
    subtitle: "హక్కుల సహాయకుడు | అదాలత్ కంపానియన్"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಹಕ್ಕುಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಕಾನೂನು ಪದಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    placeholder: "ನಿಮ್ಮ ಕಾನೂನು ಹಕ್ಕುಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    disclaimer: "ಈ ಚಾಟ್‌ಬಾಟ್ ಸಾಮಾನ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ. ಉಚಿತ ಕಾನೂನು ಸಹಾಯಕ್ಕಾಗಿ 15100 ಗೆ ಕರೆ ಮಾಡಿ.",
    title: "ಕಾನೂನು ಹಕ್ಕುಗಳ ಸಹಾಯಕ",
    subtitle: "ಹಕ್ಕುಗಳ ಸಹಾಯಕ | ಅದಾಲತ್ ಕಂಪ್ಯಾನಿಯನ್"
  },
  bn: {
    greeting: "নমস্কার, আমি আপনার অধিকার এবং সাধারণ আইনি পরিভাষা বুঝতে সাহায্য করতে পারি। আমি নির্দিষ্ট আইনি পরামর্শ দিতে পারি না, তবে কী ঘটছে তা বুঝতে সাহায্য করতে পারি। আপনি কী জানতে চান?",
    placeholder: "আপনার অধিকার সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন...",
    disclaimer: "এই চ্যাটবটটি কেবল সাধারণ তথ্য সরবরাহ করে, আইনি পরামর্শ নয়। নির্দিষ্ট মামলার জন্য 15100 নম্বরে NALSA-তে কল করুন।",
    title: "আইনি অধিকার সহকারী",
    subtitle: "অধিকার সহায়ক | আদালত কম্প্যানিয়ন"
  },
  ml: {
    greeting: "നമസ്കാരം, നിങ്ങളുടെ അവകാശങ്ങളും പൊതുവായ നിയമ പദങ്ങളും ലളിതമായി മനസ്സിലാക്കാൻ ഞാൻ സഹായിക്കാം. പ്രത്യേക നിയമോപദേശം നൽകാൻ കഴിയില്ലെങ്കിലും കാര്യങ്ങൾ വ്യക്തമാക്കാൻ ഞാൻ കൂടെയുണ്ട്. നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?",
    placeholder: "നിങ്ങളുടെ നിയമപരമായ അവകാശങ്ങളെക്കുറിച്ച് ചോദിക്കൂ...",
    disclaimer: "ഈ ചാറ്റ്ബോട്ട് പൊതുവായ വിവരങ്ങൾ മാത്രമാണ് നൽകുന്നത്, ഇത് നിയമോപദേശമല്ല. സൗജന്യ നിയമ സഹായത്തിനായി 15100 ൽ വിളിക്കുക.",
    title: "നിയമ സഹായ ചാറ്റ്",
    subtitle: "കക്ഷി സഹായം | അദാലത്ത് സാഥി"
  }
};

export default function ChatWidget({ lang = 'en' }: { lang?: SupportedLanguage }) {
  const tChat = CHAT_TRANSLATIONS[lang] || CHAT_TRANSLATIONS.en;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: tChat.greeting,
      isUser: false
    }
  ]);

  // Update greeting when lang changes if only greeting is present
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && !prev[0].isUser) {
        return [{ text: tChat.greeting, isUser: false }];
      }
      return prev;
    });
  }, [lang]);
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
                <h3 className="font-bold text-sm font-serif">{tChat.title}</h3>
                <p className="text-[10px] text-slate-300">{tChat.subtitle}</p>
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
              {tChat.disclaimer}
            </p>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={tChat.placeholder}
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
