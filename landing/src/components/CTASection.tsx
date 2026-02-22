import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Terminal, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-agent-sp01/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[900px] mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="badge badge-processing inline-flex mb-8">
          <Sparkles size={10} /> Ready to Deploy
        </motion.div>

        {/* Headline */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-bold uppercase tracking-tight leading-[0.9] mb-8"
          style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
          Initialize The<br/><span className="text-accent">Neural Agency.</span>
        </motion.h2>

        {/* Description */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="font-mono text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-12">
          Step into the future of creative production. Five specialized AI agents. One voice command. 
          Parallel synergy that scales infinitely on Google Cloud.
        </motion.p>

        {/* Trust Badges */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: <Zap size={14} />, label: 'Sub-50ms Latency' },
            { icon: <Shield size={14} />, label: 'Senate-Verified Outputs' },
            { icon: <Globe size={14} />, label: '100% Google Cloud Native' },
          ].map(badge => (
            <div key={badge.label} className="flex items-center gap-2 font-mono text-xs text-white/30">
              <span className="text-accent">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate('/os?module=campaign')}
            className="btn-primary text-base py-4 px-10 flex items-center gap-3 shadow-[0_0_40px_rgba(0,229,255,0.3)]">
            <Sparkles size={18} /> Initialize Swarm <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/os')}
            className="btn-ghost text-base py-4 px-10 flex items-center gap-3">
            <Terminal size={18} /> Enter OS Portal
          </button>
        </motion.div>

        {/* Fine Print */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="font-mono text-[10px] text-white/15 mt-10 uppercase tracking-widest">
          Gemini Live Agent Challenge 2026 · Alphate Inc · 100% Original Code
        </motion.p>
      </div>
    </section>
  );
}
