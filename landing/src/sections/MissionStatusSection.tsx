import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Cloud, ShieldCheck } from 'lucide-react';
import missionHealth from '../assets/g5_mission_control_health_en_v2_1772174704943.png';

export const MissionStatusSection: React.FC = () => {
  const metrics = [
    { icon: Cloud, label: 'Environment', value: 'Europe-West1', detail: 'Cloud Run / GCP', color: 'text-cyan' },
    { icon: Activity, label: 'Latency', value: '42ms', detail: 'SN-00 Orchestrator', color: 'text-emerald' },
    { icon: Cpu, label: 'Codebase', value: '100%', detail: 'Pure Original Logic', color: 'text-white' },
    { icon: ShieldCheck, label: 'Verification', value: 'Locked', detail: 'Zero-Wrapper Policy', color: 'text-orange-500' }
  ];

  return (
    <section id="mission-control" className="py-32 px-6 border-t border-white/5 relative overflow-hidden bg-black/40 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Right: Content */}
          <div className="flex-1 w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Activity size={20} className="text-emerald-500" />
                </div>
                <span className="font-mono text-[10px] uppercase font-black tracking-[0.3em] text-emerald-500">System Monitoring</span>
              </div>

              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-8">
                Mission Status: <br />
                <span className="text-emerald-500">Maximum Excellence.</span>
              </h2>

              <p className="text-lg md:text-xl text-white/50 font-mono mb-12 leading-relaxed">
                Real-time telemetry of the AGENTICUM G5 infrastructure. Complete transparency. The "Glass Box" standard applied to our own performance.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <m.icon size={14} className={m.color} />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">{m.label}</span>
                    </div>
                    <div className="text-xl font-bold uppercase tracking-tight mb-1">{m.value}</div>
                    <div className="font-mono text-[8px] text-white/20 tracking-wider group-hover:text-white/40 transition-colors uppercase">{m.detail}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Left: Technical Visual */}
          <div className="flex-1 w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="relative aspect-16/10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]"
            >
              <img src={missionHealth} alt="Mission Status Dashboard Visual" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/60 border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[8px] text-white/60 uppercase font-black tracking-widest">GCP Live Telemetry</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
