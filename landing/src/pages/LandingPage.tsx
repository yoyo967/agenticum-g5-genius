import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Bot, Image as ImageIcon, Sparkles, BookOpen, Mic2, Terminal, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AssetGallery } from '../components/AssetGallery';
import { NeuralSubstrate } from '../components/NeuralSubstrate';
import { LivingAgents } from '../components/LivingAgents';
import { ProjectNexus } from '../components/ProjectNexus';
import { NexusFeed } from '../components/NexusFeed';
import { AgentShowcase } from '../components/AgentShowcase';

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0.1]);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-neural-blue/30 selection:text-neural-blue font-body overflow-x-hidden">
      {/* 3D Neural Substrate Background */}
      <NeuralSubstrate />

      {/* Living Agents - Proactive Engagement */}
      <LivingAgents />

      <div className="relative z-10 spatial-depth">
        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'bg-black/60 backdrop-blur-[20px] border-b border-white/10' : 'bg-transparent border-transparent'
          }`}
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded bg-neural-blue shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center font-bold text-obsidian text-xs"
            >
              G5
            </motion.div>
            <span className="font-display font-black tracking-tight text-xl uppercase italic">Agenticum</span>
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            <a href="#vision" onClick={(e) => scrollToSection(e, 'vision')} className="hover:text-neural-blue transition-colors">Mission</a>
            <a href="#nexus" onClick={(e) => scrollToSection(e, 'nexus')} className="hover:text-neural-blue transition-colors">The Nexus</a>
            <a href="#synergy" onClick={(e) => scrollToSection(e, 'synergy')} className="hover:text-neural-blue transition-colors">Synergy</a>
            <a href="#assets" onClick={(e) => scrollToSection(e, 'assets')} className="hover:text-neural-blue transition-colors">Visuals</a>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/os')} className="text-[10px] font-black uppercase tracking-widest text-neural-blue hover:text-white transition-colors">
              Enterprise OS
            </button>
            <button onClick={() => navigate('/os?module=campaign')} className="bg-neural-blue text-obsidian px-6 py-2 rounded-lg text-[10px] font-black hover:bg-white transition-all active:scale-95 uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Initialize Swarm
            </button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <header className="relative pt-64 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            style={{ opacity: opacityRange }}
            className="flex flex-col items-center mb-24"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-neural-blue/10 border border-neural-blue/20 text-neural-blue text-[10px] font-black mb-10 uppercase tracking-[0.4em]"
            >
              <Sparkles size={10} className="animate-pulse" />
              Championship Grade // Gemini Live Challenge
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl md:text-[13rem] font-display font-black tracking-tighter mb-10 max-w-none leading-[0.7] uppercase italic"
            >
              Ultimate <br/><span className="text-neural-blue">Continuous.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-2xl text-white/30 max-w-3xl font-light leading-relaxed italic"
            >
              The world's first voice-activated, vision-enabled AI creative agency. <br/>
              Five specialized agents. One voice command. Infinite parallel synergy. <br/>
              Built 100% on Google Cloud.
            </motion.p>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-8"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Mic2 size={24} className="text-neural-blue opacity-80" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Voice Enabled</span>
              </motion.div>
              <div className="hidden md:block w-8 h-px bg-white/10" />
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <ImageIcon size={24} className="text-neural-gold opacity-80" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Vision Ready</span>
              </motion.div>
              <div className="hidden md:block w-8 h-px bg-white/10" />
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Bot size={24} className="text-pink-500 opacity-80" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">5 Agents Active</span>
              </motion.div>
              <div className="hidden md:block w-8 h-px bg-white/10" />
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Sparkles size={24} className="text-white opacity-80 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Gemini 2.0 Flash</span>
              </motion.div>
              <div className="hidden md:block w-8 h-px bg-white/10" />
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <Terminal size={24} className="text-green-500 opacity-80" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Google ADK Native</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex items-center justify-center gap-6"
            >
               <button onClick={() => navigate('/os?module=campaign')} className="bg-neural-blue text-obsidian px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(0,229,255,0.4)] flex items-center gap-2">
                 <Sparkles size={14} /> Initialize Swarm →
               </button>
               <button onClick={() => setIsDemoModalOpen(true)} className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors flex items-center gap-2">
                 ▶ Watch Demo
               </button>
            </motion.div>
          </motion.div>

          {/* Floating UI Module: Orchestration Gateway */}
          <motion.div 
            id="vision"
            style={{ y: yRange }}
            className="w-full max-w-4xl floating-module glass p-1 rounded-xl shadow-[0_100px_200px_rgba(0,0,0,0.9)] border-white/5 relative overflow-hidden group cursor-pointer mt-16"
            onClick={() => navigate('/os')}
          >
             <div className="absolute inset-0 bg-linear-to-br from-neural-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 rounded-full border border-neural-blue/30 flex items-center justify-center mb-8 relative">
                 <div className="absolute inset-0 bg-neural-blue/10 rounded-full animate-ping opacity-50" />
                 <Bot size={40} className="text-neural-blue relative z-10" />
               </div>
               <h2 className="text-4xl md:text-5xl font-display font-black uppercase italic tracking-tighter mb-4">
                 Access The Swarm
               </h2>
               <p className="text-white/40 max-w-2xl mb-10 font-light text-lg">
                 Step into the Agenticum G5 Enterprise Operations System. Monitor all 5 AI agents in real-time as SN-00 orchestrates strategy, CC-06 drafts copy, DA-03 forges visuals via Imagen 3, SP-01 runs competitive intel, and RA-01 audits every output for compliance and brand safety.
               </p>
               <button onClick={(e) => { e.stopPropagation(); navigate('/os'); }} className="bg-neural-blue text-obsidian px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] flex items-center gap-3 relative z-20">
                 Initialize OS Portal
                 <Terminal size={14} />
               </button>
               
               <div className="mt-12 flex flex-wrap justify-center gap-6 w-full border-t border-white/5 pt-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Active Workflows</span>
                    <span className="text-xl font-mono text-white">4</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Total Outputs</span>
                    <span className="text-xl font-mono text-white">440</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Swarm Ready</span>
                    <span className="text-xl font-mono text-green-500">100%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">ADK Latency</span>
                    <span className="text-xl font-mono text-white/80">42ms</span>
                  </div>
               </div>
             </div>
          </motion.div>
        </header>

        {/* The Project Nexus (Agent Showcase) */}
        <section id="nexus" className="py-40 border-t border-white/5 bg-white/1 overflow-hidden relative">
          <AgentShowcase />
        </section>

        {/* The Codex (Architecture & Justification) */}
        <section id="codex" className="py-40 px-6 border-t border-white/5 bg-white/1">
          <div className="max-w-7xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-[12rem] font-display font-black mb-6 uppercase italic tracking-tighter opacity-10 underline decoration-neural-blue decoration-2 underline-offset-16">The Codex</h2>
            <p className="text-neural-blue max-w-lg mx-auto uppercase tracking-[0.5em] font-black text-[10px]">Justifying the G5 Matrix</p>
          </div>
          <ProjectNexus />
        </section>

        {/* Nexus Feed (Blog) */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-left">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4 block">Archives</span>
              <h3 className="text-5xl font-display font-black uppercase italic tracking-tighter">Strategic Feed.</h3>
            </div>
            <button onClick={() => navigate('/os?module=pillar-blog')} className="text-[10px] font-black uppercase tracking-widest text-neural-blue border-b border-neural-blue/30 pb-1 hover:text-white transition-colors">View All Archives</button>
          </div>
          <NexusFeed />
        </section>

        {/* Features Bento Grid */}
        <section id="vision" className="py-40 px-6 max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <motion.div 
              variants={fadeInUp}
              className="md:col-span-8 glass p-16 relative overflow-hidden group floating-module border-r-8 border-neural-blue/10"
            >
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-3 mb-8">
                   <Bot size={24} className="text-neural-blue" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-neural-blue">G2.0 Substrate Engine</span>
                </div>
                <h3 className="text-6xl font-display font-black mb-8 uppercase tracking-tighter leading-none">Parallel <br/>Synergy.</h3>
                <p className="text-white/30 text-2xl max-w-xl leading-relaxed font-light italic">
                  Not a chatbot. A living agency where agents work in async parallel, debating strategy before you even blink.
                </p>
              </div>
              <div className="neural-scanner" />
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="md:col-span-4 glass p-16 group floating-module border-t-8 border-neural-gold/10 flex flex-col justify-between"
            >
              <div>
                <ImageIcon size={24} className="text-neural-gold mb-8" />
                <h3 className="text-4xl font-display font-black mb-6 uppercase tracking-tighter">Imagen 3 <br/>Matrix.</h3>
                <p className="text-white/30 text-xl font-light italic">Studio-grade assets generated and verified in spatial harmony.</p>
              </div>
              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neural-gold border border-neural-gold/20 bg-neural-gold/5 px-2 py-1 rounded">Vertex AI</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-neural-gold border border-neural-gold/20 bg-neural-gold/5 px-2 py-1 rounded">Imagen 3</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-neural-gold border border-neural-gold/20 bg-neural-gold/5 px-2 py-1 rounded">Spatial Synergy</span>
                </div>
                <button 
                  onClick={() => navigate('/os?module=studio')}
                  className="w-full py-3 rounded border border-neural-gold/20 bg-neural-gold/10 text-[10px] font-black uppercase tracking-widest text-neural-gold hover:text-obsidian hover:bg-neural-gold transition-colors flex items-center justify-center gap-2"
                >
                  Access Studio →
                </button>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="md:col-span-12 glass p-20 floating-module flex flex-col items-center text-center bg-neural-blue/2 border border-neural-blue/10"
            >
              <div className="w-20 h-20 rounded-full border border-neural-blue/20 flex items-center justify-center mb-10 overflow-hidden relative">
                <div className="absolute inset-0 bg-neural-blue/10 animate-pulse" />
                <BookOpen size={32} className="text-neural-blue relative z-10" />
              </div>
              <h3 className="text-6xl font-display font-black mb-6 uppercase tracking-tighter">The Hackathon Codex</h3>
              <p className="text-white/30 text-2xl max-w-3xl font-light italic">
                Our commitment to the Gemini Live Agent Challenge: 100% Original Code. 100% Google Tech. 1000% Effort.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                 {[
                   '100% Original Code', 'Google Cloud Native', 'Gemini 2.0 Flash', 
                   'Vertex AI', 'Imagen 3', 'Firestore API', 'Cloud Run / Node.js', 
                   'Multi-Agent Swarm', 'TypeScript Strict', 'React 18 / Vite', 'Tailwind CSS v4'
                 ].map(tech => (
                   <span key={tech} className="px-5 py-2 glass text-[10px] font-black uppercase tracking-widest text-neural-blue border-neural-blue/20 bg-neural-blue/5">{tech}</span>
                 ))}
              </div>
              <button 
                onClick={() => setIsComplianceModalOpen(true)}
                className="mt-12 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-white hover:bg-neural-blue hover:text-obsidian hover:border-neural-blue transition-all flex items-center gap-3 group shadow-[0_0_20px_rgba(0,229,255,0)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                View Architecture & Compliance →
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Assets Section */}
        <section id="assets" className="py-40 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-[16rem] font-display font-black mb-6 uppercase italic tracking-tighter opacity-5 select-none">Outputs.</h2>
            <p className="text-white/20 uppercase tracking-[0.8em] font-black text-[10px] -mt-20">Neural Forge Production</p>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="floating-module"
          >
            <AssetGallery />
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-40 px-6 max-w-7xl mx-auto border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-12 opacity-30 hover:opacity-100 transition-opacity duration-700">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-neural-blue flex items-center justify-center font-bold text-obsidian text-sm">G5</div>
              <span className="font-display font-black tracking-tighter text-3xl uppercase italic">Agenticum</span>
            </div>
            <p className="text-sm font-light italic max-w-sm text-white/40 leading-relaxed">
              The world's first voice-activated AI creative agency. Built natively on Google Cloud for the Gemini Live Agent Challenge 2026. 100% Original Code.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 mt-12 md:mt-0">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">System</span>
              <button onClick={() => navigate('/os?module=dashboard')} className="text-sm hover:text-neural-blue transition-colors text-left">Mission</button>
              <button onClick={() => navigate('/os?module=nexus-engine')} className="text-sm hover:text-neural-blue transition-colors text-left">Swarm</button>
              <button onClick={() => navigate('/os')} className="text-sm hover:text-neural-blue transition-colors text-left">OS Portal</button>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Legal</span>
              <button onClick={() => navigate('/os?module=memory')} className="text-sm hover:text-neural-blue transition-colors text-left">The Codex</button>
              <a href="https://devpost.com" target="_blank" rel="noreferrer" className="text-sm hover:text-neural-blue transition-colors">Devpost Submission</a>
              <button onClick={() => navigate('/privacy')} className="text-sm text-white/30 hover:text-neural-blue transition-colors text-left">Privacy Policy</button>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Origin</span>
              <p className="text-[10px] font-black tracking-[0.4em] uppercase">Alphate Inc // 2026</p>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isComplianceModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsComplianceModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-obsidian border border-neural-blue/30 rounded-3xl p-12 relative shadow-[0_0_100px_rgba(0,229,255,0.1)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-neural-blue/10 blur-[100px] pointer-events-none" />
              <div className="absolute top-0 left-0 w-64 h-64 bg-neural-gold/10 blur-[100px] pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-full bg-neural-blue/20 flex items-center justify-center border border-neural-blue/50">
                  <BookOpen size={20} className="text-neural-blue" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neural-blue mb-1 block">Legal & Architecture</span>
                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter">Project Agenticum G5 Compliance</h3>
                </div>
              </div>

              <div className="glass p-8 rounded-2xl border border-white/5 mb-8 relative z-10">
                <p className="text-lg leading-relaxed font-light italic text-white/80">
                  This project was built from scratch exclusively for the Gemini Live Agent Challenge 2026. No boilerplates. No third-party agent frameworks. A pure Google Cloud Native implementation showcasing the raw power of the Gemini 2.0 API.
                </p>
              </div>

              <div className="flex justify-end relative z-10">
                <button 
                  onClick={() => setIsComplianceModalOpen(false)}
                  className="px-8 py-4 bg-white text-obsidian font-black uppercase tracking-widest text-xs rounded-xl hover:bg-neural-blue transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDemoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsDemoModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-obsidian border border-neural-blue/30 rounded-3xl p-10 relative shadow-[0_0_100px_rgba(0,229,255,0.2)] overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neural-blue/20 blur-[50px] pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-neural-blue/10 flex items-center justify-center border border-neural-blue/30 mx-auto mb-6 relative z-10">
                <Play size={24} className="text-neural-blue ml-1" />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 text-white relative z-10">Live Agent Demo</h3>
              <p className="text-white/60 font-light italic leading-relaxed mb-8 relative z-10">
                Live Agent Demo is scheduled for the Hackathon Pitch Session. Please refer to our Devpost submission for architecture details.
              </p>
              <button 
                onClick={() => setIsDemoModalOpen(false)}
                className="w-full py-4 bg-neural-blue text-obsidian font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors relative z-10"
              >
                Acknowledge Directive
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
