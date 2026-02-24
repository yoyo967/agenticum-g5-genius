import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, MapPin, Zap } from 'lucide-react';

const prizes = [
  { 
    rank: "Grand Prize", 
    amount: "$25,000", 
    extras: ["$3,000 GCP Credits", "Google Cloud Next 2026 Tickets", "Travel Stipend Las Vegas", "Demo Slot at Google Cloud Next"], 
    color: "#FFD700", 
    icon: <Trophy size={24} />,
    glow: "shadow-[0_0_50px_rgba(251,188,4,0.15)]" 
  },
  { 
    rank: "Best Storyteller", 
    amount: "$10,000", 
    extras: ["$1,000 GCP Credits", "Google Cloud Next 2026 Tickets", "Virtual Coffee: Google Team"], 
    color: "#00E5FF", 
    icon: <Star size={24} />,
    glow: "shadow-[0_0_50px_rgba(0,229,255,0.15)]" 
  },
  { 
    rank: "Best Tech Arch", 
    amount: "$5,000", 
    extras: ["$500 GCP Credits", "Recognition by Google Engineers"], 
    color: "#FF007A", 
    icon: <Zap size={24} />,
    glow: "shadow-[0_0_50px_rgba(255,0,122,0.15)]" 
  },
];

export const PrizesSection: React.FC = () => (
  <section id="prizes" className="py-40 px-6 border-t border-white/5 relative overflow-hidden">
    {/* Background accent */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-[1200px] mx-auto relative z-10">
      <div className="text-center mb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="badge badge-processing mb-6 mx-auto w-fit">
          <Star size={10} /> The Stakes — Gemini Live Challenge
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-black uppercase tracking-tight leading-none mb-6"
          style={{ fontSize: 'clamp(40px, 7vw, 100px)' }}>
          $80,000 <br /><span className="text-accent">IN PRIZES.</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          Agenticum G5 is competing in all three categories. Our architecture is engineered
          not just to function, but to dominate.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prizes.map((p, i) => (
          <motion.div 
            key={p.rank}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-10 relative overflow-hidden group ${p.glow}`}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: p.color }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}10, transparent 70%)` }} />

            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border"
              style={{ background: `${p.color}10`, borderColor: `${p.color}30`, color: p.color }}>
              {p.icon}
            </div>

            <div className="font-display font-black text-4xl mb-2 tracking-tighter" style={{ color: p.color }}>
              {p.amount}
            </div>
            <div className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8">
              {p.rank}
            </div>

            <ul className="space-y-4">
              {p.extras.map(e => (
                <li key={e} className="flex font-mono text-[10px] text-white/50 leading-relaxed group/item">
                  <span className="mr-3 transition-colors group-hover/item:text-white" style={{ color: p.color }}>+</span>
                  <span className="group-hover/item:text-white/80 transition-colors uppercase">{e}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
        className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
        <div className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
          <MapPin size={12} /> Deadline: 17. März 2026 @ 01:00 CET · 22 days remaining
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest">
          Build for the future · Powered by Alphabet Inc.
        </div>
      </motion.div>
    </div>
  </section>
);
