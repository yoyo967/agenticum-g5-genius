import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Story {
  tag: string;
  title: string;
  author?: string;
  authorAgent?: string;
  excerpt: string;
  slug?: string;
  timestamp?: string;
  content?: string;
  pillarId?: string;
}

export const NexusFeed = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blog/feed`);
        if (!response.ok) throw new Error('Nexus Sync Failed');
        const data = await response.json();
        
        // Flatten pillars and clusters for the feed
        const allStories: Story[] = [
          ...data.pillars.map((p: Story) => ({ ...p, tag: 'STRATEGY', slug: p.slug })),
          ...data.clusters.map((c: Story) => ({ ...c, tag: 'ANALYSIS', slug: c.slug }))
        ].sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());

        setStories(allStories);
      } catch (err) {
        console.error('Failed to sync Nexus Feed', err);
        setStories([]); // Empty state — no mock fallback
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-20 px-6 flex justify-center">
        <div className="animate-pulse flex items-center gap-3 text-neural-blue/50 text-[10px] uppercase tracking-widest font-black">
           <div className="w-2 h-2 bg-neural-blue rounded-full" />
           Syncing Nexus Knowledge Base...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-20 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stories.length === 0 ? (
          <>
            {[1, 2, 3].map((_, i) => (
              <motion.div
                key={`placeholder-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col border-l border-white/5 pl-8 py-4 relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/5 to-transparent pointer-events-none" />
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-neural-blue/30 uppercase tracking-widest">
                    SYNCING NEURAL ARCHIVE // G5
                  </span>
                  <span className="text-[8px] font-black text-white/5 border border-white/5 px-2 py-0.5 rounded uppercase tracking-widest">
                    STAGING
                  </span>
                </div>
                <div className="h-6 w-3/4 bg-white/5 rounded mb-4" />
                <div className="space-y-2 mb-6 text-white/10 text-xs font-mono">
                   <div>// DECRYPTING NARRATIVE BUFFER...</div>
                   <div>// ALIGNING SEMANTIC NODES...</div>
                </div>
                <div className="mt-auto">
                   <div className="w-12 h-1 bg-neural-blue/10 rounded-full overflow-hidden">
                      <div className="h-full bg-neural-blue/30 w-1/3 animate-progress" />
                   </div>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/article/${story.slug}`)}
              className="flex flex-col border-l border-white/5 pl-8 py-4 hover:border-neural-blue/30 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-neural-blue uppercase tracking-widest">
                  {story.timestamp ? new Date(story.timestamp).toLocaleDateString() : 'LIVE'} // {story.authorAgent || 'PM-07'}
                </span>
                <span className="text-[8px] font-black text-neural-gold border border-neural-gold/20 bg-neural-gold/5 px-2 py-0.5 rounded uppercase tracking-widest">
                  {story.pillarId ? 'Cluster' : 'Pillar'}
                </span>
              </div>
              <h4 className="text-xl font-display font-black uppercase italic mb-4 group-hover:text-neural-blue transition-colors">
                {story.title}
              </h4>
              <p className="text-white/30 text-sm font-light leading-relaxed italic mb-6 line-clamp-3">
                {story.excerpt || (story.content?.substring(0, 120) + '...')}
              </p>
              <div className="mt-auto">
                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                  Read Transmission →
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
