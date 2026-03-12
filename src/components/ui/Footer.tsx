import React from 'react';
import { Rocket, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 shadow-sm">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">InfinitePush</span>
            </a>
            <p className="max-w-xs text-sm text-slate-500 leading-relaxed mb-6">
              The high-performance, GDPR-ready alternative to Ionic Appflow. 
              Deploy live updates using your own Supabase infrastructure.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit border border-emerald-100">
              <ShieldCheck className="w-3 h-3" />
              Data Ownership Guaranteed
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="/#features" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="/login" className="hover:text-blue-600 transition-colors">Get Started</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="/terms#refund" className="hover:text-blue-600 transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a 
                  href="mailto:infinitepush.app@proton.me" 
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 InfinitePush. All rights reserved. Built for Capacitor developers worldwide.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
