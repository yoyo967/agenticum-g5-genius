import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, X, AlertTriangle } from 'lucide-react';

export function ExecutiveIntervention() {
  const [activeIntervention, setActiveIntervention] = useState<{ taskId: string } | null>(null);
  const [directive, setDirective] = useState('');

  useEffect(() => {
    const handleIntervention = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setActiveIntervention(detail);
    };
    window.addEventListener('swarm-intervention', handleIntervention);
    return () => window.removeEventListener('swarm-intervention', handleIntervention);
  }, []);

  const handleSend = () => {
    if (!directive || !activeIntervention) return;
    
    window.dispatchEvent(new CustomEvent('send-intervention', {
      detail: {
        taskId: activeIntervention.taskId,
        directive,
        timestamp: Date.now()
      }
    }));
    
    setActiveIntervention(null);
    setDirective('');
  };

  if (!activeIntervention) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-obsidian-900/60 backdrop-blur-md p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg glass border-neural-gold/30 shadow-[0_0_100px_rgba(251,188,4,0.15)] overflow-hidden"
        >
          <div className="bg-neural-gold/10 border-b border-neural-gold/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-neural-gold" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-neural-gold">Executive Intervention</span>
                <span className="text-[10px] uppercase font-mono text-white/40 tracking-widest">Awaiting Sovereign Directive</span>
              </div>
            </div>
            <button 
              onClick={() => setActiveIntervention(null)}
              className="p-1 hover:bg-white/5 rounded transition-colors text-white/30 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4 p-4 rounded bg-white/5 border border-white/5 mb-6">
              <AlertTriangle size={20} className="text-neural-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Task [${activeIntervention.taskId}] Paused</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  The agent has requested executive guidance before proceeding. 
                  Provide a directive to override or refine the current trajectory.
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea 
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="Type executive directive here..."
                className="w-full h-32 bg-black/40 border-none rounded-xl p-4 text-sm font-mono focus:ring-1 focus:ring-neural-gold/40 placeholder:text-white/10 resize-none mb-6 capitalize-first"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
              />
              <div className="absolute bottom-10 right-4">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-white/20">⌘ + Enter</kbd>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setActiveIntervention(null)}
                className="flex-1 py-3 rounded border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Abort & Auto-Resume
              </button>
              <button 
                onClick={handleSend}
                disabled={!directive}
                className="flex-[1.5] py-3 rounded bg-neural-gold text-obsidian hover:bg-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,188,4,0.3)] disabled:opacity-30 disabled:shadow-none"
              >
                <Zap size={14} /> Inject Directive
              </button>
            </div>
          </div>

          <div className="bg-black/40 p-3 flex items-center justify-center">
             <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1 h-1 rounded-full bg-neural-gold"
                  />
                ))}
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
