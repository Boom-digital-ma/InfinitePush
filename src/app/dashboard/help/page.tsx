import React from 'react';
import { Database, Github, Smartphone, BookOpen, Info, ShieldCheck } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function HelpPage() {
  const supabaseSQL = `CREATE TABLE IF NOT EXISTS public.infinite_push_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version TEXT NOT NULL,
    build_number BIGINT NOT NULL,
    zip_url TEXT NOT NULL,
    status TEXT DEFAULT 'inactive',
    channel TEXT DEFAULT 'production',
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.infinite_push_deployments ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Access" 
ON public.infinite_push_deployments FOR SELECT 
USING (true);`;

  const githubWorkflow = `name: InfinitePush Deploy
on:
  repository_dispatch:
    types: [infinitepush_deploy]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: \${{ github.event.client_payload.commit_sha }}
      
      - name: Build & Push
        run: |
          npm install && npm run build
          # See our CLI docs for automated upload`;

  const capacitorConfig = `{
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "statsUrl": "https://infinitepush.vercel.app/api/analytics/ping"
    }
  }
}`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configuration Guide</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg text-slate-500">Everything you need to connect your infrastructure to InfinitePush.</p>
      </header>

      <div className="grid gap-12">
        {/* Supabase Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Database size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Supabase (BYOS) Setup</h2>
          </div>
          
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium">
            <p>1. Create a <strong>public</strong> storage bucket named <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-bold">infinite-push</code>.</p>
            <p>2. Execute the following migration in your SQL Editor to prepare the deployments table:</p>
            
            <CodeBlock code={supabaseSQL} filename="supabase_migration.sql" />

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
              <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <strong>Pro Tip:</strong> Using BYOS ensures that your code bundles never touch our servers. You keep 100% ownership of your binary files.
              </p>
            </div>
          </div>
        </section>

        {/* GitHub Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <Github size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">GitHub Automation</h2>
          </div>
          
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium font-medium">
            <p>Connect your repository to trigger builds directly from InfinitePush. You'll need a Personal Access Token (PAT) with <code className="bg-slate-100 px-1 rounded text-slate-900">repo</code> permissions.</p>
            
            <CodeBlock code={githubWorkflow} filename=".github/workflows/deploy.yml" />
          </div>
        </section>

        {/* Capacitor Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">SDK Integration</h2>
          </div>
          
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium">
            <p>Configure your Capacitor app to listen for updates from your InfinitePush endpoint.</p>
            
            <CodeBlock code={capacitorConfig} filename="capacitor.config.json" />

            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 w-fit">
              <ShieldCheck size={14} /> Security verified with Capgo Plugin
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
