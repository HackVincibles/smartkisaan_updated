import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium">{text}</p>
    </div>
  );
}
