import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Server, Shield, Globe, Cpu, Database, Cloud, ExternalLink, Zap } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuickAnswer } from '../components/QuickAnswer';

const STACK = [
  {
    layer: 'Frontend', icon: <Cpu size={20} />, color: 'border-blue-500/40 bg-blue-500/5',
    textColor: 'text-blue-400',
    technologies: [
      { name: 'React 19', role: 'SPA Framework', note: 'With Suspense + concurrent features' },
      { name: 'Vite 7', role: 'Build Toolchain', note: 'ESM-native, sub-second HMR' },
      { name: 'Tailwind CSS v4', role: 'Styling', note: 'Atomic CSS without JS overhead' },
      { name: 'Framer Motion', role: 'Animation Engine', note: 'GPU-accelerated transitions' },
      { name: 'React Router v7', role: 'Client Routing', note: '27 registered routes' },
      { name: 'Firebase Hosting', role: 'CDN Delivery', note: 'Global edge, HTTPS, SPA rewrites' },
    ],
  },
  {
    layer: 'Backend', icon: <Server size={20} />, color: 'border-indigo-500/40 bg-indigo-500/5',
    textColor: 'text-indigo-400',
    technologies: [
      { name: 'Node.js / Express', role: 'API Server', note: 'Cloud Run — europe-west1' },
      { name: 'Google ADK (Python)', role: 'Agent Runtime', note: 'Agent Development Kit for swarm orchestration' },
      { name: 'WebSocket (ws)', role: 'Real-time Bus', note: 'SwarmBus — live telemetry to frontend' },
      { name: 'Cloud Run', role: 'Serverless Container', note: 'Auto-scaling, 0ms cold start (min-instances: 1)' },
      { name: 'Cloud Build', role: 'CI/CD', note: 'Automated Docker build + deploy pipeline' },
      { name: 'Secret Manager', role: 'Key Vault', note: 'All API keys stored encrypted at rest' },
    ],
  },
  {
    layer: 'AI / Gemini', icon: <Zap size={20} />, color: 'border-purple-500/40 bg-purple-500/5',
    textColor: 'text-purple-400',
    technologies: [
      { name: 'gemini-2.0-flash-001', role: 'Primary Agent Model', note: 'Powers 7 of 9 agents — 38ms dispatch' },
      { name: 'gemini-2.0-flash-live-001', role: 'Voice Interface (VE-01)', note: 'Bidi audio, tool calling, <800ms RTT' },
      { name: 'imagen-3.0-generate-002', role: 'Image Generation (DA-03)', note: 'C2PA provenance, 1024×1024px' },
      { name: 'text-embedding-004', role: 'Vector Embeddings', note: 'Semantic search via Firestore Vector' },
      { name: 'Vertex AI', role: 'ML Platform', note: 'Grounding + model serving backbone' },
      { name: 'Google Search Grounding', role: 'Live Web Intelligence', note: 'Real-time search augmentation for SP-01/BA-07' },
    ],
  },
  {
    layer: 'Data & Storage', icon: <Database size={20} />, color: 'border-emerald-500/40 bg-emerald-500/5',
    textColor: 'text-emerald-400',
    technologies: [
      { name: 'Cloud Firestore', role: 'Primary Database', note: 'Real-time synchronization + vector search index' },
      { name: 'Firestore Vector Search', role: 'Semantic Memory', note: 'Nearest-neighbor retrieval for agent context' },
      { name: 'Google Cloud Storage', role: 'Asset Vault', note: 'All DA-03 image outputs, versioned + tagged' },
      { name: 'Firestore Rules v2', role: 'Security Layer', note: 'Read-only public telemetry, write-protected' },
    ],
  },
  {
    layer: 'Infrastructure', icon: <Cloud size={20} />, color: 'border-cyan-500/40 bg-cyan-500/5',
    textColor: 'text-cyan-400',
    technologies: [
      { name: 'GCP Project: online-marketing-manager', role: 'Cloud Root', note: 'All services co-located in europe-west1' },
      { name: 'Artifact Registry', role: 'Container Registry', note: 'Docker images stored + versioned' },
      { name: 'IAM', role: 'Access Control', note: 'Least-privilege service accounts per resource' },
      { name: 'Cloud Logging', role: 'Observability', note: 'Structured JSON logs, agent-level tracing' },
      { name: 'Firebase Auth', role: 'Identity Layer', note: 'Google OAuth for admin OS access' },
    ],
  },
];

const GEMINI_LIVE = {
  title: 'Gemini Live API — The Heart of VE-01',
  features: [
    { k: 'Protocol', v: 'WebSocket Bidirectional (ws.BidiGenerateContent)' },
    { k: 'Audio Format', v: 'PCM16 · 16kHz input · 24kHz output' },
    { k: 'Tool Calling', v: 'Real-time tool calls during streaming (launch_swarm, get_status)' },
    { k: 'Barge-In', v: 'Supported — user can interrupt the AI mid-sentence' },
    { k: 'Latency', v: 'First chunk < 800ms · Full response < 2.4s' },
    { k: 'Session', v: 'Persistent multi-turn context across the entire OS session' },
  ],
};

const ARCH_FACTS = [
  { v: '38ms', l: 'Swarm Init Latency', sub: 'SN-00 → all 9 agents' },
  { v: '<800ms', l: 'Voice RTT', sub: 'Gemini Live API' },
  { v: '00018', l: 'Backend Revision', sub: 'Cloud Run europe-west1' },
  { v: '99.9%', l: 'Uptime SLA', sub: 'Cloud Run managed' },
];

const FAQ = [
  { q: 'What cloud region does AGENTICUM G5 run in?', a: 'All backend services run in europe-west1 (Belgium). This ensures EU data residency compliance, sub-50ms latency for European clients, and alignment with GDPR geographic requirements.' },
  { q: 'How does the Gemini Live API work in the OS?', a: 'The GenIUS Console opens a WebSocket connection to the Gemini 2.0 Flash Live API using bidirectional streaming. Audio is encoded as PCM16 at 16kHz and sent as base64 chunks. The model detects barge-in, calls tools like launch_swarm(), and returns audio responses below 800ms RTT.' },
  { q: 'How are API keys and credentials protected?', a: 'All API keys are stored in Google Cloud Secret Manager and accessed at runtime via IAM-scoped service accounts with least-privilege permissions. Keys never appear in code, environment files, or container images.' },
  { q: 'What is the SwarmBus?', a: 'SwarmBus is the internal WebSocket pub/sub fabric that broadcasts agent telemetry from the Cloud Run backend to the frontend in real-time. When SN-00 dispatches agents, status updates, thinking traces, and outputs flow immediately to the GenIUS Console UI.' },
  { q: 'How does the Imagen 3 integration work?', a: 'DA-03 calls the Vertex AI Imagen 3 API (imagen-3.0-generate-002) with prompts derived from CC-06\'s copy brief. Output images are stored in Cloud Storage, tagged with C2PA provenance metadata, and surfaced in the Creative Studio module.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['TechArticle', 'FAQPage'],
  headline: 'AGENTICUM G5 — GCP-Native Technology Stack',
  description: 'Deep technical breakdown of the AGENTICUM G5 GENIUS tech stack: Gemini 2.0 Flash, Gemini Live API, Imagen 3, Cloud Run, Firestore Vector Search, and the SwarmBus real-time telemetry fabric.',
  mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export function TechPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <MegaNav />

      <div className="pt-24 max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-10"><Breadcrumbs crumbs={[{ label: 'Tech Stack', path: '/tech' }]} /></div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">GCP-Native · europe-west1 · Zero External Dependencies</span>
          <h1 className="text-6xl font-bold text-white tracking-tight mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
            The Technology<br /><span className="text-blue-400">Behind the Swarm.</span>
          </h1>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl">
            Every component of AGENTICUM G5 runs on Google Cloud Platform. Gemini 2.0 Flash, Imagen 3, Firestore Vector Search, Cloud Run — nothing else.
          </p>
        </motion.div>

        <QuickAnswer
          question="What technology stack does AGENTICUM G5 use?"
          answer="AGENTICUM G5 is 100% GCP-native: React 19 frontend on Firebase Hosting, Node.js/Express backend on Cloud Run (europe-west1, revision 00018), Gemini 2.0 Flash for agent cognition, Gemini 2.0 Flash Live API for voice (VE-01, <800ms RTT), Imagen 3 for visuals (DA-03), Firestore for data with Vector Search, Google Cloud Storage for the Asset Vault, and Secret Manager for all credentials."
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-16">
          {ARCH_FACTS.map(s => (
            <div key={s.l} className="border border-zinc-900 bg-zinc-950 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold font-mono text-white mb-1">{s.v}</p>
              <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">{s.l}</p>
              <p className="text-zinc-600 text-[10px]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Stack layers */}
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-blue-500" />Full Stack Breakdown
        </h2>
        <div className="space-y-6 mb-16">
          {STACK.map((layer, i) => (
            <motion.div key={layer.layer} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={`border rounded-2xl p-8 ${layer.color}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl border border-current/30 flex items-center justify-center ${layer.textColor}`}>{layer.icon}</div>
                <h3 className={`text-xl font-bold ${layer.textColor}`}>{layer.layer}</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layer.technologies.map(tech => (
                  <div key={tech.name} className="bg-black/30 border border-white/5 rounded-xl p-4">
                    <p className="text-white font-semibold text-sm mb-1">{tech.name}</p>
                    <p className={`font-mono text-[9px] uppercase tracking-widest ${layer.textColor} mb-2`}>{tech.role}</p>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">{tech.note}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gemini Live Focus */}
        <div className="border border-purple-500/30 bg-purple-500/5 rounded-3xl p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400"><Zap size={20} /></div>
            <div>
              <p className="font-mono text-[10px] text-purple-400 uppercase tracking-widest mb-1">Hackathon Core · Gemini Live Agent Challenge 2026</p>
              <h3 className="text-xl font-bold text-white">{GEMINI_LIVE.title}</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GEMINI_LIVE.features.map(f => (
              <div key={f.k} className="bg-black/40 border border-white/5 rounded-xl p-4">
                <p className="font-mono text-[9px] text-purple-400 uppercase tracking-widest mb-1">{f.k}</p>
                <p className="text-zinc-300 text-sm">{f.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Link */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: <Globe size={18} />, title: 'Live Backend', url: 'https://genius-backend-697051612685.europe-west1.run.app/api/v1/health', desc: 'Cloud Run health endpoint — live' },
            { icon: <Server size={18} />, title: 'Firebase Hosting', url: 'https://online-marketing-manager.web.app', desc: 'Frontend CDN entry point' },
            { icon: <Shield size={18} />, title: 'Devpost Submission', url: 'https://devpost.com/software/agenticum-g5-modular-neural-orchestration-os', desc: 'Official hackathon submission' },
          ].map(link => (
            <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 border border-zinc-800 hover:border-zinc-600 bg-zinc-950 rounded-2xl transition-all">
              <div className="text-blue-400 mt-0.5">{link.icon}</div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1 group-hover:text-blue-300 transition-colors">{link.title}</p>
                <p className="text-zinc-500 text-xs">{link.desc}</p>
              </div>
              <ExternalLink size={12} className="text-zinc-700 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0" />
            </a>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-blue-500" />Technical FAQ
        </h2>
        <div className="space-y-3 mb-16">
          {FAQ.map((faq, i) => (
            <div key={i} className="border border-zinc-900 bg-zinc-950 rounded-2xl overflow-hidden"
              itemScope itemType="https://schema.org/Question">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="text-white font-medium" itemProp="name">{faq.q}</span>
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-zinc-600 font-mono text-xl shrink-0">+</motion.span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p className="text-zinc-400 leading-relaxed" itemProp="text">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-zinc-800 bg-zinc-950 rounded-3xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">See the code. Enter the system.</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/os')} className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Enter OS <ArrowRight size={14} />
            </button>
            <a href="https://github.com/yoyo967/agenticum-g5-genius" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              GitHub Source
            </a>
            <button onClick={() => navigate('/agents')} className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Meet the Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
