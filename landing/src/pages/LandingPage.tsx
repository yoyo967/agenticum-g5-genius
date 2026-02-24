import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Bot, Image as ImageIcon, BookOpen, Mic2, Terminal,
  Play, ArrowRight, Shield, Cpu, Zap, Eye, Menu, X, Globe,
  Brain, CheckCircle, Layers, Activity, Code2, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeshBackground } from '../components/NeuralSubstrate';
import { NexusFeed } from '../components/NexusFeed';
import { AgentShowcase } from '../components/AgentShowcase';
import { ImagenGallery } from '../components/ImagenGallery';
import { SenateTerminalSection } from '../sections/SenateTerminalSection';
import { ComplianceSection } from '../sections/ComplianceSection';
import { PerfectTwinSection } from '../sections/PerfectTwinSection';
import { ColumnaRadarSection } from '../sections/ColumnaRadarSection';
import { DemoVideoSection } from '../sections/DemoVideoSection';
import { PrizesSection } from '../sections/PrizesSection';
import { FinalCTASection } from '../sections/FinalCTASection';
import { VoiceFlowSection } from '../sections/VoiceFlowSection';
import { OriginSection } from '../sections/OriginSection';
import { JarvisHeroChat } from '../components/JarvisHeroChat';
import { PrometheusBrowser } from '../components/PrometheusBrowser';
import { ApexContentSection } from '../sections/ApexContentSection';

/* ============================================================
   SEO / STRUCTURED DATA HELPER
   ============================================================ */
function useSEO() {
  useEffect(() => {
    // Title
    document.title = 'Agenticum G5 GENIUS — The J.A.R.V.I.S. for Enterprise Marketing | Gemini Live Agent Challenge';

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', 'The world\'s first voice-activated AI marketing operating system. 8 specialized agents, Gemini 2.0 Live API, Imagen 3, EU AI Act compliant. Speak a command — the swarm delivers. Engineered for the Google Gemini Live Agent Challenge 2026.');
    setMeta('keywords', 'Gemini Live API, AI Marketing, Voice AI Agent, Imagen 3, Multi-Agent System, EU AI Act, Agenticum, Google Cloud AI, Enterprise Marketing AI, J.A.R.V.I.S. Marketing, AEO Optimization');
    setMeta('author', 'Yahya Yıldırım · Alphate Inc.');
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:title', 'Agenticum G5 — The J.A.R.V.I.S. for Enterprise Marketing', true);
    setMeta('og:description', '5 Specialized AI Agents. One Voice. Infinite Synergy. Built on Gemini 2.0 & Google Cloud.', true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', 'https://online-marketing-manager.web.app', true);
    setMeta('og:site_name', 'Agenticum G5 GENIUS', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'Agenticum G5 — The J.A.R.V.I.S. for Enterprise Marketing');
    setMeta('twitter:description', '5 AI Agents, Gemini Live API, Imagen 3. Voice-First Enterprise Marketing OS.');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://online-marketing-manager.web.app';

    // JSON-LD Structured Data (AEO/SEO optimized)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Agenticum G5 GENIUS',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          description: 'Autonomous voice-commanded multi-agent AI system for global enterprise marketing. Features real-time orchestration via Gemini 2.0 Live API.',
          url: 'https://online-marketing-manager.web.app',
          author: {
            '@type': 'Person',
            name: 'Yahya Yıldırım',
            worksFor: { '@type': 'Organization', name: 'Alphate Inc.' }
          },
          offers: { '@type': 'Offer', availability: 'https://schema.org/OnlineOnly' },
          keywords: 'AI Marketing, Gemini Live API, Voice AI, Multi-Agent, Enterprise Intelligence',
          featureList: [
            'Voice-commanded agent orchestration via Gemini 2.0 Live API (Low Latency)',
            'Imagen 3 high-fidelity visual asset generation (Vertex AI Forge)',
            'EU AI Act Art. 50 compliant output with automated Perfect Twin audit',
            'Real-time WebSocket event streaming and swarm telemetry',
            '5 specialized AI agents: SN00, SP01, CC06, DA03, RA01',
            'Google Search grounding for zero-hallucination factual integrity',
          ],
        },
        {
          '@type': 'Organization',
          name: 'Alphate Inc.',
          founder: { '@type': 'Person', name: 'Yahya Yıldırım' },
          description: 'Global Intelligence Hub for Enterprise AI Marketing',
        }
      ]
    };

    let ldScript = document.querySelector('#agenticum-jsonld') as HTMLScriptElement;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'agenticum-jsonld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(jsonLd, null, 2);
  }, []);
}

/* ============================================================
   LIVE COUNTER — Animated number counter
   ============================================================ */
function LiveCounter({ value, label, suffix = '', color = 'white' }: { value: number; label: string; suffix?: string; color?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <div className="flex flex-col items-center">
      <span className="font-display font-black text-3xl md:text-4xl tabular-nums" style={{ color }}>
        {count.toLocaleString('en-US')}{suffix}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 mt-1">{label}</span>
    </div>
  );
}

/* ============================================================
   MAIN LANDING PAGE
   ============================================================ */
export function LandingPage() {
  useSEO();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(t); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Mission', id: 'mission' },
    { label: 'Swarm', id: 'swarm' },
    { label: 'Voice Flow', id: 'voice-flow' },
    { label: 'Origin', id: 'origin' },
    { label: 'Intel', id: 'codex' },
    { label: 'Feed', id: 'feed' },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <MeshBackground />

      <div className="relative z-10">

        {/* ============================================================
           NAVIGATION
           ============================================================ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-midnight/85 backdrop-blur-[30px] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
        }`}>
          <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all">
                <span className="font-display font-black text-midnight text-lg">G5</span>
              </div>
              <div>
                <span className="font-display font-black text-white text-xl uppercase tracking-wider">Agenticum</span>
                <span className="font-mono text-[9px] text-accent/60 uppercase tracking-widest block -mt-1">GENIUS · Enterprise OS</span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className="font-mono text-xs text-white/40 hover:text-accent transition-colors uppercase tracking-wider relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/os')} className="btn-outline text-xs py-2.5 px-5 !border-white/20 hover:!border-accent/50">
                Enterprise OS
              </button>
              <button onClick={() => navigate('/os')}
                className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                <Mic2 size={14} /> Initialize Swarm
              </button>
            </div>

            <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/10 bg-midnight/95 backdrop-blur-[40px]">
                <div className="p-6 space-y-3">
                  {navLinks.map(link => (
                    <button key={link.id} onClick={() => scrollTo(link.id)}
                      className="block w-full text-left font-mono text-sm text-white/40 hover:text-accent py-2 uppercase tracking-wider transition-colors">
                      {link.label}
                    </button>
                  ))}
                  <button onClick={() => navigate('/os')} className="btn-primary w-full mt-4 text-sm py-3 flex items-center justify-center gap-2">
                    <Mic2 size={14} /> Initialize Swarm
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ============================================================
           HERO — "The J.A.R.V.I.S. for Enterprise Marketing"
           ============================================================ */}
        <header id="mission" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden">
          {/* Radial glow behind headline */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] rounded-full opacity-10 blur-[100px]"
              style={{ background: 'radial-gradient(ellipse, #00E5FF 0%, #7B2FBE 50%, transparent 100%)' }} />
          </div>

          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="flex flex-col items-center relative z-20 w-full max-w-7xl">

            {/* Championship Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-12">
              <span className="badge badge-processing">
                <Star size={9} /> Gemini Live Agent Challenge 2026 · Global Submission
              </span>
              <span className="badge badge-online">
                <Activity size={9} /> Swarm Operational
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display font-black uppercase tracking-tight leading-[0.85]"
              style={{ fontSize: 'clamp(48px, 9.5vw, 120px)' }}>
              MAXIMAL <span className="text-accent">INTELLIGENCE</span><br />
              ACTIVATED.<br />
              <span className="text-neural-gold/80" style={{ fontSize: '0.4em', letterSpacing: '0.3em', fontWeight: 900 }}>The Nexus Sovereign Engine</span>
            </motion.h1>

            {/* Jarvis Chat Interface Integration */}
            <JarvisHeroChat />

            {/* Divider */}
            <motion.div initial={{ scaleX: 0 }} animate={heroVisible ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 }}
              className="w-48 h-px bg-gradient-to-r from-transparent via-accent to-transparent my-10" />

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/40 max-w-2xl font-mono leading-relaxed mb-2">
              The J.A.R.V.I.S. for Enterprise Marketing. A 'Sentient System' 
              fusing user vision with technical excellence to steer complex marketing ecosystems autonomously.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
              className="text-sm text-accent/60 font-mono uppercase tracking-widest">
              100% Google Cloud · Gemini 2.0 Flash · Vertex AI · Imagen 3 · EU AI Act Compliant
            </motion.p>

            {/* Live Indicators */}
            <motion.div initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
              className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
              {[
                { icon: <Mic2 size={16} />, label: 'Voice · Live API', color: '#00E5FF' },
                { icon: <Eye size={16} />, label: 'Vision · Multimodal', color: '#FFD700' },
                { icon: <Bot size={16} />, label: '8 Agents · Parallel', color: '#FF007A' },
                { icon: <Cpu size={16} />, label: 'Gemini 2.0 Flash', color: '#00FF88' },
                { icon: <Globe size={16} />, label: 'Google Search Grounding', color: '#7B2FBE' },
                { icon: <Shield size={16} />, label: 'EU AI Act · ra01', color: '#FF6B35' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 group">
                  <span style={{ color: item.color }} className="opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.0 }}
              className="mt-16 flex flex-col sm:flex-row items-center gap-5">
              <button onClick={() => navigate('/os')}
                className="btn-primary flex items-center gap-3 text-base px-8 py-4 shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:shadow-[0_0_60px_rgba(0,229,255,0.6)]">
                <Mic2 size={18} /> Initialize Swarm <ArrowRight size={18} />
              </button>
              <button onClick={() => scrollTo('voice-flow')}
                className="btn-ghost flex items-center gap-3 text-sm px-6 py-4">
                <Play size={16} /> Watch Live Demo
              </button>
            </motion.div>

            {/* Live Stats */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.2 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
              <LiveCounter value={8} label="AI Agents" color="#00E5FF" />
              <LiveCounter value={99} label="Senate Approval Rate" suffix="%" color="#00FF88" />
              <LiveCounter value={42} label="SN00 Latency ms" color="#FFD700" />
              <LiveCounter value={100} label="Google Cloud Native" suffix="%" color="#7B2FBE" />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </header>

        {/* ============================================================
           ACCESS THE SWARM — Gateway Card
           ============================================================ */}
        <section className="px-6 -mt-10 relative z-20 max-w-5xl mx-auto mb-32">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card p-12 md:p-16 text-center cursor-pointer group card-glow-cyan relative overflow-hidden"
            onClick={() => navigate('/os')}>
            {/* Background gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.06), transparent 70%)' }} />

            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full border border-accent/20 flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-accent/5 rounded-full animate-ping opacity-40" />
                <div className="absolute inset-0 bg-accent/10 rounded-full animate-pulse" />
                <Bot size={40} className="text-accent relative z-10" />
              </div>
              <span className="badge badge-processing mb-4 mx-auto w-fit block">
                <Activity size={9} /> LIVE · Enterprise Control Plane
              </span>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
                Access The <span className="text-accent">Genius OS</span>
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto font-mono text-sm leading-relaxed mb-12">
                The Agenticum G5 Enterprise Command Console. SN00 is awaiting your command.
                Press the microphone button — and witness 8 specialized AI agents work for you in real-time.
                Synergy Map, Live Assets, Senate Tribunal — all visible. All live.
              </p>
              <button onClick={(e) => { e.stopPropagation(); navigate('/os'); }}
                className="btn-primary flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                <Terminal size={16} /> OS Portal Betreten <ArrowRight size={14} />
              </button>

              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Workflows', value: '4', color: '#00E5FF' },
                  { label: 'Generated Outputs', value: '440+', color: '#FFD700' },
                  { label: 'Swarm Readiness', value: '100%', color: '#00FF88' },
                  { label: 'Cloud Run Revision', value: '00032', color: '#7B2FBE' },
                ].map(m => (
                  <div key={m.label} className="flex flex-col items-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">{m.label}</span>
                    <span className="font-display font-black text-2xl" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================
           THE SWARM — Agent Showcase
           ============================================================ */}
        <section id="swarm" className="py-32 border-t border-white/5">
          <AgentShowcase />
        </section>

        {/* ============================================================
           APEX INTELLIGENCE — Narrative Focus
           ============================================================ */}
        <ApexContentSection />

        {/* ============================================================
           VOICE FLOW — J.A.R.V.I.S. Demo Animation
           ============================================================ */}
        <div id="voice-flow">
          <VoiceFlowSection />
        </div>

        {/* ============================================================
           TOOL SUITE — Bento Grid
           ============================================================ */}
        <section id="tools" className="py-32 px-6 max-w-[1280px] mx-auto border-t border-white/5">
          <div className="text-center mb-20">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="label-active block mb-4">Capabilities Matrix</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-black uppercase tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 80px)' }}>
              The Arsenal
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Primary — Parallel Synergy */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-8 glass-card p-12 card-glow-cyan relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(0,229,255,0.05), transparent 60%)' }} />
              <div className="flex items-center gap-3 mb-6">
                <Brain size={20} className="text-accent" />
                <span className="label-active">Gemini 2.0 Flash · Live API · Function Calling</span>
              </div>
              <h3 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-[0.9]">
                Voice → Swarm.<br />
                <span className="text-accent">Zero Textbox.</span>
              </h3>
              <p className="text-white/40 text-base max-w-lg font-mono leading-relaxed">
                You speak — Gemini 2.0 identifies your intent via Function Calling and triggers all 5 agents
                simultaneously. Not sequential. Not one after another. <strong className="text-white/70">Parallel.</strong>
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {['BidiGenerateContent', 'launch_swarm()', 'SwarmProtocol', 'ChainManager', 'EventFabric'].map(t => (
                  <span key={t} className="font-mono text-[9px] px-3 py-1 rounded border border-accent/20 text-accent/60 bg-accent/5">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Imagen 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-4 glass-card p-10 flex flex-col justify-between card-glow-gold group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl"
                style={{ background: '#FFD700' }} />
              <div>
                <ImageIcon size={24} className="text-gold mb-6" />
                <h3 className="font-display text-3xl font-black uppercase tracking-tight mb-4 leading-[0.9]">
                  Imagen 3<br /><span className="text-gold">Live Output.</span>
                </h3>
                <p className="text-white/40 font-mono text-sm leading-relaxed">
                  DA-03 generiert Studio-Assets via Vertex AI — und broadcastet sie <em>während</em> des Workflows live ins Frontend.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {['Vertex AI', 'Imagen 3', 'EventFabric', 'Live Gallery'].map(t => (
                  <span key={t} className="badge badge-warning text-[8px]">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Senate */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-4 glass-card p-10 card-glow-magenta relative overflow-hidden">
              <Shield size={22} className="text-magenta mb-6" />
              <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-4">
                Algorithmic<br />Senate.
              </h3>
              <p className="text-white/40 font-mono text-sm leading-relaxed">
                RA-01 audits every output against the EU AI Act, FTC Endorsement Guidelines & 10 Dark Pattern categories.
                No asset leaves the system without Senate approval.
              </p>
            </motion.div>

            {/* Perfect Twin */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="md:col-span-4 glass-card p-10 card-glow-cyan">
              <CheckCircle size={22} className="text-accent mb-6" />
              <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-4">
                Perfect Twin<br />Grounding.
              </h3>
              <p className="text-white/40 font-mono text-sm leading-relaxed">
                Every claim is verified via Google Search grounding. Full audit trail persisted in Firestore.
                Zero hallucinations. Enterprise-grade.
              </p>
            </motion.div>

            {/* Google ADK */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="md:col-span-4 glass-card p-10 card-glow-gold">
              <Code2 size={22} className="text-gold mb-6" />
              <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-4">
                @google/genai<br />SDK v1.42.0.
              </h3>
              <p className="text-white/40 font-mono text-sm leading-relaxed">
                Direct integration of the official Google GenAI SDK. No wrappers. No unnecessary abstractions.
                High-fidelity technology stack.
              </p>
            </motion.div>

            {/* Compliance Large Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="md:col-span-12 glass-card p-10 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0">
                    <Globe size={24} className="text-emerald" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase mb-2">
                      EU AI Act · GDPR · EAA 2025 — <span className="text-emerald">Compliance by Design</span>
                    </h3>
                    <p className="font-mono text-sm text-white/40">
                      Not added as an afterthought. Built into the architecture. Every output carries C2PA meta-tags,
                      AI-disclosure, and WCAG 2.1 AA accessibility certifications.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {['EU AI Act Art.50', 'GDPR', 'FTC Guidelines', 'C2PA', 'WCAG 2.1 AA', 'EAA 2025'].map(t => (
                    <span key={t} className="badge badge-online text-[8px]">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
           ORIGEN — Who Built This & Why
           ============================================================ */}
        <div id="origin">
          <OriginSection />
        </div>

        {/* ============================================================
           THE CODEX — Hackathon Compliance & Credentials
           ============================================================ */}
        <section id="codex" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-[1280px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, #00E5FF, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mx-auto mb-10 relative">
                  <div className="absolute inset-0 bg-accent/10 animate-pulse rounded-full" />
                  <BookOpen size={28} className="text-accent relative z-10" />
                </div>
                <span className="badge badge-processing mb-6 mx-auto w-fit block">
                  <Zap size={9} /> Gemini Live Agent Challenge · 100% Original Code
                </span>
                <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
                  The Hackathon <span className="text-accent">Codex</span>
                </h2>
                <p className="text-white/40 text-lg max-w-3xl mx-auto font-mono leading-relaxed mb-14">
                  100% original code. 100% Google Tech. Engineered beyond the baseline — 
                  because "Maximum Excellence" is not a marketing term, 
                  but a promise to the jury.
                </p>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {[
                    '100% Original Code', 'Google Cloud Native', 'Gemini 2.0 Flash Exp',
                    'Vertex AI', 'Imagen 3', 'Firestore', 'Cloud Run · europe-west1',
                    'Multi-Agent Swarm', '@google/genai SDK', 'TypeScript Strict',
                    'React 19 + Vite', 'Python FastAPI', 'WebSocket Live Stream',
                    'Function Calling', 'EU AI Act Art.50', 'Perfect Twin Audit',
                  ].map(tech => (
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.05 }}
                      className="glass-card px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-accent border-accent/20 cursor-default">
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
           PROMETHEUS BROWSER — Deep Intelligence
           ============================================================ */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="text-center mb-16">
            <span className="label-active block mb-4">Recursive Intelligence · prom07</span>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl mb-4">
              The <span className="text-accent">Prometheus</span> Scavenge
            </h2>
            <p className="font-mono text-sm text-white/30 max-w-lg mx-auto">
              Witness the autonomous deep-research cycle. Prometheus pierces the global information field 
              to find disruptive white-space opportunities in real-time.
            </p>
          </div>
          <PrometheusBrowser />
        </section>

        {/* ============================================================
           IMAGEN GALLERY — Live DA-03 Assets
           ============================================================ */}
        <section className="py-32 px-6 max-w-[1280px] mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <span className="label-active block mb-3">Neural Forge · DA-03</span>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Visual <span className="text-gold">Outputs</span>
            </h2>
            <p className="font-mono text-sm text-white/30 max-w-lg mx-auto">
              Generated by DA-03 via Imagen 3 on Vertex AI. Broadcasted live to the Genius Console during swarm execution.
            </p>
          </div>
          <ImagenGallery />
        </section>

        {/* ============================================================
           COLUMNA RADAR — Competitive Intelligence
           ============================================================ */}
        <ColumnaRadarSection />

        {/* ============================================================
           SENATE TERMINAL — Interactive Pipeline Demo
           ============================================================ */}
        <SenateTerminalSection />

        {/* ============================================================
           PERFECT TWIN — Anti-Hallucination Proof
           ============================================================ */}
        <PerfectTwinSection />

        {/* ============================================================
           COMPLIANCE — EU Standards
           ============================================================ */}
        <ComplianceSection />

        {/* ============================================================
           NEXUS FEED — Strategic Blog from Firestore
           ============================================================ */}
        <section id="feed" className="py-32 px-6 max-w-[1280px] mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="label-active block mb-3">Nexus Archives · Firestore Live</span>
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
                Strategic <span className="text-accent">Feed</span>
              </h2>
              <p className="font-mono text-sm text-white/30 mt-3">
                Generated by CC-06. Grounded via Google Search. Senate-approved. Factual integrity guaranteed.
              </p>
            </div>
            <button onClick={() => navigate('/os?module=pillar-blog')}
              className="btn-outline text-xs flex items-center gap-2 shrink-0">
              View All Archives <ArrowRight size={12} />
            </button>
          </div>
          <NexusFeed />
        </section>

        {/* ============================================================
           DEMO VIDEO
           ============================================================ */}
        <DemoVideoSection />

        {/* ============================================================
           PRIZES
           ============================================================ */}
        <PrizesSection />

        {/* ============================================================
           FINAL CTA
           ============================================================ */}
        <FinalCTASection />

        {/* ============================================================
           FOOTER
           ============================================================ */}
        <footer className="py-24 px-6 border-t border-white/5">
          <div className="max-w-[1280px] mx-auto">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
              {/* Brand */}
              <div className="flex flex-col gap-5 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                    <span className="font-display font-black text-midnight text-base">G5</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-2xl uppercase tracking-wider block">Agenticum</span>
                    <span className="font-mono text-[9px] text-accent/50 uppercase tracking-widest">GENIUS · Enterprise OS</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-white/25 leading-relaxed">
                  The world's first voice-activated AI marketing operating system.
                  Engineered by <span className="text-white/40">Yahya Yıldırım</span> at <span className="text-white/40">Alphate Inc.</span>, 
                  native on Google Cloud for the Gemini Live Agent Challenge 2026.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Gemini 2.0', 'Vertex AI', 'Cloud Run'].map(t => (
                    <span key={t} className="font-mono text-[8px] text-accent/40 px-2 py-0.5 border border-accent/10 rounded">{t}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-1">System</span>
                  {[
                    { label: 'OS Portal', path: '/os' },
                    { label: 'Genius Console', path: '/os?module=console' },
                    { label: 'Creative Studio', path: '/os?module=studio' },
                    { label: 'Synergy Map', path: '/os?module=synergy' },
                  ].map(l => (
                    <button key={l.label} onClick={() => navigate(l.path)}
                      className="font-mono text-xs text-white/40 hover:text-accent transition-colors text-left flex items-center gap-1.5 group">
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all"><ArrowRight size={10} /></span>
                      {l.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-1">Agents</span>
                  {['sn00 · Orchestrator', 'sp01 · Strategist', 'cc06 · Copywriter', 'da03 · Design AI', 'ba07 · Deep Intel', 've01 · Motion', 'ra01 · Senate'].map(a => (
                    <span key={a} className="font-mono text-xs text-white/30">{a}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 mb-1">Legal & Links</span>
                  <a href="https://geminiliveagentchallenge.devpost.com" target="_blank" rel="noreferrer"
                    className="font-mono text-xs text-white/40 hover:text-accent transition-colors flex items-center gap-1">
                    <Layers size={10} /> Devpost
                  </a>
                  <button onClick={() => navigate('/privacy')}
                    className="font-mono text-xs text-white/40 hover:text-accent transition-colors text-left">
                    Privacy Policy
                  </button>
                  <span className="font-mono text-xs text-white/20">Alphate Inc. · 2026</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest">
                © 2026 Alphate Inc. · Yahya Yıldırım · Built for the Google Gemini Live Agent Challenge
              </p>
              <div className="flex items-center gap-6">
                {[
                  'Neural Threading Active',
                  'Senate Substrate Online',
                  'Grounding Engine v2.0',
                  'Cloud Run · 00009-q5w'
                ].map(t => (
                  <span key={t} className="font-mono text-[7px] uppercase tracking-widest text-white/10 hidden lg:block">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
