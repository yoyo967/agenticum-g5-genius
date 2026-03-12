import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';
import { BlogFeedResponse, Pillar, Cluster } from '../types/blog';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { StorageService } from '../services/storage';
import { PillarGraphOrchestrator } from '../services/orchestrator';

import { distributionService } from '../services/distribution';
import { autopilotService } from '../services/cron';
import { approvalWorkflow } from '../services/approval-workflow';
import { cinematicService } from '../services/cinematic-service';
import { eventFabric } from '../services/event-fabric';

const router = Router();

// ──────────────────────────────────────────────────────────
// Seed articles — written to Firestore once on first /feed
// request if collections are empty. Slugs match BlogPage
// cover-image mapping (diagram_orchestrator, _compliance,
// _voice, _trophy).
// ──────────────────────────────────────────────────────────
const SEED_PILLARS: Omit<Pillar, 'id'>[] = [
  {
    slug: 'zero-cognitive-debt',
    title: 'Zero Cognitive Debt: How AGENTICUM G5 Eliminates Human Bottlenecks in Enterprise Marketing',
    excerpt: 'When AI agents think in parallel, the cognitive load of marketing strategy drops to zero. Here\'s how AGENTICUM G5\'s neural swarm architecture redefines execution speed.',
    content: `# Zero Cognitive Debt

## The Problem with Human-Paced Marketing

Every enterprise marketing team carries cognitive debt. Strategy sessions, approval loops, revision cycles — the average B2B campaign takes 8–14 weeks from brief to live. **AGENTICUM G5 collapses that to minutes.**

## The Swarm Architecture

AGENTICUM G5 deploys nine specialized agents in parallel:

- **SN-00 Orchestrator** — Decomposes intent into atomic directives
- **SP-01 Intelligence Scout** — Grounds every decision in live market data
- **CC-06 Director** — Crafts EU AI Act-compliant copy at 38ms per dispatch
- **DA-03 Visual Architect** — Generates C2PA-signed brand imagery via Imagen 3
- **BA-07 Behavioural Analyst** — Predicts audience resonance before launch
- **RA-01 Security Senate** — Adversarial compliance gate for every output
- **SO-00 Sovereign** — Synthesizes final campaign directives with geopolitical awareness
- **PM-07 Launch Coordinator** — Coordinates Google Ads Performance Max activation
- **VE-01 NEXUS** — Voice interface via Gemini Live API — the human bridge

## The Result: From Brief to Campaign in Minutes

When you speak a directive to NEXUS, the swarm activates simultaneously. By the time you finish your sentence, SP-01 has already interrogated three search grounding APIs, CC-06 has drafted the first content variant, and DA-03 has begun visual synthesis.

**Zero cognitive debt. Zero waiting. Zero bottlenecks.**

## Technical Architecture

The system runs on Google Cloud Run with \`min-instances: 1\` — no cold starts, instant response. All agent communication flows through the SwarmBus, a real-time WebSocket fabric that synchronises state across the entire neural cluster.

Every campaign output passes through the Security Senate — an adversarial review panel enforcing Ethics, Economy, and Ecology criteria in alignment with EU AI Act Article 50.

> "The first AI marketing system that thinks faster than a human team can react."`,
    authorAgent: 'SN-00 Orchestrator',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
  },
  {
    slug: 'gemini-live-agent-challenge-2026',
    title: 'Gemini Live Agent Challenge 2026: Building the World\'s First Voice-Commanded Marketing Swarm',
    excerpt: 'How we built AGENTICUM G5 for the Google Gemini Live Agent Challenge — a real-time voice-to-swarm system that turns spoken intent into autonomous marketing campaigns.',
    content: `# Gemini Live Agent Challenge 2026

## Why We Built This

The Gemini Live Agent Challenge asked one question: what happens when real-time voice AI meets autonomous agent orchestration?

Our answer: **AGENTICUM G5** — the world's first enterprise AI system where you speak a marketing directive and a nine-agent swarm executes it autonomously, with full EU compliance, in real time.

## The Core Innovation: Voice → Swarm

VE-01 NEXUS uses the **Gemini 2.5 Flash Native Audio API** — a bidirectional audio model capable of:

- Sub-800ms first response latency
- Real-time tool calling mid-sentence
- Barge-in interruption (the AI stops speaking the moment you speak)
- Persistent multi-turn context

When NEXUS hears a marketing directive, it calls \`launch_swarm\` — a Gemini function declaration that fires the SN-00 orchestrator. The response? "On it." The swarm is already running.

## Architecture Highlights

The audio pipeline captures PCM16 at 16kHz, chunks into 32ms frames (512 samples), base64-encodes and streams via WebSocket to the backend. Gemini Live processes native audio and responds with 24kHz PCM output, scheduled sequentially on the frontend AudioContext to prevent overlap and enable instant barge-in.

## What Makes This Different

Every other "AI marketing tool" is a text box that calls an LLM. AGENTICUM G5 is an **operating system** — with a persistent state machine, adversarial compliance layer, real-time telemetry, and a voice interface that feels like talking to a brilliant colleague.

## The Judges' Challenge

We invite judges to speak a campaign directive to NEXUS and watch what happens. The system generates:

- 2,000+ word pillar article (CC-06 + SP-01)
- 4 brand image variants (DA-03 + Imagen 3)
- Full Senate compliance report (RA-01)
- Google Ads Performance Max recommendations (PM-07)
- Live telemetry across all 9 agents

All in under 3 minutes. All from a single spoken sentence.`,
    authorAgent: 'VE-01 NEXUS',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
  },
];

const SEED_CLUSTERS: Omit<Cluster, 'id'>[] = [
  {
    pillarId: 'pl-zero-cognitive-debt',
    slug: 'the-senate-gate',
    title: 'The Senate Gate: EU AI Act Compliance as a Competitive Advantage',
    excerpt: 'RA-01\'s adversarial review panel doesn\'t slow down campaigns — it makes them bulletproof. How the Security Senate turns compliance into a marketing moat.',
    content: `# The Senate Gate

## Compliance Is Not a Blocker — It's a Brand Signal

Most AI marketing tools treat compliance as an afterthought. AGENTICUM G5 treats it as **architecture**.

Every output generated by the nine-agent swarm must pass through RA-01's Security Senate — an adversarial review panel that evaluates content across three axes:

### The Three Senators

**Senator Ethics** — Evaluates truthfulness, non-deception, and psychological safety. No dark patterns. No misleading claims. No hallucinated statistics.

**Senator Economy** — Evaluates economic fairness, pricing transparency, and anti-competitive behavior. Campaign claims must be defensible.

**Senator Ecology** — Evaluates carbon impact of media choices, sustainable messaging alignment, and brand environmental consistency.

### The Verdict

All three senators must APPROVE before any content reaches the publishing pipeline. If one vetoes, the entire campaign is returned to the orchestrator with a detailed rejection brief. CC-06 iterates. The Senate reviews again.

This process — which would take a legal team weeks — completes in seconds.

## EU AI Act Article 50 Alignment

AGENTICUM G5 is designed for EU AI Act compliance from day one:

- **Transparency**: All AI-generated content is watermarked (C2PA provenance via Imagen 3)
- **Human oversight**: The Executive Intervention interface lets humans override any agent decision
- **Data minimisation**: No PII processed. No customer data stored. Ephemeral session architecture.
- **Auditability**: The Thinking Trace logs every agent decision in real time

The Senate Gate is not a feature. It's the foundation.`,
    authorAgent: 'RA-01 Security Senate',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
  },
  {
    pillarId: 'pl-zero-cognitive-debt',
    slug: 'multimodal-voice-io',
    title: 'Multimodal Voice I/O: Why Gemini Native Audio Changes Everything for Enterprise AI',
    excerpt: 'The shift from text-in/text-out to voice-in/voice-out AI is not incremental — it\'s architectural. Here\'s what native audio models unlock for enterprise workflows.',
    content: `# Multimodal Voice I/O

## The Latency Problem with Traditional Voice AI

Traditional voice pipelines: Speech-to-Text → LLM → Text-to-Speech. Three models. 3–5 second latency. Robotic prosody. Lost context between steps.

**Gemini 2.5 Flash Native Audio** collapses this to a single model. The result: sub-800ms latency, natural intonation, and persistent context across the entire conversation.

## What Native Audio Enables

### Real-Time Tool Calling

While NEXUS is still speaking, Gemini can simultaneously evaluate whether to call \`launch_swarm\`. The function call happens mid-utterance — not after the model finishes speaking.

### Barge-In Intelligence

When the user speaks while the model is talking, Gemini detects this and stops immediately. No awkward pauses. No waiting for the model to finish. The interaction feels natural because it *is* natural.

### Emotional Register

Native audio models understand vocal affect. A calm directive gets a calm response. An urgent request gets expedited processing. The system reads intent from *how* you speak, not just *what* you say.

## The AGENTICUM G5 Audio Architecture

Browser AudioContext captures at 16kHz with echo cancellation, noise suppression, and auto-gain control. PCM16 chunks (512 samples = 32ms) are base64-encoded and streamed via WebSocket. Gemini Live responds with 24kHz native audio, scheduled sequentially on a dedicated AudioContext to prevent chunk overlap. Barge-in is handled by stopping all active AudioBufferSourceNodes instantly.

Echo cancellation, noise suppression, and auto-gain control are applied at capture. The playback context runs at 24kHz to match Gemini's native output rate, eliminating resampling artefacts.

This is not voice-enabled AI. This is voice-*native* AI.`,
    authorAgent: 'CC-06 Content Director',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
  },
];

let _seeded = false;

async function seedBlogIfEmpty(): Promise<void> {
  if (_seeded) return;
  try {
    const pillarsSnap = await db.collection(Collections.PILLARS).limit(1).get();
    const clustersSnap = await db.collection(Collections.CLUSTERS).limit(1).get();
    if (!pillarsSnap.empty && !clustersSnap.empty) { _seeded = true; return; }

    const batch = db.batch();
    SEED_PILLARS.forEach((p, i) => {
      const ref = db.collection(Collections.PILLARS).doc(`pl-seed-${i + 1}`);
      batch.set(ref, p, { merge: true });
    });
    SEED_CLUSTERS.forEach((c, i) => {
      const ref = db.collection(Collections.CLUSTERS).doc(`cl-seed-${i + 1}`);
      batch.set(ref, c, { merge: true });
    });
    await batch.commit();
    _seeded = true;
    console.log('[Blog] Seed articles written to Firestore.');
  } catch (err) {
    console.warn('[Blog] Seed skipped (Firestore unavailable):', (err as Error).message);
  }
}

// GET /api/blog/feed - Retrieve all published articles
router.get('/feed', async (_req: Request, res: Response) => {
  try {
    await seedBlogIfEmpty();

    const pillarsSnapshot = await db.collection(Collections.PILLARS).get();
    const clustersSnapshot = await db.collection(Collections.CLUSTERS).get();

    const pillars: Pillar[] = pillarsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Pillar))
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const clusters: Cluster[] = clustersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Cluster))
      .filter(c => c.status === 'published')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    // Fallback: if Firestore is completely unavailable, return seeds directly
    if (pillars.length === 0 && clusters.length === 0) {
      return res.json({
        pillars: SEED_PILLARS.map((p, i) => ({ id: `pl-seed-${i + 1}`, ...p })),
        clusters: SEED_CLUSTERS.map((c, i) => ({ id: `cl-seed-${i + 1}`, ...c })),
      });
    }

    const response: BlogFeedResponse = { pillars, clusters };
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog feed:', error);
    // Last-resort fallback: return seed data even if Firestore throws
    res.json({
      pillars: SEED_PILLARS.map((p, i) => ({ id: `pl-seed-${i + 1}`, ...p })),
      clusters: SEED_CLUSTERS.map((c, i) => ({ id: `cl-seed-${i + 1}`, ...c })),
    });
  }
});

// GET /api/blog/article/:slug - Retrieve a specific article by slug
router.get('/article/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Check pillars first
    let snapshot = await db.collection(Collections.PILLARS).where('slug', '==', slug).limit(1).get();
    
    // If not found, check clusters
    if (snapshot.empty) {
      snapshot = await db.collection(Collections.CLUSTERS).where('slug', '==', slug).limit(1).get();
    }

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, type: doc.ref.parent.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to retrieve article.' });
  }
});

// POST /api/blog/agent-dispatch - Trigger CC-06 to generate a new post
router.post('/agent-dispatch', async (req: Request, res: Response) => {
  try {
    const { topic, type, pillarId } = req.body;
    
    if (!topic || !type) {
      return res.status(400).json({ error: 'Missing required fields: topic, type' });
    }

    // Acknowledge request immediately
    res.json({ 
      status: 'success', 
      message: `Agent CC-06 has been dispatched to forge a ${type} on: "${topic}"` 
    });

    // Fire & Forget background generation
    if (type === 'image' || type === 'video') {
       const da03 = new DA03Architect();
       da03.execute(topic)
         .then(result => {
           console.log(`[Neural Fabric] DA-03 Asset Generation complete.`);
           eventFabric.broadcast({ 
             type: 'swarm-status', 
             data: { id: 'DA-03', state: 'idle', lastStatus: result } 
           });
         })
         .catch(err => console.error('[Neural Fabric] DA-03 failed:', err));
    } else {
       const orchestrator = PillarGraphOrchestrator.getInstance();
       orchestrator.executePillarRun(topic, { type })
         .then(async (result) => {
           console.log(`[Neural Fabric] Pillar Graph Run complete: ${result.runId}`);
           // Automatically create an approval docket for the new article
           await approvalWorkflow.createDocket('default-client', result.runId, 'article');
         })
         .catch(err => console.error('[Neural Fabric] Pillar Graph Execution failed:', err));
    }

  } catch (error) {
    console.error('Error dispatching agent:', error);
    res.status(500).json({ error: 'Failed to dispatch agent.' });
  }
});

// PUT /api/blog/article/:slug - Update an article's content
router.put('/article/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, content, status } = req.body;

    if (!content && !title && !status) {
      return res.status(400).json({ error: 'No update fields provided (title, content, status).' });
    }

    let snapshot = await db.collection(Collections.PILLARS).where('slug', '==', slug).limit(1).get();
    let collection = Collections.PILLARS;

    if (snapshot.empty) {
      snapshot = await db.collection(Collections.CLUSTERS).where('slug', '==', slug).limit(1).get();
      collection = Collections.CLUSTERS;
    }

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const doc = snapshot.docs[0];
    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (status) updateData.status = status;

    await db.collection(collection).doc(doc.id).update(updateData);
    res.json({ status: 'success', message: `Article "${slug}" updated successfully.` });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article.' });
  }
});

// --- NEW DISTRIBUTION & SCHEDULING ROUTES ---

// POST /api/blog/publish/:channel/:id - Publish an existing article to a channel
router.post('/publish/:channel/:id', async (req: Request, res: Response) => {
  try {
    const { channel, id } = req.params;
    const { type } = req.body;

    const collection = type === 'cluster' ? Collections.CLUSTERS : Collections.PILLARS;
    const doc = await db.collection(collection).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const data = doc.data()!;
    let result;

    if (channel === 'wordpress') {
      result = await distributionService.publishToWordPress({ title: data.title, body: data.content });
    } else if (channel === 'linkedin') {
      result = await distributionService.publishToLinkedIn(data.content.substring(0, 500));
    } else {
      return res.status(400).json({ error: 'Invalid channel.' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error publishing article:', error);
    res.status(500).json({ error: 'Failed to publish article.' });
  }
});

// POST /api/blog/schedule/:channel/:id - Schedule an article for future publication
router.post('/schedule/:channel/:id', async (req: Request, res: Response) => {
  try {
    const { channel, id } = req.params;
    const { type, scheduledAt } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({ error: 'Missing scheduledAt timestamp.' });
    }

    const date = new Date(scheduledAt);
    const collection = type === 'cluster' ? Collections.CLUSTERS : Collections.PILLARS;
    const doc = await db.collection(collection).doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    autopilotService.scheduleOneOffTask(`Publish ${id} to ${channel}`, date, async () => {
      const data = doc.data()!;
      if (channel === 'wordpress') {
        await distributionService.publishToWordPress({ title: data.title, body: data.content });
      } else if (channel === 'linkedin') {
        await distributionService.publishToLinkedIn(data.content.substring(0, 500));
      }
    });

    res.json({ status: 'success', message: `Article scheduled for ${date.toISOString()}` });
  } catch (error) {
    console.error('Error scheduling article:', error);
    res.status(500).json({ error: 'Failed to schedule article.' });
  }
});

// --- CINEMATIC FORGE ROUTES ---

router.get('/cinematic/:clientId', async (req: Request, res: Response) => {
  try {
    const assets = await cinematicService.getCinematicAssets(req.params.clientId);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cinematic assets.' });
  }
});

router.post('/cinematic/forge', async (req: Request, res: Response) => {
  try {
    const { topic, clientId } = req.body;
    const cinematic = await cinematicService.forgeStoryboard(topic, clientId || 'default-client');
    res.json(cinematic);
  } catch (error) {
    res.status(500).json({ error: 'Cinematic Forge failed.' });
  }
});

router.post('/cinematic/generate-visual', async (req: Request, res: Response) => {
  try {
    const { assetId, shotNumber } = req.body;
    const imageUrl = await cinematicService.generateShotVisual(assetId, shotNumber);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Visual generation failed.' });
  }
});

router.post('/cinematic/synthesize-video', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.body;
    const result = await cinematicService.synthesizeVideo(assetId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Video synthesis failed.' });
  }
});

// --- SCRIPT WIZARD ROUTES ---

router.post('/script-wizard/generate', async (req: Request, res: Response) => {
  try {
    const { step, context } = req.body;
    const { idea, tone, concept, outline, script, evolve } = context || {};
    const vertexAI = require('../services/vertex-ai').VertexAIService.getInstance();
    
    let prompt = '';
    const style = tone || 'epic';

    if (evolve) {
      prompt = `
        IDENTITY: You are a Master Screenwriter and Creative Director.
        TASK: Evolve the following script into a more "Maximum Excellence" version.
        
        TONE: ${style}
        ORIGINAL_SCRIPT: "${script}"
        CONTEXT: Idea was "${idea}", Concept was "${concept}".
        
        REQUIREMENTS:
        1. Increase emotional depth and brand resonance.
        2. Refine dialogue for professional polish.
        3. Add detailed technical camera direction.
        4. Maintain the core narrative arc.
      `;
    } else {
      switch (step) {
        case 1: // Idea -> Concept
          prompt = `IDENTITY: You are the GenIUS Creative Director. TASK: Transform this seed idea into a high-level cinematic concept. TONE: ${style}. IDEA: "${idea}"`;
          break;
        case 2: // Concept -> Outline
          prompt = `IDENTITY: You are a Master Screenwriter. TASK: Create a detailed 5-point narrative outline based on this concept: "${concept}". Seed idea was: "${idea}". TONE: ${style}`;
          break;
        case 3: // Outline -> Script
          prompt = `IDENTITY: You are a Director of Photography and Scriptwriter. TASK: Write a full cinematic script with visual descriptions and dialogue based on this outline: "${outline}". TONE: ${style}`;
          break;
        default:
          return res.status(400).json({ error: 'Invalid synthesis step' });
      }
    }

    const output = await vertexAI.generateContent(prompt);
    res.json({ output });
  } catch (error) {
      console.error('Script Wizard generation failed', error);
      res.status(500).json({ error: 'Narrative synthesis failed.' });
  }
});

export default router;
