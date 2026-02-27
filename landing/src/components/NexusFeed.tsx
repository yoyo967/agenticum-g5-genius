import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFeedData } from '../hooks/useFeedData';

export const NexusFeed = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading: loading, error } = useFeedData(3);
  const [cognitiveThreads, setCognitiveThreads] = useState<string[]>([]);

  useEffect(() => {
    // Listen for real Nexus/Swarm events
    const handleNexusEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message || detail?.thought) {
        setCognitiveThreads(prev => {
          const next = [...prev, detail.message || detail.thought];
          return next.slice(-5);
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
      <div className="mb-12 border-b border-white/5 pb-8 overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60">Live Consciousness Stream // Sub-Cognitive fragments</span>
        </div>
        <div className="flex flex-col gap-2 font-mono text-[11px] h-[100px] mask-fade-y">
          <AnimatePresence>
            {cognitiveThreads.map((thread, i) => (
              <motion.div
                key={`${thread}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-white/40 italic"
              >
                <span className="text-accent/40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-white/60">»</span> {thread}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {error && <p className="text-magenta font-mono mb-8">CRITICAL ERROR: {error.message}</p>}

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
