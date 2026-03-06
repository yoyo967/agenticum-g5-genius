import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MegaNav } from '../components/MegaNav';


/* ============================================================
   STEP CONFIGURATION — 7 Cinematic Steps
   ============================================================ */
interface Step {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  duration: number; // ms
  narrator: string;
}

const STEPS: Step[] = [
  {
    id: 0, label: 'INIT', title: 'AGENTICUM G5 GENIUS', subtitle: 'Neural Marketing OS',
    duration: 8000,
    narrator: 'Welcome to AGENTICUM G5 GENIUS — the world\'s first voice-activated AI creative agency, built for the Gemini Live Agent Challenge 2026.',
  },
  {
    id: 1, label: 'VOICE', title: 'Voice Command Received', subtitle: 'Gemini Live API · Bidi Streaming · <800ms',
    duration: 14000,
    narrator: 'A single voice command — "Luxury cyberpunk smartwatch campaign" — activates all 9 agents in parallel through the Gemini 2.0 Flash Live API.',
  },
  {
    id: 2, label: 'SWARM', title: 'Swarm Activated', subtitle: 'SN-00 Dispatches 9 Agents in Parallel',
    duration: 14000,
    narrator: 'SN-00 — the Neural Orchestrator — dispatches 9 specialized agents simultaneously via SwarmProtocol v3.0. Research, Design, Content, and Compliance run in parallel.',
  },
  {
    id: 3, label: 'RESEARCH', title: 'SP-01: Competitor Intelligence', subtitle: 'Firestore Vector Search · Google Grounding',
    duration: 14000,
    narrator: 'SP-01 performs real-time competitor analysis using Firestore Vector Search and live Google Search grounding, identifying content gaps and positioning opportunities.',
  },
  {
    id: 4, label: 'CREATIVE', title: 'CC-06 + DA-03: Content & Design', subtitle: 'Hybrid Intelligence · Imagen 3',
    duration: 14000,
    narrator: 'CC-06 synthesizes multi-channel copy while DA-03 generates high-fidelity visuals via Imagen 3.0. Real AI output — no templates.',
  },
  {
    id: 5, label: 'SENATE', title: 'RA-01: Senate Compliance Gate', subtitle: 'EU AI Act Art.50 · Veto Power Active',
    duration: 12000,
    narrator: 'Every output passes through RA-01 — the Security Senate. EU AI Act Art.50 compliance enforced automatically. Score: 97/100. Approved.',
  },
  {
    id: 6, label: 'FINALE', title: 'Campaign Delivered', subtitle: 'Full Brief to Campaign · Under 60 Seconds',
    duration: 14000,
    narrator: 'In under 60 seconds, a complete campaign — strategy, copy, visuals, and compliance certificate — is ready. 9 agents. One voice. Zero friction.',
  },
];

const TOTAL_DURATION = STEPS.reduce((s, x) => s + x.duration, 0);

/* ============================================================
   TYPEWRITER
   ============================================================ */
function Typewriter({ text, speed = 18, className = '' }: { text: string; speed?: number; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const t = setInterval(() => { setDisplayed(text.slice(0, i + 1)); i++; if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <span className={className}>{displayed}</span>;
}

/* ============================================================
   AGENT GRID
   ============================================================ */
const AGENTS = [
  { id: 'SN-00', name: 'Orchestrator', color: 'text-blue-400 border-blue-500/40 bg-blue-500/5', glyph: '⚡', ms: '38ms' },
  { id: 'SP-01', name: 'Strategic', color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/5', glyph: '🔍', ms: '1.2s' },
  { id: 'CC-06', name: 'Content', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5', glyph: '✍', ms: '3.2s' },
  { id: 'DA-03', name: 'Design', color: 'text-purple-400 border-purple-500/40 bg-purple-500/5', glyph: '🎨', ms: '6.8s' },
  { id: 'BA-07', name: 'Browser', color: 'text-green-400 border-green-500/40 bg-green-500/5', glyph: '🌐', ms: '2.1s' },
  { id: 'VE-01', name: 'Voice', color: 'text-blue-300 border-blue-400/40 bg-blue-400/5', glyph: '🎤', ms: '<800ms' },
  { id: 'RA-01', name: 'Senate', color: 'text-red-400 border-red-500/40 bg-red-500/5', glyph: '⚖', ms: '280ms' },
  { id: 'SO-00', name: 'Sovereign', color: 'text-orange-400 border-orange-500/40 bg-orange-500/5', glyph: '🔗', ms: '580ms' },
  { id: 'PM-07', name: 'Mission', color: 'text-pink-400 border-pink-500/40 bg-pink-500/5', glyph: '📅', ms: '420ms' },
];

/* ============================================================
   STEP SCREENS
   ============================================================ */

function Step0() {
  return (
    <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-4xl">
      {/* Logo mark */}
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }} className="mb-10 flex justify-center">
        <div className="w-20 h-20 rounded-2xl border-2 border-blue-500/60 bg-blue-500/10 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)]">
          <span className="text-4xl font-black text-blue-400 font-mono">G5</span>
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-blue-500 font-mono text-xs tracking-[0.4em] uppercase mb-6">Gemini Live Agent Challenge 2026</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-7xl md:text-8xl font-black tracking-tight font-mono text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
        AGENTICUM<br /><span className="text-blue-400">G5 GENIUS</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-2xl text-zinc-500 font-light mb-16">The Neural Marketing OS</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} className="flex justify-center gap-16">
        {[{ v: '9', l: 'AI AGENTS' }, { v: '99%', l: 'SENATE APPROVAL' }, { v: '<60s', l: 'CAMPAIGN TIME' }, { v: '100%', l: 'GCP NATIVE' }].map(s => (
          <div key={s.l} className="text-center">
            <p className="text-4xl font-bold font-mono text-white mb-1">{s.v}</p>
            <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">{s.l}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Step1() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 400); return () => clearInterval(t); }, []);
  const bars = [2, 4, 6, 9, 7, 5, 8, 10, 6, 4, 7, 9, 5, 7, 8, 5, 9, 6, 4, 8, 6, 7];

  return (
    <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-8">
        <div>
          <p className="text-blue-500 font-mono text-xs tracking-widest uppercase mb-3">VE-01 · Gemini Live API Active</p>
          <h2 className="text-4xl font-bold text-white mb-4">Voice Command<br /><span className="text-zinc-400">Received.</span></h2>
          <p className="text-zinc-500 leading-relaxed">The Gemini 2.0 Flash Live API processes bidirectional audio in real-time. Barge-in supported. Intent detected in <strong className="text-white">&lt;800ms</strong>.</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-3 h-3 rounded-full bg-red-500" />
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Live Transcription</span>
          </div>
          <div className="p-4 bg-black/50 rounded-xl border border-zinc-800">
            <p className="text-white italic text-lg leading-relaxed font-light">
              <Typewriter text='"Generate a bold marketing campaign for a luxury cyberpunk smartwatch — emphasizing the evolution of time."' speed={40} />
            </p>
          </div>
          <div className="flex items-end gap-1 h-10">
            {bars.map((h, i) => (
              <motion.div key={i} animate={{ scaleY: tick % 2 === 0 ? h * 0.15 : h * 0.08 }} transition={{ duration: 0.4 }} className="w-1.5 bg-blue-500/50 rounded-full origin-bottom" style={{ height: '100%' }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <span className="text-blue-400 text-xs font-mono uppercase tracking-widest">→ TOOL_CALL: launch_swarm</span>
          <span className="ml-auto text-[10px] text-zinc-600 font-mono">{`{"intent": "luxury smartwatch campaign"}`}</span>
        </div>
      </div>
      {/* Visual Waveform */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/10 blur-[80px] rounded-full" />
        <div className="relative border border-zinc-800 rounded-3xl p-8 bg-black/60 backdrop-blur-xl">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Gemini Live API · @google/genai v1.43.0</p>
          <div className="space-y-3 font-mono text-xs">
            {['sessionId: g5-live-001', 'model: gemini-2.0-flash-live-001', 'audioConfig: PCM16 16kHz', 'tools: [launch_swarm, stop_swarm]', 'responseModalities: AUDIO + TEXT'].map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="text-green-400/80">{line}</motion.div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-900 text-center">
            <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Europe-West1 · Node v00018</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step2() {
  const [active, setActive] = useState<number[]>([]);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setActive(prev => [...prev, i - 1]); if (i >= AGENTS.length) clearInterval(t); }, 400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-5xl">
      <div className="text-center mb-10">
        <p className="font-mono text-xs text-blue-500 uppercase tracking-widest mb-3">SwarmProtocol v3.0 · SN-00 Broadcasting</p>
        <h2 className="text-4xl font-bold text-white">Swarm Activated.</h2>
        <p className="text-zinc-500 mt-2">9 agents running in parallel — not sequentially.</p>
      </div>
      {/* Hub and spokes metaphor */}
      <div className="flex flex-col items-center gap-4">
        {/* Orchestrator */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="px-8 py-4 border-2 border-blue-500 bg-blue-500/10 rounded-2xl text-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
          <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">SN-00 · Neural Orchestrator</p>
          <p className="text-white font-bold text-sm">SwarmProtocol v3.0 · DISPATCHING</p>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[9px] text-blue-400">38ms init · 9 threads spawned</span>
          </div>
        </motion.div>

        {/* Connection line */}
        <div className="w-px h-6 bg-blue-500/50" />

        {/* Agent grid */}
        <div className="grid grid-cols-4 sm:grid-cols-9 gap-2 w-full">
          {AGENTS.slice(1).map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active.includes(i) ? 1 : 0.15, y: active.includes(i) ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-xl p-3 text-center ${agent.color}`}
            >
              <p className="text-xl mb-1">{agent.glyph}</p>
              <p className="font-mono text-[8px] font-black">{agent.id}</p>
              <p className="font-mono text-[7px] text-zinc-600 uppercase">{agent.name}</p>
              {active.includes(i) && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[8px] mt-1 text-green-400">● ACTIVE</motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Timing bar */}
        <div className="w-full mt-4 grid grid-cols-3 gap-4 font-mono text-[10px]">
          {[{ l: 'Parallel Threads', v: '9' }, { l: 'Est. Completion', v: '<60s' }, { l: 'Overhead', v: '38ms' }].map(x => (
            <div key={x.l} className="text-center border border-zinc-900 rounded-xl p-3">
              <p className="text-white font-bold text-lg">{x.v}</p>
              <p className="text-zinc-700 uppercase tracking-widest">{x.l}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Step3() {
  const competitors = [
    { name: 'MarketAI Pro', score: 84, gaps: ['Lacks voice control', 'No compliance gate', 'Sequential pipeline'] },
    { name: 'NeuralFlow', score: 72, gaps: ['No EU AI Act compliance', 'Static templates', 'Slow iteration'] },
    { name: 'SaaS Genius', score: 45, gaps: ['Manual workflows', 'No parallel agents', 'No audit trail'] },
  ];

  return (
    <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center">
          <span className="text-xl">🔍</span>
        </div>
        <div>
          <p className="font-mono text-[10px] text-yellow-400 uppercase tracking-widest">SP-01 · Strategic Cortex</p>
          <h2 className="text-2xl font-bold text-white">Competitor Intelligence Report</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="font-mono text-[10px] text-yellow-400/80 uppercase">Grounding: Live</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Source: Firestore Vector Search + Google Grounding</p>
          {competitors.map((c, i) => (
            <motion.div key={c.name} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3 + 0.5 }}
              className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-zinc-600 transition-colors">
              <div>
                <p className="font-bold text-white text-sm mb-1">{c.name}</p>
                <div className="flex gap-2">
                  {c.gaps.slice(0, 1).map(g => <span key={g} className="text-[9px] font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">{g}</span>)}
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-yellow-400">{c.score}%</p>
                <p className="font-mono text-[9px] text-zinc-700 uppercase">overlap</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">G5 Competitive Advantages Detected</p>
          {['Voice-first activation via Gemini Live API', 'EU AI Act RA-01 compliance gate', 'Real parallel swarm (9 agents, not 1)', 'Sub-60s end-to-end campaign generation', 'GCP-native, europe-west1 deployment'].map((adv, i) => (
            <motion.div key={adv} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 + i * 0.2 }} className="flex items-start gap-3">
              <span className="text-green-500 font-mono text-xs mt-0.5">✓</span>
              <p className="text-sm text-zinc-300">{adv}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

const TYPEWRITER_TEXT = "\u201cTime doesn\u2019t just pass. It evolves. Introducing the Epoch Smartwatch \u2014 where cyberpunk aesthetics meet quantum precision. The future is already on your wrist.\u201d #Evolution #CyberpunkTech";

function Step4() {
  return (
    <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
      {/* Copy output */}
      <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <span className="text-emerald-400 text-lg">✍</span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">CC-06 · Cognitive Core · OUTPUT</span>
          <span className="ml-auto font-mono text-[9px] text-green-400">SENATE APPROVED</span>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">LinkedIn Hook (Variant A)</p>
          <div className="border-l-2 border-emerald-500 pl-4">
            <Typewriter
              text={TYPEWRITER_TEXT}
              speed={18}
              className="text-white text-lg font-light leading-relaxed italic"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 font-mono text-[9px] text-zinc-600">
            {[{ l: 'Tone', v: 'Prestige' }, { l: 'Target', v: 'HNWIs' }, { l: 'Platform', v: 'LinkedIn' }].map(x => (
              <div key={x.l} className="bg-black p-2 rounded text-center">
                <p className="text-zinc-500">{x.l}</p>
                <p className="text-white font-bold">{x.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image output */}
      <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <span className="text-purple-400 text-lg">🎨</span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">DA-03 · Imagen 3 · OUTPUT</span>
          <span className="ml-auto font-mono text-[9px] text-purple-400/80">6.8s gen</span>
        </div>
        <div className="relative">
          <motion.img
            src="/ai_output_storyboard.png"
            alt="AI Generated: Luxury Cyberpunk Smartwatch Storyboard"
            className="w-full object-cover"
            initial={{ scale: 1.05, filter: 'blur(8px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Imagen 3.0 generate-002 · 1024×1024 · C2PA Provenance</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step5() {
  const [score] = useState(97);
  const checks = [
    { rule: 'EU AI Act Art.50', result: 'PASS', note: 'AI disclosure applied' },
    { rule: 'GDPR Compliance', result: 'PASS', note: 'No PII detected' },
    { rule: 'Brand Safety', result: 'PASS', note: 'Content meets policy' },
    { rule: 'Hallucination Risk', result: 'PASS', note: '0% — Google Grounded' },
    { rule: 'C2PA Provenance', result: 'PASS', note: 'Metadata embedded' },
  ];

  return (
    <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-5xl">
      <div className="mb-8 grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚖</span>
            </div>
            <div>
              <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">RA-01 · Security Senate</p>
              <h2 className="text-2xl font-bold text-white">EU AI Act Compliance Gate</h2>
            </div>
          </div>
          {checks.map((c, i) => (
            <motion.div key={c.rule} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }}
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 rounded-xl">
              <span className="text-green-500 font-bold text-lg font-mono">✓</span>
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{c.rule}</p>
                <p className="font-mono text-[9px] text-zinc-600">{c.note}</p>
              </div>
              <span className="font-mono text-[9px] font-black text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">{c.result}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.2, type: 'spring' }}
          className="text-center p-8 border-2 border-green-500/40 bg-green-500/5 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.1)]">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Compliance Score</p>
          <p className="text-8xl font-black font-mono text-green-400 mb-2">{score}</p>
          <p className="font-mono text-[10px] text-zinc-500">/100</p>
          <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="font-mono text-[10px] text-green-400 font-bold uppercase tracking-widest">APPROVED BY SENATE</p>
            <p className="font-mono text-[9px] text-zinc-600 mt-1">RA-01 · Veto: None</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Step6({ onRestart, onOS }: { onRestart: () => void; onOS: () => void }) {
  return (
    <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-3xl">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }} className="w-24 h-24 mx-auto mb-12 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.2)]">
        <span className="text-5xl">✓</span>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-mono text-xs text-green-400 uppercase tracking-widest mb-4">Campaign Delivered · Under 60 Seconds</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-6xl font-black text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
        Nine Agents.<br /><span className="text-blue-400">Zero Friction.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-zinc-400 text-lg mb-12 leading-relaxed">
        Strategy · Copy · Visuals · Compliance Certificate<br />All delivered in one parallel swarm execution.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onOS} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest transition-colors rounded-xl">
          Enter the OS →
        </button>
        <button onClick={onRestart} className="px-10 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest transition-colors rounded-xl">
          Replay Demo
        </button>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-16 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
        Gemini 2.0 Flash · Vertex AI · Imagen 3 · Cloud Run · Firebase · Firestore · Europe-West1
      </motion.p>
    </motion.div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function DemoWorkflow() {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    if (isPlaying) {
      setElapsed(prev => {
        const next = prev + delta;
        if (next >= TOTAL_DURATION) { setIsPlaying(false); return TOTAL_DURATION; }
        return next;
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    let id: number;
    const loop = (t: number) => { animate(t); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [animate]);

  useEffect(() => {
    let acc = 0;
    for (const s of STEPS) {
      if (elapsed < acc + s.duration) { setStep(s.id); break; }
      acc += s.duration;
    }
    setProgress((elapsed / TOTAL_DURATION) * 100);
  }, [elapsed]);

  const goToStep = (id: number) => {
    let acc = 0;
    for (let i = 0; i < id; i++) acc += STEPS[i].duration;
    setElapsed(acc + 10);
    setIsPlaying(true);
  };

  const restart = () => { setElapsed(0); setIsPlaying(true); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.key === 'ArrowRight') goToStep(Math.min(6, step + 1));
      if (e.key === 'ArrowLeft') goToStep(Math.max(0, step - 1));
      if (e.key === 'r') restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Top progress bar */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-zinc-900 z-50">
        <motion.div className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" style={{ width: `${progress}%` }} />
        <div className="absolute inset-0 flex">
          {STEPS.map((s) => (
            <div key={s.id} className="h-full border-r border-black/70" style={{ width: `${(s.duration / TOTAL_DURATION) * 100}%` }} />
          ))}
        </div>
      </div>

      {/* Top-left HUD */}
      <div className="absolute top-5 left-6 z-50 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="font-mono text-[10px] text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">← Back</button>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse block" />
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Gemini Live Agent Challenge 2026</span>
      </div>

      {/* Top-right step nav */}
      <div className="absolute top-3 right-5 z-50 flex items-center gap-1">
        {STEPS.map(s => (
          <button key={s.id} onClick={() => goToStep(s.id)}
            className={`h-7 px-3 font-mono text-[9px] uppercase tracking-wider transition-all rounded ${s.id === step ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'}`}>
            {s.label}
          </button>
        ))}
        <button onClick={() => setIsPlaying(p => !p)} className="ml-2 h-7 px-3 border border-zinc-800 hover:border-zinc-600 font-mono text-[9px] text-zinc-500 hover:text-white transition-all rounded">
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Main content area */}
      <main className="relative w-full h-full flex items-center justify-center p-12 pt-20 pb-36">
        <AnimatePresence mode="wait">
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}
          {step === 6 && <Step6 onRestart={restart} onOS={() => navigate('/os')} />}
        </AnimatePresence>
      </main>

      {/* Narrator bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-50">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="border border-zinc-800/80 bg-black/90 backdrop-blur-xl rounded-2xl px-10 py-5 text-center shadow-2xl">
            <p className="text-zinc-400 text-base font-light leading-relaxed">{STEPS[step].narrator}</p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">Step {step + 1}/{STEPS.length}</span>
              <div className="flex gap-1">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-0.5 w-8 rounded-full transition-all ${s.id <= step ? 'bg-blue-500' : 'bg-zinc-800'}`} />
                ))}
              </div>
              <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">{STEPS[step].title}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
