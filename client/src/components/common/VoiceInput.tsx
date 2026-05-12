import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onResult: (text: string) => void;
  language?: 'en-IN' | 'hi-IN';
}

const VoiceInput = ({ onResult, language = 'en-IN' }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onResult]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      if (!recognition) {
        toast.error('Speech recognition not supported in this browser.');
        return;
      }
      recognition.start();
      setIsListening(true);
      toast.info('Listening...');
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`p-4 rounded-2xl transition-all flex items-center justify-center gap-3 ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-xl shadow-red-100' 
          : 'bg-green-50 text-green-600 hover:bg-green-100'
      }`}
      title={isListening ? 'Stop Listening' : 'Start Voice Input'}
    >
      {isListening ? (
        <>
          <MicOff className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">Stop</span>
        </>
      ) : (
        <>
          <Mic className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">Speak</span>
        </>
      )}
    </button>
  );
};

export default VoiceInput;
