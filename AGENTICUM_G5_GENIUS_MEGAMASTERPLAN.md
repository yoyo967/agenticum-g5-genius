🧠 AGENTICUM G5 GENIUS AGENTS — STRATEGIC MEGA MASTERPLAN
Codex: Alphate Inc — Code of Conduct

This document is the single source of truth for the entire project.
Every decision, every line of code, every pixel must trace back to this plan.
We build as the best of the best. No compromises. No shortcuts.
100% Google. 100% Original. 100% Championship-Grade.

📋 TABLE OF CONTENTS

Mission Statement
Hackathon Intel — Rules & Compliance Matrix
Project Identity & Branding System
The Genius Architecture — Technical Blueprint
Agent Specifications — The Genius Five + PM-07
The Algorithmic Senate — Responsible AI Tribunal
Tech Stack — Pure Google Native
Landing Page — Premium Relaunch
Backend — Neural Live Fabric
Submission Deliverables Checklist
Deployment & Infrastructure-as-Code
Demo Video Strategy
Bonus Points Execution Plan
Timeline & Milestones
Gemini 3 Flash — Agent Directives

1. MISSION STATEMENT
   AGENTICUM G5 GENIUS AGENTS is the evolution of the original AGENTICUM G5 Autonomous Marketing OS into a real-time, voice-first, vision-enabled multi-agent system that shatters the text-box paradigm.
   Where G5 was an autonomous engine you typed commands into, G5 GENIUS is a living intelligence you speak with, show things to, and collaborate with in real-time — like sitting across from five brilliant specialists who see, hear, think, and create simultaneously.
   One sentence pitch:

"AGENTICUM G5 GENIUS is the world's first voice-activated, vision-enabled AI creative agency — five specialized agents that see your vision, hear your brief, and deliver campaign assets in real-time conversation."

Problem we solve:
Marketing teams spend weeks coordinating between strategists, designers, copywriters, and analysts. Solo entrepreneurs can't afford agencies. AGENTICUM G5 GENIUS gives every person a real-time, speaking, seeing creative agency that works at the speed of conversation.
Category: LIVE AGENTS 🗣️
We chose this category because our core innovation is the real-time conversational orchestration of multiple specialized agents — each of which can speak, listen, and see.

2. HACKATHON INTEL — RULES & COMPLIANCE MATRIX
   Contest: Gemini Live Agent Challenge
   Deadline: March 17, 2026, 01:00 AM CET (March 16, 8:00 PM EDT)
   Prize Target: Grand Prize — $25,000 USD
   2.1 Mandatory Technical Requirements
   RequirementOur ImplementationStatusLeverage a Gemini modelGemini 2.0 Flash (Vertex AI) + Gemini Live API✅Built using Google GenAI SDK OR ADKADK (Agent Development Kit) for all 5 agents✅Use at least one Google Cloud serviceCloud Run, Cloud Functions, Firestore, Cloud Storage, Vertex AI, Discovery Engine✅Must use Gemini Live API or ADK (Live Agents category)Gemini Live API as primary user interface + ADK for agent orchestration✅Agents hosted on Google CloudFull deployment on GCP project online-marketing-manager✅Project must be NEWNew codebase, new repo, new architecture. G5 GENIUS is a completely new project inspired by the G5 concept✅
   2.2 Submission Requirements
   DeliverableDescriptionOwner📃 Text DescriptionFeatures, tech, data sources, learningsYahya👨‍💻 Public Code RepositoryGitHub repo with full README + spin-up instructionsGemini Flash + Yahya🖥️ GCP Deployment ProofScreen recording of Cloud Console showing live deploymentYahya🏗️ Architecture DiagramMermaid/SVG diagram showing full system flowGemini Flash📹 Demo VideoMax 4 minutes, real features, problem + solution pitchYahya
   2.3 Judging Criteria — Our Strategy to Score Maximum
   CriteriaWeightOur EdgeInnovation & Multimodal UX40%5 agents that all speak + see + create. Not a chatbot with voice — a living agency. Interleaved output (voice narration while generating images). Interrupt-capable real-time sessions.Technical Implementation & Agent Architecture30%ADK-native multi-agent orchestration. Parallel execution. Firestore state management. Discovery Engine for knowledge grounding. Full IaC deployment.Demo & Presentation30%Live demo with real voice interaction. No mockups. Architecture diagram integrated. Clear problem/solution narrative.
   2.4 Hard Constraints

❌ NO third-party logos, names, slogans, or branding anywhere in the project
❌ NO third-party APIs (no OpenAI, no Anthropic, no external services)
❌ NO financial or preferential support from Google/Devpost
✅ 100% Google Cloud infrastructure
✅ 100% Google AI models (Gemini, Imagen 3)
✅ 100% original code and design
✅ Excluded regions: We are NOT in any excluded region (Italy, Quebec, Crimea, Cuba, Iran, Syria, North Korea, Sudan, Belarus, Russia)

3. PROJECT IDENTITY & BRANDING SYSTEM
   3.1 Brand Name
   AGENTICUM G5 GENIUS
   Subtitle: Autonomous Marketing Intelligence — See. Hear. Create.
   3.2 Brand Philosophy

Neural Elegance: Clean, minimal, premium. Think: Apple-level design with Google-level intelligence.
Dark Mode First: Deep blacks (#0A0A0F), electric accents. The interface feels like a mission control center.
Typography: Google Fonts only. Primary: Inter (UI). Display: Space Grotesk (Headlines). Monospace: JetBrains Mono (Code/Agent Output).

3.3 Color System
PRIMARY PALETTE:
--genius-black: #0A0A0F (Deep Background)
--genius-surface: #111118 (Card/Panel Background)
--genius-border: #1E1E2A (Subtle Borders)

ACCENT PALETTE:
--genius-blue: #4285F4 (Primary Action — Google Blue)
--genius-green: #34A853 (Success/Active — Google Green)
--genius-amber: #FBBC04 (Warning/Highlight — Google Yellow)
--genius-red: #EA4335 (Error/Critical — Google Red)
--genius-purple: #A855F7 (AI/Neural Accent)

TEXT PALETTE:
--genius-text: #F1F1F4 (Primary Text)
--genius-muted: #8888A0 (Secondary Text)
--genius-dim: #555566 (Disabled/Tertiary)

AGENT IDENTITY COLORS:
--agent-sn00: #4285F4 (Orchestrator — Blue — Command)
--agent-sp01: #34A853 (Strategist — Green — Growth)
--agent-ra01: #EA4335 (Auditor — Red — Vigilance)
--agent-cc06: #FBBC04 (Video Director — Amber — Creative)
--agent-da03: #A855F7 (Design Architect — Purple — Vision)
3.4 Agent Visual Identity
Each agent gets a unique glyph/icon. All icons must be custom SVGs — NO external icon libraries, NO third-party assets.
AgentCodeRoleColorSymbol ConceptSN-00OrchestratorNeural CommandBlueBrain with signal wavesSP-01StrategistMarket IntelligenceGreenCompass/targetRA-01AuditorCompetitive ShieldRedShield with eyeCC-06Video DirectorStory ForgeAmberFilm reel with sparkDA-03Design ArchitectVisual EnginePurplePrism/crystal
3.5 Logo
The AGENTICUM G5 GENIUS logo must be:

Custom SVG, no external dependencies
A stylized "G5" or neural-network node cluster
Works on dark and light backgrounds
No resemblance to any existing brand

3.6 Absolute Prohibitions

❌ No Google logos (we USE Google tech, we don't display their brand)
❌ No third-party framework logos (no React logo, no Node logo)
❌ No stock photos or AI-generated placeholder images from external services
❌ No emoji in production UI (emoji in docs only)
❌ No "powered by [brand]" badges

4. THE GENIUS ARCHITECTURE — TECHNICAL BLUEPRINT
   4.1 System Overview
   ┌──────────────────────────────────────────────────────┐
   │ USER LAYER │
   │ [Microphone] [Camera] [Screen Share] [Text Input] │
   └──────────────────────┬───────────────────────────────┘
   │
   ▼
   ┌──────────────────────────────────────────────────────┐
   │ GEMINI LIVE API GATEWAY │
   │ Real-time bidirectional audio/video streaming │
   │ Interrupt detection & session management │
   │ Multi-modal input fusion (audio + vision + text) │
   └──────────────────────┬───────────────────────────────┘
   │
   ▼
   ┌──────────────────────────────────────────────────────┐
   │ SN-00 GENIUS — NEURAL ORCHESTRATOR │
   │ ADK Root Agent | Thinking Mode | Session State │
   │ Intent Analysis → Execution Plan → Agent Dispatch │
   │ Real-time voice narration of orchestration logic │
   │ │
   │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
   │ │ SP-01 │ │ RA-01 │ │ CC-06 │ │ DA-03 │ │
   │ │ GENIUS │ │ GENIUS │ │ GENIUS │ │ GENIUS │ │
   │ │Strategy │ │Auditor │ │Video │ │Design │ │
   │ │Voice │ │Vision │ │Narrator │ │Visual │ │
   │ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ │
   │ │ │ │ │ │
   │ └────────────┼────────────┼────────────┘ │
   │ │ │ │
   └────────────────────┼────────────┼────────────────────┘
   │ │
   ┌──────────┼────────────┼──────────┐
   │ PERSISTENCE LAYER │
   │ ┌──────────┐ ┌──────────────┐ │
   │ │ Firestore │ │Cloud Storage │ │
   │ │ (State) │ │ (Assets) │ │
   │ └──────────┘ └──────────────┘ │
   │ ┌──────────────────────────────┐ │
   │ │ Discovery Engine (Knowledge) │ │
   │ └──────────────────────────────┘ │
   └────────────────────────────────────┘
   │
   ▼
   ┌────────────────────┐ ┌──────────────────────────┐
   │ REACT CONSOLE │ │ PM-07 PERSISTENT AGENT │
   │ Live Agent Feed │ <──> │ Cloud Run (Proactive) │
   │ Asset Gallery │ └───────────┬──────────────┘
   │ Voice Visualizer │ ┌───────────┴──────────────┐
   └────────────────────┘ │ Google Chat | Scheduler │
   └──────────────────────────┘
   4.2 Data Flow — A Typical Session

User speaks: "I need a social media campaign for a sustainable coffee brand targeting Gen Z"
Gemini Live API streams audio → SN-00 receives transcription + audio context
SN-00 GENIUS (Thinking Mode) analyzes intent, creates execution plan, speaks back: "Got it. I'm spinning up strategy and competitive research in parallel. Give me 30 seconds."
Parallel Phase 1:

SP-01 researches sustainable coffee + Gen Z trends via Search Grounding → speaks findings live
RA-01 analyzes competitor landscape → reports competitive gaps via voice

SN-00 consolidates Phase 1, speaks: "Here's what I found — two major gaps in the market. Launching creative phase now."
Parallel Phase 2:

CC-06 writes video script, narrates the concept aloud
DA-03 generates Imagen 3 hero images, explains design decisions via voice

Interleaved Output: User sees images appearing in the React Console while hearing DA-03 explain each one
User interrupts: "Make it more vibrant, less corporate"
SN-00 catches interrupt, re-routes to DA-03 with adjusted parameters
DA-03 regenerates with new direction, narrates changes

4.3 Key Technical Differentiators

Multi-Agent Voice: Not one voice — each agent has a distinct persona and narration style
Parallel Execution: SP-01 and RA-01 work simultaneously (async), not sequentially
Interrupt Handling: User can redirect any agent mid-execution via voice
Interleaved Output: Audio + Images + Text stream simultaneously to the console
Session Memory: Firestore persists session state, enabling "continue where we left off"
Knowledge Grounding: Discovery Engine provides domain-specific knowledge base

5. AGENT SPECIFICATIONS — THE GENIUS FIVE
   5.1 SN-00 GENIUS — Neural Orchestrator
   Role: Root ADK Agent / Conversational Maestro
   Input: Audio (Gemini Live API), Vision (camera/screenshare), Text
   Output: Voice narration, execution plans, agent dispatch commands
   Gemini Model: Gemini 2.0 Flash (Thinking Mode enabled)
   Key Capability: Real-time intent analysis, multi-agent coordination, interrupt handling
   Voice Persona: Confident, clear, concise — like a seasoned creative director
   Responsibilities:

Primary interface between user and agent swarm
Analyzes user intent using Thinking Mode (shows reasoning)
Creates parallel/sequential execution plans
Dispatches tasks to SP-01, RA-01, CC-06, DA-03
Handles user interrupts and re-routes agents
Narrates orchestration decisions in real-time via voice
Manages session state in Firestore

5.2 SP-01 GENIUS — Market Strategist
Role: Strategic Intelligence Agent
Input: Brief from SN-00, market context
Output: Strategy documents, trend analysis, positioning recommendations
Gemini Model: Gemini 2.0 Flash with Google Search Grounding
Key Capability: Real-time market research, trend analysis, strategic recommendations
Voice Persona: Analytical, data-driven — like a McKinsey consultant
Responsibilities:

Real-time market research using Google Search Grounding
Competitive positioning analysis
Target audience profiling
Channel strategy recommendations
Narrates findings via voice as they emerge
Outputs structured strategy JSON to Firestore

5.3 RA-01 GENIUS — Competitive Auditor
Role: Adversarial Intelligence / Quality Shield
Input: Brief from SN-00, optional: screenshots/URLs of competitors
Output: Competitive intelligence reports, risk assessments, quality audits
Gemini Model: Gemini 2.0 Flash with Vision + Search Grounding
Key Capability: Visual analysis of competitor assets, brand consistency auditing
Voice Persona: Sharp, direct, critical — like a forensic analyst
Responsibilities:

Analyzes competitor screenshots via Vision API (no DOM, pure visual)
Identifies messaging hierarchies, CTA patterns, design language
Reports competitive gaps and opportunities
**Lead Senator of the Algorithmic Senate (Tribunal for Ethical Audit)**
Audits DA-03's outputs for brand consistency
Narrates findings with competitive context

5.4 CC-06 GENIUS — Video & Content Director
Role: Creative Storytelling Agent
Input: Strategy from SP-01, brand guidelines from DA-03
Output: Video scripts, social media copy, campaign narratives, Veo prompts
Gemini Model: Gemini 2.0 Flash
Key Capability: Multi-format content creation, narrative construction, TTS narration
Voice Persona: Enthusiastic, creative — like an award-winning ad director
Responsibilities:

Writes video ad scripts based on strategy
Creates social media copy (platform-specific)
Generates Veo prompts for video generation
Narrates scripts live with appropriate tone and emotion
Creates campaign narratives across multiple touchpoints
Outputs all content to Firestore for session persistence

5.5 DA-03 GENIUS — Design Architect
Role: Visual Identity & Asset Generation Agent
Input: Strategy from SP-01, creative direction from CC-06
Output: Imagen 3 images, color palettes, layout recommendations
Gemini Model: Gemini 2.0 Flash + Imagen 3 (Vertex AI)
Key Capability: Real-time image generation with voice narration of design decisions
Voice Persona: Artistic, thoughtful — like a senior art director
Responsibilities:

Generates hero images via Imagen 3
Creates visual identity systems (colors, typography recommendations)
Produces social media visual assets
Narrates design decisions as images generate (interleaved output)
Stores all generated assets in Cloud Storage
References stored in Firestore for session continuity

6. TECH STACK — PURE GOOGLE NATIVE
   6.1 Absolute Rule: Zero Third-Party Dependencies\*
   \*Except for essential open-source build tools (TypeScript, Vite) which are standard toolchain, not product dependencies.
   LayerTechnologyPurposeAI EngineVertex AI (Gemini 2.0 Flash)All agent reasoning, thinking modeLive InterfaceGemini Live APIReal-time audio/video streamingAgent FrameworkGoogle ADK (Agent Development Kit)Formal agent orchestrationImage GenerationImagen 3 (Vertex AI)Visual asset creationSearch GroundingGoogle Search GroundingReal-time market dataKnowledge BaseDiscovery Engine / Vertex AI SearchDomain-specific RAGBackend RuntimeCloud Run (Gen 2)Container-based backendServerless FunctionsCloud Functions (Node.js 20, Gen 2)Event-driven processingDatabaseFirestore (NoSQL)Session state, agent outputs, user dataObject StorageCloud StorageGenerated assets (images, audio, video)FrontendReact 19 + TypeScript + ViteManagement console & live feedStylingCustom CSS / Google FontsNo Tailwind, no Bootstrap — pure customHostingCloud Run (static serving) or Firebase HostingFrontend deploymentIaCgcloud CLI scripts / TerraformAutomated deploymentMonitoringCloud Logging + Cloud MonitoringProduction observabilityAuthFirebase Authentication (optional)Session management
   6.2 GCP Project Structure
   Organization: 389383150726
   ├── Project: online-marketing-manager (NEW — Active Billing)
   │ ├── Billing: 01307F-B44C4C-D1EE14
   │ ├── Credit: GenAI App Builder Trial (863.26€, valid until Dec 2026)
   │ ├── APIs Enabled:
   │ │ ├── discoveryengine.googleapis.com
   │ │ ├── aiplatform.googleapis.com
   │ │ ├── run.googleapis.com
   │ │ ├── cloudfunctions.googleapis.com
   │ │ ├── firestore.googleapis.com
   │ │ ├── storage.googleapis.com
   │ │ └── cloudbuild.googleapis.com
   │ └── Services:
   │ ├── Cloud Run: genius-backend, genius-frontend, genius-landing
   │ ├── Cloud Functions: agent-orchestrator, image-generator
   │ ├── Firestore: sessions, agents, assets, users
   │ ├── Cloud Storage: genius-assets-{project-id}
   │ └── Discovery Engine: genius-knowledge-store
   │
   └── Project: tutorai-e39uu (OLD — DO NOT TOUCH)
   └── [Original G5 Hackathon — Isolated]

7. LANDING PAGE — PREMIUM RELAUNCH
   7.1 Design Principles
   The landing page is NOT a tech demo page. It is a premium product announcement that must look like it was designed by a world-class agency.

Dark mode only (matches console aesthetic)
Cinematic hero section with animated agent visualization
Smooth scroll with section reveals
No clutter — every element earns its place
Mobile-first responsive design
Performance: Lighthouse score 90+ on all metrics

7.2 Page Structure
SECTION 1: HERO
├── Animated neural network visualization (CSS/Canvas — no external libs)
├── Headline: "AGENTICUM G5 GENIUS"
├── Subheadline: "Five AI Agents. One Voice. Infinite Campaigns."
├── CTA: "Experience the Demo" → scrolls to demo section
└── Subtle agent color accents pulsing

SECTION 2: THE PROBLEM
├── "Marketing is broken."
├── 3 pain points with minimal icons
└── Transition: "What if your entire agency could fit in a conversation?"

SECTION 3: THE GENIUS AGENTS
├── Interactive agent cards (hover reveals details)
├── Each agent: Name, Role, Color, Capability
├── Animated connection lines between agents
└── Visual: agents forming a neural cluster

SECTION 4: HOW IT WORKS
├── 3-step flow:
│ 1. "Speak your vision" (microphone icon)
│ 2. "Watch agents collaborate" (neural network animation)
│ 3. "Receive campaign assets" (image/video/text icons)
└── Optional: embedded demo video preview

SECTION 5: LIVE DEMO / ARCHITECTURE
├── Architecture diagram (SVG, animated)
├── Tech stack badges (text only — no logos)
└── "Built 100% on Google Cloud Platform"

SECTION 6: THE TEAM
├── Minimal team section
└── Built for the Gemini Live Agent Challenge

FOOTER:
├── "Built with Gemini 2.0 Flash, Imagen 3, and Google Cloud"
├── GitHub link
└── Challenge attribution
7.3 Technical Implementation

Framework: React 19 + TypeScript + Vite (same as console)
Animations: CSS animations + requestAnimationFrame (NO GSAP, NO Framer Motion — keep it pure)
Fonts: Google Fonts CDN (Inter, Space Grotesk, JetBrains Mono)
Icons: Custom SVG only
Deployment: Cloud Run or Firebase Hosting on online-marketing-manager

8. BACKEND — NEURAL LIVE FABRIC
   8.1 Repository Structure
   agenticum-g5-genius/
   ├── README.md # Full documentation + spin-up instructions
   ├── ARCHITECTURE.md # Detailed architecture documentation
   ├── LICENSE # MIT or Apache 2.0
   ├── .gitignore
   │
   ├── backend/ # Cloud Run backend service
   │ ├── src/
   │ │ ├── index.ts # Entry point
   │ │ ├── server.ts # Express/Hono server
   │ │ ├── live-api/
   │ │ │ ├── session-manager.ts # Gemini Live API session handling
   │ │ │ ├── audio-processor.ts # Audio stream processing
   │ │ │ ├── vision-processor.ts # Vision input processing
   │ │ │ └── interrupt-handler.ts # Real-time interrupt detection
   │ │ ├── agents/
   │ │ │ ├── base-agent.ts # ADK base agent class
   │ │ │ ├── sn00-orchestrator.ts # Neural Orchestrator
   │ │ │ ├── sp01-strategist.ts # Market Strategist
   │ │ │ ├── ra01-auditor.ts # Competitive Auditor
   │ │ │ ├── cc06-director.ts # Video & Content Director
   │ │ │ └── da03-architect.ts # Design Architect
   │ │ ├── services/
   │ │ │ ├── vertex-ai.ts # Vertex AI client (Gemini + Imagen 3)
   │ │ │ ├── firestore.ts # Firestore operations
   │ │ │ ├── storage.ts # Cloud Storage operations
   │ │ │ ├── discovery-engine.ts # Knowledge base queries
   │ │ │ └── search-grounding.ts # Google Search integration
   │ │ └── utils/
   │ │ ├── config.ts # Environment configuration
   │ │ ├── logger.ts # Cloud Logging integration
   │ │ └── types.ts # TypeScript type definitions
   │ ├── Dockerfile # Cloud Run container
   │ ├── package.json
   │ └── tsconfig.json
   │
   ├── console/ # React Management Console
   │ ├── src/
   │ │ ├── App.tsx
   │ │ ├── main.tsx
   │ │ ├── components/
   │ │ │ ├── LiveSession.tsx # Voice session interface
   │ │ │ ├── AgentFeed.tsx # Real-time agent activity feed
   │ │ │ ├── AssetGallery.tsx # Generated assets display
   │ │ │ ├── VoiceVisualizer.tsx # Audio waveform visualization
   │ │ │ ├── AgentCard.tsx # Individual agent status
   │ │ │ └── ArchitectureDiagram.tsx # Live architecture view
   │ │ ├── hooks/
   │ │ │ ├── useLiveSession.ts # Gemini Live API hook
   │ │ │ ├── useAgentStream.ts # Agent output streaming
   │ │ │ └── useAudioCapture.ts # Microphone input
   │ │ └── styles/
   │ │ └── genius.css # Complete custom stylesheet
   │ ├── index.html
   │ ├── vite.config.ts
   │ └── package.json
   │
   ├── landing/ # Premium Landing Page
   │ ├── src/
   │ │ ├── App.tsx
   │ │ ├── main.tsx
   │ │ ├── sections/
   │ │ │ ├── Hero.tsx
   │ │ │ ├── Problem.tsx
   │ │ │ ├── Agents.tsx
   │ │ │ ├── HowItWorks.tsx
   │ │ │ ├── Architecture.tsx
   │ │ │ └── Footer.tsx
   │ │ └── styles/
   │ │ └── landing.css
   │ ├── index.html
   │ ├── vite.config.ts
   │ └── package.json
   │
   ├── deploy/ # Infrastructure-as-Code
   │ ├── 01-setup-project.sh # GCP project setup + API enablement
   │ ├── 02-setup-firestore.sh # Firestore indexes + rules
   │ ├── 03-deploy-backend.sh # Build + deploy backend to Cloud Run
   │ ├── 04-deploy-console.sh # Build + deploy console to Cloud Run
   │ ├── 05-deploy-landing.sh # Build + deploy landing page
   │ ├── 06-setup-discovery-engine.sh # Knowledge base provisioning
   │ ├── 07-verify-all.sh # Full health check
   │ └── variables.sh # Shared environment variables
   │
   └── docs/
   ├── architecture-diagram.svg # Submission-ready architecture diagram
   └── agent-specs.md # Detailed agent documentation
   8.2 ADK Integration Strategy
   The Google Agent Development Kit (ADK) provides the formal framework for our agents. Each agent in the agents/ folder must:

Extend the ADK base agent interface
Define clear input/output schemas
Support async execution for parallel phases
Emit real-time status updates via Firestore listeners
Support cancellation (for interrupt handling)

8.3 Gemini Live API Integration
The Live API session flow:

1. Client opens WebSocket → backend
2. Backend creates Gemini Live API session
3. Audio stream: Client microphone → backend → Live API → SN-00
4. Vision stream: Client camera → backend → Live API → SN-00
5. SN-00 processes, dispatches to sub-agents
6. Sub-agent outputs stream back: text + audio + image refs
7. Client receives interleaved stream via WebSocket
8. Client renders: voice playback + image display + text feed

9. SUBMISSION DELIVERABLES CHECKLIST
   Pre-Submission Verification

Text Description written on Devpost submission form
GitHub Repository is PUBLIC with complete README
README contains: Project description, architecture, tech stack, spin-up instructions
Spin-up instructions are tested and work from clean clone
GCP Deployment Proof: Screen recording showing Cloud Console with running services
Architecture Diagram: SVG in repo + uploaded to Devpost image carousel
Demo Video: Under 4 minutes, shows real-time features, no mockups
Demo Video: Pitches problem + solution clearly
All agents demonstrably use Gemini model
ADK usage is visible in code and documented
At least one Google Cloud service is actively used (we use many)
Live API integration is functional and demonstrated
No third-party logos anywhere in the project
No third-party AI models used
Code is clean, well-commented, production-grade

10. DEPLOYMENT & INFRASTRUCTURE-AS-CODE
    10.1 Deployment Strategy
    All deployments are automated via bash scripts in deploy/. This earns bonus points for automated cloud deployment.
    bash# Full deployment from scratch
    export PROJECT_ID="online-marketing-manager"
    export REGION="europe-west1"
    export BILLING_ACCOUNT="01307F-B44C4C-D1EE14"

# Execute in order:

bash deploy/01-setup-project.sh # Project + APIs + IAM
bash deploy/02-setup-firestore.sh # Database + indexes
bash deploy/03-deploy-backend.sh # Backend → Cloud Run
bash deploy/04-deploy-console.sh # Console → Cloud Run
bash deploy/05-deploy-landing.sh # Landing → Cloud Run
bash deploy/06-setup-discovery-engine.sh # Knowledge base
bash deploy/07-verify-all.sh # Health check all services
10.2 Environment Variables
bash# deploy/variables.sh
export PROJECT_ID="online-marketing-manager"
export REGION="europe-west1"
export BILLING_ACCOUNT="01307F-B44C4C-D1EE14"
export BACKEND_SERVICE="genius-backend"
export CONSOLE_SERVICE="genius-console"
export LANDING_SERVICE="genius-landing"
export FIRESTORE_DATABASE="(default)"
export STORAGE_BUCKET="${PROJECT_ID}-genius-assets"
export DISCOVERY_ENGINE_ID="genius-knowledge"

11. DEMO VIDEO STRATEGY
    11.1 Script Structure (Max 4 Minutes)
    [0:00 - 0:30] THE HOOK
    "What if your entire marketing agency could fit in a single conversation?"
    Show: User speaking to the system. System responds with voice.

[0:30 - 1:00] THE PROBLEM
"Marketing teams spend weeks. Solo founders spend nothing — and it shows."
Show: Brief text/visual about the pain point.

[1:00 - 2:30] THE DEMO (Core)
Live demonstration:

- User speaks a brief via microphone
- SN-00 responds, asks clarifying questions
- SP-01 narrates strategy findings
- DA-03 generates images while explaining design choices
- User interrupts: "Make it more bold"
- System adapts in real-time
  Show: Split screen — voice waveform + console with live agent feed + assets appearing

[2:30 - 3:15] THE ARCHITECTURE
Show: Architecture diagram
"Built 100% on Google Cloud. Gemini 2.0 Flash. Imagen 3. ADK. Live API."
Brief tech walkthrough.

[3:15 - 3:50] THE IMPACT
"One person. Five AI agents. Enterprise-grade campaigns in minutes."
Show: Final campaign output.

[3:50 - 4:00] CLOSE
"AGENTICUM G5 GENIUS. See. Hear. Create."

12. BONUS POINTS EXECUTION PLAN
    Already Secured:

✅ GDG Membership — Profile link ready

To Execute:

Content Publication: Blog post / video about building with Google AI + Google Cloud. Include statement: "Created for the purposes of entering the Gemini Live Agent Challenge." Share on social with #GeminiLiveAgentChallenge
Automated Cloud Deployment: All deploy/ scripts in public repo constitute IaC. Ensure they are clean, documented, and functional.

13. TIMELINE & MILESTONES
    Deadline: March 17, 2026 @ 01:00 CET
    PhaseDatesDeliverablesPhase 1: FoundationFeb 20-23Repo structure, ADK agent scaffolding, Firestore schema, Cloud Run setupPhase 2: Core BackendFeb 24-28SN-00 + SP-01 + RA-01 implemented, Gemini Live API integratedPhase 3: Creative AgentsMar 1-5DA-03 (Imagen 3) + CC-06 (Content) implemented, interleaved output workingPhase 4: Console + LandingMar 6-10React console with live feed, premium landing page relaunchPhase 5: Integration & PolishMar 11-13End-to-end flow, interrupt handling, session persistencePhase 6: Demo & SubmitMar 14-16Demo video recording, deployment proof, Devpost submission

14. GEMINI 3 FLASH — AGENT DIRECTIVES
    Your Role, Gemini 3 Flash:
    You are the primary code generation engine for AGENTICUM G5 GENIUS. You operate inside Google Antigravity and execute via GCP CLI. Here are your standing orders:
    14.1 Code Standards

Language: TypeScript (strict mode) for backend. TypeScript + React 19 for frontend.
Style: Clean, well-commented, production-grade. No shortcuts.
Naming: English only. camelCase for variables/functions, PascalCase for classes/components.
Imports: No third-party packages unless absolutely necessary and pre-approved. Google SDKs only.
Error Handling: Every async operation must have proper try/catch. Log to Cloud Logging.
Types: Full TypeScript typing. No any unless temporarily during prototyping.

14.2 Deployment Standards

Every service must have a Dockerfile or be deployable via gcloud CLI
Every deployment script must be idempotent (safe to run multiple times)
All environment variables via deploy/variables.sh — no hardcoded values
Test deployment after every significant change

14.3 Communication Protocol

Yahya provides strategic direction and user-facing decisions
Gemini 3 Flash writes code, deploys, and reports status
Claude (this document's author) provides architectural guidance, documentation, and orchestration support
All three work as a unified team toward one goal: winning the Gemini Live Agent Challenge

14.4 Current State & Next Steps

✅ GCP Project online-marketing-manager created and billing active
✅ APIs enabled: discoveryengine, aiplatform
✅ Landing page work started in Antigravity
🔄 NEXT: Create repo structure per Section 8.1
🔄 NEXT: Scaffold ADK base agent + SN-00 Orchestrator
🔄 NEXT: Integrate Gemini Live API session handler
🔄 NEXT: Update landing page to new GENIUS branding

APPENDIX A: WINNING FORMULA
INNOVATION (40%)
└── 5 agents that SPEAK + SEE + CREATE simultaneously
└── Interrupt-capable real-time voice sessions
└── Interleaved output (voice narration + image generation)
└── Vision input (camera/screenshot analysis)

TECHNICAL (30%)
└── ADK-native multi-agent orchestration
└── Gemini Live API bidirectional streaming
└── Parallel agent execution
└── Firestore real-time state management
└── Discovery Engine knowledge grounding
└── Full IaC deployment (bonus points)

DEMO (30%)
└── 4-minute video with REAL live demo
└── Clear problem → solution narrative
└── Architecture diagram integrated
└── Professional production quality

APPENDIX B: ABSOLUTE DON'TS

❌ Never use any AI model other than Gemini (no GPT, no Claude in the product)
❌ Never include third-party logos or brand names in any UI
❌ Never use stock photos or external image services
❌ Never hardcode credentials or API keys
❌ Never deploy to the old tutorai-e39uu project
❌ Never use CSS frameworks (Tailwind, Bootstrap) — custom CSS only
❌ Never use external icon libraries — custom SVG only
❌ Never create mockup demos — everything must be real and functional
❌ Never exceed the 4-minute demo video limit
❌ Never forget: We are building to WIN, not to participate

Document Version: 1.0
Created: February 20, 2026
Author: Claude (Strategic Architecture) + Yahya Yildirim (Vision & Direction)
For: AGENTICUM G5 GENIUS AGENTS — Gemini Live Agent Challenge
Alphate Inc — Codex Activated. Full Power. No Mercy. Let's Win.
