import { motion, AnimatePresence } from 'framer-motion';
import type { ActivityEntry } from './activityUtils';

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

const TYPE_COLORS: Record<string, string> = {
  dispatch: 'text-blue-400',
  action: 'text-zinc-400',
  senate: 'text-yellow-400',
  output: 'text-green-400',
  error: 'text-red-400',
};

export function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-6 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          LIVE ACTIVITY FEED
        </span>
        <span className="ml-auto font-mono text-xs text-zinc-700">
          {entries.length} EVENTS
        </span>
      </div>

      {/* Log */}
      <div className="bg-black p-4 font-mono text-xs flex flex-col gap-1.5 max-h-48 overflow-y-auto">
        <AnimatePresence initial={false}>
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3"
            >
              <span className="text-green-600 shrink-0">[{entry.time}]</span>
              <span className={`shrink-0 font-bold ${TYPE_COLORS[entry.type ?? 'action'] ?? 'text-zinc-400'}`}>
                {entry.agent}
              </span>
              <span className="text-zinc-500">→</span>
              <span className="text-zinc-300">{entry.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
