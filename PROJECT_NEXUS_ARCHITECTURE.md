# AGENTICUM G5 / PROJECT NEXUS — ARCHITECTURE REFERENCE

## Technical Documentation | Version 2.0 | 2026-02-22

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                    CLIENT LAYER                  │
│  React 18 + Vite + Tailwind v4 + TypeScript     │
│  Deployed: Cloud Run (europe-west1)             │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Landing   │ │ OS Portal│ │ Genius Console   ││
│  │ Page      │ │ (13 Mod) │ │ (WebSocket Live) ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└─────────────────────┬───────────────────────────┘
                      │ HTTPS / WSS
┌─────────────────────┴───────────────────────────┐
│                 ORCHESTRATION LAYER              │
│  Cloud Run — Node.js Backend                     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ SN-00 Neural Orchestrator (ADK)            │ │
│  │   ├── SP-01 Syntactic Processor            │ │
│  │   ├── CC-06 Cognitive Core (Copywriter)    │ │
│  │   ├── DA-03 Diffusion Architect (Imagen)   │ │
│  │   ├── RA-01 Security Auditor               │ │
│  │   └── PM-07 Pillar Master (Blog Engine)    │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────┐
│                  GOOGLE CLOUD SERVICES           │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Vertex AI│ │ Firestore│ │ Cloud Storage    ││
│  │ Gemini   │ │          │ │ (Asset Vault)    ││
│  │ 2.0 Flash│ │          │ │                  ││
│  │ Imagen 3 │ │          │ │                  ││
│  └──────────┘ └──────────┘ └──────────────────┘│
│                                                  │
│  ┌──────────┐ ┌──────────────────────────────┐  │
│  │ Cloud Run│ │ WebSocket Server              │  │
│  │ (Backend)│ │ (Real-time Agent Comm)        │  │
│  └──────────┘ └──────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 1.2 Agent Architecture (Multi-Agent Swarm)

| Agent ID | Rolle               | Modell                      | Funktion                                       |
| -------- | ------------------- | --------------------------- | ---------------------------------------------- |
| SN-00    | Neural Orchestrator | Gemini 2.0 Flash            | OODA-Loop Task Decomposition, Parallelisierung |
| SP-01    | Syntactic Processor | Gemini 2.0 Flash            | Competitive Intelligence, Structural Analysis  |
| CC-06    | Cognitive Core      | Gemini 2.0 Flash            | SEO-Copy, Brand Scripts, Conversion Copy       |
| DA-03    | Diffusion Architect | Gemini 2.0 Flash + Imagen 3 | Photorealistic Asset Generation                |
| RA-01    | Security Auditor    | Gemini 2.0 Flash            | Brand Safety, Compliance, Output Review        |
| PM-07    | Pillar Master       | Gemini 2.0 Flash            | Autonomous Blog Content Pipeline               |

### 1.3 Data Flow

```
User Input (Voice/Text/Image)
    │
    ▼
Genius Console (WebSocket)
    │
    ▼
SN-00 Orchestrator
    │
    ├──▶ SP-01 (Strategy/Analysis)
    ├──▶ CC-06 (Content Generation)
    ├──▶ DA-03 (Image Generation via Imagen 3)
    └──▶ RA-01 (Safety Audit on all outputs)
    │
    ▼
Aggregated Response → Firestore → Frontend Update
```

---

## 2. FRONTEND ARCHITECTURE

### 2.1 Tech Stack

- **Framework:** React 18 with Vite build system
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts (Agency Throughput, Network Payload Distribution)
- **Workflow Canvas:** React Flow (Automated Workflows module)
- **State Management:** React Context / Local State
- **Routing:** React Router (SPA with /os subroutes)

### 2.2 Module Map

| Route         | Module              | Beschreibung           | Datenstatus                   |
| ------------- | ------------------- | ---------------------- | ----------------------------- |
| /             | Landing Page        | Public-facing Showcase | Statisch/Mock                 |
| /os           | Executive Dashboard | Metriken, Logs, Charts | Mock-Daten                    |
| /os/campaigns | Campaign Hub        | PMax Orchestrator      | UI-Shell, Dispatch funktional |
| /os/genius    | Genius Console      | Live AI Chat           | ECHT (WebSocket)              |
| /os/nexus     | Nexus Engine V2     | Workflow Templates     | UI-Shell                      |
| /os/blog      | Pillar Blog Engine  | Content Pipeline       | Teilweise echt (API)          |
| /os/studio    | Creative Studio     | Asset Workspace        | Mock-Daten                    |
| /os/workflows | Automated Workflows | React Flow Builder     | UI-Shell                      |
| /os/vault     | Asset Vault         | File Upload/Ingest     | UI-Shell                      |
| /os/memory    | Project Memory      | Client CRM             | Mock-Daten                    |
| /os/analytics | Swarm Analytics     | Agent Telemetry        | Mock-Daten                    |
| /os/synergy   | Synergy Map         | Agent Network Viz      | Mock-Daten                    |
| /os/senate    | Security Senate     | RA-01 Tribunal         | Mock-Daten                    |
| /os/config    | Global Config       | System Settings        | UI-Shell                      |

---

## 3. BACKEND ARCHITECTURE

### 3.1 GCP Services

| Service          | Verwendung                                        | Region       |
| ---------------- | ------------------------------------------------- | ------------ |
| Cloud Run        | Frontend + Backend Hosting                        | europe-west1 |
| Vertex AI        | Gemini 2.0 Flash API, Imagen 3                    | europe-west1 |
| Firestore        | Echtzeit-DB (Clients, Assets, Blog)               | europe-west1 |
| Cloud Storage    | Asset Vault (GCS Bucket: g5-enterprise-vault-001) | europe-west1 |
| WebSocket Server | Real-time Agent Communication                     | Cloud Run    |

### 3.2 API Endpoints (bekannt)

- WebSocket: Genius Console Live-Verbindung
- REST: Blog/Nexus Engine Content API
- REST: Agent Dispatch (Campaign Hub)
- REST: Firestore CRUD (Clients, Memory Vectors)

### 3.3 Konfiguration (Global Config)

```json
{
  "gcpProjectId": "alphate-enterprise-g5",
  "vertexServiceAccount": "configured (masked)",
  "geminiApiKey": "AIzaSyB-XXXX (active)",
  "gcsBucket": "g5-enterprise-vault-001",
  "localFallback": "./data/vault/",
  "primaryModel": "gemini-2.0-flash",
  "alternativeModel": "gemini-2.0-thinking",
  "temperature": 0.7,
  "topK": 40,
  "maxOutputTokens": 8192,
  "safetyThreshold": "BLOCK_MEDIUM_AND_ABOVE"
}
```

---

## 4. NEXUS-EVOLUTION: Architektur-Erweiterungen

### 4.1 Neue Services für Marketing-Intelligence-Plattform

```
┌──────────────────────────────────────────────┐
│           NEXUS EXTENSION LAYER              │
│                                              │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │ Curriculum  │  │ Talent Graph Service   │ │
│  │ Engine      │  │ (Skill Verification,   │ │
│  │ (Liquid     │  │  Agency Matching)      │ │
│  │  Learning)  │  │                        │ │
│  └────────────┘  └────────────────────────┘ │
│                                              │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │ Tool Suite  │  │ Ad Manager 360        │ │
│  │ (SEO, UTM,  │  │ Integration           │ │
│  │  Ad Copy)   │  │ (Contextual Ads)      │ │
│  └────────────┘  └────────────────────────┘ │
│                                              │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │ Translation │  │ Assessment Engine     │ │
│  │ Service     │  │ (Quizzes, Practical   │ │
│  │ (Gemini)    │  │  Exercises)           │ │
│  └────────────┘  └────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 4.2 Datenmodell-Erweiterungen (Firestore)

```
Collections:
├── users/
│   ├── {userId}/
│   │   ├── profile (name, email, role, language)
│   │   ├── skills/ (verified skill scores)
│   │   ├── progress/ (module completions)
│   │   └── certificates/
├── curriculum/
│   ├── modules/
│   │   ├── {moduleId}/ (SEO, Google Ads, Email, etc.)
│   │   │   ├── lessons/
│   │   │   ├── assessments/
│   │   │   └── metadata (lastUpdated, version, triggers)
├── tools/
│   ├── seo-analyzer/
│   ├── ad-copy-generator/
│   └── utm-builder/
├── talent-graph/
│   ├── profiles/ (public skill profiles)
│   ├── matches/ (agency-candidate matches)
│   └── agencies/
├── content/ (existing blog engine)
└── ads/
    ├── placements/
    └── campaigns/
```
