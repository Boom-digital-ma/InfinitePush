'use client';

import React, { useState } from 'react';
import { connectProject } from '@/app/actions/projectActions';
import { 
  Box, 
  Database, 
  Smartphone, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Terminal,
  ExternalLink,
  Loader2
} from 'lucide-react';

export function ProjectWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    client_supabase_url: '',
    client_supabase_key: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('client_supabase_url', formData.client_supabase_url);
    data.append('client_supabase_key', formData.client_supabase_key);

    const result = await connectProject(data);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      nextStep(); // Go to onboarding instructions
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / Steps Indicator */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Configure your new app</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50' : 
                  step > i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > i ? <CheckCircle2 size={16} /> : i}
                </div>
                {i < 3 && <div className={`w-12 h-0.5 mx-2 ${step > i ? 'bg-green-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-grow overflow-y-auto p-8">
          
          {/* STEP 1: App Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <Box size={32} />
                </div>
                <h3 className="text-lg font-semibold">Start with a name</h3>
                <p className="text-sm text-slate-500">Give your app a clear name for your dashboard.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. My Awesome Mobile App"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  autoFocus
                />
              </div>

              <div className="pt-4">
                <button 
                  disabled={!formData.name}
                  onClick={nextStep}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                >
                  Continue to Connection <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Supabase (BYOS) */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <Database size={32} />
                </div>
                <h3 className="text-lg font-semibold">Connect your Supabase</h3>
                <p className="text-sm text-slate-500">Provide your Supabase credentials. We'll manage updates directly in your storage.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supabase URL</label>
                  <input 
                    type="url" 
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.client_supabase_url}
                    onChange={(e) => setFormData({...formData, client_supabase_url: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Role Key</label>
                  <input 
                    type="password" 
                    placeholder="eyJhbG..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.client_supabase_key}
                    onChange={(e) => setFormData({...formData, client_supabase_key: e.target.value})}
                  />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Database size={10} /> We encrypt this key. It never leaves our server.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                  Back
                </button>
                <button 
                  disabled={!formData.client_supabase_url || !formData.client_supabase_key || isLoading}
                  onClick={handleSubmit}
                  className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Connect & Install SDK'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SDK Onboarding */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-lg font-semibold text-green-700">App ready for updates!</h3>
                <p className="text-sm text-slate-500">Follow these 3 simple steps to connect your mobile app.</p>
              </div>

              {/* 1. Install & Sync */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} /> 1. Install & Sync
                </label>
                <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-2 font-mono text-xs text-blue-400">
                  <div className="flex items-center justify-between">
                    <span>npm install @capgo/capacitor-updater</span>
                    <button onClick={() => copyToClipboard('npm install @capgo/capacitor-updater')} className="text-slate-500 hover:text-white transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <span>npx cap sync</span>
                    <button onClick={() => copyToClipboard('npx cap sync')} className="text-slate-500 hover:text-white transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Configure Capacitor */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   2. Update capacitor.config.json
                </label>
                <p className="text-[10px] text-slate-500 italic">Add this to your existing config file:</p>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 relative group">
                  <pre className="overflow-x-auto">
{`{
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "statsUrl": "https://infinitepush.vercel.app/api/analytics/ping"
    }
  }
}`}
                  </pre>
                  <button onClick={() => copyToClipboard(`{ "plugins": { "CapacitorUpdater": { "autoUpdate": true, "statsUrl": "https://infinitepush.vercel.app/api/analytics/ping" } } }`)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* 3. Listen for Updates (Optional) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                   3. Listen for events (Recommended)
                </label>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                    Add this to your <code className="bg-slate-200 px-1 rounded text-blue-600">App.tsx</code> or <code className="bg-slate-200 px-1 rounded text-blue-600">main.ts</code> to handle update success:
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-slate-200 font-mono text-[10px] text-slate-700">
                    <pre>
{`import { CapacitorUpdater } from '@capgo/capacitor-updater';

CapacitorUpdater.addListener('updateAvailable', (info) => {
  console.log('Update available:', info.version);
});`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Success Info */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle2 size={12} />
                </div>
                <div className="text-[11px] text-blue-800 leading-relaxed">
                  <strong>Ready to push!</strong> We've prepared your Supabase infrastructure. 
                  Go to the <strong>History</strong> tab, upload a ZIP of your <code className="bg-blue-100 px-1 rounded">dist</code> folder, and watch it go live on your app!
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ExternalLink size={18} />
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
