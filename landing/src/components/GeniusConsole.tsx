import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Shield, Cpu, Zap, Palette, Film, 
  Terminal, Activity, CheckCircle2, 
  Sparkles, Scale, DollarSign, Leaf
} from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  color: string;
  state: 'idle' | 'thinking' | 'working' | 'done';
  lastStatus: string;
  progress: number;
}

interface SwarmState {
  id: string;
  name: string;
  color: string;
  state: string;
  lastStatus: string;
  progress: number;
  subAgents: Record<string, AgentStatus>;
}

export function GeniusConsole() {
  const [swarm, setSwarm] = useState<SwarmState | null>(null);
  const [logs, setLogs] = useState<{ type: string; message: string; timestamp: string }[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((type: string, message: string) => {
    setLogs(prev => [...prev.slice(-19), { type, message, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  const connect = useCallback(() => {
    ws.current = new WebSocket('ws://localhost:8080');
    
    ws.current.onopen = () => {
      setConnected(true);
      addLog('system', 'Connected to GenIUS Neural Fabric');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'status') {
          setSwarm(data.agent);
        } else if (data.type === 'output') {
          setOutput(data.data);
          addLog('success', 'Full campaign payload received');
        } else if (data.type === 'error') {
          addLog('error', data.message);
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    ws.current.onerror = () => {
      addLog('error', 'Neural relay error detected');
    };

    ws.current.onclose = () => {
      setConnected(false);
      addLog('system', 'Neural bond severed. Retrying...');
      setTimeout(connect, 3000);
    };
  }, [addLog]);

  useEffect(() => {
    connect();
    return () => ws.current?.close();
  }, [connect]);

  const handleStart = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      setOutput(null);
      ws.current.send(JSON.stringify({ 
        type: 'start', 
        input: 'Create a viral launch campaign for AGENTICUM G5.' 
      }));
      addLog('action', 'Initializing Neural Orchestration...');
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'sn-00': return <Cpu size={16} />;
      case 'sp-01': return <Zap size={16} />;
      case 'cc-06': return <Film size={16} />;
      case 'da-03': return <Palette size={16} />;
      case 'ra-01': return <Shield size={16} />;
      case 'pm-07': return <Bot size={16} />;
      default: return <Bot size={16} />;
    }
  };

  return (
    <div className="w-full h-[800px] glass rounded-3xl overflow-hidden flex flex-col font-mono text-sm border border-white/5 relative bg-obsidian/40 backdrop-blur-3xl shadow-2xl">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${connected ? 'bg-neural-blue animate-pulse' : 'bg-red-500'}`} />
             <span className="text-[10px] uppercase tracking-widest font-black text-white/40">
               {connected ? 'Fabric Online' : 'Fabric Offline'}
             </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-white/60">
            <Terminal size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">GenIUS_Console_v2.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
          </div>
          <button 
            onClick={handleStart}
            disabled={!connected || (swarm?.state !== 'idle' && swarm?.state !== 'done')}
            className="bg-neural-blue/10 hover:bg-neural-blue text-neural-blue hover:text-obsidian px-4 py-1.5 rounded border border-neural-blue/20 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
          >
            Spawn Swarm
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar: Swarm Monitor */}
        <div className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-neural-blue" />
             <span className="text-[10px] uppercase font-black tracking-widest">Active Swarm</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {swarm && [swarm, ...Object.values(swarm.subAgents || {})].map((agent) => (
              <motion.div 
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border transition-all ${agent.state !== 'idle' ? 'bg-white/[0.03]' : 'opacity-40'}`}
                style={{ borderColor: agent.state !== 'idle' ? `${agent.color}33` : 'transparent' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-white/5" style={{ color: agent.color }}>
                      {getAgentIcon(agent.id)}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-tight">{agent.id}</span>
                  </div>
                  {agent.state === 'done' ? (
                    <CheckCircle2 size={12} className="text-green-500" />
                  ) : agent.state !== 'idle' ? (
                    <div className="flex gap-0.5">
                      <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-neural-blue" />
                      <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-neural-blue" />
                    </div>
                  ) : null}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest font-black opacity-30">
                    <span>{agent.state}</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: agent.color }}
                      animate={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  <p className="text-[9px] opacity-60 truncate italic mt-1 font-medium">{agent.lastStatus}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {!swarm && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
               <Bot size={40} className="mb-4" />
               <p className="text-[10px] uppercase font-black tracking-tighter">Waiting for Neural Engagement</p>
            </div>
          )}
        </div>

        {/* Center: Live Terminal & Results */}
        <div className="flex-1 flex flex-col relative">
          {/* Algorithmic Senate Bar */}
          <AnimatePresence>
            {swarm?.subAgents?.auditor?.state === 'working' || swarm?.subAgents?.auditor?.state === 'done' ? (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/5 border-b border-red-500/20 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scale size={14} className="text-red-500" />
                    <span className="text-[10px] uppercase font-black text-red-500 tracking-widest">Algorithmic Senate Tribunal</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest">Adversarial Review Active</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { name: 'Ethics', icon: Shield, color: '#EA4335' },
                     { name: 'Economy', icon: DollarSign, color: '#FBBC04' },
                     { name: 'Ecology', icon: Leaf, color: '#34A853' }
                   ].map((senator) => (
                     <div key={senator.name} className="glass p-2 flex items-center gap-3 border-white/5">
                        <senator.icon size={12} style={{ color: senator.color }} />
                        <span className="text-[9px] uppercase font-bold opacity-60">{senator.name}</span>
                        <div className="ml-auto flex items-center gap-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${swarm.subAgents.auditor.state === 'done' ? 'bg-green-500' : 'bg-white/10 animate-pulse'}`} />
                           <span className="text-[8px] font-black opacity-40 italic">{swarm.subAgents.auditor.state === 'done' ? 'APPROVE' : 'VOTING'}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex-1 p-8 overflow-y-auto font-mono scrollbar-none" ref={scrollRef}>
             <AnimatePresence mode="wait">
               {output ? (
                 <motion.div 
                   key="output"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="prose prose-invert max-w-none prose-sm"
                 >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                      <Sparkles size={18} className="text-neural-blue" />
                      <h2 className="text-xl font-display font-black uppercase italic tracking-tighter m-0">Campaign Forge Complete</h2>
                    </div>
                    <pre className="p-6 bg-white/[0.02] rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed text-white/80">
                      {output}
                    </pre>
                 </motion.div>
               ) : (
                 <motion.div key="logs" className="flex flex-col gap-2">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 items-start"
                      >
                        <span className="text-[9px] opacity-20 font-black tabular-nums">[{log.timestamp}]</span>
                        <span className={`text-[10px] font-black uppercase tracking-tighter w-16 ${
                          log.type === 'system' ? 'text-white/30' : 
                          log.type === 'error' ? 'text-red-500' : 
                          log.type === 'success' ? 'text-green-500' : 'text-neural-blue'
                        }`}>{log.type}</span>
                        <p className="text-[11px] opacity-80 flex-1 leading-normal">{log.message}</p>
                      </motion.div>
                    ))}
                    {swarm?.state !== 'idle' && (
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex gap-4 items-center">
                         <span className="text-[9px] opacity-20 font-black tabular-nums">[{new Date().toLocaleTimeString()}]</span>
                         <span className="text-neural-blue font-black uppercase text-[10px] tracking-tighter">WAIT</span>
                         <div className="flex gap-1">
                           {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 bg-neural-blue/40 rounded-full" />)}
                         </div>
                      </motion.div>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Sensory Feedback Visualizer (Corner) */}
          <div className="absolute bottom-6 right-6 flex items-end gap-1">
             {[...Array(6)].map((_, i) => (
               <motion.div 
                key={i}
                animate={{ height: swarm?.state !== 'idle' ? [8, 40 + (i * 10), 8] : 8 }}
                transition={{ repeat: Infinity, duration: 0.4 + i*0.1 }}
                className="w-1 bg-neural-blue/20 rounded-full"
               />
             ))}
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex justify-between items-center opacity-40">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Agenticum Genius G5 // Nexus Shell</span>
        <div className="flex gap-4">
           {['Neural Threading', 'Senate Substrate', 'Grounding Engine'].map(t => (
             <span key={t} className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/10 rounded-sm italic">{t}</span>
           ))}
        </div>
      </div>
    </div>
  );
}
