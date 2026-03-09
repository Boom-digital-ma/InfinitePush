'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getGitHubCommits, triggerGitHubBuild, getProjects } from '@/app/actions/projectActions';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

interface Project {
  id: string;
  name: string;
  github_repo?: string;
}

function CommitsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isBuildParamsOpen, setIsBuildParamsOpen] = useState<{ sha: string } | null>(null);

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

    if (found?.github_repo) {
      const commitsResult = await getGitHubCommits(projectId as string);
      setCommits(commitsResult.commits || []);
    }
    setIsLoading(false);
  }

  async function handleGitBuild(formData: FormData) {
    if (!project || !isBuildParamsOpen) return;
    const sha = isBuildParamsOpen.sha;
    const version = formData.get('version') as string;
    const channel = formData.get('channel') as string;
    
    setIsActionLoading(true);
    const result = await triggerGitHubBuild(project.id, sha, version, channel);
    if (result.success) {
      setIsBuildParamsOpen(null);
      alert('Build triggered! Check the History tab in a few minutes.');
      router.push('/dashboard');
    } else {
      alert('Error: ' + result.error);
    }
    setIsActionLoading(false);
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
        <h1 className="text-2xl font-bold text-slate-900">{project?.name} / GitHub</h1>
        <p className="text-slate-400 text-xs font-medium mt-1">Source: {project?.github_repo || 'Not connected'}</p>
      </header>

      <div className="flex border-b border-slate-200 mb-8">
        <Link href="/dashboard" className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all">Deployment History</Link>
        <button className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-blue-600 text-blue-600">GitHub Commits</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {!project?.github_repo ? (
          <div className="p-20 text-center text-slate-400 text-sm font-medium">Please connect a GitHub repository in Project Settings.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {commits.length === 0 ? (
              <div className="p-20 text-center text-slate-400 text-sm">No commits found.</div>
            ) : (
              commits.map((c) => (
                <div key={c.sha} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">🏗️</div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-tight">{c.commit.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                        {c.commit.author.name} • {new Date(c.commit.author.date).toLocaleDateString()} • {c.sha.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsBuildParamsOpen({ sha: c.sha })}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50"
                  >
                    Build & Deploy
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isBuildParamsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-2">Build Configuration</h2>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">Launching automated build for commit <strong>{isBuildParamsOpen.sha.substring(0, 7)}</strong>.</p>
            
            <form action={handleGitBuild} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Version Tag</label>
                <input name="version" type="text" required placeholder="e.g., 1.0.5" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm font-bold shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Environment</label>
                <select name="channel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm font-bold bg-white shadow-sm">
                  <option value="production">Production</option>
                  <option value="beta">Beta</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsBuildParamsOpen(null)} className="flex-grow py-3 text-xs font-bold text-slate-400">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700">
                  {isActionLoading ? 'Requesting Build...' : 'Confirm & Build'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function CommitsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">IP</div>
          <span className="font-bold text-lg tracking-tight tracking-tighter">InfinitePush</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50">← Back to Projects</Link>
        </nav>
      </aside>

      <main className="flex-grow pl-64 p-10 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="p-20 text-center">Loading context...</div>}>
          <CommitsContent />
        </Suspense>
      </main>
    </div>
  );
}
