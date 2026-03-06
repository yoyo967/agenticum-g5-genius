import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFeedData } from '../hooks/useFeedData';

export const NexusFeed = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading: loading, error } = useFeedData(3);
  const [cognitiveThreads, setCognitiveThreads] = useState<{id: string, text: string, timeHex: string, iso: string}[]>([]);

  useEffect(() => {
    // Listen for real Nexus/Swarm events
    const handleNexusEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message || detail?.thought) {
        setCognitiveThreads(prev => {
          const now = new Date();
          const newItem = {
            id: Math.random().toString(36).substring(2, 11),
            text: detail.message || detail.thought,
            timeHex: now.getTime().toString(16),
            iso: now.toISOString()
          };
          const next = [newItem, ...prev];
          return next.slice(0, 4);
        });
      }
    };

    window.addEventListener('swarm-payload', handleNexusEvent);
    window.addEventListener('swarm-status', handleNexusEvent);
    
    return () => {
      window.removeEventListener('swarm-payload', handleNexusEvent);
      window.removeEventListener('swarm-status', handleNexusEvent);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-20 px-6">
      {/* Sentient Consciousness Stream */}
      <div className="mb-12 relative overflow-hidden rounded-2xl border border-white/5 bg-[#030303] p-6 lg:p-10 shadow-[0_0_50px_rgba(0,229,255,0.03)] group">
        {/* Deep CRT/Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%)] bg-size-[100%_4px] z-10 opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-linear-to-b from-transparent via-accent/5 to-transparent animate-[spin_6s_linear_infinite]" />
        
        <div className="relative z-20">
          <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Nexus Neural Stream</span>
            </div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest text-right">
              Raw Payload Data<br/>G5 Protocol Active
            </div>
          </div>
          
          <div className="flex flex-col gap-4 font-mono text-[10px] h-[340px] overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-full h-[100px] bg-linear-to-t from-[#030303] via-[#030303]/80 to-transparent z-10 pointer-events-none" />
            <AnimatePresence>
              {cognitiveThreads.map((thread, i) => {
                const isLatest = i === 0;
                return (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: isLatest ? 1 : 0.6 - (i * 0.15), y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`p-4 rounded-lg border shrink-0 ${isLatest ? 'border-accent/30 bg-accent/5' : 'border-white/5 bg-white/2'} relative`}
                  >
                    {isLatest && <div className="absolute left-0 top-0 w-1 h-full bg-accent animate-[pulse_2s_infinite]" />}
                    <div className="text-accent/60 mb-2 flex justify-between">
                      <span>{'{'}</span>
                      <span className="text-white/20">"{thread.timeHex}"</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      <div><span className="text-cyan-400">"event"</span>: <span className="text-emerald-400">"cognitive_pulse"</span>,</div>
                      <div><span className="text-cyan-400">"timestamp"</span>: <span className="text-yellow-400">"{thread.iso}"</span>,</div>
                      <div><span className="text-cyan-400">"payload"</span>: <span className="text-white/80">"{thread.text.replace(/"/g, '\\"')}"</span></div>
                    </div>
                    <div className="text-accent/60 mt-2">{'}'}</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-cyan-500/20 bg-black font-mono text-cyan-500/40 text-xs">
          FEED INITIALIZING... AWAITING FIRST INTELLIGENCE SYNC.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Staging/Loading State (wie gewünscht beibehalten, aber nur bei loading)
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border border-accent/20 bg-midnight animate-pulse rounded-xl">
              <p className="font-mono text-accent/50 text-xs mb-2">SYNCING NEURAL ARCHIVE // G5</p>
              <div className="h-4 bg-accent/20 rounded w-3/4 mb-4" />
              <div className="h-16 bg-accent/10 rounded w-full" />
            </div>
          ))
        ) : (
          articles.map((item) => (
            <div key={item.id} className="p-6 border border-white/10 bg-midnight hover:border-accent transition-colors group rounded-xl flex flex-col cursor-pointer" onClick={() => navigate(`/article/${item.id}`)}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded">
                  {item.category.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  SCORE: {item.senateScore}
                </span>
              </div>
              <h3 className="text-white font-display text-xl uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-white/40 text-sm font-mono leading-relaxed mb-4 grow">
                {item.excerpt}
              </p>
              <div className="text-xs font-mono text-emerald flex items-center gap-2 mt-auto">
                <div className="w-1.5 h-1.5 bg-emerald rounded-full shadow-[0_0_5px_rgba(0,255,136,0.6)] animate-pulse" />
                SOURCES VERIFIED
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
