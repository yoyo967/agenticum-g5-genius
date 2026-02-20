import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Shield, Terminal, Cpu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOG_MESSAGES = [
  { agent: 'Orchestrator', message: 'Initiating campaign framework for "Quantum Leap 2026". Strategy needs real-time grounding.', status: 'info' },
  { agent: 'Strategist', message: 'Analyzing market sentiment oscillators. Detected 15% surge in sustainable tech demand.', status: 'success' },
  { agent: 'Orchestrator', message: 'Synthesizing visual intent. Requesting Imagen 3: "Cinematic, high-fidelity neural-core".', status: 'request' },
  { agent: 'Auditor', message: 'Visual proposal: Critical quality check in progress. Variance 0.02%. Proceeding.', status: 'warning' },
  { agent: 'Strategist', message: 'Refining copy. Neural TTS synthesis ready for instant production.', status: 'success' },
  { agent: 'Orchestrator', message: 'Campaign package verified. Zero-friction deployment ready.', status: 'done' },
];

// Generate stable IDs outside components or in a stable way
const STABLE_LOG_IDS = LOG_MESSAGES.map((_, i) => `G5-LOG-${i}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`);

export function SynergisticDialogue() {
  const [messages, setMessages] = useState<typeof LOG_MESSAGES>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < LOG_MESSAGES.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, LOG_MESSAGES[index]]);
        setIndex((i) => i + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setMessages([]);
        setIndex(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div className="w-full h-[400px] glass rounded-3xl overflow-hidden flex flex-col font-mono text-sm border border-white/5 relative">
      <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40">
          <Terminal size={14} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Neural Dialogue Log</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-none">
        <AnimatePresence>
          {messages.map((log, i) => (
            <motion.div
              key={`${log.agent}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-4 items-start group"
            >
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                log.agent === 'Orchestrator' && "bg-neural-blue/10 text-neural-blue",
                log.agent === 'Strategist' && "bg-purple-500/10 text-purple-400",
                log.agent === 'Auditor' && "bg-neural-gold/10 text-neural-gold",
              )}>
                {log.agent === 'Orchestrator' && <Cpu size={14} />}
                {log.agent === 'Strategist' && <Bot size={14} />}
                {log.agent === 'Auditor' && <Shield size={14} />}
              </div>
              <div className="flex flex-col gap-1 group/item">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-tighter opacity-70 group-hover/item:text-neural-blue transition-colors">{log.agent}</span>
                  <span className="text-[8px] opacity-20">SYSTEM_CORE_G5_LOG_ID: {STABLE_LOG_IDS[i]}</span>
                </div>
                <p className="text-white/80 leading-relaxed max-w-xl group-hover:text-white transition-colors relative">
                  {log.message}
                  <span className="absolute -right-4 top-0 opacity-0 group-hover/item:opacity-100 transition-opacity text-[8px] text-neural-blue/60 font-bold whitespace-nowrap">
                    VERIFIED_VIA_G5_SUBSTRATE // {new Date().toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-50">
        <span className="w-1.5 h-1.5 rounded-full bg-neural-blue animate-pulse" />
        <span className="text-[10px] uppercase tracking-tighter font-bold text-neural-blue">G5 Active</span>
      </div>
    </div>
  );
}
