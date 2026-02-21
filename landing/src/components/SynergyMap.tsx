import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Share2, GitMerge } from 'lucide-react';

const AGENTS = [
  { id: 'SN-00', name: 'Strategic Node', role: 'Orchestrator', color: '#00e5ff', x: 50, y: 15 },
  { id: 'SP-01', name: 'Syntactic Processor', role: 'Data Analyst', color: '#8b5cf6', x: 80, y: 40 },
  { id: 'DA-03', name: 'Diffusion Architect', role: 'Visuals', color: '#ec4899', x: 70, y: 80 },
  { id: 'SC-09', name: 'Security Cortex', role: 'Ethics/Safety', color: '#ffd700', x: 30, y: 80 },
  { id: 'CC-06', name: 'Cognitive Core', role: 'Copywriter', color: '#10b981', x: 20, y: 40 }
];

type Payload = {
  id: number;
  from: string;
  to: string;
  type: string;
  timestamp: string;
};

const PAYLOAD_TYPES = ['Strategic Brief', 'Image Prompt', 'Brand Copy', 'Safety Audit', 'Data Vector'];

export function SynergyMap() {
  const [activePayloads, setActivePayloads] = useState<Payload[]>([]);
  const [logs, setLogs] = useState<Payload[]>([]);

  // Simulate real-time payload transfers
  useEffect(() => {
    const interval = setInterval(() => {
      const fromIndex = Math.floor(Math.random() * AGENTS.length);
      let toIndex = Math.floor(Math.random() * AGENTS.length);
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * AGENTS.length);
      }

      const newPayload: Payload = {
        id: Date.now(),
        from: AGENTS[fromIndex].id,
        to: AGENTS[toIndex].id,
        type: PAYLOAD_TYPES[Math.floor(Math.random() * PAYLOAD_TYPES.length)],
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setActivePayloads(prev => [...prev, newPayload]);
      setLogs(prev => [newPayload, ...prev].slice(0, 15)); // Keep last 15 logs
      
      // Remove payload after animation (2000ms duration)
      setTimeout(() => {
        setActivePayloads(prev => prev.filter(p => p.id !== newPayload.id));
      }, 2000);

    }, 1500 + Math.random() * 2000); // Random interval between 1.5s and 3.5s

    return () => clearInterval(interval);
  }, []);

  const getAgentColor = (agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId);
    return agent ? agent.color : '#ffffff';
  };

  return (
    <div className="h-full flex gap-6 overflow-hidden">
      
      {/* Left: Interactive Node Map */}
      <div className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative">
        <div className="absolute top-6 left-6 z-10">
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
             <Share2 size={24} className="text-neural-blue animate-pulse" />
             Synergy Substrate
          </h2>
          <p className="text-white/40 font-mono text-[10px] mt-1 uppercase tracking-widest">
            Live Vector Payload Transmission Layer
          </p>
        </div>

        <div className="absolute top-6 right-6 z-10 flex gap-4">
           <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Swarm Sync Optimal</span>
           </div>
        </div>

        {/* The Map */}
        <div className="flex-1 relative w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/5 to-transparent flex items-center justify-center">
          
          {/* Static Background Lines (Pentagram shape) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block">
             {AGENTS.map((agent1, i) => (
               AGENTS.slice(i + 1).map((agent2, j) => (
                 <line 
                   key={`line-${i}-${j}`}
                   x1={`${agent1.x}%`} y1={`${agent1.y}%`}
                   x2={`${agent2.x}%`} y2={`${agent2.y}%`}
                   stroke="rgba(255,255,255,0.2)"
                   strokeWidth="1"
                   strokeDasharray="4 4"
                 />
               ))
             ))}
          </svg>

          {/* Nodes */}
          {AGENTS.map(agent => (
            <div 
              key={agent.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-20 cursor-crosshair"
              style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
            >
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 20px ${agent.color}40`, `0 0 40px ${agent.color}80`, `0 0 20px ${agent.color}40`] }}
                 transition={{ repeat: Infinity, duration: 2 + Math.random() }}
                 className="w-16 h-16 rounded-2xl glass border flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                 style={{ borderColor: `${agent.color}80`, backgroundColor: `${agent.color}10` }}
               >
                 <Cpu size={24} color={agent.color} className="group-hover:opacity-100" />
               </motion.div>
               
               <div className="mt-4 text-center glass px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                 <p className="text-xs font-black uppercase tracking-widest" style={{ color: agent.color }}>
                   {agent.id}
                 </p>
                 <p className="text-[8px] font-mono text-white/40 uppercase mt-0.5">
                   {agent.name}
                 </p>
               </div>
            </div>
          ))}

          {/* Animated Payloads */}
          <AnimatePresence>
            {activePayloads.map(payload => {
              const fromAgent = AGENTS.find(a => a.id === payload.from);
              const toAgent = AGENTS.find(a => a.id === payload.to);
              if (!fromAgent || !toAgent) return null;

              return (
                <motion.div
                  key={payload.id}
                  initial={{ x: `${fromAgent.x}%`, y: `${fromAgent.y}%`, opacity: 0, scale: 0 }}
                  animate={{ x: `${toAgent.x}%`, y: `${toAgent.y}%`, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-3 h-3 rounded-full z-30 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    backgroundColor: getAgentColor(payload.from),
                    boxShadow: `0 0 20px ${getAgentColor(payload.from)}, 0 0 40px ${getAgentColor(payload.to)}`
                  }}
                />
              );
            })}
          </AnimatePresence>

        </div>
      </div>

      {/* Right: Live Log Feed */}
      <div className="w-1/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
         <div className="p-6 border-b border-white/5 shrink-0 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Activity size={16} className="text-neural-purple" />
              Network Telemetry
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-neural-blue/10 border border-neural-blue/30 rounded text-neural-blue text-[9px] font-black uppercase tracking-wider animate-pulse">
              Live Stream
            </span>
         </div>

         <div className="flex-1 overflow-y-auto scrollbar-none p-4 flex flex-col gap-2 relative">
            <div className="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-black/40 to-transparent pointer-events-none z-10" />
            
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="p-3 rounded-lg border border-white/5 bg-black/50 backdrop-blur-md flex flex-col gap-2 border-l-2"
                  style={{ borderLeftColor: getAgentColor(log.from) }}
                >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: getAgentColor(log.from) }}>
                         {log.from}
                       </span>
                       <ChevronRight size={10} className="text-white/30" />
                       <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: getAgentColor(log.to) }}>
                         {log.to}
                       </span>
                     </div>
                     <span className="text-[9px] font-mono text-white/40">{log.timestamp}</span>
                   </div>
                   
                   <p className="text-xs text-white/80 font-light flex items-center gap-2">
                     <GitMerge size={12} className="text-white/30" />
                     Transmitting <span className="font-bold text-white">{log.type}</span> Payload
                   </p>
                </motion.div>
              ))}
            </AnimatePresence>

         </div>
      </div>

    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
