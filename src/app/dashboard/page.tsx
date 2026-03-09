'use client';

import React, { useState, useEffect } from 'react';
import { connectProject, getProjects, getDeployments, deployZip, rollbackToVersion, getGitHubCommits, triggerGitHubBuild, updateProjectGitHub } from '@/app/actions/projectActions';
import { signOut } from '@/app/actions/authActions';

interface Deployment {
  id: string;
  version: string;
  build_number: number;
  created_at: string;
  status: string;
  channel: string;
  is_mandatory: boolean;
  install_count?: number;
}

interface Project {
  id: string;
  name: string;
  client_supabase_url: string;
  subscription_status: string;
  github_repo?: string;
  github_token?: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<'history' | 'git'>('history');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'production' | 'beta' | 'staging'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchDeployments(selectedProject.id);
      if (selectedProject.github_repo) {
        fetchCommits(selectedProject.id);
      } else {
        setCommits([]);
      }
    }
  }, [selectedProject]);

  async function fetchProjects() {
    setIsLoading(true);
    const result = await getProjects();
    if (result.projects) {
      setProjects(result.projects);
      if (result.projects.length > 0 && !selectedProject) {
        setSelectedProject(result.projects[0]);
      }
    }
    setIsLoading(false);
  }

  async function fetchDeployments(projectId: string) {
    const result = await getDeployments(projectId);
    if (result.deployments) {
      setDeployments(result.deployments);
    } else {
      setDeployments([]);
    }
  }

  async function fetchCommits(projectId: string) {
    const result = await getGitHubCommits(projectId);
    if (result.commits) {
      setCommits(result.commits);
    } else {
      setCommits([]);
    }
  }

  async function handleConnectProject(formData: FormData) {
    setIsActionLoading(true);
    setError(null);
    const result = await connectProject(formData);
    if (result.success) {
      await fetchProjects();
      setIsNewProjectOpen(false);
    } else {
      setError(result.error || 'Failed to connect project');
    }
    setIsActionLoading(false);
  }

  async function handleDeploy(formData: FormData) {
    if (!selectedProject) return;
    setIsActionLoading(true);
    setError(null);
    const result = await deployZip(selectedProject.id, formData);
    if (result.success) {
      await fetchDeployments(selectedProject.id);
      setIsDeployOpen(false);
      setSelectedFile(null);
    } else {
      setError(result.error || 'Deployment failed');
    }
    setIsActionLoading(false);
  }

  async function handleRollback(deploymentId: string) {
    if (!selectedProject) return;
    if (!confirm('Are you sure? This will rollback the live version.')) return;
    setIsActionLoading(true);
    const result = await rollbackToVersion(selectedProject.id, deploymentId);
    if (result.success) await fetchDeployments(selectedProject.id);
    setIsActionLoading(false);
  }

  async function handleGitBuild(sha: string) {
    if (!selectedProject) return;
    const version = prompt('Enter version tag (e.g., 1.0.5):');
    if (!version) return;
    
    setIsActionLoading(true);
    const result = await triggerGitHubBuild(selectedProject.id, sha, version, 'production');
    if (result.success) {
      alert('GitHub build triggered successfully! It will appear in history once finished.');
    } else {
      alert('Error: ' + result.error);
    }
    setIsActionLoading(false);
  }

  async function handleUpdateGitHub(formData: FormData) {
    if (!selectedProject) return;
    setIsActionLoading(true);
    setError(null);
    const result = await updateProjectGitHub(selectedProject.id, formData);
    if (result.success) {
      await fetchProjects();
      setIsGitModalOpen(false);
    } else {
      setError(result.error || 'Failed to update GitHub info');
    }
    setIsActionLoading(false);
  }

  const filteredDeployments = deployments.filter(d => activeTab === 'all' || d.channel === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col border-r border-white/5">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-900/50">IP</div>
          <span className="font-black text-2xl tracking-tighter">InfinitePush</span>
        </div>
        
        <div className="text-[10px] text-slate-500 mb-6 tracking-[0.3em] uppercase font-black px-2 opacity-50">Active Projects</div>
        <nav className="space-y-2 flex-grow overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all duration-300 group ${
                selectedProject?.id === p.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-2' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{p.name}</span>
                {selectedProject?.id === p.id && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
              </div>
            </button>
          ))}
          <button 
            onClick={() => setIsNewProjectOpen(true)}
            className="w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/20 mt-8"
          >
            + New Connection
          </button>
        </nav>

        <button onClick={() => signOut()} className="mt-auto pt-8 border-t border-white/5 text-slate-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all text-left px-4">
          Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 max-w-7xl mx-auto w-full overflow-y-auto">
        {!selectedProject ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-28 h-24 bg-blue-600/5 text-blue-600 rounded-[3rem] flex items-center justify-center text-6xl mb-10 shadow-inner">⚡</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Ready to sync?</h2>
            <button 
              onClick={() => setIsNewProjectOpen(true)}
              className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
            >
              Initialize First Project
            </button>
          </div>
        ) : (
          <>
            <header className="flex justify-between items-start mb-16">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{selectedProject.name}</h1>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-200/50 shadow-sm font-mono">Connected</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 font-mono text-sm font-bold opacity-60">
                  <span>{selectedProject.client_supabase_url}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-slate-200/50 p-1.5 rounded-[1.5rem] flex gap-1 border border-slate-200/50 shadow-inner">
                  <button 
                    onClick={() => setView('history')}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-white text-blue-600 shadow-xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    History
                  </button>
                  <button 
                    onClick={() => setView('git')}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'git' ? 'bg-white text-blue-600 shadow-xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Git Build
                  </button>
                </div>
                <button 
                  onClick={() => setIsDeployOpen(true)}
                  disabled={isActionLoading}
                  className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
                >
                  🚀 Manual Deploy
                </button>
              </div>
            </header>

            {view === 'history' ? (
              <>
                <div className="flex gap-1 mb-10 bg-slate-200/40 p-1.5 rounded-2xl w-fit border border-slate-200/50">
                  {(['all', 'production', 'beta', 'staging'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab ? 'bg-white text-blue-600 shadow-xl shadow-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-200/60 overflow-hidden shadow-2xl shadow-slate-200/40">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                        <th className="px-10 py-6">Release</th>
                        <th className="px-10 py-6">Channel</th>
                        <th className="px-10 py-6 text-center">Installs</th>
                        <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDeployments.length === 0 ? (
                        <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-300 font-black italic tracking-widest uppercase text-xs">Environment Empty</td></tr>
                      ) : (
                        filteredDeployments.map((d) => (
                          <tr key={d.id} className="hover:bg-blue-50/20 transition-all group">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-4">
                                <span className="font-black text-slate-900 text-2xl tracking-tighter">{d.version}</span>
                                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">#{d.build_number}</span>
                                {d.is_mandatory && <span className="bg-red-50 text-red-600 text-[9px] font-black uppercase px-3 py-1 rounded-lg border border-red-100 animate-pulse shadow-sm">CRITICAL</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{new Date(d.created_at).toLocaleString()}</div>
                            </td>
                            <td className="px-10 py-8">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm ${d.channel === 'production' ? 'bg-purple-50 text-purple-600 border-purple-100' : d.channel === 'beta' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{d.channel}</span>
                            </td>
                            <td className="px-10 py-8 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="text-2xl font-black text-slate-900 tracking-tighter">{d.install_count || 0}</span>
                                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Devices</span>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                              {d.status !== 'active' ? (
                                <button onClick={() => handleRollback(d.id)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Rollback</button>
                              ) : (
                                <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 shadow-sm font-mono font-bold">LIVE NOW</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {!selectedProject.github_repo ? (
                  <div className="bg-white p-16 rounded-[3rem] border border-slate-200/60 text-center shadow-2xl">
                    <div className="text-6xl mb-8">🐙</div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight text-slate-900 font-mono">NO_GIT_LINK</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto font-bold opacity-70">Enable automated builds by linking your source code repository.</p>
                    <button 
                      onClick={() => setIsGitModalOpen(true)}
                      className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
                    >
                      Connect GitHub Repository
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-[3rem] border border-slate-200/60 overflow-hidden shadow-2xl">
                    <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                      <h2 className="font-black text-slate-900 tracking-tight text-lg uppercase tracking-widest">{selectedProject.github_repo}</h2>
                      <button onClick={() => setIsGitModalOpen(true)} className="text-[10px] bg-slate-900 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest">Update Settings</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {commits.length === 0 ? (
                        <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs italic">Fetching commits...</div>
                      ) : (
                        commits.map((c) => (
                          <div key={c.sha} className="px-10 py-8 flex items-center justify-between hover:bg-blue-50/20 transition-all group">
                            <div className="flex gap-6 items-center text-slate-900">
                              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🏗️</div>
                              <div>
                                <div className="font-black text-lg tracking-tight mb-1">{c.commit.message}</div>
                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <span className="text-blue-600">{c.commit.author.name}</span>
                                  <span className="opacity-30">•</span>
                                  <span>{new Date(c.commit.author.date).toLocaleDateString()}</span>
                                  <span className="opacity-30">•</span>
                                  <span className="font-mono">{c.sha.substring(0, 7)}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleGitBuild(c.sha)}
                              className="bg-white border-2 border-slate-900 text-slate-900 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                            >
                              Build & Deploy
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal: GitHub Setup */}
      {isGitModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-16 transform transition-all animate-in fade-in zoom-in duration-500">
            <h2 className="text-4xl font-black mb-2 tracking-tighter">GitHub Integration</h2>
            <p className="text-slate-500 mb-12 text-lg font-bold opacity-60 font-mono text-[14px]">CONFIG_SOURCE_CODE</p>
            
            <form action={handleUpdateGitHub} className="space-y-8 font-black">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Repo ID (Owner/Repo)</label>
                <input name="github_repo" type="text" required defaultValue={selectedProject.github_repo} placeholder="e.g., Boom-digital-ma/InfinitePush" className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900 text-xl shadow-inner bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Personal Access Token (PAT)</label>
                <input name="github_token" type="password" required defaultValue={selectedProject.github_token} placeholder="ghp_..." className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-mono text-lg shadow-sm" />
                <p className="text-[9px] text-slate-400 mt-4 font-black uppercase tracking-[0.1em] italic opacity-60">Requires 'repo' and 'workflow' scopes.</p>
              </div>
              <div className="flex gap-6 pt-10">
                <button type="button" onClick={() => setIsGitModalOpen(false)} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-2 border-slate-100 hover:bg-slate-50 transition-all opacity-50">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-200">Save Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Release (Manual) */}
      {isDeployOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 transform transition-all animate-in fade-in zoom-in duration-500">
            <h2 className="text-4xl font-black mb-2 tracking-tighter">Direct Push</h2>
            <p className="text-slate-500 mb-12 text-lg font-bold opacity-60">Upload a pre-built bundle directly to <strong>{selectedProject.name}</strong>.</p>
            
            <form action={handleDeploy} className="space-y-10">
              <div className="grid grid-cols-2 gap-8 font-black">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Version Tag</label>
                  <input name="version" type="text" required placeholder="1.0.4" className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900 text-xl shadow-inner bg-slate-50/50" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Environment</label>
                  <select name="channel" className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900 bg-slate-50/50 text-xl shadow-inner">
                    <option value="production">Production</option>
                    <option value="beta">Beta</option>
                    <option value="staging">Staging</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-inner">
                <div className="pr-10">
                  <h4 className="font-black text-base text-slate-900 uppercase tracking-widest text-[12px]">Critical Hotfix</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed italic opacity-70">Bypass background checks and force restart.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-125">
                  <input name="is_mandatory" type="checkbox" value="true" className="sr-only peer" />
                  <div className="w-16 h-8 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-7 after:transition-all shadow-inner transition-colors"></div>
                </label>
              </div>
              
              <div className={`relative border-4 border-dashed rounded-[3rem] p-16 text-center transition-all cursor-pointer group ${selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/10'}`}>
                <input name="file" type="file" required accept=".zip" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">{selectedFile ? '✅' : '📦'}</div>
                <div className="font-black text-slate-900 text-2xl tracking-tighter">{selectedFile ? selectedFile.name : 'Select update.zip bundle'}</div>
                <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.2em]">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drop production build here'}</p>
              </div>

              {isActionLoading && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-6 duration-700">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="text-blue-600 animate-pulse font-mono font-bold">PUSHING_TO_INFRASTRUCTURE</span>
                    <span className="text-slate-400 italic">BYOS CORE v1</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <div className="h-full bg-blue-600 rounded-full animate-progress-indeterminate shadow-lg shadow-blue-400"></div>
                  </div>
                </div>
              )}

              <div className="flex gap-6 pt-6">
                <button type="button" disabled={isActionLoading} onClick={() => { setIsDeployOpen(false); setSelectedFile(null); }} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-2 border-slate-100 hover:bg-slate-50 transition-all opacity-50 hover:opacity-100">Cancel</button>
                <button type="submit" disabled={isActionLoading || !selectedFile} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-30 shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-2 active:scale-95">Commit & Deploy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New BYOS Connection */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 transform transition-all animate-in fade-in zoom-in duration-500">
            <h2 className="text-4xl font-black mb-2 tracking-tighter font-black">Initialize BYOS</h2>
            <p className="text-slate-500 mb-12 text-lg font-bold opacity-60">Connect your target infrastructure to the control plane.</p>
            
            <form action={handleConnectProject} className="space-y-8 font-black">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 font-black">Project Title</label>
                <input name="name" type="text" required placeholder="App Name" className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-black text-slate-900 text-xl shadow-inner bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 font-black">Supabase URL</label>
                <input name="client_supabase_url" type="url" required placeholder="https://xxx.supabase.co" className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-mono text-lg shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 font-black">Service Role Key</label>
                <input name="client_supabase_key" type="password" required placeholder="eyJh..." className="w-full px-6 py-5 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-mono text-lg shadow-sm" />
              </div>
              <div className="flex gap-6 pt-10">
                <button type="button" onClick={() => setIsNewProjectOpen(false)} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border-2 border-slate-100 hover:bg-slate-50 transition-all opacity-50">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2">Establish Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
