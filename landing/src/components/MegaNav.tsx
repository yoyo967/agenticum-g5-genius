import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ExternalLink } from 'lucide-react';

/* ============================================================
   AGENT DATA
   ============================================================ */
const AGENTS = [
  { id: 'SN-00', name: 'Neural Orchestrator', glyph: '⚡', slug: 'sn00-orchestrator', desc: 'Dispatches all 9 agents in parallel · 38ms', color: 'text-blue-400' },
  { id: 'SO-00', name: 'Sovereign Core', glyph: '🧬', slug: 'so00-sovereign', desc: 'Sentient fusion layer · Vision synthesis', color: 'text-indigo-400' },
  { id: 'SP-01', name: 'Strategic Cortex', glyph: '🔍', slug: 'sp01-strategic-cortex', desc: 'Market intelligence · Vector Search', color: 'text-yellow-400' },
  { id: 'CC-06', name: 'Cognitive Core', glyph: '✍', slug: 'cc06-cognitive-core', desc: 'Copywriting · Brand voice · Content', color: 'text-emerald-400' },
  { id: 'DA-03', name: 'Design Architect', glyph: '🎨', slug: 'da03-design-architect', desc: 'Imagen 3 · Visual assets · UI/UX', color: 'text-purple-400' },
  { id: 'BA-07', name: 'Browser Architect', glyph: '🌐', slug: 'ba07-browser-architect', desc: 'Live research · Grounding · Automation', color: 'text-green-400' },
  { id: 'VE-01', name: 'Voice Engagement', glyph: '🎤', slug: 've01-voice-engagement', desc: 'Gemini Live API · <800ms · Bidi audio', color: 'text-blue-300' },
  { id: 'RA-01', name: 'Security Senate', glyph: '⚖', slug: 'ra01-security-senate', desc: 'EU AI Act Art.50 · Veto gate · Audit', color: 'text-red-400' },
  { id: 'PM-07', name: 'Mission Control', glyph: '📅', slug: 'pm07-mission-control', desc: 'Scheduling · Google Chat · Dispatch', color: 'text-orange-400' },
];

/* ============================================================
   MODULE DATA
   ============================================================ */
const MODULES_COL_A = [
  { name: 'GenIUS Console', glyph: '🖥', slug: 'genius-console', osRoute: '/os/genius', desc: 'Voice + Text command center' },
  { name: 'Executive Dashboard', glyph: '📊', slug: 'executive-dashboard', osRoute: '/os', desc: 'Live KPIs & telemetry' },
  { name: 'Nexus Engine V2', glyph: '🔬', slug: 'nexus-engine', osRoute: '/os/nexus', desc: 'Visual workflow DAG editor' },
  { name: 'Campaign Manager', glyph: '📣', slug: 'campaign-manager', osRoute: '/os/campaigns', desc: 'PMax & performance marketing' },
  { name: 'Pillar Blog Engine', glyph: '✍', slug: 'pillar-blog-engine', osRoute: '/os/blog', desc: 'Autonomous SEO publishing' },
  { name: 'Creative Studio', glyph: '🎨', slug: 'creative-studio', osRoute: '/os/creative', desc: 'CC-06 + DA-03 workspace' },
  { name: 'Cinematic Forge', glyph: '🎬', slug: 'cinematic-forge', osRoute: '/os/creative', desc: 'Video synthesis & storyboard' },
  { name: 'Asset Vault', glyph: '🗃', slug: 'asset-vault', osRoute: '/os/vault', desc: 'GCS enterprise file management' },
];

const MODULES_COL_B = [
  { name: 'Workflow Builder', glyph: '⚙', slug: 'workflow-builder', osRoute: '/os/workflows', desc: 'ReactFlow DAG automation' },
  { name: 'Project Memory', glyph: '🧠', slug: 'project-memory', osRoute: '/os/memory', desc: 'Campaign archive & context' },
  { name: 'Swarm Analytics', glyph: '📈', slug: 'swarm-analytics', osRoute: '/os/analytics', desc: 'Agent throughput & metrics' },
  { name: 'Synergy Map', glyph: '🗺', slug: 'synergy-map', osRoute: '/os/synergy', desc: 'Inter-agent data flow viz' },
  { name: 'Security Senate', glyph: '🔒', slug: 'security-senate', osRoute: '/os/senate', desc: 'EU AI Act compliance tribunal' },
  { name: 'Columna Radar', glyph: '📡', slug: 'columna-radar', osRoute: '/os/radar', desc: 'Competitor intelligence pulse' },
  { name: 'Perfect Twin', glyph: '🪞', slug: 'perfect-twin', osRoute: '/os/twin', desc: 'Blockchain audit trail' },
  { name: 'Global Radar', glyph: '🌍', slug: 'global-radar', osRoute: '/os/radar', desc: 'Geopolitical intelligence map' },
];

/* ============================================================
   DROPDOWN COMPONENT
   ============================================================ */
interface DropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function NavDropdown({ label, isOpen, onToggle, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
          isOpen ? 'text-white' : 'text-zinc-500 hover:text-white'
        }`}
      >
        {label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={11} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full mt-2 z-[200]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   MAIN MEGA NAV COMPONENT
   ============================================================ */
export function MegaNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<'agents' | 'modules' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.pathname]);

  const toggle = (menu: 'agents' | 'modules') =>
    setOpenMenu(prev => (prev === menu ? null : menu));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav ref={navRef} className="fixed top-0 inset-x-0 z-[100] border-b border-white/5">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-6 flex items-center h-16 gap-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mr-4 group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl border border-blue-500/40 bg-blue-500/10 flex items-center justify-center group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300">
            <span className="font-black text-sm text-blue-400 font-mono">G5</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-white uppercase tracking-widest hidden sm:block">
            AGENTICUM G5
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {/* Agents Mega Dropdown */}
          <NavDropdown label="Agents" isOpen={openMenu === 'agents'} onToggle={() => toggle('agents')}>
            <div className="w-[760px] border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-900">
                <div>
                  <p className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.25em] mb-1">Neural Swarm</p>
                  <p className="text-white font-bold text-sm">9 Specialized AI Agents</p>
                </div>
                <button
                  onClick={() => navigate('/agents')}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl"
                >
                  View All <ArrowRight size={10} />
                </button>
              </div>
              {/* 3-column grid */}
              <div className="grid grid-cols-3 gap-2">
                {AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => navigate(`/agents/${agent.slug}`)}
                    className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xl mt-0.5 shrink-0">{agent.glyph}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-mono text-[9px] font-black ${agent.color}`}>{agent.id}</span>
                      </div>
                      <p className="text-white text-xs font-semibold leading-tight mb-0.5 group-hover:text-blue-300 transition-colors">{agent.name}</p>
                      <p className="text-zinc-600 text-[10px] leading-tight">{agent.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">SwarmProtocol v3.0 · 9 Parallel Threads · 38ms Init</span>
                <Link
                  to="/os"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest transition-colors rounded-xl"
                >
                  Enter OS <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </NavDropdown>

          {/* Modules Mega Dropdown */}
          <NavDropdown label="OS Modules" isOpen={openMenu === 'modules'} onToggle={() => toggle('modules')}>
            <div className="w-[840px] -translate-x-32 border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-900">
                <div>
                  <p className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.25em] mb-1">Neural OS</p>
                  <p className="text-white font-bold text-sm">15 Mission-Critical Modules</p>
                </div>
                <button
                  onClick={() => navigate('/modules')}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-blue-400 font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl"
                >
                  View All <ArrowRight size={10} />
                </button>
              </div>
              {/* 2-column grid */}
              <div className="grid grid-cols-2 gap-x-6">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest mb-2">Core Intelligence</p>
                  {MODULES_COL_A.map((mod) => (
                    <button
                      key={mod.slug}
                      onClick={() => navigate(`/modules/${mod.slug}`)}
                      className="group w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-base shrink-0 w-6 text-center">{mod.glyph}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium group-hover:text-blue-300 transition-colors">{mod.name}</p>
                        <p className="text-zinc-600 text-[10px]">{mod.desc}</p>
                      </div>
                      <ExternalLink size={9} className="text-zinc-700 group-hover:text-blue-500 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest mb-2">Advanced Systems</p>
                  {MODULES_COL_B.map((mod) => (
                    <button
                      key={mod.slug}
                      onClick={() => navigate(`/modules/${mod.slug}`)}
                      className="group w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-base shrink-0 w-6 text-center">{mod.glyph}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium group-hover:text-blue-300 transition-colors">{mod.name}</p>
                        <p className="text-zinc-600 text-[10px]">{mod.desc}</p>
                      </div>
                      <ExternalLink size={9} className="text-zinc-700 group-hover:text-blue-500 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-900 flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">React 19 · Firestore · Cloud Run · WebSocket · europe-west1</span>
                <Link
                  to="/os"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest transition-colors rounded-xl"
                >
                  Enter OS Live <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </NavDropdown>

          {/* Flat links */}
          {[
            { label: 'How It Works', path: '/how-it-works' },
            { label: 'Tech', path: '/tech' },
            { label: 'Blog', path: '/blog' },
          ].map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                isActive(link.path) ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <button
            onClick={() => navigate('/demo-workflow')}
            className="px-4 py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl"
          >
            Demo
          </button>
          <Link
            to="/os"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest transition-colors rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            Enter OS <ArrowRight size={10} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(p => !p)}
          className="lg:hidden ml-auto w-10 h-10 flex flex-col justify-center items-center gap-1.5"
        >
          <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-zinc-400" />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-px bg-zinc-400" />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-5 h-px bg-zinc-400" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative lg:hidden border-t border-zinc-900 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {[
                { label: 'Agents', path: '/agents', glyph: '⚡' },
                { label: 'OS Modules', path: '/modules', glyph: '🖥' },
                { label: 'How It Works', path: '/how-it-works', glyph: '⚙' },
                { label: 'Tech Stack', path: '/tech', glyph: '🔬' },
                { label: 'Blog', path: '/blog', glyph: '✍' },
                { label: 'Demo', path: '/demo-workflow', glyph: '▶' },
              ].map((item, i) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-xl w-8 text-center">{item.glyph}</span>
                  <span className="font-mono text-sm text-zinc-300 uppercase tracking-widest">{item.label}</span>
                </motion.button>
              ))}
              <div className="pt-4 border-t border-zinc-900">
                <Link
                  to="/os"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-colors"
                >
                  Enter OS <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
