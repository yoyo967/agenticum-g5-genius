import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, Shield, Cpu, FileText, Plus, ExternalLink, Eye, Clock, Tag, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadTextFile } from '../utils/export';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlogFeed } from '../hooks/useBlogFeed';
import type { Article } from '../hooks/useBlogFeed';

type ViewMode = 'pipeline' | 'generate';

export function PillarBlogEngine() {
  const { articles, loading } = useBlogFeed();
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Generation form
  const [topic, setTopic] = useState('');
  const [articleType, setArticleType] = useState<'pillar' | 'cluster'>('pillar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<string | null>(null);

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  // Distribution state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  const fetchArticleContent = async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog/article/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedArticle(data);
      }
    } catch (e) {
      console.warn('[BlogEngine] Article fetch failed:', e);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGenerateResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blog/agent-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: articleType }),
      });
      if (res.ok) {
        const data = await res.json();
        setGenerateResult(data.message || 'Agent dispatched successfully.');
        setTopic('');
      }
    } catch {
      setGenerateResult('Failed to dispatch agent. Is the backend running?');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <Bot size={20} className="text-emerald" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Pillar Blog Engine</h2>
            <p className="font-mono text-[10px] text-white/30">PM-07 + CC-06 Autonomous Content Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ExportMenu options={[
            { label: 'JSON All', format: 'JSON', onClick: () => downloadJSON({ articles: articles.map(a => ({ title: a.title, slug: a.slug, status: a.status, tag: a.tag, content: a.content })) }, 'G5_Blog_Articles') },
            { label: 'Markdown All', format: 'MD', onClick: () => downloadTextFile(articles.map(a => `# ${a.title}\n\n**Tag:** ${a.tag || 'N/A'} | **Status:** ${a.status}\n\n${a.content || a.excerpt || ''}`).join('\n\n---\n\n'), 'G5_Blog_Export', 'md') },
          ]} />
          <button onClick={() => setViewMode('generate')} className="btn btn-primary" style={{ background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' }}>
            <Plus size={14} /> Generate Article
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-5 min-h-0">
        
        {/* Left: Article Pipeline */}
        <div className="w-1/3 flex flex-col gap-3 overflow-y-auto">
          <h3 className="label">Content Pipeline ({articles.length} articles)</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <FileText size={40} className="text-white/10 mb-3" />
              <p className="font-display text-sm uppercase text-white/20">No Articles</p>
              <p className="font-mono text-[10px] text-white/15 mt-1">Generate your first article with CC-06</p>
            </div>
          ) : (
            articles.map(art => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card cursor-pointer group hover:border-white/20 ${selectedArticle?.id === art.id ? 'border-accent/30' : ''}`}
                onClick={() => fetchArticleContent(art.slug)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`badge ${art.status === 'published' ? 'badge-online' : art.status === 'optimizing' ? 'badge-processing' : 'badge-warning'}`}>
                    {art.status}
                  </span>
                  <span className="font-mono text-[9px] text-white/20">{art.type}</span>
                </div>
                <h4 className="font-display text-sm uppercase text-white group-hover:text-accent transition-colors mb-2 line-clamp-2">
                  {art.title}
                </h4>
                <div className="flex items-center gap-3 text-white/20">
                  {art.agent && <span className="font-mono text-[9px]">{art.agent}</span>}
                  {art.tag && <span className="font-mono text-[9px] flex items-center gap-1"><Tag size={8} />{art.tag}</span>}
                  {art.timestamp && (
                    <span className="font-mono text-[9px] flex items-center gap-1">
                      <Clock size={8} />{new Date(art.timestamp).toLocaleDateString('en-US')}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right: Content Panel */}
        <div className="flex-1 glass flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'generate' ? (
              <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg uppercase tracking-wide flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald" /> Generate New Article
                  </h3>
                  <button onClick={() => setViewMode('pipeline')} className="btn btn-ghost btn-sm">← Back to Pipeline</button>
                </div>

                <div className="card space-y-4">
                  <div>
                    <label className="label">Target Topic / Keyword</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="input"
                      placeholder="e.g. The Future of AI Orchestration Systems" />
                  </div>
                  <div>
                    <label className="label">Article Type</label>
                    <div className="flex gap-3">
                      <button onClick={() => setArticleType('pillar')}
                        className={`btn flex-1 ${articleType === 'pillar' ? 'btn-primary' : 'btn-ghost'}`}
                        style={articleType === 'pillar' ? { background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' } : {}}>
                        <FileText size={14} /> Pillar Article (2000+ words)
                      </button>
                      <button onClick={() => setArticleType('cluster')}
                        className={`btn flex-1 ${articleType === 'cluster' ? 'btn-primary' : 'btn-ghost'}`}
                        style={articleType === 'cluster' ? { background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' } : {}}>
                        <Tag size={14} /> Cluster Post (500-1000 words)
                      </button>
                    </div>
                  </div>
                  <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}
                    className="btn btn-primary w-full" style={{ background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' }}>
                    <Cpu size={14} /> {isGenerating ? 'CC-06 Active...' : 'Dispatch CC-06 Agent'}
                  </button>

                  {generateResult && (
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-emerald">
                      {generateResult}
                    </div>
                  )}
                </div>

                <div className="card flex items-center gap-3">
                  <Shield size={14} className="text-white/30" />
                  <span className="font-mono text-[10px] text-white/30">RA-01 Audit Gate Active — all generated content passes brand safety review</span>
                </div>
              </motion.div>
            ) : selectedArticle ? (
              <motion.div key="article" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="font-display text-lg uppercase">{selectedArticle.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`badge ${selectedArticle.status === 'published' ? 'badge-online' : 'badge-processing'}`}>{selectedArticle.status}</span>
                      {selectedArticle.agent && <span className="font-mono text-[9px] text-white/30">{selectedArticle.agent}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!selectedArticle) return;
                          setIsPublishing(true);
                          try {
                            const res = await fetch(`${API_BASE_URL}/blog/publish/wordpress/${selectedArticle.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ type: selectedArticle.type || 'pillar' }),
                            });
                            if (res.ok) {
                              const result = await res.json();
                              setPublishStatus(`Success: ${result.url}`);
                            }
                          } catch (e) {
                            console.error('Publish failed:', e);
                          } finally {
                            setIsPublishing(false);
                          }
                        }}
                        className="btn btn-ghost btn-sm text-emerald border-emerald/20 hover:bg-emerald/10"
                      >
                        {isPublishing ? <RefreshCw size={12} className="animate-spin" /> : '🌐 WordPress'}
                      </button>
                      <button
                        onClick={async () => {
                          if (!selectedArticle) return;
                          setIsPublishing(true);
                          try {
                            const res = await fetch(`${API_BASE_URL}/blog/publish/linkedin/${selectedArticle.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ type: selectedArticle.type || 'pillar' }),
                            });
                            if (res.ok) {
                              const result = await res.json();
                              setPublishStatus(`Success: ${result.url}`);
                            }
                          } catch (e) {
                            console.error('LinkedIn failed:', e);
                          } finally {
                            setIsPublishing(false);
                          }
                        }}
                        className="btn btn-ghost btn-sm text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
                      >
                        {isPublishing ? <RefreshCw size={12} className="animate-spin" /> : '💼 LinkedIn'}
                      </button>
                    </div>

                    <div className="h-8 w-px bg-white/5 mx-2" />

                    <div className="flex items-center gap-2">
                      <input 
                        type="datetime-local" 
                        className="input btn-sm text-[10px] w-40" 
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                      <button
                        onClick={async () => {
                          if (!selectedArticle || !scheduleDate) return;
                          try {
                            const res = await fetch(`${API_BASE_URL}/blog/schedule/wordpress/${selectedArticle.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                type: selectedArticle.type || 'pillar',
                                scheduledAt: scheduleDate
                              }),
                            });
                            if (res.ok) {
                              setPublishStatus(`Scheduled for ${new Date(scheduleDate).toLocaleString()}`);
                            }
                          } catch (e) {
                            console.error('Schedule failed:', e);
                          }
                        }}
                        disabled={!scheduleDate}
                        className="btn btn-primary btn-sm px-3"
                        style={{ background: 'var(--color-obsidian)', border: '1px solid var(--color-emerald)' }}
                      >
                        <Clock size={12} className="mr-1" /> Schedule
                      </button>
                    </div>

                    <div className="h-8 w-px bg-white/5 mx-2" />

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!selectedArticle) return;
                          try {
                            const res = await fetch(`${API_BASE_URL}/senate/submit`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                agent: 'Manual-Editor',
                                title: `Audit: ${selectedArticle.slug}...`,
                                payload: selectedArticle.content,
                                risk: 'MEDIUM'
                              }),
                            });
                            if (res.ok) {
                              setPublishStatus('Senate Audit Request Submitted.');
                               setSelectedArticle({ ...selectedArticle, status: 'optimizing' });
                            }
                          } catch (e) {
                            console.error('Audit submission failed:', e);
                          }
                        }}
                        disabled={selectedArticle.status !== 'draft'}
                        className="btn btn-ghost btn-sm text-gold border-gold/20 hover:bg-gold/10"
                      >
                        🛡️ Audit
                      </button>
                      <button
                        onClick={() => {
                          if (!isEditing) {
                            setEditContent(selectedArticle.content || '');
                            setIsEditing(true);
                          } else {
                            setIsEditing(false);
                          }
                        }}
                        className={`btn btn-ghost btn-sm ${isEditing ? 'text-accent border-accent/20' : ''}`}
                      >
                        {isEditing ? '← Read' : '✏️ Edit'}
                      </button>
                    </div>

                    <div className="h-8 w-px bg-white/5 mx-2" />

                    <a href={`/nexus/${selectedArticle.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm text-white/50 hover:text-white">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                {publishStatus && (
                  <div className="bg-emerald/10 border-b border-emerald/20 px-4 py-1 text-[9px] font-mono text-emerald flex items-center justify-between shrink-0">
                    <span>{publishStatus}</span>
                    <button onClick={() => setPublishStatus('')} className="hover:text-white">✕</button>
                  </div>
                )}
                <div className={`p-6 overflow-y-auto overflow-x-hidden ${isEditing ? 'flex-1 grid grid-cols-2 gap-6' : 'flex-1'}`}>
                  {isEditing ? (
                    <>
                      {/* Left: Editor */}
                      <div className="flex flex-col h-[calc(100vh-250px)] lg:h-[600px] bg-black/30 border border-white/10 rounded-lg overflow-hidden relative">
                        <div className="bg-white/5 px-4 py-2 text-[10px] font-mono uppercase text-white/50 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md flex items-center justify-between">
                          <span>Markdown Editor (Drafting)</span>
                          <div className="flex gap-2">
                            <button onClick={() => setEditContent(p => p + ' **Bold**')} className="hover:text-white transition-colors">B</button>
                            <button onClick={() => setEditContent(p => p + ' *Italic*')} className="hover:text-white transition-colors">I</button>
                            <button onClick={() => setEditContent(p => p + ' [Link](url)')} className="hover:text-white transition-colors">Link</button>
                          </div>
                        </div>
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="flex-1 w-full p-4 bg-transparent font-mono text-xs text-white/80 leading-relaxed resize-none focus:outline-none custom-scrollbar"
                          placeholder="Write your article in Markdown..."
                        />
                      </div>
                      
                      {/* Right: Live Preview */}
                      <div className="flex flex-col h-[calc(100vh-250px)] lg:h-[600px] bg-black/40 border border-white/5 rounded-lg overflow-hidden relative">
                        <div className="bg-emerald/5 px-4 py-2 text-[10px] font-mono uppercase text-emerald border-b border-emerald/10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                          <span>Live Preview</span>
                          <span className="flex items-center gap-1 opacity-60"><Sparkles size={10} /> VE-02 Rendering Engine Active</span>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto prose prose-invert max-w-none text-sm wrap-break-word custom-scrollbar">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{editContent}</ReactMarkdown>
                        </div>
                      </div>
                    </>
                  ) : selectedArticle.content ? (
                    <div className="prose prose-invert max-w-none font-sans text-sm text-white/80 leading-relaxed wrap-break-word pb-20">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedArticle.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Eye size={32} className="text-white/10 mx-auto mb-3" />
                      <p className="font-mono text-xs text-white/20">Content loading or not yet generated...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Bot size={48} className="text-white/5 mb-4" />
                <p className="font-display text-lg uppercase text-white/15">Select an Article</p>
                <p className="font-mono text-xs text-white/10 mt-1 max-w-md">
                  Click an article from the pipeline or generate a new one with CC-06
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
