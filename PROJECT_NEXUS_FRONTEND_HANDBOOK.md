# AGENTICUM G5 / PROJECT NEXUS — FRONTEND DEVELOPER HANDBOOK

## Version 3.0 | 2026-02-22

---

## 1. PROJECT SETUP

### 1.1 Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn >= 1.22
- Git

### 1.2 Installation

```bash
git clone <repository-url>
cd agenticum-frontend/landing
npm install
```

### 1.3 Development

```bash
npm run dev          # Start Vite Dev Server (localhost:5173)
npm run build        # Production Build
npm run preview      # Preview Production Build
npm run lint         # ESLint + TypeScript Check
```

### 1.4 Deployment (Cloud Run)

```bash
# Docker Build
docker build -t agenticum-frontend .
docker tag agenticum-frontend gcr.io/alphate-enterprise-g5/agenticum-frontend
docker push gcr.io/alphate-enterprise-g5/agenticum-frontend
# Cloud Run Deploy
gcloud run deploy agenticum-frontend \
  --image gcr.io/alphate-enterprise-g5/agenticum-frontend \
  --region europe-west1 \
  --allow-unauthenticated
```

---

## 2. ARCHITECTURE

### 2.1 Directory Structure

```
src/
├── components/
│   ├── ui/                # Shared UI Component Library
│   │   ├── GlassCard.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DataMetric.tsx
│   │   ├── AgentAvatar.tsx
│   │   └── index.ts       # Barrel export
│   ├── ImagenGallery.tsx   # DA-03 Visual Outputs
│   ├── CTASection.tsx      # Landing Page CTA
│   ├── AgentShowcase.tsx   # Agent Swarm Display
│   ├── NexusFeed.tsx       # Blog Feed from Firestore
│   ├── AssetVault.tsx      # Cloud Storage Manager
│   ├── CampaignManager.tsx # PMax Campaign Hub
│   ├── CreativeStudio.tsx  # Design Asset Forge
│   ├── ExecutiveDashboard.tsx # KPI Metrics Panel
│   ├── GeniusConsole.tsx   # Live Agent Chat + Voice
│   ├── GlobalControlPlane.tsx # System Configuration
│   ├── NexusEngineV2.tsx   # Autonomous Workflow Engine
│   ├── OmniscientSearch.tsx # ⌘K Search Overlay
│   ├── PillarBlogEngine.tsx # Content Publication Pipeline
│   ├── ProjectMemory.tsx   # Client Context Store
│   ├── SecuritySenate.tsx  # RA-01 Audit Panel
│   ├── SwarmAnalytics.tsx  # Agent Telemetry + Charts
│   ├── SynergyMap.tsx      # Inter-Agent Data Flow Viz
│   └── WorkflowBuilder.tsx # ReactFlow DAG Editor
├── pages/
│   ├── LandingPage.tsx     # Public Marketing Page
│   ├── OSPortal.tsx        # Neural Operating System
│   └── PrivacyPage.tsx     # Legal / Privacy
├── types.ts                # SwarmState, AgentStatus
├── config.ts               # API_BASE_URL
├── App.tsx                 # Router
└── main.tsx                # Entry point
```

### 2.2 Routing

```tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/os" element={<OSPortal />} />
  <Route path="/privacy" element={<PrivacyPage />} />
</Routes>
```

### 2.3 NEXUS MIDNIGHT Design System

| Token       | CSS Variable         | Value                |
| ----------- | -------------------- | -------------------- |
| Background  | `--color-midnight`   | `#0a0118`            |
| Surface     | `--color-surface`    | `rgba(25,20,85,0.4)` |
| Accent      | `--color-accent`     | `#00E5FF`            |
| Gold        | `--color-gold`       | `#FFD700`            |
| Magenta     | `--color-magenta`    | `#FF007A`            |
| Emerald     | `--color-emerald`    | `#00FF88`            |
| Agent SN-00 | `--color-agent-sn00` | `#00E5FF`            |
| Agent SP-01 | `--color-agent-sp01` | `#7B2FBE`            |
| Agent CC-06 | `--color-agent-cc06` | `#FF007A`            |
| Agent DA-03 | `--color-agent-da03` | `#FFD700`            |
| Agent RA-01 | `--color-agent-ra01` | `#00FF88`            |

**Typography**: Display (Oswald), Data (Roboto Mono), Body (Inter)

---

## 3. KEY PATTERNS

### 3.1 Shared UI Components

Import from `../components/ui`:

```tsx
import {
  GlassCard,
  StatusBadge,
  DataMetric,
  AgentAvatar,
  SectionHeading,
} from "../components/ui";
```

### 3.2 WebSocket Integration (Genius Console)

The Genius Console uses a real WebSocket connection:

```tsx
const useWebSocket = (url: string) => {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const connect = useCallback(() => {
    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => setStatus("connected");
    wsRef.current.onclose = () => setStatus("disconnected");
  }, [url]);
  return { status, connect };
};
```

### 3.3 Swarm State Events

Components listen for live agent state via `CustomEvent`:

```tsx
useEffect(() => {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<SwarmState>).detail;
    // React to agent state changes
  };
  window.addEventListener("swarm-state", handler);
  return () => window.removeEventListener("swarm-state", handler);
}, []);
```

### 3.4 API Integration Pattern

```tsx
import { API_BASE_URL } from "../config";

const res = await fetch(`${API_BASE_URL}/api/analytics/stats`);
const data = await res.json();
```

---

## 4. OS MODULES (12/12)

| Module              | Component            | Key Feature                |
| ------------------- | -------------------- | -------------------------- |
| Executive Dashboard | `ExecutiveDashboard` | KPI metrics, agent cards   |
| Campaign Hub        | `CampaignManager`    | PMax campaigns, budget     |
| Genius Console      | `GeniusConsole`      | WebSocket chat + voice     |
| Nexus Engine        | `NexusEngineV2`      | Autonomous workflows       |
| Blog Engine         | `PillarBlogEngine`   | Firestore blog publish     |
| Creative Studio     | `CreativeStudio`     | Imagen 3 assets            |
| Workflows           | `WorkflowBuilder`    | ReactFlow DAG editor       |
| Asset Vault         | `AssetVault`         | Cloud Storage browser      |
| Project Memory      | `ProjectMemory`      | Client context store       |
| Swarm Analytics     | `SwarmAnalytics`     | Throughput + agent metrics |
| Synergy Map         | `SynergyMap`         | Inter-agent data flow      |
| Security Senate     | `SecuritySenate`     | RA-01 audit panel          |
