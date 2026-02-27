import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Palette, 
  Settings, Shield, Eye, Film, Globe, Search, 
  ChevronLeft, Command, Database, Users, GitMerge, Activity, 
  FolderHeart, Network, Target, LayoutGrid, FileText, Radar, Mic, Wand2, Maximize2
} from 'lucide-react';
import { StatusBadge } from '../components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MeshBackground } from '../components/NeuralSubstrate';
import { GenIUSConsole } from '../components/GenIUSConsole';
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
import { ClientNexus } from '../components/ClientNexus';
import { CinematicForge } from '../components/CinematicForge';
import { GeopoliticsHub } from '../components/GeopoliticsHub';
import { ColumnaRadar } from '../components/os/ColumnaRadar';
import { PerfectTwinInspector } from '../components/os/PerfectTwinInspector';
import { SystemHeartbeat } from '../components/os/SystemHeartbeat';
import { ElementLibrary } from '../components/creative/ElementLibrary';
import { ScriptWizard } from '../components/creative/ScriptWizard';
import { ProjectPlayground } from '../components/playground/ProjectPlayground';
import { SwarmIntelligence } from '../components/telemetry/SwarmIntelligence';

import { GeniusPulsar } from '../components/os/GeniusPulsar';
import { ConsciousnessStream } from '../components/os/ConsciousnessStream';
import { ExecutiveIntervention } from '../components/os/ExecutiveIntervention';
import { JuryPresentation } from '../components/ui/JuryPresentation';
import { OSAuthGate } from '../components/auth/OSAuthGate';

type ModuleKey = 'console' | 'nexus-engine' | 'pillar-blog' | 'vault' | 'studio' | 'workflows' | 'dashboard' | 'analytics' | 'senate' | 'settings' | 'memory' | 'synergy' | 'campaign' | 'columna-radar' | 'perfect-twin' | 'client-nexus' | 'cinematic' | 'geopolitics' | 'element-library' | 'script-wizard' | 'playground' | 'swarm-intelligence';

const MODULE_META: Record<ModuleKey, { label: string; subtitle: string }> = {
  dashboard: { label: 'Executive Dashboard', subtitle: 'Global Metrics' },
  campaign: { label: 'Campaign Hub', subtitle: 'Agency Directives' },
  console: { label: 'GenIUS Console', subtitle: 'Live Agent Matrix' },
  'nexus-engine': { label: 'Nexus Engine V2', subtitle: 'Autonomous Workflows' },
  'pillar-blog': { label: 'Pillar Blog Engine', subtitle: 'Content Pipeline' },
  studio: { label: 'Creative Studio', subtitle: 'Asset Forge' },
  workflows: { label: 'Automated Workflows', subtitle: 'Agent Autopilot' },
  vault: { label: 'Asset Vault', subtitle: 'Secure Storage' },
  memory: { label: 'Project Memory', subtitle: 'Client Context' },
  analytics: { label: 'Swarm Analytics', subtitle: 'Agent Telemetry' },
  synergy: { label: 'Synergy Map', subtitle: 'Neural Network' },
  senate: { label: 'Security Senate', subtitle: 'RA01 Tribunal' },
  'columna-radar': { label: 'Columna Radar', subtitle: 'Competitive Intel' },
  'perfect-twin': { label: 'Perfect Twin', subtitle: 'Real-time Audit' },
  'client-nexus': { label: 'Client Nexus', subtitle: 'White-Label Portal' },
  cinematic: { label: 'Cinematic Forge', subtitle: 'Multi-Modal Hub' },
  'element-library': { label: 'Element Library', subtitle: 'Asset Marketplace' },
  'script-wizard': { label: 'Script Wizard', subtitle: 'Narrative Pipeline' },
  playground: { label: 'Project Playground', subtitle: 'Immersion State' },
  'swarm-intelligence': { label: 'Swarm Intelligence', subtitle: 'Neural Telemetry' },
  geopolitics: { label: 'Geopolitics Hub', subtitle: 'Sovereign AI Mesh' },
  settings: { label: 'Global Config', subtitle: 'System Parameters' },
};

type OSMode = 'genius' | 'command';

export function OSPortal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialModule = (searchParams.get('module') as ModuleKey) || 'dashboard';
  const [activeModule, setActiveModule] = useState<ModuleKey>(initialModule);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [osMode, setOsMode] = useState<OSMode>('command');
  const [geniusState, setGenIUSState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [showJuryTour, setShowJuryTour] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // JARVIS Mode shortcut: Alt+J
      if (e.altKey && e.key === 'j') {
        setOsMode(prev => prev === 'command' ? 'genius' : 'command');
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Listen for orchestration triggers to auto-expand to command mode
  useEffect(() => {
    const handler = () => {
      if (osMode === 'genius') {
        setOsMode('command');
        setActiveModule('console');
      }
    };
    window.addEventListener('trigger-orchestration', handler);
    return () => window.removeEventListener('trigger-orchestration', handler);
  }, [osMode]);

  return (
    <OSAuthGate>
      <div className={`min-h-screen text-white flex overflow-hidden relative selection:bg-accent/30 ${osMode === 'command' ? 'bg-midnight' : 'bg-obsidian/95'}`}>
        {/* Animated Mesh Gradient Background */}
        <MeshBackground />
      
      {/* Neural Substrate Sync Overlay */}
      <div className="neural-substrate-sync pulsing-substrate" />
      
      {/* Ghost in the Machine Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full animate-glow-pulse" />
         <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full animate-glow-pulse" style={{ animationDelay: '-2s' }} />
      </div>

      {/* OS Sidebar */}
      <AnimatePresence>
        {osMode === 'command' && (
          <motion.aside 
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-sidebar w-20 md:w-64 flex flex-col pt-6 pb-6 z-30 relative shrink-0"
          >
            
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
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">GenIUS OS</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto scrollbar-none">
              <SidebarButton icon={<Activity size={16} />} label="Dashboard" active={activeModule === 'dashboard'} onClick={() => setActiveModule('dashboard')} />
              <SidebarButton icon={<Target size={16} />} label="Campaign Hub" active={activeModule === 'campaign'} onClick={() => setActiveModule('campaign')} />
              <SidebarButton icon={<Terminal size={16} />} label="GenIUS Console" active={activeModule === 'console'} onClick={() => setActiveModule('console')} accent />
              <SidebarButton icon={<LayoutGrid size={16} />} label="Nexus Engine" active={activeModule === 'nexus-engine'} onClick={() => setActiveModule('nexus-engine')} />
              <SidebarButton icon={<FileText size={16} />} label="Blog Engine" active={activeModule === 'pillar-blog'} onClick={() => setActiveModule('pillar-blog')} />
              <SidebarButton icon={<Palette size={16} />} label="Creative Studio" active={activeModule === 'studio'} onClick={() => setActiveModule('studio')} />
              <SidebarButton icon={<GitMerge size={16} />} label="Workflows" active={activeModule === 'workflows'} onClick={() => setActiveModule('workflows')} />
              <SidebarButton icon={<Database size={16} />} label="Asset Vault" active={activeModule === 'vault'} onClick={() => setActiveModule('vault')} />
              <SidebarButton icon={<FolderHeart size={16} />} label="Project Memory" active={activeModule === 'memory'} onClick={() => setActiveModule('memory')} />

              <div className="w-full h-px bg-white/5 my-3 hidden md:block" />

              <SidebarButton icon={<Users size={16} />} label="Swarm Analytics" active={activeModule === 'analytics'} onClick={() => setActiveModule('analytics')} />
              <SidebarButton icon={<Activity size={16} className="text-accent" />} label="Swarm Intelligence" active={activeModule === 'swarm-intelligence'} onClick={() => setActiveModule('swarm-intelligence')} />
              <SidebarButton icon={<Network size={16} />} label="Synergy Map" active={activeModule === 'synergy'} onClick={() => setActiveModule('synergy')} />
              <SidebarButton icon={<Shield size={16} />} label="Security Senate" active={activeModule === 'senate'} onClick={() => setActiveModule('senate')} />
              <SidebarButton icon={<Radar size={16} />} label="Columna Radar" active={activeModule === 'columna-radar'} onClick={() => setActiveModule('columna-radar')} />
              <SidebarButton icon={<Eye size={16} />} label="Perfect Twin" active={activeModule === 'perfect-twin'} onClick={() => setActiveModule('perfect-twin')} />
              <SidebarButton icon={<Shield className="text-accent" size={16} />} label="Client Nexus" active={activeModule === 'client-nexus'} onClick={() => setActiveModule('client-nexus')} />
              <SidebarButton icon={<Film className="text-magenta" size={16} />} label="Cinematic Forge" active={activeModule === 'cinematic'} onClick={() => setActiveModule('cinematic')} />
              <SidebarButton icon={<Database size={16} className="text-accent" />} label="Elements" active={activeModule === 'element-library'} onClick={() => setActiveModule('element-library')} />
              <SidebarButton icon={<Wand2 size={16} className="text-accent" />} label="Script Wizard" active={activeModule === 'script-wizard'} onClick={() => setActiveModule('script-wizard')} />
              <SidebarButton icon={<Maximize2 size={16} className="text-accent" />} label="Playground" active={activeModule === 'playground'} onClick={() => setActiveModule('playground')} />
              <SidebarButton icon={<Globe className="text-accent" size={16} />} label="Geopolitics Hub" active={activeModule === 'geopolitics'} onClick={() => setActiveModule('geopolitics')} />
              
              <div className="w-full h-px bg-white/5 my-3 hidden md:block" />
              
              <SidebarButton icon={<Settings size={16} />} label="Configuration" active={activeModule === 'settings'} onClick={() => setActiveModule('settings')} />

              <div className="mt-auto px-3 hidden md:block">
                <SystemHeartbeat />
              </div>
            </nav>

            {/* Exit */}
            <div className="px-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => navigate('/')}
                className="sidebar-item w-full"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden md:block">Exit Matrix</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle JARVIS Mode Button (Subtle, floating) */}
      <button 
        onClick={() => setOsMode(prev => prev === 'command' ? 'genius' : 'command')}
        className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/40 transition-all hover:scale-110 group"
        title="Toggle JARVIS Protocol (Alt+J)"
      >
        <Command size={16} className={osMode === 'genius' ? 'text-accent animate-pulse' : ''} />
      </button>

      {/* Main OS Content Area */}
      <main className="flex-1 relative h-screen overflow-hidden flex flex-col z-10 transition-all duration-700">
        
        {/* GenIUS Mode View (Holographic Pulsar) */}
        <AnimatePresence>
          {osMode === 'genius' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-obsidian-900/40 backdrop-blur-3xl"
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full pulsar-glow" />
                <GeniusPulsar state={geniusState} />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-4xl font-display font-black tracking-tighter italic text-white mb-2">
                  AGENTICUM <span className="text-accent drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">G5</span> GenIUS
                </h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/30 animate-pulse">
                  Neural Fabric Online // Ghost Active
                </p>
              </motion.div>

              {/* Quick Prompt Interface in GenIUS Mode */}
              <div className="mt-12 w-full max-w-xl px-6">
                 <div className="ultra-lucid p-1 flex items-center gap-2 group focus-within:border-accent/40 transition-all">
                    <div className="w-10 h-10 flex items-center justify-center text-accent/40 group-focus-within:text-accent transition-colors">
                       <Mic size={18} />
                    </div>
                    <input 
                       type="text" 
                       placeholder="Assign directive to swarm..."
                       onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                             setGenIUSState('thinking');
                             setTimeout(() => {
                                setOsMode('command');
                                setActiveModule('console');
                                setGenIUSState('idle');
                             }, 1500);
                          }
                       }}
                       className="flex-1 bg-transparent border-none text-sm font-mono focus:ring-0 placeholder:text-white/10"
                    />
                    <div className="px-3">
                       <kbd className="text-[10px] font-mono text-white/10 uppercase tracking-widest">Enter</kbd>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Bar */}
        <AnimatePresence>
          {osMode === 'command' && (
            <motion.header 
              initial={{ y: -60 }}
              animate={{ y: 0 }}
              exit={{ y: -60 }}
              className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-3xl z-30 shrink-0"
            >
                <div 
                  className="flex items-center gap-3 cursor-pointer group/pulsar"
                  onClick={() => setOsMode('genius')}
                >
                  <div className="w-8 h-8 relative scale-[0.4] origin-center -ml-2 -mr-2">
                    <GeniusPulsar state={geniusState} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-sm uppercase tracking-wide italic group-hover/pulsar:text-accent transition-colors">{MODULE_META[activeModule]?.label}</span>
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] -mt-0.5">{MODULE_META[activeModule]?.subtitle}</span>
                  </div>
                </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden lg:flex items-center gap-2 bg-white/3 border border-white/10 px-4 py-1.5 rounded-lg text-white/40 hover:bg-white/6 hover:text-white transition-colors group"
                >
                  <Search size={12} className="group-hover:text-accent transition-colors" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Omniscient Search</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono ml-3 text-white/20">⌘K</kbd>
                </button>
                <button 
                  onClick={() => setShowJuryTour(true)}
                  className="hidden xl:flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-lg text-accent hover:bg-accent hover:text-void transition-all group shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                >
                  <Wand2 size={12} className="animate-pulse" />
                  <span className="font-display text-[10px] font-black uppercase tracking-widest">Launch Jury Tour</span>
                </button>
                <StatusBadge status="processing" label="SENTIENT CORE v5.1" size="md" />
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Dynamic Module Rendering */}
        <section className={`flex-1 overflow-y-auto p-4 md:p-6 relative transition-opacity duration-700 ${osMode === 'command' ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Persistent GenIUS Console (Maintains WebSocket & Audio) */}
          <div className="absolute inset-4 md:inset-6" style={{ display: activeModule === 'console' ? 'block' : 'none', zIndex: 10 }}>
             <div className="h-full ultra-lucid p-1 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               <GenIUSConsole />
             </div>
          </div>

          <AnimatePresence mode="wait">
            {activeModule !== 'console' && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(30px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(30px)' }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
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
                {activeModule === 'columna-radar' && <ColumnaRadar />}
                {activeModule === 'perfect-twin' && <PerfectTwinInspector />}
                {activeModule === 'settings' && <GlobalControlPlane />}
                {activeModule === 'memory' && <ProjectMemory />}
                {activeModule === 'synergy' && <SynergyMap />}
                {activeModule === 'client-nexus' && <ClientNexus />}
                {activeModule === 'cinematic' && <CinematicForge />}
                {activeModule === 'element-library' && <ElementLibrary elements={[]} onAddElement={() => {}} onSelectElement={() => {}} />}
                {activeModule === 'script-wizard' && <ScriptWizard />}
                {activeModule === 'playground' && <ProjectPlayground />}
                {activeModule === 'swarm-intelligence' && <SwarmIntelligence />}
                {activeModule === 'geopolitics' && <GeopoliticsHub />}
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

      <ConsciousnessStream />
      <ExecutiveIntervention />

      <AnimatePresence>
        {showJuryTour && (
          <JuryPresentation 
            onModuleChange={(module) => setActiveModule(module as ModuleKey)} 
            onClose={() => setShowJuryTour(false)} 
          />
        )}
      </AnimatePresence>
    </div>
    </OSAuthGate>
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
