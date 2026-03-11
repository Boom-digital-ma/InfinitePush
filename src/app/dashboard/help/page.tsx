'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Database, 
  Github, 
  Smartphone, 
  Info, 
  ShieldCheck, 
  Zap, 
  Server, 
  Code2, 
  ShieldAlert,
  BarChart3,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { getProjects } from '@/app/actions/projectActions';
import { useSearchParams } from 'next/navigation';
import { LoadingDots, PageLoader } from '@/components/ui/Loading';

function HelpContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get('projectId');
  
  const [activeTab, setActiveTab] = useState<'supabase' | 'github' | 'capacitor'>('supabase');
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (projectIdFromUrl) fetchData();
    else setIsLoading(false);
  }, [projectIdFromUrl]);

  async function fetchData() {
    setIsLoading(true);
    const result = await getProjects();
    const found = result.projects?.find((p: any) => p.id === projectIdFromUrl);
    setProject(found || null);
    setIsLoading(false);
  }

  const copyToClipboard = (text: string, type: 'id' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const supabaseSQL = `CREATE TABLE IF NOT EXISTS public.infinite_push_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version TEXT NOT NULL,         -- e.g. '1.0.4'
    build_number BIGINT NOT NULL,  -- GitHub Run Number or Timestamp
    zip_url TEXT NOT NULL,         -- Public URL to the ZIP in Storage
    status TEXT DEFAULT 'inactive', -- 'active' or 'inactive'
    channel TEXT DEFAULT 'production', -- 'production', 'beta', 'staging'
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.infinite_push_deployments ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access (Required for mobile apps to check updates)
CREATE POLICY "Public Read Access" 
ON public.infinite_push_deployments FOR SELECT 
USING (true);`;

  const githubWorkflow = `name: InfinitePush Build & Deploy
run-name: "InfinitePush - v\${{ github.event.client_payload.version }} [\${{ github.event.client_payload.channel }}]"

on:
  repository_dispatch:
    types: [infinitepush_deploy]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.client_payload.commit_sha }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm install

      - name: Build Application
        run: npm run build
        env:
          REACT_APP_UPDATE_CHANNEL: \${{ github.event.client_payload.channel }}
          REACT_APP_PROJECT_ID: \${{ secrets.INFINITEPUSH_PROJECT_ID }}

      - name: Create Update Bundle
        run: |
          cd build # Or 'dist' depending on your framework
          zip -r ../update.zip .
          cd ..

      - name: Deploy via InfinitePush API
        run: |
          curl -X POST "https://infinitepush.vercel.app/api/ci/deploy" \\
            -H "Authorization: Bearer \${{ secrets.INFINITEPUSH_API_KEY }}" \\
            -F "project_id=\${{ secrets.INFINITEPUSH_PROJECT_ID }}" \\
            -F "version=\${{ github.event.client_payload.version }}" \\
            -F "channel=\${{ github.event.client_payload.channel }}" \\
            -F "is_mandatory=\${{ github.event.client_payload.is_mandatory }}" \\
            -F "file=@update.zip"`;

  const capacitorConfig = `import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ...
  plugins: {
    CapacitorUpdater: { autoUpdate: false },
    CapacitorHttp: { enabled: true }
  }
};

export default config;`;

  const appInitialization = `import { CapacitorUpdater } from '@capgo/capacitor-updater';

useEffect(() => {
  // Inform the native engine that the current version is stable
  CapacitorUpdater.notifyAppReady().then(() => {
    // Start your update check logic here
    infinitePushService.checkForUpdates();
  });
}, []);`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans w-full pb-20 text-slate-900">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Implementation Guide</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure your BYOS infrastructure and automation pipelines.</p>
        </div>
        
        {/* Project Credentials Quick Access */}
        {project && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project ID</span>
                <span className="text-xs font-mono font-bold text-slate-700">{project.id.substring(0, 8)}...</span>
              </div>
              <button 
                onClick={() => copyToClipboard(project.id, 'id')}
                className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600"
              >
                {copiedId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">API Key</span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {showApiKey ? project.api_key : '••••••••••••••••'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button 
                  onClick={() => copyToClipboard(project.api_key, 'key')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                  {copiedKey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('supabase')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'supabase' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Database size={14} /> 1. Infrastructure
        </button>
        <button onClick={() => setActiveTab('github')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'github' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Github size={14} /> 2. Automation
        </button>
        <button onClick={() => setActiveTab('capacitor')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'capacitor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Smartphone size={14} /> 3. Mobile SDK
        </button>
      </div>

      <div className="w-full min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <LoadingDots />
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparing Documentation</p>
          </div>
        ) : (
          <>
            {/* TAB: INFRASTRUCTURE */}
            {activeTab === 'supabase' && (
              <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-left-4 duration-300">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Server className="text-blue-600" size={20} /> PostgreSQL Schema
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
                      Your Supabase database serves as the registry for all deployments. Run this SQL to create the mandatory table and security policies.
                    </p>
                    <CodeBlock code={supabaseSQL} filename="infinite_push_registry.sql" />
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Zap className="text-emerald-600" size={20} /> Storage Bucket
                    </h3>
                    <div className="space-y-4 text-sm text-slate-600 font-medium leading-relaxed">
                      <p>InfinitePush requires a dedicated bucket to host your encrypted update bundles:</p>
                      <ul className="list-decimal pl-5 space-y-3 text-slate-900">
                        <li>Create a bucket named <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-bold">infinite-push</code>.</li>
                        <li>Set the bucket to <strong>Public</strong> (required for apps to download bundles).</li>
                        <li>The service role key you provided will handle the uploads during CI/CD.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl">
                    <ShieldCheck size={32} className="mb-4 text-emerald-400" />
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-2">BYOS Security</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">
                      Our architecture ensures <strong>Zero Trust</strong> access to your code. We only store the deployment metadata; your assets never leave your Supabase instance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUTOMATION */}
            {activeTab === 'github' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                      <Github size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">GitHub Actions CI/CD</h3>
                      <p className="text-xs text-slate-500 font-medium">Full pipeline for automated builds and Supabase uploads.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Lock size={14} /> Required Secrets
                      </h4>
                      <ul className="space-y-3">
                        {['SUPABASE_URL', 'INFINITEPUSH_API_KEY', 'INFINITEPUSH_PROJECT_ID'].map(s => (
                          <li key={s} className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-600">{s}</span>
                            <span className="text-emerald-500 font-bold text-[10px]">REQUIRED</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-900">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-900">
                        <Code2 size={14} /> Deployment Flow
                      </h4>
                      <div className="space-y-3 text-[10px] font-bold text-slate-500">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">1</div> BUILD BUNDLE</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">2</div> SEND TO INFINITEPUSH API</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">3</div> REMOTE BYOS UPLOAD</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Production-Ready Workflow</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Copy this file to <code className="bg-slate-100 px-1 rounded">.github/workflows/deploy.yml</code>. It uses our secure API to bridge GitHub with your Supabase.
                    </p>
                    <CodeBlock code={githubWorkflow} filename="deploy.yml" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SDK */}
            {activeTab === 'capacitor' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Smartphone className="text-blue-600" size={20} /> Mobile Implementation
                  </h3>

                  <div className="space-y-10">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. Install core dependencies</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Run this command in your Capacitor project root:</p>
                      <CodeBlock code="npm install @capgo/capacitor-updater @capacitor/app @capacitor/device @capacitor/network @supabase/supabase-js" />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. Native Configuration</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Enable <code className="text-blue-600 font-bold">CapacitorHttp</code> to bypass CORS for analytics and disable native auto-updates.
                      </p>
                      <CodeBlock code={capacitorConfig} filename="capacitor.config.ts" />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">3. Critical Initialization</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Validate the successful launch by calling <code className="text-blue-600 font-bold">notifyAppReady()</code> immediately.
                      </p>
                      <CodeBlock code={appInitialization} filename="App.tsx" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "Single Ping Policy", desc: "Analytics only fire once per deployment ID using localStorage cache.", icon: <ShieldAlert size={18} /> },
                    { title: "Delta Comparison", desc: "Engine compares Native vs Cloud versions before any network activity.", icon: <BarChart3 size={18} /> },
                    { title: "Anti-FlipFlop", icon: <Lock size={18} />, desc: "Update channels are locked at build time to keep testers on track." }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">{item.icon}</div>
                      <h5 className="font-bold text-sm text-slate-900 mb-2">{item.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HelpContent />
    </Suspense>
  );
}
