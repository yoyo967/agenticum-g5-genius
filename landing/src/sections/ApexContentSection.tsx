import { motion } from 'framer-motion';
import { Brain, Cpu, Globe, Mic } from 'lucide-react';
import voiceWave from '../assets/g5_voice_autonomy.png';
import nexusSentience from '../assets/g5_nexus_sovereignty.png';
import neuralSwarm from '../assets/g5_neural_swarm.png';

export function ApexContentSection() {
  const content = [
    {
      title: "THE END OF THE TEXTBOX.",
      subtitle: "Status Quo: B2B dashboards are silent cockpits.",
      text: "'Click. Read. Type.' - The 2015 paradigm is dead. GenIUS G5 replaces reactive input with Voice-First autonomy. Tony Stark doesn't type. He speaks into the room, and the system acts.",
      image: voiceWave,
      tag: "VOICE-FIRST AUTONOMY",
      icon: <Mic className="text-accent" />
    },
    {
      title: "FROM CHATBOT TO SENTIENCE.",
      subtitle: "The Nexus Sovereignty Evolution.",
      text: "GenIUS G5 is not a passive bot. Nexus Sovereignty is built on three pillars: 1. Shared World State (all agents see the same reality), 2. Historical Memory (contextual awareness of past successes), and 3. Recursive Refinement (SN-00 audits its own plans).",
      image: nexusSentience,
      tag: "SENTIENCE EVOLUTION",
      icon: <Brain className="text-neural-gold" />
    },
    {
      title: "FROM HOMO FABER TO ARCHITEKTUS.",
      subtitle: "Eliminating Biological Glue and Cognitive Debt.",
      text: "The '2026 Shift' is fundamental. G5 transitions the operator from Homo Faber (tool user) to Homo Architektus (system architect). We pulverize 'cognitive debt' by replacing manual retrieval with a Sentient Mesh that understands intent before you even finish your sentence. No more acting as biological glue between disconnected silos.",
      image: neuralSwarm,
      tag: "SYSTEMIC ARCHITECTURE",
      icon: <Globe className="text-accent" />
    }
  ];

  return (
    <section className="py-40 px-6 relative overflow-hidden bg-obsidian">
      {/* Ambient background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-magenta/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Sticky Narrative */}
          <div className="lg:w-1/3 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-40"
            >
              <span className="label-active block mb-6">Maximal Intelligence Briefing</span>
              <h2 className="font-display font-black uppercase tracking-tighter text-6xl md:text-8xl leading-[0.85] mb-8">
                The <span className="text-accent italic">GenIUS</span> <br /> Manifesto.
              </h2>
              <p className="font-mono text-sm text-white/40 leading-relaxed mb-10 max-w-sm">
                A definitive guide to the GenIUS G5 Intelligence Fabric. 
                Deconstructing how a voice command becomes a global enterprise campaign 
                in under 60 seconds.
              </p>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 w-fit">
                <Brain className="text-accent animate-pulse" size={24} />
                <div>
                  <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">System Status</div>
                  <div className="text-xs font-mono text-accent font-black">SOVEREIGN_CORE_ACTIVE</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Feature Showcases */}
          <div className="lg:w-2/3 space-y-24">
            {content.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-accent/60 uppercase">{item.tag}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-display text-lg text-white/50 italic mb-6">{item.subtitle}</p>
                    <p className="font-mono text-sm text-white/40 leading-relaxed max-w-2xl mb-8">
                      {item.text}
                    </p>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]">
                    <img src={item.image} alt={item.title} className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-linear-to-t from-midnight/40 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Final Content Summary - The 7 Specialists Summary (Updated to 8) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] border border-accent/20 bg-accent/5 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                  <Cpu className="text-accent" /> The 8-Entity Swarm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { id: 'SN-00', role: 'Orchestrator' },
                    { id: 'SO-00', role: 'Sovereign' },
                    { id: 'SP-01', role: 'Strategist' },
                    { id: 'CC-06', role: 'Copywriter' },
                    { id: 'DA-03', role: 'Visual AI' },
                    { id: 'BA-07', role: 'Researcher' },
                    { id: 'VE-01', role: 'Motion' },
                    { id: 'RA-01', role: 'Senate & Intel' }
                  ].map(agent => (
                    <div key={agent.id} className="text-left">
                      <div className="text-[10px] font-black font-display text-accent mb-0.5">{agent.id}</div>
                      <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{agent.role}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Globe size={200} className="text-accent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
