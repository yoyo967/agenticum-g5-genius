import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics';

const router = Router();

router.get('/throughput', async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getThroughputData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch throughput data' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getSwarmStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swarm stats' });
  }
});

export default router;
