import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Cpu, ShieldCheck, Layers, Monitor, Network } from 'lucide-react';

const NEXUS_ITEMS = [
  {
    title: "Synergistic Dialogue",
    icon: Target,
    content: "AGENTICUM G5 GENIUS is the world's first voice-activated, vision-enabled AI creative agency. We shatter the text-box paradigm to deliver campaign assets in real-time conversation.",
    category: "Objective",
    color: "#00e5ff",
    route: "/os?module=campaign-hub"
  },
  {
    title: "Strategic Omniscience",
    icon: Cpu,
    content: "Five specialized agents (SN-00 to DA-03) working in parallel via the Google ADK. They see your vision, hear your brief, and build your future simultaneously.",
    category: "Intelligence",
    color: "#ffd700",
    route: "/os?module=swarm-analytics"
  },
  {
    title: "Hyper-Iterative Deployment",
    icon: ShieldCheck,
    content: "Built 100% on Google Cloud Native infrastructure. Gemini 2.0 Flash, Imagen 3, and Vertex AI. No compromises. No 3rd party black-boxes.",
    category: "Engineering",
    color: "#00ff88",
    route: "/os?module=workflows"
  },
  {
    title: "Security Senate",
    icon: Layers,
    content: "Innovation through real-time multi-agent orchestration. Orchestrated by SN-00, our substrate handles parallel strategy, audit, and creative execution.",
    category: "Justification",
    color: "#a855f7",
    route: "/os?module=senate"
  },
  {
    title: "Multi-Modal Mastery",
    icon: Monitor,
    content: "We pivoted from a simple showcase to a routed OS environment. The public Landing Page serves only as a gateway to the secure, internal Swarm Operations Dashboard.",
    category: "Architecture",
    color: "#ff0055",
    route: "/os?module=studio"
  },
  {
    title: "Autonomous Content Engine",
    icon: Network,
    content: "The Swarm doesn't just chat—it publishes. PM-07 continuously crawls for insights, commanding CC-06 to autonomously author and publish deeply connected SEO Pillar articles.",
    category: "Autonomy",
    color: "#ff9900",
    route: "/os?module=pillar-blog"
  }
];

export const ProjectNexus = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto py-20 px-6">
      {NEXUS_ITEMS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.8 }}
          className="glass p-10 group hover:border-neural-blue/20 transition-all cursor-default relative overflow-hidden"
        >
          {/* Subtle Color Glow */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 pointer-events-none"
            style={{ backgroundColor: item.color }}
          />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="p-4 rounded bg-white/5 group-hover:bg-white/10 transition-colors" style={{ color: item.color }}>
              <item.icon size={28} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              {item.category} // MATRIX.0{i+1}
            </span>
          </div>
          
          <h3 className="text-3xl font-display font-black mb-6 uppercase italic tracking-tight relative z-10">
            {item.title}
          </h3>
          
          <p className="text-white/40 leading-relaxed font-light italic text-lg relative z-10">
            {item.content}
          </p>

          <div className="mt-8 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-neural-blue animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-neural-blue">Substrate Active</span>
            </div>
            <button 
              onClick={() => navigate(item.route)}
              className="text-[10px] font-black uppercase tracking-widest text-white hover:text-neural-blue transition-colors flex items-center gap-1"
            >
              EXPLORE →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
