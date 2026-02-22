import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Terminal, Briefcase, Zap, Send, FileText, Image as ImageIcon, Cpu, Activity, CircleDashed, DollarSign, Crosshair, BarChart2 } from 'lucide-react';

type AgentDraft = {
  agent: string;
  role: string;
  status: 'pending' | 'working' | 'complete';
  output?: string;
};

export function CampaignManager() {
  const [clientName, setClientName] = useState('');
  const [objective, setObjective] = useState('');
  const [directive, setDirective] = useState('');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'success' | 'error'>('idle');
  const [launchReport, setLaunchReport] = useState<string | null>(null);
  
  // PMax Specific Settings Extensions
  const [budget, setBudget] = useState<number>(100);
  const [biddingStrategy, setBiddingStrategy] = useState<'MAXIMIZE_CONVERSIONS' | 'MAXIMIZE_CONVERSION_VALUE'>('MAXIMIZE_CONVERSIONS');
  const [targetValue, setTargetValue] = useState<number>(0);
  
  const [agentTasks, setAgentTasks] = useState<AgentDraft[]>([
    { agent: 'CC-06', role: 'Copywriter', status: 'pending' },
    { agent: 'DA-03', role: 'Visuals', status: 'pending' },
    { agent: 'PM-07', role: 'SEO Schema', status: 'pending' },
    { agent: 'SN-00', role: 'Orchestrator', status: 'pending' }
  ]);

  useEffect(() => {
    const handleSwarmStatus = (e: CustomEvent<{ agent: string, status: string, output?: string }[]>) => {
      const statuses = e.detail;
      let allComplete = true;
      let hasWorking = false;
      
      const newTasks = agentTasks.map(task => {
         const backendStatus = statuses.find(s => s.agent === task.agent);
         if (backendStatus) {
            if (backendStatus.status !== 'complete') allComplete = false;
            if (backendStatus.status === 'working') hasWorking = true;
            return {
               ...task,
               status: backendStatus.status as 'pending' | 'working' | 'complete',
               output: backendStatus.output
            };
         }
         allComplete = false;
         return task;
      });
      
      setAgentTasks(newTasks);
      
      if (allComplete) {
         setIsOrchestrating(false);
      } else if (hasWorking) {
         setIsOrchestrating(true);
      }
    };

    window.addEventListener('swarm-status', handleSwarmStatus as EventListener);
    return () => window.removeEventListener('swarm-status', handleSwarmStatus as EventListener);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentTasks]);

  const handleDispatch = () => {
    if (!directive.trim() && (!clientName.trim() || !objective.trim())) return;
    
    setIsOrchestrating(true);
    
    // Set initial working state optimistically
    setAgentTasks(prev => prev.map(t => ({ ...t, status: 'working', output: undefined })));
    
    // Dispatch to the global connection orchestrator (GeniusConsole handles the physical WS send)
    const payload = {
       type: 'campaign_orchestration',
       client: clientName,
       objective: objective,
       directive: directive,
       pmaxConfig: {
          budget,
          biddingStrategy,
          targetValue: targetValue > 0 ? targetValue : undefined
       }
    };
    window.dispatchEvent(new CustomEvent('trigger-orchestration', { detail: payload }));
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border border-white/5 rounded-2xl bg-black/40 glass p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-3 shadow-neural-blue text-shadow-sm">
            <Target className="text-neural-blue" size={32} />
            Campaign Orchestrator
          </h2>
          <p className="text-white/40 font-mono text-xs mt-1">Multi-Agent PMax Parallel Dispatch Matrix</p>
        </div>
        
        <div className="flex items-center gap-4">
           {isOrchestrating && (
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neural-blue/30 bg-neural-blue/10 animate-pulse">
               <Activity size={14} className="text-neural-blue" />
               <span className="text-[10px] uppercase font-black tracking-widest text-neural-blue">Swarm Active</span>
             </div>
           )}
           <div className="text-right">
             <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Swarm Readiness</div>
             <div className="text-xs font-mono text-green-400">100% OPTIMAL</div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left: Input & Directives */}
        <div className="w-1/2 flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6 pr-2">
          
          {/* Campaign Parameters */}
          <div className="border border-white/5 rounded-2xl bg-black/40 glass p-6 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-6">
              <Briefcase size={14} className="text-neural-purple" />
              Campaign Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Target Client / Brand</label>
                <input 
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. CyberDyne Systems"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-blue/50 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">Primary Objective</label>
                <input 
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Launch the T-800 infiltration unit globally"
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-purple/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Performance Max Engine Settings */}
          <div className="border border-white/5 rounded-2xl bg-black/40 glass p-6 shadow-lg">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-6">
               <Target size={14} className="text-neural-green" />
               Performance Max Logic Engine
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                     <DollarSign size={12}/> Daily Budget (USD)
                  </label>
                  <input 
                    type="number"
                    value={budget || ''}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-green/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                     <BarChart2 size={12}/> Bidding Strategy
                  </label>
                  <select 
                    value={biddingStrategy}
                    onChange={(e) => setBiddingStrategy(e.target.value as 'MAXIMIZE_CONVERSIONS' | 'MAXIMIZE_CONVERSION_VALUE')}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm font-mono text-white focus:outline-none focus:border-neural-green/50 transition-colors"
                  >
                     <option value="MAXIMIZE_CONVERSIONS">Max Conversions (Volume)</option>
                     <option value="MAXIMIZE_CONVERSION_VALUE">Max Value (ROAS)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                     <Crosshair size={12}/> {biddingStrategy === 'MAXIMIZE_CONVERSIONS' ? 'Target CPA ($) (Optional)' : 'Target ROAS (%) (Optional)'}
                  </label>
                  <input 
                    type="number"
                    value={targetValue || ''}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 0)}
                    placeholder="Leave blank to rely solely on machine learning volume"
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-green/50 transition-colors"
                  />
                </div>
             </div>
          </div>

          {/* Global Directives Interface (Command Line) */}
          <div className="border border-white/5 rounded-2xl bg-black/40 glass p-6 shadow-lg flex flex-col mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-2">
              <Terminal size={14} className="text-neural-gold" />
              Global Directives Interface
            </h3>
            <p className="text-[10px] font-mono text-white/40 mb-4">Unstructured natural language commands for the Swarm.</p>
            
            <div className="relative mb-4 h-32">
              <textarea 
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="Command the Swarm... (e.g. 'CC-06, write 15 PMax Headlines. DA-03, generate 3 photorealistic landscape images.')"
                className="w-full h-full bg-black/50 border border-white/10 rounded-lg p-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-gold/50 transition-colors resize-none shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute bottom-4 right-4 text-[10px] uppercase font-black text-white/20 flex items-center gap-2 pointer-events-none">
                <Cpu size={12} />
                Gemini 2.0 Thinking
              </div>
            </div>

            <button 
              onClick={handleDispatch}
              disabled={isOrchestrating}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isOrchestrating 
                  ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neural-blue hover:text-white border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]'
              }`}
            >
              <Zap size={16} className={isOrchestrating ? 'opacity-50' : ''} />
              {isOrchestrating ? 'PMax Orchestration in Progress...' : 'Dispatch PMax Swarm'}
            </button>
          </div>

          {/* Launch Control Plane */}
          {agentTasks.every(t => t.status === 'complete') && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-neural-gold/30 rounded-2xl bg-neural-gold/5 glass p-6 shadow-[0_0_30px_rgba(255,215,0,0.1)] flex flex-col gap-4"
            >
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neural-gold flex items-center gap-2">
                  <Activity size={14} />
                  Launch Control Plane
                </h3>
                <p className="text-[10px] font-mono text-neural-gold/60 mt-1">Swarm verification complete. Ready for ecosystem deployment.</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={async () => {
                    setIsOrchestrating(true);
                    setLaunchStatus('launching');
                    try {
                      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/pmax/launch`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          campaignId: 'pmax-' + Date.now(),
                          config: { budget, biddingStrategy }
                        })
                      });
                      const data = await resp.json();
                      setLaunchReport(data.report);
                      setLaunchStatus('success');
                    } catch (error) {
                      console.error('Launch failed:', error);
                      setLaunchStatus('error');
                    } finally {
                      setIsOrchestrating(false);
                    }
                  }}
                  disabled={isOrchestrating || launchStatus === 'success'}
                  className="flex-1 py-4 rounded-xl bg-neural-gold text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  {launchStatus === 'launching' ? 'Deploying...' : launchStatus === 'success' ? 'Deployed' : 'Launch to Ecosystem'}
                </button>
              </div>

              {launchReport && (
                 <div className="mt-2 p-3 rounded-lg bg-black/40 border border-neural-gold/20 text-[9px] font-mono text-neural-gold/80 whitespace-pre-wrap leading-relaxed">
                    {launchReport}
                 </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Right: Real-time Output / Delegation */}
        <div className="w-1/2 border border-white/5 rounded-2xl bg-black/40 glass shadow-lg flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 shrink-0 flex items-center justify-between bg-black/20">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
               <Send size={14} className="text-neural-blue" />
               Live Delegation Matrix
             </h3>
          </div>

          <div className="flex-1 p-6 overflow-y-auto scrollbar-none flex flex-col gap-4">
            
            {!isOrchestrating && agentTasks.every(t => t.status === 'pending') && (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/30">
                <CircleDashed size={48} className="mb-4 opacity-50" />
                <p className="text-sm font-mono uppercase tracking-widest">Awaiting PMax Directives</p>
              </div>
            )}

            <AnimatePresence>
              {agentTasks.map((task, idx) => {
                if (task.status === 'pending' && !isOrchestrating) return null;

                const Icon = task.agent === 'CC-06' ? FileText : task.agent === 'DA-03' ? ImageIcon : task.agent === 'PM-07' ? Briefcase : Cpu;
                const color = task.agent === 'CC-06' ? 'text-green-500' : task.agent === 'DA-03' ? 'text-pink-500' : task.agent === 'PM-07' ? 'text-yellow-500' : 'text-neural-blue';

                return (
                  <motion.div 
                    key={task.agent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                      task.status === 'working' ? 'bg-neural-blue/10 border-neural-blue/30 shadow-[inset_0_0_15px_rgba(0,229,255,0.1)]' :
                      task.status === 'complete' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center ${color}`}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <span className="text-xs font-black tracking-widest uppercase text-white">{task.agent}</span>
                            <span className="text-[10px] uppercase font-mono text-white/40 block">{task.role}</span>
                          </div>
                        </div>
                        
                        {task.status === 'working' && (
                          <div className="px-2 py-1 rounded bg-neural-blue/20 border border-neural-blue/30 text-[9px] font-black uppercase tracking-widest text-neural-blue animate-pulse">
                            Processing
                          </div>
                        )}
                        {task.status === 'complete' && (
                          <div className="px-2 py-1 rounded bg-green-500/20 border border-green-500/30 text-[9px] font-black uppercase tracking-widest text-green-400">
                            Completed
                          </div>
                        )}
                     </div>

                      {task.output && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`p-3 rounded-lg border mt-2 overflow-hidden ${
                             task.output.includes('GENIUS SCORE') ? 'bg-neural-gold/10 border-neural-gold/30' : 'bg-black/40 border-white/5'
                          }`}
                        >
                          {task.agent === 'DA-03' && task.output.startsWith('data:image') ? (
                             <img src={task.output} alt="Generated Asset" className="w-full rounded-md border border-white/10 opacity-80 hover:opacity-100 transition-opacity" />
                          ) : (
                             <p className={`text-[10px] font-mono leading-relaxed ${task.output.includes('GENIUS SCORE') ? 'text-neural-gold' : 'text-white/70 italic'}`}>
                                {task.output.includes('GENIUS SCORE') ? task.output : `"${task.output}"`}
                             </p>
                          )}
                        </motion.div>
                      )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
