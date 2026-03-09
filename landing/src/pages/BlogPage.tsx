import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, User, Zap } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { MegaNav } from '../components/MegaNav';


/* ============================================================
   TYPES
   ============================================================ */
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorAgent: string;
  timestamp: string;
  status: string;
  metrics?: { integrityScore?: number; hallucinationRisk?: number; complianceStandard?: string };
  audit_report?: { status: string; score?: number };
}

/* ============================================================
   COVER IMAGE MAP  — Assign images deterministically by article index
   ============================================================ */
const COVER_IMAGES = [
  '/ai_output_storyboard.png',
  '/element-samurai.png',
  '/element-lab.png',
  '/element-ceo.png',
  '/element-sphere.png',
];

function getCoverImage(index: number): string {
  return COVER_IMAGES[index % COVER_IMAGES.length];
}

/* ============================================================
   INLINE MARKDOWN RENDERER — handles **bold**, `code`, *italic*
   ============================================================ */
function InlineMarkdown({ text }: { text: string }) {
  // Split by bold, code, italic markers
  const parts: Array<{ type: 'text' | 'bold' | 'code' | 'italic'; content: string }> = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const m = match[0];
    if (m.startsWith('**')) parts.push({ type: 'bold', content: m.slice(2, -2) });
    else if (m.startsWith('`')) parts.push({ type: 'code', content: m.slice(1, -1) });
    else if (m.startsWith('*')) parts.push({ type: 'italic', content: m.slice(1, -1) });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'bold') return <strong key={i} className="text-white font-semibold">{p.content}</strong>;
        if (p.type === 'code') return <code key={i} className="bg-zinc-800 text-blue-300 font-mono px-1.5 py-0.5 rounded text-[0.85em]">{p.content}</code>;
        if (p.type === 'italic') return <em key={i} className="text-zinc-300 italic">{p.content}</em>;
        return <Fragment key={i}>{p.content}</Fragment>;
      })}
    </>
  );
}

/* ============================================================
   BLOCK MARKDOWN RENDERER — full article → JSX
   ============================================================ */
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.JSX.Element[] = [];
  let listBuffer: string[] = [];

  const flushList = (idx: number) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`ul-${idx}`} className="my-5 space-y-2 border-l-2 border-zinc-800 pl-6">
        {listBuffer.map((item, j) => (
          <li key={j} className="text-zinc-400 text-base leading-relaxed flex gap-2">
            <span className="text-blue-500 mt-1 shrink-0">·</span>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    // Images: ![alt](url)
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList(i);
      const [, alt, url] = imgMatch;
      elements.push(
        <div key={i} className="my-10 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl group">
          <img src={url} alt={alt} className="w-full h-72 object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
          {alt && (
            <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-900">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{alt}</p>
            </div>
          )}
        </div>
      );
      return;
    }

    // H1
    if (line.startsWith('# ')) {
      flushList(i);
      elements.push(<h1 key={i} className="text-3xl font-bold text-white mt-12 mb-5 leading-tight"><InlineMarkdown text={line.slice(2)} /></h1>);
      return;
    }
    // H2
    if (line.startsWith('## ')) {
      flushList(i);
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4 flex items-center gap-3">
          <span className="w-6 h-px bg-blue-500 shrink-0" />
          <InlineMarkdown text={line.slice(3)} />
        </h2>
      );
      return;
    }
    // H3
    if (line.startsWith('### ')) {
      flushList(i);
      elements.push(<h3 key={i} className="text-lg font-semibold text-zinc-200 mt-8 mb-3"><InlineMarkdown text={line.slice(4)} /></h3>);
      return;
    }
    // H4
    if (line.startsWith('#### ')) {
      flushList(i);
      elements.push(<h4 key={i} className="text-base font-semibold text-zinc-300 mt-6 mb-2 uppercase tracking-wide text-sm font-mono"><InlineMarkdown text={line.slice(5)} /></h4>);
      return;
    }
    // Blockquote
    if (line.startsWith('> ')) {
      flushList(i);
      elements.push(
        <blockquote key={i} className="my-6 pl-6 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-xl py-4 pr-4">
          <p className="text-zinc-300 italic text-lg leading-relaxed"><InlineMarkdown text={line.slice(2)} /></p>
        </blockquote>
      );
      return;
    }
    // Horizontal rule
    if (line.trim() === '---') {
      flushList(i);
      elements.push(<hr key={i} className="my-10 border-zinc-800" />);
      return;
    }
    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listBuffer.push(line.slice(2));
      return;
    }
    // Numbered list
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      listBuffer.push(numMatch[1]);
      return;
    }
    // Empty line
    if (line.trim() === '') {
      flushList(i);
      elements.push(<div key={i} className="h-3" />);
      return;
    }
    // Paragraph
    flushList(i);
    elements.push(
      <p key={i} className="text-zinc-400 text-base leading-[1.85] mb-3">
        <InlineMarkdown text={line} />
      </p>
    );
  });
  flushList(lines.length);
  return elements;
}

/* ============================================================
   ARTICLE CARD (Feed)
   ============================================================ */
function ArticleCard({ article, index, onClick }: { article: Article; index: number; onClick: () => void }) {
  // Determine if it's a pillar or cluster based on the ID or Title
  const isPillar = article.id.startsWith('pl-');
  
  // Choose cover image dynamically based on slug or fallback
  let cover = getCoverImage(index);
  if (article.slug === 'zero-cognitive-debt') cover = '/blog/diagram_orchestrator.png';
  if (article.slug === 'the-senate-gate') cover = '/blog/diagram_compliance.png';
  if (article.slug === 'multimodal-voice-io') cover = '/blog/diagram_voice.png';
  if (article.slug === 'gemini-live-agent-challenge-2026') cover = '/blog/diagram_trophy.png';

  const score = article.audit_report?.score ?? article.metrics?.integrityScore;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`group cursor-pointer bg-[#0A0A0A] border ${isPillar ? 'border-blue-500/20 hover:border-blue-500/50' : 'border-white/5 hover:border-white/20'} rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col h-full`}
    >
      {/* Cover image */}
      <div className={`relative ${isPillar ? 'h-72' : 'h-56'} overflow-hidden shrink-0`}>
        <img
          src={cover}
          alt={article.title}
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        
        <div className="absolute top-6 left-6 flex items-center gap-2">
           {isPillar && (
             <div className="px-3 py-1 bg-blue-500/10 backdrop-blur-md border border-blue-500/30 rounded-full">
               <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest font-bold">Foundation Pillar</span>
             </div>
           )}
           <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
             <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest">{article.authorAgent}</span>
           </div>
        </div>

        {score !== undefined && (
          <div className="absolute top-6 right-6 px-3 py-1 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-full flex items-center gap-1.5">
            <Zap size={10} className="text-green-400" />
            <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest font-bold">{score}/100</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 flex flex-col flex-1 bg-linear-to-b from-[#0A0A0A] to-[#050505]">
        <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest mb-6 font-mono">
          <span className="flex items-center gap-1.5"><Clock size={10} />{new Date(article.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>{isPillar ? 'Architectural Core' : 'Neural Cluster'}</span>
        </div>
        
        <h2 className={`font-bold text-white mb-4 line-clamp-3 leading-tight group-hover:text-blue-300 transition-colors ${isPillar ? 'text-3xl' : 'text-2xl'}`}>
          {article.title}
        </h2>
        
        {article.excerpt && (
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3 font-light">{article.excerpt}</p>
        )}
        
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-blue-400 transition-colors">Access Intelligence Record</span>
          <ArrowLeft size={14} className="rotate-180 text-zinc-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   ARTICLE VIEW (Full Read)
   ============================================================ */
function ArticleView({ article, index, onBack }: { article: Article; index: number; onBack: () => void }) {
  let cover = getCoverImage(index);
  if (article.slug === 'zero-cognitive-debt') cover = '/blog/diagram_orchestrator.png';
  if (article.slug === 'the-senate-gate') cover = '/blog/diagram_compliance.png';
  if (article.slug === 'multimodal-voice-io') cover = '/blog/diagram_voice.png';
  if (article.slug === 'gemini-live-agent-challenge-2026') cover = '/blog/diagram_trophy.png';

  const isPillar = article.id.startsWith('pl-');

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back button */}
      <button onClick={onBack} className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] mb-12 font-mono">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Matrix
      </button>

      {/* Hero cover */}
      <div className="relative h-[60vh] min-h-[500px] rounded-t-4xl overflow-hidden mb-16 border border-white/5 shadow-2xl">
        <img src={cover} alt={article.title} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-16">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-6">
            {isPillar && (
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 font-bold">
                Foundation Pillar
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <User size={10} /> {article.authorAgent}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <Clock size={10} /> {new Date(article.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {article.metrics?.complianceStandard && (
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 flex items-center gap-1.5">
                <Zap size={10} /> {article.metrics.complianceStandard}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] tracking-tighter max-w-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="px-4 md:px-8">
        {/* Audit badge */}
        {article.audit_report && (
          <div className="flex items-center gap-6 mb-16 p-6 md:p-8 bg-[#0A0A0A] border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <div className="text-5xl font-black font-mono text-white/5">{article.audit_report.score ?? '✓'}</div>
            <div className="relative z-10">
              <p className="font-mono text-[10px] text-green-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
                RA-01 Senate Gate — {article.audit_report.status}
              </p>
              <p className="text-zinc-500 text-sm font-light">This directive has passed strict EU AI Act compliance checks. Mathematical integrity and brand safety verified.</p>
            </div>
          </div>
        )}

        {/* Excerpt pull-quote */}
        {article.excerpt && (
          <blockquote className="text-2xl md:text-3xl text-white font-light leading-snug tracking-tight border-l-2 border-blue-500 pl-8 md:pl-12 py-2 mb-16 relative">
            <div className="absolute -left-3 top-0 text-6xl text-blue-500/20 font-serif">"</div>
            {article.excerpt}
          </blockquote>
        )}

        {/* Article body */}
        <div className="prose-like text-zinc-300 font-light text-lg">
          {renderContent(article.content)}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 pt-16 mb-24 max-w-2xl text-center mx-auto border-t border-white/5">
          <p className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.3em] mb-4">Cryptographically Verified</p>
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-[#0A0A0A]">
              <Zap size={16} className="text-zinc-500" />
            </div>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-10 font-light">This intelligence brief was synthesized by <span className="text-white font-medium">{article.authorAgent}</span>, contextualized against the global vector space, and sealed by the Security Senate on {new Date(article.timestamp).toLocaleDateString()}.</p>
          <button onClick={onBack} className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-white font-mono text-[10px] uppercase tracking-widest transition-all rounded-full hover:bg-white hover:text-black">
             Return to Matrix
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export function BlogPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pillars' | 'clusters'>('all');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blog/feed`);
        if (!res.ok) throw new Error('Feed unavailable');
        const data = await res.json();
        const all: Article[] = [
          ...(data.pillars || []),
          ...(data.clusters || [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setArticles(all);
        if (slug) {
          const idx = all.findIndex(a => a.slug === slug);
          if (idx > -1) { setSelected(all[idx]); setSelectedIndex(idx); }
        }
      } catch {
        setError('Could not connect to the Neural Blog Engine.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [slug]);

  const openArticle = (article: Article, index: number) => {
    setSelected(article);
    setSelectedIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = articles.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pillars') return a.id.startsWith('pl-');
    if (filter === 'clusters') return a.id.startsWith('cl-');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <MegaNav />

      <div className={`mx-auto ${selected ? 'pt-24 md:pt-32' : 'max-w-screen-2xl px-6 sm:px-12 lg:px-24 xl:px-32 pt-32 pb-24'}`}>

        {selected ? (
          <ArticleView article={selected} index={selectedIndex} onBack={() => { setSelected(null); window.history.pushState({}, '', '/blog'); }} />
        ) : (
          <>
            {/* Feed Header */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-24 text-center max-w-4xl mx-auto">
              <span className="font-mono text-[10px] text-blue-500 uppercase tracking-[0.4em] block mb-6">Neural Blog Engine</span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white mb-8 leading-[1.1] tracking-tighter">Intelligence<br />Matrix.</h1>
              <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                Strategic architecture, ecosystem updates, and the operational blueprint behind the world's most advanced autonomous marketing framework.
              </p>
            </motion.div>

            {/* Filter / Tags bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col md:flex-row items-center justify-between mb-16 pb-8 border-b border-white/5 gap-6">
              
              {/* Category Toggles */}
              <div className="flex bg-[#0A0A0A] border border-white/10 p-1 rounded-full">
                {(['all', 'pillars', 'clusters'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 px-4 py-2 border border-white/5 bg-[#0A0A0A] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Global Feed Synced</span>
              </div>
            </motion.div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                  <Zap size={24} className="text-blue-500 mb-6" />
                </motion.div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] animate-pulse">Synchronizing Data Crystals...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="border border-red-900/40 bg-[#0A0A0A] rounded-3xl p-16 text-center mb-8 max-w-2xl mx-auto">
                <Zap size={32} className="text-red-500 mx-auto mb-6" />
                <p className="text-red-400 text-lg mb-2">{error}</p>
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">Backend: {API_BASE_URL}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredArticles.length === 0 && (
              <div className="text-center py-32 border border-white/5 bg-[#0A0A0A] rounded-3xl">
                <BookOpen size={48} className="mx-auto mb-6 text-zinc-800" />
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">No intelligence brief found for this sector.</p>
              </div>
            )}

            {/* Article Grid Layout - Highlight first item if it's 'all' feed */}
            <div className={`grid gap-6 md:gap-8 ${filter === 'all' && filteredArticles.length > 0 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {filteredArticles.map((article, i) => {
                // Feature the first article in the 'all' view across 2 columns
                const isFeatured = filter === 'all' && i === 0;
                
                return (
                  <div key={article.id} className={isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}>
                    <ArticleCard
                      article={article}
                      index={i}
                      onClick={() => openArticle(article, i)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom link */}
            {articles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-32 text-center">
                <div className="inline-flex flex-col items-center">
                   <div className="w-px h-16 bg-linear-to-b from-white/10 to-transparent mb-8" />
                   <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.3em] mb-4">All intelligence verified by Security Senate</p>
                   <a href="https://geminiliveagentchallenge.devpost.com/" target="_blank" rel="noopener noreferrer"
                     className="px-6 py-2 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-zinc-400 hover:text-blue-400 text-[10px] font-mono uppercase tracking-widest transition-all rounded-full">
                     View System Architecture on Devpost
                   </a>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!selected && (
        <footer className="border-t border-white/5 px-6 py-12 text-center bg-[#050505]">
          <button onClick={() => navigate('/')} className="text-zinc-600 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-colors">
            Return to Core Protocol
          </button>
        </footer>
      )}
    </div>
  );
}
