import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ConsciousnessStream: React.FC = () => {
  const { globalThoughts, addGlobalThought } = useAppStore();

  useEffect(() => {
    // Listen for agent-thought and other raw events
    const handleThought = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      addGlobalThought({
        id: Math.random().toString(36).substr(2, 9),
        agentId: detail.agentId || 'SYSTEM',
        text: detail.thought || detail.message || 'Processing cognitive node...',
        type: 'thought'
      });
    };

    window.addEventListener('agent-thought', handleThought);
    window.addEventListener('swarm-payload', handleThought);
    
    return () => {
      window.removeEventListener('agent-thought', handleThought);
      window.removeEventListener('swarm-payload', handleThought);
    };
  }, [addGlobalThought]);

  return (
    <div className="fixed bottom-12 right-12 w-80 z-50 pointer-events-none">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2 px-2">
           <div className="w-1.5 h-1.5 rounded-full bg-neural-blue animate-pulse" />
           <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">Sentient Stream</span>
        </div>
        <AnimatePresence initial={false}>
          {globalThoughts.slice(0, 10).map((frag) => (
            <motion.div
              key={frag.id}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
              className="ultra-lucid p-3 border-neural-blue/10 bg-black/40 backdrop-blur-3xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-black p-0.5 bg-neural-blue/20 text-neural-blue rounded uppercase tracking-tighter">[{frag.agentId}]</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <p className="text-[10px] text-white/60 font-mono leading-relaxed truncate-3-lines">
                {frag.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
