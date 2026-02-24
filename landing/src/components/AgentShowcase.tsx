import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, PenTool, Image as ImageIcon, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AGENTS = [
  {
    id: "sn00",
    role: "Neural Orchestrator",
    description: "The commanding node. Translates user briefs into parallelized sub-tasks. Masters the Boydian OODA loop for rapid decision making.",
    color: "#00e5ff",
    icon: Network,
    stats: { latency: "42ms", success: "99.9%" }
  },
  {
    id: "sp01",
    role: "Strategic Intelligence",
    description: "The strategic brain. Runs market analysis and competitive scavenging using the Columna Radar for real-time monitoring.",
    color: "#8b5cf6",
    icon: Cpu,
    stats: { latency: "120ms", success: "98.5%" }
  },
  {
    id: "cc06",
    role: "Cognitive Core",
    description: "The hyper-creative copywriter. Drafts semantic SEO articles, brand scripts, and conversion copy following the 'Ogilvy Commandments'.",
    color: "#10b981",
    icon: PenTool,
    stats: { latency: "85ms", success: "96.2%" }
  },
  {
    id: "da03",
    role: "Design Architect",
    description: "The visual artist. Hardwired to Vertex AI Imagen 3 to forge fotorealistic Studio-Assets based on Bauhaus design principles.",
    color: "#ec4899",
    icon: ImageIcon,
    stats: { latency: "140ms", success: "94.0%" }
  },
  {
    id: "ba07",
    role: "Browser Architect",
    description: "The deep-intel specialist. Uses a 5-layer brain and Playwright for autonomous web interaction and zero-day intelligence.",
    color: "#f59e0b",
    icon: Network, // Update with appropriate icon if needed
    stats: { latency: "150ms", success: "97.8%" }
  },
  {
    id: "ve01",
    role: "Motion Director",
    description: "The cinematic architect. Orchestrates the Cinematic Forge pipeline to transform storyboards into high-fidelity motion assets.",
    color: "#ef4444",
    icon: Cpu, // Update with appropriate icon if needed
    stats: { latency: "200ms", success: "95.5%" }
  },
  {
    id: "ra01",
    role: "Security Senate",
    description: "The adversarial algorithm. Reviews every output against GDPR, EU AI Act, and brand safety guidelines before release.",
    color: "#ef4444",
    icon: ShieldCheck,
    stats: { latency: "65ms", success: "100%" }
  }
];

export const AgentShowcase = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-20 px-6">
        <h2 className="text-5xl md:text-7xl font-display font-black mb-6 uppercase italic tracking-tighter">
          Meet The Swarm.
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto text-xl font-light italic leading-relaxed">
          Five purpose-built AI agents, each an absolute specialist. <br className="hidden md:block"/> 
          Together, they form an unstoppable creative matrix.
        </p>
      </div>

      {/* Grid container with horizontal scroll snapping on mobile */}
      <div className="flex md:grid md:grid-cols-5 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-6 pb-12 hide-scrollbar">
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="shrink-0 snap-center w-[280px] md:w-auto glass p-6 md:p-8 rounded-2xl border border-white/5 bg-black/40 hover:bg-black/80 transition-all group relative overflow-hidden flex flex-col h-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-default"
          >
            {/* Top gradient glow */}
            <div 
              className="absolute top-0 left-0 w-full h-1 opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: agent.color, boxShadow: `0 0 20px ${agent.color}` }}
            />
            
            <div className="flex items-center justify-between mb-4">
              <span 
                className="text-2xl font-black uppercase tracking-widest"
                style={{ color: agent.color }}
              >
                {agent.id}
              </span>
              <div 
                className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform"
                style={{ color: agent.color }}
              >
                <agent.icon size={24} />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-6">
              <span className="text-[9px] uppercase font-black tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded bg-white/5">Gemini 2.0 Flash</span>
              <span className="text-[9px] uppercase font-black tracking-widest text-green-500 flex items-center gap-1.5 border border-green-500/20 px-2 py-1 rounded bg-green-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> ONLINE
              </span>
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 h-10">
              {agent.role}
            </h3>
            
            <p className="text-white/40 font-light text-sm leading-relaxed italic mb-8 grow">
              {agent.description}
            </p>

            <div className="pt-6 border-t border-white/5 mt-auto grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-white/30 mb-1">Latency</span>
                <span className="font-mono text-xs text-white">{agent.stats.latency}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] uppercase tracking-widest text-white/30 mb-1">Success</span>
                <span className="font-mono text-xs text-green-500">{agent.stats.success}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/os?module=swarm-analytics&agent=${agent.id.toLowerCase()}`)}
              className="w-full py-3 rounded border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-neural-blue/30 hover:bg-neural-blue/10 transition-all flex items-center justify-center gap-2 group-hover:border-white/20 mt-auto"
            >
              View in OS →
            </button>

          </motion.div>
        ))}
      </div>
    </div>
  );
};
