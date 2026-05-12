import React from 'react';
import { CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';

interface StatusStep {
  label: string;
  time?: string;
  status: 'completed' | 'current' | 'pending';
}

interface StatusTimelineProps {
  steps: StatusStep[];
}

const StatusTimeline = ({ steps }: StatusTimelineProps) => {
  return (
    <div className="space-y-8">
      {steps.map((step, i) => (
        <div key={i} className="relative flex gap-6">
          {i !== steps.length - 1 && (
            <div className={`absolute left-4 top-8 w-0.5 h-full -translate-x-1/2 ${
              step.status === 'completed' ? 'bg-green-600' : 'bg-gray-100'
            }`} />
          )}
          
          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
            step.status === 'completed' ? 'bg-green-600 text-white' : 
            step.status === 'current' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 animate-pulse' : 
            'bg-gray-100 text-gray-300'
          }`}>
            {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
             step.status === 'current' ? <Clock className="w-5 h-5" /> : 
             <div className="w-2 h-2 rounded-full bg-gray-300" />}
          </div>

          <div className="pb-8">
            <h4 className={`text-sm font-black uppercase tracking-widest ${
              step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
            }`}>
              {step.label}
            </h4>
            {step.time && (
              <p className="text-xs font-bold text-gray-400 mt-1">{step.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
