import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronLeft, Terminal, Cpu, List, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function ArticleView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [article, setArticle] = useState<any>(null);
  const [error, setError] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/blog/article/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setArticle(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, [slug]);

  // Extract Headings for TOC
  const headings = useMemo(() => {
    if (!article?.content) return [];
    const lines = article.content.split('\n');
    const result: { id: string, text: string, level: number }[] = [];
    lines.forEach((line: string) => {
      const match = line.match(/^(#{1,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/\*/g, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        result.push({ id, text, level });
      }
    });
    return result;
  }, [article]);

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian text-white flex flex-col items-center justify-center font-body">
        <h1 className="text-4xl font-display font-black text-neural-gold mb-4">404: Payload Not Found</h1>
        <p className="text-white/50 mb-8">The requested transmission has not been synthesized by the Swarm yet.</p>
        <button onClick={() => navigate('/')} className="bg-white/10 px-6 py-2 rounded uppercase text-xs hover:bg-white/20">Return to Nexus</button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-obsidian text-white flex flex-col items-center justify-center font-body">
        <div className="animate-pulse flex items-center gap-3 text-neural-blue uppercase text-xs">
          <Cpu className="animate-spin-slow" /> Decrypting Neural Transmission...
        </div>
      </div>
    );
  }

  // A very simple Markdown renderer just for the demo
  // In production, we would use a robust parser like 'react-markdown'
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        const hText = line.replace('# ', '');
        const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <h1 key={i} id={id} className="text-4xl font-display font-black uppercase italic mb-8 mt-12 scroll-mt-32">{hText}</h1>;
      }
      if (line.startsWith('## ')) {
        const hText = line.replace('## ', '');
        const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <h2 key={i} id={id} className="text-2xl font-display font-black uppercase italic mb-6 mt-10 text-neural-blue/80 scroll-mt-32">{hText}</h2>;
      }
      if (line.startsWith('### ')) {
        const hText = line.replace('### ', '');
        const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return <h3 key={i} id={id} className="text-xl font-display font-black uppercase mb-4 mt-8 scroll-mt-32">{hText}</h3>;
      }
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-neural-gold pl-4 py-2 italic text-white/50 mb-6 bg-white/5">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc mb-2 text-white/70">{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      
      // Inline formatting
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>');
      
      return <p key={i} className="mb-6 leading-relaxed font-light text-white/70" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="min-h-screen bg-obsidian text-white font-body selection:bg-neural-blue/30 selection:text-neural-blue relative">
      {/* Background Matrix Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00e5ff 0%, transparent 50%)' }} />

      <header className="fixed top-0 w-full glass z-50 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-xs uppercase tracking-widest font-black">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Intelligence Hub
        </button>
        <div className="flex items-center gap-4">
           {headings.length > 0 && (
             <button 
               onClick={() => setTocOpen(!tocOpen)}
               className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-white/50 hover:text-white transition-colors"
             >
               <List size={14} /> Index
             </button>
           )}
           <div className="flex items-center gap-2">
             <Terminal size={14} className="text-emerald-400" />
             <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">Transmission Verified</span>
           </div>
        </div>
      </header>

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-[52px] md:top-[56px] left-0 right-0 h-[2px] bg-emerald-400 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Floating TOC Overlay */}
      {tocOpen && (
        <div className="fixed inset-0 z-60 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTocOpen(false)} />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="ml-auto w-full max-w-sm glass border-l border-white/10 h-full flex flex-col relative z-10 shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display uppercase tracking-widest text-sm text-emerald-400 font-black">Architecture Index</h3>
              <button onClick={() => setTocOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <ul className="space-y-4">
                {headings.map((h, i) => (
                  <li key={i} style={{ paddingLeft: `${(h.level - 1) * 1.5}rem` }}>
                    <a 
                      href={`#${h.id}`}
                      onClick={() => setTocOpen(false)}
                      className="text-sm text-white/60 hover:text-emerald-400 transition-colors hover:underline block truncate"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}

      <main className="pt-32 pb-32 px-6 max-w-4xl mx-auto relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-neural-gold border border-neural-gold/20 px-3 py-1 bg-neural-gold/5 rounded-full">
                {article.type?.toUpperCase() || 'ARTICLE'}
              </span>
              <span className="text-xs uppercase tracking-widest text-white/30">
                {new Date(article.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-black uppercase italic tracking-tighter mb-6 leading-none">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Cpu size={14} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Authored By</span>
                <span className="text-xs font-bold text-emerald-400">{article.authorAgent}</span>
              </div>
            </div>
          </div>

          <div className="article-content">
            {renderMarkdown(article.content)}
          </div>
        </motion.article>
      </main>
    </div>
  );
}
