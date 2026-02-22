import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, FileText, Clock, TrendingUp, Play, CheckCircle, Settings, Network, Shield, Zap, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadPDF, downloadCSV, downloadPNG } from '../utils/export';
import type { SwarmState } from '../types';

interface ThroughputData {
  day: string;
  outputs: number;
  tokensK: number;
  blocked: number;
}

interface SwarmStats {
  totalOutputs: number;
  senateBlocked: number;
  senatePending: number;
  readiness: string;
  activeWorkflows: number;
  totalCampaigns: number;
  totalPillars: number;
  totalClusters: number;
  agentActivity: ActivityLog[];
}

interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

type NavigableModule = 'campaign' | 'vault' | 'settings' | 'synergy' | 'memory' | 'console' | 'studio' | 'senate';

export function ExecutiveDashboard({ onNavigate }: { onNavigate?: (module: NavigableModule) => void }) {
  const [stats, setStats] = useState<SwarmStats | null>(null);
  const [throughput, setThroughput] = useState<ThroughputData[]>([]);
  const [swarmState, setSwarmState] = useState<SwarmState | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [throughputRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/throughput`),
        fetch(`${API_BASE_URL}/api/analytics/stats`),
      ]);
      
      if (throughputRes.ok) {
        const data = await throughputRes.json() as ThroughputData[];
        setThroughput(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json() as SwarmStats;
        setStats(data);
        if (data.agentActivity?.length) {
          setLogs(data.agentActivity);
        }
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

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

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
  }, []);

  return (
    <div id="dashboard-export-container" className="h-full flex flex-col gap-5 overflow-y-auto pb-6">
      
      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <button onClick={() => onNavigate?.('campaign')} className="btn btn-primary btn-lg gap-3">
          <Play size={14} /> Initialize Campaign
        </button>
        <button onClick={() => onNavigate?.('studio')} className="btn btn-ghost btn-lg gap-3">
          <Zap size={14} /> Creative Studio
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
          subtext="All 5 agents online"
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
            <button onClick={fetchData} className="text-white/30 hover:text-accent transition-colors" title="Refresh">
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

        {/* Right: Agency Throughput Chart */}
        <div className="w-2/3 flex flex-col glass overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" /> Agency Throughput
            </h3>
            <span className="badge badge-online">Live from Firestore</span>
          </div>
          
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1 min-h-[220px]">
              {throughput.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={throughput} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOutputs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)', fontFamily: 'Roboto Mono' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)', fontFamily: 'Roboto Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(5,5,16,0.9)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px', backdropFilter: 'blur(20px)' }} 
                      itemStyle={{ fontSize: '12px', fontFamily: 'Roboto Mono' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px', fontFamily: 'Roboto Mono' }}
                    />
                    <Area type="monotone" dataKey="outputs" stroke="#00E5FF" fill="url(#colorOutputs)" strokeWidth={2} name="Outputs" />
                    <Area type="monotone" dataKey="tokensK" stroke="#FFD700" fill="url(#colorTokens)" strokeWidth={2} name="Tokens (k)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="skeleton w-full h-full min-h-[200px]" />
                    <p className="label mt-4">{loading ? 'Loading chart data...' : 'No throughput data available'}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom Summary Metrics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="card card-metric">
                <div className="metric-value" style={{ color: 'var(--color-accent)' }}>
                  {stats?.totalOutputs ?? 0}
                </div>
                <div className="metric-label">Total Outputs</div>
              </div>
              <div className="card card-metric">
                <div className="metric-value" style={{ color: 'var(--color-gold)' }}>
                  {((stats?.totalOutputs ?? 0) * 12.4).toFixed(0)}K
                </div>
                <div className="metric-label">Est. Tokens</div>
              </div>
              <div className="card card-metric">
                <div className="metric-value" style={{ color: 'var(--color-magenta)' }}>
                  {stats?.senateBlocked ?? 0}
                </div>
                <div className="metric-label">Senate Blocked</div>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {swarmState ? [swarmState, ...Object.values(swarmState.subAgents || {})].map((agent, i) => (
            <motion.div 
              key={agent.id} 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card group hover:border-white/20"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-display text-sm uppercase" style={{ color: agent.color }}>
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
            [...Array(5)].map((_, i) => (
              <div key={i} className="card flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="skeleton w-16 h-5" />
                  <span className="status-dot offline" />
                </div>
                <div className="skeleton w-full h-1" />
                <div className="skeleton w-20 h-3" />
                <div className="pt-2 border-t border-white/5 mt-auto">
                  <span className="font-mono text-[9px] text-white/20">Connect via Genius Console</span>
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
      onClick={onClick}
      className={`card relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderLeftColor: accentColor, borderLeftWidth: '2px' }}
    >
      <div className="absolute -right-3 -top-3 opacity-[0.06]" style={{ color: accentColor }}>
        <div style={{ transform: 'scale(3)' }}>{icon}</div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3" style={{ color: accentColor }}>
          {icon}
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
      <div className={`flex-1 p-3 rounded-lg border ${c.bg} ${c.border} transition-colors`}>
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${c.text} opacity-70`}>{agent}</span>
        </div>
        <p className="font-mono text-xs text-white/80 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
