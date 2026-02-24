import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Cpu, Zap, BarChart3, Database, RefreshCw, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadPDF, downloadCSV, downloadPNG } from '../utils/export';
import type { SwarmState } from '../types';

interface AgentMetric {
  id: string;
  name: string;
  role: string;
  color: string;
  tokensUsed: number;
  latencyMs: number;
  successRate: number;
  state: string;
}

interface ABTest {
  id: string;
  campaignId: string;
  status: string;
  metrics: Record<string, { name: string; clicks: number; conversions: number }>;
}

interface SEORanking {
  domainAuthority: number;
  keywordClarity: number;
  rankings: { term: string; rank: number }[];
}

interface ROIChannel {
  channel: string;
  roi: number;
  revenue: number;
}

interface ROIData {
  current: ROIChannel[];
  suggestions: string[];
}

interface AssetVariant {
  id: string;
  content: string;
  type: string;
  score: number;
  reasoning?: string;
}

const AGENTS: AgentMetric[] = [
  { id: 'SN-00', name: 'NEXUS PRIME', role: 'Orchestrator', color: 'var(--color-agent-sn00)', tokensUsed: 0, latencyMs: 0, successRate: 100, state: 'idle' },
  { id: 'SP-01', name: 'STRATEGIC CORTEX', role: 'Strategist', color: 'var(--color-agent-sp01)', tokensUsed: 0, latencyMs: 0, successRate: 100, state: 'idle' },
  { id: 'CC-06', name: 'COGNITIVE CORE', role: 'Copywriter', color: 'var(--color-agent-cc06)', tokensUsed: 0, latencyMs: 0, successRate: 100, state: 'idle' },
  { id: 'DA-03', name: 'DESIGN ARCHITECT', role: 'Visual Artist', color: 'var(--color-agent-da03)', tokensUsed: 0, latencyMs: 0, successRate: 100, state: 'idle' },
  { id: 'RA-01', name: 'SECURITY CORTEX', role: 'Auditor', color: 'var(--color-agent-ra01)', tokensUsed: 0, latencyMs: 0, successRate: 100, state: 'idle' },
];

export function SwarmAnalytics() {
  const [agents, setAgents] = useState<AgentMetric[]>(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [throughput, setThroughput] = useState<{ time: string; tokens: number; load: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d' | '30d'>('24h');
  const [activeTab, setActiveTab] = useState<'matrix' | 'performance'>('matrix');
  
  // Performance Metrics
  const [kpis, setKpis] = useState({ clicks: 0, conversions: 0, views: 0, ctr: 0, conversionRate: 0 });
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [seo, setSeo] = useState<SEORanking | null>(null);

  // Phase 6: ROI & AB State
  const [roiData, setRoiData] = useState<ROIData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [variantInput, setVariantInput] = useState('');
  const [variants, setVariants] = useState<AssetVariant[]>([]);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, throughputRes, kpiRes, abRes, seoRes] = await Promise.all([
          fetch(`${API_BASE_URL}/analytics/agents`).catch(() => null),
          fetch(`${API_BASE_URL}/analytics/throughput`).catch(() => null),
          fetch(`${API_BASE_URL}/analytics/kpis`).catch(() => null),
          fetch(`${API_BASE_URL}/analytics/ab-tests`).catch(() => null),
          fetch(`${API_BASE_URL}/analytics/seo-rankings`).catch(() => null),
        ]);

        if (analyticsRes?.ok) {
          const data = await analyticsRes.json();
          if (data.agents) {
            setAgents(prev => prev.map(a => {
              const live = data.agents.find((d: AgentMetric) => d.id === a.id);
              return live ? { ...a, ...live } : a;
            }));
          }
        }

        if (throughputRes?.ok) {
          const data = await throughputRes.json();
          if (data.throughput) setThroughput(data.throughput);
        }

        if (kpiRes?.ok) setKpis(await kpiRes.json());
        if (abRes?.ok) setAbTests(await abRes.json());
        if (seoRes?.ok) setSeo(await seoRes.json());
      } catch {
        // Backend unavailable — use defaults
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimizeROI = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/roi/optimize`, { method: 'POST' });
      if (res.ok) {
        setRoiData(await res.json());
      }
    } catch (e) {
      console.error('ROI Optimization failed', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateVariants = async () => {
    if (!variantInput) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/ab/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original: variantInput, type: 'headline', count: 3 })
      });
      if (res.ok) {
        setVariants(await res.json());
      }
    } catch (e) {
      console.error('Variant generation failed', e);
    } finally {
      setLoading(false);
    }
  };

  // Listen for live swarm state events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SwarmState>).detail;
      if (detail?.subAgents) {
        setAgents(prev => prev.map(a => {
          const sub = detail.subAgents[a.id];
          if (sub) return { ...a, state: sub.state };
          return a;
        }));
      }
    };
    window.addEventListener('swarm-state', handler);
    return () => window.removeEventListener('swarm-state', handler);
  }, []);

  // Generate default throughput data if none from API
  const chartData = throughput.length > 0 ? throughput : [
    { time: '00:00', tokens: 0, load: 0 },
    { time: '04:00', tokens: 120, load: 15 },
    { time: '08:00', tokens: 890, load: 45 },
    { time: '12:00', tokens: 2400, load: 72 },
    { time: '16:00', tokens: 3200, load: 88 },
    { time: '20:00', tokens: 1800, load: 55 },
    { time: '23:59', tokens: 400, load: 20 },
  ];

  const totalTokens = agents.reduce((sum, a) => sum + a.tokensUsed, 0);
  const avgLatency = agents.reduce((sum, a) => sum + a.latencyMs, 0) / agents.length || 0;
  const avgSuccess = agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length || 0;

  const pieData = agents.map(a => ({ name: a.id, value: Math.max(a.tokensUsed, 1) }));
  const PIE_COLORS = ['#00E5FF', '#7B2FBE', '#FF007A', '#FFD700', '#00FF88'];

  const stateColor = (s: string) => {
    switch (s) {
      case 'working': case 'processing': return 'badge-processing';
      case 'idle': return 'badge-online';
      case 'error': return 'badge-error';
      default: return 'badge-online';
    }
  };

  return (
    <div id="analytics-export-container" className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network size={20} className="text-accent" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Swarm Analytics</h2>
          <span className="label text-white/20 mt-1">Real-time Agent Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLoading(true)} className="btn-outline text-xs py-2 px-4 flex items-center gap-2">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <ExportMenu options={[
            { label: 'PDF Report', format: 'PDF', onClick: () => downloadPDF('analytics-export-container', 'G5_Swarm_Analytics') },
            { label: 'CSV Metrics', format: 'CSV', onClick: () => downloadCSV(agents.map(a => ({ id: a.id, name: a.name, role: a.role, tokensUsed: a.tokensUsed, latencyMs: a.latencyMs, successRate: a.successRate, state: a.state })), 'G5_Agent_Metrics') },
            { label: 'PNG Screenshot', format: 'PNG', onClick: () => downloadPNG('analytics-export-container', 'G5_Swarm_Analytics') },
          ]} />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-white/5 pb-1">
        <button onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'matrix' ? 'text-accent' : 'text-white/40 hover:text-white/70'}`}>
          <Network size={14} /> Swarm Matrix
          {activeTab === 'matrix' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
        </button>
        <button onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'performance' ? 'text-gold' : 'text-white/40 hover:text-white/70'}`}>
          <Zap size={14} /> Performance Hub
          {activeTab === 'performance' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-1">
        {(['1h', '6h', '24h', '7d', '30d'] as const).map(range => (
          <button key={range} onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors ${timeRange === range ? 'bg-accent/15 text-accent border border-accent/30' : 'text-white/30 hover:text-white/60 border border-transparent'}`}>
            {range}
          </button>
        ))}
      </div>

      {activeTab === 'matrix' ? (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cpu size={16} />, label: 'Active Agents', value: agents.filter(a => a.state !== 'idle').length + '/' + agents.length, color: 'var(--color-accent)' },
              { icon: <Zap size={16} />, label: 'Total Tokens', value: totalTokens > 1000 ? (totalTokens / 1000).toFixed(1) + 'K' : String(totalTokens), color: 'var(--color-gold)' },
              { icon: <Clock size={16} />, label: 'Avg Latency', value: avgLatency.toFixed(0) + 'ms', color: 'var(--color-magenta)' },
              { icon: <Activity size={16} />, label: 'Success Rate', value: avgSuccess.toFixed(1) + '%', color: 'var(--color-emerald)' },
            ].map(m => (
              <div key={m.label} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <span className="label mb-0!">{m.label}</span>
                </div>
                <p className="font-mono text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Throughput Chart */}
            <div className="md:col-span-2 glass-card p-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" /> Throughput Timeline
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="Roboto Mono" />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="Roboto Mono" />
                  <Tooltip contentStyle={{ background: 'rgba(10,1,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'Roboto Mono', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="tokens" stroke="#00E5FF" fill="url(#tokenGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Token Distribution */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                <Database size={16} className="text-gold" /> Token Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(10,1,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'Roboto Mono', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {agents.map((a, i) => (
                  <span key={a.id} className="font-mono text-[9px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {a.id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Cards */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight flex items-center gap-2">
              <Cpu size={16} className="text-accent" /> Agent Performance Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {agents.map(agent => (
                <motion.div key={agent.id} whileHover={{ y: -2 }}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  className={`glass-card p-5 cursor-pointer transition-all ${selectedAgent === agent.id ? 'border-accent/40 glow-cyan' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold" style={{ color: agent.color }}>{agent.id}</span>
                    <span className={`badge text-[8px] ${stateColor(agent.state)}`}>{agent.state}</span>
                  </div>
                  <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-4">{agent.role}</p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                    <motion.div className="h-full rounded-full" style={{ background: agent.color }}
                      initial={{ width: 0 }} animate={{ width: `${agent.successRate}%` }} transition={{ duration: 1 }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-mono text-[8px] text-white/20 uppercase">Tokens</span>
                      <p className="font-mono text-xs font-bold">{agent.tokensUsed > 1000 ? (agent.tokensUsed/1000).toFixed(1)+'K' : agent.tokensUsed}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-white/20 uppercase">Latency</span>
                      <p className="font-mono text-xs font-bold">{agent.latencyMs}ms</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Executive Intelligence: Phase 6 Core */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ROI Optimization Panel */}
            <div className="lg:col-span-2 glass-card p-6 border-gold/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold uppercase flex items-center gap-2">
                  <Activity size={18} className="text-gold" /> ROI Optimization Engine
                </h3>
                <button 
                  onClick={handleOptimizeROI}
                  disabled={isOptimizing}
                  className="btn btn-primary btn-sm px-4"
                  style={{ background: 'var(--color-obsidian)', border: '1px solid var(--color-gold)' }}
                >
                  {isOptimizing ? <RefreshCw size={12} className="animate-spin" /> : 'Analyze & Reallocate'}
                </button>
              </div>

              {roiData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Performance Matrix</p>
                    {roiData.current.map((ch) => (
                      <div key={ch.channel} className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold">{ch.channel}</p>
                          <p className="text-[9px] font-mono text-white/30">ROI: {ch.roi}x | Rev: ${ch.revenue}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge text-[9px] ${ch.roi > 3 ? 'badge-online' : ch.roi < 2 ? 'badge-error' : 'badge-processing'}`}>
                            {ch.roi > 3 ? 'SCALING' : ch.roi < 2 ? 'INEFFICIENT' : 'STABLE'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Optimization Strategy</p>
                    {roiData.suggestions.map((s, i) => (
                      <div key={i} className="p-3 bg-gold/5 rounded-lg border border-gold/10 flex gap-3 items-start">
                        <Zap size={14} className="text-gold shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-relaxed text-white/80">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                  <BarChart3 size={32} className="text-white/5 mx-auto mb-3" />
                  <p className="font-mono text-xs text-white/20">Awaiting ROI simulation pulse...</p>
                </div>
              )}
            </div>

            {/* A/B Creation Forge */}
            <div className="glass-card p-6 border-accent/20">
              <h3 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <Network size={18} className="text-accent" /> A/B Creation Forge
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={variantInput}
                    onChange={(e) => setVariantInput(e.target.value)}
                    placeholder="Input headline or CTA to scale..."
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white/80 focus:outline-none focus:border-accent/40 h-24 resize-none"
                  />
                  <button 
                    onClick={handleGenerateVariants}
                    className="absolute bottom-3 right-3 p-2 bg-accent/20 text-accent rounded-lg border border-accent/30 hover:bg-accent/30 transition-colors"
                  >
                    <RefreshCw size={14} className={loading && variantInput ? 'animate-spin' : ''} />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Scored Variants</p>
                  {variants.length > 0 ? variants.map((v) => (
                    <div key={v.id} className="p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-accent/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-accent">SCORE: {v.score}</span>
                        <div className="flex h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${v.score}%` }} />
                        </div>
                      </div>
                      <p className="text-[11px] text-white/70 italic leading-snug">"{v.content}"</p>
                    </div>
                  )) : (
                    <p className="text-[10px] text-white/10 text-center py-4">Input text to trigger CC-06 Forge</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance KPIs - Lower Priority in Hub */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Clicks', value: kpis.clicks, color: 'text-accent' },
              { label: 'Conversions', value: kpis.conversions, color: 'text-emerald-400' },
              { label: 'Avg CTR', value: `${kpis.ctr.toFixed(2)}%`, color: 'text-gold' },
              { label: 'Conv. Rate', value: `${kpis.conversionRate.toFixed(1)}%`, color: 'text-pink-400' },
            ].map((k) => (
              <div key={k.label} className="glass-card p-4">
                <span className="font-mono text-[9px] text-white/30 uppercase">{k.label}</span>
                <p className={`text-xl font-mono font-bold ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO Rankings */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-gold" /> Neural SEO Visibility
              </h3>
              {seo && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Domain Authority</p>
                      <p className="text-2xl font-mono font-bold text-gold">{seo.domainAuthority}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase">Keyword Clarity</p>
                      <p className="text-2xl font-mono font-bold text-accent">{seo.keywordClarity}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {seo.rankings.map((r) => (
                      <div key={r.term} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs">{r.term}</span>
                        <span className="badge badge-online text-[10px]">Pos. #{r.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* A/B Historical Data */}
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <Activity size={18} className="text-magenta" /> Network Experiments
              </h3>
              <div className="space-y-4">
                {abTests.map(test => (
                  <div key={test.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="font-mono text-[10px] text-white/40 mb-2 uppercase">ID: {test.id}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(test.metrics).map(([vid, v]) => (
                        <div key={vid} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-bold">{v.name}</p>
                            <div className="w-full h-1 bg-white/5 rounded-full mt-1">
                              <div className="h-full bg-magenta/40 rounded-full" style={{ width: `${(v.clicks / 100) * 100}%` }} />
                            </div>
                          </div>
                          <div className="text-right pl-4">
                            <p className="text-xs font-mono font-bold">{v.clicks} CLK</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
