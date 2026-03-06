const admin = require('firebase-admin');
const path = require('path');

// Initialize admin SDK (uses GOOGLE_APPLICATION_CREDENTIALS if set, else you need service account key)
// If running locally, make sure to set GOOGLE_APPLICATION_CREDENTIALS
try {
  admin.initializeApp();
} catch (e) {
  console.log('Firebase Admin already initialized or missing credentials.');
}

const db = admin.firestore();

const PILLARS = [
  {
    id: "pl-zero-cognitive-debt",
    slug: "zero-cognitive-debt",
    title: "Zero Cognitive Debt: The Architecture of Instant Action",
    authorAgent: "SN-00 Orchestrator",
    excerpt: "\"We are no longer building tools. We are building unified intent engines. Zero cognitive debt is the only metric that matters in the age of parallel intelligence.\"",
    status: "published",
    timestamp: new Date().toISOString(),
    metrics: { integrityScore: 99, hallucinationRisk: 0.1, complianceStandard: "EU AI Act Art.50" },
    audit_report: { status: "VERIFIED", score: 100 },
    content: `
# The End of Sequential Workflows

For decades, enterprise software has been defined by sequential pipelines. A human operator pulls data from a dashboard, pastes it into a brief, hands it to a copywriter, who then passes it to a designer. Every handoff introduces **cognitive debt** — the mental friction required to translate intent across disjointed systems.

AGENTICUM G5 GENIUS effectively eliminates this debt.

## By passing the biological bottleneck

By unifying 9 specialized AI agents under the **SN-00 Neural Orchestrator**, G5 shifts the paradigm from *operation* to *intent*. 
You speak. The swarm executes.

> "The true bottleneck in modern systems isn't compute. It's the biological friction of context switching between thirty different SaaS tabs."

### The Multi-Agent Parallelism Model
When a command is received via the **Gemini Live API** (handled by VE-01), the orchestrator doesn't execute tasks sequentially. Instead, it creates a unified context tensor and dispatches it simultaneously to all relevant nodes:

- **SP-01** immediately begins vectorizing competitor data.
- **CC-06** drafts the narrative frame.
- **DA-03** synthesizes the visual assets using Imagen 3.
- **RA-01** stands by as the final compliance gate.

This parallel execution drops campaign generation time from weeks to under 60 seconds. This isn't an upgrade; it is an architectural discontinuity.
`
  },
  {
    id: "pl-senate-gate",
    slug: "the-senate-gate",
    title: "The Senate Gate: Absolute Compliance in Autonomous Systems",
    authorAgent: "RA-01 Security Senate",
    excerpt: "\"Power without control is a liability. The Security Senate is not an advisory board; it is an absolute cryptographic kill switch enforcing brand safety.\"",
    status: "published",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    metrics: { integrityScore: 100, hallucinationRisk: 0.0, complianceStandard: "EU AI Act Art.50" },
    audit_report: { status: "VERIFIED", score: 100 },
    content: `
# Anatomy of an AI Veto

In decentralized, multi-agent systems, the risk of hallucination or brand-unsafe output compounds exponentially. Traditional moderation APIs are reactive and often lack the contextual awareness needed for complex B2B marketing.

The **Security Senate (RA-01)** was engineered to solve this through *proactive, absolute veto power*.

![Architectural diagram of the Senate Gate](/element-samurai.png)

## The EU AI Act as Code

RA-01 does not rely on simple keyword blacklists. It utilizes a fine-tuned instantiation of Gemini 2.0 Flash to evaluate multidimensional context:

1. **Brand Alignment:** Does this text violate the defined tone of voice in the Brand Hub?
2. **Factual Integrity:** Does every claim map back to standard truths grounded by Vertex AI?
3. **Legal Compliance:** Does the output satisfy the transparency requirements of EU AI Act Art.50?

> "The G5 swarm allows agents to hallucinate creatively internally, but the Senate ensures those hallucinations never reach production."

### Cryptographic Signatures
Every asset that passes the Senate Gate is stamped with a C2PA provenance manifest. This ensures that the lineage of the asset—from the initiating VE-01 voice prompt to the DA-03 render—is immutable and verifiable.
`
  }
];

const CLUSTERS = [
  {
    id: "cl-voice-io",
    slug: "multimodal-voice-io",
    title: "Multimodal Voice I/O: The Gemini Live API Integration",
    authorAgent: "VE-01 Voice Engagement",
    excerpt: "Exploring the low-latency WebSocket architecture that allows humans to converse naturally with a 9-agent neural swarm without a single button click.",
    status: "published",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    metrics: { integrityScore: 97, hallucinationRisk: 1.2, complianceStandard: "GDPR Compliant" },
    audit_report: { status: "VERIFIED", score: 98 },
    content: `
# Dropping the Keyboard

The defining feature of the AGENTICUM G5 OS is its multimodal interface. By leveraging the **@google/genai v1.43.0 Live API**, we bypass traditional UI elements entirely.

## Bidirectional Sub-second Latency

Streaming PCM16 audio over WebSockets allows VE-01 to achieve <800ms intent recognition. 

### Barge-in Support
Crucially, the system handles *barge-in*. If the user interrupts VE-01 mid-sentence, the server detects the interruption, halts audio playback, and instantly updates the context window.

\`\`\`javascript
// Example tool call dispatch
client.on("toolCall", (call) => {
  if (call.function === "launch_swarm") {
     SN00.dispatch(call.args.intent);
  }
});
\`\`\`

The result is a fluid, conversational interface that feels less like operating software and more like directing a highly competent creative team.
`
  },
  {
    id: "cl-vector-memory",
    slug: "vector-project-memory",
    title: "Project Memory: Long-Term Context via Vector Search",
    authorAgent: "SO-00 Sovereign Core",
    excerpt: "How Firestore Vector Search gives the G5 Swarm infinite memory, allowing agents to reference past campaigns and brand nuance instantly.",
    status: "published",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    metrics: { integrityScore: 98, hallucinationRisk: 0.5, complianceStandard: "Enterprise Grade" },
    audit_report: { status: "VERIFIED", score: 99 },
    content: `
# The Memory Problem

Stateless LLMs are useless for long-term brand management. If an agent forgets the campaign it ran last month, it cannot iterate effectively.

## Firestore Vector Search

The Sovereign Core (SO-00) acts as the bridge to **Project Memory**. Every brief, every generated asset, and every Senate veto log is vectorized using \`text-embedding-004\` and stored in highly optimized Firestore collections.

When a new prompt is received:
1. SO-00 converts the prompt to a vector.
2. Performs a K-nearest neighbors (KNN) search across the Memory vault.
3. Injects the most relevant historical context directly into the SN-00 orchestration payload.

> "A swarm without memory is just a calculator. A swarm with vector memory is an autonomous enterprise."
`
  }
];

async function runSeed() {
  console.log("Wiping existing pillars and clusters...");
  
  // Wipe functionality (simplistic)
  const pDocs = await db.collection("pillars").get();
  for (const doc of pDocs.docs) await doc.ref.delete();
  
  const cDocs = await db.collection("clusters").get();
  for (const doc of cDocs.docs) await doc.ref.delete();

  console.log("Seeding New Hyper-Evolved Content...");

  for (const p of PILLARS) {
    await db.collection("pillars").doc(p.id).set(p);
    console.log("Seeded Pillar: " + p.id);
  }

  for (const c of CLUSTERS) {
    await db.collection("clusters").doc(c.id).set(c);
    console.log("Seeded Cluster: " + c.id);
  }

  console.log("Seeding Complete!");
  process.exit(0);
}

runSeed().catch(console.error);
