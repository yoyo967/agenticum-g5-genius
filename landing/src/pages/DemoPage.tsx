import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, Shield, Activity, Globe, CheckCircle2, 
  Database, Cpu, Zap, FileText, 
  Palette, Sparkles, Film, Bot, Lock, ArrowRight
} from 'lucide-react';
import { useCounterStrike } from '../hooks/useCounterStrike';
import type { CompetitorOverlap } from '../hooks/useCounterStrike';

export function DemoPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { data, analyzeTopic } = useCounterStrike();
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [agentsOnline, setAgentsOnline] = useState<string[]>([]);

  const agents = useMemo(() => [
    { id: 'SN-00', icon: <Cpu size={14} />, color: '#00E5FF' },
    { id: 'SO-00', icon: <Lock size={14} />, color: '#FBBC04' },
    { id: 'SP-01', icon: <Zap size={14} />, color: '#00FF88' },
    { id: 'CC-06', icon: <FileText size={14} />, color: '#FF007A' },
    { id: 'DA-03', icon: <Palette size={14} />, color: '#FFD700' },
    { id: 'BA-07', icon: <Sparkles size={14} />, color: '#7B2FBE' },
    { id: 'VE-01', icon: <Film size={14} />, color: '#FF6B35' },
    { id: 'RA-01', icon: <Shield size={14} />, color: '#00FF88' },
  ], []);

  // Timer Sequence
  useEffect(() => {
    // STEP 1: Boot Sequence
    const logInterval = setInterval(() => {
      const logs = [
        "INITIALIZING NEURAL CORE...",
        "CONNECTING TO VERTEX AI HUB...",
        "SWARM PROTOCOL V2.0 ACTIVATED",
        "SYNCING PERFECT TWIN PROVENANCE...",
        "ALL SYSTEMS NOMINAL. STANDBY."
      ];
      setBootLogs(prev => logs.slice(0, prev.length + 1));
    }, 500);

    const agentInterval = setInterval(() => {
      setAgentsOnline(prev => {
        if (prev.length < agents.length) {
          return [...prev, agents[prev.length].id];
        }
        return prev;
      });
    }, 300);

    const s2 = setTimeout(() => { 
      setStep(2); 
      analyzeTopic("Enterprise AI Marketing"); 
    }, 4000);

    // STEP 3: Results
    const s3 = setTimeout(() => setStep(3), 9000);
    
    // STEP 4: Senate
    const s4 = setTimeout(() => setStep(4), 15000);

    // STEP 5: Perfect Twin
    const s5 = setTimeout(() => setStep(5), 19000);

    // STEP 6: CTA
    const s6 = setTimeout(() => setStep(6), 23000);

    return () => {
      clearInterval(logInterval);
      clearInterval(agentInterval);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(s4);
      clearTimeout(s5);
      clearTimeout(s6);
    };
  }, [analyzeTopic, agents]);

  return (
    <div className="min-h-screen bg-midnight text-white font-mono relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
        style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

      <AnimatePresence mode="wait">
        {/* STEP 1: BOOT */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center z-10 max-w-lg w-full">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
              className="mb-12 inline-block">
              <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)]">
                <Bot size={40} className="text-midnight" />
              </div>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-4">
              Agenticum <span className="text-accent underline decoration-2 underline-offset-8">G5 Genius</span>
            </h1>
            <div className="space-y-1 mb-12 min-h-[100px]">
              {bootLogs.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] uppercase tracking-widest text-accent/60">
                  {log}
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {agents.map((agent) => (
                <div key={agent.id} className={`p-2 border transition-all duration-300 ${agentsOnline.includes(agent.id) ? 'border-accent/40 bg-accent/5 opacity-100' : 'border-white/5 opacity-20'}`}>
                   <div className="text-accent mb-1">{agent.icon}</div>
                   <div className="text-[8px] font-bold">{agent.id}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: COUNTER-STRIKE SCAN */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="z-10 w-full max-w-4xl">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 border border-accent/20 rounded-full" />
                <div className="absolute inset-4 border border-accent/10 rounded-full" />
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-accent rounded-full" />
                <Radar size={80} className="text-accent/30 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase mb-4">
                  <Activity size={10} className="animate-pulse" /> SP-01 Scanning Neural Fabric
                </div>
                <h2 className="text-4xl font-display font-black uppercase tracking-tight mb-4">
                  Cyber-Obsidian <br/><span className="text-accent">Competitor Analysis.</span>
                </h2>
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl">
                  <div className="text-[10px] text-white/40 mb-2 uppercase tracking-widest">Columna Intelligence Engine:</div>
                  <div className="text-accent flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    ACQUIRING MULTI-AGENT VECTORS...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: RESULTS REVEAL */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="z-10 w-full max-w-5xl">
            <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Competitor Intelligence Acquired ✓</h2>
              <div className="text-[10px] text-accent font-black uppercase">HTTP 200 OK · Columna V5</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(data?.overlap || [
                { competitor: "Legacy AI Corp", their_h2_structure: ["Manual Integration", "Siloed Tasks", "Fragmented Output"] },
                { competitor: "SaaS Automator v1", their_h2_structure: ["Linear Workflows", "Template-Based", "Zero Voice"] },
                { competitor: "Cloud Wrapper Inc", their_h2_structure: ["API Pass-through", "High Latency", "Mock Telemetry"] }
              ]).slice(0, 3).map((comp: CompetitorOverlap, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Globe size={40} />
                  </div>
                  <div className="text-[10px] text-accent mb-2 font-black uppercase">Entity {i+1}</div>
                  <h3 className="text-xl font-bold mb-6 text-white group-hover:text-accent transition-colors">{comp.competitor}</h3>
                  <div className="space-y-3">
                    {comp.their_h2_structure.map((h2: string, j: number) => (
                      <div key={j} className="text-[10px] text-white/40 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/20" /> {h2}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: SENATE GATE */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
             className="z-10 w-full max-w-2xl text-center">
             <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 2, ease: "easeInOut" }}
               className="mb-10 inline-block">
               <Shield size={100} className="text-[#00FF88] shadow-[0_0_60px_rgba(0,255,136,0.3)]" />
             </motion.div>
             <h2 className="text-5xl font-display font-black uppercase mb-12">Compliance <span className="text-[#00FF88]">Audit</span></h2>
             
             <div className="space-y-4 text-left">
               {[
                 { label: "EU AI Act Art.50", delay: 0 },
                 { label: "GDPR Compliant", delay: 0.5 },
                 { label: "C2PA Provenance", delay: 1.0 },
                 { label: "Hallucination: 0%", delay: 1.5 }
               ].map((item, i) => (
                 <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay }}
                   className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                   <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                   <CheckCircle2 className="text-[#00FF88]" size={20} />
                 </motion.div>
               ))}
             </div>

             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
               className="mt-12 py-3 px-8 bg-[#00FF88]/10 border border-[#00FF88]/40 rounded-full inline-block">
               <span className="text-[#00FF88] font-black tracking-[0.4em] uppercase">Senate Approved</span>
             </motion.div>
          </motion.div>
        )}

        {/* STEP 5: PERFECT TWIN */}
        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="z-10 w-full max-w-4xl overflow-hidden glass-card p-12 border border-accent/20 rounded-[40px] relative">
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <Database size={150} />
             </div>
             <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
                 <Database size={20} className="text-accent" />
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tight">Provenance Matrix Sealed</h2>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                      <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Immutable Output Hash</div>
                      <div className="text-xs break-all font-mono text-accent">0x8F92A7C3D5E7B1A9A2C8D1E6B5A4F0C2...</div>
                   </div>
                   <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                      <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Timestamp Authority</div>
                      <div className="text-xs font-mono text-white/80">{new Date().toISOString()}</div>
                   </div>
                </div>
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                   <div className="text-[9px] text-white/30 uppercase tracking-widest mb-4">Verification Trail:</div>
                   <div className="flex flex-wrap gap-3">
                     {agents.map(a => (
                       <span key={a.id} className="text-[8px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/40 uppercase">
                         {a.id} · SEALED
                       </span>
                     ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* STEP 6: CTA */}
        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             className="z-10 text-center max-w-4xl">
             <div className="mb-8 inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest">
                Gemini Live Agent Challenge 2026
             </div>
             <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 leading-[0.85]">
               8 Agents. <br/> <span className="text-accent">Zero Friction.</span>
             </h1>
             <p className="text-white/40 text-lg md:text-xl font-display italic mb-12 max-w-2xl mx-auto">
                "One voice command. Unlimited potential. Welcome to the era of Homo Architektus."
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button onClick={() => navigate('/')} 
                  className="btn-primary flex items-center gap-3 text-lg px-10 py-5 shadow-[0_0_50px_rgba(0,229,255,0.4)]">
                  Enter The OS <ArrowRight size={20} />
                </button>
                <button onClick={() => window.open('/docs', '_blank')}
                  className="px-10 py-5 border border-white/10 hover:bg-white/5 transition-colors uppercase font-black tracking-widest text-sm">
                  View Architecture
                </button>
             </div>
             <div className="mt-20 text-[10px] uppercase font-black tracking-[0.5em] text-white/20">
                Phase 1 of 5 — Now Live
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
