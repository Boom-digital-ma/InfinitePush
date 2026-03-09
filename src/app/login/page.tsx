'use client';

import React, { useState } from 'react';
import { login, signup } from '@/app/actions/authActions';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = isLogin ? await login(formData) : await signup(formData);
      
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result?.success) {
        setMessage({ type: 'success', text: result.success });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white mx-auto mb-4 text-xl">IP</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {isLogin ? 'Welcome back' : 'Start for free'}
          </h1>
          <p className="text-slate-500">
            {isLogin ? 'Log in to manage your app updates.' : 'Create your InfinitePush account.'}
          </p>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-6 border ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-100 text-red-700' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
          }`}>
            {message.type === 'error' ? '⚠️ ' : '✅ '}{message.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="nabil@example.com" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
