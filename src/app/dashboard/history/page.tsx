'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjects, getDeployments, deployZip, rollbackToVersion, updateProjectGitHub, connectProject } from '@/app/actions/projectActions';
import { useSearchParams } from 'next/navigation';
import { Plus, Upload, Settings, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { PageLoader, LoadingDots } from '@/components/ui/Loading';

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

function HistoryContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [project, setProject] = useState<any>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'production' | 'beta' | 'staging'>('all');

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  async function fetchData() {
    setIsLoading(true);
    const result = await getProjects();
    const found = result.projects?.find((p: any) => p.id === projectId);
    setProject(found || null);

    const deploys = await getDeployments(projectId as string);
    setDeployments(deploys.deployments || []);
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

  async function handleDeploy(formData: FormData) {
    if (!projectId) return;
    setIsActionLoading(true);
    const result = await deployZip(projectId, formData);
    if (result.success) {
      await fetchData();
      setIsDeployOpen(false);
      setSelectedFile(null);
    } else alert(result.error);
    setIsActionLoading(false);
  }

  async function handleRollback(deploymentId: string) {
    if (!projectId) return;
    if (!confirm('Rollback this version?')) return;
    setIsActionLoading(true);
    const result = await rollbackToVersion(projectId, deploymentId);
    if (result.success) await fetchData();
    setIsActionLoading(false);
  }

  async function handleUpdateGitHub(formData: FormData) {
    if (!projectId) return;
    setIsActionLoading(true);
    const result = await updateProjectGitHub(projectId, formData);
    if (result.success) {
      await fetchData();
      setIsGitModalOpen(false);
    } else alert('Update failed');
    setIsActionLoading(false);
  }

  const filteredDeployments = selectedChannel === 'all' 
    ? deployments 
    : deployments.filter(d => d.channel === selectedChannel);

  if (!projectId) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Plus size={32} />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-slate-900">Release Management</h2>
      <p className="text-slate-500 mb-8 max-w-xs text-sm leading-relaxed text-slate-500">Select a project to manage its deployment history and push new updates.</p>
      <button onClick={() => setIsNewProjectOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors">Initialize Connection</button>
      
      {isNewProjectOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
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
              <div className="flex gap-3 pt-4 font-sans">
                <button type="button" onClick={() => setIsNewProjectOpen(false)} className="flex-grow py-2.5 text-sm font-semibold text-slate-500">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg">Establish Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans w-full">
      {isActionLoading && <PageLoader />}
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{project?.name} History</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and audit project deployments.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsDeployOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Upload size={16} /> New Release
          </button>
          <button onClick={() => setIsGitModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Settings size={16} /> Settings
          </button>
        </div>
      </header>

      {/* Channel Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['all', 'production', 'beta', 'staging'] as const).map((channel) => (
          <button
            key={channel}
            onClick={() => setSelectedChannel(channel)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedChannel === channel 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {channel}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Version</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-center">Channel</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-center">Installs</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 min-h-[200px]">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <LoadingDots />
                </td>
              </tr>
            ) : filteredDeployments.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400 italic">No releases found for this channel.</td></tr>
            ) : (
              filteredDeployments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900 text-base">{d.version}</span>
                      {d.is_mandatory && (
                        <div className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-100">
                          <ShieldAlert size={10} /> CRITICAL
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium">{new Date(d.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      d.channel === 'production' 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : d.channel === 'beta'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {d.channel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-semibold text-slate-600">{d.install_count || 0}</td>
                  <td className="px-6 py-5 text-right">
                    {d.status !== 'active' ? (
                      <button 
                        onClick={() => handleRollback(d.id)} 
                        className="text-blue-600 font-bold text-xs hover:text-blue-700 flex items-center gap-1 ml-auto transition-colors"
                      >
                        <RotateCcw size={14} /> Rollback
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs justify-end bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit ml-auto">
                        <CheckCircle2 size={14} /> LIVE
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS remain similar but styled lighter */}
      {isDeployOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-6">Manual Bundle Upload</h2>
            <form action={handleDeploy} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Version</label>
                  <input name="version" type="text" required placeholder="1.0.4" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold outline-none focus:border-blue-500 bg-slate-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Channel</label>
                  <select name="channel" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold bg-white">
                    <option value="production">Production</option>
                    <option value="beta">Beta</option>
                    <option value="staging">Staging</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Mark as Mandatory</span>
                <input name="is_mandatory" type="checkbox" value="true" className="w-4 h-4 rounded text-blue-600" />
              </div>
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-500 bg-slate-50/50'}`}>
                <input name="file" type="file" required accept=".zip" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-xs font-bold text-slate-500">{selectedFile ? selectedFile.name : 'Select update.zip bundle'}</div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsDeployOpen(false)} className="flex-grow py-2 text-sm font-semibold text-slate-500">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg">Upload & Push</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-6">Git Integration</h2>
            <form action={handleUpdateGitHub} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GitHub Repo (Owner/Repo)</label>
                <input name="github_repo" type="text" required defaultValue={project?.github_repo} placeholder="e.g., nabil/myapp" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold outline-none bg-slate-50/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Token (PAT)</label>
                <input name="github_token" type="password" required defaultValue={project?.github_token} placeholder="ghp_..." className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-mono outline-none bg-slate-50/50" />
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsGitModalOpen(false)} className="flex-grow py-2 text-sm font-semibold text-slate-500">Cancel</button>
                <button type="submit" disabled={isActionLoading} className="flex-grow bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold shadow-lg">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HistoryContent />
    </Suspense>
  );
}
