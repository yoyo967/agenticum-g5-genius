import { useState } from 'react';
import { motion } from 'framer-motion';
import { Workflow, Play, CheckCircle2, Cpu, Zap, Film, Palette, Shield, Bot, ChevronRight } from 'lucide-react';

type AgentId = 'SN-00' | 'SP-01' | 'CC-06' | 'DA-03' | 'RA-01' | 'PM-07';

interface WorkflowTemplate {
  name: string;
  id: string;
  agents: AgentId[];
  desc: string;
}

const WORKFLOWS: WorkflowTemplate[] = [
  {
    id: 'campaign-full',
    name: 'Campaign Full Cycle',
    desc: 'End-to-end campaign deployment through all tactical nodes.',
    agents: ['SN-00', 'SP-01', 'CC-06', 'DA-03', 'RA-01']
  },
  {
    id: 'copy-sprint',
    name: 'Copy Sprint',
    desc: 'Rapid iteration of high-conversion copy variants.',
    agents: ['SN-00', 'CC-06', 'RA-01']
  },
  {
    id: 'visual-campaign',
    name: 'Visual Campaign',
    desc: 'Generation of brand-aligned visual assets.',
    agents: ['SN-00', 'DA-03', 'RA-01']
  },
  {
    id: 'strategy-brief',
    name: 'Strategy Brief',
    desc: 'Deep analytical target audience synthesis.',
    agents: ['SN-00', 'SP-01', 'RA-01']
  }
];

export function NexusEngineV2() {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(WORKFLOWS[0].id);
  const [toast, setToast] = useState<string | null>(null);

  const activeWorkflow = WORKFLOWS.find(w => w.id === activeWorkflowId) || WORKFLOWS[0];

  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'SN-00': return <Cpu size={16} />;
      case 'SP-01': return <Zap size={16} />;
      case 'CC-06': return <Film size={16} />;
      case 'DA-03': return <Palette size={16} />;
      case 'RA-01': return <Shield size={16} />;
      case 'PM-07': return <Bot size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  const getAgentColor = (id: AgentId) => {
    switch (id) {
      case 'SN-00': return 'text-neural-blue';
      case 'SP-01': return 'text-neural-gold';
      case 'CC-06': return 'text-neural-purple';
      case 'DA-03': return 'text-white';
      case 'RA-01': return 'text-red-500';
      case 'PM-07': return 'text-green-500';
      default: return 'text-neural-blue';
    }
  };

  const runWorkflow = () => {
    setToast(`${activeWorkflow.name} Compilation Initiated. Swarm Engaged.`);
    
    // Dispatch global event for GeniusConsole to pick up
    window.dispatchEvent(new CustomEvent('trigger-orchestration', { 
      detail: { 
        input: `Execute workflow: ${activeWorkflow.name}. Context: ${activeWorkflow.desc}`,
        workflowId: activeWorkflow.id 
      } 
    }));

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full h-[800px] glass rounded-3xl overflow-hidden flex flex-col font-mono text-sm border border-white/5 relative bg-obsidian/40 backdrop-blur-3xl shadow-2xl">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Workflow size={16} className="text-neural-blue" />
          <h2 className="text-sm font-display font-black uppercase tracking-widest text-white">
            NEXUS ENGINE V2 <span className="text-neural-blue/50">/</span> <span className="opacity-50">Autonomous Workflow Editor</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Workflow List */}
        <div className="w-80 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-4 overflow-y-auto scrollbar-none">
          <h3 className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Templates</h3>
          {WORKFLOWS.map((wf) => (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflowId(wf.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                activeWorkflowId === wf.id 
                  ? 'border-neural-blue/30 bg-neural-blue/5 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
                  : 'border-white/5 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <h4 className="font-bold text-xs uppercase tracking-widest mb-1 text-white">{wf.name}</h4>
              <p className="text-[10px] text-white/40 mb-3">{wf.desc}</p>
              <div className="flex items-center gap-1 opacity-60">
                {wf.agents.map((ag, i) => (
                  <div key={i} className={`p-1 rounded bg-white/5 ${getAgentColor(ag)}`} title={ag}>
                    {getAgentIcon(ag)}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Right Panel: Blueprint Detail */}
        <div className="flex-1 p-8 bg-black/10 flex flex-col relative overflow-y-auto">
          {toast && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -20 }}
               className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center gap-2"
             >
               <CheckCircle2 size={12} /> {toast}
             </motion.div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white mb-2">{activeWorkflow.name}</h1>
            <p className="text-white/50">{activeWorkflow.desc}</p>
          </div>

          <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-8 relative flex items-center justify-center min-h-[400px]">
            {/* Visual Agent Chain */}
            <div className="flex items-center justify-center flex-wrap gap-4 max-w-4xl w-full">
              {activeWorkflow.agents.map((agent, index) => (
                <div key={`${agent}-${index}`} className="flex items-center gap-4">
                  
                  {/* Node */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-3 relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full border border-white/10 glass bg-black/40 flex items-center justify-center relative shadow-xl">
                      <div className="absolute inset-0 rounded-full border border-neural-blue/20 blur-sm animate-pulse" />
                      <div className={getAgentColor(agent)}>
                        {getAgentIcon(agent)}
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${getAgentColor(agent)}`}>{agent}</span>
                  </motion.div>

                  {/* Arrow connecting to next */}
                  {index < activeWorkflow.agents.length - 1 && (
                    <div className="flex items-center h-full opacity-40">
                      <ChevronRight size={24} className="text-white/20" />
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-neural-blue/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={runWorkflow}
              className="px-6 py-3 rounded-xl bg-neural-blue text-obsidian hover:bg-white text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95"
            >
              <Play size={16} /> Run Workflow Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
