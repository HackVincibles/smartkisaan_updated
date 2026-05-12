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
  Droplets,
  Cpu,
  Workflow,
  Layers,
  Activity,
  ArrowRight,
  RefreshCcw,
  Terminal,
  Scan,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { toast } from 'react-hot-toast';

const ChatbotAdvisor = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      type: 'bot',
      content: 'SYNERGY PROTOCOL INITIALIZED. I AM YOUR NEURAL AGRICULTURAL ADVISOR. I HAVE SYNCHRONIZED YOUR HARVEST METADATA WITH GLOBAL MANDI VECTORS. HOW SHALL WE OPTIMIZE YOUR YIELD TODAY?',
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
        content: response.data.advice || response.data.content || response.data,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Advice failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "CONNECTION ERROR: NEURAL LINK INTERRUPTED. RETRYING MARKET DATA SYNCHRONIZATION...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Market Delta', icon: TrendingUp, query: 'Analyze Wheat price trajectory in Rajasthan cluster.', color: 'emerald' },
    { label: 'Meteorological Scan', icon: CloudRain, query: 'Predict precipitation impact on soil moisture for Jaipur region.', color: 'indigo' },
    { label: 'Bio-Defense Scan', icon: ShieldCheck, query: 'Identify pathogens causing chlorosis in tomato foliage.', color: 'emerald' },
    { label: 'Nutrient Optimization', icon: Droplets, query: 'Calibrate NPK ratios for Organic Basmati refinement.', color: 'indigo' }
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-12 pb-16 fade-in">
      {/* Neural Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-4 relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            NEURAL COPILOT v8.4.2 [OPERATIONAL]
          </div>
          <h1 className="text-6xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Neural <span className="not-italic text-primary">Advisor.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Synchronizing global <span className="text-gray-950 font-black italic">market intelligence</span> with regional yield telemetry. Your sovereign operational partner.
          </p>
        </div>
        
        <div className="flex gap-6 relative z-10">
          <button 
            onClick={() => {
              setMessages([messages[0]]);
              toast.success('SYNERGY RESET');
            }}
            className="p-6 bg-white border border-gray-100 rounded-[2rem] text-gray-400 hover:text-error transition-all shadow-xl shadow-gray-200/50 group"
          >
            <RefreshCcw size={28} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
          <div className="hidden lg:flex items-center gap-6 px-10 py-6 bg-gray-950 text-white rounded-[2rem] shadow-2xl shadow-gray-950/20">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">MANDI CORE SYNCED</span>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[12rem] font-black italic tracking-tighter">AI.BOT</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden px-4">
        {/* Terminal Interface */}
        <div className="flex-1 stitch-card flex flex-col overflow-hidden relative bg-white shadow-2xl shadow-gray-200/50">
          {/* Terminal Header Decor */}
          <div className="h-14 bg-gray-950 flex items-center justify-between px-8 shrink-0">
            <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-error/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-warning/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-success/50"></div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">SESSION_ID: SK-NET-7742</div>
            <Terminal size={16} className="text-white/20" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 md:p-16 space-y-12 scroll-smooth bg-gray-50/10 relative">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-8 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gray-950 text-white' 
                        : 'bg-primary text-white border border-primary/20'
                    }`}>
                      {msg.type === 'user' ? <User size={24} /> : <Bot size={24} />}
                    </div>
                    
                    <div className={`space-y-4 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-10 rounded-[2.5rem] text-lg font-medium leading-relaxed shadow-2xl border ${
                        msg.type === 'user' 
                          ? 'bg-gray-950 text-white border-gray-800 rounded-tr-none' 
                          : 'bg-white text-gray-950 border-gray-100 rounded-tl-none italic'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 px-4 italic">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center animate-pulse shadow-2xl border border-primary/20">
                    <Bot size={24} />
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 rounded-tl-none shadow-2xl flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic ml-4">COMPUTING RESPONSE...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Surface */}
          <div className="p-12 border-t border-gray-50 bg-white">
            <form onSubmit={handleSend} className="relative flex items-center group/input">
              <div className="absolute left-10 text-gray-300 group-focus-within/input:text-primary transition-colors">
                <Scan size={24} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT COMMAND OR QUERY FOR NEURAL ANALYSIS..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] py-10 pl-24 pr-32 text-sm font-black text-gray-950 uppercase tracking-widest focus:ring-8 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-gray-300 outline-none italic"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-6 p-8 bg-gray-950 text-white rounded-[2rem] hover:bg-primary transition-all shadow-2xl shadow-gray-200 disabled:opacity-50 disabled:shadow-none group/send overflow-hidden"
              >
                <div className="relative z-10">
                    <Send size={24} className="group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/send:opacity-100 transition-opacity"></div>
              </button>
            </form>
            <div className="flex justify-between items-center mt-10 px-6">
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 italic">
                <Database size={16} className="text-primary" /> POWERED BY <span className="text-gray-950 underline underline-offset-4 decoration-primary decoration-2">SMART-KISSAN NEURAL CORE</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-primary italic">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  TELEMETRY SYNCED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Side-Deck */}
        <div className="w-full lg:w-[450px] space-y-10 flex flex-col">
          <div className="stitch-card p-12 space-y-12 bg-white shadow-2xl shadow-gray-200/50 flex flex-col h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-4 px-4 py-1.5 bg-secondary/10 text-secondary rounded-xl text-[9px] font-black uppercase tracking-[0.4em] italic border border-secondary/10 w-fit">
                <Zap size={14} /> CONTEXTUAL TRIGGERS
              </div>
              <h3 className="text-3xl font-black text-gray-950 tracking-tighter italic">Operational <span className="not-italic text-secondary">Presets.</span></h3>
              <p className="text-gray-400 font-medium text-sm italic">Execute high-priority analysis protocols via rapid triggers.</p>
            </div>
            
            <div className="space-y-6 flex-1">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(undefined, action.query)}
                  className="w-full text-left p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group/action relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 mb-4 relative z-10">
                    <div className={`w-12 h-12 bg-gray-950 text-white rounded-xl flex items-center justify-center shadow-xl group-hover/action:rotate-12 transition-all duration-700`}>
                      <action.icon size={20} className={`text-${action.color}-400`} />
                    </div>
                    <span className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] italic">{action.label}</span>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <p className="text-xs text-gray-400 font-black italic truncate pr-8 uppercase tracking-widest">{action.query}</p>
                    <ArrowRight size={18} className="text-gray-300 group-hover/action:translate-x-2 group-hover/action:text-primary transition-all" />
                  </div>
                  {/* Hover Background Decor */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover/action:opacity-100 transition-opacity"></div>
                </button>
              ))}
            </div>

            <div className="pt-10 mt-auto border-t border-gray-50">
                <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-16 bg-primary/20 backdrop-blur-3xl rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-6 transition-transform">
                            <ShieldCheck size={36} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic tracking-tighter leading-none">Smart <span className="not-italic text-primary">Sentinel.</span></h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                                I scan pending contracts for <span className="text-white font-black italic">liquidity risk factors</span>. 
                            </p>
                        </div>
                        <button className="w-full py-6 bg-white text-gray-950 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-primary hover:text-white transition-all shadow-2xl">
                            ACTIVATE FULL SHIELD
                        </button>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <div className="absolute top-0 left-0 p-8 text-white/5">
                        <Workflow size={120} />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdvisor;
