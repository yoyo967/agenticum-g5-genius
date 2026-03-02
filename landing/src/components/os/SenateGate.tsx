import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SenateGateProps {
  /** Increment this to trigger a new review sequence */
  triggerKey: number;
  /** Called when the sequence finishes */
  onComplete?: () => void;
}

const STEPS = [
  { label: 'EU AI ACT ART.50', icon: '🇪🇺' },
  { label: 'GDPR COMPLIANT', icon: '🔒' },
  { label: 'HALLUCINATION CHECK', icon: '🧠' },
  { label: 'SENATE APPROVED', icon: '✅', final: true },
];

export function SenateGate({ triggerKey, onComplete }: SenateGateProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) return;
    setVisibleSteps([]);
    setRunning(true);

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i]);
        if (i === STEPS.length - 1) {
          setRunning(false);
          onComplete?.();
        }
      }, 300 * (i + 1));
    });
  }, [triggerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (triggerKey === 0 && visibleSteps.length === 0) return null;

  return (
    <div className="mt-4 border border-zinc-800 bg-zinc-950 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">
          RA-01 SENATE REVIEW
        </span>
        {running && (
          <span className="ml-auto font-mono text-xs text-zinc-600 animate-pulse">
            EVALUATING...
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {STEPS.map((step, i) =>
            visibleSteps.includes(i) ? (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 px-3 py-2 rounded ${
                  step.final
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-zinc-900'
                }`}
              >
                <span className="text-base">{step.icon}</span>
                <span
                  className={`font-mono text-xs uppercase tracking-widest ${
                    step.final ? 'text-green-400 font-bold' : 'text-zinc-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="ml-auto font-mono text-xs text-green-500">✓</span>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
