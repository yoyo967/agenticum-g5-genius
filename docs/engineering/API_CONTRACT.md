# 📡 API CONTRACT: AGENTICUM G5

## 1. REST Endpoints (Core API - Node.js)

| Endpoint            | Method | Role          | Payload               |
| ------------------- | ------ | ------------- | --------------------- |
| `/api/settings`     | GET    | System Config | -                     |
| `/api/vault/files`  | GET    | List Assets   | -                     |
| `/api/vault/upload` | POST   | Upload Asset  | `multipart/form-data` |
| `/api/metrics`      | GET    | Swarm Health  | -                     |

## 2. WebSocket Protocols (GenIUS Console)

The Console connects via Socket.io at `WS_BASE_URL`.

### **Client → Server (Events)**

- **`start`**: Trigger the Swarm.
  - `payload: { input: string, campaignId?: string }`
- **`realtime_input`**: Stream audio bits to Gemini Live.
  - `payload: { data: base64, sampleRate: 16000 }`
- **`executive-intervention`**: Manual override or feedback.
  - `payload: { taskId: string, directive: string }`

### **Server → Client (Events)**

- **`status`**: Current Swarm state.
- **`transcript`**: Live voice-to-text from Gemini.
- **`output`**: Markdown formatted results from an agent.
- **`swarm-payload`**: Cross-agent data transfers (e.g., Image URLs).
- **`senate`**: Veto or Warning from RA-01.
- **`realtime_output`**: Audio bits from Gemini Live speaker.

## 3. Engine Endpoints (Python / FastAPI)

| Endpoint                 | Method | Role                              |
| ------------------------ | ------ | --------------------------------- |
| `/health`                | GET    | Heartbeat                         |
| `/engine/counter-strike` | POST   | Trigger Competitive Intel Scan    |
| `/engine/browser/action` | POST   | Execute Playwright Browser action |

---

_Protocols Version: v5.0 (Bidi-Streaming Active)_
