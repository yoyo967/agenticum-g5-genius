import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Shield, Zap, Film, Palette } from 'lucide-react';

const AGENTS = [
  { id: 'SN-00', name: 'Orchestrator', icon: Bot, color: '#4285F4' },
  { id: 'SP-01', name: 'Strategist', icon: Zap, color: '#34A853' },
  { id: 'CC-06', name: 'Director', icon: Film, color: '#FBBC04' },
  { id: 'DA-03', name: 'Architect', icon: Palette, color: '#A855F7' },
  { id: 'RA-01', name: 'Auditor', icon: Shield, color: '#EA4335' }
];

const PROACTIVE_MESSAGES = [
  { agent: 'SN-00', text: "Neural Substrate initialized. G5 Core at 100% capacity." },
  { agent: 'SN-00', text: "Welcome to the Nexus. I've already begun triaging the session intent." },
  { agent: 'SP-01', text: "Strategic layers are ready. I'm detecting high-value potential in this environment." },
  { agent: 'RA-01', text: "Security and compliance audit passed. The Matrix is stable." },
  { agent: 'SN-00', text: "User detected. Initiating immediate synergy. How shall we evolve your vision today?" }
];

export const LivingAgents = () => {
  const [logs, setLogs] = useState<{ agent: string, text: string, id: number }[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < PROACTIVE_MESSAGES.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, { ...PROACTIVE_MESSAGES[index], id: Date.now() }]);
        setIndex(prev => prev + 1);
      }, index === 0 ? 1000 : 2500);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div className="fixed bottom-10 left-10 z-50 w-80 pointer-events-none">
      <AnimatePresence>
        {logs.map((log) => {
          const agent = AGENTS.find(a => a.id === log.agent);
          const Icon = agent?.icon || Bot;
          
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-3 glass p-4 pointer-events-auto border-l-2"
              style={{ borderLeftColor: agent?.color }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color: agent?.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  {agent?.name} // {log.agent}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-white/90">
                {log.text}
              </p>
            </motion.div>
          );
        }).slice(-3)}
      </AnimatePresence>
    </div>
  );
};
