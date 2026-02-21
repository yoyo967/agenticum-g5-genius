import { useState } from 'react';
import { Settings, Key, Sliders, Server, Cpu, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

export function GlobalControlPlane() {
  const [showKeys, setShowKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6">
      
      {/* Header telemetry */}
      <div className="flex items-center justify-between shrink-0 bg-black/40 border border-white/5 p-6 rounded-2xl glass">
         <div>
           <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <Settings size={20} className="text-neural-blue" />
             Global Control Plane
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Core System Preferences, API Matrix, and Neural Hyperparameters.</p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-neural-blue text-black px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-neural-blue/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Syncing Matrix...' : 'Commit Changes'}
            </button>
         </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[600px]">
        {/* Left Column: Security & Connectivity */}
        <div className="w-1/3 flex flex-col gap-6">
           
           {/* API Matrix Card */}
           <div className="border border-white/5 bg-black/40 rounded-2xl p-6 glass shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                 <Key size={14} className="text-neural-blue" />
                 API Security Matrix
               </h3>
               <button onClick={() => setShowKeys(!showKeys)} className="text-white/30 hover:text-white transition-colors">
                 {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
               </button>
             </div>
             
             <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex items-center justify-between">
                    Google Cloud Project ID
                    <span className="text-green-500 font-mono">Verified</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue="alphate-enterprise-g5"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-neural-blue/50 transition-colors"
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex items-center justify-between">
                    Vertex AI Service Account JSON
                    <span className="text-red-500 font-mono">Missing</span>
                  </label>
                  <input 
                    type={showKeys ? 'text' : 'password'} 
                    defaultValue="************************************"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex items-center justify-between">
                    Gemini API Key (Fallback)
                    <span className="text-green-500 font-mono">Active</span>
                  </label>
                  <input 
                    type={showKeys ? 'text' : 'password'} 
                    defaultValue="AIzaSyB-XXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-neural-blue/50 transition-colors"
                  />
               </div>
             </div>
           </div>

           {/* System Storage & Compute */}
           <div className="border border-white/5 bg-black/40 rounded-2xl p-6 glass shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-6">
               <Server size={14} className="text-neural-purple" />
               Storage Infrastructure
             </h3>
             <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">GCS Vault Bucket Name</label>
                  <input 
                    type="text" 
                    defaultValue="g5-enterprise-vault-001"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-neural-purple/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5">Local Fallback Path</label>
                  <input 
                    type="text" 
                    defaultValue="./data/vault/"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-neural-purple/50 transition-colors"
                  />
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-black tracking-widest text-white">Local Override</span>
                     <span className="text-[9px] text-white/40">Force disk storage over cloud</span>
                   </div>
                   <div className="w-10 h-5 bg-neural-purple/30 rounded-full relative cursor-pointer border border-neural-purple/50">
                     <div className="absolute right-1 top-0.5 w-4 h-4 bg-neural-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                   </div>
                </div>
             </div>
           </div>
        </div>

        {/* Right Column: Neural Hyperparameters & Swarm Control */}
        <div className="w-2/3 flex flex-col gap-6">
           
           {/* Model Selection & Parameters */}
           <div className="border border-white/5 bg-black/40 rounded-2xl p-6 glass shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex-1">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-6">
               <Sliders size={14} className="text-pink-500" />
               Neural Hyperparameters
             </h3>

             <div className="grid grid-cols-2 gap-8">
                {/* Left side parameters */}
                <div className="space-y-6">
                   <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-3">Primary Reasoning Engine</label>
                     <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-pink-500/30 bg-pink-500/10 cursor-pointer">
                           <input type="radio" name="model" defaultChecked className="accent-pink-500" />
                           <div className="flex flex-col">
                             <span className="text-xs font-black text-white">Gemini 2.0 Pro</span>
                             <span className="text-[9px] text-white/50">Complex reasoning, max context window</span>
                           </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/50 cursor-pointer hover:border-white/20">
                           <input type="radio" name="model" className="accent-white" />
                           <div className="flex flex-col">
                             <span className="text-xs font-black text-white">Gemini 2.0 Thinking</span>
                             <span className="text-[9px] text-white/50">Deep reflection, multi-step logic</span>
                           </div>
                        </label>
                     </div>
                   </div>

                   <div>
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex justify-between">
                       Agent Temperature <span>0.7</span>
                     </label>
                     <input type="range" min="0" max="100" defaultValue="70" className="w-full accent-pink-500" />
                     <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/30 mt-1">
                       <span>Deterministic</span>
                       <span>Creative</span>
                     </div>
                   </div>
                </div>

                {/* Right side parameters */}
                <div className="space-y-6">
                   <div>
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex justify-between">
                       Top-K Sampling <span>40</span>
                     </label>
                     <input type="range" min="1" max="100" defaultValue="40" className="w-full accent-white" />
                   </div>
                   
                   <div>
                     <label className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1.5 flex justify-between">
                       Output Token Limit <span>8192</span>
                     </label>
                     <input type="range" min="256" max="8192" defaultValue="8192" className="w-full accent-white" />
                   </div>

                   <div>
                     <label className="block text-[9px] font-black uppercase tracking-widest text-white/50 mb-2">Safety Thresholds</label>
                     <select className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-pink-500/50">
                       <option>BLOCK_MEDIUM_AND_ABOVE</option>
                       <option>BLOCK_ONLY_HIGH</option>
                       <option>BLOCK_NONE (Enterprise Only)</option>
                     </select>
                   </div>
                </div>
             </div>
           </div>

           {/* Swarm Governance */}
           <div className="border border-white/5 bg-black/40 rounded-2xl p-6 glass shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-6">
               <Cpu size={14} className="text-neural-gold" />
               Swarm Governance
             </h3>
             <div className="grid grid-cols-2 gap-4">
               {[
                 { id: 'sn00', name: 'SN-00 Orchestrator', active: true },
                 { id: 'sp01', name: 'SP-01 Strategist', active: true },
                 { id: 'cc06', name: 'CC-06 Director', active: true },
                 { id: 'da03', name: 'DA-03 Architect', active: true },
                 { id: 'ra01', name: 'RA-01 Senate/Auditor', active: true },
                 { id: 'pm07', name: 'PM-07 Pillar Master', active: false },
               ].map(agent => (
                 <div key={agent.id} className={`flex items-center justify-between p-3 rounded-lg border ${agent.active ? 'bg-neural-gold/5 border-neural-gold/20' : 'bg-black/50 border-white/5 opacity-50'}`}>
                    <span className="text-xs font-black text-white">{agent.name}</span>
                    <div className={`w-8 h-4 rounded-full relative cursor-pointer border ${agent.active ? 'bg-neural-gold/30 border-neural-gold/50' : 'bg-white/10 border-white/10'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${agent.active ? 'right-0.5 bg-neural-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'left-0.5 bg-white/30'}`} />
                    </div>
                 </div>
               ))}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
