# 🛠️ DEVELOPER HANDBOOK: AGENTICUM G5

## 1. Prerequisites

- **Node.js**: v20+ (LTS)
- **Python**: v3.11+
- **Google Cloud CLI**: Authenticated with a project
- **Vertex AI API**: Enabled in the project
- **Firestore**: Enabled in Native Mode

## 2. Repository Structure

```text
/
├── backend/            # G5 Core API (Node.js/Express)
├── engine/             # G5 Intelligence Engine (Python/FastAPI)
├── landing/            # G5 Frontend (React/Vite)
├── docs/               # System Documentation
└── tests/              # End-to-End & Latency Tests
```

## 3. Environment Setup

### 3.1 Backend (Node)

```bash
cd backend
npm install
cp .env.example .env
# Fill in GEMINI_API_KEY and GCP_PROJECT_ID
npm run dev
```

### 3.2 Engine (Python)

```bash
cd engine
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

### 3.3 Frontend (Vite)

```bash
cd landing
npm install
npm run dev
```

## 4. Development Workflow

- **Branching**: Use `feat/` or `fix/` prefixes.
- **Git Strategy**: Each significant documentation or code change should be committed with a descriptive message.
- **Deployment**: Deployment is handled via `gcloud run deploy`. See `deploy/` scripts (v1) or use the CLI directly.

## 5. Testing & Verification

- **Latency Test**: `python tests/live_latency.py`
- **Health Checks**: `/health` on Core and Engine.
- **Console Log**: Use the GenIUS Console to monitor real-time Swarm state.

---

_Built with ❤️ for the Google Gemini API Hackathon._
