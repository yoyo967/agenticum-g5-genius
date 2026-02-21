import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, Image as ImageIcon, Sparkles, BookOpen, Mic2, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AssetGallery } from '../components/AssetGallery';
import { NeuralSubstrate } from '../components/NeuralSubstrate';
import { LivingAgents } from '../components/LivingAgents';
import { ProjectNexus } from '../components/ProjectNexus';
import { NexusFeed } from '../components/NexusFeed';

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.2], [1, 0.1]);
  const navigate = useNavigate();

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
          className="fixed top-0 w-full z-50 border-b border-white/5 glass px-6 py-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded bg-neural-blue shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center font-bold text-obsidian text-xs"
            >
              G5
            </motion.div>
            <span className="font-display font-black tracking-tight text-xl uppercase italic">Agenticum</span>
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            <a href="#vision" className="hover:text-neural-blue transition-colors">Mission</a>
            <a href="#nexus" className="hover:text-neural-blue transition-colors">The Nexus</a>
            <a href="#synergy" className="hover:text-neural-blue transition-colors">Synergy</a>
            <a href="#assets" className="hover:text-neural-blue transition-colors">Visuals</a>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/os')} className="text-[10px] font-black uppercase tracking-widest text-neural-blue hover:text-white transition-colors">
              Enterprise OS
            </button>
            <button onClick={() => navigate('/os')} className="bg-neural-blue text-obsidian px-6 py-2 rounded-lg text-[10px] font-black hover:bg-white transition-all active:scale-95 uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.3)]">
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
              Ultimate <br/><span className="text-neural-blue">Continuos.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-2xl text-white/30 max-w-3xl font-light leading-relaxed italic"
            >
              The world's first voice-activated AI creative agency. <br/>
              Five agents. One voice. Infinite parallel synergy.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 flex items-center gap-8"
            >
              <div className="flex flex-col items-center gap-2">
                <Mic2 size={32} className="text-neural-blue opacity-50" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-20">Voice Enabled</span>
              </div>
              <div className="w-20 h-px bg-white/10" />
              <div className="flex flex-col items-center gap-2">
                <ImageIcon size={32} className="text-neural-gold opacity-50" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-20">Vision Ready</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating UI Module: Orchestration Gateway */}
          <motion.div 
            id="synergy"
            style={{ y: yRange }}
            className="w-full max-w-4xl floating-module glass p-1 rounded-xl shadow-[0_100px_200px_rgba(0,0,0,0.9)] border-white/5 relative overflow-hidden group cursor-pointer"
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
               <p className="text-white/40 max-w-lg mb-10 font-light text-lg">
                 Step into the Agenticum G5 Enterprise Operations System. Monitor the AI agents in real-time as they orchestrate strategy, debate ethics, and forge assets.
               </p>
               <button className="bg-neural-blue text-obsidian px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] flex items-center gap-3">
                 Initialize OS Portal
                 <Terminal size={14} />
               </button>
             </div>
          </motion.div>
        </header>

        {/* The Project Nexus */}
        <section id="nexus" className="py-40 px-6 border-t border-white/5 bg-white/1">
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
            <button className="text-[10px] font-black uppercase tracking-widest text-neural-blue border-b border-neural-blue/30 pb-1">View All Archives</button>
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
              <div className="mt-10 pt-10 border-t border-white/5 opacity-20">
                <span className="text-[8px] font-black uppercase tracking-widest">Vertex AI Integrated</span>
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
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                 {['Gemini 2.0 Flash', 'ADK', 'Vertex AI', 'Imagen 3', 'Cloud Run'].map(tech => (
                   <span key={tech} className="px-4 py-2 glass text-[10px] font-black uppercase tracking-widest opacity-40">{tech}</span>
                 ))}
              </div>
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
            <p className="text-sm font-light italic max-w-xs text-white/40 leading-relaxed">
              The world's first voice-activated AI creative agency. Built for the Gemini Live Agent Challenge 2026.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">System</span>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Vision</a>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Nexus</a>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Console</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Legal</span>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Codex</a>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Hackathon</a>
              <a href="#" className="text-sm hover:text-neural-blue transition-colors">Privacy</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Mission</span>
              <p className="text-[10px] font-black tracking-[0.4em] uppercase">Alphate Inc // 2026</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
