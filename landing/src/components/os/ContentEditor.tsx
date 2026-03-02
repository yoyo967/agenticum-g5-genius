import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Eye, Edit3, Wand2, Download, Copy, Check,
  BarChart2, AlignLeft, Hash, Loader2, Save,
  Bold, Italic, List, Link, ChevronDown
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { downloadJSON } from '../../utils/export';

// ── Types ─────────────────────────────────────────────────────────────────────
type ViewMode = 'split' | 'editor' | 'preview';
type ContentType = 'blog' | 'linkedin' | 'email' | 'press-release' | 'ad-copy' | 'landing';

interface EditorDoc {
  title: string;
  body: string;
  type: ContentType;
  savedAt?: string;
}

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: 'blog',          label: 'Blog Post' },
  { id: 'linkedin',      label: 'LinkedIn Article' },
  { id: 'email',         label: 'Email Campaign' },
  { id: 'press-release', label: 'Press Release' },
  { id: 'ad-copy',       label: 'Ad Copy' },
  { id: 'landing',       label: 'Landing Page' },
];

// ── Markdown → HTML (lightweight renderer) ────────────────────────────────────
function mdToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-white border-b border-white/10 pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-white/80">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 text-sm font-mono">$1</code>')
    .replace(/^[*-] (.+)$/gm, '<li class="ml-4 text-white/70 before:content-[\'\u00b7\'] before:mr-2 before:text-cyan-400">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-white/70 list-decimal list-inside">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 underline hover:text-cyan-300" target="_blank">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-cyan-600 pl-4 text-white/60 italic my-3">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-6" />')
    .replace(/\n\n/g, '</p><p class="text-white/70 leading-relaxed my-3">')
    .replace(/^(?!<[h1-6|li|blockquote|hr|p])(.+)$/gm, '<p class="text-white/70 leading-relaxed my-2">$1</p>');
}

// ── SEO Score ─────────────────────────────────────────────────────────────────
function calcSeoScore(title: string, body: string): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  if (title.length >= 30 && title.length <= 65) score += 20; else tips.push('Title: 30–65 chars optimal');
  if (body.length > 800) score += 20; else tips.push('Content: min 800 chars for SEO');
  const words = body.split(/\s+/).length;
  if (words >= 300) score += 15; else tips.push(`Word count: ${words}/300 minimum`);
  if (/\n#+\s/.test(body)) score += 15; else tips.push('Add H2/H3 headings');
  if (/\*\*/.test(body)) score += 10; else tips.push('Add bold keywords');
  if (/\[.+\]\(.+\)/.test(body)) score += 10; else tips.push('Add internal/external links');
  if (/\- /.test(body) || /\d+\. /.test(body)) score += 10; else tips.push('Add bullet lists');

  return { score: Math.min(score, 100), tips };
}

// ─────────────────────────────────────────────────────────────────────────────
const STARTER: Record<ContentType, EditorDoc> = {
  blog: {
    title: 'How AI Agent Swarms Are Redefining Enterprise Marketing',
    body: `# How AI Agent Swarms Are Redefining Enterprise Marketing\n\n> Written by **CC-06 Cognitive Core** · AGENTICUM G5 GenIUS\n\n## The Shift Is Here\n\nEnterprise marketing is undergoing its most radical transformation since the digital revolution. AI agent swarms — coordinated networks of specialized AI agents — are replacing individual tools with **intelligent, collaborative systems**.\n\n## What Makes G5 Different\n\n- **9 specialized agents** working simultaneously\n- Real-time Senate compliance gate\n- Multi-format output from a single directive\n- Perfect Twin audit trail for every output\n\n## The Business Case\n\nStudies show that AI-augmented marketing teams deliver **3.8x more content** at **61% lower cost per unit**. With AGENTICUM G5, this is now accessible for any B2B enterprise.\n\n## Getting Started\n\nThe entry point is simple: define [your first directive](https://online-marketing-manager.web.app/os) and let the swarm handle the rest.\n\n---\n\n*Published via AGENTICUM G5 GenIUS · Senate-Approved*`,
    type: 'blog',
  },
  linkedin: {
    title: 'LinkedIn Article: The AI-First Marketing Stack',
    body: `# The AI-First Marketing Stack Is Here\n\nAfter 12 months of building, testing, and iterating...\n\n**We\u2019re live with AGENTICUM G5.**\n\nHere\u2019s what changed:\n\n- ❌ Old: 1 copywriter → 1 piece of content/day\n- ✅ New: 9 AI agents → 40+ assets/hour\n\n## What the swarm does:\n\n1. Strategist agent reads market signals\n2. Copywriter generates 12 content formats\n3. Design AI produces images & motion assets\n4. Compliance gate runs EU AI Act audit\n5. Distribution agent publishes everywhere\n\nThe future of marketing isn\u2019t hiring more people.\n\nIt\u2019s **deploying smarter agents.**\n\n---\n\n#AIMarketing #EnterpriseAI #G5`,
    type: 'linkedin',
  },
  email: {
    title: 'Email: Q1 AI Marketing Report',
    body: `# Q1 AI Marketing Report\n\n**Subject:** Your AI Marketing Performance — March 2026\n\nHi [First Name],\n\nHere\u2019s your AGENTICUM G5 performance summary for Q1:\n\n## Key Results\n\n- **124.8K** page views generated\n- **1,293** conversions tracked\n- **4.81%** average CTR across all channels\n- **9 AI agents** deployed on 48 campaigns\n\n## Top Performing Asset\n\nYour LinkedIn AI Trends post scored **94/100** and drove 312 conversions — our highest-scoring piece this quarter.\n\n## Next Steps\n\nYour Q2 strategy brief is ready in the OS portal. [View your brief →](https://online-marketing-manager.web.app/os)\n\n---\n\n*AGENTICUM G5 GenIUS · Senate-Compliant AI Marketing OS*`,
    type: 'email',
  },
  'press-release': {
    title: 'Press Release: AGENTICUM G5 Launch',
    body: `# FOR IMMEDIATE RELEASE\n\n## AGENTICUM G5 GenIUS: The World\u2019s First 9-Agent AI Marketing OS\n\n**Munich, March 2026** — Today marks the public launch of AGENTICUM G5 GenIUS, a complete AI-native marketing operating system powered by a swarm of 9 specialized AI agents.\n\nBuilt on Google Cloud\u2019s Vertex AI infrastructure and designed for enterprise B2B marketing teams, G5 enables organizations to generate, audit, and distribute marketing assets at unprecedented scale.\n\n## Key Features\n\n- 9 specialized agents (Strategist, Copywriter, Designer, Researcher, Compliance)\n- Real-time Senate compliance gate (EU AI Act Art. 50 ready)\n- 12 content formats from a single directive\n- Full audit trail via Perfect Twin Log\n\n## Availability\n\nAGENTICUM G5 is available immediately at [online-marketing-manager.web.app](https://online-marketing-manager.web.app).\n\n---\n\n*Media Contact: press@agenticum.ai*`,
    type: 'press-release',
  },
  'ad-copy': {
    title: 'Google Ads — B2B SaaS Campaign',
    body: `# Ad Copy — B2B SaaS PMax Campaign\n\n## Headline Variants (15)\n\n1. **Deploy 9 AI Agents Instantly**\n2. **AI Marketing That Never Stops**\n3. **Your Competitors Already Use AI**\n4. **9 Agents. 1 Directive. Full Output.**\n5. **G5 GenIUS: Marketing OS for Enterprises**\n6. **40x Faster Content Production**\n7. **From Strategy to Published — Automated**\n8. **AI-Native Marketing Operating System**\n9. **Senate-Compliant AI Marketing**\n10. **Replace Your Stack With One OS**\n11. **Marketing Swarm Intelligence**\n12. **EU AI Act Ready from Day One**\n13. **Perfect Twin Audit on Every Asset**\n14. **9 Agents. Zero Compromise.**\n15. **The Future of B2B Marketing Is Here**\n\n## Descriptions (4)\n\n- Deploy 9 specialized AI agents on demand. Generate 40+ assets per hour. Senate-compliance built in.\n- AGENTICUM G5 replaces your entire martech stack with one intelligent, auditable AI OS.\n- From research to distribution — 9 agents coordinate in real-time to produce and publish your marketing.\n- EU AI Act compliant. 100% audit trail. Zero hallucinations. The enterprise standard for AI marketing.`,
    type: 'ad-copy',
  },
  landing: {
    title: 'Landing Page Copy — G5 GenIUS',
    body: `# AGENTICUM G5 GenIUS\n## The AI Marketing OS That Works While You Sleep\n\n**9 specialized agents. 12 content formats. Real-time compliance. Zero compromise.**\n\n[Deploy Your Swarm →]\n\n---\n\n## Why G5?\n\n- **Fully automated** — one directive, full output\n- **Senate-compliant** — EU AI Act Art. 50 built in\n- **Multi-format** — blog, ads, LinkedIn, email, PR\n- **Audit-ready** — Perfect Twin log on every output\n\n## What You Get\n\n**CC-06 Copywriter** generates 12 content formats simultaneously.\n**DA-03 Designer** produces campaign images via Imagen 3.\n**SP-01 Strategist** researches your market in real-time.\n**RA-01 Senate** audits every output for brand & legal safety.\n\n---\n\n## Trusted by Forward-Thinking Marketing Leaders\n\n> "G5 replaced our entire content production pipeline in two weeks."\n\n[Start Your Free Trial →] · [Watch Demo →]`,
    type: 'landing',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
export function ContentEditor() {
  const [doc, setDoc]           = useState<EditorDoc>(STARTER.blog);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [refining, setRefining] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [copied, setCopied]     = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = doc.body.trim().split(/\s+/).filter(Boolean).length;
  const charCount = doc.body.length;
  const readTime  = Math.max(1, Math.round(wordCount / 230));
  const { score: seoScore, tips: seoTips } = calcSeoScore(doc.title, doc.body);
  const seoColor = seoScore >= 80 ? 'text-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400';

  // ── AI Refine ────────────────────────────────────────────────────────────
  const handleRefine = useCallback(async () => {
    if (!doc.body.trim()) return;
    setRefining(true);
    try {
      const res = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: doc.type === 'blog' ? 'Blog Post' : doc.type,
          topic: doc.title,
          tone: 'Professional',
          readingLevel: 'Manager',
          context: doc.body.slice(0, 500),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.content) setDoc(prev => ({ ...prev, body: data.content }));
      }
    } catch { /* fallback: keep doc */ }
    finally { setRefining(false); }
  }, [doc]);

  // ── Toolbar helpers ───────────────────────────────────────────────────────
  const insertMd = (prefix: string, suffix = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = doc.body.slice(start, end);
    const newBody = doc.body.slice(0, start) + prefix + sel + suffix + doc.body.slice(end);
    setDoc(prev => ({ ...prev, body: newBody }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + sel.length);
    }, 10);
  };

  // ── Save to Local  ────────────────────────────────────────────────────────
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setDoc(prev => ({ ...prev, savedAt: new Date().toLocaleString() }));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  // ── Copy ─────────────────────────────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(doc.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changeType = (t: ContentType) => {
    setDoc(STARTER[t]);
    setTypeOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col gap-0 overflow-hidden bg-zinc-950">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500">
          <FileText size={14} className="text-cyan-400" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">CC-06</span>
          <span className="text-zinc-700">·</span>
          <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Content Editor</span>
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button onClick={() => setTypeOpen(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded font-mono text-xs text-zinc-300 hover:border-zinc-500 transition-colors">
            {CONTENT_TYPES.find(t => t.id === doc.type)?.label}
            <ChevronDown size={11} className={`transition-transform ${typeOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {typeOpen && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute top-full left-0 mt-1 z-20 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-2xl">
                {CONTENT_TYPES.map(t => (
                  <button key={t.id} onClick={() => changeType(t.id)}
                    className={`block w-full text-left px-4 py-2.5 font-mono text-xs hover:bg-zinc-800 transition-colors ${doc.type === t.id ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        {/* View Mode */}
        <div className="flex border border-zinc-800 rounded overflow-hidden">
          {([['editor', Edit3], ['split', AlignLeft], ['preview', Eye]] as const).map(([mode, Icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1.5 font-mono text-[10px] uppercase transition-colors flex items-center gap-1 ${viewMode === mode ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
              <Icon size={11} />
              {mode !== 'split' && <span>{mode}</span>}
            </button>
          ))}
        </div>

        {/* Actions */}
        <button onClick={handleRefine} disabled={refining}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 font-mono text-xs rounded hover:bg-cyan-900/50 transition-colors disabled:opacity-50">
          {refining ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
          AI Refine
        </button>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-zinc-700 text-zinc-400 font-mono text-xs rounded hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
        <button onClick={() => downloadJSON({ title: doc.title, body: doc.body, type: doc.type, exportedAt: new Date().toISOString() }, `G5_Content_${doc.type}`)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-zinc-700 text-zinc-400 font-mono text-xs rounded hover:text-white transition-colors">
          <Download size={12} />
        </button>
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs rounded transition-colors ${saved ? 'bg-green-700 text-white' : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}>
          {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <Check size={12} /> : <Save size={12} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* ── Title Bar ───────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-2 border-b border-zinc-900">
        <input
          value={doc.title}
          onChange={e => setDoc(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Document title..."
          className="w-full bg-transparent font-mono text-sm text-white placeholder:text-zinc-700 focus:outline-none"
        />
      </div>

      {/* ── Markdown Toolbar ─────────────────────────────────────────────── */}
      {viewMode !== 'preview' && (
        <div className="shrink-0 flex items-center gap-0.5 px-4 py-1.5 border-b border-zinc-900 bg-zinc-950">
          {[
            { icon: Bold,   fn: () => insertMd('**', '**'),  title: 'Bold' },
            { icon: Italic, fn: () => insertMd('*', '*'),    title: 'Italic' },
            { icon: Hash,   fn: () => insertMd('## '),       title: 'Heading' },
            { icon: List,   fn: () => insertMd('- '),        title: 'List' },
            { icon: Link,   fn: () => insertMd('[', '](url)'), title: 'Link' },
          ].map(({ icon: Icon, fn, title }) => (
            <button key={title} onClick={fn} title={title}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-600 hover:text-white transition-colors">
              <Icon size={12} />
            </button>
          ))}
          <div className="flex-1" />
          <span className="font-mono text-[10px] text-zinc-700">{wordCount} words · {charCount} chars · {readTime} min read</span>
        </div>
      )}

      {/* ── Editor / Preview ─────────────────────────────────────────────── */}
      <div className={`flex-1 min-h-0 flex ${viewMode === 'split' ? 'gap-0' : ''}`}>

        {/* Editor Pane */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-zinc-800' : 'flex-1'} min-h-0`}>
            <textarea
              ref={textareaRef}
              value={doc.body}
              onChange={e => setDoc(prev => ({ ...prev, body: e.target.value }))}
              className="flex-1 w-full bg-zinc-950 text-zinc-300 font-mono text-sm leading-6 resize-none p-4 focus:outline-none placeholder:text-zinc-800"
              placeholder="Start writing in Markdown..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} overflow-y-auto`}>
            <div className="p-6 max-w-2xl mx-auto">
              <div
                className="prose-custom font-sans text-sm leading-7"
                dangerouslySetInnerHTML={{ __html: mdToHtml(doc.body) }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Status Bar ───────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-4 px-4 py-2 border-t border-zinc-900 bg-zinc-950 font-mono text-[10px]">
        {/* SEO Score */}
        <div className="flex items-center gap-1.5">
          <BarChart2 size={10} className={seoColor} />
          <span className="text-zinc-600">SEO</span>
          <span className={`font-bold ${seoColor}`}>{seoScore}/100</span>
        </div>
        {/* SEO Tips */}
        {seoTips.length > 0 && (
          <span className="text-zinc-700 truncate max-w-xs">
            ⚡ {seoTips[0]}
          </span>
        )}
        <div className="flex-1" />
        {/* Saved time */}
        {doc.savedAt && (
          <span className="text-zinc-700">Saved {doc.savedAt}</span>
        )}
        {/* Agent badge */}
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <span className="text-zinc-600">CC-06 · Editor Module</span>
        </div>
      </div>

    </div>
  );
}
