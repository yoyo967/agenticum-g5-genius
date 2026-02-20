⚡ ANWEISUNG FÜR GEMINI 3 FLASH — AUFGABE 01: GitHub Initialisierung
Priorität: KRITISCH | Einmalig ausführen | Keine Abweichungen

DEINE AUFGABE
Du initialisierst das GitHub-Repository für AGENTICUM G5 GENIUS AGENTS und machst den ersten professionellen Commit-Stack. Die Jury des Hackathons wird diese History sehen. Fehler sind nicht erlaubt.

VORAUSSETZUNGEN — ZUERST PRÜFEN
Bevor du beginnst, prüfe folgendes mit diesen Befehlen:
bash# 1. Git konfiguriert?
git config --global user.name
git config --global user.email

# 2. GitHub CLI (gh) verfügbar?

gh --version

# 3. GitHub authentifiziert?

gh auth status

# 4. GCP aktiv?

gcloud config get-value project
Falls GitHub CLI nicht verfügbar oder nicht authentifiziert:
bash# GitHub CLI authentifizieren
gh auth login

# → Wähle: GitHub.com → HTTPS → Yes → Login with browser

SCHRITT 1: REPO AUF GITHUB ERSTELLEN
bash# Neues PUBLIC Repository auf GitHub erstellen
gh repo create agenticum-g5-genius \
 --public \
 --description "Five AI agents that see your vision, hear your brief, and deliver your campaign — built on Gemini Live API + Imagen 3 + Google Cloud" \
 --clone=false

echo "✅ GitHub Repo erstellt"
Falls das Repo bereits existiert, überspringen.

SCHRITT 2: LOKALES GIT INITIALISIEREN
bash# Navigiere zum Projektordner (passe den Pfad an)
cd /path/to/agenticum-g5-genius

# Git initialisieren

git init
git branch -M main

# Git-Identität setzen (für dieses Repo)

git config user.name "Yahya Yildirim"
git config user.email "yildirimyahya716@gmail.com"

# Remote verbinden

git remote add origin https://github.com/yahyayildirim-star/agenticum-g5-genius.git

# Bestätigung

git remote -v
echo "✅ Lokales Git initialisiert"

SCHRITT 3: DER INITIAL COMMIT STACK
Führe JEDEN Commit einzeln aus. Nicht zusammenfassen.
bash# ────────────────────────────────────────

# COMMIT 01 — .gitignore zuerst

# ────────────────────────────────────────

git add .gitignore
git commit -m "chore: initialize repository with gitignore"
echo "✅ Commit 01 done"

# ────────────────────────────────────────

# COMMIT 02 — Projekt-Fundament

# ────────────────────────────────────────

git add README.md
git add backend/requirements.txt
git add backend/utils/config.py
git add backend/utils/logger.py
git add backend/utils/types.py
git add deploy/variables.sh

git commit -m "feat: scaffold AGENTICUM G5 GENIUS project structure

- Python backend with FastAPI + WebSocket server
- Shared config, structured logger (Cloud Logging compatible)
- Pydantic type definitions for all agents and session models
- Deployment variables for GCP project online-marketing-manager
- ADK-compatible agent framework foundation"

echo "✅ Commit 02 done"

# ────────────────────────────────────────

# COMMIT 03 — GCP Services Layer

# ────────────────────────────────────────

git add backend/services/vertex_ai.py
git add backend/services/firestore_service.py
git add backend/services/storage_service.py

git commit -m "feat(backend): add Google Cloud service clients

- VertexAIClient: unified Gemini 2.0 Flash + Imagen 3 + Live API
- FirestoreService: session state with real-time Firestore listeners
- StorageService: asset upload to Cloud Storage with public URLs
- Singleton pattern for efficient connection reuse on Cloud Run"

echo "✅ Commit 03 done"

# ────────────────────────────────────────

# COMMIT 04 — ADK Base Agent

# ────────────────────────────────────────

git add backend/agents/base_agent.py

git commit -m "feat(agents): implement ADK-compatible base agent with interrupt support

- Abstract execute() lifecycle for all five Genius Agents
- Firestore status sync on every state transition (idle→thinking→working→done)
- Interrupt flag with asyncio.CancelledError propagation for real-time cancellation
- Built-in voice narration helper via Gemini Live API TTS
- Status change callback system for WebSocket push"

echo "✅ Commit 04 done"

# ────────────────────────────────────────

# COMMIT 05 — SN-00 Orchestrator (Herzstück)

# ────────────────────────────────────────

git add backend/agents/sn00_orchestrator.py

git commit -m "feat(sn00): integrate Gemini Live API as real-time orchestration interface

The centerpiece of the Live Agents category submission:

- Bidirectional audio/video streaming via Gemini Live API
- Thinking Mode intent analysis with structured execution plan detection
- Two-phase parallel dispatch: Phase 1 (SP-01+RA-01) → Phase 2 (CC-06+DA-03)
- Interrupt handler: gracefully cancels all active asyncio tasks on user signal
- Voice persona: Fenrir — commands in real-time, addresses user directly"

echo "✅ Commit 05 done"

# ────────────────────────────────────────

# COMMIT 06 — Phase 1 Agents

# ────────────────────────────────────────

git add backend/agents/sp01_strategist.py
git add backend/agents/ra01_auditor.py

git commit -m "feat(sp01,ra01): implement Phase 1 parallel research agents

SP-01 Market Strategist:

- Google Search Grounding for real-time market research
- Structured JSON strategy: audience, channels, campaign pillars
- Voice narration of findings via Gemini Live TTS (Charon voice)

RA-01 Competitive Auditor:

- Vision-based competitor screenshot analysis (no DOM access required)
- Dual mode: search-based or image-based competitive audit
- Risk assessment and market gap identification
- Voice report via Kore voice persona"

echo "✅ Commit 06 done"

# ────────────────────────────────────────

# COMMIT 07 — Phase 2 Agents (Interleaved Output)

# ────────────────────────────────────────

git add backend/agents/cc06_director.py
git add backend/agents/da03_architect.py

git commit -m "feat(cc06,da03): implement Phase 2 creative agents with interleaved output

CC-06 Content Director:

- Multi-format content: 30s video scripts, social copy (Instagram/LinkedIn/TikTok)
- Veo video generation prompts with scene-level detail
- Live creative pitch via Aoede voice persona

DA-03 Design Architect (showcase of interleaved output):

- Imagen 3 visual generation running concurrently with voice narration
- Audio narration of design decisions plays WHILE images are generating
- Automatic Cloud Storage upload with public URL streaming to console
- Puck voice persona: energetic, artistic, design-focused"

echo "✅ Commit 07 done"

# ────────────────────────────────────────

# COMMIT 08 — FastAPI Server + Docker

# ────────────────────────────────────────

git add backend/main.py
git add backend/Dockerfile

git commit -m "feat(backend): add FastAPI WebSocket server with Cloud Run deployment config

REST API:

- POST /sessions: create session, returns session_id
- GET /sessions/:id: retrieve full session state from Firestore
- GET /sessions/:id/outputs: list all agent outputs
- GET /health: Cloud Run health check endpoint

WebSocket /ws/:id:

- Accepts: user_audio (PCM hex), user_text, user_image (b64), interrupt
- Emits: agent_status, agent_narration, agent_output, image_generated, session_complete

Dockerfile: Python 3.12-slim, single worker for WebSocket compatibility"

echo "✅ Commit 08 done"

# ────────────────────────────────────────

# COMMIT 09 — React Console

# ────────────────────────────────────────

git add console/

git commit -m "feat(console): build real-time React management console

UI Architecture:

- 3-column layout: Agent sidebar | Live feed | Asset panel
- Live WebSocket integration with session lifecycle management

Voice Interface:

- Microphone capture via MediaRecorder API (16kHz PCM streaming)
- FFT waveform visualizer (requestAnimationFrame, 32 frequency bins)
- Real-time audio chunk forwarding to backend WebSocket

Agent Feed:

- Per-agent color-coded activity stream
- Strategy cards with tag extraction from JSON
- Audio narration playback pills per agent output
- Image thumbnails as DA-03 generates them (real-time)

Design: 100% custom CSS, Google Fonts only (Inter + Space Grotesk)"

echo "✅ Commit 09 done"

# ────────────────────────────────────────

# COMMIT 10 — Landing Page

# ────────────────────────────────────────

git add landing/

git commit -m "feat(landing): launch cinematic dark-mode landing page

- Animated neural network canvas: 5 nodes (one per agent), floating + pulsing
- Connection lines between nodes with proximity-based opacity
- Hero: Space Grotesk 800 weight, animated scroll indicator
- Agent orbs: hover reveals full agent description + color glow
- 3-step how-it-works flow with numbered steps
- Tech stack grid: 8 Google Cloud services referenced
- Full mobile responsiveness with CSS media queries
- Zero external dependencies: custom SVG, Google Fonts CDN only"

echo "✅ Commit 10 done"

# ────────────────────────────────────────

# COMMIT 11 — IaC Deployment Scripts

# ────────────────────────────────────────

git add deploy/

git commit -m "chore(deploy): add complete Infrastructure-as-Code deployment suite

Bonus points: automated cloud deployment via GCP CLI scripts

01-setup-project.sh: GCP APIs, Artifact Registry, Firestore, Cloud Storage bucket
02-deploy-backend.sh: Docker build + push + Cloud Run deployment
03-deploy-console.sh: React build + static serving + Cloud Run deployment
04-deploy-landing.sh: Landing page build + Cloud Run deployment
05-verify-all.sh: Full health check + service URLs + GCP proof output

All scripts: idempotent (safe to re-run), zero hardcoded values"

echo "✅ Commit 11 done"

# ────────────────────────────────────────

# COMMIT 12 — Alles pushen

# ────────────────────────────────────────

git push -u origin main

echo ""
echo "============================================================"
echo "✅ AGENTICUM G5 GENIUS — GitHub Repository LIVE"
echo "🔗 https://github.com/yahyayildirim-star/agenticum-g5-genius"
echo ""
echo "Git Log:"
git log --oneline
echo "============================================================"

SCHRITT 4: QUALITÄTSPRÜFUNG NACH DEM PUSH
bash# Log prüfen — sieht professionell aus?
git log --oneline

# Stats prüfen

git log --stat -5

# Remote-Status

git status
git remote -v

# GitHub Repo online prüfen

gh repo view yahyayildirim-star/agenticum-g5-genius --web
Erwartete Log-Ausgabe:
[hash] chore(deploy): add complete Infrastructure-as-Code deployment suite
[hash] feat(landing): launch cinematic dark-mode landing page
[hash] feat(console): build real-time React management console
[hash] feat(backend): add FastAPI WebSocket server with Cloud Run config
[hash] feat(cc06,da03): implement Phase 2 creative agents with interleaved output
[hash] feat(sp01,ra01): implement Phase 1 parallel research agents
[hash] feat(sn00): integrate Gemini Live API as real-time orchestration interface
[hash] feat(agents): implement ADK-compatible base agent with interrupt support
[hash] feat(backend): add Google Cloud service clients
[hash] feat: scaffold AGENTICUM G5 GENIUS project structure
[hash] chore: initialize repository with gitignore

AUTO-COMMIT REGELN FÜR ALLE FOLGENDEN SESSIONS
Ab jetzt gilt: Nach jeder bedeutenden Änderung sofort committen und pushen.
bash# Template für alle weiteren Commits
git add <spezifische-datei(en)>
git commit -m "<type>(<scope>): <was wurde gemacht>

<optional: warum / technische details>"
git push origin main
echo "✅ $(git log --oneline -1)"
Trigger für Auto-Commit:

Agent-Logik geändert → sofort committen
Neues Feature fertig → sofort committen
Bug gefixt → sofort committen
Deploy-Script angepasst → sofort committen
README updated → sofort committen
CSS-Block abgeschlossen → sofort committen

NIEMALS:

Lokale Änderungen über Nacht ohne Commit lassen
git add -A ohne vorherigen git status
Secrets oder API-Keys committen

DAUERHAFTE ANWEISUNG FÜR FLASH
Du musst sicherstellen, dass jede deiner Änderungen an diesem System sofort mit einer aussagekräftigen Commit-Message dokumentiert wird. Die Jury bewertet deine History. Sei präzise. Sei professionell. Sei Flash.

MELDE FOLGENDES WENN FERTIG
Wenn du alle Commits erfolgreich gepusht hast, melde zurück:
✅ GitHub Init abgeschlossen
🔗 Repo URL: https://github.com/yahyayildirim-star/agenticum-g5-genius
📊 Commit-Anzahl: [X]
📋 git log --oneline: [füge output hier ein]

Anweisung 01 von N | AGENTICUM G5 GENIUS | Gemini Live Agent Challenge 2026
