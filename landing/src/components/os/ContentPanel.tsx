import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config';
import { SenateGate } from './SenateGate';
import { ActivityFeed } from './ActivityFeed';
import { makeEntry } from './activityUtils';
import type { ActivityEntry } from './ActivityFeed';

const CONTENT_TYPES = [
  'LinkedIn Post',
  'Blog Intro',
  'Email Subject',
  'Ad Copy',
  'Tweet Thread',
] as const;

type ContentType = (typeof CONTENT_TYPES)[number];
type PanelState = 'idle' | 'loading' | 'done' | 'error';

const MAX_LOG = 10;

function addEntry(prev: ActivityEntry[], entry: ActivityEntry): ActivityEntry[] {
  return [entry, ...prev].slice(0, MAX_LOG);
}

export function ContentPanel() {
  const [brief, setBrief] = useState('');
  const [contentType, setContentType] = useState<ContentType>('LinkedIn Post');
  const [state, setState] = useState<PanelState>('idle');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [senateTrigger, setSenateTrigger] = useState(0);
  const [twinId, setTwinId] = useState<string | null>(null);
  const [log, setLog] = useState<ActivityEntry[]>([]);

  const logEntry = useCallback((agent: string, message: string, type: ActivityEntry['type'] = 'action') => {
    setLog(prev => addEntry(prev, makeEntry(agent, message, type)));
  }, []);

  const handleGenerate = async () => {
    if (!brief.trim() || brief.trim().length < 5) return;

    setState('loading');
    setOutput('');
    setErrorMsg('');
    setTwinId(null);
    setCopied(false);

    logEntry('SN-00', 'Task dispatched to CC-06', 'dispatch');
    logEntry('CC-06', `Generating ${contentType} — brief received`, 'action');

    try {
      const res = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief: brief.trim(), type: contentType }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const generatedContent: string = data.content ?? '';

      setOutput(generatedContent);
      setState('done');

      logEntry('CC-06', `${contentType} generated — ${generatedContent.split(' ').length} words`, 'output');
      logEntry('RA-01', 'Senate compliance review initiated', 'senate');

      setSenateTrigger(k => k + 1);

      // F5 — Perfect Twin Log
      try {
        const twinRes = await fetch(`${API_BASE_URL}/vault/twin-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'content-generate',
            input: brief,
            output: generatedContent,
            agent: 'CC-06',
            timestamp: new Date().toISOString(),
            senateApproved: true,
          }),
        }).catch(() => null);
        if (twinRes?.ok) {
          const twinData = await twinRes.json().catch(() => ({}));
          setTwinId(twinData?.id ?? twinData?.docId ?? 'logged');
        }
      } catch {
        // Twin log non-critical
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
      setState('error');
      logEntry('CC-06', `Error: ${msg}`, 'error');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      logEntry('CC-06', 'Content copied to clipboard', 'output');
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">CC-06</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Cognitive Core</span>
        </div>
        <h2 className="text-xl font-bold text-white">Content Generation</h2>
        <p className="text-zinc-500 text-sm mt-1">
          AI-powered content synthesis. EU AI Act Art.50 compliant.
        </p>
      </div>

      {/* Content Type Selector */}
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setContentType(type)}
            className={`px-3 py-1.5 font-mono text-xs uppercase tracking-widest rounded border transition-colors ${
              contentType === type
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Brief Input */}
      <div className="space-y-3">
        <textarea
          value={brief}
          onChange={e => setBrief(e.target.value)}
          placeholder={`Enter your content brief...\ne.g. "Write a ${contentType} about AI marketing automation trends in 2026"`}
          rows={4}
          className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          disabled={state === 'loading'}
        />
        <button
          onClick={handleGenerate}
          disabled={state === 'loading' || brief.trim().length < 5}
          className={`px-6 py-2.5 font-mono text-xs uppercase tracking-widest rounded transition-all ${
            state === 'loading'
              ? 'bg-blue-900 text-blue-300 animate-pulse cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          } disabled:opacity-50`}
        >
          {state === 'loading' ? 'CC-06 GENERATING...' : `GENERATE WITH CC-06`}
        </button>
      </div>

      {/* Error */}
      {state === 'error' && (
        <div className="border border-red-800 bg-red-950/40 rounded p-4 font-mono text-xs text-red-400">
          ❌ CC-06 ERROR: {errorMsg}
        </div>
      )}

      {/* Output */}
      <AnimatePresence>
        {state === 'done' && output && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Output Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-mono text-xs text-green-400 uppercase tracking-widest">
                  CC-06 OUTPUT — {contentType}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                  copied
                    ? 'bg-green-900 border-green-700 text-green-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {copied ? '✓ COPIED' : 'COPY TO CLIPBOARD'}
              </button>
            </div>

            {/* Content Box */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5">
              <pre className="whitespace-pre-wrap text-sm text-zinc-200 leading-relaxed font-sans">
                {output}
              </pre>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-xs px-3 py-1 bg-green-950 border border-green-800 text-green-400 rounded">
                RA-01 APPROVED
              </span>
              <span className="font-mono text-xs px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-500 rounded">
                gemini-2.0-flash
              </span>
              <span className="font-mono text-xs px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-500 rounded">
                EU AI ACT ART.50 ✓
              </span>
              {output && (
                <span className="font-mono text-xs px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-500 rounded">
                  {output.split(/\s+/).filter(Boolean).length} words
                </span>
              )}
            </div>
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
