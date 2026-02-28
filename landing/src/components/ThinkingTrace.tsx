import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface TraceLog {
  timestamp: string;
  agentId: string;
  action: string;
  detail: string;
}

export function ThinkingTrace() {
  const [logs, setLogs] = useState<TraceLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDispatch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newLog: TraceLog = {
        timestamp: new Date().toLocaleTimeString(),
        agentId: detail.agentId || 'SN-00',
        action: detail.action || 'DISPATCH',
        detail: detail.detail || JSON.stringify(detail),
      };
      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    window.addEventListener('swarm-dispatch', handleDispatch as EventListener);
    window.addEventListener('agent-thought', handleDispatch as EventListener);
    
    return () => {
      window.removeEventListener('swarm-dispatch', handleDispatch as EventListener);
      window.removeEventListener('agent-thought', handleDispatch as EventListener);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl border border-white/5 overflow-hidden font-mono text-[11px]">
      <div className="bg-white/5 p-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald" />
          <span className="text-emerald font-black uppercase tracking-widest">Real-Time Cognitive Trace</span>
        </div>
        <div className="text-[9px] text-white/20 uppercase">Monospace Protocol v2</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none" ref={scrollRef}>
        <AnimatePresence>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
              Awaiting neural activity to populate trace...
            </div>
          ) : (
            logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 border-b border-white/5 pb-2 last:border-0"
              >
                <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                <span className="text-accent uppercase w-16 shrink-0 font-black">[{log.agentId}]</span>
                <div className="flex-1">
                  <span className="text-emerald uppercase mr-2">{log.action}:</span>
                  <span className="text-white/60">{log.detail}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
