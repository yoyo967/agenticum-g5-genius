import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const NexusFeed = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/blog/feed')
      .then(res => res.json())
      .then(data => {
        // Interleave pillars and clusters for a dynamic feed
        const combined = [...(data.pillars || []), ...(data.clusters || [])]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);
        setStories(combined);
        setLoading(false);
      })
      .catch(err => {
        console.error('Feed error:', err);
        setLoading(false);
      });
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
           <div className="col-span-3 text-center text-white/30 text-sm font-light italic">
             The Swarm is currently forging the initial Phase 3 Pillar content. Awaiting transmission.
           </div>
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
                  {new Date(story.timestamp).toLocaleDateString()} // {story.authorAgent}
                </span>
                <span className="text-[8px] font-black text-neural-gold border border-neural-gold/20 bg-neural-gold/5 px-2 py-0.5 rounded uppercase tracking-widest">
                  {story.pillarId ? 'Cluster' : 'Pillar'}
                </span>
              </div>
              <h4 className="text-xl font-display font-black uppercase italic mb-4 group-hover:text-neural-blue transition-colors">
                {story.title}
              </h4>
              <p className="text-white/30 text-sm font-light leading-relaxed italic mb-6 line-clamp-3">
                {/* Extract a brief excerpt from the markdown content if exists */}
                {story.content?.substring(0, 120)}...
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
