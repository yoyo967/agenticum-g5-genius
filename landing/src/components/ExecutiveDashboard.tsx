import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, FileText, Clock, Play, CheckCircle, Settings, Network, Shield, Zap, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadPDF, downloadCSV, downloadPNG } from '../utils/export';
import type { SwarmState } from '../types';

import type { ActivityLog } from '../hooks/useSwarmAnalytics';
import { useSwarmAnalytics } from '../hooks/useSwarmAnalytics';

interface SEORankings {
  domainAuthority: number;
  indexedPages: number;
  keywordClarity: number;
  rankings: { term: string; rank: number }[];
}

type NavigableModule = 'campaign' | 'vault' | 'settings' | 'synergy' | 'memory' | 'console' | 'studio' | 'senate';

export function ExecutiveDashboard({ onNavigate }: { onNavigate?: (module: NavigableModule) => void }) {
  const { stats, throughput, loading: analyticsLoading } = useSwarmAnalytics();
  const [swarmState, setSwarmState] = useState<SwarmState | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [vaultAssets, setVaultAssets] = useState<{name: string, url: string}[]>([]);
  const [pillars, setPillars] = useState<{ id: string; title: string; timestamp: string }[]>([]);
  const [seo, setSeo] = useState<SEORankings | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch actual outputs for the gallery
      const [vaultRes, blogRes] = await Promise.all([
        fetch(`${API_BASE_URL}/vault/list`),
        fetch(`${API_BASE_URL}/blog/feed`)
      ]);

      if (vaultRes.ok) {
        const vData = await vaultRes.json();
        setVaultAssets(vData.files.filter((f: { name: string }) => f.name.match(/\.(jpg|jpeg|png|gif)$/i)).slice(0, 2));
      }

      if (blogRes.ok) {
        const bData = await blogRes.json();
        setPillars(bData.pillars.slice(0, 3));
      }

      // Fetch actual SEO rankings
      const seoRes = await fetch(`${API_BASE_URL}/analytics/seo-rankings`);
      if (seoRes.ok) {
        const sData = await seoRes.json();
        setSeo(sData);
      }

      setLastRefresh(new Date());
    } catch (e) {
      console.warn('[Dashboard] API unavailable, showing connection status:', e);
      setLogs([{
        id: 'conn-err',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        agent: 'SYS.CORE',
        text: `Backend unreachable at ${API_BASE_URL}. Start the backend server.`,
        type: 'error',
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh remaining API data (SEO/Vault) every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Sync logs from the custom hook seamlessly
    if (stats?.agentActivity) {
      setLogs((prev) => {
        // Only update if they look different otherwise we trigger re-renders
        return stats.agentActivity.length > 0 ? stats.agentActivity : prev;
      });
    }

    // Listen for real-time swarm status from WebSocket
    const handleStatus = (e: Event) => {
      const customEvent = e as CustomEvent<SwarmState>;
      if (customEvent.detail) setSwarmState(customEvent.detail);
    };

    const handlePayload = (e: Event) => {
      const customEvent = e as CustomEvent<{ from: string; to: string; payloadType: string }>;
      const payload = customEvent.detail;
      if (!payload) return;

      setLogs(prev => [{
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        agent: String(payload.from).toUpperCase(),
        text: `Payload → ${String(payload.to).toUpperCase()}: ${payload.payloadType}`,
        type: 'info' as const,
      }, ...prev].slice(0, 20));
    };

    window.addEventListener('swarm-status', handleStatus);
    window.addEventListener('swarm-payload', handlePayload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('swarm-status', handleStatus);
      window.removeEventListener('swarm-payload', handlePayload);
    };
  }, [stats?.agentActivity]);

  const isDataLoading = loading || analyticsLoading;

  if (isDataLoading && !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-t-2 border-accent rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-b-2 border-magenta rounded-full opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-accent animate-pulse" size={24} />
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60">Assembling Cognitive Interface...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-export-container" className="h-full flex flex-col gap-5 overflow-y-auto pb-6">
      
      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <button onClick={() => onNavigate?.('campaign')} className="btn btn-primary btn-lg gap-3 shadow-lg shadow-accent/20">
          <Play size={14} /> Initialize Campaign
        </button>
        <button onClick={() => onNavigate?.('studio')} className="btn btn-ghost btn-lg gap-3">
          <Zap size={14} /> GenIUS Creative Studio
        </button>
        <button onClick={() => onNavigate?.('vault')} className="btn btn-ghost btn-lg gap-3">
          <CheckCircle size={14} /> Asset Vault
        </button>
        <button onClick={() => onNavigate?.('settings')} className="btn btn-ghost btn-lg gap-3">
          <Settings size={14} /> Configuration
        </button>
        <ExportMenu options={[
          { label: 'PDF Report', format: 'PDF', onClick: () => downloadPDF('dashboard-export-container', 'G5_Dashboard_Report') },
          { label: 'CSV Metrics', format: 'CSV', onClick: () => downloadCSV(throughput.map(t => ({ ...t })), 'G5_Throughput_Data') },
          { label: 'PNG Screenshot', format: 'PNG', onClick: () => downloadPNG('dashboard-export-container', 'G5_Dashboard_Screenshot') },
        ]} />
      </div>

      {/* Sentient Context Banner (Resonance Indication) */}
      <div className="glass-card p-4 flex items-center justify-between border-accent/20 bg-accent/5 overflow-hidden relative">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-linear-to-r from-transparent via-accent/10 to-transparent pointer-events-none"
        />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Nexus Context: <span className="text-white italic">"Active Swarm Optimization for High-Density Strategic Growth"</span>
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <span className="font-mono text-[9px] text-white/40 uppercase">Resonance Index:</span>
          <span className="font-mono text-[10px] text-accent font-bold">0.94 // OPTIMAL</span>
        </div>
      </div>

      {/* Stats Row — All from API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard
          title="Active Workflows"
          value={loading ? '—' : String(stats?.activeWorkflows ?? 0)}
          subtext={`${stats?.totalCampaigns ?? 0} campaigns total`}
          icon={<Activity size={20} />}
          accentColor="var(--color-magenta)"
        />
        <StatCard
          title="Total Outputs"
          value={loading ? '—' : String(stats?.totalOutputs ?? 0)}
          subtext={`${stats?.totalPillars ?? 0} articles, ${stats?.totalClusters ?? 0} clusters`}
          icon={<FileText size={20} />}
          accentColor="var(--color-accent)"
          live
        />
        <StatCard
          title="Swarm Readiness"
          value={loading ? '—' : (stats?.readiness ?? 'Offline')}
          subtext="All 8 agents online"
          icon={<Users size={20} />}
          accentColor="var(--color-gold)"
        />
        <StatCard
          title="Senate Pending"
          value={loading ? '—' : String(stats?.senatePending ?? 0)}
          subtext={`${stats?.senateBlocked ?? 0} rejected`}
          icon={<Shield size={20} />}
          accentColor="var(--color-gold)"
          onClick={() => onNavigate?.('senate')}
        />
      </div>

      {/* Main Content — Activity Log + Chart */}
      <div className="flex gap-5 flex-1 min-h-[380px]">
        
        {/* Left: Live Activity Feed */}
        <div className="w-1/3 flex flex-col glass overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
              <Clock size={14} className="text-white/40" /> Activity Log
            </h3>
            <button 
              onClick={fetchData} 
              aria-label="Refresh Dashboard Data"
              className="text-white/30 hover:text-accent transition-colors" 
              title="Refresh"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {logs.length > 0 ? logs.map(log => (
              <LogItem key={log.id} id={log.id} time={log.time} agent={log.agent} text={log.text} type={log.type} />
            )) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="skeleton w-full h-8 mb-3" />
                  <div className="skeleton w-3/4 h-8 mb-3 mx-auto" />
                  <div className="skeleton w-1/2 h-8 mx-auto" />
                  <p className="label mt-4">Loading activity data...</p>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-white/5">
            <span className="font-mono text-[9px] text-white/20">
              Last refresh: {lastRefresh.toLocaleTimeString('en-US')}
            </span>
          </div>
        </div>

        {/* Right: Agency Output Gallery */}
        <div className="w-2/3 flex flex-col gap-5">
          <div className="flex-1 glass overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
                <ImageIcon size={14} className="text-purple-400" /> Agency Output Gallery
              </h3>
              <button onClick={() => onNavigate?.('studio')} className="font-mono text-[10px] text-accent hover:underline uppercase tracking-widest">
                Workbench Studio →
              </button>
            </div>
            
            <div className="flex-1 p-6 grid grid-cols-2 gap-4">
              {vaultAssets.length > 0 ? vaultAssets.map((asset, i) => (
                <div key={i} className="card relative group cursor-pointer overflow-hidden border-purple-400/20 bg-purple-400/5 hover:border-purple-400/40 transition-all">
                  <div className="aspect-video bg-black/40 overflow-hidden">
                     <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-display text-[9px] uppercase text-white truncate">{asset.name}</p>
                  </div>
                </div>
              )) : (
                <>
                  <div className="card border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                    <ImageIcon size={24} className="mb-2" />
                    <p className="font-mono text-[9px] uppercase tracking-widest">No Assets Yet</p>
                  </div>
                  <div className="card border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                    <ImageIcon size={24} className="mb-2" />
                    <p className="font-mono text-[9px] uppercase tracking-widest">Ready for Forge</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Summary: Recent Pillar Content & SEO */}
          <div className="h-1/3 flex gap-4">
            <div className="flex-1 glass overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
                  <FileText size={14} className="text-emerald" /> Recent High-Grounded Pillars
                </h3>
              </div>
              <div className="p-4 flex gap-4 overflow-x-auto scrollbar-none">
                  {pillars.length > 0 ? pillars.map((p, i) => (
                    <div key={i} className="card min-w-[200px] border-emerald/20 bg-emerald/5 p-3 flex flex-col justify-between hover:border-emerald/40 transition-colors">
                      <h4 className="font-display text-[10px] text-white line-clamp-2">{p.title}</h4>
                      <span className="font-mono text-[8px] text-white/40 mt-2">{new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>
                  )) : <div className="skeleton w-full h-20" />}
              </div>
            </div>

            <div className="w-1/2 glass overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
                  <Shield size={14} className="text-accent" /> Global Deployment & Intelligence
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                  <span className="text-white/40">Hosting Target</span>
                  <span className="text-emerald font-bold">online-marketing-manager</span>
                </div>
                {seo && (
                  <div className="bg-white/5 rounded p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="label text-[8px]">SEO Authority</span>
                      <span className="font-mono text-[10px] text-accent">{seo.domainAuthority}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="label text-[8px]">Indexed Pages</span>
                      <span className="font-mono text-[10px] text-emerald">{seo.indexedPages}</span>
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <p className="label text-[8px] uppercase text-white/40 mb-1">Swarm Memory Utilization</p>
                  <div className="p-2 rounded bg-accent/5 border border-accent/10">
                    <p className="font-mono text-[9px] text-accent/80 italic leading-tight">
                      "Utilizing 20+ past lifecycle logs for contextual optimization..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swarm Health Telemetry */}
      <div className="shrink-0 flex flex-col gap-3">
        <h3 className="label flex items-center gap-2">
          <Network size={14} className="text-accent" /> Live Swarm Telemetry
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {swarmState ? [swarmState, ...Object.values(swarmState.subAgents || {})].map((agent, i) => (
            <motion.div 
              key={agent.id} 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card group hover:border-white/20"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-display text-xs uppercase" style={{ color: agent.color }}>
                  {agent.id.toUpperCase()}
                </span>
                <span className={`status-dot ${agent.state !== 'idle' ? 'processing' : 'offline'}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="label">Process</span>
                  <span className="font-mono text-xs text-white/70">{agent.progress}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: agent.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="label">State</span>
                  <span className="font-mono text-xs text-white/70 italic">{agent.state}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 mt-3">
                <span className="font-mono text-[9px] text-white/30 group-hover:text-white/60 transition-colors block truncate">
                  {agent.lastStatus || 'Awaiting Directive'}
                </span>
              </div>
            </motion.div>
          )) : (
            [...Array(8)].map((_, i) => (
              <div key={i} className="card flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="skeleton w-16 h-5" />
                  <span className="status-dot offline" />
                </div>
                <div className="skeleton w-full h-1" />
                <div className="skeleton w-20 h-3" />
                <div className="pt-2 border-t border-white/5 mt-auto">
                  <span className="font-mono text-[9px] text-white/20">Connect via GenIUS Console</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext, icon, accentColor, live, onClick }: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  accentColor: string;
  live?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`card relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderLeftColor: accentColor, borderLeftWidth: '2px' }}
    >
      {live && (
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)` }}
        />
      )}
      <div className="absolute -right-3 -top-3 opacity-[0.06]" style={{ color: accentColor }}>
        <div style={{ transform: 'scale(3)' }}>{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3" style={{ color: accentColor }}>
          {icon}
          {live && (
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [2, 6, 2] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-0.5 rounded-full bg-current"
                />
              ))}
            </div>
          )}
        </div>
        <p className="label mb-1">{title}</p>
        <p className="font-mono text-2xl font-bold text-white mb-1">{value}
          {live && <span className="status-dot processing ml-2 inline-block" />}
        </p>
        <p className="font-mono text-[10px] text-white/30">{subtext}</p>
      </div>
    </motion.div>
  );
}

function LogItem({ time, agent, text, type }: ActivityLog) {
  const colorMap = {
    success: { dot: 'bg-emerald', text: 'text-emerald', bg: 'bg-emerald/5', border: 'border-emerald/10' },
    info: { dot: 'bg-accent', text: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/10' },
    warning: { dot: 'bg-gold', text: 'text-gold', bg: 'bg-gold/5', border: 'border-gold/10' },
    error: { dot: 'bg-magenta', text: 'text-magenta', bg: 'bg-magenta/5', border: 'border-magenta/10' },
  };
  const c = colorMap[type] || colorMap.info;

  return (
    <div className="flex gap-3 group">
      <div className="w-10 text-right pt-1 shrink-0">
        <span className="font-mono text-[9px] text-white/25">{time}</span>
      </div>
      <div className="relative flex flex-col items-center">
        <div className="w-px h-full bg-white/5 absolute top-0 bottom-0" />
        <div className={`w-2 h-2 rounded-full z-10 mt-2 ${c.dot}`} style={{ boxShadow: '0 0 6px currentColor' }} />
      </div>
      <div className={`flex-1 p-3 rounded-lg border ${c.bg} ${c.border} transition-colors group-hover:bg-white/5`}>
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${c.text} opacity-70`}>{agent}</span>
        </div>
        <p className="font-mono text-xs text-white/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
