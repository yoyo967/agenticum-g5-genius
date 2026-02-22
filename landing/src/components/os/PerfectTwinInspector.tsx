import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Search, ExternalLink, CheckCircle, AlertTriangle, Info, Terminal } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface AuditLog {
  id: string;
  run_id: string;
  type: 'grounding' | 'senate' | 'audit';
  agent: string;
  message: string;
  sources?: string[];
  score?: number;
  timestamp: any;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export function PerfectTwinInspector() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'grounding' | 'senate'>('live');

  useEffect(() => {
    // Real-time subscription to perfect twin logs
    const q = query(
      collection(db, 'perfect_twin_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditLog[];
      setLogs(newLogs);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'live') return true;
    if (activeTab === 'grounding') return log.type === 'grounding';
    if (activeTab === 'senate') return log.type === 'senate' || log.type === 'audit';
    return true;
  });

  return (
    <div className="h-full flex flex-col gap-4 font-sans text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
            <Eye size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-tight">Perfect Twin Inspector</h3>
            <p className="font-mono text-[9px] text-white/30 truncate">Real-time Provenance & Audit Trail</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
          {['live', 'grounding', 'senate'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1 rounded-md font-mono text-[9px] uppercase transition-colors ${activeTab === tab ? 'bg-accent text-void' : 'text-white/40 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex flex-col">
        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={10} className="text-accent" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Audit Terminal v2.1</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          <AnimatePresence initial={false}>
            {filteredLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Search size={32} className="mb-2" />
                <p className="font-mono text-[10px] uppercase">Awaiting Swarm Initialization...</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="shrink-0 mt-0.5">
                    {log.severity === 'success' && <CheckCircle size={14} className="text-emerald" />}
                    {log.severity === 'warning' && <AlertTriangle size={14} className="text-gold" />}
                    {log.severity === 'error' && <AlertTriangle size={14} className="text-red-500" />}
                    {log.severity === 'info' && <Info size={14} className="text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{log.agent}</span>
                      <span className="font-mono text-[8px] text-white/20">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : 'RECENT'}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed mb-2">{log.message}</p>
                    
                    {log.sources && log.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/5">
                        {log.sources.slice(0, 3).map((src, idx) => (
                          <a 
                            key={idx} 
                            href={src} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 font-mono text-[9px] bg-white/5 px-2 py-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          >
                            <ExternalLink size={8} /> Source #{idx + 1}
                          </a>
                        ))}
                      </div>
                    )}

                    {log.score !== undefined && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${log.score}%` }}
                            className={`h-full ${log.score > 90 ? 'bg-emerald' : log.score > 70 ? 'bg-gold' : 'bg-red-500'}`}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-white/40">{log.score}% Quality</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compliance Indicator */}
      <div className="glass p-4 rounded-xl flex items-center justify-between border-emerald/20">
        <div className="flex items-center gap-3">
          <Shield size={18} className="text-emerald" />
          <div>
            <span className="text-[10px] font-mono uppercase text-white/30 block leading-none mb-1">Senate Compliance Gate</span>
            <span className="text-[11px] font-display uppercase tracking-widest text-emerald">Active // Zero Veto Protocol</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-mono text-white/20 block">EU AI Act (Art. 50)</span>
          <span className="text-[10px] font-mono text-emerald">FULFILLED</span>
        </div>
      </div>
    </div>
  );
}
