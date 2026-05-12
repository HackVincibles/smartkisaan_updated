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
  ChevronRight
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
      content: 'Namaste! I am your SmartKissan AI Advisor. How can I help you today?',
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

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await farmerService.getAIAdvice(input);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.advice,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Advice failed:', error);
      toast.error('Failed to get AI advice');
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Market Prices', icon: TrendingUp, query: 'What are the current market prices for Wheat in Rajasthan?' },
    { label: 'Weather Forecast', icon: CloudRain, query: 'Will it rain in Jaipur next week?' },
    { label: 'Crop Disease', icon: Leaf, query: 'My tomato leaves are turning yellow. What should I do?' },
    { label: 'Fertilizer Advice', icon: HelpCircle, query: 'Which fertilizer is best for Organic Rice?' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary-600" />
            SmartKissan AI Advisor
          </h1>
          <p className="text-sm text-gray-500">Your digital partner for smarter farming</p>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
        {/* Chat Area */}
        <div className="flex-1 card flex flex-col bg-white dark:bg-dark-200">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.type === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-300'
                    }`}>
                      {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-dark-300 dark:text-gray-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-300 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-100 dark:bg-dark-300 rounded-tl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-dark-300 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about farming..."
              className="flex-1 input bg-gray-50 dark:bg-dark-100 border-none shadow-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary p-2 w-10 h-10 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Quick Actions / Tips */}
        <div className="w-full md:w-64 space-y-4">
          <div className="card p-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-3">Quick Queries</h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(action.query);
                    // Automatically send after a small delay
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-300 border border-gray-100 dark:border-dark-300 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <action.icon className="w-4 h-4 text-primary-600" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{action.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-500 truncate">{action.query}</p>
                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold">Market Insight</h3>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              Wheat prices are expected to rise by 5% next month due to supply constraints. Consider holding your stock if possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdvisor;
