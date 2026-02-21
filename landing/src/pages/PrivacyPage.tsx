import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian text-white font-body selection:bg-neural-blue/30 selection:text-neural-blue relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-neural-blue/10 via-obsidian to-obsidian pointer-events-none" />
      
      <div className="w-full max-w-3xl relative z-10 animate-fade-in">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-neural-blue transition-colors mb-12 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-3xl border border-white/5 bg-black/40"
        >
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter mb-8 text-white">Privacy Policy</h1>
          <div className="space-y-6 text-white/60 font-light leading-relaxed text-sm lg:text-base">
            <p>Data processing within the AGENTICUM G5 OS is strictly ephemeral. All audio and textual inputs ingested via the Gemini Live API or Vertex Architect pathways are processed in volatile memory and purged immediately upon action resolution.</p>
            <p>No systemic telemetry or persistent storage is maintained without explicit runtime parameters. This architecture ensures absolute compliance with enterprise data containment protocols.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
