import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, 
  ChevronLeft, Command, Database, LayoutGrid, Users, PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GeniusConsole } from '../components/GeniusConsole';

export function OSPortal() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('console');

  return (
    <div className="min-h-screen bg-obsidian text-white font-body selection:bg-neural-blue/30 selection:text-neural-blue flex overflow-hidden">
      
      {/* OS Sidebar Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col pt-6 pb-6 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20">
        <div className="px-6 pb-8 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded bg-neural-blue flex items-center justify-center font-bold text-obsidian text-xs shrink-0"
          >
            G5
          </motion.div>
          <span className="font-display font-black tracking-tight text-xl uppercase italic hidden md:block">OS Portal</span>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-3">
          <SidebarButton 
            icon={<Terminal size={18} />} 
            label="Genius Console" 
            active={activeModule === 'console'} 
            onClick={() => setActiveModule('console')}
          />
          <SidebarButton 
            icon={<LayoutGrid size={18} />} 
            label="Pillar Blog Engine" 
            active={activeModule === 'blog'} 
            onClick={() => setActiveModule('blog')}
          />
          <SidebarButton 
            icon={<Database size={18} />} 
            label="Asset Vault" 
            active={activeModule === 'vault'} 
            onClick={() => setActiveModule('vault')}
          />
          <SidebarButton 
            icon={<Users size={18} />} 
            label="Swarm Analytics" 
            active={activeModule === 'analytics'} 
            onClick={() => setActiveModule('analytics')}
          />
          <SidebarButton 
            icon={<Shield size={18} />} 
            label="Security Senate" 
            active={activeModule === 'senate'} 
            onClick={() => setActiveModule('senate')}
          />
        </div>

        <div className="px-3 pt-6 border-t border-white/5">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Exit to Landing</span>
          </button>
        </div>
      </aside>

      {/* Main OS Content Area */}
      <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neural-blue/10 via-obsidian to-obsidian h-screen overflow-hidden flex flex-col">
        
        {/* Top OS Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Command size={16} className="text-neural-blue opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              {activeModule === 'console' && 'Interactive Matrix'}
              {activeModule === 'blog' && 'Autonomous CMS'}
              {activeModule === 'vault' && 'Secure Storage'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neural-blue animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
              <span className="text-[9px] font-mono tracking-widest text-neural-blue uppercase">G1.5P Active</span>
            </div>
            <div className="flex items-center gap-2 border border-neural-gold/20 bg-neural-gold/5 px-3 py-1.5 rounded text-neural-gold">
              <Shield size={12} />
              <span className="text-[9px] font-black tracking-widest uppercase">Senate Watch</span>
            </div>
          </div>
        </header>

        {/* Dynamic Module Rendering */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeModule === 'console' && <div className="h-full relative z-10 spatial-depth glass p-1 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-neural-blue/10 bg-black/40"><GeniusConsole /></div>}
              {activeModule === 'blog' && <BlogModuleCMS />}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-neural-blue/10 text-neural-blue shadow-[inset_0_0_20px_rgba(0,229,255,0.1)] border border-neural-blue/20' 
          : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <div className={active ? 'text-neural-blue' : ''}>{icon}</div>
      <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${active ? 'text-neural-blue' : ''}`}>
        {label}
      </span>
      {active && (
        <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-4 rounded-full bg-neural-blue hidden md:block shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
      )}
    </button>
  );
}

function BlogModuleCMS() {
  const [activeTab, setActiveTab] = useState('pillars');
  const [data, setData] = useState<{pillars: any[], clusters: any[]}>({ pillars: [], clusters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/blog/feed')
      .then(res => res.json())
      .then(json => {
        if (json.pillars || json.clusters) {
          setData({ pillars: json.pillars || [], clusters: json.clusters || [] });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch blog feed:', err);
        setLoading(false);
      });
  }, []);
  
  const displayData = activeTab === 'pillars' ? (data.pillars || []) : (data.clusters || []);

  return (
    <div className="h-full flex flex-col border border-white/5 rounded-2xl bg-black/20 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div>
          <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-neural-gold flex items-center gap-2">
            <LayoutGrid size={24} />
            Autonomous Nexus Engine
          </h2>
          <p className="text-white/40 font-light text-xs mt-1">PM-07 / CC-06 Orchestrated Content Pipeline</p>
        </div>
        <button className="flex items-center gap-2 bg-neural-gold text-obsidian px-4 py-2 rounded-lg text-[10px] font-black hover:bg-white transition-all active:scale-95 uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          <PlusCircle size={14} />
          Queue New Topic
        </button>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-white/5 px-6 gap-6">
        <button 
          onClick={() => setActiveTab('pillars')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'pillars' ? 'text-neural-gold' : 'text-white/30 hover:text-white'}`}
        >
          Core Pillars
          {activeTab === 'pillars' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neural-gold shadow-[0_0_10px_rgba(255,215,0,0.8)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('clusters')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'clusters' ? 'text-neural-gold' : 'text-white/30 hover:text-white'}`}
        >
          Cluster Articles
          {activeTab === 'clusters' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neural-gold shadow-[0_0_10px_rgba(255,215,0,0.8)]" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
             <Database size={48} className="text-neural-gold/20 mb-4 animate-pulse" />
             <h3 className="text-lg font-display font-black uppercase italic text-white/50 mb-2">Syncing with Firestore</h3>
             <p className="text-white/30 text-xs max-w-sm">Establishing uplink to the Pillar/Cluster engine.</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Database size={48} className="text-neural-gold/20 mb-4 animate-pulse" />
            <h3 className="text-lg font-display font-black uppercase italic text-white/50 mb-2">Awaiting Agent Population</h3>
            <p className="text-white/30 text-xs max-w-sm">
              PM-07 will autonomously queue topics here, and CC-06 will write and publish the Markdown content.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayData.map((item, i) => (
               <div key={i} className="glass p-4 rounded-lg border-l-2 border-neural-gold/50 flex flex-col gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                 <div className="flex items-center justify-between">
                   <h4 className="text-white font-black font-display uppercase tracking-tight">{item.title}</h4>
                   <span className="text-[9px] font-black uppercase tracking-widest text-neural-blue bg-neural-blue/10 px-2 py-0.5 rounded">Published</span>
                 </div>
                 <div className="flex gap-4 text-[10px] uppercase font-black tracking-widest text-white/30">
                   <span>Authored By: {item.authorAgent}</span>
                   <span>Slug: /{item.slug}</span>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
