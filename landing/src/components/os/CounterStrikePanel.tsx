import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENGINE_URL, API_BASE_URL } from '../../config';
import { SenateGate } from './SenateGate';
import { ActivityFeed } from './ActivityFeed';
import { makeEntry } from './activityUtils';
import type { ActivityEntry } from './ActivityFeed';

interface Competitor {
  name?: string;
  url?: string;
  h2_structure?: string[];
  overlap_score?: number;
  keywords?: string[];
  title?: string;
}

type PanelState = 'idle' | 'loading' | 'done' | 'error';

const MAX_LOG = 10;

function addEntry(prev: ActivityEntry[], entry: ActivityEntry): ActivityEntry[] {
  return [entry, ...prev].slice(0, MAX_LOG);
}

export function CounterStrikePanel() {
  const [topic, setTopic] = useState('');
  const [state, setState] = useState<PanelState>('idle');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [senateTrigger, setSenateTrigger] = useState(0);
  const [twinId, setTwinId] = useState<string | null>(null);
  const [log, setLog] = useState<ActivityEntry[]>([]);

  const logEntry = useCallback((agent: string, message: string, type: ActivityEntry['type'] = 'action') => {
    setLog(prev => addEntry(prev, makeEntry(agent, message, type)));
  }, []);

  const handleRun = async () => {
    if (!topic.trim()) return;

    setState('loading');
    setCompetitors([]);
    setErrorMsg('');
    setTwinId(null);

    logEntry('SN-00', 'Task dispatched to SP-01', 'dispatch');
    logEntry('SP-01', `Counter-Strike activated — topic: "${topic}"`, 'action');

    try {
      const url = `${ENGINE_URL}/engine/counter-strike?topic=${encodeURIComponent(topic)}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Engine responded with HTTP ${res.status}`);
      }

      const data = await res.json();

      // Normalize response — engine may return { overlap: [...] } or []
      const raw: Competitor[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.overlap)
        ? data.overlap
        : Array.isArray(data?.competitors)
        ? data.competitors
        : [];

      setCompetitors(raw);
      setState('done');

      logEntry('SP-01', `${raw.length} competitors identified`, 'output');
      logEntry('RA-01', 'Senate review initiated', 'senate');

      // Trigger Senate Gate sequence
      setSenateTrigger(k => k + 1);

      // F5 — Perfect Twin Log
      try {
        const twinRes = await fetch(`${API_BASE_URL}/api/v1/vault/twin-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'counter-strike',
            input: topic,
            output: raw,
            agent: 'SP-01',
            timestamp: new Date().toISOString(),
            senateApproved: true,
          }),
        }).catch(() => null);
        if (twinRes?.ok) {
          const twinData = await twinRes.json().catch(() => ({}));
          setTwinId(twinData?.id ?? twinData?.docId ?? 'logged');
        }
      } catch {
        // Twin log is non-critical
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
      setState('error');
      logEntry('SP-01', `Error: ${msg}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">SP-01</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Strategic Cortex</span>
        </div>
        <h2 className="text-xl font-bold text-white">Counter-Strike Analysis</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Real-time competitor intelligence via Google Search grounding.
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && state !== 'loading' && handleRun()}
          placeholder="Enter topic to analyze... e.g. AI Marketing Automation"
          className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          disabled={state === 'loading'}
        />
        <button
          onClick={handleRun}
          disabled={state === 'loading' || !topic.trim()}
          className={`px-6 py-2.5 font-mono text-xs uppercase tracking-widest rounded transition-all ${
            state === 'loading'
              ? 'bg-blue-900 text-blue-300 animate-pulse cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          } disabled:opacity-50`}
        >
          {state === 'loading' ? 'SP-01 SCANNING...' : 'RUN COUNTER-STRIKE'}
        </button>
      </div>

      {/* Error */}
      {state === 'error' && (
        <div className="border border-red-800 bg-red-950/40 rounded p-4 font-mono text-xs text-red-400">
          ❌ SP-01 ERROR: {errorMsg}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state === 'done' && competitors.length > 0 && (
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
                        {c.name ?? c.title ?? `Competitor ${i + 1}`}
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
                  {c.h2_structure && c.h2_structure.length > 0 && (
                    <div>
                      <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-1.5">
                        H2 Structure
                      </p>
                      <ul className="space-y-1">
                        {c.h2_structure.slice(0, 4).map((h, j) => (
                          <li key={j} className="text-xs text-zinc-400 flex gap-2">
                            <span className="text-zinc-700">—</span> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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

        {state === 'done' && competitors.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border border-zinc-800 bg-zinc-900 rounded p-6 text-center">
            <p className="font-mono text-xs text-zinc-500">
              SP-01 — No structured competitor data returned for this topic.
              The engine may be in fallback mode. Try a more specific topic.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* F3 — Senate Gate */}
      <SenateGate triggerKey={senateTrigger} onComplete={() => {}} />

      {/* F5 — Perfect Twin Badge */}
      {twinId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 group relative cursor-default w-fit">
          <span className="font-mono text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded">
            🔒 TWIN SEALED
          </span>
          <span className="absolute -top-7 left-0 hidden group-hover:block bg-zinc-800 px-2 py-1 rounded font-mono text-xs text-zinc-400 whitespace-nowrap">
            Firestore: {twinId}
          </span>
        </motion.div>
      )}

      {/* F4 — Activity Feed */}
      <ActivityFeed entries={log} />
    </div>
  );
}
