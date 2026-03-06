import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Zap, Shield, Package, ArrowRight, CheckCircle } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuickAnswer } from '../components/QuickAnswer';

const STEPS = [
  {
    number: '01',
    title: 'Voice Command',
    subtitle: 'Gemini Live API · VE-01 · <800ms',
    icon: <Mic size={24} />,
    color: 'border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]',
    textColor: 'text-blue-400',
    description: 'Speak your brief naturally. The Gemini 2.0 Flash Live API processes bidirectional audio in real-time using PCM16 16kHz streaming. VE-01 detects intent in under 800ms.',
    technical: ['Gemini 2.0 Flash Live API', 'Bidi WebSocket audio stream', 'PCM16 16kHz encoding', 'Intent classification + tool call'],
    output: 'Tool call: launch_swarm({ intent, brand_context })',
    link: '/agents/ve01-voice-engagement',
  },
  {
    number: '02',
    title: 'Swarm Activation',
    subtitle: 'SN-00 · SwarmProtocol v3.0 · 38ms',
    icon: <Zap size={24} />,
    color: 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]',
    textColor: 'text-indigo-400',
    description: 'SN-00 receives the intent and immediately dispatches all 9 agents in parallel. Not sequentially — in parallel. This is what makes G5 60x faster than traditional AI tool stacks.',
    technical: ['SwarmProtocol v3.0 dispatch', 'Parallel thread spawning (9)', 'Context distribution', 'Firebase Realtime telemetry'],
    output: '9 agents running simultaneously with shared context',
    link: '/agents/sn00-orchestrator',
  },
  {
    number: '03',
    title: 'Intelligence Gathering',
    subtitle: 'SP-01 + BA-07 · Vector Search · Grounding',
    icon: <Zap size={24} />,
    color: 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.2)]',
    textColor: 'text-yellow-400',
    description: 'SP-01 (Strategic Cortex) and BA-07 (Browser Architect) simultaneously research competitors, market positioning, and real-time web data using Firestore Vector Search and Google Grounding.',
    technical: ['Firestore Vector Search (semantic)', 'Google Search Grounding', 'Live URL scraping via BA-07', 'Competitive gap analysis'],
    output: 'Intelligence brief: competitor profile, content gaps, positioning opportunities',
    link: '/agents/sp01-strategic-cortex',
  },
  {
    number: '04',
    title: 'Creative Generation',
    subtitle: 'CC-06 + DA-03 · Imagen 3 · 3–7s',
    icon: <Package size={24} />,
    color: 'border-purple-500 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.2)]',
    textColor: 'text-purple-400',
    description: 'CC-06 synthesizes multi-channel copy in the exact brand voice. DA-03 generates high-fidelity visuals with Imagen 3 (generate-002), embedding C2PA provenance metadata in every image.',
    technical: ['CC-06: platform-native copy (LinkedIn, Email, Blog)', 'DA-03: Imagen 3 generate-002', 'C2PA provenance embedding', '1024×1024px visual assets'],
    output: 'Copy variants + Imagen 3 visuals with C2PA metadata',
    link: '/modules/creative-studio',
  },
  {
    number: '05',
    title: 'Senate Gate',
    subtitle: 'RA-01 · EU AI Act Art.50 · <300ms',
    icon: <Shield size={24} />,
    color: 'border-red-500 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.2)]',
    textColor: 'text-red-400',
    description: 'All outputs pass through the RA-01 Security Senate before delivery. EU AI Act Art.50 compliance is enforced automatically. If content fails, it is vetoed and flagged for remediation.',
    technical: ['EU AI Act Art.50 enforcement', 'GDPR/PII scanning', 'Hallucination risk scoring', 'Brand safety verification'],
    output: 'Compliance certificate (score 0-100) or veto with remediation notes',
    link: '/agents/ra01-security-senate',
  },
  {
    number: '06',
    title: 'Campaign Delivery',
    subtitle: 'PM-07 + SO-00 · <60s Total',
    icon: <CheckCircle size={24} />,
    color: 'border-green-500 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.2)]',
    textColor: 'text-green-400',
    description: 'PM-07 assembles the final campaign package and triggers distribution. SO-00 writes the execution summary and stores everything in Project Memory for future reference and self-improvement.',
    technical: ['Campaign package assembly', 'Distribution channel routing', 'Google Chat notifications', 'Project Memory storage'],
    output: 'Complete campaign = strategy + copy + visuals + compliance cert + distribution brief',
    link: '/modules/campaign-manager',
  },
];

const FAQ = [
  { q: 'How long does a full G5 campaign take?', a: 'Under 60 seconds from voice command to complete deliverable. SN-00 initializes in 38ms, VE-01 processes voice in <800ms, and all agents run in parallel. The bottleneck is DA-03 (Imagen 3 at ~7 seconds), not the orchestration.' },
  { q: 'What makes the parallel swarm different from using multiple AI tools?', a: 'Traditional AI workflows run sequentially: you wait for tool A to finish before tool B starts. AGENTICUM G5 dispatches all 9 agents simultaneously via SwarmProtocol v3.0. The result of SP-01\'s research feeds CC-06\'s writing in the same execution window — not after a separate tool run.' },
  { q: 'What happens if an agent output fails the Senate check?', a: 'RA-01 issues a veto with a specific compliance score and remediation notes. The content is blocked from delivery. SN-00 can automatically route a retry to CC-06 or DA-03 with the compliance feedback as context.' },
  { q: 'Can I run workflows without voice?', a: 'Yes. The GenIUS Console accepts typed directives. Voice activation (VE-01) is optional. You can also build automated workflows in the Workflow Builder module that trigger the swarm on a schedule with no human input.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['HowTo', 'FAQPage'],
  name: 'How the AGENTICUM G5 Neural OS Works — 6-Step Process',
  description: 'Step-by-step explanation of how AGENTICUM G5 generates a full marketing campaign in under 60 seconds using 9 parallel AI agents.',
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function HowItWorksPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <MegaNav />

      <div className="pt-24 max-w-5xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <Breadcrumbs crumbs={[{ label: 'How It Works', path: '/how-it-works' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-xs text-blue-500 uppercase tracking-widest block mb-4">From Voice to Campaign · 6 Steps · Under 60 Seconds</span>
          <h1 className="text-6xl font-bold text-white tracking-tight mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
            How the Neural OS<br /><span className="text-blue-400">Works.</span>
          </h1>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl">
            One voice command. Nine parallel agents. A complete campaign — strategy, copy, visuals, and compliance certificate — delivered in under 60 seconds.
          </p>
        </motion.div>

        <QuickAnswer
          question="How does AGENTICUM G5 work?"
          answer="Speak a campaign brief to the Gemini Live API (VE-01 agent). SN-00 (Neural Orchestrator) dispatches all 9 agents simultaneously in 38ms via SwarmProtocol v3.0. SP-01 researches competitors, CC-06 writes copy, DA-03 generates images with Imagen 3, and RA-01 verifies EU AI Act compliance — all in parallel. The complete campaign is delivered in under 60 seconds."
        />

        {/* Steps */}
        <div className="space-y-6 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative border rounded-3xl p-8 ${step.color} transition-all duration-300`}
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-2 font-black font-mono text-5xl text-white/5 select-none">{step.number}</div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="shrink-0">
                  <div className={`w-14 h-14 rounded-2xl border-2 border-current flex items-center justify-center ${step.textColor}`}>
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className={`font-mono text-[10px] uppercase tracking-widest ${step.textColor} mb-1`}>{step.subtitle}</p>
                    <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                  </div>
                  <p className="text-zinc-300 leading-relaxed mb-6">{step.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest mb-3">Technical Implementation</p>
                      <ul className="space-y-1.5">
                        {step.technical.map(t => (
                          <li key={t} className="flex items-center gap-2 text-sm text-zinc-500">
                            <span className={`w-1 h-1 rounded-full ${step.textColor} bg-current shrink-0`} />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest mb-3">Output</p>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-zinc-400">
                        {step.output}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(step.link)}
                    className={`mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${step.textColor} hover:underline transition-colors`}
                  >
                    Learn more → {step.link}
                  </button>
                </div>
              </div>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center mt-6 -mb-12">
                  <div className="w-px h-8 bg-zinc-800" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-blue-500" />Frequently Asked Questions
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
          <h3 className="text-2xl font-bold text-white mb-4">See it live.</h3>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">The OS is deployed and live. Enter the portal and execute your first voice-activated campaign right now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/os')} className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Enter the OS <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate('/demo-workflow')} className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Watch 7-Step Demo
            </button>
            <button onClick={() => navigate('/agents')} className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Meet the Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
