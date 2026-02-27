import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, Target, Search, Activity } from 'lucide-react';
import prometheusEngine from '../assets/g5_tactical_radar_strike_en_v2_1772174690101.png';

const MOCK_INTEL = [
  { competitor: "AnalyticaInvestor", url: "analyticainvestor.com/robo-billions", status: "DECOMPILED", threat: 74, h2: ["What are humanoid robots?", "Top 5 Robotics Stocks 2026", "How to invest?"] },
  { competitor: "RoboReport.io", url: "roboreport.io/humanoid-market-2026", status: "DECOMPILED", threat: 61, h2: ["Market Size 2026", "Figure AI vs Boston Dynamics", "Investment Risks"] },
  { competitor: "TechAlpha.com", url: "techalpha.com/ai-robotics-stocks", status: "NEW", threat: 88, h2: [] },
];

export const ColumnaRadarSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="columna-demo" className="py-40 px-6 bg-midnight/50 border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="badge badge-processing mb-6 mx-auto w-fit">
            <Search size={10} /> Project Prometheus · Omniscience Engine
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white brightness-125 mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
            Sentient Systems Don't Hallucinate.<br />
            <span className="text-accent">They Research.</span>
          </motion.h2>
          <p className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            BA-07 scans competitor sitemaps & tech stacks in real-time. 
            Google Search Grounding injects facts into the Nexus to identify disruptive 'White Space'.
          </p>
        </div>

        {/* Technical Workflow Visual */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/60 mb-24 aspect-video md:aspect-21/9">
          <img src={prometheusEngine} alt="Prometheus Omniscience Engine Workflow" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Overlay Labels for Mobile/Desktop differentiation if needed, but the image is descriptive */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Intel Feed */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card overflow-hidden border-orange-500/20">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radar size={18} className="text-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Intelligence Feed</span>
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">BA-07 Scanning...</span>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_INTEL.map((intel, i) => (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    active === i
                      ? 'border-orange-500/40 bg-orange-500/10'
                      : 'border-white/5 bg-black/40 hover:bg-black/60 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-bold text-sm tracking-tight">{intel.competitor}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest border uppercase ${
                      intel.status === 'NEW'
                        ? 'text-rose-400 border-rose-500/30 bg-rose-500/5'
                        : 'text-emerald border-emerald/30 bg-emerald/5'
                    }`}>
                      {intel.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/30 font-mono truncate mb-4">{intel.url}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/20">Threat:</span>
                    <div className="flex-1 bg-white/5 rounded-full h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${intel.threat}%` }}
                        className={`h-full rounded-full ${intel.threat > 75 ? 'bg-rose-500' : 'bg-orange-500'}`}
                      />
                    </div>
                    <span className={`font-mono text-[10px] ${intel.threat > 75 ? 'text-rose-400' : 'text-orange-400'}`}>
                      {intel.threat}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Decompiler Viewer */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card overflow-hidden border-accent/20">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                Nexus Synthesis · {MOCK_INTEL[active].competitor}
              </span>
            </div>
            <div className="p-6">
              {MOCK_INTEL[active].h2.length > 0 ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-4">Decompiled Structure</p>
                    <div className="space-y-3">
                      {MOCK_INTEL[active].h2.map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 group hover:border-accent/30 transition-all"
                        >
                          <span className="text-white/20 font-mono text-[10px] border border-white/10 px-2 py-0.5 rounded">H2</span>
                          <span className="text-white/60 text-sm italic">"{h}"</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-xl bg-accent text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 mt-8 shadow-[0_10px_30px_rgba(0,229,255,0.3)]">
                    <Target size={16} /> Identify White Space & Strategize
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Activity size={32} className="text-orange-500 animate-pulse mx-auto mb-4" />
                  <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    ⚡ Neural Scanning in Progress...
                  </p>
                  <p className="text-white/20 text-xs font-mono mt-2">Prometheus Engine is decompiling sitemaps & identifying strategic campaign DNA.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
