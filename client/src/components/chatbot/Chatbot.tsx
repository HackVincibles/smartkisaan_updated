import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Mic } from 'lucide-react';
import apiClient from '@/api/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am Kisan Sahayak. How can I help you with your farming or buying today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      // Simulate AI response (or call real Gemini API via backend)
      // In a real implementation: const res = await apiClient.post('/ai/chat', { message: inputText });
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getMockResponse(inputText),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  const getMockResponse = (input: string) => {
    const text = input.toLowerCase();
    if (text.includes('price') || text.includes('mandi')) return 'Current wheat prices in your region are around ₹2,450/quintal. Trends suggest a 2% rise next week.';
    if (text.includes('weather')) return 'Expect moderate rainfall in Nashik over the next 48 hours. Secure your harvested crops.';
    if (text.includes('sell')) return 'To sell your crops, go to the "Create Listing" section and upload photos. I can help you grade them!';
    return "That's interesting! I'm learning more about farming every day. Can you tell me more or ask about prices, weather, or selling?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="mb-4 w-[400px] max-w-[90vw] h-[600px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg flex items-center gap-2">
                    Kisan Sahayak <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">AI Assistant Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-green-600 text-white rounded-br-none shadow-lg shadow-green-100' 
                      : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-xs font-bold text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 pl-4 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all font-medium"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                <span>Supports Hindi & English</span>
                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                <span>Powered by Gemini</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-green-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};

export default Chatbot;
