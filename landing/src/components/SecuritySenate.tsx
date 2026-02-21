import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Scale, Leaf, DollarSign, FileText, ArrowRight } from 'lucide-react';

export function SecuritySenate() {
  const [selectedCase, setSelectedCase] = useState<string | null>('case-01');

  const pendingCases = [
    { id: 'case-01', agent: 'CC-06', type: 'External Publication', risk: 'High', title: 'Q3 Earnings Predictive Tweet' },
    { id: 'case-02', agent: 'DA-03', type: 'Asset Generation', risk: 'Medium', title: 'Competitor Logo Glitch Art' },
    { id: 'case-03', agent: 'SP-01', type: 'Data Scraping', risk: 'Low', title: 'Public Subreddit Sentiment Analysis' }
  ];

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 bg-red-950/20 border border-red-500/10 p-6 rounded-2xl glass">
         <div>
           <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <ShieldAlert size={20} className="text-red-500" />
             The Security Senate
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Algorithmic Tribunal & Final Override Control</p>
         </div>
         <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">RA-01 Interventions</p>
              <p className="text-2xl font-mono text-white flex items-center justify-end gap-2">
                3 Pending
              </p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Approval Rate</p>
              <p className="text-2xl font-mono text-white">94.2%</p>
            </div>
         </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[500px]">
        
        {/* Left: Pending Docket */}
        <div className="w-1/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-4 border-b border-white/5 bg-black/60 shrink-0 flex justify-between items-center">
             <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
               <Scale size={14} className="text-white/50" />
               Pending Docket
             </h3>
             <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">Action Req</span>
           </div>
           <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
             {pendingCases.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCase(c.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCase === c.id ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                >
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{c.type}</span>
                     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${c.risk === 'High' ? 'bg-red-500/10 border-red-500/30 text-red-500' : c.risk === 'Medium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>{c.risk} Risk</span>
                   </div>
                   <p className="text-sm font-bold text-white mb-2 leading-tight">{c.title}</p>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                      <FileText size={10} /> Origin: <span className="text-white font-black">{c.agent}</span>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Right: Tribunal Chamber */}
        <div className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative">
           
           <AnimatePresence mode="wait">
             {selectedCase === 'case-01' && (
               <motion.div 
                 key="case-01"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="absolute inset-0 flex flex-col"
               >
                 <div className="p-6 border-b border-white/5 flex items-start justify-between bg-black/60 shrink-0">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">Q3 Earnings Predictive Tweet</h3>
                      <p className="text-xs text-white/50 font-mono">CC-06 Director • Payload ID: TX-8891-A</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest text-white transition-colors">
                      View Raw Payload <ArrowRight size={12} />
                    </button>
                 </div>

                 <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Neural Background Linkages */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                       <svg className="w-full h-full">
                         <line x1="50%" y1="20%" x2="20%" y2="60%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-white/20" />
                         <line x1="50%" y1="20%" x2="50%" y2="60%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-red-500/50" />
                         <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-white/20" />
                       </svg>
                    </div>

                    {/* Central Evaluator */}
                    <div className="w-20 h-20 rounded-full border-2 border-red-500 bg-red-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] z-10 mb-16 relative">
                       <ShieldAlert size={32} className="text-red-500" />
                       <div className="absolute -top-3 bg-red-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Halted</div>
                    </div>

                    {/* The 3 Senators */}
                    <div className="flex w-full justify-around z-10">
                       
                       <SenatorCard 
                         icon={<Scale size={20} />} 
                         title="Ethics & Guideline" 
                         status="approved" 
                         reason="Language complies with FTC guidelines. No offensive material detected."
                       />
                       
                       <SenatorCard 
                         icon={<DollarSign size={20} />} 
                         title="Economic Impact" 
                         status="rejected" 
                         reason="Predicting Q3 earnings before official release violates SEC forward-looking statement policies. Massive liability risk."
                       />

                       <SenatorCard 
                         icon={<Leaf size={20} />} 
                         title="Brand Ecology" 
                         status="approved" 
                         reason="Tone matches corporate voice. Sentiment is highly positive."
                       />

                    </div>
                 </div>

                 <div className="p-6 border-t border-white/5 bg-black/80 shrink-0 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Algorithmic Verdict</p>
                      <p className="text-red-500 font-bold text-sm">VETO (2-1 Split)</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                        <XCircle size={16} /> Delete Payload
                      </button>
                      <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl border border-red-400 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                        <AlertTriangle size={16} /> Boss Override
                      </button>
                    </div>
                 </div>
               </motion.div>
             )}
             
             {selectedCase !== 'case-01' && (
                <motion.div className="flex-1 flex items-center justify-center flex-col text-white/20">
                  <Shield size={48} className="mb-4 opacity-50" />
                  <p className="text-sm font-mono">Select a docket case to review Tribunal proceedings.</p>
                </motion.div>
             )}
           </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

function SenatorCard({ icon, title, status, reason }: any) {
  const isApproved = status === 'approved';
  return (
    <div className={`w-56 p-5 rounded-2xl border backdrop-blur-md flex flex-col items-center text-center transition-all ${isApproved ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)] scale-110'}`}>
       <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isApproved ? 'bg-green-500/20 text-green-500' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
         {isApproved ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
       </div>
       <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1 flex items-center justify-center gap-1">
         {icon} {title}
       </h4>
       <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
         {isApproved ? 'Greenlit' : 'Objection'}
       </p>
       <p className="text-[10px] text-white/70 leading-relaxed font-mono opacity-80 bg-black/50 p-3 rounded-lg border border-white/5">
         {reason}
       </p>
    </div>
  );
}
