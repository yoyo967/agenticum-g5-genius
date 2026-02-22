import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Database, Clock, TrendingUp, Play, CheckCircle, Settings, Network, FileText, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SwarmState } from './GeniusConsole';

const mockData7Days = [
  { day: 'Mon', outputs: 58, tokensK: 162, blocked: 1 },
  { day: 'Tue', outputs: 72, tokensK: 198, blocked: 0 },
  { day: 'Wed', outputs: 45, tokensK: 124, blocked: 2 },
  { day: 'Thu', outputs: 89, tokensK: 241, blocked: 1 },
  { day: 'Fri', outputs: 94, tokensK: 267, blocked: 3 },
  { day: 'Sat', outputs: 23, tokensK: 64,  blocked: 0 },
  { day: 'Sun', outputs: 19, tokensK: 52,  blocked: 0 },
];

export function ExecutiveDashboard({ onNavigate }: { onNavigate?: (module: 'campaign' | 'vault' | 'settings' | 'synergy' | 'memory') => void }) {
  const [swarmState, setSwarmState] = useState<SwarmState | null>(null);
  const [logs, setLogs] = useState<{ id: string; time: string; agent: string; text: string; type: 'success' | 'info' | 'user' }[]>([
    { id: '1', time: '08:42', agent: 'SYS.CORE', text: 'Neural paths verified. OS Boot sequence optimal.', type: 'info' },
    { id: '2', time: '09:15', agent: 'PM-07', text: 'Global SEO Data Matrix refreshed.', type: 'success' },
    { id: '3', time: '10:04', agent: 'DA-03', text: 'Visual asset cache cleared. Imagen cluster ready.', type: 'info' },
    { id: '4', time: '11:22', agent: 'DIRECTIVE', text: 'User initiated system diagnostic override.', type: 'user' },
    { id: '5', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), agent: 'TELEMETRY', text: 'Connection established. Awaiting Live Streams...', type: 'success' }
  ]);
  const [totalOutputs, setTotalOutputs] = useState(0);

  useEffect(() => {
    const handleStatus = (e: Event) => setSwarmState((e as CustomEvent).detail);
    const handlePayload = (e: Event) => {
      const payload = (e as CustomEvent).detail;
      setLogs(prev => [{
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: String(payload.from).toUpperCase(),
        text: `Data Transfer: ${payload.payloadType} → ${String(payload.to).toUpperCase()}`,
        type: 'info' as const
      }, ...prev].slice(0, 15));
    };
    
    // Fetch real metrics
    const fetchAnalytics = async () => {
      try {
        const [, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/analytics/throughput`),
          fetch(`${import.meta.env.VITE_API_URL}/api/analytics/stats`)
        ]);
        const stats = await statsRes.json() as { totalOutputs: number };
        if (stats && typeof stats.totalOutputs === 'number') {
          setTotalOutputs(stats.totalOutputs);
        }
        
        // We could dynamically update mockData7Days here if RECHARTS supported direct state updates 
        // for simplicity in this hackathon, we'll keep the mock array for structure but update the counts.
        setTotalOutputs(stats.totalOutputs);
        // Note: Real Recharts data binding would go here in production
      } catch (e) {
         console.warn('Analytics fetch failed:', e);
      }
    };

    fetchAnalytics();

    window.addEventListener('swarm-status', handleStatus);
    window.addEventListener('swarm-payload', handlePayload);
    
    return () => {
      window.removeEventListener('swarm-status', handleStatus);
      window.removeEventListener('swarm-payload', handlePayload);
    };
  }, []);

  const handleInitCampaign = () => {
    if (onNavigate) {
       onNavigate('campaign');
    } else {
       window.dispatchEvent(new CustomEvent('trigger-orchestration', { 
         detail: { input: 'Global Campaign Initiation Directive' } 
       }));
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6">
      
      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <button 
          onClick={handleInitCampaign}
          className="flex items-center justify-center gap-3 p-4 rounded-xl bg-neural-blue text-obsidian font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        >
          <Play size={16} /> Initialize Campaign
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('memory')}
          className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
        >
          <CheckCircle size={16} /> Review Outputs
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('vault')}
          className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
        >
          <Database size={16} /> Access Vault
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('settings')}
          className="flex items-center justify-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
        >
          <Settings size={16} /> Agent Settings
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <StatCard 
          title="Active Workflows" 
          value="4" 
          subtext="Autopilot Sequences Running"
          icon={<Activity />}
          color="text-pink-500"
          bg="bg-pink-500/10"
          border="border-pink-500/20"
        />
        <StatCard 
          title="Total Outputs" 
          value={totalOutputs.toString()} 
          subtext="Generated Assets"
          icon={<FileText />}
          color="text-neural-blue"
          bg="bg-neural-blue/10"
          border="border-neural-blue/20"
        />
        <StatCard 
          title="Swarm Readiness" 
          value="100%" 
          subtext="All 5 Agents Online"
          icon={<Users />}
          color="text-neural-gold"
          bg="bg-neural-gold/10"
          border="border-neural-gold/20"
        />
        <StatCard 
          title="Senate Pending" 
          value="3" 
          subtext="Action Required"
          icon={<Shield />}
          color="text-yellow-500"
          bg="bg-yellow-500/10"
          border="border-yellow-500/20"
        />
      </div>

      <div className="flex gap-6 flex-1 min-h-[400px]">
        {/* Left: Live Activity Feed */}
        <div className="w-1/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
               <Clock size={16} className="text-white/50" />
               Global Activity Log
             </h3>
           </div>
           <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
              {logs.length > 0 ? logs.map(log => (
                <LogItem key={log.id} time={log.time} agent={log.agent} text={log.text} type={log.type} />
              )) : (
                <div className="h-full flex items-center justify-center opacity-30 text-[10px] uppercase font-mono tracking-widest text-center">
                  Awaiting Neural Telemetry...
                </div>
              )}
           </div>
        </div>

        {/* Right: Agency Performance Analytics */}
        <div className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
               <TrendingUp size={16} className="text-white/50" />
               Agency Throughput
             </h3>
             <select className="bg-black/50 border border-white/10 rounded px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
           </div>
           
           <div className="flex-1 p-8 flex flex-col">
              {/* Recharts Area */}
              <div className="flex-1 flex items-end justify-between gap-2 border-b border-white/10 pb-2 relative min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px' }} 
                      itemStyle={{ fontSize: '12px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="outputs" stroke="#00E5FF" fill="url(#colorOutputs)" strokeWidth={2} name="Total Outputs" />
                    <Area type="monotone" dataKey="tokensK" stroke="#FFD700" fill="url(#colorTokens)" strokeWidth={2} name="Tokens (k)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-6">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Total Outputs</p>
                   <p className="text-2xl font-black text-white">{totalOutputs} <span className="text-[10px] text-green-500 font-bold ml-1">Live</span></p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Tokens Consumed</p>
                   <p className="text-2xl font-black text-white">{(totalOutputs * 12.4).toFixed(1)}K <span className="text-[10px] text-white/50 font-bold ml-1">Est.</span></p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Senate Blocked</p>
                   <p className="text-2xl font-black text-white">3 <span className="text-[10px] text-white/50 font-medium ml-1">Brand safety</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Swarm Health Telemetry */}
      <div className="shrink-0 flex flex-col gap-4 mt-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
          <Network size={14} className="text-neural-blue" />
          Live Swarm Telemetry
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {swarmState ? [swarmState, ...Object.values(swarmState.subAgents || {})].map((agent, i) => (
              <motion.div 
                key={agent.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border border-white/5 bg-black/40 glass flex flex-col gap-3 group hover:border-white/20 transition-all shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black tracking-widest opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: agent.color }}>
                    {agent.id.toUpperCase()}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${agent.state !== 'idle' ? 'bg-green-500 animate-pulse' : 'bg-white/10'}`} />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                    <span className="text-white/30">Process</span>
                    <span className="text-white/70 font-mono">{agent.progress}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                    <span className="text-white/30">State</span>
                    <span className="text-white/70 font-mono italic">{agent.state}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/5 mt-auto">
                  <span className="text-[8px] uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors block truncate">
                    {agent.lastStatus || 'Awaiting Directive'}
                  </span>
                </div>
              </motion.div>
            )) : (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/5 bg-black/5 flex flex-col animate-pulse min-h-[140px]" />
              ))
            )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext, icon, color, bg, border }: { title: string, value: string, subtext: string, icon: React.ReactNode, color: string, bg: string, border: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${border} ${bg} flex flex-col backdrop-blur-md shadow-xl relative overflow-hidden`}
    >
      <div className={`absolute -right-4 -top-4 opacity-10 scale-150 ${color}`}>{icon}</div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-black/20 ${color}`}>
        {icon}
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{title}</h4>
      <p className="text-3xl font-display font-black text-white mb-2">{value}</p>
      <p className="text-[9px] uppercase font-bold tracking-widest text-white/30">{subtext}</p>
    </motion.div>
  );
}

function LogItem({ time, agent, text, type }: { time: string, agent: string, text: string, type: 'success' | 'info' | 'user' }) {
  const getColor = () => {
    if (type === 'success') return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (type === 'user') return 'text-neural-purple bg-neural-purple/10 border-neural-purple/20';
    return 'text-neural-blue bg-neural-blue/10 border-neural-blue/20';
  };

  return (
    <div className="flex gap-4 group">
      <div className="w-12 text-right pt-1 shrink-0">
        <span className="text-[9px] font-mono text-white/30">{time}</span>
      </div>
      <div className="relative flex flex-col items-center">
        <div className="w-px h-full bg-white/5 absolute top-0 bottom-0" />
        <div className={`w-2.5 h-2.5 rounded-full z-10 mt-1.5 ${type === 'success' ? 'bg-green-500' : type === 'user' ? 'bg-neural-purple' : 'bg-neural-blue'} shadow-[0_0_10px_currentColor]`} />
      </div>
      <div className={`flex-1 p-3 rounded-xl border backdrop-blur-sm ${getColor()} transition-colors`}>
         <div className="flex items-center justify-between mb-1">
           <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{agent}</span>
         </div>
         <p className="text-xs font-medium text-white/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
