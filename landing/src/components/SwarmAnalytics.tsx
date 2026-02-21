import { useState } from 'react';

import { Network, Cpu, Zap, BarChart3, Database } from 'lucide-react';

export function SwarmAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sn00' | 'sp01' | 'cc06' | 'da03' | 'ra01'>('overview');

  const AgentMetrics = ({ agent, role, tokens, latency, cost, successRate, memory }: any) => (
    <div className="flex flex-col border border-white/5 bg-black/40 rounded-xl p-5 hover:border-neural-blue/30 transition-colors group cursor-pointer" onClick={() => setActiveTab(agent.toLowerCase().replace('-', ''))}>
       <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
           <div className={`w-8 h-8 rounded border flex items-center justify-center font-black text-[10px] ${agent === 'SN-00' ? 'border-neural-blue text-neural-blue bg-neural-blue/10' : agent === 'SP-01' ? 'border-pink-500 text-pink-500 bg-pink-500/10' : agent === 'CC-06' ? 'border-orange-500 text-orange-500 bg-orange-500/10' : agent === 'DA-03' ? 'border-neural-purple text-neural-purple bg-neural-purple/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
             {agent.split('-')[1]}
           </div>
           <div>
             <h4 className="text-white font-black tracking-widest uppercase text-xs">{agent}</h4>
             <p className="text-white/40 text-[9px] uppercase tracking-widest">{role}</p>
           </div>
         </div>
         <span className={`text-[10px] font-black tracking-widest ${successRate > 95 ? 'text-green-500' : 'text-neural-gold'}`}>{successRate}% SR</span>
       </div>
       
       <div className="space-y-3">
         <div className="flex justify-between items-center text-xs">
           <span className="text-white/50 flex items-center gap-1.5"><Cpu size={12} /> Compute Layer</span>
           <span className="text-white font-mono">{latency}ms avg</span>
         </div>
         <div className="flex justify-between items-center text-xs">
           <span className="text-white/50 flex items-center gap-1.5"><Zap size={12} /> Live Tokens</span>
           <span className="text-white font-mono">{tokens}</span>
         </div>
         <div className="flex justify-between items-center text-xs">
           <span className="text-white/50 flex items-center gap-1.5"><Database size={12} /> Vector Malloc</span>
           <span className="text-white font-mono">{memory}</span>
         </div>
         <div className="pt-3 border-t border-white/5 flex justify-between items-center mt-2">
            <span className="text-[9px] uppercase tracking-widest text-white/30">OpEx Run Rate</span>
            <span className="font-mono text-neural-blue text-xs">${cost} <span className="text-white/30">/mo</span></span>
         </div>
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6">
      
      {/* Header telemetry */}
      <div className="flex items-center justify-between shrink-0 bg-black/40 border border-white/5 p-6 rounded-2xl glass">
         <div>
           <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <Network size={20} className="text-neural-blue" />
             Swarm Telemetry Overview
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Real-time resource utilization & token economics for the 5-Node Cluster.</p>
         </div>
         <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Global Compute</p>
              <p className="text-2xl font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                98.4%
              </p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Vector DB Size</p>
              <p className="text-2xl font-mono text-white">4.2 <span className="text-sm text-white/50">TB</span></p>
            </div>
         </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[500px]">
        {/* Left: Agent Grid */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-none">
           <AgentMetrics agent="SN-00" role="Orchestrator" tokens="4.2M" latency={42} cost="142.50" successRate={99.9} memory="850 MB" />
           <AgentMetrics agent="SP-01" role="Strategist" tokens="8.1M" latency={120} cost="85.20" successRate={98.5} memory="1.2 GB" />
           <AgentMetrics agent="CC-06" role="Director" tokens="12.4M" latency={85} cost="210.00" successRate={96.2} memory="420 MB" />
           <AgentMetrics agent="DA-03" role="Architect" tokens="1.2M" latency={1400} cost="450.00" successRate={94.0} memory="2.1 GB" />
           <AgentMetrics agent="RA-01" role="Auditor" tokens="5.5M" latency={65} cost="45.00" successRate={100} memory="150 MB" />
        </div>

        {/* Right: Deep Dive Terminal */}
        <div className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-black/60 shrink-0">
             <button className={`text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-colors ${activeTab === 'overview' ? 'bg-neural-blue text-black' : 'bg-white/5 text-white/50 hover:text-white'}`} onClick={() => setActiveTab('overview')}>Macro View</button>
             <button className={`text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-colors ${activeTab !== 'overview' ? 'bg-white/20 text-white' : 'bg-transparent text-white/30 hover:text-white'}`} disabled>Micro Analysis: {activeTab === 'overview' ? 'Select Node' : activeTab.toUpperCase()}</button>
           </div>
           
           <div className="flex-1 p-8 relative flex flex-col">
              {/* Background Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* Main Chart Area (Simulated Bloomberg Terminal density) */}
              <div className="flex-1 border border-white/10 bg-black/50 rounded-lg p-6 flex flex-col relative z-10 backdrop-blur-sm">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                        <BarChart3 size={16} className="text-neural-blue" />
                        Network Payload Distribution (T-30 Days)
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono mt-1">Aggregated inference requests across all 5 Vertex AI models.</p>
                    </div>
                 </div>

                 {/* Simulated complex chart */}
                 <div className="flex-1 relative flex items-end gap-1 mb-8">
                    {Array.from({ length: 45 }).map((_, i) => {
                      const h1 = Math.random() * 40 + 10;
                      const h2 = Math.random() * 30;
                      const h3 = Math.random() * 20;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                           <div className="w-full bg-orange-500/80 rounded-t-sm group-hover:brightness-150 transition-all" style={{ height: `${h3}%` }} />
                           <div className="w-full bg-pink-500/80 rounded-t-sm group-hover:brightness-150 transition-all" style={{ height: `${h2}%` }} />
                           <div className="w-full bg-neural-blue/80 rounded-t-sm group-hover:brightness-150 transition-all" style={{ height: `${h1}%` }} />
                        </div>
                      )
                    })}
                 </div>

                 {/* Telemetry Readouts */}
                 <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-1">Peak Tokens/Sec</p>
                      <p className="text-lg font-mono text-white">4,096 <span className="text-[10px] text-red-500">⚠</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-1">Memory Allocation</p>
                      <p className="text-lg font-mono text-white">4.2 TB</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-1">Total Burn (USD)</p>
                      <p className="text-lg font-mono text-neural-gold">$932.70</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-1">API Error Rate</p>
                      <p className="text-lg font-mono text-green-500">0.02%</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
