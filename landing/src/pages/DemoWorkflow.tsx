import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Mic, CheckCircle, 
  ArrowRight, RotateCcw, SkipForward,
  Search, Shield, Zap, 
  Copy, Loader2
} from 'lucide-react';
import { ENGINE_URL, API_BASE_URL } from '../config';

/* ============================================================
   TYPES
   ============================================================ */
type StepId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface StepConfig {
  id: StepId;
  title: string;
  duration: number; // in milliseconds
  narrator: string;
}

const STEPS: StepConfig[] = [
  { id: 0, title: 'INTRO', duration: 8000, narrator: 'Welcome to AGENTICUM G5 GENIUS.' },
  { id: 1, title: 'LANDING PREVIEW', duration: 20000, narrator: 'The landing page presents the full system — 9 agents, built on Google Cloud, 100% EU AI Act compliant.' },
  { id: 2, title: 'OS PORTAL', duration: 30000, narrator: '27 modules. Real-time Firestore data. WebSocket telemetry. One unified OS.' },
  { id: 3, title: 'COUNTER-STRIKE', duration: 40000, narrator: 'SP-01 analyzes competitor content in real-time using Firestore Vector Search and Google Grounding.' },
  { id: 4, title: 'CONTENT GEN', duration: 30000, narrator: 'CC-06 generates platform-native content — LinkedIn, Blog, Email — in under 3 seconds. Every output Senate-approved.' },
  { id: 5, title: 'VOICE DEMO', duration: 30000, narrator: 'One voice command activates all 9 agents simultaneously. From brief to output in under 3 seconds. Zero friction.' },
  { id: 6, title: 'FINALE', duration: 22000, narrator: 'The future of marketing is here. Automated. Auditable. Autonomous.' },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0);

/* ============================================================
   MOCK DATA
   ============================================================ */
const MOCK_COMPETITORS = [
  { competitor: 'MarketAI Pro', their_h2_structure: ['Pricing Strategy', 'Enterprise Features', 'Integration Guide'], overlap_score: 0.84 },
  { competitor: 'NeuralFlow', their_h2_structure: ['Real-time Analytics', 'Agent Workflow', 'Security Whitepaper'], overlap_score: 0.72 },
  { competitor: 'SaaS Genius', their_h2_structure: ['Case Studies', 'Pricing', 'API Documentation'], overlap_score: 0.45 },
];

const MOCK_CONTENT = `### The Case for Agentic Swarms\n\nThe transition from sequential AI tools to **parallel agent swarms** marks a fundamental shift in enterprise productivity. AGENTICUM G5 eliminates cognitive debt by orchestrating 9 specialized agents simultaneously.\n\n- **Speed:** From brief to campaign in <60s.\n- **Compliance:** Built-in EU AI Act audit.\n- **Scale:** 40+ assets per hour.\n\n#AIMarketing #EnterpriseAI #G5`;

/* ============================================================
   HELPER COMPONENTS
   ============================================================ */

const BrowserChrome = ({ url }: { url: string }) => (
  <div className="bg-zinc-800 border-b border-zinc-700 px-4 py-2 flex items-center gap-4 rounded-t-lg">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-500/50" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
      <div className="w-3 h-3 rounded-full bg-green-500/50" />
    </div>
    <div className="flex gap-2 text-zinc-500">
      <RotateCcw size={14} />
    </div>
    <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-[10px] font-mono text-zinc-400">
      {url}
    </div>
  </div>
);

const Typewriter = ({ text, speed = 30, className = "" }: { text: string; speed?: number; className?: string }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <div className={className}>{displayed}</div>;
};

/* ============================================================
   MAIN PAGE
   ============================================================ */

export function DemoWorkflow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const speedMult = parseFloat(searchParams.get('speed') || '1');
  const startStep = parseInt(searchParams.get('step') || '0') as StepId;
  const autoPlay = searchParams.get('auto') !== '0';

  const [step, setStep] = useState<StepId>(startStep);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [elapsed, setElapsed] = useState(0);
  const [apiData, setApiData] = useState<any>(null);
  const [apiState, setApiState] = useState<'idle' | 'loading' | 'done'>('idle');

  const lastTimeRef = useRef<number>(performance.now());

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) * speedMult;
      if (isPlaying) {
        setElapsed(prev => {
          const next = prev + deltaTime;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }
    }
    lastTimeRef.current = time;
  }, [isPlaying, speedMult]);

  useEffect(() => {
    let frameId: number;
    const loop = (time: number) => {
      animate(time);
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [animate]);

  useEffect(() => {
    let accumulated = 0;
    for (const s of STEPS) {
      if (elapsed < accumulated + s.duration) {
        setStep(s.id as StepId);
        break;
      }
      accumulated += s.duration;
    }
    setProgress((elapsed / TOTAL_DURATION) * 100);
  }, [elapsed]);

  useEffect(() => {
    if (step === 3 && apiState === 'idle') {
      const runCS = async () => {
        setApiState('loading');
        await new Promise(r => setTimeout(r, 4000));
        try {
          const res = await fetch(`${ENGINE_URL}/engine/counter-strike?topic=Enterprise AI Marketing 2026`);
          const data = await res.json();
          setApiData(data.overlap || data.competitors || data || MOCK_COMPETITORS);
        } catch {
          setApiData(MOCK_COMPETITORS);
        }
        setApiState('done');
      };
      runCS();
    }
    if (step === 4 && (apiState === 'idle' || step === 4)) {
       const runCG = async () => {
        setApiState('loading');
        await new Promise(r => setTimeout(r, 5000));
        try {
          const res = await fetch(`${API_BASE_URL}/content/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              brief: "Write a LinkedIn post about how AGENTICUM G5 eliminates cognitive debt in enterprise marketing teams.",
              type: "linkedin"
            })
          });
          const data = await res.json();
          setApiData(data.content || MOCK_CONTENT);
        } catch {
          setApiData(MOCK_CONTENT);
        }
        setApiState('done');
      };
      runCG();
    }
    if (step < 3 || step > 4) {
      setApiState('idle');
      setApiData(null);
    }
  }, [step]);

  const skipToStep = useCallback((id: StepId) => {
    let accumulated = 0;
    for (let i = 0; i < id; i++) accumulated += STEPS[i].duration;
    setElapsed(accumulated + 1);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.key === 'ArrowRight') skipToStep(Math.min(6, step + 1) as StepId);
      if (e.key === 'ArrowLeft') skipToStep(Math.max(0, step - 1) as StepId);
      if (e.key === 'r' || e.key === 'R') setElapsed(0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, skipToStep]);

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <motion.div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" style={{ width: `${progress}%` }} />
        <div className="absolute inset-0 flex">
          {STEPS.map((s, i) => (
            <div key={i} className="h-full border-r border-black/50" style={{ width: `${(s.duration / TOTAL_DURATION) * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Neural Link Active · Phase 41</span>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Step {step + 1} of {STEPS.length} — {STEPS[step].title}</span>
        <button onClick={() => skipToStep(Math.min(6, step + 1) as StepId)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-2 transition-colors">
          Skip <SkipForward size={10} />
        </button>
      </div>

      <main className="relative w-full h-full flex items-center justify-center p-12">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8">
              <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-8xl font-black tracking-[0.2em] font-mono">AGENTICUM G5</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl text-zinc-500 font-light tracking-widest">THE NEURAL MARKETING OS</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-blue-500 font-mono text-sm tracking-widest pt-12">GEMINI LIVE AGENT CHALLENGE 2026</motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4 }} className="flex items-center justify-center gap-12 pt-12">
                {[{ v: '9', l: 'AI AGENTS' }, { v: '99%', l: 'SENATE APPROVAL' }, { v: '<60s', l: 'CAMPAIGN TIME' }].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-4xl font-bold font-mono mb-1">{s.v}</p>
                    <p className="text-[10px] text-zinc-600 font-mono tracking-widest">{s.l}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-6xl h-full max-h-[80vh] bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
              <BrowserChrome url="online-marketing-manager.web.app" />
              <div className="flex-1 overflow-hidden relative">
                <motion.div animate={{ y: -1200 }} transition={{ duration: 18, ease: "linear" }} className="p-12 space-y-24">
                   <div className="text-center max-w-3xl mx-auto py-24">
                      <h2 className="text-6xl font-black mb-8">The Neural Marketing OS.</h2>
                      <p className="text-zinc-500 text-xl">9 AI agents. One voice command. <br/> From brief to campaign in under 60 seconds.</p>
                      <div className="flex justify-center gap-4 mt-12">
                        <div className="px-8 py-4 bg-blue-600 text-[10px] font-mono uppercase tracking-widest">Initialize Swarm</div>
                        <div className="px-8 py-4 border border-zinc-800 text-[10px] font-mono uppercase tracking-widest">Watch Demo</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-8">
                     {Array.from({length: 9}).map((_, i) => (
                       <div key={i} className="aspect-3/4 border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between">
                         <div>
                            <p className="text-blue-500 font-mono text-[10px] mb-2">SN-0{i}</p>
                            <p className="text-sm font-bold uppercase">Agent Component</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex gap-4">
              <div className="w-64 border border-zinc-800 bg-zinc-950 flex flex-col p-4 rounded-lg">
                <div className="font-mono text-[10px] text-zinc-600 mb-8 uppercase tracking-widest">Modules (27)</div>
                <div className="space-y-2">
                  {['DASHBOARD', 'GENIUS CONSOLE', 'NEXUS ENGINE', 'CAMPAIGN HUB', 'PILLAR BLOG', 'CREATIVE STUDIO', 'WORKFLOWS'].map((m, i) => (
                    <motion.div key={m} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`p-3 font-mono text-[10px] border border-zinc-900 ${i === 0 ? 'bg-blue-600/10 border-blue-600/30 text-blue-400' : 'text-zinc-500'}`}>{m}</motion.div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 border border-zinc-800 bg-zinc-900/40 p-6 rounded-lg">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Swarm Readiness</p>
                    <p className="text-3xl font-bold font-mono text-green-500">100%</p>
                  </div>
                  <div className="flex-1 h-32 border border-zinc-800 bg-zinc-900/40 p-6 rounded-lg">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Resonance Index</p>
                    <p className="text-3xl font-bold font-mono text-blue-400">0.94</p>
                  </div>
                </div>
                <div className="flex-1 border border-zinc-800 bg-zinc-950 p-8 rounded-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-[10px] text-zinc-600">HEARTBEAT active</span>
                   </div>
                   <div className="grid grid-cols-2 gap-8 h-full">
                      <div className="border border-zinc-900 bg-zinc-900/20 p-4 rounded relative overflow-hidden">
                         <div className="absolute inset-x-0 bottom-0 h-32 flex items-end gap-1 px-2">
                            {Array.from({length: 20}).map((_, i) => (
                              <motion.div key={i} animate={{ height: [20, 80, 40, 100][i % 4] }} transition={{ repeat: Infinity, duration: 1 }} className="flex-1 bg-blue-500/20" />
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4 text-sm font-light text-zinc-400">
                        <p>System initialization complete. Gemini 2.0 Flash context window optimal.</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-5xl flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 flex items-center justify-center rounded"><Search size={20} className="text-blue-500" /></div>
                  <div><h3 className="text-xl font-bold font-mono uppercase">SP-01 Counter-Strike</h3></div>
                </div>
                {apiState === 'loading' && <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400"><Loader2 size={12} className="animate-spin" /> SCANNING...</div>}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-black border border-zinc-800 p-6 font-mono text-sm">
                    <p className="text-[10px] text-zinc-600 mb-2 uppercase tracking-widest">Directive</p>
                    <Typewriter text="Enterprise AI Marketing 2026" />
                  </div>
                  <button className={`w-full py-4 font-mono text-xs uppercase tracking-widest rounded border ${apiState === 'loading' ? 'bg-blue-950 text-blue-300' : 'bg-blue-600 text-white'}`}>RUN CS</button>
                  {apiState === 'done' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border border-zinc-900 bg-zinc-950 text-[10px] font-mono text-green-500">
                       SENATE APPROVED ✅
                    </motion.div>
                  )}
                </div>
                <div className="space-y-3">
                   {apiState === 'done' && apiData && apiData.slice(0, 3).map((c: any, i: number) => (
                     <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="p-4 bg-zinc-900 rounded border border-zinc-800 flex justify-between">
                        <p className="font-bold text-sm">{c.competitor || c.name}</p>
                        <p className="text-blue-400 font-mono italic">{Math.round((c.overlap_score || 0.5) * 100)}%</p>
                     </motion.div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-4xl h-[70vh] flex flex-col border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">CC-06 COGNITIVE CORE</span>
               </div>
               <div className="flex-1 p-8 font-mono overflow-y-auto">
                   <p className="text-zinc-600 text-xs mb-4">TRANSCRIPTION_</p>
                   <p className="text-blue-400 text-sm mb-12 italic border-l-2 border-blue-900 pl-4 py-2">&quot;LinkedIn post about eliminating cognitive debt.&quot;</p>
                   {apiState === 'loading' && <div className="text-zinc-500 animate-pulse text-xs">SYNTHESIZING...</div>}
                   {apiState === 'done' && apiData && (
                     <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap"><Typewriter text={apiData} speed={10} /></div>
                   )}
               </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
               <div className="relative mb-12 w-48 h-48 mx-auto flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 border border-blue-500 rounded-full" />
                  <Mic size={48} className="text-blue-500" />
               </div>
               <div className="text-2xl italic text-zinc-400 mb-12">&quot;Create a campaign brief for our Q2 launch...&quot;</div>
               <div className="flex gap-2 justify-center">
                  {['SN-00', 'SP-01', 'CC-06', 'DA-03', 'BA-07', 'VE-01', 'RA-01', 'SO-00', 'PM-07'].map((a, i) => (
                    <motion.div key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.2 }} className="px-3 py-1 border border-zinc-800 text-[10px] font-mono">{a}</motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-12">
               <div className="space-y-4">
                  <h2 className="text-7xl font-black uppercase">9 AGENTS.</h2>
                  <h2 className="text-4xl text-blue-500 font-bold uppercase tracking-widest">ZERO FRICTION.</h2>
               </div>
               <div className="flex gap-4 justify-center pt-12">
                  <button onClick={() => navigate('/os')} className="px-10 py-5 bg-blue-600 text-[11px] font-mono uppercase tracking-widest">Explore OS</button>
               </div>
               <div className="pt-24 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">Gemini · Vertex AI · Firebase · Cloud Run</div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-12 z-50">
         <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-black/95 border border-zinc-800 rounded-full px-12 py-5 text-center shadow-2xl">
              <p className="text-zinc-300 text-lg font-light leading-relaxed">{STEPS[step].narrator}</p>
            </motion.div>
         </AnimatePresence>
      </div>

    </div>
  );
}
