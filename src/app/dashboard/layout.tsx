'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjects } from '@/app/actions/projectActions';
import { signOut } from '@/app/actions/authActions';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  History, 
  GitCommitHorizontal, 
  Plus, 
  LogOut, 
  Box,
  ChevronRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

function DashboardSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setIsLoading(true);
    const result = await getProjects();
    if (result.projects) {
      setProjects(result.projects);
      if (!projectId && result.projects.length > 0) {
        router.push(`${pathname}?projectId=${result.projects[0].id}`);
      }
    }
    setIsLoading(false);
  }

  const navLinks = [
    { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Git Builds', href: '/dashboard/commits', icon: GitCommitHorizontal },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
      <div className="p-6 mb-4">
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <Box className="text-blue-600" size={20} strokeWidth={2} />
          <span className="font-semibold text-lg tracking-tight text-slate-900">InfinitePush</span>
        </Link>
      </div>
      
      <nav className="flex-grow px-4 space-y-6 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects</p>
          </div>
          <div className="space-y-0.5">
            {isLoading ? (
              <div className="px-3 py-2 animate-pulse bg-slate-50 rounded-lg h-9"></div>
            ) : (
              projects.map((p) => (
                <Link
                  key={p.id}
                  href={`${pathname}?projectId=${p.id}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    projectId === p.id 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {p.name}
                  {projectId === p.id && <ChevronRight size={14} className="text-slate-400" />}
                </Link>
              ))
            )}
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors w-full text-left">
              <Plus size={14} /> New Project
            </button>
          </div>
        </div>

        {projectId && (
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Engine</p>
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={`${link.href}?projectId=${projectId}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => signOut()} 
          className="w-full px-3 py-2 text-slate-400 hover:text-red-600 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-3"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="w-64 fixed h-full bg-white border-r border-slate-200"></div>}>
        <DashboardSidebar />
      </Suspense>
      <main className="pl-64 min-h-screen">
        <div className="p-10 w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
