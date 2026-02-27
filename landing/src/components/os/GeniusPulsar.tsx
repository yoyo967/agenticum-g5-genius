import { motion } from 'framer-motion';
import { Bot, Mic } from 'lucide-react';

interface GeniusPulsarProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const GeniusPulsar: React.FC<GeniusPulsarProps> = ({ state }) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Ghost Rings */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-neural-blue/20 rounded-full"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.2, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-20px] border border-neural-gold/10 rounded-full border-dashed"
      />

      {/* Core Pulsar */}
      <motion.div
        animate={{
          scale: state === 'listening' ? [1, 1.1, 1] : [1, 1.05, 1],
          boxShadow: state === 'thinking' 
            ? ['0 0 40px rgba(0, 229, 255, 0.2)', '0 0 100px rgba(251, 188, 4, 0.4)', '0 0 40px rgba(0, 229, 255, 0.2)']
            : ['0 0 40px rgba(0, 229, 255, 0.2)', '0 0 60px rgba(0, 229, 255, 0.3)', '0 0 40px rgba(0, 229, 255, 0.2)']
        }}
        transition={{ duration: state === 'listening' ? 0.5 : 2, repeat: Infinity }}
        className="relative w-32 h-32 rounded-full glass border-neural-blue/30 flex items-center justify-center z-10"
      >
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-neural-blue/10 to-transparent" />
        <AnimatePresence mode="wait">
          {state === 'listening' ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Mic size={32} className="text-neural-gold drop-shadow-[0_0_10px_rgba(251,188,4,0.5)]" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Bot size={32} className="text-neural-blue drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner Orbital Nodes */}
        {state === 'thinking' && (
          <div className="absolute inset-0">
             {[...Array(3)].map((_, i) => (
               <motion.div
                 key={i}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                 className="absolute inset-0 flex items-start justify-center"
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-neural-gold mt-1 shadow-[0_0_8px_rgba(251,188,4,0.8)]" />
               </motion.div>
             ))}
          </div>
        )}
      </motion.div>

      {/* Voice Visualizer Rings (when listening or thinking) */}
      {(state === 'listening' || state === 'thinking') && (
        <div className="absolute inset-x-0 -bottom-12 flex items-center justify-center gap-1.5 h-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-neural-blue' : 'bg-neural-gold'}`}
              animate={{ 
                height: ['20%', `${20 + (i * 7.5) % 80}%`, '20%'] 
              }}
              transition={{ 
                duration: 0.4 + (i * 0.1) % 0.3, 
                repeat: Infinity 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';
