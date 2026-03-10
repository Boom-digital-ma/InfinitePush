'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjectAnalytics, getProjects, connectProject } from '@/app/actions/projectActions';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Plus, BarChart3 } from 'lucide-react';
import { PageLoader, LoadingDots } from '@/components/ui/Loading';

const COLORS = ['#3b82f6', '#10b981', '#94a3b8'];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  useEffect(() => {
    if (projectId) fetchData();
    else setIsLoading(false);
  }, [projectId]);

  async function fetchData() {
    setIsLoading(true);
    const projectsResult = await getProjects();
    const found = projectsResult.projects?.find((p: any) => p.id === projectId);
    setProject(found || null);

    const stats = await getProjectAnalytics(projectId as string);
    setAnalytics(stats);
    setIsLoading(false);
  }

  async function handleConnectProject(formData: FormData) {
    setIsActionLoading(true);
    const result = await connectProject(formData);
    if (result.success) {
      window.location.reload();
    } else alert(result.error || 'Failed to connect');
    setIsActionLoading(false);
  }

  if (!projectId) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Metrics & Insights</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-sm leading-relaxed">Select a project from the sidebar to view detailed usage statistics and platform distribution.</p>
        <button onClick={() => setIsNewProjectOpen(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Project
        </button>

        {isNewProjectOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in duration-200">
              <h2 className="text-lg font-bold mb-6">Connect New Project</h2>
              <form action={handleConnectProject} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
                  <input name="name" type="text" required placeholder="My Application" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-slate-50/50 font-sans" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supabase URL</label>
                  <input name="client_supabase_url" type="url" required placeholder="https://xxx.supabase.co" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono outline-none focus:border-blue-500 bg-slate-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Service Role Key</label>
                  <input name="client_supabase_key" type="password" required placeholder="eyJ..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono outline-none focus:border-blue-500 bg-slate-50/50" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsNewProjectOpen(false)} className="flex-grow py-2.5 text-sm font-semibold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg">Establish Link</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {isActionLoading && <PageLoader />}
      
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project?.name || 'Loading...'} Overview</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Platform-wide usage and installation metrics.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="col-span-2 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-20">
            <LoadingDots />
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregating Metrics</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-0">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">Daily Installs</h3>
              <div className="h-64 w-full min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={analytics?.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'medium', fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'medium', fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="installs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-0">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">OS Distribution</h3>
              <div className="h-64 w-full min-h-[256px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={analytics?.platformStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics?.platformStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'medium' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AnalyticsContent />
    </Suspense>
  );
}
