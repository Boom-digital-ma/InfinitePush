'use client';

import React, { useEffect, useState } from 'react';
import { Rocket, ChevronRight, Menu, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="group flex items-center gap-2.5 transition-all">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 group-active:scale-95">
              <Rocket className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Infinite<span className="text-blue-600">Push</span>
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <a 
            href="/#features" 
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
          >
            Features
          </a>
          <a 
            href="/#pricing" 
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600"
          >
            Pricing
          </a>
          
          <div className="mx-2 h-4 w-px bg-slate-200" />

          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <a 
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <a 
              href="/login"
              className="group flex items-center gap-1.5 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
            >
              Get Started
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </nav>

        {/* Mobile Toggle Placeholder */}
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 md:hidden hover:bg-slate-50">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
