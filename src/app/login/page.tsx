'use client';

import React, { useState } from 'react';
import { login, signup } from '@/app/actions/authActions';
import { Box, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      
      if (result && 'error' in result && result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result && 'success' in result && result.success) {
        setMessage({ type: 'success', text: result.success as string });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white w-full max-w-[440px] rounded-3xl shadow-xl shadow-slate-200/60 p-10 border border-slate-200/60">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-200">
            <Box size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {isLogin ? 'Enter your credentials to access your dashboard' : 'Join InfinitePush and start deploying live updates'}
          </p>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-semibold mb-6 border animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-100 text-red-700' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}>
            {message.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-sm bg-slate-50/50" 
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-sm bg-slate-50/50" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLogin ? 'Sign In' : 'Get Started'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already a member?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-600 font-bold hover:underline transition-all"
            >
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
