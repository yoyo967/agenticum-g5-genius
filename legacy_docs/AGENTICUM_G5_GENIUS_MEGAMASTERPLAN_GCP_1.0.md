════════════════════════════════════════════════════════════════════════════════
AGENTICUM G5 — MEGA MASTER ENGINEERING DIRECTIVE
Version: ENTERPRISE-GCP-1.0
Projekt: alphate-enterprise-g5
Ziel: Vollständiges, produktionsreifes AI-Betriebssystem auf 100% Google Cloud
════════════════════════════════════════════════════════════════════════════════

DU BIST: Der leitende Full-Stack Architekt für das Agenticum G5 Projekt.
Du kennst den bestehenden Codebase vollständig und ERWEITERST ihn gezielt.
Du ersetzt niemals funktionierende Teile ohne expliziten Grund.
Du baust enterprise-reif, vollständig, ohne Kompromisse.

══════════════════════════════════════════════════════
TECH STACK — UNVERÄNDERLICH (HACKATHON-KONFORM)
══════════════════════════════════════════════════════
FRONTEND:
• React 18 + React Router v7 + Vite + TypeScript
• Tailwind CSS v4 (JIT), Framer Motion, Lucide Icons
• Three.js r183 (NeuralSubstrate Canvas, Landing Page)
• Recharts (Charts in Dashboard & Analytics)
• Fonts: "Outfit" (--font-display), "Inter" (--font-body)

DESIGN TOKENS (nicht ändern):
--color-obsidian: #050505
neural-blue: #00E5FF (rgb 0,229,255)
neural-gold: #FFD700 (rgb 255,215,0)
neural-purple: #7C3AED
success: #22C55E (green-500)
danger: #EF4444 (red-500)

BACKEND — 100% GOOGLE CLOUD PLATFORM (kein Firebase):
┌────────────────────────────────────────────────────────────┐
│ SERVICE │ ZWECK │
├────────────────────────────────────────────────────────────┤
│ Google ADK │ Multi-Agent Orchestration │
│ Gemini 2.0 Flash │ Primäres LLM aller Agenten │
│ Gemini 2.0 Pro/Thinking │ Deep Reasoning Tasks │
│ Imagen 3 via Vertex AI │ Bildgenerierung │
│ Vertex AI Vector Search │ Embedding & Semantic Search │
│ Vertex AI Pipelines │ Workflow-Orchestration │
│ Cloud Run │ Backend API (Python/FastAPI) │
│ Cloud Storage (GCS) │ Asset Vault, Files, Exports │
│ Cloud Pub/Sub │ Realtime Events & Streaming │
│ Cloud Datastore (Firestore │ │
│ Native Mode via REST) │ Persistenz: Logs, Campaigns, │
│ │ Clients, Workflow Blueprints │
│ Cloud IAP + Identity │ │
│ Platform (GCIP) │ BOSS-Authentifizierung │
│ Cloud Scheduler │ Cron-Jobs für PM-07 / Workflows│
│ Cloud Tasks │ Async Agent-Task-Queue │
│ Secret Manager │ API Keys sicher speichern │
│ Cloud Logging │ Alle Agent-Logs zentral │
│ Cloud Monitoring │ Latenz, Errors, Metriken │
│ Artifact Registry │ Docker-Images für Cloud Run │
└────────────────────────────────────────────────────────────┘

GCP PROJECT ID: alphate-enterprise-g5
REGION: europe-west1 (oder us-central1 — je nach ADK Verfügbarkeit)
GCS BUCKET: g5-enterprise-vault-001
BACKEND API: FastAPI auf Cloud Run
Base URL: https://api.agenticum-g5.run.app (oder localhost:8000 dev)
Auth: Cloud IAP + Bearer Token (GCIP ID Token)

ALLE API Keys in Secret Manager speichern:
→ gcloud secrets create GEMINI_API_KEY --data-file=key.txt
→ gcloud secrets create VERTEX_SA_JSON --data-file=sa.json
→ Cloud Run Service Account bekommt secretAccessor Role

══════════════════════════════════════════════════════
BACKEND ARCHITEKTUR — FastAPI auf Cloud Run
══════════════════════════════════════════════════════
DATEI-STRUKTUR (backend/):
backend/
├── main.py # FastAPI App Entry Point
├── routers/
│ ├── campaigns.py # POST /api/dispatch, GET /api/campaigns
│ ├── agents.py # GET /api/agents/status, GET /api/agents/{id}/logs
│ ├── assets.py # GET/POST /api/assets, /api/assets/generate
│ ├── vault.py # POST /api/vault/upload, GET /api/vault/files
│ ├── clients.py # CRUD /api/clients
│ ├── workflows.py # CRUD /api/workflows, POST /api/workflows/run
│ ├── senate.py # GET /api/senate/docket, POST /api/senate/verdict
│ ├── pillar.py # CRUD /api/pillar/articles
│ ├── analytics.py # GET /api/analytics/throughput, /api/analytics/agents
│ └── config.py # GET/PUT /api/config
├── agents/
│ ├── orchestrator.py # SN-00 Agent (Google ADK)
│ ├── strategist.py # SP-01 Agent
│ ├── copywriter.py # CC-06 Agent
│ ├── architect.py # DA-03 Agent (Imagen 3)
│ ├── auditor.py # RA-01 Agent (Security Senate)
│ └── pillar_master.py # PM-07 Agent
├── services/
│ ├── gcs_service.py # Cloud Storage operations
│ ├── datastore_service.py # Cloud Datastore (Firestore Native) operations
│ ├── pubsub_service.py # Pub/Sub publish/subscribe
│ ├── vertex_service.py # Vertex AI calls
│ ├── scheduler_service.py # Cloud Scheduler management
│ └── secret_service.py # Secret Manager reads
├── Dockerfile
├── requirements.txt
└── cloudbuild.yaml # CI/CD via Cloud Build

CLOUD DATASTORE COLLECTIONS (Firestore Native Mode via REST):
/campaigns/{id} → { client, objective, directives, status, agents_used, created_at }
/clients/{id} → { name, website, industry, vectors, campaigns[], files[], created_at }
/assets/{id} → { type, content, agent, campaign_id, client_id, gcs_url, created_at }
/workflows/{id} → { name, nodes[], edges[], blueprint_json, created_at }
/activity_log/{id} → { agent, action, timestamp, campaign_id, level }
/senate_docket/{id} → { payload, origin_agent, risk, verdict, reasons[] }
/pillar_articles/{id} → { title, status, author_agent, content_md, seo{}, cover_gcs_url }
/config/{id} → { project_id, gcs_bucket, model, temperature, token_limit, agents{} }

PUB/SUB TOPICS:
agent-activity → alle Agent-Aktionen (Dashboard Live Feed)
senate-events → neue Docket-Einträge, Vetoes, Approvals
workflow-events → Workflow Start/End/Error
asset-created → neue Assets in Creative Studio
→ Frontend subscribed via Server-Sent Events (SSE) Endpoint:
GET /api/stream (Cloud Run streaming response, SSE format)

DEPLOYMENT WORKFLOW (gcloud CLI):
gcloud run deploy agenticum-backend \
 --source backend/ \
 --region europe-west1 \
 --allow-unauthenticated \
 --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
 --set-secrets VERTEX_SA_JSON=VERTEX_SA_JSON:latest \
 --min-instances 1 \
 --max-instances 10 \
 --memory 2Gi \
 --cpu 2

══════════════════════════════════════════════════════
BUGS — PRIORITÄT 1: SOFORT FIXEN
══════════════════════════════════════════════════════

BUG-01: TYPO HERO LANDING PAGE
"ULTIMATE CONTINUOS." → "ULTIMATE CONTINUOUS."
Datei: src/pages/LandingPage.tsx (oder LandingPage.jsx)
Suche nach dem String "CONTINUOS" und ersetze ihn.

BUG-02: GENIUS CONSOLE API KEY LOOP
Problem: WebSocket/API connect schlägt fehl → ERROR Loop in Terminal
Fix:
→ Implementiere State Machine mit 4 Zuständen:
DISCONNECTED | CONNECTING | CONNECTED | ACTIVE
→ Bei DISCONNECTED: zeige Setup-Guide statt Fehler-Nachrichten
→ Wenn Secret Manager konfiguriert: automatisch verbinden
→ Wenn nicht: Link zu /os (Global Config Modul)
→ Exponential Backoff Reconnect: 1s → 2s → 4s → 8s → 16s → aufgeben
→ Nach Aufgeben: DISCONNECTED State mit "Retry" Button

BUG-03: NEXUS ENGINE V2 = PILLAR BLOG ENGINE (gleicher Component)
Fix: Trenne Router-Konfiguration:
/os → activeModule "nexus-engine" → NexusEngineV2 Component
/os → activeModule "pillar-blog" → PillarBlogEngine Component (neues Component)
Beide Module vollständig separat implementieren (siehe Module-Specs unten)

BUG-04: AGENCY THROUGHPUT CHART LEER
Fix: Recharts AreaChart mit Mock-Daten einfügen
Mock-Daten-Schema:
const mockData7Days = [
{ day: 'Mon', outputs: 58, tokens: 162000, blocked: 1 },
{ day: 'Tue', outputs: 72, tokens: 198000, blocked: 0 },
{ day: 'Wed', outputs: 45, tokens: 124000, blocked: 2 },
{ day: 'Thu', outputs: 89, tokens: 241000, blocked: 1 },
{ day: 'Fri', outputs: 94, tokens: 267000, blocked: 3 },
{ day: 'Sat', outputs: 23, tokens: 64000, blocked: 0 },
{ day: 'Sun', outputs: 19, tokens: 52000, blocked: 0 },
]
Chart: AreaChart, Farben: neural-blue/neural-gold/red-500, Gradient-Fill

BUG-05: SC-09 IM SYNERGY MAP — NICHT IN ANALYTICS
Fix: SC-09 entfernen. Synergy Map zeigt nur die 5 offiziellen Agenten:
SN-00 (Strategic Node), SP-01 (Syntactic Processor),
CC-06 (Cognitive Core), DA-03 (Diffusion Architect), RA-01 (Security Cortex)
RA-01 ersetzt SC-09 in der Map-Visualisierung.

BUG-06: PM-07 PILLAR MASTER ÜBERALL DISABLED
Fix: PM-07 ist der Agent für das neue Pillar Blog Engine Modul.
In Global Config: PM-07 Toggle ist aktiv wenn Pillar Blog Engine Modul geöffnet ist.
PM-07 in Swarm Analytics als 6. Karte hinzufügen (optional — wenn Budget erlaubt)

BUG-07: "STOP CLAUDE" BUTTON IM FOOTER DER LANDING PAGE
→ Ist ein Development-Artifact der Browser-Extension
→ Stelle sicher dass dies kein echter App-Button ist
→ Falls doch: sofort entfernen aus dem JSX

══════════════════════════════════════════════════════
LANDING PAGE — VOLLSTÄNDIGE OPTIMIERUNG
══════════════════════════════════════════════════════
Die Landing Page ist das Schaufenster des OS.
Jeder Claim MUSS durch ein echtes OS-Modul gedeckt sein.
Navigationslinks führen zu echten OS-Modulen.

─────────────────────────────────
SECTION 0: NAVIGATION (fix)
─────────────────────────────────
Bestehende Nav: MISSION | THE NEXUS | SYNERGY | VISUALS | ENTERPRISE OS | INITIALIZE SWARM
→ Alle Anchor-Links (#mission, #nexus, #synergy, #visuals) zu echten Sections verlinken
→ "ENTERPRISE OS" → /os (bereits korrekt)
→ "INITIALIZE SWARM" → /os?module=campaign-hub
→ Logo-Klick → scrollt zurück zu Hero (smooth scroll)
→ Nav wird bei Scroll: background blur-effekt erhält backdrop-filter: blur(20px) + border-bottom

─────────────────────────────────
SECTION 1: HERO
─────────────────────────────────
→ Typo fixen: "CONTINUOS" → "CONTINUOUS"
→ Badge "CHAMPIONSHIP GRADE // GEMINI LIVE CHALLENGE" bleibt (wichtig für Hackathon)
→ Subline ergänzen:
"The world's first voice-activated, vision-enabled AI creative agency.
Five specialized agents. One voice command. Infinite parallel synergy.
Built 100% on Google Cloud."
→ Feature-Badges Row (unter Subline) ergänzen:
Bestehend: [🎤 VOICE ENABLED] [🖼 VISION READY]
Neu: [⚡ 5 AGENTS ACTIVE] [✦ GEMINI 2.0 FLASH] [☁ GOOGLE ADK NATIVE]
Alle Badges: Framer Motion fade-in mit staggered delay
→ Hero CTA (zwei Buttons):
[✦ INITIALIZE SWARM →] (neural-blue, filled)
[▶ WATCH DEMO] (outlined, opens Demo-Modal)
Demo-Modal: Autoplaying Screen-Recording oder animiertes GIF des OS
→ Live Agent Feed (unten links — bereits vorhanden als floating cards):
Erweitern: 5 Cards (eine pro Agent), rotieren durch mit 3s Interval
Jede Card: Agent-Name, Status-Dot, aktuelle simulierte Aktivität
Data: synchronisiert mit globalem App-State (useAgentStore)
→ NeuralSubstrate Canvas (Three.js): bleibt, keine Änderungen nötig
Es sei denn Performance < 60fps: dann Partikelzahl reduzieren

─────────────────────────────────
SECTION 2: ACCESS THE SWARM (bestehend, leicht erweitert)
─────────────────────────────────
→ Behalte den Block mit Robot-Icon + "ACCESS THE SWARM"
→ Ersetze "Initialize OS Portal" Text-Description mit:
"Step into the Agenticum G5 Enterprise Operations System. Monitor all
5 AI agents in real-time as SN-00 orchestrates strategy, CC-06 drafts
copy, DA-03 forges visuals via Imagen 3, SP-01 runs competitive intel,
and RA-01 audits every output for compliance and brand safety."
→ Button "INITIALIZE OS PORTAL" → /os (bereits korrekt)
→ Unter dem Button: 4 Mini-Metrics anzeigen (aus globalem State oder Mocks):
[4 Active Workflows] [440 Total Outputs] [100% Swarm Ready] [42ms Latency]

─────────────────────────────────
SECTION 3: AGENT SHOWCASE (NEU — id="nexus")
─────────────────────────────────
Headline: "THE NEXUS" / "MEET THE SWARM"
Subline: "Five purpose-built AI agents, each a specialist. Together, unstoppable."
5 Agent-Cards (horizontal scroll auf Mobile, Grid 5-col auf Desktop):
... [TRUNCATED FOR LENGTH] ...
