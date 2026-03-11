'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjects } from '@/app/actions/projectActions';
import { signOut, getUserProfile } from '@/app/actions/authActions';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  History, 
  GitCommitHorizontal, 
  Plus, 
  LogOut, 
  Box,
  ChevronRight,
  ShieldCheck,
  User,
  BookOpen
} from 'lucide-react';
import { ProjectWizard } from '@/components/dashboard/ProjectWizard';
import { PageLoader, LoadingDots } from '@/components/ui/Loading';

interface Project {
  id: string;
  name: string;
}

interface UserProfile {
  email: string;
  subscription_status: string;
  plan_name: string;
}

function DashboardSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    const [projectsResult, profileResult] = await Promise.all([
      getProjects(),
      getUserProfile()
    ]);

    if (projectsResult.projects) {
      setProjects(projectsResult.projects);
      if (!projectId && projectsResult.projects.length > 0) {
        router.push(`${pathname}?projectId=${projectsResult.projects[0].id}`);
      }
    }

    if (profileResult.profile) {
      setProfile(profileResult.profile);
    }

    setIsLoading(false);
  }

  const navLinks = [
    { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Git Builds', href: '/dashboard/commits', icon: GitCommitHorizontal },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 px-2">
            <Box className="text-blue-600" size={20} strokeWidth={2} />
            <span className="font-semibold text-lg tracking-tight text-slate-900">InfinitePush</span>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-6 overflow-y-auto">
          {/* Profile / Plan Section */}
          <div className="px-3 py-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <User size={16} />
              </div>
              <div className="overflow-hidden min-h-[32px] flex flex-col justify-center">
                {isLoading ? (
                  <div className="flex items-center h-4">
                    <div className="w-12 h-2 bg-slate-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-900 truncate leading-none mb-1">{profile?.email}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        profile?.subscription_status === 'active' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {profile?.plan_name || 'FREE'}
                      </span>
                      {profile?.subscription_status === 'active' && (
                        <ShieldCheck size={12} className="text-blue-600" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isLoading && profile?.subscription_status !== 'active' && (
              <Link 
                href="https://infinitepush.lemonsqueezy.com/checkout/buy/20b2385a-c584-4dce-89de-3c1394887d48" 
                target="_blank"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-blue-200"
              >
                <Plus size={14} className="rotate-45" />
                Upgrade to Pro
              </Link>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects</p>
            </div>
            <div className="space-y-0.5">
              {isLoading ? (
                <div className="px-3 py-4">
                  <LoadingDots />
                </div>
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
                    <span className="truncate">{p.name}</span>
                    {projectId === p.id && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                  </Link>
                ))
              )}
              <button 
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors w-full text-left mt-1"
              >
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

        <div className="px-4 mb-4 space-y-1">
          <Link
            href="/dashboard/help"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              pathname === '/dashboard/help' 
                ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} strokeWidth={2} />
            Help & Docs
          </Link>
          <button 
            onClick={() => signOut()} 
            className="w-full px-3 py-2 text-slate-400 hover:text-red-600 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-3"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {showWizard && (
        <ProjectWizard onClose={() => {
          setShowWizard(false);
          fetchData();
        }} />
      )}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Suspense fallback={<PageLoader />}>
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
