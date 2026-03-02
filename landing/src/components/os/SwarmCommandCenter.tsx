import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CounterStrikePanel } from './CounterStrikePanel';
import { ContentPanel } from './ContentPanel';

type ActivePanel = 'counter-strike' | 'content';

const PANELS: { id: ActivePanel; agent: string; label: string; subtitle: string; color: string }[] = [
  {
    id: 'counter-strike',
    agent: 'SP-01',
    label: 'Counter-Strike',
    subtitle: 'Competitor Intelligence',
    color: 'blue',
  },
  {
    id: 'content',
    agent: 'CC-06',
    label: 'Content Generation',
    subtitle: 'Cognitive Core Output',
    color: 'purple',
  },
];

export function SwarmCommandCenter() {
  const [active, setActive] = useState<ActivePanel>('counter-strike');

  return (
    <div className="h-full flex flex-col text-white">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-green-400 uppercase tracking-widest">
            SWARM OPERATIONAL · 8/8 NODES ACTIVE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Swarm Command Center</h1>
        <p className="text-zinc-500 text-sm">
          Activate agents directly. Real AI outputs. Live Senate review.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-0">
        {PANELS.map(panel => (
          <button
            key={panel.id}
            onClick={() => setActive(panel.id)}
            className={`relative px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
              active === panel.id
                ? 'text-white'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            <span className="mr-2 text-blue-500">{panel.agent}</span>
            {panel.label}
            {active === panel.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-px bg-blue-500"
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
            transition={{ duration: 0.2 }}
          >
            {active === 'counter-strike' && <CounterStrikePanel />}
            {active === 'content' && <ContentPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
