import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  CloudRain, 
  TrendingUp, 
  Leaf, 
  MessageCircle,
  HelpCircle,
  Loader2,
  ChevronRight,
  Zap,
  Sparkles,
  Search,
  ShieldCheck,
  Maximize2,
  Globe,
  Wind,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import toast from 'react-hot-toast';

const ChatbotAdvisor = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Namaste! I am your SmartKissan AI Advisor. I have analyzed your recent harvests and regional market trends. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const query = customQuery || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await farmerService.getAIAdvice(query);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.advice,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Advice failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having trouble connecting to the market data engine. Let me try refreshing my knowledge base.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Market Prices', icon: TrendingUp, query: 'Current market prices for Wheat in Rajasthan?', color: 'tertiary' },
    { label: 'Weather Pulse', icon: CloudRain, query: 'Weather forecast for Jaipur next week?', color: 'primary' },
    { label: 'Crop Shield', icon: ShieldCheck, query: 'How to treat yellowing tomato leaves?', color: 'success' },
    { label: 'Soil Health', icon: Droplets, query: 'Best fertilizer for Organic Rice?', color: 'secondary' }
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-8 pb-10 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Sparkles size={12} className="text-primary" />
            <span>Neural Intelligence</span>
            <ChevronRight size={10} />
            <span className="text-primary-600">Farm Advisor</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight italic">Kissan <span className="not-italic text-primary">Copilot</span></h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setMessages([messages[0]]);
              toast.success('Conversation cleared');
            }}
            className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm group"
          >
            <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Chat Main Interface */}
        <div className="flex-1 stitch-card flex flex-col overflow-hidden relative border-none shadow-xl">
          {/* Chat Backdrop Decorative */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-50/30 to-transparent pointer-events-none" />
          
          <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      msg.type === 'user' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-primary text-white'
                    }`}>
                      {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    
                    <div className={`space-y-1.5 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-6 rounded-2xl text-sm font-medium leading-relaxed shadow-sm italic ${
                        msg.type === 'user' 
                          ? 'bg-gray-900 text-white rounded-tr-none not-italic' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-50'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center animate-pulse">
                    <Bot size={20} />
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-gray-50 rounded-tl-none shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-gray-50 bg-white/80 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex items-center">
              <div className="absolute left-6 text-gray-300">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Kissan Copilot anything..."
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-6 pl-16 pr-24 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-primary-50 focus:border-primary-100 transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-3 p-4 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all shadow-xl shadow-primary-200 disabled:opacity-50 disabled:shadow-none group"
              >
                <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
            <div className="flex justify-between items-center mt-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
                Powered by <span className="text-primary">Smart-LLM</span> • Mandi Aware
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-success">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  Live Sync
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-96 space-y-6 flex flex-col">
          <div className="stitch-card p-8 space-y-8">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Zap size={14} className="text-secondary" />
                Contextual Triggers
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">Quick prompts to start analysis</p>
            </div>
            
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, action.query)}
                  className="w-full text-left p-4 rounded-xl bg-gray-50/50 border border-transparent hover:border-primary-100 hover:bg-primary-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 bg-white rounded-lg shadow-sm text-${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{action.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-gray-400 font-bold truncate pr-4">{action.query}</p>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl flex-1">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-white/5">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold italic tracking-tight">Contract <span className="not-italic text-primary">Sentinel</span></h3>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  I can scan your pending bid contracts for risk factors. Try: <span className="text-white italic">"Audit my latest contract"</span>
                </p>
              </div>
              <button className="btn btn-outline w-full py-4 rounded-xl text-[10px] uppercase tracking-widest border-white/10 text-white hover:bg-white hover:text-black">
                Activate Full Shield
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdvisor;
