import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, User, Zap, ExternalLink, Tag } from 'lucide-react';
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
  const elements: JSX.Element[] = [];
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
  const cover = getCoverImage(index);
  const score = article.audit_report?.score ?? article.metrics?.integrityScore;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className="group cursor-pointer bg-zinc-950 border border-zinc-900 hover:border-zinc-700 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]"
    >
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={cover}
          alt={article.title}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        {/* Agent badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full">
          <span className="font-mono text-[9px] text-blue-400 uppercase tracking-widest">{article.authorAgent}</span>
        </div>
        {score !== undefined && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full">
            <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest">Score: {score}/100</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-3 text-[10px] text-zinc-600 uppercase tracking-widest mb-4 font-mono">
          <span className="flex items-center gap-1.5"><Clock size={9} />{new Date(article.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-blue-300 transition-colors">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
          Read Article <ArrowLeft size={12} className="rotate-180" />
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   ARTICLE VIEW (Full Read)
   ============================================================ */
function ArticleView({ article, index, onBack }: { article: Article; index: number; onBack: () => void }) {
  const cover = getCoverImage(index);

  return (
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors text-xs uppercase tracking-widest mb-8 font-mono">
        <ArrowLeft size={12} /> All Articles
      </button>

      {/* Hero cover */}
      <div className="relative h-80 rounded-3xl overflow-hidden mb-10 border border-zinc-800 shadow-2xl">
        <img src={cover} alt={article.title} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
              <User size={9} /> {article.authorAgent}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
              <Clock size={9} /> {new Date(article.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400">Published</span>
            {article.metrics?.complianceStandard && (
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
                {article.metrics.complianceStandard}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Audit badge */}
      {article.audit_report && (
        <div className="flex items-center gap-4 mb-10 p-5 bg-green-500/5 border border-green-500/20 rounded-2xl">
          <div className="text-4xl font-black font-mono text-green-400">{article.audit_report.score ?? '✓'}</div>
          <div>
            <p className="font-mono text-[10px] text-green-400 uppercase tracking-widest mb-1">RA-01 Senate Gate — {article.audit_report.status}</p>
            <p className="text-zinc-500 text-sm">This article passed the EU AI Act Art.50 compliance review by the Security Senate agent.</p>
          </div>
        </div>
      )}

      {/* Excerpt pull-quote */}
      {article.excerpt && (
        <blockquote className="text-xl text-zinc-300 font-light leading-relaxed italic border-l-4 border-blue-500 pl-8 mb-10 py-2 bg-blue-500/5 rounded-r-2xl pr-6">
          {article.excerpt}
        </blockquote>
      )}

      {/* Article body */}
      <div className="prose-like">
        {renderContent(article.content)}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 p-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-center">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-3">Authored by Neural Blog Engine</p>
        <p className="text-zinc-400 text-sm mb-6">This article was generated by the AGENTICUM G5 swarm — CC-06 Cognitive Core, grounded by Google Search and verified by the RA-01 Senate.</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-xl">
          <ArrowLeft size={12} /> Back to All Articles
        </button>
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

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <MegaNav />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">

        {selected ? (
          <ArticleView article={selected} index={selectedIndex} onBack={() => setSelected(null)} />
        ) : (
          <>
            {/* Feed Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
              <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">Neural Blog Engine</span>
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight tracking-tight">Intelligence<br />Dispatches.</h1>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                Strategic intelligence, architectural essays, and the story of building the world's first Voice-AI creative agency — authored by the G5 swarm and its Lead Architect.
              </p>
            </motion.div>

            {/* Tags bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 mb-12 flex-wrap">
              {['AI Strategy', 'Gemini Live API', 'Multi-Agent Systems', 'EU AI Act', 'Neural Architecture'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-4 py-1.5 border border-zinc-800 rounded-full font-mono text-[10px] text-zinc-500 uppercase tracking-wider hover:border-blue-500/50 hover:text-blue-400 transition-colors cursor-default">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </motion.div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-4 text-zinc-600 py-16">
                <Zap size={16} className="animate-pulse text-blue-500" />
                <span className="text-sm font-mono uppercase tracking-widest">Synchronizing with Neural Feed...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="border border-red-900/40 bg-red-900/10 rounded-2xl p-10 text-center mb-8">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <p className="text-zinc-600 text-xs font-mono">Backend: {API_BASE_URL}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && articles.length === 0 && (
              <div className="text-center py-24 text-zinc-700">
                <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm font-mono">No articles published yet.</p>
              </div>
            )}

            {/* Article Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {articles.map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={i}
                  onClick={() => openArticle(article, i)}
                />
              ))}
            </div>

            {/* Bottom link */}
            {articles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-16 pt-12 border-t border-zinc-900 text-center">
                <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mb-3">All articles verified by RA-01 Security Senate</p>
                <a href="https://devpost.com/software/agenticum-g5-modular-neural-orchestration-os" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-600 hover:text-blue-400 text-xs font-mono uppercase tracking-widest transition-colors">
                  View Devpost Submission <ExternalLink size={10} />
                </a>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-8 text-center">
        <button onClick={() => navigate('/')} className="text-zinc-700 hover:text-zinc-400 text-[10px] font-mono uppercase tracking-widest transition-colors">
          ← Back to AGENTICUM G5 GENIUS
        </button>
      </footer>
    </div>
  );
}
