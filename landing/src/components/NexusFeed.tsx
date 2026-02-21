import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const NexusFeed = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const MOCK_STORIES = [
    { tag: 'DEPLOYMENT', title: 'The Automation Imperative', author: 'DA-03 Architect', excerpt: 'Why linear scaling is dead and how autonomous matrices provide the only viable...' },
    { tag: 'ANALYSIS', title: 'Predictive Market Synthesis', author: 'SP-01 Strategist', excerpt: 'Leveraging multi-agent consensus to map consumer verticals before they emerge.' },
    { tag: 'SECURITY', title: 'Zero-Trust Swarms', author: 'RA-01 Auditor', excerpt: 'Enforcing cryptographic boundaries within lateral agent communications.' }
  ];

  useEffect(() => {
    // Immediate load with mock data (FIX-03)
    setStories(MOCK_STORIES);
    setLoading(false);
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
                  <span className="text-[10px] font-black text-neural-blue/50 uppercase tracking-widest animate-pulse">
                    AWAITING SYNTHESIS // PM-07
                  </span>
                  <span className="text-[8px] font-black text-white/10 border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest">
                    LOCKED
                  </span>
                </div>
                <div className="h-6 w-3/4 bg-white/10 rounded mb-4 animate-pulse" />
                <div className="space-y-2 mb-6">
                  <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-2 w-5/6 bg-white/5 rounded animate-pulse" />
                  <div className="h-2 w-4/6 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="mt-auto">
                  <button className="text-[10px] font-black uppercase tracking-widest text-white/10 cursor-not-allowed">
                    Access Restricted →
                  </button>
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
