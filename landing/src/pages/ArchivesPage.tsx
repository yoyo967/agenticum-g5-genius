import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, FileText, Target, Search, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface ArchiveItem {
  id: string;
  type: 'pillar' | 'campaign';
  title: string;
  timestamp: { seconds: number; nanoseconds: number } | string | Date;
  slug?: string;
  excerpt?: string;
}

export function ArchivesPage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const [blogRes, campaignRes] = await Promise.all([
        fetch(`${API_BASE_URL}/blog/feed`),
        fetch(`${API_BASE_URL}/pmax/campaigns`)
      ]);

      const blogData = await blogRes.json();
      const campaignData = await campaignRes.json();

      const combined: ArchiveItem[] = [
        ...(blogData.pillars || []).map((p: { id: string; title: string; timestamp: { seconds: number; nanoseconds: number } | string | Date; slug: string; excerpt: string }) => ({ ...p, type: 'pillar' })),
        ...(campaignData.campaigns || []).map((c: { id: string; name: string; createdAt: { seconds: number; nanoseconds: number } | string | Date; objective?: string }) => ({ ...c, id: c.id, title: c.name, timestamp: c.createdAt, excerpt: c.objective, type: 'campaign' }))
      ];

      combined.sort((a, b) => {
        const getSeconds = (ts: { seconds: number; nanoseconds: number } | string | Date | undefined) => {
          if (!ts) return 0;
          if (typeof ts === 'object' && 'seconds' in ts) return ts.seconds;
          return new Date(ts as string).getTime() / 1000;
        };
        return getSeconds(b.timestamp) - getSeconds(a.timestamp);
      });

      setItems(combined);
    } catch (e) {
      console.warn('[Archives] Failed to fetch:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.excerpt && i.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (ts: { seconds: number; nanoseconds: number } | string | Date | undefined) => {
    if (!ts) return 'Unknown';
    if (typeof ts === 'object' && 'seconds' in ts) return new Date(ts.seconds * 1000).toLocaleDateString();
    return new Date(ts as string).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-midnight text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-4xl uppercase tracking-tighter flex items-center gap-4">
                <Archive size={32} className="text-accent" />
                The Archive Hub
              </h1>
              <p className="font-mono text-sm text-white/40 mt-2">AGENTICUM G5 — Deep Memory Repositories</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 font-mono text-xs focus:border-accent outline-none transition-all w-64"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <Archive size={64} className="text-white/5 mb-6" />
            <p className="font-display text-xl uppercase text-white/20 tracking-widest">No Records Found</p>
            <p className="font-mono text-xs text-white/10 mt-2">The neural fabric is currently void of this query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative glass p-6 rounded-2xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  {item.type === 'pillar' ? <FileText size={40} /> : <Target size={40} />}
                </div>
                
                <div className="relative z-10">
                  <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest mb-4 ${item.type === 'pillar' ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                    {item.type}
                  </span>
                  <h3 className="font-display text-lg uppercase leading-tight mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  {item.excerpt && <p className="font-mono text-xs text-white/40 line-clamp-3 mb-6">{item.excerpt}</p>}
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-white/20 font-mono text-[10px]">
                      <Clock size={10} />
                      {formatDate(item.timestamp)}
                    </div>
                    {item.type === 'pillar' ? (
                      <Link to={`/article/${item.slug}`} className="text-accent font-mono text-[10px] uppercase tracking-widest hover:underline">
                        View Repository →
                      </Link>
                    ) : (
                      <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest">
                        System Record
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
