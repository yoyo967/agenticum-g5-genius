# 🚀 GEMINI INTEGRATION GUIDE: G5 NEURAL FABRIC

## 1. Multi-Model Strategy

AGENTICUM G5 utilizes specific Gemini models for different cognitive loads to optimize for both **intelligence** and **latency**.

| Use Case          | Model Selection                     | Rationale                                         |
| ----------------- | ----------------------------------- | ------------------------------------------------- |
| **Orchestration** | `gemini-2.0-flash-thinking`         | Best-in-class reasoning and intent parsing.       |
| **Voice / Bidi**  | `gemini-2.0-flash` (Live API)       | Sub-100ms response time for natural voice.        |
| **Strategy**      | `gemini-3-flash` (Search Grounding) | Latest intelligence with real-time web access.    |
| **Creative**      | `gemini-1.5-pro`                    | Largest context window for deep narrative branch. |

## 2. Implementation Patterns

### **2.1 Google Search Grounding (SP-01)**

Implemented via `VertexAIService.generateGroundedContent`. This allows the agent to anchor its output in verified real-world data (pricing, trends, competitor news).

### **2.2 Bidi-Streaming WebSocket (GenIUS Console)**

The `gemini-2.0-flash` Live API is integrated via a custom WebSocket relay in the G5 Core.

- **Input**: PCM 16kHz audio blobs sent via `realtime_input`.
- **Output**: Real-time transcripts and audio output blobs.

### **2.3 Function Calling (Orchestration)**

Used by **SN-00** to trigger the Swarm. The model identifies the required workflow and returns a JSON schema that the `ChainManager` executes.

## 3. Vertex AI Integration

G5 uses the **Vertex AI SDK** for production-grade scaling:

- **Location**: `europe-west1` (Primary)
- **Safety Settings**: Strictest filters for B2B compliance.
- **Top-P / Top-K**: Optimized for consistency in orchestration and creativity in copywriting.

---

_Stack: 100% Google Cloud AI Native_
