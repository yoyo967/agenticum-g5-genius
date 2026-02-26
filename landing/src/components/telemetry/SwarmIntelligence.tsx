import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Zap, Brain, Hexagon, Layers } from 'lucide-react';

interface CognitiveNode {
  id: string;
  label: string;
  agentId: string;
  status: 'active' | 'synced' | 'pending';
  x: number;
  y: number;
}

export const SwarmIntelligence: React.FC = () => {
  const [nodes, setNodes] = useState<CognitiveNode[]>([
    { id: '1', label: 'Semantic Extraction', agentId: 'SN-00', status: 'synced', x: 30, y: 40 },
    { id: '2', label: 'Market Sentiment', agentId: 'SP-01', status: 'active', x: 60, y: 20 },
    { id: '3', label: 'Narrative Synthesis', agentId: 'CC-06', status: 'pending', x: 50, y: 70 },
    { id: '4', label: 'Visual Archetype', agentId: 'DA-03', status: 'active', x: 80, y: 50 },
    { id: '5', label: 'Compliance Audit', agentId: 'RA-01', status: 'synced', x: 20, y: 80 },
  ]);

  useEffect(() => {
    const handleCalibration = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNodes(prev => prev.map(node => {
        if (node.agentId.toLowerCase() === detail.agentId.toLowerCase().replace('-', '')) {
          return { ...node, status: 'active' };
        }
        return node;
      }));
    };
    window.addEventListener('swarm-calibration', handleCalibration);
    return () => window.removeEventListener('swarm-calibration', handleCalibration);
  }, []);

  const CalibrationLogs = () => {
    const [logs, setLogs] = useState<{agent: string, msg: string, type?: string}[]>([]);
    
    useEffect(() => {
       const handler = (e: Event) => {
          const detail = (e as CustomEvent).detail;
          setLogs(prev => [{
            agent: detail.agentId.toUpperCase(),
            msg: `Self-Correction Iteration ${detail.iteration}: ${detail.status}`,
            type: 'calibration'
          }, ...prev.slice(0, 5)]);
       };
       window.addEventListener('swarm-calibration', handler);
       return () => window.removeEventListener('swarm-calibration', handler);
    }, []);

    return (
       <>
          {logs.length === 0 ? (
            <>
               <Log agent="SN-00" msg="Orchestrating multi-layered storyboard parse..." />
               <Log agent="SP-01" msg="Analyzing market saturation for Cyber-Samurai niche." />
               <Log agent="CC-06" msg="Synthesizing emotional dialogue for Scene 04." />
               <Log agent="DA-03" msg="Drafting visual prompts for environment elements." />
               <Log agent="RA-01" msg="Auditing storyboard for brand compliance." />
               <Log agent="SYSTEM" msg="Neural substrate synchronized. Ghost active." />
            </>
          ) : (
            logs.map((log, i) => (
               <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
               >
                 <Log agent={log.agent} msg={log.msg} color={log.type === 'calibration' ? 'text-neural-gold' : undefined} />
               </motion.div>
            ))
          )}
       </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tighter italic text-white flex items-center gap-3">
            <Activity className="text-accent animate-pulse" size={28} />
            SWARM INTELLIGENCE
          </h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2 ml-1">
            Real-Time Collective Cognitive Mapping
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Stat icon={<Cpu size={14} />} label="Active Nodes" value="48" color="text-accent" />
          <Stat icon={<Zap size={14} />} label="Synaptic Load" value="12.4ms" color="text-gold" />
          <Stat icon={<Layers size={14} />} label="Swarm Score" value="89.4" color="text-neural-blue" />
          <Stat icon={<Brain size={14} />} label="Sentience" value="98.2%" color="text-magenta" />
        </div>
      </div>

      <div className="flex-1 relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Neural Fabric Map */}
        <div className="lg:col-span-2 relative glass rounded-2xl border border-white/5 overflow-hidden bg-white/2">
           <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                   <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                   </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
           </div>

           <svg className="absolute inset-0 w-full h-full">
              {/* Connections */}
              {nodes.map((node, i) => (
                nodes.slice(i + 1).map((target) => (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="rgba(0, 229, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                ))
              ))}

              {/* Cognitive Nodes */}
              {nodes.map((node) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <circle 
                    cx={`${node.x}%`} 
                    cy={`${node.y}%`} 
                    r="4" 
                    fill={node.status === 'active' ? '#00e5ff' : node.status === 'synced' ? '#ffd700' : 'rgba(255,255,255,0.2)'}
                    className="shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                  />
                  <foreignObject x={`${node.x}%`} y={`${node.y + 2}%`} width="120" height="40" className="overflow-visible">
                    <div className="mt-2 -ml-15 text-center">
                       <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">{node.agentId}</p>
                       <p className="text-[10px] font-mono text-white/80 whitespace-nowrap">{node.label}</p>
                    </div>
                  </foreignObject>
                </motion.g>
              ))}
           </svg>

           {/* Pulse Ring */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div 
                className="w-[300px] h-[300px] rounded-full border border-accent/10"
                animate={{ scale: [1, 2], opacity: [0.2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
           </div>
        </div>

        {/* Telemetry Panel */}
        <div className="flex flex-col gap-6">
           <div className="glass p-6 rounded-2xl border border-white/5 bg-white/3">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
                 <Hexagon size={12} className="text-accent" />
                 Model Distribution
              </h3>
              <div className="space-y-6">
                 <Progress label="Gemini 2.0 Flash" value={78} color="bg-accent" />
                 <Progress label="Imagen 3.0" value={42} color="bg-gold" />
                 <Progress label="Google TTS v3" value={15} color="bg-magenta" />
              </div>
           </div>

            <div className="flex-1 glass p-6 rounded-2xl border border-white/5 bg-white/3 overflow-hidden flex flex-col">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-6 flex items-center gap-2">
                 <Layers size={12} className="text-gold" />
                 Knowledge Synthesis
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none pr-2">
                 <CalibrationLogs />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-white/5 ${color}`}>{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase tracking-tighter text-white/20">{label}</p>
      <p className={`text-sm font-mono font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

const Progress = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-mono text-white/60">{label}</span>
      <span className="text-[9px] font-mono text-white/40">{value}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

const Log = ({ agent, msg, color }: { agent: string, msg: string, color?: string }) => (
  <div className="flex gap-3 text-[10px] leading-relaxed">
    <span className={`font-black shrink-0 ${color || (agent === 'SN-00' ? 'text-accent' : agent === 'SYSTEM' ? 'text-white/20' : 'text-gold')}`}>[{agent}]</span>
    <span className="text-white/40 italic">"{msg}"</span>
  </div>
);
