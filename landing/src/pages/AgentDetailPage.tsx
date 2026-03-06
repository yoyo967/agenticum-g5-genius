import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';

/* ============================================================
   FULL AGENT REGISTRY — All 9 agents with deep content
   ============================================================ */
const AGENTS: Record<string, {
  id: string; name: string; slug: string; glyph: string;
  textColor: string; borderColor: string; bgColor: string;
  model: string; latency: string; layer: string; cloudService: string;
  headline: string; description: string;
  capabilities: string[]; technicalDetails: { label: string; value: string }[];
  examplePrompts: string[]; outputExample: string;
  relatedModules: { slug: string; name: string; glyph: string }[];
  faq: { q: string; a: string }[];
  externalLinks: { label: string; href: string }[];
}> = {
  'sn00-orchestrator': {
    id: 'SN-00', name: 'Neural Orchestrator', slug: 'sn00-orchestrator',
    glyph: '⚡', textColor: 'text-blue-400', borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/5',
    model: 'gemini-2.0-flash', latency: '38ms', layer: 'Orchestration',
    cloudService: 'Cloud Run europe-west1',
    headline: 'The conductor that dispatches all 9 agents in parallel via SwarmProtocol v3.0.',
    description: 'SN-00 is the neural spine of AGENTICUM G5. When a voice command or text directive arrives, SN-00 parses intent, builds an execution graph, and dispatches all applicable agents simultaneously. It manages live telemetry, handles retries, and merges agent outputs into a unified deliverable — all in under 38ms initialization time.',
    capabilities: [
      'Parallel agent dispatch via SwarmProtocol v3.0',
      'Intent parsing and context routing',
      'Live WebSocket telemetry broadcast',
      'Agent output merging and deduplication',
      'Conditional fan-out and fan-in logic',
      'Retry orchestration on agent failure',
      'Real-time execution graph visualization',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash' },
      { label: 'Init Latency', value: '38ms' },
      { label: 'Protocol', value: 'SwarmProtocol v3.0' },
      { label: 'Deployment', value: 'Cloud Run europe-west1' },
      { label: 'Transport', value: 'WebSocket + Server-Sent Events' },
      { label: 'Max Parallel Agents', value: '9 simultaneous' },
    ],
    examplePrompts: [
      '"Launch campaign for luxury sustainable fashion brand targeting millennials"',
      '"Analyze competitors in the EV charging market and generate positioning strategy"',
      '"Create a full content package for product launch: copy, visuals, and compliance audit"',
    ],
    outputExample: 'Execution graph dispatched: SP-01 (intel), CC-06 (copy), DA-03 (visuals), RA-01 (compliance) — all parallel. ETA: 42s. Telemetry streaming to console.',
    relatedModules: [
      { slug: 'genius-console', name: 'GenIUS Console', glyph: '🖥' },
      { slug: 'workflow-builder', name: 'Workflow Builder', glyph: '⚙' },
      { slug: 'synergy-map', name: 'Synergy Map', glyph: '🗺' },
      { slug: 'swarm-analytics', name: 'Swarm Analytics', glyph: '📈' },
    ],
    faq: [
      { q: 'What makes SN-00 different from a simple task scheduler?', a: 'SN-00 uses Gemini 2.0 Flash for intent understanding, not rule-based routing. It dynamically selects which agents to dispatch based on the semantic content of the request, not predefined templates.' },
      { q: 'How does SN-00 handle agent failures?', a: 'SN-00 monitors each agent\'s WebSocket heartbeat. On timeout or error, it automatically retries up to 3 times before marking the agent as degraded and continuing with available outputs.' },
      { q: 'Can SN-00 run sequential workflows?', a: 'Yes. The Workflow Builder module allows you to define DAG-based sequences where SN-00 waits for specific agent outputs before dispatching the next stage — for pipelines that require cascading context.' },
    ],
    externalLinks: [
      { label: 'Gemini 2.0 Flash — Google AI', href: 'https://ai.google.dev/gemini-api/docs/models' },
      { label: 'Cloud Run — Google Cloud', href: 'https://cloud.google.com/run' },
    ],
  },

  'so00-sovereign': {
    id: 'SO-00', name: 'Sovereign Core', slug: 'so00-sovereign',
    glyph: '🧬', textColor: 'text-indigo-400', borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-500/5',
    model: 'gemini-2.0-flash', latency: '580ms', layer: 'Intelligence',
    cloudService: 'Cloud Run + Firestore',
    headline: 'The sentient fusion layer that merges user vision with AI technical congruence.',
    description: 'SO-00 bridges the gap between what a user imagines and what the AI can produce with precision. It takes raw briefs and enriches them with brand memory, strategic context from Project Memory, and recursive self-refinement loops. Every campaign brief passes through SO-00 before reaching the creative agents.',
    capabilities: [
      'Vision synthesis and brief enrichment',
      'Brand memory retrieval from Firestore',
      'Recursive self-refinement (3 iterations)',
      'Context propagation to all child agents',
      'Strategic alignment scoring',
      'Long-term campaign coherence management',
      'Cross-session brand voice persistence',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash' },
      { label: 'Latency', value: '580ms' },
      { label: 'Memory Backend', value: 'Firestore (Native Mode) + Vector Search' },
      { label: 'Refinement Loops', value: '3 recursive iterations' },
      { label: 'Deployment', value: 'Cloud Run europe-west1' },
      { label: 'Context Window', value: '1M tokens (Gemini 2.0 Flash)' },
    ],
    examplePrompts: [
      '"Our brand is premium, minimalist, eco-conscious. Target: urban professionals 28-40."',
      '"Align this campaign with our Q2 strategy: grow awareness in DACH region by 30%."',
      '"Maintain the same creative direction as our October launch — same voice, elevated."',
    ],
    outputExample: 'Brief enriched: Brand voice = [authoritative, empathetic, minimal]. Strategic context loaded from 3 previous campaigns. Alignment score: 94/100. Dispatching to CC-06, DA-03.',
    relatedModules: [
      { slug: 'project-memory', name: 'Project Memory', glyph: '🧠' },
      { slug: 'nexus-engine', name: 'Nexus Engine V2', glyph: '🔬' },
      { slug: 'synergy-map', name: 'Synergy Map', glyph: '🗺' },
    ],
    faq: [
      { q: 'How does SO-00 know our brand voice?', a: 'SO-00 retrieves brand guidelines, past campaign outputs, and tone parameters from the Project Memory module (Firestore + Vector Search). It builds a semantic brand profile that persists across sessions.' },
      { q: 'What is recursive self-refinement?', a: 'After enriching the brief, SO-00 evaluates its own output against the strategic objectives and refines it up to 3 times. This eliminates generic interpretations and produces highly specific creative direction.' },
    ],
    externalLinks: [
      { label: 'Firestore Vector Search — Google Cloud', href: 'https://cloud.google.com/firestore' },
      { label: 'Gemini Context Window', href: 'https://ai.google.dev/gemini-api/docs/long-context' },
    ],
  },

  'sp01-strategic-cortex': {
    id: 'SP-01', name: 'Strategic Cortex', slug: 'sp01-strategic-cortex',
    glyph: '🔍', textColor: 'text-yellow-400', borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/5',
    model: 'gemini-2.0-flash + Google Grounding', latency: '1.2s', layer: 'Intelligence',
    cloudService: 'Vertex AI + Firestore Vector Search',
    headline: 'Market intelligence through competitive analysis, SEO strategy, and real-time Google grounding.',
    description: 'SP-01 is the strategic intelligence engine. It uses Google Search grounding to pull live market data, Firestore Vector Search to find semantic precedents in your campaign history, and competitor content analysis to identify positioning gaps. Every brief it produces is grounded in real-world current data — not hallucinated.',
    capabilities: [
      'Competitor content gap analysis',
      'Real-time Google Search grounding',
      'Firestore Vector Search for semantic precedent retrieval',
      'SERP feature identification (Featured Snippets, PAA)',
      'Keyword opportunity mapping',
      'Market trend detection',
      'Strategic positioning recommendations',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash with Google Search' },
      { label: 'Latency', value: '1.2s average' },
      { label: 'Data Source', value: 'Live Google Search + Firestore' },
      { label: 'Vector Index', value: 'Firestore Native Vector (768-dim)' },
      { label: 'Grounding', value: 'Google Search Grounding API' },
      { label: 'Output Format', value: 'Structured JSON + Markdown report' },
    ],
    examplePrompts: [
      '"Research top 5 competitors in the sustainable coffee market. Find content gaps."',
      '"What SEO keywords should we target for our new B2B SaaS product in DACH?"',
      '"Identify trending narratives in luxury travel content for Q1 2026."',
    ],
    outputExample: 'Competitor analysis: 5 brands mapped. Content gaps: "sustainable sourcing certification", "carbon offset transparency". Recommended keywords: [fair-trade-coffee-europe, ethical-sourcing-certification]. Positioning: "Radical Transparency" angle available — no competitor owns it yet.',
    relatedModules: [
      { slug: 'columna-radar', name: 'Columna Radar', glyph: '📡' },
      { slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣' },
      { slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍' },
    ],
    faq: [
      { q: 'Is SP-01\'s research based on live data?', a: 'Yes. SP-01 uses Google Search Grounding API to access current web content. Every intelligence report includes grounding citations with source URLs, publication dates, and confidence scores.' },
      { q: 'How does SP-01 use Firestore Vector Search?', a: 'SP-01 creates vector embeddings of your campaign history and stores them in Firestore. When a new brief arrives, it performs semantic similarity search to find relevant past campaigns — adding strategic continuity to new initiatives.' },
    ],
    externalLinks: [
      { label: 'Google Search Grounding — Vertex AI', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview' },
      { label: 'Firestore Vector Search', href: 'https://cloud.google.com/firestore/docs/vector-search' },
    ],
  },

  'cc06-cognitive-core': {
    id: 'CC-06', name: 'Cognitive Core', slug: 'cc06-cognitive-core',
    glyph: '✍', textColor: 'text-emerald-400', borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/5',
    model: 'gemini-2.0-flash', latency: '3.2s', layer: 'Creation',
    cloudService: 'Cloud Run europe-west1',
    headline: 'Copywriting, brand voice calibration, and high-conversion sales text across all platforms.',
    description: 'CC-06 is the multi-channel content factory. It receives the enriched brief from SO-00 and the intelligence from SP-01, then generates platform-specific copy across LinkedIn, email sequences, blog posts, ad copy, product descriptions, and press releases — all in your brand voice, all RA-01 compliant.',
    capabilities: [
      'LinkedIn long-form articles (2000+ words)',
      'Email sequences (5-7 step nurture)',
      'Blog posts with pillar-cluster structure',
      'Google/Meta/LinkedIn ad copy (all formats)',
      'Product descriptions (e-commerce optimized)',
      'Press release and PR copy',
      'Meta title and description generation',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash' },
      { label: 'Latency', value: '3.2s for full package' },
      { label: 'Output Formats', value: 'Markdown, HTML, JSON, Plain Text' },
      { label: 'Brand Calibration', value: 'Via SO-00 brand memory injection' },
      { label: 'Compliance Gate', value: 'RA-01 review before delivery' },
      { label: 'Max Output', value: '8,000 tokens per request' },
    ],
    examplePrompts: [
      '"Write a 3-part LinkedIn thought leadership series on AI compliance for CMOs."',
      '"Generate 5 subject line variants for our product launch email. Split-test ready."',
      '"Full Google Ads campaign: 5 RSA headlines, 5 descriptions, 3 callout extensions."',
    ],
    outputExample: 'Content package generated: LinkedIn article (1847 words, 94/100 Senate score), Email sequence (5 emails, avg 340 words), Ad copy (5 RSA sets, all formats). All RA-01 approved. C2PA provenance embedded.',
    relatedModules: [
      { slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍' },
      { slug: 'creative-studio', name: 'Creative Studio', glyph: '🎨' },
      { slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬' },
      { slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣' },
    ],
    faq: [
      { q: 'Does CC-06 write in our specific brand voice?', a: 'Yes. CC-06 receives brand voice parameters from SO-00 (tone, vocabulary, forbidden words, preferred structures) extracted from your Project Memory. The output is calibrated to your brand, not a generic template.' },
      { q: 'How many content formats can CC-06 produce in one run?', a: 'A single swarm run typically produces a full content package: pillar blog post, 3 social posts, 1 email sequence, and ad copy — all simultaneously, ready for RA-01 review.' },
    ],
    externalLinks: [
      { label: 'Gemini 2.0 Flash — Google AI', href: 'https://ai.google.dev/gemini-api/docs/models' },
    ],
  },

  'da03-design-architect': {
    id: 'DA-03', name: 'Design Architect', slug: 'da03-design-architect',
    glyph: '🎨', textColor: 'text-purple-400', borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/5',
    model: 'Imagen 3 generate-002', latency: '6.8s', layer: 'Creation',
    cloudService: 'Vertex AI Imagen 3 + Cloud Storage',
    headline: 'Visual asset generation with Imagen 3, UI/UX layouts, and creative direction at scale.',
    description: 'DA-03 is the visual intelligence of the swarm. Using Google\'s Imagen 3 (generate-002) via Vertex AI, it produces photorealistic images, brand-consistent visual assets, and storyboard frames. Every image includes C2PA provenance metadata — machine-verifiable proof of AI origin. Assets go directly to the Asset Vault in Cloud Storage.',
    capabilities: [
      '1024×1024 photorealistic image generation',
      'C2PA provenance metadata embedding',
      'Brand palette enforcement via color constraints',
      'Multi-style generation (photorealistic, illustration, product)',
      'Storyboard frame creation for video',
      'UI/UX mockup generation',
      'Logo and brand asset iteration',
    ],
    technicalDetails: [
      { label: 'Model', value: 'Imagen 3 (generate-002)' },
      { label: 'Latency', value: '6.8s per image' },
      { label: 'Resolution', value: '1024×1024 (upgradeable to 2048×2048)' },
      { label: 'Storage', value: 'Cloud Storage (europe-west1) via Asset Vault' },
      { label: 'Provenance', value: 'C2PA metadata embedded in every output' },
      { label: 'API', value: 'Vertex AI Image Generation API' },
    ],
    examplePrompts: [
      '"Generate a photorealistic hero image: luxury smartwatch, dark background, golden light, minimalist."',
      '"Create 4 social media visual variants for our spring campaign. Brand colors: #1A1A2E, #E4B860."',
      '"Storyboard frame 3: protagonist holding product, city backdrop, cinematic lighting."',
    ],
    outputExample: '4 images generated. Resolution: 1024×1024. C2PA certificate: issued. Cloud Storage URI: gs://agenticum-assets/campaign-2026-03/da03-hero-v1.png. Integrity score: 98/100.',
    relatedModules: [
      { slug: 'creative-studio', name: 'Creative Studio', glyph: '🎨' },
      { slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬' },
      { slug: 'asset-vault', name: 'Asset Vault', glyph: '🗃' },
      { slug: 'perfect-twin', name: 'Perfect Twin', glyph: '🪞' },
    ],
    faq: [
      { q: 'What is C2PA provenance and why does it matter?', a: 'C2PA (Coalition for Content Provenance and Authenticity) is a standard for embedding machine-verifiable metadata into media files. Every DA-03 image carries a cryptographic certificate proving its AI origin, model version, timestamp, and operator — required for EU AI Act Art.50 compliance on AI-generated visuals.' },
      { q: 'Can DA-03 enforce brand colors?', a: 'Yes. DA-03 accepts hex color constraints in its prompt parameters, derived from your brand guidelines in Project Memory. The color palette is enforced at generation time using Imagen 3\'s style conditioning.' },
    ],
    externalLinks: [
      { label: 'Imagen 3 — Vertex AI', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview' },
      { label: 'C2PA Standard', href: 'https://c2pa.org' },
    ],
  },

  'ba07-browser-architect': {
    id: 'BA-07', name: 'Browser Architect', slug: 'ba07-browser-architect',
    glyph: '🌐', textColor: 'text-green-400', borderColor: 'border-green-500',
    bgColor: 'bg-green-500/5',
    model: 'gemini-2.0-flash + Browser Tool', latency: '2.1s', layer: 'Intelligence',
    cloudService: 'Cloud Run + Vertex AI Grounding',
    headline: 'Live web intelligence, deep research automation, and real-world grounding at enterprise scale.',
    description: 'BA-07 extends the swarm into the live internet. It navigates URLs, scrapes structured data, discovers market signals, and ingests external assets into the Asset Vault. Unlike static training data, BA-07\'s intelligence is always current — grounded in the real web at the moment of execution.',
    capabilities: [
      'Live URL navigation and content extraction',
      'Structured data scraping (pricing, reviews, specs)',
      'Competitor product discovery',
      'Market trend monitoring via search',
      'Asset discovery and ingestion to Asset Vault',
      'Real-time SERP analysis',
      'Schema.org structured data parsing',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash with Browser Tool' },
      { label: 'Latency', value: '2.1s average per research task' },
      { label: 'Access', value: 'Live web + Google Search API' },
      { label: 'Deployment', value: 'Cloud Run europe-west1' },
      { label: 'Data Output', value: 'Structured JSON + Firestore ingestion' },
      { label: 'Concurrent Tabs', value: 'Up to 8 parallel browser sessions' },
    ],
    examplePrompts: [
      '"Research the top 10 sustainable coffee brands in Germany. Extract pricing and unique selling points."',
      '"Scrape the latest Gartner Magic Quadrant for marketing technology. Summarize positioning."',
      '"Monitor competitor website changes for brand: Competitor X. Alert on new product launches."',
    ],
    outputExample: 'Research complete: 10 competitor URLs scraped. Pricing matrix extracted. USP gaps identified: "B2B reseller program" (0 competitors) and "CO2 labeling" (1 competitor). Assets ingested to Vault: 3 PDFs, 8 images.',
    relatedModules: [
      { slug: 'columna-radar', name: 'Columna Radar', glyph: '📡' },
      { slug: 'asset-vault', name: 'Asset Vault', glyph: '🗃' },
      { slug: 'project-memory', name: 'Project Memory', glyph: '🧠' },
    ],
    faq: [
      { q: 'Is BA-07 scraping blocked websites?', a: 'BA-07 respects robots.txt and rate limits. It uses the Gemini Browser Tool via Vertex AI, which operates within Google\'s terms of service. For protected content, it uses Google Search grounding instead of direct scraping.' },
      { q: 'Can BA-07 monitor competitors continuously?', a: 'The Columna Radar module uses BA-07 for continuous monitoring. You can schedule BA-07 research tasks via the Workflow Builder to run daily or weekly and push updates to the Executive Dashboard.' },
    ],
    externalLinks: [
      { label: 'Vertex AI Grounding with Google Search', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview' },
    ],
  },

  've01-voice-engagement': {
    id: 'VE-01', name: 'Voice Engagement', slug: 've01-voice-engagement',
    glyph: '🎤', textColor: 'text-blue-300', borderColor: 'border-blue-300',
    bgColor: 'bg-blue-300/5',
    model: 'gemini-2.0-flash-live-001', latency: '<800ms', layer: 'Interface',
    cloudService: 'Vertex AI Gemini Live API',
    headline: 'The Gemini Live API integration — bidirectional real-time audio with tool calling and barge-in support.',
    description: 'VE-01 is the primary reason AGENTICUM G5 is entering the Gemini Live Agent Challenge. It implements the full Gemini Live API spec: bidirectional WebSocket audio streaming at 16kHz PCM16, barge-in interruption handling, real-time function calling (launch_swarm, get_status), and natural conversation turn-taking. One spoken sentence activates the entire G5 swarm.',
    capabilities: [
      'Bidirectional WebSocket audio streaming (16kHz PCM16)',
      'Real-time function calling via Gemini tool_use',
      'Barge-in / interruption detection',
      'Intent classification with <800ms latency',
      'Natural conversation turn-taking',
      'Audio feedback during swarm execution',
      'Multi-language support (EN, DE, FR)',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash-live-001' },
      { label: 'Latency', value: '<800ms intent-to-action' },
      { label: 'Audio Format', value: '16kHz PCM16 mono' },
      { label: 'Transport', value: 'Bidirectional WebSocket (WSS)' },
      { label: 'SDK', value: '@google/genai v1.43.0' },
      { label: 'Function Calls', value: 'launch_swarm, get_status, cancel_task' },
    ],
    examplePrompts: [
      '"[Voice] Create a luxury watch campaign targeting Swiss market, premium positioning."',
      '"[Voice] What\'s the status of my last campaign?"',
      '"[Voice] Cancel the current generation and restart with a more minimal approach."',
    ],
    outputExample: 'Voice command received: "Create sustainable fashion campaign." Intent classified: CAMPAIGN_LAUNCH. Function call: launch_swarm({intent: "sustainable fashion", market: "EU", tone: "premium"}). Swarm activated. Audio feedback: "Your campaign is being created. 9 agents online. ETA 42 seconds."',
    relatedModules: [
      { slug: 'genius-console', name: 'GenIUS Console', glyph: '🖥' },
      { slug: 'cinematic-forge', name: 'Cinematic Forge', glyph: '🎬' },
    ],
    faq: [
      { q: 'What makes VE-01 different from a simple speech-to-text tool?', a: 'VE-01 uses the Gemini Live API — a full bidirectional conversation model, not just transcription. The AI understands context, handles barge-ins (you can interrupt mid-sentence), calls functions in real-time, and responds with audio while the swarm executes.' },
      { q: 'How does barge-in work?', a: 'When VE-01 detects the user speaking while audio feedback is playing, it uses serverContent.interrupted to immediately stop the current response and re-process the new input. This creates a natural, human-like conversation flow.' },
      { q: 'Is VE-01 the hackathon\'s star feature?', a: 'Yes. The Gemini Live API integration (VE-01) is the core of our Gemini Live Agent Challenge 2026 submission. It demonstrates the API\'s full capability: real-time function calling, barge-in, audio feedback, and swarm activation — all in a single voice utterance.' },
    ],
    externalLinks: [
      { label: 'Gemini Live API — Google AI', href: 'https://ai.google.dev/api/live' },
      { label: '@google/genai npm', href: 'https://www.npmjs.com/package/@google/genai' },
    ],
  },

  'ra01-security-senate': {
    id: 'RA-01', name: 'Security Senate', slug: 'ra01-security-senate',
    glyph: '⚖', textColor: 'text-red-400', borderColor: 'border-red-500',
    bgColor: 'bg-red-500/5',
    model: 'gemini-2.0-flash', latency: '280ms', layer: 'Governance',
    cloudService: 'Cloud Run europe-west1',
    headline: 'EU AI Act Art.50 compliance enforcer with veto power over every agent output.',
    description: 'RA-01 is the final gate before any content reaches the user. It enforces EU AI Act Article 50 (transparency requirements for AI-generated content), GDPR data handling rules, brand safety standards, and hallucination risk scoring. With a configured veto threshold, RA-01 can automatically block non-compliant content and request remediation from CC-06.',
    capabilities: [
      'EU AI Act Art.50 transparency enforcement',
      'GDPR compliance verification',
      'Hallucination risk scoring (0-100)',
      'Brand safety classification',
      'Content toxicity detection',
      'C2PA provenance chain verification',
      'Automated remediation request dispatch',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash' },
      { label: 'Review Latency', value: '280ms average' },
      { label: 'Compliance Standards', value: 'EU AI Act Art.50, GDPR Art.5-7, ISO 42001' },
      { label: 'Score Range', value: '0-100 (threshold: 80 default)' },
      { label: 'Veto Action', value: 'Automatic block + remediation request' },
      { label: 'Audit Log', value: 'Firestore immutable log + Perfect Twin' },
    ],
    examplePrompts: [
      '"Review this LinkedIn article for EU AI Act compliance and brand safety."',
      '"Score this ad campaign copy: hallucination risk, GDPR, transparency."',
      '"Conduct full senate audit on the Q1 campaign package."',
    ],
    outputExample: 'Senate review complete. Score: 94/100. Art.50: PASS (AI disclosure in footer). GDPR: PASS (no PII processed). Brand Safety: PASS. Hallucination Risk: LOW (3 claims verified via grounding). Certificate issued. Delivery authorized.',
    relatedModules: [
      { slug: 'security-senate', name: 'Security Senate', glyph: '🔒' },
      { slug: 'perfect-twin', name: 'Perfect Twin', glyph: '🪞' },
      { slug: 'pillar-blog-engine', name: 'Pillar Blog Engine', glyph: '✍' },
    ],
    faq: [
      { q: 'What happens when RA-01 vetoes content?', a: 'RA-01 issues a veto notice with a detailed remediation report — specifying exactly which EU AI Act article was violated, what change is required, and which agent (usually CC-06) needs to regenerate. The user sees the veto in the Security Senate module with full audit trail.' },
      { q: 'Is EU AI Act compliance actually enforced or just advisory?', a: 'It is actually enforced. RA-01 has a configurable veto threshold (default: 80/100). Content below the threshold is automatically blocked from delivery. This is not a suggestion — it is a hard gate in the pipeline.' },
      { q: 'What is the compliance score based on?', a: 'The score is a weighted composite: Art.50 transparency (30%), hallucination risk (25%), brand safety (20%), GDPR alignment (15%), and C2PA provenance verification (10%). Each dimension is evaluated independently then merged.' },
    ],
    externalLinks: [
      { label: 'EU AI Act Art.50 — EUR-Lex', href: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689' },
      { label: 'C2PA Content Provenance Standard', href: 'https://c2pa.org' },
    ],
  },

  'pm07-mission-control': {
    id: 'PM-07', name: 'Mission Control', slug: 'pm07-mission-control',
    glyph: '📅', textColor: 'text-orange-400', borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/5',
    model: 'gemini-2.0-flash', latency: '420ms', layer: 'Operations',
    cloudService: 'Cloud Run + Google Chat API',
    headline: 'Scheduling, Google Chat sync, and campaign dispatch coordination across all teams.',
    description: 'PM-07 is the operational backbone. It manages campaign timelines, milestone tracking, and team notifications via Google Chat. When a campaign is approved by RA-01, PM-07 schedules distribution, sends alerts, creates calendar entries, and coordinates cross-team delivery. It turns AI-generated content into a live operational workflow.',
    capabilities: [
      'Campaign deadline management',
      'Google Chat integration for team notifications',
      'Milestone tracking and alert dispatch',
      'Cross-agent coordination and handoff',
      'UTM parameter generation for campaign tracking',
      'Multi-channel publishing schedule',
      'Performance review triggers',
    ],
    technicalDetails: [
      { label: 'Model', value: 'gemini-2.0-flash' },
      { label: 'Latency', value: '420ms' },
      { label: 'Integrations', value: 'Google Chat API, Google Calendar API' },
      { label: 'Deployment', value: 'Cloud Run europe-west1' },
      { label: 'Scheduling', value: 'Firestore-backed job queue' },
      { label: 'Notifications', value: 'Google Chat webhooks + email' },
    ],
    examplePrompts: [
      '"Schedule our summer campaign launch for June 1. Alert team 48h before."',
      '"Generate UTM parameters for our Q2 Google Ads and LinkedIn campaigns."',
      '"Send campaign performance review to the team every Monday at 9am via Chat."',
    ],
    outputExample: 'Campaign scheduled: June 1 2026, 09:00 CET. UTM parameters generated: utm_source=linkedin&utm_medium=paid&utm_campaign=summer-sustainable-2026. Google Chat notification sent to #marketing-ops. Calendar invite created: "Campaign Launch Review" June 1, 10:00 CET.',
    relatedModules: [
      { slug: 'campaign-manager', name: 'Campaign Manager', glyph: '📣' },
      { slug: 'executive-dashboard', name: 'Executive Dashboard', glyph: '📊' },
      { slug: 'workflow-builder', name: 'Workflow Builder', glyph: '⚙' },
      { slug: 'swarm-analytics', name: 'Swarm Analytics', glyph: '📈' },
    ],
    faq: [
      { q: 'Does PM-07 connect to real Google Calendar and Chat?', a: 'Yes. PM-07 uses the Google Chat API and Google Calendar API with OAuth2 service account credentials stored in Cloud Secret Manager. Calendar invites and Chat messages are live, not simulated.' },
      { q: 'Can PM-07 manage multiple campaigns simultaneously?', a: 'Yes. PM-07 uses a Firestore-backed job queue to manage concurrent campaigns. Each campaign has its own timeline, milestones, and team assignments — all tracked independently and surfaced in the Executive Dashboard.' },
    ],
    externalLinks: [
      { label: 'Google Chat API', href: 'https://developers.google.com/chat' },
      { label: 'Google Calendar API', href: 'https://developers.google.com/calendar' },
    ],
  },
};

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
export function AgentDetailPage() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const navigate = useNavigate();
  const agent = agentSlug ? AGENTS[agentSlug] : null;

  useEffect(() => {
    if (agent) {
      document.title = `${agent.id} ${agent.name} — AGENTICUM G5 GENIUS`;
      const s = document.getElementById('jsonld-agent');
      if (!s) {
        const el = document.createElement('script');
        el.id = 'jsonld-agent';
        el.type = 'application/ld+json';
        el.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['TechArticle', 'FAQPage'],
          headline: `${agent.id} ${agent.name} — AI Agent Profile`,
          description: agent.description,
          mainEntity: agent.faq.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        });
        document.head.appendChild(el);
      }
    }
    return () => { document.getElementById('jsonld-agent')?.remove(); };
  }, [agent]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans">
        <MegaNav />
        <div className="text-center pt-32">
           <p className="font-mono text-zinc-600 text-[10px] uppercase tracking-widest mb-4">Entity not found</p>
           <h1 className="text-4xl font-light mb-8">System Error 404</h1>
          <button onClick={() => navigate('/agents')} className="text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors">← Return to Registry</button>
        </div>
      </div>
    );
  }

  const getBannerImage = (slug: string) => {
    if (slug.includes('creative') || slug.includes('design') || slug.includes('cognitive') || slug.includes('voice')) return '/assets/palmer_creative.png';
    if (slug.includes('senate') || slug.includes('mission') || slug.includes('orchestrator')) return '/assets/palmer_system.png';
    return '/assets/palmer_neural_core.png';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-white/20 font-sans">
      <MegaNav />

      {/* Hero Banner */}
      <div className="w-full h-[70vh] relative pt-16 overflow-hidden border-b border-white/4">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-transparent z-20" />
        <img src={getBannerImage(agent.slug)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.25] mix-blend-luminosity scale-105" />
        
        <div className="absolute bottom-0 left-0 w-full z-30 px-6 sm:px-12 lg:px-24 xl:px-32 pb-24 flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-6xl">
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl opacity-40 mix-blend-screen">{agent.glyph}</span>
              <div className="h-px bg-white/20 w-12" />
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.4em]">{agent.id} <span className="text-zinc-700 mx-2">/</span> {agent.layer} Layer</p>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter mb-8 text-white">{agent.name}</h1>
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl leading-snug font-light">{agent.headline}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32">
          
          {/* Left Column: Deep Context */}
          <div className="lg:col-span-7 space-y-24">
            
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">01 — Overview</p>
              <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed font-light">{agent.description}</p>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
               <div className="h-px bg-white/5 w-full mb-12" />
               <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">02 — Execution & Output</p>
               
               <div className="space-y-6 mb-12">
                  <p className="text-sm text-zinc-400 mb-4">Command Examples</p>
                  {agent.examplePrompts.map((p, i) => (
                    <div key={i} className="pl-6 border-l border-zinc-800 py-2">
                       <p className="font-mono text-sm text-zinc-300">"{p.replace(/"/g, '')}"</p>
                    </div>
                  ))}
               </div>

               <div className="bg-[#0A0A0A] border border-white/3 p-8 sm:p-12 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-6">Live Output Trace</p>
                  <p className="font-mono text-sm text-zinc-300 leading-relaxed">{agent.outputExample}</p>
               </div>
            </motion.section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
               <div className="h-px bg-white/5 w-full mb-12" />
               <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">03 — Intelligence Matrix</p>
               <div className="space-y-12">
                  {agent.faq.map((f, i) => (
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
                  {agent.externalLinks.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group w-fit">
                       <span className="font-mono text-xs text-zinc-400 group-hover:text-white transition-colors">{l.label}</span>
                       <ExternalLink size={12} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </a>
                  ))}
               </div>
            </motion.section>

          </div>

          {/* Right Column: Spec Sheet */}
          <div className="lg:col-span-5 lg:pl-12 lg:border-l border-white/5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="sticky top-32 space-y-16">
               
               <div>
                 <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Core Specifications</p>
                 <div className="space-y-4">
                   {agent.technicalDetails.map(d => (
                     <div key={d.label} className="flex justify-between items-baseline border-b border-white/2 pb-4">
                       <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">{d.label}</span>
                       <span className="font-mono text-[11px] text-white text-right ml-4">{d.value}</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div>
                 <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">System Capabilities</p>
                 <ul className="space-y-3">
                   {agent.capabilities.map(cap => (
                     <li key={cap} className="flex items-start gap-4">
                       <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-2 shrink-0" />
                       <span className="text-zinc-400 text-sm leading-relaxed">{cap}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                 <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Ecosystem Interactions</p>
                 <div className="flex flex-col gap-3">
                   {agent.relatedModules.map(m => (
                     <Link key={m.slug} to={`/modules/${m.slug}`} className="group flex items-center justify-between p-4 bg-[#0A0A0A] hover:bg-[#111] border border-white/3 transition-colors rounded-xl">
                       <div className="flex items-center gap-3">
                          <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">{m.glyph}</span>
                          <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-widest">{m.name}</span>
                       </div>
                       <ArrowRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                     </Link>
                   ))}
                 </div>
               </div>

            </motion.div>
          </div>

        </div>

        {/* Cinematic Footer / CTA */}
        <div className="mt-32 pt-24 border-t border-white/5 flex flex-col items-center justify-center text-center">
           <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-8">Protocol {agent.id} Ready</p>
           <h3 className="text-4xl sm:text-6xl font-medium tracking-tighter text-white mb-12">Initialize Sequence.</h3>
           
           <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
             <button onClick={() => navigate('/os')} className="px-12 py-5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               Enter OS Base <ArrowRight size={12} />
             </button>
             <button onClick={() => navigate('/agents')} className="px-12 py-5 border border-white/10 hover:border-white/30 text-white transition-colors font-mono text-[10px] uppercase tracking-widest">
               Registry List
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
