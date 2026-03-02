import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Link2, Plus, Trash2, RefreshCw } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

interface SavedUTM extends UTMParams {
  id: string;
  fullUrl: string;
  createdAt: string;
}

const MEDIUM_PRESETS = ['cpc', 'email', 'social', 'organic', 'referral', 'display', 'affiliate'];
const SOURCE_PRESETS = ['linkedin', 'google', 'newsletter', 'twitter', 'facebook', 'instagram', 'partner'];
const CAMPAIGN_PRESETS   = ['brand-awareness', 'lead-gen', 'product-launch', 'retargeting', 'event'];

function buildUTM(p: UTMParams): string {
  if (!p.url.trim()) return '';
  const base = p.url.trim().replace(/\/$/, '');
  const params = new URLSearchParams();
  if (p.source.trim())   params.set('utm_source', p.source.trim().toLowerCase().replace(/\s+/g, '_'));
  if (p.medium.trim())   params.set('utm_medium', p.medium.trim().toLowerCase().replace(/\s+/g, '_'));
  if (p.campaign.trim()) params.set('utm_campaign', p.campaign.trim().toLowerCase().replace(/\s+/g, '_'));
  if (p.term.trim())     params.set('utm_term', p.term.trim().toLowerCase().replace(/\s+/g, '_'));
  if (p.content.trim())  params.set('utm_content', p.content.trim().toLowerCase().replace(/\s+/g, '_'));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

const EMPTY: UTMParams = { url: '', source: '', medium: '', campaign: '', term: '', content: '' };

// ─────────────────────────────────────────────────────────────────────────────
export function UTMGenerator() {
  const [params, setParams] = useState<UTMParams>(EMPTY);
  const [saved, setSaved]   = useState<SavedUTM[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const fullUrl = buildUTM(params);

  const set = (key: keyof UTMParams, value: string) =>
    setParams(prev => ({ ...prev, [key]: value }));

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const saveUTM = () => {
    if (!fullUrl) return;
    const entry: SavedUTM = {
      ...params,
      id: Date.now().toString(),
      fullUrl,
      createdAt: new Date().toLocaleString(),
    };
    setSaved(prev => [entry, ...prev].slice(0, 20));
  };

  const deleteUTM = (id: string) => setSaved(prev => prev.filter(u => u.id !== id));

  const reset = () => setParams(EMPTY);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-orange-400 uppercase tracking-widest">PM-07</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Campaign Manager</span>
        </div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 size={20} className="text-orange-400" /> UTM Generator
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Build tracking URLs for all channels. Auto-generated for every campaign link.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Builder ──────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Destination URL */}
          <div>
            <label className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
              Destination URL *
            </label>
            <input
              value={params.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://agenticum.com/campaign"
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2.5 rounded font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Source */}
          <div>
            <label className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
              utm_source <span className="text-zinc-700">(where traffic comes from)</span>
            </label>
            <input
              value={params.source}
              onChange={e => set('source', e.target.value)}
              placeholder="linkedin, google, newsletter"
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {SOURCE_PRESETS.map(s => (
                <button key={s} onClick={() => set('source', s)}
                  className="px-2 py-0.5 rounded font-mono text-[10px] border border-zinc-800 text-zinc-500 hover:border-orange-600 hover:text-orange-400 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Medium */}
          <div>
            <label className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
              utm_medium <span className="text-zinc-700">(channel type)</span>
            </label>
            <input
              value={params.medium}
              onChange={e => set('medium', e.target.value)}
              placeholder="cpc, email, social"
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {MEDIUM_PRESETS.map(m => (
                <button key={m} onClick={() => set('medium', m)}
                  className="px-2 py-0.5 rounded font-mono text-[10px] border border-zinc-800 text-zinc-500 hover:border-orange-600 hover:text-orange-400 transition-colors">
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign */}
          <div>
            <label className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">
              utm_campaign <span className="text-zinc-700">(campaign name)</span>
            </label>
            <input
              value={params.campaign}
              onChange={e => set('campaign', e.target.value)}
              placeholder="q1-brand-awareness"
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {CAMPAIGN_PRESETS.map(c => (
                <button key={c} onClick={() => set('campaign', c)}
                  className="px-2 py-0.5 rounded font-mono text-[10px] border border-zinc-800 text-zinc-500 hover:border-orange-600 hover:text-orange-400 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Term + Content (optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs text-zinc-600 uppercase tracking-widest block mb-1.5">utm_term <span className="text-zinc-700">(optional)</span></label>
              <input value={params.term} onChange={e => set('term', e.target.value)} placeholder="ai marketing" className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded font-mono text-xs placeholder:text-zinc-700 focus:outline-none focus:border-orange-600 transition-colors" />
            </div>
            <div>
              <label className="font-mono text-xs text-zinc-600 uppercase tracking-widest block mb-1.5">utm_content <span className="text-zinc-700">(optional)</span></label>
              <input value={params.content} onChange={e => set('content', e.target.value)} placeholder="hero-cta-v2" className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded font-mono text-xs placeholder:text-zinc-700 focus:outline-none focus:border-orange-600 transition-colors" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={saveUTM} disabled={!fullUrl}
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-mono text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5">
              <Plus size={13} /> Save UTM
            </button>
            <button onClick={reset}
              className="px-3 py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded transition-colors">
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* ── Live Preview ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Generated URL</p>
            <div className={`relative bg-zinc-900 border rounded-lg p-4 min-h-[80px] transition-colors ${fullUrl ? 'border-orange-700/50' : 'border-zinc-800'}`}>
              {fullUrl ? (
                <>
                  <p className="font-mono text-xs text-orange-300 break-all leading-relaxed pr-8">{fullUrl}</p>
                  <button onClick={() => copyUrl(fullUrl, 'preview')}
                    className="absolute top-3 right-3 p-1.5 border border-zinc-700 rounded hover:border-zinc-500 text-zinc-500 hover:text-white transition-colors">
                    {copied === 'preview' ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </>
              ) : (
                <p className="font-mono text-xs text-zinc-700">Enter destination URL and at least one parameter...</p>
              )}
            </div>
          </div>

          {/* Parameter breakdown */}
          {fullUrl && (
            <div className="space-y-1.5">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Parameter Breakdown</p>
              {[
                { key: 'utm_source',   value: params.source,   color: 'text-blue-400' },
                { key: 'utm_medium',   value: params.medium,   color: 'text-emerald-400' },
                { key: 'utm_campaign', value: params.campaign, color: 'text-orange-400' },
                { key: 'utm_term',     value: params.term,     color: 'text-purple-400' },
                { key: 'utm_content',  value: params.content,  color: 'text-pink-400' },
              ].filter(p => p.value.trim()).map(p => (
                <div key={p.key} className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-zinc-600 w-28">{p.key}</span>
                  <span className="text-zinc-700">=</span>
                  <span className={p.color}>{p.value.toLowerCase().replace(/\s+/g, '_')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Saved UTMs */}
          {saved.length > 0 && (
            <div>
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Saved Links ({saved.length})</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {saved.map(u => (
                    <motion.div key={u.id}
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 8 }}
                      className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg group">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] text-orange-400 truncate">{u.campaign || u.fullUrl}</p>
                        <p className="font-mono text-[9px] text-zinc-600 truncate">{u.source} · {u.medium} · {u.createdAt}</p>
                      </div>
                      <button onClick={() => copyUrl(u.fullUrl, u.id)}
                        className="shrink-0 p-1 text-zinc-600 hover:text-white transition-colors">
                        {copied === u.id ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                      </button>
                      <button onClick={() => deleteUTM(u.id)}
                        className="shrink-0 p-1 text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={11} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
