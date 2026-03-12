import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';
import { SenateGate } from './SenateGate';
import { ActivityFeed } from './ActivityFeed';
import { makeEntry, type ActivityEntry } from './activityUtils';
import { useAgentOutputs } from '../../hooks/useAgentOutputs';
import { useAgentStatus } from '../../hooks/useAgentStatus';
import { useSwarmRun } from '../../hooks/useSwarmRun';

interface Competitor {
  competitor?: string;
  name?: string;
  url?: string;
  their_h2_structure?: string[];
  overlap_score?: number;
  keywords?: string[];
}

export function CounterStrikePanel() {
  const [topic, setTopic] = useState('');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [senateTrigger, setSenateTrigger] = useState(0);
  
  // Neural Fabric Hooks
  const { outputs } = useAgentOutputs({ runId: activeRunId || undefined });
  const { statuses } = useAgentStatus();
  const { run } = useSwarmRun(activeRunId);

  // Derive competitors from BA-07 outputs
  const competitors = useMemo(() => {
    const browserOutput = outputs.find(o => o.agent_id === 'ba07' && o.type === 'competitors');
    if (browserOutput && Array.isArray(browserOutput.payload?.list)) {
      return browserOutput.payload.list as Competitor[];
    }
    return [];
  }, [outputs]);

  // Derive logs from active statuses and outputs
  const logs = useMemo(() => {
    const entries: ActivityEntry[] = [];
    
    // Add status updates from statuses
    Object.entries(statuses).forEach(([id, status]) => {
      if (status.run_id === activeRunId) {
        entries.push(makeEntry(id.toUpperCase(), status.message, 'action'));
      }
    });

    // Add final outputs
    outputs.forEach(o => {
      entries.push(makeEntry(o.agent_id.toUpperCase(), `Output generated: ${o.type}`, 'output'));
    });

    return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [statuses, outputs, activeRunId]);

  const handleRun = async () => {
    if (!topic.trim()) return;

    setErrorMsg('');
    setActiveRunId(null);

    try {
      const res = await fetch(`${API_BASE_URL}/swarm/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Perform complete competitive analysis and counter-strike strategy for topic: "${topic}"`
        }),
      });

      if (!res.ok) throw new Error(`Swarm launch failed with HTTP ${res.status}`);

      const data = await res.json();
      setActiveRunId(data.runId);
      setSenateTrigger(k => k + 1);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
    }
  };

  const isScanning = run && run.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">SP-01 + BA-07</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Live Matrix Intelligence</span>
        </div>
        <h2 className="text-xl font-bold text-white">Counter-Strike Analysis</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Real-time competitor intelligence via Swarm Orchestration and Google Search grounding.
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isScanning && handleRun()}
          placeholder="Enter topic to analyze... e.g. AI Marketing Automation"
          className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isScanning}
        />
        <button
          onClick={handleRun}
          disabled={isScanning || !topic.trim()}
          className={`px-6 py-2.5 font-mono text-xs uppercase tracking-widest rounded transition-all ${
            isScanning
              ? 'bg-blue-900 text-blue-300 animate-pulse cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          } disabled:opacity-50`}
        >
          {isScanning ? 'SWARM SCANNING...' : 'ACTIVATE SWARM'}
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="border border-red-800 bg-red-950/40 rounded p-4 font-mono text-xs text-red-400">
          ❌ SYSTEM ERROR: {errorMsg}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {competitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                {competitors.length} COMPETITORS IDENTIFIED
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {competitors.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 space-y-3"
                >
                  {/* Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-white text-sm">
                        {c.competitor ?? c.name ?? `Competitor ${i + 1}`}
                      </p>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs text-blue-500 hover:text-blue-400 break-all"
                        >
                          {c.url}
                        </a>
                      )}
                    </div>
                    {c.overlap_score !== undefined && (
                      <div className="shrink-0 text-right">
                        <span className="font-mono text-xs text-zinc-500">OVERLAP</span>
                        <p className="font-bold text-blue-400 font-mono text-sm">
                          {Math.round(c.overlap_score * 100)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* H2 Structure */}
                  {(() => {
                    const h2s = c.their_h2_structure ?? [];
                    return h2s.length > 0 ? (
                      <div>
                        <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-1.5">
                          H2 Structure
                        </p>
                        <ul className="space-y-1">
                          {h2s.slice(0, 4).map((h, j) => (
                            <li key={j} className="text-xs text-zinc-400 flex gap-2">
                              <span className="text-zinc-700">—</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}

                  {/* Keywords */}
                  {c.keywords && c.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.keywords.slice(0, 5).map((kw, j) => (
                        <span key={j} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 font-mono text-xs text-zinc-400 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {run && run.status === 'done' && competitors.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border border-zinc-800 bg-zinc-900 rounded p-6 text-center">
            <p className="font-mono text-xs text-zinc-500">
              Analysis complete. No structured competitor data found for this topic.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* F3 — Senate Gate */}
      <SenateGate triggerKey={senateTrigger} onComplete={() => {}} />

      {/* F4 — Activity Feed */}
      <ActivityFeed entries={logs} />
    </div>
  );
}
