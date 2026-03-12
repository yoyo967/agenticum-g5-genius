import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Share2, Palette } from 'lucide-react';
import { ExportMenu } from './ui';
import { downloadSVG, downloadPNG } from '../utils/export';
import { useSwarmRun } from '../hooks/useSwarmRun';
import { useAgentOutputs } from '../hooks/useAgentOutputs';

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  cx: number;
  cy: number;
}

interface DataFlow {
  id: string;
  from: string;
  to: string;
  type: string;
  timestamp: string;
}

const AGENTS: Agent[] = [
  { id: 'sn00', name: 'NEXUS PRIME', role: 'Orchestrator', color: '#00E5FF', cx: 50, cy: 20 },
  { id: 'so00', name: 'SOVEREIGN CORE', role: 'Pilot', color: '#00E5FF', cx: 75, cy: 30 },
  { id: 'sp01', name: 'STRATEGIC CORTEX', role: 'Strategist', color: 'var(--color-gold)', cx: 85, cy: 50 },
  { id: 'cc06', name: 'COGNITIVE CORE', role: 'Copywriter', color: 'var(--color-emerald)', cx: 75, cy: 70 },
  { id: 'da03', name: 'DESIGN ARCHITECT', role: 'Visual Artist', color: '#FFD700', cx: 50, cy: 80 },
  { id: 'ba07', name: 'BROWSER ARCHITECT', role: 'Researcher', color: '#00FF88', cx: 25, cy: 70 },
  { id: 've01', name: 'VOICE ENGAGEMENT', role: 'Voice Interface (Live API)', color: '#FF007A', cx: 15, cy: 50 },
  { id: 'ra01', name: 'SECURITY CORTEX', role: 'Auditor', color: '#00FF88', cx: 25, cy: 30 },
  { id: 'pm07', name: 'MISSION MANAGER', role: 'Pilot Coordination', color: '#FFD700', cx: 15, cy: 15 },
];

export function SynergyMap({ runId }: { runId: string | null }) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { run } = useSwarmRun(runId);
  const { outputs } = useAgentOutputs({ runId: runId || undefined });

  // Compute agent states from run tasks
  const agentStates = useMemo(() => {
    const states: Record<string, string> = {};
    if (run?.tasks) {
      run.tasks.forEach((task: any) => {
        states[task.agentId.toLowerCase()] = task.state.toLowerCase();
      });
    }
    return states;
  }, [run]);

  // Compute data flows from outputs
  const flows = useMemo<DataFlow[]>(() => {
    return (outputs || []).map(output => ({
      id: output.output_id,
      from: output.agent_id.toUpperCase(),
      to: 'SN-00', // Assuming all data flows back to orchestrator initially
      type: output.type,
      timestamp: output.created_at?.toDate ? output.created_at.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()
    })).slice(0, 20);
  }, [outputs]);

  // Filter live images — DA03 writes type 'image_prompt', payload = { image_url, prompt, vault_id }
  const liveImages = useMemo(() => {
    return (outputs || [])
      .filter(o => o.type === 'image_prompt' || o.type === 'IMAGE_ASSET' || o.type === 'visual')
      .map(o => ({
        url: o.payload?.image_url || o.payload?.url || (typeof o.payload === 'string' ? o.payload : null),
        timestamp: o.created_at?.toDate ? o.created_at.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()
      }))
      .filter(o => !!o.url)
      .slice(0, 6);
  }, [outputs]);

  const totalFlows = outputs?.length || 0;

  const getAgent = (id: string) => AGENTS.find(a => a.id === id);
  const getStateClass = (id: string) => {
    const state = agentStates[id];
    if (state === 'running' || state === 'processing') return 'animate-glow-pulse';
    if (state === 'failed' || state === 'error') return 'animate-ping text-red-500';
    return '';
  };

  return (
    <div id="synergy-export-container" className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 size={20} className="text-accent" />
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Synergy Map</h2>
          <span className="label text-white/20 mt-1">Inter-Agent Data Flow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-processing"><Activity size={10} /> {totalFlows} flows</span>
          <ExportMenu options={[
            { label: 'SVG Map', format: 'SVG', onClick: () => downloadSVG(svgRef.current, 'G5_Synergy_Map') },
            { label: 'PNG Screenshot', format: 'PNG', onClick: () => downloadPNG('synergy-export-container', 'G5_Synergy_Map') },
          ]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Network Map */}
        <div className="lg:col-span-2 glass-card p-6">
          <svg ref={svgRef} viewBox="0 0 100 100" className="w-full" style={{ minHeight: '400px' }}>
            {/* Connection Lines & Glowing Pulses */}
            {AGENTS.map((from, i) =>
              AGENTS.slice(i + 1).map(to => (
                <g key={`${from.id}-${to.id}`}>
                  <line
                    x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" strokeDasharray="1,1" />
                  
                  {/* JARVIS flowing light paths (when both agents are active) */}
                  {(agentStates[from.id] === 'working' || agentStates[to.id] === 'working') && (
                     <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                        stroke="url(#dataGradient)"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                     />
                  )}
                </g>
              ))
            )}

            <defs>
              <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Animated Flow Particles */}
            <AnimatePresence>
              {flows.slice(0, 5).map(flow => {
                const from = getAgent(flow.from);
                const to = getAgent(flow.to);
                if (!from || !to) return null;
                return (
                  <motion.circle key={flow.id}
                    cx={from.cx} cy={from.cy} r={0.8}
                    fill={from.color}
                    initial={{ cx: from.cx, cy: from.cy, opacity: 1 }}
                    animate={{ cx: to.cx, cy: to.cy, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                );
              })}
            </AnimatePresence>

            {/* Agent Nodes */}
            {AGENTS.map(agent => (
              <g key={agent.id}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                className="cursor-pointer">
                {/* Glow */}
                <circle cx={agent.cx} cy={agent.cy} r={6}
                  fill={agent.color} opacity={0.15}
                  className={getStateClass(agent.id)} />
                {/* Core */}
                <circle cx={agent.cx} cy={agent.cy} r={3.5}
                  fill="rgba(10,1,24,0.8)" stroke={agent.color}
                  strokeWidth={hoveredAgent === agent.id ? 0.6 : 0.3} />
                {/* Inner */}
                <circle cx={agent.cx} cy={agent.cy} r={1.5}
                  fill={agent.color} opacity={agentStates[agent.id] === 'working' ? 1 : 0.6} />
                {/* Label */}
                <text x={agent.cx} y={agent.cy + 7} textAnchor="middle"
                  fill={agent.color} fontSize="2.5" fontFamily="Oswald" fontWeight="600" letterSpacing="0.1">
                  {agent.id}
                </text>
                <text x={agent.cx} y={agent.cy + 10} textAnchor="middle"
                  fill="rgba(255,255,255,0.3)" fontSize="1.5" fontFamily="Roboto Mono">
                  {agent.role}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Flow Log */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
            <Activity size={16} className="text-accent" /> Data Flow Log
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
            <AnimatePresence>
              {flows.map(flow => {
                const from = getAgent(flow.from);
                const to = getAgent(flow.to);
                return (
                  <motion.div key={flow.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="p-3 rounded-lg bg-white/2 border border-white/5 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: from?.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-white/60 truncate">
                        <span style={{ color: from?.color }}>{flow.from}</span>
                        {' → '}
                        <span style={{ color: to?.color }}>{flow.to}</span>
                      </p>
                      <p className="font-mono text-[8px] text-white/20 uppercase">{flow.type} · {flow.timestamp}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {flows.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="label text-center">Waiting for agent activity...<br/>Connect via GenIUS Console to see live data.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-5 gap-3">
        {AGENTS.map(agent => (
          <div key={agent.id} className="glass-card p-4 text-center">
            <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{ background: agent.color + '20', border: `1px solid ${agent.color}40` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: agent.color }} />
            </div>
            <p className="font-mono text-xs font-bold" style={{ color: agent.color }}>{agent.id}</p>
            <p className="font-mono text-[9px] text-white/30 mt-1">{agent.name}</p>
            <span className={`badge text-[7px] mt-2 ${agentStates[agent.id] === 'working' ? 'badge-processing' : 'badge-online'}`}>
              {agentStates[agent.id] || 'standby'}
            </span>
          </div>
        ))}
      </div>

      {/* Live Asset Gallery — DA-03 Interleaved Output */}
      <AnimatePresence>
        {liveImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette size={16} className="text-[#FFD700]" />
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">Live Visual Output</h3>
              <span className="badge badge-processing text-[8px] ml-auto">DA03 · Imagen 3</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {liveImages.map((img, i) => (
                <motion.div
                  key={img.url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-xl overflow-hidden border border-[#FFD700]/20 group"
                >
                  <img
                    src={img.url}
                    alt={`DA-03 asset ${i + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-mono text-[8px] text-[#FFD700]/80 uppercase">{img.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
