import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

/* ============================================================
   AGENT DATA — FULL
   ============================================================ */
const AGENTS = [
  {
    id: 'SN-00', name: 'Neural Orchestrator', slug: 'sn00-orchestrator',
    glyph: '⚡', color: 'border-blue-500/40 bg-blue-500/5 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]', textColor: 'text-blue-400',
    model: 'gemini-2.0-flash', latency: '38ms', layer: 'Orchestration',
    headline: 'The conductor that dispatches all 9 agents in parallel via SwarmProtocol v3.0.',
    capabilities: ['Parallel agent dispatch', 'Context routing', 'Workflow sequencing', 'Real-time telemetry broadcast'],
    output: 'Orchestrated execution graph with live status for each sub-agent',
  },
  {
    id: 'SO-00', name: 'Sovereign Core', slug: 'so00-sovereign',
    glyph: '🧬', color: 'border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]', textColor: 'text-indigo-400',
    model: 'gemini-2.0-flash', latency: '580ms', layer: 'Intelligence',
    headline: 'The sentient fusion layer that merges user vision with AI technical congruence.',
    capabilities: ['Vision synthesis', 'Strategic alignment', 'Context memory', 'Recursive self-refinement'],
    output: 'Enhanced brief with strategic direction and brand-aligned intent',
  },
  {
    id: 'SP-01', name: 'Strategic Cortex', slug: 'sp01-strategic-cortex',
    glyph: '🔍', color: 'border-yellow-500/40 bg-yellow-500/5 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]', textColor: 'text-yellow-400',
    model: 'gemini-2.0-flash + Grounding', latency: '1.2s', layer: 'Intelligence',
    headline: 'Market intelligence through competitive analysis, SEO strategy, and real-time Google grounding.',
    capabilities: ['Competitor gap analysis', 'Firestore Vector Search', 'Google Search grounding', 'SERP feature identification'],
    output: 'Competitive intelligence report with positioning recommendations',
  },
  {
    id: 'CC-06', name: 'Cognitive Core', slug: 'cc06-cognitive-core',
    glyph: '✍', color: 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]', textColor: 'text-emerald-400',
    model: 'gemini-2.0-flash', latency: '3.2s', layer: 'Creation',
    headline: 'Copywriting, brand voice calibration, and high-conversion sales text across all platforms.',
    capabilities: ['LinkedIn articles', 'Email sequences', 'Blog posts', 'Ad copy', 'Meta descriptions'],
    output: 'Senate-approved multi-channel content package',
  },
  {
    id: 'DA-03', name: 'Design Architect', slug: 'da03-design-architect',
    glyph: '🎨', color: 'border-purple-500/40 bg-purple-500/5 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]', textColor: 'text-purple-400',
    model: 'Imagen 3 generate-002', latency: '6.8s', layer: 'Creation',
    headline: 'Visual asset generation with Imagen 3, UI/UX layouts, and creative direction at scale.',
    capabilities: ['1024×1024 image generation', 'C2PA provenance metadata', 'Brand palette enforcement', 'Storyboard creation'],
    output: 'High-fidelity visual assets with embedded provenance certificates',
  },
  {
    id: 'BA-07', name: 'Browser Architect', slug: 'ba07-browser-architect',
    glyph: '🌐', color: 'border-green-500/40 bg-green-500/5 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]', textColor: 'text-green-400',
    model: 'gemini-2.0-flash + Browser', latency: '2.1s', layer: 'Intelligence',
    headline: 'Live web intelligence, deep research automation, and real-world grounding at enterprise scale.',
    capabilities: ['URL scraping', 'Live market research', 'Product discovery', 'Competitive content indexing'],
    output: 'Real-time intelligence briefs grounded in live web data',
  },
  {
    id: 'VE-01', name: 'Voice Engagement', slug: 've01-voice-engagement',
    glyph: '🎤', color: 'border-blue-300/40 bg-blue-300/5 hover:border-blue-300 hover:shadow-[0_0_30px_rgba(147,197,253,0.15)]', textColor: 'text-blue-300',
    model: 'gemini-2.0-flash-live-001', latency: '<800ms', layer: 'Interface',
    headline: 'The Gemini Live API integration — bidirectional real-time audio with tool calling and barge-in support.',
    capabilities: ['Bidi audio streaming', 'Live tool calling', 'Barge-in detection', 'Intent classification'],
    output: 'Voice-activated swarm execution with real-time audio feedback',
  },
  {
    id: 'RA-01', name: 'Security Senate', slug: 'ra01-security-senate',
    glyph: '⚖', color: 'border-red-500/40 bg-red-500/5 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]', textColor: 'text-red-400',
    model: 'gemini-2.0-flash', latency: '280ms', layer: 'Governance',
    headline: 'EU AI Act Art.50 compliance enforcer with veto power over every agent output.',
    capabilities: ['EU AI Act Art.50 enforcement', 'GDPR verification', 'Hallucination risk scoring', 'Brand safety gate'],
    output: 'Compliance certificate with score 0-100, veto log, and remediation notes',
  },
  {
    id: 'PM-07', name: 'Mission Control', slug: 'pm07-mission-control',
    glyph: '📅', color: 'border-orange-500/40 bg-orange-500/5 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]', textColor: 'text-orange-400',
    model: 'gemini-2.0-flash', latency: '420ms', layer: 'Operations',
    headline: 'Scheduling, Google Chat sync, and campaign dispatch coordination across all teams.',
    capabilities: ['Campaign scheduling', 'Google Chat integration', 'Deadline management', 'Cross-agent coordination'],
    output: 'Synchronized campaign calendar with team notifications and milestone alerts',
  },
];

const FAQ = [
  { q: 'What AI model powers the AGENTICUM G5 agents?', a: 'All agents run on Google Gemini 2.0 Flash. DA-03 uses Imagen 3 (generate-002) for image generation. VE-01 uses the Gemini 2.0 Flash Live API for bidirectional audio.' },
  { q: 'How fast is the G5 swarm?', a: 'SN-00 initializes in 38ms. Voice commands are processed in under 800ms (VE-01). A complete campaign — from voice brief to deliverable — is ready in under 60 seconds.' },
  { q: 'What is the Security Senate (RA-01)?', a: 'RA-01 is the compliance gate. Every piece of content generated by the swarm is automatically reviewed against EU AI Act Art.50 requirements, GDPR standards, and brand safety policies. RA-01 has veto power — if content fails, it is blocked before delivery.' },
  { q: 'Can the agents run in parallel?', a: 'Yes. SN-00 dispatches all 9 agents simultaneously via SwarmProtocol v3.0. Unlike traditional AI tools that run sequentially, G5 agents parallel-execute, reducing total campaign time from hours to under 60 seconds.' },
  { q: 'Is the voice interface real or a demo?', a: 'The voice interface (VE-01) is a production implementation of the Gemini Live API using bidirectional WebSocket audio streaming. It is live at online-marketing-manager.web.app/os and was built for the Gemini Live Agent Challenge 2026.' },
];

/* ============================================================
   SCHEMA JSON-LD
   ============================================================ */
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['Article', 'FAQPage'],
  headline: 'The 9 AI Agents of AGENTICUM G5 GENIUS',
  description: 'Comprehensive guide to all 9 AI agents in the AGENTICUM G5 neural marketing swarm — from SN-00 Neural Orchestrator to RA-01 Security Senate.',
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ============================================================
   PAGE
   ============================================================ */
export function AgentsPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Use Palmer banner for the hero
  const heroImage = '/assets/palmer_neural_core.png';

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <MegaNav />

      {/* Hero Header */}
      <div className="w-full relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity scale-105" />
        
        <div className="relative z-30 max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-4xl">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-8">Neural Swarm <span className="text-zinc-700 mx-2">/</span> SwarmProtocol v3.0</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">The Neural Agents.</h1>
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
              Nine specialized AI entities. One synchronized neural swarm. Operating in parallel via Gemini 2.0 Flash — delivering complete campaigns in under 60 seconds.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-24">
        
        {/* Swarm stats bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {[
            { v: '9', l: 'Parallel Agents', sub: 'Dispatched simultaneously' },
            { v: '38ms', l: 'Init Latency', sub: 'SwarmProtocol v3.0' },
            { v: '<60s', l: 'Campaign Time', sub: 'Brief to full deliverable' },
            { v: '99%', l: 'Senate Approval', sub: 'EU AI Act compliant' },
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
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">01 — What are the AGENTICUM G5 agents?</p>
          <p className="text-2xl sm:text-3xl text-zinc-300 font-light leading-snug max-w-4xl">
            AGENTICUM G5 GENIUS runs 9 parallel AI agents built on Gemini 2.0 Flash and deployed on Google Cloud Run. SN-00 orchestrates all agents simultaneously: SP-01 researches, CC-06 writes, DA-03 generates, VE-01 handles live voice, and RA-01 strictly enforces EU AI Act compliance.
          </p>
        </div>

        {/* Agent Registry Grid */}
        <div className="mb-40">
          <div className="flex justify-between items-baseline border-b border-white/5 pb-4 mb-12">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">02 — Swarm Registry</p>
            <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">9 Entities Online</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative border border-white/5 bg-[#0A0A0A] hover:bg-[#0F0F0F] rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden"
                onClick={() => navigate(`/agents/${agent.slug}`)}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex justify-between items-start mb-12">
                   <div className="flex flex-col gap-2">
                     <span className="text-4xl opacity-50 mix-blend-screen">{agent.glyph}</span>
                     <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">{agent.layer}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="font-mono text-sm font-medium text-white">{agent.id}</span>
                     <span className="font-mono text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">{agent.latency}</span>
                   </div>
                </div>

                <h3 className="text-xl font-medium text-white mb-3 tracking-tight group-hover:text-zinc-300 transition-colors">{agent.name}</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed mb-8">{agent.headline}</p>

                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {agent.capabilities.slice(0, 2).map(cap => (
                    <span key={cap} className="font-mono text-[9px] text-zinc-500 bg-[#111] border border-white/5 px-3 py-1 rounded-full">{cap}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Access Profile</span>
                  <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-40 max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-12 border-b border-white/5 pb-4 text-center">03 — Intelligence Matrix</p>
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
          
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-6">RA-01 Verified · Secure Execution</p>
          <h3 className="text-4xl sm:text-5xl font-medium tracking-tighter text-white mb-6">Deploy the Swarm.</h3>
          <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto mb-12">Execute your first voice-activated, fully compliant neural campaign in under 60 seconds.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => navigate('/os')} className="px-10 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
              Enter Operating System <ArrowRight size={12} />
            </button>
            <button onClick={() => navigate('/modules')} className="px-10 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
              Explore Modules Directory
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
