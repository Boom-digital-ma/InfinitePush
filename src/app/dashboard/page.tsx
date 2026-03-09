'use client';

import React, { useState, useEffect } from 'react';
import { connectProject, getProjects, getDeployments, deployZip, rollbackToVersion, updateProjectGitHub } from '@/app/actions/projectActions';
import { signOut } from '@/app/actions/authActions';
import Link from 'next/link';

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

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      // Persist selection or pick first
      const storedId = localStorage.getItem('last_project_id');
      const found = result.projects.find((p: Project) => p.id === storedId);
      setSelectedProject(found || result.projects[0] || null);
    }
    setIsLoading(false);
  }

  async function fetchDeployments(projectId: string) {
    const result = await getDeployments(projectId);
    if (result.deployments) setDeployments(result.deployments);
    else setDeployments([]);
  }

  const handleSelectProject = (p: Project) => {
    setSelectedProject(p);
    localStorage.setItem('last_project_id', p.id);
  };

  async function handleConnectProject(formData: FormData) {
    setIsActionLoading(true);
    const result = await connectProject(formData);
    if (result.success) {
      await fetchProjects();
      setIsNewProjectOpen(false);
    } else setError(result.error || 'Failed to connect');
    setIsActionLoading(false);
  }

  async function handleDeploy(formData: FormData) {
    if (!selectedProject) return;
    setIsActionLoading(true);
    const result = await deployZip(selectedProject.id, formData);
    if (result.success) {
      await fetchDeployments(selectedProject.id);
      setIsDeployOpen(false);
      setSelectedFile(null);
    } else setError(result.error || 'Deployment failed');
    setIsActionLoading(false);
  }

  async function handleUpdateGitHub(formData: FormData) {
    if (!selectedProject) return;
    setIsActionLoading(true);
    const result = await updateProjectGitHub(selectedProject.id, formData);
    if (result.success) {
      await fetchProjects();
      setIsGitModalOpen(false);
    } else setError(result.error || 'Update failed');
    setIsActionLoading(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">IP</div>
          <span className="font-bold text-lg tracking-tight">InfinitePush</span>
        </div>
        
        <nav className="space-y-1 flex-grow overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Projects</p>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProject(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedProject?.id === p.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button onClick={() => setIsNewProjectOpen(true)} className="w-full text-left px-3 py-2 text-blue-500 text-sm font-bold mt-4">+ New Project</button>
        </nav>

        <button onClick={() => signOut()} className="mt-auto pt-6 border-t border-slate-100 text-slate-400 hover:text-slate-600 text-xs font-bold">
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow pl-64 p-10 max-w-7xl mx-auto w-full">
        {!selectedProject ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold mb-2">No Project Selected</h2>
            <button onClick={() => setIsNewProjectOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold mt-4">Initialize BYOS</button>
          </div>
        ) : (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h1>
                <p className="text-slate-400 text-xs font-medium mt-1">{selectedProject.client_supabase_url}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsDeployOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50">Upload ZIP</button>
                <button onClick={() => setIsGitModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm">Settings</button>
              </div>
            </header>

            {/* Sub-navigation */}
            <div className="flex border-b border-slate-200 mb-8">
              <Link href="/dashboard" className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-blue-600 text-blue-600">Deployment History</Link>
              <Link href={`/dashboard/commits?projectId=${selectedProject.id}`} className="px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all">GitHub Commits</Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px]">Version</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px]">Channel</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] text-center">Installs</th>
                    <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deployments.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No deployments found.</td></tr>
                  ) : (
                    deployments.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{d.version}</span>
                            {d.is_mandatory && <span className="bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Mandatory</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{new Date(d.created_at).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">{d.channel}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-600">{d.install_count || 0}</td>
                        <td className="px-6 py-4 text-right">
                          {d.status !== 'active' ? (
                            <button onClick={() => rollbackToVersion(selectedProject.id, d.id)} className="text-blue-600 font-bold text-xs hover:underline">Rollback</button>
                          ) : (
                            <span className="text-emerald-600 font-bold text-xs">Live</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Modals (New Project, GitHub, Manual Upload) */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">Connect BYOS</h2>
            <form action={handleConnectProject} className="space-y-5">
              <input name="name" type="text" required placeholder="App Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-blue-500" />
              <input name="client_supabase_url" type="url" required placeholder="Supabase URL" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-blue-500" />
              <input name="client_supabase_key" type="password" required placeholder="Service Role Key" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono outline-none focus:border-blue-500" />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsNewProjectOpen(false)} className="flex-grow py-3 text-xs font-bold text-slate-400 transition-all text-left">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-100">Establish Connection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGitModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">Git Build Settings</h2>
            <form action={handleUpdateGitHub} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Repository (Owner/Repo)</label>
                <input name="github_repo" type="text" required defaultValue={selectedProject.github_repo} placeholder="Boom-digital-ma/Repo" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">GitHub Token (PAT)</label>
                <input name="github_token" type="password" required defaultValue={selectedProject.github_token} placeholder="ghp_..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsGitModalOpen(false)} className="flex-grow py-3 text-xs font-bold text-slate-400">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-slate-900 text-white py-3 rounded-xl text-xs font-bold">Save Git Config</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeployOpen && selectedProject && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 tracking-tight">Direct Upload</h2>
            <form action={handleDeploy} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input name="version" type="text" required placeholder="Version (1.0.4)" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold outline-none" />
                <select name="channel" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold bg-white">
                  <option value="production">Production</option>
                  <option value="beta">Beta</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-500 cursor-pointer bg-slate-50 transition-all">
                <input name="file" type="file" required accept=".zip" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-xs font-bold text-slate-600">{selectedFile ? selectedFile.name : 'Click to select update.zip'}</div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsDeployOpen(false)} className="flex-grow py-3 text-xs font-bold text-slate-400">Cancel</button>
                <button type="submit" disabled={isActionLoading || !selectedFile} className="flex-grow bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-lg">Start Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
