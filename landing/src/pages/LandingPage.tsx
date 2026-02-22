import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Bot, Image as ImageIcon, Sparkles, BookOpen, Mic2, Terminal, Play, ArrowRight, Shield, Cpu, Zap, Eye, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MeshBackground } from '../components/NeuralSubstrate';
import { NexusFeed } from '../components/NexusFeed';
import { AgentShowcase } from '../components/AgentShowcase';
import { ImagenGallery } from '../components/ImagenGallery';
import { CTASection } from '../components/CTASection';

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Mission', id: 'mission' },
    { label: 'The Swarm', id: 'swarm' },
    { label: 'Tools', id: 'tools' },
    { label: 'The Codex', id: 'codex' },
    { label: 'Feed', id: 'feed' },
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <MeshBackground />

      <div className="relative z-10">
        {/* ============================================================
           NAVIGATION — Scroll-aware glassmorphism (biohack.berlin ref)
           ============================================================ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-midnight/80 backdrop-blur-[30px] border-b border-white/10'
            : 'bg-transparent'
        }`}>
          <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="font-display font-bold text-midnight text-lg">G5</span>
              </div>
              <span className="font-display font-bold text-white text-xl uppercase tracking-wider">Agenticum</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollTo(link.id)}
                  className="font-mono text-sm text-white/50 hover:text-white transition-colors uppercase tracking-wider">
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/os')}
                className="btn-outline text-xs py-2.5 px-6 !border-white/30">
                Enterprise OS
              </button>
              <button onClick={() => navigate('/os?module=campaign')}
                className="btn-primary text-sm py-2.5 px-6">
                Initialize Swarm
              </button>
            </div>

            {/* Mobile */}
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/10 bg-midnight/90 backdrop-blur-[40px]">
                <div className="p-6 space-y-3">
                  {navLinks.map(link => (
                    <button key={link.id} onClick={() => scrollTo(link.id)}
                      className="block w-full text-left font-mono text-sm text-white/50 py-2 uppercase tracking-wider">
                      {link.label}
                    </button>
                  ))}
                  <button onClick={() => navigate('/os')} className="btn-primary w-full mt-4 text-sm py-3">Enterprise OS</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ============================================================
           HERO SECTION — Full viewport, agent greetings, massive Oswald
           ============================================================ */}
        <header id="mission" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
          <motion.div style={{ opacity: heroOpacity }} className="flex flex-col items-center">
            {/* Status Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="badge badge-processing mb-10">
              <Sparkles size={10} /> Championship Grade // Gemini Live Challenge
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="font-display font-bold uppercase tracking-tight leading-[0.85]"
              style={{ fontSize: 'clamp(56px, 10vw, 160px)' }}>
              The Neural <br/><span className="text-accent">Creative Agency.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-8 text-lg md:text-xl text-white/40 max-w-2xl font-mono leading-relaxed">
              Five specialized AI agents. One voice command. Infinite parallel synergy.<br/>
              Built 100% on Google Cloud with Gemini 2.0.
            </motion.p>

            {/* Tech Indicators */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8">
              {[
                { icon: <Mic2 size={18} />, label: 'Voice Enabled', color: 'var(--color-accent)' },
                { icon: <Eye size={18} />, label: 'Vision Ready', color: 'var(--color-gold)' },
                { icon: <Bot size={18} />, label: '5 Agents Active', color: 'var(--color-magenta)' },
                { icon: <Cpu size={18} />, label: 'Gemini 2.0 Flash', color: 'var(--color-emerald)' },
                { icon: <Terminal size={18} />, label: 'Google ADK', color: 'var(--color-agent-sp01)' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="mt-16 flex items-center gap-6">
              <button onClick={() => navigate('/os?module=campaign')}
                className="btn-primary flex items-center gap-3">
                <Sparkles size={16} /> Initialize Swarm <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/os')}
                className="btn-ghost flex items-center gap-3">
                <Play size={16} /> Enter OS Portal
              </button>
            </motion.div>
          </motion.div>
        </header>

        {/* ============================================================
           ACCESS THE SWARM — Glass card gateway to OS Portal
           ============================================================ */}
        <section className="px-6 -mt-20 relative z-20 max-w-5xl mx-auto mb-40">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card p-12 md:p-16 text-center cursor-pointer group card-glow-cyan"
            onClick={() => navigate('/os')}>
            <div className="w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-accent/10 rounded-full animate-ping opacity-30" />
              <Bot size={36} className="text-accent relative z-10" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Access The Swarm</h2>
            <p className="text-white/40 max-w-2xl mx-auto font-mono text-sm leading-relaxed mb-10">
              Step into the Agenticum G5 Enterprise OS. Monitor 5 AI agents in real-time as SN-00 orchestrates strategy,
              CC-06 drafts copy, DA-03 forges visuals via Imagen 3, SP-01 runs competitive intel, and RA-01 audits every output.
            </p>
            <button onClick={(e) => { e.stopPropagation(); navigate('/os'); }}
              className="btn-primary flex items-center gap-3 mx-auto relative z-20">
              Initialize OS Portal <Terminal size={14} />
            </button>
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Workflows', value: '4' },
                { label: 'Total Outputs', value: '440' },
                { label: 'Swarm Ready', value: '100%', color: 'var(--color-emerald)' },
                { label: 'ADK Latency', value: '42ms' },
              ].map(m => (
                <div key={m.label} className="flex flex-col items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">{m.label}</span>
                  <span className="font-mono text-xl font-bold" style={{ color: m.color || 'white' }}>{m.value}</span>
                </div>
              ))}
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
           TOOL SUITE — Bento Grid (biohack.berlin card layout)
           ============================================================ */}
        <section id="tools" className="py-32 px-6 max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <span className="label-active block mb-4">Capabilities</span>
            <h2 className="font-display font-bold uppercase tracking-tight" style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}>
              The Tool Suite
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Feature */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-8 glass-card p-12 card-glow-cyan">
              <div className="flex items-center gap-3 mb-6">
                <Bot size={20} className="text-accent" />
                <span className="label-active">G2.0 Substrate Engine</span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6 leading-[0.95]">
                Parallel <br/>Synergy.
              </h3>
              <p className="text-white/40 text-lg max-w-xl font-mono leading-relaxed">
                Not a chatbot. A living agency where agents work in async parallel, debating strategy before you even blink.
              </p>
            </motion.div>

            {/* Imagen 3 */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-4 glass-card p-10 flex flex-col justify-between card-glow-gold">
              <div>
                <ImageIcon size={20} className="text-gold mb-6" />
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight mb-4">Imagen 3<br/>Matrix.</h3>
                <p className="text-white/40 font-mono text-sm">Studio-grade assets generated and verified in spatial harmony.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {['Vertex AI', 'Imagen 3', 'Cloud Storage'].map(t => (
                  <span key={t} className="badge badge-warning">{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-4 glass-card p-10 card-glow-magenta">
              <Shield size={20} className="text-magenta mb-6" />
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-4">Security Senate</h3>
              <p className="text-white/40 font-mono text-sm">RA-01 audits every output. Nothing goes live without senate approval.</p>
            </motion.div>

            {/* Voice */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="md:col-span-4 glass-card p-10 card-glow-cyan">
              <Mic2 size={20} className="text-accent mb-6" />
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-4">Voice + Vision</h3>
              <p className="text-white/40 font-mono text-sm">Speak your brief. Show your references. The swarm interprets and executes.</p>
            </motion.div>

            {/* ADK */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="md:col-span-4 glass-card p-10 card-glow-gold">
              <Zap size={20} className="text-gold mb-6" />
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight mb-4">Google ADK</h3>
              <p className="text-white/40 font-mono text-sm">Native Agent Development Kit integration. No wrappers, no abstractions.</p>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
           THE CODEX — Hackathon Compliance & Tech Stack
           ============================================================ */}
        <section id="codex" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-card p-12 md:p-20 text-center">
              <div className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mx-auto mb-10 relative">
                <div className="absolute inset-0 bg-accent/10 animate-glow-pulse rounded-full" />
                <BookOpen size={28} className="text-accent relative z-10" />
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">The Hackathon Codex</h2>
              <p className="text-white/40 text-lg max-w-3xl mx-auto font-mono leading-relaxed mb-12">
                Our commitment to the Gemini Live Agent Challenge: 100% Original Code. 100% Google Tech. 1000% Effort.
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {[
                  '100% Original Code', 'Google Cloud Native', 'Gemini 2.0 Flash',
                  'Vertex AI', 'Imagen 3', 'Firestore API', 'Cloud Run / Node.js',
                  'Multi-Agent Swarm', 'TypeScript Strict', 'React 18 / Vite', 'Tailwind CSS v4'
                ].map(tech => (
                  <span key={tech} className="glass-card px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent border-accent/20">{tech}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
           IMAGEN GALLERY — DA-03 Generated Assets
           ============================================================ */}
        <section className="py-32 px-6 max-w-[1200px] mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <span className="label-active block mb-3">Neural Forge</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Visual Outputs</h2>
            <p className="font-mono text-sm text-white/30 max-w-lg mx-auto">Assets generated by DA-03 via Imagen 3 on Vertex AI</p>
          </div>
          <ImagenGallery />
        </section>


        {/* ============================================================
           NEXUS FEED — Blog / Article Feed from Firestore
           ============================================================ */}
        <section id="feed" className="py-32 px-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="label-active block mb-3">Archives</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">Strategic Feed</h2>
            </div>
            <button onClick={() => navigate('/os?module=pillar-blog')}
              className="btn-outline text-xs flex items-center gap-2">
              View All Archives <ArrowRight size={12} />
            </button>
          </div>
          <NexusFeed />
        </section>

        {/* ============================================================
           CTA — Final Conversion Block
           ============================================================ */}
        <CTASection />

        {/* ============================================================
           FOOTER
           ============================================================ */}
        <footer className="py-24 px-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Brand */}
            <div className="flex flex-col gap-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <span className="font-display font-bold text-midnight text-sm">G5</span>
                </div>
                <span className="font-display font-bold text-2xl uppercase tracking-wider">Agenticum</span>
              </div>
              <p className="font-mono text-sm text-white/30 leading-relaxed">
                The world's first voice-activated AI creative agency. Built natively on Google Cloud for the Gemini Live Agent Challenge 2026.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="flex flex-col gap-3">
                <span className="label mb-2">System</span>
                <button onClick={() => navigate('/os')} className="font-mono text-sm text-white/50 hover:text-accent transition-colors text-left">OS Portal</button>
                <button onClick={() => navigate('/os?module=console')} className="font-mono text-sm text-white/50 hover:text-accent transition-colors text-left">Genius Console</button>
                <button onClick={() => navigate('/os?module=studio')} className="font-mono text-sm text-white/50 hover:text-accent transition-colors text-left">Creative Studio</button>
              </div>
              <div className="flex flex-col gap-3">
                <span className="label mb-2">Legal</span>
                <a href="https://geminiliveagentchallenge.devpost.com" target="_blank" rel="noreferrer" className="font-mono text-sm text-white/50 hover:text-accent transition-colors">Devpost</a>
                <button onClick={() => navigate('/privacy')} className="font-mono text-sm text-white/50 hover:text-accent transition-colors text-left">Privacy Policy</button>
              </div>
              <div className="flex flex-col gap-3">
                <span className="label mb-2">Origin</span>
                <span className="font-mono text-xs text-white/20 uppercase tracking-widest">Alphate Inc // 2026</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
