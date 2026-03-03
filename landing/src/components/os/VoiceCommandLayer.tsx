import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Zap, RotateCcw, Check, Copy,
  Send, Wand2, ChevronRight, Volume2, VolumeX,
  FileText, Target, BarChart2, Search, Shield, Image, Film, Globe,
  Loader2, Trash2, Download
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { downloadJSON } from '../../utils/export';

// ── Types ─────────────────────────────────────────────────────────────────────
type MicState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceBrief {
  id: string;
  command: string;
  timestamp: string;
  brief?: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  agentUsed?: string;
  wordCount?: number;
}

interface PresetCommand {
  id: string;
  label: string;
  command: string;
  agent: string;
  icon: React.ReactNode;
  color: string;
}

// ── Preset Commands ────────────────────────────────────────────────────────────
const PRESET_COMMANDS: PresetCommand[] = [
  {
    id: 'pc-1', label: 'Campaign Brief', agent: 'SP-01',
    command: 'Create a LinkedIn Campaign brief targeting B2B SaaS decision makers for Q2 2026.',
    icon: <Target size={12} />, color: '#7B2FBE',
  },
  {
    id: 'pc-2', label: 'Blog Post', agent: 'CC-06',
    command: 'Write a 600-word blog post about how AI agent swarms transform enterprise marketing.',
    icon: <FileText size={12} />, color: '#FF007A',
  },
  {
    id: 'pc-3', label: 'Competitor Scan', agent: 'SP-01',
    command: 'Run a competitor intelligence scan for AI marketing platforms in the DACH market.',
    icon: <Search size={12} />, color: '#00E5FF',
  },
  {
    id: 'pc-4', label: 'KPI Report', agent: 'BA-07',
    command: 'Generate a KPI performance report for our Q1 LinkedIn and email campaigns.',
    icon: <BarChart2 size={12} />, color: '#FFD700',
  },
  {
    id: 'pc-5', label: 'Compliance Check', agent: 'RA-01',
    command: 'Run a Senate compliance audit on all active campaign assets for EU AI Act readiness.',
    icon: <Shield size={12} />, color: '#00FF88',
  },
  {
    id: 'pc-6', label: 'Image Generation', agent: 'DA-03',
    command: 'Generate four campaign hero images for our enterprise AI product launch.',
    icon: <Image size={12} />, color: '#FF6B00',
  },
  {
    id: 'pc-7', label: 'Video Script', agent: 'VE-01',
    command: 'Create a 60-second video script for our AGENTICUM G5 product demo.',
    icon: <Film size={12} />, color: '#EF4444',
  },
  {
    id: 'pc-8', label: 'SEO Strategy', agent: 'GA-01',
    command: 'Build an SEO pillar strategy for AI marketing automation targeting enterprise CMOs.',
    icon: <Globe size={12} />, color: '#10B981',
  },
];

// ── Simulated transcript tokens ────────────────────────────────────────────────
function useTypingEffect(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return displayed;
}

// ── Wave Animation Component ────────────────────────────────────────────────────
const BARS = [
  { height: 24, duration: 0.6 }, { height: 18, duration: 0.5 }, { height: 32, duration: 0.7 }, { height: 20, duration: 0.4 },
  { height: 28, duration: 0.6 }, { height: 15, duration: 0.5 }, { height: 22, duration: 0.8 }, { height: 30, duration: 0.4 },
  { height: 26, duration: 0.6 }, { height: 19, duration: 0.5 }, { height: 31, duration: 0.7 }, { height: 21, duration: 0.4 },
  { height: 27, duration: 0.6 }, { height: 16, duration: 0.5 }, { height: 23, duration: 0.8 }, { height: 29, duration: 0.4 },
  { height: 25, duration: 0.6 }, { height: 17, duration: 0.5 }, { height: 33, duration: 0.7 }, { height: 20, duration: 0.4 },
];

function AudioWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: 'var(--color-accent)' }}
          animate={active ? {
            height: [4, bar.height, 4],
            opacity: [0.3, 1, 0.3],
          } : { height: 3, opacity: 0.15 }}
          transition={{ duration: bar.duration, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function VoiceCommandLayer() {
  const [micState, setMicState]       = useState<MicState>('idle');
  const [textInput, setTextInput]     = useState('');
  const [history, setHistory]         = useState<VoiceBrief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<VoiceBrief | null>(null);
  const [muted, setMuted]             = useState(false);
  const [copied, setCopied]           = useState(false);
  const [wakeActive, setWakeActive]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulated wake-word listener
  useEffect(() => {
    const timer = setInterval(() => {
      // pulse the wake indicator every 4s to show it's listening
      setWakeActive(v => !v);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ── Submit command ────────────────────────────────────────────────────────
  const submitCommand = useCallback(async (command: string, presetAgent?: string) => {
    if (!command.trim()) return;
    setTextInput('');

    const entry: VoiceBrief = {
      id: Date.now().toString(),
      command: command.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'generating',
      agentUsed: presetAgent ?? 'CC-06',
    };
    setHistory(prev => [entry, ...prev]);
    setSelectedBrief(entry);
    setMicState('thinking');

    try {
      const res = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Campaign Brief',
          topic: command.trim(),
          tone: 'Professional',
          readingLevel: 'Manager',
        }),
      });

      const brief = res.ok
        ? ((await res.json()).content || 'No content returned.')
        : `[Simulation] Brief generated for: "${command}"\n\n**Objective:** ${command}\n\n**Agent:** ${presetAgent ?? 'CC-06 Cognitive Core'}\n**Timestamp:** ${new Date().toISOString()}\n\n**Recommended Actions:**\n- Run SP-01 market scan\n- Dispatch CC-06 for content generation\n- Submit to RA-01 for Senate review\n- Distribute via PM-07 Workflow Engine`;

      const updated: VoiceBrief = {
        ...entry,
        status: 'done',
        brief,
        wordCount: brief.split(/\s+/).length,
      };
      setHistory(prev => prev.map(h => h.id === entry.id ? updated : h));
      setSelectedBrief(updated);
    } catch {
      const fallback: VoiceBrief = {
        ...entry,
        status: 'done',
        brief: `[Offline Mode] Command logged:\n\n"${command}"\n\nAgent ${presetAgent ?? 'CC-06'} will process this when backend is connected.`,
        wordCount: 12,
      };
      setHistory(prev => prev.map(h => h.id === entry.id ? fallback : h));
      setSelectedBrief(fallback);
    }
    setMicState('idle');
  }, []);

  // ── Mic toggle (simulated recording) ─────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (micState === 'listening') {
      setMicState('idle');
      if (textInput.trim()) submitCommand(textInput);
    } else if (micState === 'idle') {
      setMicState('listening');
      // Auto-submit after 3s of "recording"
      setTimeout(() => {
        const cmd = inputRef.current?.value || 'Run Counter-Strike analysis for AI marketing platforms';
        setMicState('idle');
        submitCommand(cmd);
      }, 3000);
    }
  }, [micState, textInput, submitCommand]);

  const displayed = useTypingEffect(selectedBrief?.brief ?? '', 12);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedBrief?.brief ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => { setHistory([]); setSelectedBrief(null); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col overflow-hidden bg-midnight">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Mic size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">Voice Command Layer</h2>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">VE-01 · Gemini Live API · Wake-Word Active</p>
          </div>
        </div>

        {/* Wake indicator */}
        <div className="flex items-center gap-2 ml-auto">
          <motion.div animate={{ opacity: wakeActive ? 1 : 0.3, scale: wakeActive ? 1 : 0.85 }} transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-900/20 border border-cyan-700/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-400">HEY G5 · LISTENING</span>
          </motion.div>
          <button onClick={() => setMuted(v => !v)}
            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white transition-colors">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          {history.length > 0 && (
            <button onClick={clearHistory}
              className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-0 overflow-hidden">

        {/* ── Left Panel: Input + History ──────────────────────────────── */}
        <div className="w-80 shrink-0 flex flex-col border-r border-white/5 overflow-hidden">

          {/* Mic Input */}
          <div className="shrink-0 p-4 border-b border-white/5">
            <div className="flex flex-col gap-3">

              {/* Big Mic Button */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={toggleMic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${
                    micState === 'listening'
                      ? 'bg-red-600 border-red-500 shadow-lg shadow-red-500/30'
                      : micState === 'thinking'
                      ? 'bg-yellow-600/20 border-yellow-500/50'
                      : 'bg-cyan-900/20 border-cyan-600/40 hover:bg-cyan-900/40'
                  }`}>
                  {micState === 'thinking'
                    ? <Loader2 size={22} className="text-yellow-400 animate-spin" />
                    : micState === 'listening'
                    ? <MicOff size={22} className="text-white" />
                    : <Mic size={22} className="text-cyan-400" />
                  }
                </motion.button>

                <div className="flex-1">
                  <AudioWave active={micState === 'listening'} />
                  <p className="font-mono text-[10px] text-white/30 mt-1">
                    {micState === 'listening' ? 'Recording... click to stop' :
                     micState === 'thinking'  ? 'G5 Processing...' :
                     micState === 'speaking'  ? 'Speaking...' :
                     'Click mic or type below'}
                  </p>
                </div>
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitCommand(textInput)}
                  placeholder="Type a command..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40"
                />
                <button onClick={() => submitCommand(textInput)} disabled={!textInput.trim()}
                  className="p-2 bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 rounded-lg hover:bg-cyan-900/50 transition-colors disabled:opacity-30">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="shrink-0 p-3 border-b border-white/5">
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2 px-1">Quick Commands</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_COMMANDS.map(cmd => (
                <button key={cmd.id} onClick={() => submitCommand(cmd.command, cmd.agent)}
                  disabled={micState === 'thinking' || micState === 'listening'}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/5 hover:border-white/20 bg-white/3 hover:bg-white/5 transition-all text-left disabled:opacity-40 group">
                  <span style={{ color: cmd.color }}>{cmd.icon}</span>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] text-white/80 leading-none">{cmd.label}</p>
                    <p className="font-mono text-[8px] text-white/30 leading-none mt-0.5" style={{ color: cmd.color }}>{cmd.agent}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2 px-1">
              History ({history.length})
            </p>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <Wand2 size={24} className="text-white/10 mx-auto mb-2" />
                <p className="font-mono text-[10px] text-white/20">No commands yet</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {history.map(h => (
                  <button key={h.id} onClick={() => setSelectedBrief(h)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      selectedBrief?.id === h.id ? 'border-cyan-700/50 bg-cyan-900/10' : 'border-white/5 hover:border-white/15 bg-white/2'
                    }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${h.status === 'done' ? 'bg-green-400' : h.status === 'generating' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className="font-mono text-[8px] text-white/30">{h.timestamp}</span>
                      {h.agentUsed && <span className="font-mono text-[8px] ml-auto" style={{ color: PRESET_COMMANDS.find(p => p.agent === h.agentUsed)?.color ?? '#00E5FF' }}>{h.agentUsed}</span>}
                    </div>
                    <p className="font-mono text-[10px] text-white/70 line-clamp-2 leading-relaxed">{h.command}</p>
                    {h.wordCount && <p className="font-mono text-[8px] text-white/20 mt-1">{h.wordCount} words</p>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Panel: Brief Output ────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {selectedBrief ? (
            <>
              {/* Brief Header */}
              <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-white/5">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Voice Brief · {selectedBrief.agentUsed}</p>
                  <p className="font-mono text-xs text-white/70 mt-0.5 truncate">{selectedBrief.command}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedBrief.wordCount && (
                    <span className="font-mono text-[9px] text-white/20">{selectedBrief.wordCount}w</span>
                  )}
                  <button onClick={handleCopy} className="p-1.5 rounded border border-white/10 text-white/40 hover:text-white transition-colors">
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => downloadJSON({ command: selectedBrief.command, brief: selectedBrief.brief, agent: selectedBrief.agentUsed, timestamp: selectedBrief.timestamp }, `G5_VoiceBrief_${selectedBrief.id}`)}
                    className="p-1.5 rounded border border-white/10 text-white/40 hover:text-white transition-colors">
                    <Download size={12} />
                  </button>
                </div>
              </div>

              {/* Brief Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedBrief.status === 'generating' ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                      <Zap size={32} className="text-cyan-400" />
                    </motion.div>
                    <p className="font-mono text-xs text-white/40">G5 is processing your command...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div key={selectedBrief.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <pre className="font-mono text-sm text-white/80 leading-7 whitespace-pre-wrap">
                        {selectedBrief.status === 'done' ? displayed : selectedBrief.brief}
                      </pre>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Quick Actions */}
              {selectedBrief.status === 'done' && (
                <div className="shrink-0 flex items-center gap-2 px-5 py-3 border-t border-white/5">
                  <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Quick Actions</span>
                  {[
                    { icon: <RotateCcw size={11} />, label: 'Regenerate', fn: () => submitCommand(selectedBrief.command, selectedBrief.agentUsed) },
                    { icon: <Target size={11} />, label: 'Run Counter-Strike', fn: () => submitCommand('Run Counter-Strike on: ' + selectedBrief.command, 'SP-01') },
                    { icon: <ChevronRight size={11} />, label: 'Send to Senate', fn: () => submitCommand('Senate Audit: ' + (selectedBrief.brief ?? '').slice(0, 100), 'RA-01') },
                  ].map(a => (
                    <button key={a.label} onClick={a.fn}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/10 text-white/50 font-mono text-[10px] rounded hover:border-white/30 hover:text-white transition-all">
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-6">
              <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
                <Mic size={56} className="text-white/10" />
              </motion.div>
              <div>
                <p className="font-display text-xl uppercase font-bold text-white/20">Voice-Activated</p>
                <p className="font-mono text-xs text-white/20 mt-2 max-w-sm leading-relaxed">
                  Say "Hey G5" or click the mic button — then speak your command. G5 converts it to a structured brief using CC-06.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {['Create a campaign brief', 'Run a competitor scan', 'Generate blog content', 'Audit for compliance'].map(ex => (
                  <button key={ex} onClick={() => submitCommand(ex)}
                    className="p-3 border border-white/5 rounded-lg text-left font-mono text-[10px] text-white/40 hover:border-white/20 hover:text-white/60 transition-all">
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
