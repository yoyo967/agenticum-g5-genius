import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { SenateGate } from './SenateGate';
import { ActivityFeed } from './ActivityFeed';
import { makeEntry, type ActivityEntry } from './activityUtils';
import { useAgentOutputs } from '../../hooks/useAgentOutputs';
import { useAgentStatus } from '../../hooks/useAgentStatus';
import { useSwarmRun } from '../../hooks/useSwarmRun';

const STYLES = ['Photographic', 'Illustration', 'Flat Design', '3D Render', 'Cinematic'] as const;
const RATIOS = ['1:1', '16:9', '9:16', '3:1'] as const;
type StyleType = typeof STYLES[number];
type RatioType = typeof RATIOS[number];

const RATIO_LABELS: Record<RatioType, string> = {
  '1:1':  'Square · Social',
  '16:9': 'Landscape · Web',
  '9:16': 'Portrait · Story',
  '3:1':  'Banner · Header',
};

export function ImageGenPanel() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleType>('Photographic');
  const [ratio, setRatio] = useState<RatioType>('1:1');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [senateTrigger, setSenateTrigger] = useState(0);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  // Neural Fabric Hooks
  const { outputs } = useAgentOutputs({ runId: activeRunId || undefined });
  const { statuses } = useAgentStatus();
  const { run } = useSwarmRun(activeRunId);

  // Derive images from DA-03
  const images = useMemo(() => {
    const designOutput = outputs.find(o => o.agent_id === 'da03' && (o.type === 'images' || o.type === 'image'));
    if (designOutput && Array.isArray(designOutput.payload?.images)) {
      return designOutput.payload.images as string[];
    }
    return [];
  }, [outputs]);

  // Derive logs
  const logs = useMemo(() => {
    const entries: ActivityEntry[] = [];
    Object.entries(statuses).forEach(([id, status]) => {
      if (status.run_id === activeRunId) {
        entries.push(makeEntry(id.toUpperCase(), status.message, 'action'));
      }
    });
    outputs.forEach(o => {
      entries.push(makeEntry(o.agent_id.toUpperCase(), `Output generated: ${o.type}`, 'output'));
    });
    return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [statuses, outputs, activeRunId]);

  const handleGenerate = async () => {
    if (!prompt.trim() || activeRunId && run?.status === 'active') return;

    setErrorMsg('');
    setActiveRunId(null);
    setActiveImg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/swarm/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Generate ${style} image with ${ratio} aspect ratio for: "${prompt}"`
        }),
      });

      if (!res.ok) throw new Error(`DA-03 Orchestration failed with HTTP ${res.status}`);

      const data = await res.json();
      setActiveRunId(data.runId);
      setSenateTrigger(k => k + 1);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMsg(msg);
    }
  };

  const handleDownload = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `da03-image-${Date.now()}-${idx + 1}.jpg`;
    a.click();
  };

  const isGenerating = run && run.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-purple-400 uppercase tracking-widest">DA-03</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Design Architect</span>
        </div>
        <h2 className="text-xl font-bold text-white">Image Generation</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Text-to-Image via Imagen 3 · Brand-consistent visual asset production.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your image... e.g. 'A professional marketing team in a modern office using AI software, cinematic lighting'"
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          disabled={isGenerating}
        />
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Style Selector */}
        <div>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Style</p>
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                  style === s
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-purple-600 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-2">Aspect Ratio</p>
          <div className="flex flex-wrap gap-1.5">
            {RATIOS.map(r => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                  ratio === r
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-purple-600 hover:text-white'
                }`}
              >
                <span className="font-bold">{r}</span>
                <span className="text-zinc-500 ml-1 hidden sm:inline">· {RATIO_LABELS[r].split('·')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 font-mono text-sm uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
          isGenerating
            ? 'bg-purple-900 text-purple-300 animate-pulse cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500 text-white'
        } disabled:opacity-50`}
      >
        {isGenerating ? (
          <><Loader2 size={16} className="animate-spin" /> DA-03 ORCHESTRATING...</>
        ) : (
          <><Sparkles size={16} /> LAUNCH DA-03 SWARM</>
        )}
      </button>

      {/* Error */}
      {errorMsg && (
        <div className="border border-red-800 bg-red-950/40 rounded p-4 font-mono text-xs text-red-400">
          ❌ SYSTEM ERROR: {errorMsg}
        </div>
      )}

      {/* Image Results */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                {images.length} IMAGE{images.length !== 1 ? 'S' : ''} GENERATED
              </span>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                disabled={isGenerating}
              >
                <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} /> Regenerate
              </button>
            </div>

            {/* Image Grid */}
            <div className={`grid gap-3 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer"
                  onClick={() => setActiveImg(img)}
                >
                  {img.startsWith('data:') || img.startsWith('http') ? (
                    <img
                      src={img}
                      alt={`DA-03 Output ${i + 1}`}
                      className="w-full object-cover"
                      style={{ aspectRatio: ratio.replace(':', '/') }}
                    />
                  ) : (
                    <div
                      className="w-full flex items-center justify-center bg-zinc-800"
                      style={{ aspectRatio: ratio.replace(':', '/') }}
                    >
                      <div className="text-center p-6">
                        <ImageIcon size={32} className="text-purple-400 mx-auto mb-2" />
                        <p className="font-mono text-xs text-zinc-500">Imagen 3 Output</p>
                        <p className="font-mono text-xs text-zinc-600 mt-1">{style} · {ratio}</p>
                      </div>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); handleDownload(img, i); }}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded font-mono text-xs text-white transition-all"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                modelo: imagen-3.0-generate-002
              </span>
              <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                style: {style}
              </span>
              <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                ratio: {ratio}
              </span>
              <span className="font-mono text-xs text-green-600 bg-green-950/30 border border-green-800 px-2 py-1 rounded">
                RA-01 APPROVED
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setActiveImg(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-full"
              onClick={e => e.stopPropagation()}
            >
              {activeImg.startsWith('data:') || activeImg.startsWith('http') ? (
                <img src={activeImg} alt="Fullscreen" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              ) : (
                <div className="w-96 h-96 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <ImageIcon size={64} className="text-purple-400" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleDownload(activeImg, 0)}
                  className="bg-black/60 hover:bg-black/80 border border-white/20 px-3 py-1.5 rounded font-mono text-xs text-white transition-all flex items-center gap-1.5"
                >
                  <Download size={12} /> Save
                </button>
                <button
                  onClick={() => setActiveImg(null)}
                  className="bg-black/60 hover:bg-black/80 border border-white/20 px-3 py-1.5 rounded font-mono text-xs text-white transition-all"
                >
                  ✕ Close
                </button>
              </div>
            </motion.div>
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
