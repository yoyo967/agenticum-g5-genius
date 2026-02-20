⚡ KORRIGIERTE ANWEISUNG FÜR GEMINI 3 FLASH — AUFGABE 01: GitHub Initialisierung (TS-NATIV)
Priorität: KRITISCH | Einmalig ausführen | Keine Abweichungen

HINWEIS: Diese Version wurde korrigiert, um dem TypeScript/Node.js-Stack des Masterplans zu entsprechen (statt Python).

DEINE AUFGABE
Du initialisierst das GitHub-Repository für AGENTICUM G5 GENIUS AGENTS und machst den ersten professionellen Commit-Stack. Die Jury des Hackathons wird diese History sehen.

VORAUSSETZUNGEN — ZUERST PRÜFEN

- Git konfiguriert (Yahya Yildirim / yildirimyahya716@gmail.com)
- GitHub Repo manuell oder via gh erstellt (yahyayildirim-star/agenticum-g5-genius)

SCHRITT 1: LOKALES GIT INITIALISIEREN
bash# Navigiere zum Projektordner
cd "c:\Users\HP\Desktop\agenticum g5 landingpage"

# Git initialisieren

git init
git branch -M main

# Remote verbinden

git remote add origin https://github.com/yahyayildirim-star/agenticum-g5-genius.git

SCHRITT 2: DER INITIAL COMMIT STACK (TS-VERSION)
Führe JEDEN Commit einzeln aus.

COMMIT 01 — .gitignore zuerst
git add .gitignore
git commit -m "chore: initialize repository with gitignore"

COMMIT 02 — Projekt-Fundament (TypeScript/Node)
git add README.md package.json tsconfig.json AGENTICUM_G5_GENIUS_MEGAMASTERPLAN.md
git commit -m "feat: scaffold AGENTICUM G5 GENIUS project structure

- Node.js backend with TypeScript + Express foundation
- Strategic Mega Masterplan integrated as single source of truth
- Conventional repository structure for backend, console, and landing
- Global workspace configuration and build tools"

COMMIT 03 — Backend Core Setup
git add backend/package.json backend/tsconfig.json backend/src/index.ts backend/Dockerfile
git commit -m "feat(backend): initialize GenIUS Neural Fabric on Cloud Run

- Express server entry point with health check
- Dockerfile optimized for Cloud Run (Node 20 slim)
- TypeScript configuration for strict type safety
- Initial deployment configuration for online-marketing-manager"

COMMIT 04 — GCP Services Layer (TS)

# (Folgt sobald die Services in TS implementiert sind)

# git add backend/src/services/

# git commit -m "feat(backend): add Google Cloud service clients in TypeScript..."

COMMIT 05 — ADK Base Agent (TS)

# (Folgt sobald die Agents in TS implementiert sind)

# git add backend/src/agents/

# git commit -m "feat(agents): implement ADK-compatible base agent in TypeScript..."

[... Weitere Commits folgen dem Muster aus GITHUB_STRATEGY_FLASH.md, aber mit .ts Endungen ...]

SCHRITT 3: PUSH
git push -u origin main
