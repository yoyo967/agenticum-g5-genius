import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Database, Code, ShieldCheck, X } from 'lucide-react';
import perfectTwin from '../assets/g5_perfect_twin.png';

const MOCK_TWIN = {
  run_id: "run_a7f3c891d2",
  directive: "Generate Pillar: Humanoid Robotics Investment 2026",
  model: "gemini-1.5-pro-002",
  timestamp: "2026-02-22T18:44:02Z",
  search_queries: [
    "humanoid robots market size 2026",
    "Figure AI valuation funding round",
    "Boston Dynamics Atlas commercial"
  ],
  sources: [
    "reuters.com/technology/robotics-2026",
    "techcrunch.com/figure-ai-series-b",
    "bloomberg.com/humanoid-robot-market"
  ],
  senate: {
    compliance_score: 98,
    seo_score: 97,
    wcag_score: 98,
    approved: true
  }
};

export const PerfectTwinSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="perfect-twin-demo" className="py-40 px-6 bg-midnight/20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="badge badge-processing mb-6 mx-auto w-fit">
            <Eye size={10} /> Glass Box Mode · Absolute Transparency
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white brightness-125 mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
            Absolute<br />
            <span className="text-accent">Transparency.</span>
          </motion.h2>
          <p className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Every thought, every API call, and every search query is logged immutably in Firestore. 
            A single click reveals the full source provenance and decision logic.
          </p>
        </div>

        {/* Perfect Twin Visual */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/60 mb-24 aspect-video">
          <img src={perfectTwin} alt="Perfect Twin Provenance Matrix Visual" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Generated Content Preview */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card p-10 relative group">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Article Preview Interface</div>
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer border border-white/5 rounded-2xl p-8 bg-white/2 hover:border-accent/40 transition-all shadow-2xl"
            >
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">
                The $38B Humanoid Robotics Market: Why 2026 Is the Inflection Point
              </h3>
              <p className="text-white/40 text-sm leading-relaxed font-mono italic">
                "According to verified market data from Reuters and Bloomberg, the global 
                humanoid robotics sector is projected to reach $38 billion by 2030..."
              </p>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest">Live Provenance Detected</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-accent border-b border-accent/30 hover:border-accent transition-colors">
                  Reveal Audit Trail →
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Twin Inspector */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card overflow-hidden shadow-3xl border-accent/30"
                >
                  <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest font-black text-accent">Status: SYNCED</div>
                      <div className="text-white font-black uppercase text-sm mt-1">Provenance Matrix v2.0</div>
                    </div>
                    <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-white/30 uppercase font-black">Memory ID</span>
                      <span className="text-accent">{MOCK_TWIN.run_id}</span>
                    </div>
                    <div className="space-y-3">
                      <span className="text-white/30 uppercase font-black block">Grounding Vector Keys</span>
                      {MOCK_TWIN.search_queries.map(q => (
                        <div key={q} className="text-white/60 flex items-center gap-2">
                          <Code size={10} className="text-accent" /> "{q}"
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <span className="text-white/30 uppercase font-black block">Trusted Source Chain</span>
                      {MOCK_TWIN.sources.map(s => (
                        <div key={s} className="text-emerald flex items-center gap-2">
                          <Database size={10} /> {s}
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-end">
                       <div className="space-y-1">
                         <span className="text-white/30 uppercase font-black block">Senate Approval</span>
                         <div className="text-2xl font-black text-white">{MOCK_TWIN.senate.compliance_score}<span className="text-xs text-white/30">/100</span></div>
                       </div>
                       <div className="bg-emerald/10 border border-emerald/30 px-4 py-2 rounded-lg">
                         <div className="flex items-center gap-2 text-emerald font-black uppercase text-[10px]">
                           <ShieldCheck size={14} /> IMMUTABLE LOG
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="glass-card p-12 h-full flex flex-col items-center justify-center border-dashed text-center min-h-[460px]"
                 >
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 opacity-40">
                      <Eye size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/20 font-black uppercase text-[10px] tracking-widest max-w-[200px] leading-relaxed">
                       Awaiting selection. Trigger "Glass Box Mode" by selecting a content block.
                    </p>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
