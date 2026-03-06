import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Zap, Shield, Package, ArrowRight, CheckCircle } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuickAnswer } from '../components/QuickAnswer';

import g5VoiceAutonomy from '../assets/g5_voice_autonomy.png';
import g5CinematicForge from '../assets/g5_cinematic_forge.png';
import g5MissionControl from '../assets/g5_mission_control_health_en_v2_1772174704943.png';

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

const STEPS = [
  {
    number: '01',
    title: 'Natural Voice Command',
    subtitle: 'Gemini Live API · VE-01 · <800ms',
    icon: <Mic size={24} />,
    color: 'text-blue-400', bgGlow: 'bg-blue-500',
    description: 'Speak your brief naturally. The Gemini 2.0 Flash Live API processes bidirectional audio in real-time using PCM16 16kHz streaming. VE-01 detects intent in under 800ms and executes precise tool calls to the swarm registry.',
    technical: ['Gemini 2.0 Flash Live API', 'Bidi WebSocket audio stream', 'PCM16 16kHz encoding', 'Intent classification + tool call'],
    output: 'Tool call: launch_swarm({ intent, brand_context })',
    deepLore: 'The true power of VE-01 lies in its Barge-in capability. You don’t have to wait for the system to finish speaking. If the agent misinterprets a strategic nuisance, you simply interrupt. The system instantly aborts the audio output, recomputes the context via Grounding, and adapts the execution array mid-sentence.',
    businessValue: 'Eliminates the friction of complex SaaS dashboards. Strategy becomes a conversation rather than a configuration exercise, empowering executives to deploy tactical campaigns while driving or walking.',
    link: '/agents/ve01-voice-engagement',
  },
  {
    number: '02',
    title: 'Parallel Swarm Activation',
    subtitle: 'SN-00 · SwarmProtocol v3.0 · 38ms',
    icon: <Zap size={24} />,
    color: 'text-indigo-400', bgGlow: 'bg-indigo-500',
    description: 'SN-00 receives the structured intent and immediately dispatches all 9 specialized agents simultaneously. Not sequentially — in absolute parallel. This operational topology is what enables G5 to be 60x faster than traditional AI tool stacks.',
    technical: ['SwarmProtocol v3.0 dispatch', 'Parallel thread spawning (9)', 'Context graph distribution', 'Firebase Realtime telemetry stream'],
    output: '9 agents running simultaneously with shared context memory',
    deepLore: 'SN-00 operates as the "Neural Orchestrator", calculating the Synaptic Load of the entire swarm. By utilizing Serverless Cloud Run containers (min-instances: 1 to prevent cold starts), the system guarantees immediate compute availability for the complex deep-reasoning chains of the sub-agents.',
    businessValue: 'Replaces the sequential bottlenecks of human departments. By operating 9 specialized agents concurrently, a process that normally takes a creative agency two weeks is collapsed into a single 60-second operational window.',
    link: '/agents/sn00-orchestrator',
  },
  {
    number: '03',
    title: 'Grounding & Intelligence Gathering',
    subtitle: 'SP-01 + BA-07 · Vector Search · Grounding',
    icon: <Zap size={24} />,
    color: 'text-yellow-400', bgGlow: 'bg-yellow-500',
    description: 'While other agents spin up, SP-01 (Strategic Cortex) and BA-07 (Browser Architect) simultaneously research competitors, market positioning, and real-time web data using Firestore Vector Search and Google Grounding.',
    technical: ['Firestore Vector Search (semantic)', 'Google Search Grounding', 'Live URL scraping via BA-07 headless instances', 'Zero-Day Competitive gap analysis'],
    output: 'Intelligence brief: competitor profile, content gaps, positioning intent',
    deepLore: 'SP-01 does not rely on outdated training data. Through its connection to the Columna Radar, it actively scans the live web for "Counter-Strike" opportunities—identifying immediate competitor weaknesses and feeding that data as the foundational premise for the creative generation.',
    businessValue: 'Guarantees that every campaign is rooted in actual, up-to-the-minute market reality rather than assumed generic best practices. Generates an immediate asymmetric competitive advantage in digital positioning.',
    link: '/agents/sp01-strategic-cortex',
  },
  {
    number: '04',
    title: 'Multimodal Creative Generation',
    subtitle: 'CC-06 + DA-03 · Imagen 3 · 3–7s',
    icon: <Package size={24} />,
    color: 'text-purple-400', bgGlow: 'bg-purple-500',
    description: 'Armed with the SP-01 intelligence brief, CC-06 synthesizes multi-channel copy in the exact brand voice. Simultaneously, DA-03 generates bespoke, high-fidelity visuals using Imagen 3 (generate-002), seamlessly embedding C2PA provenance metadata into every digital asset.',
    technical: ['CC-06: platform-native semantic copy (LinkedIn, Email, Blog)', 'DA-03: Imagen 3 generate-002', 'C2PA cryptographic provenance embedding', '1024×1024px Cinematic Visual assets'],
    output: 'Synchronized copy variants + Imagen 3 visual matrix with C2PA metadata',
    deepLore: 'The Cinematic Forge protocol binds the outputs of CC-06 and DA-03 into a cohesive narrative structure. If the copy is aggressive and tactical, DA-03 automatically shifts the visual aesthetic parameters—color grading, composition, lighting—to match the psychological intent of the text.',
    businessValue: 'Total elimination of the revision cycle. Marketing leadership receives perfect, contextually aligned copy and bespoke enterprise-grade imagery instantly, massively accelerating content velocity.',
    link: '/modules/creative-studio',
  },
  {
    number: '05',
    title: 'The Senate Gate Compliance',
    subtitle: 'RA-01 · EU AI Act Art.50 · <300ms',
    icon: <Shield size={24} />,
    color: 'text-red-400', bgGlow: 'bg-red-500',
    description: 'All generated outputs must pass through the RA-01 Security Senate before delivery. EU AI Act Art.50 compliance is enforced automatically. If any piece of content fails the Zero Veto Protocol, it is blocked, flagged for remediation, and recycled.',
    technical: ['EU AI Act Art.50 automated enforcement', 'GDPR/PII cross-border scanning', 'Hallucination risk scoring algorithms', 'Brand safety & exclusion keyword verification'],
    output: 'Cryptographic compliance certificate (score 0-100) or explicit Veto Log',
    deepLore: 'RA-01 operates entirely independently from the creative agents. Its sole mandate is risk mitigation. It utilizes deep reasoning chains to hunt for copyright overlaps or factual discrepancies. Only assets that achieve "Twin Sealed" status are permitted to leave the architecture.',
    businessValue: 'Transforms AI from a latent legal risk into a highly secure, heavily guarded asset. General Counsels and Legal teams gain a verifiable, court-admissible audit trail for every single piece of AI-generated public communication.',
    link: '/agents/ra01-security-senate',
  },
  {
    number: '06',
    title: 'Autonomous Campaign Delivery',
    subtitle: 'PM-07 + SO-00 · <60s Total',
    icon: <CheckCircle size={24} />,
    color: 'text-green-400', bgGlow: 'bg-green-500',
    description: 'PM-07 assembles the final, Senate-approved campaign package and triggers automated distribution. SO-00 writes the execution summary into Firestore, permanently archiving the strategic reasoning into Project Memory for future Swarm self-improvement.',
    technical: ['Campaign package DAG assembly', 'Distribution channel API routing', 'Google Chat execution notifications', 'Firestore Project Memory continuous storage'],
    output: 'Fully executed campaign = strategy + copy + visuals + compliance cert + distribution record',
    deepLore: 'The execution is not the end; it is the beginning of the learning cycle. SO-00 analyzes the complete operational trace of the campaign. Any friction points, Senate vetoes, or inefficiencies are logged into the Synergy Map, ensuring the next campaign runs with even greater precision.',
    businessValue: 'Marketing becomes a continuously compounding asset. The Swarm learns from every single execution, perpetually optimizing its own operational efficiency and strategic accuracy without requiring human retraining.',
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
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <MegaNav />

      <div className="pt-24 w-full">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32">
          <div className="mb-10">
            <Breadcrumbs crumbs={[{ label: 'How It Works', path: '/how-it-works' }]} />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-12 max-w-4xl">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-8">From Voice to Campaign <span className="text-zinc-700 mx-2">/</span> 6 Steps <span className="text-zinc-700 mx-2">/</span> Under 60 Seconds</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">How the Neural OS Works.</h1>
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
              One voice command. Nine parallel agents. A complete campaign — strategy, copy, visuals, and compliance certificate — delivered in under 60 seconds.
            </p>
          </motion.div>

          <div className="max-w-4xl border border-white/5 bg-[#0A0A0A] rounded-2xl p-8 mb-24">
            <QuickAnswer
              question="How does AGENTICUM G5 work?"
              answer="Speak a campaign brief to the Gemini Live API (VE-01 agent). SN-00 (Neural Orchestrator) dispatches all 9 agents simultaneously in 38ms via SwarmProtocol v3.0. SP-01 researches competitors, CC-06 writes copy, DA-03 generates images with Imagen 3, and RA-01 verifies EU AI Act compliance — all in parallel. The complete campaign is delivered in under 60 seconds."
            />
          </div>
        </div>

        {/* Steps */}
        <div className="w-full">
          {STEPS.map((step, i) => (
            <div key={step.number}>
              <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col lg:flex-row gap-12 lg:gap-24"
                >
                  {/* Step Context - Left Column */}
                  <div className="lg:w-1/3 shrink-0">
                    <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${step.color} mb-4 flex items-center gap-3`}>
                      Step {step.number}
                      <span className={`w-12 h-px ${step.bgGlow} opacity-30 block`} />
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white mb-6">
                      {step.title}
                    </h2>
                    <p className="text-zinc-400 font-light leading-relaxed mb-8">
                      {step.description}
                    </p>
                    <button
                      onClick={() => navigate(step.link)}
                      className="px-6 py-3 border border-zinc-800 hover:bg-white hover:text-black transition-colors rounded-full font-mono text-[9px] uppercase tracking-widest inline-flex items-center gap-2"
                    >
                      Explore Sub-System <ArrowRight size={10} />
                    </button>
                  </div>

                  {/* Deep Execution Details - Right Column */}
                  <div className="lg:w-2/3 border border-white/5 bg-[#060606] rounded-4xl p-8 sm:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="flex flex-col sm:flex-row gap-8 mb-12 border-b border-white/5 pb-12">
                      <div className="flex-1">
                        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-4">Core Technology</p>
                        <ul className="space-y-3">
                          {step.technical.map(t => (
                            <li key={t} className="flex items-start gap-3 text-sm text-zinc-300 font-light">
                              <span className={`w-1.5 h-1.5 rounded-full ${step.bgGlow} shrink-0 mt-1.5 opacity-60`} />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-4">Execution Output</p>
                        <div className="p-4 bg-[#0A0A0A] border border-white/5 rounded-xl font-mono text-[10px] text-zinc-500 leading-relaxed shadow-inner">
                          {step.output}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-12">
                      <div>
                        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-4">Architecture & Lore</p>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">{step.deepLore}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-4">Business Value</p>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">{step.businessValue}</p>
                      </div>
                    </div>
                    
                    {/* Background Icon */}
                    <div className={`absolute -bottom-8 -right-8 opacity-[0.03] text-9xl ${step.color}`}>
                      {step.icon}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Intersperse Cinematic Breaks */}
              {i === 1 && (
                <CinematicBreak image={g5VoiceAutonomy} title="Voice as the Compiler." subtitle="Multimodal Interaction Paradigm" />
              )}
              {i === 3 && (
                <CinematicBreak image={g5CinematicForge} title="High-Fidelity Generation." subtitle="Imagen 3 & C2PA Provenance" />
              )}
              {i === 5 && (
                <CinematicBreak image={g5MissionControl} title="Continuous Self-Improvement." subtitle="Project Memory Execution Trace" />
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto px-6 mb-32">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-12 border-b border-white/5 pb-4 text-center">Frequently Asked Questions</p>
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
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-6" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    <p className="text-zinc-400 font-light leading-relaxed text-sm" itemProp="text">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 mb-32">
          <div className="border border-white/5 bg-[#0A0A0A] rounded-4xl p-12 sm:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-6">See it live.</p>
            <h3 className="text-4xl sm:text-5xl font-medium tracking-tighter text-white mb-6">Enter the Neural OS.</h3>
            <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto mb-12">The system is deployed and fully operational. Execute your first voice-activated campaign right now.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button onClick={() => navigate('/os')} className="px-10 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                Initialize OS <ArrowRight size={12} />
              </button>
              <button onClick={() => navigate('/agents')} className="px-10 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
                Meet the Agents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
