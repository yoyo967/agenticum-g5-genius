import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, Shield, Cpu } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  status: 'draft' | 'optimizing' | 'ready' | 'published';
  progress: number;
}

export function PillarBlogEngine() {
  const [activeStep, setActiveStep] = useState(1);
  const [articles, setArticles] = useState<Article[]>([
    { id: '1', title: 'The Future of AI Orchestration', status: 'published', progress: 100 },
    { id: '2', title: 'Why Multi-Agent Systems Win', status: 'ready', progress: 100 },
    { id: '3', title: 'GCP vs AWS for GenAI', status: 'optimizing', progress: 65 },
  ]);

  const generateNewArticle = () => {
    const newArt: Article = {
      id: Date.now().toString(),
      title: 'New Autonomous Strategy Article',
      status: 'draft',
      progress: 0
    };
    setArticles([newArt, ...articles]);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-hidden">
      
      {/* PM-07 Control Header */}
      <div className="flex items-center justify-between p-6 glass rounded-2xl border border-white/5 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Bot size={24} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-display font-black uppercase tracking-tighter text-white">PM-07 / PILLAR MASTER</h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Autonomous Long-Form Content Engine</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generateNewArticle}
            className="px-4 py-2 rounded-lg bg-green-500 text-obsidian text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
          >
            <Sparkles size={14} /> New Pillar Sprout
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Left: Article Pipeline */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-none">
          <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 px-2">Active Pipeline</h3>
          {articles.map((art) => (
            <div key={art.id} className="p-5 glass rounded-xl border border-white/5 bg-black/40 hover:border-green-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                  art.status === 'published' ? 'bg-green-500/20 text-green-500' : 
                  art.status === 'optimizing' ? 'bg-neural-gold/20 text-neural-gold' : 
                  'bg-white/10 text-white/40'
                }`}>
                  {art.status}
                </span>
                <span className="text-[9px] font-mono text-white/20">#{art.id}</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-green-500 transition-colors mb-4 truncate">{art.title}</h4>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${art.progress}%` }}
                  className={`h-full ${art.status === 'published' ? 'bg-green-500' : 'bg-neural-blue'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Orchestration Studio */}
        <div className="flex-1 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden relative">
          <div className="p-4 border-b border-white/5 bg-black/20 flex gap-4">
            {['Strategy', 'Semantic Draft', 'SEO Audit', 'Distribution'].map((step, i) => (
              <button 
                key={step}
                onClick={() => setActiveStep(i+1)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                  activeStep === i+1 ? 'bg-white/10 text-white border border-white/10' : 'text-white/30 hover:text-white/50'
                }`}
              >
                0{i+1}. {step}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 flex flex-col overflow-y-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 {activeStep === 1 && (
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Target Pillar Keyword</label>
                        <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-green-500/50" defaultValue="Generative AI Orchestration Layer" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Search Volume</p>
                          <p className="text-xl font-display font-black text-white">12.5K <span className="text-[10px] text-green-500 text-normal ml-1">↑ 4%</span></p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Difficulty</p>
                          <p className="text-xl font-display font-black text-white">42/100</p>
                        </div>
                      </div>
                   </div>
                 )}

                 {activeStep === 2 && (
                   <div className="space-y-4">
                      <div className="p-6 border border-neural-blue/20 bg-neural-blue/5 rounded-xl flex items-center gap-4">
                        <Cpu className="text-neural-blue" size={20} />
                        <p className="text-xs text-neural-blue font-medium italic">"SN-00 is currently mapping semantic clusters for the pillar structure..."</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-black text-white/40 mb-1">
                          <span>Draft Generation</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-neural-blue w-[65%]" />
                        </div>
                      </div>
                   </div>
                 )}

                 {activeStep > 2 && (
                    <div className="h-48 flex items-center justify-center text-white/20 uppercase text-xs font-black tracking-widest">
                       Module initializing for PM-07...
                    </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>

          <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center">
             <div className="flex gap-3">
                <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase font-black tracking-widest">
                   <Shield size={12} /> RA-01 Watch active
                </div>
             </div>
             <button className="px-6 py-3 rounded bg-green-500 text-obsidian text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                Continue to Semantic Draft
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
