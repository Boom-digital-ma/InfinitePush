'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjectAnalytics, getProjects } from '@/app/actions/projectActions';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#64748b'];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      router.push('/dashboard');
      return;
    }
    fetchData();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{project?.name} / Analytics</h1>
        <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest font-black">Performance Metrics</p>
      </header>

      <div className="flex border-b border-slate-200 mb-8">
        <Link href="/dashboard" className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all">Deployment History</Link>
        <Link href={`/dashboard/commits?projectId=${projectId}`} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all">GitHub Commits</Link>
        <button className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-blue-600 text-blue-600">Usage Analytics</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Daily Installs Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Daily Installations (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="installs" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Pie Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8">Platform Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.platformStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics?.platformStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full shadow-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">IP</div>
          <span className="font-bold text-lg tracking-tighter">InfinitePush</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 font-bold transition-all">← Dashboard</Link>
        </nav>
      </aside>

      <main className="flex-grow pl-64 p-10 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregating Data</p>
        </div>}>
          <AnalyticsContent />
        </Suspense>
      </main>
    </div>
  );
}
