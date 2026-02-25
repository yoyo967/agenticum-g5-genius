import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Maximize2, Minimize2, 
  Layers, Box, 
  Play, Plus, Save, 
  Activity, Zap, Sparkles, Wand2
} from 'lucide-react';
import { ElementLibrary } from '../creative/ElementLibrary';
import { ScriptWizard } from '../creative/ScriptWizard';

export const ProjectPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'wizard' | 'elements'>('board');
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className={`flex flex-col h-full bg-void/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden transition-all duration-700 ${isFullScreen ? 'fixed inset-4 z-50 shadow-[0_0_100px_rgba(0,0,0,0.8)]' : ''}`}>
      {/* Top Navigation Bar */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Layout className="text-accent" size={18} />
             </div>
             <div>
                <h2 className="text-lg font-display font-bold text-white tracking-tight">Project Playground</h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                   <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest font-black">Live Orchestration Active</span>
                </div>
             </div>
          </div>
          
          <div className="h-8 w-px bg-white/10 mx-2" />

          <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {([
              { key: 'board', label: 'Immersion Board', icon: <Layers size={14} /> },
              { key: 'wizard', label: 'Script Wizard', icon: <Wand2 size={14} /> },
              { key: 'elements', label: 'Elements', icon: <Box size={14} /> },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${
                  activeTab === tab.key 
                    ? 'bg-accent text-void shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest group">
              <Save size={14} className="group-hover:-translate-y-px transition-transform" />
              Save State
           </button>
           <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all text-[10px] uppercase font-black tracking-widest">
              <Play size={14} />
              Render Asset
           </button>
           <div className="w-px h-8 bg-white/10 mx-2" />
           <button 
             onClick={() => setIsFullScreen(!isFullScreen)}
             className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
           >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex">
         
         <AnimatePresence mode="wait">
           {activeTab === 'board' && (
             <motion.div 
               key="board"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-y-auto"
             >
                {/* Left Column: Mission Overview */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                   <div className="glass-card p-6 border-accent/20 bg-accent/5 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Zap size={100} />
                      </div>
                      <h3 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Project Briefing</h3>
                      <p className="text-xl font-display font-medium text-white mb-6">
                         Luxury Cyberpunk Watch Launch: "Chronos Nexus"
                      </p>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/30 uppercase tracking-widest">Target Mood</span>
                            <span className="text-gold uppercase font-black">Noir-Gold / Ultra-Tech</span>
                         </div>
                         <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/30 uppercase tracking-widest">Market</span>
                            <span className="text-white/60 uppercase font-black">Tier-1 Digital Natives</span>
                         </div>
                      </div>
                      <div className="mt-8">
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: '68%' }}
                               className="h-full bg-accent shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                            />
                         </div>
                         <span className="text-[9px] text-accent font-black uppercase tracking-widest mt-2 block">Synthesizing Assets: 68%</span>
                      </div>
                   </div>

                   <div className="glass-card p-6 border-white/5">
                      <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                         Active Entities
                         <button className="text-accent hover:underline text-[8px]">Open Library</button>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                         <EntityCard name="The Agent" type="character" image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80" />
                         <EntityCard name="Neon Hub" type="environment" image="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=200&q=80" />
                         <EntityCard name="Temporal Watch" type="object" image="https://images.unsplash.com/photo-1542491595-3015cbb968cf?auto=format&fit=crop&w=200&q=80" />
                         <AddEntityCard />
                      </div>
                   </div>
                </div>

                {/* Right Column: Storyboard Visualizer */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                   <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="text-white text-lg font-bold mb-1">Cinematic Sequence 01</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Neural Storyboard Generation</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><Maximize2 size={14} /></button>
                         </div>
                      </div>

                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/60 shadow-inner group/stage">
                         <img 
                            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80" 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-50 blur-sm group-hover/stage:opacity-80 group-hover/stage:blur-none transition-all duration-1000"
                         />
                         
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div 
                               initial={{ opacity: 1 }}
                               animate={{ opacity: [1, 0.4, 1] }}
                               transition={{ duration: 4, repeat: Infinity }}
                               className="w-24 h-24 rounded-full border border-accent/30 flex items-center justify-center bg-accent/5 backdrop-blur-md"
                            >
                               <Play size={32} className="text-accent translate-x-1" />
                            </motion.div>
                            <span className="mt-4 text-[10px] font-mono text-accent uppercase tracking-[0.5em] animate-pulse">Syncing Neural Audio...</span>
                         </div>
                         
                         {/* Scanlines Overlay */}
                         <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] opacity-20" />
                      </div>

                      <div className="mt-8 grid grid-cols-4 gap-4">
                         {[1, 2, 3, 4].map((i) => (
                           <div key={i} className={`aspect-video rounded-xl border transition-all cursor-pointer ${i === 1 ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,229,255,0.2)] scale-105' : 'border-white/5 bg-white/3 opacity-40 hover:opacity-100 hover:border-white/20'}`}>
                              <div className="h-full w-full flex items-center justify-center p-4">
                                 <span className="text-[10px] font-mono text-white/20">SHOT 0{i}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 rounded-2xl bg-linear-to-r from-accent/10 to-transparent border border-accent/20 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Sparkles className="text-accent animate-pulse" size={18} />
                         </div>
                         <div>
                            <h4 className="text-white text-sm font-bold">A.I. Director Suggestions</h4>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Veo Model: Suggesting shot transition uplift</p>
                         </div>
                      </div>
                      <button className="px-6 py-2 rounded-xl bg-accent text-void font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 transition-transform">
                         Apply Suggestion
                      </button>
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'wizard' && (
             <motion.div 
               key="wizard"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex-1 p-8"
             >
                <ScriptWizard />
             </motion.div>
           )}

           {activeTab === 'elements' && (
             <motion.div 
               key="elements"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex-1 p-8"
             >
                <ElementLibrary elements={[]} onAddElement={() => {}} onSelectElement={() => {}} />
             </motion.div>
           )}
         </AnimatePresence>

         {/* Synergy Terminal (Floating Sidebar for real-time logs) */}
         <div className="w-64 border-l border-white/5 bg-black/40 p-4 transition-all overflow-hidden hidden xl:block">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
               <Activity size={12} />
               Neural Synergy
            </h3>
            <div className="space-y-4 font-mono text-[9px] text-white/20 leading-relaxed uppercase">
               <p className="text-accent/60">[08:42:01] Parsing storyboard for scene 01...</p>
               <p>[08:42:03] Tagging entity: Chronos Watch (Object)</p>
               <p>[08:42:05] Orchestrating lighting: Tech-Noir Noir-Gold</p>
               <p className="text-green-400/40">[08:42:08] Element synced: The Agent (Character)</p>
               <p className="animate-pulse">_</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const EntityCard: React.FC<{ name: string; type: string; image: string }> = ({ name, type, image }) => (
  <div className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-accent/40 group cursor-pointer transition-all">
    <div className="aspect-square rounded-lg overflow-hidden mb-3 relative bg-black/40">
       <img src={image} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
       <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md glass text-[6px] font-black uppercase tracking-tighter text-accent">
          {type}
       </div>
    </div>
    <h4 className="text-[10px] font-bold text-white truncate group-hover:text-accent transition-colors">{name}</h4>
  </div>
);

const AddEntityCard: React.FC = () => (
  <div className="p-3 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all">
    <Plus size={20} className="text-white/20 group-hover:text-accent group-hover:rotate-90 transition-all" />
    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-2 group-hover:text-accent">New Element</span>
  </div>
);
