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

// GET /api/blog/feed - Retrieve all published articles
router.get('/feed', async (_req: Request, res: Response) => {
  try {
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

    const response: BlogFeedResponse = { pillars, clusters };
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog feed:', error);
    res.status(500).json({ error: 'Failed to retrieve blog feed.' });
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

export default router;
