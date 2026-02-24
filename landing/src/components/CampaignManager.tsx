import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Terminal, Briefcase, Zap, Send, FileText, Image as ImageIcon, Cpu, Activity, CircleDashed, DollarSign, Crosshair, BarChart2, Plus, ChevronRight, RefreshCw, Clock, Download as DownloadIcon } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadCSV, downloadZIP, downloadPDF } from '../utils/export';

interface Campaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'DRAFT';
  objective: string;
  budget: { dailyAmount: number; currency: string };
  biddingStrategy: { type: string; targetCpa?: number; targetRoas?: number };
  assetGroups?: { id: string; name: string; adStrength: string }[];
  createdAt: string;
  updatedAt: string;
}

type AgentDraft = {
  agent: string;
  role: string;
  status: 'pending' | 'working' | 'complete';
  output?: string;
};

type View = 'list' | 'create';

export function CampaignManager() {
  const [view, setView] = useState<View>('list');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Create form
  const [clientName, setClientName] = useState('');
  const [objective, setObjective] = useState('');
  const [directive, setDirective] = useState('');
  const [budget, setBudget] = useState(100);
  const [biddingStrategy, setBiddingStrategy] = useState<'MAXIMIZE_CONVERSIONS' | 'MAXIMIZE_CONVERSION_VALUE'>('MAXIMIZE_CONVERSIONS');
  const [targetValue, setTargetValue] = useState(0);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'success' | 'error'>('idle');
  const [launchReport, setLaunchReport] = useState<string | null>(null);

  const [agentTasks, setAgentTasks] = useState<AgentDraft[]>([
    { agent: 'sn00', role: 'Orchestrator', status: 'pending' },
    { agent: 'sp01', role: 'Strategy', status: 'pending' },
    { agent: 'cc06', role: 'Copywriter', status: 'pending' },
    { agent: 'da03', role: 'Visuals', status: 'pending' },
    { agent: 'ra01', role: 'Audit', status: 'pending' },
  ]);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/pmax/campaigns`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.warn('[CampaignHub] Backend unavailable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Listen for swarm status updates
  useEffect(() => {
    const handleSwarmStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; state: string; progress: number; lastStatus: string }>;
      const agentUpdate = customEvent.detail;
      if (!agentUpdate || !agentUpdate.id) return;

      setAgentTasks(prev => {
        return prev.map(task => {
          // Normalize IDs (some use cc06, others cc-06)
          if (task.agent.toUpperCase() === agentUpdate.id.toUpperCase()) {
            return { 
              ...task, 
              status: agentUpdate.state === 'working' ? 'working' : 
                      agentUpdate.state === 'idle' ? 'complete' : 'pending',
              output: agentUpdate.lastStatus 
            };
          }
          return task;
        });
      });
    };

    window.addEventListener('swarm-status', handleSwarmStatus);
    return () => window.removeEventListener('swarm-status', handleSwarmStatus);
  }, []);

  const handleDispatch = async () => {
    if (!directive.trim() && (!clientName.trim() || !objective.trim())) return;
    setIsOrchestrating(true);
    setAgentTasks(prev => prev.map(t => ({ ...t, status: 'working', output: undefined })));

    // Save campaign to Firestore via API
    try {
      const res = await fetch(`${API_BASE_URL}/pmax/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName ? `${clientName} — ${objective}` : directive.slice(0, 60),
          status: 'DRAFT',
          objective: objective || 'LEADS',
          budget: { dailyAmount: budget, currency: 'USD' },
          biddingStrategy: { type: biddingStrategy, targetCpa: biddingStrategy === 'MAXIMIZE_CONVERSIONS' ? targetValue : undefined, targetRoas: biddingStrategy === 'MAXIMIZE_CONVERSION_VALUE' ? targetValue : undefined },
          settings: { finalUrlExpansion: true, locationTargeting: ['Global'], languageTargeting: ['en'] },
          assetGroups: [],
        }),
      });
      if (res.ok) {
        const newCampaign = await res.json();
        setCampaigns(prev => [newCampaign, ...prev]);
      }
    } catch (e) {
      console.warn('[CampaignHub] Save failed, dispatching via WebSocket only:', e);
    }

    // Dispatch to the global WebSocket orchestrator
    window.dispatchEvent(new CustomEvent('trigger-orchestration', {
      detail: {
        type: 'campaign_orchestration',
        client: clientName,
        objective,
        directive,
        pmaxConfig: { budget, biddingStrategy, targetValue: targetValue > 0 ? targetValue : undefined },
      },
    }));

    // Swarm Logic: handleDispatch initiates the chain. 
    // The UI is updated via the 'swarm-status' listener (lines 75-99).
  };
  
  const handleDownloadPackage = async (campaign: Campaign) => {
    // Collect all campaign info into a ZIP package
    const packageFiles = [
      { name: 'campaign_strategy.json', content: JSON.stringify(campaign, null, 2) },
      { name: 'launch_brief.txt', content: `Campaign: ${campaign.name}\nObjective: ${campaign.objective}\nBudget: ${campaign.budget.dailyAmount} ${campaign.budget.currency}\nGenerated by AGENTICUM G5 OS` }
    ];
    
    // Add assets if they exist
    if (campaign.assetGroups) {
      campaign.assetGroups.forEach((ag, idx) => {
        const agContent = `ASSET GROUP: ${ag.name}\nAd Strength: ${ag.adStrength}\nHeadlines: (Generated by cc06)\nDescriptions: (Generated by cc06)`;
        packageFiles.push({ name: `asset_group_${idx+1}_${ag.name.replace(/\s+/g, '_')}.txt`, content: agContent });
      });
    }

    await downloadZIP(packageFiles, `G5_Campaign_${campaign.id}`);
  };

  const handleLaunch = async () => {
    setIsOrchestrating(true);
    setLaunchStatus('launching');
    try {
      const resp = await fetch(`${API_BASE_URL}/pmax/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign?.id || 'pmax-' + Date.now(),
          config: { budget, biddingStrategy },
        }),
      });
      const data = await resp.json();
      setLaunchReport(data.report);
      setLaunchStatus('success');
      fetchCampaigns(); // Refresh list
    } catch {
      setLaunchStatus('error');
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!launchReport) return;
    await downloadPDF('mission-report-container', `G5_Mission_Report_${selectedCampaign?.id || 'New'}`);
  };

  const resetForm = () => {
    setClientName(''); setObjective(''); setDirective('');
    setBudget(100); setTargetValue(0);
    setAgentTasks(prev => prev.map(t => ({ ...t, status: 'pending', output: undefined })));
    setLaunchStatus('idle'); setLaunchReport(null);
    setSelectedCampaign(null);
  };

  // ──────────────── Campaign List View ────────────────
  if (view === 'list') {
    return (
      <div className="h-full flex flex-col gap-5 overflow-y-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-display text-2xl uppercase tracking-tight flex items-center gap-3">
              <Target size={24} className="text-accent" /> Campaign Hub
            </h2>
            <p className="font-mono text-xs text-white/40 mt-1">Multi-Agent PMax Campaign Orchestrator</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchCampaigns} className="btn btn-ghost btn-sm">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <ExportMenu options={[
              { label: 'JSON All', format: 'JSON', onClick: () => downloadJSON({ campaigns }, 'G5_Campaigns') },
              { label: 'CSV Summary', format: 'CSV', onClick: () => downloadCSV(campaigns.map(c => ({ name: c.name, status: c.status, objective: c.objective, budget: c.budget?.dailyAmount ?? '', currency: c.budget?.currency ?? '', created: c.createdAt })), 'G5_Campaigns_Summary') },
            ]} />
            <button onClick={() => { resetForm(); setView('create'); }} className="btn btn-primary">
              <Plus size={14} /> New Campaign
            </button>
          </div>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="grid gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <CircleDashed size={48} className="text-white/10 mb-4" />
            <p className="font-display text-lg uppercase text-white/30">No Campaigns Yet</p>
            <p className="font-mono text-xs text-white/20 mt-2 max-w-md">
              Create your first campaign to dispatch the agent swarm. Each campaign will be saved to Firestore and tracked end-to-end.
            </p>
            <button onClick={() => setView('create')} className="btn btn-primary mt-6">
              <Plus size={14} /> Create First Campaign
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {campaigns.map(campaign => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card flex items-center gap-4 cursor-pointer group hover:border-accent/30"
                onClick={() => { setSelectedCampaign(campaign); setView('create'); }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.08)' }}>
                  <Target size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm uppercase truncate">{campaign.name}</p>
                    {campaign.status === 'ENABLED' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownloadPackage(campaign); }}
                        className="btn btn-ghost btn-xs text-accent px-1 h-5 min-h-[20px]"
                      >
                        <DownloadIcon size={10} /> ZIP Package
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-white/30 mt-0.5">
                    {campaign.objective} · ${campaign.budget?.dailyAmount}/day · {campaign.biddingStrategy?.type?.replace('MAXIMIZE_', 'Max ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${campaign.status === 'ENABLED' ? 'badge-online' : campaign.status === 'DRAFT' ? 'badge-processing' : 'badge-warning'}`}>
                    {campaign.status}
                  </span>
                  {/* GenIUS Score — heuristic based on campaign completeness */}
                  {(() => {
                    let score = 40; // base
                    if (campaign.status === 'ENABLED') score += 20;
                    if (campaign.budget?.dailyAmount > 0) score += 15;
                    if (campaign.assetGroups && campaign.assetGroups.length > 0) score += 15;
                    if (campaign.biddingStrategy?.type) score += 10;
                    score = Math.min(score, 100);
                    const color = score >= 71 ? '#00FF88' : score >= 41 ? '#FFD700' : '#FF007A';
                    return (
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        G:{score}
                      </span>
                    );
                  })()}
                  <div className="flex items-center gap-1 text-white/20">
                    <Clock size={10} />
                    <span className="font-mono text-[9px]">{new Date(campaign.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-accent transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ──────────────── Create/Edit View ────────────────
  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="btn btn-ghost btn-sm">← Back</button>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">
              {selectedCampaign ? 'Edit Campaign' : 'New Campaign'}
            </h2>
            <p className="font-mono text-[10px] text-white/30">Configure parameters → Dispatch agents → Review → Launch</p>
          </div>
        </div>
        {isOrchestrating && (
          <span className="badge badge-processing animate-pulse">
            <Activity size={10} /> Swarm Active
          </span>
        )}
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Left: Campaign Configuration */}
        <div className="w-1/2 flex flex-col gap-4 overflow-y-auto pb-6 pr-2">
          
          {/* Campaign Parameters */}
          <div className="card">
            <h3 className="font-display text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <Briefcase size={14} className="text-accent" /> Campaign Parameters
            </h3>
            <div className="space-y-3">
              <div>
                <label className="label">Target Client / Brand</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. CyberDyne Systems" className="input" />
              </div>
              <div>
                <label className="label">Primary Objective</label>
                <input type="text" value={objective} onChange={e => setObjective(e.target.value)}
                  placeholder="e.g. Launch Q3 Lead Generation globally" className="input" />
              </div>
            </div>
          </div>

          {/* PMax Settings */}
          <div className="card">
            <h3 className="font-display text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
              <Target size={14} className="text-emerald" /> PMax Configuration
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label"><DollarSign size={10} className="inline" /> Daily Budget (USD)</label>
                <input type="number" value={budget || ''} onChange={e => setBudget(parseInt(e.target.value) || 0)} className="input" />
              </div>
              <div>
                <label className="label"><BarChart2 size={10} className="inline" /> Bidding Strategy</label>
                <select value={biddingStrategy} onChange={e => setBiddingStrategy(e.target.value as typeof biddingStrategy)} className="select">
                  <option value="MAXIMIZE_CONVERSIONS">Max Conversions (Volume)</option>
                  <option value="MAXIMIZE_CONVERSION_VALUE">Max Value (ROAS)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="label"><Crosshair size={10} className="inline" /> {biddingStrategy === 'MAXIMIZE_CONVERSIONS' ? 'Target CPA ($)' : 'Target ROAS (%)'} (Optional)</label>
                <input type="number" value={targetValue || ''} onChange={e => setTargetValue(parseInt(e.target.value) || 0)}
                  placeholder="Leave blank for ML optimization" className="input" />
              </div>
            </div>
          </div>

          {/* Directive */}
          <div className="card">
            <h3 className="font-display text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
              <Terminal size={14} className="text-gold" /> Agent Directive
            </h3>
            <p className="font-mono text-[10px] text-white/30 mb-3">Natural language instructions for the swarm.</p>
            <textarea value={directive} onChange={e => setDirective(e.target.value)}
              placeholder="e.g. 'cc06 write 15 PMax Headlines. da03 generate 3 landscape hero images. ra01 audit all outputs for brand safety.'"
              className="textarea h-28" />
            <button onClick={handleDispatch} disabled={isOrchestrating}
              className={`w-full mt-3 ${isOrchestrating ? 'btn btn-ghost opacity-50 cursor-not-allowed' : 'btn btn-primary'}`}>
              <Zap size={14} /> {isOrchestrating ? 'Orchestration in Progress...' : 'Dispatch Agent Swarm'}
            </button>
          </div>

          {/* Launch Control */}
          {agentTasks.every(t => t.status === 'complete') && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="card" style={{ borderLeftColor: 'var(--color-gold)', borderLeftWidth: '2px' }}>
              <h3 className="font-display text-sm uppercase text-gold flex items-center gap-2 mb-2">
                <Activity size={14} /> Launch Control
              </h3>
              <p className="font-mono text-[10px] text-white/30 mb-3">All agents completed. Ready for deployment.</p>
              <button onClick={handleLaunch} disabled={isOrchestrating || launchStatus === 'success'}
                className="btn btn-primary w-full" style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}>
                <Send size={14} /> {launchStatus === 'launching' ? 'Deploying...' : launchStatus === 'success' ? 'Deployed ✓' : 'Launch to Ecosystem'}
              </button>
              {launchReport && (
                <div className="mt-4 space-y-3">
                  <div id="mission-report-container" className="p-6 rounded-lg bg-[#0a0118] border border-accent/20 font-mono text-[10px] text-white/80 whitespace-pre-wrap shadow-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                       <span className="text-accent font-bold">AGENTICUM G5 — TERMINAL REPORT</span>
                       <span className="text-white/20">CONFIDENTIAL</span>
                    </div>
                    {launchReport}
                  </div>
                  <button onClick={handleDownloadReport} className="btn btn-ghost w-full border-accent/30 text-accent gap-2">
                     <FileText size={14} /> Download PDF Mission Report
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right: Live Agent Delegation Matrix */}
        <div className="w-1/2 glass flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 shrink-0">
            <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
              <Send size={14} className="text-accent" /> Agent Delegation Matrix
            </h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {!isOrchestrating && agentTasks.every(t => t.status === 'pending') ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <CircleDashed size={40} className="text-white/10 mb-3" />
                <p className="font-display text-sm uppercase text-white/20">Awaiting Dispatch</p>
                <p className="font-mono text-[10px] text-white/15 mt-1">Configure parameters and dispatch the swarm</p>
              </div>
            ) : (
              <AnimatePresence>
                {agentTasks.map((task, idx) => {
                  if (task.status === 'pending' && !isOrchestrating) return null;
                  const Icon = task.agent === 'cc06' ? FileText : task.agent === 'da03' ? ImageIcon : task.agent === 'sn00' ? Cpu : task.agent === 'ra01' ? Briefcase : Briefcase;

                  return (
                    <motion.div key={task.agent}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                      className={`card ${task.status === 'working' ? 'card-accent' : task.status === 'complete' ? 'card-magenta' : ''}`}
                      style={{ borderLeftColor: task.status === 'complete' ? 'var(--color-emerald)' : undefined }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent">
                            <Icon size={14} />
                          </div>
                          <div>
                            <span className="font-display text-xs uppercase">{task.agent}</span>
                            <span className="font-mono text-[10px] text-white/30 block">{task.role}</span>
                          </div>
                        </div>
                        {task.status === 'working' && <span className="badge badge-processing animate-pulse">Processing</span>}
                        {task.status === 'complete' && <span className="badge badge-online">Complete</span>}
                      </div>
                      {task.output && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5 overflow-hidden">
                          {task.agent === 'da03' && task.output.startsWith('data:image') ? (
                            <img src={task.output} alt="Generated" className="w-full rounded border border-white/10" />
                          ) : (
                            <p className="font-mono text-[10px] text-white/60 leading-relaxed whitespace-pre-wrap">{task.output}</p>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
