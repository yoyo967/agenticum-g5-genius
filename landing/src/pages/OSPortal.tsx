import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, 
  ChevronLeft, Command, Database, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GeniusConsole } from '../components/GeniusConsole';
import { AssetVault } from '../components/AssetVault';
import { CreativeStudio } from '../components/CreativeStudio';
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { ExecutiveDashboard } from '../components/ExecutiveDashboard';
import { SwarmAnalytics } from '../components/SwarmAnalytics';
import { SecuritySenate } from '../components/SecuritySenate';
import { GlobalControlPlane } from '../components/GlobalControlPlane';
import { ProjectMemory } from '../components/ProjectMemory';
import { SynergyMap } from '../components/SynergyMap';
import { OmniscientSearch } from '../components/OmniscientSearch';
import { CampaignManager } from '../components/CampaignManager';
import { NexusEngineV2 } from '../components/NexusEngineV2';
import { Palette, GitMerge, Activity, Settings, FolderHeart, Network, Search, Target, LayoutGrid } from 'lucide-react';

export function OSPortal() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'console' | 'blog' | 'vault' | 'studio' | 'workflows' | 'dashboard' | 'analytics' | 'senate' | 'settings' | 'memory' | 'synergy' | 'campaign'>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            icon={<Activity size={18} />} 
            label="Executive Dashboard" 
            active={activeModule === 'dashboard'} 
            onClick={() => setActiveModule('dashboard')}
          />
          <SidebarButton 
            icon={<Target size={18} />} 
            label="Campaign Hub" 
            active={activeModule === 'campaign'} 
            onClick={() => setActiveModule('campaign')}
          />
          <SidebarButton 
            icon={<Terminal size={18} />} 
            label="Genius Console" 
            active={activeModule === 'console'} 
            onClick={() => setActiveModule('console')}
          />
          <SidebarButton 
            icon={<LayoutGrid size={18} />} 
            label="Nexus Engine V2" 
            active={activeModule === 'blog'} 
            onClick={() => setActiveModule('blog')}
          />
          <SidebarButton 
            icon={<LayoutGrid size={18} />} 
            label="Pillar Blog Engine" 
            active={activeModule === 'blog'} 
            onClick={() => setActiveModule('blog')}
          />
          <SidebarButton 
            icon={<Palette size={18} />} 
            label="Creative Studio" 
            active={activeModule === 'studio'} 
            onClick={() => setActiveModule('studio')}
          />
          <SidebarButton 
            icon={<GitMerge size={18} />} 
            label="Automated Workflows" 
            active={activeModule === 'workflows'} 
            onClick={() => setActiveModule('workflows')}
          />
          <SidebarButton 
            icon={<Database size={18} />} 
            label="Asset Vault" 
            active={activeModule === 'vault'} 
            onClick={() => setActiveModule('vault')}
          />
          <SidebarButton 
            icon={<FolderHeart size={18} />} 
            label="Project Memory" 
            active={activeModule === 'memory'} 
            onClick={() => setActiveModule('memory')}
          />
          <SidebarButton 
            icon={<Users size={18} />} 
            label="Swarm Analytics" 
            active={activeModule === 'analytics'} 
            onClick={() => setActiveModule('analytics')}
          />
          <SidebarButton 
            icon={<Network size={18} />} 
            label="Synergy Map" 
            active={activeModule === 'synergy'} 
            onClick={() => setActiveModule('synergy')}
          />
          <SidebarButton 
            icon={<Shield size={18} />} 
            label="Security Senate" 
            active={activeModule === 'senate'} 
            onClick={() => setActiveModule('senate')}
          />
          <div className="w-full h-px bg-white/5 my-2 hidden md:block" />
          <SidebarButton 
            icon={<Settings size={18} />} 
            label="Global Config" 
            active={activeModule === 'settings'} 
            onClick={() => setActiveModule('settings')}
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
      <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-neural-blue/10 via-obsidian to-obsidian h-screen overflow-hidden flex flex-col">
        
        {/* Top OS Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Command size={16} className="text-neural-blue opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              {activeModule === 'dashboard' && 'Global Metrics'}
              {activeModule === 'campaign' && 'Agency Directives Orchestrator'}
              {activeModule === 'console' && 'Interactive Matrix'}
              {activeModule === 'blog' && 'Autonomous Nexus Editor'}
              {activeModule === 'vault' && 'Secure Storage'}
              {activeModule === 'studio' && 'Interactive Creative Hub'}
              {activeModule === 'workflows' && 'Agency Autopilot'}
              {activeModule === 'analytics' && 'Swarm Telemetry'}
              {activeModule === 'senate' && 'Tribunal Override'}
              {activeModule === 'settings' && 'Core Configuration'}
              {activeModule === 'memory' && 'Client Context Base'}
              {activeModule === 'synergy' && 'Live Agent Neural Matrix'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-colors group mx-2"
            >
              <Search size={14} className="group-hover:text-neural-blue transition-colors" />
              <span className="text-[10px] uppercase font-black tracking-widest">Omniscient Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono ml-4">⌘K</kbd>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neural-blue animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
              <span className="text-[9px] font-mono tracking-widest text-neural-blue uppercase">G2.0T Active</span>
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
              {activeModule === 'dashboard' && <ExecutiveDashboard />}
              {activeModule === 'campaign' && <CampaignManager />}
              {activeModule === 'console' && <div className="h-full relative z-10 spatial-depth glass p-1 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-neural-blue/10 bg-black/40"><GeniusConsole /></div>}
              {activeModule === 'blog' && <NexusEngineV2 />}
              {activeModule === 'vault' && <AssetVault />}
              {activeModule === 'studio' && <CreativeStudio />}
              {activeModule === 'workflows' && <WorkflowBuilder />}
              {activeModule === 'analytics' && <SwarmAnalytics />}
              {activeModule === 'senate' && <SecuritySenate />}
              {activeModule === 'settings' && <GlobalControlPlane />}
              {activeModule === 'memory' && <ProjectMemory />}
              {activeModule === 'synergy' && <SynergyMap />}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      
      <OmniscientSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={(route) => setActiveModule(route as any)} 
      />
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
