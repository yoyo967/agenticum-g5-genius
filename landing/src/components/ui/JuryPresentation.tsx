import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, ChevronRight, Sparkles,
  Map, Brain, Video, Shield, CheckCircle2,
  X
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  module: string; // The OS module to navigate to
  action?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Mission Briefing',
    description: 'Welcome to the AGENTICUM G5 Command Center. You are witnessing the ultimate convergence of swarm intelligence and cinematic marketing.',
    icon: <Sparkles className="text-accent" size={24} />,
    module: 'console'
  },
  {
    id: 'geopolitics',
    title: 'Sovereign Presence',
    description: 'The Geopolitics Hub analyzes real-time regulatory and cultural data using Grounded Vertex AI to calibrate global strategy.',
    icon: <Map className="text-neural-gold" size={24} />,
    module: 'geopolitics'
  },
  {
    id: 'swarm',
    title: 'Collective Intelligence',
    description: 'Real-time telemetry from 48+ autonomous agents. Each node is self-optimizing through sentient feedback loops.',
    icon: <Brain className="text-neural-blue" size={24} />,
    module: 'swarm'
  },
  {
    id: 'forge',
    title: 'Cinematic Forge',
    description: 'Creative synthesis at scale. Watch how the GenIUS swarm builds storyboard assets with audited precision.',
    icon: <Video className="text-magenta" size={24} />,
    module: 'cinematic'
  },
  {
    id: 'senate',
    title: 'Algorithmic Senate',
    description: 'Every decision is vetted by the RA01 Auditor for technical purity, ethics, and economic efficiency.',
    icon: <Shield className="text-red-500" size={24} />,
    module: 'senate'
  },
  {
    id: 'conclusion',
    title: 'Mission Achievement',
    description: 'AGENTICUM G5 is fully hardened, budget-aware, and ready for deployment. The mission is stabilized.',
    icon: <CheckCircle2 className="text-green-500" size={24} />,
    module: 'console'
  }
];

interface JuryPresentationProps {
  onModuleChange: (module: string) => void;
  onClose: () => void;
}

export const JuryPresentation: React.FC<JuryPresentationProps> = ({ onModuleChange, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const duration = 8000; // 8 seconds per step
    const interval = 100;
    const stepIncrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, handleNext]);

  useEffect(() => {
    onModuleChange(currentStep.module);
  }, [currentStepIndex, currentStep.module, onModuleChange]);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 pointer-events-none">
       {/* Background Dim */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-void/40 backdrop-blur-xs pointer-events-auto"
         onClick={onClose}
       />

       <motion.div 
         initial={{ opacity: 0, y: 50, scale: 0.9 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         exit={{ opacity: 0, y: 50, scale: 0.9 }}
         className="relative w-full max-w-xl glass-card p-8 border-accent/30 shadow-[0_0_100px_rgba(0,229,255,0.2)] pointer-events-auto"
       >
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
             <motion.div 
               className="h-full bg-accent shadow-[0_0_15px_rgba(0,229,255,0.6)]"
               animate={{ width: `${progress}%` }}
               transition={{ ease: "linear" }}
             />
          </div>

          <div className="flex items-start justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                   {currentStep.icon}
                </div>
                <div>
                   <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-white">
                      {currentStep.title}
                   </h2>
                   <p className="text-[10px] font-mono font-black text-accent uppercase tracking-[0.3em]">
                      Jury Presentation Mode // Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                   </p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all">
                <X size={20} />
             </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8 min-h-section">
             <AnimatePresence mode="wait">
                <motion.p 
                  key={currentStep.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-lg text-white/80 leading-relaxed font-medium italic"
                >
                   "{currentStep.description}"
                </motion.p>
             </AnimatePresence>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={currentStepIndex === 0} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 disabled:opacity-30">
                   <ChevronRight size={20} className="rotate-180" />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-3 rounded-xl bg-accent text-void font-bold uppercase tracking-widest flex items-center gap-3">
                   {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                   {isPlaying ? 'Pause Tour' : 'Resume Tour'}
                </button>
                <button onClick={handleNext} disabled={currentStepIndex === TOUR_STEPS.length - 1} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 disabled:opacity-30">
                   <ChevronRight size={20} />
                </button>
             </div>
             
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Operational Status</span>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                   <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-tighter">Mission Stabilized</span>
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  );
};
