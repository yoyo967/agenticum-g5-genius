import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic2, Terminal, ArrowRight, Sparkles, Orbit } from 'lucide-react';
import infinityEvolution from '../assets/g5_infinity_evolution_cta_en_v2_1772174716260.png';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section id="final-cta" className="py-60 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px]" 
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="flex justify-center mb-10">
          <div className="px-5 py-2 rounded-full border border-accent/20 bg-accent/5 flex items-center gap-3">
            <Sparkles size={14} className="text-accent" />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-accent">Maximum Excellence</span>
          </div>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-black uppercase tracking-tight leading-[0.85] mb-8"
          style={{ fontSize: 'clamp(48px, 9vw, 130px)' }}>
          INITIALIZE<br />
          <span className="text-accent">THE FUTURE.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-white/40 mb-14 text-lg md:text-xl font-mono max-w-2xl mx-auto leading-relaxed">
          Five specialized agents. One voice command. Autonomous synergy.
          EU-Compliance-by-Design. Perfect Twin Audit Ledger.<br />
          <span className="text-white/60">This is not a tool. This is Agenticum G5.</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => navigate('/os')}
            className="btn-primary flex items-center gap-3 px-10 py-5 text-lg shadow-[0_0_50px_rgba(0,229,255,0.4)] hover:shadow-[0_0_70px_rgba(0,229,255,0.6)]"
          >
            <Mic2 size={20} /> Initialize Swarm <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/os')}
            className="btn-outline flex items-center gap-3 px-10 py-5 text-lg border-white/20! hover:border-accent/50! group"
          >
            <Terminal size={20} className="group-hover:text-accent transition-colors" /> Enter OS Portal
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/60 mt-32 aspect-21/9 group">
          <img src={infinityEvolution} alt="Infinity Evolution Visual" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-0 w-full flex flex-col items-center">
             <div className="flex items-center gap-3 mb-4">
                <Orbit className="text-accent animate-spin-slow" size={24} />
                <span className="font-mono text-xs uppercase font-black tracking-[0.4em] text-white/60">Recursive Intelligence Engine</span>
             </div>
             <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">online-marketing-manager.web.app</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
          className="mt-20 flex flex-wrap justify-center gap-8 opacity-20 transition-opacity hover:opacity-40">
          {['G5-REVISION-00009', 'WEBSOCKET-FABRIC-LIVE', 'VAULT-PERSISTENCE-ON', 'SENATE-ACTIVE'].map(s => (
            <span key={s} className="font-mono text-[9px] font-black tracking-widest uppercase">{s}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
