import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';
import { BlogFeedResponse, Pillar, Cluster } from '../types/blog';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { StorageService } from '../services/storage';
import { PillarGraphOrchestrator } from '../services/orchestrator';

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
       setTimeout(async () => {
         try {
           const result = await da03.execute(topic);
           // Look for the base64 output
           const b64Match = result.match(/data:image\/[^;]+;base64,([a-zA-Z0-9+/=]+)/);
           if (b64Match) {
              const buffer = Buffer.from(b64Match[1], 'base64');
              const filename = `DA03-Generated-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
              
              // We need to write this to a temp file or upload buffer directly
              // Luckily StorageService relies on Multer, so for direct buffer save:
              const path = require('path');
              const fs = require('fs');
              const filepath = path.join(process.cwd(), 'data', 'vault', filename);
              fs.writeFileSync(filepath, buffer);
              
              // Add to Firestore to index it broadly
              await db.collection(Collections.CLUSTERS).add({
                title: topic.substring(0, 40) + '...',
                slug: filename,
                tag: type.toUpperCase(),
                agent: 'DA-03',
                status: 'published',
                timestamp: new Date().toISOString()
              });
              
              // Send WS payload to update UI
              ((global as any).wss)?.clients?.forEach((client: any) => {
                if (client.readyState === 1) {
                   client.send(JSON.stringify({
                     type: 'payload',
                     from: 'DA-03',
                     to: 'UI',
                     payloadType: 'Asset Generation Complete'
                   }));
                }
              });
              
              console.log(`[Neural Fabric] DA-03 successfully generated and saved asset: ${filename}`);
           }
         } catch(err) {
           console.error('[Neural Fabric] DA-03 Image Generation failed:', err);
         }
       }, 500);
    } else {
       const orchestrator = PillarGraphOrchestrator.getInstance();
       // Autonomous, grounded, audit-trailed execution
       orchestrator.executePillarRun(topic, { type })
         .then(result => console.log(`[Neural Fabric] Pillar Graph Run complete: ${result.runId}`))
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

    // Find the article in pillars first, then clusters
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

export default router;
