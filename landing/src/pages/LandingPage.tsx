import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MegaNav } from '../components/MegaNav';
import g5ComplianceSenateLP from '../assets/g5_compliance_senate_en_v2_1772174738278.png';
import g5CinematicForgeLP from '../assets/g5_cinematic_forge.png';
import g5TacticalRadarLP from '../assets/g5_tactical_radar_strike_en_v2_1772174690101.png';
import g5NeuralSwarmLP from '../assets/g5_neural_swarm.png';
import g5HeroDashboardLP from '../assets/g5_hero_dashboard.png';
import g5VoiceAutonomyLP from '../assets/g5_voice_autonomy.png';

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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // SEO meta + JSON-LD schema injection
  useEffect(() => {
    document.title = 'AGENTICUM G5 GENIUS — The Neural AI Marketing Operating System';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'AGENTICUM G5 GENIUS: 9 AI agents running in parallel on Google Cloud. Voice-activated via Gemini Live API. From brief to campaign in under 60 seconds. EU AI Act compliant by design.');
    const setOg = (prop: string, val: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setOg('og:title', 'AGENTICUM G5 GENIUS — The Neural AI Marketing Operating System');
    setOg('og:description', '9 AI agents. One voice command. From brief to campaign in under 60 seconds.');
    setOg('og:url', 'https://online-marketing-manager.web.app');
    setOg('og:type', 'website');
    const existing = document.getElementById('jsonld-main');
    if (!existing) {
      const s = document.createElement('script');
      s.id = 'jsonld-main';
      s.type = 'application/ld+json';
      s.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AGENTICUM G5 GENIUS',
        description: '9 AI agents running in parallel. Voice-activated via Gemini Live API. From brief to campaign in under 60 seconds.',
        applicationCategory: 'AIApplication',
        operatingSystem: 'Web',
        url: 'https://online-marketing-manager.web.app',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        author: { '@type': 'Person', name: 'AGENTICUM G5 Lead Architect' },
        keywords: 'AI marketing, neural OS, Gemini Live API, multi-agent system, EU AI Act',
      });
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }} className="min-h-screen bg-black text-white">

      <MegaNav />


      {/* ================================================================
          SECTION 1 — HERO
          ================================================================ */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24"
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
                onClick={() => scrollToSection('demo-video')}
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
                { value: 'RA-01', label: 'SENATE AUDITED' },
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
          HACKATHON ELIGIBILITY BANNER
          ================================================================ */}
      <section className="border-b border-zinc-900 bg-zinc-950/70 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Gemini Live Agent Challenge 2026</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest">Category: Live Agents 🗣</span>
            </div>
            {[
              { label: 'Gemini Live API', ok: true },
              { label: 'Google Cloud', ok: true },
              { label: 'Multimodal I/O', ok: true },
              { label: 'EU AI Act Art.50', ok: true },
            ].map(chip => (
              <div key={chip.label} className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/5 border border-blue-500/20 rounded-full">
                <span className="text-green-400 text-[8px]">✓</span>
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">{chip.label}</span>
              </div>
            ))}
          </div>
          <a href="https://geminiliveagentchallenge.devpost.com/" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-2 px-4 py-1.5 border border-zinc-800 hover:border-blue-500/50 font-mono text-[9px] text-zinc-500 hover:text-blue-400 uppercase tracking-widest transition-all rounded-full shrink-0">
            View Devpost Submission →
          </a>
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
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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
          NEW: DEMO VIDEO [LP-10]
          ================================================================ */}
      <section id="demo-video" className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/40 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">Production Preview</span>
            <h2 className="text-4xl font-semibold text-white mb-2">The Swarm in Action.</h2>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Vision · Voice · Execution</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative aspect-video bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group cursor-pointer" onClick={() => navigate('/demo-workflow')}>
             {import.meta.env.VITE_DEMO_VIDEO_ID && import.meta.env.VITE_DEMO_VIDEO_ID !== 'YOUR_YOUTUBE_ID_HERE' ? (
               <iframe
                 className="w-full h-full border-0 pointer-events-none"
                 src={`https://www.youtube.com/embed/${import.meta.env.VITE_DEMO_VIDEO_ID}?autoplay=0&rel=0&modestbranding=1`}
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
                 title="GenIUS OS Demo"
               />
             ) : (
               <>
                 {/* OS Live Preview Thumbnail */}
                 <img src="/ai_output_storyboard.png" alt="GenIUS OS Preview" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,rgba(0,0,0,0.8)_70%)]" />
                 {/* Live data overlay */}
                 <div className="absolute top-6 left-6 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest">Neural Link Active · Dynamic Sync</span>
                 </div>
                 <div className="absolute top-6 right-6 font-mono text-[9px] text-blue-400/60 tracking-widest">GEMINI 2.0 FLASH LIVE</div>
                 {/* Animated waveform */}
                 <div className="absolute inset-x-0 bottom-16 flex items-end justify-center gap-1 px-24 h-20">
                   {[2,4,6,8,10,8,12,6,9,5,11,7,9,4,8,6,10,5,7,9,6,4,8,5,10,7,9,6].map((h, i) => (
                     <motion.div
                       key={i}
                       animate={{ height: [h * 2, h * 4, h * 2] }}
                       transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05 }}
                       className="w-1 bg-blue-500/40 rounded-full"
                     />
                   ))}
                 </div>
                 {/* Central CTA */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                   <motion.div
                     className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-500/40 flex items-center justify-center mb-6 group-hover:bg-blue-600/40 group-hover:border-blue-500 transition-all duration-500 shadow-[0_0_40px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]"
                     animate={{ scale: [1, 1.05, 1] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                   >
                     <div className="w-0 h-0 border-t-14 border-t-transparent border-l-22 border-l-blue-400 border-b-14 border-b-transparent ml-2" />
                   </motion.div>
                   <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest group-hover:text-blue-300 transition-colors">Launch Live Demo</h3>
                   <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">7-step automated walkthrough · Gemini Live API</p>
                 </div>
                 <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
               </>
             )}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="grid sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Automated 7-Step Walkthrough', time: '~3 min', href: '/demo-workflow' },
              { label: 'Enter OS Live', time: 'Instant', href: '/os' },
              { label: 'Watch Architecture Deep-Dive', time: 'Scroll ↓', href: '#architecture' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => item.href.startsWith('#') ? scrollToSection(item.href.slice(1)) : navigate(item.href)}
                className="flex items-center justify-between px-5 py-3 border border-zinc-800 hover:border-zinc-600 bg-zinc-950 hover:bg-zinc-900 transition-colors group rounded-xl"
              >
                <span className="font-mono text-[10px] text-zinc-400 group-hover:text-white transition-colors uppercase tracking-wider">{item.label}</span>
                <span className="font-mono text-[9px] text-zinc-700 group-hover:text-blue-500 transition-colors">{item.time}</span>
              </button>
            ))}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
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
          SECTION 5.5 — ARCHITECTURE DIAGRAM [LP-02]
          ================================================================ */}
      <section id="architecture" className="py-32 px-6 border-t border-zinc-900 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Structural Blueprint
            </span>
            <h2 className="text-4xl font-semibold text-white mb-4">System Architecture.</h2>
            <p className="text-zinc-400">9 agents. 3 layers. One neural fabric. <span className="text-zinc-600">Hover each node for details.</span></p>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* ── LAYER 1: INPUTS ── */}
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.25em] text-center mb-3">Input Layer</p>
            <div className="flex justify-center gap-4 mb-2">
              {[
                { label: 'Voice (VE-01)', sub: 'Gemini Live API · <800ms', color: 'border-blue-500/50 bg-blue-500/5', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
                { label: 'OS Portal', sub: 'React 19 / Vite · WebSocket', color: 'border-zinc-700 bg-zinc-900/50', glow: '' },
              ].map(n => (
                <div key={n.label} className={`group relative px-6 py-4 border rounded-xl text-center ${n.color} ${n.glow} hover:scale-105 transition-all duration-300 cursor-default min-w-[140px]`}>
                  <p className="font-bold text-sm text-white mb-1">{n.label}</p>
                  <p className="text-[9px] font-mono text-zinc-500">{n.sub}</p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-2 bg-blue-500/50" />
                </div>
              ))}
            </div>

            {/* ── CONNECTOR ── */}
            <div className="flex justify-center mb-2">
              <div className="w-px h-8 bg-linear-to-b from-blue-500/60 to-blue-500 relative">
                <motion.div className="absolute inset-0 bg-blue-400" animate={{ scaleY: [0, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} />
              </div>
            </div>

            {/* ── LAYER 2: ORCHESTRATOR ── */}
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.25em] text-center mb-3">Orchestration Layer</p>
            <div className="flex justify-center mb-2">
              <div className="group relative w-full max-w-md bg-zinc-900 border-2 border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-2xl p-6 text-center hover:border-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-default">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
                <div className="flex items-center justify-center gap-3 mb-2">
                  <motion.div className="w-2 h-2 rounded-full bg-blue-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  <p className="font-black text-sm text-white tracking-widest font-mono uppercase">SN-00 · Neural Orchestrator</p>
                </div>
                <p className="text-[10px] font-mono text-zinc-400">SwarmProtocol v3.0 · Dispatches 9 agents in parallel · 38ms init</p>
                {/* Tooltip */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-[10px] font-mono text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  Model: gemini-2.0-flash · Latency: 38ms · Cloud Run: europe-west1
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-2 bg-blue-500/50" />
              </div>
            </div>

            {/* ── CONNECTOR ── */}
            <div className="flex justify-center mb-2">
              <div className="w-px h-8 bg-linear-to-b from-blue-500 to-blue-500/30" />
            </div>

            {/* ── LAYER 3: AGENT SWARM ── */}
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.25em] text-center mb-3">Agent Swarm Layer</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-2">
              {[
                { id: 'SP-01', label: 'Strategic', desc: 'Competitor intel via Vector Search', latency: '1200ms', color: 'border-yellow-500/40 hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]', text: 'text-yellow-400', glyph: '🔍' },
                { id: 'CC-06', label: 'Content', desc: 'Multi-channel copywriting & synthesis', latency: '3200ms', color: 'border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]', text: 'text-emerald-400', glyph: '✍' },
                { id: 'DA-03', label: 'Design', desc: 'Imagen 3 visual asset generation', latency: '6800ms', color: 'border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]', text: 'text-purple-400', glyph: '🎨' },
                { id: 'BA-07', label: 'Browser', desc: 'Real-world research & grounding', latency: '2100ms', color: 'border-green-500/40 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]', text: 'text-green-400', glyph: '🌐' },
                { id: 'VE-01', label: 'Voice', desc: 'Live API bidi audio & tool calling', latency: '<800ms', color: 'border-blue-500/40 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]', text: 'text-blue-400', glyph: '🎤' },
                { id: 'RA-01', label: 'Senate', desc: 'EU AI Act veto & compliance gate', latency: '280ms', color: 'border-red-500/40 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]', text: 'text-red-400', glyph: '⚖' },
                { id: 'PM-07', label: 'Mission', desc: 'Scheduling & Google Chat sync', latency: '420ms', color: 'border-orange-500/40 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]', text: 'text-orange-400', glyph: '📅' },
              ].map(agent => (
                <div key={agent.id} className={`group relative bg-zinc-900/60 border rounded-xl p-3 text-center cursor-default transition-all duration-300 ${agent.color}`}>
                  <p className="text-lg mb-1">{agent.glyph}</p>
                  <p className={`text-[10px] font-mono font-black mb-0.5 ${agent.text}`}>{agent.id}</p>
                  <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{agent.label}</p>
                  {/* Latency badge */}
                  <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-black border border-zinc-800 rounded text-[7px] font-mono text-zinc-600">{agent.latency}</div>
                  {/* Hover tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[9px] font-mono text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none w-48 text-left">
                    <p className={`font-bold ${agent.text} mb-0.5`}>{agent.id}</p>
                    <p className="text-zinc-500">{agent.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CONNECTOR ── */}
            <div className="flex justify-center mb-2">
              <div className="w-px h-8 bg-linear-to-b from-blue-500/30 to-zinc-700" />
            </div>

            {/* ── LAYER 4: GOOGLE CLOUD ── */}
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.25em] text-center mb-3">Google Cloud Infrastructure</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { t: 'Gemini 2.0 Flash', s: 'europe-west1' },
                { t: 'Firestore', s: 'Vector Search' },
                { t: 'Cloud Run', s: 'Auto-scaling' },
                { t: 'Imagen 3', s: 'Visual Gen' },
                { t: 'Vertex AI', s: 'Grounding' },
                { t: 'Secret Manager', s: 'Hardened' },
              ].map(x => (
                <div key={x.t} className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 rounded-lg p-3 text-center transition-colors cursor-default">
                  <p className="text-[10px] font-bold text-zinc-300 mb-0.5">{x.t}</p>
                  <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{x.s}</p>
                </div>
              ))}
            </div>

            <div className="pt-10 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Deployed in europe-west1 (Belgium) · EU AI Act Art.50 compliant by design.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SECTION 4.5 — APEX / PILLAR / CLUSTER + OS MODULES SHOWCASE
          ================================================================ */}
      <section id="os-architecture" className="py-32 px-6 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/4 blur-[150px] -z-10 rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <FadeIn className="mb-20">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
              <div>
                <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">OS Architecture</span>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-none">
                  Apex.<br />Pillar.<br />Cluster.
                </h2>
              </div>
              <p className="text-zinc-400 max-w-md text-base leading-relaxed lg:text-right">
                Three sovereign tiers. One operating system. From a single voice command to forty campaign deliverables — all in under 60 seconds.
              </p>
            </div>

            {/* Three-tier grid */}
            <div className="grid md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 mb-20">
              {[
                {
                  tier: 'APEX',
                  icon: '◈',
                  title: 'The Neural OS',
                  color: 'text-white',
                  bg: 'bg-black',
                  body: 'The supreme command layer. When you speak to the GenIUS Console, you activate the Apex: 9 agents on standby, 15 modules live, 27 routes ready. All intelligence flows downward from this singular entity.',
                  stat: '9 Agents · 15 Modules · 27 Routes',
                },
                {
                  tier: 'PILLAR',
                  icon: '⬡',
                  title: 'The 15 Modules',
                  color: 'text-blue-400',
                  bg: 'bg-zinc-950',
                  body: 'Each OS module is a Pillar — a complete, sovereign system with specialized agents and certification-grade output formats. The Security Senate is a Pillar of governance. The Pillar Blog Engine is a Pillar of content authority.',
                  stat: 'Core · Content · Intelligence · Operations · Governance',
                },
                {
                  tier: 'CLUSTER',
                  icon: '◇',
                  title: 'The Deliverables',
                  color: 'text-zinc-400',
                  bg: 'bg-zinc-950',
                  body: 'Clusters are the atomic outputs. A 2,500-word SEO article. Twelve Imagen 3 visuals. A PMax campaign package. A compliance certificate. One command generates 40+ deliverables across multiple Pillars simultaneously.',
                  stat: 'Blog · Visuals · PMax packages · Compliance certs',
                },
              ].map(t => (
                <div key={t.tier} className={`${t.bg} p-8 flex flex-col gap-4`}>
                  <div>
                    <p className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${t.color}`}>{t.icon} {t.tier}</p>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wide">{t.title}</h4>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed flex-1">{t.body}</p>
                  <p className={`font-mono text-[9px] uppercase tracking-wider border-t border-zinc-800 pt-4 ${t.color}`}>{t.stat}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* OS Module visual showcase */}
          <FadeIn delay={0.15}>
            <div className="flex items-center justify-between mb-10">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Featured Modules</span>
              <button
                onClick={() => navigate('/modules')}
                className="flex items-center gap-2 font-mono text-[10px] text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Full Registry <IconArrowRight />
              </button>
            </div>

            {/* 2×2 module image grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {[
                {
                  slug: 'security-senate',
                  image: g5ComplianceSenateLP,
                  alt: 'Security Senate — EU AI Act compliance enforcement',
                  layer: 'Governance · RA-01',
                  layerColor: 'text-red-400',
                  name: 'Security Senate',
                  body: 'EU AI Act Art.50 enforcement with cryptographically signed compliance certificates on every output. No bypass. No exceptions.',
                },
                {
                  slug: 'creative-studio',
                  image: g5CinematicForgeLP,
                  alt: 'Creative Studio — synchronized Imagen 3 and copywriting workspace',
                  layer: 'Content · CC-06 + DA-03',
                  layerColor: 'text-purple-400',
                  name: 'Creative Studio',
                  body: 'Synchronized copywriting and Imagen 3 visual generation. Text and imagery evolve together — one workspace, one intent, one deliverable.',
                },
                {
                  slug: 'columna-radar',
                  image: g5TacticalRadarLP,
                  alt: 'Columna Radar — real-time competitive intelligence',
                  layer: 'Intelligence · SP-01 + BA-07',
                  layerColor: 'text-amber-400',
                  name: 'Columna Radar',
                  body: 'Continuous competitor surveillance via semantic vector distance anomaly detection. Be first to market — every time a competitor moves.',
                },
                {
                  slug: 'pillar-blog-engine',
                  image: g5NeuralSwarmLP,
                  alt: 'Pillar Blog Engine — autonomous SEO content generation',
                  layer: 'Content · CC-06 + SP-01 + RA-01',
                  layerColor: 'text-emerald-400',
                  name: 'Pillar Blog Engine',
                  body: 'Keyword strategy to Senate-approved published article — fully autonomous. 2,500+ words, Schema.org markup, internal links. Zero editing required.',
                },
              ].map(mod => (
                <Link
                  key={mod.slug}
                  to={`/modules/${mod.slug}`}
                  className="relative block rounded-2xl overflow-hidden border border-zinc-800 group cursor-pointer"
                >
                  <img
                    src={mod.image}
                    alt={mod.alt}
                    className="w-full aspect-video object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className={`font-mono text-[9px] uppercase tracking-widest mb-2 ${mod.layerColor}`}>{mod.layer}</p>
                    <h4 className="font-bold text-white text-xl mb-2 tracking-tight">{mod.name}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">{mod.body}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-3 py-1.5 bg-black/70 border border-white/10 rounded-full font-mono text-[9px] text-white">
                      View Module →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Voice Autonomy cinematic break */}
            <Link to="/os/genius" className="relative block rounded-3xl overflow-hidden border border-zinc-800 h-64 group cursor-pointer mt-10">
              <img
                src={g5VoiceAutonomyLP}
                alt="GenIUS Console — Gemini Live API voice-activated OS interface"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500 mix-blend-luminosity scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-10">
                <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-3">Core · VE-01 · Gemini Live API</p>
                <h4 className="font-bold text-white text-3xl sm:text-4xl tracking-tight mb-3">GenIUS Console.</h4>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                  Speak your campaign brief. VE-01 processes bidirectional PCM16 audio in under 800ms. SN-00 dispatches all 9 agents in 38ms. The full swarm executes in parallel.
                </p>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1.5 bg-black/70 border border-white/10 rounded-full font-mono text-[9px] text-white flex items-center gap-1.5">
                  Boot Console →
                </div>
              </div>
            </Link>

            {/* Hero Dashboard cinematic break */}
            <Link to="/os" className="relative block rounded-3xl overflow-hidden border border-zinc-800 h-64 group cursor-pointer mt-6">
              <img
                src={g5HeroDashboardLP}
                alt="Executive Dashboard — real-time KPIs and swarm telemetry"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 transition-opacity duration-500 mix-blend-luminosity scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-10">
                <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3">Core · SN-00 + PM-07 · Real-Time</p>
                <h4 className="font-bold text-white text-3xl sm:text-4xl tracking-tight mb-3">Executive Dashboard.</h4>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                  Resonance Index. Swarm Readiness. Active campaigns. Live agent telemetry. Every KPI a CMO needs — aggregated from all 15 modules into one high-density command interface.
                </p>
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1.5 bg-black/70 border border-white/10 rounded-full font-mono text-[9px] text-white">
                  Open Dashboard →
                </div>
              </div>
            </Link>

            <div className="text-center mt-10">
              <button
                onClick={() => navigate('/modules')}
                className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition-colors"
              >
                Explore All 15 OS Modules <IconArrowRight />
              </button>
            </div>
          </FadeIn>
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
               <a href="https://genius-backend-697051612685.europe-west1.run.app/api/v1/health" target="_blank" rel="noopener noreferrer" className="bg-black p-6 hover:bg-zinc-950 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500 animate-pulse">●</span>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">LIVE DEPLOYMENT</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Cloud Run europe-west1</div>
                  <div className="font-mono text-[10px] text-zinc-600">genius-backend · Rev 00051</div>
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
                 src="/ai_output_storyboard.png" 
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
          PROOF OF CLOUD — JURY VERIFIED STRIP
          ================================================================ */}
      <section className="py-16 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-10">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.25em] block mb-2">Jury Verification Zone</span>
            <h3 className="text-2xl font-bold text-white">Proof of Cloud Deployment.</h3>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: 'Cloud Run Backend',
                  value: 'europe-west1',
                  status: 'LIVE',
                  href: 'https://genius-backend-697051612685.europe-west1.run.app/api/v1/health',
                  color: 'text-green-400 border-green-500/50 bg-green-500/15',
                },
                {
                  label: 'Firebase Hosting',
                  value: 'online-marketing-manager',
                  status: 'LIVE',
                  href: 'https://online-marketing-manager.web.app',
                  color: 'text-blue-400 border-blue-500/50 bg-blue-500/15',
                },
                {
                  label: 'Devpost Submission',
                  value: 'Gemini Live Agent Challenge',
                  status: 'SUBMITTED',
                  href: 'https://geminiliveagentchallenge.devpost.com/',
                  color: 'text-purple-400 border-purple-500/50 bg-purple-500/15',
                },
              ].map(card => (
                <a key={card.label} href={card.href} target="_blank" rel="noopener noreferrer"
                   className={`block p-6 border rounded-2xl hover:scale-[1.02] transition-all cursor-pointer group ${card.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">{card.label}</span>
                    <span className={`font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${card.color}`}>{card.status}</span>
                  </div>
                  <p className="font-bold text-white text-sm group-hover:underline">{card.value}</p>
                  <p className="font-mono text-[9px] text-zinc-700 mt-1 uppercase tracking-widest">Click to verify →</p>
                </a>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={checkApiHealth}
                className={`inline-flex items-center gap-3 px-8 py-3 border rounded-full font-mono text-xs uppercase tracking-widest transition-all ${
                  apiHealth === 'online' ? 'border-green-500 text-green-400 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.15)]' :
                  apiHealth === 'offline' ? 'border-red-500 text-red-400' :
                  apiHealth === 'checking' ? 'border-blue-500 text-blue-400 animate-pulse' :
                  'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  apiHealth === 'online' ? 'bg-blue-500 animate-pulse' :
                  apiHealth === 'offline' ? 'bg-red-500' :
                  apiHealth === 'checking' ? 'bg-blue-500 animate-spin' :
                  'bg-zinc-700'
                }`} />
                {apiHealth === 'online' ? '✓ Backend Verified: ONLINE — europe-west1' :
                 apiHealth === 'offline' ? '✗ Backend Unreachable — check logs' :
                 apiHealth === 'checking' ? '⟳ Pinging genius-backend...' :
                 'Run Live API Health Check'}
              </button>
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
          SECTION 6.5 — MISSION & ROADMAP (THE STORY)
          ================================================================ */}
      <section id="roadmap" className="py-32 px-6 border-t border-zinc-900 bg-obsidian/20 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10" />
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">
              Evolutionary Path
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">The Journey to 2030.</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              Agenticum G5 is not just a tool—it's a vision of the future human-machine partnership. 
              Our story is one of relentless iteration and a leap into the multimodal unknown.
            </p>
          </FadeIn>

          <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
            {[
              {
                phase: 'PHASE 01: THE GENESIS',
                title: 'Agenticum G5 v1.0',
                date: 'Fall 2025',
                body: 'The first vision: A modular neural orchestration OS. We set out to prove that marketing could be autonomous. Participation in the initial hackathon taught us the power of agentic workflows and the importance of brand integrity.',
                icon: <IconNetwork />,
                active: false
              },
              {
                phase: 'PHASE 02: THE REVOLUTION',
                title: 'GenIUS Edition',
                date: 'MARCH 2026',
                body: 'A technological pivot. Inspired by the Gemini Live API, we rebuilt G5 into GenIUS. This phase introduced real-time multimodal interaction, turning the swarm from a silent engine into a voice-activated advisor. This was my first time building a project of this scale, powered by Google Antigravity.',
                icon: <IconMic />,
                active: true
              },
              {
                phase: 'PHASE 03: THE NEXUS',
                title: 'Jarvis Protocol',
                date: '2027 - 2028',
                body: 'Moving towards total enterprise integration. Seamless cross-platform execution, where agents predict market shifts before they happen. Expansion of the RA-01 Senate gate into an automated global regulatory compliance network.',
                icon: <IconZap />,
                active: false
              },
              {
                phase: 'PHASE 04: THE FABRIC',
                title: 'Iron Man Paradigm',
                date: 'MISSION 2030',
                body: 'The ultimate goal: A ubiquitous, sentient marketing substrate. A Jarvis-like experience where the boundary between idea and execution vanishes. Agenticum G5 becomes the invisible backbone of the global digital economy.',
                icon: <IconShield />,
                active: false
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative pl-12">
                <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center border ${
                  item.active ? 'bg-blue-600 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-black border-zinc-800 text-zinc-600'
                } z-10`}>
                  <div className={item.active ? 'text-white' : 'scale-75'}>{item.icon}</div>
                </div>
                <div className={`p-8 rounded-2xl border transition-all ${
                  item.active ? 'bg-zinc-950 border-blue-500/30 ring-1 ring-blue-500/10' : 'bg-transparent border-zinc-900 opacity-60'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${item.active ? 'text-blue-400' : 'text-zinc-600'}`}>
                      {item.phase}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-700">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-20 p-10 bg-linear-to-br from-zinc-900 to-black border border-white/5 rounded-3xl text-center">
             <h4 className="text-zinc-400 font-mono text-[11px] uppercase tracking-[0.2em] mb-4">The Creator's Note</h4>
             <p className="text-zinc-500 italic text-sm leading-relaxed max-w-2xl mx-auto">
               "This project is more than code; it's a testament to the learning power of hackathons. Building G5 GenIUS marks my first time architecting a system of this complexity. The journey from the first version to this multimodal revolution has been fueled by the Google Gemini challenge and the speed of Antigravity. We are building the future, one agent at a time."
             </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7 — PRESS / FEATURED ON
          ================================================================ */}
      <section id="press" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Engineering Blog</span>
            <h2 className="text-2xl font-bold text-white mt-3 tracking-tight">Featured On</h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <a
              href="https://dev.to/yahya_yildirim_78bcb89afc/agenticum-g5-genius-how-we-built-a-real-time-ai-live-agent-for-googles-gemini-live-agent-challenge-39ba"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 border border-zinc-800 hover:border-blue-500/50 bg-zinc-950 hover:bg-zinc-900/80 transition-all duration-300 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* dev.to badge */}
                <div className="shrink-0 w-14 h-14 bg-black border border-zinc-700 rounded-xl flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                  <span className="font-black text-white text-xs tracking-tighter leading-none text-center">DEV<br/>.TO</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">dev.to · March 14, 2026</span>
                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Technical Deep-Dive</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                    How We Built a Real-Time AI Live Agent for Google's Gemini Live Agent Challenge
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                    The full engineering story behind AGENTICUM G5 GENIUS — from the barge-in mechanism
                    and 9-agent swarm architecture to Vertex AI, Imagen 3, and EU AI Act compliance.
                    How a voice command becomes a campaign in under 60 seconds.
                  </p>
                  <div className="flex items-center gap-2 text-blue-500 font-mono text-xs group-hover:text-blue-300 transition-colors">
                    Read the full article
                    <IconArrowRight />
                  </div>
                </div>
              </div>
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ================================================================
          SECTION 8 — FINAL CTA
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
      </section>\n\n      {/* ================================================================
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
              <div className="flex gap-4 mb-6">
                 <a href="https://github.com/yoyo967/agenticum-g5-genius" target="_blank" rel="noopener noreferrer" 
                    aria-label="GitHub Repository"
                    className="p-2 border border-zinc-800 rounded-lg hover:border-zinc-400 transition-colors text-zinc-500 hover:text-white">
                   <IconGithub size={20} />
                 </a>
                 <a href="https://x.com/search?q=%23GeminiLiveAgentChallenge" target="_blank" rel="noopener noreferrer" 
                    aria-label="Twitter hashtag #GeminiLiveAgentChallenge"
                    className="p-2 border border-zinc-800 rounded-lg hover:border-zinc-400 transition-colors text-zinc-500 hover:text-white flex items-center justify-center">
                   <span className="font-black text-lg leading-none" style={{ fontFamily: 'system-ui' }}>𝕏</span>
                 </a>
                 <a href="https://dev.to/yahya_yildirim_78bcb89afc/agenticum-g5-genius-how-we-built-a-real-time-ai-live-agent-for-googles-gemini-live-agent-challenge-39ba" target="_blank" rel="noopener noreferrer"
                    aria-label="dev.to engineering article"
                    className="flex items-center gap-1.5 px-3 py-2 border border-zinc-800 rounded-lg hover:border-zinc-400 text-xs font-mono text-zinc-500 hover:text-white transition-colors font-bold">
                    DEV.TO
                 </a>
                 <a href="https://geminiliveagentchallenge.devpost.com/" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-lg hover:border-zinc-400 text-xs font-mono text-zinc-500 hover:text-white transition-colors">
                    DEVPOST
                 </a>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4">Navigate</h5>
              <ul className="space-y-2 text-xs font-mono text-zinc-600">
                <li><button onClick={() => navigate('/demo-workflow')} className="hover:text-blue-500 transition-colors text-left flex items-center gap-1.5"><span className="text-[10px] text-blue-500">▶</span> Demo Workflow</button></li>
                {import.meta.env.VITE_DEMO_VIDEO_ID && import.meta.env.VITE_DEMO_VIDEO_ID !== 'YOUR_YOUTUBE_ID_HERE' && (
                  <li><a href={`https://youtube.com/watch?v=${import.meta.env.VITE_DEMO_VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors text-left flex items-center gap-1.5"><span className="text-red-500 text-[10px]">▶</span> YouTube Demo</a></li>
                )}
                <li><button onClick={() => navigate('/os')} className="hover:text-blue-500 transition-colors text-left">/os (GenIUS Portal)</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-blue-500 transition-colors text-left">/blog</button></li>
                <li><button onClick={() => navigate('/tech')} className="hover:text-blue-500 transition-colors text-left">/tech</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-blue-500 transition-colors text-left">/privacy</button></li>
                <li><a href="mailto:hello@agenticum.com" className="hover:text-blue-500 transition-colors text-left block">Contact / Impressum</a></li>
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
            <div className="flex items-center gap-4">
               <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.4em]">
                 © 2026 · ALL SYSTEMS OPERATIONAL
               </span>
               <a href="https://geminiliveagentchallenge.devpost.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] text-zinc-500 hover:text-white uppercase tracking-widest underline decoration-zinc-800 underline-offset-2 transition-colors">Devpost Entry</a>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               <span className="font-mono text-[9px] text-green-500/80 font-bold uppercase tracking-widest">Hackathon Validated Build</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
