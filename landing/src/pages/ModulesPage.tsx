import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

/* ============================================================
   MODULE DATA — ALL 15
   ============================================================ */
const MODULES = [
  {
    slug: 'genius-console', name: 'GenIUS Console', glyph: '🖥',
    category: 'Core', osRoute: '/os/genius',
    agents: ['SN-00', 'VE-01', 'SO-00'],
    color: 'border-blue-500/40 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]',
    textColor: 'text-blue-400',
    headline: 'The command center. Accepts voice (Gemini Live API) and text input to summon the full swarm.',
    what: 'A unified terminal that accepts voice commands via VE-01 (Gemini Live API) and typed directives. Every campaign starts here. One command triggers all 9 agents simultaneously.',
    output: 'Campaign brief dispatched to the swarm with full telemetry in the console',
  },
  {
    slug: 'executive-dashboard', name: 'Executive Dashboard', glyph: '📊',
    category: 'Core', osRoute: '/os',
    agents: ['SN-00', 'PM-07'],
    color: 'border-zinc-700/40 hover:border-zinc-500', textColor: 'text-zinc-300',
    headline: 'Real-time KPIs, swarm telemetry, and system health — all in one high-density command interface.',
    what: 'Shows Resonance Index, Swarm Readiness (100%), active campaigns, recent outputs, and live WebSocket heartbeat from all agents.',
    output: 'Live operational intelligence for strategic decision-making',
  },
  {
    slug: 'nexus-engine', name: 'Nexus Engine V2', glyph: '🔬',
    category: 'Core', osRoute: '/os/nexus',
    agents: ['SN-00', 'SO-00'],
    color: 'border-indigo-500/40 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]', textColor: 'text-indigo-400',
    headline: 'Visual workflow DAG editor for building autonomous, multi-step agent task chains.',
    what: 'A ReactFlow-based editor where you drag and connect agent nodes into processing pipelines. Define conditional logic, loops, and parallel branches with no code.',
    output: 'Saved workflow templates that execute automatically on trigger',
  },
  {
    slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣',
    category: 'Core', osRoute: '/os/campaigns',
    agents: ['SP-01', 'CC-06', 'PM-07'],
    color: 'border-yellow-500/40 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)]', textColor: 'text-yellow-400',
    headline: 'PMax and performance marketing orchestrator — from brief to multi-channel distribution.',
    what: 'Creates, tracks, and manages full marketing campaigns. Integrates with Google Ads structures (PMax), generates UTM parameters, and coordinates cross-channel publishing.',
    output: 'Complete campaign packages ready for deployment across all channels',
  },
  {
    slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍',
    category: 'Content', osRoute: '/os/blog',
    agents: ['CC-06', 'SP-01', 'RA-01'],
    color: 'border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]', textColor: 'text-emerald-400',
    headline: 'Fully autonomous SEO content generation — from keyword strategy to Senate-approved published article.',
    what: 'Implements the pillar-cluster content architecture automatically. SP-01 identifies high-value keywords, CC-06 writes 2500+ word articles, and RA-01 approves before publishing to Firestore.',
    output: 'Published blog articles with structured data, breadcrumbs, and internal links — all SEO-ready',
  },
  {
    slug: 'creative-studio', name: 'Creative Studio', glyph: '🎨',
    category: 'Content', osRoute: '/os/creative',
    agents: ['CC-06', 'DA-03'],
    color: 'border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]', textColor: 'text-purple-400',
    headline: 'Interactive workspace combining CC-06 copywriting with DA-03 Imagen 3 visual generation.',
    what: 'An integrated creative environment where CC-06 generates platform-specific copy while DA-03 produces high-fidelity visuals. Edit, iterate, and approve in one interface.',
    output: 'Senate-approved content packages: copy + visuals + C2PA provenance certificates',
  },
  {
    slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬',
    category: 'Content', osRoute: '/os/creative',
    agents: ['VE-01', 'DA-03', 'CC-06'],
    color: 'border-pink-500/40 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)]', textColor: 'text-pink-400',
    headline: 'Video synthesis, storyboard creation, and motion branding — AI-driven cinematic production.',
    what: 'Generates video storyboards with scene-by-scene AI direction. VE-01 provides voice narration scripts, DA-03 generates visual frames, and CC-06 writes the voiceover.',
    output: 'Complete video production package: storyboard, script, frame references, and narration',
  },
  {
    slug: 'asset-vault', name: 'Asset Vault', glyph: '🗃',
    category: 'Operations', osRoute: '/os/vault',
    agents: ['BA-07', 'DA-03'],
    color: 'border-orange-500/40 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)]', textColor: 'text-orange-400',
    headline: 'Enterprise-grade file management built on Google Cloud Storage with discovery ingestion.',
    what: 'Stores all AI-generated assets in GCS with full metadata, versioning, and searchability. BA-07 can discover and ingest external assets. DA-03 outputs go directly here.',
    output: 'Organized, tagged, and searchable enterprise asset library with download access',
  },
  {
    slug: 'workflow-builder', name: 'Workflow Builder', glyph: '⚙',
    category: 'Operations', osRoute: '/os/workflows',
    agents: ['SN-00', 'PM-07'],
    color: 'border-cyan-500/40 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]', textColor: 'text-cyan-400',
    headline: 'ReactFlow-based DAG editor for building fully automated, condition-driven agent pipelines.',
    what: 'Drag-and-drop workflow creation with agent nodes, condition gates, loops, and parallel branches. Save as templates and trigger automatically or on schedule.',
    output: 'Reusable automation templates that run the swarm on autopilot',
  },
  {
    slug: 'project-memory', name: 'Project Memory', glyph: '🧠',
    category: 'Intelligence', osRoute: '/os/memory',
    agents: ['SO-00', 'SN-00'],
    color: 'border-violet-500/40 hover:border-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]', textColor: 'text-violet-400',
    headline: 'Historical campaign archive and client context store — the swarm\'s long-term memory.',
    what: 'Every campaign, output, and decision is stored with full vector embeddings for semantic search. The swarm learns from past successes and cites them as precedents.',
    output: 'Contextual retrieval of relevant past campaigns to inform new creative decisions',
  },
  {
    slug: 'swarm-analytics', name: 'Swarm Analytics', glyph: '📈',
    category: 'Intelligence', osRoute: '/os/analytics',
    agents: ['SN-00', 'PM-07'],
    color: 'border-green-500/40 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]', textColor: 'text-green-400',
    headline: 'Agent throughput metrics, success rates, latency data, and real-time swarm health monitoring.',
    what: 'Tracks per-agent execution times, success/failure rates, output quality scores, and system resource utilization. Surfaced as live charts and exportable reports.',
    output: 'Operational intelligence for swarm optimization and performance benchmarking',
  },
  {
    slug: 'synergy-map', name: 'Synergy Map', glyph: '🗺',
    category: 'Intelligence', osRoute: '/os/synergy',
    agents: ['SN-00', 'SO-00'],
    color: 'border-teal-500/40 hover:border-teal-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.12)]', textColor: 'text-teal-400',
    headline: 'Live visualization of inter-agent data flows, dependencies, and swarm state.',
    what: 'A real-time graph showing how data moves between agents during execution. See SP-01\'s intelligence feeding CC-06\'s copy generation, which feeds DA-03\'s visual brief.',
    output: 'Visual execution trace for auditing and optimizing agent coordination',
  },
  {
    slug: 'security-senate', name: 'Security Senate', glyph: '🔒',
    category: 'Governance', osRoute: '/os/senate',
    agents: ['RA-01'],
    color: 'border-red-500/40 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)]', textColor: 'text-red-400',
    headline: 'The RA-01 compliance tribunal — EU AI Act Art.50 enforcement with full veto power.',
    what: 'Every piece of content must pass the Senate before delivery. RA-01 checks for EU AI Act compliance, GDPR alignment, brand safety, hallucination risk, and C2PA provenance.',
    output: 'Compliance certificates (score 0-100) or veto notices with remediation steps',
  },
  {
    slug: 'columna-radar', name: 'Columna Radar', glyph: '📡',
    category: 'Intelligence', osRoute: '/os/radar',
    agents: ['SP-01', 'BA-07'],
    color: 'border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]', textColor: 'text-amber-400',
    headline: 'Market pulse monitoring — competitive intelligence and content gap analysis in real-time.',
    what: 'Continuously scans competitor content using Firestore Vector Search and Google grounding. Identifies gaps, emerging trends, and positioning opportunities.',
    output: 'Live competing authority reports with actionable positioning recommendations',
  },
  {
    slug: 'perfect-twin', name: 'Perfect Twin', glyph: '🪞',
    category: 'Governance', osRoute: '/os/twin',
    agents: ['RA-01', 'SO-00'],
    color: 'border-slate-500/40 hover:border-slate-500 hover:shadow-[0_0_30px_rgba(100,116,139,0.12)]', textColor: 'text-slate-400',
    headline: 'Blockchain-grade provenance and audit trail for every AI-generated asset.',
    what: 'Maintains an immutable record of every decision, prompt, and output with timestamp, agent ID, and human-readable explanation. Built for cross-audit compliance.',
    output: 'Tamper-evident audit trail with C2PA metadata and chain-of-custody documentation',
  },
];

const FAQ = [
  { q: 'What is the AGENTICUM G5 Neural OS?', a: 'AGENTICUM G5 GENIUS is a cloud-based AI marketing operating system with 15 modules powered by 9 specialized AI agents. It runs on Google Cloud (europe-west1) using Gemini 2.0 Flash, Firestore, Cloud Run, and Imagen 3 — with voice control via the Gemini Live API.' },
  { q: 'How many modules does the OS have?', a: 'The OS has 15 mission-critical modules organized into five categories: Core (GenIUS Console, Dashboard, Nexus Engine, Campaign Manager), Content (Blog Engine, Creative Studio, Cinematic Forge, Asset Vault), Operations (Workflow Builder), Intelligence (Project Memory, Swarm Analytics, Synergy Map, Columna Radar), and Governance (Security Senate, Perfect Twin).' },
  { q: 'Which modules use the Gemini Live API?', a: 'The GenIUS Console (via VE-01) is the primary interface for the Gemini Live API. It processes voice commands in under 800ms with bidirectional audio streaming. The Creative Studio also uses audio feedback for real-time creative direction.' },
  { q: 'Is the EU AI Act compliance built-in?', a: 'Yes. The Security Senate module (powered by RA-01) enforces EU AI Act Art.50 compliance on every piece of content before it is delivered. This is not an add-on — it is a required gate in every workflow.' },
  { q: 'Can I try the OS without setting anything up?', a: 'Yes. The OS is live at online-marketing-manager.web.app/os. No install required. Your browser connects directly to the Cloud Run backend in europe-west1.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'FAQPage'],
  name: 'AGENTICUM G5 OS Modules — All 15 Mission-Critical Modules',
  description: 'Complete guide to all 15 modules of the AGENTICUM G5 Neural Marketing OS — from the GenIUS Console to the Security Senate.',
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const CATEGORIES = ['All', 'Core', 'Content', 'Intelligence', 'Operations', 'Governance'];

export function ModulesPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? MODULES : MODULES.filter(m => m.category === activeCategory);
  
  // Use Palmer banner for the hero
  const heroImage = '/assets/palmer_system.png';

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <MegaNav />

      {/* Hero Header */}
      <div className="w-full relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity scale-105" />
        
        <div className="relative z-30 max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-4xl">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-8">Neural Operating System <span className="text-zinc-700 mx-2">/</span> 27 Live Routes</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">System Modules.</h1>
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
              Every module is live, deployed on Google Cloud, and accessible direct from your browser interface. No installation, no friction, no limits.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-24">
        
        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { v: '15', l: 'Live Modules', sub: '27 accessible routes' },
            { v: '100%', l: 'GCP Native', sub: 'No external dependencies' },
            { v: '9', l: 'AI Agents', sub: 'Powering every module' },
            { v: 'EU', l: 'Compliant', sub: 'AI Act Art.50 built-in' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 border border-white/5 bg-[#0A0A0A] rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <p className="text-4xl font-medium text-white mb-2">{s.v}</p>
               <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-2">{s.l}</p>
               <p className="text-zinc-600 text-[10px] font-mono">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Answer */}
        <div className="mb-32">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">01 — What are the OS Modules?</p>
          <p className="text-2xl sm:text-3xl text-zinc-300 font-light leading-snug max-w-4xl">
            The 15 modules cover the entire marketing lifecycle: voice command execution (GenIUS Console), competitive intelligence (Columna Radar), and EU AI Act compliance verification (Security Senate). All modules are live at online-marketing-manager.web.app/os.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-16 flex-wrap pb-6 border-b border-white/5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                activeCategory === cat
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-zinc-500 hover:text-zinc-300 pb-1 border-b-2 border-transparent hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Module Grid */}
        <div className="mb-40">
          <div className="flex justify-between items-baseline mb-12">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">02 — Module Registry</p>
            <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">{filtered.length} Indexed</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((mod, i) => (
              <motion.div
                key={mod.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative border border-white/5 bg-[#0A0A0A] hover:bg-[#0F0F0F] rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden"
                onClick={() => navigate(`/modules/${mod.slug}`)}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex justify-between items-start mb-12">
                   <span className="text-4xl opacity-50 mix-blend-screen">{mod.glyph}</span>
                   <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase border border-white/5 px-2 py-0.5 rounded-full">{mod.category}</span>
                </div>

                <h3 className="text-xl font-medium text-white mb-3 tracking-tight group-hover:text-zinc-300 transition-colors">{mod.name}</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed mb-8">{mod.headline}</p>

                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {mod.agents.map(a => (
                    <span key={a} className="font-mono text-[9px] text-zinc-500 bg-[#111] border border-white/5 px-3 py-1 rounded-full">{a}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Access Specification</span>
                  <div className="flex items-center gap-4">
                     <button
                        onClick={(e) => { e.stopPropagation(); navigate(mod.osRoute); }}
                        className="text-zinc-600 hover:text-zinc-300 font-mono text-[9px] uppercase tracking-widest transition-colors flex items-center gap-1.5"
                        title="Boot Application"
                      >
                        <ExternalLink size={10} /> Boot
                      </button>
                      <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-40 max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-12 border-b border-white/5 pb-4 text-center">03 — Frequently Asked Questions</p>
          <div className="space-y-6">
            {FAQ.map((faq, i) => (
              <div key={i} className="border-b border-white/5 pb-6" itemScope itemType="https://schema.org/Question">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-lg text-zinc-300 font-light group-hover:text-white transition-colors" itemProp="name">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-zinc-500 font-mono text-xl shrink-0 group-hover:text-white">+</motion.span>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="pt-6" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p className="text-zinc-400 font-light leading-relaxed text-sm" itemProp="text">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border border-white/5 bg-[#0A0A0A] rounded-4xl p-12 sm:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-6">Cloud Run + Firestore · europe-west1</p>
          <h3 className="text-4xl sm:text-5xl font-medium tracking-tighter text-white mb-6">Boot OS Sequence.</h3>
          <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto mb-12">No setup. No installation. Execute the OS environment in your browser with full unconstrained access.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => navigate('/os')} className="px-10 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
              Enter Operating System <ArrowRight size={12} />
            </button>
            <button onClick={() => navigate('/agents')} className="px-10 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
              Meet the Swarm Direct
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
