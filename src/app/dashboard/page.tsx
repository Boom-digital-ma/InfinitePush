'use client';

import React, { useState, useEffect } from 'react';
import { connectProject, getProjects, getDeployments, deployZip, rollbackToVersion } from '@/app/actions/projectActions';
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
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'production' | 'beta' | 'staging'>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchDeployments(selectedProject.id);
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
    if (!confirm('Are you sure you want to rollback to this version? This will become the active version for its channel.')) return;
    
    setIsActionLoading(true);
    const result = await rollbackToVersion(selectedProject.id, deploymentId);
    if (result.success) {
      await fetchDeployments(selectedProject.id);
    } else {
      alert('Rollback failed: ' + result.error);
    }
    setIsActionLoading(false);
  }

  const filteredDeployments = deployments.filter(d => 
    activeTab === 'all' || d.channel === activeTab
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 font-bold">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p>Initializing InfinitePush...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/50">IP</div>
          <span className="font-bold text-xl tracking-tighter">InfinitePush</span>
        </div>
        
        <div className="text-[10px] text-slate-500 mb-4 tracking-[0.2em] uppercase font-black px-2 opacity-50">Projects</div>
        <nav className="space-y-1 flex-grow overflow-y-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                selectedProject?.id === p.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedProject?.id === p.id ? 'bg-white' : 'bg-slate-700 group-hover:bg-slate-500'}`}></span>
                {p.name}
              </div>
            </button>
          ))}
          <button 
            onClick={() => setIsNewProjectOpen(true)}
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all border border-blue-500/20 mt-6"
          >
            + New Project
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-slate-500 hover:text-red-400 text-xs font-black uppercase tracking-widest transition-all font-mono">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 max-w-7xl mx-auto w-full">
        {!selectedProject ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-600/5 text-blue-600 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner">✨</div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Infrastructure is yours.</h2>
            <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed tracking-tight">Connect your Supabase instance to start deploying live updates to your mobile apps.</p>
            <button 
              onClick={() => setIsNewProjectOpen(true)}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1"
            >
              Initialize Connection
            </button>
          </div>
        ) : (
          <>
            <header className="flex justify-between items-end mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2 font-black">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedProject.name}</h1>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-200/50">BYOS ACTIVE</span>
                </div>
                <p className="text-slate-400 flex items-center gap-2 font-mono text-sm font-bold">
                  {selectedProject.client_supabase_url}
                </p>
              </div>
              <button 
                onClick={() => setIsDeployOpen(true)}
                disabled={isActionLoading}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
              >
                🚀 New Release
              </button>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-8 bg-slate-200/40 p-1.5 rounded-2xl w-fit border border-slate-200/50">
              {(['all', 'production', 'beta', 'staging'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-xl shadow-slate-200' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Deployments History */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-2xl shadow-slate-200/50">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h2 className="font-black text-slate-900 tracking-tight text-lg uppercase tracking-widest text-[14px]">History</h2>
                <div className="text-[10px] bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-blue-100">
                  {selectedProject.subscription_status}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="px-8 py-5">Version</th>
                      <th className="px-8 py-5">Environment</th>
                      <th className="px-8 py-5">Installs</th>
                      <th className="px-8 py-5">Timestamp</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDeployments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-bold italic tracking-tight uppercase tracking-widest text-xs">
                          Empty Environment
                        </td>
                      </tr>
                    ) : (
                      filteredDeployments.map((d) => (
                        <tr key={d.id} className="hover:bg-blue-50/20 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <span className="font-black text-slate-900 text-lg tracking-tighter">{d.version}</span>
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">#{d.build_number}</span>
                              {d.is_mandatory && (
                                <span className="bg-red-50 text-red-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-red-100 animate-pulse">Critical</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                              d.channel === 'production' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                              d.channel === 'beta' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {d.channel}
                            </span>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center text-[10px] text-blue-600 border border-blue-100">{d.install_count || 0}</span>
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Installs</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-slate-500 text-xs font-bold font-mono">
                            {new Date(d.created_at).toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            {d.status !== 'active' ? (
                              <button 
                                onClick={() => handleRollback(d.id)}
                                disabled={isActionLoading}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
                              >
                                Rollback
                              </button>
                            ) : (
                              <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest opacity-100 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal: New Release */}
      {isDeployOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 transform transition-all animate-in fade-in zoom-in duration-300 border border-white/20">
            <h2 className="text-3xl font-black mb-2 tracking-tight">New Release</h2>
            <p className="text-slate-500 mb-10 text-sm font-medium">Deploy a new version to your <strong>{selectedProject.name}</strong> users.</p>
            
            {error && <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm mb-8 border border-red-100 font-bold animate-shake">⚠️ {error}</div>}

            <form action={handleDeploy} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Version Tag</label>
                  <input name="version" type="text" required placeholder="1.0.4" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 text-lg" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Target Environment</label>
                  <select name="channel" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 bg-white text-lg">
                    <option value="production">Production</option>
                    <option value="beta">Beta</option>
                    <option value="staging">Staging</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest text-[11px]">Mandatory Update</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Force immediate installation upon next check.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input name="is_mandatory" type="checkbox" value="true" className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer group ${
                selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-500'
              }`}>
                <input 
                  name="file" 
                  type="file" 
                  required 
                  accept=".zip" 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {selectedFile ? '📦' : '☁️'}
                </div>
                <div className="font-black text-slate-900 text-lg tracking-tight">
                  {selectedFile ? selectedFile.name : 'Select update.zip bundle'}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drag and drop or click to browse'}
                </p>
              </div>

              {isActionLoading && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-blue-600 animate-pulse">Pushing to infrastructure...</span>
                    <span className="text-slate-400 italic font-mono">BYOS ENGINE</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <div className="h-full bg-blue-600 rounded-full animate-progress-indeterminate shadow-lg shadow-blue-400"></div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  disabled={isActionLoading}
                  onClick={() => { setIsDeployOpen(false); setSelectedFile(null); }} 
                  className="flex-grow py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-30"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isActionLoading || !selectedFile} 
                  className="flex-grow py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  {isActionLoading ? 'Uploading...' : 'Deploy Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Connect BYOS */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 transform transition-all animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-2 tracking-tight tracking-tighter">Initialize BYOS</h2>
            <p className="text-slate-500 mb-10 text-sm font-medium tracking-tight">Link your target Supabase infrastructure to start managing deployments.</p>
            
            {error && <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-sm mb-8 border border-red-100 font-bold">⚠️ {error}</div>}

            <form action={handleConnectProject} className="space-y-6 font-bold">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 font-black">App Project Name</label>
                <input name="name" type="text" required placeholder="Production App" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-black text-slate-900 shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Supabase Endpoint URL</label>
                <input name="client_supabase_url" type="url" required placeholder="https://xxx.supabase.co" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono text-sm shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Service Role Private Key</label>
                <input name="client_supabase_key" type="password" required placeholder="eyJh..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono text-sm shadow-sm" />
                <p className="text-[9px] text-slate-400 mt-3 font-black uppercase tracking-[0.1em] opacity-60 font-black italic">Encrypted at rest. Access is limited to deployment logic.</p>
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setIsNewProjectOpen(false)} className="flex-grow py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow py-5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-2xl shadow-blue-200">
                  {isActionLoading ? 'Verifying...' : 'Establish Secure Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
