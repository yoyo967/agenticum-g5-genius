import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Network } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

import g5NeuralSwarm from '../assets/g5_neural_swarm.png';
import g5ComplianceSenate from '../assets/g5_compliance_senate_en_v2_1772174738278.png';
import g5TacticalRadar from '../assets/g5_tactical_radar_strike_en_v2_1772174690101.png';

const CinematicBreak = ({ image, title, subtitle }: { image: string, title: string, subtitle: string }) => (
  <div className="w-full relative h-[450px] border-y border-white/5 my-32 overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 bg-[#050505]/40 z-10" />
    <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-[#050505] z-20" />
    <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105" />
    <div className="relative z-30 text-center px-6 max-w-4xl mx-auto">
      <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em] mb-4">{subtitle}</p>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-white">{title}</h2>
    </div>
  </div>
);

/* ============================================================
   AGENT DATA — FULL
   ============================================================ */
const AGENTS = [
  {
    id: 'SN-00', name: 'Neural Orchestrator', slug: 'sn00-orchestrator',
    glyph: '⚡', color: 'border-blue-500/40 bg-blue-500/5', textColor: 'text-blue-400',
    model: 'gemini-2.0-flash', latency: '38ms', layer: 'Orchestration',
    headline: 'The conductor that dispatches all 9 agents in parallel via SwarmProtocol v3.0.',
    capabilities: ['Parallel agent dispatch', 'Context routing', 'Workflow sequencing', 'Real-time telemetry'],
    output: 'Orchestrated execution graph with live status',
    deepLore: 'SN-00 acts as the sovereign entity orchestrating the swarm. By continuously evaluating synaptic load, it redistributes tasks dynamically across the mesh network. This ensures zero cognitive debt and maintains the system heartbeat at an invisible 38ms.',
    businessValue: 'Eliminates the human bottleneck in marketing execution. A single voice command translates into 9 simultaneous work streams, accelerating time-to-market by 4,000% while maintaining absolute strategic alignment.'
  },
  {
    id: 'SO-00', name: 'Sovereign Core', slug: 'so00-sovereign',
    glyph: '🧬', color: 'border-indigo-500/40 bg-indigo-500/5', textColor: 'text-indigo-400',
    model: 'gemini-2.0-flash', latency: '580ms', layer: 'Intelligence',
    headline: 'The sentient fusion layer that merges user vision with AI technical congruence.',
    capabilities: ['Vision synthesis', 'Strategic alignment', 'Context memory', 'Recursive refinement'],
    output: 'Enhanced brief with strategic direction',
    deepLore: 'SO-00 guarantees data sovereignty and maintains the "Perfect Twin" cryptographical state. It ensures that no PII leaves jurisdictional boundaries (e.g., europe-west3), translating global cloud capabilities into sovereign compliance.',
    businessValue: 'Provides enterprise organizations the confidence to scale generative AI. By locking down data flow and ensuring zero-leakage reasoning chains, it turns a latent regulatory risk into a heavily defended competitive advantage.'
  },
  {
    id: 'SP-01', name: 'Strategic Cortex', slug: 'sp01-strategic-cortex',
    glyph: '🔍', color: 'border-yellow-500/40 bg-yellow-500/5', textColor: 'text-yellow-400',
    model: 'gemini-2.0-flash + Grounding', latency: '1.2s', layer: 'Intelligence',
    headline: 'Market intelligence through competitive analysis and real-time Google grounding.',
    capabilities: ['Competitor gap analysis', 'Vector Search', 'Google Search grounding', 'SERP tracking'],
    output: 'Competitive intelligence report & positioning',
    deepLore: 'Operating autonomously, SP-01 continuously scans the market vector. When a competitor shifts their narrative, SP-01 detects the anomaly via the Columna Radar, immediately proposing a "Counter-Strike" campaign framework to the swarm.',
    businessValue: 'Transforms competitive intelligence from a quarterly review into a minute-by-minute operational offensive. Market gaps are identified and exploited autonomously with a 94% probabilistic success win-rate.'
  },
  {
    id: 'CC-06', name: 'Cognitive Core', slug: 'cc06-cognitive-core',
    glyph: '✍', color: 'border-emerald-500/40 bg-emerald-500/5', textColor: 'text-emerald-400',
    model: 'gemini-2.0-flash', latency: '3.2s', layer: 'Creation',
    headline: 'Copywriting, brand voice calibration, and high-conversion sales text.',
    capabilities: ['LinkedIn articles', 'Email sequences', 'Blog posts', 'Ad copy'],
    output: 'Senate-approved multi-channel content',
    deepLore: 'CC-06 does not just output text; it performs deep semantic structuring. It builds copy networks where a whitepaper seamlessly fractures into 14 distinct social posts, 3 email funnels, and 2 ad variations — all anchored to a singular psychological hook.',
    businessValue: 'Reduces the content supply chain lifecycle from 3 weeks to 3 seconds. Consistency and psychological triggering are hardcoded into the output, bypassing the typical agency revision cycle completely.'
  },
  {
    id: 'DA-03', name: 'Design Architect', slug: 'da03-design-architect',
    glyph: '🎨', color: 'border-purple-500/40 bg-purple-500/5', textColor: 'text-purple-400',
    model: 'Imagen 3 generate-002', latency: '6.8s', layer: 'Creation',
    headline: 'Visual asset generation with Imagen 3, UI/UX layouts, and creative direction.',
    capabilities: ['1024×1024 generation', 'C2PA metadata', 'Palette enforcement', 'Storyboards'],
    output: 'High-fidelity visual assets with provenance',
    deepLore: 'Through the Cinematic Forge routine, DA-03 dynamically binds image generation to CC-06\'s semantic output. If the copy leans aggressive, the visuals autonomously shift into high-contrast cyberpunk tonalities. C2PA provenance is cryptographically embedded.',
    businessValue: 'Replaces generic stock photography with brand-aligned, completely original bespoke art. Drives a 3x higher click-through rate in performance marketing by instantly capitalizing on visual trends tailored to the immediate brief.'
  },
  {
    id: 'BA-07', name: 'Browser Architect', slug: 'ba07-browser-architect',
    glyph: '🌐', color: 'border-green-500/40 bg-green-500/5', textColor: 'text-green-400',
    model: 'gemini-2.0-flash + Browser', latency: '2.1s', layer: 'Intelligence',
    headline: 'Live web intelligence, deep research automation, and real-world grounding.',
    capabilities: ['URL scraping', 'Live market research', 'Product discovery', 'Content indexing'],
    output: 'Real-time brief grounded in live web data',
    deepLore: 'The digital proxy. BA-07 utilizes headless instances to read the web exactly as a human would, bypassing typical API limitations. It synthesizes 40 distinct sources into a single coherent truth-vector in under two seconds.',
    businessValue: 'Erases the latency of human desktop research. An executive can ask about a breaking news event, and BA-07 will not only read the news, but index the competitors\' reactions, and draft a response strategy instantly.'
  },
  {
    id: 'VE-01', name: 'Voice Engagement', slug: 've01-voice-engagement',
    glyph: '🎤', color: 'border-blue-300/40 bg-blue-300/5', textColor: 'text-blue-300',
    model: 'gemini-2.0-flash-live-001', latency: '<800ms', layer: 'Interface',
    headline: 'The Gemini Live API integration — bidirectional real-time audio with barge-in.',
    capabilities: ['Bidi audio streaming', 'Live tool calling', 'Barge-in detection', 'Intent classification'],
    output: 'Voice-activated swarm execution',
    deepLore: 'VE-01 destroys the "text-box" paradigm. It maintains continuous sub-800ms Bidi-Audio streams with human operators. It understands tone, handles conversational "barge-in" flawlessly, and reroutes the entire swarm mid-sentence without losing context.',
    businessValue: 'Produces true operational immersion. Executives can dictate multi-million dollar strategy shifts while driving or walking, interacting with their marketing swarm directly via a highly natural bio-digital interface.'
  },
  {
    id: 'RA-01', name: 'Security Senate', slug: 'ra01-security-senate',
    glyph: '⚖', color: 'border-red-500/40 bg-red-500/5', textColor: 'text-red-400',
    model: 'gemini-2.0-flash', latency: '280ms', layer: 'Governance',
    headline: 'EU AI Act Art.50 compliance enforcer with veto power over every output.',
    capabilities: ['EU AI Act Art.50', 'GDPR verification', 'Hallucination scoring', 'Brand safety gate'],
    output: 'Compliance certificate & Zero Veto Protocol',
    deepLore: 'The unforgiving gatekeeper. Operating under the Zero Veto Protocol, RA-01 executes deep-reasoning chains against all content. It hunts for copyright overlaps, bias patterns, and factual discrepancies. If a single violation is found, the campaign dies at the gate.',
    businessValue: 'Turns the black box of AI into a fully auditable glass room. Prevents catastrophic PR disasters and regulatory fines by guaranteeing that no unverified, legally dubious output ever reaches the public sphere.'
  },
  {
    id: 'PM-07', name: 'Mission Control', slug: 'pm07-mission-control',
    glyph: '📅', color: 'border-orange-500/40 bg-orange-500/5', textColor: 'text-orange-400',
    model: 'gemini-2.0-flash', latency: '420ms', layer: 'Operations',
    headline: 'Scheduling, Google Chat sync, and campaign dispatch coordination.',
    capabilities: ['Campaign scheduling', 'Google Chat sync', 'Deadline management', 'Cross-agent alignment'],
    output: 'Synchronized campaign calendar & alerts',
    deepLore: 'The temporal master of the swarm. PM-07 utilizes Pub/Sub message buses to align asynchronous tasks. It knows that DA-03 needs 6.8 seconds while CC-06 finishes in 3.2s, and purposefully staggers the workflow to minimize thermal cloud thrashing.',
    businessValue: 'Replaces the project manager entirely for high-velocity executions. Flawless tracking, automatic escalation, and seamless integration into existing corporate communication platforms like Google Chat.'
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

        {/* Cinematic Break 01 */}
        <CinematicBreak image={g5NeuralSwarm} title="The Power of Nine." subtitle="Distributed Swarm Intelligence" />

        {/* Quick Answer */}
        <div className="mb-32">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">01 — What is the AGENTICUM G5 Swarm?</p>
          <p className="text-xl sm:text-3xl text-zinc-300 font-light leading-snug max-w-5xl">
            AGENTICUM G5 GENIUS replaces mono-chatting with a highly specialized Neural Mesh. We run 9 parallel AI agents directly on Google Cloud Run and Vertex AI. When you issue a brief via voice, SN-00 doesn't wait — it orchestrates simultaneously: SP-01 attacks competitive gaps, CC-06 engineers psychometric copy, DA-03 renders 8k visuals, and RA-01 legally vets every syllable before it exists.
          </p>
        </div>

        {/* Agent Registry Grid */}
        <div className="mb-40">
          <div className="flex justify-between items-baseline border-b border-white/5 pb-4 mb-12">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">02 — Swarm Registry</p>
            <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">9 Entities Online</p>
          </div>
          
          <div className="flex flex-col gap-12">
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative border border-white/5 bg-[#060606] rounded-4xl p-8 md:p-12 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                
                {/* Header Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-12 border-b border-white/5 pb-12">
                   <div>
                     <div className="flex items-center gap-4 mb-6">
                       <span className={`text-4xl opacity-80 mix-blend-screen bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-600`}>{agent.glyph}</span>
                       <div className="flex flex-col">
                         <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mb-1">{agent.layer} Layer</span>
                         <h3 className="text-3xl font-medium text-white tracking-tight">{agent.id} – {agent.name}</h3>
                       </div>
                     </div>
                     <p className="text-zinc-300 text-lg font-light leading-relaxed max-w-2xl">{agent.headline}</p>
                   </div>
                   
                   <div className="flex flex-col gap-4 lg:items-end justify-center">
                      <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 px-4 py-3 rounded-xl w-fit">
                        <Cpu size={14} className="text-zinc-500" />
                        <div className="flex flex-col">
                          <span className="font-mono text-[8px] text-zinc-600 uppercase">Engine Model</span>
                          <span className="font-mono text-[10px] text-zinc-300">{agent.model}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 px-4 py-3 rounded-xl w-fit">
                        <Network size={14} className="text-zinc-500" />
                        <div className="flex flex-col">
                          <span className="font-mono text-[8px] text-zinc-600 uppercase">System Latency</span>
                          <span className="font-mono text-[10px] text-emerald-400">{agent.latency}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Deep Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                   <div>
                     <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowRight size={10} /> Architecture & Lore</p>
                     <p className="text-zinc-400 text-sm leading-relaxed font-light">{agent.deepLore}</p>
                   </div>
                   <div>
                     <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowRight size={10} /> Business Value</p>
                     <p className="text-zinc-400 text-sm leading-relaxed font-light">{agent.businessValue}</p>
                   </div>
                </div>

                {/* Tags & Footer */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map(cap => (
                      <span key={cap} className="font-mono text-[9px] text-zinc-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">{cap}</span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/os')} className="px-6 py-3 border border-zinc-800 hover:bg-white hover:text-black transition-colors rounded-full font-mono text-[9px] uppercase tracking-widest flex items-center gap-2">
                    Initialize {agent.id} <ArrowRight size={10} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cinematic Break 02 */}
        <CinematicBreak image={g5ComplianceSenate} title="Zero Veto Protocol." subtitle="Art.50 EU AI Act Compliance Enforced" />

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

        {/* Cinematic Break 03 */}
        <CinematicBreak image={g5TacticalRadar} title="Counter-Strike Ready." subtitle="SP-01 Market Intelligence Analytics" />

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
