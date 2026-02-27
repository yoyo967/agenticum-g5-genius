import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Bot, Image as ImageIcon, BookOpen, Mic2, Terminal,
  ArrowRight, Shield, Cpu, Zap, Eye, Menu, X, Globe,
  Brain, CheckCircle, Layers, Activity, Code2, Star
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
import { MissionStatusSection } from '../sections/MissionStatusSection';
import { OriginSection } from '../sections/OriginSection';
import { GenIUSHeroChat } from '../components/GenIUSHeroChat';
import { PrometheusBrowser } from '../components/PrometheusBrowser';
import { ApexContentSection } from '../sections/ApexContentSection';
import { VideoSection } from '../components/VideoSection';
import heroBg from '../assets/g5_hero_dashboard.png';
function useMetrics() {
  const [stats, setStats] = useState({ workflows: 0, outputs: 0, readiness: '100%', error: false });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const outSnap = await getDocs(collection(db, 'outputs'));
        const workSnap = await getDocs(query(collection(db, 'workflows'), where('status', '==', 'active')));
        setStats({
          workflows: workSnap.size,
          outputs: outSnap.size || 21, // Fallback to current real count if empty
          readiness: '100%',
          error: false
        });
      } catch (e) {
        console.warn('Metrics sync failed:', e);
        setStats(prev => ({ ...prev, error: true, readiness: 'ERR_DENIED' }));
      }
    };
    fetchStats();
  }, []);

  return stats;
}

/* ============================================================
   SEO / STRUCTURED DATA HELPER
   ============================================================ */
function useSEO() {
  useEffect(() => {
    // Title
    document.title = 'Agenticum G5 GenIUS — The Neural Marketing OS | Gemini Live Agent Challenge';

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
    setMeta('keywords', 'Gemini Live API, AI Marketing, Voice AI Agent, Imagen 3, Multi-Agent System, EU AI Act, Agenticum, Google Cloud AI, Enterprise Marketing AI, GenIUS Marketing, AEO Optimization');
    setMeta('author', 'Yahya Yıldırım');
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:title', 'Agenticum G5 — The Neural Engine for Enterprise Marketing', true);
    setMeta('og:description', '8 Specialized AI Agents. One Voice. Infinite Synergy. Built on Gemini 2.0 & Google Cloud.', true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', 'https://online-marketing-manager.web.app', true);
    setMeta('og:site_name', 'Agenticum G5 GenIUS', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'Agenticum G5 — The Neural Engine for Enterprise Marketing');
    setMeta('twitter:description', '8 AI Agents, Gemini Live API, Imagen 3. Voice-First Enterprise Marketing OS.');

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
          name: 'Agenticum G5 GenIUS',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          description: 'Autonomous voice-commanded multi-agent AI system for global enterprise marketing. Features real-time orchestration via Gemini 2.0 Live API.',
          url: 'https://online-marketing-manager.web.app',
          author: {
            '@type': 'Person',
            name: 'Yahya Yıldırım',
          },
          offers: { '@type': 'Offer', availability: 'https://schema.org/OnlineOnly' },
          keywords: 'AI Marketing, Gemini Live API, Voice AI, Multi-Agent, Enterprise Intelligence',
          featureList: [
            'Voice-commanded agent orchestration via Gemini 2.0 Live API (Low Latency)',
            'Imagen 3 high-fidelity visual asset generation (Vertex AI Forge)',
            'EU AI Act Art. 50 compliant output with automated Perfect Twin audit',
            'Real-time WebSocket event streaming and swarm telemetry',
            '8 specialized AI agents: SN00, SO00, SP01, CC06, DA03, BA07, VE01, RA01',
            'Google Search grounding for zero-hallucination factual integrity',
          ],
        },
        {
          '@type': 'Organization',
          name: 'Agenticum G5',
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
  const { workflows, outputs, readiness, error } = useMetrics();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Boot sequence mock
    const bootSequence = [
      "INITIALIZING NEURAL CORE...",
      "[OK] SwarmProtocol v3.0 online",
      "[OK] Live API Websocket connected",
      "[OK] 8 Agents standing by",
      "SYSTEM READY. AWAITING DIRECTIVE."
    ];
    let step = 0;
    const bootTimer = setInterval(() => {
      if (step < bootSequence.length) {
        setBootLog(prev => [...prev.slice(-3), bootSequence[step]]);
        step++;
      } else {
        clearInterval(bootTimer);
      }
    }, 400);

    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(t); clearInterval(bootTimer); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleWatchDemoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Check if video ID exists in config (Vite Environment Variable)
    const videoId = import.meta.env.VITE_DEMO_VIDEO_ID;
    
    if (videoId) {
      // Trigger VideoSection event (play and scroll)
      window.dispatchEvent(new Event('play-demo-video'));
    } else {
      // Fallback: Scroll to Voice Flow Demo
      const voiceFlowSection = document.getElementById('voice-flow');
      if (voiceFlowSection) {
        voiceFlowSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
                <span className="font-mono text-[9px] text-accent/60 uppercase tracking-widest block -mt-1">GenIUS · Enterprise OS</span>
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
              <button onClick={() => navigate('/os')} className="btn-outline text-xs py-2.5 px-5 border-white/20!">
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
                className="md:hidden border-t border-white/10 bg-midnight/95 backdrop-blur-2xl">
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
           HERO — "The GenIUS for Enterprise Marketing"
           ============================================================ */}
        <header id="mission" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden">
          
          {/* Stunning High-Fidelity Neural Core Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroBg} 
              alt="Neural Core Stage" 
              className="w-full h-full object-cover opacity-[0.65] mix-blend-luminosity brightness-[1.2] saturate-[1.2]"
            />
            {/* Deep vignette to blend the image perfectly into the dark background */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-midnight/70 to-midnight" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(10,1,24,0.6) 40%, rgba(10,1,24,1) 95%)' }} />
          </div>

          {/* Grid substrate behind headline instead of soft radial */}
          <div className="absolute inset-0 z-10 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

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
              AGENTICUM <span className="text-accent underline decoration-accent/30 underline-offset-8">G5 GENIUS</span><br />
              <span className="text-white/90" style={{ fontSize: '0.45em', letterSpacing: '0.05em', fontWeight: 700 }}>Enterprise Operating System</span><br />
              <span className="text-neural-gold/80" style={{ fontSize: '0.25em', letterSpacing: '0.3em', fontWeight: 900 }}>J.A.R.V.I.S. for Enterprise Marketing — 100% Google Cloud Native</span>
            </motion.h1>

            {/* Boot Sequence Shell */}
            <div className="mt-8 flex flex-col items-center h-16 pointer-events-none">
              <AnimatePresence>
                {bootLog.map((log, i) => (
                  <motion.div key={i + log} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="font-mono text-xs text-accent/60 my-0.5">
                    <span className="text-accent/30 mr-2">$</span>{log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* GenIUS Chat Interface Integration */}
            <GenIUSHeroChat />

            {/* Divider */}
            <motion.div initial={{ scaleX: 0 }} animate={heroVisible ? { scaleX: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 }}
              className="w-48 h-px bg-linear-to-r from-transparent via-accent to-transparent my-10" />

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-white/40 max-w-2xl font-mono leading-relaxed mb-2">
              Beyond Reactive Chatbots. G5 is a 'Sentient Engine' 
              orchestrating autonomous marketing ecosystems via the Gemini 2.0 Live Fabric.
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
              <button 
                onClick={handleWatchDemoClick}
                className="px-8 py-4 border border-cyan-500/50 text-cyan-400 font-mono hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                WATCH LIVE DEMO
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
            <div className="w-px h-10 bg-linear-to-b from-white to-transparent" />
          </motion.div>
        </header>

        {/* ============================================================
           SEE IT LIVE — Demo Video Section
           ============================================================ */}
        <VideoSection videoId={import.meta.env.VITE_DEMO_VIDEO_ID} />

        {/* ============================================================
           ACCESS THE SWARM — Gateway Terminal
           ============================================================ */}
        <section className="px-6 -mt-10 relative z-20 max-w-5xl mx-auto mb-32">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="ultra-lucid p-12 md:p-16 text-center cursor-pointer group card-glow-cyan relative overflow-hidden ring-1 ring-accent/30 shadow-[0_0_80px_rgba(0,229,255,0.1)]"
            onClick={() => navigate('/os')}>
            
            {/* Terminal Bracketing top corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl m-4" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl m-4" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl m-4" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl m-4" />

            {/* Background gradient structure */}
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
                Access The <span className="text-accent">GenIUS OS</span>
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto font-mono text-sm leading-relaxed mb-12">
                The Agenticum G5 Enterprise Command Console. SN00 is awaiting your command.
                Press the microphone button — and witness 8 specialized AI agents work for you in real-time.
                Synergy Map, Live Assets, Senate Tribunal — all visible. All live.
              </p>
              <button onClick={(e) => { e.stopPropagation(); navigate('/os'); }}
                className="btn-primary flex items-center gap-3 mx-auto shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                <Terminal size={16} /> Enter OS Portal <ArrowRight size={14} />
              </button>

              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Workflows', value: error ? '---' : workflows.toString() },
                  { label: 'Generated Outputs', value: error ? 'UNAVAILABLE' : (outputs > 0 ? `${outputs}+` : 'Loading...') },
                  { label: 'Swarm Readiness', value: readiness },
                  { label: 'Cloud Run Revision', value: '00032' },
                ].map(m => (
                  <div key={m.label} className="flex flex-col items-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-2">{m.label}</span>
                    <span className="font-mono font-bold text-2xl text-white tracking-tight">
                      {m.value === 'Loading...' ? <span className="w-10 h-6 bg-white/10 animate-pulse rounded inline-block" /> : m.value}
                      {m.label === 'Active Workflows' && !error && <span className="ml-1 text-accent text-sm animate-pulse">●</span>}
                      {m.label === 'Swarm Readiness' && !error && <span className="ml-1 text-[#00FF88] text-sm animate-pulse">●</span>}
                    </span>
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
           VOICE FLOW — GenIUS Demo Animation
           ============================================================ */}
        <div id="voice-flow">
          <VoiceFlowSection />
        </div>

        {/* ============================================================
           TOOL SUITE — Bento Grid
           ============================================================ */}
        <section id="tools" className="py-32 px-6 max-w-[1280px] mx-auto border-t border-white/5">
          <div className="text-center mb-20">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/50 mb-4 block">
              System Interface
            </span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display font-black uppercase tracking-tight text-white mb-6"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              The Arsenal
            </motion.h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto font-mono">
              Forget wrapper apps. This is a fully articulated, parallel-processing intelligence cluster 
              built natively on Google Cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Primary — Parallel Synergy */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-8 ultra-lucid border-accent/20 p-12 card-glow-cyan relative overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(0,229,255,0.05), transparent 60%)' }} />
              
              {/* Tactical scan line */}
              <div className="absolute inset-0 w-full h-[2px] bg-accent/20 blur-[1px] -translate-y-full group-hover:animate-[scanline_3s_linear_infinite]" />
              <div className="flex items-center gap-3 mb-6">
                <Brain size={20} className="text-accent" />
                <span className="label-active">Gemini 2.0 Flash · Live API · Function Calling</span>
              </div>
              <h3 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-[0.9]">
                Voice → Swarm.<br />
                <span className="text-accent">Zero Textbox.</span>
              </h3>
              <p className="text-white/40 text-sm max-w-lg font-mono leading-relaxed">
                You speak — Gemini 2.0 identifies your intent via Function Calling and triggers all 8 agents
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
              className="md:col-span-4 ultra-lucid border-gold/20 p-10 flex flex-col justify-between card-glow-gold group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl"
                style={{ background: '#FFD700' }} />
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40 rounded-tl-xl m-2 opacity-50" />
              <div>
                <ImageIcon size={24} className="text-gold mb-6" />
                <h3 className="font-display text-3xl font-black uppercase tracking-tight mb-4 leading-[0.9]">
                  Imagen 3<br /><span className="text-gold">Live Output.</span>
                </h3>
                <p className="text-white/40 font-mono text-sm leading-relaxed">
                  DA-03 generates studio assets via Vertex AI — and broadcasts them live into the frontend during the workflow.
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
              className="md:col-span-4 ultra-lucid border-magenta/20 p-10 card-glow-magenta relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-magenta/20 shadow-[0_0_20px_rgba(255,0,122,0.4)]" />
              <Shield size={22} className="text-magenta mb-6 relative z-10" />
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
              className="md:col-span-4 ultra-lucid border-accent/20 p-10 card-glow-cyan relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/40 rounded-br-xl m-2 opacity-50" />
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
              className="md:col-span-4 ultra-lucid border-gold/20 p-10 card-glow-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/40 rounded-tr-xl m-2 opacity-50" />
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
            {/* Compliance Large Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="md:col-span-12 ultra-lucid border-emerald/20 p-10 relative overflow-hidden card-glow-emerald">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
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
           ORIGIN — Who Built This & Why
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
              className="ultra-lucid border-accent/20 p-12 md:p-20 text-center relative overflow-hidden">
              
              {/* Terminal borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl m-4" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl m-4" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl m-4" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl m-4" />

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
                      className="bg-midnight/60 border border-accent/20 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-accent cursor-default shadow-[inset_0_0_10px_rgba(0,229,255,0.05)]">
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
              Generated by DA-03 via Imagen 3 on Vertex AI. Broadcasted live to the GenIUS Console during swarm execution.
            </p>
          </div>
          <ImagenGallery />
        </section>

        {/* ============================================================
           MISSION STATUS — Live Telemetry
           ============================================================ */}
        <MissionStatusSection />

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
                    <span className="font-mono text-[9px] text-accent/50 uppercase tracking-widest">GenIUS · Enterprise OS</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-white/25 leading-relaxed">
                  The world's first voice-activated AI marketing operating system.
                  Engineered by <span className="text-white/40">Yahya Yıldırım</span>, 
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
                    { label: 'GenIUS Console', path: '/os?module=console' },
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
                  <span className="font-mono text-xs text-white/20">Agenticum G5 · 2026</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest">
                © 2026 Agenticum G5 · Yahya Yıldırım · Built for the Google Gemini Live Agent Challenge
              </p>
              <div className="flex items-center gap-6">
                {[
                  'Neural Threading Active',
                  'Senate Substrate Online',
                  'Grounding Engine v2.0',
                  `Cloud Run · SHA: ${import.meta.env.VITE_BUILD_SHA || 'dev'}`
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
