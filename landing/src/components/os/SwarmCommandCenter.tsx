import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CounterStrikePanel } from './CounterStrikePanel';
import { ContentPanel } from './ContentPanel';
import { ImageGenPanel } from './ImageGenPanel';
import { ColumnaRadar } from './ColumnaRadar';

type ActivePanel = 'counter-strike' | 'content' | 'image-gen' | 'target-intel';

const PANELS: {
  id: ActivePanel;
  agent: string;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    id: 'counter-strike',
    agent: 'SP-01',
    label: 'Counter-Strike',
    color: 'text-blue-400',
    dot: 'bg-blue-500',
  },
  {
    id: 'target-intel',
    agent: 'BA-07',
    label: 'Target Intel',
    color: 'text-gold-400',
    dot: 'bg-gold-500',
  },
  {
    id: 'content',
    agent: 'CC-06',
    label: 'Content Gen',
    color: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    id: 'image-gen',
    agent: 'DA-03',
    label: 'Image Gen',
    color: 'text-purple-400',
    dot: 'bg-purple-500',
  },
];

export function SwarmCommandCenter() {
  const [active, setActive] = useState<ActivePanel>('counter-strike');

  const activeDot = PANELS.find(p => p.id === active)?.dot ?? 'bg-green-500';

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${activeDot} animate-pulse`} />
          <span className="font-mono text-xs text-green-400 uppercase tracking-widest">
            SWARM OPERATIONAL · 9/9 NODES ACTIVE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Swarm Command Center</h1>
        <p className="text-zinc-500 text-sm">
          Activate agents directly. Real AI outputs. Live Senate review.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-0 mb-8 border-b border-zinc-800 shrink-0">
        {PANELS.map(panel => (
          <button
            key={panel.id}
            onClick={() => setActive(panel.id)}
            className={`relative px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
              active === panel.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <span className={`mr-2 ${active === panel.id ? panel.color : 'text-zinc-700'}`}>
              {panel.agent}
            </span>
            {panel.label}
            {active === panel.id && (
              <motion.div
                layoutId="swarm-tab-indicator"
                className={`absolute bottom-0 left-0 right-0 h-px ${panel.dot.replace('bg-', 'bg-')}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Active Panel */}
      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            {active === 'counter-strike' && <CounterStrikePanel />}
            {active === 'target-intel' && <ColumnaRadar />}
            {active === 'content' && <ContentPanel />}
            {active === 'image-gen' && <ImageGenPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
