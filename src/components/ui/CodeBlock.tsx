'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-500" />
          {filename && <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">{filename}</span>}
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="p-5 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-[13px] leading-relaxed text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
