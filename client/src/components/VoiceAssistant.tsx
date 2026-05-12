import React, { useState } from 'react';
import { Mic, MessageSquare, X, AudioWaveform } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);

  return (
    <>
      {/* Floating Trigger Ball */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="w-16 h-16 bg-gradient-to-tr from-green-600 to-teal-500 rounded-full shadow-2xl flex items-center justify-center text-white relative group"
        >
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          {open ? <X size={24}/> : <Mic size={24}/>}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-80 bg-slate-900 border border-slate-700 rounded-3xl p-6 z-[100] shadow-2xl text-white flex flex-col items-center text-center"
          >
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold mb-4 flex items-center gap-1 border border-emerald-500/20">
               <MessageSquare size={12}/> AI Assistant v1.0
            </div>
            <h3 className="font-bold text-lg mb-2">{listening ? "Listening to audio path..." : "Awaiting Voice Command"}</h3>
            <p className="text-slate-400 text-xs mb-8">Speak queries like "List my produce" or "Search local Mandi rates."</p>
            
            <button 
              onClick={() => setListening(!listening)}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${listening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
               {listening ? <div className="flex items-end gap-1 h-6"><div className="w-1.5 bg-white animate-bounce h-4"/><div className="w-1.5 bg-white animate-bounce h-6"/><div className="w-1.5 bg-white animate-bounce h-3"/></div> : <Mic size={32} />}
            </button>
            {listening && <p className="text-red-400 font-mono text-[10px] mt-4 font-bold tracking-widest animate-pulse">STREAMING LIVE</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
