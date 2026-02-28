import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Download, ExternalLink, Plus, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function BrandHub() {
  const assets = useAppStore((state) => state.globalAssets);
  const [filter, setFilter] = useState('');
  
  const brandAssets = assets.filter(a => 
    a.type === 'IMAGE' || a.agent === 'da03'
  ).filter(a => 
    a.agent.toLowerCase().includes(filter.toLowerCase()) || 
    (a.url && a.url.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl border border-white/5 overflow-hidden font-mono">
      <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-neural-gold" />
          <span className="text-neural-gold font-black uppercase tracking-widest">Brand Asset Nexus</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
             <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
             <input 
               type="text" 
               placeholder="Filter assets..."
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-4 text-[10px] text-white focus:outline-none focus:border-neural-gold/40"
             />
           </div>
           <button className="flex items-center gap-2 px-3 py-1.5 bg-neural-gold text-obsidian rounded text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">
             <Plus size={14} /> New Asset
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        {brandAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
            <Palette size={48} className="mb-4" />
            <p className="uppercase font-black tracking-widest text-sm">No synchronized brand assets found.</p>
            <p className="text-[10px] mt-2 italic">Forge new assets via DA-03 to populate the nexus.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {brandAssets.map((asset, i) => (
                <motion.div 
                  key={asset.url || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-square"
                >
                  <img 
                    src={asset.url} 
                    alt="Brand Asset" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between">
                       <div>
                         <p className="text-[10px] font-black uppercase text-neural-gold">{asset.agent}</p>
                         <p className="text-[8px] text-white/40 uppercase">{new Date(asset.timestamp).toLocaleDateString()}</p>
                       </div>
                       <div className="flex gap-2">
                         <button className="p-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">
                           <Download size={14} />
                         </button>
                         <button className="p-2 rounded bg-neural-gold/20 hover:bg-neural-gold text-neural-gold hover:text-obsidian transition-colors">
                           <ExternalLink size={14} />
                         </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
