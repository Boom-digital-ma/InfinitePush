'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getGitHubCommits, triggerGitHubBuild, getProjects } from '@/app/actions/projectActions';
import { useSearchParams, useRouter } from 'next/navigation';
import { GitBranch, GitCommit, Settings, AlertCircle } from 'lucide-react';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

function CommitsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<any>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isBuildParamsOpen, setIsBuildParamsOpen] = useState<{ sha: string } | null>(null);

  useEffect(() => {
    if (projectId) fetchData();
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
    const is_mandatory = formData.get('is_mandatory') === 'true';
    
    setIsActionLoading(true);
    const result = await triggerGitHubBuild(project.id, sha, version, channel, is_mandatory);
    if (result.success) {
      setIsBuildParamsOpen(null);
      alert('Build triggered successfully!');
      router.push(`/dashboard/history?projectId=${project.id}`);
    } else {
      alert('Error: ' + result.error);
    }
    setIsActionLoading(false);
  }

  if (!projectId) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans">
      <header className="flex justify-between items-center text-slate-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Source Pipeline</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Repository: <span className="font-mono text-blue-600 font-bold">{project?.github_repo || 'Not Connected'}</span></p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">
          <GitBranch size={14} /> main branch
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {!project?.github_repo ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Settings size={40} className="text-slate-200" />
            <p className="text-slate-400 text-sm font-medium max-w-xs">No GitHub repository connected to this project yet.</p>
            <button onClick={() => router.push(`/dashboard/history?projectId=${projectId}`)} className="text-blue-600 font-bold text-sm hover:underline">Go to Settings →</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {commits.length === 0 ? (
              <div className="p-20 text-center text-slate-400 text-sm font-medium italic">Searching for commits...</div>
            ) : (
              commits.map((c) => (
                <div key={c.sha} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-slate-100">
                      <GitCommit size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm leading-tight mb-1">{c.commit.message}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        <span className="font-bold text-slate-500">{c.commit.author.name}</span> • {new Date(c.commit.author.date).toLocaleDateString()} • <span className="font-mono">{c.sha.substring(0, 7)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsBuildParamsOpen({ sha: c.sha })}
                    className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                  >
                    Build & Push
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isBuildParamsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900 font-sans">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-2">Build Configuration</h2>
            <p className="text-slate-500 text-xs mb-8 leading-relaxed font-medium">Configure build for commit <span className="font-mono font-bold text-slate-900">{isBuildParamsOpen.sha.substring(0, 7)}</span></p>
            
            <form action={handleGitBuild} className="space-y-5 text-slate-900">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Release Tag</label>
                <input name="version" type="text" required placeholder="e.g., 1.0.5" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold outline-none focus:border-blue-500 bg-slate-50/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Channel</label>
                <select name="channel" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold bg-white">
                  <option value="production">Production</option>
                  <option value="beta">Beta</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Force Update</span>
                </div>
                <input name="is_mandatory" type="checkbox" value="true" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsBuildParamsOpen(null)} className="flex-grow py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:bg-blue-700 transition-colors">
                  {isActionLoading ? 'Requesting Build...' : 'Confirm & Build'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommitsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center flex flex-col items-center gap-4 text-slate-300">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-300"></div>
      <p className="text-sm font-semibold uppercase tracking-widest">Loading Repository</p>
    </div>}>
      <CommitsContent />
    </Suspense>
  );
}
