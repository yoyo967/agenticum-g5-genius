import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Globe, Shield, Cpu, Database, Cloud,
  Code2, Layers, Zap, ArrowRight, Quote, User, Building2, Target
} from 'lucide-react';

const TECH_STACK = [
  { name: 'Gemini 2.0 Flash', category: 'AI Core', color: '#00E5FF', icon: <Brain size={14} /> },
  { name: 'Gemini Live API', category: 'Voice Interface', color: '#00E5FF', icon: <Zap size={14} /> },
  { name: '@google/genai SDK', category: 'Required · v1.42.0', color: '#00E5FF', icon: <Code2 size={14} /> },
  { name: 'Vertex AI', category: 'ML Platform', color: '#7B2FBE', icon: <Brain size={14} /> },
  { name: 'Imagen 3', category: 'Visual Generation', color: '#FFD700', icon: <Layers size={14} /> },
  { name: 'Cloud Run', category: 'europe-west1', color: '#4285F4', icon: <Cloud size={14} /> },
  { name: 'Firestore', category: 'Audit Ledger', color: '#FF7043', icon: <Database size={14} /> },
  { name: 'Google Search Grounding', category: 'Anti-Hallucination', color: '#34A853', icon: <Globe size={14} /> },
  { name: 'EU AI Act Art. 50', category: 'Compliance Layer', color: '#00FF88', icon: <Shield size={14} /> },
  { name: 'React 19 + Vite', category: 'Frontend', color: '#61DAFB', icon: <Code2 size={14} /> },
  { name: 'Node.js + Express', category: 'Backend', color: '#68A063', icon: <Cpu size={14} /> },
  { name: 'Python FastAPI', category: 'Engine Layer', color: '#3776AB', icon: <Code2 size={14} /> },
];

const PROBLEM_POINTS = [
  {
    icon: <Target size={18} />,
    title: 'Das Problem',
    color: '#FF007A',
    text: 'B2B-Marketing-Dashboards sind statische Read-Only-Cockpits. Man klickt, liest — und tippt dann manuell in einen Chatbot. Das ist das Text-Box-Paradigma von 2015.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Die Einsicht',
    color: '#FFD700',
    text: 'Tony Stark tippt nicht. Er spricht in den Raum, und J.A.R.V.I.S. denkt mit, handelt proaktiv, liefert in Echtzeit. Warum sollte Enterprise-Marketing anders sein?',
  },
  {
    icon: <Brain size={18} />,
    title: 'Die Lösung',
    color: '#00E5FF',
    text: 'Agenticum G5 ist der J.A.R.V.I.S. für Enterprise Online-Marketing. Voice-in, Live-Output. 5 spezialisierte KI-Agenten. EU AI Act-konform. Kein Chatbot. Eine Kommandozentrale.',
  },
];

const ARCHITECTURE_AGENTS = [
  { id: 'SN-00', name: 'Neural Orchestrator', role: 'Master-Agent', color: '#00E5FF', description: 'Koordiniert alle Sub-Agenten via SwarmProtocol. Erkennt Intent per Function Calling.' },
  { id: 'SP-01', name: 'Strategic Cortex', role: 'Strategist', color: '#7B2FBE', description: 'Marktanalyse, Wettbewerbs-Intelligence, McKinsey 7S + Porter\'s Five Forces.' },
  { id: 'CC-06', name: 'Cognitive Core', role: 'Copywriter', color: '#FF007A', description: 'Enterprise-Content nach Ogilvy\'s 8 Commandments. SEO-optimiert, grounded.' },
  { id: 'DA-03', name: 'Design Architect', role: 'Visual AI', color: '#FFD700', description: 'Imagen 3 Visual Generation. Bauhaus-Prinzipien. Live-Broadcast via EventFabric.' },
  { id: 'RA-01', name: 'Security Senate', role: 'Compliance AI', color: '#00FF88', description: 'EU AI Act, FTC, Dark Pattern Detection. Kein Output ohne Senate-Freigabe.' },
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
          <User size={10} /> Origin Story · Der Mensch hinter dem System
        </motion.div>

        {/* Opening Quote */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-24">
          <div className="relative inline-block">
            <Quote size={40} className="text-accent/20 absolute -top-4 -left-8 rotate-180" />
            <blockquote className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white/90"
              style={{ fontSize: 'clamp(28px, 4vw, 64px)' }}>
              Heutige B2B-Dashboards sind<br />
              <span className="text-magenta">stumme Cockpits.</span><br />
              Wir haben das geändert.
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
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">Der Architekt</p>
                <h3 className="font-display text-2xl font-bold uppercase">Yahya Yıldırım</h3>
              </div>
            </div>
            <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
              Enterprise-Marketing war jahrelang ein manueller, langsamer Prozess. Als Antwort darauf entstand
              Agenticum G5 — ein System, das die Geschwindigkeit und Intelligenz von KI mit der Präzision
              von Enterprise-Compliance verbindet.
            </p>
            <p className="font-mono text-sm text-white/50 leading-relaxed">
              Gebaut auf dem Überzeugung: <span className="text-accent">Die Zukunft des Marketings
              spricht man nicht ein — man befielt ihr.</span>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card p-10 card-glow-gold">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Building2 size={28} className="text-gold" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">Die Vision</p>
                <h3 className="font-display text-2xl font-bold uppercase">Alphate Inc.</h3>
              </div>
            </div>
            <p className="font-mono text-sm text-white/50 leading-relaxed mb-6">
              Enterprise-Marketing-Intelligence für jeden. Nicht nur für Konzerne mit 50-köpfigen
              Marketing-Teams. Mittelständische Unternehmen sollen Zugang zu demselben
              KI-gestützten Arsenal haben.
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
              5 Minds. <span className="text-accent">One System.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        {/* Tech Stack Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16">
          <div className="text-center mb-12">
            <span className="label-active block mb-4">Built With</span>
            <h2 className="font-display font-bold uppercase tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
              100% Google Cloud. <span className="text-accent">Zero Shortcuts.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 flex items-start gap-3 cursor-default group"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ background: `${tech.color}15`, color: tech.color }}>
                  {tech.icon}
                </div>
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-tight text-white/80">
                    {tech.name}
                  </p>
                  <p className="font-mono text-[8px] text-white/25 uppercase tracking-widest mt-0.5">
                    {tech.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <button onClick={() => navigate('/os')}
            className="btn-primary flex items-center gap-3 mx-auto text-sm">
            Das System erleben <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
