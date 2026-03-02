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
    name: 'VOICE INTERFACE',
    description: 'Gemini Live API bidirectional audio streaming',
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
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
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
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => navigate('/demo')}
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
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-zinc-800 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                Gemini Live Agent Challenge 2026
              </span>
            </div>
          </FadeIn>

          {/* H1 */}
          <FadeIn delay={0.1}>
            <h1
              className="font-bold tracking-tight text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(42px, 7vw, 96px)' }}
            >
              The Neural<br />Marketing OS.
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2}>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              8 AI agents. One voice command.<br />
              From brief to campaign in under 60 seconds.
            </p>
          </FadeIn>

          {/* Buttons */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <button
                onClick={() => navigate('/os')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest transition-colors"
              >
                Initialize Swarm <IconArrowRight />
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-white font-mono text-sm uppercase tracking-widest transition-colors"
              >
                Watch Demo <IconArrowRight />
              </button>
            </div>
          </FadeIn>

          {/* Stats — STATIC, no counter, no animation */}
          <FadeIn delay={0.4}>
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
              Eight purpose-built AI agents.
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

          {/* Steps — horizontal on desktop */}
          <div className="grid sm:grid-cols-5 gap-px bg-zinc-800">
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
            <div className="flex flex-wrap gap-3 justify-center">
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-2 border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-400 uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
                >
                  {badge}
                </span>
              ))}
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
            Eight specialized agents.<br />
            One voice command.<br />
            Zero friction.
          </h2>

          <p className="text-zinc-400 mb-12 font-mono text-sm">
            Phase 1 of 5 — 9 of 52 nodes active.
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
      <footer className="py-10 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
            AGENTICUM G5 GENIUS
          </span>
          <span className="font-mono text-xs text-zinc-700">
            © 2026 · Gemini Live Agent Challenge
          </span>
          <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
            G5-REVISION-00036
          </span>
        </div>
      </footer>

    </div>
  );
}
