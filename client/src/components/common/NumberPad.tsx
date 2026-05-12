import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, X, GripVertical, Check } from 'lucide-react';

interface NumberPadProps {
  onInput: (value: string) => void;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
}

const NumberPad = ({ onInput, onClose, onConfirm, title = "Enter Amount" }: NumberPadProps) => {
  const [currentValue, setCurrentValue] = useState('');

  const handleKeyPress = (key: string) => {
    let newValue = currentValue;
    if (key === 'DELETE') {
      newValue = currentValue.slice(0, -1);
    } else if (key === '.') {
      if (!currentValue.includes('.')) {
        newValue = currentValue + '.';
      }
    } else {
      newValue = currentValue + key;
    }
    setCurrentValue(newValue);
    onInput(newValue);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DELETE'];

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className="fixed bottom-24 right-6 z-[80] w-72 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden select-none"
    >
      {/* Header / Drag Handle */}
      <div className="p-4 bg-gray-50 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-gray-100">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{title}</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white rounded-lg transition-all">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Display */}
      <div className="p-6 bg-white text-right">
        <div className="text-3xl font-black text-gray-900 tracking-tight">
          {currentValue || '0'}
          <span className="animate-pulse text-green-600 ml-1">|</span>
        </div>
      </div>

      {/* Keypad */}
      <div className="p-4 grid grid-cols-3 gap-2 bg-gray-50/50">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className={`h-14 rounded-2xl font-black text-xl flex items-center justify-center transition-all ${
              key === 'DELETE' 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'bg-white text-gray-900 hover:bg-green-600 hover:text-white shadow-sm'
            }`}
          >
            {key === 'DELETE' ? <Delete className="w-6 h-6" /> : key}
          </button>
        ))}
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="col-span-3 h-14 bg-green-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition-all mt-2"
          >
            Confirm <Check className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-3 text-center bg-white">
        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Draggable Accessibility Tool
        </p>
      </div>
    </motion.div>
  );
};

export default NumberPad;
