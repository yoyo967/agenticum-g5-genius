import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';
import { BlogFeedResponse, Pillar, Cluster } from '../types/blog';
import { CC06Director } from '../agents/cc06-director';

const router = Router();

// GET /api/blog/feed - Retrieve all published articles
router.get('/feed', async (_req: Request, res: Response) => {
  try {
    const pillarsSnapshot = await db.collection(Collections.PILLARS)
      .where('status', '==', 'published')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
      
    const clustersSnapshot = await db.collection(Collections.CLUSTERS)
      .where('status', '==', 'published')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    const pillars: Pillar[] = [];
    pillarsSnapshot.forEach(doc => pillars.push({ id: doc.id, ...doc.data() } as Pillar));

    const clusters: Cluster[] = [];
    clustersSnapshot.forEach(doc => clusters.push({ id: doc.id, ...doc.data() } as Cluster));

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
    const cc06 = new CC06Director();
    // Simulate some PM-07 scheduling buffer
    setTimeout(() => {
      cc06.forgeArticle(topic, type as 'pillar' | 'cluster', pillarId)
        .then(slug => console.log(`[Neural Fabric] CC-06 finalized ${type} payload: ${slug}`))
        .catch(err => console.error('[Neural Fabric] CC-06 failed forging article:', err));
    }, 1000);

  } catch (error) {
    console.error('Error dispatching agent:', error);
    res.status(500).json({ error: 'Failed to dispatch agent.' });
  }
});

export default router;
