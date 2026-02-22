import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, 
  ChevronLeft, Command, Database, Users
} from 'lucide-react';
import { StatusBadge } from '../components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MeshBackground } from '../components/NeuralSubstrate';
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
import { PillarBlogEngine } from '../components/PillarBlogEngine';
import { Palette, GitMerge, Activity, Settings, FolderHeart, Network, Search, Target, LayoutGrid, FileText } from 'lucide-react';

type ModuleKey = 'console' | 'nexus-engine' | 'pillar-blog' | 'vault' | 'studio' | 'workflows' | 'dashboard' | 'analytics' | 'senate' | 'settings' | 'memory' | 'synergy' | 'campaign';

const MODULE_META: Record<ModuleKey, { label: string; subtitle: string }> = {
  dashboard: { label: 'Executive Dashboard', subtitle: 'Global Metrics' },
  campaign: { label: 'Campaign Hub', subtitle: 'Agency Directives' },
  console: { label: 'Genius Console', subtitle: 'Live Agent Matrix' },
  'nexus-engine': { label: 'Nexus Engine V2', subtitle: 'Autonomous Workflows' },
  'pillar-blog': { label: 'Pillar Blog Engine', subtitle: 'Content Pipeline' },
  studio: { label: 'Creative Studio', subtitle: 'Asset Forge' },
  workflows: { label: 'Automated Workflows', subtitle: 'Agent Autopilot' },
  vault: { label: 'Asset Vault', subtitle: 'Secure Storage' },
  memory: { label: 'Project Memory', subtitle: 'Client Context' },
  analytics: { label: 'Swarm Analytics', subtitle: 'Agent Telemetry' },
  synergy: { label: 'Synergy Map', subtitle: 'Neural Network' },
  senate: { label: 'Security Senate', subtitle: 'RA-01 Tribunal' },
  settings: { label: 'Global Config', subtitle: 'System Parameters' },
};

export function OSPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialModule = (searchParams.get('module') as ModuleKey) || 'dashboard';
  const [activeModule, setActiveModule] = useState<ModuleKey>(initialModule);
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
    <div className="min-h-screen text-white flex overflow-hidden relative">
      {/* Animated Mesh Gradient Background */}
      <MeshBackground />

      {/* OS Sidebar */}
      <aside className="glass-sidebar w-20 md:w-64 flex flex-col pt-6 pb-6 z-20 relative shrink-0">
        
        {/* Logo */}
        <div className="px-5 pb-6 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-void text-xs shrink-0"
          >
            G5
          </motion.div>
          <div className="hidden md:block">
            <span className="font-display font-bold tracking-tight text-lg uppercase block leading-none">Agenticum</span>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">Enterprise OS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          <SidebarButton icon={<Activity size={16} />} label="Dashboard" active={activeModule === 'dashboard'} onClick={() => setActiveModule('dashboard')} />
          <SidebarButton icon={<Target size={16} />} label="Campaign Hub" active={activeModule === 'campaign'} onClick={() => setActiveModule('campaign')} />
          <SidebarButton icon={<Terminal size={16} />} label="Genius Console" active={activeModule === 'console'} onClick={() => setActiveModule('console')} accent />
          <SidebarButton icon={<LayoutGrid size={16} />} label="Nexus Engine" active={activeModule === 'nexus-engine'} onClick={() => setActiveModule('nexus-engine')} />
          <SidebarButton icon={<FileText size={16} />} label="Blog Engine" active={activeModule === 'pillar-blog'} onClick={() => setActiveModule('pillar-blog')} />
          <SidebarButton icon={<Palette size={16} />} label="Creative Studio" active={activeModule === 'studio'} onClick={() => setActiveModule('studio')} />
          <SidebarButton icon={<GitMerge size={16} />} label="Workflows" active={activeModule === 'workflows'} onClick={() => setActiveModule('workflows')} />
          <SidebarButton icon={<Database size={16} />} label="Asset Vault" active={activeModule === 'vault'} onClick={() => setActiveModule('vault')} />
          <SidebarButton icon={<FolderHeart size={16} />} label="Project Memory" active={activeModule === 'memory'} onClick={() => setActiveModule('memory')} />

          <div className="w-full h-px bg-white/5 my-3 hidden md:block" />

          <SidebarButton icon={<Users size={16} />} label="Swarm Analytics" active={activeModule === 'analytics'} onClick={() => setActiveModule('analytics')} />
          <SidebarButton icon={<Network size={16} />} label="Synergy Map" active={activeModule === 'synergy'} onClick={() => setActiveModule('synergy')} />
          <SidebarButton icon={<Shield size={16} />} label="Security Senate" active={activeModule === 'senate'} onClick={() => setActiveModule('senate')} />
          
          <div className="w-full h-px bg-white/5 my-3 hidden md:block" />
          
          <SidebarButton icon={<Settings size={16} />} label="Configuration" active={activeModule === 'settings'} onClick={() => setActiveModule('settings')} />
        </nav>

        {/* Exit */}
        <div className="px-3 pt-4 border-t border-white/5">
          <button 
            onClick={() => navigate('/')}
            className="sidebar-item w-full group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:block">Exit to Landing</span>
          </button>
        </div>
      </aside>

      {/* Main OS Content Area */}
      <main className="flex-1 relative h-screen overflow-hidden flex flex-col z-10">
        
        {/* Top Header Bar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <Command size={14} className="text-accent opacity-50" />
            <div className="flex flex-col">
              <span className="font-display text-sm uppercase tracking-wide">{MODULE_META[activeModule]?.label}</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] -mt-0.5">{MODULE_META[activeModule]?.subtitle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white transition-colors group"
            >
              <Search size={12} className="group-hover:text-accent transition-colors" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono ml-3">⌘K</kbd>
            </button>
            <StatusBadge status="processing" label="Gemini 2.0 Active" size="md" />
          </div>
        </header>

        {/* Dynamic Module Rendering */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          
          {/* Persistent Genius Console (Maintains WebSocket & Audio) */}
          <div className="absolute inset-4 md:inset-6" style={{ display: activeModule === 'console' ? 'block' : 'none', zIndex: 10 }}>
             <div className="h-full glass p-1 rounded-xl">
               <GeniusConsole />
             </div>
          </div>

          <AnimatePresence mode="wait">
            {activeModule !== 'console' && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="h-full relative z-20"
              >
                {activeModule === 'dashboard' && <ExecutiveDashboard onNavigate={(route) => setActiveModule(route as ModuleKey)} />}
                {activeModule === 'campaign' && <CampaignManager />}
                {activeModule === 'nexus-engine' && <NexusEngineV2 />}
                {activeModule === 'pillar-blog' && <PillarBlogEngine />}
                {activeModule === 'vault' && <AssetVault />}
                {activeModule === 'studio' && <CreativeStudio />}
                {activeModule === 'workflows' && <WorkflowBuilder />}
                {activeModule === 'analytics' && <SwarmAnalytics />}
                {activeModule === 'senate' && <SecuritySenate />}
                {activeModule === 'settings' && <GlobalControlPlane />}
                {activeModule === 'memory' && <ProjectMemory />}
                {activeModule === 'synergy' && <SynergyMap />}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>
      
      <OmniscientSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={(route) => setActiveModule(route as ModuleKey)} 
      />
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, accent }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-item w-full ${active ? 'active' : ''}`}
      title={label}
    >
      <div className={active ? 'text-accent' : accent ? 'text-accent/60' : ''}>{icon}</div>
      <span className="hidden md:block flex-1 text-left">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-indicator" 
          className="w-1.5 h-1.5 rounded-full bg-accent hidden md:block" 
          style={{ boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)' }}
        />
      )}
    </button>
  );
}
