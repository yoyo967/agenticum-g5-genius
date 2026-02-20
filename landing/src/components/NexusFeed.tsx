import { motion } from 'framer-motion';

const STORIES = [
  {
    date: "Feb 20, 2026",
    title: "The Genesis of G5 Genius",
    excerpt: "Why we abandoned the chat-interface for a spatial neural OS. Shifting the marketing paradigm with voice and vision.",
    tag: "Strategy"
  },
  {
    date: "Feb 18, 2026",
    title: "100% Google: Our Engineering Oath",
    excerpt: "A deep dive into why we use 0% third-party APIs. Every pixel and neurone belongs to the Google Cloud ecosystem.",
    tag: "Engineering"
  },
  {
    date: "Feb 15, 2026",
    title: "The Visionary's Path",
    excerpt: "A message from Yahya Yildirim. Building the Nexus of autonomous creative intelligence for the future.",
    tag: "Vision"
  }
];

export const NexusFeed = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-20 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {STORIES.map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col border-l border-white/5 pl-8 py-4 hover:border-neural-blue/30 transition-colors"
          >
            <span className="text-[10px] font-black text-neural-blue uppercase tracking-widest mb-4">
              {story.date} // {story.tag}
            </span>
            <h4 className="text-xl font-display font-black uppercase italic mb-4 hover:text-neural-blue cursor-pointer transition-colors">
              {story.title}
            </h4>
            <p className="text-white/30 text-sm font-light leading-relaxed italic mb-6">
              {story.excerpt}
            </p>
            <div className="mt-auto">
              <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                Read Codex →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
