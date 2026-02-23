import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, BrainCircuit, Layers, Image as ImageIcon, CheckCircle2, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface FlowStep {
  id: number;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  description: string;
  color: string;
  tech: string;
  duration: number;
}

const STEPS: FlowStep[] = [
  {
    id: 0,
    icon: <Mic size={22} />,
    label: 'VOICE INPUT',
    sublabel: 'Gemini Live API',
    description: '"SN-00, erstelle eine Counter-Strike-Kampagne gegen Wettbewerber Alpha."',
    color: '#FFD700',
    tech: 'WebRTC · PCM 16kHz · Base64 Stream',
    duration: 1800,
  },
  {
    id: 1,
    icon: <Zap size={22} />,
    label: 'INTENT DETECTION',
    sublabel: 'Function Calling',
    description: 'Gemini erkennt Marketing-Intent → ruft launch_swarm() auf statt zu halluzinieren.',
    color: '#00E5FF',
    tech: 'Gemini 2.0 Flash · BidiGenerateContent · Tool Use',
    duration: 1400,
  },
  {
    id: 2,
    icon: <BrainCircuit size={22} />,
    label: 'SN-00 ORCHESTRATOR',
    sublabel: 'SwarmProtocol',
    description: 'Master-Agent generiert einen Execution Plan und verteilt Tasks an alle Sub-Agenten.',
    color: '#00E5FF',
    tech: '@google/genai SDK · Dependency Graph · ChainManager',
    duration: 2000,
  },
  {
    id: 3,
    icon: <Layers size={22} />,
    label: 'PARALLEL SWARM',
    sublabel: 'SP-01 · CC-06 · DA-03',
    description: 'SP-01 analysiert Wettbewerb. CC-06 schreibt Copy. DA-03 generiert Visuals via Imagen 3 — alles gleichzeitig.',
    color: '#FF007A',
    tech: 'Vertex AI · Imagen 3 · Google Search Grounding',
    duration: 2400,
  },
  {
    id: 4,
    icon: <CheckCircle2 size={22} />,
    label: 'SENATE GATE',
    sublabel: 'RA-01 Auditor',
    description: 'Jedes generierte Asset wird auf EU AI Act, FTC & Dark Patterns geprüft. Kein Output ohne Freigabe.',
    color: '#00FF88',
    tech: 'EU AI Act Art.50 · DSGVO · Perfect Twin Logging',
    duration: 1600,
  },
  {
    id: 5,
    icon: <ImageIcon size={22} />,
    label: 'LIVE OUTPUT',
    sublabel: 'Interleaved Result',
    description: 'Bilder, Copy und Strategy erscheinen live in der Console — noch während der Swarm arbeitet.',
    color: '#7B2FBE',
    tech: 'WebSocket EventFabric · Framer Motion · Firestore',
    duration: 0,
  },
];

export function VoiceFlowSection() {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const runDemo = () => {
    setActiveStep(-1);
    setCompletedSteps(new Set());
    setIsRunning(true);
  };

  const reset = () => {
    setActiveStep(-1);
    setCompletedSteps(new Set());
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;

    let totalDelay = 300;

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(i);
      }, totalDelay);
      totalDelay += step.duration;

      setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, i]));
        if (i === STEPS.length - 1) setIsRunning(false);
      }, totalDelay - 200);
    });
  }, [isRunning]);

  const activeStepData = activeStep >= 0 ? STEPS[activeStep] : null;

  return (
    <section className="py-40 px-6 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="badge badge-processing mb-6 mx-auto w-fit">
            <Zap size={10} /> Break the Text-Box — Live Demo
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display font-bold uppercase tracking-tight leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
            Keine Textbox.<br />
            <span className="text-accent">Eine Stimme.</span><br />
            Ein Swarm.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Du sprichst einen Befehl. Gemini 2.0 versteht den Intent und triggert in Millisekunden
            5 spezialisierte Agenten — die gleichzeitig denken, schreiben, visualisieren und auditieren.
          </motion.p>
        </div>

        {/* Flow Diagram */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-[44px] left-[calc(8.333%+24px)] right-[calc(8.333%+24px)] h-px bg-white/5 hidden lg:block" />
          <motion.div
            className="absolute top-[44px] left-[calc(8.333%+24px)] h-px bg-accent/40 hidden lg:block"
            style={{ width: activeStep >= 0 ? `${(activeStep / (STEPS.length - 1)) * 100}%` : '0%' }}
            animate={{ width: activeStep >= 0 ? `${(activeStep / (STEPS.length - 1)) * 100}%` : '0%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Steps */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-3 mb-16">
            {STEPS.map((step, i) => {
              const isActive = activeStep === i;
              const isDone = completedSteps.has(i);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Node */}
                  <div className="relative mb-4">
                    {isActive && (
                      <motion.div
                        className="absolute inset-[-12px] rounded-full"
                        style={{ background: `${step.color}20` }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      />
                    )}
                    <div
                      className="w-[88px] h-[88px] rounded-2xl flex items-center justify-center border transition-all duration-500 relative z-10"
                      style={{
                        background: isActive || isDone ? `${step.color}15` : 'rgba(255,255,255,0.03)',
                        borderColor: isActive || isDone ? `${step.color}60` : 'rgba(255,255,255,0.08)',
                        boxShadow: isActive ? `0 0 30px ${step.color}30` : 'none',
                        color: isActive || isDone ? step.color : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {isDone && !isActive ? <CheckCircle2 size={22} /> : step.icon}
                    </div>

                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                      style={{ background: isDone || isActive ? step.color : 'rgba(255,255,255,0.1)', color: isDone || isActive ? '#000' : 'rgba(255,255,255,0.3)' }}>
                      {i + 1}
                    </div>
                  </div>

                  <p className="font-mono text-[9px] font-black uppercase tracking-widest mb-1 transition-colors"
                    style={{ color: isActive || isDone ? step.color : 'rgba(255,255,255,0.3)' }}>
                    {step.label}
                  </p>
                  <p className="font-mono text-[8px] text-white/20 uppercase tracking-wider">{step.sublabel}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Active Step Detail */}
          <AnimatePresence mode="wait">
            {activeStepData && (
              <motion.div
                key={activeStepData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 mb-12 border-l-4"
                style={{ borderLeftColor: activeStepData.color }}
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${activeStepData.color}15`, color: activeStepData.color }}>
                    {activeStepData.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest"
                        style={{ color: activeStepData.color }}>
                        {activeStepData.label}
                      </span>
                      <motion.div className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: activeStepData.color }} />
                    </div>
                    <p className="font-mono text-sm text-white/70 mb-3 italic">"{activeStepData.description}"</p>
                    <div className="flex flex-wrap gap-2">
                      {activeStepData.tech.split(' · ').map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border"
                          style={{ borderColor: `${activeStepData.color}30`, color: `${activeStepData.color}80`, background: `${activeStepData.color}08` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {!activeStepData && !isRunning && completedSteps.size === 0 && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 mb-12 text-center border-dashed"
              >
                <p className="font-mono text-white/20 text-sm uppercase tracking-widest">
                  Drücke "Run Demo" um den kompletten Voice→Swarm→Output Flow zu simulieren
                </p>
              </motion.div>
            )}
            {!activeStepData && completedSteps.size === STEPS.length && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 mb-12 text-center border border-emerald/30"
                style={{ background: 'rgba(0,255,136,0.05)' }}
              >
                <CheckCircle2 size={32} className="text-emerald mx-auto mb-3" />
                <p className="font-display text-2xl font-bold uppercase tracking-tight text-emerald mb-2">
                  Swarm Complete
                </p>
                <p className="font-mono text-white/40 text-sm">
                  Von Sprache zum fertigen Marketing-Asset in unter 60 Sekunden. End-to-End.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            {!isRunning && completedSteps.size === 0 ? (
              <motion.button
                onClick={runDemo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-3 text-sm px-8 py-4"
              >
                <Play size={16} /> Run Demo — Voice Flow Simulation
              </motion.button>
            ) : (
              <motion.button
                onClick={reset}
                disabled={isRunning}
                whileHover={{ scale: 1.05 }}
                className="btn-outline flex items-center gap-2 text-xs py-3 px-6 disabled:opacity-40"
              >
                <RotateCcw size={14} /> Reset
              </motion.button>
            )}
            <div className="flex items-center gap-2 text-white/20 font-mono text-[10px] uppercase tracking-widest">
              <ArrowRight size={12} />
              Oder: Enter OS Portal und spreche live mit SN-00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
