import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ============================================================
   TYPES
   ============================================================ */
interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  latency: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/* ============================================================
   DATA
   ============================================================ */
const AGENTS: Agent[] = [
  {
    id: 'SN-00',
    name: 'NEURAL ORCHESTRATOR',
    description: 'Dispatches all agents via SwarmProtocol v3.0',
    model: 'gemini-2.0-flash',
    latency: '38ms',
  },
  {
    id: 'SP-01',
    name: 'STRATEGIC CORTEX',
    description: 'Competitor intelligence via Firestore Vector Search',
    model: 'gemini-2.0-flash',
    latency: '1200ms',
  },
  {
    id: 'CC-06',
    name: 'COGNITIVE CORE',
    description: 'Multi-channel content synthesis & copywriting',
    model: 'gemini-2.0-flash',
    latency: '3200ms',
  },
  {
    id: 'DA-03',
    name: 'DESIGN ARCHITECT',
    description: 'Visual asset generation via Imagen 3',
    model: 'imagen-3.0-generate-002',
    latency: '6800ms',
  },
  {
    id: 'BA-07',
    name: 'BROWSER ARCHITECT',
    description: 'Real-world research & Google Search grounding',
    model: 'gemini-2.0-flash',
    latency: '2100ms',
  },
  {
    id: 'VE-01',
    name: 'VOICE ENGAGEMENT',
    description: 'Gemini Live API bidirectional audio streaming & tool calling',
    model: 'gemini-2.0-flash-live-001',
    latency: '<800ms',
  },
  {
    id: 'RA-01',
    name: 'SECURITY SENATE',
    description: 'EU AI Act Art.50 compliance gate. Veto power.',
    model: 'gemini-2.0-flash',
    latency: '280ms',
  },
  {
    id: 'SO-00',
    name: 'SOVEREIGN CORE',
    description: 'Federated sync, RAG memory & pilot coordination',
    model: 'gemini-2.0-flash',
    latency: '580ms',
  },
  {
    id: 'PM-07',
    name: 'MISSION MANAGER',
    description: '24/7 persistent mission sync, Google Chat integration & proactive scheduling',
    model: 'gemini-2.0-flash',
    latency: '420ms',
  },
];

const TECH_BADGES = [
  'Gemini 2.0 Flash',
  'Gemini Live API',
  'Vertex AI',
  'Imagen 3.0',
  'text-embedding-004',
  'Google Cloud Run',
  'Firestore Vector Search',
  'Secret Manager',
  'Cloud Build',
  'React 19',
  'FastAPI',
  'Node.js',
  'Tailwind v4',
  'europe-west1',
];

/* ============================================================
   ICONS (inline SVG — zero extra imports)
   ============================================================ */
const IconMic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
  </svg>
);

const IconNetwork = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconZap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconGithub = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const IconGemini = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
    <path d="M20 3v4"/><path d="M18 5h4"/><path d="M4 18v2"/><path d="M3 19h2"/>
  </svg>
);

/* ============================================================
   HOW IT WORKS DATA
   ============================================================ */
const HOW_STEPS: Step[] = [
  { number: '01', title: 'VOICE INPUT', description: 'Speak your campaign brief', icon: <IconMic /> },
  { number: '02', title: 'ORCHESTRATION', description: 'SN-00 dispatches to all agents', icon: <IconNetwork /> },
  { number: '03', title: 'PARALLEL SWARM', description: '9 agents execute simultaneously', icon: <IconZap /> },
  { number: '04', title: 'SENATE GATE', description: 'RA-01 audits every output', icon: <IconShield /> },
  { number: '05', title: 'DELIVERY', description: 'Campaign ready in under 60 seconds', icon: <IconCheck /> },
];

/* ============================================================
   FADE-IN WRAPPER
   ============================================================ */
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string; immediate?: boolean }> = ({
  children,
  delay = 0,
  className = '',
  immediate = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    {...(immediate
      ? { animate: { opacity: 1, y: 0 } }
      : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }
    )}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');

  const checkApiHealth = async () => {
    if (apiHealth === 'checking') return;
    setApiHealth('checking');
    try {
      const res = await fetch('https://genius-backend-697051612685.europe-west1.run.app/api/v1/health', { signal: AbortSignal.timeout(8000) });
      setApiHealth(res.ok ? 'online' : 'offline');
      setTimeout(() => setApiHealth('idle'), 4000);
    } catch {
      setApiHealth('offline');
      setTimeout(() => setApiHealth('idle'), 4000);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  /* ── NAV ── */
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }} className="min-h-screen bg-black text-white">

      {/* ================================================================
          NAVIGATION
          ================================================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-sm font-bold tracking-widest text-white uppercase"
          >
            AGENTICUM G5
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'AGENTS', id: 'agents' },
              { label: 'STACK', id: 'stack' },
              { label: 'COMPLIANCE', id: 'compliance' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-mono text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://github.com/yoyo967/agenticum-g5-genius"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest"
            >
              <IconGithub size={14} />
              Source
            </a>
            <div className="flex items-center gap-3">
              <motion.button
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={() => window.open('/demo-workflow', '_blank')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                DEMO
              </motion.button>
              <button
                onClick={() => navigate('/os')}
                className="px-4 py-2 border border-zinc-700 hover:border-zinc-400 text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Enter OS
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 px-6 py-4 flex flex-col gap-4">
            {['agents', 'stack', 'compliance'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="font-mono text-xs text-zinc-400 uppercase tracking-widest text-left"
              >
                {id}
              </button>
            ))}
            <button onClick={() => navigate('/demo')} className="font-mono text-xs text-blue-400 uppercase tracking-widest text-left">
              DEMO
            </button>
            <button onClick={() => navigate('/os')} className="font-mono text-xs text-white uppercase tracking-widest text-left">
              Enter OS
            </button>
          </div>
        )}
      </header>

      {/* ================================================================
          SECTION 1 — HERO
          ================================================================ */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <FadeIn delay={0} immediate>
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  Gemini Live Agent Challenge 2026
                </span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <IconGemini />
                    <span className="font-mono text-[10px] text-white/60 font-bold uppercase tracking-tighter">Powered by Gemini 2.0 Flash</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <IconShield />
                    <span className="font-mono text-[10px] text-white/60 font-bold uppercase tracking-tighter">Google Cloud Ecosystem</span>
                 </div>
              </div>
            </div>
          </FadeIn>

          {/* H1 */}
          <FadeIn delay={0.1} immediate>
            <h1
              className="font-bold tracking-tight text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}
            >
              The Neural<br />Marketing OS.
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2} immediate>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              9 AI agents. One voice command.<br />
              From brief to campaign in under 60 seconds.
            </p>
          </FadeIn>

          {/* Buttons */}
          <FadeIn delay={0.3} immediate>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <button
                onClick={() => navigate('/os')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest transition-colors"
              >
                Initialize Swarm <IconArrowRight />
              </button>
              <button
                onClick={() => window.open('/demo-workflow', '_blank')}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-white font-mono text-sm uppercase tracking-widest transition-colors"
              >
                Watch Demo <IconArrowRight />
              </button>
            </div>
          </FadeIn>

          {/* Stats — STATIC, no counter, no animation */}
          <FadeIn delay={0.4} immediate>
            <div className="grid grid-cols-3 gap-px border border-zinc-800 bg-zinc-800">
              {[
                { value: '9', label: 'AI AGENTS' },
                { value: '99%', label: 'SENATE APPROVAL' },
                { value: '<60s', label: 'CAMPAIGN TIME' },
              ].map((stat) => (
                <div key={stat.label} className="bg-black py-8 px-4 flex flex-col items-center">
                  <span
                    className="font-bold text-white tabular-nums mb-2"
                    style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
                  >
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          NEW: GEMINI LIVE API SHOWCASE
          ================================================================ */}
      <section id="gemini-live" className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/20 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <IconGemini />
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest font-bold">
                    Hackathon Star: Gemini Live API
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-[1.1]">
                   Voice Control.<br />
                   <span className="text-zinc-500">Multimodal Swarm Trigger.</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                  By integrating the <strong>@google/genai v1.43.0</strong> Live API, Agenticum G5 enables seamless verbal dialogue. 
                  No latency. No button clicks. Just speak your vision.
                </p>
              </FadeIn>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: 'launch_swarm', body: 'The model calls our core orchestrator whenever marketing directives are detected.', icon: <IconZap /> },
                  { title: 'Barge-in Support', body: 'Interruption handling via serverContent.interrupted for natural turn-taking.', icon: <IconMic /> },
                  { title: '16kHz Streaming', body: 'Compressed PCM16 audio forwarded directly to the Multimodal backend.', icon: <IconNetwork /> },
                  { title: 'v00012 Node', body: 'Fully deployed on Europe-West1 with <800ms intent recognition.', icon: <IconShield /> },
                ].map((f, i) => (
                  <FadeIn key={f.title} delay={0.1 + (i * 0.05)} className="space-y-2">
                    <div className="text-blue-500">{f.icon}</div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wide">{f.title}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{f.body}</p>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Visual Representation of the Live Waveform */}
            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
               <div className="relative border border-zinc-800 bg-black/40 backdrop-blur-xl p-8 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Live Audio Substrate</span>
                    </div>
                    <span className="font-mono text-[9px] text-blue-500/50">NODE: EU-WEST1</span>
                  </div>
                  
                  <div className="h-40 flex items-center justify-center gap-1.5 mb-8">
                    {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, 20 + h*4, 10] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                        className="w-1.5 bg-blue-500/30 rounded-full"
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
                        <p className="font-mono text-[10px] text-zinc-600 uppercase mb-2">User Transcription (Live)</p>
                        <p className="text-sm italic text-white/80">"Create a viral campaign for our new sustainable coffee brand..."</p>
                     </div>
                     <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                        <p className="font-mono text-[10px] text-blue-400 uppercase mb-2">Function Dispatch</p>
                        <p className="text-xs font-bold text-blue-400">→ TOOL_CALL: launch_swarm({`{"intent": "sustainable coffee campaign"}`})</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2 — PROBLEM / SOLUTION
          ================================================================ */}
      <section id="problem" className="py-32 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-px bg-zinc-800">
          {/* Old Way */}
          <FadeIn className="bg-black p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-mono text-xs text-red-500 uppercase tracking-widest">The Old Way</span>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-500 line-through mb-4 leading-snug">
              Manual dashboards.<br />Sequential tools.
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              You are the biological glue between disconnected systems.
              Tab switching. Context switching. Cognitive Debt accumulates.
              Your team burns hours on coordination instead of creation.
            </p>
          </FadeIn>

          {/* G5 Way */}
          <FadeIn delay={0.1} className="bg-zinc-950 p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-xs text-green-500 uppercase tracking-widest">The G5 Way</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 leading-snug">
              One voice command.<br />9 agents activate.
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Research. Write. Design. Audit. Simultaneously.
              SN-00 orchestrates the entire swarm in parallel.
              Enterprise speed. Zero cognitive debt.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SECTION 3 — 9 AGENTS
          ================================================================ */}
      <section id="agents" className="py-32 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-16 text-center">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Swarm Architecture
            </span>
            <h2 className="text-4xl font-semibold text-white">
              Nine purpose-built AI agents.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
            {AGENTS.map((agent, i) => (
              <FadeIn key={agent.id} delay={i * 0.05} className="bg-zinc-950 hover:bg-zinc-900 transition-colors p-6 flex flex-col gap-4">
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-500 font-bold tracking-widest">
                    {agent.id}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-bold text-white text-sm uppercase tracking-wide leading-tight">
                  {agent.name}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                  {agent.description}
                </p>

                {/* Model / Latency */}
                <div className="pt-4 border-t border-zinc-800 font-mono text-xs text-zinc-600">
                  {agent.model} · {agent.latency}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          NEW: LIVE OUTPUT GALLERY [LP-03]
          ================================================================ */}
      <section id="gallery" className="py-32 px-6 border-t border-zinc-900 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              The Artifact Forge
            </span>
            <h2 className="text-4xl font-semibold text-white">Live Swarm Outputs.</h2>
            <p className="text-zinc-500 mt-4 max-w-lg">
              Actual outputs generated during the 2026 hackathon demo. 
              From high-fidelity imagery to strategic frameworks.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Visual Output */}
            <FadeIn delay={0.1} className="md:col-span-7 group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
               <div className="absolute top-4 left-4 z-10">
                 <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded font-mono text-[9px] text-white">
                   DA-03 · IMAGE_GEN (IMAGEN 3)
                 </div>
               </div>
               <img 
                 src="/ai_output_storyboard_example_1772557810590.png" 
                 alt="AI Generated Storyboard Frame" 
                 className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="p-6">
                  <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-2">Cinematic Storyboard v4.1</h4>
                  <p className="text-zinc-500 text-xs italic">"Prompt: Luxury watch commercial, golden swirls, minimalist aesthetic."</p>
               </div>
            </FadeIn>

            {/* Strategy Output */}
            <FadeIn delay={0.2} className="md:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-6">
               <div className="flex items-center justify-between">
                 <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded font-mono text-[9px] text-yellow-500/80">
                   SP-01 · STRATEGIC_CORTEX
                 </div>
                 <span className="font-mono text-[9px] text-zinc-600 uppercase">CONFIDENCE: 98.4%</span>
               </div>
               
               <div className="space-y-4 font-mono text-[11px]">
                  <div className="text-zinc-500 uppercase tracking-wider mb-2">Market Disruption Points:</div>
                  <div className="p-3 bg-black border-l-2 border-yellow-500/50 rounded-r-lg">
                    <p className="text-white mb-2 font-bold">1. Cognitive Saturation Loop</p>
                    <p className="text-zinc-500 leading-relaxed">Target Gen-Alpha attention spans with 6ms visual delta shifts.</p>
                  </div>
                  <div className="p-3 bg-black border-l-2 border-zinc-700 rounded-r-lg opacity-60">
                    <p className="text-white mb-2">2. Emotional Arbitrage</p>
                    <p className="text-zinc-500">Leverage FOMO via Decentralized Nexus distribution.</p>
                  </div>
               </div>
               
               <div className="mt-auto pt-6 border-t border-zinc-900 text-center">
                  <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">→ System Verified</span>
               </div>
            </FadeIn>

            {/* Text Output Section */}
            <FadeIn delay={0.3} className="md:col-span-12 bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
               <div className="flex items-center gap-3 mb-6">
                 <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-mono text-[9px] text-emerald-500/80">
                   CC-06 · COGNITIVE_CORE
                 </div>
                 <div className="h-px flex-1 bg-zinc-900" />
               </div>

               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-white font-bold uppercase text-xs tracking-wider">Viral Hook (Variant A)</h4>
                    <p className="text-zinc-300 text-2xl leading-tight font-serif italic">
                      "Time doesn't just flow. It evolves. Experience the Genesis of the G5 Swarm."
                    </p>
                  </div>
                  <div className="space-y-4 border-l border-zinc-900 pl-12 font-mono text-xs text-zinc-500">
                    <p><span className="text-zinc-700 uppercase tracking-tighter">Tone:</span> Prestige / Avant-garde</p>
                    <p><span className="text-zinc-700 uppercase tracking-tighter">Target:</span> HNWIs / Tech Enthusiasts</p>
                    <p><span className="text-zinc-700 uppercase tracking-tighter">Platform:</span> Multimodal Immersive</p>
                  </div>
               </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — HOW IT WORKS
          ================================================================ */}
      <section id="how" className="py-32 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-16 text-center">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Execution Flow
            </span>
            <h2 className="text-4xl font-semibold text-white">How It Works.</h2>
          </FadeIn>

          {/* Steps — responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-zinc-800">
            {HOW_STEPS.map((step, i) => (
              <FadeIn key={step.number} delay={i * 0.1} className="bg-zinc-950 p-8 flex flex-col items-center text-center gap-4">
                {/* Step Number */}
                <span className="font-mono text-xs text-zinc-700 tracking-widest">{step.number}</span>

                {/* Icon */}
                <div className="text-blue-500">{step.icon}</div>

                {/* Title */}
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-zinc-500 text-xs leading-relaxed">{step.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — TECH STACK
          ================================================================ */}
      <section id="stack" className="py-32 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Infrastructure
            </span>
            <h2 className="text-4xl font-semibold text-white mb-4">
              Built on Google Cloud. No shortcuts.
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              100% Google native stack. Zero wrapper abstractions.
              Every component deployed and verified in production.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center mb-16">
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-2 border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-400 uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
               <a href="https://agenticum-backend-697051612685.europe-west1.run.app/api/v1/health" target="_blank" rel="noopener noreferrer" className="bg-black p-6 hover:bg-zinc-950 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500 animate-pulse">●</span>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">LIVE DEPLOYMENT</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Cloud Run europe-west1</div>
                  <div className="font-mono text-[10px] text-zinc-600">agenticum-backend · Rev 00051</div>
                  <div className="mt-4 text-[10px] text-blue-500 font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Verify API Health →</div>
               </a>
               <div className="bg-black p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-zinc-500">📦</span>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">CONTAINER REGISTRY</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Artifact Registry</div>
                  <div className="font-mono text-[10px] text-zinc-600">agenticum-containers</div>
               </div>
               <div className="bg-black p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-zinc-500">📊</span>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">REAL-TIME DATABASE</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Firestore (Native Mode)</div>
                  <div className="font-mono text-[10px] text-zinc-600">online-marketing-manager</div>
               </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={checkApiHealth}
                className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  apiHealth === 'online' ? 'text-green-500' :
                  apiHealth === 'offline' ? 'text-red-500' :
                  apiHealth === 'checking' ? 'text-blue-400 animate-pulse' :
                  'text-zinc-600 hover:text-blue-500'
                }`}
              >
                {apiHealth === 'online' ? '✓ agenticum-backend: ONLINE' :
                 apiHealth === 'offline' ? '✗ Backend Unreachable' :
                 apiHealth === 'checking' ? '⟳ Checking API Health...' :
                 '→ Verify API Health (Live Check)'}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SECTION 5.5 — ARCHITECTURE DIAGRAM [LP-02]
          ================================================================ */}
      <section id="architecture" className="py-32 px-6 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Structural Blueprint
            </span>
            <h2 className="text-4xl font-semibold text-white mb-4">System Architecture.</h2>
            <p className="text-zinc-400">9 agents. 3 layers. One neural fabric.</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-4">
              {/* Layer 1 */}
              <div className="flex justify-center gap-4">
                <div className="w-1/2 max-w-[200px] bg-zinc-900 border border-zinc-700/50 rounded-lg p-4 text-center">
                  <p className="font-bold text-sm text-white mb-1">Voice (VE-01)</p>
                  <p className="text-[10px] font-mono text-zinc-500">Gemini Live API</p>
                </div>
                <div className="w-1/2 max-w-[200px] bg-zinc-900 border border-zinc-700/50 rounded-lg p-4 text-center">
                  <p className="font-bold text-sm text-white mb-1">OS Portal</p>
                  <p className="text-[10px] font-mono text-zinc-500">React 19 / Vite</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-px h-8 bg-linear-to-b from-blue-500/50 to-blue-500"></div>
              </div>

              {/* Layer 2 */}
              <div className="flex justify-center">
                <div className="w-full max-w-[420px] bg-zinc-900 border border-blue-500/30 rounded-lg p-6 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500"></div>
                   <p className="font-bold text-sm text-white mb-2">SN-00 NEURAL ORCHESTRATOR</p>
                   <p className="text-[10px] font-mono text-zinc-400">SwarmProtocol v3.0 // 9 Agents dispatched in parallel</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-px h-8 bg-linear-to-b from-blue-500 to-blue-500/50"></div>
              </div>

              {/* Layer 3 — 9 Sub-Agents */}
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { id: 'SP-01', label: 'STRATEGIC', color: 'border-yellow-500/40 text-yellow-400' },
                  { id: 'CC-06', label: 'COGNITIVE', color: 'border-emerald-500/40 text-emerald-400' },
                  { id: 'DA-03', label: 'DESIGN', color: 'border-purple-500/40 text-purple-400' },
                  { id: 'BA-07', label: 'BROWSER', color: 'border-green-500/40 text-green-400' },
                  { id: 'RA-01', label: 'SENATE', color: 'border-red-500/40 text-red-400' },
                  { id: 'SO-00', label: 'SOVEREIGN', color: 'border-blue-500/40 text-blue-400' },
                  { id: 'PM-07', label: 'MISSION', color: 'border-orange-500/40 text-orange-400' },
                ].map(agent => (
                  <div key={agent.id} className={`bg-zinc-900/50 border rounded-lg p-2 text-center ${agent.color.split(' ')[0]}`}>
                    <p className={`text-[10px] font-mono font-bold mb-0.5 ${agent.color.split(' ')[1]}`}>{agent.id}</p>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{agent.label}</p>
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-px h-8 bg-linear-to-b from-blue-500/50 to-zinc-700"></div>
              </div>

              {/* Layer 4 — GCP Infrastructure */}
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { t: 'Gemini 2.0 Flash', s: 'europe-west1' },
                   { t: 'Firestore', s: 'Vector Search' },
                   { t: 'Cloud Run', s: 'Auto-scaling' },
                   { t: 'Imagen 3', s: 'Visual Gen' },
                   { t: 'Vertex AI', s: 'Grounding' },
                   { t: 'Secret Manager', s: 'Hardened' }
                 ].map(x => (
                   <div key={x.t} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-center">
                      <p className="text-[11px] font-bold text-zinc-300 mb-0.5">{x.t}</p>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">{x.s}</p>
                   </div>
                 ))}
              </div>

              <div className="pt-12 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                Deployed in europe-west1 (Belgium) · EU AI Act Art.50 compliant by design.
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 — COMPLIANCE
          ================================================================ */}
      <section id="compliance" className="py-32 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Governance
            </span>
            <h2 className="text-4xl font-semibold text-white">Compliance by Design.</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-800">
            {[
              {
                flag: '🇪🇺',
                title: 'EU AI ACT ART.50',
                body: 'Every AI output labeled and disclosed. Zero dark patterns. Enforced by RA-01.',
              },
              {
                flag: '🔒',
                title: 'GDPR · PRIVACY BY DESIGN',
                body: 'Zero trackers. Auto-consent. C2PA provenance on every asset.',
              },
              {
                flag: '♿',
                title: 'WCAG 2.1 AA · EAA 2025',
                body: 'Accessibility enforced by Senate. Lighthouse ≥ 95/100.',
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.1} className="bg-zinc-950 p-10 flex flex-col gap-4">
                <span className="text-3xl">{card.flag}</span>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7 — FINAL CTA
          ================================================================ */}
      <section id="cta" className="py-40 px-6 border-t border-zinc-900">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2
            className="font-bold text-white tracking-tight mb-6 leading-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
          >
            Nine specialized agents.<br />
            One voice command.<br />
            Zero friction.
          </h2>

          <p className="text-zinc-400 mb-12 font-mono text-sm">
            9 Agents · 3 Layers · Production Ready.
          </p>

          <button
            onClick={() => navigate('/os')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest transition-colors"
          >
            Initialize Swarm <IconArrowRight />
          </button>
        </FadeIn>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="py-20 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <span className="font-mono text-sm font-bold tracking-widest text-white uppercase block mb-4">
                AGENTICUM G5 GENIUS
              </span>
              <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
                The world's first voice-activated AI creative agency. 
                Built specifically for the Gemini Live Agent Challenge 2026.
              </p>
              <div className="flex gap-4">
                 <a href="https://github.com/yoyo967/agenticum-g5-genius" target="_blank" rel="noopener noreferrer" 
                    className="p-2 border border-zinc-800 rounded-lg hover:border-zinc-400 transition-colors text-zinc-500 hover:text-white">
                   <IconGithub size={20} />
                 </a>
                 <a href="https://geminiliveagentchallenge.devpost.com/" target="_blank" rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 border border-zinc-800 rounded-lg hover:border-zinc-400 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
                   DEVPOST SUBMISSION
                 </a>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">Repository</h5>
              <ul className="space-y-2 text-xs font-mono text-zinc-600">
                <li className="hover:text-blue-500 transition-colors pointer-events-none">/backend (FastAPI/Node)</li>
                <li className="hover:text-blue-500 transition-colors pointer-events-none">/landing (React 19)</li>
                <li className="hover:text-blue-500 transition-colors pointer-events-none">/engine (Python Swarm)</li>
              </ul>
            </div>
            <div className="flex flex-col items-end justify-start">
               <div className="w-16 h-16 border-2 border-zinc-800 rounded-xl flex items-center justify-center mb-2">
                 <span className="font-display font-black text-2xl text-zinc-800">G5</span>
               </div>
               <span className="font-mono text-[8px] text-zinc-700">REVISION: {import.meta.env.VITE_BUILD_SHA || '489ae16'}</span>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.4em]">
              © 2026 · ALL SYSTEMS OPERATIONAL
            </span>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="font-mono text-[9px] text-green-500/80 font-bold uppercase tracking-widest">Hackathon Validated Build</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
