import { motion } from 'framer-motion';
import { Brain, Layers, Shield, Zap, TrendingUp, Cpu, Globe } from 'lucide-react';

export function ApexContentSection() {
  const content = [
    {
      title: "The Evolution: From Chatbot to Sovereign OS",
      text: "Agenticum G5 is not just an interface; it is an autonomous marketing ecosystem. We have moved past the era of simple chat prompts. G5 represents the transition from a passive tool to a proactive Digital Advertising Agency in a box — capable of steering multi-layer campaigns via voice alone.",
      icon: <TrendingUp className="text-accent" />,
      color: "cyan"
    },
    {
      title: "The Ecosystem: Nexus & Sovereign",
      text: "The Agenticum architecture rests on two pillars. The NEXUS is your tactical cockpit — a high-fidelity dashboard for real-time visualization. SOVEREIGN is the Intelligence itself: the G5 Sovereign Engine that fuses your vision with technical congruence to maintain 'Maximal Excellence' across all assets.",
      icon: <Layers className="text-neural-gold" />,
      color: "gold"
    },
    {
      title: "Kinetic Flow: Parallelism Over Queuing",
      text: "Traditional AI tools work in sequence: one prompt, one answer. Agenticum G5 utilizes Parallel Swarm execution. While CC-06 is writing your semantic strategy, DA-03 is forging visuals, SP-01 is scanning competitors, and RA-01 is auditing for compliance — simultaneously. Speed is our primary currency.",
      icon: <Zap className="text-magenta" />,
      color: "magenta"
    },
    {
      title: "Integrity: The Senate Tribunal",
      text: "Excellence requires governance. The Security Senate (RA-01) functions as an adversarial tribunal. Every generation is audited against the EU AI Act, GDPR, and brand-specific commandments before it ever reaches the user. This is zero-hallucination marketing for the enterprise.",
      icon: <Shield className="text-emerald" />,
      color: "emerald"
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
                The <span className="text-accent italic">Genius</span> <br /> Manifesto.
              </h2>
              <p className="font-mono text-sm text-white/40 leading-relaxed mb-10 max-w-sm">
                A definitive guide to the AGENTICUM G5 Intelligence Fabric. 
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

          {/* Right: Content Cards */}
          <div className="lg:w-2/3 space-y-12">
            {content.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-10 group relative hover:border-white/20 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-mono text-sm text-white/50 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/5 uppercase tracking-widest font-black">
                  PHASE 18 // MAX_INT
                </div>
              </motion.div>
            ))}

            {/* Final Content Summary - The 7 Specialists Summary */}
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
                    { id: 'SN00', role: 'Orchestrator' },
                    { id: 'SO00', role: 'Sovereign' },
                    { id: 'SP01', role: 'Strategist' },
                    { id: 'CC06', role: 'Copywriter' },
                    { id: 'DA03', role: 'Visual AI' },
                    { id: 'BA07', role: 'Deep-Intel' },
                    { id: 'VE01', role: 'Motion' },
                    { id: 'RA01', role: 'Auditor' }
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
