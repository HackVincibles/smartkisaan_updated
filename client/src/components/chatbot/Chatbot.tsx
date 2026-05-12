import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Mic, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe,
  ArrowRight,
  Maximize2,
  ChevronDown
} from 'lucide-react';
// @ts-ignore
import apiClient from '../../services/api';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Protocol Initialized. I am your Kissan Copilot. I have access to real-time Mandi telemetry and regional weather patterns. How shall we optimize your trade today?', 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulation of premium AI logic
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockResponse(inputText),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1200);
    } catch (error) {
      console.error('Neural Link Error:', error);
      setIsLoading(false);
    }
  };

  const getMockResponse = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('price') || text.includes('mandi')) return 'Analysis of 42 regional Mandi nodes shows a Bullish trend for Wheat at ₹2,510/qtl. I recommend listing within the next 24 hours for maximum yield.';
    if (text.includes('weather')) return 'Telemetry suggests a 15% probability of unseasonal precipitation in the Nashik-Malshej corridor. Ensure your storage nodes are moisture-sealed.';
    if (text.includes('sell')) return 'Market liquidity is high. I can initialize a trade protocol for your Wheat inventory immediately. Shall we proceed with the verified buyer pool?';
    return "I am processing your request through the Smart-Kissan Knowledge Graph. Could you specify if you require market telemetry, logistics routing, or asset valuation?";
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] font-sans">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
            className="mb-6 w-[450px] max-w-[90vw] h-[650px] bg-white/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white flex flex-col overflow-hidden"
          >
            {/* High-Fidelity Header */}
            <div className="p-8 bg-gray-900 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-tertiary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-tertiary/20">
                      <Cpu size={28} className="fill-current" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-4 border-gray-900 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                      Kissan <span className="text-tertiary not-italic">Copilot</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-tertiary">Gemini Pro Encrypted</span>
                      <div className="w-1 h-1 rounded-full bg-white/20"></div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck size={10} className="text-success" /> Trusted Node
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMinimized(true)}
                    className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                  >
                    <ChevronDown size={20} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Decorative Pulse Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary rounded-full blur-[80px] opacity-20 -mr-32 -mt-32"></div>
            </div>

            {/* Premium Message Feed */}
            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-gray-50/30 scroll-smooth">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] gap-2`}>
                    <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-gray-900 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 italic px-2">
                      {msg.sender === 'user' ? 'Operator' : 'AI Copilot'} • {format(msg.timestamp, 'HH:mm')}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 h-1.5 bg-tertiary rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Syncing Knowledge Graph...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Input Command */}
            <div className="p-8 bg-white border-t border-gray-100">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Execute command or ask..."
                  className="w-full pl-6 pr-16 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-tertiary focus:outline-none transition-all font-medium text-gray-900 shadow-inner group-hover:bg-gray-100/50"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-xl"
                >
                  <Send size={18} />
                </motion.button>
              </div>
              
              <div className="mt-6 flex items-center justify-between px-2">
                <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-tertiary" /> Region: MP-Central
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                  <span>v4.0 Protocol</span>
                </div>
                <div className="flex items-center gap-2 text-tertiary hover:text-tertiary/70 cursor-pointer transition-colors">
                   <Mic size={14} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Voice link</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Activation Portal */}
      <motion.button
        layoutId="chatbot-trigger"
        onClick={() => {
            if (isMinimized) setIsMinimized(false);
            else setIsOpen(!isOpen);
        }}
        className={`group relative w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen && !isMinimized ? 'bg-error text-white rotate-90 scale-90' : 'bg-gray-900 text-white hover:scale-110 active:scale-95'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen && !isMinimized ? (
            <X size={32} strokeWidth={2.5} />
        ) : (
            <div className="relative">
                <MessageCircle size={32} strokeWidth={2.5} className={isMinimized ? 'opacity-50' : ''} />
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-tertiary rounded-full border-2 border-gray-900 animate-pulse"></span>
                )}
            </div>
        )}
      </motion.button>
      
      {/* Minimized Overlay Label */}
      {isMinimized && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-24 bottom-5 px-6 py-3 bg-gray-900 text-white rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl border border-white/10 pointer-events-none"
          >
            Assistant Active <span className="text-tertiary ml-2">•</span>
          </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
