import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Activity, Globe, BarChart3, Plus, Cpu } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface CompetitorIntel {
  id: string;
  url: string;
  name: string;
  threat_score: number;
  skeleton?: string[];
  status: 'monitoring' | 'decompiling' | 'archived';
  timestamp: unknown;
}

export function ColumnaRadar() {
  const [intel, setIntel] = useState<CompetitorIntel[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Real-time subscription to Columna Intel
    const q = query(collection(db, 'competitor_intel'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CompetitorIntel[];
      setIntel(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 font-sans text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
            <Target size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display text-lg uppercase tracking-tight">Columna Intelligence Radar</h2>
            <p className="font-mono text-[10px] text-white/30">sp01 Zero-Day Competitive Intel Feed</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn btn-primary btn-sm" 
          style={{ background: 'var(--color-gold)', borderColor: 'var(--color-gold)', color: '#000' }}
        >
          <Plus size={14} /> Add Target
        </button>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Left: Target List */}
        <div className="w-1/2 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card border-gold/30 bg-gold/5 p-4 mb-2"
              >
                <label className="label text-gold/60">Competitor URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newUrl} 
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://competitor.com"
                    className="input flex-1 bg-black/40 border-gold/20 focus:border-gold"
                  />
                  <button className="btn btn-sm" style={{ background: 'var(--color-gold)', color: '#000' }}>
                    Track
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {intel.length === 0 ? (
            <div className="flex-1 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-white/20">
              <Activity size={40} className="mb-4 opacity-10" />
              <p className="font-mono text-[10px] uppercase">No Targets Active</p>
            </div>
          ) : (
            intel.map(item => (
              <motion.div 
                key={item.id}
                layout
                className="card group hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'decompiling' ? 'bg-gold animate-pulse' : 'bg-emerald'}`} />
                    <div>
                      <h4 className="font-display text-sm uppercase group-hover:text-gold transition-colors">{item.name || item.url.split('/')[2]}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Globe size={10} className="text-white/20" />
                        <span className="font-mono text-[9px] text-white/30 truncate max-w-[150px]">{item.url}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[18px] font-bold text-gold">{item.threat_score}</span>
                    <span className="block font-mono text-[8px] text-white/20 uppercase">Threat Score</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="badge badge-warning text-[8px]">SEO Giant</span>
                  <span className="badge badge-outline text-[8px]">AD-CLONEABLE</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right: Intel Detail / Skeleton View */}
        <div className="flex-1 glass border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-gold" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Decompiled Data Structure</span>
            </div>
            <div className="badge badge-processing">SP-01 ACTIVE</div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
            {intel.length > 0 && intel[0].skeleton ? (
              <div className="space-y-4">
                <div className="text-gold/50 text-[9px] uppercase mb-2">// COMPETITIVE CONTENT SKELETON RECOVERED</div>
                {intel[0].skeleton.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 group"
                  >
                    <span className="text-white/10 w-4">{i+1}</span>
                    <span className="text-white/60 group-hover:text-white transition-colors">{line}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <BarChart3 size={48} className="mb-4" />
                <p className="font-mono text-center px-10">Select a target to view decompiled H2/H3 architecture and zero-day gaps.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-gold/5 border-t border-gold/10">
             <div className="flex items-center gap-2 mb-2">
               <Cpu size={12} className="text-gold" />
               <span className="font-mono text-[10px] uppercase text-gold">Counter-Strike Opportunity</span>
             </div>
             <p className="text-[10px] text-white/40 leading-snug italic">
               Detected lack of long-tail grounding for "Agentic Workflows" on this target. CC-06 can bridge this gap with a 94% win probability.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
