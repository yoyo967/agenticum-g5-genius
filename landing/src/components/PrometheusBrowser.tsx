import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Shield, Zap, ExternalLink, Layers } from 'lucide-react';

export function PrometheusBrowser() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [researchLogs, setResearchLogs] = useState<{ text: string; source: string; timestamp: string }[]>([
    { text: "Detected shift from manual SEO to agentic clustering. Global market is moving towards multi-model orchestration.", source: "market-intel.nexus", timestamp: new Date().toLocaleTimeString() },
    { text: "Technical paradigm audit reveals significant 'Latency-Stall' in legacy competitor dashboards.", source: "tech-audit.log", timestamp: new Date().toLocaleTimeString() }
  ]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id === 'prom07' || detail?.agentId === 'prom07') {
        const message = detail.lastStatus || detail.thought || detail.message;
        if (message) {
          setResearchLogs(prev => [
            { text: message, source: 'PROMETHEUS_LIVE_STREAM', timestamp: new Date().toLocaleTimeString() },
            ...prev
          ].slice(0, 10));
        }
      }
    };
    window.addEventListener('swarm-status', handler);
    window.addEventListener('swarm-payload', handler);
    return () => {
      window.removeEventListener('swarm-status', handler);
      window.removeEventListener('swarm-payload', handler);
    };
  }, []);

  const researchLayers = [
    { title: "Layer 1: Competitive Scavenging", status: "Active", details: "Scanned competitor sitemaps. Identifying structural gaps." },
    { title: "Layer 2: Technical Paradigm Audit", status: "Active", details: "Analyzing technology stacks via Wappalyzer signatures. Detecting Legacy-Stall." },
    { title: "Layer 3: Global Grounding", status: "Active", details: "Verifying factual claims via Google Search Grounding engine." },
    { title: "Layer 4: Nexus Synthesis", status: "Active", details: "Fusing findings into SO-00 Sovereign Core for strategic redirection." },
    { title: "Layer 5: White Space Discovery", status: "Synthesizing", details: "Detecting untapped market vectors." }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 glass rounded-[40px] border border-white/5 bg-obsidian/60 relative overflow-hidden group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neural-blue/10 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Browser Feed */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <Search size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-black uppercase tracking-tight">Prometheus <span className="text-accent">Browser</span></h3>
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Deep Research Intelligence</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-processing px-3 py-1.5"><Shield size={10} /> Grounded</span>
              <span className="badge badge-online px-3 py-1.5"><Zap size={10} /> Scavenging</span>
            </div>
          </div>

          <div className="glass-card p-6 border-white/10 bg-black/40 h-[400px] overflow-y-auto scrollbar-hide space-y-6">
            {researchLogs.map((log, i) => (
              <div key={i} className={`pb-6 border-b border-white/5 ${i > 0 ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-2 text-accent/80 font-mono text-[10px] uppercase tracking-widest mb-3">
                  <Globe size={12} /> Source: {log.source}
                </div>
                <p className="text-white/60 text-sm font-mono leading-relaxed italic">
                  "{log.text}"
                </p>
                <div className="mt-4 flex gap-4">
                  <div className="text-[10px] font-mono text-white/30 truncate max-w-[200px]">TIMESTAMP: {log.timestamp}</div>
                  <ExternalLink size={10} className="text-white/20" />
                </div>
              </div>
            ))}
            
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 text-accent/40 font-mono text-[10px] uppercase tracking-[0.4em]"
            >
              <Layers size={12} /> Layer 5 Scavenge in progress
            </motion.div>
          </div>
        </div>

        {/* 5-Layer Brain Visualization */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="space-y-4">
            {researchLayers.map((layer, idx) => (
              <motion.div 
                key={idx}
                onMouseEnter={() => setActiveLayer(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-crosshair group/item ${
                  activeLayer === idx 
                    ? 'bg-accent/10 border-accent/40 shadow-[0_0_30px_rgba(0,229,255,0.1)]' 
                    : 'bg-white/5 border-white/5 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${activeLayer === idx ? 'text-accent' : 'text-white/40'}`}>
                    {layer.title}
                  </span>
                  {activeLayer === idx && (
                    <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                </div>
                {activeLayer === idx && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-white/60 font-mono leading-relaxed"
                  >
                    {layer.details}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 glass rounded-2xl border-accent/20 bg-accent/5 text-center">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] block mb-2">Current Genius Score</span>
            <div className="text-4xl font-display font-black text-accent">98.4</div>
            <div className="mt-2 text-[8px] font-mono text-accent/60 uppercase tracking-widest italic">Recursive Refinement Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
