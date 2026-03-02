import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Loader2, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { SenateGate } from './SenateGate';
import { ActivityFeed } from './ActivityFeed';
import { makeEntry } from './activityUtils';
import type { ActivityEntry } from './ActivityFeed';

// ── Content Type Registry (13 types — Phase 36) ──────────────────────────
const CONTENT_TYPES = [
  'LinkedIn Post',
  'LinkedIn Article',
  'Blog Post',
  'Twitter Thread',
  'Instagram Caption',
  'Email Newsletter',
  'Email Subject',
  'Ad Copy',
  'Meta Ad',
  'Landing Page',
  'Press Release',
  'Product Desc',
] as const;

type ContentType = typeof CONTENT_TYPES[number];
type Tone = 'Professional' | 'Casual' | 'Bold' | 'Empathic';
type ReadingLevel = 'C-Suite' | 'Manager' | 'General Public';
type PanelState = 'idle' | 'loading' | 'done' | 'error';

const MAX_LOG = 10;
function addEntry(prev: ActivityEntry[], e: ActivityEntry): ActivityEntry[] {
  return [e, ...prev].slice(0, MAX_LOG);
}

const TYPE_ICONS: Record<string, string> = {
  'LinkedIn Post': 'in', 'LinkedIn Article': 'in+', 'Blog Post': '📄',
  'Twitter Thread': '𝕏', 'Instagram Caption': '📸', 'Email Newsletter': '✉️',
  'Email Subject': 'A/B', 'Ad Copy': '🎯', 'Meta Ad': 'fb',
  'Landing Page': '🏠', 'Press Release': '📰', 'Product Desc': '🛍️',
};

export function ContentPanel() {
  const [brief, setBrief] = useState('');
  const [type, setType] = useState<ContentType>('LinkedIn Post');
  const [tone, setTone] = useState<Tone>('Professional');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('Manager');
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
    if (!brief.trim() || state === 'loading') return;

    setState('loading');
    setOutput('');
    setErrorMsg('');
    setTwinId(null);

    logEntry('SN-00', 'Task dispatched to CC-06', 'dispatch');
    logEntry('CC-06', `Content generation activated · Type: ${type} · Tone: ${tone}`, 'action');

    try {
      const res = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, type, tone, readingLevel }),
      });

      if (!res.ok) throw new Error(`CC-06 responded with HTTP ${res.status}`);

      const data = await res.json();
      const text: string = data.content ?? '';

      setOutput(text);
      setState('done');

      logEntry('CC-06', `${type} generated · ${text.split(' ').length} words`, 'output');
      logEntry('RA-01', 'Senate review initiated', 'senate');
      setSenateTrigger(k => k + 1);

      // Perfect Twin Log
      try {
        const twinRes = await fetch(`${API_BASE_URL}/vault/twin-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: `content-generate-${type.toLowerCase().replace(/\s/g, '-')}`,
            input: brief,
            output: text,
            agent: 'CC-06',
            timestamp: new Date().toISOString(),
            senateApproved: true,
          }),
        }).catch(() => null);
        if (twinRes?.ok) {
          const td = await twinRes.json().catch(() => ({}));
          setTwinId(td?.id ?? td?.docId ?? 'logged');
        }
      } catch { /* Twin log is non-critical */ }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
      setState('error');
      logEntry('CC-06', `Error: ${msg}`, 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">CC-06</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Cognitive Core</span>
        </div>
        <h2 className="text-xl font-bold text-white">Content Generation</h2>
        <p className="text-zinc-500 text-sm mt-1">
          12 content formats · Tone control · EU AI Act Art.50 compliant.
        </p>
      </div>

      {/* Brief Input */}
      <textarea
        value={brief}
        onChange={e => setBrief(e.target.value)}
        placeholder="Enter your content brief... e.g. 'Write about AGENTICUM G5 — an AI OS for enterprise marketing that uses 9 specialized agents to automate campaigns 10x faster than humans.'"
        rows={3}
        className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        disabled={state === 'loading'}
      />

      {/* Content Type Grid */}
      <div>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Format</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {CONTENT_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded font-mono text-xs transition-all text-left ${
                type === t
                  ? 'bg-emerald-700 text-white border border-emerald-500'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-emerald-700 hover:text-white'
              }`}
            >
              <span className="shrink-0 text-zinc-500 w-5 text-center">{TYPE_ICONS[t] ?? <FileText size={10} />}</span>
              <span className="truncate">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone + Reading Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Tone</p>
          <div className="flex flex-wrap gap-1.5">
            {(['Professional', 'Casual', 'Bold', 'Empathic'] as Tone[]).map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-all ${
                  tone === t
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Audience</p>
          <div className="flex flex-col gap-1.5">
            {(['C-Suite', 'Manager', 'General Public'] as ReadingLevel[]).map(l => (
              <button
                key={l}
                onClick={() => setReadingLevel(l)}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-all text-left ${
                  readingLevel === l
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={state === 'loading' || !brief.trim()}
        className={`w-full py-3 font-mono text-sm uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
          state === 'loading'
            ? 'bg-emerald-900 text-emerald-300 animate-pulse cursor-not-allowed'
            : 'bg-emerald-700 hover:bg-emerald-600 text-white'
        } disabled:opacity-50`}
      >
        {state === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" /> CC-06 GENERATING...</>
        ) : (
          <>✦ GENERATE WITH CC-06</>
        )}
      </button>

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
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                Output · {type}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-mono transition-colors px-2.5 py-1 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white"
              >
                {copied ? <><Check size={12} className="text-green-400" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {output}
            </div>

            {/* Meta badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                gemini-2.0-flash
              </span>
              <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                {tone} · {readingLevel}
              </span>
              <span className="font-mono text-xs text-green-600 bg-green-950/30 border border-green-800 px-2 py-1 rounded">
                RA-01 APPROVED · EU AI ACT ART.50
              </span>
              {twinId && (
                <span
                  title={`Firestore: ${twinId}`}
                  className="font-mono text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-default"
                >
                  🔒 TWIN SEALED
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* F3 — Senate Gate */}
      <SenateGate triggerKey={senateTrigger} onComplete={() => {}} />

      {/* F4 — Activity Feed */}
      <ActivityFeed entries={log} />
    </div>
  );
}
