import { motion } from 'framer-motion';
import { Sparkles, Download, Eye } from 'lucide-react';

const MOCK_ASSETS = [
  { id: 1, title: 'Neural Core Genesis', category: 'Imagen 3 - Ultra High Fidelity', color: 'from-blue-600/20' },
  { id: 2, title: 'Autonomous Flow', category: 'Imagen 3 - Abstract Kinetic', color: 'from-purple-600/20' },
  { id: 3, title: 'Strategic Substrate', category: 'Imagen 3 - Data Visualization', color: 'from-neural-gold/20' },
];

export function AssetGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {MOCK_ASSETS.map((asset, i) => (
        <motion.div 
          key={asset.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="group relative h-80 glass rounded-3xl overflow-hidden p-6 flex flex-col justify-end cursor-pointer"
        >
          {/* Mock Image Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${asset.color} to-transparent opacity-40`} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              <Eye size={18} />
            </button>
            <button className="p-3 rounded-full bg-neural-blue text-obsidian transition-all">
              <Download size={18} />
            </button>
          </div>

          <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
              <Sparkles size={12} className="text-neural-blue" />
              {asset.category}
            </div>
            <h4 className="text-xl font-display font-black leading-tight text-white mb-4">
              {asset.title}
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
