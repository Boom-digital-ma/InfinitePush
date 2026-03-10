'use client';

import React from 'react';

export function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-1.5 py-4">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[999] flex flex-col items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm shadow-blue-200"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm shadow-blue-200"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce shadow-sm shadow-blue-200"></div>
      </div>
      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing data</p>
    </div>
  );
}
