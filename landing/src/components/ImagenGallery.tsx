import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface GalleryAsset {
  name: string;
  url: string;
  category: string;
}

const FALLBACK_ASSETS = [
  { name: 'Neural Core Genesis', url: '', category: 'Imagen 3 · Ultra High Fidelity' },
  { name: 'Autonomous Flow', url: '', category: 'Imagen 3 · Abstract Kinetic' },
  { name: 'Strategic Substrate', url: '', category: 'Imagen 3 · Data Visualization' },
  { name: 'Swarm Intelligence', url: '', category: 'Imagen 3 · Neural Architecture' },
  { name: 'Agent Nexus', url: '', category: 'Imagen 3 · System Design' },
  { name: 'Creative Synergy', url: '', category: 'Imagen 3 · Collaborative Art' },
];

const gradients = [
  'from-[#00E5FF]/20 to-transparent',
  'from-[#7B2FBE]/20 to-transparent',
  'from-[#FFD700]/20 to-transparent',
  'from-[#FF007A]/20 to-transparent',
  'from-[#00FF88]/20 to-transparent',
  'from-[#00E5FF]/10 via-[#7B2FBE]/10 to-transparent',
];

export function ImagenGallery() {
  const [assets, setAssets] = useState<GalleryAsset[]>(FALLBACK_ASSETS);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/vault/files`);
        if (res.ok) {
          const data = await res.json();
          const images = (data.files || [])
            .filter((f: { name: string }) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f.name))
            .slice(0, 6)
            .map((f: { name: string; url: string }) => ({
              name: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
              url: f.url,
              category: 'DA-03 · Imagen 3 Output',
            }));
          if (images.length > 0) setAssets(images);
        }
      } catch {
        // Use fallback assets
      }
    };
    fetchAssets();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset, i) => (
          <motion.div key={asset.name + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="group relative aspect-4/3 glass-card overflow-hidden p-0 cursor-pointer"
            onClick={() => asset.url && setLightbox(asset.url)}>

            {/* Background */}
            {asset.url ? (
              <img src={asset.url} alt={asset.name} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className={`absolute inset-0 bg-linear-to-t ${gradients[i % gradients.length]}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={48} className="text-white/5" />
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-midnight/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-4">
              {asset.url && (
                <>
                  <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                    <Eye size={18} />
                  </button>
                  <a href={asset.url} download className="p-3 rounded-full bg-accent text-midnight transition-all">
                    <Download size={18} />
                  </a>
                </>
              )}
              {!asset.url && (
                <span className="font-mono text-xs text-white/40">Connect backend to view</span>
              )}
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-midnight/90 to-transparent z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={10} className="text-accent" />
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{asset.category}</span>
              </div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight text-white truncate">{asset.name}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Full view" className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      )}
    </>
  );
}
