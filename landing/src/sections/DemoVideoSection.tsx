import React from 'react';
import { motion } from 'framer-motion';
import { Film, Play, Sparkles, Cpu, Mic2 } from 'lucide-react';
import cinematicForge from '../assets/g5_cinematic_forge.png';

export const DemoVideoSection: React.FC = () => (
  <section id="demo" className="py-40 px-6 bg-black/40 border-t border-white/5 relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-[1200px] mx-auto">
      <div className="text-center mb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="badge badge-processing mb-6 mx-auto w-fit">
          <Film size={10} /> Multimodal Creativity · The Video Factory
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white brightness-125 mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
          Cinematic<br />
          <span className="text-magenta">Forge.</span>
        </motion.h2>
        <p className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          VE-01 Orchestrierung von Storyboards & Szenen-Planung. Photorealistische 5-Shot Sequenzen via Imagen 3.
          Emotionale Sprachausgabe via Google Cloud TTS.
        </p>
      </div>

      {/* Cinematic Forge Visual */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/60 mb-24 aspect-video">
        <img src={cinematicForge} alt="Cinematic Forge Workflow" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-bottom justify-center p-12">
           <div className="w-full flex justify-between items-end">
             <div className="flex gap-4">
               <div className="glass px-4 py-2 rounded border border-white/10 text-[10px] uppercase font-black tracking-widest text-white/60">Timeline Assembly</div>
               <div className="glass px-4 py-2 rounded border border-white/10 text-[10px] uppercase font-black tracking-widest text-emerald">Data Optimized</div>
             </div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               className="w-16 h-16 rounded-full bg-magenta/20 border border-magenta/40 flex items-center justify-center text-magenta shadow-[0_0_20px_rgba(236,72,153,0.3)]">
               <Play size={24} fill="currentColor" />
             </motion.button>
           </div>
        </div>
      </motion.div>

      {/* Technical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Cpu className="text-accent" />, label: "VE-01 Motion", desc: "Storyboard to Scene pipeline orchestration." },
          { icon: <Sparkles className="text-magenta" />, label: "Imagen 3", desc: "Hyper-realistic pixel synthesis for every frame." },
          { icon: <Mic2 className="text-amber-400" />, label: "Neural Audio", desc: "Emotional-synthetic TTS for cinematic narration." },
        ].map(item => (
          <div key={item.label} className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 className="text-white font-black uppercase text-sm mb-2">{item.label}</h3>
            <p className="text-white/40 text-xs font-mono leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
