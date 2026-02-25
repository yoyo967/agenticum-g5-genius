import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, Lightbulb, FileText, 
  ChevronLeft, Sparkles, 
  Send, RefreshCw, CheckCircle, 
  Type, Layout, Image as ImageIcon
} from 'lucide-react';

import { API_BASE_URL } from '../../config';

type WizardStep = 'idea' | 'concept' | 'outline' | 'script';

export const ScriptWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('idea');
  const [idea, setIdea] = useState('');
  const [content, setContent] = useState<Record<WizardStep, string>>({
    idea: '',
    concept: '',
    outline: '',
    script: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps: { key: WizardStep; label: string; icon: React.ReactNode }[] = [
    { key: 'idea', label: 'Seed Idea', icon: <Lightbulb size={16} /> },
    { key: 'concept', label: 'Neural Concept', icon: <Sparkles size={16} /> },
    { key: 'outline', label: 'Structure', icon: <Layout size={16} /> },
    { key: 'script', label: 'Cinematic Script', icon: <FileText size={16} /> },
  ];

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setProgress(10);

    const stepOrder: WizardStep[] = ['idea', 'concept', 'outline', 'script'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextStep = stepOrder[currentIndex + 1];

    try {
      const response = await fetch(`${API_BASE_URL}/blog/script-wizard/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idea, 
          step: nextStep,
          context: content[currentStep] 
        })
      });

      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setContent(prev => ({ ...prev, [nextStep]: data.result }));
      setCurrentStep(nextStep);
    } catch (error) {
      console.error('Wizard failed:', error);
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden font-mono">
      {/* Stepper */}
      <div className="px-8 py-6 border-b border-white/5 bg-white/3">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Wand2 className="text-accent" size={20} />
                Script Wizard
              </h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                Idea to Cinematic Narrative Pipeline
              </p>
           </div>
           <StatusBadge status={isGenerating ? 'processing' : 'idle'} />
        </div>

        <div className="flex items-center justify-between relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          {steps.map((step, idx) => {
            const isActive = currentStep === step.key;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > idx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: isActive || isCompleted ? 'rgba(0, 229, 255, 1)' : 'rgba(255, 255, 255, 0.05)',
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'text-void' : isCompleted ? 'text-void' : 'text-white/20'}`}
                >
                  {isCompleted ? <CheckCircle size={18} /> : step.icon}
                </motion.div>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${isActive ? 'text-accent' : 'text-white/20'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {currentStep === 'idea' && (
            <motion.div
              key="step-idea"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-2">
                   <Type size={18} className="text-accent" />
                   What is the spark of your story?
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Provide a brief description of your project. The more specific the context, 
                  the sharper the neural draft.
                </p>
              </div>

              <div className="flex-1 relative">
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. A cyberpunk neo-noir where an AI detective realizes they are a glitch in the simulation they are investigating..."
                  className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 focus:ring-1 focus:ring-accent/40 focus:border-accent/40 outline-none transition-all resize-none placeholder:text-white/10"
                />
                
                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                  <span className="text-[10px] text-white/10 uppercase tracking-widest">
                    AI: Gemini 2.0 // Neural Engine active
                  </span>
                  <button 
                    disabled={!idea || isGenerating}
                    onClick={handleGenerate}
                    className="flex items-center gap-3 bg-accent text-void px-6 py-2.5 rounded-xl font-black text-xs hover:bg-accent/80 transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(0,229,255,0.3)] animate-glow"
                  >
                    {isGenerating ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Ignite Concept
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep !== 'idea' && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
               <div className="flex-1 bg-white/3 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                  {/* Neural Grid Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 h-full overflow-y-auto scrollbar-none">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent/60">
                           <ImageIcon size={12} />
                           Drafting {currentStep}...
                        </div>
                        <div className="flex items-center gap-2">
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                  )}
               </div>

               <div className="flex items-center justify-between mt-6">
                 <button 
                  onClick={() => {
                    const idx = steps.findIndex(s => s.key === currentStep);
                    setCurrentStep(steps[idx - 1].key);
                  }}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
                 >
                   <ChevronLeft size={14} />
                   Back to {steps[steps.findIndex(s => s.key === currentStep) - 1]?.label}
                 </button>

                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest">
                       Export Draft
                    </button>
                    <button 
                      onClick={handleGenerate}
                      className="flex items-center gap-3 bg-accent text-void px-8 py-2.5 rounded-xl font-black text-xs hover:bg-accent/80 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                    >
                      {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      Evolve to {steps[steps.findIndex(s => s.key === currentStep) + 1]?.label}
                    </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'idle' | 'processing' }> = ({ status }) => (
  <div className={`px-3 py-1 rounded-full flex items-center gap-2 border ${status === 'processing' ? 'bg-accent/10 border-accent/20' : 'bg-white/5 border-white/10'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${status === 'processing' ? 'bg-accent animate-pulse shadow-[0_0_8px_rgba(0,229,255,1)]' : 'bg-white/20'}`} />
    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${status === 'processing' ? 'text-accent' : 'text-white/20'}`}>
      {status === 'processing' ? 'Orchestrating' : 'Neural Standby'}
    </span>
  </div>
);
