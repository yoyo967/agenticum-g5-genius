import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

/* ============================================================
   FULL MODULE REGISTRY — All 15 modules with deep content
   ============================================================ */
const MODULES: Record<string, {
  slug: string; name: string; glyph: string; category: string; osRoute: string;
  textColor: string; borderColor: string; bgColor: string;
  headline: string; description: string;
  architecture: { component: string; detail: string }[];
  primaryUseCases: string[];
  outputFormat: string;
  relatedAgents: { id: string; name: string; latency: string }[];
  faq: { q: string; a: string }[];
  externalLinks: { label: string; href: string }[];
}> = {
  'genius-console': {
    slug: 'genius-console', name: 'GenIUS Console', glyph: '🖥', category: 'Core', osRoute: '/os/genius',
    textColor: 'text-blue-400', borderColor: 'border-blue-500', bgColor: 'bg-blue-500/5',
    headline: 'The primary command center. Accepts voice (Gemini Live API) and text input to summon the full swarm.',
    description: 'The GenIUS Console is the primary interaction layer between the human operator and the AGENTICUM G5 neural swarm. It features a high-density terminal interface that processes both typed directives and real-time voice commands via the Gemini Live API. From this single interface, a user can brief a campaign, monitor parallel agent execution, handle Senate vetos, and finalize deliverables.',
    architecture: [
      { component: 'Voice Input', detail: 'Gemini 2.0 Flash Live API (Bidi WSS)' },
      { component: 'Orchestration', detail: 'SwarmProtocol v3.0 via SN-00' },
      { component: 'Telemetry UI', detail: 'React 19 + Framer Motion live graphs' },
      { component: 'Backend connection', detail: 'Server-Sent Events (SSE) for agent status' },
    ],
    primaryUseCases: [
      'Initiating multi-channel campaigns via single voice command',
      'Real-time monitoring of agent execution latency',
      'Interactive refinement of DA-03 generated visuals',
      'Reviewing and approving RA-01 compliance certificates',
    ],
    outputFormat: 'Dispatches structured JSON payloads to the Cloud Run backend for swarm instantiation.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'VE-01', name: 'Voice Engagement', latency: '<800ms' },
      { id: 'SO-00', name: 'Sovereign Core', latency: '580ms' },
    ],
    faq: [
      { q: 'Can I use the console without a microphone?', a: 'Yes. The GenIUS Console accepts standard typed input. However, the true power of the module is unlocked when using the Gemini Live API for low-latency, conversational briefing with barge-in support.' },
      { q: 'How many campaigns can I run from the console simultaneously?', a: 'While the UI focuses on the active thread, the backend (SN-00) supports parallel campaign execution. You can launch a campaign, minimize the execution trace, and start another one immediately.' },
    ],
    externalLinks: [
      { label: 'Gemini Live API Specs', href: 'https://ai.google.dev/api/live' },
    ]
  },

  'executive-dashboard': {
    slug: 'executive-dashboard', name: 'Executive Dashboard', glyph: '📊', category: 'Core', osRoute: '/os',
    textColor: 'text-zinc-300', borderColor: 'border-zinc-700', bgColor: 'bg-zinc-800/10',
    headline: 'Real-time KPIs, swarm telemetry, and system health — all in one high-density command interface.',
    description: 'The Executive Dashboard aggregates data from all 15 modules into a single pane of glass. It displays the overall Resonance Index, Swarm Readiness metrics, active campaign statuses, and recent asset generation events. Designed for CMOs and marketing directors, it provides top-down visibility into AI operations without requiring deep technical interaction.',
    architecture: [
      { component: 'Live Data Sync', detail: 'Firestore Snapshot Listeners' },
      { component: 'Metrics Engine', detail: 'Aggregating PM-07 and SN-00 logs' },
      { component: 'Visualization', detail: 'Recharts + custom WebGL rendering' },
    ],
    primaryUseCases: [
      'Daily operational overview for marketing leadership',
      'Monitoring compliance veto rates across the organization',
      'Tracking ROI and output volume vs human baselines',
      'Identifying bottlenecks in creative production',
    ],
    outputFormat: 'Visual data dashboards, exportable as PDF/CSV reports.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'PM-07', name: 'Mission Control', latency: '420ms' },
    ],
    faq: [
      { q: 'Are the metrics on the dashboard real-time?', a: 'Yes. The dashboard connects directly to Firestore using live snapshot listeners. When an agent generates an asset or RA-01 issues a veto, the dashboard updates instantly without refreshing.' },
    ],
    externalLinks: [
      { label: 'Firestore Realtime Updates', href: 'https://cloud.google.com/firestore/docs/query-data/listen' },
    ]
  },

  'nexus-engine': {
    slug: 'nexus-engine', name: 'Nexus Engine V2', glyph: '🔬', category: 'Core', osRoute: '/os/nexus',
    textColor: 'text-indigo-400', borderColor: 'border-indigo-500', bgColor: 'bg-indigo-500/5',
    headline: 'Visual workflow DAG editor for building autonomous, multi-step agent task chains.',
    description: 'The Nexus Engine V2 is the architectural sandbox of the OS. Utilizing a ReactFlow-based Directed Acyclic Graph (DAG) interface, operators can drag and drop agents, define conditional logic gates, and build custom automation sequences. Unlike the GenIUS Console which relies on SN-00 for dynamic orchestration, the Nexus Engine allows for strict, deterministic pipeline creation.',
    architecture: [
      { component: 'UI Framework', detail: 'ReactFlow node-based editor' },
      { component: 'Execution Engine', detail: 'Custom DAG runner on Cloud Run' },
      { component: 'State Management', detail: 'Firestore atomic transactions' },
    ],
    primaryUseCases: [
      'Building custom daily reporting pipelines',
      'Creating strict approval chains requiring human-in-the-loop',
      'Designing complex conditional logic (e.g., if sentiment < 0.5 then...)',
    ],
    outputFormat: 'Saved workflow templates (JSON definitions) that can be triggered via UI or webhook.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'SO-00', name: 'Sovereign Core', latency: '580ms' },
    ],
    faq: [
      { q: 'Do I need to know how to code to use the Nexus Engine?', a: 'No. The Nexus Engine is a visual, drag-and-drop tool. You connect input nodes to agent nodes, set parameters via UI panels, and deploy the workflow instantly.' },
    ],
    externalLinks: [
      { label: 'React Flow', href: 'https://reactflow.dev/' },
    ]
  },

  'campaign-manager': {
    slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣', category: 'Core', osRoute: '/os/campaigns',
    textColor: 'text-yellow-400', borderColor: 'border-yellow-500', bgColor: 'bg-yellow-500/5',
    headline: 'PMax and performance marketing orchestrator — from brief to multi-channel distribution.',
    description: 'The Campaign Manager is the bridge between AI generation and actual market deployment. It takes the raw assets produced by CC-06 and DA-03 and structures them into deployable campaign packages. It automatically generates UTM tracking parameters, formats ad variants for Google Performance Max, sizes creative assets for Meta, and sequences email drips.',
    architecture: [
      { component: 'Asset Bundling', detail: 'Automated zip/package generation' },
      { component: 'Metadata Gen', detail: 'Contextual UTM and conversion tracking tags' },
      { component: 'Channel Formatting', detail: 'Platform-specific constraint checking' },
    ],
    primaryUseCases: [
      'Creating massive multi-variant A/B testing packages',
      'Structuring Performance Max (PMax) asset groups automatically',
      'Managing holistic campaign budgets and timelines',
    ],
    outputFormat: 'Deployable campaign packages configured for immediate ad network upload.',
    relatedAgents: [
      { id: 'SP-01', name: 'Strategic Cortex', latency: '1.2s' },
      { id: 'CC-06', name: 'Cognitive Core', latency: '3.2s' },
      { id: 'PM-07', name: 'Mission Control', latency: '420ms' },
    ],
    faq: [
      { q: 'Does it push directly to Google Ads / Meta?', a: 'In the current version, it generates structured deployment packages (CSV/ZIP) ready for bulk upload. Native API integration for direct pushing is part of the Q3 2026 roadmap.' },
    ],
    externalLinks: [
      { label: 'Google Ads PMax Specs', href: 'https://support.google.com/google-ads/answer/10724817' },
    ]
  },

  'pillar-blog-engine': {
    slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍', category: 'Content', osRoute: '/os/blog',
    textColor: 'text-emerald-400', borderColor: 'border-emerald-500', bgColor: 'bg-emerald-500/5',
    headline: 'Fully autonomous SEO content generation — from keyword strategy to Senate-approved published article.',
    description: 'Designed specifically to dominate organic search, the Pillar Blog Engine automates the creation of high-value, long-form content. Using the Apex-Pillar-Cluster architecture, SP-01 first identifies keyword gaps. CC-06 then drafts 2500+ word technical articles, DA-03 generates cover imagery, and RA-01 ensures compliance. The result is published directly to the site\'s Firebase-hosted `/blog` route, complete with JSON-LD Schema.org markup.',
    architecture: [
      { component: 'Strategy', detail: 'Google Search API Grounding' },
      { component: 'Generation', detail: 'Gemini 2.0 Flash (Long-context window)' },
      { component: 'Publishing', detail: 'Direct commit to Firestore / React Router' },
    ],
    primaryUseCases: [
      'Rapidly deploying authoritative Pillar pages on broad topics',
      'Generating dozens of targeted Cluster articles per week',
      'Automating internal linking structures for AEO/SEO lift',
    ],
    outputFormat: 'Live URLs on your domain with embedded SEO metadata, canonicals, and Schema.org.',
    relatedAgents: [
      { id: 'CC-06', name: 'Cognitive Core', latency: '3.2s' },
      { id: 'SP-01', name: 'Strategic Cortex', latency: '1.2s' },
      { id: 'RA-01', name: 'Security Senate', latency: '280ms' },
    ],
    faq: [
      { q: 'Will AI-generated content rank on Google?', a: 'Yes. Google\'s guidelines focus on content quality, not the method of creation. Because SP-01 grounds research in live market data, and RA-01 checks for hallucinations, the resulting content is highly authoritative and provides genuine value to readers.' },
    ],
    externalLinks: [
      { label: 'Google Search Guidelines on AI', href: 'https://developers.google.com/search/blog/2023/02/google-search-and-ai-content' },
    ]
  },

  'creative-studio': {
    slug: 'creative-studio', name: 'Creative Studio', glyph: '🎨', category: 'Content', osRoute: '/os/creative',
    textColor: 'text-purple-400', borderColor: 'border-purple-500', bgColor: 'bg-purple-500/5',
    headline: 'Interactive workspace combining CC-06 copywriting with DA-03 Imagen 3 visual generation.',
    description: 'The Creative Studio is the artistic heart of the OS. Instead of generating assets in isolation, this module pairs CC-06 (text) and DA-03 (visuals) in a synchronized workspace. If you change the headline for an ad, the layout and background image adapt automatically to match the new sentiment. It features a canvas interface for fine-tuning prompt weights, color palettes, and typography constraints.',
    architecture: [
      { component: 'Visuals', detail: 'Vertex AI Imagen 3 generate-002' },
      { component: 'Text', detail: 'Gemini 2.0 Flash context-aware injection' },
      { component: 'Provenance', detail: 'C2PA cryptographic signature embedding' },
    ],
    primaryUseCases: [
      'Designing cohesive hero banners for websites',
      'Generating Instagram/LinkedIn visual carousels with matched copy',
      'Creating photorealistic product mockups in novel environments',
    ],
    outputFormat: 'High-res images (up to 2048x2048) with embedded C2PA data and paired copy strings.',
    relatedAgents: [
      { id: 'CC-06', name: 'Cognitive Core', latency: '3.2s' },
      { id: 'DA-03', name: 'Design Architect', latency: '6.8s' },
    ],
    faq: [
      { q: 'Can I upload my own company logo to be used in the designs?', a: 'Yes. The Asset Vault acts as a retrieval source. If your logo is in the Vault, DA-03 will composite it correctly onto generated assets while respecting brand spacing rules.' },
    ],
    externalLinks: [
      { label: 'Imagen 3 on Vertex AI', href: 'https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview' },
    ]
  },

  'cinematic-forge': {
    slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬', category: 'Content', osRoute: '/os/creative',
    textColor: 'text-pink-400', borderColor: 'border-pink-500', bgColor: 'bg-pink-500/5',
    headline: 'Video synthesis, storyboard creation, and motion branding — AI-driven cinematic production.',
    description: 'The Cinematic Forge automates pre-production and conceptual video design. By combining VE-01 (voice narration scripts), CC-06 (screenplays), and DA-03 (keyframe generation), it rapidly produces complete storyboards for commercials, TikToks, or corporate videos. While it does not render final video files (yet), it reduces pre-production time from weeks to minutes.',
    architecture: [
      { component: 'Scripting', detail: 'Gemini structured JSON narrative arcs' },
      { component: 'Keyframes', detail: 'Imagen 3 sequential generation with style consistency' },
      { component: 'Audio sync', detail: 'Timing estimates via natural language processing' },
    ],
    primaryUseCases: [
      'Pitching video concepts to clients with zero budget',
      'Generating b-roll shot lists for physical production teams',
      'Creating TikTok/Reels scripting templates',
    ],
    outputFormat: 'Interactive PDF storyboards containing scripts, keyframes, camera move directions, and voiceover timing.',
    relatedAgents: [
      { id: 'VE-01', name: 'Voice Engagement', latency: '<800ms' },
      { id: 'DA-03', name: 'Design Architect', latency: '6.8s' },
      { id: 'CC-06', name: 'Cognitive Core', latency: '3.2s' },
    ],
    faq: [
      { q: 'Does this generate actual playable videos?', a: 'It generates comprehensive storyboards and animatics (slideshows of keyframes with audio). Full frame-interpolation video generation is slated for a future update when computational costs stabilize.' },
    ],
    externalLinks: [
      { label: 'AI Storyboarding Best Practices', href: '#' },
    ]
  },

  'asset-vault': {
    slug: 'asset-vault', name: 'Asset Vault', glyph: '🗃', category: 'Operations', osRoute: '/os/vault',
    textColor: 'text-orange-400', borderColor: 'border-orange-500', bgColor: 'bg-orange-500/5',
    headline: 'Enterprise-grade file management built on Google Cloud Storage with discovery ingestion.',
    description: 'The Asset Vault is the persistent storage layer for the OS. Built natively on Google Cloud Storage, it handles thousands of AI-generated images, PDFs, and data payloads securely. It features automated tagging — when an image is saved, Gemini Vision analyzes it and assigns searchable metadata automatically. BA-07 can also automatically ingest competitor assets from the web for reference.',
    architecture: [
      { component: 'Storage Bucket', detail: 'GCS Standard (europe-west1)' },
      { component: 'Auto-tagging', detail: 'Gemini 2.0 Flash Vision applied on upload webhook' },
      { component: 'Search', detail: 'Firestore text indices across metadata' },
    ],
    primaryUseCases: [
      'Centralized storage for all AI outputs',
      'Searching historical assets by semantic description (e.g., "find images with a blue car")',
      'Maintaining brand asset kits (logos, fonts) for agent retrieval',
    ],
    outputFormat: 'Secure, authenticated download URLs and direct integration with OS creation modules.',
    relatedAgents: [
      { id: 'BA-07', name: 'Browser Architect', latency: '2.1s' },
      { id: 'DA-03', name: 'Design Architect', latency: '6.8s' },
    ],
    faq: [
      { q: 'Is my data secure in the Vault?', a: 'Yes. The Vault uses Google Cloud IAM (Identity and Access Management). Assets are private by default and can only be accessed via signed URLs or authenticated OS sessions.' },
    ],
    externalLinks: [
      { label: 'Google Cloud Storage Docs', href: 'https://cloud.google.com/storage' },
    ]
  },

  'workflow-builder': {
    slug: 'workflow-builder', name: 'Workflow Builder', glyph: '⚙', category: 'Operations', osRoute: '/os/workflows',
    textColor: 'text-cyan-400', borderColor: 'border-cyan-500', bgColor: 'bg-cyan-500/5',
    headline: 'ReactFlow-based DAG editor for building fully automated, condition-driven agent pipelines.',
    description: 'Similar to the Nexus Engine but focused on operational execution, the Workflow Builder allows you to automate repetitive multi-agent tasks on a schedule. You can set a trigger (e.g., "Every Monday at 9AM"), connect agents in a sequence, and let the system run indefinitely. It handles error retries, API rate limiting, and output routing automatically.',
    architecture: [
      { component: 'Scheduler', detail: 'Google Cloud Scheduler natively integrated' },
      { component: 'Queueing', detail: 'Cloud Tasks for durable execution' },
      { component: 'UI', detail: 'Visual pipeline builder with live validation' },
    ],
    primaryUseCases: [
      'Automated weekly competitor analysis reports emailed to the team',
      'Daily autonomous social media drafting and Senate approval caching',
      'Continuous broken-link monitoring and SEO auditing',
    ],
    outputFormat: 'Automated background execution with execution logs sent to Swarm Analytics.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'PM-07', name: 'Mission Control', latency: '420ms' },
    ],
    faq: [
      { q: 'What happens if an agent fails during an automated run?', a: 'The Workflow Builder has built-in resilience. It will retry the failed node up to 3 times with exponential backoff. If it still fails, it sends a notification via PM-07 to human operators.' },
    ],
    externalLinks: [
      { label: 'Google Cloud Scheduler', href: 'https://cloud.google.com/scheduler' },
    ]
  },

  'project-memory': {
    slug: 'project-memory', name: 'Project Memory', glyph: '🧠', category: 'Intelligence', osRoute: '/os/memory',
    textColor: 'text-violet-400', borderColor: 'border-violet-500', bgColor: 'bg-violet-500/5',
    headline: 'Historical campaign archive and client context store — the swarm\'s long-term memory.',
    description: 'Large Language Models are naturally stateless; Project Memory fixes this. By continually vectorizing briefs, approved outputs, and user corrections into Firestore Native Vector Search, the OS builds a long-term semantic understanding of your brand over time. When you ask it to "do it like last time", Project Memory knows exactly what you mean.',
    architecture: [
      { component: 'Embeddings', detail: 'Vertex AI text-embedding-004' },
      { component: 'Database', detail: 'Firestore Vector Search (768 dimensions)' },
      { component: 'Retrieval', detail: 'Semantic similarity search injected into SO-00 context' },
    ],
    primaryUseCases: [
      'Maintaining absolute brand consistency over months or years',
      'Onboarding new human team members by chatting with the brand\'s history',
      'Preventing the AI from suggesting ideas that were previously rejected',
    ],
    outputFormat: 'Background context windows injected seamlessly into the SN-00 orchestration layer.',
    relatedAgents: [
      { id: 'SO-00', name: 'Sovereign Core', latency: '580ms' },
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
    ],
    faq: [
      { q: 'Is my proprietary data used to train public models?', a: 'Absolutely not. Data in Project Memory is stored in your private GCP project via Firestore. Google Cloud policies strictly forbid using enterprise customer data to train foundation models.' },
    ],
    externalLinks: [
      { label: 'Vertex AI Embeddings', href: 'https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings' },
    ]
  },

  'swarm-analytics': {
    slug: 'swarm-analytics', name: 'Swarm Analytics', glyph: '📈', category: 'Intelligence', osRoute: '/os/analytics',
    textColor: 'text-green-400', borderColor: 'border-green-500', bgColor: 'bg-green-500/5',
    headline: 'Agent throughput metrics, success rates, latency data, and real-time swarm health monitoring.',
    description: 'Swarm Analytics is the IT oversight module for the neural OS. While the Executive Dashboard tracks marketing metrics, Swarm Analytics tracks machine metrics. It provides granular data on API latency, token consumption, cost-per-execution, and individual agent failure rates, allowing for deep optimization of the swarm\'s physical infrastructure.',
    architecture: [
      { component: 'Logging', detail: 'Google Cloud Logging & Trace' },
      { component: 'Cost Engine', detail: 'Live token counting via Gemini SDK' },
      { component: 'Reporting', detail: 'Automated cost and performance rollups' },
    ],
    primaryUseCases: [
      'Auditing GCP API costs across different workflows',
      'Identifying agents that are returning incomplete data (high retry rates)',
      'Optimizing prompts to reduce token usage and latency',
    ],
    outputFormat: 'Technical dashboards, latency distribution charts, and cost analysis exports.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'PM-07', name: 'Mission Control', latency: '420ms' },
    ],
    faq: [
      { q: 'Can I set cost alerts?', a: 'Yes. Via integration with Google Cloud Billing, you can set hard caps and receive alerts if a specific agent or workflow is consuming too many tokens.' },
    ],
    externalLinks: [
      { label: 'Google Cloud Logging', href: 'https://cloud.google.com/logging' },
    ]
  },

  'synergy-map': {
    slug: 'synergy-map', name: 'Synergy Map', glyph: '🗺', category: 'Intelligence', osRoute: '/os/synergy',
    textColor: 'text-teal-400', borderColor: 'border-teal-500', bgColor: 'bg-teal-500/5',
    headline: 'Live visualization of inter-agent data flows, dependencies, and swarm state.',
    description: 'The Synergy Map provides a breathtaking, real-time node visualization of the swarm in action. When SN-00 dispatches a command, the Map lights up, showing data packets physically moving between agents—for example, from SP-01 (research) into CC-06 (copywriting). It is both a powerful debugging tool and a stunning display of neural orchestration.',
    architecture: [
      { component: 'Rendering', detail: 'Custom WebGL / Canvas API' },
      { component: 'Data Feed', detail: 'WebSockets emitting execution graph states' },
      { component: 'Interactivity', detail: 'Clickable nodes to view payload diffs' },
    ],
    primaryUseCases: [
      'Debugging complex multi-agent failures by inspecting intermediate payloads',
      'Visually demonstrating system capability to stakeholders',
      'Understanding exactly how context mutates as it passes through the swarm',
    ],
    outputFormat: 'Interactive WebGL visualization in the OS browser.',
    relatedAgents: [
      { id: 'SN-00', name: 'Neural Orchestrator', latency: '38ms' },
      { id: 'SO-00', name: 'Sovereign Core', latency: '580ms' },
    ],
    faq: [
      { q: 'Is the map showing real data or just an animation?', a: 'It represents the literal, real-time execution graph. If CC-06 takes 4 seconds to execute, the node on the map will pulse for exactly 4 seconds until the payload is passed to the next agent.' },
    ],
    externalLinks: [
      { label: 'WebSocket Architecture', href: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
    ]
  },

  'security-senate': {
    slug: 'security-senate', name: 'Security Senate', glyph: '🔒', category: 'Governance', osRoute: '/os/senate',
    textColor: 'text-red-400', borderColor: 'border-red-500', bgColor: 'bg-red-500/5',
    headline: 'The RA-01 compliance tribunal — EU AI Act Art.50 enforcement with full veto power.',
    description: 'The Security Senate is the most critical module for enterprise deployment. Powered exclusively by RA-01, this module acts as a strict, unbypassable gate. Every piece of text, code, or imagery generated by the other agents is halted here. The Senate scores the asset against the EU AI Act (transparency), GDPR (data privacy), and hallucination thresholds. If an asset scores below 80/100, the Senate enforces a hard veto and blocks distribution.',
    architecture: [
      { component: 'Analysis Engine', detail: 'Gemini 2.0 Flash (Zero-temperature strict evaluation)' },
      { component: 'Ruleset Engine', detail: 'Static heuristics + semantic checking' },
      { component: 'Audit Trail', detail: 'Immutable veto logging to Firestore' },
    ],
    primaryUseCases: [
      'Ensuring strict legal compliance in heavily regulated industries (finance, healthcare)',
      'Automatically adding required AI-generation disclosures to outbound content',
      'Preventing the publication of hallucinatory or off-brand claims',
    ],
    outputFormat: 'Cryptographically signed certificates of compliance, or detailed veto remediation logs.',
    relatedAgents: [
      { id: 'RA-01', name: 'Security Senate', latency: '280ms' },
    ],
    faq: [
      { q: 'Can a human override a Senate veto?', a: 'By design, no. The Senate is absolute. If a human disagrees, they must update the prompt or the system context to force the generating agents to produce compliant output. This ensures the audit trail remains legally defensible.' },
    ],
    externalLinks: [
      { label: 'EU AI Act Official Text', href: 'https://artificialintelligenceact.eu/' },
      { label: 'GDPR Rules', href: 'https://gdpr.eu/' },
    ]
  },

  'columna-radar': {
    slug: 'columna-radar', name: 'Columna Radar', glyph: '📡', category: 'Intelligence', osRoute: '/os/radar',
    textColor: 'text-amber-400', borderColor: 'border-amber-500', bgColor: 'bg-amber-500/5',
    headline: 'Market pulse monitoring — competitive intelligence and content gap analysis in real-time.',
    description: 'The Columna Radar acts as the swarm\'s peripheral vision. It continuously monitors predefined targets—competitor websites, specific industry subreddits, SEC filings, or news feeds—using BA-07. When it detects a significant narrative shift or a new product launch, it alerts PM-07 and automatically generates a strategic counter-response brief for human review.',
    architecture: [
      { component: 'Scraping', detail: 'BA-07 headless traversal' },
      { component: 'Diffing', detail: 'Vector distance anomaly detection' },
      { component: 'Alerting', detail: 'Push notifications via PM-07 and Google Chat' },
    ],
    primaryUseCases: [
      'Real-time competitor price tracking and adjustment recommendations',
      'Being first-to-market with content on breaking industry news',
      'Monitoring brand sentiment across disparate social channels',
    ],
    outputFormat: 'Live dashboard feeds, email digests, and actionable strategic briefs.',
    relatedAgents: [
      { id: 'SP-01', name: 'Strategic Cortex', latency: '1.2s' },
      { id: 'BA-07', name: 'Browser Architect', latency: '2.1s' },
    ],
    faq: [
      { q: 'How does it know what constitutes a "significant" change?', a: 'It uses semantic vector distance. A minor website typo fix won\'t trigger an alert, but a change from "AI Assistance" to "Autonomous AI" represents a semantic pivot and will trigger an alert.' },
    ],
    externalLinks: [
      { label: 'Using AI for Competitive Intelligence', href: '#' },
    ]
  },

  'perfect-twin': {
    slug: 'perfect-twin', name: 'Perfect Twin', glyph: '🪞', category: 'Governance', osRoute: '/os/twin',
    textColor: 'text-slate-400', borderColor: 'border-slate-500', bgColor: 'bg-slate-500/5',
    headline: 'Blockchain-grade provenance and audit trail for every AI-generated asset.',
    description: 'In an era of deepfakes and regulatory scrutiny, total transparency is required. The Perfect Twin module maintains a forensic, immutable record of every action the OS takes. For any given image or article, you can trace exactly which user issued the prompt, what SO-00 changed in the brief, how long CC-06 took to write it, and the exact timestamp RA-01 approved it.',
    architecture: [
      { component: 'Logging Base', detail: 'Append-only Firestore collections' },
      { component: 'Asset Tagging', detail: 'C2PA metadata standard integration' },
      { component: 'UI', detail: 'Forensic timeline viewer' },
    ],
    primaryUseCases: [
      'Providing verifiable proof of compliance during legal audits',
      'Protecting the brand against claims of copyright infringement',
      'Analyzing the exact chain of events that led to a highly successful campaign',
    ],
    outputFormat: 'Exportable JSON audit logs and embeddable C2PA manifests.',
    relatedAgents: [
      { id: 'RA-01', name: 'Security Senate', latency: '280ms' },
      { id: 'SO-00', name: 'Sovereign Core', latency: '580ms' },
    ],
    faq: [
      { q: 'Is it actually on a blockchain?', a: 'No, it uses append-only Firestore architecture which provides similar immutability without the latency and environmental costs of blockchain technology. The C2PA standard provides the cryptographic signatures needed for public verification.' },
    ],
    externalLinks: [
      { label: 'C2PA Technical Specs', href: 'https://c2pa.org/specifications/specifications/1.3/index.html' },
    ]
  },
};

export function ModuleDetailPage() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();
  const mod = moduleSlug ? MODULES[moduleSlug] : null;

  useEffect(() => {
    if (mod) {
      document.title = `${mod.name} Module — AGENTICUM G5 OS`;
      const s = document.getElementById('jsonld-module');
      if (!s) {
        const el = document.createElement('script');
        el.id = 'jsonld-module';
        el.type = 'application/ld+json';
        el.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['SoftwareApplication', 'FAQPage'],
          name: `${mod.name} Module`,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Cloud',
          description: mod.description,
          mainEntity: mod.faq.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        });
        document.head.appendChild(el);
      }
    }
    return () => { document.getElementById('jsonld-module')?.remove(); };
  }, [mod]);

  if (!mod) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans">
        <MegaNav />
        <div className="text-center pt-32">
           <p className="font-mono text-zinc-600 text-[10px] uppercase tracking-widest mb-4">Module not found</p>
           <h1 className="text-4xl font-light mb-8">System Error 404</h1>
          <button onClick={() => navigate('/modules')} className="text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors">← Return to Registry</button>
        </div>
      </div>
    );
  }

  const getBannerImage = (slug: string) => {
    if (slug.includes('creative') || slug.includes('forge') || slug.includes('blog')) return '/assets/palmer_creative.png';
    if (slug.includes('senate') || slug.includes('console') || slug.includes('dashboard') || slug.includes('manager')) return '/assets/palmer_system.png';
    return '/assets/palmer_neural_core.png';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      <MegaNav />

      {/* Hero Banner */}
      <div className="w-full h-[70vh] relative pt-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
        <img src={getBannerImage(mod.slug)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.25] mix-blend-luminosity scale-105" />
        
        <div className="absolute bottom-0 left-0 w-full z-30 px-6 sm:px-12 lg:px-24 xl:px-32 pb-24 flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-6xl">
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl opacity-40 mix-blend-screen">{mod.glyph}</span>
              <div className="h-px bg-white/20 w-12" />
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em]">{mod.category} <span className="text-zinc-700 mx-2">/</span> Module Layer</p>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">{mod.name}</h1>
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl leading-snug font-light">{mod.headline}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32">
          
          {/* Left Column: Deep Context */}
          <div className="lg:col-span-7 space-y-24">
            
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex justify-between items-baseline mb-6">
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">01 — Overview</p>
                <button onClick={() => navigate(mod.osRoute)} className="flex items-center gap-2 font-mono text-[9px] text-white hover:text-zinc-300 uppercase tracking-widest transition-colors py-1 px-3 border border-white/10 rounded-full">
                  Launch App <ExternalLink size={10} />
                </button>
              </div>
              <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-light">{mod.description}</p>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
               <div className="h-px bg-white/5 w-full mb-12" />
               <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">02 — Use Cases & Standard Delivery</p>
               
               <div className="bg-[#0A0A0A] border border-white/5 p-8 sm:p-12 rounded-2xl relative overflow-hidden group mb-12">
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-6">Output Format</p>
                  <p className="font-mono text-sm text-zinc-300 leading-relaxed">{mod.outputFormat}</p>
               </div>

               <div className="space-y-6">
                 <p className="text-sm text-zinc-400 mb-4 font-mono uppercase tracking-widest text-[10px]">Primary Directives</p>
                 <ul className="space-y-4">
                   {mod.primaryUseCases.map((useCase, i) => (
                     <li key={i} className="flex items-start gap-4 p-4 border border-zinc-900 bg-[#070707] rounded-xl hover:border-zinc-800 transition-colors">
                       <span className="font-mono text-[10px] text-zinc-600 mt-0.5">0{i+1}</span>
                       <span className="text-zinc-300 text-sm leading-relaxed">{useCase}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
               <div className="h-px bg-white/5 w-full mb-12" />
               <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">03 — Intelligence Matrix</p>
               <div className="space-y-12">
                  {mod.faq.map((f, i) => (
                    <div key={i} itemScope itemType="https://schema.org/Question">
                      <p className="text-xl font-medium text-white mb-4 tracking-tight" itemProp="name">{f.q}</p>
                      <p className="text-zinc-400 text-base leading-relaxed font-light" itemProp="acceptedAnswer">{f.a}</p>
                    </div>
                  ))}
               </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
               <div className="h-px bg-white/5 w-full mb-12" />
               <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">04 — External Citations</p>
               <div className="flex flex-col gap-4">
                  {mod.externalLinks.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group w-fit">
                       <span className="font-mono text-xs text-zinc-400 group-hover:text-white transition-colors">{l.label}</span>
                       <ExternalLink size={12} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </a>
                  ))}
               </div>
            </motion.section>

          </div>

          {/* Right Column: Spec Sheet & Dependencies */}
          <div className="lg:col-span-5 lg:pl-12 lg:border-l border-white/5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="sticky top-32 space-y-16">
               
               <div>
                 <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">System Architecture</p>
                 <div className="space-y-6">
                   {mod.architecture.map(a => (
                     <div key={a.component} className="border-b border-white/5 pb-6">
                       <p className="font-mono text-[10px] text-white uppercase tracking-wide mb-2">{a.component}</p>
                       <p className="text-sm text-zinc-500">{a.detail}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div>
                 <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Powered by Swarm Agents</p>
                 <div className="flex flex-col gap-3">
                   {mod.relatedAgents.map(a => (
                     <Link key={a.id} to={`/agents/${a.id.toLowerCase().replace('-','')}-${a.name.toLowerCase().replace(' ', '-')}`} className="group flex items-center justify-between p-4 bg-[#0A0A0A] hover:bg-[#111] border border-white/5 transition-colors rounded-xl">
                       <div className="flex flex-col gap-1">
                          <span className="font-mono text-sm text-white">{a.id}</span>
                          <span className="font-mono text-[10px] text-zinc-500 tracking-widest">{a.name}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="font-mono text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">{a.latency}</span>
                          <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                       </div>
                     </Link>
                   ))}
                 </div>
               </div>

            </motion.div>
          </div>

        </div>

        {/* Cinematic Footer / CTA */}
        <div className="mt-32 pt-24 border-t border-white/5 flex flex-col items-center justify-center text-center">
           <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-8">Module {mod.name} Live</p>
           <h3 className="text-4xl sm:text-6xl font-medium tracking-tighter text-white mb-12">Boot Application.</h3>
           
           <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
             <button onClick={() => navigate(mod.osRoute)} className="px-12 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               Launch Interface <ArrowRight size={12} />
             </button>
             <button onClick={() => navigate('/modules')} className="px-12 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
               Module Registry
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
