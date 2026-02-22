import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Share2, RefreshCw } from 'lucide-react';
import type { SwarmState } from '../types';
import { ExportMenu } from './ui';
import { downloadSVG, downloadPNG } from '../utils/export';

interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  cx: number;
  cy: number;
}

interface DataFlow {
  id: number;
  from: string;
  to: string;
  type: string;
  timestamp: string;
}

const AGENTS: Agent[] = [
  { id: 'SN-00', name: 'NEXUS PRIME', role: 'Orchestrator', color: '#00E5FF', cx: 50, cy: 18 },
  { id: 'SP-01', name: 'STRATEGIC CORTEX', role: 'Strategist', color: '#7B2FBE', cx: 85, cy: 45 },
  { id: 'CC-06', name: 'COGNITIVE CORE', role: 'Copywriter', color: '#FF007A', cx: 72, cy: 82 },
  { id: 'DA-03', name: 'DESIGN ARCHITECT', role: 'Visual Artist', color: '#FFD700', cx: 28, cy: 82 },
  { id: 'RA-01', name: 'SECURITY CORTEX', role: 'Auditor', color: '#00FF88', cx: 15, cy: 45 },
];

let flowIdCounter = 0;

export function SynergyMap() {
  const [agentStates, setAgentStates] = useState<Record<string, string>>({});
  const [flows, setFlows] = useState<DataFlow[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [totalFlows, setTotalFlows] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Listen for live swarm events
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SwarmState>).detail;
      if (detail?.subAgents) {
        const states: Record<string, string> = {};
        Object.entries(detail.subAgents).forEach(([id, agent]) => {
          states[id] = agent.state;
        });
        setAgentStates(states);
      }
    };
    window.addEventListener('swarm-state', handler);
    return () => window.removeEventListener('swarm-state', handler);
  }, []);

  // Listen for payload events from GeniusConsole
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ from: string; to: string; type: string }>).detail;
      if (detail) {
        const newFlow: DataFlow = {
          id: ++flowIdCounter,
          from: detail.from,
          to: detail.to,
          type: detail.type || 'data',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setFlows(prev => [newFlow, ...prev].slice(0, 20));
        setTotalFlows(prev => prev + 1);
      }
    };
    window.addEventListener('agent-payload', handler);
    return () => window.removeEventListener('agent-payload', handler);
  }, []);

  // No fake data — flows only come from real swarm-state and agent-payload events above

  const getAgent = (id: string) => AGENTS.find(a => a.id === id);
  const getStateClass = (id: string) => {
    const state = agentStates[id];
    if (state === 'working' || state === 'processing') return 'animate-glow-pulse';
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
          <button onClick={() => { setFlows([]); setTotalFlows(0); }} className="btn-outline text-xs py-2 px-4 flex items-center gap-2">
            <RefreshCw size={12} /> Reset
          </button>
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
            {/* Connection Lines */}
            {AGENTS.map((from, i) =>
              AGENTS.slice(i + 1).map(to => (
                <line key={`${from.id}-${to.id}`}
                  x1={from.cx} y1={from.cy} x2={to.cx} y2={to.cy}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" strokeDasharray="1,1" />
              ))
            )}

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
                <p className="label text-center">Waiting for agent activity...<br/>Connect via Genius Console to see live data.</p>
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
    </div>
  );
}
