import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Plus, Bot, Calendar, Play, Save, Settings, Trash2, ArrowRight } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'action';
  title: string;
  config: string;
  agentId?: string;
}

export function WorkflowBuilder() {
  const [nodes] = useState<WorkflowNode[]>([
    { id: '1', type: 'trigger', title: 'Schedule Trigger', config: 'Every Monday @ 8:00 AM' },
    { id: '2', type: 'agent', title: 'Market Research', agentId: 'sn-00', config: 'Analyze competitor pricing.' },
    { id: '3', type: 'agent', title: 'LinkedIn Post Draft', agentId: 'cc-06', config: 'Write B2B LinkedIn post.' },
    { id: '4', type: 'action', title: 'Awaiting Boss Approval', config: 'Send to OS Portal' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);

  const simulateWorkflow = () => {
    setIsRunning(true);
    setActiveNodeIndex(0);
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx >= nodes.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setActiveNodeIndex(-1);
        }, 1000);
      } else {
        setActiveNodeIndex(currentIdx);
      }
    }, 2000);
  };

  const getAgentColor = (id?: string) => {
    switch (id) {
      case 'sn-00': return 'text-neural-blue border-neural-blue/30 bg-neural-blue/10';
      case 'sp-01': return 'text-pink-500 border-pink-500/30 bg-pink-500/10';
      case 'cc-06': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'da-03': return 'text-neural-purple border-neural-purple/30 bg-neural-purple/10';
      case 'ra-01': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-white/80 border-white/20 bg-white/5';
    }
  };

  return (
    <div className="h-full flex flex-col border border-white/5 rounded-2xl bg-black/20 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
        <div>
           <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <GitMerge size={24} className="text-pink-500" />
             Automated Workflows
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Design End-To-End Agency Operations</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={isRunning}
            onClick={simulateWorkflow}
            className="flex items-center gap-2 bg-pink-500/20 text-pink-500 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-pink-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
          >
            <Play size={14} className={isRunning ? "animate-pulse" : ""} />
            {isRunning ? 'Running Sequence...' : 'Run Simulation'}
          </button>
          <button className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black hover:bg-white/20 transition-all uppercase tracking-widest">
            <Save size={14} />
            Save Blueprint
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Canvas */}
        <div className="w-2/3 p-12 border-r border-white/5 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white/3 to-transparent overflow-y-auto relative flex flex-col items-center">
            
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-2">
               <AnimatePresence>
                 {nodes.map((node, index) => (
                   <motion.div 
                     key={node.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex flex-col items-center w-full"
                   >
                      <div className={`w-full p-5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-4 group cursor-pointer transition-all ${index === activeNodeIndex ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-[1.02] bg-pink-500/10' : node.type === 'agent' ? getAgentColor(node.agentId) : node.type === 'trigger' ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-neural-gold/30 bg-neural-gold/10 text-neural-gold'}`}>
                         <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10">
                           {node.type === 'trigger' && <Calendar size={18} />}
                           {node.type === 'agent' && <Bot size={18} />}
                           {node.type === 'action' && <Settings size={18} />}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between">
                               <h3 className="text-sm font-black uppercase tracking-widest text-white">{node.title}</h3>
                               {node.type === 'agent' && <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-black/50 border border-white/10 text-white/70">{node.agentId?.toUpperCase()}</span>}
                            </div>
                            <p className="text-xs mt-1 font-mono opacity-60 line-clamp-1">{node.config}</p>
                         </div>
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 hover:bg-white/10 rounded text-white/50 hover:text-red-500"><Trash2 size={14} /></button>
                         </div>
                      </div>

                      {/* Connection Line */}
                      {index < nodes.length - 1 && (
                         <div className="w-0.5 h-10 bg-white/10 relative my-1">
                            {isRunning && index < activeNodeIndex && (
                              <motion.div 
                                className="absolute top-0 bottom-0 left-0 right-0 bg-pink-500 border border-pink-500 shadow-[0_0_10px_#ec4899] rounded-full w-1.5 -ml-[2px]"
                                layoutId="flow-progress"
                              />
                            )}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 bg-obsidian rounded-full p-0.5"><ArrowRight size={10} className="rotate-90" /></div>
                         </div>
                      )}
                   </motion.div>
                 ))}
               </AnimatePresence>

               <button className="mt-6 w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/30 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all shadow-xl">
                 <Plus size={20} />
               </button>
            </div>
        </div>

        <div className="w-1/3 p-6 flex flex-col bg-white/1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
             <Settings size={14} /> Node Configuration
          </h3>
          
          <div className="flex-1 flex flex-col gap-6">
             <div className="p-5 border border-white/5 bg-black/40 rounded-xl">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 block">Agent Selection</label>
                <select className="w-full bg-black border border-white/10 rounded p-2 text-xs font-mono text-white/80 focus:outline-none focus:border-pink-500">
                  <option>CC-06 Director (Copywriter)</option>
                  <option>SP-01 Strategist (Research)</option>
                  <option>DA-03 Architect (Creative)</option>
                </select>
             </div>

             <div className="p-5 border border-white/5 bg-black/40 rounded-xl flex-1 flex flex-col">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 block">Task Instructions</label>
                <textarea 
                  className="w-full flex-1 bg-black border border-white/10 rounded p-4 text-xs font-mono text-white/80 focus:outline-none focus:border-pink-500 resize-none"
                  defaultValue="Write a B2B LinkedIn post based on SP-01's research."
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
