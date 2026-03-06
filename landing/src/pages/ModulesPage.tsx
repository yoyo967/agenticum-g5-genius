import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

import g5NeuralSwarm from '../assets/g5_neural_swarm.png';
import g5HeroDashboard from '../assets/g5_hero_dashboard.png';
import g5ComplianceSenate from '../assets/g5_compliance_senate_en_v2_1772174738278.png';
import g5TacticalRadar from '../assets/g5_tactical_radar_strike_en_v2_1772174690101.png';
import g5CloudNativeStack from '../assets/g5_cloud_native_stack.png';
import g5CinematicForge from '../assets/g5_cinematic_forge.png';
import g5MissionControl from '../assets/g5_mission_control_health_en_v2_1772174704943.png';
import g5InfinityEvolution from '../assets/g5_infinity_evolution_cta_en_v2_1772174716260.png';
import g5VoiceAutonomy from '../assets/g5_voice_autonomy.png';

/* ============================================================
   MODULE DATA — ALL 15 (enriched with businessValue + integrates)
   ============================================================ */
const MODULES = [
  {
    slug: 'genius-console', name: 'GenIUS Console', glyph: '🖥',
    category: 'Core', osRoute: '/os/genius',
    agents: ['SN-00', 'VE-01', 'SO-00'],
    color: 'border-blue-500/40 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]',
    textColor: 'text-blue-400',
    headline: 'The command center. Voice (Gemini Live API) and text input summon the full swarm.',
    what: 'A unified terminal that accepts voice commands via VE-01 (Gemini Live API, PCM16 16kHz bidirectional streaming) and typed directives. Every campaign begins here. One command triggers all 9 agents simultaneously, with live telemetry streaming back to the console within 38ms of dispatch.',
    output: 'Structured JSON campaign brief dispatched to swarm — full telemetry visible in the console',
    businessValue: 'Eliminates the need to manage multiple disconnected SaaS tools. One interface. Total control.',
    integrates: ['Executive Dashboard', 'Swarm Analytics', 'Synergy Map'],
  },
  {
    slug: 'executive-dashboard', name: 'Executive Dashboard', glyph: '📊',
    category: 'Core', osRoute: '/os',
    agents: ['SN-00', 'PM-07'],
    color: 'border-zinc-700/40 hover:border-zinc-500', textColor: 'text-zinc-300',
    headline: 'Real-time KPIs, swarm telemetry, and system health — one high-density command interface.',
    what: 'Aggregates live data from all 15 modules into a single pane of glass. Shows the Resonance Index, Swarm Readiness (100%), active campaigns, recent outputs, and live WebSocket heartbeat from all agents. Designed for CMOs who need strategic overview without technical depth.',
    output: 'Live operational intelligence: KPIs, campaign count, veto rates, output volume vs human baselines',
    businessValue: 'Gives marketing leadership real-time visibility into AI operations without requiring technical interaction.',
    integrates: ['GenIUS Console', 'Swarm Analytics', 'Project Memory'],
  },
  {
    slug: 'nexus-engine', name: 'Nexus Engine V2', glyph: '🔬',
    category: 'Core', osRoute: '/os/nexus',
    agents: ['SN-00', 'SO-00'],
    color: 'border-indigo-500/40 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]', textColor: 'text-indigo-400',
    headline: 'Visual workflow DAG editor for building autonomous, multi-step agent task chains.',
    what: 'A ReactFlow-based Directed Acyclic Graph (DAG) editor where operators drag and connect agent nodes into deterministic processing pipelines. Define conditional logic gates, loops, parallel branches, and retry policies — all without writing code. Unlike the GenIUS Console (dynamic, AI-driven), the Nexus Engine creates strict, reproducible execution paths.',
    output: 'Saved workflow templates (JSON definitions) triggerable via UI or webhook',
    businessValue: 'Engineering teams can codify complex approval chains and reporting pipelines without backend development.',
    integrates: ['Workflow Builder', 'Swarm Analytics', 'Security Senate'],
  },
  {
    slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣',
    category: 'Core', osRoute: '/os/campaigns',
    agents: ['SP-01', 'CC-06', 'PM-07'],
    color: 'border-yellow-500/40 hover:border-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)]', textColor: 'text-yellow-400',
    headline: 'PMax and performance marketing orchestrator — from brief to multi-channel distribution.',
    what: 'Bridges AI generation and real-world market deployment. Takes raw assets from CC-06 and DA-03 and structures them into deployable campaign packages. Automatically generates UTM tracking parameters, formats ad variants for Google Performance Max, sizes creative for Meta, and sequences email drips for each segment.',
    output: 'Deployable multi-channel campaign packages — PMax asset groups, UTM URLs, email sequences, ad variants',
    businessValue: 'Compresses days of campaign packaging work into under 60 seconds of autonomous assembly.',
    integrates: ['Creative Studio', 'Asset Vault', 'Pillar Blog Engine'],
  },
  {
    slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍',
    category: 'Content', osRoute: '/os/blog',
    agents: ['CC-06', 'SP-01', 'RA-01'],
    color: 'border-emerald-500/40 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]', textColor: 'text-emerald-400',
    headline: 'Fully autonomous SEO content generation — keyword strategy to Senate-approved published article.',
    what: 'Built to dominate organic search. SP-01 first identifies keyword gaps using Firestore Vector Search and Google Grounding. CC-06 then generates 2,500+ word technical articles with Schema.org markup, internal linking, and JSON-LD structured data embedded. DA-03 produces cover imagery. RA-01 issues a compliance certificate before publishing directly to the Firebase-hosted /blog route.',
    output: 'Live URLs with SEO metadata, canonical tags, breadcrumbs, and Schema.org — published without human editing',
    businessValue: 'Generates an entire SEO content strategy — from keywords to published articles — on autopilot.',
    integrates: ['Columna Radar', 'Creative Studio', 'Security Senate'],
  },
  {
    slug: 'creative-studio', name: 'Creative Studio', glyph: '🎨',
    category: 'Content', osRoute: '/os/creative',
    agents: ['CC-06', 'DA-03'],
    color: 'border-purple-500/40 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]', textColor: 'text-purple-400',
    headline: 'Synchronized CC-06 copywriting + DA-03 Imagen 3 visual generation in one workspace.',
    what: 'The artistic heart of the OS. Instead of generating assets in isolation, Creative Studio pairs CC-06 (text) and DA-03 (visuals) in a synchronized canvas workspace. Change the headline copy and the image adapts to match the new sentiment automatically. Features real-time prompt weight adjustment, color palette enforcement, and C2PA provenance embedding in every output.',
    output: 'Senate-approved content packages: copy variants + Imagen 3 visuals + C2PA provenance certificates',
    businessValue: 'Eliminates the back-and-forth between copywriters and designers. One workspace, one intent, one deliverable.',
    integrates: ['Asset Vault', 'Campaign Manager', 'Security Senate'],
  },
  {
    slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬',
    category: 'Content', osRoute: '/os/creative',
    agents: ['VE-01', 'DA-03', 'CC-06'],
    color: 'border-pink-500/40 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)]', textColor: 'text-pink-400',
    headline: 'Video synthesis, storyboard creation, and motion branding — AI-driven cinematic pre-production.',
    what: 'Automates pre-production and conceptual video design. VE-01 provides voice narration scripts, CC-06 generates scene-by-scene screenplays with structured JSON narrative arcs, and DA-03 generates sequential keyframes with visual consistency enforcement. Produces complete storyboards for commercials, TikToks, Instagram Reels, or corporate videos in minutes — not weeks.',
    output: 'Interactive storyboard packages: scene scripts, keyframes with style consistency, camera directions, voiceover timing',
    businessValue: 'Pitching a video concept to a client now costs zero budget and takes less than 5 minutes of executive time.',
    integrates: ['Asset Vault', 'Campaign Manager', 'Creative Studio'],
  },
  {
    slug: 'asset-vault', name: 'Asset Vault', glyph: '🗃',
    category: 'Operations', osRoute: '/os/vault',
    agents: ['BA-07', 'DA-03'],
    color: 'border-orange-500/40 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)]', textColor: 'text-orange-400',
    headline: 'Enterprise-grade file management on Google Cloud Storage with AI-powered discovery ingestion.',
    what: 'The persistent storage layer for the OS. Built natively on Google Cloud Storage (europe-west1 Standard), it handles thousands of AI-generated images, PDFs, and data payloads securely. On upload, a webhook triggers Gemini Vision to automatically analyze and assign searchable metadata tags. BA-07 can actively discover and ingest competitor assets from the web for reference analysis.',
    output: 'Organized, tagged, versioned enterprise asset library — signed download URLs + direct OS module integration',
    businessValue: 'Every AI-generated asset is automatically catalogued and becomes instantly searchable by semantic description.',
    integrates: ['Creative Studio', 'Cinematic Forge', 'Columna Radar'],
  },
  {
    slug: 'workflow-builder', name: 'Workflow Builder', glyph: '⚙',
    category: 'Operations', osRoute: '/os/workflows',
    agents: ['SN-00', 'PM-07'],
    color: 'border-cyan-500/40 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]', textColor: 'text-cyan-400',
    headline: 'ReactFlow DAG editor for fully automated, condition-driven, scheduled agent pipelines.',
    what: 'Focused on operational execution, the Workflow Builder creates persistent, scheduled, condition-driven automation sequences that run indefinitely. Set a trigger ("Every Monday at 9AM"), define your agent sequence, configure retry logic and rate limiting, and deploy. When an agent fails, it retries with exponential backoff up to 3 times — then notifies PM-07 for human review.',
    output: 'Automated background execution with full logs in Swarm Analytics and PM-07 alerts on failure',
    businessValue: 'Turns the OS from a responsive tool into a 24/7 autonomous marketing department that never sleeps.',
    integrates: ['Nexus Engine V2', 'Swarm Analytics', 'Mission Manager'],
  },
  {
    slug: 'project-memory', name: 'Project Memory', glyph: '🧠',
    category: 'Intelligence', osRoute: '/os/memory',
    agents: ['SO-00', 'SN-00'],
    color: 'border-violet-500/40 hover:border-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]', textColor: 'text-violet-400',
    headline: 'Long-term semantic brand memory — the swarm\'s vector-indexed historical context store.',
    what: 'Large Language Models are stateless by nature — Project Memory corrects this fundamental limitation. Every campaign brief, approved output, user correction, and brand decision is vectorized using Vertex AI text-embedding-004 (768 dimensions) and stored in Firestore Native Vector Search. When SN-00 receives a new brief, SO-00 automatically retrieves semantically similar historical executions and injects them as context. When you say "do it like last time," the swarm knows exactly what you mean.',
    output: 'Background context windows injected into SN-00 orchestration — invisible to the user, transformative in output quality',
    businessValue: 'The swarm builds genuine brand understanding over time — eliminating the need to re-brief the AI on brand voice for every campaign.',
    integrates: ['GenIUS Console', 'Swarm Analytics', 'Executive Dashboard'],
  },
  {
    slug: 'swarm-analytics', name: 'Swarm Analytics', glyph: '📈',
    category: 'Intelligence', osRoute: '/os/analytics',
    agents: ['SN-00', 'PM-07'],
    color: 'border-green-500/40 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]', textColor: 'text-green-400',
    headline: 'Agent throughput, latency distribution, token cost, and real-time swarm health monitoring.',
    what: 'While the Executive Dashboard tracks marketing metrics, Swarm Analytics tracks machine metrics. Provides granular data on per-agent API latency distributions, token consumption per execution, GCP cost-per-campaign, and individual agent failure rates. Data is sourced from Google Cloud Logging and Trace, then surfaced as live Recharts dashboards. Set cost alerts via GCP Billing integration for hard-cap enforcement.',
    output: 'Technical dashboards, latency P50/P95 distributions, cost-per-execution breakdowns, and exportable performance reports',
    businessValue: 'Exposes exactly which agents consume the most resources, enabling targeted prompt optimization and infrastructure rightsizing.',
    integrates: ['Executive Dashboard', 'Workflow Builder', 'GenIUS Console'],
  },
  {
    slug: 'synergy-map', name: 'Synergy Map', glyph: '🗺',
    category: 'Intelligence', osRoute: '/os/synergy',
    agents: ['SN-00', 'SO-00'],
    color: 'border-teal-500/40 hover:border-teal-500 hover:shadow-[0_0_30px_rgba(20,184,166,0.12)]', textColor: 'text-teal-400',
    headline: 'Live WebGL visualization of inter-agent data flows, execution state, and swarm topology.',
    what: 'The most visually striking module in the OS. A real-time node graph rendered with custom WebGL/Canvas API, showing data packets physically moving between agents during execution. When SP-01 completes its competitor analysis, you see the payload transfer into CC-06\'s copywriting context — live, with exact timing and size. Each node is clickable, exposing the full payload diff for debugging. Nodes pulse for exactly as long as the agent is executing.',
    output: 'Interactive WebGL execution visualization — with payload inspection, timing data, and failure state visualization',
    businessValue: 'Makes the invisible neural process visible. Priceless for stakeholder demonstrations and complex failure diagnosis.',
    integrates: ['GenIUS Console', 'Swarm Analytics', 'Executive Dashboard'],
  },
  {
    slug: 'security-senate', name: 'Security Senate', glyph: '🔒',
    category: 'Governance', osRoute: '/os/senate',
    agents: ['RA-01'],
    color: 'border-red-500/40 hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)]', textColor: 'text-red-400',
    headline: 'RA-01 compliance tribunal — EU AI Act Art.50 enforcement with absolute, unbypassable veto power.',
    what: 'The most critical module for enterprise deployment. Powered exclusively by RA-01 operating at zero temperature, this module functions as a strict, unbypassable compliance gate. Every piece of text, code, or imagery generated by any other agent is halted here. The Senate scores each asset against: EU AI Act Art.50 (AI-generation transparency labeling), GDPR/PII scanning, hallucination risk thresholds, and brand safety parameters. Assets scoring below 80/100 receive a hard veto with a cryptographically-signed remediation log. Human operators cannot override a Senate veto — the audit trail must remain legally defensible.',
    output: 'Cryptographically signed compliance certificates (score 0-100) or detailed veto logs with remediation steps',
    businessValue: 'Enterprise-grade legal protection. Every published asset comes with a timestamped, AI-generated compliance certificate.',
    integrates: ['Perfect Twin', 'All Content Modules', 'Executive Dashboard'],
  },
  {
    slug: 'columna-radar', name: 'Columna Radar', glyph: '📡',
    category: 'Intelligence', osRoute: '/os/radar',
    agents: ['SP-01', 'BA-07'],
    color: 'border-amber-500/40 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]', textColor: 'text-amber-400',
    headline: 'Market pulse monitoring — competitive intelligence and content gap analysis in real-time.',
    what: 'The swarm\'s peripheral vision. Continuously monitors predefined targets — competitor websites, industry news feeds, SEC filings, Reddit threads — using BA-07 headless traversal. Applies semantic vector distance analysis to detect narrative shifts: a competitor changing from "AI Assistance" to "Autonomous AI" represents a significant semantic pivot and triggers an alert. When significant change is detected, PM-07 receives a notification and an automated counter-response brief is generated for human review.',
    output: 'Live dashboard feeds, strategic briefs with positioning recommendations, competitor movement alerts via PM-07',
    businessValue: 'Being first to publish on a competitor\'s announcement is the difference between narrative leadership and followership.',
    integrates: ['Pillar Blog Engine', 'Campaign Manager', 'Asset Vault'],
  },
  {
    slug: 'perfect-twin', name: 'Perfect Twin', glyph: '🪞',
    category: 'Governance', osRoute: '/os/twin',
    agents: ['RA-01', 'SO-00'],
    color: 'border-slate-500/40 hover:border-slate-500 hover:shadow-[0_0_30px_rgba(100,116,139,0.12)]', textColor: 'text-slate-400',
    headline: 'Blockchain-grade provenance and immutable forensic audit trail for every AI-generated asset.',
    what: 'In an era of deepfakes, regulatory scrutiny, and AI-attribution disputes, Perfect Twin provides total forensic transparency. Maintains an append-only Firestore record of every action the OS takes — every user prompt, every SO-00 context modification, every agent execution, and every RA-01 approval. For any given image or article, you can trace exactly: who briefed it, what was changed in translation, how long each agent took, and the exact timestamp of Senate certification. C2PA cryptographic signatures are embedded in every visual asset.',
    output: 'Tamper-evident audit logs (JSON), C2PA manifests, and a forensic timeline viewer for legal examination',
    businessValue: 'Verifiable, court-admissible proof of AI compliance. Essential for regulated industries (finance, healthcare, legal).',
    integrates: ['Security Senate', 'Asset Vault', 'Executive Dashboard'],
  },
];

/* ============================================================
   CATEGORY DEEP DIVE DATA — Rich descriptions per layer
   ============================================================ */
const CATEGORY_DETAILS = [
  {
    id: 'Core',
    label: 'Core Command Layer',
    number: '01',
    image: g5HeroDashboard,
    imageAlt: 'AGENTICUM G5 Executive Dashboard showing live swarm telemetry and campaign KPIs',
    accentClass: 'text-blue-400',
    accentBorder: 'border-blue-500/20',
    accentBg: 'bg-blue-500/5',
    tagline: '4 Modules · The Operational Backbone',
    description: 'The four Core modules form the operational backbone of AGENTICUM G5. These are the command surfaces through which human intelligence connects with the neural swarm. The GenIUS Console accepts your voice and translates it into executable intent within 38ms. The Executive Dashboard gives leadership the strategic glass they need for decisive action. The Nexus Engine lets engineers build deterministic, reproducible agent pipelines. And the Campaign Manager bridges the gap between AI output and real-world market deployment.\n\nWithout the Core layer, the other 11 modules have no command surface, no human entry point, and no delivery channel. Every campaign begins and ends in the Core.',
    highlights: [
      { label: 'Voice Interface', value: 'Gemini Live API · <800ms intent recognition' },
      { label: 'Dispatch Speed', value: 'SN-00 · 38ms swarm initialization' },
      { label: 'Campaign Time', value: 'Brief to full deliverable in under 60 seconds' },
      { label: 'DAG Workflows', value: 'ReactFlow visual pipeline editor — no code required' },
    ],
  },
  {
    id: 'Content',
    label: 'Creative Intelligence Layer',
    number: '02',
    image: g5CinematicForge,
    imageAlt: 'AGENTICUM G5 Cinematic Forge showing AI-generated storyboard frames and visual production',
    accentClass: 'text-purple-400',
    accentBorder: 'border-purple-500/20',
    accentBg: 'bg-purple-500/5',
    tagline: '4 Modules · Where Intelligence Becomes Expression',
    description: 'The four Content modules are where artificial intelligence transforms strategic data into human expression. This is the creative engine of the OS — four specialized modules that convert competitive intelligence, brand directives, and SEO research into production-ready marketing assets.\n\nThe Pillar Blog Engine builds organic search authority through autonomous 2,500+ word long-form content. The Creative Studio pairs CC-06 (copywriting) and DA-03 (visual generation) in a synchronized workspace where text and imagery evolve together. The Cinematic Forge compresses weeks of video pre-production into minutes, generating complete storyboards with narrative arcs and keyframes. The Asset Vault ensures every AI-generated file is stored, auto-tagged with Gemini Vision metadata, searchable, and version-controlled in enterprise-grade Google Cloud Storage.',
    highlights: [
      { label: 'Blog Articles', value: '2,500+ words · Schema.org embedded · Senate approved' },
      { label: 'Visual Generation', value: 'Imagen 3 generate-002 · 1024×1024px · C2PA signed' },
      { label: 'Video Storyboards', value: 'Scene scripts + keyframes + voiceover timing' },
      { label: 'Asset Storage', value: 'GCS Standard europe-west1 · AI auto-tagging on upload' },
    ],
  },
  {
    id: 'Intelligence',
    label: 'Neural Awareness Layer',
    number: '03',
    image: g5TacticalRadar,
    imageAlt: 'AGENTICUM G5 Columna Radar showing competitive intelligence and market surveillance data',
    accentClass: 'text-amber-400',
    accentBorder: 'border-amber-500/20',
    accentBg: 'bg-amber-500/5',
    tagline: '4 Modules · The Perceptual Organs of the Swarm',
    description: 'The four Intelligence modules give the OS its perceptual awareness — the ability to observe, remember, and continuously learn. These modules do not generate campaigns; they gather and analyze the data that makes campaigns worth generating.\n\nProject Memory establishes brand continuity over time, using Vertex AI text-embedding-004 (768-dimensional vectors) to maintain a semantic understanding of your brand\'s history. Swarm Analytics tracks the machine — exposing latency distributions, token costs, and agent failure rates for deep infrastructure optimization. The Synergy Map makes the invisible visible: a real-time WebGL graph of data flowing between agents during live execution. Columna Radar acts as the swarm\'s peripheral vision, using semantic vector distance anomaly detection to surface competitive movements the moment they happen.',
    highlights: [
      { label: 'Vector Memory', value: 'Vertex AI text-embedding-004 · 768 dimensions · Firestore VSS' },
      { label: 'Machine Metrics', value: 'Per-agent latency P50/P95 · token cost · failure rates' },
      { label: 'Execution Graph', value: 'Custom WebGL · live payload inspection · exact timing' },
      { label: 'Competitor Monitoring', value: 'Semantic vector distance anomaly detection · BA-07' },
    ],
  },
  {
    id: 'Operations',
    label: 'Autonomous Execution Layer',
    number: '04',
    image: g5CloudNativeStack,
    imageAlt: 'AGENTICUM G5 cloud-native stack showing Google Cloud Scheduler and workflow automation',
    accentClass: 'text-cyan-400',
    accentBorder: 'border-cyan-500/20',
    accentBg: 'bg-cyan-500/5',
    tagline: '2 Modules · 24/7 Autonomous Marketing Operations',
    description: 'The Operations layer handles the OS\'s ability to act without human presence. While all other modules respond to commands, the Workflow Builder and Asset Vault create persistent, scheduled automation sequences that run indefinitely — transforming the swarm from a responsive tool into a 24/7 autonomous marketing department.\n\nBuild a workflow once. Define the trigger. The swarm executes on schedule, handles failures with exponential backoff retry logic, routes outputs through Senate compliance automatically, and sends PM-07 notifications only when human attention is genuinely required. When a quarterly report needs generating, when a competitor launches a new product, when your content calendar needs filling — Operations executes without waiting for instruction.',
    highlights: [
      { label: 'Scheduling Engine', value: 'Google Cloud Scheduler · cron-precise execution' },
      { label: 'Durable Queuing', value: 'Cloud Tasks · guaranteed delivery · retry logic' },
      { label: 'Failure Handling', value: 'Exponential backoff · 3x retry · PM-07 escalation' },
      { label: 'Asset Pipeline', value: 'GCS storage · Gemini Vision auto-tagging · versioning' },
    ],
  },
  {
    id: 'Governance',
    label: 'Compliance Sovereignty Layer',
    number: '05',
    image: g5ComplianceSenate,
    imageAlt: 'AGENTICUM G5 Security Senate showing EU AI Act compliance verification and audit trail',
    accentClass: 'text-red-400',
    accentBorder: 'border-red-500/20',
    accentBg: 'bg-red-500/5',
    tagline: '2 Modules · Legal Defensibility by Design',
    description: 'In an era of AI deepfakes, regulatory scrutiny, and brand risk, governance is not optional — it is existential. The two Governance modules ensure that AGENTICUM G5 operates not just with speed and intelligence, but with absolute legal defensibility and cryptographically verifiable provenance.\n\nThe Security Senate (RA-01) enforces EU AI Act Art.50 compliance with zero exceptions and no human override capability. Every piece of content receives a compliance certificate before any distribution channel can access it. The Perfect Twin maintains an immutable forensic record of every action the OS takes — every prompt, every decision, every approval — creating a chain of custody that withstands the most rigorous legal audits. For regulated industries — finance, healthcare, legal services — the Governance layer is the difference between deployment and liability.',
    highlights: [
      { label: 'EU AI Act', value: 'Art.50 enforcement · automated disclosure labeling · zero bypass' },
      { label: 'GDPR Scanning', value: 'PII detection · consent verification · data provenance' },
      { label: 'Compliance Score', value: '0-100 cryptographically signed · veto threshold: 80/100' },
      { label: 'C2PA Standard', value: 'Cryptographic asset signing · chain-of-custody manifests' },
    ],
  },
];

/* ============================================================
   FAQ DATA — 10 Questions
   ============================================================ */
const FAQ = [
  {
    q: 'What is the AGENTICUM G5 Neural OS?',
    a: 'AGENTICUM G5 GENIUS is a cloud-based AI marketing operating system with 15 modules powered by 9 specialized AI agents. It runs on Google Cloud (europe-west1) using Gemini 2.0 Flash, Firestore Native Vector Search, Cloud Run, and Imagen 3 — with voice control via the Gemini Live API. The OS generates complete campaign packages — strategy, copy, visuals, and compliance certificates — in under 60 seconds from a single voice command.'
  },
  {
    q: 'What is the Apex / Pillar / Cluster architecture?',
    a: 'Apex/Pillar/Cluster is the three-tier architecture on which AGENTICUM G5 is built. The Apex is the OS itself — the supreme command layer from which all intelligence flows. The 15 OS Modules are the Pillars — each a complete, sovereign system covering a specific marketing domain with dedicated agents and output formats. The Clusters are the atomic deliverables: individual blog articles, Imagen 3 visuals, PMax campaign packages, compliance certificates. One Apex command can generate a Cluster of 40+ deliverables across multiple Pillars simultaneously.'
  },
  {
    q: 'How many modules does the OS have?',
    a: 'The OS has 15 mission-critical modules organized into five layers: Core (GenIUS Console, Executive Dashboard, Nexus Engine V2, Campaign Manager), Content (Pillar Blog Engine, Creative Studio, Cinematic Forge, Asset Vault), Intelligence (Project Memory, Swarm Analytics, Synergy Map, Columna Radar), Operations (Workflow Builder), and Governance (Security Senate, Perfect Twin).'
  },
  {
    q: 'Which modules use the Gemini Live API?',
    a: 'The GenIUS Console (via VE-01) is the primary Gemini Live API interface, processing voice commands in under 800ms using PCM16 16kHz bidirectional WebSocket audio streaming with barge-in support and native Function Calling (launch_swarm tool call). The Creative Studio also uses audio feedback for real-time creative direction. All Live API interactions are powered by gemini-2.0-flash-live-001.'
  },
  {
    q: 'Is EU AI Act compliance built-in or an add-on?',
    a: 'EU AI Act Art.50 compliance is built-in as a mandatory, unbypassable gate in every workflow. The Security Senate module (RA-01) evaluates every piece of generated content before it can be delivered to any distribution channel. This is not optional middleware — it is the constitutional layer of the OS. Human operators cannot override a Senate veto; they must produce compliant content to proceed.'
  },
  {
    q: 'What makes the Security Senate different from content moderation tools?',
    a: 'Standard content moderation tools use keyword filtering or image classification. The Security Senate uses Gemini 2.0 Flash at zero temperature for semantic legal analysis — it understands EU AI Act Article 50 requirements, assesses hallucination risk in context, verifies GDPR/PII compliance in the text, and checks brand safety against brand-specific parameters. It issues cryptographically signed certificates with scores from 0-100. Assets below 80 are vetoed with specific remediation guidance, not simply flagged.'
  },
  {
    q: 'How do the 15 modules interact with each other?',
    a: 'Modules share a common data fabric via Firestore real-time listeners and a WebSocket EventFabric layer. When DA-03 generates an image in the Creative Studio, it automatically flows into the Asset Vault. When Columna Radar detects a competitor movement, it auto-briefs the Campaign Manager. The Synergy Map visualizes all inter-module data flows in real time. SN-00 acts as the central message bus, routing context between all modules during execution.'
  },
  {
    q: 'Can the system run without any human input?',
    a: 'Yes. The Workflow Builder module enables fully autonomous, scheduled operation. You define the trigger (time-based, event-based, or webhook), connect the agent pipeline, and deploy. The system will execute indefinitely — researching competitors, generating content, passing Senate compliance checks, and routing outputs to the Asset Vault — without any human interaction. PM-07 will escalate to human operators only when a system failure exceeds the retry threshold.'
  },
  {
    q: 'What is Project Memory and why does it matter?',
    a: 'Project Memory solves the fundamental statelessness problem of large language models. Every campaign brief, approved output, user correction, and brand decision is vectorized (768 dimensions via Vertex AI text-embedding-004) and stored in Firestore Native Vector Search. Before each new campaign, SO-00 performs a semantic similarity search and injects the top relevant historical executions into the agent context window. This means the swarm builds genuine brand intelligence over time — understanding what worked, what was rejected, and what defines your unique brand voice.'
  },
  {
    q: 'What is the Perfect Twin and why does it matter legally?',
    a: 'Perfect Twin provides forensic, immutable accountability for every AI-generated asset. In regulated industries, "we used AI" is not a sufficient legal defense — you need to prove exactly what instruction produced the output, what was modified in translation, and when each compliance checkpoint was passed. Perfect Twin\'s append-only Firestore architecture and C2PA cryptographic signatures in every visual asset provide exactly this: a tamper-evident chain of custody that withstands regulatory audits in finance, healthcare, and legal services environments.'
  },
];

/* ============================================================
   SCHEMA JSON-LD
   ============================================================ */
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'FAQPage'],
  name: 'AGENTICUM G5 OS Modules — All 15 Mission-Critical Modules',
  description: 'Complete guide to all 15 modules of the AGENTICUM G5 Neural Marketing OS. From the GenIUS Console to the Security Senate — covering the Apex, Pillar, and Cluster architecture.',
  mainEntity: FAQ.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const CATEGORIES = ['All', 'Core', 'Content', 'Intelligence', 'Operations', 'Governance'];

/* ============================================================
   CINEMATIC IMAGE BREAK — Reusable component
   ============================================================ */
function CinematicBreak({ image, alt, label, title, sub }: {
  image: string; alt: string; label: string; title: string; sub: string;
}) {
  return (
    <div className="relative h-[45vh] min-h-[280px] overflow-hidden border-y border-white/5 my-32">
      <div className="absolute inset-0 bg-[#050505]/50 z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/40 to-transparent z-20" />
      <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-transparent z-20" />
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105"
      />
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-4">{label}</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-4">{title}</h2>
          <p className="text-zinc-400 font-light text-lg max-w-xl mx-auto">{sub}</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export function ModulesPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? MODULES : MODULES.filter(m => m.category === activeCategory);
  const heroImage = '/assets/palmer_system.png';

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <MegaNav />

      {/* ================================================================
          HERO HEADER
          ================================================================ */}
      <div className="w-full relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/80 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-luminosity scale-105" />

        <div className="relative z-30 max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-5xl">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-8">
              Neural Operating System <span className="text-zinc-700 mx-2">/</span> Apex · Pillar · Cluster Architecture
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">System Modules.</h1>
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
              Fifteen mission-critical modules. Five sovereign layers. Nine AI agents operating in parallel. Every module is live, deployed on Google Cloud, and accessible directly from your browser — no installation, no friction, no limits.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-24">

        {/* ================================================================
            STATS BAR
            ================================================================ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24">
          {[
            { v: '15', l: 'Live Modules', sub: 'Five sovereign layers' },
            { v: '9', l: 'AI Agents', sub: 'Parallel execution' },
            { v: '27', l: 'OS Routes', sub: 'Accessible via browser' },
            { v: 'EU', l: 'AI Act Compliant', sub: 'Art.50 built-in' },
            { v: '100%', l: 'GCP Native', sub: 'europe-west1' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 border border-white/5 bg-[#0A0A0A] rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <p className="text-3xl font-medium text-white mb-1">{s.v}</p>
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-1">{s.l}</p>
              <p className="text-zinc-600 text-[9px] font-mono">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* ================================================================
            01 — APEX / PILLAR / CLUSTER ARCHITECTURE
            ================================================================ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-32">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">01 — The Architecture</p>

          <div className="grid lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden mb-16">
            {[
              {
                tier: 'APEX',
                label: 'The System Itself',
                color: 'text-white',
                border: 'border-white/10',
                icon: '◈',
                description: 'The AGENTICUM G5 OS is the Apex entity — the supreme command layer from which all intelligence, all agents, and all marketing operations originate. The Apex is not a feature; it is the entire operating environment. When you initialize the OS, you activate the Apex: 9 agents on standby, 15 modules active, 27 routes ready for instantiation. Every campaign radiates downward from this singular intelligence layer.',
                detail: '9 agents · 15 modules · 27 routes',
              },
              {
                tier: 'PILLAR',
                label: 'The 15 Functional Modules',
                color: 'text-blue-400',
                border: 'border-blue-500/20',
                icon: '⬡',
                description: 'Each of the 15 OS modules is a Pillar — a complete, autonomous, production-grade system with its own specialized agents, data sources, and output formats. The Security Senate is a Pillar of governance intelligence. The Pillar Blog Engine is a Pillar of content authority. The Columna Radar is a Pillar of competitive awareness. Each Pillar operates with sovereign agency, delivering certification-grade outputs within its specific domain without requiring operator intervention.',
                detail: '5 layers · Core · Content · Intelligence · Operations · Governance',
              },
              {
                tier: 'CLUSTER',
                label: 'The Executed Deliverables',
                color: 'text-zinc-300',
                border: 'border-white/5',
                icon: '◇',
                description: 'Every Pillar activation generates Clusters — the atomic deliverables of the system. A Cluster can be a 2,500-word SEO article, a set of 12 Imagen 3 social visuals, a Google PMax campaign package, a compliance certificate, or a competitive intelligence brief. Clusters are the measurable output of neural intelligence. One voice command to the Apex GenIUS Console can simultaneously generate a Cluster of 40+ deliverables across multiple Pillars in under 60 seconds.',
                detail: 'Blog articles · Imagen 3 visuals · PMax packages · Compliance certs',
              },
            ].map((tier) => (
              <div key={tier.tier} className="bg-[#0A0A0A] p-10 sm:p-12 flex flex-col gap-6">
                <div>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.4em] mb-2 ${tier.color}`}>{tier.icon} {tier.tier}</p>
                  <h3 className="text-xl font-medium text-white tracking-tight">{tier.label}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light flex-1">{tier.description}</p>
                <p className={`font-mono text-[9px] uppercase tracking-widest border-t border-white/5 pt-6 ${tier.color}`}>{tier.detail}</p>
              </div>
            ))}
          </div>

          {/* Quick Answer */}
          <div className="max-w-4xl">
            <p className="text-2xl sm:text-3xl text-zinc-300 font-light leading-snug">
              The 15 modules cover the entire marketing lifecycle: from voice command execution (GenIUS Console) through competitive intelligence gathering (Columna Radar), creative generation (Creative Studio + Cinematic Forge), autonomous scheduling (Workflow Builder), and EU AI Act compliance verification (Security Senate) — all deployable at live.agenticum.com with no setup required.
            </p>
          </div>
        </motion.div>

      </div>

      {/* ================================================================
          CINEMATIC BREAK — Swarm Vision
          ================================================================ */}
      <CinematicBreak
        image={g5NeuralSwarm}
        alt="AGENTICUM G5 Neural Swarm showing 9 AI agents operating in parallel formation"
        label="Swarm Architecture · 9 Parallel Agents"
        title="The Neural Swarm."
        sub="Nine AI entities. One synchronized dispatch. Zero idle time between brief and deliverable."
      />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 pb-24">

        {/* ================================================================
            02 — CATEGORY FILTER + MODULE REGISTRY
            ================================================================ */}
        <div className="flex gap-4 mb-12 flex-wrap pb-6 border-b border-white/5">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest self-center mr-4">02 — Filter by Layer</p>
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
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Module Registry</p>
            <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">{filtered.length} Active</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((mod, i) => (
                <motion.div
                  key={mod.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  className={`group relative border border-white/5 bg-[#0A0A0A] hover:bg-[#0F0F0F] rounded-2xl p-8 cursor-pointer transition-all duration-500 overflow-hidden flex flex-col ${mod.color}`}
                  onClick={() => navigate(`/modules/${mod.slug}`)}
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-4xl opacity-50 mix-blend-screen">{mod.glyph}</span>
                    <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase border border-white/5 px-2 py-0.5 rounded-full">{mod.category}</span>
                  </div>

                  {/* Name + Headline */}
                  <h3 className="text-xl font-medium text-white mb-3 tracking-tight group-hover:text-zinc-300 transition-colors">{mod.name}</h3>
                  <p className={`text-sm font-light leading-relaxed mb-4 ${mod.textColor}`}>{mod.headline}</p>

                  {/* What description */}
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">{mod.what}</p>

                  {/* Output */}
                  <div className="bg-[#070707] border border-white/5 rounded-xl p-4 mb-6">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-2">Output</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">{mod.output}</p>
                  </div>

                  {/* Agents */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mod.agents.map(a => (
                      <span key={a} className="font-mono text-[9px] text-zinc-500 bg-[#111] border border-white/5 px-3 py-1 rounded-full">{a}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Full Specification</span>
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
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ================================================================
          CINEMATIC BREAK — Mission Control
          ================================================================ */}
      <CinematicBreak
        image={g5MissionControl}
        alt="AGENTICUM G5 Mission Control Health showing live system status and agent telemetry"
        label="Operational Intelligence · Real-Time"
        title="System in Orbit."
        sub="Every agent. Every module. Every campaign. Monitored in real time from a single command interface."
      />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 pb-24">

        {/* ================================================================
            03 — CATEGORY DEEP DIVES
            ================================================================ */}
        <div className="mb-40">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-16 border-b border-white/5 pb-4">03 — Layer Architecture Deep Dive</p>

          <div className="space-y-32">
            {CATEGORY_DETAILS.map((cat, catIdx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {/* Category Header */}
                <div className="grid lg:grid-cols-12 gap-16 mb-16">
                  <div className="lg:col-span-5">
                    <p className={`font-mono text-[10px] uppercase tracking-[0.4em] mb-4 ${cat.accentClass}`}>
                      Layer {cat.number} — {cat.id}
                    </p>
                    <h3 className="text-4xl sm:text-5xl font-medium tracking-tighter text-white mb-4">{cat.label}</h3>
                    <p className={`font-mono text-[10px] uppercase tracking-widest mb-8 ${cat.accentClass}`}>{cat.tagline}</p>

                    {/* Highlights */}
                    <div className={`border ${cat.accentBorder} ${cat.accentBg} rounded-2xl p-8 space-y-4`}>
                      {cat.highlights.map(h => (
                        <div key={h.label} className="flex flex-col gap-1">
                          <p className={`font-mono text-[9px] uppercase tracking-widest ${cat.accentClass}`}>{h.label}</p>
                          <p className="text-sm text-zinc-300 font-light">{h.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/5 mb-8 aspect-video">
                      <div className="absolute inset-0 bg-[#050505]/40 z-10" />
                      <div className="absolute inset-0 bg-linear-to-t from-[#050505]/80 to-transparent z-20" />
                      <img
                        src={cat.image}
                        alt={cat.imageAlt}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
                      />
                      <div className="absolute bottom-0 left-0 z-30 p-6">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{cat.imageAlt}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      {cat.description.split('\n\n').map((para, pi) => (
                        <p key={pi} className={pi === 0 ? 'text-lg text-zinc-300 font-light leading-relaxed' : 'text-zinc-400 font-light leading-relaxed'}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modules in this category */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MODULES.filter(m => m.category === cat.id).map((mod, mi) => (
                    <motion.div
                      key={mod.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: mi * 0.06 }}
                      onClick={() => navigate(`/modules/${mod.slug}`)}
                      className="group border border-white/5 bg-[#0A0A0A] hover:bg-[#0F0F0F] rounded-2xl p-6 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl opacity-60 mix-blend-screen">{mod.glyph}</span>
                        <h4 className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors">{mod.name}</h4>
                      </div>
                      <p className="text-zinc-500 text-xs leading-relaxed mb-4">{mod.headline}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                          {mod.agents.slice(0, 2).map(a => (
                            <span key={a} className="font-mono text-[8px] text-zinc-600 bg-[#111] border border-white/5 px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                        </div>
                        <ArrowRight size={12} className="text-zinc-700 group-hover:text-white transition-colors transform group-hover:translate-x-0.5 duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Divider between categories */}
                {catIdx < CATEGORY_DETAILS.length - 1 && (
                  <div className="h-px bg-white/5 w-full mt-32" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ================================================================
          CINEMATIC BREAK — Voice Autonomy
          ================================================================ */}
      <CinematicBreak
        image={g5VoiceAutonomy}
        alt="AGENTICUM G5 Voice Autonomy interface showing Gemini Live API bidirectional audio streaming"
        label="VE-01 · Gemini Live API · <800ms"
        title="Speak. Execute. Deliver."
        sub="One voice command activates the full 15-module operating system. No clicks. No dashboards. Just intelligence."
      />

      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 pb-24">

        {/* ================================================================
            04 — FAQ
            ================================================================ */}
        <div className="mb-40 max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-12 border-b border-white/5 pb-4">04 — Intelligence Matrix</p>
          <div className="space-y-6">
            {FAQ.map((faq, i) => (
              <div key={i} className="border-b border-white/5 pb-6" itemScope itemType="https://schema.org/Question">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group py-2"
                >
                  <span className="text-base sm:text-lg text-zinc-300 font-light group-hover:text-white transition-colors leading-snug" itemProp="name">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-zinc-500 font-mono text-xl shrink-0 group-hover:text-white">+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                      itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer"
                    >
                      <p className="text-zinc-400 font-light leading-relaxed text-sm pt-4 pb-2 max-w-3xl" itemProp="text">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================================================================
          CINEMATIC BREAK — Infinity Evolution (before CTA)
          ================================================================ */}
      <CinematicBreak
        image={g5InfinityEvolution}
        alt="AGENTICUM G5 Infinity Evolution showing the continuous AI-driven marketing evolution cycle"
        label="Continuous Intelligence · Self-Improving"
        title="The OS Evolves."
        sub="Every campaign makes the swarm smarter. Every output strengthens the brand memory. The system compounds."
      />

      {/* ================================================================
          CTA
          ================================================================ */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 pb-32">
        <div className="border border-white/5 bg-[#0A0A0A] rounded-4xl p-12 sm:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-6">Cloud Run + Firestore · europe-west1 · EU AI Act Compliant</p>
          <h3 className="text-4xl sm:text-6xl font-medium tracking-tighter text-white mb-6">Boot the OS.</h3>
          <p className="text-lg text-zinc-400 font-light max-w-xl mx-auto mb-12">
            No setup. No installation. No waiting. Execute the full 15-module operating system in your browser with complete, unrestricted access to the neural swarm.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => navigate('/os')} className="px-10 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
              Initialize Operating System <ArrowRight size={12} />
            </button>
            <button onClick={() => navigate('/agents')} className="px-10 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
              Meet the Swarm
            </button>
            <button onClick={() => navigate('/how-it-works')} className="px-10 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
              Architecture Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
