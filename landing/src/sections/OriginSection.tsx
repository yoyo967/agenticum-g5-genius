import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Zap, ArrowRight, Quote, User, Building2, Target
} from 'lucide-react';
import cloudStack from '../assets/g5_cloud_native_stack.png';


const PROBLEM_POINTS = [
  {
    icon: <Target size={18} />,
    title: 'The Problem',
    color: '#FF007A',
    text: 'B2B marketing dashboards are static, read-only cockpits. You click, you read — and then you manually type into a chatbot. This is the 2015 text-box paradigm.',
  },
  {
    icon: <Zap size={18} />,
    title: 'The Insight',
    color: '#FFD700',
    text: "Tony Stark doesn't type. He speaks into the room, and GenIUS thinks along, acts proactively, and delivers in real-time. Why should enterprise marketing be different?",
  },
  {
    icon: <Brain size={18} />,
    title: 'The Solution',
    color: '#00E5FF',
    text: 'Agenticum G5 is the GenIUS for enterprise online marketing. Voice-in, live-output. 8 specialized AI agents. EU AI Act compliant. Not a chatbot. A command center.',
  },
];

const ARCHITECTURE_AGENTS = [
  { id: 'SN-00', name: 'Nexus Prime', role: 'Neural Orchestrator', color: '#00E5FF', description: 'Coordinates all sub-agents via SwarmProtocol. Identifies intent via Function Calling.' },
  { id: 'SO-00', name: 'Sovereign', role: 'Higher Intelligence', color: '#FFD700', description: 'The consciousness of the Nexus; fuses user vision with technical execution.' },
  { id: 'SP-01', name: 'Strategic Cortex', role: 'Strategist', color: '#7B2FBE', description: "Market analysis, competitive intelligence, McKinsey 7S + Porter's Five Forces." },
  { id: 'CC-06', name: 'Cognitive Core', role: 'Copywriter', color: '#FF007A', description: "Enterprise content following Ogilvy's 8 Commandments. SEO-optimized, grounded." },
  { id: 'DA-03', name: 'Design Architect', role: 'Visual AI', color: '#FFD700', description: 'Imagen 3 Visual Generation. Bauhaus principles. Live broadcast via EventFabric.' },
  { id: 'BA-07', name: 'Browser Architect', role: 'Deep Research', color: '#f59e0b', description: 'Deep-intel specialist for autonomous web-intelligence and data extraction via Playwright.' },
  { id: 'VE-01', name: 'Motion Director', role: 'Cinematic Lead', color: '#ef4444', description: 'Orchestrates the Cinematic Forge pipeline for storyboards and motion-assets.' },
  { id: 'RA-01', name: 'Security Senate', role: 'Compliance AI', color: '#00FF88', description: 'EU AI Act, FTC, Dark Pattern Detection. No output without Senate approval.' },
];

export function OriginSection() {
  const navigate = useNavigate();

  return (
    <section className="py-40 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-5 blur-[120px] pointer-events-none"
        style={{ background: '#00E5FF' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-5 blur-[120px] pointer-events-none"
        style={{ background: '#7B2FBE' }} />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Section Label */}
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="badge badge-online mb-10 mx-auto w-fit block text-center">
          <User size={10} /> Origin Story · The Visionary Behind the System
        </motion.div>

        {/* Opening Quote */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-24">
          <div className="relative inline-block">
            <Quote size={40} className="text-accent/20 absolute -top-4 -left-8 rotate-180" />
            <blockquote className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white/90"
              style={{ fontSize: 'clamp(28px, 4vw, 64px)' }}>
              Legacy dashboards are<br />
              <span className="text-magenta">Silent Cockpits.</span><br />
              We changed that.
            </blockquote>
            <Quote size={40} className="text-accent/20 absolute -bottom-4 -right-8" />
          </div>
        </motion.div>

        {/* Builder Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card p-10 card-glow-cyan">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <User size={28} className="text-accent" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">The Architect</p>
                <h3 className="font-display text-2xl font-bold uppercase">Yahya Yıldırım</h3>
              </div>
            </div>
            <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
              Enterprise marketing has been a manual, slow process for years. Agenticum G5 was born as the response 
              — a system that merges the speed of AI with the precision of enterprise-grade compliance.
            </p>
            <p className="font-mono text-sm text-white/50 leading-relaxed">
              Built on a single conviction: <span className="text-accent">The future of marketing 
              is not typed in — it is commanded by voice.</span>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card p-10 card-glow-gold">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Building2 size={28} className="text-gold" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">The Vision</p>
                <h3 className="font-display text-2xl font-bold uppercase">Agenticum G5</h3>
              </div>
            </div>
            <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
              Democratic access to enterprise marketing intelligence. We bridge the gap so mid-market 
              enterprises can wield the same AI-powered arsenal as global conglomerates.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Enterprise AI', 'Voice-First', 'EU Compliant', 'Google Cloud Native'].map(tag => (
                <span key={tag} className="badge badge-warning text-[9px]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Problem → Solution → Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {PROBLEM_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: point.color }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${point.color}15`, color: point.color }}>
                {point.icon}
              </div>
              <h3 className="font-display text-xl font-bold uppercase mb-4" style={{ color: point.color }}>
                {point.title}
              </h3>
              <p className="font-mono text-sm text-white/50 leading-relaxed">{point.text}</p>
            </motion.div>
          ))}
        </div>

        {/* The Architecture — 5 Agents */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-24">
          <div className="text-center mb-16">
            <span className="label-active block mb-4">The Swarm Architecture</span>
            <h2 className="font-display font-bold uppercase tracking-tight"
              style={{ fontSize: 'clamp(32px, 4.5vw, 72px)' }}>
              8 Minds. <span className="text-accent">One System.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {ARCHITECTURE_AGENTS.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 text-center cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: agent.color }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${agent.color}08, transparent 70%)` }} />

                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border"
                  style={{ background: `${agent.color}10`, borderColor: `${agent.color}30` }}>
                  <span className="font-display font-black text-xs" style={{ color: agent.color }}>{agent.id}</span>
                </div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: agent.color }}>
                  {agent.role}
                </p>
                <p className="font-mono text-[8px] text-white/20 uppercase mb-3">{agent.name}</p>
                <p className="font-mono text-[9px] text-white/40 leading-relaxed">{agent.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Visual & Codex */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-24">
          <div className="text-center mb-16">
            <span className="label-active block mb-4">The Infrastructure Codex</span>
            <h2 className="font-display font-bold uppercase tracking-tight"
              style={{ fontSize: 'clamp(32px, 4.5vw, 72px)' }}>
              100% Google Cloud. <br /><span className="text-accent">Zero Wrappers.</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-obsidian">
                <img src={cloudStack} alt="Pure Google Cloud Native Stack" className="w-full h-auto opacity-90" />
                <div className="absolute inset-0 bg-linear-to-t from-midnight/60 to-transparent" />
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-8">
              <div className="glass-card p-8 border-emerald/20 card-glow-emerald">
                <h3 className="font-display text-2xl font-black uppercase mb-4 text-emerald">The Hackathon Purity</h3>
                <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
                  Agenticum G5 is a testament to technical sovereignty. No high-level wrappers like LangChain or Flowise. 
                  Every agentic loop, every parallel swarm trigger, and every WebSocket event is 100% original TypeScript/Python code.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-accent font-black text-xs mb-1">INTELLIGENCE</div>
                    <div className="text-[10px] text-white/30 uppercase">Gemini 2.0 & Imagen 3</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-magenta font-black text-xs mb-1">CODE BASE</div>
                    <div className="text-[10px] text-white/30 uppercase">100% Original Node.js</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <button onClick={() => navigate('/os')}
            className="btn-primary flex items-center gap-3 mx-auto text-sm">
            Experience the OS <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
